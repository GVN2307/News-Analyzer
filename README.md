# News Analyzer | AI-Powered Truth Platform

News Analyzer is a comprehensive platform designed to combat misinformation using AI. It features real-time news aggregation from major Indian sources, a decentralized citizen journalism portal, and an advanced AI verification engine.

## 🚀 Features

- **Live News Aggregator**: Real-time updates from *The Hindu*, *Times of India*, and *Hindustan Times* via RSS.
- **AI Verification Engine**: 
  - Input any headline or claim.
  - Generates a **Truth-Probability Score** (0-100%).
  - Provides detailed analysis and debunking evidence.
  - Powered by LLM (OpenAI GPT).
- **Citizen Journalism Portal**: 
  - Decentralized reporting tool for local news.
  - Submit stories with location and images.
  - Community feed.
- **Rich Experimental UI**: 
  - Glassmorphism design system.
  - Neon aesthetics with dynamic parallax backgrounds.
  - Interactive data visualizations.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Advanced Animations, Variables), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (for Citizen Reporting).
- **AI**: OpenAI API (GPT-3.5/4).
- **Security**: Helmet, Rate Limiting, CORS.

## ⚙️ Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Ensure MySQL is running.
   - Create the database and tables using the provided schema:
     ```bash
     mysql -u root -p < database/schema.sql
     ```

3. **Environment Configuration**
   - Rename `.env.example` to `.env` (or create it) and fill in your details:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=news_analyzer
     OPENAI_API_KEY=sk-... (Your OpenAI Key)
     ```

4. **Run the Application**
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```
