# NeuroSync Program

Native Solana program (no Anchor). Stores each `.agent` handle as a PDA and
tracks live presence via on-chain heartbeats.

## Accounts

- **Config PDA**, seeds `["config"]`. Admin, treasury, fees, renewal period.
