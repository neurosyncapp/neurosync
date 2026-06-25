import { Buffer } from 'buffer';
// web3.js expects Node globals in the browser.
window.Buffer = window.Buffer || Buffer;
window.global = window.global || window;

import { route, initRouter } from './router.js';
import { createNavbar } from './components/navbar.js';
import { loadConfig } from './config.js';
import { walletService } from './lib/wallet.js';

import { landingPage } from './pages/landing.js';
import { explorePage } from './pages/explore.js';
import { agentPage } from './pages/agent.js';
import { registerPage } from './pages/register.js';
import { activityPage } from './pages/activity.js';
import { leaderboardPage } from './pages/leaderboard.js';
import { setupPage } from './pages/setup.js';

document.body.prepend(createNavbar());

route('/', landingPage);
route('/explore', explorePage);
route('/leaderboard', leaderboardPage);
route('/agent/:name', agentPage);
route('/agent/:name/setup', setupPage);
route('/register', registerPage);
route('/activity', activityPage);
// /docs lives on its own subdomain, redirect any in-app hit (nginx also 301s).
route('/docs', () => { window.location.href = 'https://docs.neuro-sync.app'; });

// Load runtime config + restore wallet before first paint, then start.
Promise.allSettled([loadConfig(), walletService.autoConnect()]).then(() => {
  initRouter();
});
