const mongoose = require('mongoose');
require('dotenv').config();

async function deepSearch() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        for (const col of collections) {
            const name = col.name;
            const matches = await db.collection(name).find({
                $or: [
                    { subject: /accountancy/i },
                    { chapter: /accountancy/i },
                    { question: /accountancy/i },
                    { content: /accountancy/i },
                    { name: /accountancy/i },
                    { title: /accountancy/i }
                ]
            }).limit(5).toArray();

            if (matches.length > 0) {
                console.log(`\n--- Found in [${name}] ---`);
                matches.forEach(m => console.log(JSON.stringify(m, null, 2)));
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

deepSearch();
