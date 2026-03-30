const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function compareSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const currentSubjects = await Question.distinct('subject');
        const mapping = JSON.parse(fs.readFileSync('kerala_subject_mapping.json', 'utf8'));
        const mappedSubjects = new Set();
        Object.values(mapping).forEach(list => list.forEach(s => mappedSubjects.add(s)));

        console.log('\n--- New/Unmapped Subjects ---');
        const unmapped = currentSubjects.filter(s => s && !mappedSubjects.has(s));
        if (unmapped.length === 0) {
            console.log('No new subjects found compared to previous mapping.');
        } else {
            for (const sub of unmapped) {
                const count = await Question.countDocuments({ subject: sub });
                console.log(`- ${sub} (${count} questions)`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

compareSubjects();
