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
