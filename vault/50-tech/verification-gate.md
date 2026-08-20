---
title: Verification gate
status: canon
source: code
owner: orchestrator
updated: 2026-08-19
related: ["[[simulation-harnesses]]", "[[difficulty-ramp]]", "[[the-plays]]", "[[save-and-load]]"]
---

# Verification gate

**Nothing deploys unless all four are green.** Iron rule 5.

```bash
cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app

bun run typecheck
bun run src/game/dev/sim.ts        # tutorial MUST print 0/200; self-gates the tier bands
bun run src/game/dev/run-sim.ts    # day-machine invariants incl. the bust property
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived; exit 1 names the gap
```

> [!warning] `cd` first, always
> Working-directory drift resolves a broken global toolchain. Run every command from `app/`.

## What each proves

| Command | Proves |
|---|---|
| `typecheck` | the content modules match their schemas. This is the schema enforcer for every hand-integrated proposal |
| `sim.ts` | the duel is balanced per tier, the planner is honest, and the tutorial is unwinnable |
| `run-sim.ts` | the day machine's invariants hold across long synthetic careers, including the bust property |
| `teach-sim.ts` | every mechanic is taught or explicitly waived, and every waiver's machine-checkable premise still holds |

## The curve to gate: win rate per tier

> [!info] As built 2026-08-19
> The old nine-day curve is gone with the run layer. `sim.ts` now gates **win bands per job tier** (`WIN_BANDS` in `sim.ts`), self-enforcing: the harness exits 1 if any kitted tier leaves its band.

| Tier | Band | Measured (2026-08-19, kitted stage decks) |
|---|---|---|
| 1 | 65 to 95 | 81.5% |
| 2 | 65 to 95 | 85.5% |
| 3 | 45 to 75 | 60.0% |
| 4 | 35 to 70 | 52.5% |
| 5 | 25 to 70 | 48.5% |
| backroom | 15 to 60 | 39.5% |

The kit-less proxy is a floor and nothing more. The player chooses difficulty by choosing how far to push in a day, so the bands widen with tier: a tier 5 job is a wager, never a wall. See [[difficulty-ramp]] and `tierBandFor` in `content/tiers.ts` for what tiers a day can roll.

Still gated alongside the bands: measured `pd` within 2.0 of `pdTarget` per tier, median rounds 3 to 4, and the backroom's tier-1-equivalent close count at exactly 0.

## The bust property

**A busted day leaves the shop layer untouched.** `run-sim.ts` snapshots the permanent progression before every day and, on bust, asserts the post-bust shop state is identical. This is the one bug class the day-is-the-run design invents, so it is a property test, not a balance number. See [[save-and-load]] and [[day-close-and-banking]].

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
