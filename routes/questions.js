const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

/**
 * GET /api/questions?level=1&category=All&count=10
 * Returns random questions matching filters
 */
router.get('/', async (req, res) => {
    try {
        const { level, category, count, uid, board, class: className, medium, subject } = req.query;
        const query = {};
        if (level) query.level = parseInt(level);
        if (category && category !== 'All') query.category = category;
        if (board) query.board = board;
        if (className) query.class = className;
        if (medium) query.medium = medium;
        if (subject) query.subject = subject;

        let excludeIds = [];
        if (uid) {
            const User = require('../models/User');
            const user = await User.findOne({ uid });
            if (user && user.answeredQuestions) {
                // Ensure they are correctly formatted as ObjectIds for aggregation
                const mongoose = require('mongoose');
                excludeIds = user.answeredQuestions.map(id =>
                    typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
                );
            }
        }

        console.log(`🔍 Fetching for ${uid || 'guest'}: Level ${level}, Cat ${category}. Excluded count: ${excludeIds.length}`);

        const requestedCount = parseInt(count) || 10;

        // 1. Try to fetch only unseen questions
        let questions = await Question.aggregate([
            { $match: { ...query, _id: { $nin: excludeIds } } },
            { $sample: { size: requestedCount } }
        ]);

        // 2. If not enough unseen, fill the rest with random seen questions
        if (questions.length < requestedCount) {
            const needed = requestedCount - questions.length;
            const seenQuestions = await Question.aggregate([
                { $match: { ...query, _id: { $in: excludeIds } } },
                { $sample: { size: Math.min(needed, excludeIds.length) } }
            ]);
            questions = [...questions, ...seenQuestions];
        }

        // 3. Last resort if pool is still tiny
        if (questions.length < requestedCount) {
            const currentIds = questions.map(q => q._id);
            const fallbackQuestions = await Question.aggregate([
                { $match: { ...query, _id: { $nin: currentIds } } },
                { $sample: { size: requestedCount - questions.length } }
            ]);
            questions = [...questions, ...fallbackQuestions];
        }

        res.json(questions.sort(() => Math.random() - 0.5));
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
