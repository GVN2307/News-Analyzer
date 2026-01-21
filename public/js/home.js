document.addEventListener('DOMContentLoaded', () => {
    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-val');

    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.innerText = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    });
});
