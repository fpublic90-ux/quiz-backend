const crypto = require('crypto');

// In-memory room store
// rooms: { [roomCode]: { code, players: [], status, questions: [], currentQuestionIndex, scores: {} } }
const rooms = {};

/**
 * Generate a unique 6-char uppercase room code
 */
function generateCode() {
    let code;
    do {
        code = crypto.randomBytes(3).toString('hex').toUpperCase();
    } while (rooms[code]);
    return code;
}

/**
 * Create a new room with the host player
 */
function createRoom(playerName, socketId, uid) {
    const code = generateCode();
    rooms[code] = {
        code,
        players: [{ id: socketId, uid, name: playerName, score: 0 }],
        status: 'waiting', // waiting | playing | finished
        questions: [],
        currentQuestionIndex: -1,
        answeredPlayers: new Set(),
    };
    return rooms[code];
}

/**
 * Join an existing room
 * Returns { success, room, error }
 */
function joinRoom(code, playerName, socketId, uid) {
    const room = rooms[code];
    if (!room) return { success: false, error: 'Room not found' };
    if (room.status !== 'waiting') return { success: false, error: 'Game already in progress' };

    // Handle reconnection by UID
    if (uid) {
        const existingPlayer = room.players.find((p) => p.uid === uid);
        if (existingPlayer) {
            console.log(`🔄 Player ${playerName} reconnected to room ${code} (UID: ${uid})`);
            existingPlayer.id = socketId;
            existingPlayer.name = playerName; // Update name in case it changed
            return { success: true, room };
        }
    }

    // Prevent duplicate socket
    if (room.players.find((p) => p.id === socketId)) {
        return { success: true, room };
    }

    if (room.players.length >= 6) return { success: false, error: 'Room is full (max 6 players)' };

    room.players.push({ id: socketId, uid, name: playerName, score: 0 });
    return { success: true, room };
}

/**
 * Remove a player by socket id
 * Returns { room, removed } or null if room was deleted
 */
function removePlayer(socketId) {
    for (const code in rooms) {
        const room = rooms[code];
        const idx = room.players.findIndex((p) => p.id === socketId);
        if (idx !== -1) {
            const [removed] = room.players.splice(idx, 1);
            room.answeredPlayers.delete(socketId);

            // Clean up empty rooms
            if (room.players.length === 0) {
                delete rooms[code];
                return { room: null, removed, code };
            }

            return { room, removed, code };
        }
    }
    return null;
}

/**
 * Add score to a player
 */
function addScore(code, socketId, points) {
    const room = rooms[code];
    if (!room) return null;
    const player = room.players.find((p) => p.id === socketId);
    if (player) player.score += points;
    return room;
}

/**
 * Mark a player as having answered the current question
 */
function markAnswered(code, socketId) {
    const room = rooms[code];
    if (!room) return false;
    room.answeredPlayers.add(socketId);
    return room.answeredPlayers.size >= room.players.length;
}

/**
 * Reset answered players for next question
 */
function resetAnswered(code) {
    const room = rooms[code];
    if (room) room.answeredPlayers = new Set();
}

/**
 * Get sorted leaderboard
 */
function getLeaderboard(code) {
    const room = rooms[code];
    if (!room) return [];
    return [...room.players].sort((a, b) => b.score - a.score);
}

/**
 * Get room by code
 */
function getRoom(code) {
    return rooms[code] || null;
}

/**
 * Set questions on a room
 */
function setQuestions(code, questions) {
    const room = rooms[code];
    if (room) room.questions = questions;
}

/**
 * Advance to the next question index
 */
function nextQuestion(code) {
    const room = rooms[code];
    if (!room) return -1;
    room.currentQuestionIndex += 1;
    return room.currentQuestionIndex;
}

/**
 * Set room status
 */
function setStatus(code, status) {
    const room = rooms[code];
    if (room) room.status = status;
}

module.exports = {
    createRoom,
    joinRoom,
    removePlayer,
    addScore,
    markAnswered,
    resetAnswered,
    getLeaderboard,
    getRoom,
    setQuestions,
    nextQuestion,
    setStatus,
};
