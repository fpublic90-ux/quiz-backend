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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
