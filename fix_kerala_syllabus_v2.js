require('dotenv').config();
const mongoose = require('mongoose');

async function fixSyllabusAndSchema() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        console.log('--- STARTING KERALA SYLLABUS AND SCHEMA FIX ---');

        // 1. Identify and fix OLD schema questions (Physics 1, Physics 2, Chemistry 2, etc.)
        // These typically have options as an object and correctAnswer as 'A'/'B'/'C'/'D'
        const oldSchemaDocs = await col.find({
            $or: [
                { options: { $type: "object" } },
                { correctAnswer: { $exists: true } }
            ]
        }).toArray();

        console.log(`🔍 Found ${oldSchemaDocs.length} questions with old schema.`);

        let schemaFixedCount = 0;
        for (const doc of oldSchemaDocs) {
            const updates = {};

            // Fix Options and Correct Index
            if (doc.options && !Array.isArray(doc.options)) {
                const optA = doc.options.A || doc.options.a || "None";
                const optB = doc.options.B || doc.options.b || "None";
                const optC = doc.options.C || doc.options.c || "None";
                const optD = doc.options.D || doc.options.d || "None";
                updates.options = [optA, optB, optC, optD];

                if (doc.correctAnswer) {
                    const ans = doc.correctAnswer.toUpperCase();
                    if (ans === 'A') updates.correctIndex = 0;
                    else if (ans === 'B') updates.correctIndex = 1;
                    else if (ans === 'C') updates.correctIndex = 2;
                    else if (ans === 'D') updates.correctIndex = 3;
                }
            }

            // Fix level
            if (doc.level === undefined || doc.level === null) {
                updates.level = 1; // Default to level 1
            }

            // Rename chapterName to chapter
            if (doc.chapterName) {
                updates.chapter = doc.chapterName;
            }

            if (Object.keys(updates).length > 0) {
                await col.updateOne(
                    { _id: doc._id },
                    { 
                        $set: updates,
                        $unset: { correctAnswer: "", chapterName: "" }
                    }
                );
                schemaFixedCount++;
            }
        }
        console.log(`✅ Fixed schema for ${schemaFixedCount} questions.`);

        // 2. Final board and naming fixes (Run this again just in case)
        const boardFixResult = await col.updateMany(
            { 
                class: { $in: ['10th (SSLC)', '+1', '+2'] },
                board: { $exists: false }
            },
            { $set: { board: 'Kerala State' } }
        );
        console.log(`✅ Fixed board field for ${boardFixResult.modifiedCount} questions.`);

        const nameMappings = [
            { from: 'Mathematics', to: 'Maths' },
            { from: 'ICT', to: 'Computer Science' },
            { from: 'Kerala Padavali', to: 'Malayalam Kerala Padavali' },
            { from: 'Adisthana Padavali', to: 'Malayalam Adisthana Padavali' }
        ];

        for (const mapping of nameMappings) {
            const renameResult = await col.updateMany(
                { subject: mapping.from },
                { $set: { subject: mapping.to } }
            );
            console.log(`✅ Renamed subject from '${mapping.from}' to '${mapping.to}' for ${renameResult.modifiedCount} questions.`);
        }

        console.log('--- SYLLABUS AND SCHEMA FIX COMPLETE ---');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixSyllabusAndSchema();
