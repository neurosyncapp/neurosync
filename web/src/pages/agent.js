import { createFooter } from '../components/footer.js';
import { getAgent } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, shorten, repColor, escapeHtml } from '../lib/format.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function agentPage(app, params) {
  app.innerHTML = '';
  const name = (params.name || '').replace(/\.agent$/, '');
