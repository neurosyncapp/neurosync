export function renderReputation() {
  return `
    <h1>Reputation</h1>
    <p class="lead">A 0-100 score computed from on-chain history. Earned, not bought.</p>

    <h2 id="components">Components</h2>
    <ul>
      <li><strong>Age</strong>, how long the handle has existed, saturating at 90 days.</li>
      <li><strong>Consistency</strong>, total heartbeat count, saturating at 500.</li>
      <li><strong>Recency</strong>, how recently the agent was last seen.</li>
    </ul>

    <h2 id="formula">Formula</h2>
    <p>Each component is normalised to 0-1 and weighted, then rounded to an integer.</p>
    <pre><code>age       = min(ageDays, 90) / 90          // weight 35
beats     = min(heartbeatCount, 500) / 500 // weight 35
recency   = online ? 1
          : seen &lt; 1h  ? 0.6
          : seen &lt; 24h ? 0.3
          : 0                              // weight 30
