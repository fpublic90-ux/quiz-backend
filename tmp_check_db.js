require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

async function checkCategories() {
    try {
        await mongoose.connect(MONGODB_URI);
        const categories = await Question.distinct('category');
        console.log('Categories:', categories);
        const classes = await Question.distinct('class');
        console.log('Classes:', classes);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkCategories();
