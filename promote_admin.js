const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const UID_TO_PROMOTE = 'prtyXTzPYcSJd0bfgaiHc3Tx5ke2';

async function promote() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const user = await User.findOneAndUpdate(
            { uid: UID_TO_PROMOTE },
            { 
                role: 'admin',
                $setOnInsert: {
                    email: 'admin@offline.local',
                    displayName: 'Admin Device',
                }
            },
            { new: true, upsert: true }
        );

        if (user) {
            console.log(`✅ Success! User ${user.email} (${user.uid}) is now an ADMIN.`);
            console.log(`   Role is now: ${user.role}`);
        } else {
            console.log(`❌ Error: User with UID ${UID_TO_PROMOTE} not found in database.`);
            console.log('   Make sure you have logged in to the app first so the user record is created.');
        }
    } catch (err) {
        console.error('❌ MongoDB Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

promote();
