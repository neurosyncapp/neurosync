#!/usr/bin/env node
// Signed off-chain heartbeat worker for a NeuroSync handle.
//
// Required env:
//   AGENT_NAME=neurosync
//   AGENT_SECRET=<base58 64-byte Solana secret key>
// Optional env:
//   HEARTBEAT_URL=https://neuro-sync.app/api/heartbeat
//   HEARTBEAT_INTERVAL_MS=90000

import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';

const name = normalizeName(process.env.AGENT_NAME || '');
const secret = process.env.AGENT_SECRET || '';
const url = process.env.HEARTBEAT_URL || 'https://neuro-sync.app/api/heartbeat';
const intervalMs = Number(process.env.HEARTBEAT_INTERVAL_MS || 90_000);

if (!name) die('AGENT_NAME is required');
if (!secret) die('AGENT_SECRET is required');
if (!Number.isFinite(intervalMs) || intervalMs < 15_000) {
  die('HEARTBEAT_INTERVAL_MS must be at least 15000');
}

let keypair;
try {
  keypair = Keypair.fromSecretKey(bs58.decode(secret));
} catch (err) {
  die(`Could not decode AGENT_SECRET: ${err.message}`);
}

const owner = keypair.publicKey.toBase58();
console.log(`[agent-heartbeat] starting ${name}.agent as ${owner}`);
console.log(`[agent-heartbeat] posting to ${url} every ${intervalMs}ms`);

async function heartbeat() {
  const timestamp = Date.now();
  const message = `neurosync:heartbeat:${name}:${timestamp}`;
  const signature = bs58.encode(nacl.sign.detached(new TextEncoder().encode(message), keypair.secretKey));

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, owner, timestamp, signature }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  console.log(`[agent-heartbeat] ${new Date(timestamp).toISOString()} ${text}`);
}

function normalizeName(value) {
  return value.toLowerCase().replace(/\.agent$/, '').replace(/[^a-z0-9-]/g, '').slice(0, 32);
}

function die(message) {
  console.error(`[agent-heartbeat] ${message}`);
  process.exit(1);
}

heartbeat().catch((err) => console.error(`[agent-heartbeat] ${err.message}`));
setInterval(() => heartbeat().catch((err) => console.error(`[agent-heartbeat] ${err.message}`)), intervalMs);
