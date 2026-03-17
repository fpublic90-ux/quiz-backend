require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function checkSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app');
        console.log('Connected to MongoDB');
        
        const engSubjects = await Question.distinct('subject', {class: '10th (SSLC)', board: 'Kerala State', medium: 'English'});
        console.log('English Medium Subjects:', engSubjects);
        
        const malSubjects = await Question.distinct('subject', {class: '10th (SSLC)', board: 'Kerala State', medium: 'Malayalam'});
        console.log('Malayalam Medium Subjects:', malSubjects);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
checkSubjects();
