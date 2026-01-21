const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Parser = require('rss-parser');
const path = require('path');
const db = require('./database/db');
const { verifyNews } = require('./services/aiService');

require('dotenv').config();

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 3000;

// Security & Optimization Middleware
app.use(helmet());
// Allow scripts from self and specific CDNs if needed (adjusting CSP for flexibility in this demo)
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"], // Allow inline for simple demo logic
        imgSrc: ["'self'", "data:", "https:", "*"], // Allow images from external news sites
        connectSrc: ["'self'", "https://*"],
    },
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root Redirect to Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// --- Routes ---

// 1. Live News Aggregator
app.get('/api/news/live', async (req, res) => {
    try {
        const feeds = [
            { source: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
            { source: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
            { source: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' }
        ];

        const newsPromises = feeds.map(async (feed) => {
            try {
                const parsed = await parser.parseURL(feed.url);
                // Return top 5 from each
                return parsed.items.slice(0, 5).map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    source: feed.source,
                    snippet: item.contentSnippet || item.content
                }));
            } catch (err) {
                console.error(`Error fetching ${feed.source}:`, err.message);
                return [];
            }
        });

        const results = await Promise.all(newsPromises);
        const flattened = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        res.json({ success: true, count: flattened.length, data: flattened });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch news feed' });
    }
});

// 2. Citizen Journalism - Submit
app.post('/api/news/citizen', async (req, res) => {
    const { reporter_name, location, headline, content, image_url } = req.body;

    if (!headline || !content) {
        return res.status(400).json({ success: false, message: 'Headline and Content are required.' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO citizen_news (reporter_name, location, headline, content, image_url) VALUES (?, ?, ?, ?, ?)',
            [reporter_name || 'Anonymous', location || 'Unknown', headline, content, image_url || '']
        );
        res.json({ success: true, message: 'News reported successfully!', id: result.insertId });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// 3. Citizen Journalism - Get All
app.get('/api/news/citizen', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM citizen_news ORDER BY created_at DESC LIMIT 50');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// 4. AI Verification
app.post('/api/verify', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'No text provided' });

    const result = await verifyNews(text);

    // Log verification request (optional, non-blocking)
    db.execute('INSERT INTO verification_logs (query_text, ai_score, ai_analysis) VALUES (?, ?, ?)',
        [text, result.truth_probability_score || 0, JSON.stringify(result)]
    ).catch(err => console.error("Log Error:", err));

    res.json({ success: true, data: result });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
