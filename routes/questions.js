const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Helper to shuffle options and update correctIndex
const shuffleQuestion = (q) => {
    const options = [...q.options];
    const correctAnswer = options[q.correctIndex];

    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    q.options = options;
    q.correctIndex = options.indexOf(correctAnswer);
    return q;
};

/**
 * GET /api/questions?level=1&category=All&count=10
 * Returns random questions matching filters
 */
router.get('/', async (req, res) => {
    try {
        const { level, category, count, uid, board, class: className, medium, subject, chapter } = req.query;
        const query = {};
        if (level) query.level = parseInt(level);
        if (category && category !== 'All') query.category = category;
        if (board) query.board = board;
        if (className) query.class = className;
        if (medium) query.medium = medium;
        if (subject) query.subject = subject;
        if (chapter && chapter !== 'All Chapters') query.chapter = chapter;

        let excludeIds = [];
        if (uid) {
            const User = require('../models/User');
            const user = await User.findOne({ uid });
            if (user && user.answeredQuestions) {
                const mongoose = require('mongoose');
                excludeIds = user.answeredQuestions.map(id =>
                    typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
                );
            }
        }

        console.log(`🔍 Fetching for ${uid || 'guest'}: Sub: ${subject}, Ch: ${chapter}, Lvl: ${level}. Excluded count: ${excludeIds.length}`);

        const requestedCount = parseInt(count) || 10;
        const page = parseInt(level) || 1;

        // If it's a specific student level (not 'All Chapters' or random practice)
        // we use deterministic sorting and pagination
        if (chapter && chapter !== 'All Chapters' && level) {
            // Remove global level filter if we are doing chapter-based pagination
            const studentQuery = { ...query };
            delete studentQuery.level;

            const studentQuestions = await Question.find(studentQuery)
                .sort({ _id: 1 })
                .skip((page - 1) * 10)
                .limit(10)
                .lean();

            const processed = studentQuestions.map(shuffleQuestion);

            console.log(`✅ Returned ${processed.length} deterministic shuffled questions for Chapter Level ${level}`);
            return res.json(processed);
        }

        // aggregation logic for random practice...
        let questions = await Question.aggregate([
            { $match: { ...query, _id: { $nin: excludeIds } } },
            { $sample: { size: requestedCount } }
        ]);

        if (questions.length < requestedCount) {
            const needed = requestedCount - questions.length;
            const seenQuestions = await Question.aggregate([
                { $match: { ...query, _id: { $in: excludeIds } } },
                { $sample: { size: Math.min(needed, excludeIds.length) } }
            ]);
            questions = [...questions, ...seenQuestions];
        }

        if (questions.length < requestedCount) {
            const currentIds = questions.map(q => q._id);
            const fallbackQuestions = await Question.aggregate([
                { $match: { ...query, _id: { $nin: currentIds } } },
                { $sample: { size: requestedCount - questions.length } }
            ]);
            questions = [...questions, ...fallbackQuestions];
        }

        const processed = questions.map(shuffleQuestion);
        res.json(processed.sort(() => Math.random() - 0.5));
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

/**
 * GET /api/questions/stats
 * Returns the total count of questions matching the filters
 */
router.get('/stats', async (req, res) => {
    try {
        const { board, class: className, medium, subject, chapter } = req.query;
        const query = {};
        if (board) query.board = board;
        if (className) query.class = className;
        if (medium) query.medium = medium;
        if (subject) query.subject = subject;
        if (chapter && chapter !== 'All Chapters') query.chapter = chapter;

        const count = await Question.countDocuments(query);
        res.json({ count });
    } catch (err) {
        console.error('Error fetching question stats:', err);
        res.status(500).json({ error: 'Failed to fetch question stats' });
    }
});

/**
 * GET /api/questions/chapters
 * Returns distinct chapters for given filters
 */
router.get('/chapters', async (req, res) => {
    try {
        const { board, class: className, medium, subject } = req.query;
        const query = {};
        if (board) query.board = board;
        if (className) query.class = className;
        if (medium) query.medium = medium;
        if (subject) query.subject = subject;

        const chapters = await Question.distinct('chapter', query);
        // Filter out null/empty and sort
        const filteredChapters = chapters.filter(c => c).sort();
        res.json(filteredChapters);
    } catch (err) {
        console.error('Error fetching chapters:', err);
        res.status(500).json({ error: 'Failed to fetch chapters' });
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
