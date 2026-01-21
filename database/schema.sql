CREATE DATABASE IF NOT EXISTS news_analyzer;

USE news_analyzer;

CREATE TABLE IF NOT EXISTS citizen_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_name VARCHAR(100),
    location VARCHAR(100),
    headline VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query_text TEXT,
    ai_score DECIMAL(5, 2),
    ai_analysis JSON,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
