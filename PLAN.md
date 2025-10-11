# NeuroSync, Build & Deploy Plan

The full technical plan: what was built, the decisions behind it, and the exact
runbook to get to (and stay) live.

## 1. Product

A namespace + live-presence + reputation registry for AI agents on Solana.
Differentiates from a plain name registry (e.g. NEURONS/NeuralNS) by adding:

- **Presence**, heartbeats prove an agent is running; the registry shows online / last-seen.
- **Reputation**, a computed 0-100 score from on-chain age, heartbeat consistency, and recency. No paid badge.
- **SOL-only**, flat fee, no token, no price peg.

Handle suffix: `.agent`. Network: mainnet.

## 2. Architecture

```
neuro-sync.app / www  ─┐
docs.neuro-sync.app  ─┤  nginx edge (TLS, ACME, host routing, /api proxy)
                      ├─> web   static SPA
                      ├─> docs  static site
                      └─> api   NestJS ─> db (postgres)
                          certbot (renew)   ─> Helius RPC (server-side only)
```

- **web**, cloned from the cognito frontend (vanilla JS + Vite), rebranded dark/purple, new video, registry pages. RPC goes through `/api/rpc` so the Helius key stays server-side. Runtime config (program id, fee) fetched from `/api/config`, so no rebuild is needed when the program goes live.
- **api**, indexes `getProgramAccounts`, decodes name records, serves resolve/reverse/explore/stats/activity, verifies signed heartbeats (ed25519), computes reputation. Pre-launch safe: with `PROGRAM_ID` empty it serves empty results instead of erroring.
- **program**, native Rust, 2 account types (config, name), 8 instructions. Account data is `[tag][borsh struct]`; the same layout is decoded by the indexer and built by the web client.

## 3. Key decisions

- **Runtime config over build-time**, the frontend reads program id / fee from the API at boot. Operator sets env once; no frontend rebuild to launch.
- **Two heartbeat paths**, on-chain (provable, costs fees, feeds reputation) and signed off-chain ping (free, frequent, drives "online").
- **Single SAN cert** for all three hostnames under `live/neuro-sync.app`.
- **Secrets**, `.env` only, gitignored. RPC key never in client bundle. No personal email baked into tracked files (ACME email read from `.env`).

## 4. Deploy runbook

```bash
# 1. copy project to server (rsync/scp) into /root/neurosync
# 2. configure
cp .env.example .env
#   set POSTGRES_PASSWORD, SOLANA_RPC (Helius), ACME_EMAIL
# 3. bring up + issue certs
bash init-ssl.sh
# 4. verify
curl -I https://neuro-sync.app
curl -I https://docs.neuro-sync.app
curl  https://neuro-sync.app/api/health
```

DNS: `neuro-sync.app`, `www`, and `docs` all A-record to the server.

## 5. Going to mainnet (program)
