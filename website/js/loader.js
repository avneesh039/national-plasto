/**
 * National Plasto — loader.js
 * Yodezeen-inspired Architectural Preloader Controller
 */
(function() {
  'use strict';

  // Check if loader was already seen this session
  const loaderSeen = sessionStorage.getItem('np_loader_seen') === 'true';
  const loaderEl = document.getElementById('arch-loader');

  if (loaderSeen && loaderEl) {
    loaderEl.style.display = 'none';
    document.documentElement.classList.remove('arch-loader-active');
    document.body.classList.remove('arch-loader-active');
    return;
  }

  // Lock scroll
  document.documentElement.classList.add('arch-loader-active');
  document.body.classList.add('arch-loader-active');

  const countEl = document.getElementById('yodezeenCountNum');
  const skipBtn = document.getElementById('yodezeenSkipBtn');
  let currentVal = 0;
  let targetVal = 100;
  let isDone = false;
  let animFrame;

  function dismissLoader() {
    if (isDone) return;
    isDone = true;
    cancelAnimationFrame(animFrame);
    sessionStorage.setItem('np_loader_seen', 'true');

    if (countEl) countEl.textContent = '100';

    if (loaderEl) {
      loaderEl.classList.add('loader-hidden');
      setTimeout(() => {
        loaderEl.style.display = 'none';
        document.documentElement.classList.remove('arch-loader-active');
        document.body.classList.remove('arch-loader-active');
      }, 950);
    }
  }

  // Animate counter smoothly
  const startTime = performance.now();
  const duration = 1800; // 1.8 seconds

  function step(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // EaseOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    currentVal = Math.floor(eased * targetVal);

    if (countEl) {
      countEl.textContent = currentVal < 10 ? '0' + currentVal : currentVal;
    }

    if (progress < 1 && !isDone) {
      animFrame = requestAnimationFrame(step);
    } else {
      setTimeout(dismissLoader, 250);
    }
  }

  animFrame = requestAnimationFrame(step);

  if (skipBtn) {
    skipBtn.addEventListener('click', dismissLoader);
  }

  // Fallback timeout after 3.5s max
  setTimeout(dismissLoader, 3500);
})();
