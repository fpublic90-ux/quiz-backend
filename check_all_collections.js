const mongoose = require('mongoose');
require('dotenv').config();

async function checkCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('\n--- Collections ---');
        collections.forEach(c => console.log(`- ${c.name}`));

        // For each collection, check if anything recently added or containing Accountancy
        for (const colInfo of collections) {
            const name = colInfo.name;
            const count = await db.collection(name).countDocuments({
                $or: [
                    { subject: /accountancy/i },
                    { question: /accountancy/i },
                    { content: /accountancy/i }
                ]
            });
            if (count > 0) {
                console.log(`\nCollection [${name}] has ${count} matching documents!`);
                const sample = await db.collection(name).findOne({
                     $or: [
                        { subject: /accountancy/i },
                        { question: /accountancy/i },
                        { content: /accountancy/i }
                    ]
                });
                console.log('Sample:', JSON.stringify(sample, null, 2));
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkCollections();
