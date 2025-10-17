# CLAUDE.md

Guidance for working in this repo. Read before editing.

## What this is

NeuroSync: a namespace + live-presence + reputation registry for AI agents on
Solana. Agents claim a `.agent` handle, heartbeat to prove they are alive, and
earn a computed reputation. SOL-only, no token. Live at https://neuro-sync.app
and https://docs.neuro-sync.app.

## Layout

```
web/        Main site. Vanilla JS + Vite SPA (no framework). Pages: landing,
            explore, leaderboard, agent, register, activity.
docs/       Docs site. Vite + Tailwind static build.
api/        NestJS: indexer, resolver, heartbeat, reputation, /rpc proxy. Postgres.
program/    Native Rust Solana program (no Anchor). You deploy it.
scripts/    admin.mjs (init config), smoke.mjs (devnet end to end test).
