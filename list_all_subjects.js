const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function listAllSubjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const subjects = await Question.distinct('subject');
        fs.writeFileSync('all_subjects.json', JSON.stringify(subjects.sort(), null, 2));
        console.log('All subjects exported to all_subjects.json');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listAllSubjects();
