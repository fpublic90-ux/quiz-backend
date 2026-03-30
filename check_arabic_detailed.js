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

async function checkArabicDetailed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjectsToCheck = [
            'Arabic Academic',
            'Arabic Oriental',
            'Arabic',
            'العربية'
        ];

        const classesToCheck = ['10th (SSLC)', '+1', '+2'];

        console.log('\n--- Detailed Arabic Subjects Audit (Kerala State) ---');
        
        for (const cls of classesToCheck) {
            console.log(`\nClass: ${cls}`);
            for (const sub of subjectsToCheck) {
                const count = await Question.countDocuments({
                    board: 'Kerala State',
                    class: cls,
                    subject: sub
                });
                console.log(`  ${sub}: ${count} questions`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkArabicDetailed();
