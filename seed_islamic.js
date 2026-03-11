require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const islamicQuestions = [
    {
        question: "Who was the last Prophet in Islam?",
        options: ["Prophet Ibrahim (AS)", "Prophet Musa (AS)", "Prophet Muhammad (SAW)", "Prophet Isa (AS)"],
        correctIndex: 2,
        level: 1,
        category: "Islamic"
    },
    {
        question: "How many pillars of Islam are there?",
        options: ["3", "4", "5", "6"],
        correctIndex: 2,
        level: 1,
        category: "Islamic"
    },
    {
        question: "Which month is the month of fasting (Sawm)?",
        options: ["Muharram", "Ramadan", "Shawwal", "Dhul-Hijjah"],
        correctIndex: 1,
        level: 1,
        category: "Islamic"
    },
    {
        question: "What is the first month of the Islamic (Hijri) calendar?",
        options: ["Ramadan", "Muharram", "Safar", "Rajab"],
        correctIndex: 1,
        level: 1,
        category: "Islamic"
    },
    {
        question: "To which city did the Prophet Muhammad (SAW) migrate during the Hijrah?",
        options: ["Mecca", "Medina", "Jerusalem", "Taif"],
        correctIndex: 1,
        level: 2,
        category: "Islamic"
    },
    {
        question: "What is the holy book revealed to Prophet Muhammad (SAW)?",
        options: ["Torah", "Injeel", "Quran", "Zabur"],
        correctIndex: 2,
        level: 1,
        category: "Islamic"
    },
    {
        question: "How many times a day is a Muslim required to perform Fard prayers?",
        options: ["3", "5", "7", "2"],
        correctIndex: 1,
        level: 1,
        category: "Islamic"
    }
];

async function seedIslamic() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const q of islamicQuestions) {
            const exists = await Question.findOne({
                question: q.question,
                category: q.category
            });

            if (!exists) {
                await Question.create(q);
                console.log(`Added: ${q.question.substring(0, 40)}...`);
            } else {
                console.log(`Skipped (Duplicate): ${q.question.substring(0, 40)}...`);
            }
        }

        console.log('✨ Islamic questions seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

seedIslamic();
