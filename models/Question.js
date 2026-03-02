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
    },
    { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
