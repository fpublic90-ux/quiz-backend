const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctIndex: Number,
    category: String,
    level: Number,
    medium: { type: String, default: 'English' }
}, { strict: false });

const Question = mongoose.model('Question', questionSchema);

async function seedPSC() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Clear existing PSC questions
        console.log('Deleting old PSC questions...');
        await Question.deleteMany({ category: 'PSC' });

        // 2. Load all parts
        const pt1 = JSON.parse(fs.readFileSync('psc_new_pt1.json', 'utf8'));
        const pt2 = JSON.parse(fs.readFileSync('psc_new_pt2.json', 'utf8'));
        const pt3 = JSON.parse(fs.readFileSync('psc_new_pt3.json', 'utf8'));

        const allRawQuestions = [...pt1, ...pt2, ...pt3];
        console.log(`Total raw questions loaded: ${allRawQuestions.length}`);

        const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

        // 3. Re-index into levels of 10
        const questionsToInsert = allRawQuestions.map((q, index) => {
            const level = Math.floor(index / 10) + 1;
            
            // Extract options array from object { "A": "...", "B": "..." }
            const options = [
                q.options.A,
                q.options.B,
                q.options.C,
                q.options.D
            ];

            return {
                question: q.question,
                options: options,
                correctIndex: answerMap[q.correctAnswer],
                category: 'PSC',
                level: level,
                medium: 'English',
                createdAt: new Date()
            };
        });

        console.log(`Inserting ${questionsToInsert.length} questions into ${Math.ceil(questionsToInsert.length / 10)} levels...`);
        
        await Question.insertMany(questionsToInsert);

        console.log('PSC Questions seeded successfully!');
        
        // Final Summary
        const finalCount = await Question.countDocuments({ category: 'PSC' });
        console.log(`Total PSC questions now in DB: ${finalCount}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding PSC questions:', err);
    }
}

seedPSC();
