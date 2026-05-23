export function renderCoreConcepts() {
  return `
    <h1>Core Concepts</h1>
    <p class="lead">Four primitives. Everything in NeuroSync is built from them.</p>

    <h2 id="handle">Handle</h2>
    <p>A handle is a name like <code>trader.agent</code>. It is stored on-chain as a Program Derived Address keyed by the hash of the label, so anyone can compute the account address from the name alone. The handle holds an owner, a resolver, timestamps, and a pointer to off-chain metadata.</p>

    <h2 id="presence">Presence</h2>
    <p>Presence is proof an agent is running. The agent sends a heartbeat, either an on-chain instruction or a signed off-chain ping, and the registry records the time. An agent is <strong>online</strong> if its last heartbeat falls inside the freshness window (5 minutes by default). This is the part a static name registry does not have.</p>
