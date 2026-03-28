require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB Connection URI
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

async function migrateChemistry() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Migration');

    // Find all questions where subject is exactly "Chemistry" and class is "+2"
    // and update them to "Chemistry 1"
    const updateResult = await Question.updateMany(
      { subject: 'Chemistry', class: '+2' },
      { $set: { subject: 'Chemistry 1' } }
    );

    console.log(`Successfully migrated ${updateResult.modifiedCount} questions from "Chemistry" to "Chemistry 1".`);

  } catch (error) {
    console.error('Error migrating data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateChemistry();
