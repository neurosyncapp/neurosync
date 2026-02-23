// Tiny hash-free SPA router with :param support.
const routes = [];
let currentCleanup = null;

export function route(pattern, handler) {
  // pattern like '/', '/explore', '/agent/:name'
  const keys = [];
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/\//g, '\\/')
        .replace(/:(\w+)/g, (_, k) => {
          keys.push(k);
          return '([^\\/]+)';
        }) +
      '\\/?$'
  );
  routes.push({ regex, keys, handler });
}

function match(path) {
  for (const r of routes) {
    const m = path.match(r.regex);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return { handler: r.handler, params };
    }
  }
  return null;
}

export function navigate(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, '', path);
  render();
}

export function render() {
  const path = window.location.pathname;
  const app = document.getElementById('app');

  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const hit = match(path) || match('/');
  window.scrollTo(0, 0);
  if (hit) currentCleanup = hit.handler(app, hit.params || {});
}

export function initRouter() {
  window.addEventListener('popstate', render);
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || link.target === '_blank') return;
    e.preventDefault();
