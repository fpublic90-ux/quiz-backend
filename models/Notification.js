const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String, // UID
        required: true,
        index: true
    },
    sender: {
        type: String, // UID or 'system'
        default: 'system'
    },
    type: {
        type: String,
        enum: ['achievement', 'follow', 'level_up', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        type: Map,
        of: String,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
