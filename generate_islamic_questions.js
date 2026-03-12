const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

async function generateBatch(startLevel, count) {
    const prompt = `Generate ${count} unique multiple-choice questions about Islam in Malayalam language for a quiz app. 
    The questions should be suitable for Islamic General Knowledge.
    Format the output as a JSON array of objects with the following structure:
    {
        "question": "string",
        "options": ["option1", "option2", "option3", "option4"],
        "correctIndex": number (0-3),
        "category": "Islamic",
        "level": number (incremental starting from ${startLevel}),
        "medium": "Malayalam"
    }
    Ensure questions are diverse (Prophets, History, Quran, Fiqh, etc.) and strictly in Malayalam. 
    Only return the JSON array, no other text.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean markdown if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating batch:", error);
        return [];
    }
}

async function start() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const currentCount = await Question.countDocuments({ category: 'Islamic' });
    console.log(`Current Islamic questions: ${currentCount}`);
    
    if (currentCount >= 1000) {
        console.log("Already have 1000+ questions. Skipping.");
        process.exit(0);
    }

    let needed = 1000 - currentCount;
    let startLevel = Math.ceil(currentCount / 10) + 1;
    
    console.log(`Generating approx ${needed} more questions starting from level ${startLevel}...`);

    while (needed > 0) {
        const batchSize = Math.min(50, needed); // Safe batch size
        console.log(`Generating batch of ${batchSize}...`);
        
        const questions = await generateBatch(startLevel, batchSize);
        
        if (questions && questions.length > 0) {
            await Question.insertMany(questions);
            console.log(`Inserted ${questions.length} questions.`);
            
            needed -= questions.length;
            startLevel += Math.ceil(questions.length / 10);
            
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            console.log("Empty batch received, retrying...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    console.log("Data generation complete!");
    process.exit(0);
}

start();
