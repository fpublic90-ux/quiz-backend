require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const CATEGORIES = [
    'Kerala', 'India', 'Technology', 'Science', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geology', 'Social Science', 'Mathematics',
    'IT', 'Sports', 'Economics', 'General Knowledge'
];

/**
 * Generate localized Kerala questions with more variety
 */
/**
 * Generate localized Kerala questions with difficulty scaling
 */
function generateKeralaQuestion(level, index) {
    const easyPool = [
        ["What is the capital of Kerala?", ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"]],
        ["Which is the state bird of Kerala?", ["Great Hornbill", "Peacock", "Parrot", "Cuckoo"]],
        ["How many districts are there in Kerala?", ["14", "13", "12", "15"]],
        ["Onam is the harvest festival of which state?", ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"]]
    ];

    const mediumPool = [
        ["Which is the longest river in Kerala?", ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"]],
        ["Who is known as the 'Father of Malayalam Literature'?", ["Thunchaththu Ezhuthachan", "Poonthanam", "Cherusseri", "Kunchan Nambiar"]],
        ["Silent Valley National Park is in which district?", ["Palakkad", "Idukki", "Wayanad", "Kottayam"]],
        ["Which city is known as the 'Venice of the East'?", ["Alappuzha", "Kochi", "Kollam", "Kannur"]]
    ];

    const hardPool = [
        ["Which district is known as the 'Gateway to Kerala'?", ["Palakkad", "Kasaragod", "Wayanad", "Idukki"]],
        ["Highest peak in Kerala?", ["Anamudi", "Agasthyarkoodam", "Meesapulimala", "Chembra Peak"]],
        ["Who was the first Chief Minister of Kerala?", ["E. M. S. Namboodiripad", "Pattom Thanu Pillai", "R. Sankar", "C. Achutha Menon"]],
        ["Which the first digital district in Kerala?", ["Palakkad", "Ernakulam", "Idukki", "Thrissur"]]
    ];

    let pool = easyPool;
    if (level > 100) pool = hardPool;
    else if (level > 40) pool = mediumPool;

    const item = pool[(index + level) % pool.length];
    return {
        question: level > 120 ? `${item[0]} (Expert)` : item[0],
        options: item[1].sort(() => Math.random() - 0.5),
        correctIndex: 0, // Placeholder, calculated later if needed but we rely on shuffle + finding
        category: 'Kerala',
        level: level
    };
}

/**
 * Generate localized India questions with difficulty scaling
 */
function generateIndiaQuestion(level, index) {
    const easyPool = [
        ["Who was the first PM of India?", ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "B.R. Ambedkar"]],
        ["National animal of India?", ["Tiger", "Lion", "Elephant", "Leopard"]],
        ["Year of Indian Independence?", ["1947", "1950", "1942", "1930"]],
        ["Location of Taj Mahal?", ["Agra", "Delhi", "Jaipur", "Lucknow"]]
    ];

    const mediumPool = [
        ["Largest state in India by area?", ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Uttar Pradesh"]],
        ["River known as 'Ganges of the South'?", ["Godavari", "Cauvery", "Krishna", "Narmada"]],
        ["'Silicon Valley of India'?", ["Bengaluru", "Hyderabad", "Pune", "Chennai"]],
        ["National flower of India?", ["Lotus", "Rose", "Jasmine", "Sunflower"]]
    ];

    const hardPool = [
        ["'Iron Man of India'?", ["Sardar Vallabhbhai Patel", "Subhash Bose", "Bhagat Singh", "Lala Lajpat Rai"]],
        ["Highest mountain peak in India?", ["Kanchenjunga", "Nanda Devi", "K2", "Anamudi"]],
        ["Who was the first woman President of India?", ["Pratibha Patil", "Indira Gandhi", "Srijana Singh", "Sarojini Naidu"]],
        ["The first battle of Panipat was fought in?", ["1526", "1556", "1761", "1516"]]
    ];

    let pool = easyPool;
    if (level > 100) pool = hardPool;
    else if (level > 40) pool = mediumPool;

    const item = pool[(index + level) % pool.length];
    return {
        question: item[0],
        options: item[1].sort(() => Math.random() - 0.5),
        correctIndex: 0,
        category: 'India',
        level: level
    };
}

/**
 * Generate a math question with true difficulty scaling
 */
function generateMathQuestion(level, index) {
    let a, b, op, question, answer;

    if (level <= 30) {
        // Easy: Simple addition/subtraction (1-20)
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        op = '+';
        answer = a + b;
        question = `What is ${a} + ${b}?`;
    } else if (level <= 80) {
        // Medium: Multiplication/Addition (1-50)
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 15) + 2;
        op = 'x';
        answer = a * b;
        question = `What is ${a} × ${b}?`;
    } else {
        // Hard: Mixed operations and larger numbers
        a = Math.floor(Math.random() * 100) + 50;
        b = Math.floor(Math.random() * 50) + 10;
        answer = a - b;
        question = `Solve: ${a} - ${b}`;
    }

    const options = [answer, answer + 5, answer - 3, answer + 10].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(answer);

    return {
        question,
        options: options.map(String),
        correctIndex,
        category: 'Mathematics',
        level: level
    };
}

/**
 * Enhanced Category Generic Generators
 */
function generateCategoryQuestion(level, index, category) {
    // We'll use a mix of fixed pools and generic variations
    const sciencePool = [
        ["Fastest planet in solar system?", ["Mercury", "Venus", "Earth", "Mars"]],
        ["Chemical symbol for Water?", ["H2O", "CO2", "NaCl", "O2"]],
        ["Largest organ in human body?", ["Skin", "Liver", "Heart", "Lungs"]],
        ["Red planet?", ["Mars", "Venus", "Jupiter", "Saturn"]]
    ];

    const techPool = [
        ["Who co-founded Microsoft?", ["Bill Gates", "Steve Jobs", "Elon Musk", "Mark Zuckerberg"]],
        ["Full form of CPU?", ["Central Processing Unit", "Control Power Unit", "Core Process Utility", "Central Proto Unit"]],
        ["Core language for Android?", ["Kotlin", "Swift", "Python", "Java"]],
        ["What does 'WWW' stand for?", ["World Wide Web", "World Word Web", "Web Wide World", "World Wide Way"]]
    ];

    let pool = sciencePool;
    if (category === 'IT' || category === 'Technology') pool = techPool;

    const item = pool[(index + level) % pool.length];

    return {
        question: `${item[0]}${level > 100 ? ' (Advanced)' : ''}`,
        options: item[1].sort(() => Math.random() - 0.5),
        correctIndex: 0,
        category: category,
        level: level
    };
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Enhanced Seeding');

        await Question.deleteMany({});
        console.log('🗑️ Cleared existing questions');

        const allQuestions = [];

        for (let level = 1; level <= 200; level++) {
            for (const category of CATEGORIES) {
                // Generate 15 unique questions per level/category to allow for repetition prevention
                for (let q = 0; q < 15; q++) {
                    let qObj;
                    if (category === 'Kerala') qObj = generateKeralaQuestion(level, q);
                    else if (category === 'India') qObj = generateIndiaQuestion(level, q);
                    else if (category === 'Mathematics') qObj = generateMathQuestion(level, q);
                    else qObj = generateCategoryQuestion(level, q, category);

                    // Finalize correctIndex after internal shuffles
                    const originalCorrect = qObj.options[qObj.correctIndex];
                    qObj.options.sort(() => Math.random() - 0.5);
                    qObj.correctIndex = qObj.options.indexOf(originalCorrect);

                    allQuestions.push(qObj);
                }
            }
            if (level % 20 === 0) console.log(`✍️ Prepared Level ${level}...`);
        }

        console.log(`🚀 Inserting ${allQuestions.length} enhanced questions...`);
        const chunkSize = 1000;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Seeded ${i + chunk.length}/${allQuestions.length}...`);
        }

        await mongoose.disconnect();
        console.log('🏁 Enhanced Seeding Complete!');
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
}

seed();
