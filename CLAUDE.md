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
nginx/      Edge proxy configs (bootstrap.conf, full.conf, generated active.conf).
```

## Hard rules

- NO em dashes anywhere (site, docs, README, comments, commits). Use commas,
  periods, or parentheses. This is a standing preference.
- No gimmicky "live" / "online" blinking text or fake counters. Keep it
  minimalist and clean. Branding is dark with purple accents (`#8b5cf6`,
  `#a78bfa`), near-black background.
- The on-chain byte layout is duplicated in three places and MUST stay in sync:
  `program/src/state.rs` (writes it), `api/src/indexer/indexer.service.ts`
  (decodes it), `web/src/lib/program.js` (builds instructions). Change all three
  together. Same for instruction tags.
- Secrets live only in the server `.env` (gitignored). The Helius RPC key never
  reaches the browser; all client RPC goes through `/api/rpc`. Never commit keys
  or write them into tracked files.

## Build and run

Local dev:
```
docker compose -f docker-compose.dev.yml up -d   # db + api on :4000
cd web  && npm install && npm run dev             # :3000
cd docs && npm install && npm run dev             # :5175
```

Each frontend builds with `npm run build` (Vite). The api builds with
`nest build`.

## Deploy (this server)

The project lives at `/root/neurosync`. Standard redeploy from a dev machine:

```
# from the repo parent dir
tar czf neurosync.tgz --exclude=node_modules --exclude=dist --exclude=target \
  --exclude=.git neurosync
scp neurosync.tgz root@neurosync:/root/
ssh root@neurosync 'cd /root && cp neurosync/.env /tmp/ns.env && \
  cp neurosync/nginx/active.conf /tmp/ns.active; tar xzf neurosync.tgz && \
  cp /tmp/ns.env neurosync/.env && cp /tmp/ns.active neurosync/nginx/active.conf && \
  cd neurosync && docker compose up -d --build web'   # or: docs / api
```

Always preserve `.env` and `nginx/active.conf` across extraction (they are not
in the tarball). Rebuild only the service you changed (`web`, `docs`, or `api`).

