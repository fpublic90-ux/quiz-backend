const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findAccBroad() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Search for "Acc" in subject across ALL entries
        const subjects = await Question.distinct('subject', { subject: /acc/i });
        console.log('\n--- Found subjects containing "Acc" (Any board) ---');
        if (subjects.length === 0) {
            console.log('None found.');
        } else {
            for (const sub of subjects) {
                const count = await Question.countDocuments({ subject: sub });
                const boards = await Question.distinct('board', { subject: sub });
                const classes = await Question.distinct('class', { subject: sub });
                console.log(`${sub}: ${count} questions (Boards: ${boards.join(', ')}, Classes: ${classes.join(', ')})`);
            }
        }

        // Also search for "CAccountancy" specifically
        const cAcc = await Question.distinct('subject', { subject: /CAccountancy/i });
        console.log('\n--- Found subjects containing "CAccountancy" ---');
        for (const sub of cAcc) {
            const count = await Question.countDocuments({ subject: sub });
            console.log(`${sub}: ${count} questions`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findAccBroad();
