document.addEventListener('DOMContentLoaded', () => {
    initLiveNews();
    initCitizenFeed();

    // Bind Verification Button
    document.getElementById('verify-btn').addEventListener('click', handleVerification);

    // Bind Citizen Form
    document.getElementById('citizen-form').addEventListener('submit', handleCitizenSubmit);
});

async function initLiveNews() {
    const container = document.getElementById('news-feed-container');
    try {
        const res = await fetch('/api/news/live');
        const json = await res.json();

        if (json.success) {
            container.innerHTML = '';
            json.data.forEach(item => {
                const date = new Date(item.pubDate).toLocaleDateString();
                const card = `
                    <div class="news-card">
                        <span class="source-badge">${item.source}</span>
                        <div class="news-title">${item.title}</div>
                        <div class="news-date">${date}</div>
                        <p style="font-size: 0.9rem; color: #ccc; margin-top:0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${item.snippet.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>
                        <a href="${item.link}" target="_blank" class="news-link">Read Source <i class="fa-solid fa-external-link-alt"></i></a>
                    </div>
                `;
                container.innerHTML += card;
            });
        }
    } catch (e) {
        container.innerHTML = '<p>Offline or Error Loading News.</p>';
    }
}

async function handleVerification() {
    const text = document.getElementById('verify-input').value;
    const btn = document.getElementById('verify-btn');
    const spinner = document.getElementById('loading-spinner');
    const resultPanel = document.getElementById('verify-result');

    if (!text) return alert("Please enter text to verify.");

    // UI Loading State
    btn.disabled = true;
    btn.style.opacity = 0.5;
    spinner.classList.remove('hidden');
    resultPanel.classList.add('hidden');

    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const json = await res.json();

        if (json.success) {
            displayVerificationResult(json.data);
        } else {
            alert("Verification failed: " + json.message);
        }

    } catch (e) {
        alert("System Error during verification.");
    } finally {
        btn.disabled = false;
        btn.style.opacity = 1;
        spinner.classList.add('hidden');
    }
}

function displayVerificationResult(data) {
    const resultPanel = document.getElementById('verify-result');
    const scoreText = document.querySelector('.score-text');
    const ring = document.querySelector('.c-progress');
    const verdictTitle = document.getElementById('verdict-title');
    const reasoning = document.getElementById('verdict-reasoning');

    resultPanel.classList.remove('hidden');

    // Animate Ring
    const score = data.truth_probability_score || 0;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    scoreText.innerText = score + '%';
    ring.style.strokeDashoffset = offset;

    // Color code
    if (score > 70) ring.style.stroke = '#00ff44'; // Green
    else if (score > 40) ring.style.stroke = '#ffbd00'; // Yellow
    else ring.style.stroke = '#ff0055'; // Red

    verdictTitle.innerText = data.verdict || "Analysis Complete";
    reasoning.innerText = data.reasoning || data.analysis || "No details provided.";
}

async function handleCitizenSubmit(e) {
    e.preventDefault();
    const formData = {
        reporter_name: document.getElementById('c-name').value,
        location: document.getElementById('c-location').value,
        headline: document.getElementById('c-headline').value,
        content: document.getElementById('c-content').value,
        image_url: document.getElementById('c-image').value
    };

    try {
        const res = await fetch('/api/news/citizen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (json.success) {
            alert("Report Submitted Successfully!");
            document.getElementById('citizen-form').reset();
            initCitizenFeed(); // Refresh feed
        } else {
            alert(json.message);
        }
    } catch (e) {
        alert("Error submitting report.");
    }
}

async function initCitizenFeed() {
    const container = document.getElementById('citizen-feed');
    try {
        const res = await fetch('/api/news/citizen');
        const json = await res.json();

        if (json.success && json.data.length > 0) {
            container.innerHTML = '';
            json.data.forEach(item => {
                const itemHTML = `
                    <div class="citizen-item">
                        <div class="citizen-meta">
                            <i class="fa-solid fa-user"></i> ${item.reporter_name} | 
                            <i class="fa-solid fa-map-pin"></i> ${item.location}
                        </div>
                        <h4>${item.headline}</h4>
                        <p style="font-size: 0.9rem; color: #ddd; margin-top: 5px;">${item.content}</p>
                    </div>
                `;
                container.innerHTML += itemHTML;
            });
        }
    } catch (e) {
        console.log("Citizen feed error", e);
    }
}
