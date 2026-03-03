export function shorten(addr, n = 4) {
  if (!addr) return '';
  return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}

export function timeAgo(ts) {
  if (!ts) return 'never';
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 0) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

// An agent is "online" if it heartbeat within the freshness window (default 5 min).
export function isOnline(lastSeen, windowMs = 5 * 60 * 1000) {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < windowMs;
}

export function repColor(score) {
  if (score >= 75) return 'var(--accent-bright)';
  if (score >= 40) return 'var(--accent)';
  return 'var(--text-muted)';
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
