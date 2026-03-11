const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all notifications for the authenticated user
router.get('/:uid', verifyToken, async (req, res) => {
    try {
        const { uid } = req.params;
        const notifications = await Notification.find({ recipient: uid })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark a single notification as read
router.patch('/:notificationId/read', verifyToken, async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark all as read
router.post('/read-all', verifyToken, async (req, res) => {
    try {
        const { uid } = req.body;
        await Notification.updateMany({ recipient: uid, isRead: false }, { isRead: true });
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
