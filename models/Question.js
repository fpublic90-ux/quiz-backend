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
        board: {
            type: String,
            required: false,
            index: true,
        },
        class: {
            type: String,
            required: false,
            index: true,
        },
        subject: {
            type: String,
            required: false,
            index: true,
        },
        chapter: { type: String, trim: true },
        medium: { type: String, enum: ['English', 'Malayalam'], default: 'English' },
        imageUrl: {
            type: String, // Optional URL for image-based questions
            default: null,
        },
    },
    { timestamps: true }
);

// Composite index for level + category filtering
questionSchema.index({ level: 1, category: 1 });
// Compound index for fast educational filtering
questionSchema.index({ board: 1, class: 1, medium: 1, subject: 1, chapter: 1 });

module.exports = mongoose.model('Question', questionSchema);
