const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String,
    question: String,
    content: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkCSContent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const csQuestions = await Question.find({ subject: /Computer Science/i }).lean();
        
        console.log(`\n--- Checking ${csQuestions.length} Computer Science questions for Accountancy content ---`);
        
        let found = 0;
        csQuestions.forEach(q => {
            const text = (q.question || q.content || '').toLowerCase();
            if (text.includes('accountancy') || text.includes('ledger') || text.includes('balance sheet') || text.includes('reconciliation')) {
                console.log(`- ID: ${q._id}, Subject: ${q.subject}, Question: ${text.substring(0, 50)}...`);
                found++;
            }
        });

        if (found === 0) {
            console.log('No Accountancy-related terms found in CS questions.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkCSContent();
