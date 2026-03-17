require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const rawData = [
{
"id": 81,
"chapter": "Paths to Progress",
"question": "What is the central idea of Unit II?",
"options": ["War", "Progress and determination", "Fear", "Comedy"],
"answer": "Progress and determination"
},
{
"id": 82,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What does 'flying' symbolize in the lesson?",
"options": ["Escape", "Dreams and achievement", "Fear", "Failure"],
"answer": "Dreams and achievement"
},
{
"id": 83,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What is needed to break barriers?",
"options": ["Money", "Hard work and courage", "Luck only", "Power"],
"answer": "Hard work and courage"
},
{
"id": 84,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What quality helps achieve success?",
"options": ["Fear", "Determination", "Anger", "Laziness"],
"answer": "Determination"
},
{
"id": 85,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What message does the lesson give?",
"options": ["Give up easily", "Never try", "Keep trying", "Avoid risks"],
"answer": "Keep trying"
},
{
"id": 86,
"chapter": "A Phoenix Rises",
"question": "What does the phoenix symbolize?",
"options": ["Death", "Rebirth", "Fear", "War"],
"answer": "Rebirth"
},
{
"id": 87,
"chapter": "A Phoenix Rises",
"question": "What is the theme of the story?",
"options": ["Failure", "Hope and renewal", "War", "Loss"],
"answer": "Hope and renewal"
},
{
"id": 88,
"chapter": "A Phoenix Rises",
"question": "What helps a person rise again?",
"options": ["Luck", "Hope and strength", "Money", "Power"],
"answer": "Hope and strength"
},
{
"id": 89,
"chapter": "A Phoenix Rises",
"question": "What does rising again indicate?",
"options": ["Weakness", "Growth", "Failure", "Fear"],
"answer": "Growth"
},
{
"id": 90,
"chapter": "A Phoenix Rises",
"question": "What lesson is taught?",
"options": ["Stay weak", "Never recover", "Overcome challenges", "Avoid life"],
"answer": "Overcome challenges"
},
{
"id": 91,
"chapter": "The Seedling",
"question": "What does the seedling represent?",
"options": ["Death", "Growth and hope", "Fear", "War"],
"answer": "Growth and hope"
},
{
"id": 92,
"chapter": "The Seedling",
"question": "What is required for growth?",
"options": ["Neglect", "Care and patience", "Anger", "Fear"],
"answer": "Care and patience"
},
{
"id": 93,
"chapter": "The Seedling",
"question": "What does the poem teach?",
"options": ["Ignore growth", "Value development", "Avoid effort", "Stop learning"],
"answer": "Value development"
},
{
"id": 94,
"chapter": "The Seedling",
"question": "What helps the seedling grow?",
"options": ["Darkness", "Nourishment", "Neglect", "Fear"],
"answer": "Nourishment"
},
{
"id": 95,
"chapter": "The Seedling",
"question": "What does the seedling become?",
"options": ["Stone", "Tree", "Water", "Wind"],
"answer": "Tree"
},
{
"id": 96,
"chapter": "General",
"question": "What is the main idea of Unit II?",
"options": ["War", "Growth and success", "Fear", "Failure"],
"answer": "Growth and success"
},
{
"id": 97,
"chapter": "General",
"question": "What is needed for progress?",
"options": ["Fear", "Effort", "Anger", "Laziness"],
"answer": "Effort"
},
{
"id": 98,
"chapter": "General",
"question": "What does perseverance mean?",
"options": ["Giving up", "Continuing despite difficulty", "Avoiding work", "Sleeping"],
"answer": "Continuing despite difficulty"
},
{
"id": 99,
"chapter": "General",
"question": "What is a key life skill taught?",
"options": ["Fear", "Resilience", "Anger", "Jealousy"],
"answer": "Resilience"
},
{
"id": 100,
"chapter": "General",
"question": "What is the key message of Unit II?",
"options": ["Quit early", "Stay weak", "Keep growing", "Avoid challenges"],
"answer": "Keep growing"
},
{
"id": 101,
"chapter": "Paths to Progress",
"question": "What is the central idea of Unit II?",
"options": ["War", "Growth and success", "Fear", "Comedy"],
"answer": "Growth and success"
},
{
"id": 102,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What does 'I Will Fly' symbolize?",
"options": ["Escape", "Ambition", "Fear", "Failure"],
"answer": "Ambition"
},
{
"id": 103,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What is needed to achieve dreams?",
"options": ["Luck", "Hard work", "Money", "Power"],
"answer": "Hard work"
},
{
"id": 104,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What helps overcome barriers?",
"options": ["Fear", "Courage", "Anger", "Laziness"],
"answer": "Courage"
},
{
"id": 105,
"chapter": "Breaking Barriers, I Will Fly",
"question": "What is the message of the lesson?",
"options": ["Quit", "Try once", "Keep trying", "Avoid effort"],
"answer": "Keep trying"
},
{
"id": 106,
"chapter": "A Phoenix Rises",
"question": "Phoenix represents?",
"options": ["Death", "Rebirth", "War", "Fear"],
"answer": "Rebirth"
},
{
"id": 107,
"chapter": "A Phoenix Rises",
"question": "Theme of the story?",
"options": ["Failure", "Renewal", "War", "Loss"],
"answer": "Renewal"
},
{
"id": 108,
"chapter": "A Phoenix Rises",
"question": "What quality helps to rise again?",
"options": ["Weakness", "Hope", "Fear", "Anger"],
"answer": "Hope"
},
{
"id": 109,
"chapter": "A Phoenix Rises",
"question": "What does rising again show?",
"options": ["Failure", "Growth", "Fear", "Loss"],
"answer": "Growth"
},
{
"id": 110,
"chapter": "A Phoenix Rises",
"question": "Lesson of story?",
"options": ["Stay down", "Avoid life", "Overcome challenges", "Fear change"],
"answer": "Overcome challenges"
},
{
"id": 111,
"chapter": "The Seedling",
"question": "Seedling represents?",
"options": ["Death", "Growth", "Fear", "War"],
"answer": "Growth"
},
{
"id": 112,
"chapter": "The Seedling",
"question": "What is needed for growth?",
"options": ["Neglect", "Care", "Fear", "Anger"],
"answer": "Care"
},
{
"id": 113,
"chapter": "The Seedling",
"question": "Theme of poem?",
"options": ["Destruction", "Development", "War", "Loss"],
"answer": "Development"
},
{
"id": 114,
"chapter": "The Seedling",
"question": "What helps growth?",
"options": ["Darkness", "Nourishment", "Fear", "Neglect"],
"answer": "Nourishment"
},
{
"id": 115,
"chapter": "The Seedling",
"question": "Seedling grows into?",
"options": ["Rock", "Tree", "Water", "Wind"],
"answer": "Tree"
},
{
"id": 116,
"chapter": "The Trumpets of Change",
"question": "Theme of Unit III?",
"options": ["Silence", "Change", "War only", "Comedy"],
"answer": "Change"
},
{
"id": 117,
"chapter": "Another Day in Paradise",
"question": "Main issue highlighted?",
"options": ["Wealth", "Poverty", "War", "Nature"],
"answer": "Poverty"
},
{
"id": 118,
"chapter": "Another Day in Paradise",
"question": "What does the song criticize?",
"options": ["Kindness", "Ignoring the poor", "Helping others", "Love"],
"answer": "Ignoring the poor"
},
{
"id": 119,
"chapter": "Another Day in Paradise",
"question": "What is the tone?",
"options": ["Happy", "Serious", "Funny", "Carefree"],
"answer": "Serious"
},
{
"id": 120,
"chapter": "Another Day in Paradise",
"question": "Message of song?",
"options": ["Ignore others", "Be selfish", "Show empathy", "Avoid people"],
"answer": "Show empathy"
},
{
"id": 121,
"chapter": "War",
"question": "Theme of poem?",
"options": ["Peace", "Destruction of war", "Love", "Nature"],
"answer": "Destruction of war"
},
{
"id": 122,
"chapter": "War",
"question": "What does war bring?",
"options": ["Joy", "Suffering", "Growth", "Peace"],
"answer": "Suffering"
},
{
"id": 123,
"chapter": "War",
"question": "Tone of poem?",
"options": ["Happy", "Critical", "Funny", "Excited"],
"answer": "Critical"
},
{
"id": 124,
"chapter": "War",
"question": "What is emphasized?",
"options": ["Victory", "Loss", "Fun", "Strength"],
"answer": "Loss"
},
{
"id": 125,
"chapter": "War",
"question": "Message?",
"options": ["Promote war", "Avoid war", "Ignore war", "Enjoy war"],
"answer": "Avoid war"
},
{
"id": 126,
"chapter": "A Piece of String",
"question": "Main theme?",
"options": ["Trust vs suspicion", "War", "Love", "Nature"],
"answer": "Trust vs suspicion"
},
{
"id": 127,
"chapter": "A Piece of String",
"question": "What causes conflict?",
"options": ["Truth", "Misunderstanding", "Love", "War"],
"answer": "Misunderstanding"
},
{
"id": 128,
"chapter": "A Piece of String",
"question": "What is highlighted?",
"options": ["Honesty", "False accusation", "War", "Nature"],
"answer": "False accusation"
},
{
"id": 129,
"chapter": "A Piece of String",
"question": "What happens to the man?",
"options": ["Praised", "Blamed", "Ignored", "Rewarded"],
"answer": "Blamed"
},
{
"id": 130,
"chapter": "A Piece of String",
"question": "Lesson?",
"options": ["Trust blindly", "Avoid suspicion", "Blame others", "Ignore truth"],
"answer": "Avoid suspicion"
},
{
"id": 131,
"chapter": "General",
"question": "What is empathy?",
"options": ["Ignoring others", "Understanding others", "Fighting", "Laughing"],
"answer": "Understanding others"
},
{
"id": 132,
"chapter": "General",
"question": "What is compassion?",
"options": ["Kindness", "Anger", "Fear", "Hate"],
"answer": "Kindness"
},
{
"id": 133,
"chapter": "General",
"question": "What is resilience?",
"options": ["Weakness", "Recovery ability", "Fear", "Anger"],
"answer": "Recovery ability"
},
{
"id": 134,
"chapter": "General",
"question": "What is perseverance?",
"options": ["Giving up", "Continuing effort", "Sleeping", "Avoiding"],
"answer": "Continuing effort"
},
{
"id": 135,
"chapter": "General",
"question": "What is the main life lesson?",
"options": ["Violence", "Humanity", "Money", "Power"],
"answer": "Humanity"
},
{
"id": 136,
"chapter": "General",
"question": "What is moral responsibility?",
"options": ["Ignoring duty", "Doing right", "Avoiding work", "Blaming others"],
"answer": "Doing right"
},
{
"id": 137,
"chapter": "General",
"question": "What is social awareness?",
"options": ["Ignoring society", "Understanding society", "Avoiding people", "Fighting"],
"answer": "Understanding society"
},
{
"id": 138,
"chapter": "General",
"question": "What is kindness?",
"options": ["Helping others", "Ignoring others", "Fighting", "Laughing"],
"answer": "Helping others"
},
{
"id": 139,
"chapter": "General",
"question": "What is honesty?",
"options": ["Truthfulness", "Lying", "Hiding", "Ignoring"],
"answer": "Truthfulness"
},
{
"id": 140,
"chapter": "General",
"question": "What is trust?",
"options": ["Belief in others", "Fear", "Anger", "Doubt"],
"answer": "Belief in others"
},
{
"id": 141,
"chapter": "General",
"question": "What is conflict?",
"options": ["Agreement", "Disagreement", "Peace", "Love"],
"answer": "Disagreement"
},
{
"id": 142,
"chapter": "General",
"question": "What is prejudice?",
"options": ["Fair judgement", "Unfair judgement", "Truth", "Care"],
"answer": "Unfair judgement"
},
{
"id": 143,
"chapter": "General",
"question": "What is justice?",
"options": ["Fairness", "Bias", "Anger", "Fear"],
"answer": "Fairness"
},
{
"id": 144,
"chapter": "General",
"question": "What is equality?",
"options": ["Difference", "Sameness", "Unfairness", "Bias"],
"answer": "Sameness"
},
{
"id": 145,
"chapter": "General",
"question": "What is dignity?",
"options": ["Respect", "Shame", "Fear", "Anger"],
"answer": "Respect"
},
{
"id": 146,
"chapter": "General",
"question": "What is freedom?",
"options": ["Control", "Liberty", "Fear", "War"],
"answer": "Liberty"
},
{
"id": 147,
"chapter": "General",
"question": "What is courage?",
"options": ["Fear", "Bravery", "Weakness", "Anger"],
"answer": "Bravery"
},
{
"id": 148,
"chapter": "General",
"question": "What is fear?",
"options": ["Confidence", "Anxiety", "Hope", "Joy"],
"answer": "Anxiety"
},
{
"id": 149,
"chapter": "General",
"question": "What is hope?",
"options": ["Despair", "Expectation", "Fear", "Anger"],
"answer": "Expectation"
},
{
"id": 150,
"chapter": "General",
"question": "What is success?",
"options": ["Failure", "Achievement", "Fear", "Loss"],
"answer": "Achievement"
},
{
"id": 151,
"chapter": "General",
"question": "What is failure?",
"options": ["Success", "Lack of success", "Growth", "Hope"],
"answer": "Lack of success"
},
{
"id": 152,
"chapter": "General",
"question": "What is learning?",
"options": ["Ignoring", "Gaining knowledge", "Sleeping", "Avoiding"],
"answer": "Gaining knowledge"
},
{
"id": 153,
"chapter": "General",
"question": "What is growth?",
"options": ["Decline", "Development", "Fear", "Loss"],
"answer": "Development"
},
{
"id": 154,
"chapter": "General",
"question": "What is change?",
"options": ["Staying same", "Transformation", "Fear", "Loss"],
"answer": "Transformation"
},
{
"id": 155,
"chapter": "General",
"question": "What is awareness?",
"options": ["Ignorance", "Understanding", "Fear", "Anger"],
"answer": "Understanding"
},
{
"id": 156,
"chapter": "General",
"question": "What is humanity?",
"options": ["Cruelty", "Kindness", "War", "Fear"],
"answer": "Kindness"
},
{
"id": 157,
"chapter": "General",
"question": "What is society?",
"options": ["Individual", "Group of people", "Animal", "Object"],
"answer": "Group of people"
},
{
"id": 158,
"chapter": "General",
"question": "What is responsibility?",
"options": ["Duty", "Escape", "Fear", "Anger"],
"answer": "Duty"
},
{
"id": 159,
"chapter": "General",
"question": "What is respect?",
"options": ["Ignoring", "Valuing others", "Fighting", "Laughing"],
"answer": "Valuing others"
},
{
"id": 160,
"chapter": "General",
"question": "What is unity?",
"options": ["Division", "Togetherness", "Fear", "Anger"],
"answer": "Togetherness"
},
{
"id": 161,
"chapter": "General",
"question": "What is peace?",
"options": ["War", "Calm", "Fear", "Anger"],
"answer": "Calm"
},
{
"id": 162,
"chapter": "General",
"question": "What is violence?",
"options": ["Peace", "Harm", "Care", "Love"],
"answer": "Harm"
},
{
"id": 163,
"chapter": "General",
"question": "What is justice system?",
"options": ["Unfairness", "Law enforcement", "War", "Fear"],
"answer": "Law enforcement"
},
{
"id": 164,
"chapter": "General",
"question": "What is discrimination?",
"options": ["Equality", "Unfair treatment", "Care", "Love"],
"answer": "Unfair treatment"
},
{
"id": 165,
"chapter": "General",
"question": "What is tolerance?",
"options": ["Hatred", "Acceptance", "Fear", "Anger"],
"answer": "Acceptance"
},
{
"id": 166,
"chapter": "General",
"question": "What is gratitude?",
"options": ["Thankfulness", "Anger", "Fear", "Hate"],
"answer": "Thankfulness"
},
{
"id": 167,
"chapter": "General",
"question": "What is leadership?",
"options": ["Following", "Guiding others", "Ignoring", "Escaping"],
"answer": "Guiding others"
},
{
"id": 168,
"chapter": "General",
"question": "What is teamwork?",
"options": ["Working alone", "Working together", "Ignoring", "Competing"],
"answer": "Working together"
},
{
"id": 169,
"chapter": "General",
"question": "What is communication?",
"options": ["Silence", "Exchange of ideas", "Fear", "Anger"],
"answer": "Exchange of ideas"
},
{
"id": 170,
"chapter": "General",
"question": "What is creativity?",
"options": ["Copying", "Original thinking", "Fear", "Anger"],
"answer": "Original thinking"
},
{
"id": 171,
"chapter": "General",
"question": "What is imagination?",
"options": ["Reality only", "Creative thinking", "Fear", "Anger"],
"answer": "Creative thinking"
},
{
"id": 172,
"chapter": "General",
"question": "What is discipline?",
"options": ["Carelessness", "Self-control", "Fear", "Anger"],
"answer": "Self-control"
},
{
"id": 173,
"chapter": "General",
"question": "What is motivation?",
"options": ["Laziness", "Drive to act", "Fear", "Anger"],
"answer": "Drive to act"
},
{
"id": 174,
"chapter": "General",
"question": "What is inspiration?",
"options": ["Discouragement", "Encouragement", "Fear", "Anger"],
"answer": "Encouragement"
},
{
"id": 175,
"chapter": "General",
"question": "What is dedication?",
"options": ["Carelessness", "Commitment", "Fear", "Anger"],
"answer": "Commitment"
},
{
"id": 176,
"chapter": "General",
"question": "What is focus?",
"options": ["Distraction", "Concentration", "Fear", "Anger"],
"answer": "Concentration"
},
{
"id": 177,
"chapter": "General",
"question": "What is goal?",
"options": ["Random action", "Target", "Fear", "Anger"],
"answer": "Target"
},
{
"id": 178,
"chapter": "General",
"question": "What is planning?",
"options": ["Random work", "Preparation", "Fear", "Anger"],
"answer": "Preparation"
},
{
"id": 179,
"chapter": "General",
"question": "What is effort?",
"options": ["No work", "Work put in", "Fear", "Anger"],
"answer": "Work put in"
},
{
"id": 180,
"chapter": "General",
"question": "What is achievement?",
"options": ["Failure", "Success", "Fear", "Anger"],
"answer": "Success"
},
{
"id": 181,
"chapter": "General",
"question": "What is challenge?",
"options": ["Easy task", "Difficult task", "Fear", "Anger"],
"answer": "Difficult task"
},
{
"id": 182,
"chapter": "General",
"question": "What is solution?",
"options": ["Problem", "Answer", "Fear", "Anger"],
"answer": "Answer"
},
{
"id": 183,
"chapter": "General",
"question": "What is problem?",
"options": ["Answer", "Difficulty", "Fear", "Anger"],
"answer": "Difficulty"
},
{
"id": 184,
"chapter": "General",
"question": "What is success formula?",
"options": ["Luck only", "Hard work + consistency", "Fear", "Anger"],
"answer": "Hard work + consistency"
},
{
"id": 185,
"chapter": "General",
"question": "What is mindset?",
"options": ["Thinking pattern", "Action", "Fear", "Anger"],
"answer": "Thinking pattern"
},
{
"id": 186,
"chapter": "General",
"question": "What is attitude?",
"options": ["Behavior", "Thinking + behavior", "Fear", "Anger"],
"answer": "Thinking + behavior"
},
{
"id": 187,
"chapter": "General",
"question": "What is belief?",
"options": ["Doubt", "Trust", "Fear", "Anger"],
"answer": "Trust"
},
{
"id": 188,
"chapter": "General",
"question": "What is value?",
"options": ["Worth", "Fear", "Anger", "Loss"],
"answer": "Worth"
},
{
"id": 189,
"chapter": "General",
"question": "What is culture?",
"options": ["Traditions", "Fear", "Anger", "War"],
"answer": "Traditions"
},
{
"id": 190,
"chapter": "General",
"question": "What is education?",
"options": ["Ignorance", "Learning process", "Fear", "Anger"],
"answer": "Learning process"
},
{
"id": 191,
"chapter": "General",
"question": "What is knowledge?",
"options": ["Ignorance", "Information + understanding", "Fear", "Anger"],
"answer": "Information + understanding"
},
{
"id": 192,
"chapter": "General",
"question": "What is wisdom?",
"options": ["Knowledge use", "Fear", "Anger", "Loss"],
"answer": "Knowledge use"
},
{
"id": 193,
"chapter": "General",
"question": "What is intelligence?",
"options": ["Ability to learn", "Fear", "Anger", "Loss"],
"answer": "Ability to learn"
},
{
"id": 194,
"chapter": "General",
"question": "What is skill?",
"options": ["Ability", "Fear", "Anger", "Loss"],
"answer": "Ability"
},
{
"id": 195,
"chapter": "General",
"question": "What is experience?",
"options": ["Learning from events", "Fear", "Anger", "Loss"],
"answer": "Learning from events"
},
{
"id": 196,
"chapter": "General",
"question": "What is life?",
"options": ["Journey", "Fear", "Anger", "Loss"],
"answer": "Journey"
},
{
"id": 197,
"chapter": "General",
"question": "What is purpose?",
"options": ["Aim", "Fear", "Anger", "Loss"],
"answer": "Aim"
},
{
"id": 198,
"chapter": "General",
"question": "What is happiness?",
"options": ["Joy", "Fear", "Anger", "Loss"],
"answer": "Joy"
},
{
"id": 199,
"chapter": "General",
"question": "What is sadness?",
"options": ["Joy", "Sorrow", "Fear", "Anger"],
"answer": "Sorrow"
},
{
"id": 200,
"chapter": "General",
"question": "Overall message of the book?",
"options": ["Violence wins", "Compassion and humanity", "Money matters", "Power rules"],
"answer": "Compassion and humanity"
}
];

// Deduplicate based on question text
const uniqueMap = new Map();
for (let item of rawData) {
    // Basic normalization for deduplication
    const normalizedQ = item.question.trim().toLowerCase();
    if (!uniqueMap.has(normalizedQ)) {
        uniqueMap.set(normalizedQ, item);
    }
}
const uniqueQuestionsData = Array.from(uniqueMap.values());
console.log(`Prepared ${uniqueQuestionsData.length} unique questions out of ${rawData.length} raw questions.`);

const parsedQuestions = [];

for (let item of uniqueQuestionsData) {
    const correctIndex = item.options.indexOf(item.answer);
    if (correctIndex === -1) {
        console.warn(`Warning: answer "${item.answer}" not found in options for question: "${item.question}"`);
    }

    const baseQuestion = {
        question: item.question,
        options: item.options,
        correctIndex: correctIndex !== -1 ? correctIndex : 0,
        level: 1, // Defaulting to level 1, adjust if needed
        board: "Kerala State",
        class: "10th (SSLC)",
        subject: "English",
        chapter: item.chapter
    };
    
    // Add for English medium
    parsedQuestions.push({
        ...baseQuestion,
        medium: "English"
    });
    
    // Add for Malayalam medium
    parsedQuestions.push({
        ...baseQuestion,
        medium: "Malayalam"
    });
}

async function seedEnglishSSLC() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const q of parsedQuestions) {
            const exists = await Question.findOne({
                question: q.question,
                subject: q.subject,
                chapter: q.chapter,
                medium: q.medium,
                board: q.board,
                class: q.class
            });

            if (!exists) {
                await Question.create(q);
                console.log(`Added: [${q.medium}] [${q.subject}] ${q.question.substring(0, 30)}...`);
            } else {
                console.log(`Skipped (Duplicate): [${q.medium}] [${q.subject}] ${q.question.substring(0, 30)}...`);
            }
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedEnglishSSLC();
