document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    document.getElementById('analyze-btn').addEventListener('click', runAnalysis);
});

async function runAnalysis() {
    const text = document.getElementById('text-input').value;
    const btn = document.getElementById('analyze-btn');
    const msg = document.getElementById('status-msg');
    const resultArea = document.getElementById('result-area');

    if (!text) return;

    // Loading State
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    msg.innerText = "Connecting to Neural Engine...";
    resultArea.classList.remove('active');

    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const json = await res.json();

        if (json.success) {
            displayResult(json.data);
            saveToHistory(text, json.data);
            msg.innerText = "Analysis Complete.";
        } else {
            msg.innerText = "Error: " + json.message;
        }
    } catch (e) {
        msg.innerText = "Connection Failed.";
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Analyze Now';
    }
}

function displayResult(data) {
    const resultArea = document.getElementById('result-area');
    const scoreVal = document.getElementById('score-val');
    const verdictLabel = document.getElementById('verdict-label');
    const reasoning = document.getElementById('reasoning-text');

    resultArea.classList.add('active');

    // Animate Score
    let score = 0;
    const target = data.truth_probability_score;
    const interval = setInterval(() => {
        score += 2;
        if (score >= target) {
            score = target;
            clearInterval(interval);
        }
        scoreVal.innerText = score + '%';

        // Dynamic Color
        if (score > 70) scoreVal.style.color = '#00ff44';
        else if (score > 40) scoreVal.style.color = '#ffbd00';
        else scoreVal.style.color = '#ff003c';

    }, 20);

    verdictLabel.innerText = data.verdict.toUpperCase();
    reasoning.innerText = data.reasoning || data.analysis;
}

function saveToHistory(text, data) {
    let history = JSON.parse(localStorage.getItem('verify_history') || '[]');
    history.unshift({ text: text.substring(0, 40) + '...', score: data.truth_probability_score, date: new Date().toLocaleTimeString() });
    if (history.length > 5) history.pop();
    localStorage.setItem('verify_history', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const list = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('verify_history') || '[]');

    if (history.length === 0) return;

    list.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div style="font-weight:600; margin-bottom: 5px;">${item.text}</div>
            <div style="font-size: 0.8rem; color: var(--text-gray); display: flex; justify-content: space-between;">
                <span>Score: ${item.score}%</span>
                <span>${item.date}</span>
            </div>
        `;
        list.appendChild(div);
    });
}
