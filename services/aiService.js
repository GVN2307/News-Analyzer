const { GoogleGenerativeAI } = require("@google/generative-ai");
const xss = require("xss");
require('dotenv').config();

// Initialize Gemini only if key is present
const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
// Use gemini-flash-latest which showed success in previous tests
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-flash-latest" }) : null;

async function verifyNews(text) {
    // Sanitize input to prevent prompt injection / XSS
    const cleanText = xss(text.substring(0, 1000)); // Limit length and strip scripts

    if (!cleanText || cleanText.trim().length < 5) {
        return {
            truth_probability_score: 0,
            verdict: "INVALID",
            reasoning: "Please provide a more detailed headline or claim for analysis (minimum 5 characters).",
            sources: []
        };
    }

    if (!model) {
        return {
            truth_probability_score: 0,
            verdict: "OFFLINE",
            reasoning: "AI System is not configured. Please check GEMINI_API_KEY in .env.",
            sources: []
        };
    }

    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
        try {
            const prompt = `
            You are a professional News Verification AI. Analyze the text below.
            Return a JSON object:
            {
                "truth_probability_score": (0-100),
                "verdict": "Likely True" | "Questionable" | "Likely False",
                "reasoning": "Explanation...",
                "sources": ["Source A", "Source B"]
            }
            Text: "${cleanText}"
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let textOutput = response.text();

            // Clean up markdown
            textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                const parsed = JSON.parse(textOutput);
                return {
                    truth_probability_score: parsed.truth_probability_score ?? 50,
                    verdict: parsed.verdict ?? "UNKNOWN",
                    reasoning: parsed.reasoning ?? "Analysis complete.",
                    sources: parsed.sources ?? []
                };
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return {
                    truth_probability_score: 50,
                    verdict: "UNCERTAIN",
                    reasoning: "AI response format was invalid.",
                    sources: []
                };
            }

        } catch (error) {
            console.error(`Gemini AI Error (Attempt ${retryCount + 1}):`, error.message);

            // If it's a 503 or overload, retry after a short delay
            if ((error.message.includes('503') || error.message.includes('500') || error.message.includes('high demand')) && retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }

            return {
                truth_probability_score: 0,
                verdict: "SERVICE BUSY",
                reasoning: "The AI engine is currently under high demand. Please try again in 30 seconds.",
                sources: ["System Alert: Service Overloaded"]
            };
        }
    }
}

module.exports = { verifyNews };
