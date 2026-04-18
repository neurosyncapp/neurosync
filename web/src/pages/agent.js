import { createFooter } from '../components/footer.js';
import { getAgent } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, shorten, repColor, escapeHtml } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function agentPage(app, params) {
  app.innerHTML = '';
  const name = (params.name || '').replace(/\.agent$/, '');

  const wrap = document.createElement('div');
  wrap.style.cssText = 'min-height:100vh; padding:120px 24px 0;';
  wrap.innerHTML = `<div class="container-narrow" style="margin:0 auto;"><div id="agent-body"></div></div>`;
  app.appendChild(wrap);
  app.appendChild(createFooter());
  const body = wrap.querySelector('#agent-body');

  body.innerHTML = `<div class="skeleton" style="height:220px; margin-bottom:14px;"></div><div class="skeleton" style="height:140px;"></div>`;

  const reveal = createRevealer();
  getAgent(name)
    .then((a) => {
      render(body, a);
      reveal.mount(body, { stagger: 90 });
    })
    .catch((err) => {
      const notFound = String(err.message).startsWith('404');
      body.innerHTML = `
        <div class="reveal" style="text-align:center; padding:60px 0;">
          <div class="mono" style="font-size:26px; color:#f4f4f6; margin-bottom:10px;">${escapeHtml(name)}<span style="color:#52525b;">${SUFFIX}</span></div>
          <p class="muted" style="margin-bottom:24px;">${notFound ? 'This handle is unregistered.' : 'Could not load this handle.'}</p>
          ${notFound ? `<a href="/register?name=${encodeURIComponent(name)}" data-link class="btn btn-primary">Claim it</a>` : ''}
        </div>`;
      reveal.mount(body);
    });

  return () => reveal.destroy();
}

function render(body, a) {
  const online = isOnline(a.lastSeen);
  const rep = a.reputation ?? 0;
  const caps = Array.isArray(a.capabilities) ? a.capabilities : [];
  const links = a.links || {};
  body.innerHTML = `
    <div class="card reveal" style="padding:28px; margin-bottom:14px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <div class="mono" style="font-size:26px; color:#f4f4f6; word-break:break-all;">${escapeHtml(a.name)}<span style="color:#52525b;">${SUFFIX}</span></div>
