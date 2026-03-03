const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sync user profile (Create or Update)
router.post('/sync', async (req, res) => {
    try {
        const { uid, displayName, email, avatar } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ message: 'UID and Email are required' });
        }

        let user = await User.findOne({ uid });

        if (user) {
            // Update existing user
            user.displayName = displayName || user.displayName;
            user.avatar = avatar || user.avatar;
            await user.save();
        } else {
            // Create new user
            user = new User({
                uid,
                displayName: displayName || 'WizQuizzer',
                email,
                avatar: avatar || 'default'
            });
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Purchase item from the shop
router.post('/purchase', async (req, res) => {
    try {
        const { uid, itemId, price } = req.body;
        if (!uid || !itemId || price == null) {
            return res.status(400).json({ message: 'uid, itemId and price are required' });
        }

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ownedItems = user.ownedItems || [];
        if (ownedItems.includes(itemId)) {
            return res.status(400).json({ message: 'Already owned' });
        }
        if (user.coins < price) {
            return res.status(400).json({ message: 'Not enough coins' });
        }

        user.coins -= price;
        user.ownedItems = [...ownedItems, itemId];
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
