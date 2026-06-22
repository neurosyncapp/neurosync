#!/usr/bin/env node
// NeuroSync admin CLI, initialise/update the on-chain config PDA.
//
//   node scripts/admin.mjs init-config --keypair ~/.config/solana/id.json \
//       --rpc https://api.mainnet-beta.solana.com \
//       --treasury <PUBKEY> --fee 0.05 --renew 0.05 --period 0
//
//   node scripts/admin.mjs info --rpc <url> --program <PROGRAM_ID>
//
// period 0 => names never expire (flat one-time fee). Use 31536000 for yearly.

import fs from 'node:fs';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
const RPC = args.rpc || process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com';
const conn = new Connection(RPC, 'confirmed');

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) out[a.slice(2)] = argv[++i];
    else out._.push(a);
  }
  return out;
}

function loadKeypair(path) {
  const p = path.replace(/^~/, process.env.HOME || process.env.USERPROFILE);
  return Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(p, 'utf8'))));
}

function configPda(programId) {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], programId);
}

function u64le(n) {
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(BigInt(Math.round(n)));
  return b;
}
function i64le(n) {
  const b = Buffer.alloc(8);
  b.writeBigInt64LE(BigInt(Math.round(n)));
  return b;
}

async function initConfig() {
  if (!args.keypair) throw new Error('--keypair required');
  if (!args.program) throw new Error('--program <PROGRAM_ID> required');
  if (!args.treasury) throw new Error('--treasury <PUBKEY> required');
  const admin = loadKeypair(args.keypair);
  const programId = new PublicKey(args.program);
  const treasury = new PublicKey(args.treasury);
  const [config] = configPda(programId);

  const fee = Math.round(Number(args.fee ?? 0.05) * LAMPORTS_PER_SOL);
  const renew = Math.round(Number(args.renew ?? args.fee ?? 0.05) * LAMPORTS_PER_SOL);
  const period = Number(args.period ?? 0);

  const exists = await conn.getAccountInfo(config);
  const tag = exists ? 1 : 0; // UpdateConfig vs InitConfig

  const data = Buffer.concat([
    Buffer.from([tag]),
    treasury.toBuffer(),
    u64le(fee),
    u64le(renew),
    i64le(period),
  ]);

  const keys = exists
    ? [
        { pubkey: admin.publicKey, isSigner: true, isWritable: true },
        { pubkey: config, isSigner: false, isWritable: true },
      ]
    : [
        { pubkey: admin.publicKey, isSigner: true, isWritable: true },
        { pubkey: config, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ];

  const ix = new TransactionInstruction({ programId, keys, data });
  const sig = await sendAndConfirmTransaction(conn, new Transaction().add(ix), [admin]);
  console.log(`${exists ? 'Updated' : 'Initialised'} config PDA ${config.toBase58()}`);
  console.log(`  treasury : ${treasury.toBase58()}`);
  console.log(`  fee      : ${fee / LAMPORTS_PER_SOL} SOL`);
  console.log(`  renew    : ${renew / LAMPORTS_PER_SOL} SOL`);
  console.log(`  period   : ${period}s ${period === 0 ? '(permanent)' : ''}`);
  console.log(`  tx       : ${sig}`);
}

async function info() {
  if (!args.program) throw new Error('--program <PROGRAM_ID> required');
  const programId = new PublicKey(args.program);
  const [config] = configPda(programId);
  const acc = await conn.getAccountInfo(config);
  if (!acc) return console.log('Config PDA not initialised.');
  const d = acc.data;
  let o = 1;
  const treasury = new PublicKey(d.subarray(o, o + 32)); o += 32 + 32; // skip admin? layout: admin,treasury
  // layout after tag: admin(32) treasury(32) fee(8) renew(8) period(8) bump(1)
  o = 1;
  const admin = new PublicKey(d.subarray(o, o + 32)); o += 32;
  const treas = new PublicKey(d.subarray(o, o + 32)); o += 32;
  const fee = Number(d.readBigUInt64LE(o)); o += 8;
  const renew = Number(d.readBigUInt64LE(o)); o += 8;
  const period = Number(d.readBigInt64LE(o)); o += 8;
  console.log(`Config ${config.toBase58()}`);
  console.log(`  admin    : ${admin.toBase58()}`);
  console.log(`  treasury : ${treas.toBase58()}`);
  console.log(`  fee      : ${fee / LAMPORTS_PER_SOL} SOL`);
  console.log(`  renew    : ${renew / LAMPORTS_PER_SOL} SOL`);
  console.log(`  period   : ${period}s`);
