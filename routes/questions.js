const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

/**
 * GET /api/questions?level=1&category=All&count=10
 * Returns random questions matching filters
 */
router.get('/', async (req, res) => {
    try {
        const { level, category, count, uid } = req.query;
        const query = {};
        if (level) query.level = parseInt(level);
        if (category && category !== 'All') query.category = category;

        let excludeIds = [];
        if (uid) {
            const User = require('../models/User');
            const user = await User.findOne({ uid });
            if (user && user.answeredQuestions) {
                excludeIds = user.answeredQuestions;
            }
        }

        const requestedCount = parseInt(count) || 10;
        const pipeline = [{ $match: query }];

        // Repetition prevention: exclude seen questions if pool is large enough
        if (excludeIds.length > 0) {
            // Check remaining pool size first
            const availableCount = await Question.countDocuments({
                ...query,
                _id: { $nin: excludeIds }
            });

            if (availableCount >= requestedCount) {
                pipeline.push({ $match: { _id: { $nin: excludeIds } } });
            }
        }

        pipeline.push({ $sample: { size: requestedCount } });

        const questions = await Question.aggregate(pipeline);
        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

/**
 * GET /api/questions/random?count=10
 * Returns N random questions (legacy/general)
 */
router.get('/random', async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 10;
        const questions = await Question.aggregate([
            { $sample: { size: count } },
            { $project: { question: 1, options: 1, category: 1 } }, // exclude correctIndex
        ]);
        res.json({ success: true, questions });
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch questions' });
    }
});

/**
 * GET /api/questions/all - for admin/debug
 */
router.get('/all', async (req, res) => {
    try {
        const questions = await Question.find({});
        res.json({ success: true, questions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch questions' });
    }
});

module.exports = router;
