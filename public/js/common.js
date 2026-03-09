// i18n and Accessibility Core
let currentLang = localStorage.getItem('prefs-lang') || 'en';

async function initI18n() {
    try {
        const response = await fetch(`locales/${currentLang}.json`);
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                } else {
                    el.innerText = translations[key];
                }
            }
        });

        // Update active language in selector
        const langSelector = document.getElementById('lang-selector');
        if (langSelector) langSelector.value = currentLang;
    } catch (error) {
        console.error("i18n Error:", error);
    }
}

async function updateLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`/api/location?lat=${latitude}&lon=${longitude}`);
                const result = await response.json();
                if (result.success) {
                    const locBadge = document.getElementById('location-badge');
                    if (locBadge) {
                        locBadge.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${result.data.city}`;
                        locBadge.classList.add('detected');
                        localStorage.setItem('user-city', result.data.city);
                        window.dispatchEvent(new CustomEvent('location-updated', { detail: result.data.city }));
                    }
                }
            } catch (err) {
                console.error("Location Fetch Error:", err);
            }
        }, (error) => {
            console.error("Geolocation Error:", error);
            const locBadge = document.getElementById('location-badge');
            if (locBadge) {
                locBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Location Off`;
                locBadge.title = "Please enable location access in your browser";
            }
        }, { timeout: 10000 });
    }
}

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
            
            <div class="nav-extras">
                <div id="location-badge" class="location-badge">
                    <i class="fa-solid fa-location-crosshairs"></i> Detecting...
                </div>
                <select id="lang-selector" class="lang-selector">
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                </select>
                <div class="menu-toggle" id="mobile-menu">
                    <i class="fa-solid fa-bars"></i>
                </div>
            </div>

            <ul class="nav-links" id="nav-links">
                <li><a href="home.html" id="link-home" data-i18n="nav_home">Home</a></li>
                <li><a href="news.html" id="link-news" data-i18n="nav_news">Live Intel</a></li>
                <li><a href="verify.html" id="link-verify" data-i18n="nav_verify">Verify Studio</a></li>
                <li><a href="citizen.html" id="link-citizen" data-i18n="nav_citizen">Citizen Feed</a></li>
            </ul>
        `;

        // Language Switcher Logic
        const langSelector = document.getElementById('lang-selector');
        langSelector?.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('prefs-lang', currentLang);
            initI18n();
        });

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

    initI18n();
    updateLocation();
});
