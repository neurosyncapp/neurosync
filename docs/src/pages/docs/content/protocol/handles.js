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
