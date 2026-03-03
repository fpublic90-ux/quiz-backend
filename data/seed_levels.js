require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const CATEGORIES = ['Geography', 'Science', 'Math', 'History', 'General Knowledge', 'Sports', 'Art', 'Literature', 'Biology', 'Tech'];

/**
 * Generate a simple math question for a specific level
 */
function generateMathQuestion(level, index) {
    const a = level * 2 + index;
    const b = level + index * 3;
    const answer = a + b;
    const options = [answer, answer + 5, answer - 3, answer + 10].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(answer);

    return {
        question: `What is ${a} + ${b}? (Level ${level})`,
        options: options.map(String),
        correctIndex,
        category: 'Mathematics',
        level: level
    };
}

/**
 * Generate a generic knowledge placeholder for a level
 */
function generateGenericQuestion(level, index, category) {
    return {
        question: `Sample ${category} Question #${index + 1} for Level ${level}`,
        options: ["Option A", "Option B", "Correct Option", "Option D"],
        correctIndex: 2,
        category: category,
        level: level
    };
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Level Seeding');

        await Question.deleteMany({});
        console.log('🗑️ Cleared existing questions');

        const allQuestions = [];

        // Generate 100 levels, 10 questions each = 1,000 questions
        for (let level = 1; level <= 100; level++) {
            for (let q = 0; q < 10; q++) {
                // Mix categories: Level % 10 decides primary category
                const catIndex = (level + q) % CATEGORIES.length;
                const category = CATEGORIES[catIndex];

                if (category === 'Math') {
                    allQuestions.push(generateMathQuestion(level, q));
                } else {
                    allQuestions.push(generateGenericQuestion(level, q, category));
                }
            }
            if (level % 10 === 0) console.log(`✍️ Prepared Level ${level}...`);
        }

        console.log(`🚀 Inserting ${allQuestions.length} questions...`);

        // Use bulkWrite or insertMany in chunks for 1,000 records
        const chunkSize = 200;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Seeded ${i + chunk.length}/1000...`);
        }

        await mongoose.disconnect();
        console.log('🏁 Bulk Seeding Complete!');
    } catch (err) {
        console.error('❌ Bulk Seed error:', err.message);
        process.exit(1);
    }
}

seed();
