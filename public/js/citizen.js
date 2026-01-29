document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    document.getElementById('citizen-form').addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = "Submitting...";

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
        btn.textContent = "Submit Report";
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
                const itemDiv = document.createElement('div');
                itemDiv.className = 'feed-item';

                const meta = document.createElement('div');
                meta.className = 'feed-meta';
                meta.innerHTML = `<i class="fa-solid fa-map-pin"></i> `;
                const metaText = document.createTextNode(`${item.location} | `);
                meta.appendChild(metaText);
                const userIcon = document.createElement('i');
                userIcon.className = 'fa-solid fa-user';
                meta.append(userIcon, document.createTextNode(` ${item.reporter_name}`));

                const title = document.createElement('h4');
                title.className = 'feed-title';
                title.textContent = item.headline;

                const content = document.createElement('p');
                content.style.color = '#ddd';
                content.style.fontSize = '0.95rem';
                content.textContent = item.content;

                itemDiv.append(meta, title, content);
                container.appendChild(itemDiv);
            });
        } else {
            container.innerHTML = '<p style="color: var(--text-gray)">No reports yet. Be the first.</p>';
        }
    } catch (e) {
        container.innerHTML = '<p>Offline.</p>';
    }
}
