require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Connection URI - Update if different
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const QuestionSchema = new mongoose.Schema({
  subject: String,
  class: String,
  category: String,
  chapter: String,
  question: String,
  options: [String],
  correctIndex: Number,
  level: Number,
  board: String,
  medium: String,
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean up existing Chemistry questions for +2 to avoid duplicates
    const deleteResult = await Question.deleteMany({
      subject: 'Chemistry',
      class: '+2',
      board: 'Kerala State'
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing +2 Chemistry questions.`);

    let allQuestions = [];
    
    // Read the 8 JSON parts
    for (let i = 1; i <= 8; i++) {
        const filePath = path.join(__dirname, `tmp_q_part${i}.json`);
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath);
            const partQuestions = JSON.parse(rawData);
            allQuestions = allQuestions.concat(partQuestions);
            console.log(`Loaded part ${i}: ${partQuestions.length} questions.`);
        } else {
            console.warn(`File not found: ${filePath}`);
        }
    }

    console.log(`Total loaded questions: ${allQuestions.length}`);

    const formattedQuestions = [];

    for (const q of allQuestions) {
        if (!q.question || !q.options || !q.answer) {
             console.warn(`Skipping invalid question: ${JSON.stringify(q)}`);
             continue;
        }

        const optionsArray = q.options;
        const answerText = String(q.answer).trim();
        let correctIndex = -1;

        // Find the index of the answer in the options array
        for (let i = 0; i < optionsArray.length; i++) {
            if (optionsArray[i].trim() === answerText) {
                correctIndex = i;
                break;
            }
        }

        if (correctIndex === -1 && answerText === 'A') correctIndex = 0;
        else if (correctIndex === -1 && answerText === 'B') correctIndex = 1;
        else if (correctIndex === -1 && answerText === 'C') correctIndex = 2;
        else if (correctIndex === -1 && answerText === 'D') correctIndex = 3;

        if (correctIndex === -1) {
             console.warn(`Could not find answer "${answerText}" in options [${optionsArray.join(', ')}] for question "${q.question}"`);
             continue;
        }

        formattedQuestions.push({
            subject: 'Chemistry',
            class: '+2',
            category: 'Plus Two',
            level: 1,
            board: 'Kerala State',
            medium: 'Malayalam',
            chapter: q.chapter || 'Part 1',
            question: q.question,
            options: optionsArray,
            correctIndex: correctIndex
        });
    }

    if (formattedQuestions.length > 0) {
        const insertResult = await Question.insertMany(formattedQuestions);
        console.log(`Successfully inserted ${insertResult.length} Chemistry questions for +2.`);
    } else {
        console.log('No valid questions found to insert.');
    }

  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    // Clean up tmp files
    for (let i = 1; i <= 8; i++) {
        const filePath = path.join(__dirname, `tmp_q_part${i}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
  }
}

seedData();
