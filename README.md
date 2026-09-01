# Kernel Panic

A turn-based cyberpunk roguelike about inheriting your father's computer repair business and the machine in the back room he never let you touch. The whole game is a simulated retro OS desktop (KP/OS) in the browser.

**Play it: https://kernel-panic.higgsfield.app** (no account, no setup; the opening dive teaches the controls in about two minutes)

This repository is the AI dev pipeline that produced the game's content. The game app itself is the nested repo [`kernel-panic-site/`](https://github.com/dylan-773/kernel-panic-site).

## How the pipeline works

Nine specialist agents (`.claude/agents/`) write typed JSON proposals into `pipeline/proposals/` under a shared schema contract (`.claude/skills/kp-contracts/`). A PostToolUse lint hook (`pipeline/tools/lint-proposal.sh`, registered in `.claude/settings.json`) validates every proposal at write time and feeds violations back to the writing agent. Two judgment gates review before integration: the Loremaster ("is it true?", citing `vault/60-story/` by quoted line) and the Tutorial agent ("does the player know?", citing `tutorial/ledger.md`). Proposal values land verbatim in the game's typed content modules, then `bun run typecheck` and three deterministic sim harnesses gate the build (see `vault/50-tech/verification-gate.md`).

## Tracing pipeline output into the shipped game

Every chain below is checkable by diffing the proposal against the shipped module:

| Content | Proposal / order | Ships in |
|---|---|---|
| Ability catalog (18 augments, 4 cuts) | `pipeline/proposals/ability-agent.json` | `kernel-panic-site/app/src/game/content/kit.ts` (ids match 1:1; cut ids absent) |
| Day difficulty configs | `pipeline/proposals/arc-composer.json` | `kernel-panic-site/app/src/game/content/arc.ts` (numeric deltas verbatim) |
| Inbox subjects, UI copy | `pipeline/proposals/narrative-director.json` | `kernel-panic-site/app/src/components/os/windows/inbox.tsx` (byte-identical) |
| Teaching copy | `pipeline/copy/orders/*.json` (14 orders) | `kernel-panic-site/app/src/game/content/teaching.ts` (verbatim) |
| Sound design (21 sfx presets) | `pipeline/proposals/ux-agent*.json` | `kernel-panic-site/app/src/game/audio.ts` |
| Pixel art (18 work orders, credits logged per order) | `pipeline/art/orders/*.json` → `pipeline/art/done/` | `kernel-panic-site/app/public/assets/px/` via `roster-art.ts` asset maps |
| UI window redesigns | `pipeline/proposals/ux-agent*.json` → `ui-demos/<id>/` | `kernel-panic-site/app/src/components/os/windows/` (`ui-demos/manifest.json` is the durable approval record) |

## Running it yourself

From `kernel-panic-site/app/` (requires [bun](https://bun.sh)):

```
bun install
bun run typecheck               # schema enforcement
bun run src/game/dev/sim.ts     # balance harness; tutorial must print 0/200
bun run src/game/dev/run-sim.ts # run-layer invariants
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived
bun run build                   # production build
```

## Map

- `vault/` - the design vault (Obsidian, one idea per note; start at `vault/00-index/home.md`)
- `pipeline/` - per-cycle artifact exchange: proposals, gates, copy and art orders, validation reports
- `tutorial/` - the teaching ledger: what the player has been taught, by which moment
- `ui-demos/` - reviewed-before-integration UI lane with its approval manifest
- `.claude/` - the crew: agent definitions, skills (plays), contracts, hooks
- `CLAUDE.md` - the dev charter: ground truth order, iron rules, verification gate
