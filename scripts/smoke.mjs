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
  const len = Buffer.alloc(4);
  len.writeUInt32LE(b.length);
  return Buffer.concat([len, b]);
}
function sha256(s) {
  return createHash('sha256').update(Buffer.from(s, 'utf8')).digest();
}
const configPda = () => PublicKey.findProgramAddressSync([Buffer.from('config')], programId)[0];
const namePda = (l) => PublicKey.findProgramAddressSync([Buffer.from('name'), sha256(l)], programId)[0];

function decodeName(data) {
  if (!data || data[0] !== 2) return null;
  let o = 1;
  const owner = new PublicKey(data.subarray(o, o + 32)); o += 32;
  const resolver = new PublicKey(data.subarray(o, o + 32)); o += 32;
  const registeredAt = Number(data.readBigInt64LE(o)); o += 8;
  const expiresAt = Number(data.readBigInt64LE(o)); o += 8;
  const lastBeat = Number(data.readBigInt64LE(o)); o += 8;
  const beats = Number(data.readBigUInt64LE(o)); o += 8;
  o += 1;
  const ll = data.readUInt32LE(o); o += 4;
  const lbl = data.subarray(o, o + ll).toString('utf8');
  return { owner: owner.toBase58(), resolver: resolver.toBase58(), registeredAt, expiresAt, lastBeat, beats, label: lbl };
}

