(function() {
    const CONFIG = {
        totalHearts: 50,
        minSize: 15,
        maxSize: 55,
        minDuration: 8,
        maxDuration: 20,
        minDelay: 0,
        maxDelay: 5,
        swayRange: 60,
        heartColors: ['pink-hot', 'pink-light', 'pink-deep', 'pink-rose'],
        glowLevels: ['glow-soft', 'glow-medium', 'glow-strong', 'glow-intense'],
        sizeClasses: ['xs', 'sm', 'md', 'lg', 'xl']
    };

    function init() {
        const container = document.getElementById('heartsBackground');
        if (!container) return;
        for (let i = 0; i < CONFIG.totalHearts; i++) {
            container.appendChild(createHeart());
        }
    }

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.classList.add(randomFrom(CONFIG.sizeClasses));
        heart.classList.add(randomFrom(CONFIG.heartColors));
        heart.classList.add(randomFrom(CONFIG.glowLevels));
        heart.style.left = randomBetween(0, 100) + '%';
        heart.style.animationDuration = randomBetween(CONFIG.minDuration, CONFIG.maxDuration) + 's';
        heart.style.animationDelay = randomBetween(CONFIG.minDelay, CONFIG.maxDelay) + 's';
        heart.style.setProperty('--sway-1', randomBetween(-CONFIG.swayRange, CONFIG.swayRange) + 'px');
        heart.style.setProperty('--sway-2', randomBetween(-CONFIG.swayRange, CONFIG.swayRange) + 'px');
        heart.style.setProperty('--sway-3', randomBetween(-CONFIG.swayRange, CONFIG.swayRange) + 'px');
        heart.style.setProperty('--sway-4', randomBetween(-CONFIG.swayRange, CONFIG.swayRange) + 'px');
        heart.style.setProperty('--sway-5', randomBetween(-CONFIG.swayRange, CONFIG.swayRange) + 'px');
        heart.style.setProperty('--max-opacity', 0.3 + (Math.random() * 0.5));
        return heart;
    }

    function randomBetween(min, max) { return Math.random() * (max - min) + min; }
    function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    document.addEventListener('visibilitychange', () => {
        document.querySelectorAll('.heart').forEach(heart => {
            heart.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();