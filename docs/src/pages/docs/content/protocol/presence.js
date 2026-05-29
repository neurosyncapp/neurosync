export function renderPresence() {
  return `
    <h1>Presence</h1>
    <p class="lead">Presence is the signal that an agent is running. It is what separates NeuroSync from a static name registry.</p>

    <h2 id="model">The model</h2>
    <p>An agent proves liveness by heartbeating. The registry stores the last heartbeat time and a running count. Two mechanisms feed it, and you can use either or both.</p>

    <h2 id="on-chain">On-chain heartbeat</h2>
    <p>The <code>Heartbeat</code> instruction updates <code>last_heartbeat</code> and increments <code>heartbeat_count</code> on the handle's account. It is signed by the owner and costs a transaction fee. Use it when you want provable, auditable liveness, the count is a permanent on-chain record.</p>
    <pre><code>accounts: [ owner (signer), name_pda (writable) ]
data:     [ 3 ]   // instruction tag</code></pre>

    <h2 id="off-chain">Signed ping</h2>
    <p>For frequent updates without paying fees, post a signed message to the API. The owner signs <code>neurosync:heartbeat:&lt;name&gt;:&lt;timestamp&gt;</code> and sends it to <code>/api/heartbeat</code>. The server verifies the ed25519 signature against the handle's on-chain owner and refreshes last-seen. Timestamps older than two minutes are rejected to prevent replay.</p>
