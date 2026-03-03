require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const CATEGORIES = [
    'Kerala', 'India', 'Technology', 'Science', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geology', 'Social Science', 'Mathematics',
    'IT', 'Sports', 'Economics', 'General Knowledge'
];

/**
 * Generate localized Kerala questions
 */
function generateKeralaQuestion(level, index) {
    const questions = [
        "What is the capital of Kerala?",
        "Which is the state bird of Kerala?",
        "How many districts are there in Kerala?",
        "Which festival is known as the harvest festival of Kerala?",
        "Which is the longest river in Kerala?",
        "Who is known as the 'Father of Malayalam Literature'?",
        "Which district is known as the 'Gateway to Kerala'?",
        "Where is the Silent Valley National Park located?",
        "Which city in Kerala is known as the 'Venice of the East'?",
        "What is the traditional dance form of Kerala?"
    ];
    const answers = [
        ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
        ["Great Hornbill", "Peacock", "Parrot", "Cuckoo"],
        ["12", "13", "14", "15"],
        ["Onam", "Vishu", "Eid", "Christmas"],
        ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"],
        ["Thunchaththu Ezhuthachan", "Poonthanam", "Cherusseri", "Kunchan Nambiar"],
        ["Palakkad", "Kasaragod", "Wayanad", "Idukki"],
        ["Palakkad", "Idukki", "Wayanad", "Kottayam"],
        ["Alappuzha", "Kochi", "Kollam", "Kannur"],
        ["Kathakali", "Bharatanatyam", "Kuchipudi", "Odissi"]
    ];
    const qIdx = index % questions.length;
    return {
        question: `${questions[qIdx]} (Lvl ${level})`,
        options: answers[qIdx],
        correctIndex: 0, // Simplified for seed
        category: 'Kerala',
        level: level
    };
}

/**
 * Generate localized India questions
 */
function generateIndiaQuestion(level, index) {
    const questions = [
        "Who was the first Prime Minister of India?",
        "Which is the national animal of India?",
        "How many states are there in India?",
        "Which is the largest state in India by area?",
        "When did India get independence?",
        "Which river is known as the 'Ganges of the South'?",
        "Who is known as the 'Iron Man of India'?",
        "Which is the highest mountain peak in India?",
        "Where is the Taj Mahal located?",
        "Which city is known as the 'Silicon Valley of India'?"
    ];
    const answers = [
        ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "B.R. Ambedkar"],
        ["Tiger", "Lion", "Elephant", "Leopard"],
        ["28", "29", "27", "26"],
        ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Uttar Pradesh"],
        ["1947", "1950", "1942", "1930"],
        ["Godavari", "Cauvery", "Krishna", "Narmada"],
        ["Sardar Vallabhbhai Patel", "Subhash Chandra Bose", "Bhagat Singh", "Lala Lajpat Rai"],
        ["Kanchenjunga", "Nanda Devi", "K2", "Anamudi"],
        ["Agra", "Delhi", "Jaipur", "Lucknow"],
        ["Bengaluru", "Hyderabad", "Pune", "Chennai"]
    ];
    const qIdx = index % questions.length;
    return {
        question: `${questions[qIdx]} (Lvl ${level})`,
        options: answers[qIdx],
        correctIndex: 0,
        category: 'India',
        level: level
    };
}

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

        // Generate 200 levels, 10 questions each = 2,000 questions
        for (let level = 1; level <= 200; level++) {
            for (let q = 0; q < 10; q++) {
                // Mix categories
                const catIndex = (level + q) % CATEGORIES.length;
                const category = CATEGORIES[catIndex];

                if (category === 'Kerala') {
                    allQuestions.push(generateKeralaQuestion(level, q));
                } else if (category === 'India') {
                    allQuestions.push(generateIndiaQuestion(level, q));
                } else if (category === 'Mathematics') {
                    allQuestions.push(generateMathQuestion(level, q));
                } else {
                    allQuestions.push(generateGenericQuestion(level, q, category));
                }
            }
            if (level % 20 === 0) console.log(`✍️ Prepared Level ${level}...`);
        }

        console.log(`🚀 Inserting ${allQuestions.length} questions...`);

        // Use bulkWrite or insertMany in chunks for 2,000 records
        const chunkSize = 250;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Seeded ${i + chunk.length}/2000...`);
        }

        await mongoose.disconnect();
        console.log('🏁 Bulk Seeding Complete!');
    } catch (err) {
        console.error('❌ Bulk Seed error:', err.message);
        process.exit(1);
    }
}

seed();
