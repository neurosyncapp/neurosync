const X_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
const GH_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.59-4.04-1.59-.55-1.37-1.34-1.74-1.34-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.77.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.35 1.23-3.17-.12-.3-.53-1.51.12-3.15 0 0 1.01-.32 3.3 1.21a11.5 11.5 0 016.01 0c2.29-1.53 3.3-1.21 3.3-1.21.65 1.64.24 2.85.12 3.15.77.82 1.23 1.88 1.23 3.17 0 4.54-2.81 5.54-5.49 5.83.43.37.81 1.1.81 2.22v3.29c0 .31.21.68.82.56A12.01 12.01 0 0024 12.29C24 5.78 18.63.5 12 .5z"/></svg>`;
const DOCS_URL = 'https://docs.neuro-sync.app';
const X_URL = 'https://x.com/neurosync';
const GITHUB_URL = 'https://github.com/neurosync';

export function createFooter() {
  const footer = document.createElement('footer');
  footer.style.cssText = 'border-top:1px solid rgba(255,255,255,0.05); margin-top:96px;';
  footer.innerHTML = `
    <div style="max-width:64rem; margin:0 auto; padding:44px 24px 0;">
      <div style="display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:32px; padding-bottom:30px; border-bottom:1px solid rgba(255,255,255,0.05);">
        <div>
          <div style="display:flex; align-items:center; gap:9px; margin-bottom:12px;">
            <img src="/logo-transparent.png" alt="" style="width:22px; height:22px; object-fit:contain;" />
            <span style="font-size:13px; font-weight:600; letter-spacing:1.5px; color:#d4d4d8;">NEUROSYNC</span>
          </div>
          <p style="font-size:13px; color:#52525b; line-height:1.6; margin:0 0 16px; max-width:260px;">
            The namespace and live-presence layer for autonomous agents on Solana.
          </p>
          <div style="display:flex; align-items:center; gap:12px;">
            <a href="${X_URL}" target="_blank" rel="noopener" title="X" class="social-icon" style="color:#52525b; transition:color .15s; display:flex;">${X_SVG}</a>
            <a href="${GITHUB_URL}" target="_blank" rel="noopener" title="GitHub" class="social-icon" style="color:#52525b; transition:color .15s; display:flex;">${GH_SVG}</a>
          </div>
        </div>
        <div>
          <h4 style="font-size:11px; font-weight:600; color:#3f3f46; text-transform:uppercase; letter-spacing:1.2px; margin:0 0 12px;">Product</h4>
          <div style="display:flex; flex-direction:column; gap:7px;">
            <a href="/explore" data-link class="ft-link">Explore</a>
            <a href="/register" data-link class="ft-link">Claim a handle</a>
