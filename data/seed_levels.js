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
function generateKeralaQuestion(level, index) {
    const pools = [
        ["What is the capital of Kerala?", ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"]],
        ["Which is the state bird of Kerala?", ["Great Hornbill", "Peacock", "Parrot", "Cuckoo"]],
        ["How many districts are there in Kerala?", ["14", "13", "12", "15"]],
        ["Onam is the harvest festival of which state?", ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"]],
        ["Which is the longest river in Kerala?", ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"]],
        ["Who is known as the 'Father of Malayalam Literature'?", ["Thunchaththu Ezhuthachan", "Poonthanam", "Cherusseri", "Kunchan Nambiar"]],
        ["Which district is known as the 'Gateway to Kerala'?", ["Palakkad", "Kasaragod", "Wayanad", "Idukki"]],
        ["Silent Valley National Park is in which district?", ["Palakkad", "Idukki", "Wayanad", "Kottayam"]],
        ["Which city is the 'Venice of the East'?", ["Alappuzha", "Kochi", "Kollam", "Kannur"]],
        ["Traditional art form of Kerala?", ["Kathakali", "Bharatanatyam", "Kuchipudi", "Odissi"]],
        ["Highest peak in Kerala?", ["Anamudi", "Agasthyarkoodam", "Meesapulimala", "Chembra Peak"]],
        ["First digital district in Kerala?", ["Palakkad", "Ernakulam", "Idukki", "Thrissur"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1].sort(() => Math.random() - 0.5),
        correctIndex: 0, // We'll find it after shuffle
        category: 'Kerala',
        level: level
    };
}

/**
 * Generate localized India questions
 */
function generateIndiaQuestion(level, index) {
    const pools = [
        ["Who was the first PM of India?", ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "B.R. Ambedkar"]],
        ["National animal of India?", ["Tiger", "Lion", "Elephant", "Leopard"]],
        ["Number of states in India?", ["28", "29", "27", "26"]],
        ["Largest state in India by area?", ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Uttar Pradesh"]],
        ["Year of Indian Independence?", ["1947", "1950", "1942", "1930"]],
        ["River known as 'Ganges of the South'?", ["Godavari", "Cauvery", "Krishna", "Narmada"]],
        ["'Iron Man of India'?", ["Sardar Vallabhbhai Patel", "Subhash Bose", "Bhagat Singh", "Lala Lajpat Rai"]],
        ["Highest mountain peak in India?", ["Kanchenjunga", "Nanda Devi", "K2", "Anamudi"]],
        ["Location of Taj Mahal?", ["Agra", "Delhi", "Jaipur", "Lucknow"]],
        ["'Silicon Valley of India'?", ["Bengaluru", "Hyderabad", "Pune", "Chennai"]],
        ["National flower of India?", ["Lotus", "Rose", "Jasmine", "Sunflower"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1],
        correctIndex: 0,
        category: 'India',
        level: level
    };
}

/**
 * Generate Tech/IT questions
 */
function generateTechQuestion(level, index, category) {
    const pools = [
        ["Who co-founded Microsoft?", ["Bill Gates", "Steve Jobs", "Elon Musk", "Mark Zuckerberg"]],
        ["Full form of CPU?", ["Central Processing Unit", "Control Power Unit", "Core Process Utility", "Central Proto Unit"]],
        ["Latest version of Android as of 2024?", ["Android 14", "Android 13", "Android 15", "Android 12"]],
        ["Primary language for Android development?", ["Kotlin", "Swift", "Python", "Java"]],
        ["What does 'WWW' stand for?", ["World Wide Web", "World Word Web", "Web Wide World", "World Wide Way"]],
        ["Company that makes the iPhone?", ["Apple", "Samsung", "Google", "Microsoft"]],
        ["Founder of Space X?", ["Elon Musk", "Jeff Bezos", "Sundar Pichai", "Satya Nadella"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1],
        correctIndex: 0,
        category: category,
        level: level
    };
}

/**
 * Generate Science questions
 */
function generateScienceQuestion(level, index, category) {
    const pools = [
        ["Fastest planet in solar system?", ["Mercury", "Venus", "Earth", "Mars"]],
        ["Chemical symbol for Water?", ["H2O", "CO2", "NaCl", "O2"]],
        ["Largest organ in human body?", ["Skin", "Liver", "Heart", "Lungs"]],
        ["Who proposed Theory of Relativity?", ["Albert Einstein", "Isaac Newton", "Nikola Tesla", "Bohr"]],
        ["Study of plants is called?", ["Botany", "Zoology", "Biology", "Geology"]],
        ["Red planet?", ["Mars", "Venus", "Jupiter", "Saturn"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1],
        correctIndex: 0,
        category: category,
        level: level
    };
}

/**
 * Generate History questions
 */
function generateHistoryQuestion(level, index, category) {
    const pools = [
        ["Who was the first emperor of the Maurya Dynasty?", ["Chandragupta Maurya", "Ashoka", "Bindusara", "Dasharatha"]],
        ["The Quit India Movement started in which year?", ["1942", "1940", "1945", "1939"]],
        ["Who built the Red Fort in Delhi?", ["Shah Jahan", "Akbar", "Humayun", "Jahangir"]],
        ["The first battle of Panipat was fought in?", ["1526", "1556", "1761", "1516"]],
        ["Who was the last Mughal Emperor?", ["Bahadur Shah Zafar", "Aurangzeb", "Shah Alam II", "Akbar II"]],
        ["The French Revolution began in?", ["1789", "1889", "1776", "1815"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1],
        correctIndex: 0,
        category: category,
        level: level
    };
}

/**
 * Generate Sports questions
 */
function generateSportsQuestion(level, index, category) {
    const pools = [
        ["Which country won the first FIFA World Cup?", ["Uruguay", "Brazil", "Argentina", "Italy"]],
        ["Which player has the most centuries in International Cricket?", ["Sachin Tendulkar", "Virat Kohli", "Ricky Ponting", "Kumar Sangakkara"]],
        ["Standard length of a marathon?", ["42.195 km", "40 km", "45 km", "38.5 km"]],
        ["Which sport is associated with the 'Davis Cup'?", ["Tennis", "Badminton", "Golf", "Cricket"]],
        ["National sport of India?", ["Field Hockey", "Cricket", "Kabaddi", "Football"]],
        ["Who is known as the 'Lightning Bolt'?", ["Usain Bolt", "Tyson Gay", "Yohan Blake", "Justin Gatlin"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1],
        correctIndex: 0,
        category: category,
        level: level
    };
}

/**
 * Generate Economics/Social Science questions
 */
function generateSocialScienceQuestion(level, index, category) {
    const pools = [
        ["Who is the 'Father of Economics'?", ["Adam Smith", "Karl Marx", "John Keynes", "Alfred Marshall"]],
        ["Largest producer of rice in the world?", ["China", "India", "USA", "Brazil"]],
        ["Which is the smallest continent?", ["Australia", "Europe", "Antarctica", "South America"]],
        ["Headquarters of the United Nations is in?", ["New York", "Geneva", "Paris", "London"]],
        ["What is the currency of Japan?", ["Yen", "Yuan", "Won", "Baht"]],
        ["Highest literacy rate state in India?", ["Kerala", "Tamil Nadu", "Mizoram", "Goa"]]
    ];
    const item = pools[(index + level) % pools.length];
    return {
        question: `${item[0]} (Lvl ${level})`,
        options: item[1],
        correctIndex: 0,
        category: category,
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

        // Generate 200 levels, 10 questions PER CATEGORY in each level
        // Total = 200 * 15 * 10 = 30,000 questions
        for (let level = 1; level <= 200; level++) {
            for (const category of CATEGORIES) {
                for (let q = 0; q < 10; q++) {
                    if (category === 'Kerala') {
                        allQuestions.push(generateKeralaQuestion(level, q));
                    } else if (category === 'India') {
                        allQuestions.push(generateIndiaQuestion(level, q));
                    } else if (category === 'Mathematics') {
                        allQuestions.push(generateMathQuestion(level, q));
                    } else if (category === 'IT' || category === 'Technology') {
                        allQuestions.push(generateTechQuestion(level, q, category));
                    } else if (['Science', 'Physics', 'Chemistry', 'Biology'].includes(category)) {
                        allQuestions.push(generateScienceQuestion(level, q, category));
                    } else if (category === 'History') {
                        allQuestions.push(generateHistoryQuestion(level, q, category));
                    } else if (category === 'Sports') {
                        allQuestions.push(generateSportsQuestion(level, q, category));
                    } else if (['Economics', 'Social Science', 'Geology', 'General Knowledge'].includes(category)) {
                        allQuestions.push(generateSocialScienceQuestion(level, q, category));
                    } else {
                        allQuestions.push(generateGenericQuestion(level, q, category));
                    }
                }
            }
            if (level % 20 === 0) console.log(`✍️ Prepared Level ${level} for all categories...`);
        }

        console.log(`🚀 Inserting ${allQuestions.length} questions...`);

        // Use bulkWrite/insertMany in chunks for 30,000 records
        const chunkSize = 1000;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Seeded ${i + chunk.length}/${allQuestions.length}...`);
        }

        await mongoose.disconnect();
        console.log('🏁 Bulk Seeding Complete!');
    } catch (err) {
        console.error('❌ Bulk Seed error:', err.message);
        process.exit(1);
    }
}

seed();
