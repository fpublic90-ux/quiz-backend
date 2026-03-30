require('dotenv').config();
const mongoose = require('mongoose');

async function runAudit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Social Science I', 'Social Science II'];

        for (const sub of subjects) {
            const total = await col.countDocuments({ subject: sub });
            const withBoard = await col.countDocuments({ subject: sub, board: 'Kerala State' });
            console.log(`${sub}: Total=${total}, WithBoard=${withBoard}`);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runAudit();
