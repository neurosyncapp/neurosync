// Central runtime config read from env once.
export const CONFIG = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://neurosync:neurosync@db:5432/neurosync',
  solanaRpc: process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  programId: process.env.PROGRAM_ID || '',
  network: process.env.NETWORK || 'mainnet-beta',
  suffix: process.env.NAME_SUFFIX || '.agent',
  treasury: process.env.TREASURY || '',
  registerFeeSol: Number(process.env.REGISTER_FEE_SOL || 0.05),
  onlineWindowMs: Number(process.env.ONLINE_WINDOW_MS || 300000),
  indexIntervalMs: Number(process.env.INDEX_INTERVAL_MS || 30000),
  twitter: process.env.TWITTER_URL || 'https://x.com/neurosyncapp',
};

export function publicConfig() {
  return {
    programId: CONFIG.programId,
    network: CONFIG.network,
    suffix: CONFIG.suffix,
    treasury: CONFIG.treasury,
    registerFeeSol: CONFIG.registerFeeSol,
    twitter: CONFIG.twitter,
    rpc: '/api/rpc',
  };
}
