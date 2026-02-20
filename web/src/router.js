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
