const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String,
    class: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function finalAccCheck() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const allSubs = await Question.distinct('subject');
        const acc = allSubs.filter(s => s && s.toLowerCase().includes('acc'));
        
        console.log('\n--- Final Accountancy Check (All Boards) ---');
        if (acc.length === 0) {
            console.log('STILL NO ACCOUNTANCY SUBJECTS FOUND.');
        } else {
            for (const s of acc) {
                const count = await Question.countDocuments({ subject: s });
                const cls = await Question.distinct('class', { subject: s });
                console.log(`- ${s} (${count} questions, Classes: ${cls.join(', ')})`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

finalAccCheck();
