const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/daily/claim
router.post('/claim', async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) return res.status(400).json({ message: 'UID is required' });

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = new Date();
        const lastClaimed = user.lastClaimedReward;

        // Reset streak check if missed a day
        if (lastClaimed) {
            const diffInMs = now - lastClaimed;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours < 24) {
                // Already claimed today (or less than 24h ago)
                // Check if it's actually a different calendar day in UTC
                const lastDate = new Date(lastClaimed).getUTCDate();
                const nowDate = now.getUTCDate();

                if (lastDate === nowDate) {
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

        // Cap streak bonus at 30 days
        const bonusMultiplier = Math.min(user.loginStreak, 30);
        const rewardCoins = 50 + (bonusMultiplier * 10);

        user.coins += rewardCoins;
        user.lastClaimedReward = now;
        await user.save();

        res.json(user);

    } catch (err) {
        console.error('Daily Claim Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
