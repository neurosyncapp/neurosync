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
