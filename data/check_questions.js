require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

async function checkDistribution() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Diagnostics');

        const total = await Question.countDocuments();
        console.log(`📊 Total Questions: ${total}`);

        // Check top categories
        const catStats = await Question.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        console.log('📂 Category Distribution:');
        catStats.forEach(stat => {
            console.log(`   - ${stat._id.padEnd(20)}: ${stat.count}`);
        });

        // Deep check a few levels for "India" and "Kerala"
        const levelsToCheck = [1, 50, 100, 200];
        console.log('\n🔍 Deep Check (India & Kerala):');
        for (const level of levelsToCheck) {
            const keralaCount = await Question.countDocuments({ level, category: 'Kerala' });
            const indiaCount = await Question.countDocuments({ level, category: 'India' });
            console.log(`   Level ${level.toString().padEnd(3)} -> Kerala: ${keralaCount}, India: ${indiaCount}`);
        }

        // Check if any category/level combo has 0 (sample check)
        const sampleCats = ['Physics', 'IT', 'Science'];
        console.log('\n🔍 Sample Check (Other Categories):');
        for (const cat of sampleCats) {
            const count = await Question.countDocuments({ level: 1, category: cat });
            console.log(`   Level 1   -> ${cat.padEnd(10)}: ${count}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Diagnostic error:', err);
    }
}

checkDistribution();
