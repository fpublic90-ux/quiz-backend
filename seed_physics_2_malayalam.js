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
  options: { type: mongoose.Schema.Types.Mixed, required: true },
  correctAnswer: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  medium: { type: String, required: true },
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
            'tmp_p2_malayalam_part1.json',
            'tmp_p2_malayalam_part2.json',
            'tmp_p2_malayalam_part3.json',
            'tmp_p2_malayalam_part4.json'
        ];
        
        let allQuestionsRaw = [];
        
        for (const file of files) {
            const data = fs.readFileSync(file, 'utf8');
            const questions = JSON.parse(data);
            allQuestionsRaw = allQuestionsRaw.concat(questions);
        }
        
        console.log(`Loaded ${allQuestionsRaw.length} total raw items from files.`);
        
        const questionsToInsert = [];
        let lastChapter = "General Physics";

        // deduplicate based on question text within the payload
        const uniquePayloads = [];
        const seenTexts = new Set();
        for (const q of allQuestionsRaw) {
             if (q.question && !seenTexts.has(q.question)) {
                 seenTexts.add(q.question);
                 uniquePayloads.push(q);
             }
        }

        for (let i = 0; i < uniquePayloads.length; i++) {
            let q = uniquePayloads[i];
            let questionText = q.question;
            let chapterName = q.chapter;
            
            if (!questionText) {
                questionText = q.chapter;
                chapterName = lastChapter;
            } else {
                lastChapter = q.chapter; // update last known chapter
            }

            let optA = (q.options && q.options.length > 0) ? q.options[0] : "None";
            let optB = (q.options && q.options.length > 1) ? q.options[1] : "None";
            let optC = (q.options && q.options.length > 2) ? q.options[2] : "None";
            let optD = (q.options && q.options.length > 3) ? q.options[3] : "None";
            
            let correctAnswerStr = "A";
            if (q.answer === optB) correctAnswerStr = "B";
            else if (q.answer === optC) correctAnswerStr = "C";
            else if (q.answer === optD) correctAnswerStr = "D";

            questionsToInsert.push({
                question: questionText,
                options: { A: optA, B: optB, C: optC, D: optD },
                correctAnswer: correctAnswerStr,
                subject: 'Physics 2',
                class: '+2',
                medium: 'Malayalam',
                difficulty: 'Medium',
                chapterName: chapterName || "General Physics",
                questionNumber: q.q || (i + 1)
            });
        }

        let insertedCount = 0;
        let skippedCount = 0;

        for (const targetQ of questionsToInsert) {
             const existing = await Question.findOne({
                 question: targetQ.question,
                 subject: targetQ.subject,            
                 class: targetQ.class,
                 medium: targetQ.medium
             });
             
             if (existing) {
                 skippedCount++;
             } else {
                 await Question.create(targetQ);
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
