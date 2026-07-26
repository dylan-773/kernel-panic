# Teaching ledger

Ground truth for what the player has been taught, where, and why. Owned by
the **tutorial-agent**. Durable: this file is never cleared between cycles,
the same way `lore/` is never cleared.

The rule this file exists to enforce: **every player-facing mechanic either
has a teaching moment or carries a written waiver.** A mechanic with neither
is a red build, not a thing somebody notices six patches later.
`kernel-panic-site/app/src/game/dev/teach-sim.ts` is the enforcement.

Shipped surface: `app/src/game/content/teaching.ts` holds the mechanic
inventory, the coachmarks, and the opening-dive beat ladder. The tutorial
agent proposes changes to it; the Orchestrator integrates them.

## Placement bias order

Teaching gets more intrusive as you go down this list, so always reach for
the highest tier that works. A proposal that skips a tier has to say why.

| tier | form | use when | owner |
|---|---|---|---|
| 0 | **make the UI say it** | a label, unit, or affordance can carry the whole mechanic | filed as a `ui-spec` to ux-agent, not a teaching artifact |
| 1 | **tooltip** | the player will want the information AGAIN: recurring numbers, costs, thresholds | tutorial-agent (`teach-tip`) |
| 2 | **first-sight coachmark** | a rule they need once, at a moment, that changes what they do | tutorial-agent (`teaching-moment`) |
| 3 | **interactive beat** | the player must physically perform the verb to continue | tutorial-agent |
| 4 | **scripted scene** | the mechanic is a run-structural reveal with story weight | narrative-director's slot, not this agent's |

The decision that separates 1 from 2: **a tooltip is reference, a coachmark
is a rule.** A number the player re-checks belongs on the control, where they
can go back for it. A coachmark is gone the moment it is dismissed, which
makes it the wrong home for anything worth re-reading. Some mechanics take
both, and par is the worked example: a tip on the readout for the budget, one
coachmark for the strain consequence.

Tier 3 is reserved for verbs. Tier 0 is the goal: the best tutorial is the
one that was not needed.

Anything with a visual footprint that does not exist yet (a spotlight, a
pointer, a highlighted target) is a `ui-spec` to the ux-agent. The tutorial
agent names the control; the ux-agent decides where the box sits.

## Coverage

Status is what the harness sees. `TAUGHT` means a moment or beat covers it;
`WAIVED` means the interface is claimed to carry it unaided.

| mechanic | first contact | how | status |
|---|---|---|---|
| rotate | opening dive | beat `first-rotation` | TAUGHT |
| flood | opening dive | beat `chain-toward-core` | TAUGHT |
| scan | opening dive | beat `scan-it` | TAUGHT |
| defend | opening dive | beats `purge-it`, `purge-waiting` | TAUGHT |
| attack | opening dive | beat `attack-it` | TAUGHT |
| telegraph | opening dive | beats `watch-it-move`, `holding-back` | TAUGHT |
| cascade | duel | coachmark `cascade-bank`, on the first banked chain | TAUGHT |
| par | duel | tip `par` on the readout, plus coachmark `par-budget` on the rotation that crosses it | TAUGHT |
| ram | opening dive | beats, plus tip `ram` on the per-turn readout | TAUGHT |
| patchCellUse | duel | coachmark `patch-cell-use`, while carrying a cell | TAUGHT |
| strainChip | result | coachmark `strain-chip`, plus tip `strain` on both meters | TAUGHT |
| jobBoard | day board | coachmark `day-board` | TAUGHT |
| manualRef | day board | coachmark `day-board` | TAUGHT |
| analyzeTell | diagnostic | coachmark `analyze-readout` | TAUGHT |
| threatTier | diagnostic | coachmark `analyze-readout`, plus tip `threatTier` on the ticket pips | TAUGHT |
| kitConfig | loadout | coachmark `kit-config`, plus tip `modeLocked` on locked modes | TAUGHT |
| programTiers | loadout | coachmark `kit-config` | TAUGHT |
| augmentDraft | result | coachmark `augment-draft`, when a draft is offered | TAUGHT |
| augmentCadence | result | coachmark `augment-draft`: one per cleared TICKET, three tickets a day | TAUGHT |
| dayUpgrade | night screen | coachmark `day-upgrade` | TAUGHT |
| nightPatch | night screen | coachmark `night-shop` | TAUGHT |
| patchCellBuy | night screen | coachmark `night-shop` | TAUGHT |
| reach2 | opening dive | glowing junctions are the affordance | WAIVED |
| turnCap | result | payout row names the halved rate inline | WAIVED |
| credits | day board | price and balance always share a row | WAIVED |
| saveSlots | login | standard affordance; slots state attempts and day | WAIVED |
| runReset | result | every run-end scene states it in story voice | WAIVED |
| finaleGate | night screen | day 10 replaces the board with the door | WAIVED |
| augmentPoolDry | result | the result screen says so in place of the draft, as it happens | WAIVED |
| augmentEffects | result | blanket: every augment carries its own desc (premise `augmentDescs`) | WAIVED |
| modeEffects | loadout | blanket: modes are variations on three taught programs, each with its own desc (premise `modeDescs`) | WAIVED |

## Waiver log

A waiver is a claim about the interface, so it expires when the interface
changes. Re-check these whenever the named surface is touched.

- **reach2** (2026-07-26). The legal rotation set is drawn as glowing
  junctions. If that glow ever becomes ambiguous or is restyled, this waiver
  dies and reach-2 needs a beat.
- **turnCap** (2026-07-26). Upgraded at tier 0 this cycle: the payout row
  now reads "half rate: you hit the turn cap" instead of "timeout rate". The
  label is the teaching. Revisit if the row is ever shortened.
- **credits** (2026-07-26). Holds only while every spend screen keeps price
  and balance adjacent. The night screen is the one at risk.
- **saveSlots** (2026-07-26). Login lists attempts and day reached per slot.
- **runReset** (2026-07-26). Deliberate: the run-end scene carries it in
  story voice, and a coachmark would flatten the beat.
- **finaleGate** (2026-07-26). Day 10 has no job board, and the morning
  scene frames the back room.
- **augmentPoolDry** (2026-07-26). The result screen replaces the draft with
  "Augment cache is dry. Salvage credited instead." at the exact moment it
  happens, and the salvage lands in the payout row. Deliberate call not to
  pre-warn: setting the expectation earlier would cost a coachmark to
  prepare the player for an absence. Revisit if the dry-pool balance finding
  below is addressed, since the timing would change.
- **augmentEffects** (2026-07-26). BLANKET, premise `augmentDescs`. Every
  augment states its own effect on the draft card, in the loadout list, and
  in MANUAL.TXT. `teach-sim` re-verifies that every entry in `AUGMENTS` has a
  name and a usable desc, so a new augment shipped without copy fails the
  build instead of silently landing under the waiver.
- **modeEffects** (2026-07-26). BLANKET, premise `modeDescs`. Attack and
  defend modes are variations on the three programs the opening dive already
  teaches, so they need no teaching of their own, and each carries a desc on
  hover and in its kit card. `teach-sim` re-verifies every mode has a desc at
  all three tiers.

## Open work

- **Copy pass pending.** Every coachmark line currently in `teaching.ts` is
  an Orchestrator draft written to stand the surface up. The wording is the
  narrative-director's to own: the tutorial agent should file copy orders at
  `pipeline/copy/orders/<id>.json` for all ten on its first cycle and set
  each moment's `copyOrder` field when they land.
- **Anchor polish.** Coachmark positions are CSS anchors
  (`kp-teach-<anchor>`), not measured tethers. If a callout ever reads as
  floating rather than pointing, that is a ui-spec for ux-agent.

## Flagged to other seats

- **The augment cache empties around day 6.** Measured over 60 simulated
  runs: augments owned at day close run 3, 6, 9, 12, 15, 18, then flat. The
  pool is 18 (4 config, 14 boost) and the cadence is 3 a day, so a player
  clearing every ticket exhausts it on day 6 and days 7 through 9, the
  hardest third of the run, offer zero drafts and pay 25cr salvage instead.
  A player who drops tickets depletes slower, but the ceiling is hard. This
  is a progression question for the ability-agent and arc-composer via the
  balance loop, not a teaching one. Teaching currently handles the symptom
  honestly (the dry-cache line) and no more.

## Loop history

- **2026-07-26, teaching layer stood up.** Inventory seeded at 26 mechanics
  from a sweep of the shipped surfaces: 20 taught, 6 waived. Ten coachmarks
  authored, the opening-dive ladder migrated out of `duel.tsx` into data.
  Gap that motivated the pass: par, day-end upgrades, and patch purchases
  all shipped with no explanation anywhere, and nothing in the pipeline
  could fail for it.
- **2026-07-26, tooltips became a tier.** Tips were previously loose `title`
  strings scattered through components, invisible to the gate. They are now
  data (`TEACH_TIPS`), count as coverage, and carry their own harness checks.
  Five seeded: par, strain, ram, threatTier, modeLocked. Added the tip vs
  coachmark decision rule, since "does the player want this again?" is what
  separates reference from a one-shot rule.
- **2026-07-26, augment cadence corrected before it shipped.** It was about
  to be taught as one augment per day. Measurement says one per cleared
  ticket, three tickets a day. The `augment-draft` copy now states the real
  cadence. Standing lesson, now a craft rule: verify progression numbers
  against the reducer before teaching them.
- **2026-07-26, blanket waivers got machine-checkable premises.** Waiving
  every augment and every mode individually was the right call (they carry
  their own copy) but an uncheckable one. `waiverPremise` ties each blanket
  waiver to an assertion `teach-sim` re-runs, so the waiver fails when its
  premise stops being true rather than when someone notices.
