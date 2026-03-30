const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const QuestionSchema = new mongoose.Schema({
    board: String,
    class: String,
    subject: String
}, { strict: false });

const Question = mongoose.model('Question', QuestionSchema);

async function exportSubjectMapping() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const board = 'Kerala State';
        const classes = ['10th (SSLC)', '+1', '+2'];
        const mapping = {};
        
        for (const cls of classes) {
            const subjects = await Question.distinct('subject', { board, class: cls });
            mapping[cls] = subjects.sort();
        }

        fs.writeFileSync('kerala_subject_mapping.json', JSON.stringify(mapping, null, 2));
        console.log('Mapping exported to kerala_subject_mapping.json');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

exportSubjectMapping();
