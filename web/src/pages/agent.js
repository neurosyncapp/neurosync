import { createFooter } from '../components/footer.js';
import { getAgent } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, shorten, repColor, escapeHtml } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function agentPage(app, params) {
  app.innerHTML = '';
  const name = (params.name || '').replace(/\.agent$/, '');

  const videoBg = document.createElement('div');
  videoBg.style.cssText = 'position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;';
  const video = document.createElement('video');
  Object.assign(video, { autoplay: true, muted: true, loop: true, playsInline: true });
  video.src = '/background.mp4';
  video.style.cssText = 'width:100%; height:100%; object-fit:cover; opacity:0.18;';
  const tint = document.createElement('div');
  tint.style.cssText = 'position:absolute; inset:0; background:#cabdff; mix-blend-mode:multiply; opacity:0.35;';
  const grad = document.createElement('div');
  grad.style.cssText = 'position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,7,10,0.62) 0%, rgba(7,7,10,0.86) 42%, rgba(7,7,10,1) 100%);';
  videoBg.append(video, tint, grad);
  app.appendChild(videoBg);

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
  const profileUrl = `${location.origin}/agent/${encodeURIComponent(a.name)}`;
  const apiUrl = `${location.origin}/api/agent/${encodeURIComponent(a.name)}`;
  const ownerUrl = `https://solscan.io/account/${a.owner}`;
  const resolverUrl = a.resolver ? `https://solscan.io/account/${a.resolver}` : '';
  body.innerHTML = `
    ${agentCard(a, { online, rep, caps, links })}

    <div class="card reveal" style="padding:22px; margin-bottom:14px;">
      ${row('Owner', link(a.owner))}
      ${row('Resolver', a.resolver ? link(a.resolver) : '<span class="muted">not set</span>')}
      ${row('Registered', a.registeredAt ? timeAgo(a.registeredAt) : 'unknown')}
      ${row('Expires', a.expiresAt ? new Date(a.expiresAt).toLocaleDateString() : 'Never')}
      ${row('Heartbeats', `${a.heartbeatCount ?? 0}`)}
      ${links.endpoint ? row('Endpoint', `<a href="${escapeHtml(links.endpoint)}" target="_blank" rel="noopener" style="color:#a78bfa;">${escapeHtml(links.endpoint)}</a>`, true) : ''}
      ${a.metadataUri ? row('Metadata', `<a href="${escapeHtml(a.metadataUri)}" target="_blank" rel="noopener" style="color:#a78bfa;">${escapeHtml(a.metadataUri)}</a>`, true) : ''}
    </div>

    <div class="card reveal" style="padding:22px; margin-bottom:14px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px;">
        <div>
          <div style="font-size:11px; color:#52525b; text-transform:uppercase; letter-spacing:1px;">Verify and share</div>
          <p style="font-size:13px; color:#71717a; margin-top:6px; line-height:1.5;">Copy the profile, inspect the indexed record, or open the on-chain accounts.</p>
        </div>
        <span class="mono" style="font-size:12px; color:#71717a;">${escapeHtml(a.name)}${SUFFIX}</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:10px;">
        ${actionButton('Copy profile', profileUrl)}
        ${actionButton('Copy API', apiUrl)}
        ${actionLink('Owner on Solscan', ownerUrl)}
        ${resolverUrl ? actionLink('Resolver on Solscan', resolverUrl) : actionButton('No resolver set', '', true)}
        ${actionLink('Set up hosted profile', `/agent/${encodeURIComponent(a.name)}/setup`, true)}
      </div>
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
      <a href="/explore" data-link style="font-size:13px; color:#71717a;">← Back to explore</a>
    </div>
  `;

  body.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      if (!value) return;
      const previous = button.textContent;
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = 'Copied';
      } catch (_) {
        button.textContent = 'Copy failed';
      }
      setTimeout(() => {
        button.textContent = previous;
      }, 1400);
    });
  });
}

function row(label, value, stack = false) {
  return `
    <div style="display:flex; ${stack ? 'flex-direction:column; gap:4px;' : 'justify-content:space-between; align-items:center;'} padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
      <span style="font-size:13px; color:#71717a;">${label}</span>
      <span class="mono" style="font-size:13px; color:#d4d4d8; ${stack ? 'word-break:break-all;' : ''}">${value}</span>
    </div>
  `;
}

function agentCard(a, { online, rep, caps, links }) {
  const category = a.category || 'unclassified';
  const status = online ? 'Online now' : `Last seen ${timeAgo(a.lastSeen)}`;
  const description = a.description || 'A registered NeuroSync agent with on-chain ownership, resolver data, and live presence signals.';
  const visibleCaps = caps.slice(0, 5);
  const moreCaps = caps.length > visibleCaps.length ? caps.length - visibleCaps.length : 0;
  return `
    <div class="card reveal agent-card">
      <div class="agent-card-inner">
        <div class="agent-card-main">
          <div class="agent-card-topline">
            <span class="agent-card-label">Agent Card</span>
            <span class="agent-card-pill"><span class="${online ? 'dot-online' : 'dot-offline'}" style="margin-right:7px;"></span>${escapeHtml(status)}</span>
            <span class="agent-card-pill">${escapeHtml(category)}</span>
          </div>

          <div class="mono agent-card-title">${escapeHtml(a.name)}<span style="color:#71717a;">${SUFFIX}</span></div>
          <p class="agent-card-description">${escapeHtml(description)}</p>

          <div class="agent-card-caps">
            ${
              visibleCaps.length
                ? visibleCaps.map((c) => `<span class="mono agent-card-cap">${escapeHtml(c)}</span>`).join('')
                : '<span class="mono agent-card-cap">metadata pending</span>'
            }
            ${moreCaps ? `<span class="mono agent-card-cap">+${moreCaps} more</span>` : ''}
          </div>

          <div class="agent-card-stats">
            ${agentStat(rep, 'reputation', repColor(rep))}
            ${agentStat(shorten(a.owner, 6), 'owner')}
            ${agentStat(`${a.heartbeatCount ?? 0}`, 'heartbeats')}
          </div>

          <div class="agent-card-actions">
            ${socialBtn('X', links.twitter, 'x')}
            ${socialBtn('GitHub', links.github, 'github')}
            ${socialBtn('Website', links.website, 'web')}
          </div>
        </div>

        <div class="agent-card-art" aria-hidden="true">
          <div class="mono agent-card-mark">${escapeHtml(cardMark(a.name))}</div>
        </div>
      </div>
    </div>
  `;
}

function agentStat(value, label, color = 'var(--text)') {
  return `
    <div class="agent-card-stat">
      <div class="mono agent-card-stat-value" style="color:${color};">${escapeHtml(value)}</div>
      <div class="agent-card-stat-label">${escapeHtml(label)}</div>
    </div>
  `;
}

function link(addr) {
  return `<a href="https://solscan.io/account/${addr}" target="_blank" rel="noopener" style="color:#d4d4d8;">${shorten(addr, 6)}</a>`;
}

function cardMark(name) {
  const clean = String(name || 'agent').replace(/[^a-z0-9]/gi, '');
  if (!clean) return 'AG';
  return clean.slice(0, 2).toUpperCase();
}

function actionButton(label, value, disabled = false) {
  return `<button type="button" ${disabled ? 'disabled' : `data-copy="${escapeHtml(value)}"`} style="min-height:42px; padding:0 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.025); color:${disabled ? '#3f3f46' : '#d4d4d8'}; font-size:13px;">${escapeHtml(label)}</button>`;
}

function actionLink(label, href, internal = false) {
  return `<a href="${escapeHtml(href)}" ${internal ? 'data-link' : 'target="_blank" rel="noopener"'} style="min-height:42px; display:flex; align-items:center; justify-content:center; padding:0 12px; border-radius:8px; border:1px solid rgba(139,92,246,0.2); background:rgba(139,92,246,0.08); color:#c4b5fd; font-size:13px;">${escapeHtml(label)}</a>`;
}

// A social button shown even when the agent has no link set (muted, disabled).
function socialBtn(label, href, kind) {
  const icons = {
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    github: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.59-4.04-1.59-.55-1.37-1.34-1.74-1.34-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.77.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.35 1.23-3.17-.12-.3-.53-1.51.12-3.15 0 0 1.01-.32 3.3 1.21a11.5 11.5 0 016.01 0c2.29-1.53 3.3-1.21 3.3-1.21.65 1.64.24 2.85.12 3.15.77.82 1.23 1.88 1.23 3.17 0 4.54-2.81 5.54-5.49 5.83.43.37.81 1.1.81 2.22v3.29c0 .31.21.68.82.56A12.01 12.01 0 0024 12.29C24 5.78 18.63.5 12 .5z"/></svg>',
    web: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>',
  };
  const icon = icons[kind] || '';
  if (href) {
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${label}" style="display:flex; align-items:center; gap:7px; padding:8px 13px; border-radius:8px; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); color:#c4b5fd; font-size:13px;">${icon}${label}</a>`;
  }
  return `<span title="No ${label} set" style="display:flex; align-items:center; gap:7px; padding:8px 13px; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); color:#3f3f46; font-size:13px;">${icon}${label}</span>`;
}
