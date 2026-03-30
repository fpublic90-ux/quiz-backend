const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String,
    question: String,
    medium: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function inspectSampleArabic() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjects = ['Arabic', 'العربية', 'Arabic Academic', 'Arabic Oriental'];
        
        for (const sub of subjects) {
            console.log(`\n--- Sample questions for: ${sub} ---`);
            const samples = await Question.find({ board: 'Kerala State', subject: sub }).limit(1).lean();
            if (samples.length === 0) {
                console.log('No questions found');
                continue;
            }
            samples.forEach(q => {
                const qText = q.question || q.content || 'N/A';
                console.log(`Question: ${qText.substring(0, 50)}...`);
                console.log(`Class: ${q.class}, Subject: ${q.subject}, Medium: ${q.medium}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

inspectSampleArabic();
