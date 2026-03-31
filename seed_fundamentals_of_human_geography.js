const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz_db';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, 'fundamentals_of_human_geography_questions.json');
    const questionsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let count = 0;
    for (const q of questionsData) {
      await Question.findOneAndUpdate(
        { 
          question: q.question,
          subject: 'Fundamentals of Human Geography',
          class: '+2'
        },
        {
          question: q.question,
          options: q.options,
          correctIndex: q.answer,
          subject: 'Fundamentals of Human Geography',
          chapter: q.chapter,
          class: '+2',
          board: 'Kerala State',
          category: 'Student Center',
          level: 1,
          medium: 'English'
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`Successfully seeded ${count} Fundamentals of Human Geography questions!`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
