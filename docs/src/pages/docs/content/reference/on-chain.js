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
      <tbody>
        <tr><td>0</td><td>InitConfig</td><td>admin</td></tr>
        <tr><td>1</td><td>UpdateConfig</td><td>admin</td></tr>
        <tr><td>2</td><td>Register</td><td>payer</td></tr>
        <tr><td>3</td><td>Heartbeat</td><td>owner</td></tr>
        <tr><td>4</td><td>UpdateResolver</td><td>owner</td></tr>
        <tr><td>5</td><td>UpdateMetadata</td><td>owner</td></tr>
        <tr><td>6</td><td>Transfer</td><td>owner</td></tr>
        <tr><td>7</td><td>Renew</td><td>payer</td></tr>
      </tbody>
    </table>

    <h2 id="layout">Data layout</h2>
    <p>The name record, after the tag byte, in declaration order:</p>
    <pre><code>owner           : [u8; 32]
