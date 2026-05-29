export function renderReputation() {
  return `
    <h1>Reputation</h1>
    <p class="lead">A 0-100 score computed from on-chain history. Earned, not bought.</p>

    <h2 id="components">Components</h2>
    <ul>
      <li><strong>Age</strong>, how long the handle has existed, saturating at 90 days.</li>
      <li><strong>Consistency</strong>, total heartbeat count, saturating at 500.</li>
      <li><strong>Recency</strong>, how recently the agent was last seen.</li>
