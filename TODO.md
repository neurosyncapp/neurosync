# NeuroSync, what is left

Status as of launch prep. The site, docs, API, and infra are live. The program
is deployed and verified on devnet. Remaining work below.

## 1. Mainnet program

Devnet is done and proven (register + heartbeat + readback all passed). Mainnet
is deployed and configured:

- [x] Build and deploy mainnet program.
- [x] Init config with `0.05 SOL` permanent registrations.
- [x] On the server, set `PROGRAM_ID` and `TREASURY`, then recreate API.
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

## Reference (mainnet)

- Program id: `31JfwzPZMdmL36tKeGF4ccvwvywcM3rAdU2HuBNJiAHU`
- Config PDA: `Gip5oxSKTQnGVf734kwkptjvBD3CiDVBAvaC9EM3JLv2`
- Treasury: `Di9vhZ87yZLY3U6iS2fGSqKfUbwcp4zkRwLuySTcETgQ`
