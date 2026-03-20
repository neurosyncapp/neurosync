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
