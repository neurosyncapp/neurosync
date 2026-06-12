export function renderOnChain() {
  return `
    <h1>On-chain program</h1>
    <p class="lead">A native Solana program, no Anchor. Two account types, eight instructions.</p>

    <h2 id="accounts">Accounts</h2>
    <ul>
      <li><strong>Config PDA</strong>, seeds <code>["config"]</code>. Admin, treasury, fees, renewal period.</li>
      <li><strong>Name PDA</strong>, seeds <code>["name", sha256(label)]</code>. The handle record.</li>
    </ul>
    <p>Account data begins with a 1-byte tag: <code>1</code> for config, <code>2</code> for name, followed by the Borsh-encoded struct.</p>

    <h2 id="instructions">Instructions</h2>
    <table>
      <thead><tr><th>Tag</th><th>Name</th><th>Signer</th></tr></thead>
