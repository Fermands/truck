'use strict';

/* ════════════════════════════════════════════
   SPLIT TEXT  — per-character span wrapping
════════════════════════════════════════════ */
function splitText(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  [...text].forEach(char => {
    const outer = document.createElement('span');
    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
    const inner = document.createElement('span');
    inner.style.cssText = 'display:inline-block;';
    inner.classList.add('_char');
    inner.textContent = char === ' ' ? ' ' : char;
    outer.appendChild(inner);
    el.appendChild(outer);
  });
}

/* ════════════════════════════════════════════
   HEADING CLIP REVEAL  — overflow:hidden wrap
════════════════════════════════════════════ */
function initHeadingReveal() {
  document.querySelectorAll('[data-heading-reveal]').forEach(el => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'overflow:hidden;display:block;';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

/* ════════════════════════════════════════════
   LOADER EXIT  → then fire page-load anim
════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  // Loader CSS animations run for ~2s, then GSAP curtains it up
  gsap.to(loader, {
    yPercent: -100,
    duration: 1.1,
    ease: 'power4.inOut',
    delay: 2.2,
    onComplete() {
      loader.style.display = 'none';
      document.body.classList.remove('is-loading');
      initPageLoad();
    }
  });
}

/* ════════════════════════════════════════════
   PAGE LOAD ANIMATION  (runs after loader)
════════════════════════════════════════════ */
function initPageLoad() {
  const nav   = document.querySelector('.nav');
  const chars = document.querySelectorAll('.hero__title ._char');
  const dots  = document.querySelector('.hero__dots');
  const hint  = document.querySelector('.hero__scroll-hint');

  gsap.set(nav,   { y: -90, opacity: 0 });
  gsap.set(chars, { y: '115%' });
  gsap.set(dots,  { opacity: 0, y: 20 });
  if (hint) gsap.set(hint, { opacity: 0, y: 12 });

  const tl = gsap.timeline();

  tl.to(nav, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' })
    .to(chars, {
      y: '0%',
      stagger: 0.045,
      duration: 1.1,
      ease: 'power4.out'
    }, '-=0.6')
    .to(dots, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to(hint, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
}

/* ════════════════════════════════════════════
   CURSOR FOLLOWER  (desktop only)
════════════════════════════════════════════ */
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot,  { x: mx, y: my, duration: 0.08, ease: 'none' });
    gsap.to(ring, { x: mx, y: my, duration: 0.45, ease: 'power2.out' });
  });

  // Scale ring on interactive elements
  const targets = 'a, button, .card, .cap-card, .team-member, .partner-logo';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(ring, { scale: 1.9, opacity: 0.5, duration: 0.35 }));
    el.addEventListener('mouseleave', () => gsap.to(ring, { scale: 1,   opacity: 1,   duration: 0.35 }));
  });
}

/* ════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    gsap.set(bar, { scaleX: window.scrollY / total, transformOrigin: 'left' });
  }, { passive: true });
}

/* ════════════════════════════════════════════
   NAV TRANSPARENCY  — IntersectionObserver
════════════════════════════════════════════ */
function initNavScroll() {
  const nav  = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  const io   = new IntersectionObserver(
    ([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting),
    { rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }
  );
  io.observe(hero);
}

/* ════════════════════════════════════════════
   MENU PANEL
════════════════════════════════════════════ */
function initMenuPanel() {
  const openBtn  = document.getElementById('menuOpen');
  const closeBtn = document.getElementById('menuClose');
  const panel    = document.getElementById('menuPanel');
  const overlay  = document.getElementById('menuOverlay');
  const links    = panel.querySelectorAll('.mp-link');
  const cta      = panel.querySelector('.menu-panel__cta-btn');
  const info     = panel.querySelector('.menu-panel__info');

  function openMenu() {
    panel.classList.add('is-open');
    overlay.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');

    gsap.fromTo(links,
      { x: 28, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.25 }
    );
    gsap.to(cta,  { opacity: 1, duration: 0.5, delay: 0.65, ease: 'power2.out' });
    gsap.to(info, { opacity: 1, duration: 0.5, delay: 0.8,  ease: 'power2.out' });
  }

  function closeMenu() {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    panel.setAttribute('aria-hidden', 'true');
    gsap.to([...links, cta, info], { opacity: 0, x: 16, duration: 0.25, stagger: 0.03 });
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  links.forEach(l => l.addEventListener('click', closeMenu));
}

/* ════════════════════════════════════════════
   SECTION LABEL LINE DRAW
════════════════════════════════════════════ */
function initSectionLabels() {
  document.querySelectorAll('.section-label__line').forEach(line => {
    gsap.to(line, {
      scaleX: 1,
      transformOrigin: 'left',
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: { trigger: line, start: 'top 90%', once: true }
    });
  });
}

/* ════════════════════════════════════════════
   GENERIC SCROLL REVEAL  — [data-reveal]
════════════════════════════════════════════ */
function initScrollReveal() {
  ScrollTrigger.batch('[data-reveal]', {
    onEnter: els => {
      gsap.fromTo(els,
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 1.0, ease: 'power3.out' }
      );
    },
    start: 'top 87%',
    once: true
  });
}

/* ════════════════════════════════════════════
   HEADING ANIMATIONS  — [data-heading-reveal]
════════════════════════════════════════════ */
function initHeadingAnimations() {
  document.querySelectorAll('[data-heading-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.fromTo(el,
      { y: '105%' },
      {
        y: '0%',
        duration: 1.2,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el.parentNode,
          start: 'top 83%',
          once: true
        }
      }
    );
  });
}

/* ════════════════════════════════════════════
   STAT COUNTERS with scale
════════════════════════════════════════════ */
function initCounters() {
  document.querySelectorAll('.stats__number').forEach(el => {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[\d]/g, '');
    const target = parseInt(raw.replace(/\D/g, ''), 10);
    const isYear = target > 1900 && target < 2200;
    const from   = isYear ? target - 35 : 0;
    const dur    = isYear ? 1.5 : Math.min(2.0, target / 120);
    const counter = { val: from };

    gsap.fromTo(el,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      }
    );

    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter() {
        gsap.to(counter, {
          val: target,
          duration: dur,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(counter.val).toLocaleString() + suffix;
          }
        });
      }
    });
  });
}

/* ════════════════════════════════════════════
   CARD STAGGERS
════════════════════════════════════════════ */
function initCardAnimations() {
  const cardsGrid = document.querySelector('.cards-grid');
  if (cardsGrid) {
    gsap.fromTo('[data-card]',
      { y: 55, opacity: 0, scale: 0.97 },
      {
        y: 0, opacity: 1, scale: 1,
        stagger: 0.12,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardsGrid, start: 'top 80%', once: true }
      }
    );
  }

  const capGrid = document.querySelector('.capabilities__cards');
  if (capGrid) {
    gsap.fromTo('[data-cap-card]',
      { y: 55, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: 0.13,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: capGrid, start: 'top 80%', once: true }
      }
    );
  }
}

/* ════════════════════════════════════════════
   TEAM MEMBERS — clip reveal + stagger slide
════════════════════════════════════════════ */
function initTeamAnimation() {
  const members = document.querySelectorAll('[data-team-member]');
  const grid    = document.querySelector('.team__grid');
  if (!grid) return;

  members.forEach((el, i) => {
    const fromX = i % 2 === 0 ? -60 : 60;
    gsap.fromTo(el,
      { x: fromX, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 1.0,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true }
      }
    );
  });
}

/* ════════════════════════════════════════════
   OVERVIEW IMAGES — clip wipe + parallax
════════════════════════════════════════════ */
function initOverviewImages() {
  const wrap  = document.querySelector('.overview__images');
  if (!wrap) return;
  const back  = wrap.querySelector('.overview__img--back');
  const front = wrap.querySelector('.overview__img--front');

  // Clip-path reveal on scroll enter
  gsap.fromTo(back,
    { clipPath: 'inset(100% 0 0 0)', y: 20 },
    { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.3, ease: 'power4.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%', once: true } }
  );
  gsap.fromTo(front,
    { clipPath: 'inset(100% 0 0 0)', y: 20 },
    { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.3, delay: 0.22, ease: 'power4.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%', once: true } }
  );

  // Depth parallax while scrolling
  if (!('ontouchstart' in window)) {
    gsap.to(back,  {
      y: -55, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
    gsap.to(front, {
      y: -90, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  }
}

/* ════════════════════════════════════════════
   HERO PARALLAX + VIDEO SCALE
════════════════════════════════════════════ */
function initHeroParallax() {
  const hero  = document.querySelector('.hero');
  const video = document.querySelector('.hero__video-wrap');
  if (!hero) return;

  if (!('ontouchstart' in window)) {
    gsap.to(hero, {
      backgroundPositionY: '40%',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
    if (video) {
      gsap.to(video, {
        scale: 1.1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 }
      });
    }
  }
}

/* ════════════════════════════════════════════
   STATS SECTION — number scale on scroll
════════════════════════════════════════════ */
function initStatScrub() {
  if ('ontouchstart' in window) return;
  document.querySelectorAll('.stat-item').forEach(el => {
    gsap.fromTo(el.querySelector('.stats__number'),
      { x: -20 },
      {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: 1.5 }
      }
    );
  });
}

/* ════════════════════════════════════════════
   CTA SECTION
════════════════════════════════════════════ */
function initCTA() {
  const cta = document.querySelector('.cta');
  if (!cta) return;
  gsap.fromTo('.cta__subtitle, .cta__btn',
    { y: 28, opacity: 0 },
    {
      y: 0, opacity: 1, stagger: 0.15, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: cta, start: 'top 78%', once: true }
    }
  );
}

/* ════════════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════════════ */
function initMagneticButtons() {
  if ('ontouchstart' in window) return;
  document.querySelectorAll('.btn-pill').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      gsap.to(btn, { x, y, duration: 0.5, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ════════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    gsap.to(window, { scrollTo: 0, duration: 1.4, ease: 'power4.inOut' });
  });
}

/* ════════════════════════════════════════════
   FOOTER PHONE PARALLAX
════════════════════════════════════════════ */
function initFooterAnim() {
  const phone = document.querySelector('.footer__phone');
  if (!phone) return;
  gsap.fromTo(phone,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: phone, start: 'top 88%', once: true }
    }
  );
}

/* ════════════════════════════════════════════
   BOOT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Try registering ScrollTo (gracefully skip if not loaded)
  try { gsap.registerPlugin(window.ScrollToPlugin); } catch (_) {}

  // 1. Split hero text before any animation runs
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) splitText(heroTitle);

  // 2. Wrap heading elements (DOM mutations before ScrollTrigger init)
  initHeadingReveal();

  // 3. Loader exit → triggers initPageLoad on complete
  initLoader();

  // 4. Non-animation setup (runs immediately, independent of loader)
  initNavScroll();
  initMenuPanel();
  initBackToTop();
  initScrollProgress();
  initCursor();

  // 5. ScrollTrigger animations
  initSectionLabels();
  initScrollReveal();
  initHeadingAnimations();
  initOverviewImages();
  initHeroParallax();
  initCardAnimations();
  initTeamAnimation();
  initCounters();
  initStatScrub();
  initCTA();
  initFooterAnim();
  initMagneticButtons();

  // 6. Recalculate all positions after DOM mutations
  ScrollTrigger.refresh();
});
