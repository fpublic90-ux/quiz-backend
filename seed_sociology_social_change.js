const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('./models/Question');

const MONGODB_URI = 'mongodb://localhost:27017/quiz_app';

async function seedSociologySocialChange() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const dataFiles = [
      'data/sociology_social_change_questions_part1.json',
      'data/sociology_social_change_questions_part2.json',
      'data/sociology_social_change_questions_part3.json'
    ];

    let totalInserted = 0;
    let totalSkipped = 0;

    for (const file of dataFiles) {
      const filePath = path.join(__dirname, file);
      const questionsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      for (const q of questionsData) {
        // Map difficulty to numerical level if needed (defaulting to 1 for easy/medium, 2 for hard)
        let level = 1;
        if (q.difficulty === 'hard') level = 2;

        const questionData = {
          subject: 'Social Change and Development in India',
          chapter: q.chapter,
          questionText: q.question,
          options: q.options,
          correctOptionIndex: q.answer,
          explanation: q.explanation || '',
          level: level
        };

        // Check for duplicates
        const existing = await Question.findOne({
          subject: questionData.subject,
          questionText: questionData.questionText
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

    console.log(`Seeding completed!`);
    console.log(`Total Inserted: ${totalInserted}`);
    console.log(`Total Skipped (Duplicates): ${totalSkipped}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedSociologySocialChange();
