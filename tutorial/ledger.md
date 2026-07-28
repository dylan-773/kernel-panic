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
`WAIVED` means the interface is claimed to carry it unaided. `PLANNED` is a
third status, used only for mechanics whose engine support has not shipped
yet: the moment, tip, or waiver is specified and gated this cycle, but
`teach-sim` cannot confirm it until the Orchestrator lands the code and the
moment actually mounts in `content/teaching.ts`. A `PLANNED` row graduates to
`TAUGHT` or `WAIVED` the cycle its surface ships; until then it is a standing
flag in the loop history, not a mechanic the harness has actually checked.

| mechanic | first contact | how | status |
|---|---|---|---|
| rotate | opening dive | beat `first-rotation` | TAUGHT |
| flood | opening dive | beat `chain-toward-core` | TAUGHT |
| scan | opening dive | beat `scan-it` | TAUGHT |
| defend | opening dive | beats `purge-it`, `purge-waiting` | TAUGHT |
| attack | opening dive | beat `attack-it` | TAUGHT |
| telegraph | opening dive | beats `watch-it-move`, `holding-back` | TAUGHT |
| cascade | duel | coachmark `cascade-bank`, on the first banked chain | TAUGHT* |
| par | duel | tip `par` on the readout, plus coachmark `par-budget` on the rotation that crosses it | TAUGHT |
| ram | opening dive | beats, plus tip `ram` on the per-turn readout | TAUGHT* |
| ramCarry | duel | tip `ram` (rewritten this cycle to also name the carryover cap) | TAUGHT |
| patchCellUse | duel | coachmark `patch-cell-use`, while carrying a cell | TAUGHT |
| patchShapes | duel | coachmark `patch-cell-use` (rewrite planned this cycle: same trigger, now also teaches fixed orientation) | PLANNED |
| strainChip | result | coachmark `strain-chip`, plus tip `strain` on both meters | TAUGHT* |
| jobBoard | day board | JobBoard's own permanent header states it every visit (screens.tsx:103) | WAIVED |
| manualRef | day board | tip on the MANUAL.TXT desktop icon | TAUGHT |
| analyzeTell | diagnostic | coachmark `analyze-readout` | TAUGHT |
| threatTier | diagnostic | coachmark `analyze-readout`, plus tip `threatTier` on the ticket pips | TAUGHT |
| kitConfig | loadout | KitScreen's permanent header carries the basics (screens.tsx:241-244); tip `modeLocked` carries the locked-mode case | TAUGHT |
| programTiers | loadout | same KitScreen header | WAIVED |
| augmentDraft | result | coachmark `augment-draft`, when a draft is offered | TAUGHT |
| augmentCadence | result | coachmark `augment-draft` (line 2 rewrite planned this cycle, drops the dead pool-dry premise): one per cleared TICKET, three tickets a day | TAUGHT |
| boostSlots | result | tip `boostSlots` on the boost bay counter | PLANNED |
| boostSwap | result | new coachmark `boost-swap`, trigger `swapOffered` (new TeachWhen) | PLANNED |
| dayUpgrade | night screen | coachmark `day-upgrade` | TAUGHT |
| nightPatch | night screen | coachmark `night-shop` (rewrite planned this cycle, folds in darkWebBuy + slotBuy) | TAUGHT |
| patchCellBuy | RETIRED 2026-07-28 | replaced by `darkWebBuy`; the deterministic buy no longer exists. See waiver log retirement entry. | RETIRED |
| patchCraft | night screen (bench, also loadout) | new coachmark `patch-craft`, trigger `craftReady` (new TeachWhen) | PLANNED |
| darkWebBuy | night screen | coachmark `night-shop` (rewrite), replaces `patchCellBuy` | PLANNED |
| slotBuy | night screen | coachmark `night-shop` (rewrite, folded in per surface firstSight cap) | PLANNED |
| reach2 | opening dive | glowing junctions are the affordance | WAIVED |
| turnCap | result | payout row names the halved rate inline | WAIVED |
| patchDrop | result | drop row names the piece's shape and glyph inline, the only screen it can occur on (turnCap precedent); provisional on ui-spec `patch-drop-row-naming` | PLANNED |
| gridlockChip | duel | two texts: the duel end overlay states the cost, the result strain breakdown itemizes it (runReset precedent); provisional on ui-spec `gridlock-chip-breakdown` | PLANNED |
| credits | day board | price and balance share a row, except the BUY PATCH CELL row (fix pending, see Open work) | WAIVED* |
| saveSlots | login | standard affordance; slots state attempts and day | WAIVED |
| runReset | duel | the duel screen's own CORE LOST overlay states it first, the run-end scene restates it in voice; the Abandon path does not yet (fix pending, see Open work) | WAIVED* |
| finaleGate | the back room door (FinalePre) | day 10 replaces the board with the door, and the morning scene frames it | WAIVED |
| augmentEffects | result | blanket: every augment carries its own desc (premise `augmentDescs`) | WAIVED |
| modeEffects | loadout | blanket: modes are variations on three taught programs, each with its own desc (premise `modeDescs`) | WAIVED |

`*` flags a row with an open finding from the 2026-07-26 full-sweep audit
(pipeline/gates/tutorial-review.md). The data-layer coverage is real (a
moment, tip, or waiver exists and `teach-sim` sees it), but something about
how or where it fires needs a fix before the row is clean. See "Firing
correctness findings" and "Open work" below for what and where.

## Waiver log

A waiver is a claim about the interface, so it expires when the interface
changes. Re-check these whenever the named surface is touched.

- **reach2** (2026-07-26, re-checked 2026-07-26). The legal rotation set is
  drawn as glowing junctions. If that glow ever becomes ambiguous or is
  restyled, this waiver dies and reach-2 needs a beat. Full-sweep audit
  confirmed the `kp-dlegal` / `kp-dlegal-ring` affordance is unchanged.
- **turnCap** (2026-07-26, re-checked 2026-07-26). Upgraded at tier 0 that
  cycle: the payout row reads "half rate: you hit the turn cap" instead of
  "timeout rate". The label is the teaching. Revisit if the row is ever
  shortened. Full-sweep audit quoted the exact live string
  (screens.tsx:373) and confirmed it still matches the halving math.
- **credits** (2026-07-26, narrowed 2026-07-26). Holds only while every
  spend screen keeps price and balance adjacent. The full-sweep audit found
  the crack the original entry predicted: the BUY PATCH CELL row on the
  Upgrade screen (screens.tsx:512-540) states price and cell count but never
  restates the credits balance, unlike the NIGHT PATCH row directly above it
  (screens.tsx:496-511), which does. `ui-spec` `night-shop-credit-adjacency`
  filed this cycle to restore it; re-check and restore the blanket wording
  once that lands.
- **saveSlots** (2026-07-26, re-checked 2026-07-26). Login lists attempts
  and day reached per slot. Full-sweep audit quoted the exact slot line
  (login.tsx:98-107); unchanged.
- **runReset** (2026-07-26, widened 2026-07-26). Two texts carry this, not
  one: the duel screen's own loss overlay states it first, the instant it
  happens ("CORE LOST... Its flood got there first. Neural Strain zeroes.
  The run is over.", duel.tsx:683-686), and the run-end scene restates it in
  story voice right after ("NEURAL STRAIN: ZERO. CONNECTION SEVERED. RUN N
  LOGGED.", content/story.ts:33-38). This waiver only covers that
  strain-zero loss path. The ABANDON button (shop-os.tsx:537-548) reaches
  the identical reset through neither text, only a native confirm reading
  "Abandon this run? Unlocked routines are kept," which names nothing real.
  `ui-spec` `abandon-confirm-accuracy` filed this cycle to fix that path;
  this mechanic is not fully covered until it lands. Corrected the
  mechanic's `firstContact` from `result` (never actually reached on a loss;
  result is win-only) to `duel`.
- **finaleGate** (2026-07-26, corrected 2026-07-26). Day 10 has no job
  board, and the morning scene frames the back room. Player-facing claim
  re-confirmed true and unchanged. The mechanic's `firstContact` was wrong
  (read `upgrade`, a screen that has nothing to do with this fact) and is
  corrected to the screen that actually shows it, the back room door
  (`FinalePre`); this needs `TeachSurface` widened with a `finalePre` value
  (content/teaching.ts:20-28) before the correction is literal in code.
- **augmentPoolDry** (2026-07-26, re-checked 2026-07-26). The result screen
  replaces the draft with "Augment cache is dry. Salvage credited instead."
  at the exact moment it happens, and the salvage lands in the payout row.
  Deliberate call not to pre-warn: setting the expectation earlier would
  cost a coachmark to prepare the player for an absence. Revisit if the
  dry-pool balance finding below is addressed, since the timing would
  change. Full-sweep audit re-confirmed the line fires exactly on
  `r.draft.length === 0`; noted as a minor, non-blocking polish opportunity
  that the +25 salvage is not itemized separately in the payout row.
- **augmentEffects** (2026-07-26, re-checked 2026-07-26). BLANKET, premise
  `augmentDescs`. Every augment states its own effect on the draft card, in
  the loadout list, and in MANUAL.TXT. `teach-sim` re-verifies that every
  entry in `AUGMENTS` has a name and a usable desc, so a new augment shipped
  without copy fails the build instead of silently landing under the
  waiver. Full-sweep audit hand-checked every entry in `content/kit.ts`
  against the premise; all pass.
- **modeEffects** (2026-07-26, re-checked 2026-07-26). BLANKET, premise
  `modeDescs`. Attack and defend modes are variations on the three programs
  the opening dive already teaches, so they need no teaching of their own,
  and each carries a desc on hover and in its kit card. `teach-sim`
  re-verifies every mode has a desc at all three tiers. Full-sweep audit
  hand-checked all six modes at all three tiers; all pass.
- **jobBoard** (2026-07-26, new). JobBoard's own header states this
  permanently, every visit: "Three tickets. Strain is shared across all of
  them. Pick your order." (screens.tsx:103). This mechanic was previously
  taught by the `day-board` coachmark, whose first line duplicated this
  header near verbatim; retiring that half of the coachmark in favor of the
  tier-0 header already on screen. Dies if that header paragraph is removed
  or stops stating the shared-strain fact.
- **kitConfig**: NOT a waiver. Proposed as one, rejected at integration by
  the harness, and the harness was right. The `modeLocked` tip still teaches
  `kitConfig`, so waiving it tripped `teach-sim`'s "both waived and taught"
  check. Keeping the tip is the better outcome anyway: the header carries the
  basics, and the tip carries the part a header cannot, which is why a
  specific mode is greyed out, on the control that is greyed out. The
  coachmark still retired. `kitConfig` stays TAUGHT. Standing lesson: when a
  coachmark retires, check whether a tip was quietly carrying the mechanic
  too before reaching for a waiver.
- **kitConfig, superseded entry** (2026-07-26). KitScreen's own header states this
  permanently, every visit: "Three programs, 1 RAM each, once per turn
  each. Tiers come from closed days; configs come from cleared jobs. Tune
  it whenever; it holds until you change it." (screens.tsx:241-244). The
  `kit-config` coachmark was a near-verbatim duplicate of this header;
  retired entirely this cycle. Dies if that header paragraph is removed or
  stops stating the per-program cost, the once-per-turn rule, or where
  tiers and configs come from.
- **programTiers** (2026-07-26, new). Same KitScreen header as `kitConfig`
  above, the half stating "tiers come from closed days." Paired with the
  `kit-config` coachmark's retirement.
- **patchDrop** (2026-07-28, new, PROVISIONAL). Same shape as the `turnCap`
  waiver: the result screen's drop row names the recovered piece by shape
  and shows its glyph inline, the only screen a drop can occur on. Covers
  both a general post-dive drop and the reworked CLEAN RUN bonus, since both
  land through the same row (narrative-director's `result-screen-rows` copy,
  `pipeline/proposals/narrative-director.json`: `dropRevealLabel`, the four
  `dropRevealVariants`, `cleanRunBanked`/`cleanRunCapped`). Provisional
  because the naming half has copy but the glyph half is still an open
  `ui-spec` (`patch-drop-row-naming`, this cycle) waiting on the ux-agent's
  `result-drop-reveal` design; do not treat this waiver as earned until both
  the copy and the glyph are live on the row.
- **gridlockChip** (2026-07-28, new, PROVISIONAL). Same shape as the
  `runReset` waiver: two texts, not one. The duel's own end overlay states
  the cost the instant it happens (narrative-director's `gridlock-endreason`
  copy: "Total gridlock... The link collapses in your favor, and the dead
  link bites on the way out."), and the result screen's strain breakdown
  itemizes the exact number as its own row, the same way the turn cap
  already gets one. Provisional because the itemized row does not exist yet;
  `ui-spec` `gridlock-chip-breakdown` (this cycle) specs the `gridlockWin`
  plumbing and the row. Do not treat this waiver as earned until that row
  ships and renders the narrative-director's `gridlockChipLabel` copy.
- **patchCellBuy, RETIRED** (2026-07-28). The deterministic 35cr patch-cell
  buy this waiver never applied to (it was TAUGHT, not waived) is gone
  outright, not merely re-explained: acquisition moves to a random dark-web
  purchase (`darkWebBuy`). Removed from `MECHANIC_INVENTORY`
  (`content/teaching.ts:128` prior to this cycle's edit) rather than left as
  a dead row; the `night-shop` coachmark that used to teach it is being
  rewritten to teach `darkWebBuy` and `slotBuy` instead. See the mechanic
  inventory delta in `pipeline/proposals/tutorial-agent.json`.
- **augmentPoolDry, RETIRED** (2026-07-28). The scenario this waiver
  described, the draft offering nothing because every augment in the pool
  is already owned, can no longer happen under this cycle's design: boost
  bays cap ownership at 3 to 5 and there are only 4 config augments total,
  so a player can never hold more than bays-plus-4 augments at once, and a
  full bay swaps a new BOOST in for an old one instead of refusing it. As
  long as the boost catalog stays larger than the bay cap (5), the draft
  always has an unowned boost left to offer. Removed from
  `MECHANIC_INVENTORY` entirely (`content/teaching.ts:188-193` prior to this
  edit) rather than left as an unreachable waiver; the "Augment cache is
  dry" fallback line in `ResultScreen` may now be dead code, flagged for the
  Orchestrator to confirm and prune when integrating. Paired with retiring
  the "augment cache empties around day 6" entry under Flagged to other
  seats, below.

## Open work

Everything the 2026-07-26 audit raised as a data or wiring fix is integrated
and green. What remains here is the interface work and one standing item.

- **Anchor polish.** Coachmark positions are CSS anchors
  (`kp-teach-<anchor>`), not measured tethers. If a callout ever reads as
  floating rather than pointing, that is a ui-spec for ux-agent.
- **Touch tips ship without a discoverability affordance** (2026-07-26). The
  hold gesture works, but nothing on screen says a control holds more. A dot
  or dotted underline on tip-bearing controls would close it and is a
  ui-spec for ux-agent whenever chrome changes are back in budget. Also
  unhandled: `kp-tap-pop` always opens below-left and can clip at a viewport
  edge, and two tips could both open under multitouch.

### Closed this cycle

- All five ui-specs integrated: `night-shop-credit-adjacency` (patch-cell row
  now carries the credits balance, restoring the `credits` waiver),
  `abandon-confirm-accuracy`, `strain-chip-breakdown` (the result row
  itemizes rotations over par, traps sprung, and a turn-cap win, and flags
  the 40 cap), `ram-upgrade-cap-parity`, and `touch-safe-tooltips`
  (`components/game/tap-tip.tsx`, a hold gesture serving all seven tip sites
  and the mid-dive ability panel; mouse behaviour unchanged).

- Copy pass done. Eight coachmarks re-authored by the narrative-director and
  integrated; `copy-day-board` and `copy-kit-config` cancelled with their
  moments. Every shipped moment now carries its `copyOrder`.
- `day-board` and `kit-config` retired; `jobBoard` and `programTiers` waived
  to their permanent headers; `manualRef` moved to a tip on the MANUAL.TXT
  desktop icon. `kitConfig` did NOT become a waiver: see its entry above.
- `TeachSurface` widened with `finalePre` and `runEnd`.
- `cascade-bank` re-keyed to the `cascadeRam` fx, and made sticky in
  `duel.tsx` because the fx queue drains the frame it arrives; reading it
  live would have flickered the callout in and out within one render.
- `ram` tip rewritten and mounted on the live dive dock as well as the day
  board, closing `ramCarry`.
- `day-upgrade` trimmed from two lines to one. The loremaster's gate flagged
  its first line as a near-duplicate of the Upgrade screen's own permanent
  header (`screens.tsx:471`). The moment stays, because "there is no second
  pick later" is a decision frame no header carries, but the duplicated half
  is gone.

## Flagged to other seats

- **RESOLVED 2026-07-28: the augment cache empties around day 6.** This
  cycle's design (BRIEF `deep-balance-2026-07-28`) caps boost ownership at
  the bay count (3 to 5) and lets a full bay swap instead of refuse a new
  BOOST, so the draft can no longer run dry: config augments are the only
  hard ceiling (4 total, unaffected by bays), and the boost portion of the
  pool always has an unowned card to offer as long as the catalog stays
  bigger than 5. The `augmentPoolDry` mechanic is retired outright (see the
  waiver log retirement entry above), not just re-waived. If a future
  catalog cut ever shrinks the boost list to 5 or fewer, this stops being
  true and the mechanic needs to come back.
- **No tip or hover panel survives touch input** (2026-07-26, full-sweep
  audit). Every `teach-tip` is a plain HTML `title`; the mid-dive ability
  description panel (`kp-ability-info`, `duel.tsx`) only opens on
  `onMouseEnter`/`onMouseLeave`; the Loadout window, where the same
  descriptions exist as static text, is not reachable mid-dive. A touch
  player currently cannot read any tip or any ability description during a
  dive at all. `ui-spec` `touch-safe-tooltips` filed for the ux-agent; this
  is new teaching UI (a tap-safe reveal), not this seat's to invent.
- **RAM upgrade button has no cap parity with the tier buttons** (2026-07-26,
  full-sweep audit). The three program-tier upgrade buttons disable and
  relabel MAXED at tier 3 (`screens.tsx:451-468`); the `+1 RAM / TURN`
  button never disables and never relabels once `ramPerTurn` hits
  `MAX_RAM` (9), so a player can waste their one nightly upgrade for zero
  effect with only a "9 to 9" label as the hint. `ui-spec`
  `ram-upgrade-cap-parity` filed; a straightforward parity fix for
  ux-agent/Orchestrator, not a teaching gap in itself since the
  `dayUpgrade` mechanic's own claim stays true regardless.

## Loop history

- **2026-07-28, patch shapes, crafting, dark-web buy, and boost bays,
  proposed ahead of the engine.** Brief `deep-balance-2026-07-28`. The
  Orchestrator lands three systems this cycle (shaped patch pieces, boost
  bays, plus a kitted sim profile that is not this seat's concern); this
  pass specs the teaching for the two that are, before the code ships. Eight
  mechanic-inventory deltas: `patchShapes` and `patchDrop` extend the
  existing patch-cell story now that pieces have fixed shapes and drop
  post-dive; `patchCraft` is genuinely new (a bench that fuses two pieces);
  `darkWebBuy` REPLACES `patchCellBuy` outright, the deterministic buy is
  gone; `boostSlots`, `boostSwap`, and `slotBuy` cover the new bay cap, its
  swap-at-full rule, and buying more bays. Two retired: `patchCellBuy`
  (superseded) and `augmentPoolDry` (the scenario it described can no
  longer happen under the new bay math). Every new row is `PLANNED`, not
  `TAUGHT`, since none of the surfaces exist in shipped code yet; this
  ledger update is the gate's judgment on the teaching PLAN, not a
  post-hoc audit of a live surface, and a real audit is owed once the
  Orchestrator integrates and `teach-sim` can actually check it.
  Tier decisions: `patch-cell-use` (rewrite, folds in `patchShapes`) and
  `night-shop` (rewrite, folds in `darkWebBuy` and `slotBuy`) stay
  coachmarks, since each teaches a RULE that changes a decision (pieces
  never rotate once placed; the piece buy lost its determinism), not a
  number. `patch-craft` and `boost-swap` are new coachmarks for the same
  reason (fuse-when-strictly-bigger; a full bay forces a bench choice), each
  gated on a purpose-built trigger (`craftReady`, `swapOffered`) rather than
  first sight, so neither fires before the player has a real decision in
  front of them. `boostSlots` is a tip, not a coachmark: the bay cap is a
  number worth re-checking every draft, the textbook case for reference over
  a one-shot rule. `patchDrop` and `gridlockChip` are waivers on the turnCap
  and runReset precedents respectively (the interface names the cause
  inline, on the only screen it can happen), each provisional on a
  same-cycle `ui-spec` (`patch-drop-row-naming`, `gridlock-chip-breakdown`)
  that has not landed yet. Folded `slotBuy` into the `night-shop` rewrite
  rather than giving it a third coachmark on the `upgrade` surface: that
  surface is already at the 2-`firstSight` cap (`day-upgrade`, `night-shop`)
  and a third unconditional callout would have blown the budget for no
  reason `night-shop`'s existing real estate could not absorb with one
  clause. Two new `TeachWhen` triggers requested as pre-authorized engine
  changes: `craftReady` (a legal craftable pair exists in the pouch, i.e.
  two owned pieces whose shape union is strictly bigger than either alone)
  and `swapOffered` (the current draft includes a BOOST while owned boosts
  already equal the bay cap, so accepting it requires benching one). Five
  copy orders filed for the follow-up round, the same count the brief
  named but not the same five: dropped `copy-ram-tip`, added
  `copy-boost-swap` for the new coachmark that was not in the brief's
  explicit list but earns one by standing rule (every new coachmark gets
  a copy order). Did NOT file a copy order for the `ram` tip's CARRY CACHE
  clause removal (the brief's phrasing suggested one); tips are self-written
  per standing practice (see the `tutorial-review.md` gate from
  `teaching-2026-07-26`, "Tips are not routed through copy orders"), and the
  five-word fix here is exactly the case that practice exists for. Rewrote
  it directly instead: dropped "4 with CARRY CACHE" now that the augment is
  cut, kept the base 2-carry rule, which is unaffected by the cut.

- **2026-07-26, the opening dive was not teaching rotation.** The single most
  important beat in the game, missing from 23.9% of dives. `first-rotation`
  tested `ownedNodes <= 2`; board generation hands the player up to 3 nodes
  for free before anyone moves, and at exactly 3 the ladder fell straight
  through to `chain-toward-core`, so roughly one player in four was never
  told to click a junction. The audit found the edge case and filed it as
  rare and non-blocking. It was not rare, and nobody had counted. Fixed by
  matching the beat's bound to the generator's cap, which is now a shared
  exported constant (`MAX_OPENING_CLAIM`) rather than a literal in each
  place. `teach-sim` now asserts the opening line IS the rotate beat for
  every claim count the generator can produce, and that assertion was
  confirmed to fail on the old bound before being kept.
  Three standing lessons:
  1. **Measure before grading severity.** "Rare" is a number, not an
     adjective. The cost of counting was one throwaway script.
  2. **A bound that mirrors another file's bound must import it.** These two
     numbers were always the same fact; only one was written down.
  3. **A reachability check that asks "does SOME line answer" is too weak
     wherever the specific line is the point.** The old exhaustive ladder
     check even sampled `owned=3` and passed, because something answered.

- **2026-07-26, first full sweep of the shipped surface.** The teaching layer
  was one cycle old and had been authored in a single sitting against a
  surface that was still moving, so every inventory row, waiver, and
  coachmark was re-checked against the code. 32 mechanics reviewed, 8 came
  back NEEDS-TEACHING. Two coachmarks retired for restating permanent
  headers almost verbatim (`day-board`, `kit-config`), one trimmed to half
  its length for the same reason (`day-upgrade`, caught by the canon gate,
  not the teaching one). Net: the teaching layer got SMALLER while coverage
  went up. Lessons worth keeping:
  - **A trigger can be right about the value and wrong about the cause.**
    `cascade-bank` read banked RAM, which a siphon trap and ECHO TAP also
    produce, so the lesson could be marked taught to a player who never saw
    a cascade. Signals should key off the event, not its side effect.
  - **Coverage in the data is not coverage on the screen.** The `ram` tip
    satisfied the harness while sitting on a static number the player reads
    once, absent from the live dock they manage every turn.
  - **Check the copy against the reducer, not against the last draft.** Two
    inherited lines were false: strain "never refills on its own" (day close
    restores 10) and "click any slag block" (placement is reach-limited, and
    the same screen said so). Both survived a cycle because nobody diffed
    prose against behaviour.
  - **A gate seat can catch what the owning seat rationalized.** The
    tutorial agent explicitly considered retiring `day-upgrade` and declined;
    the loremaster flagged the duplication independently.
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
- **2026-07-26, first full-sweep audit.** The teaching layer's first
  check against the surface it describes, one cycle after it was authored
  in a single sitting. Walked every reducer and screen against the 31-entry
  inventory: one real gap (`ramCarry`, RAM carryover was never named),
  eight `NEEDS-TEACHING` verdicts total, all closed this cycle without a
  single new coachmark. Found and fixed two waivers that had drifted from
  the interface they cited (`credits`, `runReset`), corrected two mechanic
  entries whose `firstContact` field named a screen the mechanic cannot
  actually be reached from (`runReset`, `finaleGate`), and found two
  coachmarks (`day-board`'s `jobBoard` half, `kit-config` entirely) that had
  skipped past tier 0 to duplicate a permanent screen header word for word,
  retired in favor of waivers and one new tip. Found a live firing bug
  (`cascade-bank`'s trigger reads a RAM-swing sign that SIPHON traps and
  ECHO TAP also touch, so it can fire on the wrong mechanic) and a tip
  mounted everywhere except the control it was written for (`ram`, missing
  from the live dive dock). Filed the ten copy orders the ledger had been
  carrying as open work since the layer stood up. Standing lesson: a tier
  can be right on the day it is written and wrong a cycle later once the
  screen around it gets its own permanent copy; re-reading the shipped
  surface, not just the ledger's description of it, is the only way to
  catch that.
