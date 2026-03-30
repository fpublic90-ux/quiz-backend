require('dotenv').config();
const mongoose = require('mongoose');

async function checkNewSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const subs = ['Computer Science 1', 'Computer Science 2'];

        for (const sub of subs) {
            const count = await col.countDocuments({ subject: sub });
            const firstDoc = await col.findOne({ subject: sub });
            console.log(`Subject: ${sub}, Count: ${count}`);
            if (firstDoc) {
                console.log(`Sample Doc: ${JSON.stringify(firstDoc, null, 2)}`);
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkNewSubjects();
