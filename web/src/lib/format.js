export function shorten(addr, n = 4) {
  if (!addr) return '';
  return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}

