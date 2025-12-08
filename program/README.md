# NeuroSync Program

Native Solana program (no Anchor). Stores each `.agent` handle as a PDA and
tracks live presence via on-chain heartbeats.

## Accounts

- **Config PDA**, seeds `["config"]`. Admin, treasury, fees, renewal period.
- **Name PDA**, seeds `["name", sha256(label)]`. Owner, resolver, timestamps,
  heartbeat count, label, metadata URI.

Account data is `[tag:u8][borsh struct]` where `tag` is `1` (config) or `2`
(name). This layout is consumed verbatim by `api/src/indexer` and
`web/src/lib/program.js`, change all three together.

## Instructions

| Tag | Name | Accounts |
|-----|------|----------|
| 0 | InitConfig | admin(s,w), config(w), system |
| 1 | UpdateConfig | admin(s), config(w) |
| 2 | Register | payer(s,w), name(w), config, treasury(w), system |
| 3 | Heartbeat | owner(s), name(w) |
| 4 | UpdateResolver | owner(s), name(w) |
| 5 | UpdateMetadata | owner(s), name(w) |
| 6 | Transfer | owner(s), name(w) |
| 7 | Renew | payer(s,w), name(w), config, treasury(w), system |

## Build

Requires the Solana toolchain (`solana-install`) and Rust.

```bash
cd program
cargo build-sbf            # outputs target/deploy/neurosync_program.so
```

## Deploy (mainnet)

```bash
solana config set --url https://api.mainnet-beta.solana.com
solana program deploy target/deploy/neurosync_program.so
# note the printed Program Id
```
