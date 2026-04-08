const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
    const outDir = path.join(__dirname, 'outputs-png');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }
    
    console.log('Launching browser...');
    // Add args to make sure puppeteer runs smoothly on windows
    const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1440, height: 900 } });
    const page = await browser.newPage();

    const pagesInfo = [
        { name: '1_home_screen', url: 'http://localhost:3000/' },
        { name: '2_live_intel_news', url: 'http://localhost:3000/news.html' },
        { name: '3_verify_studio', url: 'http://localhost:3000/verify.html' },
        { name: '4_citizen_network', url: 'http://localhost:3000/citizen.html' }
    ];

    for (const p of pagesInfo) {
        console.log(`Navigating to ${p.url}...`);
        try {
            await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
            // wait an extra 2 seconds for any animations/feeds to load
            await delay(2000); 
            const savePath = path.join(outDir, `${p.name}.png`);
            await page.screenshot({ path: savePath, fullPage: true });
            console.log(`Saved screenshot: ${savePath}`);
        } catch (e) {
            console.error(`Failed to capture ${p.name}:`, e.message);
        }
    }

    await browser.close();
    console.log('All screenshots captured successfully in outputs-png folder!');
    process.exit(0);
})();
