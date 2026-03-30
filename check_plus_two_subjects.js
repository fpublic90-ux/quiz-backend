const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String,
    content: String,
    medium: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkAllPlusTwoSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjects = await Question.aggregate([
            { $match: { board: 'Kerala State', class: '+2' } },
            { $group: { _id: '$subject', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n--- All Subjects for +2 (Kerala State) ---');
        subjects.forEach(s => {
            console.log(`${s._id}: ${s.count} questions`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAllPlusTwoSubjects();
