// Central runtime config read from env once.
export const CONFIG = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://neurosync:neurosync@db:5432/neurosync',
  solanaRpc: process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
