const mongoose = require('mongoose');
require('dotenv').config();

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const p2 = await Question.updateMany(
            { subject: 'Physics 2' },
            { $set: { medium: 'English' } }
        );
        console.log(`Updated ${p2.modifiedCount} Physics 2 questions to English medium`);

        const c1 = await Question.updateMany(
            { subject: 'Chemistry 1' },
            { $set: { medium: 'Malayalam' } }
        );
        console.log(`Updated ${c1.modifiedCount} Chemistry 1 questions to Malayalam medium`);

        const c2 = await Question.updateMany(
            { subject: 'Chemistry 2' },
            { $set: { medium: 'Malayalam' } }
        );
        console.log(`Updated ${c2.modifiedCount} Chemistry 2 questions to Malayalam medium`);

        const sw = await Question.updateMany(
            { subject: 'Social Work' },
            { $set: { medium: 'Malayalam' } }
        );
        console.log(`Updated ${sw.modifiedCount} Social Work questions to Malayalam medium`);

        process.exit(0);
    } catch(e) { console.error(e); process.exit(1); }
};
migrate();
