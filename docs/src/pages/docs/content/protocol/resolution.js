export function renderResolution() {
  return `
    <h1>Resolution</h1>
    <p class="lead">Turning a name into an address, and an address back into a name.</p>

    <h2 id="forward">Forward</h2>
    <p><code>name → resolver</code>. Given a handle, return the address it points to plus its metadata.</p>
    <pre><code>GET /api/resolve/trader
{ "name": "trader", "owner": "...", "resolver": "...", "metadataUri": "..." }</code></pre>

    <h2 id="reverse">Reverse</h2>
    <p><code>wallet → name</code>. Return the primary handle for a wallet, the highest-reputation handle it owns.</p>
    <pre><code>GET /api/reverse/&lt;wallet&gt;
{ "wallet": "...", "primary": "trader" }</code></pre>

    <h2 id="no-api">Resolving without the API</h2>
    <p>Forward resolution does not depend on NeuroSync infrastructure. Derive the PDA and read the account from any RPC node:</p>
    <pre><code>import { PublicKey } from '@solana/web3.js';
import { createHash } from 'crypto';

const hash = createHash('sha256').update('trader').digest();
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from('name'), hash],
  PROGRAM_ID,
);
const account = await connection.getAccountInfo(pda);
// decode account.data per the on-chain layout</code></pre>
    <p>The byte layout is documented in <a href="/on-chain">On-chain program</a>. This is the trust-minimised path: it works even if the API is down.</p>
  `;
}
