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
    keralaGamesPlayed: { type: Number, default: 0 },
    indiaGamesPlayed: { type: Number, default: 0 },
    speedMasteryCount: { type: Number, default: 0 },
    ownedItems: {
        type: [String],
        default: []
    },
    answeredQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    lastClaimedReward: {
        type: Date
    },
    highestPracticeLevel: {
        type: Number,
        default: 0
    },
    practiceLevels: {
        type: Map,
        of: Number,
        default: {}
    },
    loginStreak: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        trim: true,
        maxLength: 150
    },
    friends: [{
        type: String,
        ref: 'User'
    }],
    sentFriendRequests: [{
        type: String,
        ref: 'User'
    }],
    receivedFriendRequests: [{
        type: String,
        ref: 'User'
    }],
    studentInfo: {
        board: { type: String, default: null },
        class: { type: String, default: null },
        medium: { type: String, default: null },
        selectedSubjects: { type: [String], default: [] }
    },
    studentProgress: {
        type: Map,
        of: Number, // format: "Board|Class|Medium|Subject|Chapter" -> LastCompletedLevel
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
