require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function auditQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Audit\n');

        // 1. Total Stats
        const total = await Question.countDocuments();
        console.log(`📊 Total Questions in Database: ${total}`);

        // 2. Breakdown by Subject/Class/Board/Medium
        const breakdown = await Question.aggregate([
            {
                $group: {
                    _id: {
                        board: "$board",
                        class: "$class",
                        medium: "$medium",
                        subject: "$subject"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.board": 1, "_id.class": 1, "_id.subject": 1 } }
        ]);

        console.log('\n📚 Subject Breakdown:');
        breakdown.forEach(b => {
             const { board, class: cls, medium, subject } = b._id;
             console.log(`- ${board || 'General'} | ${cls || 'All'} | ${medium || 'English'} | ${subject || 'General'}: ${b.count} questions`);
        });

        // 3. Find Chapters with < 10 questions (potential for "No Questions" error if 10 are requested)
        const chapterBreakdown = await Question.aggregate([
            {
                $group: {
                    _id: {
                        board: "$board",
                        class: "$class",
                        medium: "$medium",
                        subject: "$subject",
                        chapter: "$chapter"
                    },
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { $lt: 20 } } } // Flag anything under 20 (we usually request 10)
        ]);

        if (chapterBreakdown.length > 0) {
            console.log('\n⚠️ Chapters with Low Question Counts (< 20):');
            chapterBreakdown.forEach(c => {
                const { subject, chapter } = c._id;
                console.log(`  - [${subject}] ${chapter}: only ${c.count} questions`);
            });
        }

        // 4. Check for Data Integrity (Missing correctIndex, options < 4)
        const integrityCheck = await Question.find({
            $or: [
                { correctIndex: { $exists: false } },
                { options: { $size: 0 } },
                { options: { $size: 1 } },
                { options: { $size: 2 } },
                { options: { $size: 3 } }
            ]
        });

        if (integrityCheck.length > 0) {
            console.log('\n❌ Data Integrity Issues Found:');
            integrityCheck.forEach(q => {
                console.log(`  - ID: ${q._id} | Question: "${q.question.substring(0, 30)}..." | Issue: Options count ${q.options.length} or missing correctIndex`);
            });
        } else {
            console.log('\n✅ Data Integrity OK (No missing correctIndex or short options sets)');
        }

        // 5. Check for Duplicates (Exact same question text in same subject)
        const duplicates = await Question.aggregate([
            {
                $group: {
                    _id: {
                        question: "$question",
                        subject: "$subject"
                    },
                    count: { $sum: 1 },
                    ids: { $push: "$_id" }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (duplicates.length > 0) {
            console.log('\n⚠️ Duplicate Questions Found:');
            duplicates.forEach(d => {
                console.log(`  - "${d._id.question.substring(0, 50)}..." appears ${d.count} times in ${d._id.subject}`);
            });
        } else {
            console.log('\n✅ No Duplicate Questions Found');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Audit Failed:', err);
        process.exit(1);
    }
}

auditQuestions();
