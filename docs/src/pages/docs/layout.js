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
