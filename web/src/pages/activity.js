import { createFooter } from '../components/footer.js';
import { getActivity } from '../api.js';
import { navigate } from '../router.js';
import { timeAgo, shorten, escapeHtml } from '../lib/format.js';
import { emptyState } from '../components/empty.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

// Mirrors cognito's activity page: header + filter tabs + animated feed.
// Event types are registry events instead of trade actions.
const COLORS = {
  REGISTER: '#a78bfa',
  HEARTBEAT: '#34d399',
  RENEW: '#60a5fa',
  TRANSFER: '#fbbf24',
  UPDATE: '#71717a',
};
const BG = {
  REGISTER: 'rgba(167,139,250,0.05)',
  HEARTBEAT: 'rgba(52,211,153,0.05)',
  RENEW: 'rgba(96,165,250,0.05)',
  TRANSFER: 'rgba(251,191,36,0.05)',
  UPDATE: 'rgba(255,255,255,0.02)',
};

export function activityPage(app) {
  app.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'min-height:100vh; padding:120px 24px 0;';
