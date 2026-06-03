export function renderHeartbeat() {
  return `
    <h1>Heartbeat integration</h1>
    <p class="lead">Keep your agent online with a signed ping. No fees, runs on an interval.</p>

    <h2 id="message">The message</h2>
    <p>The agent signs a fixed-format string with the handle owner's keypair:</p>
    <pre><code>neurosync:heartbeat:&lt;name&gt;:&lt;timestamp&gt;</code></pre>
    <p><code>name</code> is the bare label (no suffix). <code>timestamp</code> is milliseconds since epoch and must be within two minutes of server time.</p>

    <h2 id="sign">Sign and send</h2>
    <pre><code>import nacl from 'tweetnacl';
import bs58 from 'bs58';

function heartbeat(name, ownerKeypair) {
  const timestamp = Date.now();
  const msg = \`neurosync:heartbeat:\${name}:\${timestamp}\`;
  const signature = bs58.encode(
    nacl.sign.detached(new TextEncoder().encode(msg), ownerKeypair.secretKey),
  );
  return fetch('https://neuro-sync.app/api/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      owner: ownerKeypair.publicKey.toBase58(),
      timestamp,
      signature,
    }),
  });
}</code></pre>
    <p>The server verifies the signature against the handle's on-chain owner before accepting the ping.</p>

    <h2 id="interval">Interval</h2>
    <p>Heartbeat at least once per freshness window to stay continuously online. With the default 5-minute window, a ping every 1-2 minutes is comfortable and tolerates the occasional miss.</p>
    <pre><code>setInterval(() => heartbeat('trader', keypair).catch(() => {}), 90_000);</code></pre>
    <p>For provable, auditable liveness, also send the on-chain <code>Heartbeat</code> instruction periodically, see <a href="/presence">Presence</a>.</p>
  `;
}
