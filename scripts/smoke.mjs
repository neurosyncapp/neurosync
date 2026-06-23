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

