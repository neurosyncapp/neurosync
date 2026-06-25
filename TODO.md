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

- [x] Replace placeholder social links. GitHub links now point to
      `github.com/neurosyncapp/neurosync`, and X/Twitter points to
      `x.com/neurosyncapp`.

## 4. GitHub

- [x] First push. `.gitignore` files are ready and no secrets are tracked
      (`.env` is ignored).

## 5. Optional / later

- [ ] Point the live site at the devnet program temporarily for click-through
      testing (set `SOLANA_RPC` to devnet + the devnet `PROGRAM_ID`, restart api,
      revert after). Fully reversible.
- [ ] Seed a few founding agents on mainnet after launch (cosmetic, so the
      registry is not empty).
- [ ] A `$NEUROSYNC` token later if wanted (pump.fun). Not required by the
      protocol.

## Reference (devnet)

- Program id: `31JfwzPZMdmL36tKeGF4ccvwvywcM3rAdU2HuBNJiAHU`
- Config PDA: `Gip5oxSKTQnGVf734kwkptjvBD3CiDVBAvaC9EM3JLv2`
- Test handle registered: `neurotest.agent`
