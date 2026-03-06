const RoomManager = require('../managers/RoomManager');
const TimerManager = require('../managers/TimerManager');
const Question = require('../models/Question');
const User = require('../models/User');
const MatchmakingManager = require('../managers/MatchmakingManager');
const AchievementManager = require('../managers/AchievementManager');

const QUESTIONS_PER_GAME = 10;
const POINTS_PER_CORRECT = 10;

/**
 * Fetch N random questions from MongoDB (with correctIndex for server-side grading)
 */
async function fetchQuestions(level, category = 'All', count = QUESTIONS_PER_GAME, uid = null) {
    const query = { level: parseInt(level) };
    if (category && category !== 'All') {
        query.category = category;
    }

    let excludeIds = [];
    if (uid) {
        const user = await User.findOne({ uid });
        if (user && user.answeredQuestions) {
            excludeIds = user.answeredQuestions;
        }
    }

    // 1. Try to fetch only unseen questions
    const unseenPipeline = [
        { $match: { ...query, _id: { $nin: excludeIds } } },
        { $sample: { size: count } }
    ];
    let questions = await Question.aggregate(unseenPipeline);

    // 2. If not enough unseen, fill the rest with random seen questions
    if (questions.length < count) {
        const needed = count - questions.length;
        const seenPipeline = [
            { $match: { ...query, _id: { $in: excludeIds } } },
            { $sample: { size: needed } }
        ];
        const seenQuestions = await Question.aggregate(seenPipeline);
        questions = [...questions, ...seenQuestions];
    }

    // 3. Last resort: if pool is STILL too small (e.g. total < count), 
    // fetch everything matching query just in case (fallback)
    if (questions.length < count) {
        const remainingNeeded = count - questions.length;
        const currentIds = questions.map(q => q._id);
        const fallbackPipeline = [
            { $match: { ...query, _id: { $nin: currentIds } } },
            { $sample: { size: remainingNeeded } }
        ];
        const fallbackQuestions = await Question.aggregate(fallbackPipeline);
        questions = [...questions, ...fallbackQuestions];
    }

    // Final shuffle to mix unseen and backfilled questions
    return questions.sort(() => Math.random() - 0.5);
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
        imageUrl: q.imageUrl || null,
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
    try {
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

        // ── Bot Simulation ──────────────────
        if (room.players.some(p => p.id.startsWith('bot_'))) {
            room.players.forEach(p => {
                if (p.id.startsWith('bot_')) {
                    // Bots answer between 3 and 12 seconds
                    const delay = Math.floor(Math.random() * 9000) + 3000;
                    setTimeout(() => {
                        const currentRoom = RoomManager.getRoom(code);
                        if (!currentRoom || currentRoom.status !== 'playing' || currentRoom.currentQuestionIndex !== idx) return;

                        // Difficulty: 70% correct
                        const isCorrect = Math.random() < 0.7;
                        if (isCorrect) {
                            RoomManager.addScore(code, p.id, POINTS_PER_CORRECT);
                            broadcastScores(io, code);
                        }
                        const allAnswered = RoomManager.markAnswered(code, p.id);
                        if (allAnswered) {
                            TimerManager.clearTimer(code);
                            io.to(code).emit('time_up', {
                                correctIndex: q.correctIndex,
                                correctAnswer: q.options[q.correctIndex],
                            });
                            setTimeout(() => advanceQuestion(io, code), 2000);
                        }
                    }, delay);
                }
            });
        }

        // Start server-side timer
        TimerManager.startTimer(
            code,
            (remaining, expiresAt) => {
                io.to(code).emit('timer_tick', { remaining, expiresAt });
            },
            () => {
                // Time expired
                io.to(code).emit('time_up', {
                    correctIndex: q.correctIndex,
                    correctAnswer: q.options[q.correctIndex],
                });
                setTimeout(() => advanceQuestion(io, code), 2000);
            }
        );
    } catch (error) {
        console.error(`❌ Error in advanceQuestion for room ${code}:`, error);
        endGame(io, code); // Safely end game on serious logic failure
    }
}

/**
 * End the game and send leaderboard
 */
async function endGame(io, code) {
    try {
        TimerManager.clearTimer(code);
        const room = RoomManager.getRoom(code);
        if (!room) return;

        RoomManager.setStatus(code, 'finished');
        const leaderboard = RoomManager.getLeaderboard(code);

        // Persist stats for each player
        for (let i = 0; i < leaderboard.length; i++) {
            const player = leaderboard[i];
            if (player.uid) {
                try {
                    const rank = i + 1;
                    const user = await User.findOne({ uid: player.uid });
                    if (user) {
                        user.gamesPlayed += 1;
                        user.totalScore += player.score;
                        if (rank === 1) user.wins += 1;

                        // Award Coins based on rank
                        let coinReward = 10;
                        if (rank === 1) coinReward = 100;
                        else if (rank === 2) coinReward = 50;
                        else if (rank === 3) coinReward = 30;
                        user.coins += coinReward;

                        // Award XP based on score and rank multiplier
                        let xpMultiplier = 1.0;
                        if (rank === 1) xpMultiplier = 1.5;
                        else if (rank === 2) xpMultiplier = 1.2;
                        else if (rank === 3) xpMultiplier = 1.1;
                        const xpGained = Math.round(player.score * xpMultiplier);
                        user.xp += xpGained;

                        // Leveling: 1 level per 200 total XP
                        user.level = Math.floor(user.xp / 200) + 1;

                        // Update Tier
                        if (user.xp >= 15000) user.tier = 'Diamond';
                        else if (user.xp >= 7000) user.tier = 'Platinum';
                        else if (user.xp >= 3000) user.tier = 'Gold';
                        else if (user.xp >= 1000) user.tier = 'Silver';
                        else user.tier = 'Bronze';

                        // Save question history (limit to last 500)
                        if (room && room.questions) {
                            const questionIds = room.questions.map(q => q._id);
                            user.answeredQuestions = [...(user.answeredQuestions || []), ...questionIds];
                            if (user.answeredQuestions.length > 500) {
                                user.answeredQuestions = user.answeredQuestions.slice(-500);
                            }
                        }

                        await user.save();
                        console.log(`📈 Stats: ${player.name} +${xpGained} XP, +${coinReward} Coins. Tier: ${user.tier}`);

                        // ── Achievements Check ──────────────────
                        const newlyUnlocked = AchievementManager.checkAchievements(user, player, room);
                        if (newlyUnlocked.length > 0) {
                            await AchievementManager.persistAchievements(user, newlyUnlocked);
                            console.log(`🏆 Achievements Unlocked for ${player.name}: ${newlyUnlocked.join(', ')}`);

                            // Emit real-time notification to this specific player
                            io.to(player.id).emit('achievement_unlocked', {
                                achievements: newlyUnlocked
                            });
                        }
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
    } catch (err) {
        console.error(`❌ Error in endGame for room ${code}:`, err);
    }
}

/**
 * Register all socket event handlers
 */
function registerGameHandlers(io, socket, userSockets) {
    // ─── create_room ───────────────────────────────────────────────────────────
    socket.on('create_room', ({ playerName, uid }) => {
        try {
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

            socket.to(room.code).emit('log', { message: `${playerName} joined the room` });
        } catch (error) {
            console.error('Error in create_room:', error);
            socket.emit('error', { message: 'Internal server error' });
        }
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
    socket.on('start_game', ({ roomCode, level, category }) => {
        const code = roomCode.toUpperCase();
        console.log(`🚀 Received start_game for room: ${code} (Level: ${level}, Category: ${category})`);
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
        startGame(io, code, socket, level, category);
    });

    // ─── find_match ─────────────────────────────────────────────────────────────
    socket.on('find_match', ({ playerName, uid }) => {
        if (!playerName || !uid) return;
        MatchmakingManager.addToQueue(io, socket, playerName, uid);
    });

    // ─── leave_room ────────────────────────────────────────────────────────────
    socket.on('leave_room', ({ roomCode }) => {
        try {
            const result = RoomManager.explicitLeave(socket.id);
            if (!result) return;

            const { code } = result;
            const room = RoomManager.getRoom(code);

            if (room) {
                const playerList = room.players.map((p) => ({ id: p.id, uid: p.uid, name: p.name, score: p.score, isActive: p.isActive }));
                io.to(code).emit('player_left', {
                    players: playerList,
                });

                if (room.status === 'playing' && room.players.length < 2) {
                    TimerManager.clearTimer(code);
                    endGame(io, code);
                }
            }
            socket.leave(code);
            console.log(`👤 ${socket.id} explicitly left room ${code}`);
        } catch (error) {
            console.error('Error in leave_room:', error);
            socket.emit('error', { message: 'Failed to leave room' });
        }
    });

    // ─── submit_answer ─────────────────────────────────────────────────────────
    socket.on('submit_answer', ({ roomCode, questionId, answerIndex }) => {
        try {
            const room = RoomManager.getRoom(roomCode);
            if (!room || room.status !== 'playing') return;

            const idx = room.currentQuestionIndex;
            const currentQ = room.questions[idx];
            if (!currentQ) return;

            // Anti-cheat: Check for impossibly fast answering (< 400ms)
            const remaining = TimerManager.getTimeRemaining(roomCode);
            if (remaining >= 14.6) { // 15s total, 14.6 means 400ms elapsed
                console.log(`⚠️ Suspicious Speed: ${socket.id} answered in < 400ms.`);
            }

            // Prevent double-answering
            if (room.answeredPlayers.has(socket.id)) return;

            // Anti-cheat: Check for out-of-bounds index
            if (answerIndex < 0 || answerIndex >= currentQ.options.length) {
                console.log(`⚠️ Invalid Answer Index: ${socket.id} sent index ${answerIndex}`);
                socket.emit('error', { message: 'Invalid answer selection' });
                return;
            }

            const isCorrect = answerIndex === currentQ.correctIndex;
            if (isCorrect) {
                RoomManager.addScore(roomCode, socket.id, POINTS_PER_CORRECT);

                // Speed Mastery tracking (Under 3 seconds)
                const remainingTime = TimerManager.getTimeRemaining(roomCode);
                if (remainingTime >= 12) {
                    const player = room.players.find(p => p.id === socket.id);
                    if (player) player.fastAnswers += 1;
                }
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
        } catch (error) {
            console.error('Error in submit_answer:', error);
            socket.emit('error', { message: 'Failed to submit answer' });
        }
    });

    // ─── invite_friend ──────────────────────────────────────────────────────────
    socket.on('invite_friend', ({ targetUid, roomCode, hostName }) => {
        const targetSocketId = userSockets.get(targetUid);
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_invite', {
                hostName,
                roomCode,
                fromUid: socket.uid
            });
            console.log(`✉️ Invite sent from ${hostName} to User ${targetUid} for room ${roomCode}`);
        } else {
            socket.emit('error', { message: 'User is offline' });
        }
    });

    // ─── disconnect ────────────────────────────────────────────────────────────
    socket.on('send_reaction', ({ roomCode, emojiId }) => {
        io.to(roomCode).emit('show_reaction', {
            senderId: socket.id,
            emojiId
        });
    });

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
async function startGame(io, code, socket, level = 1, category = 'All') {
    const room = RoomManager.getRoom(code);
    if (!room) return;

    // Reset scores and answers for new level
    room.players.forEach(p => p.score = 0);
    room.answeredPlayers.clear();
    room.currentQuestionIndex = 0;

    try {
        const hostUid = room.players[0]?.uid;
        if (socket) socket.emit('info', { message: `Fetching questions for Level ${level} (${category})...` });
        const questions = await fetchQuestions(level, category, QUESTIONS_PER_GAME, hostUid);
        if (questions.length < QUESTIONS_PER_GAME) {
            console.log(`⚠️ Not enough questions in DB: ${questions.length}`);
            io.to(code).emit('error', { message: 'Not enough questions in database (minimum 10 required). Please seed the DB.' });
            return;
        }

        if (socket) socket.emit('info', { message: `Found ${questions.length} questions. Setting room state...` });

        room.category = category; // Save category for achievement tracking
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

module.exports = { registerGameHandlers, startGame };
