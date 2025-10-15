# NeuroSync, what is left

Status as of launch prep. The site, docs, API, and infra are live. The program
is deployed and verified on devnet. Remaining work below.

## 1. Mainnet program (the main blocker for registration)

Devnet is done and proven (register + heartbeat + readback all passed). To go
live on mainnet:

- [ ] Build: `cd program && cargo build-sbf --arch v3`
      (confirm arch at deploy time; mainnet may also have v0/v1 disabled).
- [ ] Deploy with your own mainnet keypair as upgrade authority:
      `solana program deploy target/deploy/neurosync_program.so`, note PROGRAM_ID.
- [ ] Init config: `node scripts/admin.mjs init-config --rpc <mainnet> \
      --keypair <your-keypair> --program <PROGRAM_ID> --treasury <TREASURY> \
      --fee 0.05 --period 0`.
- [ ] On the server, set in `/root/neurosync/.env`:
      `PROGRAM_ID=<...>` and `TREASURY=<...>`, then `docker compose restart api`.
- [ ] Verify: open neuro-sync.app, claim a handle, confirm it shows in Explore.

## 2. Secrets

- [ ] Rotate the Helius RPC API key. It was pasted in chat, so treat it as
      exposed. Update `SOLANA_RPC` in the server `.env` and
      `docker compose restart api`. The key only lives in `.env` and is proxied
      via `/api/rpc`, never in the client bundle.

## 3. Branding details

- [ ] Replace placeholder socials. Currently `x.com/neurosync` and
      `github.com/neurosync` (placeholders) in `web/src/components/navbar.js`,
      `footer.js`, and `TWITTER_URL` in the server `.env`. Update, then rebuild
      web.

## 4. GitHub
