require('dotenv').config();
const mongoose = require('mongoose');

async function checkSSLC() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const subs = ['Physics', 'Chemistry', 'Biology', 'English', 'Mathematics', 'Social Science I', 'Social Science II'];
        const classes = ['10th (SSLC)', '+1', '+2'];

        for (const cls of classes) {
            for (const sub of subs) {
                const count = await col.countDocuments({ class: cls, subject: sub });
                if (count > 0) {
                    console.log(`Class: ${cls}, Subject: ${sub}, Count: ${count}`);
                }
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkSSLC();
