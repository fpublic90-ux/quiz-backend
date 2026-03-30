const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String,
    content: String,
    medium: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function inspectSampleArabic() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjects = ['Arabic', 'العربية'];
        
        for (const sub of subjects) {
            console.log(`\n--- Sample questions for: ${sub} ---`);
            const samples = await Question.find({ board: 'Kerala State', subject: sub }).limit(2);
            samples.forEach(q => {
                console.log(`Content: ${q.content.substring(0, 50)}...`);
                console.log(`Class: ${q.class}, Subject: ${q.subject}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

inspectSampleArabic();
