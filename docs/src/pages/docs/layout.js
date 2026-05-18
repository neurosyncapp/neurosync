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
