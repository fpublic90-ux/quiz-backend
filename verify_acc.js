const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String,
    class: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function verifyAcc() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjects = ['Accountancy 1', 'Accountancy 2', 'Accountancy 3'];
        
        console.log('\n--- Accountancy Verification ---');
        for (const s of subjects) {
            const count = await Question.countDocuments({ subject: s, class: '+2' });
            console.log(`${s}: ${count} questions`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

verifyAcc();
