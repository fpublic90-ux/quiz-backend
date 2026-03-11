const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');

// Configuration
const BOARD = 'Kerala';
const CLASS = '10';
const DEFAULT_CATEGORY = 'Past Papers';

let allQuestions = [];

/**
 * Procedurally generates Mathematics questions based on Kerala SSLC syllabus patterns
 */
function generateMathematics(medium) {
    const questions = [];
    const chapters = ['Arithmetic Sequences', 'Circles', 'Mathematics of Chance', 'Second Degree Equations', 'Trigonometry', 'Coordinates'];

    // 1. Arithmetic Sequences (generate 20 variations)
    for (let i = 1; i <= 20; i++) {
        const a = Math.floor(Math.random() * 10) + 2;
        const d = Math.floor(Math.random() * 5) + 2;
        const n = Math.floor(Math.random() * 15) + 5;
        const nthTerm = a + (n - 1) * d;

        let qText = medium === 'English'
            ? `In an Arithmetic Sequence with first term ${a} and common difference ${d}, what is the ${n}th term?`
            : `ആദ്യപദം ${a} ഉം പൊതുവ്യത്യാസം ${d} ഉം ആയ സമാന്തര ശ്രേണിയിലെ ${n}-ാം പദം ഏത്?`;

        questions.push({
            question: qText,
            options: [`${nthTerm}`, `${nthTerm - d}`, `${nthTerm + d}`, `${nthTerm + 2 * d}`].sort(() => Math.random() - 0.5),
            get correctIndex() { return this.options.indexOf(`${nthTerm}`); },
            category: DEFAULT_CATEGORY, level: 1, board: BOARD, class: CLASS,
            subject: 'Mathematics', medium: medium, chapter: chapters[0]
        });
    }

    // 2. Mathematics of Chance (Probability)
    for (let i = 1; i <= 15; i++) {
        const red = Math.floor(Math.random() * 5) + 3;
        const blue = Math.floor(Math.random() * 5) + 3;
        const total = red + blue;

        let qText = medium === 'English'
            ? `A box contains ${red} red balls and ${blue} blue balls. What is the probability of taking a red ball without looking?`
            : `ഒരു പെട്ടിയിൽ ${red} ചുവന്ന പന്തുകളും ${blue} നീല പന്തുകളും ഉണ്ട്. നോക്കാതെ ഒരു പന്തെടുത്താൽ അത് ചുവപ്പ് ആകാനുള്ള സാധ്യത എന്ത്?`;

        let correctOpt = `${red}/${total}`;
        questions.push({
            question: qText,
            options: [correctOpt, `${blue}/${total}`, `${red - 1}/${total}`, `${1}/${total}`].sort(() => Math.random() - 0.5),
            get correctIndex() { return this.options.indexOf(correctOpt); },
            category: DEFAULT_CATEGORY, level: 2, board: BOARD, class: CLASS,
            subject: 'Mathematics', medium: medium, chapter: chapters[2]
        });
    }

    // 3. Trigonometry
    const trigAngles = [30, 45, 60];
    const sinVals = { '30': '1/2', '45': '1/√2', '60': '√3/2' };
    const cosVals = { '30': '√3/2', '45': '1/√2', '60': '1/2' };
    const tanVals = { '30': '1/√3', '45': '1', '60': '√3' };

    for (let angle of trigAngles) {
        let qTextSin = medium === 'English' ? `What is the value of sin ${angle}°?` : `sin ${angle}° ന്റെ വില എന്ത്?`;
        questions.push(makeQ(qTextSin, sinVals[angle], [cosVals[angle], tanVals[angle], '0'], 'Mathematics', medium, chapters[4]));

        let qTextTan = medium === 'English' ? `What is the value of tan ${angle}°?` : `tan ${angle}° ന്റെ വില എന്ത്?`;
        questions.push(makeQ(qTextTan, tanVals[angle], [cosVals[angle], sinVals[angle], 'Defined'], 'Mathematics', medium, chapters[4]));
    }

    return questions;
}

/**
 * Manually crafted Science Questions
 */
function getScienceQuestions(medium) {
    if (medium === 'English') {
        return [
            // Physics
            makeQ('Which rule is used to find the direction of magnetic field produced by a straight current-carrying conductor?', 'Right-Hand Thumb Rule', ["Fleming's Left Hand Rule", "Fleming's Right Hand Rule", "Faraday's Law"], 'Physics', medium, 'Magnetic Effect of Electric Current'),
            makeQ('The working principle of an electric generator is:', 'Electromagnetic Induction', ['Heating effect of current', 'Magnetic effect of current', 'Chemical effect of current'], 'Physics', medium, 'Electromagnetic Induction'),
            makeQ('The unit of electrical power is:', 'Watt', ['Joule', 'Ampere', 'Volt'], 'Physics', medium, 'Effects of Electric Current'),
            makeQ('Which gas is filled in an incandescent lamp to prevent oxidation of the filament?', 'Nitrogen', ['Oxygen', 'Hydrogen', 'Carbon dioxide'], 'Physics', medium, 'Effects of Electric Current'),
            // Chemistry
            makeQ('Which of the following elements belongs to the halogen family?', 'Chlorine', ['Sodium', 'Magnesium', 'Neon'], 'Chemistry', medium, 'Periodic Table'),
            makeQ('According to Boyle’s Law, at constant temperature, volume of a gas is:', 'Inversely proportional to its pressure', ['Directly proportional to its pressure', 'Directly proportional to its mass', 'Independent of pressure'], 'Chemistry', medium, 'Gas Laws'),
            makeQ('The atomic number of Carbon is 6. Its subshell electronic configuration is:', '1s² 2s² 2p²', ['1s² 2s² 2p⁶', '1s² 2s¹ 2p³', '1s² 2s² 2p¹'], 'Chemistry', medium, 'Periodic Table'),
            makeQ('Which compound forms when an acid reacts with a metal?', 'Salt and Hydrogen gas', ['Salt and Water', 'Water and Carbon dioxide', 'Oxygen and Metal oxide'], 'Chemistry', medium, 'Chemical Reactions'),
            // Biology
            makeQ('The hormone responsible for lowering blood glucose levels is:', 'Insulin', ['Glucagon', 'Thyroxine', 'Adrenaline'], 'Biology', medium, 'Endocrine System'),
            makeQ('Which part of the brain controls voluntary muscle movements and maintains balance?', 'Cerebellum', ['Cerebrum', 'Medulla Oblongata', 'Thalamus'], 'Biology', medium, 'Nervous System'),
            makeQ('The process by which white blood cells engulf pathogens is called:', 'Phagocytosis', ['Osmosis', 'Diffusion', 'Hemolysis'], 'Biology', medium, 'Immune System'),
        ];
    } else {
        // Malayalam Medium Science
        return [
            // Physics (Malayalam)
            makeQ('നേര്‍രേഖാ ചാലകത്തിന് ചുറ്റുമുള്ള കാന്തിക മണ്ഡലത്തിന്റെ ദിശ കണ്ടെത്തുന്നതിനുള്ള നിയമം എന്ത്?', 'വലതുകൈ തള്ളവിരൽ നിയമം', ["ഫ്ലെമിംഗിന്റെ ഇടതുകൈ നിയമം", "ഫ്ലെമിംഗിന്റെ വലതുകൈ നിയമം", "ഫാരഡെയുടെ നിയമം"], 'Physics', medium, 'Magnetic Effect of Electric Current'),
            makeQ('ഇലക്ട്രിക് ജനറേറ്ററിന്റെ അടിസ്ഥാന തത്വം:', 'വൈദ്യുതകാന്തിക പ്രേരിതം (Electromagnetic Induction)', ['വൈദ്യുതിയുടെ താപഫലം', 'വൈദ്യുതിയുടെ കാന്തികഫലം', 'വൈദ്യുതിയുടെ രാസഫലം'], 'Physics', medium, 'Electromagnetic Induction'),
            makeQ('വൈദ്യുത പവറിന്റെ യൂണിറ്റ്:', 'വാട്ട് (Watt)', ['ജൂൾ (Joule)', 'ആമ്പിയർ (Ampere)', 'വോൾട്ട് (Volt)'], 'Physics', medium, 'Effects of Electric Current'),
            // Chemistry (Malayalam)
            makeQ('ഹാലൊജൻ കുടുംബത്തിൽപ്പെട്ട മൂലകം ഏത്?', 'ക്ലോറിൻ', ['സോഡിയം', 'മഗ്നീഷ്യം', 'നിയോൺ'], 'Chemistry', medium, 'Periodic Table'),
            makeQ('ബോയിൽ നിയമം അനുസരിച്ച് നിശ്ചിത താപനിലയിൽ ഒരു വാതകത്തിന്റെ വ്യാപ്തം:', 'മർദ്ദത്തിന് വിപരീതാനുപാതത്തിലാണ്', ['മർദ്ദത്തിന് നേർ അനുപാതത്തിലാണ്', 'മർദ്ദത്തെ ആശ്രയിക്കുന്നില്ല', 'മാസിന് നേർ അനുപാതത്തിലാണ്'], 'Chemistry', medium, 'Gas Laws'),
            // Biology (Malayalam)
            makeQ('രക്തത്തിലെ ഗ്ലൂക്കോസിന്റെ അളവ് കുറയ്ക്കാൻ സഹായിക്കുന്ന ഹോർമോൺ:', 'ഇൻസുലിൻ', ['ഗ്ലൂക്കഗോൺ', 'തൈറോക്സിൻ', 'അഡ്രിനാലിൻ'], 'Biology', medium, 'Endocrine System'),
            makeQ('ഐച്ഛിക പേശികളുടെ ചലനം ഏകോപിപ്പിക്കുകയും ശരീരതുലനാവസ്ഥ പാലിക്കുകയും ചെയ്യുന്ന തലച്ചോറിന്റെ ഭാഗം:', 'സെറിബെല്ലം', ['സെറിബ്രം', 'മെഡുല്ല ഒബ്ലോംഗേറ്റ', 'തലാമസ്'], 'Biology', medium, 'Nervous System'),
        ];
    }
}

/**
 * Manually crafted Social Science & Languages
 */
function getHumanitiesQuestions(medium) {
    if (medium === 'English') {
        return [
            makeQ('Which was the first European country to establish trade relations with India through sea route?', 'Portugal', ['Britain', 'France', 'Netherlands'], 'Social Science I', medium, 'Struggle and Freedom'),
            makeQ('Who established the Ramakrishna Mission?', 'Swami Vivekananda', ['Raja Rammohun Roy', 'Dayananda Saraswati', 'Jyotirao Phule'], 'Social Science I', medium, 'Culture and Nationalism'),
            makeQ('The Reserve Bank of India (RBI) was established in the year:', '1935', ['1947', '1950', '1969'], 'Social Science II', medium, 'Public Administration'),
            makeQ('Which atmospheric layer reflects radio waves?', 'Ionosphere', ['Troposphere', 'Stratosphere', 'Exosphere'], 'Social Science II', medium, 'Atmosphere'),
            makeQ('What is the main function of the Legislative body in a democracy?', 'Making Laws', ['Executing Laws', 'Interpreting Laws', 'Protecting Borders'], 'Social Science I', medium, 'Public Administration'),
        ];
    } else {
        return [
            makeQ('കടൽ മാർഗ്ഗം ഇന്ത്യയുമായി കച്ചവടബന്ധം സ്ഥാപിച്ച ആദ്യത്തെ യൂറോപ്യൻ രാജ്യം ഏത്?', 'പോർച്ചുഗൽ', ['ബ്രിട്ടൻ', 'ഫ്രാൻസ്', 'നെതർലാൻഡ്സ്'], 'Social Science I', medium, 'Struggle and Freedom'),
            makeQ('രാമകൃഷ്ണ മിഷൻ സ്ഥാപിച്ചതാര്?', 'സ്വാമി വിവേകാനന്ദൻ', ['രാജാ റാം മോഹൻ റോയ്', 'ദയാനന്ദ സരസ്വതി', 'ജ്യോതിറാവു ഫൂലെ'], 'Social Science I', medium, 'Culture and Nationalism'),
            makeQ('റിസർവ് ബാങ്ക് ഓഫ് ഇന്ത്യ സ്ഥാപിതമായ വർഷം ഏത്?', '1935', ['1947', '1950', '1969'], 'Social Science II', medium, 'Public Administration'),
            makeQ('റേഡിയോ തരംഗങ്ങളെ പ്രതിഫലിപ്പിക്കുന്ന അന്തരീക്ഷ പാളി ഏത്?', 'അയണോസ്ഫിയർ', ['ട്രോപോസ്ഫിയർ', 'സ്ട്രാറ്റോസ്ഫിയർ', 'എക്സോസ്ഫിയർ'], 'Social Science II', medium, 'Atmosphere'),
        ];
    }
}

function getLanguageQuestions() {
    return [
        // English
        makeQ('Choose the correct phrasal verb: The meeting was _____ due to heavy rain.', 'called off', ['called for', 'called out', 'called at'], 'English', 'English', 'Grammar'),
        makeQ('Fill in the blank with the correct relative pronoun: The boy _____ won the prize is my brother.', 'who', ['whom', 'which', 'whose'], 'English', 'English', 'Grammar'),
        makeQ('Identify the figure of speech: "The wind whispered through the trees."', 'Personification', ['Simile', 'Metaphor', 'Oxymoron'], 'English', 'English', 'Poetry'),

        // Malayalam (Kerala Padavali)
        makeQ('‘ലക്ഷ്മണസാന്ത്വനം’ എന്ന കവിതയുടെ രചയിതാവ് ആര്?', 'എഴുത്തച്ഛൻ', ['ചെറുശ്ശേരി', 'കുഞ്ചൻ നമ്പ്യാർ', 'കുമാരനാശാൻ'], 'Malayalam Kerala Padavali', 'Malayalam', 'Literature'),
        makeQ('വാക്യത്തിൽ പ്രയോഗിക്കുക: "കാക്കത്തൊള്ളായിരം" എന്ന പ്രയോഗത്തിന്റെ അർത്ഥം എന്ത്?', 'ധാരാളം', ['വളരെ കുറവ്', 'അല്പം', 'ഒട്ടുമില്ല'], 'Malayalam Kerala Padavali', 'Malayalam', 'Grammar'),

        // Malayalam (Adisthana Padavali)
        makeQ('‘അമ്മ’ എന്ന അർത്ഥം വരുന്ന പദം ഏത്?', 'മാതാവ്', ['പിതാവ്', 'സഹോദരി', 'ഭാര്യ'], 'Malayalam Adisthana Padavali', 'Malayalam', 'Vocabulary'),
        makeQ('‘ആന’ എന്ന വാക്കിന്റെ പര്യായപദം അല്ലാത്തത് ഏത്?', 'കുതിര', ['കരി', 'മാതംഗം', 'ഗജം'], 'Malayalam Adisthana Padavali', 'Malayalam', 'Vocabulary'),

        // Arabic
        makeQ('مَا مَعْنَى كَلِمَة "قَلَم" فِي اللُّغَةِ الإِنْجِلِيزِيَّة؟ (What is the meaning of "Qalam"?)', 'Pen', ['Book', 'Table', 'House'], 'Arabic', 'Malayalam', 'Vocabulary'),
        makeQ('مَنْ هُوَ خَاتَمُ الأَنْبِيَاء؟ (Who is the seal of prophets?)', 'مُحَمَّد (ص) (Muhammad PBUH)', ['عِيسَى (ع) (Jesus)', 'مُوسَى (ع) (Moses)', 'إِبْرَاهِيم (ع) (Abraham)'], 'Arabic', 'Malayalam', 'Islamic History'),
    ];
}


// Helper
function makeQ(question, correctAns, wrongAnswers, subject, medium, chapter) {
    const options = [correctAns, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAns);
    return {
        question, options, correctIndex, category: DEFAULT_CATEGORY, level: 1,
        board: BOARD, class: CLASS, subject, medium, chapter
    };
}


async function runSeed() {
    console.log("Generating Kerala SSLC Questions...");

    // Generate English Medium
    allQuestions.push(...generateMathematics('English'));
    allQuestions.push(...getScienceQuestions('English'));
    allQuestions.push(...getHumanitiesQuestions('English'));

    // Generate Malayalam Medium
    allQuestions.push(...generateMathematics('Malayalam'));
    allQuestions.push(...getScienceQuestions('Malayalam'));
    allQuestions.push(...getHumanitiesQuestions('Malayalam'));

    // Generate Languages
    allQuestions.push(...getLanguageQuestions());

    console.log(`Generated ${allQuestions.length} unique syllabus-aligned questions.`);

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quizapp';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB. Pushing to Database...');

        // Delete all generated questions (except the manually parsed Physics ones)
        // Actually to be safe, we will clear all and insert all again + parsed
        await Question.deleteMany({ category: 'Past Papers', board: 'Kerala', subject: { $ne: 'General' } });

        const result = await Question.insertMany(allQuestions);
        console.log(`Successfully seeded ${result.length} questions into DB!`);

    } catch (e) {
        console.error("Error connecting to DB:", e);
    } finally {
        mongoose.disconnect();
    }
}

runSeed();
