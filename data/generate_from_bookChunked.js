const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require('../models/Question');
const pdfParse = require('pdf-parse');

async function extractQuestionsFromTextbook() {
    console.log("Starting Chunked TextBook AI Extraction...");
    
    const fileName = process.argv[2];
    const subject = process.argv[3];
    const medium = process.argv[4];

    if (!fileName || !subject || !medium) {
        console.error("Usage: node generate_from_bookChunked.js <filename> <subject> <medium>");
        console.log("Example: node generate_from_bookChunked.js 'Hsslive-15_Physics Eng.pdf' 'Physics' 'English'");
        process.exit(1);
    }

    const filePath = path.join(__dirname, 'pdf books', fileName);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in .env");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log(`Extracting raw text from ${fileName} locally... This may take a minute for large files.`);
        
        const dataBuffer = fs.readFileSync(filePath);
        
        // This parse call might output warnings if the PDF has complex fonts, but it will extract the English/Malayalam strings usually
        const pdfData = await pdfParse(dataBuffer);
        
        const rawText = pdfData.text;
        console.log(`✅ Extraction complete. PDF has ${pdfData.numpages} pages and ${rawText.length} characters.`);

        // Due to Gemini flash context limits with raw text (vs file upload), we shouldn't send 500k chars at once.
        // Let's grab a random contiguous chunk from the middle of the book to get good content
        
        const chunkLength = 150000; // About 50-70 pages of text max
        let extractedQuestions = [];
        
        // Let's do 3 random chunks from the book to get a spread of chapters
        const numChunks = 3;
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        });

        for(let i=0; i<numChunks; i++) {
            
            console.log(`\n--- Processing Chunk ${i+1}/${numChunks} ---`);
            
            // Random start index, ensuring we have enough space for the chunk
            const startIndex = Math.floor(Math.random() * Math.max(0, rawText.length - chunkLength));
            const chunkText = rawText.substring(startIndex, startIndex + chunkLength);
            
            const prompt = `
            You are an expert Kerala SSLC (Class 10) high school teacher.
            Read the following chunk of text extracted from the official Kerala State board textbook for ${subject} in ${medium} medium.
            
            Your task is to carefully read this text and generate 15 highly accurate Multiple Choice Questions (MCQs) based on the core syllabus concepts taught in this exact chunk.
            Make sure the language matches the medium (${medium}). If the medium is Malayalam, write the questions and options entirely in Malayalam.

            Requirements:
            1. Create exactly 15 questions based ONLY on the provided text.
            2. Assign a relevant "chapter" name to each question based on what the text seems to be about.
            3. Make sure there are exactly 4 options.
            4. Provide the correct index (0 to 3).
            5. The output MUST be a JSON array of objects matching this exact schema:
            
            [
            {
                "question": "What is the capital of India?",
                "options": ["Delhi", "Mumbai", "Kochi", "Chennai"],
                "correctIndex": 0,
                "category": "Kerala Syllabus",
                "level": 1,
                "board": "Kerala",
                "class": "10",
                "subject": "${subject}",
                "medium": "${medium}",
                "chapter": "General Knowledge"
            }
            ]

            Here is the textbook chunk:
            \`\`\`
            ${chunkText}
            \`\`\`
            `;

            console.log("Generating questions via gemini-1.5-flash...");
            const result = await model.generateContent(prompt);
            
            let responseText = result.response.text();
            // Remove common markdown block wrappers if present
            responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
            
            try {
                const chunkArray = JSON.parse(responseText);
                console.log(`✅ Chunk ${i+1} generated ${chunkArray.length} questions!`);
                extractedQuestions = extractedQuestions.concat(chunkArray);
            } catch (jsonErr) {
                console.error(`Failed to parse JSON for Chunk ${i+1}. Skipping chunk.`);
            }
        }

        console.log(`\n🎉 Gemini successfully generated a total of ${extractedQuestions.length} questions across all chunks!`);

        if (extractedQuestions.length > 0) {
            // Seed to MongoDB
            const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quizapp';
            await mongoose.connect(uri);
            console.log('Connected to MongoDB. Seeding to Database...');
            
            const dbResult = await Question.insertMany(extractedQuestions);
            console.log(`Successfully seeded ${dbResult.length} AI-generated textbook questions into DB!`);
        }

    } catch (e) {
        console.error("Error during extraction:", e);
    } finally {
        if(mongoose.connection.readyState !== 0) {
            mongoose.disconnect();
        }
    }
}

extractQuestionsFromTextbook();
