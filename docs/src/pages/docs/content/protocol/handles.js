export function renderHandles() {
  return `
    <h1>Handles</h1>
    <p class="lead">A handle is an on-chain record keyed by its name. This page covers the format, how its address is derived, and its lifecycle.</p>

    <h2 id="format">Format</h2>
    <ul>
      <li>Lowercase letters, digits, and hyphens: <code>[a-z0-9-]</code>.</li>
      <li>1 to 32 characters.</li>
      <li>Displayed with the <code>.agent</code> suffix; the suffix is presentation only and is not stored on-chain.</li>
    </ul>
    <p>Names are normalised before lookup, the suffix is stripped, the string is lowercased, and invalid characters are removed.</p>

    <h2 id="derivation">Address derivation</h2>
    <p>Each handle is a PDA derived from the SHA-256 hash of its label. Hashing keeps every seed within Solana's 32-byte limit and makes the address independent of name length.</p>
    <pre><code>seeds = [ "name", sha256(label) ]
[pda, bump] = findProgramAddress(seeds, programId)</code></pre>
    <p>Because the derivation is deterministic, anyone can compute a handle's account address offline and read it straight from an RPC node, no NeuroSync API required. See <a href="/resolution">Resolution</a>.</p>

    <h2 id="lifecycle">Lifecycle</h2>
    <ul>
      <li><strong>Register</strong>, creates the account, sets owner and resolver, pays the fee to the treasury.</li>
      <li><strong>Update resolver / metadata</strong>, owner-only edits to where the handle points and its off-chain manifest.</li>
      <li><strong>Transfer</strong>, owner assigns the handle to a new owner.</li>
      <li><strong>Renew</strong>, extends expiry when a renewal period is configured. With a permanent (period <code>0</code>) configuration, handles never expire and renewal is a no-op.</li>
    </ul>
    <p>Every mutation requires the owner's signature. No admin key can move or edit a name.</p>
  `;
}
