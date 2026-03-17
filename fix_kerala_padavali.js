require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

async function fixKeralaPadavali() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app');
        console.log('Connected to MongoDB');

        // Step 1: Rename "Malayalam Kerala Padavali" to "Kerala Padavali"
        const updateResult = await Question.updateMany(
            { subject: 'Malayalam Kerala Padavali' },
            { $set: { subject: 'Kerala Padavali' } }
        );
        console.log(`Renamed subject for ${updateResult.modifiedCount} documents from "Malayalam Kerala Padavali" to "Kerala Padavali".`);

        // Step 2: Get all Malayalam "Kerala Padavali" questions for SSLC Kerala State
        const malQuestions = await Question.find({
            subject: 'Kerala Padavali',
            medium: 'Malayalam',
            class: '10th (SSLC)',
            board: 'Kerala State'
        });
        
        console.log(`Found ${malQuestions.length} Malayalam "Kerala Padavali" questions.`);

        let addedCount = 0;
        let skippedCount = 0;

        // Step 3: Ensure English medium equivalents exist
        for (const malQ of malQuestions) {
            const existsInEng = await Question.findOne({
                question: malQ.question, // Using question text as unique identifier
                subject: 'Kerala Padavali',
                medium: 'English',
                class: '10th (SSLC)',
                board: 'Kerala State'
            });

            if (!existsInEng) {
                const engQ = malQ.toObject();
                // Clean up mongoose internal fields for new insertion
                delete engQ._id;
                delete engQ.__v;
                delete engQ.createdAt;
                delete engQ.updatedAt;
                
                engQ.medium = 'English';
                engQ.subject = 'Kerala Padavali'; // Enforce correct subject just in case

                await Question.create(engQ);
                addedCount++;
                if (addedCount % 20 === 0) console.log(`Added ${addedCount} English questions...`);
            } else {
                skippedCount++;
            }
        }

        console.log(`\nProcess Complete!`);
        console.log(`- Added ${addedCount} missing English questions.`);
        console.log(`- Skipped ${skippedCount} existing English questions.`);

        // Verification step
        const finalMalCount = await Question.countDocuments({ subject: 'Kerala Padavali', medium: 'Malayalam', class: '10th (SSLC)', board: 'Kerala State' });
        const finalEngCount = await Question.countDocuments({ subject: 'Kerala Padavali', medium: 'English', class: '10th (SSLC)', board: 'Kerala State' });
        
        console.log(`\nFinal Validation:`);
        console.log(`- Kerala Padavali (Malayalam): ${finalMalCount}`);
        console.log(`- Kerala Padavali (English): ${finalEngCount}`);

    } catch (e) {
        console.error('Error during standardisation:', e);
    } finally {
        await mongoose.disconnect();
    }
}

fixKeralaPadavali();
