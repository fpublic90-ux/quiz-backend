const mongoose = require('mongoose');
require('dotenv').config();

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await Question.updateMany(
            { subject: 'Physics', class: '+2' },
            { $set: { subject: 'Physics 1' } }
        );
        console.log(`Updated ${result.modifiedCount} documents from "Physics" to "Physics 1"`);
        process.exit(0);
    } catch(e) { console.error(e); process.exit(1); }
};
migrate();
