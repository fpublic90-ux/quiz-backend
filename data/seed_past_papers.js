require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');

const DATA_FILE = path.join(__dirname, 'extracted_sslc_questions.json');

async function seedPastPapers() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        if (!fs.existsSync(DATA_FILE)) {
            console.log(`Data file not found at ${DATA_FILE}. Run extract_pdf_questions.js first.`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(DATA_FILE);
        const questions = JSON.parse(rawData);

        if (questions.length === 0) {
            console.log('No questions found in JSON.');
            process.exit(0);
        }

        // Clean existing past papers to prevent duplicates during testing
        await Question.deleteMany({ category: 'Past Papers', board: 'Kerala' });
        console.log('Cleared old Past Papers data');

        const result = await Question.insertMany(questions);
        console.log(`Successfully seeded ${result.length} SSLC Past Paper questions!`);

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.connection.close();
    }
}

seedPastPapers();
