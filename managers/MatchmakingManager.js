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

    addToQueue(io, socket, playerName, uid, avatar, category = 'All', level = 1, tier = 'Bronze') {
        // Prevent duplicate entries
        if (this.queue.find(p => p.uid === uid)) return;

        console.log(`🔍 Matchmaking: ${playerName} (${category}) joined queue.`);
        const entry = { socket, playerName, uid, avatar, category, level, tier, isMatching: false };
        this.queue.push(entry);

        this.tryMatch(io);

        // Set fallback timeout with a unique reference if needed, though simple setTimeout is fine here
        console.log(`⏱️ Matchmaking: Fallback timer started for ${playerName} (5s)`);
        setTimeout(() => {
            this.handleFallback(io, uid);
        }, this.matchmakingTimeout);
    }

    tryMatch(io) {
        if (this.queue.length >= 2) {
            let p1, p2;

            // Try to find two players with matching categories first
            const availablePlayers = this.queue.filter(p => !p.isMatching);
            if (availablePlayers.length < 2) return;

            // Group by category
            const categories = {};
            availablePlayers.forEach(p => {
                if (!categories[p.category]) categories[p.category] = [];
                categories[p.category].push(p);
            });

            // Find any category with at least 2 players
            for (const cat in categories) {
                if (categories[cat].length >= 2) {
                    p1 = categories[cat][0];
                    p2 = categories[cat][1];
                    break;
                }
            }

            // Fallback: Just take the first two available players if no category match
            if (!p1 || !p2) {
                p1 = availablePlayers[0];
                p2 = availablePlayers[1];
            }

            // Mark them as matching
            p1.isMatching = true;
            p2.isMatching = true;

            // Remove from queue
            this.queue = this.queue.filter(q => q !== p1 && q !== p2);

            console.log(`🤝 Match Found: ${p1.playerName} vs ${p2.playerName} in category ${p1.category === p2.category ? p1.category : 'Mixed'}`);

            // Use p1's category for the room if they match, else 'All'
            const roomCategory = p1.category === p2.category ? p1.category : 'All';

            // Create a real room for them
            const room = RoomManager.createRoom(p1.playerName, p1.socket.id, p1.uid, p1.avatar, p1.level, p1.tier, 'matchmaking');

            // Add p2
            RoomManager.joinRoom(room.code, p2.playerName, p2.socket.id, p2.uid, p2.avatar, p2.level, p2.tier);

            // Join sockets to room
            p1.socket.join(room.code);
            p2.socket.join(room.code);

            // Notify both
            const players = room.players.map(p => ({
                id: p.id,
                uid: p.uid,
                name: p.name,
                avatar: p.avatar,
                score: p.score,
                isActive: p.isActive,
                level: p.level,
                tier: p.tier
            }));

            // Notify both individually (more reliable than io.to after join)
            const payload = { code: room.code, players };
            p1.socket.emit('room_joined', payload);
            p2.socket.emit('room_joined', payload);

            console.log(`📡 Matchmaking: Emitted room_joined to ${p1.playerName} and ${p2.playerName}`);

            // Automatically start the game for the matched players
            console.log(`⏱️ Matchmaking: Starting game in 1.5s for room ${room.code}...`);
            setTimeout(() => {
                if (this.startGame) {
                    this.startGame(io, room.code, p1.socket, 1, roomCategory);
                } else {
                    console.error('❌ Matchmaking Error: this.startGame is not defined!');
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
        const room = RoomManager.createRoom(p.playerName, p.socket.id, p.uid, p.avatar, p.level, p.tier, 'matchmaking');
        p.socket.join(room.code);

        // Add 1-2 bots
        const botNames = ['Adil', 'Farhan', 'Shihab', 'Jaseela', 'Nimna', 'Lubna', 'Shalba', 'Keerthana', 'Marwa', 'Suhra', 'Thanha'];
        const numBots = Math.floor(Math.random() * 2) + 1;

        const botAvatars = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar_rocket', 'avatar_brain', 'premium_robot', 'premium_ninja'];

        for (let i = 0; i < numBots; i++) {
            const name = botNames[Math.floor(Math.random() * botNames.length)];
            const botAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
            
            // Assign bot difficulty
            const difficulties = [
                { type: 'Easy', accuracy: 0.60, minDelay: 6000, maxDelay: 12000 },
                { type: 'Medium', accuracy: 0.75, minDelay: 4000, maxDelay: 9000 },
                { type: 'Hard', accuracy: 0.90, minDelay: 2000, maxDelay: 6000 }
            ];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

            RoomManager.joinRoom(room.code, name, `bot_${Math.random().toString(36).substr(2, 9)}`, `bot_${name}`, botAvatar);
            
            // Attach bot logic to the player object in the room
            const botPlayer = room.players.find(p => p.name === name);
            if (botPlayer) {
                botPlayer.isBot = true;
                botPlayer.difficulty = difficulty.type;
                botPlayer.accuracy = difficulty.accuracy;
                botPlayer.minDelay = difficulty.minDelay;
                botPlayer.maxDelay = difficulty.maxDelay;
            }
        }

        const players = room.players.map(p => ({
            id: p.id,
            uid: p.uid,
            name: p.name,
            avatar: p.avatar,
            score: p.score,
            isActive: p.isActive,
            level: p.level,
            tier: p.tier
        }));

        p.socket.emit('room_joined', { code: room.code, players });

        // Automatically start the game with bots using player's preferred category
        setTimeout(() => {
            if (this.startGame) {
                this.startGame(io, room.code, p.socket, 1, p.category);
            }
        }, 1500);
    }

    removeFromQueue(uid) {
        const index = this.queue.findIndex(p => p.uid === uid);
        if (index !== -1) {
            console.log(`📡 Matchmaking: Removing ${this.queue[index].playerName} from queue.`);
            return this.queue.splice(index, 1)[0];
        }
        return null;
    }
}

module.exports = new MatchmakingManager();
