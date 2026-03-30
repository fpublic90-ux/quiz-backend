require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function fullAudit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for GLOBAL SYLLABUS AUDIT\n');

        // 1. Subject-level summary
        const subjectStats = await Question.aggregate([
            {
                $group: {
                    _id: {
                        board: "$board",
                        class: "$class",
                        medium: "$medium",
                        subject: "$subject"
                    },
                    total: { $sum: 1 },
                    chapters: { $addToSet: "$chapter" }
                }
            },
            {
                $project: {
                    total: 1,
                    numChapters: { $size: "$chapters" }
                }
            },
            { $sort: { "_id.class": 1, "_id.subject": 1 } }
        ]);

        console.log('📚 OVERVIEW BY SUBJECT:');
        console.table(subjectStats.map(s => ({
            Board: s._id.board || '-',
            Class: s._id.class || '-',
            Medium: s._id.medium || '-',
            Subject: s._id.subject || '-',
            Questions: s.total,
            Chapters: s.numChapters
        })));

        // 2. Identify EMPTY or LOW COUNT subjects (Missing)
        console.log('\n⚠️ INCOMPLETE SUBJECTS (Less than 100 questions):');
        const incomplete = subjectStats.filter(s => s.total < 100);
        if (incomplete.length === 0) {
            console.log('None found! All subjects are well-populated.');
        } else {
            incomplete.forEach(s => {
                console.log(`- [${s._id.medium}] ${s._id.class} ${s._id.subject}: only ${s.total} questions in ${s.numChapters} chapters`);
            });
        }

        // 3. Identify Missing Chapters (Subject-specific check)
        // For Kerala State +2 Maths, we know there should be 13 chapters.
        const mathsPlusTwo = subjectStats.find(s => s._id.class === '+2' && s._id.subject === 'Mathematics');
        if (mathsPlusTwo && mathsPlusTwo.numChapters < 13) {
            console.log(`\n❌ ERROR: Mathematics (+2) only has ${mathsPlusTwo.numChapters}/13 chapters.`);
        }

        // 4. Broken Chapters (Chapters with < 10 questions will crash the game "No questions found")
        const chapterStats = await Question.aggregate([
            {
                $group: {
                    _id: {
                        class: "$class",
                        subject: "$subject",
                        chapter: "$chapter"
                    },
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { $lt: 10 } } }
        ]);

        if (chapterStats.length > 0) {
            console.log('\n🚨 CRITICAL: Chapters with < 10 questions (Will prevent gameplay):');
            chapterStats.forEach(c => {
                console.log(`- [${c._id.class}] ${c._id.subject} -> ${c._id.chapter}: ${c.count} questions`);
            });
        } else {
            console.log('\n✅ No critical chapter gaps found (All chapters have 10+ questions).');
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
fullAudit();
