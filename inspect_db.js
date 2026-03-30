require('dotenv').config();
const mongoose = require('mongoose');

async function inspectDoc() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');
        const doc = await col.findOne({});
        console.log('Sample Document:', JSON.stringify(doc, null, 2));

        const subjects = await col.distinct('subject');
        console.log('Unique Subjects in DB:', subjects);

        const classes = await col.distinct('class');
        console.log('Unique Classes in DB:', classes);

        const boards = await col.distinct('board');
        console.log('Unique Boards in DB:', boards);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
inspectDoc();
