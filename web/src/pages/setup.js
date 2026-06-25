import { createFooter } from '../components/footer.js';
import { getAgent, hostedManifestUrl, saveHostedProfile } from '../api.js';
import { walletService } from '../lib/wallet.js';
import { openWalletModal } from '../components/wallet-modal.js';
import { buildUpdateMetadataTx } from '../lib/program.js';
import { escapeHtml, normalizeName } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function setupPage(app, params) {
  app.innerHTML = '';
  const name = normalizeName(params.name || '');
  const wrap = document.createElement('div');
  wrap.style.cssText = 'min-height:100vh; padding:120px 24px 0;';
  wrap.innerHTML = `
    <div class="container-narrow" style="margin:0 auto;">
      <div class="reveal" style="margin-bottom:24px;">
        <div class="eyebrow" style="margin-bottom:10px;">Hosted identity</div>
        <h1 class="h-title" style="margin-bottom:8px;">Set up ${escapeHtml(name)}<span style="color:#71717a;">${SUFFIX}</span></h1>
        <p class="muted" style="font-size:15px; max-width:560px;">Create useful agent metadata directly on NeuroSync. No external server, no IPFS upload, no JSON hosting.</p>
      </div>
      <div id="setup-body"></div>
    </div>
  `;
  app.appendChild(wrap);
  app.appendChild(createFooter());

  const body = wrap.querySelector('#setup-body');
  body.innerHTML = `<div class="skeleton" style="height:420px;"></div>`;

  const reveal = createRevealer();
  let agent = null;

  async function load() {
    try {
      agent = await getAgent(name);
      render();
      reveal.mount(wrap, { stagger: 80 });
    } catch {
      body.innerHTML = `<div class="card reveal" style="padding:36px; text-align:center; color:#71717a;">Could not load this handle.</div>`;
      reveal.mount(wrap);
    }
  }

  function render() {
    const connected = walletService.isConnected();
    const owner = walletService.getFullAddress();
    const isOwner = connected && owner === agent.owner;
    const hostedUri = hostedManifestUrl(name);
    const links = agent.links || {};
    const caps = Array.isArray(agent.capabilities) ? agent.capabilities : [];

    body.innerHTML = `
      <div class="card reveal" style="padding:22px; margin-bottom:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div>
            <div style="font-size:13px; color:#a1a1aa; margin-bottom:4px;">Hosted manifest</div>
            <div class="mono" style="font-size:12px; color:#71717a; word-break:break-all;">${escapeHtml(hostedUri)}</div>
          </div>
          ${connected ? `<span class="mono" style="font-size:12px; color:${isOwner ? '#34d399' : '#f87171'};">${isOwner ? 'owner connected' : 'wrong wallet'}</span>` : `<button id="connect" class="btn btn-primary">Connect owner wallet</button>`}
        </div>
      </div>

      <div class="card reveal" style="padding:22px;">
        <div style="display:grid; gap:14px;">
          ${field('Description', 'description', agent.description || '', 'What does this agent do?', 'textarea')}
          ${field('Category', 'category', agent.category || '', 'infrastructure, trading, research...')}
          ${field('Capabilities', 'capabilities', caps.join(', '), 'registry, presence, research, trading')}
          ${field('Website', 'website', links.website || '', 'https://...')}
          ${field('X / Twitter', 'twitter', links.twitter || '', 'https://x.com/...')}
          ${field('GitHub', 'github', links.github || '', 'https://github.com/...')}
          ${field('Endpoint', 'endpoint', links.endpoint || '', 'https://api.your-agent.com')}
        </div>

        <div id="setup-result" style="min-height:22px; margin-top:16px; font-size:13px;"></div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;">
          <button id="save" class="btn btn-primary" ${isOwner ? '' : 'disabled'} style="${isOwner ? '' : 'opacity:.5;'}">Save hosted profile</button>
          <button id="publish" class="btn btn-ghost" ${isOwner ? '' : 'disabled'} style="${isOwner ? '' : 'opacity:.5;'}">Publish hosted URI on-chain</button>
          <a href="/agent/${encodeURIComponent(name)}" data-link class="btn btn-ghost">View profile</a>
        </div>
      </div>
    `;

    body.querySelector('#connect')?.addEventListener('click', openWalletModal);
    body.querySelector('#save')?.addEventListener('click', () => save(hostedUri));
    body.querySelector('#publish')?.addEventListener('click', () => publish(hostedUri));
  }

  async function save(hostedUri) {
    const result = body.querySelector('#setup-result');
    try {
      const profile = formProfile(body);
      const timestamp = Date.now();
      const message = `neurosync:hosted-profile:${name}:${timestamp}:${JSON.stringify(profile)}`;
      result.style.color = '#71717a';
      result.textContent = 'Sign the profile update in your wallet...';
      const signature = await walletService.signMessage(message);
      result.textContent = 'Saving hosted profile...';
      await saveHostedProfile(name, { owner: walletService.getFullAddress(), timestamp, signature, profile });
      result.style.color = '#34d399';
      result.textContent = `Saved. Hosted manifest: ${hostedUri}`;
      agent = await getAgent(name);
    } catch (e) {
      result.style.color = '#f87171';
      result.textContent = e.message || 'Could not save hosted profile.';
    }
  }

  async function publish(hostedUri) {
    const result = body.querySelector('#setup-result');
    try {
      result.style.color = '#71717a';
      result.textContent = 'Confirm the metadata URI transaction...';
      const owner = walletService.getFullAddress();
      const tx = await buildUpdateMetadataTx({ owner, label: name, metadataUri: hostedUri }, walletService.connection);
      const sig = await walletService.sendTransaction(tx);
      result.style.color = '#34d399';
      result.innerHTML = `Published on-chain. <a href="https://solscan.io/tx/${sig}" target="_blank" rel="noopener" style="color:#a78bfa;">View tx</a>`;
    } catch (e) {
      result.style.color = '#f87171';
      result.textContent = e.message || 'Could not publish hosted URI.';
    }
  }

  walletService.on('connect', render);
  walletService.on('disconnect', render);
  load();
  return () => reveal.destroy();
}

function field(label, id, value, placeholder, type = 'input') {
  const input = type === 'textarea'
    ? `<textarea id="${id}" rows="4" placeholder="${escapeHtml(placeholder)}" style="${inputStyle()} resize:vertical;">${escapeHtml(value)}</textarea>`
    : `<input id="${id}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" style="${inputStyle()}" />`;
  return `
    <label style="display:grid; gap:7px;">
      <span style="font-size:12px; color:#71717a;">${escapeHtml(label)}</span>
      ${input}
    </label>
  `;
}

function inputStyle() {
  return 'width:100%; background:rgba(0,0,0,0.26); border:1px solid rgba(255,255,255,0.08); border-radius:9px; color:#f4f4f6; padding:11px 12px; font-size:14px;';
}

function formProfile(root) {
  const value = (id) => root.querySelector(`#${id}`)?.value.trim() || '';
  return {
    description: cleanText(value('description'), 280),
    category: cleanText(value('category'), 32),
    capabilities: value('capabilities').split(',').map((v) => cleanText(v, 32)).filter(Boolean).slice(0, 12),
    links: {
      website: cleanUrl(value('website')),
      twitter: cleanUrl(value('twitter')),
      github: cleanUrl(value('github')),
      endpoint: cleanUrl(value('endpoint')),
    },
  };
}

function cleanText(value, max) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

function cleanUrl(value) {
  const raw = String(value || '').trim().slice(0, 240);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
