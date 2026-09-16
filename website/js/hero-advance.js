/**
 * National Plasto — hero-advance.js
 * Cinematic 200-Frame Gateway of India Canvas Scroll Controller
 * Concept: "MEET INDIA. MEET ELEGANCE."
 * Features:
 *  - 200 High-Res Preloaded Frames from images/hero-render/
 *  - Butter-Smooth 60fps RequestAnimationFrame Lerp Interpolation
 *  - 4 Distinct Editorial Story Scenes (0-25%, 25-50%, 50-75%, 75-100%)
 *  - Digital Luxury Magazine Interactive Stepper
 *  - Transparent High-Legibility Header Integration
 *  - Full Touch & Mobile View Optimization
 */
(function() {
  'use strict';

  const TOTAL_FRAMES = 250;
  const FRAME_DIR = 'images/hero-render/';
  const FRAME_PREFIX = 'ezgif-frame-';
  const FRAME_EXT = '.png';

  let canvas, ctx;
  let images = new Array(TOTAL_FRAMES);
  let imagesLoaded = 0;
  let currentFrameIndex = -1;
  let targetProgress = 0;
  let currentProgress = 0;
  let animationFrameId = null;

  // DOM Elements
  let trackEl, stickyEl, progressLineEl, frameCounterEl, lightSweepEl;
  let scene1El, scene2El, scene3El, scene4El, textGroupEl;
  let dotButtons = [];
  let magazineSteps = [];
  let siteHeaderEl;

  /**
   * Format 3-digit frame index (e.g. 0 -> "ezgif-frame-001.png")
   */
  function getFrameFilename(index) {
    return `${FRAME_PREFIX}${String(index + 1).padStart(3, '0')}${FRAME_EXT}`;
  }

  /**
   * Preload all 250 frames into memory with high-performance progressive staging
   */
  function preloadFrames() {
    // 1. Immediately load frame 0 for instant high-quality initial display
    const firstImg = new Image();
    firstImg.src = `${FRAME_DIR}${getFrameFilename(0)}`;
    firstImg.onload = function() {
      images[0] = firstImg;
      imagesLoaded++;
      renderFrame(0);
    };

    // 2. Load key waypoint frames across the sequence for instant scrubbing
    for (let k = 10; k < TOTAL_FRAMES; k += 10) {
      const idx = k;
      const keyImg = new Image();
      keyImg.src = `${FRAME_DIR}${getFrameFilename(idx)}`;
      keyImg.onload = function() {
        images[idx] = keyImg;
        imagesLoaded++;
        if (Math.abs(currentFrameIndex - idx) <= 5) {
          renderFrame(currentFrameIndex);
        }
      };
      images[idx] = keyImg;
    }

    // 3. Preload all remaining frames in non-blocking batches
    let nextBatchIndex = 1;
    function loadBatch() {
      const batchSize = 14;
      const end = Math.min(TOTAL_FRAMES, nextBatchIndex + batchSize);
      for (let i = nextBatchIndex; i < end; i++) {
        if (!images[i]) {
          const img = new Image();
          img.src = `${FRAME_DIR}${getFrameFilename(i)}`;
          img.onload = function() {
            images[i] = img;
            imagesLoaded++;
            if (currentFrameIndex === i) {
              renderFrame(i);
            }
          };
          images[i] = img;
        }
      }
      nextBatchIndex = end;
      if (nextBatchIndex < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadBatch, { timeout: 100 });
        } else {
          setTimeout(loadBatch, 25);
        }
      }
    }

    setTimeout(loadBatch, 50);
  }

  /**
   * Set up and resize canvas with High-DPI & 4K sharpness support
   */
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (currentFrameIndex >= 0) {
      renderFrame(currentFrameIndex);
    }
  }

  /**
   * Render a specific frame with cover-crop centering
   */
  function renderFrame(index) {
    if (!canvas || !ctx) return;
    const img = images[index];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame as fallback so frame is never empty
      let fallback = null;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && images[index - offset] && images[index - offset].complete && images[index - offset].naturalWidth > 0) {
          fallback = images[index - offset];
          break;
        }
        if (index + offset < TOTAL_FRAMES && images[index + offset] && images[index + offset].complete && images[index + offset].naturalWidth > 0) {
          fallback = images[index + offset];
          break;
        }
      }
      if (fallback) drawImageCover(fallback);
      return;
    }

    drawImageCover(img);
  }

  /**
   * Draw image with 'cover' aspect ratio math onto the canvas with 4K clarity
   */
  function drawImageCover(img) {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
    const displayWidth = canvas.width / dpr;
    const displayHeight = canvas.height / dpr;

    const canvasRatio = displayWidth / displayHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let sWidth, sHeight, sx, sy;

    if (imgRatio > canvasRatio) {
      sHeight = img.naturalHeight;
      sWidth = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.naturalWidth;
      sHeight = img.naturalWidth / canvasRatio;
      sx = 0;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, displayWidth, displayHeight);
  }

  /**
   * Main render loop using requestAnimationFrame with smooth lerp
   */
  function updateAnimationLoop() {
    if (!trackEl) return;

    // Smooth lerp toward target progress (natural physics feel)
    const delta = targetProgress - currentProgress;
    if (Math.abs(delta) > 0.0001) {
      currentProgress += delta * 0.12;
    } else {
      currentProgress = targetProgress;
    }

    currentProgress = Math.max(0, Math.min(1, currentProgress));

    // Calculate frame index from progress (0 to TOTAL_FRAMES - 1)
    const newFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1))));

    if (newFrameIndex !== currentFrameIndex) {
      currentFrameIndex = newFrameIndex;
      renderFrame(currentFrameIndex);

      // Update frame counter UI
      if (frameCounterEl) {
        frameCounterEl.textContent = `FRAME ${String(currentFrameIndex + 1).padStart(3, '0')} / ${TOTAL_FRAMES}`;
      }
    }

    // Update delicate gold progress line
    if (progressLineEl) {
      progressLineEl.style.width = `${(currentProgress * 100).toFixed(1)}%`;
    }

    // Update Story Scenes & Indicators
    updateScenes(currentProgress);

    animationFrameId = requestAnimationFrame(updateAnimationLoop);
  }

  /**
   * Update overlays for Scene 1, 2, 3, and 4 based on exact scroll percentages
   * SCENE 01: 0% – 25% (Meet India)
   * SCENE 02: 25% – 50% (Meet Design / Designed For The Way India Lives)
   * SCENE 03: 50% – 75% (Meet Innovation / Form. Function. Elegance.)
   * SCENE 04: 75% – 100% (Meet Elegance / Touch of Elegance & National Plasto Reveal)
   */
  function updateScenes(prog) {
    // ─── SCENE 01 (0.00 to 0.25) ───
    if (scene1El) {
      if (prog <= 0.25) {
        // High visibility from 0 to 0.18, fades out between 0.18 and 0.25
        const fade = prog < 0.18 ? 1 : Math.max(0, 1 - (prog - 0.18) / 0.07);
        scene1El.style.opacity = fade.toFixed(3);
        scene1El.style.transform = `translateY(${(prog * -50).toFixed(1)}px)`;
        scene1El.style.pointerEvents = fade > 0.4 ? 'auto' : 'none';
        scene1El.classList.toggle('active', fade > 0.05);
      } else {
        scene1El.style.opacity = '0';
        scene1El.style.transform = 'translateY(-30px)';
        scene1El.style.pointerEvents = 'none';
        scene1El.classList.remove('active');
      }
    }

    // ─── SCENE 02 (0.25 to 0.50) ───
    if (scene2El) {
      if (prog > 0.22 && prog < 0.53) {
        let fade = 1;
        let translateY = 0;

        if (prog < 0.31) {
          // Rises from bottom
          const enter = (prog - 0.22) / 0.09;
          fade = enter;
          translateY = (1 - enter) * 35;
        } else if (prog > 0.43) {
          // Dissolves upward
          const exit = (prog - 0.43) / 0.09;
          fade = Math.max(0, 1 - exit);
          translateY = -exit * 30;
        }

        scene2El.style.opacity = Math.max(0, Math.min(1, fade)).toFixed(3);
        scene2El.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        scene2El.style.pointerEvents = fade > 0.4 ? 'auto' : 'none';
        scene2El.classList.toggle('active', fade > 0.05);
      } else {
        scene2El.style.opacity = '0';
        scene2El.style.transform = 'translateY(30px)';
        scene2El.style.pointerEvents = 'none';
        scene2El.classList.remove('active');
      }
    }

    // ─── SCENE 03 (0.50 to 0.75) ───
    if (scene3El) {
      if (prog > 0.47 && prog < 0.78) {
        let fade = 1;
        let translateY = 0;

        if (prog < 0.56) {
          // Rises from bottom
          const enter = (prog - 0.47) / 0.09;
          fade = enter;
          translateY = (1 - enter) * 35;
        } else if (prog > 0.68) {
          // Dissolves upward
          const exit = (prog - 0.68) / 0.09;
          fade = Math.max(0, 1 - exit);
          translateY = -exit * 30;
        }

        scene3El.style.opacity = Math.max(0, Math.min(1, fade)).toFixed(3);
        scene3El.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        scene3El.style.pointerEvents = fade > 0.4 ? 'auto' : 'none';
        scene3El.classList.toggle('active', fade > 0.05);

        // Light sweep effect across scene
        if (lightSweepEl) {
          const sweepProgress = Math.max(0, Math.min(1, (prog - 0.50) / 0.25));
          const sweepX = (sweepProgress * 140 - 20).toFixed(1);
          lightSweepEl.style.opacity = (Math.sin(sweepProgress * Math.PI) * 0.4).toFixed(3);
          lightSweepEl.style.transform = `translateX(${sweepX}%) skewX(-20deg)`;
        }
      } else {
        scene3El.style.opacity = '0';
        scene3El.style.transform = 'translateY(30px)';
        scene3El.style.pointerEvents = 'none';
        scene3El.classList.remove('active');
        if (lightSweepEl) {
          lightSweepEl.style.opacity = '0';
        }
      }
    }

    // ─── SCENE 04 (0.75 to 1.00) ───
    if (scene4El) {
      if (prog >= 0.72) {
        let fade = 1;
        let translateY = 0;

        if (prog < 0.82) {
          const enter = (prog - 0.72) / 0.10;
          fade = enter;
          translateY = (1 - enter) * 35;
        } else {
          fade = 1;
          translateY = 0;
        }

        if (textGroupEl) {
          textGroupEl.classList.remove('faded');
          textGroupEl.style.opacity = '1';
          textGroupEl.style.transform = 'translateY(0)';
        }

        scene4El.style.opacity = Math.max(0, Math.min(1, fade)).toFixed(3);
        scene4El.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        scene4El.style.pointerEvents = fade > 0.4 ? 'auto' : 'none';
        scene4El.classList.toggle('active', fade > 0.05);
      } else {
        scene4El.style.opacity = '0';
        scene4El.style.transform = 'translateY(40px)';
        scene4El.style.pointerEvents = 'none';
        scene4El.classList.remove('active');
        if (textGroupEl) {
          textGroupEl.classList.remove('faded');
        }
      }
    }

    // ─── Update Indicator Dots & Magazine Steps ───
    let activeIndex = 0;
    if (prog >= 0.75) {
      activeIndex = 3;
    } else if (prog >= 0.50) {
      activeIndex = 2;
    } else if (prog >= 0.25) {
      activeIndex = 1;
    } else {
      activeIndex = 0;
    }

    dotButtons.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });

    magazineSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === activeIndex);
    });
  }

  /**
   * Calculate scroll progress through heroScrollTrack
   */
  function onWindowScroll() {
    if (!trackEl) return;

    const rect = trackEl.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;

    if (scrollableDistance > 0) {
      const scrollY = -rect.top;
      const prog = Math.max(0, Math.min(1, scrollY / scrollableDistance));
      targetProgress = prog;
    }

    // Header scrolled state styling (transparent throughout hero, subtle backdrop after)
    if (siteHeaderEl) {
      const heroThreshold = trackEl ? (trackEl.offsetTop + trackEl.offsetHeight - window.innerHeight - 50) : 600;
      siteHeaderEl.classList.toggle('scrolled', window.scrollY > heroThreshold);
    }
  }

  /**
   * Jump directly to any scene (0: Meet India, 1: Meet Design, 2: Meet Innovation, 3: National Plasto)
   */
  window.jumpToHeroScene = function(sceneIdx) {
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollableDistance = rect.height - window.innerHeight;

    let targetRatio = 0.02;
    if (sceneIdx === 1) targetRatio = 0.35;
    if (sceneIdx === 2) targetRatio = 0.62;
    if (sceneIdx === 3) targetRatio = 0.88;

    const targetScrollY = trackTop + (scrollableDistance * targetRatio);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // Backwards-compatible alias for existing markup
  window.jumpToHeroStage = window.jumpToHeroScene;

  /**
   * Initialize on DOM Ready
   */
  function init() {
    canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d', { alpha: false });
    trackEl = document.getElementById('heroScrollTrack');
    stickyEl = document.getElementById('heroStickyStage');
    progressLineEl = document.getElementById('heroScrollProgressLine');
    frameCounterEl = document.getElementById('heroFrameCounter');
    lightSweepEl = document.getElementById('heroLightSweep');

    scene1El = document.getElementById('heroScene1');
    scene2El = document.getElementById('heroScene2');
    scene3El = document.getElementById('heroScene3');
    scene4El = document.getElementById('heroScene4');
    textGroupEl = document.getElementById('heroRevealTextGroup');

    dotButtons = Array.from(document.querySelectorAll('.hero-dot-item'));
    magazineSteps = Array.from(document.querySelectorAll('.magazine-step'));
    siteHeaderEl = document.getElementById('siteHeader');

    // Resize canvas setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Preload frames
    preloadFrames();

    // Scroll listener
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    // Initial check
    onWindowScroll();

    // Start render animation loop
    updateAnimationLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ════════════════════════════════════════════════════════════════
   BUSINESS CATEGORIES SECTION OBSERVER & INTERACTION CONTROLLER
   ════════════════════════════════════════════════════════════════ */
(function() {
  function initCategoriesObserver() {
    const grid = document.getElementById('businessCategoriesGrid');
    if (!grid) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            grid.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(grid);
    } else {
      grid.classList.add('is-visible');
    }

    // Ensure all videos play on user interaction or load
    const videos = grid.querySelectorAll('video');
    videos.forEach(v => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoriesObserver);
  } else {
    initCategoriesObserver();
  }
})();

// Global tab switch function for brand filter pills
window.activateBusinessBrand = function(brandKey, buttonEl) {
  // Update active button
  const pills = document.querySelectorAll('.brand-tab-pill');
  pills.forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-selected', 'false');
  });

  if (buttonEl) {
    buttonEl.classList.add('active');
    buttonEl.setAttribute('aria-selected', 'true');
  }

  // Scroll to and highlight card
  const card = document.getElementById(`brand-card-${brandKey}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    
    // Pulse highlight effect
    card.style.outline = '2px solid #FFFFFF';
    card.style.outlineOffset = '-2px';
    setTimeout(() => {
      card.style.outline = 'none';
    }, 1200);

    const vid = card.querySelector('video');
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }
};
