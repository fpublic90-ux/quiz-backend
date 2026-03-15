require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

/**
 * Standardizes metadata across the Question collection to resolve lookup issues.
 * Run this after seeding new academic data or if "No Question" errors occur.
 */
async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Standardize Boards
        console.log('Normalizing Boards...');
        await Question.updateMany(
            { board: { $in: ['kerala', 'Kerala', 'kerala state', 'Kerala State ', 'kerala '] } },
            { $set: { board: 'Kerala State' } }
        );

        // 2. Standardize Classes
        console.log('Normalizing Classes...');
        await Question.updateMany(
            { class: { $in: ['10', 'sslc', 'SSLC', '10th (SSLC) ', 'ssl', 'ssl ', '10th'] } },
            { $set: { class: '10th (SSLC)' } }
        );

        // 3. Trim all strings in metadata
        console.log('Trimming metadata fields...');
        const questions = await Question.find({
            $or: [
                { board: / $/ }, { board: /^ / },
                { class: / $/ }, { class: /^ / },
                { medium: / $/ }, { medium: /^ / },
                { subject: / $/ }, { subject: /^ / }
            ]
        });

        for (const q of questions) {
            let changed = false;
            if (q.board && q.board !== q.board.trim()) { q.board = q.board.trim(); changed = true; }
            if (q.class && q.class !== q.class.trim()) { q.class = q.class.trim(); changed = true; }
            if (q.medium && q.medium !== q.medium.trim()) { q.medium = q.medium.trim(); changed = true; }
            if (q.subject && q.subject !== q.subject.trim()) { q.subject = q.subject.trim(); changed = true; }
            if (changed) await q.save();
        }

        console.log('Cleanup completed successfully!');
    } catch (err) {
        console.error('Cleanup failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

cleanup();
