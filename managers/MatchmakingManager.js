const RoomManager = require('./RoomManager');

class MatchmakingManager {
    constructor() {
        this.queue = []; // Array of { socket, playerName, uid }
        this.matchmakingTimeout = 10000; // 10 seconds wait before bot fallback
        this.io = null;
        this.startGame = null;
    }

    init(io, startGame) {
        this.io = io;
        this.startGame = startGame;
    }

    addToQueue(io, socket, playerName, uid) {
        // Prevent duplicate entries
        if (this.queue.find(p => p.uid === uid)) return;

        console.log(`🔍 Matchmaking: ${playerName} joined queue.`);
        const entry = { socket, playerName, uid, isMatching: false };
        this.queue.push(entry);

        this.tryMatch(io);

        // Set fallback timeout
        setTimeout(() => {
            this.handleFallback(io, uid);
        }, this.matchmakingTimeout);
    }

    tryMatch(io) {
        if (this.queue.length >= 2) {
            // Find two players who aren't already being matched
            const playersToMatch = [];
            for (let i = 0; i < this.queue.length && playersToMatch.length < 2; i++) {
                if (!this.queue[i].isMatching) {
                    playersToMatch.push(this.queue[i]);
                }
            }

            if (playersToMatch.length < 2) return;

            // Mark them as matching
            playersToMatch.forEach(p => p.isMatching = true);

            // Remove from queue
            const p1 = playersToMatch[0];
            const p2 = playersToMatch[1];
            this.queue = this.queue.filter(q => q !== p1 && q !== p2);

            console.log(`🤝 Match Found: ${p1.playerName} vs ${p2.playerName}`);

            // Create a real room for them
            const room = RoomManager.createRoom(p1.playerName, p1.socket.id, p1.uid);

            // Add p2
            RoomManager.joinRoom(room.code, p2.playerName, p2.socket.id, p2.uid);

            // Join sockets to room
            p1.socket.join(room.code);
            p2.socket.join(room.code);

            // Notify both
            const players = room.players.map(p => ({
                id: p.id,
                uid: p.uid,
                name: p.name,
                score: p.score,
                isActive: p.isActive
            }));

            io.to(room.code).emit('room_joined', { code: room.code, players });

            // Automatically start the game for the matched players
            setTimeout(() => {
                if (this.startGame) {
                    this.startGame(io, room.code, p1.socket, 1, 'All');
                }
            }, 1500);
        }
    }

    handleFallback(io, uid) {
        const index = this.queue.findIndex(p => p.uid === uid);
        if (index === -1) return; // Already matched or entry removed

        const p = this.queue[index];
        if (p.isMatching) return; // Currently being handled by tryMatch

        // Remove from queue
        this.queue.splice(index, 1);

        console.log(`🤖 Matchmaking Fallback: No real opponent for ${p.playerName}. Spawning bots...`);

        // Create a room
        const room = RoomManager.createRoom(p.playerName, p.socket.id, p.uid);
        p.socket.join(room.code);

        // Add 1-2 bots
        const botNames = ['Adil', 'Farhan', 'Shihab', 'Jaseela', 'Nimna', 'Lubna', 'Shalba', 'Keerthana', 'Marwa', 'Suhra', 'Thanha'];
        const numBots = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < numBots; i++) {
            const name = botNames[Math.floor(Math.random() * botNames.length)];
            // Bots have 'bot_' id prefix
            RoomManager.joinRoom(room.code, name, `bot_${Math.random().toString(36).substr(2, 9)}`, `bot_${name}`);
        }

        const players = room.players.map(p => ({
            id: p.id,
            uid: p.uid,
            name: p.name,
            score: p.score,
            isActive: p.isActive
        }));

        p.socket.emit('room_joined', { code: room.code, players });

        // Automatically start the game with bots
        setTimeout(() => {
            if (this.startGame) {
                this.startGame(io, room.code, p.socket, 1, 'All');
            }
        }, 1500);
    }

    removeFromQueue(uid) {
        this.queue = this.queue.filter(p => p.uid !== uid);
    }
}

module.exports = new MatchmakingManager();
