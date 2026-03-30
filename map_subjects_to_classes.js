const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function mapSubjectsToClasses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const board = 'Kerala State';
        const classes = ['10th (SSLC)', '+1', '+2'];
        
        console.log('\n--- Subject to Class Mapping (Kerala State) ---');
        
        for (const cls of classes) {
            const subjects = await Question.distinct('subject', { board, class: cls });
            console.log(`\n[${cls}]:`);
            for (const sub of subjects) {
                const count = await Question.countDocuments({ board, class: cls, subject: sub });
                console.log(`  - ${sub} (${count} questions)`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

mapSubjectsToClasses();
