require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function auditRecentQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Targeted Audit\n');

        const filters = {
            board: "Kerala State",
            class: "+2",
            medium: "English",
            subject: "Mathematics"
        };

        const mathsTotal = await Question.countDocuments(filters);
        console.log(`📊 Total Maths Questions (+2 English): ${mathsTotal}`);

        const chapters = await Question.aggregate([
            { $match: filters },
            {
                $group: {
                    _id: "$chapter",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📖 Chapter Breakdown:');
        chapters.forEach(c => {
             console.log(`- ${c._id}: ${c.count} questions`);
        });

        // Check for missing data in THIS subject
        const integrityCheck = await Question.find({
            ...filters,
            $or: [
                { correctIndex: { $exists: false } },
                { options: { $size: 0 } },
                { options: { $size: 1 } },
                { options: { $size: 2 } },
                { options: { $size: 3 } }
            ]
        });

        if (integrityCheck.length > 0) {
            console.log('\n❌ Integrity Issues in Maths:');
            integrityCheck.slice(0, 10).forEach(q => {
                 console.log(`  - ${q.chapter} | "${q.question.substring(0, 30)}..." | Options: ${q.options.length}`);
            });
        } else {
            console.log('\n✅ Data Integrity OK for Maths (+2 English)');
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
auditRecentQuestions();
