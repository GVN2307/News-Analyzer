const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database/news_analyzer.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Creating tables for SQLite...");

    db.run(`
        CREATE TABLE IF NOT EXISTS citizen_news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reporter_name TEXT,
            location TEXT,
            headline TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS verification_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query_text TEXT,
            ai_score REAL,
            ai_analysis TEXT,
            verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("SQLite database initialized successfully at:", dbPath);
});

db.close();
