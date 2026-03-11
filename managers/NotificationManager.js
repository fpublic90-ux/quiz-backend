const Notification = require('../models/Notification');

class NotificationManager {
    /**
     * Create a notification and emit it via socket if the user is online
     * @param {Object} io - Socket.io instance
     * @param {Object} userSockets - Map of UID to socket ID
     * @param {Object} params - { recipient, sender, type, title, message, data }
     */
    async notify(io, userSockets, { recipient, sender = 'system', type, title, message, data = {} }) {
        try {
            // 1. Persist to Database
            const notification = await Notification.create({
                recipient,
                sender,
                type,
                title,
                message,
                data
            });

            // 2. Emit via Socket if online
            const socketId = userSockets.get(recipient);
            if (socketId && io) {
                io.to(socketId).emit('new_notification', {
                    id: notification._id,
                    type,
                    title,
                    message,
                    data,
                    createdAt: notification.createdAt
                });
                console.log(`Socket notification emitted to ${recipient}`);
            }

            return notification;
        } catch (error) {
            console.error('Error in NotificationManager.notify:', error);
        }
    }

    async getUnreadCount(uid) {
        return await Notification.countDocuments({ recipient: uid, isRead: false });
    }
}

module.exports = new NotificationManager();
