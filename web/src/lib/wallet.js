import { Connection } from '@solana/web3.js';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';

// Minimal browser event emitter (avoids pulling in Node's 'events').
class Emitter {
  constructor() { this._h = {}; }
  on(e, fn) { (this._h[e] ||= []).push(fn); return this; }
  off(e, fn) { this._h[e] = (this._h[e] || []).filter((f) => f !== fn); return this; }
  emit(e, ...a) { (this._h[e] || []).forEach((fn) => fn(...a)); }
}

const LAST_WALLET_KEY = 'neurosync_last_wallet';

// All reads/sends go through the API RPC proxy so the upstream key stays server-side.
const RPC_PROXY = `${location.origin}/api/rpc`;

const WALLET_ICONS = {
  Phantom: 'https://raw.githubusercontent.com/nicka/phantom-wallet-brand-assets/refs/heads/main/phantom-icon-purple.svg',
  Backpack: 'https://backpack.app/assets/backpack-icon.png',
  Solflare: 'https://solflare.com/favicon.svg',
};

class WalletService extends Emitter {
  constructor() {
    super();
    this.adapter = null;
    this.publicKey = null;
    this.connection = new Connection(RPC_PROXY, 'confirmed');
    this.supportedWallets = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ];
    this.WalletReadyState = WalletReadyState;
  }

  isConnected() {
    return !!(this.adapter && this.adapter.connected && this.publicKey);
  }

  getAddress() {
    if (!this.publicKey) return null;
    const a = this.publicKey.toBase58();
    return `${a.slice(0, 4)}…${a.slice(-4)}`;
  }

  getFullAddress() {
    return this.publicKey ? this.publicKey.toBase58() : null;
  }

  getIcon(name) {
    // Each wallet adapter ships its own icon as an embedded data-URI, which
    // always renders. Fall back to the hosted URL only if absent.
    const a = this.supportedWallets.find((w) => w.name === name);
    return (a && a.icon) || WALLET_ICONS[name] || null;
  }

  detected(name) {
    const a = this.supportedWallets.find((w) => w.name === name);
    return a && (a.readyState === WalletReadyState.Installed || a.readyState === WalletReadyState.Loadable);
  }

  async autoConnect() {
    const last = localStorage.getItem(LAST_WALLET_KEY);
    if (!last) return;
    const adapter = this.supportedWallets.find((w) => w.name === last);
    if (!adapter) return;
    this.adapter = adapter;
    this._listen();
    try {
      await adapter.autoConnect();
    } catch {
      this.adapter = null;
      localStorage.removeItem(LAST_WALLET_KEY);
    }
  }

