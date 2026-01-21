document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    document.getElementById('citizen-form').addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.innerText = "Submitting...";

    const data = {
        location: document.getElementById('c-location').value,
        headline: document.getElementById('c-headline').value,
        content: document.getElementById('c-content').value,
        reporter_name: document.getElementById('c-name').value
    };

    try {
        const res = await fetch('/api/news/citizen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        if (json.success) {
            alert('Report Submitted!');
            e.target.reset();
            loadReports();
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) {
        alert('Failed to connect to server.');
    } finally {
        btn.disabled = false;
        btn.innerText = "Submit Report";
    }
}

async function loadReports() {
    const container = document.getElementById('citizen-feed');
    try {
        const res = await fetch('/api/news/citizen');
        const json = await res.json();

        if (json.success && json.data.length > 0) {
            container.innerHTML = '';
            json.data.forEach(item => {
                const html = `
                    <div class="feed-item">
                        <div class="feed-meta">
                            <i class="fa-solid fa-map-pin"></i> ${item.location} | <i class="fa-solid fa-user"></i> ${item.reporter_name}
                        </div>
                        <h4 class="feed-title">${item.headline}</h4>
                        <p style="color: #ddd; font-size: 0.95rem;">${item.content}</p>
                    </div>
                `;
                container.innerHTML += html;
            });
        } else {
            container.innerHTML = '<p style="color: var(--text-gray)">No reports yet. Be the first.</p>';
        }
    } catch (e) {
        container.innerHTML = '<p>Offline.</p>';
    }
}
