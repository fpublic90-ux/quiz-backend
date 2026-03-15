const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const { verifyToken } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const admin = require('firebase-admin');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error check admin' });
    }
};

router.use(verifyToken);

// Public upload endpoint (before admin check or keep it protected)
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.use(isAdmin);

// --- Questions CRUD ---

// Get all questions (paginated)
router.get('/questions', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search = '', 
            category, 
            board, 
            class: className, 
            medium, 
            subject 
        } = req.query;

        const query = {};
        if (search) query.question = { $regex: search, $options: 'i' };
        if (category && category !== 'All') query.category = category;
        if (board) query.board = board;
        if (className) query.class = className;
        if (medium) query.medium = medium;
        if (subject) query.subject = subject;

        const questions = await Question.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Question.countDocuments(query);
        res.json({
            questions,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new question
router.post('/questions', async (req, res) => {
    const question = new Question(req.body);
    try {
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update question
router.put('/questions/:id', async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete question
router.delete('/questions/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Users CRUD ---

// Get all users
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const query = search ? { 
            $or: [
                { displayName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ] 
        } : {};
        const users = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        const count = await User.countDocuments(query);
        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user (e.g., change role, coins, level, password)
router.put('/users/:uid', async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // If password is provided, update in Firebase Authentication
        if (password && password.trim().length >= 6) {
            await admin.auth().updateUser(req.params.uid, {
                password: password
            });
            console.log(`📡 Password updated in Firebase for UID: ${req.params.uid}`);
        }

        const updatedUser = await User.findOneAndUpdate(
            { uid: req.params.uid },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found in database' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('❌ User update error:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// Delete user
router.delete('/users/:uid', async (req, res) => {
    try {
        await User.findOneAndDelete({ uid: req.params.uid });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Management & Settings ---

// Send Global Announcement
router.post('/broadcast', async (req, res) => {
    try {
        const { title, message, type = 'system' } = req.body;
        if (!title || !message) return res.status(400).json({ message: 'Title and message required' });

        const users = await User.find({}).select('uid');
        const notifications = users.map(user => ({
            recipient: user.uid,
            title,
            message,
            type
        }));

        await Notification.insertMany(notifications);
        console.log(`📢 Broadcast sent to ${users.length} users`);
        res.json({ message: `Announcement sent to ${users.length} users` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Leaderboard Reset
// --- Leaderboard ---

// Get leaderboard for admin (with full user details)
router.get('/leaderboard', async (req, res) => {
    try {
        const { type = 'global', limit = 50 } = req.query;
        let sortField = 'xp';
        if (type === 'weekly') sortField = 'weeklyXp';
        else if (type === 'monthly') sortField = 'monthlyXp';

        const leaderboard = await User.find({})
            .sort({ [sortField]: -1, totalScore: -1 })
            .limit(limit * 1)
            .select('uid displayName email avatar xp weeklyXp monthlyXp level tier wins coins role');

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/leaderboard/reset', async (req, res) => {
    try {
        const { type } = req.body; // 'weekly' or 'monthly'
        if (!['weekly', 'monthly'].includes(type)) {
            return res.status(400).json({ message: 'Invalid reset type' });
        }

        const resetField = type === 'weekly' ? 'weeklyXp' : 'monthlyXp';
        await User.updateMany({}, { [resetField]: 0 });

        console.log(`🏆 ${type} leaderboard reset by admin`);
        res.json({ message: `${type} leaderboard reset successfully` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reward Settings
router.get('/settings/rewards', async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'reward_config' });
        if (!settings) {
            settings = await Settings.create({
                key: 'reward_config',
                value: { base: 50, streakBonus: 10, maxStreak: 30 }
            });
        }
        res.json(settings.value);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/settings/rewards', async (req, res) => {
    try {
        const updated = await Settings.findOneAndUpdate(
            { key: 'reward_config' },
            { value: req.body, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json(updated.value);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- GitHub Sync ---
router.post('/github/sync', async (req, res) => {
    try {
        // 1. Export all questions to seeds.js (simplified version for now)
        const questions = await Question.find({}).lean();
        const seedContent = `module.exports = ${JSON.stringify(questions, null, 4)};`;
        const seedPath = path.join(__dirname, '../seeds.js');
        
        fs.writeFileSync(seedPath, seedContent);

        // 2. Git commands (Assuming git is initialized and remote is set)
        const gitCommands = 'git add seeds.js && git commit -m "Auto-sync questions from Admin Dashboard" && git push';
        
        exec(gitCommands, (error, stdout, stderr) => {
            if (error) {
                console.error(`Git error: ${error.message}`);
                return res.status(500).json({ message: 'Git sync failed', error: error.message });
            }
            res.json({ message: 'Synced to GitHub successfully', output: stdout });
        });
    } catch (err) {
        res.status(500).json({ message: 'Sync failed: ' + err.message });
    }
});

// --- System Dashboard Stats ---
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalQuestions = await Question.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        
        // Count new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

        res.json({
            totalUsers,
            totalQuestions,
            totalAdmins,
            newUsersToday
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Dynamic Student Metadata ---
router.get('/student/meta', async (req, res) => {
    try {
        const boards = await Question.distinct('board');
        const classes = await Question.distinct('class');
        const mediums = await Question.distinct('medium');
        const subjects = await Question.distinct('subject');

        res.json({
            boards: boards.filter(b => b),
            classes: classes.filter(c => c),
            mediums: mediums.filter(m => m),
            subjects: subjects.filter(s => s)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
