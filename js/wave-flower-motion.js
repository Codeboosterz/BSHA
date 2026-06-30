/* ============================================
   HEAVENLY ANGELS BSO — Wave Divider Animations
   GSAP scroll-linked horizontal drift for waves
   + Flowerpack parallax micro-motion
   ============================================ */

(function () {
  'use strict';

  function initWaveAndFlowerMotion() {
    // Guard: only run if GSAP + ScrollTrigger loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Wave dividers use continuous CSS motion. Keep GSAP off the SVG
    // transforms so the slow drift remains stable and edge-safe.

    // =============================================
    // FLOWERPACK — Subtle parallax on scroll
    // Each flower gets a gentle y-shift as user scrolls
    // =============================================
    const flowerDecos = document.querySelectorAll('.flower-deco');
    flowerDecos.forEach((flower, index) => {
      const yDistance = 15 + (index * 5);         // 15–45px range
      const rotateAmount = (index % 2 === 0) ? 3 : -3;

      gsap.to(flower, {
        y: -yDistance,
        rotation: `+=${rotateAmount}`,
        ease: 'none',
        scrollTrigger: {
          trigger: flower.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });
    });

    // Recalculate after images load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaveAndFlowerMotion);
  } else {
    setTimeout(initWaveAndFlowerMotion, 80);
  }
})();
