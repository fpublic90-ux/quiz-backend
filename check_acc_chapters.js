const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    chapter: String,
    subject: String,
    createdAt: Date
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkAccountancyChapters() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check for chapters containing "Accountancy"
        const results = await Question.find({ chapter: /accountancy/i }).limit(5).lean();
        if (results.length > 0) {
            console.log(`Found ${results.length} questions where CHAPTER contains "Accountancy":`);
            results.forEach(r => console.log(`- Subject: ${r.subject}, Chapter: ${r.chapter}`));
        } else {
            console.log('No chapters found containing "Accountancy".');
        }

        // Check for "CAccountancy" anywhere
        const broad = await Question.find({
            $or: [
                { subject: /CAcc/i },
                { chapter: /CAcc/i },
                { question: /CAcc/i }
            ]
        }).limit(5).lean();
        
        if (broad.length > 0) {
            console.log(`Found ${broad.length} results for "CAcc":`);
            broad.forEach(r => console.log(`- Subject: ${r.subject}, Chapter: ${r.chapter}`));
        } else {
            console.log('No results found for "CAcc".');
        }

        // Check for LAST 500 questions subjects
        const last500 = await Question.distinct('subject', { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        console.log('\n--- Subjects added in last 24 hours ---');
        console.log(last500);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAccountancyChapters();
