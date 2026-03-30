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

        console.table(report.sort((a, b) => b.count - a.count));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runAudit();
