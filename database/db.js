const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'news_analyzer.db');
const db = new sqlite3.Database(dbPath);

// Mimic mysql2/promise pool interface
const pool = {
    execute: (sql, params) => {
        return new Promise((resolve, reject) => {
            // Convert ? placeholders to SQLite compatible if necessary, 
            // but sqlite3 supports ? natively.
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
            });
        });
    },
    query: (sql, params) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve([rows]);
            });
        });
    }
};

module.exports = pool;
