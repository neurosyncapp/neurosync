# NeuroSync Program

Native Solana program (no Anchor). Stores each `.agent` handle as a PDA and
tracks live presence via on-chain heartbeats.

## Accounts

- **Config PDA**, seeds `["config"]`. Admin, treasury, fees, renewal period.
- **Name PDA**, seeds `["name", sha256(label)]`. Owner, resolver, timestamps,
  heartbeat count, label, metadata URI.

Account data is `[tag:u8][borsh struct]` where `tag` is `1` (config) or `2`
