const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkOverlap() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app');
        const Question = require('./models/Question');

        const categories = await Question.distinct('category');
        console.log(`Checking overlap for ${categories.length} categories...\n`);

        for (const cat of categories) {
            console.log(`Analyzing Category: ${cat}`);

            // Group questions by their text (or question string) and see which levels they appear in
            const overlap = await Question.aggregate([
                { $match: { category: cat } },
                {
                    $group: {
                        _id: "$question",
                        levels: { $addToSet: "$level" },
                        count: { $sum: 1 }
                    }
                },
                { $match: { "levels.1": { $exists: true } } } // More than one level associated with this question text
            ]);

            if (overlap.length > 0) {
                console.log(`❌ Found ${overlap.length} questions repeated across multiple levels!`);
                overlap.slice(0, 5).forEach(o => {
                    console.log(`   - "${o._id.substring(0, 50)}..." appears in levels: ${o.levels.join(', ')}`);
                });
            } else {
                console.log(`✅ No overlap found for ${cat}.`);
            }
            console.log('-------------------');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOverlap();
