const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'default'
    },
    totalScore: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    coins: {
        type: Number,
        default: 100 // Start with some coins
    },
    tier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
        default: 'Bronze'
    },
    achievements: [{
        id: String,
        unlockedAt: { type: Date, default: Date.now }
    }],
    ownedItems: {
        type: [String],
        default: []
    },
    following: [{
        type: String // List of UIDs
    }],
    lastClaimedReward: {
        type: Date
    },
    loginStreak: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
