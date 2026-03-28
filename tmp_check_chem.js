require('dotenv').config();
const mongoose = require('mongoose');
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
  medium: String
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkDb() {
    try {
        await mongoose.connect(MONGODB_URI);
        const count = await Question.countDocuments({ subject: 'Chemistry', class: '+2' });
        console.log(`Found ${count} Chemistry questions for +2 class.`);
        
        if (count > 0) {
            const sample = await Question.findOne({ subject: 'Chemistry', class: '+2' });
            console.log('Sample question:', JSON.stringify(sample, null, 2));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDb();
