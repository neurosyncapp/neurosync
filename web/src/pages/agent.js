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
          <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
            <span class="${online ? 'dot-online' : 'dot-offline'}"></span>
            <span style="font-size:13px; color:${online ? 'var(--online)' : '#71717a'};">${online ? 'Online now' : `Last seen ${timeAgo(a.lastSeen)}`}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="mono" style="font-size:28px; color:${repColor(rep)};">${rep}</div>
          <div style="font-size:11px; color:#52525b; text-transform:uppercase; letter-spacing:1px;">reputation</div>
        </div>
      </div>
      ${a.description ? `<p style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05); font-size:14px; color:#a1a1aa; line-height:1.6;">${escapeHtml(a.description)}</p>` : ''}
      <div style="display:flex; gap:8px; margin-top:16px;">
        ${socialBtn('X', links.twitter, 'x')}
        ${socialBtn('GitHub', links.github, 'github')}
        ${socialBtn('Website', links.website, 'web')}
      </div>
    </div>

    <div class="card reveal" style="padding:22px; margin-bottom:14px;">
      ${row('Owner', link(a.owner))}
      ${row('Resolver', a.resolver ? link(a.resolver) : '<span class="muted">not set</span>')}
      ${row('Registered', a.registeredAt ? timeAgo(a.registeredAt) : 'unknown')}
      ${row('Expires', a.expiresAt ? new Date(a.expiresAt).toLocaleDateString() : 'Never')}
      ${row('Heartbeats', `${a.heartbeatCount ?? 0}`)}
      ${links.endpoint ? row('Endpoint', `<a href="${escapeHtml(links.endpoint)}" target="_blank" rel="noopener" style="color:#a78bfa;">${escapeHtml(links.endpoint)}</a>`, true) : ''}
      ${a.metadataUri ? row('Metadata', `<a href="${escapeHtml(a.metadataUri)}" target="_blank" rel="noopener" style="color:#a78bfa;">${escapeHtml(a.metadataUri)}</a>`, true) : ''}
    </div>

    ${
      caps.length
        ? `<div class="card reveal" style="padding:22px;">
            <div style="font-size:11px; color:#52525b; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px;">Capabilities</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${caps.map((c) => `<span class="mono" style="font-size:12px; padding:6px 11px; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); border-radius:7px; color:#c4b5fd;">${escapeHtml(c)}</span>`).join('')}
            </div>
          </div>`
        : ''
    }

    <div style="margin-top:20px;">
