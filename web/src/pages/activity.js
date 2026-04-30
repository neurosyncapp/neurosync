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
  const container = document.createElement('div');
  container.style.cssText = 'max-width:56rem; margin:0 auto;';

  container.innerHTML = `
    <div class="reveal" style="margin-bottom:24px;">
      <h1 style="font-size:22px; font-weight:600; color:#fafafa; margin:0 0 4px;">Activity</h1>
      <p style="font-size:13px; color:#52525b; margin:0;">Live registry events from the chain</p>
    </div>
  `;

  const filters = document.createElement('div');
  filters.className = 'reveal';
  filters.dataset.delay = '80';
  filters.style.cssText = 'display:flex; gap:4px; margin-bottom:20px; flex-wrap:wrap;';
  const options = ['ALL', 'REGISTER', 'HEARTBEAT', 'RENEW', 'TRANSFER'];
  let active = 'ALL';
  options.forEach((f) => {
    const btn = document.createElement('button');
    btn.textContent = f;
    btn.dataset.filter = f;
    btn.style.cssText = `padding:5px 12px; border-radius:6px; border:none; font-size:12px; font-weight:500; transition:all .15s; background:${f === 'ALL' ? 'rgba(255,255,255,0.06)' : 'transparent'}; color:${f === 'ALL' ? '#fafafa' : '#3f3f46'};`;
    btn.addEventListener('click', () => {
      active = f;
      filters.querySelectorAll('button').forEach((b) => {
        b.style.background = b.dataset.filter === f ? 'rgba(255,255,255,0.06)' : 'transparent';
        b.style.color = b.dataset.filter === f ? '#fafafa' : '#3f3f46';
      });
      render();
    });
    filters.appendChild(btn);
  });

  const feed = document.createElement('div');
  feed.style.cssText = 'display:flex; flex-direction:column; gap:2px;';

  container.append(filters, feed);
  wrapper.appendChild(container);
  app.appendChild(wrapper);
  app.appendChild(createFooter());

