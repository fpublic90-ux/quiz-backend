const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * GET /api/student/progress?board=...&class=...&medium=...&subject=...&chapter=...
 */
router.get('/progress', verifyToken, async (req, res) => {
    try {
        const { board, class: className, medium, subject, chapter } = req.query;
        const uid = req.user.uid;

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const key = `${board}|${className}|${medium}|${subject}|${chapter}`;
        const lastLevel = user.studentProgress.get(key) || 0;

        res.json({ lastLevel });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

/**
 * POST /api/student/complete-level
 */
router.post('/complete-level', verifyToken, async (req, res) => {
    try {
        const { board, class: className, medium, subject, chapter, level, score } = req.body;
        const uid = req.user.uid;

        if (score < 100) {
            return res.status(400).json({ message: 'Score must be 100/100 to complete level' });
        }

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const key = `${board}|${className}|${medium}|${subject}|${chapter}`;
        const currentProgress = user.studentProgress.get(key) || 0;

        if (level > currentProgress + 1) {
            return res.status(400).json({ message: 'Cannot skip levels. Complete previous levels first.' });
        }

        if (level > currentProgress) {
            user.studentProgress.set(key, level);
            // RewardManager handles primary stats, but we can ensure attempts are tracked here too
            // though they are likely already incremented by the /save-results call
            await user.save();
        }

        res.json({ success: true, lastLevel: user.studentProgress.get(key) });
    } catch (err) {
        console.error('Error completing level:', err);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

module.exports = router;
