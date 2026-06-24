/* ============================================================
   PAWAN BUILDERS & DEVELOPERS — Premium JS Engine v2.0
   ============================================================ */

'use strict';

// ─────────────────────────────────────────
// THEME ENGINE
// ─────────────────────────────────────────
const THEMES = ['classic-navy', 'obsidian-gold', 'royal-sapphire', 'emerald-elite', 'crimson-empire', 'midnight-violet'];
const THEME_STORAGE_KEY = 'pawanBuilders_theme';

function setTheme(themeName) {
    if (!THEMES.includes(themeName)) return;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);

    // Update theme panel active state
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-theme') === themeName);
    });

    // Update particle color (trigger re-read of CSS variable)
    updateParticleColor();
}

function loadSavedTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEMES.includes(saved)) {
        setTheme(saved);
    } else {
        setTheme('classic-navy');
    }
}

// Theme Panel Toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themePanel = document.getElementById('themePanel');

themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themePanel.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && e.target !== themeToggleBtn) {
        themePanel.classList.remove('open');
    }
});

document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
        setTheme(opt.getAttribute('data-theme'));
    });

    opt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setTheme(opt.getAttribute('data-theme'));
        }
    });
});

// ─────────────────────────────────────────
// PRELOADER
// ─────────────────────────────────────────
const preloader = document.getElementById('preloader');

function hidePreloader() {
    preloader.classList.add('hidden');
    // Trigger hero word animations
    setTimeout(animateHeroWords, 200);
}

if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1800);
} else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 1800));
}

// ─────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ─────────────────────────────────────────
// HERO WORD ANIMATION
// ─────────────────────────────────────────
function animateHeroWords() {
    const words = document.querySelectorAll('.hero-title .word span');
    words.forEach((span, i) => {
        setTimeout(() => {
            span.style.animation = `wordReveal 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        }, i * 120 + 300);
    });
}

// ─────────────────────────────────────────
// PARTICLE SYSTEM
// ─────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let particleAnimFrame;
let particleColorRgb = '201,168,76'; // default gold

function updateParticleColor() {
    // Read from CSS variable
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue('--particle-color').trim();
    if (raw) particleColorRgb = raw;
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * (canvas ? canvas.width : window.innerWidth),
        y: Math.random() * (canvas ? canvas.height : window.innerHeight),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 200 + 100
    };
}

function initParticles() {
    if (!canvas) return;
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 14000));
    for (let i = 0; i < count; i++) {
        particles.push(createParticle());
    }
}

function drawParticles() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateParticleColor();

    particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Reset faded particle
        if (p.life <= 0) {
            particles[i] = createParticle();
            return;
        }

        // Draw dot
        const alpha = Math.min(p.opacity, p.life / 80);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColorRgb}, ${alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const lineAlpha = (1 - dist / 120) * 0.12;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(${particleColorRgb}, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    particleAnimFrame = requestAnimationFrame(drawParticles);
}

if (canvas) {
    resizeCanvas();
    initParticles();
    drawParticles();

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
        initParticles();
    });
    resizeObserver.observe(document.body);
}

// ─────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const sections = document.querySelectorAll('section[id]');

let cachedSections = [];

function cacheSectionOffsets() {
    cachedSections = Array.from(sections).map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop,
        height: section.clientHeight
    }));
}

window.addEventListener('load', cacheSectionOffsets);
window.addEventListener('resize', cacheSectionOffsets);
cacheSectionOffsets();

// Unified scroll handler
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollPos = window.scrollY;

            // Navbar scrolled state
            navbar.classList.toggle('scrolled', scrollPos > 60);

            // Back to top visibility
            if (backBtn) {
                backBtn.style.display = scrollPos > 500 ? 'flex' : 'none';
            }

            // Active nav link
            let current = '';
            cachedSections.forEach(sec => {
                if (scrollPos >= sec.top - 200) current = sec.id;
            });

            navMenu.querySelectorAll('a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Mobile hamburger
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        try {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch(err) {}
    });
});

// ─────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ─────────────────────────────────────────
// ANIMATED COUNTERS
// ─────────────────────────────────────────
function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

const statsSection = document.querySelector('.about-stats-row');
if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(el => {
                    animateCounter(el, parseInt(el.getAttribute('data-target')));
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counterObserver.observe(statsSection);
}

// ─────────────────────────────────────────
// HERO SLIDER
// ─────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slider .slide');
const dots = document.querySelectorAll('.slider-dots .dot');
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = ((index % slides.length) + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide]?.classList.add('active');
}

function startSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); startSlideTimer(); });
});

startSlideTimer();

// ─────────────────────────────────────────
// ABOUT CAROUSEL
// ─────────────────────────────────────────
const showcaseSlides = document.querySelectorAll('.carousel-slide');
const showcaseDots = document.querySelectorAll('.indicator-dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentShowcase = 0;
let showcaseTimer;

function updateCarousel() {
    showcaseSlides.forEach((s, i) => s.classList.toggle('active', i === currentShowcase));
    showcaseDots.forEach((d, i) => d.classList.toggle('active', i === currentShowcase));
}

function navigateCarousel(dir) {
    currentShowcase = (currentShowcase + dir + showcaseSlides.length) % showcaseSlides.length;
    updateCarousel();
}

function startCarouselTimer() {
    clearInterval(showcaseTimer);
    showcaseTimer = setInterval(() => navigateCarousel(1), 3000);
}

if (prevBtn) prevBtn.addEventListener('click', () => { navigateCarousel(-1); startCarouselTimer(); });
if (nextBtn) nextBtn.addEventListener('click', () => { navigateCarousel(1); startCarouselTimer(); });

showcaseDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { currentShowcase = i; updateCarousel(); startCarouselTimer(); });
});

const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(showcaseTimer));
    carouselContainer.addEventListener('mouseleave', startCarouselTimer);

    let touchStartXC = 0;
    carouselContainer.addEventListener('touchstart', e => { touchStartXC = e.changedTouches[0].screenX; }, { passive: true });
    carouselContainer.addEventListener('touchend', e => {
        const dist = e.changedTouches[0].screenX - touchStartXC;
        if (Math.abs(dist) > 50) navigateCarousel(dist > 0 ? -1 : 1);
        startCarouselTimer();
    }, { passive: true });
}

if (showcaseSlides.length) { updateCarousel(); startCarouselTimer(); }

// ─────────────────────────────────────────
// TESTIMONIALS SLIDER
// ─────────────────────────────────────────
const testimonialSlides = document.querySelectorAll('.testimonials .testimonial');
const testimonialsContainer = document.getElementById('testimonialsSlider');
const testimonialDots = document.querySelectorAll('.testimonial-dots .testimonial-dot');
let testimonialIndex = 0;
let testimonialTimer = setInterval(nextTestimonial, 5000);

function showTestimonial(i) {
    testimonialIndex = i;
    testimonialSlides.forEach((t, idx) => t.classList.toggle('active', idx === i));
    testimonialDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    if (testimonialsContainer) {
        const slide = testimonialSlides[i];
        const cw = testimonialsContainer.clientWidth;
        const sw = slide.clientWidth;
        testimonialsContainer.scrollTo({ left: slide.offsetLeft - (cw - sw) / 2, behavior: 'smooth' });
    }
}

function nextTestimonial() {
    showTestimonial((testimonialIndex + 1) % testimonialSlides.length);
}

testimonialDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showTestimonial(i); clearInterval(testimonialTimer); testimonialTimer = setInterval(nextTestimonial, 5000); });
});

if (testimonialsContainer) {
    let isDown = false;
    let startX, scrollL;

    testimonialsContainer.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
    testimonialsContainer.addEventListener('mouseleave', () => {
        if (!isDown) { clearInterval(testimonialTimer); testimonialTimer = setInterval(nextTestimonial, 5000); }
    });

    testimonialsContainer.addEventListener('touchstart', () => clearInterval(testimonialTimer), { passive: true });
    testimonialsContainer.addEventListener('touchend', () => { clearInterval(testimonialTimer); testimonialTimer = setInterval(nextTestimonial, 5000); }, { passive: true });

    testimonialsContainer.addEventListener('mousedown', e => {
        isDown = true;
        testimonialsContainer.classList.add('grabbing');
        startX = e.pageX - testimonialsContainer.offsetLeft;
        scrollL = testimonialsContainer.scrollLeft;
        clearInterval(testimonialTimer);
    });

    testimonialsContainer.addEventListener('mouseleave', () => {
        if (isDown) { isDown = false; testimonialsContainer.classList.remove('grabbing'); testimonialTimer = setInterval(nextTestimonial, 5000); }
    });

    testimonialsContainer.addEventListener('mouseup', () => {
        if (isDown) { isDown = false; testimonialsContainer.classList.remove('grabbing'); testimonialTimer = setInterval(nextTestimonial, 5000); }
    });

    testimonialsContainer.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const walk = (e.pageX - testimonialsContainer.offsetLeft - startX) * 1.5;
        testimonialsContainer.scrollLeft = scrollL - walk;
    });

    let isScrolling;
    testimonialsContainer.addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const center = testimonialsContainer.scrollLeft + testimonialsContainer.clientWidth / 2;
            let closest = 0, minDist = Infinity;
            testimonialSlides.forEach((s, i) => {
                const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - center);
                if (d < minDist) { minDist = d; closest = i; }
            });
            if (closest !== testimonialIndex) showTestimonial(closest);
        }, 100);
    }, { passive: true });
}

// ─────────────────────────────────────────
// PROJECT FILTER
// ─────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            const show = filter === 'all' || cat === filter;
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            if (show) {
                card.style.display = '';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = '';
                });
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (btn.getAttribute('data-filter') !== 'all' && card.getAttribute('data-category') !== btn.getAttribute('data-filter')) {
                        card.style.display = 'none';
                    }
                }, 350);
            }
        });
    });
});

// ─────────────────────────────────────────
// MAGNETIC BUTTONS
// ─────────────────────────────────────────
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const pull = 0.25;
        btn.style.transform = `translateY(-3px) translate(${x * pull}px, ${y * pull}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ─────────────────────────────────────────
// PROCESS TIMELINE PROGRESS
// ─────────────────────────────────────────
const timelineEl = document.getElementById('processTimeline');
const timelineProgress = document.getElementById('timelineProgress');

if (timelineEl && timelineProgress) {
    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    timelineProgress.style.width = '75%';
                }, 300);
                tlObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    tlObserver.observe(timelineEl);
}

// ─────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (name && email && message) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent ✓';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;
            contactForm.reset();
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            // Shake animation on invalid
            contactForm.style.animation = 'none';
            requestAnimationFrame(() => {
                contactForm.style.animation = '';
            });
            alert('Please fill in all required fields.');
        }
    });
}

// ─────────────────────────────────────────
// BACK TO TOP
// ─────────────────────────────────────────
const backBtn = document.createElement('div');
backBtn.className = 'back-to-top';
backBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
backBtn.title = 'Back to top';
backBtn.style.display = 'none';
backBtn.setAttribute('role', 'button');
backBtn.setAttribute('aria-label', 'Back to top');
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(backBtn);

// ─────────────────────────────────────────
// WHATSAPP FLOATING BUTTON
// ─────────────────────────────────────────
const whatsappBtn = document.createElement('div');
whatsappBtn.className = 'whatsapp-btn';
whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
whatsappBtn.title = 'Chat on WhatsApp';
whatsappBtn.setAttribute('role', 'button');
whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
whatsappBtn.addEventListener('click', () => {
    const phone = '919966100241';
    const text = encodeURIComponent('Hi, I am interested in your construction services at Pawan Builders.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
});
document.body.appendChild(whatsappBtn);

// ─────────────────────────────────────────
// SERVICE CARD ICON FLIP
// ─────────────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.service-icon');
        if (icon) { icon.style.transform = 'rotateY(180deg)'; icon.style.transition = 'transform 0.6s ease'; }
    });
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.service-icon');
        if (icon) icon.style.transform = 'rotateY(0deg)';
    });
});

// ─────────────────────────────────────────
// PROJECT CARD HOVER EFFECT
// ─────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const img = card.querySelector('.project-image img');
        if (img) { img.style.transform = 'scale(1.08)'; img.style.transition = 'transform 0.6s ease'; }
    });
    card.addEventListener('mouseleave', () => {
        const img = card.querySelector('.project-image img');
        if (img) img.style.transform = 'scale(1)';
    });
});

// ─────────────────────────────────────────
// SMOOTH PAGE ENTRANCE
// ─────────────────────────────────────────
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ═══════════════════════════════════════════════════════════
// 3D SCROLL ENGINE — Cinematic Depth Gallery
// ═══════════════════════════════════════════════════════════
(function init3DScroll() {
    'use strict';

    // ── Smooth scroll tracker ──────────────────────
    let scrollY    = window.scrollY;
    let targetScrollY = window.scrollY;
    let rafId;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function onScroll() {
        targetScrollY = window.scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Gallery rows ──────────────────────────────
    const g3dRows    = Array.from(document.querySelectorAll('.g3d-row'));
    const galleryEl  = document.getElementById('gallery3dStack');
    let galleryTop   = 0;
    let galleryH     = 0;

    function cacheGalleryBounds() {
        if (!galleryEl) return;
        const rect = galleryEl.getBoundingClientRect();
        galleryTop = rect.top + window.scrollY;
        galleryH   = galleryEl.offsetHeight;
    }

    window.addEventListener('resize', cacheGalleryBounds);
    window.addEventListener('load', cacheGalleryBounds);
    cacheGalleryBounds();

    // ── Hero slide parallax ───────────────────────
    const heroSlider = document.querySelector('.hero-slider');

    // ── Project card tilt on scroll ───────────────
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    const projectCardData = projectCards.map(card => ({
        el: card,
        rect: null
    }));

    function cacheProjectRects() {
        projectCardData.forEach(d => {
            d.rect = d.el.getBoundingClientRect();
            d.top  = d.rect.top + window.scrollY;
        });
    }
    window.addEventListener('resize', cacheProjectRects);
    window.addEventListener('load', cacheProjectRects);
    cacheProjectRects();

    // ── Mouse tilt on gallery cards ───────────────
    const g3dCards = Array.from(document.querySelectorAll('.g3d-card'));

    g3dCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
            const dy   = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
            const rotX = dy * -12;   // tilt up/down
            const rotY = dx *  14;   // tilt left/right
            card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── Main RAF loop ─────────────────────────────
    function tick() {
        scrollY = lerp(scrollY, targetScrollY, 0.08);

        const vp  = window.innerHeight;

        // 1. Hero parallax — slides drift at 35% scroll speed
        if (heroSlider) {
            const heroParallax = scrollY * 0.35;
            heroSlider.style.transform = `translateY(${heroParallax}px)`;
        }

        // 2. Gallery 3D depth rows
        if (galleryEl && g3dRows.length) {
            // How far through the gallery section are we (0 → 1)
            const galleryScrolled = (scrollY + vp - galleryTop) / (galleryH + vp);
            const prog = Math.max(0, Math.min(1, galleryScrolled));

            g3dRows.forEach((row, i) => {
                const depth   = parseFloat(row.dataset.depth  || '0.1');
                const tiltX   = parseFloat(row.dataset.tiltX  || '5');

                // Each row enters viewport at a staggered time
                const rowProg = Math.max(0, Math.min(1, prog * 1.4 - i * 0.06));

                // Z-translate: closer rows come forward more as you scroll
                const zShift  = depth * (prog - 0.5) * 1800;

                // X-rotate: rows tilt forward then flatten as you scroll through
                const xAngle  = tiltX * (1 - rowProg * 1.5);

                // Slight Y-translate offset per depth layer
                const yShift  = (1 - rowProg) * depth * 220;

                // Alternate left/right lateral drift per row
                const xShift  = (i % 2 === 0 ? 1 : -1) * depth * (1 - rowProg) * 60;

                // Opacity: fade in from ghost
                const opacity = 0.35 + rowProg * 0.65;

                row.style.transform = `
                    translateY(${yShift}px)
                    translateX(${xShift}px)
                    translateZ(${zShift}px)
                    rotateX(${xAngle}deg)
                `;
                row.style.opacity = opacity;
            });
        }

        // 3. Project card scroll-tilt (subtle depth reveal)
        projectCardData.forEach(({ el, top }) => {
            if (!top) return;
            const relY = scrollY + vp * 0.6 - top;
            const norm = Math.max(-1, Math.min(1, relY / (vp * 0.5)));
            // Gentle pitch + scale
            const rotX = norm * -6;
            const sc   = 1 + Math.abs(norm) * 0.015;
            // Only apply tilt when not hovering (hover handles its own transform)
            if (!el.matches(':hover')) {
                el.style.transform = `perspective(800px) rotateX(${rotX}deg) scale(${sc})`;
            }
        });

        rafId = requestAnimationFrame(tick);
    }

    // Start loop
    rafId = requestAnimationFrame(tick);

    // Pause when page is hidden to save GPU
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            rafId = requestAnimationFrame(tick);
        }
    });

})();

// Run theme initialization
loadSavedTheme();
