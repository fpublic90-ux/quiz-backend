require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function checkDuplicates() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app');
        console.log('Connected to MongoDB');
        
        const q = await Question.aggregate([
            { $match: { subject: 'Kerala Padavali', medium: 'Malayalam' } },
            { $group: { _id: '$question', count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        console.log('Duplicates in Malayalam:', q);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
checkDuplicates();
