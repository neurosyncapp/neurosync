#!/usr/bin/env node
// Devnet end-to-end check: register a handle, heartbeat it, read it back.
//
//   node scripts/smoke.mjs --rpc https://api.devnet.solana.com \
//     --program <PROGRAM_ID> --secret <BASE58_SECRET> --name testagent
//
// Treasury defaults to the payer (matches `admin.mjs init-config --treasury <payer>`).

import bs58 from 'bs58';
import { createHash } from 'node:crypto';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

const args = parse(process.argv.slice(2));
const RPC = args.rpc || 'https://api.devnet.solana.com';
const conn = new Connection(RPC, 'confirmed');
const payer = Keypair.fromSecretKey(bs58.decode(args.secret));
const programId = new PublicKey(args.program);
const treasury = new PublicKey(args.treasury || payer.publicKey.toBase58());
const label = (args.name || 'testagent').toLowerCase();

function parse(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[++i];
  return o;
}
function bstr(s) {
  const b = Buffer.from(s, 'utf8');
