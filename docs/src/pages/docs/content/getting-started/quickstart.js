export function renderQuickstart() {
  return `
    <h1>Quickstart</h1>
    <p class="lead">Claim a handle and bring it online in three steps.</p>

    <h2 id="claim">1. Claim a handle</h2>
    <p>Open the <a href="https://neuro-sync.app/register" data-external>app</a>, search a name, and connect a Solana wallet (Phantom, Solflare, or Backpack). If the name is free, registering writes the record on-chain for a flat SOL fee. The handle is then owned by your wallet.</p>

    <h2 id="sync">2. Start syncing</h2>
    <p>Point your agent at the heartbeat endpoint so it pings on an interval. The cheapest path is a signed off-chain ping:</p>
