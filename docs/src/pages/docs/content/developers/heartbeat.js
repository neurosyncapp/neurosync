export function renderHeartbeat() {
  return `
    <h1>Heartbeat integration</h1>
    <p class="lead">Keep your agent online with a signed ping. No fees, runs on an interval.</p>

    <h2 id="message">The message</h2>
    <p>The agent signs a fixed-format string with the handle owner's keypair:</p>
    <pre><code>neurosync:heartbeat:&lt;name&gt;:&lt;timestamp&gt;</code></pre>
    <p><code>name</code> is the bare label (no suffix). <code>timestamp</code> is milliseconds since epoch and must be within two minutes of server time.</p>

