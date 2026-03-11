/**
 * Utility for processing quiz questions
 */

/**
 * Fisher-Yates shuffle algorithm to randomize options while maintaining correct index mapping.
 * @param {Object} q - The question object from the database
 * @returns {Object} The processed question object with shuffled options
 */
const shuffleQuestion = (q) => {
    // If q is a Mongoose document, convert to plain object to allow modification
    const questionObj = q.toObject ? q.toObject() : { ...q };

    const options = [...questionObj.options];
    const correctAnswer = options[questionObj.correctIndex];

    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    questionObj.options = options;
    questionObj.correctIndex = options.indexOf(correctAnswer);

    // 🎓 Student Center Fix: If it's a student question, use the subject as the category
    if (questionObj.subject) {
        questionObj.category = questionObj.subject;
    }

    return questionObj;
};

module.exports = {
    shuffleQuestion
};
