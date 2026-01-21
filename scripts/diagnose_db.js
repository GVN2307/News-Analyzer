const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    console.log("🔍 Checking Database Connection...");
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'news_analyzer'
        });
        console.log("✅ Connection Successful!");

        const [rows] = await connection.query("SHOW TABLES LIKE 'citizen_news'");
        if (rows.length > 0) {
            console.log("✅ Table 'citizen_news' exists.");
        } else {
            console.log("❌ Table 'citizen_news' MISSING.");
        }
        await connection.end();
    } catch (e) {
        console.log("❌ Connection Failed:", e.message);
    }
}
check();
