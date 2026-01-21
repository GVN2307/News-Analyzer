document.addEventListener('DOMContentLoaded', () => {
    // Inject Navigation
    const nav = document.getElementById('main-nav');
    if (nav) {
        nav.innerHTML = `
            <div class="nav-logo">
                <a href="home.html">
                    <h1>News<span>Analyzer</span></h1>
                </a>
            </div>
            <div class="menu-toggle" id="mobile-menu">
                <i class="fa-solid fa-bars"></i>
            </div>
            <ul class="nav-links" id="nav-links">
                <li><a href="home.html" id="link-home">Home</a></li>
                <li><a href="news.html" id="link-news">Live Intel</a></li>
                <li><a href="verify.html" id="link-verify">Verify Studio</a></li>
                <li><a href="citizen.html" id="link-citizen">Citizen Feed</a></li>
            </ul>
        `;

        // Mobile Menu Logic
        const toggle = document.getElementById('mobile-menu');
        const links = document.getElementById('nav-links');

        if (toggle && links) {
            toggle.addEventListener('click', () => {
                links.classList.toggle('active');
                const icon = toggle.querySelector('i');
                if (links.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        }

        // Highlight active link
        const currentPath = window.location.pathname;
        if (currentPath.includes('news')) document.getElementById('link-news')?.classList.add('active');
        else if (currentPath.includes('verify')) document.getElementById('link-verify')?.classList.add('active');
        else if (currentPath.includes('citizen')) document.getElementById('link-citizen')?.classList.add('active');
        else document.getElementById('link-home')?.classList.add('active');
    }
});
