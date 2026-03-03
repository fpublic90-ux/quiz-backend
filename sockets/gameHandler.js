const RoomManager = require('../managers/RoomManager');
const TimerManager = require('../managers/TimerManager');
const Question = require('../models/Question');
const User = require('../models/User');

const QUESTIONS_PER_GAME = 10;
const POINTS_PER_CORRECT = 10;

/**
 * Fetch N random questions from MongoDB (with correctIndex for server-side grading)
 */
async function fetchQuestions(count = QUESTIONS_PER_GAME) {
    return Question.aggregate([{ $sample: { size: count } }]);
}

/**
 * Build the safe question payload to send to clients (no correct answer)
 */
function safeQuestion(q, index, total) {
    return {
        id: q._id.toString(),
        question: q.question,
        options: q.options,
        category: q.category,
        questionNumber: index + 1,
        totalQuestions: total,
    };
}

/**
 * Broadcast current scores to all room members
 */
function broadcastScores(io, code) {
    const room = RoomManager.getRoom(code);
    if (!room) return;
    io.to(code).emit('update_score', {
        players: room.players.map((p) => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive })),
    });
}

/**
 * Advance to the next question or end the game
 */
async function advanceQuestion(io, code) {
    const room = RoomManager.getRoom(code);
    if (!room || room.status !== 'playing') return;

    RoomManager.resetAnswered(code);
    const idx = RoomManager.nextQuestion(code);

    if (idx >= room.questions.length) {
        // Game over
        endGame(io, code);
        return;
    }

    const q = room.questions[idx];
    const payload = safeQuestion(q, idx, room.questions.length);

    io.to(code).emit('new_question', payload);

    // Start server-side timer
    TimerManager.startTimer(
        code,
        (remaining) => {
            io.to(code).emit('timer_tick', { remaining });
        },
        () => {
            // Time expired — move to next question
            io.to(code).emit('time_up', {
                correctIndex: q.correctIndex,
                correctAnswer: q.options[q.correctIndex],
            });
            setTimeout(() => advanceQuestion(io, code), 2000); // 2s buffer
        }
    );
}

/**
 * End the game and send leaderboard
 */
async function endGame(io, code) {
    TimerManager.clearTimer(code);
    RoomManager.setStatus(code, 'finished');
    const leaderboard = RoomManager.getLeaderboard(code);

    // Persist stats for each player
    const winnerId = leaderboard[0]?.id;

    for (const player of leaderboard) {
        if (player.uid) {
            try {
                const isWinner = player.id === winnerId;
                const user = await User.findOne({ uid: player.uid });
                if (user) {
                    user.gamesPlayed += 1;
                    user.totalScore += player.score;
                    if (isWinner) user.wins += 1;

                    // Simple leveling: 1 level per 100 total score points
                    user.level = Math.floor(user.totalScore / 100) + 1;

                    await user.save();
                    console.log(`📈 Persisted stats for ${player.name} (UID: ${player.uid})`);
                }
            } catch (err) {
                console.error(`❌ Failed to persist stats for ${player.name}:`, err);
            }
        }
    }

    io.to(code).emit('game_over', {
        leaderboard: leaderboard.map(p => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive })),
        winner: leaderboard[0] ? { id: leaderboard[0].id, uid: leaderboard[0].uid, name: leaderboard[0].name, score: leaderboard[0].score, isActive: leaderboard[0].isActive } : null,
    });
}

/**
 * Register all socket event handlers
 */
function registerGameHandlers(io, socket) {
    // ─── create_room ───────────────────────────────────────────────────────────
    socket.on('create_room', ({ playerName, uid }) => {
        if (!playerName || playerName.trim() === '') {
            socket.emit('error', { message: 'Player name is required' });
            return;
        }
        const room = RoomManager.createRoom(playerName.trim(), socket.id, uid);
        socket.join(room.code);

        const playerList = room.players.map((p) => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive }));

        socket.emit('room_created', {
            code: room.code,
            players: playerList,
        });

        // Broadcast to everyone in the room (important if this was a reclamation)
        io.to(room.code).emit('player_joined', { players: playerList });

        console.log(`🏠 Room created/reclaimed: ${room.code} by ${playerName}. Total players: ${playerList.length}`);
    });

    // ─── join_room ─────────────────────────────────────────────────────────────
    socket.on('join_room', ({ roomCode, playerName, uid }) => {
        if (!playerName || playerName.trim() === '' || !roomCode) {
            socket.emit('error', { message: 'Player name and room code are required' });
            return;
        }

        const result = RoomManager.joinRoom(roomCode.toUpperCase(), playerName.trim(), socket.id, uid);
        if (!result.success) {
            socket.emit('error', { message: result.error });
            return;
        }

        const room = result.room;
        socket.join(room.code);

        const playerList = room.players.map((p) => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive }));
        console.log(`📡 Room ${room.code} now has ${playerList.length} players:`, playerList.map(p => p.name).join(', '));

        socket.emit('room_joined', { code: room.code, players: playerList });
        io.to(room.code).emit('player_joined', { players: playerList });

        console.log(`👤 ${playerName} joined room ${room.code} (${room.players.length}/6)`);

        // Removed auto-start; favoring manual start by host
    });

    // ─── start_game ────────────────────────────────────────────────────────────
    socket.on('start_game', ({ roomCode }) => {
        const code = roomCode.toUpperCase();
        console.log(`🚀 Received start_game for room: ${code}`);
        socket.emit('info', { message: `Server received start_game for ${code}` });

        const room = RoomManager.getRoom(code);
        if (!room) {
            console.log(`❌ Room not found: ${code}`);
            socket.emit('error', { message: 'Room not found' });
            return;
        }

        socket.emit('info', { message: `Room found. Players: ${room.players.length}. Host ID matches: ${room.players[0].id === socket.id}` });

        // Only host can start
        if (room.players[0].id !== socket.id) {
            console.log(`⚠️ Non-host tried to start game. Host: ${room.players[0].id}, Socket: ${socket.id}`);
            socket.emit('error', { message: `Only the host can start the game. You: ${socket.id}, Host: ${room.players[0].id}` });
            return;
        }

        if (room.players.length < 2) {
            console.log(`⚠️ Not enough players: ${room.players.length}`);
            socket.emit('error', { message: 'Need at least 2 players to start' });
            return;
        }

        console.log('✅ Starting game sequence...');
        socket.emit('info', { message: 'Starting game sequence...' });
        startGame(io, code, socket);
    });

    // ─── submit_answer ─────────────────────────────────────────────────────────
    socket.on('submit_answer', ({ roomCode, questionId, answerIndex }) => {
        const room = RoomManager.getRoom(roomCode);
        if (!room || room.status !== 'playing') return;

        const idx = room.currentQuestionIndex;
        const currentQ = room.questions[idx];
        if (!currentQ) return;

        // Prevent double-answering
        if (room.answeredPlayers.has(socket.id)) return;

        const isCorrect = answerIndex === currentQ.correctIndex;
        if (isCorrect) {
            RoomManager.addScore(roomCode, socket.id, POINTS_PER_CORRECT);
        }

        socket.emit('answer_result', {
            isCorrect,
            correctIndex: currentQ.correctIndex,
            correctAnswer: currentQ.options[currentQ.correctIndex],
        });

        broadcastScores(io, roomCode);

        const allAnswered = RoomManager.markAnswered(roomCode, socket.id);

        // If all players answered, advance early
        if (allAnswered) {
            TimerManager.clearTimer(roomCode);
            io.to(roomCode).emit('time_up', {
                correctIndex: currentQ.correctIndex,
                correctAnswer: currentQ.options[currentQ.correctIndex],
            });
            setTimeout(() => advanceQuestion(io, roomCode), 2000);
        }
    });

    // ─── disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
        const result = RoomManager.removePlayer(socket.id);
        if (!result) return;

        const { room, removed, code } = result;
        console.log(`👋 ${removed?.name} left room ${code}`);

        if (!room) {
            // Room deleted (was empty)
            TimerManager.clearTimer(code);
            return;
        }

        const playerList = room.players.map((p) => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive }));
        io.to(code).emit('player_left', {
            playerName: removed?.name,
            players: playerList,
        });

        // End game if < 2 players remain during active game
        if (room.status === 'playing' && room.players.length < 2) {
            TimerManager.clearTimer(code);
            endGame(io, code);
        }
    });
}

/**
 * Start the game: fetch questions, set status, begin first question
 */
async function startGame(io, code, socket) {
    const room = RoomManager.getRoom(code);
    if (!room) return;

    try {
        if (socket) socket.emit('info', { message: 'Fetching questions...' });
        const questions = await fetchQuestions(QUESTIONS_PER_GAME);
        if (questions.length < QUESTIONS_PER_GAME) {
            console.log(`⚠️ Not enough questions in DB: ${questions.length}`);
            io.to(code).emit('error', { message: 'Not enough questions in database (minimum 10 required). Please seed the DB.' });
            return;
        }

        if (socket) socket.emit('info', { message: `Found ${questions.length} questions. Setting room state...` });

        RoomManager.setQuestions(code, questions);
        RoomManager.setStatus(code, 'playing');

        io.to(code).emit('start_game', {
            totalQuestions: QUESTIONS_PER_GAME,
            players: room.players.map((p) => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive })),
        });

        console.log(`🎮 Game started in room ${code}`);
        if (socket) socket.emit('info', { message: 'Game started! Emitted event to ALL.' });

        // Small delay then first question
        setTimeout(() => advanceQuestion(io, code), 1500);
    } catch (err) {
        console.error('Error starting game:', err);
        io.to(code).emit('error', { message: 'Failed to start game' });
    }
}

module.exports = { registerGameHandlers };
