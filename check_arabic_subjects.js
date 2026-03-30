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

async function checkArabic() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjectsToCheck = [
            'Arabic Academic',
            'Arabic Oriental',
            'Arabic',
            'العربية'
        ];

        console.log('\n--- Arabic Subjects Audit (Kerala State) ---');
        
        for (const sub of subjectsToCheck) {
            const count = await Question.countDocuments({
                board: 'Kerala State',
                subject: sub
            });
            const classes = await Question.distinct('class', { board: 'Kerala State', subject: sub });
            console.log(`${sub}: ${count} questions (Classes: ${classes.join(', ') || 'None'})`);
        }

        console.log('\n--- All Arabic-like subject names in DB ---');
        const allSubjects = await Question.distinct('subject', { board: 'Kerala State' });
        const arabicLike = allSubjects.filter(s => s && s.toLowerCase().includes('arabic'));
        
        for (const sub of arabicLike) {
            if (!subjectsToCheck.includes(sub)) {
                const count = await Question.countDocuments({ board: 'Kerala State', subject: sub });
                console.log(`${sub}: ${count} questions`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkArabic();
