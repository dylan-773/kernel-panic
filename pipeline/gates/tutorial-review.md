# Tutorial gate: deep-balance-2026-07-28

Brief: `deep-balance-2026-07-28` (`pipeline/BRIEF.md`). This cycle's scope for
this seat is narrower than a full-sweep audit: gate the teaching plan for the
two player-facing systems the Orchestrator is about to land (shaped patch
pieces, boost bays) plus the gridlock strain chip, ahead of the code. Nothing
below is checking a shipped surface; `content/teaching.ts`, `screens.tsx`,
and `duel.tsx` do not yet carry any of this. The verdicts are a judgment on
the PLAN: does every mechanic in the brief's list resolve to a moment, a
tip, or a waiver, at the right tier, without cramming a surface past its
cap. `tutorial/ledger.md`'s Coverage table records every row below as
`PLANNED`; a real audit against `teach-sim` is owed the cycle this code
ships.

Read for ground truth: `pipeline/BRIEF.md`, `tutorial/ledger.md`,
`content/teaching.ts`, `dev/teach-sim.ts`, `screens.tsx`, `duel.tsx`,
`shop-os.tsx`, `run-reducer.ts` (for `PATCH_COST`/`PATCH_CELL_COST`/`MAX_RAM`
as they exist today, to avoid teaching a stale number), and this cycle's
other proposals: `pipeline/proposals/narrative-director.json` (already run,
brief matches this cycle) and `pipeline/proposals/ux-agent.json`,
`ability-agent.json`, `arc-composer.json` (all still holding the PRIOR
cycle's content as of this gate; not reviewed here since they carry no
teaching-relevant items for this brief yet).

---

## Verdicts

Every row cites its `tutorial/ledger.md` Coverage-table line (post this
cycle's edit) and the closing item in `pipeline/proposals/tutorial-agent.json`.

| mechanic | verdict | tier chosen | closes via |
|---|---|---|---|
| `patchShapes` (ledger row) | COVERED (planned) | 2, folded into an existing moment | `patch-cell-use` rewrite |
| `patchCraft` (ledger row) | COVERED (planned) | 2, new coachmark | `patch-craft` |
| `darkWebBuy` (ledger row) | COVERED (planned) | 2, folded into an existing moment | `night-shop` rewrite |
| `slotBuy` (ledger row) | COVERED (planned) | 2, folded into an existing moment | `night-shop` rewrite |
| `boostSlots` (ledger row) | COVERED (planned) | 1, tip | `boostSlots` tip |
| `boostSwap` (ledger row) | COVERED (planned) | 2, new coachmark | `boost-swap` |
| `patchDrop` (ledger row) | COVERED (planned, waiver, provisional) | 0, itemized inline naming | `mechanic-waiver patchDrop` + `ui-spec patch-drop-row-naming` |
| `gridlockChip` (ledger row) | COVERED (planned, waiver, provisional) | 0, two texts | `mechanic-waiver gridlockChip` + `ui-spec gridlock-chip-breakdown` |
| `patchCellBuy` (ledger row) | RETIRED | n/a | removed from `MECHANIC_INVENTORY`, superseded by `darkWebBuy` |
| `augmentPoolDry` (ledger row) | RETIRED | n/a | removed from `MECHANIC_INVENTORY`, scenario no longer reachable |

No `NEEDS-TEACHING` this cycle: every mechanic the brief named is closed in
the same proposal that reviews it, per the standing workflow (this seat
gates and authors together, unlike a pure audit cycle with no incoming
proposals).

---

## Tier reasoning, item by item

### `patchShapes` — folded into `patch-cell-use`, not a new moment

Tested against the four questions in order. (1) Can the interface just say
it? A ghost preview showing the piece's arms before placement (ux-agent's
`patch-ghost-preview`, brief-assigned) gets partway there, but a visual
preview does not by itself tell the player the shape is LOCKED, only what
it looks like; a player who has never rotated a patch piece before has no
way to discover "this never rotates" from a static preview alone, especially
coming off a game where the ONLY thing you've done with pieces so far is
rotate junctions freely. (2) Will they want this again? No, it's a fixed
rule about how the object behaves, not a recurring number. (3) Is it a rule
that changes what they do, needed once, at a moment? Yes: it changes which
slag block is the right target. Verdict: tier 2. Reusing the existing
`patch-cell-use` coachmark instead of adding a new one keeps the `duel`
surface's moment count unchanged (still 3, still 0 `firstSight`) and avoids
teaching "you're holding a piece" and "the piece doesn't rotate" as two
separate interruptions for the same object at the same moment.

### `patchCraft` — new coachmark, gated on `craftReady`

Rule, not a number, so tier 2 over tier 1. The trigger is the specific
finding here: firing this on `firstSight` of the upgrade screen (like
`day-upgrade`/`night-shop`) would teach a rule the player often cannot act
on yet, since it requires two owned pieces with a legal union, unlikely on
day 1. `craftReady` (a legal pair actually exists in the pouch) is the
brief's own instruction and the right call independent of that: it is the
same "trigger on relevance, not on arrival" principle `par-budget` and
`patch-cell-use` already use.

### `darkWebBuy` + `slotBuy` — folded into `night-shop`, not split out

Both are rule changes (lost determinism; a new purchase category) rather
than pure numbers, so tier 2. The `upgrade` surface is already at its
2-`firstSight` cap (`day-upgrade`, `night-shop`); a third unconditional
coachmark for `slotBuy` alone would have required either dropping one of
the other two to conditional or hard-failing `teach-sim`'s surface cap.
Folding `slotBuy` into `night-shop`'s existing real estate, as one short
clause rather than its own moment, was the brief's instruction and is also
the only option that respects the cap without touching an unrelated
moment's placement. `darkWebBuy` gets the larger share of the two rewritten
lines since it is the bigger behavior change (losing the ability to shop
for an exact shape); `slotBuy`'s deeper consequence, the swap itself, is
NOT taught here, it is `boostSwap`'s job at the moment it actually bites.

### `boostSlots` — tip, not a coachmark

Textbook case for the tip/coachmark split this ledger's own rule describes:
"3, buyable to 5" is a number the player will re-check every draft and
every night screen visit, not a rule they need told once. Placed on the
control where the number lives (the bay counter), not as a standalone
moment.

### `boostSwap` — new coachmark, gated on `swapOffered`

Considered tier 3 (an interactive beat) before settling on tier 2, because
the player IS forced to physically pick which boost to bench, which sounds
like the "must perform to proceed" test. Rejected: tier 3 in this codebase
is implemented only as the opening-dive's scripted beat ladder
(`TUTORIAL_BEATS`), reserved by the ledger's own rule for verbs and "almost
always inside the opening dive." There is no second interactive-beat
mechanism to reuse, and building one for a single mid-run event is a much
larger engineering cost than a coachmark for a benefit this decision rule
does not require: the bench-swap UI itself (ux-agent's `pick-to-swap-flow`)
already forces the choice by construction, so the coachmark's job is only
to explain WHY it's asking, once, the first time it does. That is squarely
tier 2, not tier 3.

### `patchDrop`, `gridlockChip` — waivers on named precedent, provisional

Both evaluated against the exact tier-0 test: does the interface already
say it, on the only screen it can happen, without a coachmark? For
`patchDrop`, yes in shape: the result screen's drop row is architecturally
identical to the `turnCap` waiver's payout row, one line, one screen, fires
exactly once, at the only moment it can. For `gridlockChip`, yes in shape
and in NUMBER of texts: the duel's own end overlay plus the result screen's
itemized breakdown is the same two-texts pattern the `runReset` waiver
already uses. Recording both as WAIVER, not `NEEDS-TEACHING`, but flagged
PROVISIONAL in both the ledger and the proposal: the copy half is real
(narrative-director has already filed it), the code half (the glyph
render, the `gridlockWin` plumbing and its breakdown row) is not, and this
gate will not call either waiver earned until both exist. This is the
explicit instruction the ledger's own craft rules give: "a waiver is a
claim about the interface, so it expires when the interface changes," here
inverted, a waiver that has not been EARNED yet because the interface it
claims has not shipped. Filed `ui-spec patch-drop-row-naming` and
`ui-spec gridlock-chip-breakdown` to lock the acceptance criteria each
waiver actually needs.

Considered and rejected for `gridlockChip`: a coachmark. Gridlock wins are
rare (the sibling turn-cap case measured 7 of 3800 dives last cycle, per
`pipeline/validation/report.md`'s `playtest-repair-2026-07-27` entry); a
coachmark most players will never see is worse than two texts that state
the cost exactly when it happens to the players it happens to.

### `patchCellBuy`, `augmentPoolDry` — retired, not waived

Neither is a `NEEDS-TEACHING` finding; both are removed from
`MECHANIC_INVENTORY` outright. `patchCellBuy` describes a purchase that no
longer exists (the deterministic buy is replaced, not re-explained).
`augmentPoolDry` describes a scenario (the draft pool running dry) that is
now mathematically unreachable under this cycle's design: boost bays cap
ownership at 5, there are exactly 4 config augments, and a full bay swaps
rather than refuses a new BOOST, so the draft always has an unowned card
left to offer as long as the boost catalog stays bigger than the bay cap.
Full reasoning and the exact retirement citations are in
`tutorial/ledger.md`'s waiver log, dated 2026-07-28.

---

## Surface budget check

Required by the brief explicitly for `upgrade`; checked for every surface
touched this cycle.

| surface | moments after this pass | of which `firstSight` | cap |
|---|---|---|---|
| `upgrade` | 3 (`day-upgrade`, `night-shop`, `patch-craft`) | 2 (`day-upgrade`, `night-shop`) | 4 total / 2 `firstSight` |
| `result` | 3 (`strain-chip`, `augment-draft`, `boost-swap`) | 1 (`strain-chip`) | 4 total / 2 `firstSight` |
| `duel` | 3 (`par-budget`, `cascade-bank`, `patch-cell-use`) | 0 | 4 total / 2 `firstSight` |

All within cap. `upgrade` sits exactly at the `firstSight` cap (2 of 2);
this is why `slotBuy` was folded into `night-shop` rather than given its own
`firstSight` moment, and why `patch-craft` is deliberately gated on
`craftReady` instead of `firstSight`, a third unconditional callout there
would have failed the build.

Order uniqueness: new orders `62` (`boost-swap`) and `75` (`patch-craft`)
checked against the full existing set (`20, 40, 50, 60, 61, 70, 71, 80`);
both are unique, no collision.

---

## Dependencies not yet landed

Stated plainly so nothing here is mistaken for already-earned coverage.

- `content/teaching.ts`'s `TeachWhen` union needs `craftReady` and
  `swapOffered` added before `patch-craft` and `boost-swap` are literal in
  code (signal definitions in `pipeline/proposals/tutorial-agent.json`'s
  top-level notes).
- The `patch-craft` moment's anchor (`craft`) has no CSS position rule yet;
  deferred to ux-agent's `patch-craft-flow` ui-spec, referenced by id but
  not yet filed as of this gate.
- `patchDrop` and `gridlockChip` waivers are PROVISIONAL: each depends on a
  ui-spec filed this cycle (`patch-drop-row-naming`,
  `gridlock-chip-breakdown`) that has not been built, and `gridlockChip`
  additionally depends on `gridlockWin` plumbing that does not exist in
  `duel.tsx`/`run-reducer.ts`/`save.ts` yet.
- `pipeline/proposals/ux-agent.json`, `ability-agent.json`, and
  `arc-composer.json` on disk are all still the prior cycle's files as of
  this gate; when they run for `deep-balance-2026-07-28`, re-check their
  items against this ledger delta (new augments in particular: the
  `augmentEffects` blanket waiver's premise, `augmentDescs`, applies to
  whatever ability-agent adds or cuts automatically, no action needed here
  unless a new augment ships without a usable desc).

---

## Copy orders filed

Five, at `pipeline/copy/orders/`, all `status: "open"`, addressed to the
narrative-director for the follow-up round (confirmed via
`pipeline/proposals/narrative-director.json`'s own notes this round: "no
open orders from the tutorial-agent... checked, none found... will be
fulfilled in the follow-up round once filed"):

- `copy-patch-cell-use` — rewrite, folds in `patchShapes`.
- `copy-night-shop` — rewrite, folds in `darkWebBuy` and `slotBuy`.
- `copy-patch-craft` — new.
- `copy-augment-draft-line2` — rewrite, line 2 only.
- `copy-boost-swap` — new. Not in the brief's explicit list of five; filed
  anyway per the standing rule that every new coachmark gets a copy order.

Not filed: `copy-ram-tip`. The brief's phrasing named one, but tips are
self-written by this seat per standing practice (this gate's own prior
entry, `teaching-2026-07-26`: "Tips are not routed through copy orders").
The `ram` tip's rewrite (dropping the cut CARRY CACHE clause) is final text
in `pipeline/proposals/tutorial-agent.json` directly.
