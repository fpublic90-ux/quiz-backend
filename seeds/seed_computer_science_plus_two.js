const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const mongoose = require('mongoose');
const Question = require('../models/Question');

const MODEL = 'models/gemini-2.5-flash';
const BOARD = 'Kerala State';
const CLASS_NAME = '+2';
const MEDIUM = 'English';

const BOOKS = [
  {
    subject: 'Computer Science 1',
    filePath: 'C:/Users/ali akbar/Downloads/finalbook.pdf',
    chapterTargets: [
      ['Structures and Pointers', 29],
      ['Concepts of Object Oriented Programming', 29],
      ['Data Structures and Operations', 29],
      ['Web Technology', 29],
      ['Web Designing Using HTML', 28],
      ['Client Side Scripting Using JavaScript', 28],
      ['Web Hosting', 28],
    ],
  },
  {
    subject: 'Computer Science 2',
    filePath: 'C:/Users/ali akbar/Downloads/FinalBook 2.pdf',
    chapterTargets: [
      ['Database Management System', 40],
      ['Structured Query Language', 40],
      ['Server Side Scripting Using PHP', 40],
      ['Advances in Computing', 40],
      ['ICT and Society', 40],
    ],
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeQuestion(item, subject, chapter) {
  if (!item || typeof item !== 'object') return null;

  const question = typeof item.question === 'string' ? item.question.trim() : '';
  const options = Array.isArray(item.options)
    ? item.options.map((opt) => (typeof opt === 'string' ? opt.trim() : '')).filter(Boolean)
    : [];
  const correctIndex = Number.isInteger(item.correctIndex) ? item.correctIndex : -1;

  if (!question || options.length !== 4 || correctIndex < 0 || correctIndex > 3) {
    return null;
  }

  return {
    board: BOARD,
    class: CLASS_NAME,
    medium: MEDIUM,
    subject,
    chapter,
    level: 1,
    question,
    options,
    correctIndex,
  };
}

function parseJsonArray(text) {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error('Model did not return a JSON array');
  }
  return parsed;
}

async function uploadPdf(fileManager, filePath) {
  const upload = await fileManager.uploadFile(filePath, {
    mimeType: 'application/pdf',
    displayName: path.basename(filePath),
  });

  let file = await fileManager.getFile(upload.file.name);
  while (file.state === 'PROCESSING') {
    await sleep(5000);
    file = await fileManager.getFile(upload.file.name);
  }

  if (file.state !== 'ACTIVE') {
    throw new Error(`Uploaded file did not become ACTIVE: ${file.state}`);
  }

  return {
    name: upload.file.name,
    uri: file.uri,
    mimeType: file.mimeType,
  };
}

async function generateChapterBatch(apiKey, fileData, subject, chapter, count, excludedStems) {
  const exclusionText = excludedStems.length
    ? `Do not repeat or closely paraphrase any of these existing question stems:\n- ${excludedStems.join('\n- ')}`
    : 'All question stems must be unique within this chapter.';

  const prompt = `
You are an expert Kerala State Plus Two Computer Science teacher.
Read the attached textbook carefully and generate exactly ${count} high-quality MCQs ONLY from the chapter "${chapter}" for the subject "${subject}".

Requirements:
- The questions must match Kerala State Plus Two English medium syllabus language and level.
- Use the exact chapter title "${chapter}".
- Each question must have exactly 4 short, plausible options.
- Only one option must be correct.
- Use direct, exam-style MCQs. Avoid tricky wording, repeated stems, and filler questions.
- Cover different subtopics from the chapter, not the same concept repeatedly.
- ${exclusionText}

Return ONLY a JSON array in this exact format:
[
  {
    "question": "Sample question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0
  }
]
`;

  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { fileData },
        { text: prompt },
      ],
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`Gemini returned no text for ${subject} / ${chapter}`);
  }

  return parseJsonArray(text);
}

async function buildSubjectQuestions(apiKey, fileManager, bookConfig) {
  const uploadedFile = await uploadPdf(fileManager, bookConfig.filePath);
  const fileData = {
    fileUri: uploadedFile.uri,
    mimeType: uploadedFile.mimeType,
  };

  const subjectQuestions = [];
  const subjectSeen = new Set();

  try {
    for (const [chapter, targetCount] of bookConfig.chapterTargets) {
      let chapterQuestions = [];
      let attempts = 0;

      while (chapterQuestions.length < targetCount && attempts < 4) {
        attempts += 1;
        const remaining = targetCount - chapterQuestions.length;
        const excludedStems = chapterQuestions
          .map((item) => item.question)
          .slice(-30);

        console.log(`Generating ${remaining} questions for ${bookConfig.subject} / ${chapter} (attempt ${attempts})`);

        const generated = await generateChapterBatch(
          apiKey,
          fileData,
          bookConfig.subject,
          chapter,
          remaining,
          excludedStems,
        );

        for (const item of generated) {
          const normalized = normalizeQuestion(item, bookConfig.subject, chapter);
          if (!normalized) continue;

          const key = normalized.question.toLowerCase();
          if (subjectSeen.has(key)) continue;

          subjectSeen.add(key);
          chapterQuestions.push(normalized);
        }
      }

      if (chapterQuestions.length < targetCount) {
        throw new Error(
          `Could not generate enough unique questions for ${bookConfig.subject} / ${chapter}. Got ${chapterQuestions.length}, expected ${targetCount}`,
        );
      }

      subjectQuestions.push(...chapterQuestions.slice(0, targetCount));
    }
  } finally {
    await fileManager.deleteFile(uploadedFile.name).catch(() => {});
  }

  return subjectQuestions;
}

function validateSubjectTotals(questions) {
  const grouped = questions.reduce((acc, item) => {
    acc[item.subject] = (acc[item.subject] || 0) + 1;
    return acc;
  }, {});

  if (grouped['Computer Science 1'] !== 200 || grouped['Computer Science 2'] !== 200) {
    throw new Error(`Unexpected subject totals: ${JSON.stringify(grouped)}`);
  }
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in .env');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env');
  }

  const fileManager = new GoogleAIFileManager(apiKey);
  const allQuestions = [];

  for (const book of BOOKS) {
    const subjectQuestions = await buildSubjectQuestions(apiKey, fileManager, book);
    allQuestions.push(...subjectQuestions);
  }

  validateSubjectTotals(allQuestions);

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    await Question.deleteMany({
      board: BOARD,
      class: CLASS_NAME,
      medium: MEDIUM,
      subject: { $in: ['Computer Science 1', 'Computer Science 2'] },
    });

    const inserted = await Question.insertMany(allQuestions);

    const summary = inserted.reduce((acc, item) => {
      const key = `${item.subject} :: ${item.chapter}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    console.log(`Inserted ${inserted.length} Computer Science questions.`);
    console.log(summary);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error('Failed to seed Computer Science questions:', error);
  process.exit(1);
});
