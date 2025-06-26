// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const resumeDownload = document.getElementById('resume-download');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('.section');

// 3D and Animation Variables
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add theme transition effect
    document.body.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.320, 1)';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Add 3D effect to menu toggle
    if (mobileMenuToggle.classList.contains('active')) {
        mobileMenuToggle.style.transform = 'rotateY(180deg)';
    } else {
        mobileMenuToggle.style.transform = 'rotateY(0deg)';
    }
}

// Enhanced Mouse Tracking for 3D Effects
function initMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        isMouseMoving = true;
        
        // Apply subtle 3D tilt to cards based on mouse position
        applyMouseTilt();
        
        // Clear mouse moving flag after a delay
        clearTimeout(window.mouseMoveTimeout);
        window.mouseMoveTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });
}

function applyMouseTilt() {
    const tiltElements = document.querySelectorAll('.tilt-element, .card-3d');
    
    tiltElements.forEach(element => {
        if (isElementInViewport(element)) {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX * window.innerWidth - elementCenterX) / rect.width;
            const deltaY = (mouseY * window.innerHeight - elementCenterY) / rect.height;
            
            const tiltX = deltaY * 5; // Reduced intensity for subtlety
            const tiltY = deltaX * 5;
            
            element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        }
    });
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth Scrolling and Active Navigation
function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced Navbar Background on Scroll
function handleNavbarScroll() {
    const scrolled = window.scrollY > 100;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (scrolled) {
        navbar.style.background = isDark 
            ? 'rgba(45, 55, 72, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = isDark 
            ? 'rgba(45, 55, 72, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
    }
}

// Enhanced Scroll Animations with 3D Effects
function handleScrollAnimations() {
    sections.forEach((section, index) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            section.classList.add('visible');
            
            // Add staggered animation delay for child elements
            const animatedElements = section.querySelectorAll('.card-3d, .timeline-item, .achievement-card, .skill-category');
            animatedElements.forEach((element, elementIndex) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) translateZ(0)';
                }, elementIndex * 100);
            });
        }
    });
}

// Parallax Effect for Hero Section
function handleParallaxEffect() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        const parallaxSpeed = 0.5;
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
}

// Enhanced Form Validation
function validateForm(formData) {
    const errors = {};
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
}

function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // Display new errors with animation
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                errorElement.style.transition = 'all 0.3s ease';
                errorElement.style.opacity = '1';
                errorElement.style.transform = 'translateY(0)';
            }, 50);
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }
    
    // Clear errors
    displayFormErrors({});
    
    // Enhanced form submission animation
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.transform = 'scale(0.95)';
    
    // Add loading animation
    submitButton.style.background = 'linear-gradient(45deg, #4063B5, #E6791B, #4063B5)';
    submitButton.style.backgroundSize = '200% 200%';
    submitButton.style.animation = 'gradientShift 1.5s ease infinite';
    
    setTimeout(() => {
        submitButton.textContent = 'Message Sent! ✨';
        submitButton.style.background = 'linear-gradient(135deg, #38A169, #68D391)';
        submitButton.style.animation = 'none';
        submitButton.style.transform = 'scale(1)';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
            contactForm.reset();
            
            // Add success particle effect
            createSuccessParticles(submitButton);
        }, 2000);
    }, 1500);
}

// Success Particle Effect
function createSuccessParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = 12;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = '#38A169';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (i / particles) * Math.PI * 2;
        const velocity = 100 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            document.body.removeChild(particle);
        };
    }
}

// Enhanced Resume Download with Animation
function handleResumeDownload(e) {
    e.preventDefault();
    
    const originalText = resumeDownload.textContent;
    resumeDownload.textContent = 'Downloading...';
    resumeDownload.style.transform = 'scale(0.95)';
    
    // Add download progress animation
    resumeDownload.style.background = 'linear-gradient(90deg, #4063B5 0%, #E6791B 50%, #4063B5 100%)';
    resumeDownload.style.backgroundSize = '200% 100%';
    resumeDownload.style.animation = 'downloadProgress 1s ease-in-out';
    
    setTimeout(() => {
        resumeDownload.textContent = 'Downloaded! 📄';
        resumeDownload.style.background = 'linear-gradient(135deg, #38A169, #68D391)';
        resumeDownload.style.animation = 'none';
        resumeDownload.style.transform = 'scale(1)';
        
        setTimeout(() => {
            resumeDownload.textContent = originalText;
            resumeDownload.style.background = '';
        }, 2000);
    }, 1000);
    
    console.log('Resume download initiated');
}

// Navigation Link Click Handler with 3D Effect
function handleNavLinkClick(e) {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        
        // Add click animation to nav link
        e.target.style.transform = 'scale(0.95) translateZ(5px)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.style.transform = 'rotateY(0deg)';
    }
}

// Enhanced Project Link Handlers
function handleProjectLinks() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const originalText = link.textContent;
            link.textContent = 'Opening...';
            link.style.transform = 'scale(0.95)';
            
            // Add opening animation
            link.style.background = 'linear-gradient(45deg, #4063B5, #E6791B)';
            link.style.backgroundSize = '200% 200%';
            link.style.animation = 'gradientShift 1s ease infinite';
            
            setTimeout(() => {
                link.textContent = 'Opened! 🚀';
                link.style.background = 'linear-gradient(135deg, #38A169, #68D391)';
                link.style.animation = 'none';
                link.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    link.textContent = originalText;
                    link.style.background = '';
                }, 2000);
            }, 1000);
            
            console.log('Project link clicked:', originalText);
        });
    });
}

// Enhanced Intersection Observer
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add 3D reveal animation
                entry.target.style.transform = 'translateY(0) translateZ(0) rotateX(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
        
        // Initialize 3D transform
        section.style.transform = 'translateY(50px) translateZ(-20px) rotateX(10deg)';
        section.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.320, 1)';
    });
}

// Floating Shapes Animation
function createFloatingShapes() {
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    document.body.appendChild(shapesContainer);
    
    for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shapesContainer.appendChild(shape);
    }
}

// Keyboard Navigation Enhancement
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Enter key on theme toggle
        if (e.key === 'Enter' && document.activeElement === themeToggle) {
            toggleTheme();
        }
        
        // Arrow keys for section navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            navigateSections(e.key === 'ArrowDown' ? 1 : -1);
        }
    });
}

function navigateSections(direction) {
    const currentSection = getCurrentSection();
    const sectionIds = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'achievements', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    const nextIndex = Math.max(0, Math.min(sectionIds.length - 1, currentIndex + direction));
    
    if (nextIndex !== currentIndex) {
        const targetSection = document.getElementById(sectionIds[nextIndex]);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function getCurrentSection() {
    let current = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    return current;
}

// Scroll to Top Function with Animation
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Add scroll animation feedback
    const navbar = document.querySelector('.navbar');
    navbar.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        navbar.style.transform = '';
    }, 300);
}

// Logo Scroll to Top Setup
function setupLogoScrollToTop() {
    const navLogo = document.querySelector('.nav-logo a');
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTop();
    });
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes downloadProgress {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        .nav-link {
            transform-style: preserve-3d;
            transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }
        
        .card-3d {
            transform-style: preserve-3d;
            transition: transform 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }
        
        .tilt-element {
            transform-style: preserve-3d;
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Performance Optimization
function optimizePerformance() {
    // Throttle scroll events
    let scrollTimeout;
    const originalScrollHandler = () => {
        updateActiveNavLink();
        handleNavbarScroll();
        handleScrollAnimations();
        handleParallaxEffect();
    };
    
    const throttledScrollHandler = () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                originalScrollHandler();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    };
    
    return throttledScrollHandler;
}

// Initialize Application
function init() {
    // Initialize theme
    initTheme();
    
    // Add dynamic styles
    addDynamicStyles();
    
    // Create floating shapes
    createFloatingShapes();
    
    // Setup intersection observer for animations
    setupIntersectionObserver();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Setup logo scroll to top
    setupLogoScrollToTop();
    
    // Setup project links
    handleProjectLinks();
    
    // Initialize mouse tracking for 3D effects
    initMouseTracking();
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    contactForm.addEventListener('submit', handleFormSubmit);
    resumeDownload.addEventListener('click', handleResumeDownload);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Optimized scroll events
    const throttledScrollHandler = optimizePerformance();
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Resize events
    window.addEventListener('resize', () => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.style.transform = 'rotateY(0deg)';
        }
        
        // Reset 3D transforms on resize
        document.querySelectorAll('.tilt-element, .card-3d').forEach(element => {
            element.style.transform = '';
        });
    });
    
    // Initial calls
    updateActiveNavLink();
    handleNavbarScroll();
    handleScrollAnimations();
    
    // Add loading complete animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.320, 1)';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 800);
    }, 100);
    
    console.log('Enhanced 3D Portfolio website initialized successfully! 🚀');
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for potential testing
window.portfolioApp = {
    toggleTheme,
    toggleMobileMenu,
    scrollToTop,
    validateForm,
    createSuccessParticles,
    applyMouseTilt
};
