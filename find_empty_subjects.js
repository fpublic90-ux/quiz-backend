require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const subjects = [
    'Maths',
    'Physics 1',
    'Physics 2',
    'Chemistry 1',
    'Chemistry 2',
    'Biology',
    'Geology',
    'Zoology',
    'History',
    'Geography',
    'English',
    'Computer Science',
    'Malayalam Kerala Padavali',
    'Malayalam Adisthana Padavali',
    'Social Work',
    'العربية'
];

const classes = ['10th (SSLC)', '+1', '+2'];
const mediums = ['Malayalam', 'English'];

async function findEmpty() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const report = [];

        for (const className of classes) {
            for (const medium of mediums) {
                for (const subject of subjects) {
                    const count = await Question.countDocuments({
                        board: 'Kerala State',
                        class: className,
                        medium: medium,
                        subject: subject
                    });

                    if (count === 0) {
                        report.push({ className, medium, subject, count: 0 });
                    } else if (count < 10) {
                        report.push({ className, medium, subject, count, status: 'Critically Low' });
                    }
                }
            }
        }

        console.log('\n--- EMPTY OR CRITICALLY LOW SUBJECTS (KERALA STATE) ---');
        if (report.length === 0) {
            console.log('No empty subjects found!');
        } else {
            console.table(report);
        }

        // Also check if any subjects IN THE DATABASE are not in our list
        const dbSubjects = await Question.distinct('subject', { board: 'Kerala State' });
        const missingFromList = dbSubjects.filter(s => !subjects.includes(s));
        if (missingFromList.length > 0) {
            console.log('\nSubjects in DB but NOT in selection list:', missingFromList);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

findEmpty();
