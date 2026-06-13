'use strict';

/* =============================================
   SPLIT TEXT — per-character span wrapping
   ============================================= */
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

/* =============================================
   HEADING CLIP REVEAL — wraps each [data-heading-reveal]
   in an overflow:hidden container so text slides up
   ============================================= */
function initHeadingReveal() {
  document.querySelectorAll('[data-heading-reveal]').forEach(el => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'overflow:hidden;display:block;';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

/* =============================================
   PAGE LOAD ANIMATION
   ============================================= */
function initPageLoad() {
  const nav    = document.querySelector('.nav');
  const chars  = document.querySelectorAll('.hero__title ._char');
  const dots   = document.querySelector('.hero__dots');

  gsap.set(nav,   { y: -90, opacity: 0 });
  gsap.set(chars, { y: '115%' });
  gsap.set(dots,  { opacity: 0, y: 18 });

  const tl = gsap.timeline({ delay: 0.15 });

  tl.to(nav, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    .to(chars, {
      y: '0%',
      stagger: 0.04,
      duration: 0.85,
      ease: 'power4.out'
    }, '-=0.5')
    .to(dots, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');
}

/* =============================================
   NAV SCROLL TRANSPARENCY — IntersectionObserver
   ============================================= */
function initNavScroll() {
  const nav  = document.querySelector('.nav');
  const hero = document.querySelector('.hero');

  const io = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('is-scrolled', !entry.isIntersecting),
    { rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }
  );
  io.observe(hero);
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__hamburger');
  const menu   = document.querySelector('.nav__mobile-menu');
  const links  = document.querySelectorAll('.nav__mobile-link');

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-active', open);

    if (open) {
      gsap.fromTo(links,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(links, { opacity: 0, x: 20, duration: 0.2, stagger: 0.03 });
    }
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
    });
  });
}

/* =============================================
   GENERIC SCROLL REVEAL — [data-reveal]
   ============================================= */
function initScrollReveal() {
  ScrollTrigger.batch('[data-reveal]', {
    onEnter: elements => {
      gsap.fromTo(elements,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.75, ease: 'power3.out' }
      );
    },
    start: 'top 87%',
    once: true
  });
}

/* =============================================
   HEADING CLIP ANIMATION — [data-heading-reveal]
   ============================================= */
function initHeadingAnimations() {
  document.querySelectorAll('[data-heading-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);

    gsap.fromTo(el,
      { y: '102%' },
      {
        y: '0%',
        duration: 1.0,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el.parentNode, // the overflow:hidden wrapper
          start: 'top 82%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}

/* =============================================
   STATS COUNTER
   ============================================= */
function initCounters() {
  document.querySelectorAll('.stats__number').forEach(el => {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[\d]/g, '');
    const target = parseInt(raw.replace(/\D/g, ''), 10);

    // Years count from target-30, others from 0
    const isYear = target > 1900 && target < 2200;
    const from   = isYear ? target - 30 : 0;
    const dur    = isYear ? 1.2 : Math.min(1.6, target / 150);

    const counter = { val: from };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
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

/* =============================================
   CARD STAGGERS
   ============================================= */
function initCardAnimations() {
  // 2×2 navigation cards
  const cardsGrid = document.querySelector('.cards-grid');
  if (cardsGrid) {
    gsap.fromTo('[data-card]',
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsGrid,
          start: 'top 80%',
          once: true
        }
      }
    );
  }

  // Capabilities cards
  const capGrid = document.querySelector('.capabilities__cards');
  if (capGrid) {
    gsap.fromTo('[data-cap-card]',
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: capGrid,
          start: 'top 80%',
          once: true
        }
      }
    );
  }
}

/* =============================================
   TEAM SLIDE-IN
   ============================================= */
function initTeamAnimation() {
  const members = document.querySelectorAll('[data-team-member]');
  const grid    = document.querySelector('.team__grid');
  if (!grid) return;

  members.forEach((el, i) => {
    const fromX = i % 2 === 0 ? -55 : 55;
    gsap.fromTo(el,
      { x: fromX, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.85,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          once: true
        }
      }
    );
  });
}

/* =============================================
   OVERVIEW IMAGES
   ============================================= */
function initOverviewImages() {
  const wrap = document.querySelector('.overview__images');
  if (!wrap) return;

  const back  = wrap.querySelector('.overview__img--back');
  const front = wrap.querySelector('.overview__img--front');

  gsap.fromTo(back,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%', once: true } }
  );
  gsap.fromTo(front,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, delay: 0.18, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%', once: true } }
  );
}

/* =============================================
   HERO PARALLAX (desktop only)
   ============================================= */
function initParallax() {
  if ('ontouchstart' in window) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  gsap.to(hero, {
    backgroundPositionY: '40%',
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5
    }
  });
}

/* =============================================
   CTA SECTION FADE
   ============================================= */
function initCTA() {
  const cta = document.querySelector('.cta');
  if (!cta) return;

  gsap.fromTo('.cta__subtitle, .cta .btn-pill',
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: cta, start: 'top 78%', once: true }
    }
  );
}

/* =============================================
   BACK TO TOP SMOOTH
   ============================================= */
function initBackToTop() {
  const btn = document.querySelector('.footer__back-to-top');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   SECTION LABEL LINE ANIMATION
   ============================================= */
function initSectionLabels() {
  document.querySelectorAll('.section-label').forEach(label => {
    const line = label.querySelector('.section-label__line');
    gsap.fromTo(line,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: label, start: 'top 88%', once: true }
      }
    );
  });
}

/* =============================================
   BOOT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Register GSAP plugin
  gsap.registerPlugin(ScrollTrigger);

  // 2. Prepare split text on hero (must happen before page load anim)
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) splitText(heroTitle);

  // 3. Wrap heading elements for clip animation (DOM mutations first)
  initHeadingReveal();

  // 4. Page load sequence
  initPageLoad();

  // 5. Nav transparency
  initNavScroll();

  // 6. Mobile menu
  initMobileMenu();

  // 7. Back to top
  initBackToTop();

  // 8. Parallax
  initParallax();

  // 9. Section label lines
  initSectionLabels();

  // 10. Scroll-triggered animations
  initScrollReveal();
  initHeadingAnimations();
  initOverviewImages();
  initCardAnimations();
  initTeamAnimation();
  initCounters();
  initCTA();

  // 11. Recalculate after all DOM mutations
  ScrollTrigger.refresh();
});
