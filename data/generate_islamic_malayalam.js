const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TOTAL_QUESTIONS = 300;
const BATCH_SIZE = 50; 
const OUTPUT_FILE = path.join(__dirname, 'islamic_malayalam_expanded.json');
const API_KEY = process.env.GEMINI_API_KEY;

const PROMPT_TEMPLATE = (count, startIndex) => `
Generate ${count} high-quality Multiple Choice Questions (MCQs) in Malayalam for an Islamic Quiz.
The questions should cover various topics: Quran, Prophets, Pillars of Islam, Islamic History, and Manners (Akhlaq).
Maintain a variety of difficulty levels (1 to 5).
Format the output as a JSON array of objects.
Each object must have:
- "question": (String in Malayalam)
- "options": (Array of 4 strings in Malayalam)
- "correctIndex": (Number 0-3)
- "level": (Number 1-5)
- "category": "Islamic"
- "medium": "Malayalam"

Ensure the Malayalam script is accurate and the questions are authentic.
Respond ONLY with the JSON array.
`;

async function generateBatch(count, startIndex) {
    console.log(`⏳ Generating batch of ${count} questions starting at ${startIndex + 1}...`);
    const prompt = PROMPT_TEMPLATE(count, startIndex);
    
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        const questions = JSON.parse(text);
        return Array.isArray(questions) ? questions : [];
    } catch (error) {
        console.error(`❌ Error generating batch:`, error.message);
        return [];
    }
}

async function run() {
    let allGenerated = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            allGenerated = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            console.log(`📂 Loaded ${allGenerated.length} existing questions from storage.`);
        } catch (e) {
            console.log("⚠️ Failed to parse existing output file. Starting fresh.");
        }
    }

    while (allGenerated.length < TOTAL_QUESTIONS) {
        const remaining = TOTAL_QUESTIONS - allGenerated.length;
        const currentBatchSize = Math.min(BATCH_SIZE, remaining);
        
        const batch = await generateBatch(currentBatchSize, allGenerated.length);
        if (batch.length > 0) {
            allGenerated.push(...batch);
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allGenerated, null, 2), 'utf8');
            console.log(`✅ Batch successful. Total: ${allGenerated.length}/${TOTAL_QUESTIONS}`);
        } else {
            console.log(`⚠️ Batch failed or returned empty. Retrying in 10s...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }

    console.log(`✨ Successfully generated ${allGenerated.length} Islamic questions in Malayalam!`);
    console.log(`📂 Saved to: ${OUTPUT_FILE}`);
}

run();
