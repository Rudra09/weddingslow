// ---- Performance helpers -------------------------------------------------
const IS_MOBILE = window.innerWidth <= 992;
const IS_LOW_END = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                   (navigator.deviceMemory && navigator.deviceMemory <= 4);
// scale factor for decorative particle counts (visuals stay the same, just fewer copies on weak phones)
const PERF = IS_LOW_END && IS_MOBILE ? 0.5 : 1;

// Pause every CSS animation inside sections that are not on screen
(function setupOffscreenPause() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => en.target.classList.toggle('is-offscreen', !en.isIntersecting));
    }, { rootMargin: '150px 0px' });
    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('section, header, footer, .hero').forEach(el => io.observe(el));
    });
})();

// Load hero slides 2 & 3 only after the page is ready (keeps first paint fast)
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.hero-bg[data-bg]').forEach(el => {
            el.style.backgroundImage = 'linear-gradient(rgba(40, 10, 15, 0.45), rgba(40, 10, 15, 0.45)), url(' + el.dataset.bg + ')';
        });
    }, 1500);
});

// Toggle Hamburger Menu Script
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Major menu control: toggles the mobile navigation and hamburger state without leaving stale styles behind.
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('rotated');
    });
}

// Minor menu cleanup: resets the mobile nav and hamburger icon when the user clicks away.
function closeMenu() {
    if (!navLinks || !menuToggle) return;

    navLinks.classList.remove('active');
    menuToggle.classList.remove('rotated');
}

document.addEventListener('click', () => {
    if (!navLinks || !menuToggle) return;

    if (navLinks.classList.contains('active')) {
        closeMenu();
    }
});

if (navLinks) {
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Populate fairy light bulbs across top header
const fairyContainer = document.getElementById('fairyLightsContainer');
for (let i = 0; i < 35; i++) {
    const bulb = document.createElement('div');
    bulb.classList.add('fairy-light-dot');
    fairyContainer.appendChild(bulb);
}

// Distinct Golden and Silver Gradients for Petals
const goldenPetalGradients = [
    // Bright Champagne Gold: Soft pearl highlight fading into glowing warm gold
    'radial-gradient(circle at 30% 25%, #ffffff 0%, #fff7d6 28%, #f0d575 65%, #d9b343 100%)',
    // Luminous Soft Amber Gold: Crisp white core with smooth golden-silk body
    'radial-gradient(circle at 35% 30%, #ffffff 0%, #fff4c8 30%, #ebd068 65%, #cfa330 100%)'
];

const silverPetalGradients = [
    // Frosty Platinum Silver: Crisp pearl highlight fading into glowing cool silver
    'radial-gradient(circle at 30% 25%, #ffffff 0%, #f2f7ff 28%, #d3e1f2 65%, #b4c7de 100%)',
    // Luminous Soft Ice Silver: Crisp white core with smooth platinum-silk body
    'radial-gradient(circle at 35% 30%, #ffffff 0%, #edf3fc 30%, #c9daf0 65%, #a8beda 100%)',
    // Crystal Pearl Silver: Airy, balanced metallic shine matching the golden warm tones
    'radial-gradient(circle at 25% 25%, #ffffff 0%, #f5f8fd 35%, #dbe6f5 70%, #baccdf 100%)'
];

/**
 * Creates decorative petals in a container.
 * @param {HTMLElement|null} containerElement - Destination element; ignored when absent.
 * @param {number} count - Number of petals to create.
 * @param {boolean} [isSection=false] - Enables the section-specific staggered fall animation.
 */
function createFallingPetals(containerElement, count, isSection = false) {
    if (!containerElement) return;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.classList.add(isSection ? 'petal-section-fall' : 'petal');

        const size = Math.random() * 16 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.4}px`;
        petal.style.left = `${Math.random() * 98}%`;

        // Distribute evenly between Golden and Silver
        const isGolden = i % 2 === 0;
        if (isGolden) {
            petal.style.background = goldenPetalGradients[Math.floor(Math.random() * goldenPetalGradients.length)];
            petal.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        } else {
            petal.style.background = silverPetalGradients[Math.floor(Math.random() * silverPetalGradients.length)];
            petal.style.boxShadow = '0 0 10px rgba(220, 220, 220, 0.6)';
        }

        if (isSection) {
            petal.style.animationDuration = `${Math.random() * 12 + 18}s`;
            // Stagger start delays seamlessly so top is instantly rich & dense with cascading transition
            petal.style.animationDelay = `${Math.random() * 18}s`;
            // Pre-load initial top spread for smooth heavy density right where they start falling
            petal.style.top = `${Math.random() * -15}px`;
        } else {
            petal.style.animationDuration = `${Math.random() * 14 + 20}s`;
            petal.style.animationDelay = `${Math.random() * 15}s`;
        }
        containerElement.appendChild(petal);
    }
}

// Petals restricted exclusively to Gallery Section
const petalCount = Math.round((window.innerWidth > 992 ? 75 : 35) * PERF);

// Decorative particles are created AFTER the page has loaded and the browser is idle,
// so they never compete with the photos for CPU/network during the first load.
function afterLoad(fn) {
    const run = () => (window.requestIdleCallback || ((f) => setTimeout(f, 300)))(fn, { timeout: 2000 });
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
}

afterLoad(() => {
// Populate Global Floating Bubbles (Gold & Silver) Across Entire Website
const globalBubblesContainer = document.getElementById('globalBubblesContainer');
const globalBubbleCount = Math.round((window.innerWidth > 992 ? 70 : 30) * PERF);
for (let i = 0; i < globalBubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 28 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 12 + 14}s`;
    bubble.style.animationDelay = `${Math.random() * 10}s`;

    // Alternate between gold and silver appearance
    if (i % 2 === 0) {
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(240, 195, 70, 0.75) 45%, rgba(195, 145, 30, 0.55) 75%, rgba(130, 90, 15, 0.3) 100%)';
        bubble.style.borderColor = 'rgba(255, 245, 200, 0.9)';
        bubble.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 215, 90, 0.65), 0 0 28px rgba(212, 175, 55, 0.5)';
    } else {
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(180, 198, 220, 0.75) 45%, rgba(140, 150, 165, 0.55) 75%, rgba(90, 100, 115, 0.3) 100%)';
        bubble.style.borderColor = 'rgba(240, 248, 255, 0.9)';
        bubble.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.8), 0 0 16px rgba(210, 225, 245, 0.65), 0 0 28px rgba(160, 175, 195, 0.5)';
    }

    globalBubblesContainer.appendChild(bubble);
}





// Populate Gallery Section Gold & Silver Petals - Dense Full Section Flow (Top to Bottom)
const galleryPetalsContainer = document.getElementById('galleryPetalsContainer');
if (galleryPetalsContainer) {
    galleryPetalsContainer.innerHTML = '';
    galleryPetalsContainer.style.setProperty('--fall', (galleryPetalsContainer.offsetHeight || 1400) + 60 + 'px');
    window.addEventListener('resize', () => galleryPetalsContainer.style.setProperty('--fall', (galleryPetalsContainer.offsetHeight || 1400) + 60 + 'px'));
    createFallingPetals(galleryPetalsContainer, Math.round((IS_MOBILE ? 60 : 130) * PERF), true);
}

// Populate Countdown Section Petals
const countdownPetalsContainer = document.getElementById('countdownPetalsContainer');
createFallingPetals(countdownPetalsContainer, petalCount);




});

// Very Slower Floating Golden Bubbles
const bubblesContainer = document.getElementById('bubblesContainer');
const bubbleCount = window.innerWidth > 992 ? 30 : 15;
for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 22 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 8 + 14}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    bubblesContainer.appendChild(bubble);
}

// Floating Magic Golden Sparks
const floatingContainer = document.getElementById('floatingElements');
for (let i = 0; i < bubbleCount; i++) {
    const spark = document.createElement('div');
    spark.classList.add('floating-spark');
    const size = Math.random() * 6 + 3;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.left = `${Math.random() * 100}vw`;
    spark.style.animationDuration = `${Math.random() * 6 + 6}s`;
    spark.style.animationDelay = `${Math.random() * 5}s`;
    floatingContainer.appendChild(spark);
}

// Smooth Cross-Fading Background Slideshow
const bgSlides = document.querySelectorAll('.hero-bg');
let currentSlide = 0;

/** Advances the hero background slideshow, wrapping to its first slide at the end. */
function nextSlide() {
    bgSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % bgSlides.length;
    bgSlides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 6000);

// TWINKLING STAR CRACKERS CANVAS ANIMATION
const canvas = document.getElementById('crackerCanvas');
const ctx = canvas.getContext('2d');

/** Resizes the effects canvas to match its displayed dimensions. */
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Pre-render one soft glowing dot per colour once; drawImage is far cheaper than shadowBlur every frame
const glowSprites = {};
['#ffffff', '#ffd700'].forEach(color => {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, color);
    grad.addColorStop(0.25, color);
    grad.addColorStop(0.55, color === '#ffffff' ? 'rgba(255,255,255,0.35)' : 'rgba(255,215,0,0.35)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    glowSprites[color] = c;
});

class TwinklingStarParticle {
    /** Initializes a particle's position, velocity, color, and randomized fade/twinkle properties. */
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.0 + 0.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.006 + 0.002;
        this.size = Math.random() * 2.8 + 1.2;
        this.twinkleSpeed = Math.random() * 0.15 + 0.05;
        this.twinkleVal = Math.random() * Math.PI;
    }
    /** Advances the particle's motion, gravity, opacity, and twinkle phase by one frame. */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.004;
        this.alpha -= this.decay;
        this.twinkleVal += this.twinkleSpeed;
    }
    /** Renders the particle with a pre-rendered glow sprite (no shadowBlur = fast on old phones). */
    draw() {
        const a = Math.max(0, this.alpha * (0.6 + 0.4 * Math.sin(this.twinkleVal)));
        if (a <= 0.01) return;
        ctx.globalAlpha = a;
        const s = this.size * 5;
        ctx.drawImage(glowSprites[this.color] || glowSprites['#ffffff'], this.x - s / 2, this.y - s / 2, s, s);
    }
}

let sparkParticles = [];
const MAX_PARTICLES = IS_LOW_END ? 160 : 350; // Cap particle count to eliminate lag over time

/** Adds a particle burst at the supplied point or at a randomized position on the canvas. @param {number} [customX] @param {number} [customY] */
function createTwinklingBurst(customX, customY) {
    if (canvas.width === 0 || canvas.height === 0) return;
    const x = customX !== undefined ? customX : (Math.random() * canvas.width * 0.8 + canvas.width * 0.1);
    const y = customY !== undefined ? customY : (Math.random() * (canvas.height * 0.5));
    const chosenColor = Math.random() > 0.3 ? '#ffffff' : '#ffd700';
    const crackerBurstCount = window.innerWidth > 992 ? 80 : (IS_LOW_END ? 24 : 40);

    for (let i = 0; i < crackerBurstCount; i++) {
        if (sparkParticles.length < MAX_PARTICLES) {
            sparkParticles.push(new TwinklingStarParticle(x, y, chosenColor));
        }
    }
    startCanvas();
}

let canvasRunning = false;
let canvasVisible = true;
if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { canvasVisible = en.isIntersecting; if (canvasVisible) startCanvas(); }).observe(canvas);
}

/** Draws active particles and removes expired ones in-place. Stops itself when idle/offscreen. */
function animateTwinklingStars() {
    if (!canvasVisible || sparkParticles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasRunning = false;
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sparkParticles.length - 1; i >= 0; i--) {
        const p = sparkParticles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
            sparkParticles[i] = sparkParticles[sparkParticles.length - 1];
            sparkParticles.pop();
        }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateTwinklingStars);
}

function startCanvas() {
    if (canvasRunning) return;
    canvasRunning = true;
    requestAnimationFrame(animateTwinklingStars);
}

// Trigger multiple heavy cracker bursts right at the start on desktop view
if (window.innerWidth > 992) {
    setTimeout(() => {
        createTwinklingBurst(canvas.width * 0.25, canvas.height * 0.3);
        createTwinklingBurst(canvas.width * 0.75, canvas.height * 0.3);
        createTwinklingBurst(canvas.width * 0.5, canvas.height * 0.2);
    }, 200);
    setTimeout(() => {
        createTwinklingBurst(canvas.width * 0.35, canvas.height * 0.4);
        createTwinklingBurst(canvas.width * 0.65, canvas.height * 0.4);
    }, 800);
} else {
    setTimeout(() => {
        createTwinklingBurst();
    }, 200);
}

setInterval(createTwinklingBurst, window.innerWidth > 992 ? 1600 : 2500);

// Countdown Timer
const weddingDate = new Date("November 26, 2026 01:00:00").getTime();

/** Updates the wedding countdown fields, displaying zeroes once the date has passed. */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Family & Friends Tab Switcher
/** Activates the requested family/friends tab and its matching content panel. @param {'family'|'squad'} tabName */
function switchFamilyTab(tabName) {
    const tabs = document.querySelectorAll('.family-tab-btn');
    const contents = document.querySelectorAll('.family-tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    if (tabName === 'family') {
        tabs[0].classList.add('active');
        document.getElementById('tab-family').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('tab-squad').classList.add('active');
    }
}


// 3D Interactive Rotating Squad Slider Script
let currentSquadIndex = 0;
const squadSlides = document.querySelectorAll('.squad-slide-card');
const squadDots = document.querySelectorAll('.squad-dot');

/** Displays a squad slide, wraps out-of-range indices, and synchronizes its navigation dot. @param {number} index */
function showSquadSlide(index) {
    if (!squadSlides.length) return;
    if (index >= squadSlides.length) currentSquadIndex = 0;
    else if (index < 0) currentSquadIndex = squadSlides.length - 1;
    else currentSquadIndex = index;

    squadSlides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (squadDots[idx]) squadDots[idx].classList.remove('active');
    });

    squadSlides[currentSquadIndex].classList.add('active');
    if (squadDots[currentSquadIndex]) squadDots[currentSquadIndex].classList.add('active');
}

/** Advances or reverses the squad slider by the specified number of positions. @param {number} direction */
function moveSquadSlide(direction) {
    showSquadSlide(currentSquadIndex + direction);
}

/** Selects a squad slide by its zero-based index. @param {number} index */
function currentSquadSlide(index) {
    showSquadSlide(index);
}

// Auto slide squad every 5 seconds if tab is active
setInterval(() => {
    const squadTab = document.getElementById('tab-squad');
    if (squadTab && squadTab.classList.contains('active')) {
        showSquadSlide(currentSquadIndex + 1);
    }
}, 5000);

//AUDIO
// Background Music Player Control
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('weddingAudio');

    // Create floating music toggle button
    const musicBtn = document.createElement('button');
    musicBtn.id = 'bgMusicToggle';
    musicBtn.innerHTML = '🎵 Play Music';
    musicBtn.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 9999;
        background: linear-gradient(135deg, #d4af37, #ffd700);
        color: #58181f;
        border: 2px solid #fff;
        padding: 10px 18px;
        border-radius: 30px;
        font-family: 'Playfair Display', serif;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(88, 24, 31, 0.4);
        transition: transform 0.3s ease, background 0.3s ease;
    `;

    musicBtn.onmouseover = () => musicBtn.style.transform = 'scale(1.08)';
    musicBtn.onmouseout = () => musicBtn.style.transform = 'scale(1)';
    document.body.appendChild(musicBtn);

    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                musicBtn.innerHTML = '🎶 Pause Music';
                musicBtn.style.background = 'linear-gradient(135deg, #58181f, #3a0d12)';
                musicBtn.style.color = '#ffd700';
            }).catch((error) => {
                console.log("Audio play blocked or file not found.", error);
            });
        } else {
            audio.pause();
            isPlaying = false;
            musicBtn.innerHTML = '🎵 Play Music';
            musicBtn.style.background = 'linear-gradient(135deg, #d4af37, #ffd700)';
            musicBtn.style.color = '#58181f';
        }
    });
});
let currentPhera = -1;
let isComplete = false; // Tracks whether the ceremony has finished

const realPherasData = [

    {
        title: "Nourishment & Provision 🍚",
        vow: "Together we will share the food, nourishment, and financial responsibility to build a prosperous and healthy home.",
        btnText: "🔥 Take 1st Phera"
    },
    {
        title: "Strength & Physical Wellness 💪",
        vow: "Together we will cultivate physical and mental strength, supporting each other through all life's challenges.",
        btnText: "🔥 Take 2nd Phera"
    },
    {
        title: "Wealth, Prosperity & Spiritual Growth 🌟",
        vow: "Together we will strive to earn honest wealth, practice charity, and grow in wisdom and spiritual devotion.",
        btnText: "🔥 Take 3rd Phera"
    },
    {
        title: "Family Joy, Happiness & Harmony 🏡",
        vow: "Together we will bring joy, mutual trust, and deep respect to each other and our families.",
        btnText: "🔥 Take 4th Phera"
    },
    {
        title: "Noble Offspring & Legacy 👶",
        vow: "Together we pray for noble, healthy children, and pledge to guide them with good values and unconditional love.",
        btnText: "🔥 Take 5th Phera"
    },
    {
        title: "Longevity & Seasons of Life 🌸",
        vow: "Together we pledge to stand side-by-side through all seasons of life, sharing every joy and sorrow gracefully.",
        btnText: "🔥 Take 6th Phera"
    },
    {
        title: "Eternal Companionship & Friendship 🤝",
        vow: "We are now husband and wife, eternal companions and true friends bound by love, loyalty, and sacred trust.",
        btnText: "🌸 Exchange Varmala!"
    }
];

/**
 * Advances the seven-step ceremony and updates the couple, vow, and progress display.
 * After the finale, the next activation restores the ceremony to its first step.
 */
function nextPheraStep() {
    const ceremonyArena = document.getElementById('ceremonyArena');
    const finalCoupleContainer = document.getElementById('finalCoupleContainer');
    const groom = document.getElementById('coupleGroom');
    const bride = document.getElementById('coupleBride');
    const garland = document.getElementById('floatingGarland');
    const fill = document.getElementById('pheraFill');
    const badge = document.getElementById('pheraBadge');
    const title = document.getElementById('pheraTitle');
    const vow = document.getElementById('pheraVow');
    const btn = document.getElementById('pheraBtn');
    const petalContainer = document.getElementById('petalContainer');

    // 1. REPLAY / RESET LOGIC: Reset back cleanly to Phera 1
    if (isComplete) {
        isComplete = false;

        if (ceremonyArena) ceremonyArena.style.display = 'flex';
        if (finalCoupleContainer) finalCoupleContainer.style.display = 'none';

        const isMobile = window.innerWidth <= 576;
        const stepMultiplier = isMobile ? 4 : 8;
        const moveOffset = 1 * stepMultiplier;

        groom.style.transform = `translateX(${moveOffset}px)`;
        bride.style.transform = `translateX(-${moveOffset}px)`;
        garland.innerText = '🌹🏵️🌹🏵️🌹';
        garland.style.transform = 'scale(1)';

        currentPhera = 0; // Reset index to 0 for Phera 1
        const stepData = realPherasData[0];

        badge.innerText = `SACRED PHERA 1 OF 7`;
        title.innerText = stepData.title;
        vow.innerText = `"${stepData.vow}"`;
        btn.innerText = stepData.btnText; // This correctly says "Take 2nd Phera"

        fill.style.width = `${(1 / 7) * 100}%`;
        petalContainer.innerHTML = '';

        return;
    }

    // 2. NORMAL PROGRESSION LOGIC
    // If currentPhera is 0, incrementing to 1 loads realPherasData[1] (Phera 2)
    if (currentPhera < 6) {
        currentPhera++;
        const stepData = realPherasData[currentPhera];
        const activePheraNum = currentPhera + 1; // 2 through 7

        const isMobile = window.innerWidth <= 576;
        const stepMultiplier = isMobile ? 4 : 8;

        const moveOffset = activePheraNum * stepMultiplier;
        groom.style.transform = `translateX(${moveOffset}px)`;
        bride.style.transform = `translateX(-${moveOffset}px)`;

        // Fixed syntax error from missing '*' multiplication operator
        garland.style.transform = `scale(${1 + (activePheraNum * 0.04)})`;

        // Update Progress Bar
        const progressPercent = (activePheraNum / 7) * 100;
        fill.style.width = `${progressPercent}%`;

        // Update Text & Button
        badge.innerText = `SACRED PHERA ${activePheraNum} OF 7`;
        title.innerText = stepData.title;
        vow.innerText = `"${stepData.vow}"`;
        btn.innerText = stepData.btnText;

    } else if (currentPhera === 6) {
        // FINAL 7th PHERA REACHED -> Show celebration screen
        if (ceremonyArena) ceremonyArena.style.display = 'none';
        if (finalCoupleContainer) finalCoupleContainer.style.display = 'block';

        triggerRosePetals();

        fill.style.width = '100%';
        badge.innerText = 'VARMALA & VOWS COMPLETE! 🎉';
        title.innerText = 'Abhishek & Priya are Officially Wed! 💖✨';
        vow.innerText = '"By completing the seven steps, we have become companions for life. May our bond grow stronger with every passing day!"';
        btn.innerText = '🔄 Replay Sacred Pheras';

        isComplete = true;
    }
}

// Function to generate falling rose and marigold petals from all directions
/** Replaces the petal container contents with randomly placed falling rose and leaf decorations. */
function triggerRosePetals() {
    const container = document.getElementById('petalContainer');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < Math.round((IS_MOBILE ? 28 : 45) * PERF * (PERF < 1 ? 1.4 : 1)); i++) {
        const item = document.createElement('div');
        item.className = 'rose-petal';
        item.addEventListener('animationend', () => item.remove(), { once: true });
        item.innerText = Math.random() > 0.5 ? '🌹' : '🍂';

        item.style.left = Math.random() * 100 + '%';
        const randomDrift = (Math.random() * 80 - 40) + 'px';
        item.style.setProperty('--drift', randomDrift);

        item.style.fontSize = (Math.random() * 0.6 + 0.9) + 'rem';
        item.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        item.style.animationDelay = (Math.random() * 0.5) + 's';

        container.appendChild(item);
    }
}
let activeSource = 'camera';
let uploadedImageObj = new Image();
let isCameraActive = false;
let currentStream = null;
let currentFacingMode = 'user'; // Tracks 'user' (front) or 'environment' (rear)

/** Requests the selected camera, updates the preview and controls, and reports access failures. */
async function requestCameraPermission() {
    const statusDiv = document.getElementById('statusMessage');
    const overlay = document.getElementById('permissionOverlay');
    const video = document.getElementById('webcamVideo');
    const uploadedImg = document.getElementById('uploadedImgPreview');
    const defaultCoupleImg = document.getElementById('defaultCoupleImg');
    const toggleBtn = document.getElementById('toggleCamBtn');
    const flipBtn = document.getElementById('flipCamBtn'); // Reference flip button

    statusDiv.textContent = "Requesting camera permission...";

    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false
        });

        video.srcObject = currentStream;
        activeSource = 'camera';
        isCameraActive = true;

        if (defaultCoupleImg) defaultCoupleImg.style.display = 'none';
        uploadedImg.style.display = 'none';
        video.style.display = 'block';
        if (overlay) overlay.style.display = 'none';

        toggleBtn.textContent = "📹 Turn Camera Off";
        if (flipBtn) flipBtn.style.display = "inline-block"; // Show flip button when active

        statusDiv.style.color = '#27ae60';
        statusDiv.textContent = "Camera active! Pose and tap Snap & Download.";
    } catch (err) {
        console.error("Camera access error:", err);
        statusDiv.style.color = '#c0392b';
        statusDiv.textContent = "Camera unavailable. You can tap 'Upload Photo' to select an image!";
    }
}

// 🔄 New function to flip between front and rear cameras
/** Stops the current camera stream and requests the opposite-facing camera. */
async function flipCamera() {
    if (!isCameraActive) return;

    // Toggle facing mode preference
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    // Stop current tracks
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const video = document.getElementById('webcamVideo');
    const statusDiv = document.getElementById('statusMessage');

    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false
        });

        video.srcObject = currentStream;
        statusDiv.style.color = '#27ae60';
        statusDiv.textContent = `Switched to ${currentFacingMode === 'user' ? 'front' : 'rear'} camera.`;
    } catch (err) {
        console.error("Error flipping camera:", err);
        statusDiv.style.color = '#c0392b';
        statusDiv.textContent = "Failed to switch camera view.";
    }
}

/** Stops an active camera or starts the permission and stream request when inactive. */
function toggleCamera() {
    const video = document.getElementById('webcamVideo');
    const defaultCoupleImg = document.getElementById('defaultCoupleImg');
    const toggleBtn = document.getElementById('toggleCamBtn');
    const flipBtn = document.getElementById('flipCamBtn');
    const statusDiv = document.getElementById('statusMessage');

    if (isCameraActive) {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        isCameraActive = false;

        // Show default couple photo when camera is turned off
        if (defaultCoupleImg) defaultCoupleImg.style.display = 'block';
        video.style.display = 'none';

        toggleBtn.textContent = "📹 Turn Camera On";
        if (flipBtn) flipBtn.style.display = "none"; // Hide flip button when camera is off

        statusDiv.style.color = '#c0392b';
        statusDiv.textContent = "Camera is turned off.";
    } else {
        requestCameraPermission();
    }
}

/** Loads the selected image into the preview and stops any active camera stream. @param {Event} event */
function handleFileUpload(event) {
    const file = event.target.files[0];
    const statusDiv = document.getElementById('statusMessage');
    const toggleBtn = document.getElementById('toggleCamBtn');
    const flipBtn = document.getElementById('flipCamBtn');
    const defaultCoupleImg = document.getElementById('defaultCoupleImg');

    if (file) {
        if (isCameraActive && currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            isCameraActive = false;
            toggleBtn.textContent = "📹 Turn Camera On";
            if (flipBtn) flipBtn.style.display = "none";
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImageObj.src = e.target.result;
            uploadedImageObj.onload = function () {
                activeSource = 'upload';

                if (defaultCoupleImg) defaultCoupleImg.style.display = 'none';
                document.getElementById('webcamVideo').style.display = 'none';
                const overlay = document.getElementById('permissionOverlay');
                if (overlay) overlay.style.display = 'none';

                const preview = document.getElementById('uploadedImgPreview');
                preview.src = e.target.result;
                preview.style.display = 'block';

                statusDiv.style.color = '#27ae60';
                statusDiv.textContent = "Photo loaded! Tap 'Snap & Download' to generate your frame.";
            }
        }
        reader.readAsDataURL(file);
    }
}

/**
 * Composites the chosen image/video and frame into a high-resolution square PNG.
 * Cover scaling preserves aspect ratio and crops excess dimensions; only front-camera
 * video is mirrored, while uploaded images and rear-camera video retain their orientation.
 */
function captureAndDownload() {
    const canvas = document.getElementById('canvasOutput');
    const ctx = canvas.getContext('2d');
    const statusDiv = document.getElementById('statusMessage');

    // High-definition square resolution
    canvas.width = 1920;
    canvas.height = 1920;
    const w = canvas.width;
    const h = canvas.height;

    // 1. Professional Studio Filter (Enhanced richness & clarity)
    ctx.filter = 'brightness(1.15) contrast(1.15) saturate(1.12)';

    // Robust Cover Math (Prevents stretching & keeps correct proportions)
    /** Draws media using centered cover scaling, optionally mirroring the front-camera feed. */
    function drawCover(mediaElement, isVideo = false, isMirrored = false) {
        if (!mediaElement) return;

        const imgWidth = isVideo ? (mediaElement.videoWidth || 1280) : (mediaElement.naturalWidth || mediaElement.width || 1280);
        const imgHeight = isVideo ? (mediaElement.videoHeight || 720) : (mediaElement.naturalHeight || mediaElement.height || 720);

        const imgRatio = imgWidth / imgHeight;
        let renderWidth = w;
        let renderHeight = h;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > 1) {
            renderHeight = h;
            renderWidth = h * imgRatio;
            offsetX = (w - renderWidth) / 2;
        } else {
            renderWidth = w;
            renderHeight = w / imgRatio;
            offsetY = (h - renderHeight) / 2;
        }

        ctx.save();
        if (isMirrored) {
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(mediaElement, offsetX, offsetY, renderWidth, renderHeight);
        } else {
            ctx.drawImage(mediaElement, offsetX, offsetY, renderWidth, renderHeight);
        }
        ctx.restore();
    }

    // 2. Draw User Image (Camera, Upload, or Default Photo)
    // Only mirror the video if it's using the front camera (user mode), otherwise keep rear camera normal
    const isVideoMirrored = (currentFacingMode === 'user');
    if (activeSource === 'camera' && isCameraActive) {
        const video = document.getElementById('webcamVideo');
        drawCover(video, true, isVideoMirrored);
    } else if (activeSource === 'upload' && uploadedImageObj.src) {
        drawCover(uploadedImageObj, false, false);
    } else {
        const defaultCoupleImg = document.getElementById('defaultCoupleImg');
        if (defaultCoupleImg) {
            drawCover(defaultCoupleImg, false, false);
        }
    }

    // 3. Apply Soft-Focus Glamour Glow (Gives that smooth, premium skin texture look)
    ctx.filter = 'blur(12px) brightness(1.05)';
    ctx.globalAlpha = 0.12; // Subtle blending so it stays natural, not blurry
    if (activeSource === 'camera' && isCameraActive) {
        ctx.drawImage(document.getElementById('webcamVideo'), 0, 0, w, h);
    } else if (activeSource === 'upload' && uploadedImageObj.src) {
        ctx.drawImage(uploadedImageObj, 0, 0, w, h);
    }

    // Reset alpha and filter for the crisp frame overlay
    ctx.globalAlpha = 1.0;
    ctx.filter = 'none';

    // 4. Draw the Royal Prop Frame Overlay on top
    const propElement = document.getElementById('propOverlayImg');
    if (propElement) {
        ctx.drawImage(propElement, 0, 0, w, h);
    }

    // 5. Trigger High-Res Download
    const dataURL = canvas.toDataURL('image/png', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.download = 'Abhishek_Priya_Wedding_Memory.png';
    downloadLink.href = dataURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    statusDiv.style.color = '#27ae60';
    statusDiv.textContent = "High-resolution royal photo downloaded successfully!";
}

// Hide preloader once the page loads (or after 4s at most, so slow networks never get stuck)
(function () {
    let hidden = false;
    function hidePreloader() {
        if (hidden) return;
        hidden = true;
        const preloader = document.getElementById('pagePreloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }
    }
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 4000);
})();



// Helper function to create and append a single heart with smooth movement
/** Rebuilds the initial floating hearts, choosing a count based on the viewport width. */
function initVowsFloatingHearts() {
    const container = document.getElementById('vowsFloatingContainer');
    if (!container) return;

    container.innerHTML = '';
    const heartCount = Math.round((window.innerWidth > 992 ? 30 : 18) * PERF);

    for (let i = 0; i < heartCount; i++) {
        createVowHeart(container, false); // Initial normal hearts
    }
}

// Unified helper function for creating any vow heart
/** Creates a clickable floating heart; clicking it triggers a burst and spawns replacements. */
function createVowHeart(container, isSpawning = false) {
    const heart = document.createElement('div');
    heart.className = isSpawning ? 'floating-vow-heart spawning' : 'floating-vow-heart';

    // 50/50 Mix of Gold (💛) and Silver (🤍) hearts
    heart.innerText = Math.random() > 0.5 ? '💛' : '🤍';

    const randomSize = Math.random() * 0.8 + 1.8;
    heart.style.fontSize = `${randomSize}rem`;

    // Random positioning across the section
    heart.style.left = `${Math.random() * 90 + 5}%`;
    heart.style.top = `${Math.random() * 85 + 5}%`;

    // Multi-directional drift path values
    heart.style.setProperty('--moveX1', `${(Math.random() - 0.5) * 180}px`);
    heart.style.setProperty('--moveY1', `${(Math.random() - 0.5) * 180}px`);
    heart.style.setProperty('--moveX2', `${(Math.random() - 0.5) * 240}px`);
    heart.style.setProperty('--moveY2', `${(Math.random() - 0.5) * 240}px`);
    heart.style.setProperty('--moveX3', `${(Math.random() - 0.5) * 300}px`);
    heart.style.setProperty('--moveY3', `${(Math.random() - 0.5) * 300}px`);
    heart.style.setProperty('--moveX4', `${(Math.random() - 0.5) * 340}px`);
    heart.style.setProperty('--moveY4', `${(Math.random() - 0.5) * 340}px`);

    // Animation duration (slow fade-in + drift if spawning, standard drift otherwise)
    heart.style.animationDuration = isSpawning
        ? `1.2s, ${Math.random() * 6 + 8}s`
        : `${Math.random() * 6 + 8}s`;

    // Click event handler
    heart.addEventListener('click', (e) => {
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        burstVowHeartAt(container, clickX, clickY);
        heart.remove();

        // Spawn replacement hearts with the slow fade-in effect (capped so they never pile up)
        const maxHearts = Math.round((window.innerWidth > 992 ? 36 : 22) * PERF);
        const current = container.querySelectorAll('.floating-vow-heart').length;
        const toSpawn = Math.min(2, Math.max(1, maxHearts - current));
        for (let k = 0; k < toSpawn; k++) createVowHeart(container, true);
    });

    container.appendChild(heart);
}

/** Shows a short congratulatory message and animated emoji particles at container coordinates. */
function burstVowHeartAt(parentContainer, x, y) {
    const congratsText = document.createElement('div');
    congratsText.className = 'burst-congrats-text';
    congratsText.innerHTML = `<strong>🎉 Congratulations! 🎉</strong> <br><span>❤️ Abhishek & Priya ❤️</span>`;
    congratsText.style.left = `${x}px`;
    congratsText.style.top = `${y}px`;
    parentContainer.appendChild(congratsText);

    setTimeout(() => {
        congratsText.remove();
    }, 1200);

    const symbols = ['✨', '💖', '💛', '🤍', '❤️', '💓', '💗', '💕'];
    for (let i = 0; i < (IS_MOBILE ? 10 : 16); i++) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 110 + 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);

        parentContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Initialize on load and resize
afterLoad(initVowsFloatingHearts);
window.addEventListener('resize', initVowsFloatingHearts);