const mongoose = require('mongoose');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function findUnknownSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const known = [
            "Anthropology", "Arabic", "Arabic Academic", "Arabic Oriental", "Biology",
            "Business Studies 1", "Business Studies 2", "Chemistry 1", "Chemistry 2",
            "Computer Science", "Computer Science 1", "Computer Science 2",
            "Economics (Introductory Macroeconomics)", "English", "General",
            "Geography", "Geology", "Hindi", "History", "Malayalam Adisthana Padavali",
            "Malayalam Kerala Padavali", "Maths", "Physics 1", "Physics 2",
            "Social Science", "Social Work", "Zoology", "العربية"
        ];

        const others = await Question.distinct('subject', { subject: { $nin: known, $ne: null } });
        console.log('\n--- Other Subjects in DB ---');
        console.log(others);

        if (others.length > 0) {
            for (const s of others) {
                const count = await Question.countDocuments({ subject: s });
                console.log(`- ${s} (${count} questions)`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findUnknownSubjects();
