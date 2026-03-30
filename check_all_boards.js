const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkAllBoards() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const boards = await Question.distinct('board');
        console.log('\n--- All Boards in DB ---');
        console.log(boards);

        for (const b of boards) {
            const subjects = await Question.distinct('subject', { board: b });
            const acc = subjects.filter(s => s && s.toLowerCase().includes('acc'));
            if (acc.length > 0) {
                console.log(`Board [${b}] has Accountancy subjects:`, acc);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAllBoards();
