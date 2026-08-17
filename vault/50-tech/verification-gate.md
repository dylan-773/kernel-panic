---
title: Verification gate
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[simulation-harnesses]]", "[[difficulty-ramp]]", "[[the-plays]]"]
---

# Verification gate

**Nothing deploys unless all four are green.** Iron rule 5.

```bash
cd /home/lyd0n/Development/kernel-panic/kernel-panic-site/app

bun run typecheck
bun run src/game/dev/sim.ts        # tutorial MUST print 0/200
bun run src/game/dev/run-sim.ts    # run-layer invariants
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived
```

> [!warning] `cd` first, always
> Working-directory drift resolves a broken global toolchain. Run every command from `app/`.

## What each proves

| Command | Proves |
|---|---|
| `typecheck` | the content modules match their schemas. This is the schema enforcer for every hand-integrated proposal |
| `sim.ts` | the duel is balanced, the planner is honest, and the tutorial is unwinnable |
| `run-sim.ts` | the run layer's invariants hold across 40 full runs |
| `teach-sim.ts` | every mechanic is taught or explicitly waived |

## The curve to gate

> [!warning] The shipped curve is nine days plus a finale, and there are no longer nine days
> Gate the **KITTED** curve `~84 / 93 / 67 / 75 / 56 / 72 / 63 / 52 / 52, finale ~35`, with the kit-less proxy as a floor and nothing more (`94/67/60/46/53/41/32/18/13`, finale 0 by construction under `oppOpens`). Both are indexed on a day number that no longer bounds anything.
>
> What replaces it has to be **a win rate per job tier** plus a distribution over day lengths, because the player now chooses the difficulty by choosing how far to push. See [[difficulty-ramp]]. Until that exists, the gate has a hole in it and this note says so rather than pretending otherwise.

Still valid regardless of index: measured `pd` within 2.0 of `pdTarget`, median rounds 3 to 4, `<=2r` under about 40%.

A second gate the new design needs and does not have: **a failed day must leave permanent state unchanged.** That is a property test, not a balance number, and it is the one bug class the redesign invents. See [[save-and-load]].

## The absolute

**Tutorial: 0 wins in 200 seeds.** Not a target, a gate. See [[the-tutorial]].

## Deploy

Orchestrator only, on explicit user OK. Commit in `kernel-panic-site/`, push to main, then `deploy_website`, then verify live markers.

> [!warning] Live-site checks need `curl --compressed` and about 20s of CDN settle
> Grep all JS chunks for marker strings.

## The UI has its own gate

Panels are verified separately, by measurement rather than by eye. See [[law-10-verification]].

## See also

- [[simulation-harnesses]] · [[the-plays]] · [[validation]]
