import { createFooter } from '../components/footer.js';
import { navigate } from '../router.js';
import { normalizeName } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

const TOKEN_CA = '8Bc76BtofupwBDDAw4YUe2bF63GvA2YdQBzAh2Jkpump';

export function landingPage(app) {
  app.innerHTML = '';

  // ---- video background: sits at the top of the page and scrolls away with
  // the content (absolute, not fixed). It never fades, it just leaves the
  // viewport like any other element as you scroll down. ----
  const videoBg = document.createElement('div');
  videoBg.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100vh; z-index:-1; overflow:hidden;';
  const video = document.createElement('video');
  Object.assign(video, { autoplay: true, muted: true, loop: true, playsInline: true });
  video.src = '/background.mp4';
  video.style.cssText = 'width:100%; height:100%; object-fit:cover; opacity:0.65;';
  // Light-lavender multiply: a near-white tint multiplies dark pixels by ~1.0
  // (they stay dark) while pushing the clip's bright/white areas toward purple.
  const tint = document.createElement('div');
  tint.style.cssText = 'position:absolute; inset:0; background:#cabdff; mix-blend-mode:multiply; opacity:0.5;';
  const grad = document.createElement('div');
  grad.style.cssText = 'position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,7,10,0.25) 0%, rgba(7,7,10,0.45) 55%, rgba(7,7,10,1) 100%);';
  videoBg.append(video, tint, grad);
  app.appendChild(videoBg);

  // ---- hero ----
  const hero = document.createElement('section');
  hero.style.cssText = 'min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:96px 24px 72px;';
  hero.innerHTML = `
    <h1 class="reveal-blur" data-delay="0" style="font-size:clamp(40px,7.4vw,78px); font-weight:600; letter-spacing:-0.035em; line-height:1.02; color:#fafafa; margin-bottom:22px; max-width:16ch;">
      Identity for agents<br/>that stay <span style="color:#a78bfa;">alive</span>.
    </h1>
    <p class="reveal" data-delay="140" style="font-size:17px; color:#a1a1aa; line-height:1.6; max-width:480px; margin-bottom:38px;">
      Claim a <span class="mono" style="color:#d4d4d8;">${SUFFIX}</span> handle on Solana, broadcast live presence, and earn reputation from what your agent actually does.
    </p>

    <form id="claim-form" class="reveal" data-delay="260" style="display:flex; align-items:center; gap:8px; width:100%; max-width:460px; background:rgba(14,14,20,0.72); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:7px 7px 7px 16px; backdrop-filter:blur(12px);">
      <input id="claim-input" autocomplete="off" spellcheck="false" placeholder="yourname" style="flex:1; background:none; border:none; color:#fafafa; font-size:16px; min-width:0;" />
      <span class="mono" style="color:#52525b; font-size:15px;">${SUFFIX}</span>
      <button type="submit" class="btn btn-primary" style="white-space:nowrap;">Claim</button>
    </form>

    <div class="reveal" data-delay="360" style="margin-top:22px; font-size:13px; color:#52525b;">
      Resolvable on-chain. No API required.
    </div>

    <div class="reveal" data-delay="430" style="margin-top:18px; display:flex; align-items:center; gap:8px; max-width:100%; padding:8px 12px; border:1px solid rgba(255,255,255,0.08); border-radius:9px; background:rgba(10,10,14,0.58);">
      <span class="mono" style="font-size:11px; color:#71717a;">CA</span>
      <span class="mono" style="font-size:12px; color:#d4d4d8; word-break:break-all;">${TOKEN_CA}</span>
    </div>
  `;
  app.appendChild(hero);

  const form = hero.querySelector('#claim-form');
  const input = hero.querySelector('#claim-input');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = normalizeName(input.value);
    navigate(n ? `/register?name=${encodeURIComponent(n)}` : '/register');
  });

  // ---- how it works ----
  const main = document.createElement('div');
  main.className = 'container';
  main.innerHTML = `
    <section class="reveal" style="text-align:center; padding-top:40px;">
      <h2 class="h-title" style="margin-bottom:10px;">How it works</h2>
      <p class="muted" style="max-width:440px; margin:0 auto;">Three primitives, one handle. Each is an on-chain object anyone can read.</p>
    </section>

    ${howRow('01', 'Resolvable identity', 'A handle maps to a wallet and a resolver, derived deterministically on-chain. Anyone can resolve it straight from an RPC node, no gatekeeper, no lookup service.', vizIdentity(), false)}
    ${howRow('02', 'Live presence', 'Agents heartbeat to prove they are running. The registry shows who is online right now and when each was last seen. Identity that reflects reality.', vizPresence(), true)}
    ${howRow('03', 'Earned reputation', 'No paid checkmarks. Reputation is computed from on-chain age, heartbeat consistency and activity, so trust is built, not bought.', vizReputation(), false)}

    <section class="section reveal" style="text-align:center;">
      <h2 class="h-title" style="margin-bottom:14px;">Claim your handle</h2>
      <p class="muted" style="max-width:420px; margin:0 auto 28px;">The namespace is open. Good names go fast.</p>
      <a href="/register" data-link class="btn btn-primary" style="padding:13px 26px;">Get started</a>
    </section>
  `;
  app.appendChild(main);
  app.appendChild(createFooter());

  // Reveal hero (staggered load entrance) + every section as it scrolls in.
  const reveal = createRevealer();
  reveal.mount(app);
  return () => reveal.destroy();
}

function howRow(num, title, body, viz, alt) {
  const text = `
    <div class="${alt ? 'reveal-right' : 'reveal-left'}">
      <div class="mono" style="font-size:13px; color:#6d28d9; margin-bottom:14px;">${num}</div>
      <h3 style="font-size:clamp(22px,2.6vw,30px); font-weight:600; letter-spacing:-0.02em; color:#f4f4f6; margin-bottom:14px;">${title}</h3>
      <p style="font-size:15px; color:#a1a1aa; line-height:1.75; max-width:44ch;">${body}</p>
    </div>`;
  const art = `
    <div class="how-viz card ${alt ? 'reveal-left' : 'reveal-right'}" data-delay="90" style="padding:30px; display:flex; align-items:center; justify-content:center; min-height:230px; background:rgba(139,92,246,0.03);">
      ${viz}
    </div>`;
  return `
    <section class="section how-row ${alt ? 'alt' : ''}" style="display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center;">
      ${alt ? art + text : text + art}
    </section>`;
}

/* ---------- inline animated SVGs ---------- */

// Identity: a steady point shuttles the resolve path between handle and wallet.
function vizIdentity() {
  return `
  <svg class="viz" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="104" y1="65" x2="160" y2="65" stroke="rgba(167,139,250,0.22)" stroke-width="2"/>
    <rect x="4" y="46" width="100" height="38" rx="11" fill="rgba(139,92,246,0.10)" stroke="#8b5cf6" stroke-width="1.3"/>
    <text x="54" y="70" text-anchor="middle" font-family="ui-monospace,monospace" font-size="13" fill="#c4b5fd">name.agent</text>
    <rect x="160" y="46" width="76" height="38" rx="11" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" stroke-width="1.3"/>
    <rect x="173" y="58" width="15" height="14" rx="3" stroke="#a78bfa" stroke-width="1.5"/>
    <path d="M173 63 h15" stroke="#a78bfa" stroke-width="1.5"/>
    <text x="210" y="70" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" fill="#a1a1aa">wallet</text>
    <g class="v-packet">
      <circle cx="104" cy="65" r="9" fill="rgba(167,139,250,0.16)"/>
      <circle cx="104" cy="65" r="4.5" fill="#a78bfa"/>
    </g>
  </svg>`;
}

// Presence: a heartbeat trace with a bright pulse sweeping across it.
function vizPresence() {
  const path = 'M14 65 H78 l9 -26 l11 50 l9 -36 l8 12 H226';
  return `
  <svg class="viz" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="${path}" stroke="rgba(167,139,250,0.18)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="v-ecg" pathLength="100" d="${path}" stroke="#a78bfa" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Reputation: a compact progress ring that fills once to the score.
function vizReputation() {
  return `
  <svg class="viz" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:126px;">
    <defs>
      <linearGradient id="repgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6d28d9"/>
        <stop offset="1" stop-color="#a78bfa"/>
      </linearGradient>
    </defs>
    <circle cx="70" cy="70" r="50" stroke="rgba(255,255,255,0.08)" stroke-width="9"/>
    <circle class="v-fill" cx="70" cy="70" r="50" stroke="url(#repgrad)" stroke-width="9" stroke-linecap="round" transform="rotate(-90 70 70)"/>
    <text x="70" y="68" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" font-weight="600" fill="#f4f4f6">84</text>
    <text x="70" y="86" text-anchor="middle" font-family="Inter,sans-serif" font-size="8" letter-spacing="1.5" fill="#71717a">REPUTATION</text>
  </svg>`;
}
