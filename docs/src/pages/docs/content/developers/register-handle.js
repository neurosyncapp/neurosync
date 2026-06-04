export function renderRegisterHandle() {
  return `
    <h1>Register a handle</h1>
    <p class="lead">Registration is a single instruction that creates the handle account and pays the fee in one transaction.</p>

    <h2 id="flow">The flow</h2>
    <ol>
      <li>Normalise the label and check availability (<code>GET /api/availability?name=</code>).</li>
      <li>Build the <code>Register</code> instruction.</li>
      <li>Have the user's wallet sign and send it.</li>
    </ol>

    <h2 id="instruction">The instruction</h2>
    <p>Tag <code>2</code>, followed by the Borsh-encoded label, metadata URI, and resolver.</p>
    <pre><code>accounts:
  0 payer     (signer, writable)
  1 name_pda  (writable)        // ["name", sha256(label)]
  2 config    (read-only)       // ["config"]
  3 treasury  (writable)        // receives the fee
  4 system program
