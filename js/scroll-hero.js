/* ============================================
   HEAVENLY ANGELS BSO — Scroll Hero Frame Animation
   ============================================
   Renders 126 frames inside .hero-image-wrapper
   (the same frame where the intro video used to play).
   
   Scrubs the drawing frames with regular page scroll.
   ============================================ */

(function () {
  'use strict';

  /* ---- Configuration ---- */
  var TOTAL_FRAMES = 126;
  var BATCH_SIZE   = 8;
  var FRAME_W      = 1280;
  var FRAME_H      = 720;
  var FRAME_DIR    = './Scrollmotion/';
  var FRAME_PREFIX = 'ezgif-frame-';
  var FRAME_EXT    = '.jpg';

  /* ---- Helpers ---- */
  function pad(n, len) {
    var s = '' + n;
    while (s.length < len) s = '0' + s;
    return s;
  }

  function framePath(index) {
    return FRAME_DIR + FRAME_PREFIX + pad(index + 1, 3) + FRAME_EXT;
  }

  /* ---- State ---- */
  var frames = new Array(TOTAL_FRAMES);
  var currentFrame = 0;
  var drawnFrame = -1;
  var animationStarted = false;
  var backgroundIndex = BATCH_SIZE;
  var loadingFrames = {};
  var canvas, ctx;

  function scheduleNonCriticalLoad(callback, delay) {
    window.setTimeout(callback, delay || 1200);
  }

  /* ---- Init ---- */
  function init() {
    canvas = document.getElementById('hero-frame-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    canvas.width  = FRAME_W;
    canvas.height = FRAME_H;

    // Lavender placeholder while loading
    ctx.fillStyle = '#f8f0fc';
    ctx.fillRect(0, 0, FRAME_W, FRAME_H);

    loadAllFrames();
  }

  /* ---- Batched Frame Loading ---- */
  function loadFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) {
      return Promise.resolve();
    }
    if (frames[index]) {
      return Promise.resolve(frames[index]);
    }
    if (loadingFrames[index]) {
      return loadingFrames[index];
    }

    loadingFrames[index] = new Promise(function (resolve) {
      var img = new Image();
      img.decoding = 'async';
      img.fetchPriority = index < BATCH_SIZE ? 'high' : 'low';
      img.onload = function () {
        frames[index] = img;
        delete loadingFrames[index];
        resolve(img);
      };
      img.onerror = function () {
        frames[index] = null;
        delete loadingFrames[index];
        resolve(null);
      };
      img.src = framePath(index);
    });

    return loadingFrames[index];
  }

  function loadBatch(startIndex) {
    var batch = [];
    var end = Math.min(startIndex + BATCH_SIZE, TOTAL_FRAMES);
    for (var j = startIndex; j < end; j++) {
      batch.push(loadFrame(j));
    }
    return Promise.all(batch).then(function () {
      return end;
    });
  }

  function loadFrameWindow(index) {
    for (var i = index; i <= index + 3; i++) {
      loadFrame(i);
    }
  }

  function loadBackgroundFrames() {
    if (backgroundIndex >= TOTAL_FRAMES) return;
    loadBatch(backgroundIndex).then(function (end) {
      backgroundIndex = end;
      scheduleNonCriticalLoad(loadBackgroundFrames, 1400);
    });
  }

  function loadInitialFrames() {
    loadBatch(0).then(function (totalLoaded) {
      if (totalLoaded >= 1 && frames[0]) {
        ctx.drawImage(frames[0], 0, 0, FRAME_W, FRAME_H);
        drawnFrame = 0;
      }
      startAnimation();
      scheduleNonCriticalLoad(loadBackgroundFrames, 1800);
    });
  }

  function loadAllFrames() {
    loadInitialFrames();
  }

  /* ---- Start once the first frames are ready ---- */
  function startAnimation() {
    if (animationStarted) return;
    animationStarted = true;
    requestAnimationFrame(tick);
    setupScrollTrigger();
  }

  /* ---- Render Loop ---- */
  function tick() {
    if (currentFrame !== drawnFrame && frames[currentFrame]) {
      ctx.drawImage(frames[currentFrame], 0, 0, FRAME_W, FRAME_H);
      drawnFrame = currentFrame;
    }
    requestAnimationFrame(tick);
  }

  /* ---- GSAP ScrollTrigger ---- */
  function setupScrollTrigger() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        pin: false,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var idx = Math.min(
            Math.floor(self.progress * TOTAL_FRAMES),
            TOTAL_FRAMES - 1
          );
          currentFrame = Math.max(0, idx);
          loadFrameWindow(currentFrame);
        }
      });

    } else {
      // Fallback: vanilla scroll (graceful degradation)
      window.addEventListener('scroll', function () {
        var rect = hero.getBoundingClientRect();
        var total = Math.max(rect.height * 1.35, window.innerHeight * 1.45);
        if (total <= 0) return;
        var progress = Math.max(0, Math.min(1, -rect.top / total));
        currentFrame = Math.max(0,
          Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1)
        );
        loadFrameWindow(currentFrame);
      }, { passive: true });
    }
  }

  /* ---- Bootstrap ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
