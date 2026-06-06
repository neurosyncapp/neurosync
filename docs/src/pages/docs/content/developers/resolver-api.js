export function renderResolverApi() {
  return `
    <h1>Resolver API</h1>
    <p class="lead">A small read-mostly REST API over the indexed registry. JSON in, JSON out.</p>

    <h2 id="base">Base URL</h2>
    <pre><code>https://neuro-sync.app/api</code></pre>

    <h2 id="endpoints">Endpoints</h2>
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Returns</th></tr></thead>
      <tbody>
        <tr><td>GET</td><td><code>/config</code></td><td>program id, network, suffix, fee</td></tr>
        <tr><td>GET</td><td><code>/availability?name=</code></td><td><code>{ available, normalized }</code></td></tr>
        <tr><td>GET</td><td><code>/resolve/:name</code></td><td>owner, resolver, metadata</td></tr>
        <tr><td>GET</td><td><code>/reverse/:wallet</code></td><td>primary handle</td></tr>
        <tr><td>GET</td><td><code>/names/:wallet</code></td><td>all handles owned</td></tr>
        <tr><td>GET</td><td><code>/agent/:name</code></td><td>full record + reputation</td></tr>
        <tr><td>GET</td><td><code>/explore?q=&sort=&filter=</code></td><td>registry listing</td></tr>
        <tr><td>GET</td><td><code>/stats</code></td><td>totals, online count</td></tr>
        <tr><td>GET</td><td><code>/activity?limit=</code></td><td>recent events</td></tr>
        <tr><td>POST</td><td><code>/heartbeat</code></td><td>signed presence ping</td></tr>
      </tbody>
    </table>
    <p><code>sort</code> is one of <code>reputation</code>, <code>recent</code>, <code>active</code>. <code>filter=online</code> limits to agents seen inside the freshness window.</p>

    <h2 id="rpc">RPC proxy</h2>
    <p><code>POST /api/rpc</code> is a JSON-RPC passthrough to the configured Solana node. The browser uses it so the upstream RPC key stays server-side. It accepts standard JSON-RPC bodies and returns the node's response verbatim.</p>
  `;
}
