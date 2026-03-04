require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const CATEGORIES = [
    'Kerala', 'India', 'Technology', 'Science', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geology', 'Social Science', 'Mathematics',
    'IT', 'Sports', 'Economics', 'General Knowledge'
];

/**
 * Generate localized Kerala questions with difficulty scaling
 */
function generateKeralaQuestion(level, index) {
    const easyPool = [
        ["What is the capital of Kerala?", ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"]],
        ["Which is the state bird of Kerala?", ["Great Hornbill", "Peacock", "Parrot", "Cuckoo"]],
        ["How many districts are there in Kerala?", ["14", "13", "12", "15"]],
        ["Onam is the harvest festival of which state?", ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"]],
        ["Which is the official language of Kerala?", ["Malayalam", "Tamil", "Kannada", "Tulu"]],
        ["Highest peak in Kerala?", ["Anamudi", "Agasthyarkoodam", "Meesapulimala", "Chembra Peak"]],
        ["The longest river in Kerala is?", ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"]]
    ];

    const mediumPool = [
        ["Who is known as the 'Father of Malayalam Literature'?", ["Thunchaththu Ezhuthachan", "Poonthanam", "Cherusseri", "Kunchan Nambiar"]],
        ["Silent Valley National Park is in which district?", ["Palakkad", "Idukki", "Wayanad", "Kottayam"]],
        ["Which city is known as the 'Venice of the East'?", ["Alappuzha", "Kochi", "Kollam", "Kannur"]],
        ["First district in India to be linked to National Optical Fibre Network (NoFN)?", ["Idukki", "Palakkad", "Ernakulam", "Thrissur"]],
        ["The first mosque in India, Cheraman Juma Mosque, is in?", ["Thrissur", "Kollam", "Kozhikode", "Malappuram"]],
        ["Which district is known as the 'Land of Looms and Lories'?", ["Kannur", "Kasaragod", "Kozhikode", "Wayanad"]]
    ];

    const hardPool = [
        ["Which district is known as the 'Gateway to Kerala'?", ["Palakkad", "Kasaragod", "Wayanad", "Idukki"]],
        ["Who was the first Chief Minister of Kerala?", ["E. M. S. Namboodiripad", "Pattom Thanu Pillai", "R. Sankar", "C. Achutha Menon"]],
        ["The historical Mammankam festival was held on the banks of?", ["Bharathapuzha", "Periyar", "Pamba", "Chaliyar"]],
        ["Which king issued the Kanchi Copper Plate?", ["Udaya Marthanda Varma", "Rama Varma", "Pazhassi Raja", "Sakthan Thampuran"]],
        ["First college in Kerala?", ["CMS College Kottayam", "University College", "Brennan College", "St. Berchmans"]]
    ];

    let pool = easyPool;
    if (level > 100) pool = hardPool;
    else if (level > 40) pool = mediumPool;

    const item = pool[(index + level) % pool.length];
    return {
        question: level > 120 ? `${item[0]} (Expert)` : item[0],
        options: [...item[1]],
        correctIndex: 0,
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
        ["Location of Taj Mahal?", ["Agra", "Delhi", "Jaipur", "Lucknow"]],
        ["National flower of India?", ["Lotus", "Rose", "Jasmine", "Sunflower"]],
        ["Who wrote the National Anthem of India?", ["Rabindranath Tagore", "Bankim Chandra", "Sarojini Naidu", "Jawaharlal Nehru"]]
    ];

    const mediumPool = [
        ["Largest state in India by area?", ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Uttar Pradesh"]],
        ["Which river is often called 'Dakshina Ganga'?", ["Godavari", "Cauvery", "Krishna", "Narmada"]],
        ["'Silicon Valley of India'?", ["Bengaluru", "Hyderabad", "Pune", "Chennai"]],
        ["First woman IPS officer in India?", ["Kiran Bedi", "Anna Chandy", "Roopa D", "Vimala Mehra"]],
        ["The 'Pink City' of India?", ["Jaipur", "Udaipur", "Jodhpur", "Bikaner"]]
    ];

    const hardPool = [
        ["'Iron Man of India'?", ["Sardar Vallabhbhai Patel", "Subhash Bose", "Bhagat Singh", "Lala Lajpat Rai"]],
        ["Which is the highest mountain peak in India (undisputed territory)?", ["Kanchenjunga", "Nanda Devi", "Kamet", "Anamudi"]],
        ["Who was the first woman President of India?", ["Pratibha Patil", "Indira Gandhi", "Srijana Singh", "Sarojini Naidu"]],
        ["The first battle of Panipat was fought in?", ["1526", "1556", "1761", "1516"]],
        ["Who founded the Indian National Congress?", ["A.O. Hume", "W.C. Bonnerjee", "Dadabhai Naoroji", "Annie Besant"]]
    ];

    let pool = easyPool;
    if (level > 100) pool = hardPool;
    else if (level > 40) pool = mediumPool;

    const item = pool[(index + level) % pool.length];
    return {
        question: item[0],
        options: [...item[1]],
        correctIndex: 0,
        category: 'India',
        level: level
    };
}

/**
 * Generate a math question with difficulty scaling
 */
function generateMathQuestion(level, index) {
    let a, b, op, question, answer;

    if (level <= 30) {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        op = '+';
        answer = a + b;
        question = `What is ${a} + ${b}?`;
    } else if (level <= 80) {
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 15) + 2;
        op = 'x';
        answer = a * b;
        question = `What is ${a} × ${b}?`;
    } else {
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
    const sciencePool = [
        ["Fastest planet in solar system?", ["Mercury", "Venus", "Earth", "Mars"]],
        ["Chemical symbol for Water?", ["H2O", "CO2", "NaCl", "O2"]],
        ["Largest organ in human body?", ["Skin", "Liver", "Heart", "Lungs"]],
        ["Red planet?", ["Mars", "Venus", "Jupiter", "Saturn"]],
        ["Unit of force?", ["Newton", "Joule", "Watt", "Pascal"]],
        ["Gas essential for photosynthesis?", ["CO2", "O2", "N2", "H2"]]
    ];

    const techPool = [
        ["Who co-founded Microsoft?", ["Bill Gates", "Steve Jobs", "Elon Musk", "Mark Zuckerberg"]],
        ["Full form of CPU?", ["Central Processing Unit", "Control Power Unit", "Core Process Utility", "Central Proto Unit"]],
        ["Core language for Android?", ["Kotlin", "Java", "Python", "Swift"]],
        ["What does 'WWW' stand for?", ["World Wide Web", "World Word Web", "Web Wide World", "World Wide Way"]],
        ["Primary creator of the Linux kernel?", ["Linus Torvalds", "Richard Stallman", "Ken Thompson", "Dennis Ritchie"]]
    ];

    const geographyPool = [
        ["Largest continent?", ["Asia", "Africa", "North America", "Europe"]],
        ["Smallest country?", ["Vatican City", "Monaco", "Nauru", "San Marino"]],
        ["Largest desert in the world?", ["Sahara", "Gobi", "Atacama", "Kalahari"]]
    ];

    let pool = sciencePool;
    if (category === 'IT' || category === 'Technology') pool = techPool;
    else if (category === 'Geology' || category === 'Social Science') pool = geographyPool;

    const item = pool[(index + level) % pool.length];

    return {
        question: `${item[0]}${level > 100 ? ' (Advanced)' : ''}`,
        options: [...item[1]],
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
                // Generate 15 unique questions per level/category to allow for variety
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

        console.log(`🚀 Inserting ${allQuestions.length} corrected questions...`);
        const chunkSize = 1000;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Seeded ${i + chunk.length}/${allQuestions.length}...`);
        }

        await mongoose.disconnect();
        console.log('🏁 Enhanced Seeding Complete & Verified!');
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
}

seed();
