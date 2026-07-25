---
name: kp-contracts
description: The Kernel Panic game-ready content contract - proposal JSON shapes, engine invariants, palette, copy rules, and pipeline paths. Background knowledge for crew agents; not a command.
user-invocable: false
---

# Kernel Panic content contracts

You are part of the Kernel Panic dev crew. Your output is only "game-ready" when the Orchestrator can drop it into the game's typed TypeScript content modules and the whole thing passes `bun run typecheck` plus two deterministic simulation harnesses. This file is the contract that makes that possible. Follow it exactly.

## Iron rules

1. You never write into `kernel-panic-site/` (the game repo). The Orchestrator is the sole code owner. You write proposals and reports to the `pipeline/` paths assigned to your role.
2. Structured artifacts only. Prose goes in `notes`/`rationale` fields, never as a free-form handoff.
3. Player-facing copy NEVER contains em dashes or en dashes. Use periods, commas, or "..." instead. This is a hard style law of the game's voice.
4. Canon lives in `lore/bible.md` and `lore/ledger.md`. If your output contradicts them, it will be rejected at the Loremaster gate. Read them before writing anything a player will see.

## Proposal envelope

Every proposal file `pipeline/proposals/<your-agent-name>.json` uses this envelope (a hook lint-checks it on write; malformed files bounce back to you):

```json
{
  "agent": "<your-agent-name>",
  "brief": "<id of the brief you are answering, from pipeline/BRIEF.md>",
  "notes": "optional overall commentary",
  "items": [ { "id": "...", "type": "..." } ]
}
```

Every item needs `id` and `type`. Item schemas by type follow. See `examples.md` in this skill's directory for one gold example of each.

## Item schemas

### type: "customer"  (encounter-generator)

Mirrors `CustomerProfile` in `content/customers.ts`.

```json
{
  "type": "customer", "id": "kebab-case",
  "name": "First Last", "device": "what they bring in",
  "portrait": "/assets/px/portraits/cust-01.png",
  "quotes": ["intake line A", "intake line B"],
  "winLine": "said when you clear their job",
  "lossLine": "said when you fail it",
  "tiers": [1, 2],
  "dominant": "redirect | armHalt | armSiphon | purge | lock | ward",
  "portraitOrder": "optional: art order id if a new portrait is needed; else reuse cust-01..cust-06"
}
```

- `tiers` are JOB DIFFICULTY tiers 1-5 (not program tiers - see the tier trap below).
- `dominant` must be one of the six OppMode strings, spelled exactly as above. The Analyze screen's tell (`MODE_TELL`) already covers all six.

### type: "augment"  (ability-agent)

Mirrors `AugmentDef` in `content/kit.ts`.

```json
{
  "type": "augment", "id": "camelCase",
  "name": "ALL CAPS SHORT NAME", "kind": "boost | config",
  "desc": "player-facing copy, one or two sentences",
  "attackMode": "only for config augments unlocking an ATTACK mode",
  "defendMode": "only for config augments unlocking a DEFEND mode",
  "synergy": "REQUIRED: the augment/mode/mechanic this combos with",
  "counter": "REQUIRED: what opposes or checks it",
  "engineNote": "REQUIRED: 'existing' if pure data, else exactly what reducer support is needed"
}
```

- Design laws: all three programs stay 1 RAM; SCAN never costs more and never gains modes; augments bend the economy, they do not add verbs.
- Most boosts need a small reducer hook. Say so honestly in `engineNote` - the Orchestrator budgets integration from it.

### type: "dayconfig-delta"  (arc-composer)

```json
{
  "type": "dayconfig-delta", "id": "day-4", "day": 4,
  "set": { "greed": 0.85, "oppRam": 6 },
  "targetWinPct": 56,
  "rationale": "why, citing the latest validation report"
}
```

Settable keys: `grid [w,h]`, `oppRam`, `greed` (0-1), `abilityFreq` (0-1), `minCost`, `headStart`, `jobTiers [t,t,t]`. Days 1-9; the finale and tutorial configs are separate and change only with explicit user sign-off.

### type: "journal"  (narrative-director)

Mirrors `JournalEntry` in `content/journal.ts`.

```json
{
  "type": "journal", "id": "kebab-case",
  "unlockAtRun": 5, "requiresOpened": false,
  "kind": "note | bill | memo",
  "title": "ALL CAPS", "date": "in-world date string matching existing entries",
  "body": ["paragraph", "paragraph"]
}
```

### type: "scene"  (narrative-director)

Feeds the run-keyed switch statements in `content/story.ts`.

```json
{
  "type": "scene", "id": "run-open-7",
  "slot": "opener | ender | finale",
  "runNumber": 7,
  "beats": [
    { "speaker": "sister | father | system | companion",
      "portrait": "SISTER | FATHER | COMPANION | none",
      "still": "STILL_LOCKED | STILL_BENCH | STILL_COUNTER | STILL_OPEN | none",
      "lines": ["line", "line"] }
  ]
}
```

Use the constant tokens, not raw paths; the Orchestrator maps them. Invariants: openers and enders must exist (explicitly or via fallback) for run numbers 1-12; the finale scene keeps at least 5 beats.

### type: "dayline"  (narrative-director)

```json
{ "type": "dayline", "id": "day-3", "day": 3, "text": "DAY 3. One terminal sentence." }
```

`DAY_LINES` must keep at least 9 entries, one per working day.

### type: "sfx"  (ux-agent)

Mirrors the sfxr preset params in `audio.ts`. CRITICAL: envelope values (`sustain`, `decay`) are PLAIN SECONDS (0.045 = 45ms), never normalized knobs.

```json
{
  "type": "sfx", "id": "presetName", "action": "add | tune",
  "params": { "wave": 0, "baseFreq": 440, "sustain": 0.02, "decay": 0.11, "punch": 0.3 },
  "bus": "ui | game",
  "when": "the exact interaction that triggers it"
}
```

Param keys: wave (0 square, 1 saw, 2 sine, 3 noise), baseFreq, duty, sustain, decay, freqSlide, punch, arpMod, arpSpeed, vibDepth, vibSpeed, lpfCutoff, hpfCutoff, phaserOffset, phaserSweep, volume.

### type: "ui-spec"  (ux-agent)

```json
{
  "type": "ui-spec", "id": "kebab-case",
  "area": "duel | desktop | login | windows | screens",
  "spec": "what to build or change, precise enough to implement without asking",
  "acceptance": ["observable check", "observable check"]
}
```

### type: "music-brief"  (ux-agent)

```json
{ "type": "music-brief", "id": "...", "track": "desk | dive | finale | <new>", "mood": "...", "tempo": "...", "notes": "loop length, instrumentation" }
```

A new track name means a `MusicTrack` union change plus an mp3 in `public/assets/sfx/music/` - flag it.

## Art orders  (narrative-director and ux-agent file them; art-lead fulfills)

One file per order at `pipeline/art/orders/<id>.json`:

```json
{
  "id": "kebab-case", "from": "narrative-director | ux-agent",
  "kind": "portrait | still | icon | wallpaper",
  "target": "/assets/px/portraits/cust-07.png",
  "size": [64, 64],
  "brief": "subject, composition, mood - concrete, one paragraph",
  "status": "open",
  "result": null
}
```

Art-lead updates `status` to `done` and sets `result` to the finished PNG path under `pipeline/art/done/`. Sizes in play today: portraits 64x64, stills 192x128, wallpaper 320x180.

## Palette and asset conventions

Every generated image prompt pins these hexes (the `--kp-*` tokens): bg0 `#101218`, bg1 `#14171e`, panel `#1a1e27`, line `#2b313d`, text `#e8ebf2`, dim `#8f97a8`, rose `#e94f6d`, rose-hot `#ff6d88`, signal `#ffe9c4`, crimson `#cf4b45`, gold `#d9a53f`, steel `#9fb2cc`. Asset paths are absolute from the public root: `/assets/px/portraits/...`, `/assets/px/stills/...`, `/assets/px/ui/...`, `/assets/sfx/music/...`. Post-processing (`pipeline/tools/pxpost.py`) snaps generations to a real pixel grid and palette.

## Engine invariants the sims enforce

The Orchestrator integrates your JSON, then the Validation agent runs, from `kernel-panic-site/app/`:
`bun run typecheck`, `bun run src/game/dev/sim.ts`, `bun run src/game/dev/run-sim.ts`.

Content that breaks any of these is bounced back to its author:

1. Every difficulty tier appearing in any day's `jobTiers` has at least one customer whose `tiers` include it.
2. Every customer `dominant` is a valid OppMode (the six strings above).
3. Augment ids are unique; config augments carry `attackMode` or `defendMode`; the draft never re-offers owned augments.
4. `DAY_LINES` has at least 9 entries; opener and ender scenes resolve for run numbers 1-12; the finale scene has at least 5 beats.
5. The tutorial config posts 0 wins in 200 seeds. Always.
6. The day curve (kit-less proxy) stays near: D1 82, D2 77, D3 74, D4 56, D5 58, D6 56, D7 49, D8 42, D9 39, finale 25 percent, unless the current brief says to move it.

## The tier trap

Two different "tier" vocabularies exist. Program tiers are 1-3 (SCAN/ATTACK/DEFEND upgrade levels). Job, customer, and day difficulty tiers are 1-5. `oppKitFor` maps difficulty 1-5 onto program tiers 1-3. Customers and day configs always use the 1-5 scale.

## Voice

The game is a retro terminal. Player-facing strings read clipped and diegetic. Journal titles and augment names are ALL CAPS. The sister is Rhea, the companion is Patch, the father is only ever "Dad". Rhea calls the machine "the virus" until the story says otherwise. And again: no em or en dashes in game copy.
