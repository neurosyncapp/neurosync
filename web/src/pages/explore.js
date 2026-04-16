import { createFooter } from '../components/footer.js';
import { explore } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, repColor, escapeHtml } from '../lib/format.js';
import { emptyState } from '../components/empty.js';
import { createRevealer, popIn } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function explorePage(app) {
  app.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding-top:120px; min-height:100vh;';
  wrap.innerHTML = `
    <div class="container">
      <div class="reveal" style="margin-bottom:28px;">
        <h1 class="h-title" style="margin-bottom:8px;">Explore agents</h1>
        <p class="muted" style="font-size:15px;">Every registered handle, live from the chain.</p>
      </div>

      <div class="reveal" data-delay="90" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:24px;">
        <input id="ex-search" placeholder="Search handles…" autocomplete="off" spellcheck="false"
          style="flex:1; min-width:220px; background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:11px 14px; color:#fafafa; font-size:14px;" />
        <div id="ex-filter" style="display:flex; gap:6px;"></div>
        <select id="ex-sort" style="background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:0 12px; color:#a1a1aa; font-size:13px;">
          <option value="reputation">Top reputation</option>
          <option value="recent">Newest</option>
          <option value="active">Recently active</option>
        </select>
      </div>

      <div id="ex-grid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px;"></div>
      <div id="ex-empty" style="display:none; text-align:center; padding:80px 0; color:#52525b;"></div>
    </div>
  `;
  app.appendChild(wrap);
  app.appendChild(createFooter());

  const grid = wrap.querySelector('#ex-grid');
  const empty = wrap.querySelector('#ex-empty');
  const search = wrap.querySelector('#ex-search');
  const sortSel = wrap.querySelector('#ex-sort');
  const filterBox = wrap.querySelector('#ex-filter');

  let filter = 'all';
  ['all', 'online'].forEach((f) => {
    const b = document.createElement('button');
    b.className = 'btn btn-ghost';
    b.style.cssText = 'padding:9px 14px; font-size:13px;';
    b.textContent = f === 'all' ? 'All' : 'Online';
    b.dataset.f = f;
    b.addEventListener('click', () => { filter = f; paintFilter(); run(); });
    filterBox.appendChild(b);
  });
  const paintFilter = () => {
    filterBox.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.f === filter;
      b.style.borderColor = on ? 'rgba(139,92,246,0.5)' : 'var(--border)';
      b.style.color = on ? '#fafafa' : 'var(--text-dim)';
    });
  };
  paintFilter();

  function skeletons() {
    grid.innerHTML = Array.from({ length: 8 })
      .map(() => `<div class="skeleton" style="height:120px;"></div>`)
      .join('');
    empty.style.display = 'none';
  }

  let timer = null;
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 250);
  });
  sortSel.addEventListener('change', run);

  async function run() {
    skeletons();
    try {
      const { items = [] } = await explore({
        q: search.value.trim(),
        sort: sortSel.value,
        filter,
        limit: 60,
      });
      if (!items.length) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        empty.innerHTML = search.value
          ? `<div style="text-align:center; padding:72px 0; color:#52525b;">No handles match "<span style="color:#a1a1aa;">${escapeHtml(search.value)}</span>".</div>`
          : emptyState({
              icon: 'explore',
              title: 'No handles registered yet',
              text: 'The namespace just opened. Claim the first .agent handle and it will show up right here.',
              ctaLabel: 'Claim a handle',
              ctaHref: '/register',
            });
        return;
      }
      empty.style.display = 'none';
      grid.innerHTML = items.map(card).join('');
      popIn(grid.children, 40);
      grid.querySelectorAll('[data-name]').forEach((el) =>
        el.addEventListener('click', () => navigate(`/agent/${el.dataset.name}`))
      );
    } catch (e) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      empty.textContent = 'Could not load the registry. Try again shortly.';
    }
  }

  const reveal = createRevealer();
  reveal.mount(wrap);
  run();
  return () => {
    clearTimeout(timer);
    reveal.destroy();
  };
}
