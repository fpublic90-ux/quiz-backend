const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String,
    createdAt: Date
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkHistory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const board = 'Kerala State';
        const classes = ['+1', '+2', '10th (SSLC)'];
        
        console.log('\n--- History Subjects Audit (Kerala State) ---');
        
        const allSubjects = await Question.distinct('subject', { board });
        const historyLike = allSubjects.filter(s => s && s.toLowerCase().includes('history'));
        
        if (historyLike.length === 0) {
            console.log('No History-like subjects found in DB.');
        } else {
            for (const sub of historyLike) {
                const totalCount = await Question.countDocuments({ board, subject: sub });
                const clsList = await Question.distinct('class', { board, subject: sub });
                console.log(`${sub}: ${totalCount} questions (Classes: ${clsList.join(', ')})`);
            }
        }

        // Check for subjects added in the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentSubjects = await Question.distinct('subject', { createdAt: { $gt: oneHourAgo } });
        console.log('\n--- Subjects added in the last hour ---');
        console.log(recentSubjects);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkHistory();
