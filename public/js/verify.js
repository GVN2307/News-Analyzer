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
    msg.textContent = "Connecting to Neural Engine...";
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
            msg.textContent = "Analysis Complete.";
        } else {
            msg.textContent = "Error: " + json.message;
        }
    } catch (e) {
        msg.textContent = "Connection Failed.";
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
        scoreVal.textContent = score + '%';

        // Dynamic Color
        if (score > 70) scoreVal.style.color = '#00ff44';
        else if (score > 40) scoreVal.style.color = '#ffbd00';
        else scoreVal.style.color = '#ff003c';

    }, 20);

    verdictLabel.textContent = data.verdict.toUpperCase();
    reasoning.textContent = data.reasoning || data.analysis;

    // Sources tags
    const sourcesList = document.getElementById('sources-list');
    sourcesList.innerHTML = '';
    if (data.sources && data.sources.length > 0) {
        data.sources.forEach(src => {
            const li = document.createElement('li');
            li.className = 'verdict-badge';
            li.style.fontSize = '0.75rem';
            li.style.background = 'rgba(0, 243, 255, 0.1)';
            li.style.color = 'var(--primary)';
            li.textContent = src;
            sourcesList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.style.color = 'var(--text-gray)';
        li.style.fontSize = '0.8rem';
        li.textContent = 'No specific sources cited.';
        sourcesList.appendChild(li);
    }
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

        const title = document.createElement('div');
        title.style.fontWeight = '600';
        title.style.marginBottom = '5px';
        title.textContent = item.text;

        const meta = document.createElement('div');
        meta.style.fontSize = '0.8rem';
        meta.style.color = 'var(--text-gray)';
        meta.style.display = 'flex';
        meta.style.justifyContent = 'space-between';

        const score = document.createElement('span');
        score.textContent = `Score: ${item.score}%`;

        const date = document.createElement('span');
        date.textContent = item.date;

        meta.append(score, date);
        div.append(title, meta);
        list.appendChild(div);
    });
}
