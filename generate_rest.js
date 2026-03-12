const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const TOTAL_QUESTIONS = 100;
const BATCH_SIZE = 50; 
const OUTPUT_FILE = path.join(__dirname, 'data', 'islamic_malayalam_raw2.json');
const API_KEY = process.env.GEMINI_API_KEY;

const PROMPT_TEMPLATE = (count) => `
Generate exactly ${count} NEW high-quality Multiple Choice Questions (MCQs) in Malayalam for an Islamic Quiz.
The questions MUST be unique and not repeat common questions like "Who is the last prophet?" or "How many Surahs?".
Cover specific events in Islamic History, biographies of Sahabas, precise Quranic knowledge, Battles, and deep Fiqh.
Format the output as a JSON array of objects.
Each object must have:
- "question": (String in Malayalam)
- "options": (Array of 4 strings in Malayalam)
- "correctIndex": (Number 0-3)
- "answer": (String in Malayalam, matching the correct option)

Wait, just output the JSON array. Do not include markdown tags like \`\`\`json.
`;

async function generateBatch(count) {
    console.log(`⏳ Generating batch of ${count} questions...`);
    const prompt = PROMPT_TEMPLATE(count);
    
    // Using generative language URL
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;
        
        // clean up markdown
        text = text.replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '');

        const questions = JSON.parse(text);
        return Array.isArray(questions) ? questions : [];
    } catch (error) {
        console.error(`❌ Error generating batch:`, error.message);
        return [];
    }
}

async function run() {
    let allGenerated = [];
    
    while (allGenerated.length < TOTAL_QUESTIONS) {
        const remaining = TOTAL_QUESTIONS - allGenerated.length;
        const currentBatchSize = Math.min(BATCH_SIZE, remaining);
        
        const batch = await generateBatch(currentBatchSize);
        if (batch.length > 0) {
            allGenerated.push(...batch);
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allGenerated, null, 2), 'utf8');
            console.log(`✅ Batch successful. Total: ${allGenerated.length}/${TOTAL_QUESTIONS}`);
        } else {
            console.log(`⚠️ Batch failed or returned empty. Retrying in 5s...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    console.log(`✨ Successfully generated ${allGenerated.length} additional Islamic questions!`);
}

run();
