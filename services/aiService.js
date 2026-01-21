const OpenAI = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI only if key is present
const openai = apiKey ? new OpenAI({ apiKey }) : null;

async function verifyNews(text) {
    if (!openai) {
        return {
            score: 0,
            analysis: "API Key missing. Please configure OPENAI_API_KEY in .env to get real verification.",
            is_mock: true
        };
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Cost-effective for high volume
            messages: [
                {
                    role: "system",
                    content: `You are a professional News Verification AI. Your job is to analyze the user's input (a headline or short news text) and determine its likelihood of being true.
                    
                    Analyze for:
                    1. Clickbait linguistic patterns.
                    2. Logical inconsistencies.
                    3. Known missinformation tropes.
                    
                    Return a JSON object strictly in this format:
                    {
                        "truth_probability_score": (number 0-100),
                        "verdict": "Likely True" | "Questionable" | "Likely False",
                        "reasoning": "A concise explanation of why...",
                        "sources": ["List of potential sources or 'Unknown'"]
                    }
                    Only return the JSON object.`
                },
                {
                    role: "user",
                    content: `Verify this news: "${text}"`
                }
            ],
            temperature: 0.3,
        });

        const rawContent = completion.choices[0].message.content;
        try {
            return JSON.parse(rawContent);
        } catch (e) {
            // Fallback if AI doesn't return perfect JSON
            return {
                truth_probability_score: 50,
                verdict: "Unsure",
                reasoning: "AI output could not be parsed. Raw output: " + rawContent,
                sources: []
            };
        }

    } catch (error) {
        console.error("OpenAI Error:", error);
        return {
            score: 0,
            analysis: "Error communicating with AI service.",
            error: error.message
        };
    }
}

module.exports = { verifyNews };
