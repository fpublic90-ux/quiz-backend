const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (!MONGODB_URI) throw new Error("No MONGODB_URI in .env");
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err);
    process.exit(1);
  }
};

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  board: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: Number, required: true },
  medium: { type: String, enum: ['English', 'Malayalam'], default: 'English' },
  chapter: { type: String, trim: true }
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const seedDatabase = async () => {
    try {
        await connectDB();
        
        const files = [
            'biology_questions_pt1.json',
            'biology_questions_pt2.json',
            'biology_questions_pt3.json'
        ];
        
        let totalInserted = 0;
        let totalSkipped = 0;

        for (const file of files) {
            console.log(`Processing ${file}...`);
            const data = fs.readFileSync(file, 'utf8');
            const questions = JSON.parse(data);
            
            for (const q of questions) {
                const targetQ = {
                    question: q.question,
                    options: q.options,
                    correctIndex: q.answer,
                    subject: 'Biology',
                    class: '+2',
                    board: 'Kerala State',
                    category: 'Student Center',
                    level: q.difficulty === 'hard' ? 3 : (q.difficulty === 'medium' ? 2 : 1),
                    medium: 'English',
                    chapter: q.chapter
                };

                const existing = await Question.findOne({
                    question: targetQ.question,
                    subject: targetQ.subject,
                    class: targetQ.class,
                    medium: targetQ.medium
                });

                if (existing) {
                    totalSkipped++;
                } else {
                    await Question.create(targetQ);
                    totalInserted++;
                }
            }
        }
        
        console.log(`Seeding complete. Inserted ${totalInserted} new questions. Skipped ${totalSkipped} duplicates.`);
        process.exit(0);
    } catch (e) {
        console.error("Error seeding:", e);
        process.exit(1);
    }
}

seedDatabase();
