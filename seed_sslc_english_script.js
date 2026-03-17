require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const rawData = [
{
"id": 1,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Who discovered the old man with wings?",
"options": ["Pelayo", "Elisenda", "Doctor", "Neighbour"],
"answer": "Pelayo"
},
{
"id": 2,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Where was the old man found?",
"options": ["Beach", "Courtyard", "Forest", "Roof"],
"answer": "Courtyard"
},
{
"id": 3,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Why couldn’t the old man get up?",
"options": ["He was injured", "His wings were stuck in mud", "He was sleeping", "He was blind"],
"answer": "His wings were stuck in mud"
},
{
"id": 4,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What did the neighbour woman say?",
"options": ["He is a beggar", "He is an angel", "He is a thief", "He is a sailor"],
"answer": "He is an angel"
},
{
"id": 5,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Where was the old man kept?",
"options": ["Bedroom", "Kitchen", "Chicken coop", "Garden"],
"answer": "Chicken coop"
},
{
"id": 6,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Why did people come to see the old man?",
"options": ["Curiosity", "To help him", "To arrest him", "To feed him"],
"answer": "Curiosity"
},
{
"id": 7,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What did Pelayo charge visitors?",
"options": ["Free", "10 cents", "5 cents", "1 dollar"],
"answer": "5 cents"
},
{
"id": 8,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What was the angel’s main virtue?",
"options": ["Strength", "Patience", "Wisdom", "Anger"],
"answer": "Patience"
},
{
"id": 9,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What distracted people from the angel?",
"options": ["A magician", "A spider woman", "A circus", "A singer"],
"answer": "A spider woman"
},
{
"id": 10,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What happens at the end?",
"options": ["Angel dies", "Angel flies away", "Angel stays", "Angel is sold"],
"answer": "Angel flies away"
},
{
"id": 11,
"chapter": "In the Attic",
"question": "Who is Szpilman?",
"options": ["Doctor", "Pianist", "Soldier", "Teacher"],
"answer": "Pianist"
},
{
"id": 12,
"chapter": "In the Attic",
"question": "Where was Szpilman hiding?",
"options": ["Basement", "Attic", "Forest", "Tunnel"],
"answer": "Attic"
},
{
"id": 13,
"chapter": "In the Attic",
"question": "Who finds Szpilman?",
"options": ["Friend", "German officer", "Police", "Neighbour"],
"answer": "German officer"
},
{
"id": 14,
"chapter": "In the Attic",
"question": "What did the officer ask him to do?",
"options": ["Run", "Hide", "Play piano", "Cook"],
"answer": "Play piano"
},
{
"id": 15,
"chapter": "In the Attic",
"question": "Which composer’s piece did he play?",
"options": ["Beethoven", "Chopin", "Mozart", "Bach"],
"answer": "Chopin"
},
{
"id": 16,
"chapter": "In the Attic",
"question": "What did the officer give him?",
"options": ["Money", "Food", "Weapons", "Books"],
"answer": "Food"
},
{
"id": 17,
"chapter": "In the Attic",
"question": "What was the officer ashamed of?",
"options": ["War", "Music", "Food", "Weather"],
"answer": "War"
},
{
"id": 18,
"chapter": "In the Attic",
"question": "What helped Szpilman survive?",
"options": ["Luck and kindness", "Strength", "Money", "Weapons"],
"answer": "Luck and kindness"
},
{
"id": 19,
"chapter": "In the Attic",
"question": "Where did Szpilman hide inside the attic?",
"options": ["Closet", "Loft", "Bed", "Window"],
"answer": "Loft"
},
{
"id": 20,
"chapter": "In the Attic",
"question": "What did the officer bring last time?",
"options": ["Gun", "Bread and blanket", "Shoes", "Radio"],
"answer": "Bread and blanket"
},
{
"id": 21,
"chapter": "Friends, Romans, Countrymen",
"question": "Who delivers the speech?",
"options": ["Brutus", "Caesar", "Antony", "Cassius"],
"answer": "Antony"
},
{
"id": 22,
"chapter": "Friends, Romans, Countrymen",
"question": "What is Antony’s purpose?",
"options": ["Praise Caesar", "Manipulate crowd", "Fight war", "Celebrate"],
"answer": "Manipulate crowd"
},
{
"id": 23,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony repeatedly call Brutus?",
"options": ["Brave", "Honourable", "Wise", "Strong"],
"answer": "Honourable"
},
{
"id": 24,
"chapter": "Friends, Romans, Countrymen",
"question": "Which literary device is used?",
"options": ["Simile", "Irony", "Alliteration", "Hyperbole"],
"answer": "Irony"
},
{
"id": 25,
"chapter": "Friends, Romans, Countrymen",
"question": "What happens to the crowd?",
"options": ["Stay calm", "Support Brutus", "Turn against conspirators", "Leave"],
"answer": "Turn against conspirators"
},
{
"id": 26,
"chapter": "General",
"question": "Which theme is common in Unit I?",
"options": ["Technology", "Human suffering", "Sports", "Comedy"],
"answer": "Human suffering"
},
{
"id": 27,
"chapter": "General",
"question": "What does the angel symbolize?",
"options": ["Power", "Weak and vulnerable", "Wealth", "War"],
"answer": "Weak and vulnerable"
},
{
"id": 28,
"chapter": "General",
"question": "What is magical realism?",
"options": ["Pure fantasy", "Mix of reality and magic", "Science fiction", "History"],
"answer": "Mix of reality and magic"
},
{
"id": 29,
"chapter": "A Very Old Man with Enormous Wings",
"question": "How did Pelayo react initially to the old man?",
"options": ["With kindness", "With fear", "With anger", "With curiosity"],
"answer": "With fear"
},
{
"id": 30,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Why did Pelayo and Elisenda think the old man was a castaway?",
"options": ["He had wings", "He spoke a strange language", "He was strong", "He had money"],
"answer": "He spoke a strange language"
},
{
"id": 31,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What was the condition of the old man's wings?",
"options": ["Clean and beautiful", "Golden", "Dirty and damaged", "Invisible"],
"answer": "Dirty and damaged"
},
{
"id": 32,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What illness did the child recover from?",
"options": ["Cold", "Fever", "Injury", "Cough"],
"answer": "Fever"
},
{
"id": 33,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Why did the couple plan to set the old man free?",
"options": ["They were scared", "They felt pity", "They wanted money", "They were tired"],
"answer": "They felt pity"
},
{
"id": 34,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What did people throw at the old man?",
"options": ["Money", "Food and stones", "Flowers", "Water"],
"answer": "Food and stones"
},
{
"id": 35,
"chapter": "A Very Old Man with Enormous Wings",
"question": "Why did people treat the old man like a circus animal?",
"options": ["Because he was dangerous", "Because they lacked compassion", "Because he was rich", "Because he asked them"],
"answer": "Because they lacked compassion"
},
{
"id": 36,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What did Pelayo do after earning money?",
"options": ["Bought a car", "Built a mansion", "Left town", "Donated money"],
"answer": "Built a mansion"
},
{
"id": 37,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What did Elisenda buy with the money?",
"options": ["Books", "Shoes and dresses", "Food", "House"],
"answer": "Shoes and dresses"
},
{
"id": 38,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What surprised the doctor about the old man?",
"options": ["His age", "His voice", "His wings", "His clothes"],
"answer": "His wings"
},
{
"id": 39,
"chapter": "A Very Old Man with Enormous Wings",
"question": "What happened to the chicken coop?",
"options": ["Burned", "Collapsed", "Sold", "Expanded"],
"answer": "Collapsed"
},
{
"id": 40,
"chapter": "A Very Old Man with Enormous Wings",
"question": "How did Elisenda feel when the angel flew away?",
"options": ["Sad", "Angry", "Relieved", "Excited"],
"answer": "Relieved"
},
{
"id": 41,
"chapter": "In the Attic",
"question": "What was Szpilman doing before the war?",
"options": ["Doctor", "Pianist", "Teacher", "Soldier"],
"answer": "Pianist"
},
{
"id": 42,
"chapter": "In the Attic",
"question": "Why was Szpilman hiding?",
"options": ["He was a criminal", "He was a Jew", "He was sick", "He was poor"],
"answer": "He was a Jew"
},
{
"id": 43,
"chapter": "In the Attic",
"question": "How long had Szpilman not practiced piano?",
"options": ["1 year", "2 years", "2.5 years", "5 years"],
"answer": "2.5 years"
},
{
"id": 44,
"chapter": "In the Attic",
"question": "What condition were his fingers in?",
"options": ["Soft", "Clean", "Dirty and stiff", "Strong"],
"answer": "Dirty and stiff"
},
{
"id": 45,
"chapter": "In the Attic",
"question": "What did the officer promise?",
"options": ["Money", "Help and safety", "Food only", "Escape plan"],
"answer": "Help and safety"
},
{
"id": 46,
"chapter": "In the Attic",
"question": "Where did the officer suggest Szpilman hide?",
"options": ["Basement", "Loft", "Garden", "Roof"],
"answer": "Loft"
},
{
"id": 47,
"chapter": "In the Attic",
"question": "What food did the officer bring?",
"options": ["Meat", "Bread and jam", "Rice", "Soup"],
"answer": "Bread and jam"
},
{
"id": 48,
"chapter": "In the Attic",
"question": "What sound did Szpilman hear often?",
"options": ["Music", "Gunfire", "Rain", "Animals"],
"answer": "Gunfire"
},
{
"id": 49,
"chapter": "In the Attic",
"question": "What season was approaching when war was ending?",
"options": ["Summer", "Spring", "Winter", "Autumn"],
"answer": "Spring"
},
{
"id": 50,
"chapter": "In the Attic",
"question": "What did the officer say about survival?",
"options": ["Luck matters", "God’s will", "Strength matters", "Money matters"],
"answer": "God’s will"
},
{
"id": 51,
"chapter": "In the Attic",
"question": "Why did Szpilman not want to leave?",
"options": ["Fear", "Attachment to place", "No food", "No clothes"],
"answer": "Attachment to place"
},
{
"id": 52,
"chapter": "In the Attic",
"question": "What did Szpilman offer the officer?",
"options": ["Money", "Food", "Future help", "Clothes"],
"answer": "Future help"
},
{
"id": 53,
"chapter": "In the Attic",
"question": "What animals did he hear in the attic?",
"options": ["Dogs", "Cats", "Rats and mice", "Birds"],
"answer": "Rats and mice"
},
{
"id": 54,
"chapter": "In the Attic",
"question": "What did Szpilman fear most?",
"options": ["Hunger", "Death", "Cold", "Loneliness"],
"answer": "Death"
},
{
"id": 55,
"chapter": "In the Attic",
"question": "What broke the silence in the end?",
"options": ["Music", "Radio announcement", "Gunfire", "Voices"],
"answer": "Radio announcement"
},
{
"id": 56,
"chapter": "In the Attic",
"question": "What did the announcement say?",
"options": ["War started", "Germany defeated", "Food arrived", "People evacuated"],
"answer": "Germany defeated"
},
{
"id": 57,
"chapter": "In the Attic",
"question": "Why did a woman scream on seeing Szpilman?",
"options": ["He was injured", "She thought he was German", "He shouted", "He attacked"],
"answer": "She thought he was German"
},
{
"id": 58,
"chapter": "In the Attic",
"question": "Why was his situation described as absurd?",
"options": ["He was rich", "He was mistaken as enemy", "He was safe", "He was strong"],
"answer": "He was mistaken as enemy"
},
{
"id": 59,
"chapter": "In the Attic",
"question": "What coat was he wearing?",
"options": ["Polish coat", "German military coat", "Old coat", "Black coat"],
"answer": "German military coat"
},
{
"id": 60,
"chapter": "In the Attic",
"question": "What did Szpilman gain at the end?",
"options": ["Money", "Freedom", "Food", "Home"],
"answer": "Freedom"
},
{
"id": 61,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony ask from the crowd at the beginning?",
"options": ["Money", "Attention", "Support", "Silence"],
"answer": "Attention"
},
{
"id": 62,
"chapter": "Friends, Romans, Countrymen",
"question": "Why does Antony say he came to the funeral?",
"options": ["To praise Caesar", "To bury Caesar", "To fight", "To lead"],
"answer": "To bury Caesar"
},
{
"id": 63,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony say about the evil men do?",
"options": ["It disappears", "It lives after them", "It helps others", "It changes"],
"answer": "It lives after them"
},
{
"id": 64,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony suggest about Caesar’s ambition?",
"options": ["It was true", "It was false", "It was unclear", "It was dangerous"],
"answer": "It was false"
},
{
"id": 65,
"chapter": "Friends, Romans, Countrymen",
"question": "What example does Antony give to prove Caesar was not ambitious?",
"options": ["He fought wars", "He refused the crown", "He was rich", "He was king"],
"answer": "He refused the crown"
},
{
"id": 66,
"chapter": "Friends, Romans, Countrymen",
"question": "What did Caesar do when the poor cried?",
"options": ["Ignored them", "Helped them", "Wept", "Punished them"],
"answer": "Wept"
},
{
"id": 67,
"chapter": "Friends, Romans, Countrymen",
"question": "What tone does Antony use in the speech?",
"options": ["Angry", "Calm and persuasive", "Fearful", "Joyful"],
"answer": "Calm and persuasive"
},
{
"id": 68,
"chapter": "Friends, Romans, Countrymen",
"question": "What literary device is used in 'Brutus is an honourable man'?",
"options": ["Simile", "Irony", "Metaphor", "Hyperbole"],
"answer": "Irony"
},
{
"id": 69,
"chapter": "Friends, Romans, Countrymen",
"question": "Why does Antony pause during his speech?",
"options": ["He forgets lines", "He is emotional", "He is tired", "He is scared"],
"answer": "He is emotional"
},
{
"id": 70,
"chapter": "Friends, Romans, Countrymen",
"question": "What effect does Antony’s speech have?",
"options": ["Confuses crowd", "Angers crowd", "Changes crowd’s opinion", "Ends speech"],
"answer": "Changes crowd’s opinion"
},
{
"id": 71,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony remind the crowd about Caesar?",
"options": ["His wealth", "Their love for him", "His army", "His palace"],
"answer": "Their love for him"
},
{
"id": 72,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony compare judgement to?",
"options": ["God", "Beasts", "Kings", "War"],
"answer": "Beasts"
},
{
"id": 73,
"chapter": "Friends, Romans, Countrymen",
"question": "What does Antony say about reason?",
"options": ["People lost it", "People gained it", "It is strong", "It is weak"],
"answer": "People lost it"
},
{
"id": 74,
"chapter": "Friends, Romans, Countrymen",
"question": "What is Antony’s hidden motive?",
"options": ["Praise Brutus", "Avenge Caesar", "Leave Rome", "Help crowd"],
"answer": "Avenge Caesar"
},
{
"id": 75,
"chapter": "Friends, Romans, Countrymen",
"question": "What type of speech is this?",
"options": ["Debate", "Eulogy", "Narration", "Drama"],
"answer": "Eulogy"
},
{
"id": 76,
"chapter": "General",
"question": "What is a rhetorical question?",
"options": ["Needs answer", "No answer needed", "Funny question", "Difficult question"],
"answer": "No answer needed"
},
{
"id": 77,
"chapter": "General",
"question": "What is irony?",
"options": ["Same meaning", "Opposite meaning", "Funny meaning", "Hidden meaning"],
"answer": "Opposite meaning"
},
{
"id": 78,
"chapter": "General",
"question": "What is repetition used for?",
"options": ["Confuse", "Emphasize", "Hide meaning", "Shorten text"],
"answer": "Emphasize"
},
{
"id": 79,
"chapter": "General",
"question": "What is metaphor?",
"options": ["Direct comparison", "Indirect comparison", "Opposite", "Question"],
"answer": "Indirect comparison"
},
{
"id": 80,
"chapter": "General",
"question": "What is alliteration?",
"options": ["Same vowel", "Same sound repetition", "Opposite words", "Rhyming"],
"answer": "Same sound repetition"
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
