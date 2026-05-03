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

  const style = document.createElement('style');
  style.textContent = '@keyframes actFadeIn{to{opacity:1; transform:translateY(0);}}';
  app.appendChild(style);

  const reveal = createRevealer();
  reveal.mount(wrapper);

  let all = [];
  function render() {
    feed.innerHTML = '';
    const items = active === 'ALL' ? all : all.filter((d) => d.type === active);
    if (!items.length) {
      feed.innerHTML = active === 'ALL'
        ? emptyState({
            icon: 'activity',
            title: 'Nothing has happened yet',
            text: 'Registrations, heartbeats, transfers and renewals stream in here live as agents come online.',
            ctaLabel: 'Claim a handle',
            ctaHref: '/register',
          })
        : `<div style="padding:48px; text-align:center; color:#3f3f46; font-size:13px;">No ${active.toLowerCase()} events yet.</div>`;
      return;
    }
    items.forEach((d, i) => {
      const color = COLORS[d.type] || '#fafafa';
      const bg = BG[d.type] || 'rgba(255,255,255,0.02)';
      const card = document.createElement('div');
      card.style.cssText = `padding:14px 16px; border-radius:8px; background:${bg}; opacity:0; transform:translateY(4px); animation:actFadeIn .2s ease forwards; animation-delay:${Math.min(i * 0.03, 0.5)}s; cursor:pointer;`;
      card.innerHTML = `
        <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:4px; flex-wrap:wrap;">
          <span style="font-size:11px; font-weight:600; color:${color}; text-transform:uppercase; letter-spacing:0.5px;">${d.type}</span>
          <span class="mono" style="font-size:13px; color:#e4e4e7;">${escapeHtml(d.name)}<span style="color:#52525b;">${SUFFIX}</span></span>
          <span style="font-size:11px; color:#27272a;">${timeAgo(d.ts)}</span>
          ${d.tx ? `<a href="https://solscan.io/tx/${d.tx}" target="_blank" rel="noopener" style="font-size:11px; color:#3f3f46; margin-left:auto;">tx ↗</a>` : ''}
        </div>
        <div style="font-size:13px; color:#71717a;">${eventLine(d)}</div>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        navigate(`/agent/${d.name}`);
      });
      feed.appendChild(card);
    });
  }

  async function load() {
    feed.innerHTML = Array.from({ length: 6 }).map(() => '<div class="skeleton" style="height:54px; margin-bottom:2px;"></div>').join('');
    try {
      const { items = [] } = await getActivity(60);
      all = items;
      render();
    } catch {
      feed.innerHTML = '<div style="padding:48px; text-align:center; color:#52525b; font-size:13px;">Could not load activity.</div>';
    }
  }

  load();
  const poll = setInterval(load, 20000);
  return () => {
    clearInterval(poll);
    reveal.destroy();
  };
}

function eventLine(d) {
  switch (d.type) {
    case 'REGISTER':
      return `Registered by ${shorten(d.owner)}`;
    case 'HEARTBEAT':
      return `Heartbeat from ${shorten(d.owner)}`;
