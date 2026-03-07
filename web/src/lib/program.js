import { PublicKey, TransactionInstruction, SystemProgram, Transaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { getConfig } from '../config.js';

// Instruction tags, must match the on-chain program (program/src/instruction.rs).
const IX = {
  REGISTER: 2,
  HEARTBEAT: 3,
  UPDATE_RESOLVER: 4,
  UPDATE_METADATA: 5,
  TRANSFER: 6,
  RENEW: 7,
};

function programId() {
  const id = getConfig().programId;
  if (!id) throw new Error('Program not configured yet');
  return new PublicKey(id);
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(digest);
}

function borshString(str) {
  const utf8 = Buffer.from(str, 'utf8');
  const len = Buffer.alloc(4);
  len.writeUInt32LE(utf8.length, 0);
  return Buffer.concat([len, utf8]);
}

export function deriveConfigPda() {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], programId());
}

// seeds = ["name", sha256(label)], sha256 keeps every seed within the 32-byte limit.
export async function deriveNamePda(label) {
  const hash = await sha256(new TextEncoder().encode(label));
  return PublicKey.findProgramAddressSync([Buffer.from('name'), Buffer.from(hash)], programId());
}

export async function buildRegisterIx({ payer, label, metadataUri = '', resolver }) {
  const cfg = getConfig();
  const pid = programId();
  const [namePda] = await deriveNamePda(label);
  const [configPda] = deriveConfigPda();
  const treasury = new PublicKey(cfg.treasury);
  const resolverKey = new PublicKey(resolver || payer);

  const data = Buffer.concat([
    Buffer.from([IX.REGISTER]),
    borshString(label),
    borshString(metadataUri),
    resolverKey.toBuffer(),
  ]);

  return new TransactionInstruction({
    programId: pid,
    keys: [
      { pubkey: new PublicKey(payer), isSigner: true, isWritable: true },
      { pubkey: namePda, isSigner: false, isWritable: true },
      { pubkey: configPda, isSigner: false, isWritable: false },
      { pubkey: treasury, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

