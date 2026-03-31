const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI;

const fixCasing = async () => {
    try {
        if (!MONGODB_URI) throw new Error("No MONGODB_URI in .env");
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Fix PHILOSOPHY -> Philosophy
        const res1 = await Question.updateMany(
            { subject: 'PHILOSOPHY' },
            { $set: { subject: 'Philosophy' } }
        );
        console.log(`✅ Updated PHILOSOPHY: ${res1.modifiedCount} documents`);

        // Fix COMPUTER APPLICATIONS (...) -> Computer Applications (...)
        const res2 = await Question.updateMany(
            { subject: 'COMPUTER APPLICATIONS (Humanities)' },
            { $set: { subject: 'Computer Applications (Humanities)' } }
        );
        console.log(`✅ Updated COMPUTER APPLICATIONS (Humanities): ${res2.modifiedCount} documents`);

        const res3 = await Question.updateMany(
            { subject: 'COMPUTER APPLICATIONS (Commerce)' },
            { $set: { subject: 'Computer Applications (Commerce)' } }
        );
        console.log(`✅ Updated COMPUTER APPLICATIONS (Commerce): ${res3.modifiedCount} documents`);

        console.log('✨ All casing fixes complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error fixing casing:', err);
        process.exit(1);
    }
};

fixCasing();
