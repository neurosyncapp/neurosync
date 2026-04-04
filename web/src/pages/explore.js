import { createFooter } from '../components/footer.js';
import { explore } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, repColor, escapeHtml } from '../lib/format.js';
import { emptyState } from '../components/empty.js';
import { createRevealer, popIn } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

export function explorePage(app) {
  app.innerHTML = '';
