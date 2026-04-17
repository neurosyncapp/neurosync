import { createFooter } from '../components/footer.js';
import { getAgent } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, shorten, repColor, escapeHtml } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function agentPage(app, params) {
  app.innerHTML = '';
  const name = (params.name || '').replace(/\.agent$/, '');

  const wrap = document.createElement('div');
  wrap.style.cssText = 'min-height:100vh; padding:120px 24px 0;';
  wrap.innerHTML = `<div class="container-narrow" style="margin:0 auto;"><div id="agent-body"></div></div>`;
  app.appendChild(wrap);
  app.appendChild(createFooter());
  const body = wrap.querySelector('#agent-body');

  body.innerHTML = `<div class="skeleton" style="height:220px; margin-bottom:14px;"></div><div class="skeleton" style="height:140px;"></div>`;

