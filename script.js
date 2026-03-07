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

    // Smooth Scrolling for Anchor Links & Mobile Menu Close
    document.querySelectorAll('.nav-link, .btn-header-cta, a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            // Close mobile menu on any link click
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }

            // Check if it's an anchor link to the current page
            if (href.includes('#')) {
                const targetId = href.substring(href.indexOf('#'));
                const pagePart = href.substring(0, href.indexOf('#'));

                // If it's a direct hash, or points to the current page (index.html or root)
                const isCurrentPage = pagePart === '' ||
                    (pagePart === 'index.html' && (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')));

                if (isCurrentPage) {
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Highlight Active Link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // Do not highlight purely section links as 'active' page links (except via scroll spy if needed later)
            if (href.includes('#') && !href.startsWith('#') && href.split('#')[0] === currentPath) {
                link.classList.remove('active');
            } else if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal, .service-card, .feature-item, .about-main-text, .chairman-visual, .chairman-content, .mv-card, .timeline-item, .industry-card, .chairman-refined-content');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
                // Ensure inline styles don't conflict with CSS transitions if applicable
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal elements if not already handled by CSS
    revealElements.forEach((element) => {
        if (!element.classList.contains('active')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
        }
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
    const chairmanBtns = [
        document.getElementById('chairman-read-more-btn'),
        document.getElementById('chairman-read-more-btn-2'),
        document.getElementById('chairman-read-more-btn-details'),
        document.getElementById('chairman-read-more-btn-modal')
    ];
    const chairmanModal = document.getElementById('chairman-modal');
    const closeChairmanBtn = document.getElementById('close-modal-btn');

    if (chairmanModal && closeChairmanBtn) {
        chairmanBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    chairmanModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
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
