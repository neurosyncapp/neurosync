import { createFooter } from '../components/footer.js';
import { checkAvailability } from '../api.js';
import { walletService } from '../lib/wallet.js';
import { openWalletModal } from '../components/wallet-modal.js';
import { navigate } from '../router.js';
import { buildRegisterTx } from '../lib/program.js';
import { getConfig } from '../config.js';
import { normalizeName, escapeHtml } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function registerPage(app) {
  app.innerHTML = '';

  // glass video bg, dimmer than landing (mirrors cognito strategy page)
  const videoBg = document.createElement('div');
  videoBg.style.cssText = 'position:fixed; inset:0; z-index:-1; overflow:hidden;';
  const video = document.createElement('video');
  Object.assign(video, { autoplay: true, muted: true, loop: true, playsInline: true });
  video.src = '/background.mp4';
  video.style.cssText = 'width:100%; height:100%; object-fit:cover; opacity:0.18;';
  videoBg.innerHTML = '';
  videoBg.appendChild(video);
  const ov = document.createElement('div');
  ov.style.cssText = 'position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,7,10,0.5) 0%, rgba(7,7,10,0.9) 45%, rgba(7,7,10,1) 100%);';
  videoBg.appendChild(ov);
  app.appendChild(videoBg);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'min-height:100vh; padding:130px 24px 0;';
  wrap.innerHTML = `
    <div style="max-width:30rem; margin:0 auto; text-align:center;">
      <div class="eyebrow reveal" style="margin-bottom:14px;">Claim a handle</div>
      <h1 class="h-title reveal" style="margin-bottom:10px;">Register your <span style="color:#a78bfa;">${SUFFIX}</span></h1>
      <p class="muted reveal" style="font-size:14px; margin-bottom:32px;">One-time SOL fee. The handle is yours, on-chain.</p>

      <div class="card reveal" style="padding:22px; text-align:left;">
        <div style="display:flex; align-items:center; gap:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:10px; padding:6px 6px 6px 14px; margin-bottom:14px;">
          <input id="r-input" autocomplete="off" spellcheck="false" placeholder="yourname"
            style="flex:1; background:none; border:none; color:#fafafa; font-size:16px; min-width:0;" />
          <span class="mono" style="color:#52525b; font-size:15px;">${SUFFIX}</span>
        </div>
        <div id="r-status" style="min-height:22px; font-size:13px; margin-bottom:14px;"></div>
        <button id="r-action" class="btn btn-primary" style="width:100%; padding:12px;" disabled>Enter a name</button>
        <div id="r-result" style="margin-top:14px;"></div>
      </div>

      <p class="reveal" style="font-size:12px; color:#3f3f46; margin-top:16px; line-height:1.6;">
        Names are lowercase letters, numbers and hyphens. Registration writes the record on-chain via your wallet.
      </p>
    </div>
  `;
  app.appendChild(wrap);
  app.appendChild(createFooter());

  const input = wrap.querySelector('#r-input');
  const status = wrap.querySelector('#r-status');
  const action = wrap.querySelector('#r-action');
  const result = wrap.querySelector('#r-result');

  let available = false;
  let current = '';

  const preset = new URLSearchParams(location.search).get('name');
  if (preset) input.value = normalizeName(preset);

  let t = null;
  const onInput = () => {
    const n = normalizeName(input.value);
    if (n !== input.value) input.value = n;
    current = n;
    available = false;
    result.innerHTML = '';
    clearTimeout(t);
    if (!n) {
      status.textContent = '';
      setAction('Enter a name', true);
      return;
    }
    if (n.length < 1) return;
