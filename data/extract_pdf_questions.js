const fs = require('fs');
const PDFParser = require("pdf2json");
const path = require('path');

const PAPERS_DIR = path.join(__dirname, 'papers');
const OUTPUT_FILE = path.join(__dirname, 'extracted_sslc_questions.json');

// Ensure directories exist
if (!fs.existsSync(PAPERS_DIR)) {
    fs.mkdirSync(PAPERS_DIR);
}

// Function to process a single PDF's raw text
function extractQuestionsFromText(rawText, subject = "Science", year = "2024") {
    const questions = [];

    // Clean up text: remove page breaks, urls etc.
    let cleanText = rawText.replace(/www\.educationobserver\.com/g, '');
    cleanText = cleanText.replace(/----------------Page \(\d+\) Break----------------/g, '');

    // Split text by numbered questions e.g. "1. ", "2. "
    const blocks = cleanText.split(/\n(?=\d+\.)/);

    for (let block of blocks) {
        if (!block.trim()) continue;

        // Match Question Text
        const qMatch = block.match(/^\d+\.\s*([\s\S]*?)(?=\n[a-d]\)|\nAnswer:|\([a-z0-9\s,\/]+\))/i);
        if (!qMatch) continue;

        let questionText = qMatch[1].trim().replace(/\n/g, ' ');

        // Match Options provided in a) b) c) d) format
        let options = [];
        const optA = block.match(/a\)\s*(.*?)(?=\nb\)|Answer:|$)/i);
        const optB = block.match(/b\)\s*(.*?)(?=\nc\)|Answer:|$)/i);
        const optC = block.match(/c\)\s*(.*?)(?=\nd\)|Answer:|$)/i);
        const optD = block.match(/d\)\s*(.*?)(?=\nAnswer:|$)/i);

        if (optA && optB && optC && optD) {
            options = [optA[1].trim(), optB[1].trim(), optC[1].trim(), optD[1].trim()];
        } else {
            // Match options provided in brackets e.g. (circular / oscillatory)
            const bracketMatch = block.match(/\(([^)]+)\)/);
            if (bracketMatch && bracketMatch[1].includes('/')) {
                options = bracketMatch[1].split('/').map(s => s.trim());
            } else if (bracketMatch && bracketMatch[1].includes(',')) {
                options = bracketMatch[1].split(',').map(s => s.trim());
            }
        }

        // Match Answer
        const ansMatch = block.match(/Answer:\s*([\s\S]*?)(?=\n\d+\.|\nExplanation:|$)/i);
        let answerText = "";
        if (ansMatch) {
            answerText = ansMatch[1].trim().replace(/\n/g, ' ');
            // If answer is like "c) Sound is...", remove the "c) "
            answerText = answerText.replace(/^[a-d]\)\s*/i, '');
        }

        // If we found a valid question and answer
        if (questionText && answerText && options.length >= 2) {
            // Guarantee exactly 4 options by padding
            while (options.length < 4) {
                options.push(`Alternative ${options.length + 1}`);
            }
            if (options.length > 4) {
                options = options.slice(0, 4);
            }

            // Determine correct index
            let correctIndex = options.findIndex(opt => answerText.toLowerCase().includes(opt.toLowerCase()));
            if (correctIndex === -1 && answerText) {
                // If answer doesn't perfectly match an option (e.g. because of extra text), just replace the first option with the true answer
                options[0] = answerText;
                correctIndex = 0;
            }

            questions.push({
                question: `${questionText}`,
                options: options,
                correctIndex: correctIndex === -1 ? 0 : correctIndex,
                category: "Past Papers",
                level: 1, // Base level, can be mapped depending on difficulty
                board: 'Kerala',
                class: '10',
                subject: subject
            });
        }
    }
    return questions;
}

function processAllPdfs() {
    const files = fs.readdirSync(PAPERS_DIR).filter(f => f.endsWith('.pdf'));
    if (files.length === 0) {
        console.log(`No PDFs found in ${PAPERS_DIR}. Please add some and run again.`);
        return;
    }

    let allExtractedQuestions = [];
    let processedCount = 0;

    files.forEach(file => {
        let pdfParser = new PDFParser(this, 1);

        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

        pdfParser.on("pdfParser_dataReady", pdfData => {
            const rawText = pdfParser.getRawTextContent();

            // Simple heuristic to guess subject from filename
            let subject = "General";
            if (file.toLowerCase().includes('science')) subject = "Science";
            if (file.toLowerCase().includes('physics')) subject = "Physics";
            if (file.toLowerCase().includes('math')) subject = "Mathematics";

            const questions = extractQuestionsFromText(rawText, subject);
            allExtractedQuestions = allExtractedQuestions.concat(questions);
            console.log(`Extracted ${questions.length} questions from ${file}`);

            processedCount++;
            if (processedCount === files.length) {
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allExtractedQuestions, null, 2));
                console.log(`\nSuccessfully saved ${allExtractedQuestions.length} total questions to ${OUTPUT_FILE}`);
                console.log("Run 'node data/seed_past_papers.js' to inject these into the database.");
            }
        });

        const filePath = path.join(PAPERS_DIR, file);
        pdfParser.loadPDF(filePath);
    });
}

processAllPdfs();
