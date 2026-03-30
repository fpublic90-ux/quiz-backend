require('dotenv').config();
const mongoose = require('mongoose');

async function checkMore() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const col = mongoose.connection.collection('questions');

        const subs = ['ICT', 'Malayalam Adisthana Padavali', 'Adisthana Padavali'];

        for (const sub of subs) {
            const firstDoc = await col.findOne({ subject: sub });
            if (firstDoc) {
                console.log(`${sub}: Board=${firstDoc.board}, Class=${firstDoc.class}, Medium=${firstDoc.medium}`);
            } else {
                console.log(`${sub}: NOT FOUND`);
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkMore();
