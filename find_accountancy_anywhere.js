const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findAccountancyAnywhere() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Search for "Accountancy" anywhere in the document (text search or manual)
        // Since we don't have a text index on all fields, we'll search subject and content/question
        const results = await Question.find({
            $or: [
                { subject: /accountancy/i },
                { question: /accountancy/i },
                { content: /accountancy/i }
            ]
        }).limit(5).lean();

        if (results.length === 0) {
            console.log('No documents found containing "Accountancy" in subject or question.');
            
            // Try searching for just "Acc"
            const results2 = await Question.find({ subject: /acc/i }).limit(5).lean();
            if (results2.length > 0) {
                console.log('Found subjects containing "Acc":');
                results2.forEach(r => console.log(`- ${r.subject} (Board: ${r.board}, Class: ${r.class})`));
            } else {
                console.log('No documents found containing "Acc" in subject.');
            }
        } else {
            console.log(`Found ${results.length} documents matching "Accountancy":`);
            results.forEach(r => {
                console.log(`- Subject: ${r.subject}, Board: ${r.board}, Class: ${r.class}, Question: ${(r.question || r.content || '').substring(0, 30)}...`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findAccountancyAnywhere();
