require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const sslcQuestions = [
    // CHEMISTRY - Kerala SSLC (English Medium)
    {
        question: "Which of the following elements belongs to the s-block of the periodic table?",
        options: ["Sodium (Na)", "Iron (Fe)", "Oxygen (O)", "Chlorine (Cl)"],
        correctIndex: 0,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Chemistry",
        chapter: "Periodic Table"
    },
    {
        question: "How many moles are present in 44 grams of Carbon Dioxide (CO2)? (Atomic mass: C=12, O=16)",
        options: ["0.5 mole", "1 mole", "2 moles", "1.5 moles"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Chemistry",
        chapter: "Mole Concept"
    },
    {
        question: "Which metal is stored in kerosene due to its high reactivity with air and water?",
        options: ["Gold", "Silver", "Sodium", "Copper"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Chemistry",
        chapter: "Reactivity Series"
    },
    {
        question: "The functional group present in Alcohols is:",
        options: ["-CHO", "-COOH", "-OH", "-CO-"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Chemistry",
        chapter: "Nomenclature of Organic Compounds"
    },
    {
        question: "Which gas is evolved when Magnesium reacts with dilute Hydrochloric acid?",
        options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Chlorine"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Chemistry",
        chapter: "Reactivity Series"
    },

    // BIOLOGY - Kerala SSLC (English Medium)
    {
        question: "Which part of the brain is responsible for involuntary actions like heartbeat and breathing?",
        options: ["Cerebrum", "Cerebellum", "Medulla Oblongata", "Thalamus"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Biology",
        chapter: "Sensations and Responses"
    },
    {
        question: "The pigment present in the rod cells of the eye is:",
        options: ["Iodopsin", "Rhodopsin", "Melanin", "Hemoglobin"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Biology",
        chapter: "Windows of Knowledge"
    },
    {
        question: "Which hormone is known as the 'Emergency Hormone'?",
        options: ["Insulin", "Thyroxine", "Adrenaline", "Glucagon"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Biology",
        chapter: "Chemical Messages for Homeostasis"
    },
    {
        question: "The double helical structure of DNA was proposed by:",
        options: ["Gregor Mendel", "Watson and Crick", "Charles Darwin", "Robert Hooke"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Biology",
        chapter: "Genetic Mysteries"
    },
    {
        question: "Which blood component is responsible for blood clotting?",
        options: ["RBC", "WBC", "Platelets", "Plasma"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Biology",
        chapter: "Soldiers of Defense"
    },

    // PHYSICS - Kerala SSLC (English Medium)
    {
        question: "What is the unit of electric power?",
        options: ["Joule", "Watt", "Volt", "Ampere"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Physics",
        chapter: "Effects of Electric Current"
    },
    {
        question: "Which device is used to convert mechanical energy into electrical energy?",
        options: ["Motor", "Generator", "Transformer", "Capacitor"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Physics",
        chapter: "Electromagnetic Induction"
    },
    {
        question: "The power of a lens is -2D. What is its focal length?",
        options: ["-50 cm", "-20 cm", "50 cm", "20 cm"],
        correctIndex: 0,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Physics",
        chapter: "Reflection of Light"
    },
    {
        question: "Which phenomenon is responsible for the blue color of the sky?",
        options: ["Refraction", "Reflection", "Scattering", "Dispersion"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Physics",
        chapter: "World of Color"
    },
    {
        question: "A heating appliance works on which effect of electric current?",
        options: ["Magnetic effect", "Chemical effect", "Heating effect", "Lighting effect"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Physics",
        chapter: "Effects of Electric Current"
    },

    // SOCIAL SCIENCE - Kerala SSLC (English Medium)
    {
        question: "The first session of the Indian National Congress was held in:",
        options: ["Calcutta", "Madras", "Bombay", "Delhi"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Social Science",
        chapter: "British Exploitation and Resistance"
    },
    {
        question: "On which date did the Jallianwala Bagh massacre take place?",
        options: ["April 13, 1919", "April 15, 1919", "May 10, 1857", "August 15, 1947"],
        correctIndex: 0,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Social Science",
        chapter: "Struggle and Freedom"
    },
    {
        question: "Which of the following is an example of a secondary sector activity?",
        options: ["Agriculture", "Fishing", "Manufacturing", "Banking"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Social Science",
        chapter: "Financial Institutions"
    },
    {
        question: "What is the name of the latitude that passes through the middle of India?",
        options: ["Equator", "Tropic of Cancer", "Tropic of Capricorn", "Arctic Circle"],
        correctIndex: 1,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Social Science",
        chapter: "India: Physiography and Seasons"
    },
    {
        question: "The headquaters of the United Nations is located in:",
        options: ["London", "Paris", "New York", "Geneva"],
        correctIndex: 2,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        medium: "English",
        subject: "Social Science",
        chapter: "World in the 20th Century"
    }
];

async function seedSSLC() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check for duplicates before inserting
        for (const q of sslcQuestions) {
            const exists = await Question.findOne({
                question: q.question,
                subject: q.subject,
                chapter: q.chapter
            });

            if (!exists) {
                await Question.create(q);
                console.log(`Added: [${q.subject}] ${q.question.substring(0, 30)}...`);
            } else {
                console.log(`Skipped (Duplicate): [${q.subject}] ${q.question.substring(0, 30)}...`);
            }
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedSSLC();
