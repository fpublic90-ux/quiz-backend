const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String,
    createdAt: Date
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkRecentQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check last 100 questions
        const recent = await Question.find().sort({ createdAt: -1 }).limit(10).lean();
        
        console.log('\n--- 10 Most Recent Questions ---');
        recent.forEach(q => {
            console.log(`ID: ${q._id}, Board: ${q.board}, Class: ${q.class}, Subject: ${q.subject}, CreatedAt: ${q.createdAt}`);
        });

        const allSubjects = await Question.distinct('subject');
        console.log('\n--- All Subjects in DB (Full List) ---');
        console.log(allSubjects.sort().join(', '));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkRecentQuestions();
