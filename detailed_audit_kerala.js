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

        // Known mapping from App -> DB
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

                    // Query with both potential names (the mapping AND the appSub itself)
                    const count = await col.countDocuments({
                        board: 'Kerala State',
                        class: className,
                        medium: medium,
                        $or: [
                            { subject: appSub },
                            { subject: dbSub }
                        ]
                    });

                    report.push({
                        class: className,
                        medium,
                        appSubject: appSub,
                        dbSubject: dbSub,
                        count
                    });
                }
            }
        }

        const fs = require('fs');
        fs.writeFileSync('kerala_syllabus_audit.json', JSON.stringify(report, null, 2));
        console.log('Audit complete. Generated kerala_syllabus_audit.json');

        const emptyInAllMediums = appSubjects.filter(sub => {
            const relevant = report.filter(r => r.appSubject === sub);
            return relevant.every(r => r.count === 0);
        });

        console.log('\nSubjects with 0 questions across ALL levels/mediums:', emptyInAllMediums);

        const partiallyEmpty = report.filter(r => r.count === 0);
        console.log(`\nFound ${partiallyEmpty.length} empty subject slots.`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runAudit();
