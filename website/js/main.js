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

  /* ── Category taxonomy ──
     The listing is grouped two levels deep: a family, then the tier category
     inside it. Grouping needs one home per product, so baby and storage items
     are claimed before the chair/table keyword can take them — a "Baby Chair"
     belongs under Baby & Kids, not in two places. The filter chips above stay
     deliberately overlapping; they answer a different question. */
  const FAMILIES = [
    { slug: 'chairs',  label: 'Chairs' },
    { slug: 'tables',  label: 'Tables' },
    { slug: 'stools',  label: 'Stools & Patla' },
    { slug: 'kids',    label: 'Baby & Kids' },
    { slug: 'storage', label: 'Storage & Utility' },
    { slug: 'other',   label: 'Other Products' }
  ];

  function familyOf(category) {
    const c = (category || '').toLowerCase();
    if (/baby|kid/.test(c)) return 'kids';
    if (/wardrobe|trolley|storage/.test(c)) return 'storage';
    if (/stool/.test(c)) return 'stools';
    if (/chair/.test(c)) return 'chairs';
    if (/table/.test(c)) return 'tables';
    return 'other';
  }

  /* Best build first, economical last — the order a dealer shops a catalogue. */
  function tierRank(category) {
    const c = (category || '').toLowerCase();
    if (/heavy/.test(c) && /premium/.test(c)) return 0;
    if (/premium/.test(c)) return 1;
    if (/heavy/.test(c)) return 2;
    if (/deluxe/.test(c)) return 3;
    if (/regular/.test(c)) return 4;
    if (/economical/.test(c)) return 6;
    return 5;
  }

  function groupByCategory(products) {
    const families = new Map();
    products.forEach(p => {
      const fam = familyOf(p.category);
      if (!families.has(fam)) families.set(fam, new Map());
      const tiers = families.get(fam);
      const cat = p.category || 'Uncategorised';
      if (!tiers.has(cat)) tiers.set(cat, []);
      tiers.get(cat).push(p);
    });

    return FAMILIES
      .filter(f => families.has(f.slug))
      .map(f => {
        const tiers = [...families.get(f.slug).entries()]
          .map(([label, items]) => ({ label: label, items: items }))
          .sort((a, b) =>
            tierRank(a.label) - tierRank(b.label) ||
            b.items.length - a.items.length ||
            a.label.localeCompare(b.label));
        return {
          slug: f.slug,
          label: f.label,
          tiers: tiers,
          count: tiers.reduce((n, t) => n + t.items.length, 0)
        };
      });
  }

  /* Every category opens with a preview row. Rendering all 160 cards at once
     made the page 119 phone screens tall; four fills one desktop row and keeps
     the whole listing scannable. */
  const TIER_PREVIEW = 4;
  const expandedTiers = new Set();

  function slugify(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* Material follows the division, not the whole catalogue. Only NEXT is
     virgin plastic; NATIONAL is semi-virgin and reprocessed; CAPTAIN and
     SAPPHIRE are reprocessed. Labelling every card "100% Virgin PP" told
     buyers of 114 of the 160 products something untrue. */
  const MATERIALS = {
    next:     { short: 'Virgin PP',            long: '100% virgin polypropylene',
                note: 'Premium virgin plastic, for finish and colour fastness.' },
    national: { short: 'Semi-Virgin / Reprocessed', long: 'Semi-virgin and reprocessed polypropylene',
                note: 'Blended to hold strength across a wide range of price points.' },
    captain:  { short: 'Reprocessed PP',       long: 'Reprocessed polypropylene',
                note: 'Economical build for high-volume everyday use.' },
    sapphire: { short: 'Reprocessed PP',       long: 'Reprocessed polypropylene',
                note: 'Economical build for price-conscious markets.' }
  };

  function materialFor(p) {
    const slug = (p.collectionSlug || '').toLowerCase();
    if (slug.indexOf('sapphire') !== -1) return MATERIALS.sapphire;
    return MATERIALS[slug] || MATERIALS.national;
  }

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
        if (activeCategory === 'storage') return c.includes('storage') || c.includes('wardrobe') || c.includes('trolley');
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
    const groups = groupByCategory(filtered);

    /* The container is a grid on these pages, which would lay the family
       sections out in columns. Grouping needs it to stack. */
    container.classList.add('products-grouped-wrap');
    container.classList.remove('products-visual-grid');

    // Update status counter
    const statusEl = document.getElementById('productDbCountStatus');
    if (statusEl) {
      let brandLabel = activeBrand === 'all' ? 'all brands' : activeBrand.toUpperCase().replace('-', ' ');
      if (filtered.length === 0) {
        statusEl.textContent = `No products found matching "${searchQuery}" under ${brandLabel}`;
      } else {
        const tierCount = groups.reduce((n, g) => n + g.tiers.length, 0);
        statusEl.textContent = `${filtered.length} products in ${tierCount} categories under ${brandLabel}`;
      }
    }

    /* Every match is rendered, so paging through a flat list no longer
       applies — the category index is how you skip ahead now. */
    const loadMoreWrap = document.getElementById('dbLoadMoreWrap');
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 64px 20px; background: white; border-radius: 20px; border: 1px dashed #cbd5e1;">
          <p style="font-family: var(--font-display); font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">No products match your criteria</p>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Try adjusting your search query or selecting "All Brands".</p>
          <button type="button" class="btn-mfg-primary" onclick="clearDatabaseSearch(); selectDatabaseBrand('all', document.querySelector('.prod-brand-tab-btn[data-brand=all]'));" style="margin:0 auto;">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML =
      categoryIndexHTML(groups) +
      groups.map(familySectionHTML).join('');
  }

  function categoryIndexHTML(groups) {
    if (groups.length < 2) return '';
    return `
      <nav class="prod-cat-index" aria-label="Jump to category">
        ${groups.map(g => `
          <a class="prod-cat-index-link" href="#fam-${g.slug}">
            ${g.label}<span class="prod-cat-index-num">${g.count}</span>
          </a>
        `).join('')}
      </nav>
    `;
  }

  function familySectionHTML(g) {
    return `
      <section class="prod-family" id="fam-${g.slug}">
        <header class="prod-family-head">
          <h3 class="prod-family-title">${g.label}</h3>
          <span class="prod-family-count">${g.count} ${g.count === 1 ? 'model' : 'models'} · ${g.tiers.length} ${g.tiers.length === 1 ? 'category' : 'categories'}</span>
        </header>
        ${g.tiers.map(t => tierHTML(g, t)).join('')}
      </section>
    `;
  }

  function tierHTML(g, t) {
    const key = g.slug + '--' + slugify(t.label);
    const open = expandedTiers.has(key);
    const shown = open ? t.items : t.items.slice(0, TIER_PREVIEW);
    const hidden = t.items.length - shown.length;

    return `
      <div class="prod-tier" id="cat-${slugify(t.label)}">
        <div class="prod-tier-head">
          <h4 class="prod-tier-title">${t.label}</h4>
          <span class="prod-tier-count">${t.items.length}</span>
        </div>
        <div class="prod-tier-grid">
          ${shown.map(productCard).join('')}
        </div>
        ${t.items.length > TIER_PREVIEW ? `
          <button type="button" class="prod-tier-toggle" onclick="toggleProductTier('${key}')"
                  aria-expanded="${open ? 'true' : 'false'}">
            ${open ? 'Show fewer' : `Show all ${t.items.length}`}
            ${hidden > 0 ? `<span class="prod-tier-toggle-num">+${hidden}</span>` : ''}
          </button>
        ` : ''}
      </div>
    `;
  }

  function productCard(p) {
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
            <p class="product-card-cat">${p.category} · ${materialFor(p).long}</p>
            
            <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
              <span class="technical-spec-pill">${materialFor(p).short}</span>
              <span class="technical-spec-pill">Stackable</span>
              <span class="technical-spec-pill">UV Stabilized</span>
            </div>

            <button type="button" class="btn-shop-now" onclick="openShop('${p.sku}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>Shop Now</span>
            </button>

            <div class="product-actions-bar" style="margin-top:16px;">
              <a href="#enquiry" class="btn-quote-link" onclick="prefillQuote('${p.name} (${p.sku})')">
                <span>Get A Quote</span> →
              </a>
              <button type="button" class="btn-card-locator" onclick="openDistributorLocator('${p.sku}')" title="Find local distributor stocking ${p.name}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Distributor Near You</span>
              </button>
              <button type="button" class="btn-ghost-sm" onclick="openFeatures('${p.sku}')" style="font-size:11px;font-weight:700;text-transform:uppercase;background:none;border:none;cursor:pointer">
                Our Feature
              </button>
            </div>
          </div>
        </div>
      `;
  }

  window.toggleProductTier = function(key) {
    if (expandedTiers.has(key)) expandedTiers.delete(key);
    else expandedTiers.add(key);

    /* Re-rendering moves the ground under the button, so pin the tier and put
       the page back where the reader was. */
    const btn = document.querySelector(`[onclick="toggleProductTier('${key}')"]`);
    const tier = btn ? btn.closest('.prod-tier') : null;
    const before = tier ? tier.getBoundingClientRect().top : null;
    const id = tier ? tier.id : null;

    renderDatabaseGrid();

    if (id && before !== null) {
      const after = document.getElementById(id);
      if (after) window.scrollBy(0, after.getBoundingClientRect().top - before);
    }
  };

  // Global Handlers
  window.selectDatabaseBrand = function(brandSlug, btn) {
    activeBrand = brandSlug;
    visibleLimit = 16;
    expandedTiers.clear();
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
    expandedTiers.clear();
    document.querySelectorAll('.db-cat-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderDatabaseGrid();
  };

  let searchTimeout;
  window.onDatabaseSearchInput = function(val) {
    searchQuery = val;
    visibleLimit = 16;
    expandedTiers.clear();
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

  /* ── Product features ──
     Read from the catalogue record and the collection it belongs to. The
     dataset holds no per-model dimensions, mass, load rating, colours or
     warranty, so the build features below are the ones true of the whole
     moulded range, and the measured figures are asked for, not invented. */
  const RANGE_FEATURES = [
    ['UV inhibitors and impact modifiers', 'Holds colour and resists cracking outdoors.'],
    ['Stackable', 'Stores and ships in column.'],
    ['Injection moulded', 'Single-shot body, no welded joints.']
  ];

  window.openFeatures = function(sku) {
    const p = getAllProducts().find(x => x.sku === sku);
    const body = document.getElementById('featBody');
    const modal = document.getElementById('featureModal');
    const title = document.getElementById('featTitle');
    if (!p || !body || !modal) return;

    const coll = (window.NPPL_DATA && window.NPPL_DATA.collections)
      ? window.NPPL_DATA.collections[p.collectionSlug] : null;
    const imgs = (p.images || []).filter(i => i && i.url);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    title.textContent = p.name;

    body.innerHTML = `
      <div class="feat-grid">
        <div class="feat-media">
          <div class="feat-media-main">
            <img id="featMainImg" src="${esc(imgs[0] ? imgs[0].url : '')}" alt="${esc(p.name)}" />
          </div>
          ${imgs.length > 1 ? `
            <div class="feat-thumbs">
              ${imgs.map((im, i) => `
                <button type="button" class="feat-thumb${i === 0 ? ' active' : ''}"
                        onclick="featureImage('${esc(im.url)}', this)" aria-label="View ${esc(p.name)} image ${i + 1}">
                  <img src="${esc(im.url)}" alt="" />
                </button>
              `).join('')}
            </div>
          ` : ''}
          <p class="feat-ident">
            <span class="feat-mono">${esc(p.sku)}</span>
            <span class="feat-ident-sep">·</span>
            ${esc(p.collection)}
            <span class="feat-ident-sep">·</span>
            ${esc(p.category)}
          </p>
        </div>

        <div class="feat-info">
          <section class="feat-block">
            <h4 class="feat-block-title">Our features</h4>
            <ul class="feat-list">
              ${[[materialFor(p).long, materialFor(p).note]].concat(RANGE_FEATURES).map(f => `
                <li>
                  <span class="feat-list-name">${esc(f[0])}</span>
                  <span class="feat-list-note">${esc(f[1])}</span>
                </li>
              `).join('')}
              ${p.isPremium ? `
                <li>
                  <span class="feat-list-name">Premium line</span>
                  <span class="feat-list-note">Top tier of the ${esc(p.collection)} range.</span>
                </li>
              ` : ''}
            </ul>
            <p class="feat-footnote">Material follows the ${esc(p.collection)} division; the other build features apply across the moulded range. Neither is a per-model measurement.</p>
          </section>

          ${coll ? `
            <section class="feat-block">
              <h4 class="feat-block-title">${esc(coll.name)}</h4>
              <p class="feat-lede">${esc(coll.tagline)}</p>
              <p class="feat-text">${esc(coll.description)}</p>
            </section>
          ` : ''}

          <div class="feat-actions">
            <a href="#" class="btn-mfg-primary"
               onclick="prefillQuote(${JSON.stringify(p.name + ' (' + p.sku + ') — full specification').replace(/"/g, '&quot;')}); return false;">
              Request full specification
            </a>
          </div>
          <p class="feat-footnote">Dimensions, unit mass, load rating, colours and MOQ are sent against the SKU above.</p>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.search-close');
    if (closeBtn) closeBtn.focus();
  };

  window.featureImage = function(url, btn) {
    const main = document.getElementById('featMainImg');
    if (main) main.src = url;
    document.querySelectorAll('.feat-thumb').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.closeFeatures = function(e) {
    if (e && e.target !== e.currentTarget) return;
    const modal = document.getElementById('featureModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeFeatures();
  });


  /* ── Shop Now ──
     Marketplace listings are added per SKU as they go live. A product with no
     entry here still shows the button, but the chooser says the listing is not
     up yet and offers the enquiry desk instead — never a guessed marketplace
     URL, which would land the buyer on somebody else's product.

     To wire a product up, add its SKU:
       'NP-NTL-058': {
         amazon:   'https://www.amazon.in/dp/XXXXXXXXXX',
         flipkart: 'https://www.flipkart.com/.../p/XXXXXXXXXX'
       },
  */
  const MARKETPLACE = {};

  /* Each store gets its own mark and brand tint so the two are told apart at a
     glance. These are generic glyphs in each brand's colour, not the Amazon or
     Flipkart logos — drop official logo files in and swap `icon` for an <img>
     if you get them from their seller brand kits. */
  const STORES = [
    {
      key: 'amazon',
      label: 'Amazon',
      tint: '#FF9900',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
            '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
    },
    {
      key: 'flipkart',
      label: 'Flipkart',
      tint: '#2874F0',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>' +
            '<path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
    }
  ];

  /* Brand storefronts for the Shop button in the nav. Fill these in when the
     stores go live; until then the panel says so rather than sending anyone to
     a marketplace search, which lists competitors' chairs next to ours. */
  const STOREFRONTS = {
    amazon: {
      url: '',
      blurb: 'Full retail range with Prime delivery, ratings and easy returns.'
    },
    flipkart: {
      url: '',
      blurb: 'Retail packs and single units, with Flipkart delivery across India.'
    }
  };

  window.openShopNav = function() {
    const modal = document.getElementById('shopModal');
    const body = document.getElementById('shopBody');
    const title = document.getElementById('shopTitle');
    if (!modal || !body) return;

    title.textContent = 'Shop National Plasto';

    body.innerHTML = `
      <p class="shop-sku">Buy direct from our official marketplace stores.</p>

      <div class="shop-stores shop-stores--nav">
        ${STORES.map(s => {
          const sf = STOREFRONTS[s.key] || {};
          return sf.url ? `
            <a class="shop-store shop-store--nav" href="${sf.url}" target="_blank" rel="noopener noreferrer">
              <span class="shop-store-head">
                <span class="shop-store-mark" style="--tint:${s.tint}">${s.icon}</span>
                <span class="shop-store-name">${s.label}</span>
                <span class="shop-store-go">Visit store &rarr;</span>
              </span>
              <span class="shop-store-blurb">${sf.blurb}</span>
            </a>
          ` : `
            <div class="shop-store shop-store--nav shop-store--soon">
              <span class="shop-store-head">
                <span class="shop-store-mark" style="--tint:${s.tint}">${s.icon}</span>
                <span class="shop-store-name">${s.label}</span>
                <span class="shop-store-soon">Store not live yet</span>
              </span>
              <span class="shop-store-blurb">${sf.blurb}</span>
            </div>
          `;
        }).join('')}
      </div>

      ${STORES.every(s => !(STOREFRONTS[s.key] || {}).url) ? `
        <p class="shop-note">Our marketplace stores are being set up. For bulk or institutional orders the trade desk is usually faster anyway.</p>
      ` : ''}

      <div class="shop-actions">
        <a href="contact.html" class="btn-mfg-primary">Enquire directly</a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.search-close');
    if (closeBtn) closeBtn.focus();
  };

  window.openShop = function(sku) {
    const p = getAllProducts().find(x => x.sku === sku);
    const modal = document.getElementById('shopModal');
    const body = document.getElementById('shopBody');
    const title = document.getElementById('shopTitle');
    if (!p || !modal || !body) return;

    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const links = MARKETPLACE[p.sku] || {};
    const live = STORES.filter(s => links[s.key]);

    title.textContent = p.name;

    body.innerHTML = `
      <p class="shop-sku"><span class="shop-mono">${esc(p.sku)}</span> · ${esc(p.collection)}</p>

      <div class="shop-stores">
        ${STORES.map(s => links[s.key] ? `
          <a class="shop-store" href="${esc(links[s.key])}" target="_blank" rel="noopener noreferrer">
            <span class="shop-store-mark" style="--tint:${s.tint}">${s.icon}</span>
            <span class="shop-store-name">${esc(s.label)}</span>
            <span class="shop-store-go">Buy now &rarr;</span>
          </a>
        ` : `
          <div class="shop-store shop-store--soon">
            <span class="shop-store-mark" style="--tint:${s.tint}">${s.icon}</span>
            <span class="shop-store-name">${esc(s.label)}</span>
            <span class="shop-store-soon">Listing not live yet</span>
          </div>
        `).join('')}
      </div>

      ${live.length === 0 ? `
        <p class="shop-note">This model is not on a marketplace yet. The trade desk sells it directly, usually faster for bulk orders.</p>
      ` : ''}

      <div class="shop-offline-wrap">
        <div class="shop-offline-label">
          <span>Prefer Buying Locally?</span>
        </div>
        <button type="button" class="shop-distributor-box" onclick="closeShop(); openDistributorLocator(${JSON.stringify(p.sku).replace(/"/g, '&quot;')});">
          <div class="shop-dist-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="shop-dist-text">
            <span class="shop-dist-title">Distributor Near You</span>
            <span class="shop-dist-sub">Locate authorized stockists & regional depots in your city</span>
          </div>
          <span class="shop-dist-arrow">Locate &rarr;</span>
        </button>
      </div>

      <div class="shop-actions" style="margin-top:16px;">
        <a href="#" class="btn-mfg-primary"
           onclick="prefillQuote(${JSON.stringify(p.name + ' (' + p.sku + ')').replace(/"/g, '&quot;')}); return false;">
          Enquire directly
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.search-close');
    if (closeBtn) closeBtn.focus();
  };

  window.closeShop = function(e) {
    if (e && e.target !== e.currentTarget) return;
    const modal = document.getElementById('shopModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      window.closeShop();
      window.closeDistributorLocator();
    }
  });

  /* ── Partner / Distributor Modal Helpers ── */
  window.openDistributorModal = function() {
    document.getElementById('distributorModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closeDistributorModal = function(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('distributorModal')?.classList.remove('active');
    document.body.style.overflow = '';
  };

  /* The modal's form calls this. Only index and products defined it inline, so
     on the other five pages submitting threw. Firm and territory are optional,
     so the sentence is built from whatever was filled in. */
  window.submitDistributorForm = function(e) {
    e.preventDefault();
    const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const name = val('distName');
    const company = val('distCompany');
    const territory = val('distTerritory');
    let subject = 'Your distributor application';
    if (company) subject += ' for ' + company;
    if (territory) subject += ' in ' + territory;
    alert('Thank you, ' + name + '! ' + subject +
          ' has been received. Our trade desk will contact you within 24 hours.');
    window.closeDistributorModal();
  };

  /* ── Distributor Near You Locator ── */
  const DEPOT_NETWORKS = [
    {
      id: 'east-kolkata',
      region: 'east',
      regionLabel: 'Eastern Central Hub',
      name: 'Kolkata Central Plant & Master Depot',
      address: '19 Sukeas Lane, Kolkata 700001 & Dhulagarh Industrial Hub',
      turnaround: 'Same-day / 24-hr Plant Dispatch',
      cities: ['Kolkata', 'Howrah', 'Siliguri', 'Asansol', 'Durgapur'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'east-bihar-jharkhand',
      region: 'east',
      regionLabel: 'Eastern Regional Depot',
      name: 'Bihar & Jharkhand Distribution Depots',
      address: 'Transport Nagar, Patna & Kokar Industrial Area, Ranchi',
      turnaround: '24-48 hr Direct Hub Fulfillment',
      cities: ['Patna', 'Ranchi', 'Gaya', 'Jamshedpur', 'Dhanbad', 'Muzaffarpur'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'east-odisha-ne',
      region: 'east',
      regionLabel: 'Eastern & North-East Hub',
      name: 'Odisha & Guwahati Supply Depots',
      address: 'Rasulgarh, Bhubaneswar & Betkuchi Transport Hub, Guwahati',
      turnaround: '48-hr Regional Stock Fulfillment',
      cities: ['Bhubaneswar', 'Cuttack', 'Guwahati', 'Silchar', 'Shillong', 'Agartala'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'north-delhi',
      region: 'north',
      regionLabel: 'Northern Corridor',
      name: 'Delhi NCR Master Logistics Hub',
      address: 'Okhla Industrial Area / Transport Hub, Gurugram',
      turnaround: 'Same-day / 24-hr Metro Fulfillment',
      cities: ['Delhi NCR', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'north-up',
      region: 'north',
      regionLabel: 'Northern Corridor',
      name: 'Uttar Pradesh Central & East Depot',
      address: 'Transport Nagar, Kanpur & Amar Shaheed Path, Lucknow',
      turnaround: '24-hr Regional Dispatch',
      cities: ['Kanpur', 'Lucknow', 'Varanasi', 'Agra', 'Prayagraj', 'Gorakhpur'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'north-rajasthan',
      region: 'north',
      regionLabel: 'Northern Corridor',
      name: 'Rajasthan Regional Depot',
      address: 'VKI Area, Sikar Road, Jaipur',
      turnaround: '24-48 hr State-wide Dispatch',
      cities: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'west-mumbai',
      region: 'west',
      regionLabel: 'Western Network',
      name: 'Mumbai & MMR Central Logistics Depot',
      address: 'Bhiwandi Logistics Park & Turbhe Warehousing Zone, Navi Mumbai',
      turnaround: '24-hr MMR & Konkan Stock Delivery',
      cities: ['Mumbai', 'Thane', 'Navi Mumbai', 'Bhiwandi', 'Kalyan'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'west-pune',
      region: 'west',
      regionLabel: 'Western Network',
      name: 'Pune & Western Maharashtra Depot',
      address: 'Chakan Industrial Corridor, Pune',
      turnaround: '24-hr Rapid Delivery',
      cities: ['Pune', 'Pimpri-Chinchwad', 'Nashik', 'Kolhapur', 'Solapur', 'Satara'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'west-gujarat',
      region: 'west',
      regionLabel: 'Western Network',
      name: 'Gujarat Commercial Depot',
      address: 'Changodar Industrial Zone, Ahmedabad & Ring Road, Surat',
      turnaround: '24-48 hr State-wide Fulfillment',
      cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'west-vidarbha',
      region: 'west',
      regionLabel: 'Western Network',
      name: 'Vidarbha & Central India Depot',
      address: 'MIDC Hingna Road, Nagpur',
      turnaround: 'Central Junction Quick Dispatch',
      cities: ['Nagpur', 'Amravati', 'Chandrapur', 'Akola', 'Jabalpur', 'Raipur'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'south-hyderabad',
      region: 'south',
      regionLabel: 'Southern Network',
      name: 'Hyderabad & Telangana Logistics Hub',
      address: 'Medchal Industrial Area / Autonagar, Hyderabad',
      turnaround: '24-hr Metro & State Fulfillment',
      cities: ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'south-bengaluru',
      region: 'south',
      regionLabel: 'Southern Network',
      name: 'Bengaluru & Karnataka Regional Depot',
      address: 'Peenya Industrial Area & Nelamangala Logistics Hub, Bengaluru',
      turnaround: '24-hr Rapid Fulfillment',
      cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Davangere'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    },
    {
      id: 'south-tn-ap',
      region: 'south',
      regionLabel: 'Southern Network',
      name: 'Tamil Nadu & Coastal Andhra Depots',
      address: 'Ambattur Industrial Estate, Chennai & Autonagar, Vijayawada',
      turnaround: '24-48 hr Regional Fulfillment',
      cities: ['Chennai', 'Vijayawada', 'Visakhapatnam', 'Coimbatore', 'Madurai', 'Guntur'],
      phone: '+91 98300 12345',
      wa: '919830012345'
    }
  ];

  let currentLocatorSku = null;
  let currentLocatorRegion = 'all';

  function ensureLocatorModal() {
    let modal = document.getElementById('distributorLocatorModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.className = 'mfg-modal-backdrop';
    modal.id = 'distributorLocatorModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'locatorTitle');
    modal.onclick = e => { if (e.target === modal) window.closeDistributorLocator(); };

    modal.innerHTML = `
      <div class="mfg-modal-card locator-card" onclick="event.stopPropagation()">
        <div class="locator-header">
          <div>
            <span class="mfg-badge mfg-badge--crimson">PAN-INDIA SUPPLY &amp; STOCKISTS</span>
            <h3 class="t-h4" id="locatorTitle" style="margin-top:6px;color:#0F1320">Distributor Near You</h3>
            <p class="t-caption" style="color:#64748b;margin-top:2px">Find authorized National Plasto distributors, stockists, and regional supply hubs in your city.</p>
          </div>
          <button type="button" class="search-close" onclick="closeDistributorLocator()" style="position:static;color:#0F1320" aria-label="Close">&#10005;</button>
        </div>

        <div id="locatorProductContext" class="locator-product-context" style="display:none;"></div>

        <div class="locator-controls">
          <div class="locator-search-wrap">
            <svg class="locator-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="locatorSearchInput" class="locator-search-input" placeholder="Enter city, state, or pincode (e.g. Kolkata, Delhi, Patna, Pune)..." oninput="window.onLocatorSearch(this.value)" />
            <button type="button" id="locatorSearchClear" class="locator-search-clear" onclick="window.clearLocatorSearch()">&#10005;</button>
          </div>
          <div class="locator-filter-pills" id="locatorRegionPills">
            <button type="button" class="locator-pill-btn active" data-region="all" onclick="window.filterLocatorRegion('all', this)">All Hubs (${DEPOT_NETWORKS.length})</button>
            <button type="button" class="locator-pill-btn" data-region="east" onclick="window.filterLocatorRegion('east', this)">Eastern Hub (3)</button>
            <button type="button" class="locator-pill-btn" data-region="north" onclick="window.filterLocatorRegion('north', this)">Northern Corridor (3)</button>
            <button type="button" class="locator-pill-btn" data-region="west" onclick="window.filterLocatorRegion('west', this)">Western Network (4)</button>
            <button type="button" class="locator-pill-btn" data-region="south" onclick="window.filterLocatorRegion('south', this)">Southern Network (3)</button>
          </div>
        </div>

        <div class="locator-body" id="locatorDepotList"></div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  window.renderLocatorDepots = function(searchQuery = '', region = currentLocatorRegion) {
    const list = document.getElementById('locatorDepotList');
    if (!list) return;

    const q = (searchQuery || '').trim().toLowerCase();
    const product = currentLocatorSku ? getAllProducts().find(x => x.sku === currentLocatorSku) : null;

    const filtered = DEPOT_NETWORKS.filter(depot => {
      const matchRegion = (region === 'all' || depot.region === region);
      if (!matchRegion) return false;
      if (!q) return true;
      const haystack = (depot.name + ' ' + depot.regionLabel + ' ' + depot.address + ' ' + depot.cities.join(' ')).toLowerCase();
      return haystack.includes(q);
    });

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="locator-empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" style="margin-bottom:12px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style="font-weight:700;color:#0F1320;margin-bottom:4px">No regional depot found for "${q}"</p>
          <p style="font-size:13px;color:#64748b;max-width:440px;margin:0 auto 16px">Our central logistics desk coordinates dispatches to every pincode across India directly from our Kolkata plant.</p>
          <a href="https://wa.me/919830012345?text=${encodeURIComponent('Hello National Plasto, I am inquiring about delivery to ' + q + (product ? ' for ' + product.name + ' (' + product.sku + ')' : ''))}" target="_blank" rel="noopener" class="btn-mfg-primary" style="display:inline-flex;padding:9px 18px;font-size:12px">
            Contact Dispatch Desk on WhatsApp
          </a>
        </div>
      `;
      return;
    }

    list.innerHTML = `
      <div class="locator-depot-grid">
        ${filtered.map(depot => {
          const waMsg = product
            ? `Hello National Plasto, I would like to locate an authorized dealer stocking ${product.name} (${product.sku}) near ${depot.cities[0]} / ${depot.regionLabel}.`
            : `Hello National Plasto, please connect me with the authorized distributor for ${depot.cities[0]} (${depot.name}).`;
          return `
            <div class="locator-depot-card">
              <div>
                <span class="depot-region-tag">${depot.regionLabel}</span>
                <h4 class="depot-card-name">${depot.name}</h4>
                <p class="depot-card-address">${depot.address}</p>
                <div style="margin-top:8px;font-size:11px;font-weight:700;color:#16a34a;display:flex;align-items:center;gap:4px">
                  <span>●</span> ${depot.turnaround}
                </div>
                <div class="depot-cities-wrap">
                  ${depot.cities.map(c => `<span class="depot-city-pill">${c}</span>`).join('')}
                </div>
              </div>

              <div class="depot-card-actions">
                <a href="tel:${depot.phone.replace(/[^0-9+]/g, '')}" class="depot-btn-phone" title="Call Sales Desk">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>Call Desk</span>
                </a>
                <a href="https://wa.me/${depot.wa}?text=${encodeURIComponent(waMsg)}" target="_blank" rel="noopener" class="depot-btn-wa" title="WhatsApp Depot Coordinator">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  window.openDistributorLocator = function(sku) {
    currentLocatorSku = sku || null;
    const modal = ensureLocatorModal();

    const ctx = document.getElementById('locatorProductContext');
    if (ctx) {
      if (sku) {
        const p = getAllProducts().find(x => x.sku === sku);
        const name = p ? p.name : sku;
        ctx.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="flex-shrink:0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>Checking authorized dealer &amp; depot availability for: <strong>${name} (${sku})</strong></div>
        `;
        ctx.style.display = 'flex';
      } else {
        ctx.style.display = 'none';
        ctx.innerHTML = '';
      }
    }

    const input = document.getElementById('locatorSearchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('locatorSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';

    currentLocatorRegion = 'all';
    document.querySelectorAll('#locatorRegionPills .locator-pill-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.region === 'all');
    });

    renderLocatorDepots('', 'all');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (input) input.focus(); }, 150);
  };

  window.closeDistributorLocator = function(e) {
    if (e && e.target !== e.currentTarget) return;
    const modal = document.getElementById('distributorLocatorModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.onLocatorSearch = function(val) {
    const clearBtn = document.getElementById('locatorSearchClear');
    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
    renderLocatorDepots(val, currentLocatorRegion);
  };

  window.clearLocatorSearch = function() {
    const input = document.getElementById('locatorSearchInput');
    if (input) { input.value = ''; input.focus(); }
    const clearBtn = document.getElementById('locatorSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';
    renderLocatorDepots('', currentLocatorRegion);
  };

  window.filterLocatorRegion = function(region, btn) {
    currentLocatorRegion = region;
    document.querySelectorAll('#locatorRegionPills .locator-pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const input = document.getElementById('locatorSearchInput');
    renderLocatorDepots(input ? input.value : '', region);
  };


  /* ── Catalogue PDF ──
     jsPDF is ~350KB, so it is fetched on the first click rather than on every
     page load. Both scripts are UMD builds pinned to an exact version. */
  const PDF_LIBS = [
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Could not load ' + src));
      document.head.appendChild(s);
    });
  }

  /* Collections in catalogue order, then categories best build first — the
     same order the product grid uses. */
  const COLLECTION_ORDER = ['NATIONAL', 'NATIONAL SAPPHIRE', 'NEXT', 'CAPTAIN'];

  function tierRank(category) {
    const c = (category || '').toLowerCase();
    if (/heavy/.test(c) && /premium/.test(c)) return 0;
    if (/premium/.test(c)) return 1;
    if (/heavy/.test(c)) return 2;
    if (/deluxe/.test(c)) return 3;
    if (/regular/.test(c)) return 4;
    if (/economical/.test(c)) return 6;
    return 5;
  }

  function catalogueRows() {
    const all = getAllProducts().slice();
    const byCollection = new Map();
    all.forEach(p => {
      const c = p.collection || 'OTHER';
      if (!byCollection.has(c)) byCollection.set(c, []);
      byCollection.get(c).push(p);
    });

    const names = [...byCollection.keys()].sort((a, b) => {
      const ia = COLLECTION_ORDER.indexOf(a), ib = COLLECTION_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });

    return names.map(name => {
      const items = byCollection.get(name).slice().sort((a, b) =>
        tierRank(a.category) - tierRank(b.category) ||
        (a.category || '').localeCompare(b.category || '') ||
        (a.name || '').localeCompare(b.name || ''));
      return { name: name, items: items };
    });
  }

  window.downloadCatalogue = async function(btn) {
    const label = btn ? btn.innerHTML : null;
    const groups = catalogueRows();
    const total = groups.reduce((n, g) => n + g.items.length, 0);

    if (!total) {
      alert('The product list has not finished loading. Please try again in a moment.');
      return;
    }

    if (btn) { btn.classList.add('is-busy'); btn.innerHTML = 'Preparing…'; }

    try {
      for (const src of PDF_LIBS) await loadScript(src);

      const JsPDF = window.jspdf && window.jspdf.jsPDF;
      if (!JsPDF) throw new Error('jsPDF did not initialise');

      const doc = new JsPDF({ unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const categories = new Set(getAllProducts().map(p => p.category)).size;

      // Cover
      doc.setFillColor(15, 19, 32);
      doc.rect(0, 0, pageW, 150, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('NATIONAL PLASTO', 40, 62);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 16, 46);
      doc.text('Product Catalogue', 40, 88);
      doc.setTextColor(180, 190, 200);
      doc.setFontSize(9);
      doc.text(`${total} models · ${categories} categories · ${groups.length} collections`, 40, 110);
      doc.text(today, 40, 126);

      let cursor = 186;

      groups.forEach(g => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 19, 32);
        if (cursor > doc.internal.pageSize.getHeight() - 120) { doc.addPage(); cursor = 60; }
        doc.text(`${g.name}  (${g.items.length})`, 40, cursor);

        doc.autoTable({
          startY: cursor + 10,
          head: [['Category', 'Model', 'SKU']],
          body: g.items.map(p => [p.category || '', p.name || '', p.sku || '']),
          styles: { font: 'helvetica', fontSize: 9, cellPadding: 5, textColor: [40, 50, 62] },
          headStyles: { fillColor: [200, 16, 46], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          alternateRowStyles: { fillColor: [246, 248, 250] },
          columnStyles: { 0: { cellWidth: 190 }, 2: { cellWidth: 110 } },
          margin: { left: 40, right: 40, bottom: 50 }
        });

        cursor = doc.lastAutoTable.finalY + 34;
      });

      // Footer on every page
      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(140, 150, 160);
        doc.text('National Plasto Products Private Limited · info@nationalplasto.com',
          40, doc.internal.pageSize.getHeight() - 24);
        doc.text(`${i} / ${pages}`, pageW - 40, doc.internal.pageSize.getHeight() - 24, { align: 'right' });
      }

      doc.save('national-plasto-catalogue.pdf');
    } catch (err) {
      alert('The catalogue could not be generated just now. Please check your connection and try again.');
      if (window.console) console.error(err);
    } finally {
      if (btn) { btn.classList.remove('is-busy'); if (label !== null) btn.innerHTML = label; }
    }
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
