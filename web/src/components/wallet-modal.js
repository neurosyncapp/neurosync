import { walletService } from '../lib/wallet.js';

const WALLETS = ['Phantom', 'Solflare', 'Backpack'];

let el = null;

export function openWalletModal() {
  if (el) close();

  el = document.createElement('div');
  el.style.cssText = `
    position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); padding: 20px;
  `;

  const panel = document.createElement('div');
  panel.className = 'fade-in';
  panel.style.cssText = `
    width: 100%; max-width: 360px; background: #0e0e14;
    border: 1px solid rgba(255,255,255,0.09); border-radius: 16px; padding: 22px;
    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.7);
  `;

  panel.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
      <h3 style="font-size:16px; font-weight:600; color:#f4f4f6;">Connect wallet</h3>
      <button id="wm-close" style="background:none; border:none; color:#71717a; padding:2px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <p style="font-size:13px; color:#71717a; margin-bottom:16px;">Sign in with a Solana wallet to claim and manage handles.</p>
    <div id="wm-list" style="display:flex; flex-direction:column; gap:8px;"></div>
  `;

  const list = panel.querySelector('#wm-list');
  WALLETS.forEach((name) => {
    const detected = walletService.detected(name);
    const row = document.createElement('button');
    row.style.cssText = `
      display:flex; align-items:center; gap:12px; width:100%; padding:12px 14px;
