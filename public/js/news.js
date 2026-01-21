document.addEventListener('DOMContentLoaded', () => {
    loadNews();

    // Filter Logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterNews(e.target.getAttribute('data-source'));
        });
    });
});

let allNewsData = [];

async function loadNews() {
    const container = document.getElementById('news-container');
    try {
        const res = await fetch('/api/news/live');
        const json = await res.json();

        if (json.success) {
            allNewsData = json.data;
            renderNews(allNewsData);
        } else {
            container.innerHTML = '<p class="text-center">Failed to load intel stream.</p>';
        }
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p class="text-center">System Offline.</p>';
    }
}

function renderNews(newsItems) {
    const container = document.getElementById('news-container');
    container.innerHTML = '';

    if (newsItems.length === 0) {
        container.innerHTML = '<p>No updates found for this category.</p>';
        return;
    }

    newsItems.forEach(item => {
        const date = new Date(item.pubDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        const html = `
            <div class="news-card">
                <div class="nc-content">
                    <span class="nc-source">${item.source}</span>
                    <h3 class="nc-title">${item.title}</h3>
                    <p class="nc-desc">${item.snippet.replace(/<[^>]*>?/gm, '')}</p>
                </div>
                <div class="nc-footer">
                    <span><i class="fa-regular fa-clock"></i> ${date}</span>
                    <a href="${item.link}" target="_blank">Read Full <i class="fa-solid fa-external-link-alt"></i></a>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function filterNews(source) {
    if (source === 'all') {
        renderNews(allNewsData);
    } else {
        const filtered = allNewsData.filter(item => item.source === source);
        renderNews(filtered);
    }
}
