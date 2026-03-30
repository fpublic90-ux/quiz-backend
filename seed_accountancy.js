const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    medium: String,
    subject: String,
    chapter: String,
    question: String,
    options: [String],
    correctIndex: Number,
    level: { type: Number, default: 1 },
    category: String,
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function seedAccountancy() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const data = JSON.parse(fs.readFileSync('accountancy_questions.json', 'utf8'));
        
        for (const item of data) {
            const fullChapterName = item.chapter;
            // Extract subject and chapter
            // Format: "Accountancy X - Chapter Name"
            const parts = fullChapterName.split(' - ');
            const subject = parts[0]; // e.g., "Accountancy 1"
            const chapter = parts[1]; // e.g., "Not-for-Profit Organisation"
            
            console.log(`Seeding ${item.questions.length} questions for ${subject}: ${chapter}...`);
            
            const questionsToInsert = item.questions.map(q => ({
                board: 'Kerala State',
                class: '+2',
                medium: 'English',
                subject: subject,
                chapter: chapter,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                level: 1,
                category: subject,
                createdAt: new Date()
            }));

            await Question.insertMany(questionsToInsert);
        }

        console.log('Accountancy questions seeded successfully!');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

seedAccountancy();
