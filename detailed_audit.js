require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const fs = require('fs');

async function detailedAudit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const stats = await Question.aggregate([
            {
                $group: {
                    _id: {
                        class: "$class",
                        subject: "$subject",
                        medium: "$medium"
                    },
                    total: { $sum: 1 },
                    chapters: { $addToSet: "$chapter" }
                }
            },
            { $sort: { "_id.class": 1, "_id.subject": 1 } }
        ]);

        const gaps = [];
        for (const s of stats) {
            const chapterCounts = await Question.aggregate([
                { $match: { class: s._id.class, subject: s._id.subject, medium: s._id.medium } },
                { $group: { _id: "$chapter", count: { $sum: 1 } } }
            ]);

            const broken = chapterCounts.filter(c => c.count < 10);
            if (broken.length > 0 || s.total < 100) {
                 gaps.push({
                     class: s._id.class,
                     subject: s._id.subject,
                     medium: s._id.medium,
                     total: s.total,
                     brokenChapters: broken
                 });
            }
        }

        fs.writeFileSync('audit_report.json', JSON.stringify(gaps, null, 2));
        console.log('✅ Audit report written to audit_report.json');
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
detailedAudit();
