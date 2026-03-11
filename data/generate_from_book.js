const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const mongoose = require('mongoose');
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require('../models/Question');

async function extractQuestionsFromTextbook() {
    console.log("Starting TextBook AI Extraction...");
    
    const fileName = process.argv[2];
    const subject = process.argv[3];
    const medium = process.argv[4];

    if (!fileName || !subject || !medium) {
        console.error("Usage: node generate_from_book.js <filename> <subject> <medium>");
        console.log("Example: node generate_from_book.js 'Hsslive-15_Physics Eng.pdf' 'Physics' 'English'");
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

    const fileManager = new GoogleAIFileManager(apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log(`Uploading ${fileName} to Gemini API... This might take a few moments for large PDFs.`);
        
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: "application/pdf",
            displayName: fileName,
        });

        const fileUri = uploadResult.file.uri;
        console.log(`✅ Upload complete. URI: ${fileUri}`);

        // Wait for processing
        let file = await fileManager.getFile(uploadResult.file.name);
        console.log("Waiting for Gemini to process the PDF...");
        while (file.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise(resolve => setTimeout(resolve, 5000));
            file = await fileManager.getFile(uploadResult.file.name);
        }
        console.log(`\nFile state is now: ${file.state}`);

        if (file.state === "FAILED") {
            console.error("PDF processing failed on Gemini servers.");
            process.exit(1);
        }

        console.log("Generating questions via gemini-1.5-flash via REST API...");
        
        const prompt = `
        You are an expert Kerala SSLC (Class 10) high school teacher.
        Read the attached PDF textbook. 
        It is the official Kerala State board textbook for ${subject} in ${medium} medium.
        
        Your task is to carefully read chapters from the book and generate 20 highly accurate Multiple Choice Questions (MCQs) based on the core syllabus concepts taught in this textbook.
        Make sure the language matches the medium (${medium}). If the medium is Malayalam, write the questions and options entirely in Malayalam.

        Requirements:
        1. Create exactly 20 questions.
        2. Assign a relevant "chapter" name to each question based on the textbook's table of contents.
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
        `;

        const restPayload = {
            contents: [{
                role: "user",
                parts: [
                    {
                        fileData: {
                            fileUri: file.uri,
                            mimeType: file.mimeType
                        }
                    },
                    { text: prompt }
                ]
            }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(restPayload)
        });

        if (!response.ok) {
           const errText = await response.text();
           console.error("REST API Error:", errText);
           process.exit(1);
        }

        const resultJson = await response.json();
        let responseText = resultJson.candidates[0].content.parts[0].text;
        
        // Remove common markdown block wrappers if present
        responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const questionsArray = JSON.parse(responseText);

        console.log(`\n✅ Gemini successfully generated ${questionsArray.length} questions!`);

        // Seed to MongoDB
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quizapp';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB. Seeding to Database...');
        
        const dbResult = await Question.insertMany(questionsArray);
        console.log(`Successfully seeded ${dbResult.length} AI-generated questions into DB!`);

        // Clean up: delete file from Google's servers to save storage quota
        await fileManager.deleteFile(uploadResult.file.name);
        console.log("Cleaned up PDF from Gemini servers.");

    } catch (e) {
        console.error("Error during extraction:", e);
    } finally {
        mongoose.disconnect();
    }
}

extractQuestionsFromTextbook();
