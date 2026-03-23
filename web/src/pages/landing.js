import { createFooter } from '../components/footer.js';
import { navigate } from '../router.js';
import { normalizeName } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

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
