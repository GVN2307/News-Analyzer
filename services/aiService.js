const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini only if key is present
const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

async function verifyNews(text) {
    if (!model) {
        return {
            score: 0,
            analysis: "API Key missing. Please configure GEMINI_API_KEY in .env to get real verification.",
            is_mock: true
        };
    }

    try {
        const prompt = `
        You are a professional News Verification AI. Your job is to analyze the user's input (a headline or short news text) and determine its likelihood of being true.
        
        Analyze for:
        1. Clickbait linguistic patterns.
        2. Logical inconsistencies.
        3. Known misinformation tropes.
        
        Return a JSON object strictly in this format (no markdown, no extra text):
        {
            "truth_probability_score": (number 0-100),
            "verdict": "Likely True" | "Questionable" | "Likely False",
            "reasoning": "A concise explanation of why...",
            "sources": ["List of potential sources or 'Unknown'"]
        }
        
        News to verify: "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textOutput = response.text();

        // Clean up markdown if Gemini wraps it in ```json ... ```
        textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(textOutput);
        } catch (e) {
            console.error("JSON Parse Error:", e, "Raw Output:", textOutput);
            return {
                truth_probability_score: 50,
                verdict: "Unsure",
                reasoning: "AI output could not be parsed. Raw output: " + textOutput.substring(0, 100) + "...",
                sources: []
            };
        }

    } catch (error) {
        console.error("Gemini AI Error:", error);
        return {
            score: 0,
            analysis: "Error communicating with AI service.",
            error: error.message
        };
    }
}

module.exports = { verifyNews };
