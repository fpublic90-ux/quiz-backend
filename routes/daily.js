const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Settings = require('../models/Settings');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/daily/claim
router.post('/claim', verifyToken, async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) return res.status(400).json({ message: 'UID is required' });

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Fetch dynamic reward settings
        let settings = await Settings.findOne({ key: 'reward_config' });
        const config = settings ? settings.value : { base: 50, streakBonus: 10, maxStreak: 30 };

        const now = new Date();
        const lastClaimed = user.lastClaimedReward;

        // Reset streak check if missed a day
        if (lastClaimed) {
            const diffInMs = now - lastClaimed;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours < 24) {
                // Check if it's actually the same calendar day in UTC
                const lastD = new Date(lastClaimed);
                const isSameDay =
                    lastD.getUTCFullYear() === now.getUTCFullYear() &&
                    lastD.getUTCMonth() === now.getUTCMonth() &&
                    lastD.getUTCDate() === now.getUTCDate();

                if (isSameDay) {
                    return res.status(400).json({
                        message: 'Reward already claimed today',
                        nextAvailable: new Date(new Date().setUTCHours(24, 0, 0, 0))
                    });
                }

                // If it's a new day but < 24h (e.g. claimed at 11pm, now 1am), it's a streak
                user.loginStreak += 1;
            } else if (diffInHours < 48) {
                // Within 48 hours = kept the streak
                user.loginStreak += 1;
            } else {
                // Missed a day = reset
                user.loginStreak = 1;
            }
        } else {
            // First time ever
            user.loginStreak = 1;
        }

        // Apply dynamic configuration
        const bonusMultiplier = Math.min(user.loginStreak, config.maxStreak);
        const rewardCoins = config.base + (bonusMultiplier * config.streakBonus);

        user.coins += rewardCoins;
        user.lastClaimedReward = now;
        await user.save();

        res.json({
            user,
            rewardAmount: rewardCoins
        });

    } catch (err) {
        console.error('Daily Claim Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
