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
    } while (rooms[code] && rooms[code].players.length > 0);

    // If we're reusing a code that's pending deletion, clear its timeout
    if (rooms[code] && rooms[code].deletionTimeout) {
        clearTimeout(rooms[code].deletionTimeout);
    }

    return code;
}

/**
 * Create a new room with the host player
 */
function createRoom(playerName, socketId, uid) {
    // If UID is provided, check if player is already in a room to reclaim it
    const normalizedUid = uid ? uid.toString().trim() : null;
    if (normalizedUid && normalizedUid !== '') {
        for (const code in rooms) {
            const existingRoom = rooms[code];
            const player = existingRoom.players.find(p => p.uid === normalizedUid);
            if (player) {
                console.log(`🔄 Host reclaimed existing room ${code} (UID: ${uid})`);

                // Clear player's specific cleanup timeout if it exists
                if (player.cleanupTimeout) {
                    clearTimeout(player.cleanupTimeout);
                    player.cleanupTimeout = null;
                }

                player.id = socketId;
                player.name = playerName;
                player.isActive = true;
                return existingRoom;
            }
        }
    }

    const code = generateCode();
    rooms[code] = {
        code,
        players: [{ id: socketId, uid, name: playerName, score: 0, isActive: true }],
        status: 'waiting',
        questions: [],
        currentQuestionIndex: -1,
        answeredPlayers: new Set(),
    };
    return rooms[code];
}

function joinRoom(code, playerName, socketId, uid) {
    const room = rooms[code];
    if (!room) return { success: false, error: 'Room not found' };

    if (room.status !== 'waiting' && !room.players.find(p => p.uid === uid)) {
        return { success: false, error: 'Game already in progress' };
    }

    // Handle reconnection by UID (Guest Reclaim)
    const normalizedUid = uid ? uid.toString().trim() : null;
    if (normalizedUid && normalizedUid !== '') {
        const existingPlayer = room.players.find((p) => p.uid === normalizedUid);
        if (existingPlayer) {
            console.log(`🔄 Player ${playerName} reconnected to room ${code} (UID: ${uid})`);

            if (existingPlayer.cleanupTimeout) {
                clearTimeout(existingPlayer.cleanupTimeout);
                existingPlayer.cleanupTimeout = null;
            }

            existingPlayer.id = socketId;
            existingPlayer.name = playerName;
            existingPlayer.isActive = true;
            return { success: true, room };
        }
    }

    // Prevent duplicate socket
    if (room.players.find((p) => p.id === socketId)) {
        return { success: true, room };
    }

    if (room.players.length >= 6) return { success: false, error: 'Room is full' };

    room.players.push({ id: socketId, uid, name: playerName, score: 0, isActive: true });
    return { success: true, room };
}

/**
 * Remove a player by socket id
 * Returns { room, removed } or null if room was deleted
 */
function removePlayer(socketId) {
    for (const code in rooms) {
        const room = rooms[code];
        const player = room.players.find((p) => p.id === socketId);
        if (player) {
            player.isActive = false;
            player.id = null;

            console.log(`⏱️ Player ${player.name} in room ${code} disconnected. Grace period (30s) started.`);

            player.cleanupTimeout = setTimeout(() => {
                if (!player.isActive) {
                    const idx = room.players.indexOf(player);
                    if (idx !== -1) {
                        room.players.splice(idx, 1);
                        console.log(`🗑️ Player ${player.name} permanently removed from room ${code}`);

                        if (room.players.length === 0) {
                            delete rooms[code];
                            console.log(`🗑️ Room ${code} deleted (empty).`);
                        }
                    }
                }
            }, 30000);

            return { room, removed: player, code };
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
