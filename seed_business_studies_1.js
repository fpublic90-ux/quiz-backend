require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('./models/Question');

async function seedBusinessStudies1() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz_app';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const dataFiles = [
      'data/business_studies_1_questions_part1.json',
      'data/business_studies_1_questions_part2.json'
    ];

    let totalInserted = 0;
    let totalSkipped = 0;

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, file);
      const questionsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      for (const q of questionsData) {
        // Map difficulty to numerical level
        let level = 1;
        if (q.difficulty === 'hard') level = 2;

        const questionData = {
          question: q.question, // Fixed: field name is 'question'
          options: q.options,
          correctIndex: q.answer, // Fixed: field name is 'correctIndex'
          explanation: q.explanation || '',
          subject: 'Business Studies 1',
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
          question: questionData.question // Fixed matching field
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

    console.log(`\n✨ Seeding completed!`);
    console.log(`✅ Total Inserted: ${totalInserted}`);
    console.log(`⏩ Total Skipped (Duplicates): ${totalSkipped}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedBusinessStudies1();
