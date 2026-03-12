require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

async function checkCount() {
    try {
        await mongoose.connect(MONGODB_URI);
        const count = await Question.countDocuments({ category: 'Islamic' });
        console.log(`\n📊 Total Islamic Questions in DB: ${count}`);
        
        const samples = await Question.find({ category: 'Islamic' }).limit(5);
        console.log('\n📝 Sample Islamic Questions:');
        samples.forEach(q => console.log(`- ${q.question}`));
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkCount();
