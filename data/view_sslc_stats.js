const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');

async function reviewDatabase() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quizapp';
        await mongoose.connect(uri);

        console.log('--- KERALA SSLC DATABASE REVIEW ---\n');

        const totalParams = { board: 'Kerala', class: '10' };
        const total = await Question.countDocuments(totalParams);
        console.log(`Total Kerala SSLC Questions found: ${total}\n`);

        if (total === 0) {
            console.log("No questions found for Kerala SSLC.");
            return;
        }

        const mediumStats = await Question.aggregate([
            { $match: totalParams },
            {
                $group: {
                    _id: { medium: "$medium", subject: "$subject", chapter: "$chapter" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.medium": 1, "_id.subject": 1, "_id.chapter": 1 } }
        ]);

        console.log("=== BREAKDOWN BY MEDIUM, SUBJECT & CHAPTER ===");
        const breakdown = {};
        for (let stat of mediumStats) {
            const med = stat._id.medium || 'Unknown Medium';
            const sub = stat._id.subject || 'Unknown Subject';
            const chap = stat._id.chapter || 'Unknown/General Chapter';
            if (!breakdown[med]) breakdown[med] = {};
            if (!breakdown[med][sub]) breakdown[med][sub] = {};
            breakdown[med][sub][chap] = stat.count;
        }

        for (let med in breakdown) {
            console.log(`\n▶ Medium: ${med}`);
            for (let sub in breakdown[med]) {
                console.log(`   - ${sub}:`);
                for (let chap in breakdown[med][sub]) {
                    console.log(`      * ${chap}: ${breakdown[med][sub][chap]} questions`);
                }
            }
        }

        console.log('\n=== STRUCTURAL VALIDITY CHECK ===');
        const invalidOptions = await Question.countDocuments({ ...totalParams, "options.3": { $exists: false } });
        const missingAnswers = await Question.countDocuments({ ...totalParams, correctIndex: { $exists: false } });
        const boundsError = await Question.countDocuments({ ...totalParams, correctIndex: { $gt: 3, $lt: 0 } });

        console.log(`Questions with fewer than 4 options: ${invalidOptions}`);
        console.log(`Questions missing correct answer index: ${missingAnswers}`);
        console.log(`Questions with out-of-bounds correct index: ${boundsError}`);

        if (invalidOptions === 0 && missingAnswers === 0 && boundsError === 0) {
            console.log('✅ All SSLC questions are structurally valid!');
        } else {
            console.log('❌ Structural issues detected in the database.');
        }

        console.log('\n--- REVIEW COMPLETE ---');

    } catch (e) {
        console.error("Error analyzing DB:", e);
    } finally {
        mongoose.disconnect();
    }
}

reviewDatabase();
