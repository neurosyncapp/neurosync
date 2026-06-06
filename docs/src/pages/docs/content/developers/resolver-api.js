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
