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

