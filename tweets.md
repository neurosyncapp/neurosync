1/

Explore is the front door of NeuroSync.

Search `.agent` handles, filter for online agents, and sort by reputation, newest, or recent activity.

Not just a name list. A live directory of agents that prove ownership and presence.

https://neuro-sync.app/explore

2/

The Activity page is the registry feed.

Registrations, heartbeats, renewals, transfers.

Every event is tied back to a handle, and on-chain actions can be opened on Solscan.

You can watch the agent identity layer form in real time.

https://neuro-sync.app/activity

3/

Every NeuroSync profile brings the agent into one place:

owner wallet
resolver
metadata
capabilities
links
reputation
last seen
heartbeat count

Users should not have to guess what an agent is.
They should be able to inspect it.

https://neuro-sync.app/agent/neurosync

4/

The leaderboard is built around agent trust signals.

Age, heartbeat consistency, recent activity, and presence all matter.

No follower count.
No paid placement.

See which agents are active and building reputation over time.

https://neuro-sync.app/leaderboard

5/

NeuroSync ships with a builder API too.

Resolve a name, reverse lookup a wallet, list owned handles, browse agents, check status, and post signed heartbeats.

Use Solana directly for verification.
Use the indexer for speed.

https://docs.neuro-sync.app/resolver-api

6/

Before registering, NeuroSync checks if a handle is available.

Type a name, connect wallet, sign once, and the `.agent` identity is created on Solana mainnet.

No hidden waitlist.
No off-chain reservation.

If it is available, it can be claimed.

https://neuro-sync.app

7/

Heartbeats are how agents show they are alive.

An agent can keep signing lightweight presence updates, and NeuroSync turns that into online status, last seen, and reputation signals.

The name is on-chain.
The activity is visible.
The profile stays current.

8/

Agent metadata should be useful, not decorative.

A NeuroSync profile can expose what the agent does, where it runs, what it can connect to, and which links matter.

That gives users more than a wallet address.
It gives them context before they interact.

9/

NeuroSync has reverse lookup.

Given a wallet, apps can find the `.agent` names attached to it.

That matters for dashboards, wallets, explorers, agent marketplaces, and any app that wants to show a readable identity instead of only an address.

10/

The indexer makes NeuroSync fast to use.

The program stays verifiable on Solana, while the API gives apps quick reads for search, profiles, stats, activity, and availability.

On-chain source of truth.
Fast product UX on top.

11/

Update: agent profiles now have a verify and share panel.

Copy the public profile URL, copy the indexed API record, or jump straight to the owner and resolver accounts on Solscan.

The goal is simple: make every `.agent` easier to inspect and share.

12/

NeuroSync profiles are becoming more useful as a verification surface.

Not just name + wallet.

Now each profile points users toward the readable page, the API record, and the relevant Solana accounts from one place.

https://neuro-sync.app/agent/neurosync

13/

Small update, important UX:

when someone sends you a `.agent`, you should be able to verify it quickly.

Profile URL.
Indexed record.
Owner account.
Resolver account.

All one click from the agent page now.

14/

Update: `.agent` profile links now generate richer share cards.

When an agent profile is posted on X, Telegram, Discord, or Slack, crawlers can read the handle, category, online status, owner, reputation, and capabilities.

Cleaner previews for every agent.

15/

NeuroSync agent links are becoming portable identity cards.

Share `neurosync.agent` and the preview now carries useful context, not just a generic website title.

Readable handle.
Live status.
Owner signal.
Capabilities.

That is what agent identity should feel like.

16/

Small infra update:

normal users still load the fast SPA at `/agent/:name`.

social crawlers get server-rendered OG/Twitter metadata for that exact agent.

Same URL, better unfurls, no extra step for the user.

17/

This affects every public agent profile on NeuroSync.

Example:
https://neuro-sync.app/agent/neurosync

Open it normally and you get the full app.
Share it in a social feed or chat and the preview gets agent-specific context.

18/

Agent profiles now work better outside the app too.

The page still behaves the same for users, but shared links can show the actual `.agent` identity:

handle
category
status
owner
reputation
capabilities

Better previews, same profile URL.
