// Project card hover effects
const initProjectCards = () => {
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    document.querySelectorAll('.project-card').forEach(card => {
        // Mouse move effect for desktop
        if (!('ontouchstart' in window)) {
            // Throttled mousemove handler
            const handleMouseMove = throttle((e) => {
                requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });
            }, 16); // ~60fps

            card.addEventListener('mousemove', handleMouseMove, { passive: true });

            // Use CSS transform for better performance
            card.addEventListener('mouseenter', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'translateY(-5px) scale(1.02)';
                    card.style.zIndex = '2';
                });
            });

            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.zIndex = '1';
                });
            });
        }

        // Project detail handling with debouncing
        const header = card.querySelector('.project-header');
        const details = card.querySelector('.project-details');
        const viewBtn = card.querySelector('.view-project');

        if (viewBtn) {
            const debounce = (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };

            const showProjectDetail = debounce((e) => {
                e.stopPropagation();
                const projectId = card.dataset.project;
                const targetDetail = document.getElementById(`${projectId}-detail`);
                const projectDetailContainer = document.querySelector('.project-detail-container');

                // Use will-change to optimize transitions
                targetDetail.style.willChange = 'opacity, transform';
                projectDetailContainer.style.willChange = 'opacity, visibility';

                // Hide all project details and show the target one
                document.querySelectorAll('.project-detail').forEach(detail => 
                    detail.classList.remove('active')
                );
                
                requestAnimationFrame(() => {
                    targetDetail.classList.add('active');
                    projectDetailContainer.classList.add('active');
                    document.body.style.overflow = 'hidden';

                    // Reset will-change after animation
                    setTimeout(() => {
                        targetDetail.style.willChange = 'auto';
                        projectDetailContainer.style.willChange = 'auto';
                    }, 300);
                });
            }, 150);

            viewBtn.addEventListener('click', showProjectDetail);
        }
    });

    // Back button functionality with optimized transitions
    document.querySelectorAll('.back-to-projects').forEach(button => {
        button.addEventListener('click', () => {
            const projectDetailContainer = document.querySelector('.project-detail-container');
            const activeDetail = document.querySelector('.project-detail.active');

            if (activeDetail) {
                activeDetail.style.willChange = 'opacity, transform';
            }
            projectDetailContainer.style.willChange = 'opacity, visibility';

            requestAnimationFrame(() => {
                projectDetailContainer.classList.remove('active');
                document.body.style.overflow = '';
                
                setTimeout(() => {
                    document.querySelectorAll('.project-detail').forEach(detail => {
                        detail.classList.remove('active');
                        detail.style.willChange = 'auto';
                    });
                    projectDetailContainer.style.willChange = 'auto';
                }, 300);
            });
        });
    });

    // Close detail view when clicking outside with debouncing
    const projectDetailContainer = document.querySelector('.project-detail-container');
    if (projectDetailContainer) {
        const handleOutsideClick = debounce((e) => {
            if (e.target === projectDetailContainer) {
                const activeDetail = document.querySelector('.project-detail.active');
                if (activeDetail) {
                    activeDetail.style.willChange = 'opacity, transform';
                }
                projectDetailContainer.style.willChange = 'opacity, visibility';

                requestAnimationFrame(() => {
                    projectDetailContainer.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    setTimeout(() => {
                        document.querySelectorAll('.project-detail').forEach(detail => {
                            detail.classList.remove('active');
                            detail.style.willChange = 'auto';
                        });
                        projectDetailContainer.style.willChange = 'auto';
                    }, 300);
                });
            }
        }, 150);

        projectDetailContainer.addEventListener('click', handleOutsideClick);

        // Handle escape key to close detail view
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectDetailContainer.classList.contains('active')) {
                handleOutsideClick({ target: projectDetailContainer });
            }
        });
    }
};

// Initialize project features when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectCards);
} else {
    initProjectCards();
}