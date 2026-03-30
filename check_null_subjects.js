const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String,
    question: String,
    content: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkNullSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const samples = await Question.find({ subject: null }).sort({ createdAt: -1 }).limit(10).lean();
        
        console.log('\n--- Sample questions with NULL Subject ---');
        if (samples.length === 0) {
            console.log('No null subjects found.');
        } else {
            samples.forEach(q => {
                const text = q.question || q.content || 'N/A';
                console.log(`ID: ${q._id}, Text: ${text.substring(0, 50)}...`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkNullSubjects();
