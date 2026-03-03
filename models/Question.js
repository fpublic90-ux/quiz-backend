const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: (v) => v.length === 4,
                message: 'Options must have exactly 4 choices',
            },
        },
        correctIndex: {
            type: Number,
            required: true,
            min: 0,
            max: 3,
        },
        category: {
            type: String,
            default: 'General Knowledge',
        },
        level: {
            type: Number,
            required: true,
            index: true, // Index for level-specific lookups
        },
    },
    { timestamps: true }
);

// Composite index for level + category filtering
questionSchema.index({ level: 1, category: 1 });

module.exports = mongoose.model('Question', questionSchema);
