const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkAccountancy() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const board = 'Kerala State';
        const searchTerms = ['Accountancy', 'accountancy'];
        
        console.log('\n--- Accountancy Subjects Audit (Kerala State) ---');
        
        const allSubjects = await Question.distinct('subject', { board });
        const accountancyLike = allSubjects.filter(s => s && (s.toLowerCase().includes('accountancy') || s.toLowerCase().includes('acc')));
        
        if (accountancyLike.length === 0) {
            console.log('No Accountancy-like subjects found in DB.');
        } else {
            for (const sub of accountancyLike) {
                const totalCount = await Question.countDocuments({ board, subject: sub });
                const classes = await Question.distinct('class', { board, subject: sub });
                console.log(`${sub}: ${totalCount} questions (Classes: ${classes.join(', ') || 'None'})`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAccountancy();
