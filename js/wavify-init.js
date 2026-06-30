/* ============================================
   HEAVENLY ANGELS BSO — Animated Wave Dividers
   Single smooth sinus wave with continuous gentle
   horizontal animation. Each wave = one layer, one fill.
   ============================================ */
(function () {
  'use strict';

  // Color map: modifier class → fill color (matches next section bg)
  var colorMap = {
    'ha-wave-border--to-white':       '#ffffff',
    'ha-wave-border--to-warm-white':  '#fffdf9',
    'ha-wave-border--to-lavender':    '#f7f1fb',
    'ha-wave-border--to-soft-purple': '#f3e8fa',
    'ha-wave-border--to-cream':       '#fbf7fd',
    'ha-wave-border--to-purple':      '#6e3a8a'
  };

  /**
   * Build a gentle sinus-style wave SVG path.
   * The path spans 200% of the visible width for seamless CSS translateX looping.
   *
   * @param {number} vw   - visible viewport width of the SVG viewBox
   * @param {number} vh   - viewBox height
   * @param {boolean} flip - flip the wave phase for visual variety
   * @returns {string} SVG path 'd' attribute value
   */
  function buildWavePath(vw, vh, flip) {
    // The SVG viewBox is 2× the visible width so we can loop with CSS translateX(-50%)
    var totalW = vw * 2;

    // How many full sine-wave cycles across the *visible* width
    // 16 cycles = 32 half-cycles (16 crests up + 16 troughs down)
    var cycles = 16;
    // Total segments = one per half-cycle across the full 2× width
    var totalHalfCycles = cycles * 2 * 2; // 2 cycles × 2 half-cycles × 2 (for 2× width)
    var segW = totalW / totalHalfCycles;

    // Vertical centre line & amplitude
    var midY = vh * 0.55;
    var amp  = vh * 0.4;

    // Start at the left edge, mid-height
    var startY = flip ? (midY + amp * 0.3) : (midY - amp * 0.3);
    var d = 'M0,' + startY;

    for (var i = 0; i < totalHalfCycles; i++) {
      var cpX = segW * i + segW * 0.5; // control point X (midpoint of segment)
      var endX = segW * (i + 1);       // end X

      // Alternating crest / trough
      var goUp = (i % 2 === 0);
      if (flip) goUp = !goUp;

      var cpY = goUp ? (midY - amp) : (midY + amp);

      d += ' Q' + cpX.toFixed(1) + ',' + cpY.toFixed(1) +
           ' ' + endX.toFixed(1) + ',' + midY.toFixed(1);
    }

    // Close the shape at the bottom of the viewBox
    d += ' L' + totalW + ',' + vh;
    d += ' L0,' + vh + ' Z';
    return d;
  }

  /**
   * Vary the animation duration per divider so waves don't all move in sync.
   */
  function getDuration(idx) {
    var pool = [28, 32, 36, 30, 34, 26];
    return pool[idx % pool.length];
  }

  /**
   * Main initialisation: find every .ha-wave-border, inject an animated SVG wave.
   */
  function initWaves() {
    var borders = document.querySelectorAll('.ha-wave-border');
    if (!borders.length) return;

    borders.forEach(function (el, idx) {
      /* --- resolve fill colour --- */
      var cls  = el.className || '';
      var fill = '#ffffff';
      for (var mod in colorMap) {
        if (cls.indexOf(mod) > -1) { fill = colorMap[mod]; break; }
      }

      /* --- clean up any previous render --- */
      el.querySelectorAll('.ha-wave-layer').forEach(function (n) { n.remove(); });
      el.querySelectorAll('svg').forEach(function (n) { n.remove(); });

      /* --- determine direction from BEM modifier --- */
      var goLeft = cls.indexOf('ha-wave-border--left') > -1;

      /* --- create SVG --- */
      var NS  = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      var VW  = 1440;
      var VH  = 120;

      svg.setAttribute('viewBox', '0 0 ' + (VW * 2) + ' ' + VH);
      svg.setAttribute('preserveAspectRatio', 'none');

      // Inline styles: 200% wide so half is always in view; CSS keyframe slides it
      var dur = getDuration(idx);
      var dir = goLeft ? 'normal' : 'reverse';
      svg.style.cssText =
        'position:absolute;left:0;bottom:0;' +
        'width:200%;height:100%;display:block;' +
        'animation:haWaveSlide ' + dur + 's linear infinite ' + dir + ';';

      /* --- create path --- */
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', buildWavePath(VW, VH, goLeft));
      path.setAttribute('fill', fill);
      svg.appendChild(path);

      el.appendChild(svg);

      /* --- scroll-activated entrance --- */
      // Only use GSAP if it's available; otherwise wave is just visible
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Make wave visible immediately for first border (hero wave)
        if (idx === 0) {
          gsap.set(el, { opacity: 1, y: 0 });
        } else {
          gsap.set(el, { opacity: 0, y: 12 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 98%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      }
      // If GSAP is not loaded, waves are just visible by default (no opacity change)
    });
  }

  /**
   * Inject CSS @keyframes for the horizontal slide.
   */
  function injectKeyframes() {
    if (document.getElementById('ha-wave-keyframes')) return;
    var s = document.createElement('style');
    s.id = 'ha-wave-keyframes';
    s.textContent =
      '@keyframes haWaveSlide{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
    document.head.appendChild(s);
  }

  /* --- boot --- */
  function boot() {
    injectKeyframes();
    // Small delay so layout is settled
    setTimeout(initWaves, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
