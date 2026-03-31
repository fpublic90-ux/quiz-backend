const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (!MONGODB_URI) throw new Error("No MONGODB_URI in .env");
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB error:', err);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        const data = fs.readFileSync('politics_in_india_questions.json', 'utf8');
        const rawQuestions = JSON.parse(data);

        console.log(`Loaded ${rawQuestions.length} questions from JSON.`);

        const questionsToInsert = rawQuestions.map((q, index) => {
            let level = 1;
            if (q.difficulty.toLowerCase() === 'medium') level = 2;
            if (q.difficulty.toLowerCase() === 'hard') level = 3;

            return {
                question: q.question,
                options: q.options,
                correctIndex: q.answer,
                category: 'Student Center',
                level: level,
                board: 'Kerala State',
                class: '+2',
                medium: 'English',
                subject: 'Politics in India since Independence',
                chapter: q.chapter
            };
        });

        let insertedCount = 0;
        let skippedCount = 0;

        for (const targetQ of questionsToInsert) {
            const existing = await Question.findOne({
                question: targetQ.question,
                subject: targetQ.subject,
                class: targetQ.class,
                board: targetQ.board,
                medium: targetQ.medium
            });

            if (existing) {
                skippedCount++;
            } else {
                await Question.create(targetQ);
                insertedCount++;
                if (insertedCount % 20 === 0) console.log(`Inserted ${insertedCount} questions...`);
            }
        }

        console.log(`\n✨ Part 2 Seeding complete!`);
        console.log(`✅ Inserted: ${insertedCount}`);
        console.log(`⏩ Skipped Duplicates: ${skippedCount}`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
