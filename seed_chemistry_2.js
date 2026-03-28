const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("No MONGODB_URI in .env");
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err);
    process.exit(1);
  }
};

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: mongoose.Schema.Types.Mixed, required: true },
  correctAnswer: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  difficulty: { type: String, required: true },
  chapterName: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const seedDatabase = async () => {
    try {
        await connectDB();
        
        const files = [
            'tmp_c2_part1.json',
            'tmp_c2_part2.json',
            'tmp_c2_part3.json',
            'tmp_c2_part4.json'
        ];
        
        let allQuestions = [];
        
        for (const file of files) {
            const data = fs.readFileSync(file, 'utf8');
            const questions = JSON.parse(data);
            allQuestions = allQuestions.concat(questions);
        }
        
        console.log(`Loaded ${allQuestions.length} total questions from files.`);
        
        const questionsToInsert = allQuestions.map((q) => {
            return {
                question: q.question,
                options: q.options,
                correctAnswer: q.correct_answer,
                subject: 'Chemistry 2',
                class: '+2',
                difficulty: 'Medium',
                chapterName: q.chapter,
                questionNumber: q.question_number
            }
        });

        let insertedCount = 0;
        let skippedCount = 0;

        for (const q of questionsToInsert) {
             const existing = await Question.findOne({
                 question: q.question,
                 subject: q.subject,            
                 class: q.class
             });
             if (existing) {
                 skippedCount++;
             } else {
                 await Question.create(q);
                 insertedCount++;
             }
        }
        
        console.log(`Seeding complete. Inserted ${insertedCount} new questions. Skipped ${skippedCount} duplicate questions.`);
        
        process.exit(0);

    } catch (e) {
        console.error("Error seeding:", e);
        process.exit(1);
    }
}

seedDatabase();
