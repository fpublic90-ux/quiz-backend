const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

const { shuffleQuestion } = require('../utils/questionUtils');

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
        if (board) {
            query.board = board;
        } else if (!category || category === 'All') {
            query.board = { $exists: false };
            query.subject = { $exists: false };
            query.class = { $exists: false };
            query.category = { $nin: ['Islamic', 'Kerala', 'SSLC', 'Kerala Padavali'] };
        }
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

        // If a specific level is requested, use deterministic sorting and pagination
        // This makes questions permanent for both Student Center and Practice Hub levels.
        if (level) {
            const deterministicQuery = { ...query };
            delete deterministicQuery.level;

            let questions = await Question.find(deterministicQuery)
                .sort({ _id: 1 })
                .skip((page - 1) * requestedCount)
                .limit(requestedCount)
                .lean();
            
            const processed = questions.map(shuffleQuestion);
            console.log(`✅ Returned ${processed.length} deterministic questions for Level ${level}`);
            return res.json(processed);
        }

        // aggregation logic for random practice (used when no specific level is requested)
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
 * GET /api/questions/past-papers-meta
 * Returns available subjects for Past Papers
 */
router.get('/past-papers-meta', async (req, res) => {
    try {
        const query = { category: 'Past Papers', board: 'Kerala', class: '10' };

        // Find which subjects have past papers available
        const subjects = await Question.distinct('subject', query);
        const filteredSubjects = subjects.filter(s => s).sort();

        // Also get total count per subject if wanted, but distinct is enough for UI
        res.json({ success: true, subjects: filteredSubjects, board: 'Kerala SSLC' });
    } catch (err) {
        console.error('Error fetching past papers metadata:', err);
        res.status(500).json({ error: 'Failed to fetch past papers metadata' });
    }
});

/**
 * GET /api/questions/categories
 * Returns distinct categories for the practice mode
 */
router.get('/categories', async (req, res) => {
    try {
        // Exclude student center / regional / special categories from the Practice Hub list
        const EXCLUDED_CATEGORIES = ['Past Papers', 'SSLC', 'Kerala', 'Kerala Padavali', 'Islamic'];

        const categories = await Question.distinct('category', {
            category: { $nin: EXCLUDED_CATEGORIES },
            board: { $exists: false },  // Exclude board-linked (student center) questions
        });
        // Filter out null/empty and sort
        const filteredCategories = categories.filter(c => c).sort();

        // Map to UI-friendly objects (we can expand this later with icons/colors)
        const categoryList = filteredCategories.map(name => ({
            name,
            icon: 'public', // Default icon
            color: '#607D8B' // Default color
        }));

        res.json(categoryList);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
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
            { $match: { board: { $exists: false } } }, // Exclude educational content
            { $sample: { size: count } },
            { $project: { question: 1, options: 1, category: 1 } },
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
