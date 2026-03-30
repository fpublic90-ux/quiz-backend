const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String,
    question: String,
    content: String,
    createdAt: Date
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkLastHour() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recent = await Question.find({ createdAt: { $gt: oneHourAgo } }).lean();
        
        console.log(`\n--- Questions added in the last hour: ${recent.length} ---`);
        
        const subjects = [...new Set(recent.map(q => q.subject))];
        console.log('Subjects found:', subjects);

        if (recent.length > 0 && subjects.length === 0) {
             console.log('Wait, questions exist but subjects are missing/null.');
             recent.forEach(q => console.log(`- ID: ${q._id}, Question: ${(q.question || q.content || '').substring(0, 30)}`));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkLastHour();
