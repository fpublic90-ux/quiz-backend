const admin = require('firebase-admin');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationManager {
    /**
     * Create a notification, emit it via socket if the user is online, 
     * and send a push notification via FCM.
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

            // 2. Send Push Notification via FCM
            try {
                const targetUser = await User.findOne({ uid: recipient }).select('fcmToken displayName');
                if (targetUser && targetUser.fcmToken) {
                    const payload = {
                        token: targetUser.fcmToken,
                        notification: {
                            title: title,
                            body: message,
                        },
                        data: {
                            ...data,
                            type: type,
                            click_action: 'FLUTTER_NOTIFICATION_CLICK',
                        },
                        android: {
                            priority: 'high',
                            notification: {
                                channelId: 'quiz_bg_sync', // Align with frontend channel
                                sound: 'default',
                                icon: 'notification_icon'
                            }
                        }
                    };
                    await admin.messaging().send(payload);
                    console.log(`✅ FCM push sent to ${recipient}`);
                }
            } catch (fcmError) {
                console.error('❌ FCM push failed:', fcmError.message);
                // Continue with socket notification even if push fails
            }

            // 3. Emit via Socket if online
            if (userSockets && io) {
                const socketId = userSockets.get(recipient);
                if (socketId) {
                    io.to(socketId).emit('new_notification', {
                        id: notification._id,
                        type,
                        title,
                        message,
                        data,
                        createdAt: notification.createdAt
                    });
                    console.log(`📡 Socket notification emitted to ${recipient}`);
                }
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
