/* ============================================
   SCROLL GROWING FLOWER - GSAP Controller
   Scroll-driven scale animation for the lily
   ============================================ */

(function () {
    'use strict';

    // The flower image path - resolve relative to the HTML page location
    // Works from both root (index.html) and /pages/ subpages
    const isSubpage = window.location.pathname.includes('/pages/');
    const FLOWER_SRC = (isSubpage ? '../' : '') + 'Assets/Flower assets/Full transparent.png';

    // Responsive config
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const CONFIG = {
        startScale: isMobile ? 0.06 : 0.08,
        endScale: isMobile ? 0.35 : 0.45,
        startOpacity: isMobile ? 0.4 : 0.5,
        endOpacity: 0.95
    };

    function createFlowerDOM() {
        // Outer wrapper - GSAP controls this (scale + opacity)
        const outer = document.createElement('div');
        outer.className = 'scroll-flower';
        outer.setAttribute('aria-hidden', 'true');
        outer.setAttribute('role', 'presentation');
        outer.id = 'scrollGrowingFlower';

        // Inner wrapper - CSS keyframes control this (float + rotate)
        const inner = document.createElement('div');
        inner.className = 'scroll-flower__float';

        // Image
        const img = document.createElement('img');
        img.className = 'scroll-flower__img';
        img.src = FLOWER_SRC;
        img.alt = '';
        img.draggable = false;
        img.loading = 'lazy';

        inner.appendChild(img);
        outer.appendChild(inner);
        document.body.appendChild(outer);

        return outer;
    }

    function initScrollFlower() {
        // Guard: require GSAP + ScrollTrigger
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('[ScrollFlower] GSAP not loaded - flower disabled.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        const el = createFlowerDOM();

        // Set initial state
        gsap.set(el, {
            scale: CONFIG.startScale,
            opacity: CONFIG.startOpacity,
            transformOrigin: 'bottom left'
        });

        // Scroll-driven growth animation
        gsap.to(el, {
            scale: CONFIG.endScale,
            opacity: CONFIG.endOpacity,
            ease: 'none',
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        // Listen for resize to update mobile/desktop config
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const nowMobile = window.matchMedia('(max-width: 767px)').matches;
                const newEndScale = nowMobile ? 0.35 : 0.45;
                // Update the ScrollTrigger animation endpoint
                gsap.to(el, { scale: newEndScale, duration: 0, overwrite: 'auto' });
                ScrollTrigger.refresh();
            }, 250);
        }, { passive: true });

        // Recalculate after all images load
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });

        // Reduced motion: disable CSS float via inline override
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const floatEl = el.querySelector('.scroll-flower__float');
            if (floatEl) {
                floatEl.style.animation = 'none';
            }
            gsap.set(el, { opacity: 0.35 });
        }
    }

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollFlower);
    } else {
        // Slight delay to ensure GSAP is parsed
        setTimeout(initScrollFlower, 60);
    }
})();
