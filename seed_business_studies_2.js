require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('./models/Question');

async function seedBusiness_Studies_2() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz_app';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const dataFiles = [
      'data/business_studies_2_questions_part1.json',
      'data/business_studies_2_questions_part2.json'
    ];

    const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

    let totalInserted = 0;
    let totalSkipped = 0;
    let questionCounter = 0;

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, file);
      const questionsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      for (const q of questionsData) {
        questionCounter++;
        // Assign level: 10 questions per level (1-10 -> level 1, 11-20 -> level 2, etc.)
        const level = Math.ceil(questionCounter / 10);

        const questionData = {
          question: q.question,
          options: q.options.map(opt => opt.replace(/^[A-D]\.\s*/, '')), // Clean "A. " from options
          correctIndex: answerMap[q.correct],
          explanation: q.explanation || '',
          subject: 'Business Studies 2',
          chapter: q.chapter,
          board: 'Kerala State',
          class: 'Plus Two',
          medium: 'English',
          level: level,
          category: 'Educational'
        };

        // Check for duplicates
        const existing = await Question.findOne({
          subject: questionData.subject,
          question: questionData.question
        });

        if (!existing) {
          await Question.create(questionData);
          totalInserted++;
        } else {
          totalSkipped++;
        }
      }
      console.log(`Finished processing ${file}`);
    }

    console.log(`\n✨ Seeding completed for Business Studies 2!`);
    console.log(`✅ Total Inserted: ${totalInserted}`);
    console.log(`⏩ Total Skipped (Duplicates): ${totalSkipped}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedBusiness_Studies_2();
