# 🗞️ News Analyzer (Super Simple Setup Guide)

This is a website that uses **AI** to check if news is true or false. It also shows live news and lets people report local news.

---

## 🚀 How to Run This on Your Computer (Step-by-Step)

Follow these **5 easy steps** to get the website running:

### Step 1: Install Node.js
Make sure you have **Node.js** installed on your computer. If you don't, download it from [nodejs.org](https://nodejs.org/).

### Step 2: Open your Terminal (Command Prompt)
Open the folder where you downloaded this code. Inside that folder, open your Terminal or PowerShell.

### Step 3: Type this command and press Enter
This will download all the "brain" parts the website needs.
```bash
npm install
```

### Step 4: Set up your API Key (THE MOST IMPORTANT STEP!)
The website needs a "Key" to talk to the AI. 
1. Look for a file named `.env.example`.
2. **Rename** it to just `.env` (delete the `.example` part).
3. Open that `.env` file in Notepad.
4. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and click **"Create API Key"**.
5. Copy that long code and paste it after `GEMINI_API_KEY=` in your file.
6. Save and close the file.

### Step 5: Start the Website!
Go back to your terminal and type:
```bash
npm start
```

---

## 🌐 How to view the website?
Once you see "Server running", open your browser (Chrome/Edge) and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 Using the AI Verify Studio
1. Click on the **AI Verify** tab in the menu.
2. Type in a news headline (Example: "Man lands on Mars today").
3. Click the **Analyze Now** button.
4. Watch the AI calculate the "Truth Score"!

---

## 🛠️ Troubleshooting (If it doesn't work)
- **"Connection Failed"**: Make sure you saved your API Key in the `.env` file correctly.
- **"Command not found"**: Make sure you installed Node.js in Step 1.
- **"Database Error"**: This happens if you haven't set up MySQL, but the **AI Verification** will still work fine!

---
**Enjoy your AI News Analyzer!** 🕶️🧠
