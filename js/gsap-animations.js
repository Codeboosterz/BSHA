/* ============================================
   HEAVENLY ANGELS BSO - GSAP Scroll Animations
   Premium, soft, childcare-appropriate motion
   ============================================ */

(function() {
    // Wait for everything to be ready
    function initAnimations() {
        // Guard: only run if GSAP loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // ---- Global defaults ----
        gsap.defaults({
            ease: 'power2.out',
            duration: 0.8
        });

        // Disable CSS fade-in class so GSAP takes over
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.remove('fade-in');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });

        // =============================================
        // SAFETY NET - Ensure nothing stays invisible
        // If any GSAP animation gets stuck, this reveals all content after 3 seconds
        // =============================================
        setTimeout(() => {
            const criticalSelectors = [
                '.hero-content h1', '.hero-subtitle', '.hero-buttons .btn', '.hero-image-wrapper',
                '.nav-cta', '.logo', '.quick-info-card', '.welkom-image', '.welkom-content',
                '.value-card', '.icon-item', '.gallery-item', '.cta-section h2', '.cta-section p',
                '.cta-section .btn', '.footer-grid > div', '.footer-bottom',
                '.page-hero h1', '.page-hero p', '.founder-image', '.founder-content h2',
                '.founder-content p', '.founder-content blockquote', '.offer-grid .card',
                '.practical-grid .card', '.contact-form-wrap', '.contact-sidebar',
                '.nav-desktop ul li', '.welkom-link'
            ];
            criticalSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    const cs = getComputedStyle(el);
                    if (parseFloat(cs.opacity) < 0.5) {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                        el.style.visibility = 'visible';
                    }
                });
            });
        }, 3000);

        // =============================================
        // 0. HEADER LOGO TEXT - Slide from behind logo on scroll
        // =============================================
        const headerLogoText = document.querySelector('.header .logo .logo-text');
        if (headerLogoText) {
            gsap.fromTo(headerLogoText,
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: document.documentElement,
                        start: 'top top',
                        end: '200px top',
                        scrub: 0.6,
                        invalidateOnRefresh: true
                    }
                }
            );
        }

        // =============================================
        // 1. HERO - Entrance Animation (on load, no scroll)
        // =============================================
        const heroContent = document.querySelector('.hero-content h1');
        if (heroContent) {
            const heroTL = gsap.timeline({ delay: 0.3 });

            heroTL
                .fromTo('.hero-content h1',
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
                )
                .fromTo('.hero-subtitle',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7 },
                    '-=0.5'
                )
                .fromTo('.hero-buttons .btn',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 },
                    '-=0.4'
                )
                .fromTo('.hero-image-wrapper',
                    { x: 60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                    '-=0.8'
                )
                .fromTo('.hero-decoration',
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'elastic.out(1, 0.5)' },
                    '-=0.6'
                );
        }

        // =============================================
        // 2. QUICK INFO CARDS - Staggered slide-up
        // =============================================
        const quickInfoCards = document.querySelectorAll('.quick-info-card');
        if (quickInfoCards.length) {
            gsap.fromTo(quickInfoCards,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.quick-info',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 3. WELKOM SECTION - Image from left, text from right
        // =============================================
        const welkomImage = document.querySelector('.welkom-image');
        const welkomContent = document.querySelector('.welkom-content');

        if (welkomImage && welkomContent) {
            const welkomTL = gsap.timeline({
                scrollTrigger: {
                    trigger: '.welkom',
                    start: 'top 78%',
                    toggleActions: 'play none none none'
                }
            });

            welkomTL
                .fromTo(welkomImage,
                    { x: -60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                )
                .fromTo(welkomContent,
                    { x: 60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                );

            const welkomLink = document.querySelector('.welkom-link');
            if (welkomLink) {
                welkomTL.fromTo(welkomLink, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.3');
            }
        }

        // =============================================
        // 4. VALUES SECTION - Header + cards stagger
        // =============================================
        const valuesHeader = document.querySelector('#values .section-header');
        if (valuesHeader) {
            gsap.fromTo(valuesHeader,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    scrollTrigger: {
                        trigger: '#values',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        const valueCards = document.querySelectorAll('.value-card');
        if (valueCards.length) {
            gsap.fromTo(valueCards,
                { y: 50, opacity: 0, scale: 0.92 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: '.values-grid',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 5. ICON STRIP - Bounce in
        // =============================================
        const iconItems = document.querySelectorAll('.icon-item');
        if (iconItems.length) {
            gsap.fromTo(iconItems,
                { y: 30, opacity: 0, scale: 0.8 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: '.icon-strip',
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 6. GALLERY - Staggered reveal
        // =============================================
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length) {
            gsap.fromTo(galleryItems,
                { y: 40, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: {
                        amount: 0.6,
                        from: 'start'
                    },
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.gallery-grid',
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            const galleryHeader = document.querySelector('.gallery .section-header');
            if (galleryHeader) {
                gsap.fromTo(galleryHeader,
                    { y: 25, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        scrollTrigger: {
                            trigger: '.gallery',
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        }

        // =============================================
        // 7. CTA SECTION
        // =============================================
        const ctaH2 = document.querySelector('.cta-section h2');
        if (ctaH2) {
            const ctaTL = gsap.timeline({
                scrollTrigger: {
                    trigger: '.cta-section',
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            });

            ctaTL
                .fromTo('.cta-section h2',
                    { y: 30, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
                )
                .fromTo('.cta-section p',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5 },
                    '-=0.4'
                )
                .fromTo('.cta-section .btn',
                    { y: 15, opacity: 0, scale: 0.9 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
                    '-=0.3'
                );
        }

        // =============================================
        // 8. FOOTER
        // =============================================
        const footerCols = document.querySelectorAll('.footer-grid > div');
        if (footerCols.length) {
            gsap.fromTo(footerCols,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.footer',
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            gsap.fromTo(footerBottom,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.footer-bottom',
                        start: 'top 95%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 9. PAGE HERO - For subpages
        // =============================================
        const pageHeroH1 = document.querySelector('.page-hero h1');
        if (pageHeroH1) {
            gsap.fromTo(pageHeroH1,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: 'power3.out' }
            );

            const pageHeroP = document.querySelector('.page-hero p');
            if (pageHeroP) {
                gsap.fromTo(pageHeroP,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, delay: 0.35 }
                );
            }
        }

        // =============================================
        // 10. FOUNDER SECTION
        // =============================================
        const founderInner = document.querySelector('.founder-inner');
        if (founderInner) {
            const founderTL = gsap.timeline({
                scrollTrigger: {
                    trigger: '.founder-inner',
                    start: 'top 78%',
                    toggleActions: 'play none none none'
                }
            });

            founderTL
                .fromTo('.founder-image',
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                )
                .fromTo('.founder-content h2',
                    { x: 40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6 },
                    '-=0.5'
                )
                .fromTo('.founder-content p',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
                    '-=0.3'
                );

            const blockquote = document.querySelector('.founder-content blockquote');
            if (blockquote) {
                founderTL.fromTo(blockquote, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');
            }
        }

        // =============================================
        // 11. OFFER CARDS
        // =============================================
        const offerCards = document.querySelectorAll('.offer-grid .card');
        if (offerCards.length) {
            gsap.fromTo(offerCards,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.offer-grid',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 12. PRACTICAL CARDS
        // =============================================
        const practicalCards = document.querySelectorAll('.practical-grid .card');
        if (practicalCards.length) {
            gsap.fromTo(practicalCards,
                { y: 35, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: '.practical-grid',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 13. CONTACT FORM
        // =============================================
        const contactFormWrap = document.querySelector('.contact-form-wrap');
        if (contactFormWrap) {
            gsap.fromTo(contactFormWrap,
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-inner',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        const contactSidebar = document.querySelector('.contact-sidebar');
        if (contactSidebar) {
            gsap.fromTo(contactSidebar,
                { x: 40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-inner',
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        // =============================================
        // 14. REGISTRATION FORM CARD
        // =============================================
        const regForm = document.querySelector('#registrationForm');
        if (regForm) {
            const regCard = regForm.closest('.card');
            if (regCard) {
                gsap.fromTo(regCard,
                    { y: 40, opacity: 0, scale: 0.97 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: regCard,
                            start: 'top 88%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        }

        // =============================================
        // 15. PARALLAX - Subtle depth on hero decorations
        // =============================================
        const heroDeco1 = document.querySelector('.hero-decoration-1');
        if (heroDeco1) {
            gsap.to(heroDeco1, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -80,
                ease: 'none'
            });
        }

        const heroDeco2 = document.querySelector('.hero-decoration-2');
        if (heroDeco2) {
            gsap.to(heroDeco2, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -40,
                ease: 'none'
            });
        }

        // =============================================
        // 16. IMAGE PARALLAX
        // =============================================
        document.querySelectorAll('.welkom-image img, .founder-image img').forEach(img => {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -30,
                ease: 'none'
            });
        });

        // =============================================
        // 17. HEADER - Logo entrance
        // =============================================
        const logo = document.querySelector('.logo');
        if (logo) {
            gsap.fromTo(logo,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' }
            );
        }

        const navItems = document.querySelectorAll('.nav-desktop ul li');
        if (navItems.length) {
            gsap.fromTo(navItems,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.3, ease: 'power2.out' }
            );
        }

        const navCta = document.querySelector('.nav-cta');
        if (navCta) {
            gsap.fromTo(navCta,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, delay: 0.5, ease: 'back.out(1.5)' }
            );
        }

        // =============================================
        // REFRESH - Recalculate after images load
        // =============================================
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        // DOM already loaded, run after a tiny delay to ensure GSAP is parsed
        setTimeout(initAnimations, 50);
    }
})();
