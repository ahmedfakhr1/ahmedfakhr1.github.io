// Common functionality for all pages
const initTheme = () => {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const root = document.documentElement;
    
    // Use requestAnimationFrame for theme changes
    const updateTheme = (theme) => {
        requestAnimationFrame(() => {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            themeBtns.forEach(b => b.classList.remove('active'));
            document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        });
    };
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => updateTheme(btn.dataset.theme));
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateTheme(savedTheme);
};

// Load navigation component with caching
const loadNavigation = (() => {
    let cachedNavigation = null;
    
    return () => {
        if (cachedNavigation) {
            const navPlaceholder = document.getElementById('nav-placeholder');
            if (navPlaceholder) {
                navPlaceholder.innerHTML = cachedNavigation;
                initTheme();
                highlightCurrentPage();
                initSidebarToggle(); // <-- Move here
            }
            return;
        }

        fetch('../components/navigation.html')
            .then(response => response.text())
            .then(data => {
                cachedNavigation = data;
                const navPlaceholder = document.getElementById('nav-placeholder');
                if (navPlaceholder) {
                    navPlaceholder.innerHTML = data;
                    initTheme();
                    highlightCurrentPage();
                    initSidebarToggle(); // <-- Move here
                }
            });
    };
})();

// Highlight current page in navigation
const highlightCurrentPage = () => {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    requestAnimationFrame(() => {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href').includes(currentPage)) {
                link.classList.add('active');
            }
        });
    });
};

// Back to top button with optimized scroll handling
const initBackToTop = () => {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);

    // Throttled scroll handler
    const throttle = (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const toggleBackToTopButton = throttle(() => {
        requestAnimationFrame(() => {
            const shouldShow = window.scrollY > 300;
            backToTop.style.opacity = shouldShow ? '1' : '0';
            backToTop.style.pointerEvents = shouldShow ? 'auto' : 'none';
        });
    }, 100);

    // Smooth scroll with requestAnimationFrame
    backToTop.addEventListener('click', () => {
        const duration = 600;
        const start = window.scrollY;
        const startTime = performance.now();

        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeInOutCubic = t => t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            window.scrollTo(0, start * (1 - easeInOutCubic(progress)));

            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
    });

    window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
    toggleBackToTopButton();
};

// Initialize intersection observer for animations
const initAnimationObserver = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('animate');
                });
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.bio-text p, .project-card, .cert-card').forEach(
        element => animationObserver.observe(element)
    );
};

// Initialize sidebar toggle functionality
const initSidebarToggle = () => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    function openSidebar() {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }
    if (toggle && sidebar) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle) {
                closeSidebar();
            }
        });
        // Close sidebar on ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeSidebar();
        });
    }
};

// Initialize common features
const initCommon = () => {
    loadNavigation();
    initBackToTop();
    initAnimationObserver();
    
    // Add touch device class if needed
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
};

// Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommon);
} else {
    initCommon();
}