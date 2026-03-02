// Shared reveal-on-scroll / on-load system.
// Elements tagged with a reveal class start hidden (see style.css) and get the
// `in` class when they enter the viewport. Above-the-fold elements fire almost
// immediately, so the same mechanism doubles as a staggered load entrance.

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur';

export function mountReveals(root = document, { stagger = 0 } = {}) {
  const els = Array.from(root.querySelectorAll(REVEAL_SELECTOR)).filter(
    (el) => !el.classList.contains('in')
  );
  if (!els.length) return { disconnect() {} };

  if (stagger) {
    els.forEach((el, i) => {
      if (!el.dataset.delay) el.dataset.delay = String(i * stagger);
    });
  }

  const reveal = (el) => {
    const d = el.dataset.delay;
    if (d) el.style.transitionDelay = `${d}ms`;
    el.classList.add('in');
  };

  if (typeof IntersectionObserver === 'undefined') {
    els.forEach(reveal);
    return { disconnect() {} };
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' }
  );

  // Paint the hidden (opacity:0) state for at least one frame before observing,
  // otherwise the browser can coalesce the change and skip the transition for
  // elements that are already on screen at load.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      els.forEach((el) => io.observe(el));
    })
  );

  return io;
}

// Tracks every observer a page creates so a single destroy() cleans them all up
// when the route unmounts.
export function createRevealer() {
  const ios = [];
  return {
    mount(root = document, opts = {}) {
      ios.push(mountReveals(root, opts));
    },
    destroy() {
      ios.forEach((io) => io.disconnect && io.disconnect());
      ios.length = 0;
    },
  };
}

// Apply a staggered `.pop` entrance to freshly rendered list items.
export function popIn(elements, step = 45) {
  Array.from(elements).forEach((el, i) => {
    el.classList.add('pop');
    el.style.animationDelay = `${i * step}ms`;
    el.addEventListener(
      'animationend',
