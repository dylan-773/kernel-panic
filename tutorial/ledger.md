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

A tier can look right on the day a moment is written against a plan, and be
overtaken a cycle later once the real surface ships richer than the plan
assumed. `patchCraft` (this cycle) is the worked example of that direction:
a coachmark speced against a bench that did not exist yet turned out to be
strictly worse than the bench the Orchestrator actually built. Re-reading the
shipped component, not just this ledger's account of it, is the only way to
catch that.

## Coverage

Status is what the harness sees. `TAUGHT` means a moment or beat covers it;
`WAIVED` means the interface is claimed to carry it unaided. `PLANNED` is a
third status, used only for mechanics whose engine support has not shipped
yet: the moment, tip, or waiver is specified and gated this cycle, but
`teach-sim` cannot confirm it until the Orchestrator lands the code and the
moment actually mounts in `content/teaching.ts`. A `PLANNED` row graduates to
`TAUGHT` or `WAIVED` the cycle its surface ships; until then it is a standing
flag in the loop history, not a mechanic the harness has actually checked.

A waiver's `TAUGHT`/`WAIVED` status is what the code claims, which is not the
same as what a direct read of the live surface confirms. `teach-sim` checks
that a waiver string exists and is long enough; it cannot read English and
confirm the sentence it quotes still renders anywhere. The `jobBoard` row
below is this cycle's example of the gap: the harness is green, the claim is
currently false. Treat `WAIVED` as "the code asserts this is covered," and
check the waiver log for whether this audit could actually confirm it.

| mechanic | first contact | how | status |
|---|---|---|---|
| rotate | opening dive | beat `first-rotation` | TAUGHT |
| flood | opening dive | beat `chain-toward-core` | TAUGHT |
| scan | opening dive | beat `scan-it` | TAUGHT |
| defend | opening dive | beats `purge-it`, `purge-waiting` | TAUGHT |
| attack | opening dive | beat `attack-it` | TAUGHT |
| telegraph | opening dive | beats `watch-it-move`, `holding-back` | TAUGHT |
| cascade | duel | coachmark `cascade-bank`, re-keyed to the `cascadeRam` fx and made sticky; confirmed live in `duel.tsx` | TAUGHT |
| par | duel | tip `par` on the readout, plus coachmark `par-budget` on the rotation that crosses it | TAUGHT |
| ram | opening dive | beats, plus tip `ram`; confirmed live on both the dive dock (`duel.tsx`) and INBOX's day footer (`windows/inbox.tsx`) | TAUGHT |
| ramCarry | duel | tip `ram` (names the carryover cap) | TAUGHT |
| patchCellUse | duel | coachmark `patch-cell-use`, while carrying a cell | TAUGHT |
| patchShapes | duel | coachmark `patch-cell-use`, confirmed live with the fixed-orientation line ("Arms land exactly as held, never rotating once placed") | TAUGHT |
| patchCraft | SOLDER.BAY | RETIRED as a coachmark 2026-07-29. The bench's own status line, schematic gain-arm blink, and dead-slot partner filtering teach the outgrow rule at tier 0, more persistently than the moment did. See waiver log. | WAIVED |
| strainChip | result | coachmark `strain-chip`, plus tip `strain` on both meters; itemized breakdown confirmed live in REPAIR.LOG (`windows/report.tsx`) | TAUGHT |
| jobBoard | day board (now INBOX) | JobBoard's header sentence is NOT confirmed on the shipped INBOX; `ui-spec` `inbox-collapsed-row-parity` filed 2026-07-29 to restore it. See Open work, urgent. | WAIVED |
| manualRef | day board | tip on the MANUAL.TXT desktop icon; confirmed live (`shop-os.tsx`) | TAUGHT |
| analyzeTell | diagnostic (now INBOX's CUSTOMER.REC card) | coachmark `analyze-readout`, confirmed live including the MODE_TELL line (`windows/inbox.tsx`) | TAUGHT |
| threatTier | diagnostic (now INBOX's CUSTOMER.REC card) | coachmark `analyze-readout`, plus tip `threatTier`; confirmed live on the expanded card, but its list-view (pre-open) home is gone this cycle. See `ui-spec` `inbox-collapsed-row-parity`. | TAUGHT |
| kitConfig | loadout | tip `modeLocked` carries the locked-mode case, confirmed live in LOADOUT.CFG's program rows; the old KitScreen header this row also cited no longer exists, but `kitConfig` was never a pure-waiver claim (see waiver log) | TAUGHT |
| programTiers | loadout | re-cited 2026-07-29: LOADOUT.CFG's own program rows show each tier's numeric RANGE/WIDTH beside its TIER meter, on every visit | WAIVED |
| augmentDraft | result | coachmark `augment-draft`, when a draft is offered; confirmed live in REPAIR.LOG | TAUGHT |
| augmentCadence | result | coachmark `augment-draft`: one per cleared TICKET, three tickets a day | TAUGHT |
| boostSlots | result | tip `boostSlots` on the boost bay counter, confirmed live on LOADOUT.CFG's BOOST BAYS header | TAUGHT |
| boostSwap | result | coachmark `boost-swap`, confirmed live in REPAIR.LOG | TAUGHT |
| dayUpgrade | night screen | coachmark `day-upgrade`, confirmed live in NIGHT.SYS | TAUGHT |
| nightPatch | night screen | coachmark `night-shop`, confirmed live | TAUGHT |
| patchCellBuy | RETIRED 2026-07-28 | replaced by `darkWebBuy`; the deterministic buy no longer exists. See waiver log retirement entry. | RETIRED |
| darkWebBuy | night screen | coachmark `night-shop`, confirmed live; NIGHT.SYS's BUY BLIND row confirmed a pure signpost to DARKNET.LNK (`onOpenDarknet`, no `buyDarkPatch` dispatch), matching the coachmark's own wording. Re-checked 2026-07-29 against the now-shipped CLI (`windows/darknet.tsx`): the rule and blind-shape/pouch-destination facts hold, and the RATE chip (`ui-spec` `darknet-cli-rate-chip`) is integrated and confirmed live in the header stat strip, showing `darkPullPrice(run)` cr whenever `run.screen === "upgrade"` and "----" otherwise, restoring the always-visible price reading the pre-CLI storefront carried for free. | TAUGHT |
| slotBuy | night screen | coachmark `night-shop`, confirmed live | TAUGHT |
| reach2 | opening dive | glowing junctions are the affordance | WAIVED |
| turnCap | result | payout row names the halved rate inline; confirmed live in REPAIR.LOG | WAIVED |
| patchDrop | result | drop row names the piece's shape and shows its glyph inline (both the banked and capped cases), the only screen it can occur on (turnCap precedent); confirmed live in REPAIR.LOG, exceeding the original ask (the capped case also gets a glyph) | WAIVED |
| gridlockChip | duel | two texts: the duel end overlay states the cost, the result strain breakdown itemizes it as its own row (runReset precedent); confirmed live in REPAIR.LOG | WAIVED |
| credits | day board | price and balance share a row on every spend surface; confirmed including DARKNET.LNK now that it dispatches the real purchase (cost, a hatch bar, and the balance all in one row) | WAIVED |
| saveSlots | login | standard affordance; slots state attempts and day | WAIVED |
| runReset | duel | the duel screen's own CORE LOST overlay states it first, the run-end scene restates it in voice, and the Abandon dialog now states it fully too, confirmed live | WAIVED |
| finaleGate | the back room door (FinalePre) | day 10 replaces the board with the door, and the morning scene frames it | WAIVED |
| finaleOppOpens | duel | the player watches the IT IS MOVING turnlight run before their first input | WAIVED |
| augmentEffects | result | blanket: every augment carries its own desc (premise `augmentDescs`) | WAIVED |
| modeEffects | loadout | blanket: modes are variations on three taught programs, each with its own desc (premise `modeDescs`) | WAIVED |
| journalRunGate | desktop (DAD.LOG window) | damaged-file page states the recovery cadence rule; drafted line is currently wrong (names the dive, not the run); study only this cycle (`ui-demos/kpos-shell/dadlog.html`), not yet in shipped `content/teaching.ts`. See waiver log. | PLANNED |

No row carries a firing-correctness asterisk as of this cycle's audit: every
row previously flagged from the 2026-07-26 full-sweep audit was re-confirmed
directly against the live surface this cycle (see Loop history). The `*`
convention stays documented here for future use, since a trigger can regress
again: it would mean "a moment, tip, or waiver exists and `teach-sim` sees
it, but something about how or where it fires needs a fix before the row is
clean."

## Waiver log

A waiver is a claim about the interface, so it expires when the interface
changes. Re-check these whenever the named surface is touched.

- **reach2** (2026-07-26, re-checked 2026-07-26). The legal rotation set is
  drawn as glowing junctions. If that glow ever becomes ambiguous or is
  restyled, this waiver dies and reach-2 needs a beat. Unaffected by this
  cycle's changes (DIVE.EXE's board port is not yet integrated).
- **turnCap** (2026-07-26, re-checked 2026-07-29). Upgraded at tier 0 that
  cycle: the payout row reads "reduced rate, you hit the turn cap" instead of
  "timeout rate". Confirmed this cycle directly against the live REPAIR.LOG
  component (`windows/report.tsx`'s `payRows` array), which ports the exact
  wording verbatim from the old `ResultScreen`. Revisit if the row is ever
  shortened.
- **credits** (2026-07-26, narrowed 2026-07-26, widened 2026-07-29). Holds
  while every spend screen keeps price and balance adjacent. The 2026-07-26
  audit found and fixed a crack (the BUY PATCH CELL row). This cycle's audit
  checked the newly-live DARKNET.LNK (`windows/darknet.tsx`), which is now a
  real transactional surface for the first time (NIGHT.SYS's old direct
  `buyDarkPatch` dispatch moved here, see the `jobBoard`-adjacent finding
  under `darkWebBuy` above): confirmed its `BUY BLIND ({cost} cr)` button,
  a cost-vs-balance hatch bar, and the `{credits} cr` balance all sit in one
  row (`kp-darknet-row`). The waiver's blanket claim now explicitly covers
  this surface too, confirmed rather than assumed. **Integrated 2026-07-29,
  re-confirmed directly against the live component, not carried over from
  the pre-integration note:** the shipped CLI (`windows/darknet.tsx`) drops
  `kp-darknet-row` as expected. Its `cmdBuy` short-of-credits deny
  (`darknet.tsx:351-355`) prints `// SHORT _ NEED {cost} CR. YOU HOLD
  {credits} CR.` verbatim, cost and balance in one line, at the exact
  moment of spend, followed by the vendor line ("No tab. A tab needs a name
  and there are no names here."). Citation updated from `kp-darknet-row` to
  this deny line. This waiver's claim holds on this surface. The separate
  question of whether the price stays visible BEFORE a spend is attempted
  was `darkWebBuy`'s open concern, not this one; it is now also closed, see
  that Coverage row above: the RATE chip (`ui-spec`
  `darknet-cli-rate-chip`) is integrated and confirmed live.
- **saveSlots** (2026-07-26, re-checked 2026-07-26). Login lists attempts
  and day reached per slot. Unaffected by this cycle (login.tsx not touched).
- **runReset** (2026-07-26, widened 2026-07-26, confirmed complete
  2026-07-29). Three texts now carry this: the duel screen's own loss
  overlay states it first, the instant it happens ("CORE LOST... Its flood
  got there first. Neural Strain zeroes. The run is over.", `duel.tsx`); the
  run-end scene restates it in story voice; and the ABANDON dialog
  (`shop-os.tsx:577-621`), previously the gap this waiver's "not fully
  covered" note tracked, now reads in full: "This ends attempt {run.runNumber}
  exactly like a loss. Kit tiers, augments, credits and patch pieces all
  reset for the next attempt. The journal and the ledger keep what they
  already hold." Confirmed directly against the live component this cycle;
  the `abandon-confirm-accuracy` fix from the 2026-07-26 "Closed this cycle"
  list is real and this waiver is no longer partial.
- **finaleGate** (2026-07-26, corrected 2026-07-26). Day 10 has no job
  board, and the morning scene frames the back room. Unaffected this cycle;
  `FinalePre` still renders from `game/screens.tsx` unchanged, and
  `BACKROOM.LCK`'s dressing (`kpos-backroom-lck`) has not integrated yet.
- **augmentPoolDry** (2026-07-26, re-checked 2026-07-26). RETIRED 2026-07-28,
  see below; kept here only as history.
- **augmentEffects** (2026-07-26, re-checked 2026-07-26). BLANKET, premise
  `augmentDescs`. `teach-sim` re-verifies every entry in `AUGMENTS` has a
  name and a usable desc on every run; unaffected by any UI reskin since the
  premise is checked against the data, not the rendering.
- **modeEffects** (2026-07-26, re-checked 2026-07-26). BLANKET, premise
  `modeDescs`. Same basis as `augmentEffects`; data-checked, reskin-proof.
- **jobBoard** (2026-07-26, new; AT RISK 2026-07-29). Originally: "JobBoard's
  own header states this permanently, every visit: 'Three tickets. Strain is
  shared across all of them. Pick your order.'" This cycle's audit found the
  surface this waiver depends on has moved (JobBoard is absorbed into
  INBOX, `ui-integration-2026-07-29`) and the sentence did NOT come with it:
  the shipped `InboxContent` (`components/os/windows/inbox.tsx`) collapsed
  view's `kp-screen-head` shows only the DAY N OF 10 hero, no subtitle
  paragraph anywhere. This is the most severe finding of this cycle's audit,
  because `teach-sim` cannot catch it: the harness only checks that the
  waiver string exists in code and is long enough, never that the English
  sentence it quotes still renders anywhere on the actual screen. **This
  waiver does not currently hold.** `ui-spec` `inbox-collapsed-row-parity`
  filed this cycle to restore the sentence (and, separately, the `threatTier`
  tip's list-view home, a related but distinct finding, see below). Do not
  re-confirm this waiver as earned until that spec lands and is checked
  directly against the live component, the same way this finding was made.
- **kitConfig**: NOT a waiver. The `modeLocked` tip still teaches `kitConfig`
  on its own, confirmed live in LOADOUT.CFG's program rows
  (`windows/loadout.tsx`, `ProgRow`'s `tipFor`). The old KitScreen header
  this row used to also cite is gone from the shipped surface (replaced by
  the DIVE KIT status readout), but `kitConfig`'s TAUGHT status never
  actually rested on that header alone; the tip carries the part a header
  cannot (which specific mode is locked, on the control that is locked), and
  still does. `kitConfig` stays TAUGHT.
- **programTiers** (2026-07-26, re-cited 2026-07-29). Original citation (the
  KitScreen header's "tiers come from closed days" clause) no longer exists
  anywhere in the shipped surface; confirmed absent from `LoadoutContent`.
  New citation, confirmed live: LOADOUT.CFG's own program rows
  (`windows/loadout.tsx`, `ProgRow`) show a program's current numeric RANGE
  or WIDTH directly beside its TIER segment meter, for all three programs,
  every visit. This demonstrates the fact this mechanic actually cares about
  (a tier number correlates with a bigger output number) more concretely
  than the retired prose sentence ever did. `dayUpgrade` (a separate,
  independently-taught mechanic) already covers where a tier increase comes
  from procedurally; this waiver is narrowly about the widening effect
  itself, and that effect is now shown, not told.
- **patchCraft** (2026-07-29, new, RETIRES the `patch-craft` coachmark).
  SOLDER.BAY's shipped `SolderContent` (`windows/solder.tsx`) turned out to
  carry the outgrow rule at tier 0, more persistently than the coachmark
  speced against it last cycle (when SOLDER.BAY was still a plan, not a
  built surface): the status line states "PICK A PARTNER. THE WELD MUST
  OUTGROW BOTH." every single time a piece is picked up, for the life of the
  save, not once ever like a coachmark; the Schematic panel blinks exactly
  which arms a candidate partner would add (`arm-gain` styling); and the
  rack marks any non-outgrowing partner dead and disabled
  (`legalPartners`/`kp-slot-dead`), so a player cannot select, drag onto, or
  drop a piece on an illegal partner through the shipped interface at all,
  meaning the "equal or smaller spends both pieces for nothing" risk the old
  coachmark warned about cannot actually be triggered. CRAFT carries no
  price anywhere in the row, matching this game's own convention that every
  paid action states its cost inline, so the absence itself signals free.
  This also resolves this cycle's anchor question directly: the coachmark
  currently mounts on NIGHT.SYS (`night.tsx`, unchanged this cycle) keyed to
  a `craftReady` signal, but the entire crafting interface lives in
  SOLDER.BAY, which mounts no `<Teach>` at all. A player who crafts mid-day
  in SOLDER.BAY (consuming the legal pair before night) could go an entire
  run without NIGHT.SYS ever showing this coachmark, since by the time night
  closes the triggering pair is already gone. Retiring the coachmark removes
  a moment that was both misplaced and made redundant by superior, always-on
  coverage, rather than relocating it to a new surface for no real gain.
  `expiresIf`: the status line stops stating the outgrow rule on pickup, the
  dead-slot styling ever lets a non-outgrowing partner through to a live
  weld, or a cost is ever attached to crafting without being shown inline.
- **pieceDragCarry, NOT ADDED** (2026-07-29). The `ux-2026-07-28-kpos-redesign`
  gate recommended adding this mechanic plus a `solder-bay-intro` coachmark,
  reasoning that SOLDER.BAY's drag gesture was "a new INPUT MODALITY...
  nothing has ever rewarded before." That recommendation sat unaddressed for
  a full cycle (`deep-balance-2026-07-28` did not touch it) and this cycle's
  audit revisited it against the now-shipped `SolderContent`. Finding:
  dragging is gated to mouse/pen only (`e.pointerType === "mouse" ||
  e.pointerType === "pen"`, `windows/solder.tsx`'s `onSlotPointerMove`);
  touch input always falls through to the plain `onClick`/`tapActivate`
  path, the same tap-to-select-then-CRAFT flow every other interaction in
  this game already uses. Both paths reach identical outcomes (`fuseAt` on
  a legal pair, `rejectCancel` otherwise); nothing is reachable by drag that
  tap cannot also reach. Since tap already fully suffices and is not a new
  verb, not discovering the drag shortcut costs a player nothing mechanical,
  only a slightly slower motion. This does not meet the bar the ledger's own
  craft rules set for a beat ("must they physically perform it to
  proceed?": no) or even a coachmark (nothing changes about what they should
  do). No `MECHANIC_INVENTORY` entry added; the recommendation is
  overturned, not merely deferred again. Standing lesson: a "new input
  modality" claim should be checked against whether the OLD modality still
  fully works, before it earns a coachmark; a redundant accelerator is not
  automatically a teaching gap just because it is unfamiliar.
- **boost-swap, considered and kept** (2026-07-29). Applied the same
  tier-0-first scrutiny to `boost-swap` that retired `patch-craft`, since
  REPAIR.LOG's swap flow (`windows/report.tsx`) also carries real inline
  text ("BOOST. BAYS FULL, PICK TO SWAP" on the card, "EJECT WHICH BOOST FOR
  X?" on the follow-up panel). Kept the coachmark: unlike patch-craft's
  outgrow rule, nothing in the shipped swap UI states that CONFIGS are
  exempt from the bay cap and can never be swapped away, a fact the
  coachmark's second line carries and that is not otherwise inferable
  except by noticing config cards never show the swap label. `boost-swap`
  stays a coachmark.
- **augmentPoolDry, RETIRED** (2026-07-28). The scenario this waiver
  described, the draft offering nothing because every augment in the pool
  is already owned, can no longer happen under boost-bay math (cap 3 to 5,
  a full bay swaps instead of refuses). Removed from `MECHANIC_INVENTORY`
  entirely rather than left as an unreachable waiver.
- **patchCellBuy, RETIRED** (2026-07-28). The deterministic 35cr patch-cell
  buy is gone outright; acquisition moved to `darkWebBuy`. Removed from
  `MECHANIC_INVENTORY` rather than left as a dead row.
- **journalRunGate** (2026-07-29, new, PLANNED). DAD.LOG's file-unlock
  system (`journal.ts`'s `visibleJournal`, gated on `meta.runCount >=
  unlockAtRun`, plus `requiresOpened` for the finale entry) has never
  carried a `MECHANIC_INVENTORY` row despite being live and player-facing
  since `journal.ts`/`dadlog.tsx` shipped. The shipped game's own
  locked-teaser text ("keep diving", "There is more in the drawer. It can
  wait until you cannot sleep again.", `windows/dadlog.tsx:130-134`) is
  vague but not FALSE, which is almost certainly why this gap went
  unflagged for this long: a vague line cannot fail an accuracy check.
  This cycle's fiction-reframe study (`ui-demos/kpos-shell/dadlog.html`,
  `pipeline/proposals/ux-agent.json`'s `dadlog-archive-reader`,
  `pipeline/copy/orders/copy-dadlog-files.json`) replaces it with a
  specific causal claim that IS false: "EVERY DIVE ATTEMPT WRITES A NEW
  RECOVERY PASS TO THIS DRIVE, WIN OR LOSE." `runCount` increments exactly
  once, inside `startRun` (`run-reducer.ts:247,268`), when a new RUN
  begins, never per individual ticket. A run holds up to 3 tickets a day
  across up to 9-10 days, so up to roughly 27 dive attempts can pass inside
  one run with the RECOVERY count and file list completely unchanged. DAD.LOG
  is reachable as a standing desktop icon (`shop-os.tsx:53,475`) at any point
  during a run, not just at its boundary, so this is directly observable
  inside a player's first run, not an edge case. REVISE filed at
  `pipeline/gates/tutorial-review.md` (`ux-2026-07-29-dadlog`): the line
  must key to the RUN (or SESSION, matching the copy's own
  `SESSION_001.LOG`/"eight sessions logged" vocabulary already tying
  session count to run count), not the dive. Marked PLANNED, not WAIVED:
  this is a standalone study, not yet in shipped `content/teaching.ts`. Do
  not graduate this row until (a) the corrected line lands, and (b) the
  archive reframe actually ships in `dadlog.tsx`. `expiresIf` (once
  graduated): the damaged-file body ever states or implies a per-dive
  cadence again, or the RECOVERY n/d counter's denominator desyncs from
  `unlocked.length` (+1 once `machineOpened`).
  **Round 3 addendum (2026-07-29):** the user-approved per-entry ATTACHMENT
  cell (superseding the persistent SOURCE MEDIA plate, `pipeline/BRIEF.md`'s
  "Addendum: per-entry attachments") introduces a second accuracy crack on
  the same damaged/locked teaser row. Its `NO VISUAL PAYLOAD` empty cell
  reuses the identical "TEXT ARTIFACT" caption also used by the four
  genuinely text-only entries (`backroom`, `failed1`, `notickets`,
  `grading`), but the damaged row's real underlying entry is not knowably a
  text artifact: `nextLocked` cycles through every entry in unlock order as
  `runCount` rises, and lands on `bills`/`receipts`/`diagnosis` at various
  points, all three of which are SCAN documents that get a real photographic
  attachment once unlocked. A player can watch the damaged row say "TEXT
  ARTIFACT," then unlock that same entry next run and see it turn out to be
  a scanned notice with a picture. REVISE filed at
  `pipeline/gates/tutorial-review.md`, Round 3, item 2: the damaged page's
  cell should keep "NO VISUAL PAYLOAD" (still true) but change its second
  line to something naming incompleteness, not category, e.g. "RECOVERY
  INCOMPLETE" (matching `damagedRowText`'s own "damaged, partial recovery"
  register); the four real text-only entries keep "TEXT ARTIFACT" unchanged.
  Still PLANNED, same `expiresIf` as above, now also expiring if the
  damaged/locked cell's caption ever asserts a document-kind fact instead of
  a recovery-state fact.

## Open work

- **URGENT, new 2026-07-31 (`ux-2026-07-31-loadout-eva`, round 2): the
  shipped STRAIN chip's danger threshold is inverted.** Found while gating
  the loadout-eva study's new color-coded strain readout, and confirmed
  directly against already-shipped code, unrelated to whether that study
  ever integrates. `run.strain` counts down from `START_STRAIN = 100`
  (`run-reducer.ts:83`) toward 0, where the run ends (`run-reducer.ts:406`);
  high strain is safe, low strain is dangerous, matching REPAIR.LOG's own
  "`{run.strain}` STRAIN LEFT" phrasing (`report.tsx:442`). But
  `shop-os.tsx:588` (the taskbar) and `windows/inbox.tsx:586` (INBOX's
  footer) both apply the shared danger treatment (`kp-chip-crimson`) on the
  condition `run.strain > 70`, which floods the danger idiom onto the
  SAFEST band of the stat and leaves the true risk band (near 0) unflagged.
  Every run starts at `strain: 100` (`run-reducer.ts:252`), so this fires
  from the first frame of a player's first ticket, before any strain has
  been spent. Fix: invert both conditions to a low-strain check (e.g.
  `run.strain <= 35`), matching the direction `loadout-eva-instrument-panel`
  correctly uses for the same stat (`ui-demos/loadout-eva/index.html:
  1492-1496`), so the two surfaces agree once both are correct. Full
  reasoning: `pipeline/gates/tutorial-review.md` round 2, item 2. Not filed
  as a `pipeline/proposals/tutorial-agent.json` item this round (gate-plus-
  ledger scope, matching this cycle's own round-1 note), but precise enough
  to build directly from this entry.
- **New 2026-07-31 (`ux-2026-07-31-loadout-eva`), two tier-0 fixes owed
  before the study is ready for user review.** (1) `.lo-bay-pill` (the
  compact boost-bay pill replacing the always-visible augment description)
  needs a persistent "holds more" marker, since it is the first control in
  the game where hover/tap is the ONLY path to an augment's effect text
  rather than a bonus atop always-visible text; this finally makes the
  standing "Touch tips' discoverability affordance" note below load-bearing
  rather than a nice-to-have. (2) the narrow-tier compact program row's
  ~60-character description truncation cuts before the mechanical payoff for
  `armHalt` and `armSiphon` specifically (both put their effect in a second
  sentence past character 60, confirmed against `kit.ts:85-88`); needs a
  sentence-boundary clamp, not a fixed character count. Full reasoning:
  `pipeline/gates/tutorial-review.md`. Not filed as `pipeline/proposals/
  tutorial-agent.json` items, matching the `ux-2026-07-29-dadlog` precedent
  for a pre-integration study review (nothing here has been approved or is
  headed for integration yet).
- **Duel dock's "one piece per turn" title is not touch-safe.** Noticed
  while auditing the pouch-paragraph cut above (`ux-2026-07-31-loadout-eva`):
  `duel.tsx:937`'s patch-piece button uses a raw HTML `title` for "One piece
  per turn," not the `TapTip` wrapper every other tip in this game now uses.
  Not blocking anything (the fact is independently and unconditionally
  stated on SOLDER.BAY's footline), but worth folding into DIVE.EXE's own
  eventual reskin cycle rather than left as the one un-migrated tip in the
  game.
- **New 2026-07-29 (`ux-2026-07-29-dadlog`): DAD.LOG's archive-reframe study
  got the tier right and the claim wrong.** The damaged-file page's proposed
  line ("EVERY DIVE ATTEMPT WRITES A NEW RECOVERY PASS TO THIS DRIVE, WIN OR
  LOSE") overstates recovery granularity: `journal.ts`'s `visibleJournal`
  gates on `meta.runCount`, which increments once per `startRun`
  (`run-reducer.ts:247,268`), never per individual ticket, and DAD.LOG is
  reachable from the shop-OS desktop between every dive of a run
  (`shop-os.tsx:53,475`), so a player can dive repeatedly within one run and
  watch the RECOVERY count and file list sit dead the whole time. REVISE
  filed at `pipeline/gates/tutorial-review.md`; the line must key to the RUN
  (or SESSION, matching the copy's own SESSION_*.LOG filenames), not the
  dive. Also filed, tier 0, non-blocking: the new tab strip's filtered-empty
  state (e.g. clicking BILL before run 2, or LOCKED once nothing is left
  locked) renders zero rows with no caption; ask a bare-noun caption matching
  the already-modeled `emptyDrawerState` convention, scoped to the filtered
  case. Both owed back to the ux-agent/narrative-director before this study
  integrates; see the `journalRunGate` Coverage row and waiver log entry
  above for the durable record. **Round 3 addendum:** the same study's new
  per-entry ATTACHMENT cell (replacing the persistent SOURCE MEDIA plate)
  reuses its "TEXT ARTIFACT" NO VISUAL PAYLOAD caption on the damaged/locked
  teaser row, which is not always true of what that row is actually masking
  (`nextLocked` can be a SCAN-kind entry, e.g. `bills`, that gets a real
  image once unlocked). Fix: give the damaged row's own second line
  different wording ("RECOVERY INCOMPLETE" or equivalent), leaving the four
  genuinely text-only entries' caption unchanged. See the `journalRunGate`
  waiver log entry's round 3 addendum above; also owed at integration.
- **URGENT, new 2026-07-29: INBOX's collapsed list dropped two pieces of
  live tier-0 coverage.** Confirmed directly against `windows/inbox.tsx`:
  (1) the `jobBoard` waiver's backing sentence ("Three tickets. Strain is
  shared across all of them. Pick your order.") is absent from
  `InboxContent`'s header; (2) the `threatTier` tip's list-view home (the
  per-ticket THREAT badge every JobBoard row used to show) is absent from
  the collapsed `kp-inbox-item` row, which today renders only the subject
  string. Neither gap is hypothetical; both were read directly in the
  shipped component, not inferred from a proposal. The footer (STRAIN/RAM
  tips, credits, pouch, kit) is confirmed intact and needs no change.
  `ui-spec` `inbox-collapsed-row-parity` filed this cycle
  (`pipeline/proposals/tutorial-agent.json`) asking for both back, plus
  flagging (non-blocking) that the per-ticket payout figure also vanished
  and was likely dropped for the same reason (porting `inbox.html`'s bare
  demo anatomy, which never modeled live run data at all, rather than a
  deliberate call to hide it).
- **New 2026-07-29: the dive result overlay's proposed NEW DIVE label
  would misstate two of its four cases.** `pipeline/proposals/
  narrative-director.json`'s `ui-copy-dive-result-overlay` replaces the
  small in-dive overlay's single CONTINUE button with NEW DIVE
  unconditionally; `duel.tsx`'s overlay uses one button for all four
  outcomes (win/core, win/gridlock, loss/severed, loss/core), so an
  unconditional NEW DIVE would misstate a loss (there is no new dive, the
  run just ended) and a win that closes the day's last ticket (the next
  screen is NIGHT.SYS, not a dive). `ui-spec`
  `dive-overlay-continue-label-accuracy` filed this cycle: NEW DIVE only
  when the result is a win with a ticket still open that day, CONTINUE
  otherwise.
- **Anchor polish.** Coachmark positions are CSS anchors
  (`kp-teach-<anchor>`), not measured tethers. If a callout ever reads as
  floating rather than pointing, that is a ui-spec for ux-agent. One anchor,
  `kp-teach-craft`, is now unused following `patch-craft`'s retirement this
  cycle; harmless to leave, nothing points at it anymore.
- **Touch tips' discoverability affordance.** The hold gesture works
  (confirmed: `TapTip` is used pervasively across every new window this
  cycle read: INBOX, REPAIR.LOG, LOADOUT.CFG, NIGHT.SYS), but nothing on
  screen says a control holds more. A dot or dotted underline on tip-bearing
  controls would close it and is a ui-spec for ux-agent whenever chrome
  changes are back in budget. Also unhandled: `kp-tap-pop` always opens
  below-left and can clip at a viewport edge, and two tips could both open
  under multitouch.

### Closed 2026-07-26

- All five ui-specs integrated: `night-shop-credit-adjacency`,
  `abandon-confirm-accuracy`, `strain-chip-breakdown`,
  `ram-upgrade-cap-parity`, and `touch-safe-tooltips`
  (`components/game/tap-tip.tsx`). All five re-confirmed live this cycle
  (2026-07-29) against the actual shipped components rather than taken on
  the prior cycle's word; see the waiver log entries above and the now
  resolved `Flagged to other seats` items below.
- Copy pass done. Eight coachmarks re-authored; every shipped moment carries
  its `copyOrder`.
- `day-board` and `kit-config` retired; `jobBoard` and `programTiers` waived
  to their permanent headers (both re-checked and one, `jobBoard`, found
  broken this cycle, see waiver log and Open work above); `manualRef` moved
  to a tip on the MANUAL.TXT desktop icon.
- `TeachSurface` widened with `finalePre` and `runEnd`.
- `cascade-bank` re-keyed to the `cascadeRam` fx and made sticky; confirmed
  live this cycle.
- `ram` tip rewritten and mounted on the live dive dock as well as the day
  board (now INBOX's footer); confirmed live this cycle.
- `day-upgrade` trimmed from two lines to one.

### Closed 2026-07-28 through 2026-07-29

Everything the `deep-balance-2026-07-28` cycle speced as `PLANNED` (eight
mechanic-inventory deltas plus two ui-specs) is now confirmed integrated and
live, checked directly against the shipped code this cycle rather than
assumed from the ledger's own prior entry: `patchShapes`, `darkWebBuy`,
`slotBuy`, `boostSlots`, `boostSwap` all confirmed TAUGHT; `patchDrop` and
`gridlockChip` confirmed WAIVED, both meeting or exceeding the provisional
conditions their waivers were gated on (`patch-drop-row-naming` and
`gridlock-chip-breakdown`, both landed). `patchCraft` alone did not graduate
to TAUGHT as planned; instead its coachmark is retired outright this cycle
in favor of a waiver, see above. This is the second time in this file's
history that a full cohort of `PLANNED` rows sat un-reconciled against
already-shipped code for a full cycle before an audit caught it; see the
standing lesson in Loop history below.

### Closed 2026-07-29 (post-integration, `ux-2026-07-29-darknet-cli`)

- `ui-spec` `darknet-cli-rate-chip` integrated and confirmed live, re-read
  directly against `windows/darknet.tsx` rather than taken on the
  integration note's word: the header stat strip renders five persistent
  chips (ROUTE, PEER, RATE, BAL, POUCH), and RATE shows exactly
  `darkPullPrice(run)` cr whenever `run.screen === "upgrade"`, "----"
  otherwise. Marked `status: "integrated"` in
  `pipeline/proposals/tutorial-agent.json`. Open Work bullet removed; see
  the `darkWebBuy` Coverage row above and Loop history below.
- `credits` waiver citation updated from `kp-darknet-row` (retired with the
  old button-form window) to the shipped CLI's own `cmdBuy` short-of-credits
  deny line, re-confirmed verbatim against `darknet.tsx:351-355`: `// SHORT
  _ NEED {cost} CR. YOU HOLD {credits} CR.`. See the waiver log entry above.

## Flagged to other seats

- **RESOLVED 2026-07-28: the augment cache empties around day 6.** Boost
  bays cap ownership and a full bay swaps instead of refuses, so the draft
  can no longer run dry. `augmentPoolDry` retired outright.
- **RESOLVED 2026-07-26, confirmed still resolved 2026-07-29: no tip or
  hover panel survived touch input.** `touch-safe-tooltips` shipped
  (`components/game/tap-tip.tsx`); confirmed this cycle that `TapTip` is now
  the pervasive wrapper across every new window (INBOX, REPAIR.LOG,
  LOADOUT.CFG, NIGHT.SYS all use it), not just the seven original sites.
  Moved out of "flagged," since it had sat here described as an open risk
  for a full cycle after actually shipping.
- **RESOLVED 2026-07-26, confirmed still resolved 2026-07-29: the RAM
  upgrade button had no cap parity with the tier buttons.** Confirmed this
  cycle directly against `windows/night.tsx`: the RAM tile now passes
  `disabled={run.ramPerTurn >= MAX_RAM}` and relabels to "RAM / TURN MAXED",
  matching the three program-tier buttons' own MAXED behavior exactly.
  Moved out of "flagged" for the same reason as the item above: it had
  already shipped and this file had not caught up.

## Loop history

- **2026-07-31, `ux-2026-07-31-loadout-eva`: a maximalist redesign that cuts
  a paragraph turned out to be redundant in three different directions at
  once, plus two real cracks the harness cannot see.** Brief
  `ux-2026-07-31-loadout-eva`, a pre-integration study review (nothing
  ships this cycle). Reviewed `pipeline/proposals/ux-agent.json`'s
  `loadout-eva-instrument-panel` against five questions. The pouch's cut
  4-line paragraph: checked every clause (2 RAM, one per turn, single use,
  darknet/drop/clean-win sourcing, pouch cap of 5) against the live surfaces
  rather than the proposal's own citation, and found the citation itself
  imprecise (duel.tsx:785/937 carry cost and, weakly, the per-turn rule, but
  never sourcing) while the REAL strongest carrier went uncited: SOLDER.BAY's
  own `FOOT_LINE` (`solder.tsx:30-33,490`) is the IDENTICAL sentence being
  cut, rendered unconditionally on every SOLDER.BAY visit, not gated behind
  hover the way duel.tsx's title is. Every fact survives elsewhere; ruled
  COVERED. Pouch cap of 5 turned out to be quadruply redundant already (the
  five-slot rack, SOLDER.BAY's numeric counter, REPAIR.LOG's POUCH FULL drop
  status, DARKNET.LNK's POUCH chip and purchase gate), none of which this
  proposal touches. Two real, tier-0 findings: (1) the boost-bay pills'
  hover/tap-only description popup is fine in principle (matches the already
  shipped mode-chip TapTip precedent) but the pill itself carries no visual
  cue that it holds more, the first time in this game hover/tap is the ONLY
  path to an augment's effect rather than a bonus on always-visible text,
  finally making the long-standing "Touch tips' discoverability affordance"
  Open Work note load-bearing rather than cosmetic; (2) the narrow-tier
  compact row's fixed ~60-character description truncation cuts before the
  mechanical payoff for `armHalt` and `armSiphon` specifically, both of which
  put their numeric effect in a second sentence past character 60 (measured
  directly against `kit.ts:85-88`, not assumed), needing a sentence-boundary
  clamp rather than a fixed count. Both fixes are tier 0, addressed to the
  ux-agent, and named precisely in `pipeline/gates/tutorial-review.md`. The
  narrow-tier tab paging (PROGRAMS vs RIG & STATUS) was ruled COVERED on a
  direct check that none of the three mechanics behind the hidden tab
  (`boostSlots`, `patchCellUse`/`patchShapes`, `strainChip`) have their FIRST
  CONTACT at LOADOUT.CFG; the window has only ever been a reference surface
  for them. New visual codes (hero numeral + unit caption, the active-mode
  reticle, equal-footprint empty/future pills, the one-word verdict slab)
  were all ruled COVERED, each either restating an already-WAIVED label at
  larger scale or duplicating an already-self-evident system convention
  (inverse-fill for "active," dashed-vs-fainter-dashed for "empty vs
  locked") rather than inventing a new code to decode. Standing lesson,
  extending the 2026-07-29 ui-integration audit's own: a proposal's cited
  line numbers for "this is already taught elsewhere" cannot be taken on
  faith even when the CONCLUSION is right; this cycle's citation pointed at
  the wrong file for two of four facts, and the actually-strongest evidence
  (SOLDER.BAY's verbatim `FOOT_LINE`) was sitting one file away, uncited.
  No `pipeline/proposals/tutorial-agent.json` items filed, matching the
  `ux-2026-07-29-dadlog` precedent for a pre-integration study review.
  **Round 2 addendum (same cycle, `ux-2026-07-31-loadout-eva`), the user
  requested breaking the single-ink law for real Evangelion color and
  raised three fit-and-finish notes.** Reviewed against the LIVE, already-
  rebuilt `ui-demos/loadout-eva/index.html`, not a plan: (1) the new
  amber/green/red/cyan/ivory role scheme, checked against whether hue-as-
  state needs teaching. COVERED: every recolored state (the active mode
  chip, the strain readout's risk band) already carried its meaning through
  an untouched fill/shape channel before this round (`.lo-mode.mode-on`'s
  inverse-video flood plus its reticle marks; the risk band's own inverse-
  video flood), so hue is additive reinforcement, not the sole signal.
  Answered the standing question of whether recoloring "active" green and
  "danger" red resolves or worsens the system's existing overload of
  inverse-video for both meanings: it resolves it for sighted players
  (a second, hue-based channel now also distinguishes the two) without
  weakening the position-based disambiguation that already covered everyone
  else. (2) Neural Strain's new threshold color (NOMINAL green above 70,
  RISK red at or below 35): COVERED on the study's own merits, since no
  gameplay effect gates at either cut point (verified by search) and the
  RISK band floods inverse video exactly like the shipped danger idiom, so
  it survives a colorblind reader; but this check surfaced a real, urgent,
  independent bug on two ALREADY-SHIPPED screens: `shop-os.tsx:588` and
  `windows/inbox.tsx:586` apply the danger treatment to STRAIN on
  `run.strain > 70`, which is backwards (`run.strain` is remaining health,
  counting down from 100 to 0 at `run-reducer.ts:83,252,406`; high is safe),
  so the taskbar and INBOX both show "danger" chrome on every player's fully
  healthy starting strain from turn one, and now directly contradict the
  correct direction this study just built for the same stat. Filed to Open
  Work, urgent, with the exact fix (invert to a low-strain check, e.g.
  `<= 35`, matching this study's own threshold). (3) The new DAY 8 STRAINED
  run-state snapshot: COVERED, demo-only rig chrome, confirmed its
  `strain: 21` actually sits inside the RISK band so the color is reviewable
  rather than asserted. (4) Narrow-tier tab paging dropped from every
  supported viewport (4:3 removed per user ruling; 16:9/21:9/1280x800 all
  render the same WIDE arrangement now that the `@container` breakpoint
  moved to 700px): COVERED, and strictly stronger than round 1's own COVERED
  verdict, since the three mechanics behind the old hidden tab never had
  their first contact at LOADOUT.CFG to begin with and now there is no
  gated content left at all; confirmed round 1's own sentence-clamp fix for
  the narrow fallback already shipped in the same file. (5) The ATTACK.EXE
  placement stagger removed: COVERED trivially, decorative and explicitly
  non-hierarchical by round 1's own spec. Standing lesson, sharpening this
  cycle's own round-1 lesson: reviewing a NEW, correct piece of UI against
  an OLD, already-shipped surface covering the same stat is a reliable way
  to surface a live bug in the old surface that nobody had a reason to
  re-check before, because nothing had ever put the two colorings side by
  side until now. Full reasoning: `pipeline/gates/tutorial-review.md`,
  section "Tutorial gate: ux-2026-07-31-loadout-eva (round 2)". No
  Coverage-table status changes and no `pipeline/proposals/
  tutorial-agent.json` or copy-order files this round, matching round 1's
  own scope.
- **2026-07-29, `ux-2026-07-29-darknet-cli` (post-integration verification).**
  The CLI landed in `components/os/windows/darknet.tsx`; checked the
  blocking finding and both checklist items directly against the shipped
  file rather than the integration note. Confirmed as described: the
  header stat strip renders ROUTE, PEER, RATE, BAL, POUCH; RATE reads
  `darkPullPrice(run)` cr whenever `run.screen === "upgrade"`, "----"
  otherwise; the dial-in closer reads "type HELP for trades, or click one
  below."; the short-of-credits deny prints `// SHORT _ NEED {cost} CR. YOU
  HOLD {credits} CR.` followed by the vendor line. `darkWebBuy` Coverage row
  and the `credits` waiver's citation updated accordingly; the
  `darknet-cli-rate-chip` ui-spec marked `integrated` in
  `pipeline/proposals/tutorial-agent.json`; the Open Work bullet it tracked
  moved to Closed. No new gap found; nothing in this pass contradicted the
  pre-integration review below.
- **2026-07-29, `ux-2026-07-29-darknet-cli`: a CLI rebuild of a working
  storefront, reviewed before it replaces the shipped window.** The
  approved study (`ui-demos/kpos-shell/darknet.html`, README's own "DARKNET.LNK
  terminal study" section) turns the gray-market buy into a real terminal:
  type or click HELP/LIST/BUY/BAL/POUCH/EXIT. Checked the existing
  `darkWebBuy` coachmark (`night-shop`, mounted on NIGHT.SYS, fires before
  the player ever reaches the CLI) against the new surface rather than
  assuming it still lands: the RULE it states ("no shape choice", "price
  climbing by the day", sold on DARKNET.LNK) is unaffected by the surface
  change and stays TAUGHT. Checked the CLI's own interaction model against
  the `pieceDragCarry, NOT ADDED` precedent (SOLDER.BAY drag-vs-tap,
  2026-07-29) rather than reflexively treating "you can now type commands"
  as a new taught verb: the always-visible command chips fully reach every
  trade outcome the typed path reaches (confirmed in the study's own
  `runCmd`, both paths converge on identical function calls), typing is a
  pure accelerator layered on the same click-a-labeled-button idiom every
  other window in this game already teaches by precedent, and the prompt
  itself carries no true text-input focus target (no virtual keyboard is
  invited on touch, per the study's own no-op click handler), so no player
  is ever blocked into thinking a keyboard is required. No
  `MECHANIC_INVENTORY` row added for CLI operation, same ruling shape as the
  drag precedent: a redundant accelerator over an already-sufficient,
  already-learned verb is not automatically a teaching gap. One real
  finding: the CLI regresses the always-visible current price the pre-CLI
  window carried for free on its BUY button label, gating it instead behind
  HELP/LIST/HAGGLE or an already-committed BUY. Ruled tier 0, not a
  coachmark, per the placement-bias table's own rule 2 (recurring numbers
  are reference, not a once-told rule): `ui-spec` `darknet-cli-rate-chip`
  filed. Deny states (pouch full, short credits, market offline) all
  confirmed self-explanatory in-fiction, the offline case doubly covered by
  the DARKNET.LNK desktop icon's own pre-emptive hover hint ("Opens for
  trade after the shop closes", `shop-os.tsx:478`, pre-existing, unaffected
  by this cycle). Full verdicts: `pipeline/gates/tutorial-review.md`.
- **2026-07-29, `ux-2026-07-29-dadlog`: a fiction reframe nearly shipped a
  wrong cadence claim.** DAD.LOG's archive-reader study (standalone,
  `ui-demos/kpos-shell/dadlog.html`, not a game integration) replaces the old
  vague "keep diving" locked teaser with a specific causal claim about the
  recovery drive. Checked it against `journal.ts`/`run-reducer.ts` rather
  than taking the copy at its word: the claim ("every DIVE attempt") named
  the wrong unit; the real gate is the RUN (`runCount`, incremented once per
  `startRun`), and DAD.LOG's desktop-icon reachability
  (`shop-os.tsx:53,475`) means a player will actually watch this claim fail
  inside their very first run, not in some edge case. REVISE filed. Also
  ruled: the tab filter needs no coachmark (self-evident chrome, ALL always
  the safe default) but its silent empty-filter state does read as broken
  and wants a tier-0 caption; the recovery beat's 220ms/470ms status
  sequence plus a continuously blinking caret reads as calculated, not hung,
  and its reduced-motion path (final state in one frame, sfx unchanged)
  fully covers the comprehension risk; the choice to keep the damaged page's
  body at full ink while dimming title/provenance is the right call,
  PROVIDED the underlying sentence is fixed first, since ink weight on a
  wrong sentence just teaches the wrong thing more confidently. First ledger
  row ever filed for this mechanic: `journalRunGate`, PLANNED (a study, not
  yet in shipped `content/teaching.ts`). No `pipeline/proposals/
  tutorial-agent.json` items or copy orders filed this cycle: a
  pre-integration study gate, per the brief's own scoping, gets its full
  reasoning recorded here and in `pipeline/gates/tutorial-review.md`, not in
  proposal artifacts that would imply this is ready to integrate today.
  Standing lesson: a vague placeholder line can never fail an accuracy
  check, only a specific one can, so replacing "keep diving" with real
  diegetic voice raises the stakes on getting the cadence right, not just
  the tone. A second, narrower lesson: "dive" and "run" are NOT
  interchangeable diegetic units in this game even though both read as
  natural English for "an attempt," and any copy making a claim about
  progression cadence has to say which one it means and verify that against
  the reducer, not against how the sentence scans.
  **Round 3 addendum (same cycle, `ux-2026-07-29-dadlog`), the per-entry
  ATTACHMENT cell.** User approved a per-entry image swap (BRIEF.md's
  Addendum, 20 Higgsfield credits, 5 new commissions) superseding the
  persistent SOURCE MEDIA plate this ledger's round-2 pass had reviewed.
  Reviewed the rewritten section F: the NO VISUAL PAYLOAD empty cell for
  text-only entries is COVERED, two explicit words of state (a definitive
  "NO," plus the reason, "TEXT ARTIFACT") is the same fix as round 2's own
  `NONE OF THIS KIND RECOVERED YET`, applied a second time to a second
  empty-state surface; the demo rig's Dither row narrowing to affect only
  the solder cell is COVERED, confirmed against the shipped `dadlog.tsx`
  that no rig chrome survives into the integrated component at all. One
  real finding: the damaged/locked teaser page shares that exact cell and
  caption with the four real text-only entries, but its own underlying
  entry is not knowably text-only (`nextLocked` can be masking a future
  SCAN-kind entry like `bills`, which gets a real image once unlocked), so
  asserting "TEXT ARTIFACT" there is a category claim the tool cannot back
  up and that can be directly falsified next run. Same standing lesson as
  round 2, applied to a second control on the same surface: a specific,
  diegetic claim is checkable in a way a vague or generic one is not, and
  reusing one state's label for a different state (recovery-incomplete
  wearing text-only's caption) is its own quiet way of making an unchecked
  claim, even without writing any new sentence.
- **2026-07-29, the surfaces moved faster than the ledger, and one waiver
  broke silently in the process.** Brief `ui-integration-2026-07-29`. This
  audit's first and largest finding was procedural: the actual shipped app
  (`components/os/windows/*.tsx`) has already integrated far more of this
  cycle's redesign than either the ux-agent's proposal notes or this
  ledger's own prior entry assumed. INBOX, REPAIR.LOG, LOADOUT.CFG,
  NIGHT.SYS, and DARKNET.LNK are all real, wired, native components today;
  only DIVE.EXE (the duel screen's own reskin, `duel.tsx`) is still the old
  `kp-dive2` layout. Grounding this review in the actual window components
  rather than the proposal text or the ledger's PLANNED rows surfaced three
  things a purely prose-level review would have missed entirely:
  1. **A live, currently-false waiver the harness cannot see.**
     `jobBoard`'s backing sentence, present on every JobBoard visit for two
     cycles, is confirmed absent from the shipped `InboxContent`. `teach-sim`
     stayed green throughout, because it only checks that a waiver string
     exists in code, never that the sentence it quotes still renders
     anywhere. This is the sharpest version yet of the standing lesson
     "coverage in the data is not coverage on the screen": here the DATA
     (the waiver string in `content/teaching.ts`) never moved at all, and
     the SCREEN moved out from under it without anyone editing the string
     that was supposed to describe it. Filed `ui-spec`
     `inbox-collapsed-row-parity` to restore it, plus the related but
     independent `threatTier` list-view regression found alongside it.
  2. **An entire cohort of `PLANNED` rows had already graduated without the
     ledger noticing.** `patchShapes`, `darkWebBuy`, `slotBuy`, `boostSlots`,
     `boostSwap`, `patchDrop`, and `gridlockChip` were all still marked
     PLANNED here, several with "provisional" caveats about ui-specs that,
     on direct inspection, had already landed and were working, in one case
     (`patchDrop`'s capped-case glyph) exceeding what was actually asked
     for. This is the exact scenario the PLANNED status was invented for
     (deep-balance-2026-07-28's own loop history: "a real audit is owed
     once the Orchestrator integrates and teach-sim can actually check
     it") finally happening, one cycle later than it should have: nobody
     had gone back and looked.
  3. **A coachmark can be overtaken by the very surface it was written
     for.** `patch-craft` was speced as a coachmark against a SOLDER.BAY
     that did not exist in shipped code yet. The SOLDER.BAY that actually
     got built carries the same rule at tier 0, persistently, via a status
     line, a schematic that blinks the gain, and slot filtering that makes
     the mistake the coachmark warned about structurally impossible to
     make. Retired the coachmark entirely rather than relocating it (which
     this cycle's brief explicitly asked me to rule on, expecting a
     relocation); the direct read of the shipped bench made retirement the
     better answer than the brief's own framing anticipated. This also
     surfaced a live bug the relocation framing would have papered over:
     the coachmark's mount (NIGHT.SYS) and its subject (SOLDER.BAY) had
     drifted onto different windows, so a player crafting mid-day could go
     a full run without ever seeing it fire.
  Also resolved a debt that had been sitting in the GATE file (not this
  ledger) across two full cycles: the `ux-2026-07-28-kpos-redesign` gate's
  recommendation to add `pieceDragCarry` and a `solder-bay-intro` coachmark
  was never actually entered into `MECHANIC_INVENTORY` by the following
  cycle's proposal, and sat as an unresolved "still owed" note. Re-examined
  against the now-shipped `SolderContent` and overturned: dragging is a
  mouse/pen-only accelerator over the same tap-to-select flow every other
  interaction in the game already uses, confirmed in the pointer-event code
  itself, and reaches no outcome tap cannot also reach. No coachmark added.
  Considered the identical scrutiny against `boost-swap` and did NOT retire
  it: its configs-are-exempt clause is not stated anywhere in the shipped
  swap UI, unlike patch-craft's outgrow rule.
  Standing lessons, three this cycle:
  1. **A ledger that describes a plan needs a return visit once the plan
     ships, on a schedule, not only when someone happens to notice.** Two
     different rows sat stale for a full cycle in two different directions
     this time (one that had gotten BETTER than planned, one that had
     gotten WORSE than assumed); both needed the same fix, going back and
     reading the actual surface.
  2. **A denser, more alive redesign can lose plain-language sentences
     precisely because it is better at everything else.** Both regressions
     found this cycle (`jobBoard`'s header, `programTiers`' old citation)
     happened on windows that are, by every other measure, a substantial
     upgrade (live typewriters, real counters, richer data). The failure
     mode is not a worse screen; it is a screen confident enough in its
     own polish that nobody thought to check whether an old explanatory
     paragraph made the trip.
  3. **"New input modality, therefore teach it" is not automatically true.**
     A gesture that is strictly additive to an already-sufficient, already-
     learned verb is not the same class of gap as a gesture that is the
     ONLY way to do something. Check whether the old way still fully works
     before reaching for a coachmark to cover the new one.
  Engine ask, pre-authorized: `TeachSurface` (`content/teaching.ts`) widened
  with `"solder"`; `WINDOW_SURFACES` (`dev/teach-sim.ts:54`) widened with
  `"solder"` alongside `loadout`/`desktop`/`tutorial`. No new moment, tip, or
  anchor needed for it; it exists solely so `patchCraft`'s waiver can name
  its real surface and be exempted from the run-walk reachability check the
  same way the other window surfaces already are.
  DIVE.EXE's own reskin (BUS.LOG, the qualitative OPEN/SEVERED/CLOSING/
  CUT/AT THE CORE route rows, the SIG-0 to INTRUSION rename) was reviewed
  as a PLAN, since `duel.tsx` is not yet integrated: judged BUS.LOG
  self-teaching by co-occurrence with mechanics the opening dive already
  covers (it mirrors events the player is already causing and watching,
  introducing no new rule); judged the qualitative route states self-evident
  English requiring no instruction, with the granularity loss (collapsing
  "1 away" and "2 away" into one CLOSING bucket) noted as a legibility
  question for the record but not a teaching gap, since the game's own
  telegraph beats already teach pattern-reading over exact-count planning as
  the core skill; judged the INTRUSION rename to carry no teaching
  consequence either way, since no mechanic's comprehension depends on the
  opponent's identity label, leaving the canon call entirely to the
  loremaster. No new mechanic-inventory row for BUS.LOG.
- **2026-07-28, patch shapes, crafting, dark-web buy, and boost bays,
  proposed ahead of the engine.** Brief `deep-balance-2026-07-28`. Eight
  mechanic-inventory deltas specified as `PLANNED` since none of the
  surfaces existed in shipped code yet. Two retired outright:
  `patchCellBuy` (superseded) and `augmentPoolDry` (the scenario it
  described can no longer happen under the new bay math). All later
  confirmed integrated in the 2026-07-29 audit above, except `patchCraft`,
  whose coachmark was retired rather than confirmed.
- **2026-07-26, the opening dive was not teaching rotation.** `first-rotation`
  tested `ownedNodes <= 2`; board generation hands the player up to 3 nodes
  for free, so roughly 23.9% of dives skipped the lesson. Fixed by matching
  the beat's bound to the generator's own exported cap (`MAX_OPENING_CLAIM`).
  Three standing lessons: measure before grading severity; a bound that
  mirrors another file's bound must import it; a reachability check that
  asks "does SOME line answer" is too weak wherever the specific line is
  the point.
- **2026-07-26, first full sweep of the shipped surface.** 32 mechanics
  reviewed, 8 came back NEEDS-TEACHING. Two coachmarks retired for restating
  permanent headers almost verbatim. Lessons: a trigger can be right about
  the value and wrong about the cause; coverage in the data is not coverage
  on the screen; check the copy against the reducer, not against the last
  draft; a gate seat can catch what the owning seat rationalized.
- **2026-07-26, teaching layer stood up.** Inventory seeded at 26 mechanics:
  20 taught, 6 waived. Ten coachmarks authored, the opening-dive ladder
  migrated out of `duel.tsx` into data.
- **2026-07-26, tooltips became a tier.** Tips are now data (`TEACH_TIPS`),
  count as coverage, and carry their own harness checks. Five seeded: par,
  strain, ram, threatTier, modeLocked.
- **2026-07-26, augment cadence corrected before it shipped.** Measurement
  says one per cleared ticket, three tickets a day, not one per day.
  Standing craft rule: verify progression numbers against the reducer
  before teaching them.
- **2026-07-26, blanket waivers got machine-checkable premises.**
  `waiverPremise` ties each blanket waiver to an assertion `teach-sim`
  re-runs, so the waiver fails when its premise stops being true.
- **2026-07-26, first full-sweep audit.** One real gap (`ramCarry`), eight
  `NEEDS-TEACHING` verdicts, all closed without a single new coachmark.
  Found and fixed two drifted waivers (`credits`, `runReset`), corrected two
  mechanic entries whose `firstContact` named an unreachable screen, and
  retired two coachmarks duplicating permanent headers. Standing lesson: a
  tier can be right on the day it is written and wrong a cycle later once
  the screen around it gets its own permanent copy.
