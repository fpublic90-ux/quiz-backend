require('dotenv').config();
const mongoose = require('mongoose');

async function runAudit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const subjects = await col.distinct('subject');
        const report = [];

        for (const sub of subjects) {
            const count = await col.countDocuments({ subject: sub });
            report.push({ subject: sub, count });
        }

        const fs = require('fs');
        fs.writeFileSync('db_subject_counts.json', JSON.stringify(report.sort((a,b)=>b.count - a.count), null, 2));
        console.log('Saved to db_subject_counts.json');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runAudit();
