// Header & Footer Component Loader
async function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        try {
            const response = await fetch('components/header.html');
            const data = await response.text();
            headerPlaceholder.innerHTML = data;
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    if (footerPlaceholder) {
        try {
            const response = await fetch('components/footer.html');
            const data = await response.text();
            footerPlaceholder.innerHTML = data;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    // Initialize UI elements that depend on components
    initUI();
}

function initUI() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            // If it's a hash link on the same page
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open
                    if (navList && navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        const icon = menuToggle.querySelector('i');
                        if (icon) {
                            icon.classList.add('fa-bars');
                            icon.classList.remove('fa-times');
                        }
                    }
                }
            }
        });
    });

    // Header Background on Scroll
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.service-card, .feature-item, .about-main-text, .chairman-visual, .chairman-content, .mv-card, .timeline-item, .industry-card, .chairman-refined-content');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal elements
    revealElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    const dotsContainer = document.querySelector('.carousel-dots-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && cards.length > 0) {
        let currentIndex = 0;
        let interval;
        let itemsPerScreen = 3;

        const updateItemsPerScreen = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                itemsPerScreen = 1;
            } else if (width <= 1024) {
                itemsPerScreen = 2;
            } else {
                itemsPerScreen = 3;
            }
            createDots();
            updateTrackPosition();
        };

        const createDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const totalStops = cards.length - itemsPerScreen + 1;
            if (totalStops <= 1) {
                dotsContainer.style.display = 'none';
                return;
            } else {
                dotsContainer.style.display = 'flex';
            }

            for (let i = 0; i < totalStops; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateTrackPosition();
                    resetTimer();
                });
                dotsContainer.appendChild(dot);
            }
        };

        const updateTrackPosition = () => {
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 32;
            const singleItemMove = cards[0].offsetWidth + gap;
            track.style.transform = `translateX(-${currentIndex * singleItemMove}px)`;

            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const moveNext = () => {
            const totalStops = cards.length - itemsPerScreen + 1;
            if (currentIndex < totalStops - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateTrackPosition();
        };

        const movePrev = () => {
            const totalStops = cards.length - itemsPerScreen + 1;
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalStops - 1;
            }
            updateTrackPosition();
        };

        const resetTimer = () => {
            clearInterval(interval);
            interval = setInterval(moveNext, 3000);
        };

        updateItemsPerScreen();
        window.addEventListener('resize', updateItemsPerScreen);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                moveNext();
                resetTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                movePrev();
                resetTimer();
            });
        }

        resetTimer();
    }

    // Modal Logic
    const chairmanBtn = document.getElementById('chairman-read-more-btn');
    const chairmanModal = document.getElementById('chairman-modal');
    const closeChairmanBtn = document.getElementById('close-modal-btn');

    if (chairmanBtn && chairmanModal && closeChairmanBtn) {
        chairmanBtn.addEventListener('click', () => {
            chairmanModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeCModal = () => {
            chairmanModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeChairmanBtn.addEventListener('click', closeCModal);
        chairmanModal.addEventListener('click', (e) => {
            if (e.target === chairmanModal) closeCModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chairmanModal.classList.contains('active')) closeCModal();
        });
    }

    // Note: About Us button is now a link to about.html handled in HTML
}

// Start sequence
document.addEventListener('DOMContentLoaded', loadComponents);
