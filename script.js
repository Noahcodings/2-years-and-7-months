// ============================================
// DOM ELEMENTS
// ============================================
const counterDisplay = document.getElementById('counter');
const particlesContainer = document.getElementById('particles');
const pageContent0 = document.getElementById('pageContent0');
const pageContent1 = document.getElementById('pageContent1');
const pageContent2 = document.getElementById('pageContent2');
const startButton = document.getElementById('startButton');
const goBackButton = document.getElementById('goBackButton');
const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const miniPage = document.getElementById('miniPage');
const pageContent3 = document.getElementById('pageContent3');

// ============================================
// GAME STATE
// ============================================
const gameState = {
    attempts: 0,
    isMoving: false,
    minDistance: 100,
};

// ============================================
// AUDIO PLAYER
// ============================================
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

audio.addEventListener('play', () => playBtn.textContent = '⏸');
audio.addEventListener('pause', () => playBtn.textContent = '▶');

muteBtn.addEventListener('click', () => {
    if (audio.muted) {
        audio.muted = false;
        muteBtn.textContent = '🔊';
    } else {
        audio.muted = true;
        muteBtn.textContent = '🔇';
    }
});

// ============================================
// PAGE NAVIGATION
// ============================================
let currentPage = 1;

startButton.addEventListener('click', () => {
    pageContent0.style.cssText = 'display: none !important';
    pageContent1.style.cssText = 'display: flex !important';
    currentPage = 1;
});

goBackButton.addEventListener('click', () => {
    pageContent0.style.cssText = 'display: flex !important';
    pageContent1.style.cssText = 'display: none !important';
    pageContent2.style.cssText = 'display: none !important';
    miniPage.style.cssText = 'display: none !important';
    pageContent3.style.cssText = 'display: none !important';
    currentPage = 1;
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// MOVEMENT LOGIC
// ============================================
function moveButtonToRandomPosition(button, triggerEvent = null) {
    if (gameState.isMoving) return;
    gameState.isMoving = true;

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    const currentLeft = buttonRect.left;
    const currentTop = buttonRect.top;

    const maxLeft = containerWidth - buttonWidth - 10;
    const maxTop = containerHeight - buttonHeight - 10;

    let newLeft, newTop;
    let attempts = 0;

    do {
        newLeft = randomBetween(10, maxLeft);
        newTop = randomBetween(10, maxTop);
        const distance = Math.sqrt(
            Math.pow(newLeft - currentLeft, 2) + 
            Math.pow(newTop - currentTop, 2)
        );
        attempts++;
        if (distance >= gameState.minDistance) break;
    } while (attempts < 100);

    button.classList.add('escaping');
    button.style.width = buttonWidth + 'px';
    button.style.height = buttonHeight + 'px';
    button.style.left = newLeft + 'px';
    button.style.top = newTop + 'px';
    button.style.right = 'auto';
    button.style.bottom = 'auto';
    button.style.transform = 'none';
    button.style.zIndex = '100';

    setTimeout(() => {
        button.style.zIndex = '1';
    }, 400);

    setTimeout(() => {
        gameState.isMoving = false;
    }, 500);

    if (triggerEvent) {
        createEscapeParticles(triggerEvent.clientX, triggerEvent.clientY);
    }

    gameState.attempts++;
    counterDisplay.textContent = `Attempts: ${gameState.attempts}`;
}

// ============================================
// PARTICLE EFFECTS
// ============================================
function createEscapeParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = randomBetween(3, 8);
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// ============================================
// EVENT HANDLERS - Works for all pages
// ============================================
document.addEventListener('click', (event) => {
    // Yes button clicked
    if (event.target.classList.contains('yes-button')) {
        if (currentPage === 1) {
            pageContent1.style.cssText = 'display: none !important';
            pageContent2.style.cssText = 'display: flex !important';
            currentPage = 2;
        } else if (currentPage === 2) {
            pageContent2.style.cssText = 'display: none !important';
            pageContent3.style.cssText = 'display: flex !important';
        } 
    }

    
    // No button clicked (runaway)
    if (event.target.classList.contains('runaway-button')) {
        event.preventDefault();
        moveButtonToRandomPosition(event.target, event);
    }
});

document.addEventListener('touchstart', (event) => {
    if (event.target.classList.contains('runaway-button')) {
        event.preventDefault();
        moveButtonToRandomPosition(event.target, event.touches[0]);
    }
}, { passive: false });

// Normal No button on Page 2
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('normal-no-button')) {
        if (currentPage === 2) {
            pageContent2.style.cssText = 'display: none !important';
            miniPage.style.cssText = 'display: flex !important';
        }
    }
});

// miniYes button on miniPage
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('miniyes')) {
        if (currentPage === 2) {
            miniPage.style.cssText = 'display: none !important';
            pageContent3.style.cssText = 'display: flex !important';
        }
    }
});

// ============================================
// IMAGE CAROUSEL
// ============================================
const carouselTrack = document.getElementById('carouselTrack');
const carouselDots = document.getElementById('carouselDots');
const carouselLeft = document.getElementById('carouselLeft');
const carouselRight = document.getElementById('carouselRight');

const cards = document.querySelectorAll('.carousel-card');
const totalCards = cards.length;
let currentIndex = 0;
let autoSlideInterval;
let isTransitioning = false;

// Create pagination dots
function createDots() {
    carouselDots.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
}

// Update card positions
function updateCarousel() {
    cards.forEach((card, index) => {
        // Remove all classes first
        card.classList.remove('active', 'left', 'right', 'hidden');
        
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === getPrevIndex()) {
            card.classList.add('left');
        } else if (index === getNextIndex()) {
            card.classList.add('right');
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Get previous index (with wrap)
function getPrevIndex() {
    return (currentIndex - 1 + totalCards) % totalCards;
}

// Get next index (with wrap)
function getNextIndex() {
    return (currentIndex + 1) % totalCards;
}

// Go to specific slide
function goToSlide(index) {
    if (isTransitioning || index === currentIndex) return;
    isTransitioning = true;
    
    currentIndex = index;
    updateCarousel();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
}

// Next slide
function nextSlide() {
    goToSlide(getNextIndex());
}

// Previous slide
function prevSlide() {
    goToSlide(getPrevIndex());
}

// Auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Event listeners
carouselLeft.addEventListener('click', prevSlide);
carouselRight.addEventListener('click', nextSlide);

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
    }
}

// Initialize
createDots();
updateCarousel();
startAutoSlide();
