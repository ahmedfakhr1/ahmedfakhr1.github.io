// script.js
// Smooth scrolling for entire document
document.documentElement.style.scrollBehavior = 'smooth';

// Collapsible projects functionality
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const projectCard = button.closest('.project-card');
    const details = projectCard.querySelector('.project-details');
    const isActive = button.classList.contains('active');

    button.classList.toggle('active');
    details.style.maxHeight = isActive ? null : details.scrollHeight + 'px';
  });
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const scrollY = window.scrollY;
  
  header.style.backgroundColor = scrollY > 50 
    ? 'rgba(44, 62, 80, 0.95)' 
    : '#2c3e50';
  
  header.style.padding = scrollY > 50 
    ? '1rem 0' 
    : '2rem 0';
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px) scale(1.02)';
    card.style.zIndex = '2';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.zIndex = '1';
  });
});

// Back to top button
const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.style.opacity = window.scrollY > 300 ? '1' : '0';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Touch device detection and hover class management
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
}

// Dynamic element highlighting
document.querySelectorAll('a, button, .project-header').forEach(element => {
  element.addEventListener('mousedown', () => {
    element.style.transform = 'scale(0.98)';
  });
  
  element.addEventListener('mouseup', () => {
    element.style.transform = 'scale(1)';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
  });
});

// Theme Switching
const initTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
};

// Mouse tracking for project card hover effects
const handleMouseMove = (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
};

// Detect touch devices
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Smooth scrolling for anchor links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Back to top button functionality
const initBackToTop = () => {
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'backToTop';
    backToTopButton.innerHTML = '↑';
    document.body.appendChild(backToTopButton);

    const toggleBackToTopButton = () => {
        backToTopButton.style.opacity = window.scrollY > 300 ? '1' : '0';
        backToTopButton.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleBackToTopButton);
    toggleBackToTopButton();
};

// Project card animations and interactions
const initProjectCards = () => {
    document.querySelectorAll('.project-card').forEach(card => {
        const header = card.querySelector('.project-header');
        const details = card.querySelector('.project-details');
        const btn = card.querySelector('.toggle-btn');

        header.addEventListener('click', () => {
            const isExpanded = btn.classList.contains('active');
            
            // Close all other cards
            document.querySelectorAll('.project-card').forEach(otherCard => {
                if (otherCard !== card) {
                    const otherDetails = otherCard.querySelector('.project-details');
                    const otherBtn = otherCard.querySelector('.toggle-btn');
                    otherDetails.classList.remove('active');
                    otherBtn.classList.remove('active');
                }
            });

            // Toggle current card
            btn.classList.toggle('active');
            details.classList.toggle('active');
        });

        // Mouse move effect for desktop
        if (!('ontouchstart' in window)) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    });
};

// Tech stack marquee pause on hover
const initTechMarquee = () => {
    document.querySelectorAll('.tech-marquee').forEach(marquee => {
        marquee.addEventListener('mouseenter', () => {
            marquee.querySelector('.tech-items').style.animationPlayState = 'paused';
        });

        marquee.addEventListener('mouseleave', () => {
            marquee.querySelector('.tech-items').style.animationPlayState = 'running';
        });
    });
};

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Function to switch content sections
    const switchSection = (targetId) => {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
                // Reset and trigger animations for bio text if home section
                if (targetId === 'home') {
                    const bioTexts = document.querySelectorAll('.bio-text p');
                    bioTexts.forEach((text, index) => {
                        text.style.animation = 'none';
                        text.offsetHeight; // Trigger reflow
                        text.style.animation = `fadeIn 0.5s forwards ${index * 0.1}s`;
                    });
                }
            }
        });
    };

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Switch to target section
            const targetSection = link.dataset.section;
            switchSection(targetSection);
        });
    });

    // Project card interactions
    document.querySelectorAll('.project-card').forEach(card => {
        const header = card.querySelector('.project-header');
        const details = card.querySelector('.project-details');
        const btn = card.querySelector('.toggle-btn');

        header.addEventListener('click', () => {
            const isExpanded = btn.classList.contains('active');
            
            // Close all other cards
            document.querySelectorAll('.project-card').forEach(otherCard => {
                if (otherCard !== card) {
                    const otherDetails = otherCard.querySelector('.project-details');
                    const otherBtn = otherCard.querySelector('.toggle-btn');
                    otherDetails.classList.remove('active');
                    otherBtn.classList.remove('active');
                }
            });

            // Toggle current card
            btn.classList.toggle('active');
            details.classList.toggle('active');
        });

        // Mouse move effect for desktop
        if (!('ontouchstart' in window)) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    });

    // Theme switching
    const themeBtns = document.querySelectorAll('.theme-btn');
    const root = document.documentElement;

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    document.querySelector(`[data-theme="${savedTheme}"]`).classList.add('active');

    // Tech stack marquee pause on hover
    document.querySelectorAll('.tech-marquee').forEach(marquee => {
        marquee.addEventListener('mouseenter', () => {
            marquee.querySelector('.tech-items').style.animationPlayState = 'paused';
        });

        marquee.addEventListener('mouseleave', () => {
            marquee.querySelector('.tech-items').style.animationPlayState = 'running';
        });
    });

    // Mobile optimizations
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Project detail view handling
    const projectDetailContainer = document.querySelector('.project-detail-container');
    const projectDetails = document.querySelectorAll('.project-detail');
    const backButtons = document.querySelectorAll('.back-to-projects');
    const viewButtons = document.querySelectorAll('.view-project');

    // Show project detail
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectCard = button.closest('.project-card');
            const projectId = projectCard.dataset.project;
            const targetDetail = document.getElementById(`${projectId}-detail`);

            // Hide all project details and show the target one
            projectDetails.forEach(detail => detail.classList.remove('active'));
            targetDetail.classList.add('active');

            // Show the detail container
            projectDetailContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Back button functionality
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            projectDetailContainer.classList.remove('active');
            document.body.style.overflow = '';
            
            // After animation, hide all details
            setTimeout(() => {
                projectDetails.forEach(detail => detail.classList.remove('active'));
            }, 300);
        });
    });

    // Close detail view when clicking outside
    projectDetailContainer.addEventListener('click', (e) => {
        if (e.target === projectDetailContainer) {
            projectDetailContainer.classList.remove('active');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                projectDetails.forEach(detail => detail.classList.remove('active'));
            }, 300);
        }
    });

    // Handle escape key to close detail view
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectDetailContainer.classList.contains('active')) {
            projectDetailContainer.classList.remove('active');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                projectDetails.forEach(detail => detail.classList.remove('active'));
            }, 300);
        }
    });
});