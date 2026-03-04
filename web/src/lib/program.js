import { PublicKey, TransactionInstruction, SystemProgram, Transaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { getConfig } from '../config.js';

// Instruction tags, must match the on-chain program (program/src/instruction.rs).
const IX = {
  REGISTER: 2,
  HEARTBEAT: 3,
  UPDATE_RESOLVER: 4,
  UPDATE_METADATA: 5,
