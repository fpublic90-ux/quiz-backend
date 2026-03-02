const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

/**
 * GET /api/questions/random?count=10
 * Returns N random questions (without correctIndex for security)
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
