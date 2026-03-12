const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('--- Identifying Duplicates ---');
        const groups = await Question.aggregate([
            {
                $group: {
                    _id: { category: '$category', question: '$question' },
                    ids: { $push: '$_id' },
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]);

        console.log(`Found ${groups.length} groups with duplicate questions.`);

        const allIdsToDelete = [];
        groups.forEach(group => {
            // Keep the first ID, delete others
            allIdsToDelete.push(...group.ids.slice(1));
        });

        if (allIdsToDelete.length > 0) {
            console.log(`Deleting ${allIdsToDelete.length} duplicate documents...`);
            const result = await Question.deleteMany({ _id: { $in: allIdsToDelete } });
            console.log(`Cleanup complete. Total duplicates removed: ${result.deletedCount}`);
        } else {
            console.log('No duplicates found.');
        }

        process.exit(0);
    })
    .catch(e => {
        console.error('CRITICAL ERROR:', e);
        process.exit(1);
    });
