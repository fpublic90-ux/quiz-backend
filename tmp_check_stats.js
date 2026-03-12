const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const stats = await Question.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        console.log('--- Category Counts ---');
        stats.forEach(s => {
            console.log(`${s._id}: ${s.count} qns (${(s.count / 10).toFixed(1)} levels)`);
        });
        
        // Also check for duplicates within a category (by question text)
        const dupes = await Question.aggregate([
            { $group: { _id: { cat: '$category', text: '$question' }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $limit: 10 }
        ]);
        if (dupes.length > 0) {
            console.log('\n--- Duplicate Samples ---');
            dupes.forEach(d => console.log(`${d._id.cat}: ${d._id.text.substring(0, 50)}... (${d.count} times)`));
        } else {
            console.log('\nNo exact duplicates found by question text.');
        }

        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
