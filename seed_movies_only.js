require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MOVIES_POOL = [
    // Hollywood / English
    { q: "Who directed 'Inception'?", a: "Christopher Nolan", alt: ["Steven Spielberg", "James Cameron", "Quentin Tarantino"] },
    { q: "What is the highest-grossing film of all time?", a: "Avatar", alt: ["Avengers: Endgame", "Titanic", "Star Wars"] },
    { q: "Who played Jack in 'Titanic'?", a: "Leonardo DiCaprio", alt: ["Brad Pitt", "Tom Cruise", "Johnny Depp"] },
    { q: "Who is the voice of Woody in 'Toy Story'?", a: "Tom Hanks", alt: ["Tim Allen", "John Ratzenberger", "Don Rickles"] },

    // Malayalam
    { q: "Who is known as the 'Complete Actor' in Malayalam cinema?", a: "Mohanlal", alt: ["Mammootty", "Suresh Gopi", "Jayaram"] },
    { q: "Which Malayalam movie won the first National Film Award for Best Feature Film?", a: "Chemmeen", alt: ["Neelakuyil", "Swayamvaram", "Elippathayam"] },
    { q: "Who directed the movie 'Drishyam'?", a: "Jeethu Joseph", alt: ["Lijo Jose Pellissery", "Aashiq Abu", "Alphonse Puthren"] },
    { q: "Who is the lead actor in 'Lucifer'?", a: "Mohanlal", alt: ["Prithviraj", "Tovino Thomas", "Fahadh Faasil"] },
    { q: "Which film is considered the first '3D' movie in India (Malayalam)?", a: "My Dear Kuttichathan", alt: ["Padayottam", "Jwaala", "Vidyarthigale Ithile Ithile"] },

    // Hindi (Bollywood)
    { q: "Who is known as the 'Baadshah of Bollywood'?", a: "Shah Rukh Khan", alt: ["Aamir Khan", "Salman Khan", "Akshay Kumar"] },
    { q: "Which Hindi movie is known as the 'Greatest of All Time'?", a: "Sholay", alt: ["Mughal-E-Azam", "Lagaan", "Dilwale Dulhania Le Jayenge"] },
    { q: "Who directed the movie 'Lagaan'?", a: "Ashutosh Gowariker", alt: ["Sanjay Leela Bhansali", "Karan Johar", "Rajkumar Hirani"] },
    { q: "Who played the lead role in 'Dangal'?", a: "Aamir Khan", alt: ["Shah Rukh Khan", "Salman Khan", "Ranbir Kapoor"] },

    // Tamil (Kollywood)
    { q: "Who is called 'Superstar' in Tamil cinema?", a: "Rajinikanth", alt: ["Kamal Haasan", "Vijay", "Ajith"] },
    { q: "Who directed the epic film 'Ponniyin Selvan'?", a: "Mani Ratnam", alt: ["Shankar", "Vetrimaaran", "Pa. Ranjith"] },
    { q: "Which Tamil movie features the character 'Chitti' the Robot?", a: "Enthiran", alt: ["Sivaji", "2.0", "Anniyan"] },
    { q: "Who is known as 'Ulaganayagan'?", a: "Kamal Haasan", alt: ["Rajinikanth", "Suriya", "Vikram"] },

    // Telugu (Tollywood)
    { q: "Which Telugu movie became a global phenomenon and won an Oscar for 'Naatu Naatu'?", a: "RRR", alt: ["Baahubali", "Pushpa", "Eega"] },
    { q: "Who directed the 'Baahubali' series?", a: "S.S. Rajamouli", alt: ["Sukumar", "Trivikram Srinivas", "Puri Jagannadh"] },
    { q: "Who is the lead actor of 'Pushpa: The Rise'?", a: "Allu Arjun", alt: ["Mahesh Babu", "Prabhas", "Ram Charan"] },
    { q: "Who is known as 'Mega Star' in Tollywood?", a: "Chiranjeevi", alt: ["Pawan Kalyan", "NTR Jr", "Balakrishna"] },

    // Kannada (Sandalwood)
    { q: "Which Kannada movie series broke records across India starting in 2018?", a: "K.G.F", alt: ["Kantara", "777 Charlie", "Vikrant Rona"] },
    { q: "Who is the lead actor in 'K.G.F'?", a: "Yash", alt: ["Rishab Shetty", "Rakshit Shetty", "Sudeep"] },
    { q: "Which Kannada film gained massive popularity for its 'Bhoota Kola' theme?", a: "Kantara", alt: ["K.G.F", "Raajakumara", "Lucia"] },
    { q: "Who is known as 'Power Star' in Kannada cinema?", a: "Puneeth Rajkumar", alt: ["Darshan", "Yash", "Upendra"] }
];

function pickFrom(pool, level, index) {
    return pool[(index * 7 + level * 3) % pool.length];
}

function generateFromPool(pool, level, index, category) {
    const item = pickFrom(pool, level, index);
    const question = `Level ${level}: ${item.q}`;
    const options = [item.a, ...item.alt].sort(() => Math.random() - 0.5);
    return {
        question,
        options,
        correctIndex: options.indexOf(item.a),
        category,
        level
    };
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clean up previous Movies only
        console.log('🗑️ Cleaning up old Movies questions...');
        await Question.deleteMany({ category: 'Movies' });

        const allQuestions = [];
        const category = 'Movies';

        console.log('⏳ Preparing NEW DIVERSE Movies questions for 200 levels...');
        for (let level = 1; level <= 200; level++) {
            for (let qIdx = 0; qIdx < 15; qIdx++) {
                allQuestions.push(generateFromPool(MOVIES_POOL, level, qIdx, category));
            }
        }

        console.log(`🚀 Inserting ${allQuestions.length} diverse Movies questions...`);
        const chunkSize = 1000;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Progress: ${i + chunk.length}/${allQuestions.length}`);
        }

        console.log('🏁 DIVERSE MOVIE SEEDING COMPLETE');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
}

seed();
