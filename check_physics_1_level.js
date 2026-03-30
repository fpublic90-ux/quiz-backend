require('dotenv').config();
const mongoose = require('mongoose');

async function checkDetails() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const firstDoc = await col.findOne({ subject: 'Physics 1', class: '+2' });
        if (firstDoc) {
            console.log('Sample Physics 1 Doc:', JSON.stringify(firstDoc, null, 2));
        } else {
            console.log('Physics 1 NOT FOUND');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkDetails();
