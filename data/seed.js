require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const sampleQuestions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2,
        category: "Geography",
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctIndex: 1,
        category: "Science",
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctIndex: 3,
        category: "Geography",
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
        correctIndex: 2,
        category: "Art",
    },
    {
        question: "What is the chemical symbol for Gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctIndex: 2,
        category: "Science",
    },
    {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        correctIndex: 2,
        category: "Geography",
    },
    {
        question: "Which is the longest river in the world?",
        options: ["Amazon", "Yangtze", "Mississippi", "Nile"],
        correctIndex: 3,
        category: "Geography",
    },
    {
        question: "What is the speed of light (approx)?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"],
        correctIndex: 0,
        category: "Science",
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctIndex: 2,
        category: "History",
    },
    {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
        correctIndex: 2,
        category: "Biology",
    },
    {
        question: "Which country invented pizza?",
        options: ["Greece", "France", "Italy", "Spain"],
        correctIndex: 2,
        category: "Culture",
    },
    {
        question: "What is 12 × 12?",
        options: ["132", "144", "156", "124"],
        correctIndex: 1,
        category: "Mathematics",
    },
    {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Oxygen", "Carbon", "Hydrogen"],
        correctIndex: 3,
        category: "Science",
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctIndex: 1,
        category: "Literature",
    },
    {
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Bangkok", "Tokyo"],
        correctIndex: 3,
        category: "Geography",
    },
    {
        question: "How many sides does a hexagon have?",
        options: ["5", "6", "7", "8"],
        correctIndex: 1,
        category: "Mathematics",
    },
    {
        question: "Which sport uses a shuttlecock?",
        options: ["Tennis", "Squash", "Badminton", "Volleyball"],
        correctIndex: 2,
        category: "Sports",
    },
    {
        question: "What is the largest mammal on Earth?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctIndex: 1,
        category: "Biology",
    },
    {
        question: "Which language has the most native speakers worldwide?",
        options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
        correctIndex: 2,
        category: "Language",
    },
    {
        question: "What is the boiling point of water at sea level (°C)?",
        options: ["90", "95", "100", "105"],
        correctIndex: 2,
        category: "Science",
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await Question.deleteMany({});
        const inserted = await Question.insertMany(sampleQuestions);
        console.log(`✅ Seeded ${inserted.length} questions`);

        await mongoose.disconnect();
        console.log('✅ Done!');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
