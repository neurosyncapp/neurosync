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
