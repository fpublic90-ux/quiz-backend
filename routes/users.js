const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Sync user profile (Create or Update)
router.post('/sync', verifyToken, async (req, res) => {
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

// ─── Shop Catalog (Server-side Source of Truth) ───────────────────────────
const K_SHOP_CATALOG = {
    // Badges
    'avatar_rocket': { price: 200 },
    'avatar_star': { price: 300 },
    'avatar_crown': { price: 500 },
    'avatar_gem': { price: 750 },
    'avatar_brain': { price: 400 },
    'badge_fire': { price: 250 },
    'badge_bolt': { price: 200 },
    'badge_shield': { price: 300 },
    'badge_heart': { price: 150 },
    // Classic Premium Avatars
    'premium_ninja': { price: 400 },
    'premium_robot': { price: 450 },
    'premium_cat': { price: 350 },
    'premium_gamer': { price: 600 },
    // Famous Characters
    'char_bheem': { price: 500 },
    'char_bean': { price: 350 },
    'char_scooby': { price: 400 },
    'char_harry': { price: 550 },
    'char_batman': { price: 600 },
    'char_doraemon': { price: 450 },
    'char_spiderman': { price: 600 },
    'char_ironman': { price: 700 },
    'char_pikachu': { price: 400 },
    'char_naruto': { price: 500 },
};

// Get user profile (Secured with IDOR protection)
router.get('/profile/:uid', verifyToken, async (req, res) => {
    try {
        const isOwner = req.user.uid === req.params.uid;
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (isOwner) {
            res.status(200).json(user);
        } else {
            // Return public view only
            const publicProfile = {
                uid: user.uid,
                displayName: user.displayName,
                avatar: user.avatar,
                level: user.level,
                tier: user.tier,
                totalScore: user.totalScore,
                gamesPlayed: user.gamesPlayed,
                wins: user.wins
            };
            res.status(200).json(publicProfile);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Purchase item from the shop
router.post('/purchase', verifyToken, async (req, res) => {
    try {
        const { uid, itemId } = req.body;
        if (!uid || !itemId) {
            return res.status(400).json({ message: 'uid and itemId are required' });
        }

        const item = K_SHOP_CATALOG[itemId];
        if (!item) {
            return res.status(404).json({ message: 'Item not found in catalog' });
        }

        const price = item.price;

        // Atomic check and update: 
        // 1. User must have enough coins
        // 2. User must not already own the item
        const user = await User.findOneAndUpdate(
            {
                uid,
                coins: { $gte: price },
                ownedItems: { $ne: itemId }
            },
            {
                $inc: { coins: -price },
                $push: { ownedItems: itemId }
            },
            { new: true }
        );

        if (!user) {
            // Either user not found, not enough coins, or already owned
            const checkUser = await User.findOne({ uid });
            if (!checkUser) return res.status(404).json({ message: 'User not found' });
            if (checkUser.ownedItems.includes(itemId)) return res.status(400).json({ message: 'Already owned' });
            if (checkUser.coins < price) return res.status(400).json({ message: 'Not enough coins' });
            return res.status(400).json({ message: 'Purchase failed' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
