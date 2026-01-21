const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log("🔄 Connecting to MySQL to initialize database...");

    // Connect without database selected to create it
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to execute queries one by one
        const queries = schema.split(';').filter(q => q.trim());

        for (const query of queries) {
            if (query.trim()) {
                await connection.query(query);
            }
        }

        console.log("✅ Database 'news_analyzer' and tables set up successfully!");
        await connection.end();
    } catch (error) {
        console.error("❌ Database Setup Error:", error.message);
        console.error("If 'Access denied', please check your .env file credentials.");
    }
}

setupDatabase();
