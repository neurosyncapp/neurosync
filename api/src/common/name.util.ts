import { createHash } from 'crypto';
import { PublicKey } from '@solana/web3.js';

const VALID = /^[a-z0-9-]{1,32}$/;

export function normalizeName(raw: string): string {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\.agent$/, '')
    .replace(/[^a-z0-9-]/g, '');
}

export function isValidName(name: string): boolean {
  return VALID.test(name);
}

export function labelHash(label: string): Buffer {
  return createHash('sha256').update(Buffer.from(label, 'utf8')).digest();
}

// PDA derivation, must match program/src and web/src/lib/program.js.
export function nametPda(programId: PublicKey, label: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('name'), labelHash(label)],
    programId,
  );
  return pda;
}

export function configPda(programId: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from('config')], programId);
  return pda;
}
