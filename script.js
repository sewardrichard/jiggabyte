/**
 * Jiggabyte Technology Limited — Main Interactions
 * Handles navigation, mobile menu, scroll animations, cursor glow, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Mobile Menu Toggle ─────────────────────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    const navItems  = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('is-active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('is-active');
        });
    });

    // ─── 2. Sticky Navbar & Scroll Progress ──────────────────────────────
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        
        // Scroll Progress logic
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ─── 3. Scroll Reveal — Stagger Animation ────────────────────────────
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const appearObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            // If the element has a stagger class, honour its CSS custom property.
            // The CSS already sets --stagger-delay on those classes, so the
            // transition-delay is applied automatically once 'is-visible' is added.
            el.classList.add('is-visible');
            observer.unobserve(el);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => appearObserver.observe(el));

    // ─── 4. Cursor Glow & Interactions ───────────────────────────────────
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) cursorGlow.classList.add('pulsing'); // Default pulse
    
    let glowVisible = false;

    const isOverDarkSection = el => {
        const section = el.closest('.dark-section');
        return !!section;
    };

    document.addEventListener('mousemove', e => {
        if (!cursorGlow) return;
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top  = e.clientY + 'px';

        const target = document.elementFromPoint(e.clientX, e.clientY);
        const isActiveHover = target && target.closest('a, button, .btn, .card, .glass-card, input, textarea');
        
        if (isActiveHover) {
            cursorGlow.classList.add('active', 'visible');
            glowVisible = true;
        } else {
            cursorGlow.classList.remove('active');
            if (target && isOverDarkSection(target)) {
                if (!glowVisible) {
                    cursorGlow.classList.add('visible');
                    glowVisible = true;
                }
            } else {
                if (glowVisible) {
                    cursorGlow.classList.remove('visible');
                    glowVisible = false;
                }
            }
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.classList.remove('visible', 'active');
            glowVisible = false;
        }
    });

    // ─── 4b. Magnetic Buttons ────────────────────────────────────────────
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-large');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // ─── 4c. 3D Card Parallax Tilt ───────────────────────────────────────
    const tiltCards = document.querySelectorAll('.card, .glass-card, .project-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; // Lets CSS transition take over
        });
    });

    // ─── 5. Initialize Lucide Icons ──────────────────────────────────────
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            attrs: {
                'stroke-width': 1.25
            }
        });
    }

    // ─── 6. Contact Form Submission ──────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            const formData = new FormData(contactForm);

            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('contact-handler.php', {
                    method: 'POST',
                    body: formData
                });

                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    console.error('Invalid JSON response from server:', text);
                    throw new Error('Invalid JSON response');
                }

                if (result.success) {
                    const formContainer = contactForm.parentElement;
                    formContainer.innerHTML = `
                        <div style="text-align:center; padding: 4rem 1.5rem; animation: modalSlideIn 0.5s ease;">
                            <div style="width: 68px; height: 68px; background: rgba(34,197,94,0.1); color: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; border: 1px solid rgba(34,197,94,0.25);">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </div>
                            <h3 style="color: #fff; margin-bottom: 0.75rem; font-size: 1.6rem;">Message Sent Successfully</h3>
                            <p style="color: rgba(255,255,255,0.7); line-height: 1.6; font-size: 1.05rem;">
                                Thank you for reaching out to Jiggabyte.<br>Our team has received your enquiry and will get back to you shortly.
                            </p>
                        </div>
                    `;
                } else {
                    btn.textContent = '✗ Error — Try Again';
                    btn.style.backgroundColor = '#dc2626';

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 3500);

                    console.error('Form error:', result.message);
                }
            } catch (error) {
                btn.textContent = '✗ Error — Try Again';
                btn.style.backgroundColor = '#dc2626';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3500);

                console.error('Network error:', error);
            }
        });
    }

    // ─── 7. Stats Counter Animation ──────────────────────────────────────
    const statsNumbers = document.querySelectorAll('.stats-strip-number');
    if (statsNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    
                    if (!isNaN(target)) {
                        let current = 0;
                        const duration = 1500; // ms
                        const stepTime = Math.abs(Math.floor(duration / target));
                        const stepMs = Math.max(stepTime, 20); // Not too fast
                        const increment = target / (duration / stepMs);
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                el.textContent = target + suffix;
                                clearInterval(timer);
                            } else {
                                el.textContent = Math.ceil(current) + suffix;
                            }
                        }, stepMs);
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        statsNumbers.forEach(num => statsObserver.observe(num));
    }

});