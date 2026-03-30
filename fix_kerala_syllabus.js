require('dotenv').config();
const mongoose = require('mongoose');

async function fixSyllabus() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        console.log('--- STARTING KERALA SYLLABUS FIX ---');

        // 1. Fix missing board for SSLC, +1, +2
        const boardFixResult = await col.updateMany(
            { 
                class: { $in: ['10th (SSLC)', '+1', '+2'] },
                board: { $exists: false }
            },
            { $set: { board: 'Kerala State' } }
        );
        console.log(`✅ Fixed board field for ${boardFixResult.modifiedCount} questions.`);

        // 2. Clear out potential nulls or garbage in Board/Class (Optional safety)
        // await col.updateMany({ board: null }, { $set: { board: 'Kerala State' } });

        // 3. Subject Name Mapping (DB -> App)
        const nameMappings = [
            { from: 'Mathematics', to: 'Maths' },
            { from: 'ICT', to: 'Computer Science' },
            { from: 'Kerala Padavali', to: 'Malayalam Kerala Padavali' },
            { from: 'Adisthana Padavali', to: 'Malayalam Adisthana Padavali' },
            { from: 'Physics', to: 'Physics 1' },
            { from: 'Chemistry', to: 'Chemistry 1' }
        ];

        for (const mapping of nameMappings) {
            const renameResult = await col.updateMany(
                { subject: mapping.from },
                { $set: { subject: mapping.to } }
            );
            console.log(`✅ Renamed subject from '${mapping.from}' to '${mapping.to}' for ${renameResult.modifiedCount} questions.`);
        }

        // 4. Handle Social Science for 10th (SSLC)
        // Note: The app uses 'History' and 'Geography', but DB uses 'Social Science I' and 'Social Science II'.
        // We will map them so they show content.
        const ss1Result = await col.updateMany(
            { subject: 'Social Science I', class: '10th (SSLC)' },
            { $set: { subject: 'History' } }
        );
        console.log(`✅ Remapped 'Social Science I' to 'History' for 10th (SSLC): ${ss1Result.modifiedCount} questions.`);

        const ss2Result = await col.updateMany(
            { subject: 'Social Science II', class: '10th (SSLC)' },
            { $set: { subject: 'Geography' } }
        );
        console.log(`✅ Remapped 'Social Science II' to 'Geography' for 10th (SSLC): ${ss2Result.modifiedCount} questions.`);

        console.log('--- SYLLABUS FIX COMPLETE ---');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixSyllabus();
