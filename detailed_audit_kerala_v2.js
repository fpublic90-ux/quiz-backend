require('dotenv').config();
const mongoose = require('mongoose');

async function runAudit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const appSubjects = [
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

        const mapping = {
            'Maths': 'Mathematics',
            'Malayalam Kerala Padavali': 'Kerala Padavali',
            'Malayalam Adisthana Padavali': 'Malayalam Adisthana Padavali',
            'Computer Science': 'ICT'
        };

        const classes = ['10th (SSLC)', '+1', '+2'];
        const mediums = ['Malayalam', 'English'];

        const report = [];

        for (const className of classes) {
            for (const medium of mediums) {
                for (const appSub of appSubjects) {
                    const dbSub = mapping[appSub] || appSub;

                    const countWithBoard = await col.countDocuments({
                        board: 'Kerala State',
                        class: className,
                        medium: medium,
                        $or: [{ subject: appSub }, { subject: dbSub }]
                    });

                    const countNoBoard = await col.countDocuments({
                        board: { $exists: false },
                        class: className,
                        medium: medium,
                        $or: [{ subject: appSub }, { subject: dbSub }]
                    });

                    report.push({
                        class: className,
                        medium,
                        appSubject: appSub,
                        dbSubject: dbSub,
                        countWithBoard,
                        countNoBoard,
                        total: countWithBoard + countNoBoard
                    });
                }
            }
        }

        const fs = require('fs');
        fs.writeFileSync('kerala_syllabus_audit_v2.json', JSON.stringify(report, null, 2));

        const totallyEmpty = report.filter(r => r.total === 0);
        console.log(`\nFound ${totallyEmpty.length} totally empty subject slots.`);

        // Find which subjects (App name) have zero questions across all classes/mediums
        const appSubjectSummaries = appSubjects.map(sub => {
            const relevant = report.filter(r => r.appSubject === sub);
            return {
                subject: sub,
                total: relevant.reduce((sum, r) => sum + r.total, 0)
            };
        });

        console.log('\nSubject summaries (Total questions across all classes/mediums):');
        console.table(appSubjectSummaries);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runAudit();
