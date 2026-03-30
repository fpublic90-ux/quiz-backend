const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    chapter: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkCSChapters() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const board = 'Kerala State';
        const classes = ['+1', '+2'];
        
        for (const cls of classes) {
            const subjects = ['Computer Science 1', 'Computer Science 2', 'Computer Science'];
            for (const sub of subjects) {
                const chapters = await Question.distinct('chapter', { board, class: cls, subject: sub });
                if (chapters.length > 0) {
                    console.log(`\n[${cls}] ${sub} Chapters:`);
                    chapters.sort().forEach(c => console.log(`  - ${c}`));
                }
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkCSChapters();
