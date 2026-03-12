const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

async function processAndSeed() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB.');

        const uniqueQuestions = new Map();
        const formattedQuestions = [];

        // 1. Process txt file
        try {
            const txtPath = path.join(__dirname, 'data', 'islamic_raw.txt');
            if (fs.existsSync(txtPath)) {
                const fileContent = fs.readFileSync(txtPath, 'utf8');
                const matches = fileContent.match(/\{[\s\S]*?\}/g);
                if (matches) {
                    matches.forEach((m) => {
                        try {
                            const obj = JSON.parse(m);
                            addQuestion(obj);
                        } catch (e) {}
                    });
                }
            }
        } catch(e) { console.error('Error reading txt:', e); }

        // 2. Process json file
        try {
            const jsonPath = path.join(__dirname, 'data', 'islamic_malayalam_raw.json');
            if (fs.existsSync(jsonPath)) {
                const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                if (Array.isArray(data)) {
                    data.forEach(obj => addQuestion(obj));
                }
            }
        } catch(e) { console.error('Error reading json:', e); }

        function addQuestion(obj) {
            if (!obj.question || !obj.options || !obj.answer) return;
            const qText = obj.question.trim().replace(/\s+/g, ' ');

            // Normalize 'Options' to 'options' if needed, though they seem fine
            const correctIdx = obj.options.indexOf(obj.answer);
            if (correctIdx === -1) return;

            if (!uniqueQuestions.has(qText)) {
                uniqueQuestions.set(qText, true);
                formattedQuestions.push({
                    question: qText,
                    options: obj.options,
                    correctIndex: correctIdx,
                    category: 'Islamic',
                    level: Math.floor(Math.random() * 5) + 1,
                    medium: 'Malayalam'
                });
            }
        }

        console.log(`Total unique valid questions extracted: ${formattedQuestions.length}`);

        if (formattedQuestions.length >= 300) {
            // Take exactly 300
            const finalQuestions = formattedQuestions.slice(0, 300);
            
            // Clear existing Islamic questions and seed exactly 300
            await Question.deleteMany({ category: 'Islamic' });
            console.log('Cleared existing Islamic questions.');

            const result = await Question.insertMany(finalQuestions);
            console.log(`Successfully seeded exactly ${result.length} unique Islamic questions in Malayalam.`);
        } else {
            console.log(`Not enough unique questions! Found only ${formattedQuestions.length}. Need 300.`);
            
            // Seed what we have anyway
            await Question.deleteMany({ category: 'Islamic' });
            const result = await Question.insertMany(formattedQuestions);
            console.log(`Seeded ${result.length} questions. Still short of 300.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

processAndSeed();
