require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

async function seedMalayalam() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'malayalam_sslc_parsed.json'), 'utf8'));

        console.log('Cleaning up existing questions for Kerala Padavali...');
        await Question.deleteMany({ board: 'Kerala', class: '10', subject: 'Kerala Padavali' });

        const formattedQuestions = [];
        let currentChapter = '';

        for (let i = 0; i < rawData.length; i++) {
            const item = rawData[i];
            
            // Propagate chapter
            if (item.chapter) {
                currentChapter = item.chapter;
            }

            const answer = item.answer.trim();
            const options = item.options.map(o => o.trim());
            
            // Normalize for better matching
            const norm = (s) => s.normalize('NFC')
                .replace(/[\u200B-\u200D\uFEFF]/g, '')
                .replace(/\u09A6/g, '\u0D26') // Devanagari DA to Malayalam DA (2470 to 3366)
                .trim();
            
            const normalizedAnswer = norm(answer);
            const normalizedOptions = options.map(o => norm(o));
            
            let correctIndex = normalizedOptions.indexOf(normalizedAnswer);

            // Calculate level: 10 questions per level
            const level = Math.floor(i / 10) + 1;

            if (correctIndex === -1) {
                // Fallback attempt: check for identity despite potential non-printable chars or normalize
                const normalizedAnswer = answer.normalize('NFC');
                const matchedIndex = options.findIndex(o => o.normalize('NFC') === normalizedAnswer);
                
                if (matchedIndex !== -1) {
                    formattedQuestions.push({
                        question: item.question.trim(),
                        options: options,
                        correctIndex: matchedIndex,
                        category: 'SSLC',
                        level: level,
                        board: 'Kerala',
                        class: '10',
                        subject: 'Kerala Padavali',
                        chapter: currentChapter,
                        medium: 'Malayalam'
                    });
                    continue;
                }
                
                console.error(`Error: Answer not found in options for ID ${item.id}`);
                continue;
            }

            formattedQuestions.push({
                question: item.question.trim(),
                options: options,
                correctIndex: correctIndex,
                category: 'SSLC',
                level: level,
                board: 'Kerala',
                class: '10',
                subject: 'Kerala Padavali',
                chapter: currentChapter,
                medium: 'Malayalam'
            });
        }

        console.log(`Prepared ${formattedQuestions.length} questions. Inserting...`);
        const result = await Question.insertMany(formattedQuestions);
        console.log(`Successfully seeded ${result.length} questions into Kerala Padavali!`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedMalayalam();
