import { renderIntroduction } from './content/getting-started/introduction.js';
import { renderCoreConcepts } from './content/getting-started/core-concepts.js';
import { renderQuickstart } from './content/getting-started/quickstart.js';
import { renderHandles } from './content/protocol/handles.js';
import { renderPresence } from './content/protocol/presence.js';
import { renderReputation } from './content/protocol/reputation.js';
import { renderResolution } from './content/protocol/resolution.js';
import { renderRegisterHandle } from './content/developers/register-handle.js';
import { renderHeartbeat } from './content/developers/heartbeat.js';
import { renderResolverApi } from './content/developers/resolver-api.js';
import { renderOnChain } from './content/reference/on-chain.js';
import { renderFaq } from './content/reference/faq.js';

export const docPages = {
  introduction: {
    title: 'Introduction',
    content: renderIntroduction,
    toc: [
      { id: 'what-is-neurosync', title: 'What is NeuroSync?' },
      { id: 'the-gap', title: 'The gap it fills' },
      { id: 'three-layers', title: 'Three layers' },
    ],
  },
  'core-concepts': {
    title: 'Core Concepts',
    content: renderCoreConcepts,
    toc: [
      { id: 'handle', title: 'Handle' },
      { id: 'presence', title: 'Presence' },
      { id: 'reputation', title: 'Reputation' },
      { id: 'resolver', title: 'Resolver' },
    ],
  },
  quickstart: {
    title: 'Quickstart',
    content: renderQuickstart,
    toc: [
      { id: 'claim', title: '1. Claim a handle' },
      { id: 'sync', title: '2. Start syncing' },
      { id: 'verify', title: '3. Verify' },
    ],
  },
  handles: {
    title: 'Handles',
    content: renderHandles,
    toc: [
      { id: 'format', title: 'Format' },
      { id: 'derivation', title: 'Address derivation' },
      { id: 'lifecycle', title: 'Lifecycle' },
    ],
  },
  presence: {
    title: 'Presence',
    content: renderPresence,
    toc: [
      { id: 'model', title: 'The model' },
      { id: 'on-chain', title: 'On-chain heartbeat' },
      { id: 'off-chain', title: 'Signed ping' },
      { id: 'online-state', title: 'Online state' },
    ],
  },
  reputation: {
    title: 'Reputation',
    content: renderReputation,
    toc: [
      { id: 'components', title: 'Components' },
      { id: 'formula', title: 'Formula' },
      { id: 'gaming', title: 'On gaming' },
    ],
  },
  resolution: {
    title: 'Resolution',
    content: renderResolution,
    toc: [
      { id: 'forward', title: 'Forward' },
      { id: 'reverse', title: 'Reverse' },
      { id: 'no-api', title: 'Resolving without the API' },
    ],
  },
  'register-handle': {
    title: 'Register a handle',
    content: renderRegisterHandle,
    toc: [
      { id: 'flow', title: 'The flow' },
      { id: 'instruction', title: 'The instruction' },
      { id: 'snippet', title: 'Snippet' },
    ],
  },
  heartbeat: {
    title: 'Heartbeat integration',
    content: renderHeartbeat,
    toc: [
      { id: 'message', title: 'The message' },
      { id: 'sign', title: 'Sign and send' },
      { id: 'interval', title: 'Interval' },
    ],
  },
  'resolver-api': {
    title: 'Resolver API',
    content: renderResolverApi,
    toc: [
      { id: 'base', title: 'Base URL' },
      { id: 'endpoints', title: 'Endpoints' },
      { id: 'rpc', title: 'RPC proxy' },
    ],
  },
  'on-chain': {
    title: 'On-chain program',
    content: renderOnChain,
    toc: [
      { id: 'accounts', title: 'Accounts' },
      { id: 'instructions', title: 'Instructions' },
      { id: 'layout', title: 'Data layout' },
    ],
  },
  faq: { title: 'FAQ', content: renderFaq, toc: [{ id: 'faq', title: 'Questions' }] },
};

const orderedDocKeys = Object.keys(docPages);
const getDocPath = (id) => `/${id}`;

function renderSidebarContent(activePage) {
  const navLink = (id, name) =>
    `<a href="${getDocPath(id)}" class="sidebar-link ${id === activePage ? 'active' : ''}">${name}</a>`;
  const section = (title, keys) => `
    <div class="space-y-2">
      <h4 class="sidebar-heading">${title}</h4>
      <div class="space-y-0.5">${keys.map((k) => navLink(k, docPages[k].title)).join('')}</div>
    </div>`;
  return `
    <nav class="space-y-8">
      ${section('GETTING STARTED', ['introduction', 'core-concepts', 'quickstart'])}
      ${section('PROTOCOL', ['handles', 'presence', 'reputation', 'resolution'])}
      ${section('DEVELOPERS', ['register-handle', 'heartbeat', 'resolver-api'])}
      ${section('REFERENCE', ['on-chain', 'faq'])}
    </nav>`;
}

function renderToc(pageId) {
  const toc = docPages[pageId]?.toc || [];
  if (!toc.length) return '';
  return `
    <nav>
      <h4 class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">On this page</h4>
      <ul class="space-y-1">
        ${toc
          .map(
            (i) =>
              `<li><a href="#${i.id}" class="block text-sm text-text-secondary hover:text-text-primary transition-colors py-1.5 px-3 rounded-md hover:bg-panel-light">${i.title}</a></li>`,
          )
          .join('')}
      </ul>
    </nav>`;
}

function renderMobileNav(activePage) {
  return `
    <div id="docs-mobile-overlay" class="fixed inset-0 bg-black/60 z-40 hidden lg:hidden"></div>
    <div id="docs-mobile-panel" class="fixed top-0 left-0 w-72 h-full bg-background z-50 transform -translate-x-full transition-transform duration-300 ease-in-out lg:hidden border-r border-border-color">
      <div class="h-full overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
          <span class="font-semibold text-text-primary">Menu</span>
          <button id="docs-mobile-close" class="p-2 text-text-secondary hover:text-text-primary">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        ${renderSidebarContent(activePage)}
      </div>
    </div>`;
}

function renderNavButtons(pageKey) {
  const i = orderedDocKeys.indexOf(pageKey);
  const prev = i > 0 ? orderedDocKeys[i - 1] : null;
  const next = i < orderedDocKeys.length - 1 ? orderedDocKeys[i + 1] : null;
  const btn = (key, dir) =>
    key
      ? `<a href="${getDocPath(key)}" class="group flex flex-col gap-1 p-4 rounded-lg border border-border-color hover:border-primary-blue/50 hover:bg-panel-light transition-colors ${dir === 'next' ? 'items-end text-right' : 'items-start'}">
          <span class="text-xs text-text-muted">${dir === 'next' ? 'Next' : 'Previous'}</span>
          <span class="font-medium text-primary-blue">${docPages[key].title}</span>
