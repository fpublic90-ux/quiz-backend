require('dotenv').config();
const mongoose = require('mongoose');

async function fixSyllabusAndSchemaBulk() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        console.log('--- STARTING BULK KERALA SYLLABUS AND SCHEMA FIX ---');

        const oldSchemaDocs = await col.find({
            $or: [
                { options: { $type: "object" } },
                { correctAnswer: { $exists: true } },
                { level: { $exists: false } }
            ]
        }).toArray();

        console.log(`🔍 Found ${oldSchemaDocs.length} questions to potentially fix.`);

        if (oldSchemaDocs.length === 0) {
            console.log('No questions need fixing!');
            process.exit(0);
        }

        const bulkOps = [];
        for (const doc of oldSchemaDocs) {
            const updates = {};
            const unsets = {};

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
                    unsets.correctAnswer = "";
                }
            }

            // Fix level
            if (doc.level === undefined || doc.level === null) {
                updates.level = 1;
            }

            // Rename chapterName to chapter
            if (doc.chapterName) {
                updates.chapter = doc.chapterName;
                unsets.chapterName = "";
            }

            if (Object.keys(updates).length > 0 || Object.keys(unsets).length > 0) {
                const op = {
                    updateOne: {
                        filter: { _id: doc._id },
                        update: { }
                    }
                };
                if (Object.keys(updates).length > 0) op.updateOne.update.$set = updates;
                if (Object.keys(unsets).length > 0) op.updateOne.update.$unset = unsets;
                bulkOps.push(op);
            }
        }

        if (bulkOps.length > 0) {
            const result = await col.bulkWrite(bulkOps);
            console.log(`✅ Bulk fixed schema for ${result.modifiedCount} questions.`);
        }

        // Final board and naming fixes
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

        console.log('--- BULK FIX COMPLETE ---');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixSyllabusAndSchemaBulk();
