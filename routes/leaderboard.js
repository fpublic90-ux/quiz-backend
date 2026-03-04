const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get global leaderboard (Top 50 by XP)
router.get('/', async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .sort({ xp: -1, totalScore: -1 })
            .limit(50)
            .select('displayName avatar xp level tier wins ownedItems');

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user rank and surrounding players
router.get('/my-rank/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const rank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;

        // Get 2 players above and 2 below
        const nearby = await User.find({})
            .sort({ xp: -1 })
            .skip(Math.max(0, rank - 3))
            .limit(5)
            .select('displayName avatar xp level tier ownedItems');

        res.status(200).json({
            rank,
            nearby
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
