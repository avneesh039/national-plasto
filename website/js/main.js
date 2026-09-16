/* ============================================================
   NATIONAL PLASTO — MAIN JAVASCRIPT
   Custom Cursor · Smooth Scroll · Navigation · Counters ·
   Scroll Reveal · Micro-Interactions
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. CUSTOM CURSOR
     ───────────────────────────────────────────── */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorLabel = document.getElementById('cursorLabel');

  if (!cursorDot || !cursorRing) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let dotX   = 0, dotY   = 0;
  let raf;

  const lerp = (a, b, n) => a + (b - a) * n;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    dotX  = lerp(dotX,  mouseX, 0.85);
    dotY  = lerp(dotY,  mouseY, 0.85);
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);

    cursorDot.style.left  = dotX  + 'px';
    cursorDot.style.top   = dotY  + 'px';
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    cursorLabel.style.left = ringX + 'px';
    cursorLabel.style.top  = ringY + 'px';

    raf = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* Cursor state changes */
  function setCursorState(label) {
    if (label) {
      document.body.classList.add('cursor-state-active');
      cursorLabel.textContent = label;
    } else {
      document.body.classList.remove('cursor-state-active');
      cursorLabel.textContent = '';
    }
  }

  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorState(el.dataset.cursor));
    el.addEventListener('mouseleave', () => setCursorState(null));
  });

  /* Generic hover expansion on interactive elements */
  document.querySelectorAll('a, button').forEach(el => {
    if (!el.dataset.cursor) {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width  = '56px';
        cursorRing.style.height = '56px';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width  = '40px';
        cursorRing.style.height = '40px';
      });
    }
  });

  /* Hide on mobile */
  document.addEventListener('touchstart', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  }, { once: true });


  /* ─────────────────────────────────────────────
     2. HEADER SCROLL BEHAVIOUR
     ───────────────────────────────────────────── */
  const header = document.getElementById('siteHeader');
  let lastScrollY = 0;
  let headerHidden = false;

  function onScroll() {
    const scrollY = window.scrollY;
    const heroTrack = document.getElementById('heroScrollTrack');
    const heroBottom = heroTrack ? (heroTrack.offsetTop + heroTrack.offsetHeight - window.innerHeight - 50) : 600;
    const pastHero = scrollY > heroBottom;

    if (pastHero) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    /* Auto-hide only when scrolled past the hero section */
    if (pastHero && scrollY > lastScrollY + 15 && scrollY > heroBottom + 150 && !headerHidden) {
      header.style.transform = 'translateY(-100%)';
      headerHidden = true;
    } else if ((!pastHero || scrollY < lastScrollY - 10) && headerHidden) {
      header.style.transform = 'translateY(0)';
      headerHidden = false;
    }
    lastScrollY = scrollY;
  }

  header.style.transition = 'background 0.4s ease, box-shadow 0.4s ease, height 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─────────────────────────────────────────────
     3. MOBILE MENU
     ───────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      if (isOpen) {
        header.style.transform = 'translateY(0)';
        headerHidden = false;
      }
    });

    /* Close on nav link click */
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
      });
    });
  }


  /* ─────────────────────────────────────────────
     4. SMOOTH SCROLL
     ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────
     5. SCROLL REVEAL
     ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });


  /* ─────────────────────────────────────────────
     6. COUNTER ANIMATION
     ───────────────────────────────────────────── */
  function animateCounter(el) {
    const raw = el.dataset.target || el.textContent.replace(/\D/g, '');
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease out expo */
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


  /* ─────────────────────────────────────────────
     7. MAGNETIC BUTTONS
     ───────────────────────────────────────────── */
  function initMagnetic(el, strength = 0.3) {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }

  document.querySelectorAll('.btn-primary, .btn-hero-primary').forEach(btn => {
    initMagnetic(btn, 0.2);
  });


  /* ─────────────────────────────────────────────
     8. HERO PARALLAX (subtle)
     ───────────────────────────────────────────── */
  const heroGlow = document.querySelector('.hero-glow');
  const heroGridOverlay = document.querySelector('.hero-grid-overlay');

  if (heroGlow) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGlow.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* Scroll parallax on hero elements */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const scrollY = window.scrollY;
    const heroH = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    if (scrollY < heroH) {
      const progress = scrollY / heroH;
      heroContent.style.transform = `translateY(${progress * 60}px)`;
      heroContent.style.opacity = 1 - progress * 1.5;
    }
  }, { passive: true });


  /* ─────────────────────────────────────────────
     9. COLLECTION PORTALS — VIDEO/IMAGE TOGGLE
     ───────────────────────────────────────────── */
  document.querySelectorAll('.collection-portal').forEach(portal => {
    portal.addEventListener('mouseenter', () => {
      /* In a real implementation, swap background image here */
      portal.style.zIndex = '2';
    });
    portal.addEventListener('mouseleave', () => {
      portal.style.zIndex = '';
    });
  });


  /* ─────────────────────────────────────────────
     10. SECTION ACTIVE NAV HIGHLIGHT
     ───────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active-nav', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(section => sectionObserver.observe(section));


  /* ─────────────────────────────────────────────
     11. HERITAGE TIMELINE — YEAR PARALLAX
     ───────────────────────────────────────────── */
  document.querySelectorAll('.timeline-year').forEach(year => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          year.style.opacity = '1';
        }
      });
    }, { threshold: 0.3 });
    observer.observe(year);
  });


  /* ─────────────────────────────────────────────
     12. MOBILE STICKY BAR — SHOW/HIDE
     ───────────────────────────────────────────── */
  const stickyBar = document.getElementById('mobileStickyBar');
  if (stickyBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        stickyBar.style.transform = 'translateY(0)';
        stickyBar.style.opacity = '1';
      } else {
        stickyBar.style.transform = 'translateY(100%)';
        stickyBar.style.opacity = '0';
      }
    }, { passive: true });
    stickyBar.style.transform = 'translateY(100%)';
    stickyBar.style.opacity = '0';
    stickyBar.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
  }


  /* ─────────────────────────────────────────────
     13. CATALOGUE BOOK 3D CURSOR TILT
     ───────────────────────────────────────────── */
  const bookWrap = document.querySelector('.catalogue-cover-wrap');
  const book = document.querySelector('.catalogue-book');

  if (bookWrap && book) {
    bookWrap.addEventListener('mousemove', e => {
      const rect = bookWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      book.style.transform = `rotateY(${-12 + x}deg) rotateX(${4 - y}deg)`;
    });
    bookWrap.addEventListener('mouseleave', () => {
      book.style.transform = 'rotateY(-12deg) rotateX(4deg)';
    });
  }


  /* ─────────────────────────────────────────────
     14. SEARCH — KEYBOARD SHORTCUT
     ───────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchOverlay')?.classList.add('active');
      setTimeout(() => document.getElementById('searchInput')?.focus(), 300);
    }
    if (e.key === 'Escape') {
      document.getElementById('searchOverlay')?.classList.remove('active');
      document.getElementById('catalogueModal')?.classList.remove('active');
      document.getElementById('distributorModal')?.classList.remove('active');
      document.getElementById('rfqModal')?.classList.remove('active');
      document.body.style.overflow = '';
      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuToggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }
  });


  /* ─────────────────────────────────────────────
     15. ACTIVE NAV LINK STYLE
     ───────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active-nav { color: var(--brand-crimson) !important; font-weight: 700 !important; }
    .nav-link.active-nav::after { transform: scaleX(1); }
  `;
  document.head.appendChild(style);


  /* ─────────────────────────────────────────────
     16. LAZY LOADING IMAGES
     ───────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  console.log('%c National Plasto Products Pvt. Ltd. ', 'background:#C8102E;color:white;font-family:monospace;font-size:14px;padding:8px 16px;border-radius:4px;');
  console.log('%c Precision Plastic Manufacturing. Built for India. ', 'color:#C8102E;font-size:12px;font-weight:bold;');
});

/* ─────────────────────────────────────────────
   17. ABOUT US INTERACTIVE MULTI-TAB VISUAL STAGE
   ───────────────────────────────────────────── */
window.switchAboutTab = function(index) {
  const tabs = document.querySelectorAll('.about-stage-tab');
  const frames = document.querySelectorAll('.about-media-frame');
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
    tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });
  frames.forEach((frame, i) => {
    frame.classList.toggle('active', i === index);
  });
};

/* ─────────────────────────────────────────────
   18. PRODUCT DATABASE CONTROLLER (BRAND-FIRST + SEARCH)
   ───────────────────────────────────────────── */
(function() {
  let activeBrand = 'all';
  let activeCategory = 'all';
  let searchQuery = '';
  let visibleLimit = 16;

  function getAllProducts() {
    if (window.NPPL_DATA && Array.isArray(window.NPPL_DATA.allWithImages) && window.NPPL_DATA.allWithImages.length > 0) {
      return window.NPPL_DATA.allWithImages;
    }
    return [];
  }

  function getFilteredProducts() {
    let prods = getAllProducts();

    // 1. Filter by Brand
    if (activeBrand !== 'all') {
      prods = prods.filter(p => {
        const b = (p.collectionSlug || '').toLowerCase();
        if (activeBrand === 'national-sapphire' || activeBrand === 'sapphire') {
          return b.includes('sapphire');
        }
        return b === activeBrand;
      });
    }

    // 2. Filter by Category
    if (activeCategory !== 'all') {
      prods = prods.filter(p => {
        const c = (p.categorySlug || '').toLowerCase();
        if (activeCategory === 'chairs') return c.includes('chair');
        if (activeCategory === 'tables') return c.includes('table');
        if (activeCategory === 'stools') return c.includes('stool');
        if (activeCategory === 'kids') return c.includes('baby') || c.includes('kid');
        if (activeCategory === 'storage') return c.includes('storage') || c.includes('wardrobe') || c.includes('trolley') || c.includes('crate');
        return true;
      });
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      prods = prods.filter(p => {
        const name = (p.name || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const col = (p.collection || '').toLowerCase();
        return name.includes(q) || sku.includes(q) || cat.includes(q) || col.includes(q);
      });
    }

    return prods;
  }

  function renderDatabaseGrid() {
    const container = document.getElementById('featuredGridContainer');
    if (!container) return;

    const filtered = getFilteredProducts();
    const slice = filtered.slice(0, visibleLimit);

    // Update status counter
    const statusEl = document.getElementById('productDbCountStatus');
    if (statusEl) {
      let brandLabel = activeBrand === 'all' ? 'all brands' : activeBrand.toUpperCase().replace('-', ' ');
      if (filtered.length === 0) {
        statusEl.textContent = `No products found matching "${searchQuery}" under ${brandLabel}`;
      } else {
        statusEl.textContent = `Showing ${Math.min(filtered.length, visibleLimit)} of ${filtered.length} products under ${brandLabel}`;
      }
    }

    // Update load more button
    const loadMoreWrap = document.getElementById('dbLoadMoreWrap');
    if (loadMoreWrap) {
      loadMoreWrap.style.display = filtered.length > visibleLimit ? 'block' : 'none';
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 64px 20px; background: white; border-radius: 20px; border: 1px dashed #cbd5e1;">
          <p style="font-family: var(--font-display); font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">No products match your criteria</p>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Try adjusting your search query or selecting "All Brands".</p>
          <button type="button" class="btn-mfg-primary" onclick="clearDatabaseSearch(); selectDatabaseBrand('all', document.querySelector('.prod-brand-tab-btn[data-brand=all]'));" style="margin:0 auto;">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = slice.map((p, idx) => {
      const raw1 = (p.images && p.images[0]) ? p.images[0].url : 'images/products/np-ntl-058-89dcdcfa74.jpg';
      const png1 = raw1.replace(/\.jpg$/i, '.png');
      const raw2 = (p.images && p.images[1]) ? p.images[1].url : raw1;
      const png2 = raw2.replace(/\.jpg$/i, '.png');
      const brand = p.collection || 'NATIONAL';
      const brandClass = brand.includes('NEXT') ? 'badge-brand-next' : (brand.includes('SAPPHIRE') ? 'badge-brand-sapphire' : (brand.includes('CAPTAIN') ? 'badge-brand-captain' : 'badge-brand-national'));
      const hasDual = raw1 !== raw2;

      return `
        <div class="product-card-editorial" data-brand="${p.collectionSlug}">
          <div class="product-card-image">
            <img src="${png1}" onerror="this.onerror=null;this.src='${raw1}'" alt="${p.name} - Front" class="prod-img-primary" loading="lazy" />
            ${hasDual ? `<img src="${png2}" onerror="this.onerror=null;this.src='${raw2}'" alt="${p.name} - Angle" class="prod-img-secondary" loading="lazy" />` : ''}
            <span class="product-card-badge ${brandClass}">${brand}</span>
            ${hasDual ? `<span class="angle-hint">360° Hover</span>` : ''}
          </div>
          <div class="product-card-info">
            <div class="product-sku-bar">
              <span class="t-overline" style="font-size:9px;color:var(--brand-crimson);font-weight:700">${p.sku}</span>
              <span class="technical-spec-pill">Tested: 200 kg</span>
            </div>
            <h3 class="product-card-title">${p.name}</h3>
            <p class="product-card-cat">${p.category} · 100% Virgin Polymer</p>
            
            <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
              <span class="technical-spec-pill">100% Virgin PP</span>
              <span class="technical-spec-pill">Stackable</span>
              <span class="technical-spec-pill">UV Stabilized</span>
            </div>

            <div class="product-actions-bar" style="margin-top:16px;">
              <a href="#enquiry" class="btn-quote-link" onclick="prefillQuote('${p.name} (${p.sku})')">
                <span>Get A Quote</span> →
              </a>
              <button type="button" class="btn-ghost-sm" onclick="quickViewProduct('${p.sku}')" style="font-size:11px;font-weight:700;text-transform:uppercase;background:none;border:none;cursor:pointer">
                Datasheet
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Global Handlers
  window.selectDatabaseBrand = function(brandSlug, btn) {
    activeBrand = brandSlug;
    visibleLimit = 16;
    document.querySelectorAll('.prod-brand-tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    }
    renderDatabaseGrid();
  };

  window.selectDatabaseCategory = function(catSlug, btn) {
    activeCategory = catSlug;
    visibleLimit = 16;
    document.querySelectorAll('.db-cat-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderDatabaseGrid();
  };

  let searchTimeout;
  window.onDatabaseSearchInput = function(val) {
    searchQuery = val;
    visibleLimit = 16;
    const clearBtn = document.getElementById('dbSearchClearBtn');
    if (clearBtn) {
      clearBtn.style.display = val.trim() ? 'flex' : 'none';
    }
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(renderDatabaseGrid, 120);
  };

  window.clearDatabaseSearch = function() {
    const input = document.getElementById('dbProductSearch');
    if (input) input.value = '';
    searchQuery = '';
    const clearBtn = document.getElementById('dbSearchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    renderDatabaseGrid();
  };

  window.loadMoreDbProducts = function() {
    visibleLimit += 16;
    renderDatabaseGrid();
  };

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(renderDatabaseGrid, 100);
    });
  } else {
    setTimeout(renderDatabaseGrid, 100);
  }
})();
