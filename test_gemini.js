const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
    try {
        console.log("Checking models...");
        // Test a very basic prompt with gemini-pro (v1)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("gemini-pro response:", response.text());
    } catch (e) {
        console.error("gemini-pro failed:", e.message);
    }

    try {
        // Test gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("gemini-1.5-flash response:", response.text());
    } catch (e) {
        console.error("gemini-1.5-flash failed:", e.message);
    }
}

checkModels();
