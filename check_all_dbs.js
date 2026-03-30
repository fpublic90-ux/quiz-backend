const mongoose = require('mongoose');
require('dotenv').config();

async function checkAllDatabases() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('\n--- All Databases ---');
        dbs.databases.forEach(db => console.log(`- ${db.name}`));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAllDatabases();
