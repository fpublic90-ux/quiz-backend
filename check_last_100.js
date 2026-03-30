const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkLast100() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const recent = await Question.find().sort({ createdAt: -1 }).limit(100).lean();
        
        const subjectCounts = {};
        recent.forEach(q => {
            const sub = q.subject || 'NO SUBJECT';
            subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
        });

        console.log('\n--- Subject counts in last 100 questions ---');
        console.log(JSON.stringify(subjectCounts, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkLast100();
