import { navigate } from '../router.js';
import { walletService } from '../lib/wallet.js';
import { openWalletModal } from './wallet-modal.js';

const DOCS_URL = 'https://docs.neuro-sync.app';
const X_URL = 'https://x.com/neurosyncapp';
const GITHUB_URL = 'https://github.com/neurosyncapp/neurosync';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Activity', href: '/activity' },
  { label: 'Docs', href: DOCS_URL, external: true },
];

const X_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
const GH_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.59-4.04-1.59-.55-1.37-1.34-1.74-1.34-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.77.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.35 1.23-3.17-.12-.3-.53-1.51.12-3.15 0 0 1.01-.32 3.3 1.21a11.5 11.5 0 016.01 0c2.29-1.53 3.3-1.21 3.3-1.21.65 1.64.24 2.85.12 3.15.77.82 1.23 1.88 1.23 3.17 0 4.54-2.81 5.54-5.49 5.83.43.37.81 1.1.81 2.22v3.29c0 .31.21.68.82.56A12.01 12.01 0 0024 12.29C24 5.78 18.63.5 12 .5z"/></svg>`;

export function createNavbar() {
  const header = document.createElement('header');
  header.id = 'main-nav';
  header.style.cssText = `
    position: fixed; inset: 0 0 auto 0; z-index: 50;
    display: flex; justify-content: center;
    padding: 16px 24px; pointer-events: none;
    transition: padding 0.7s cubic-bezier(0.22,1,0.36,1);
    animation: navDrop 0.7s cubic-bezier(0.22,1,0.36,1) both;
  `;

  const nav = document.createElement('nav');
  nav.style.cssText = `
    pointer-events: all; display: flex; align-items: center; justify-content: space-between;
    width: 100%; max-width: 72rem; padding: 10px 18px 10px 16px;
    background: rgba(10,10,14,0.78);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
    transition: all 0.7s cubic-bezier(0.22,1,0.36,1);
  `;

  // Logo
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.setAttribute('data-link', '');
  logoLink.style.cssText = 'display:flex; align-items:center; gap:9px; cursor:pointer;';
  logoLink.innerHTML = `
    <img src="/logo-transparent.png" alt="NeuroSync" style="height:26px; width:26px; object-fit:contain; transition:all .7s cubic-bezier(0.22,1,0.36,1);" />
    <span style="font-size:14px; font-weight:600; letter-spacing:1.5px; color:#f4f4f6;">NEUROSYNC</span>
  `;

  // Center links
  const linksSection = document.createElement('div');
  linksSection.className = 'nav-desktop-links';
  linksSection.style.cssText = 'position:absolute; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:2px;';
  NAV_LINKS.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    if (!link.external) a.setAttribute('data-link', '');
    else { a.target = '_blank'; a.rel = 'noopener'; }
    a.textContent = link.label;
    a.dataset.href = link.href;
    a.style.cssText = 'position:relative; padding:6px 14px; font-size:13px; font-weight:500; color:#71717a; transition:color .15s;';
    const ind = document.createElement('span');
    ind.className = 'nav-indicator';
    ind.style.cssText = 'position:absolute; bottom:0; left:50%; transform:translateX(-50%) scaleX(0); width:16px; height:2px; border-radius:1px; background:#8b5cf6; transition:transform .15s ease;';
    a.appendChild(ind);
    a.addEventListener('mouseenter', () => { a.style.color = '#fafafa'; });
    a.addEventListener('mouseleave', () => { if (!a.classList.contains('active')) a.style.color = '#71717a'; });
    linksSection.appendChild(a);
  });

  // Right: socials + connect + claim
  const right = document.createElement('div');
  right.style.cssText = 'display:flex; align-items:center; gap:8px;';

  const socials = document.createElement('div');
  socials.className = 'nav-desktop-links';
  socials.style.cssText = 'display:flex; align-items:center; gap:2px; margin-right:4px;';
  [
    { href: X_URL, svg: X_SVG, title: 'X' },
    { href: GITHUB_URL, svg: GH_SVG, title: 'GitHub' },
  ].forEach((s) => {
    const a = document.createElement('a');
    a.href = s.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = s.title;
    a.innerHTML = s.svg;
    a.style.cssText = 'display:flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:7px; color:#71717a; transition:all .15s;';
    a.addEventListener('mouseenter', () => { a.style.color = '#a78bfa'; a.style.background = 'rgba(139,92,246,0.1)'; });
    a.addEventListener('mouseleave', () => { a.style.color = '#71717a'; a.style.background = 'transparent'; });
    socials.appendChild(a);
  });

  const claimBtn = document.createElement('a');
  claimBtn.href = '/register';
  claimBtn.setAttribute('data-link', '');
  claimBtn.className = 'nav-desktop-links btn btn-ghost';
  claimBtn.style.cssText = 'padding:7px 14px; font-size:13px;';
  claimBtn.textContent = 'Claim';

  const connectBtn = document.createElement('button');
  connectBtn.className = 'btn btn-primary';
  connectBtn.style.cssText = 'padding:7px 14px; font-size:13px;';
  const renderConnect = () => {
    if (walletService.isConnected()) {
      connectBtn.textContent = walletService.getAddress();
    } else {
      connectBtn.textContent = 'Connect';
    }
  };
  connectBtn.addEventListener('click', async () => {
    if (walletService.isConnected()) {
      await walletService.disconnect();
    } else {
      openWalletModal();
    }
  });
  renderConnect();
  walletService.on('connect', renderConnect);
  walletService.on('disconnect', renderConnect);

  // Hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-mobile-toggle';
  hamburger.style.cssText = 'display:none; background:none; border:none; padding:4px; color:#71717a;';
  hamburger.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

  right.appendChild(socials);
  right.appendChild(claimBtn);
  right.appendChild(connectBtn);
  right.appendChild(hamburger);
  nav.appendChild(logoLink);
  nav.appendChild(linksSection);
  nav.appendChild(right);
  header.appendChild(nav);

  // Mobile sidebar
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; z-index:100; background:rgba(0,0,0,0.55); backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:opacity .3s;';
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'position:fixed; top:0; right:0; bottom:0; z-index:101; width:264px; background:#0e0e14; border-left:1px solid rgba(255,255,255,0.06); transform:translateX(100%); transition:transform .3s cubic-bezier(0.22,1,0.36,1); display:flex; flex-direction:column; padding:20px;';
  const sideLinks = NAV_LINKS.map((l) =>
    `<a href="${l.href}" ${l.external ? 'target="_blank" rel="noopener"' : 'data-link'} class="side-link" style="padding:11px 12px; border-radius:8px; font-size:14px; font-weight:500; color:#a1a1aa;">${l.label}</a>`
  ).join('');
  sidebar.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:22px;">
      <img src="/logo-transparent.png" style="height:24px;" />
      <button id="side-close" style="background:none; border:none; color:#71717a; padding:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div style="display:flex; flex-direction:column; gap:2px; flex:1;">${sideLinks}</div>
    <div style="display:flex; gap:8px; margin:12px 0;">
      <a href="${X_URL}" target="_blank" rel="noopener" style="display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:8px; color:#a1a1aa; background:rgba(255,255,255,0.03);">${X_SVG}</a>
      <a href="${GITHUB_URL}" target="_blank" rel="noopener" style="display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:8px; color:#a1a1aa; background:rgba(255,255,255,0.03);">${GH_SVG}</a>
    </div>
    <a href="/register" data-link class="btn btn-primary">Claim a handle</a>
  `;

  const toggle = (open) => {
    sidebar.style.transform = open ? 'translateX(0)' : 'translateX(100%)';
    overlay.style.opacity = open ? '1' : '0';
    overlay.style.pointerEvents = open ? 'all' : 'none';
  };
  hamburger.addEventListener('click', () => toggle(true));
  overlay.addEventListener('click', () => toggle(false));
  sidebar.querySelector('#side-close').addEventListener('click', () => toggle(false));
  sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  // Responsive + scroll shrink
  const mstyle = document.createElement('style');
  mstyle.textContent = `@media (max-width:768px){.nav-desktop-links{display:none !important;}.nav-mobile-toggle{display:flex !important;}}`;
  header.appendChild(mstyle);

  let scrolled = false;
  window.addEventListener('scroll', () => {
    const s = window.scrollY > 40;
    if (s === scrolled) return;
    scrolled = s;
    nav.style.maxWidth = s ? '52rem' : '72rem';
    nav.style.background = s ? 'rgba(10,10,14,0.62)' : 'rgba(10,10,14,0.78)';
  }, { passive: true });

  const updateActive = () => {
    const path = window.location.pathname;
    linksSection.querySelectorAll('a').forEach((a) => {
      const href = a.dataset.href;
      const isActive = !href.startsWith('http') && (path === href || (href !== '/' && path.startsWith(href)));
      a.classList.toggle('active', isActive);
      a.style.color = isActive ? '#fafafa' : '#71717a';
      const ind = a.querySelector('.nav-indicator');
      if (ind) ind.style.transform = isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)';
    });
  };
  new MutationObserver(updateActive).observe(document.getElementById('app'), { childList: true });
  window.addEventListener('popstate', updateActive);
  setTimeout(updateActive, 0);

  return header;
}
