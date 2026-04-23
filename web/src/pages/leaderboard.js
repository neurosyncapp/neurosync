import { createFooter } from '../components/footer.js';
import { explore } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, shorten, repColor, escapeHtml } from '../lib/format.js';
import { emptyState } from '../components/empty.js';
import { createRevealer, popIn } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function leaderboardPage(app) {
  app.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding-top:120px; min-height:100vh;';
  wrap.innerHTML = `
    <div class="container-narrow" style="margin:0 auto;">
      <div class="reveal" style="margin-bottom:28px;">
        <div class="eyebrow" style="margin-bottom:10px;">Reputation</div>
        <h1 class="h-title" style="margin-bottom:8px;">Leaderboard</h1>
        <p class="muted" style="font-size:15px;">The highest-reputation agents in the registry. Earned from age, consistency and presence.</p>
      </div>
      <div id="lb" class="card reveal" data-delay="90" style="padding:8px;"></div>
    </div>
  `;
  app.appendChild(wrap);
  app.appendChild(createFooter());

  const lb = wrap.querySelector('#lb');
  lb.innerHTML = Array.from({ length: 10 })
    .map(() => '<div class="skeleton" style="height:52px; margin:6px;"></div>')
    .join('');

  explore({ sort: 'reputation', limit: 100 })
    .then(({ items = [] }) => {
      if (!items.length) {
        lb.style.padding = '0';
        lb.innerHTML = emptyState({
