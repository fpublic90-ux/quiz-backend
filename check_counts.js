const mongoose = require('mongoose');
require('dotenv').config();

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const c1Count = await Question.countDocuments({ subject: 'Chemistry 1' });
        const c1mCount = await Question.countDocuments({ subject: 'Chemistry 1', medium: 'Malayalam' });
        const swCount = await Question.countDocuments({ subject: 'Social Work' });
        const swmCount = await Question.countDocuments({ subject: 'Social Work', medium: 'Malayalam' });
        const cCount = await Question.countDocuments({ subject: 'Chemistry' });
        console.log(`C1: ${c1Count}, C1(Malayalam): ${c1mCount}, SW: ${swCount}, SW(Malayalam): ${swmCount}, C: ${cCount}`);
        process.exit(0);
    } catch(e) { console.error(e); process.exit(1); }
};
check();
