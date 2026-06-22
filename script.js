// Initialize UI Widgets
const backBtn = document.createElement('div');
backBtn.className = 'back-to-top';
backBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
backBtn.title = 'Back to top';
backBtn.style.display = 'none';
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(backBtn);

// Navigation scroll effects & active link state
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navMenu = document.getElementById('navMenu');

// Cache section offsets to prevent layout thrashing on scroll
let cachedSections = [];

function cacheSectionOffsets() {
    cachedSections = Array.from(sections).map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop,
        height: section.clientHeight
    }));
}

// Recalculate on load and resize
window.addEventListener('load', cacheSectionOffsets);
window.addEventListener('resize', cacheSectionOffsets);
cacheSectionOffsets(); // Initial run

// Single, unified passive scroll listener throttled with requestAnimationFrame
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;

            // 1. Navbar scrolled class
            if (scrollPos > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 2. Back to Top button toggle
            if (scrollPos > 500) {
                backBtn.style.display = 'flex';
            } else {
                backBtn.style.display = 'none';
            }

            // 3. Navigation active link sync
            let current = '';
            cachedSections.forEach(sec => {
                if (scrollPos >= sec.top - 200) {
                    current = sec.id;
                }
            });

            navMenu.querySelectorAll('a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        try {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } catch (err) {
            console.error('Smooth scroll target error:', err);
        }
    });
});

// Animated counter for statistics
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
};

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutStats = document.querySelector('.about-stats-row');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// Fade in animation on scroll
const fadeElements = document.querySelectorAll('.service-card, .project-card, .about-text, .contact-info, .contact-form, .about-carousel');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message (in a real application, you would send this to a server)
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Project card hover effect enhancement
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const img = card.querySelector('.project-image img');
        if (img) {
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.5s ease';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const img = card.querySelector('.project-image img');
        if (img) {
            img.style.transform = 'scale(1)';
            img.style.transition = 'transform 0.5s ease';
        }
    });
});

// Service card hover effect enhancement
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.service-icon').style.transform = 'rotateY(180deg)';
        card.querySelector('.service-icon').style.transition = 'transform 0.6s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.service-icon').style.transform = 'rotateY(0deg)';
    });
});

// Hero Background Slider Logic
const slides = document.querySelectorAll('.hero-slider .slide');
const dots = document.querySelectorAll('.slider-dots .dot');
let currentSlideIndex = 0;
let slideInterval;
const SLIDE_DURATION = 6000; // 6 seconds

function showSlide(index) {
    if (!slides.length || !dots.length) return;
    
    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Update index
    currentSlideIndex = (index + slides.length) % slides.length;
    
    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopSlideTimer() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Add click listeners to dots for manual navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        startSlideTimer(); // Reset auto-slide timer after manual click
    });
});

// Initialize timer
startSlideTimer();

// Loading animation & page opacity initialization
if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
} else {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// About Column Carousel Fading Slider Logic
const showcaseSlides = document.querySelectorAll('.carousel-slide');
const showcaseDots = document.querySelectorAll('.indicator-dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentShowcaseIndex = 0; // Start with the 1st slide active
let showcaseInterval;
const SHOWCASE_DURATION = 3000; // 3 seconds

function updateShowcaseCarousel() {
    if (!showcaseSlides.length) return;
    
    showcaseSlides.forEach((slide, idx) => {
        if (idx === currentShowcaseIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update indicator dots active state
    showcaseDots.forEach((dot, idx) => {
        if (idx === currentShowcaseIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function navigateShowcase(direction) {
    const totalSlides = showcaseSlides.length;
    currentShowcaseIndex = (currentShowcaseIndex + direction + totalSlides) % totalSlides;
    updateShowcaseCarousel();
}

function startShowcaseTimer() {
    stopShowcaseTimer();
    showcaseInterval = setInterval(() => {
        navigateShowcase(1);
    }, SHOWCASE_DURATION);
}

function stopShowcaseTimer() {
    if (showcaseInterval) {
        clearInterval(showcaseInterval);
    }
}

// Add listeners to prev/next buttons
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        navigateShowcase(-1);
        startShowcaseTimer(); // Reset timer on manual click
    });
    
    nextBtn.addEventListener('click', () => {
        navigateShowcase(1);
        startShowcaseTimer(); // Reset timer on manual click
    });
}

// Add click listeners to indicator dots
showcaseDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentShowcaseIndex = index;
        updateShowcaseCarousel();
        startShowcaseTimer(); // Reset timer on manual click
    });
});

// Pause autoplay on mouse hover, resume on leave
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopShowcaseTimer);
    carouselContainer.addEventListener('mouseleave', startShowcaseTimer);
}

// Support mobile swipe gestures
let touchStartX = 0;
let touchEndX = 0;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const threshold = 50; // Minimum swipe distance in pixels
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0) {
            // Swipe Right -> Previous Slide
            navigateShowcase(-1);
        } else {
            // Swipe Left -> Next Slide
            navigateShowcase(1);
        }
        startShowcaseTimer(); // Reset autoplay timer
    }
}

// Initialize Showcase Carousel
if (showcaseSlides.length) {
    updateShowcaseCarousel();
    startShowcaseTimer();
}

// Testimonials simple slider
const testimonialSlides = document.querySelectorAll('.testimonials .testimonial');
const testimonialsContainer = document.querySelector('.testimonials-slider');
const testimonialDots = document.querySelectorAll('.testimonial-dots .testimonial-dot');
let testimonialIndex = 0;
let testimonialTimer = setInterval(nextTestimonial, 5000);

function showTestimonial(i) {
    if (!testimonialSlides.length) return;
    testimonialIndex = i;
    
    testimonialSlides.forEach((t, idx) => {
        t.classList.toggle('active', idx === i);
    });

    testimonialDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === i);
    });

    if (testimonialsContainer) {
        const activeSlide = testimonialSlides[i];
        const containerWidth = testimonialsContainer.clientWidth;
        const slideWidth = activeSlide.clientWidth;
        const scrollLeft = activeSlide.offsetLeft - (containerWidth - slideWidth) / 2;
        testimonialsContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
}

function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
    showTestimonial(testimonialIndex);
}

// Add click listeners to testimonial dots
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// Pause testimonial on hover & touch & Drag Scroll (Desktop)
if (testimonialsContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse hover pause
    testimonialsContainer.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
    testimonialsContainer.addEventListener('mouseleave', () => {
        if (!isDown) {
            clearInterval(testimonialTimer);
            testimonialTimer = setInterval(nextTestimonial, 5000);
        }
    });
    
    // Mobile Touch interaction
    testimonialsContainer.addEventListener('touchstart', () => clearInterval(testimonialTimer), { passive: true });
    testimonialsContainer.addEventListener('touchend', () => {
        clearInterval(testimonialTimer);
        testimonialTimer = setInterval(nextTestimonial, 5000);
    }, { passive: true });

    // Desktop Drag-to-Scroll (Grab) interaction
    testimonialsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        testimonialsContainer.classList.add('grabbing');
        startX = e.pageX - testimonialsContainer.offsetLeft;
        scrollLeft = testimonialsContainer.scrollLeft;
        clearInterval(testimonialTimer);
    });

    testimonialsContainer.addEventListener('mouseleave', () => {
        if (isDown) {
            isDown = false;
            testimonialsContainer.classList.remove('grabbing');
            clearInterval(testimonialTimer);
            testimonialTimer = setInterval(nextTestimonial, 5000);
        }
    });

    testimonialsContainer.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            testimonialsContainer.classList.remove('grabbing');
            clearInterval(testimonialTimer);
            testimonialTimer = setInterval(nextTestimonial, 5000);
        }
    });

    testimonialsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialsContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        testimonialsContainer.scrollLeft = scrollLeft - walk;
    });

    // Sync active state on manual scroll/swipe
    let isScrolling;
    testimonialsContainer.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const containerCenter = testimonialsContainer.scrollLeft + testimonialsContainer.clientWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            testimonialSlides.forEach((slide, idx) => {
                const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
                const distance = Math.abs(slideCenter - containerCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = idx;
                }
            });

            if (closestIndex !== testimonialIndex) {
                testimonialIndex = closestIndex;
                testimonialSlides.forEach((t, idx) => {
                    t.classList.toggle('active', idx === closestIndex);
                });
                testimonialDots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === closestIndex);
                });
            }
        }, 100);
    }, { passive: true });
}

// Floating WhatsApp quick contact
const whatsappBtn = document.createElement('div');
whatsappBtn.className = 'whatsapp-btn';
whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
whatsappBtn.title = 'Chat on WhatsApp';
whatsappBtn.addEventListener('click', ()=>{
    const phone = '+919966100241';
    const text = encodeURIComponent('Hi, I am interested in your services.');
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${text}`, '_blank');
});
document.body.appendChild(whatsappBtn);



// Reveal animations for new sections
const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.testimonials, .process, .team, .cta-banner').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    revealObserver.observe(el);
});
