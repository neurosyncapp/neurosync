import { createFooter } from '../components/footer.js';
import { getActivity } from '../api.js';
import { navigate } from '../router.js';
import { timeAgo, shorten, escapeHtml } from '../lib/format.js';
import { emptyState } from '../components/empty.js';
import { createRevealer } from '../lib/animate.js';
import { SUFFIX } from '../config.js';

// Mirrors cognito's activity page: header + filter tabs + animated feed.
// Event types are registry events instead of trade actions.
