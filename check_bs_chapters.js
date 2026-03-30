const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    chapter: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkBSChapters() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const board = 'Kerala State';
        const classes = ['+1', '+2'];
        
        for (const cls of classes) {
            const subjects = ['Business Studies 1', 'Business Studies 2'];
            for (const sub of subjects) {
                const chapters = await Question.distinct('chapter', { board, class: cls, subject: sub });
                console.log(`\n[${cls}] ${sub} Chapters:`);
                chapters.sort().forEach(c => console.log(`  - ${c}`));
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkBSChapters();
