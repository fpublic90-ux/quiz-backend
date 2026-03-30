require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function finalVerify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const chapters = await Question.aggregate([
            { $match: { class: '+2', subject: 'Mathematics', medium: 'English' } },
            { $group: { _id: "$chapter", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n🌟 FINAL SYLLABUS AUDIT (Mathematics +2 English):');
        chapters.forEach(c => {
            console.log(`- ${c._id}: ${c.count} questions`);
        });

        const total = chapters.reduce((a, b) => a + b.count, 0);
        console.log(`\n📊 Total Questions: ${total}`);
        console.log(`📚 Total Chapters: ${chapters.length}/13`);

        if (chapters.length === 13) {
            console.log('\n✅ MISSION ACCOMPLISHED: Syllabus is 100% Complete!');
        } else {
            console.log(`\n⚠️ WARNING: Only ${chapters.length}/13 chapters found.`);
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
finalVerify();
