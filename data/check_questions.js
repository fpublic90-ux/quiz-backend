require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Verification');

        // Fetch 50 random questions
        const questions = await Question.aggregate([{ $sample: { size: 50 } }]);

        console.log(`🔍 Verifying ${questions.length} random questions...`);

        let errors = 0;
        const knownAnswers = {
            "What is the capital of Kerala?": "Thiruvananthapuram",
            "Which is the state bird of Kerala?": "Great Hornbill",
            "How many districts are there in Kerala?": "14",
            "Who was the first PM of India?": "Jawaharlal Nehru",
            "National animal of India?": "Tiger",
            "Chemical symbol for Water?": "H2O",
            "Red planet?": "Mars",
            "What is 12 + 12?": "24",
            "What is 12 × 12?": "144",
            "Solve: 100 - 10": "90"
        };

        questions.forEach((q, i) => {
            const correctAnswer = q.options[q.correctIndex];

            // Check against known base facts if applicable
            for (const [key, value] of Object.entries(knownAnswers)) {
                if (q.question.includes(key) && correctAnswer !== value) {
                    console.error(`❌ ERROR in Question: "${q.question}"`);
                    console.error(`   Expected: ${value}, Found: ${correctAnswer}`);
                    errors++;
                }
            }

            // General logic check: ensure correctIndex is within bounds
            if (q.correctIndex < 0 || q.correctIndex > 3) {
                console.error(`❌ Bounds error in Question: "${q.question}" (Index: ${q.correctIndex})`);
                errors++;
            }
        });

        if (errors === 0) {
            console.log('✅ All sampled questions verified successfully!');
        } else {
            console.error(`⚠️ Found ${errors} errors in sample.`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Verification error:', err.message);
        process.exit(1);
    }
}

check();
