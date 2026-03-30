const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function checkPlusTwoBroad() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjects = await Question.distinct('subject', { board: 'Kerala State', class: '+2' });
        console.log('\n--- ALL +2 Subjects in DB ---');
        console.log(subjects.sort());

        const anyAcc = await Question.findOne({
            $or: [
                { subject: /acc/i },
                { question: /acc/i },
                { content: /acc/i }
            ]
        });
        
        if (anyAcc) {
            console.log('Found something with "acc":', JSON.stringify(anyAcc, null, 2));
        } else {
            console.log('Nothing found with "acc" in any field.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkPlusTwoBroad();
