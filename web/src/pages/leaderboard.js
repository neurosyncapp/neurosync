import { createFooter } from '../components/footer.js';
import { explore } from '../api.js';
import { navigate } from '../router.js';
import { isOnline, timeAgo, shorten, repColor, escapeHtml } from '../lib/format.js';
import { emptyState } from '../components/empty.js';
