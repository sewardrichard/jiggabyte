/**
 * Jiggabyte Technology Limited - Main Interactions
 * Handles navigation, mobile menu, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple animation for hamburger icon
        hamburger.classList.toggle('is-active');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // 2. Sticky Navbar Blur Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // 4. Contact Form Submission PreventDefault (for demo purposes)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Message Sent!';
            btn.style.backgroundColor = 'var(--accent)';

            setTimeout(() => {
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        });
    }

    // 5. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 6. Project Modal Functionality
    const projectModal = document.getElementById('project-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const projectButtons = document.querySelectorAll('.project-details-btn');
    const mfzContent = document.getElementById('mfz-chatbot-content');
    const auditflowContent = document.getElementById('auditflow-content');

    function openModal(projectType) {
        // Hide all content first
        mfzContent.style.display = 'none';
        auditflowContent.style.display = 'none';
        
        // Show appropriate content
        if (projectType === 'mfz-chatbot') {
            mfzContent.style.display = 'block';
        } else if (projectType === 'auditflow') {
            auditflowContent.style.display = 'block';
        }
        
        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Re-initialize icons in modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function closeModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Attach click handlers to project detail buttons
    projectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectCard = btn.closest('.project-card');
            console.log('Project card found:', projectCard);
            console.log('Dataset:', projectCard ? projectCard.dataset : 'N/A');
            const projectType = projectCard ? projectCard.dataset.project : null;
            console.log('Project type:', projectType);
            if (projectType) {
                openModal(projectType);
            }
        });
    });

    // Close modal on overlay click
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });
});