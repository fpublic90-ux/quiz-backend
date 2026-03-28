require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        const result = await Question.deleteMany({ 
            subject: 'Social Work', 
            class: '10th (SSLC)' 
        });
        console.log(`✅ Deleted ${result.deletedCount} incorrect SSLC questions.`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

cleanup();
