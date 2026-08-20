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

**2026-08-19: the run layer is gone. THE DAY IS THE RUN.** The game now has
two environments, a walkable 2.5D shop (`components/scene/`) and KP/OS on the
bench terminal, and the whole coverage table below was rebuilt against that
shipped surface. Everything in this file before this date describes the old
per-run architecture (JobBoard, the old day-board, run-keyed strain and
journal gates) and is now historical; it is compressed into the "Archived:
run era" section near the end rather than deleted, per this file's own
never-cleared rule, but treat any citation there as dead unless re-confirmed.

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
assumed. `patchCraft` is the standing worked example of that direction: a
coachmark speced against a bench that did not exist yet turned out to be
strictly worse than the bench the Orchestrator actually built, and stays
retired under the day-is-the-run SOLDER.BAY too (re-confirmed this cycle).

## Coverage

Status is what the harness sees. `TAUGHT` means a moment or beat covers it;
`WAIVED` means the interface is claimed to carry it unaided. `PLANNED` is a
third status, used only for mechanics whose engine support has not shipped
yet.

A waiver's `TAUGHT`/`WAIVED` status is what the code claims, which is not the
same as what a direct read of the live surface confirms: `teach-sim` checks
that a waiver string exists and is long enough, it cannot read English and
confirm the sentence it quotes still renders anywhere. This cycle's audit
re-read every waived mechanic against the live component it cites. All but
two held exactly as claimed. The two that did not: `diveLoss` (below,
urgent: the shipped overlay says the opposite of what the waiver claims) and
`backroomOppOpens` (citation drift only, the underlying claim still holds).
See the Waiver log for both.

42 mechanics, 25 taught, 17 waived. All 42 rows re-grounded against the
shipped `content/teaching.ts` and the room/window components this cycle
(2026-08-19); no row below is carried over from the pre-rebuild table without
a fresh check.

| mechanic | first contact | how | status |
|---|---|---|---|
| rotate | opening dive | beat `first-rotation` | TAUGHT |
| flood | opening dive | beat `chain-toward-core` | TAUGHT |
| scan | opening dive | beat `scan-it` | TAUGHT |
| defend | opening dive | beats `purge-it`, `purge-waiting` | TAUGHT |
| attack | opening dive | beat `attack-it` | TAUGHT |
| telegraph | opening dive | beats `watch-it-move`, `holding-back`, `no-longer-holding` | TAUGHT |
| cascade | duel | coachmark `cascade-bank`, confirmed live in `duel.tsx` (`Teach id="cascade-bank"`) | TAUGHT |
| par | duel | tip `par` on the dive dock readout, plus coachmark `par-budget`; both confirmed live in `duel.tsx` | TAUGHT |
| patchCellUse | duel | coachmark `patch-cell-use`, while carrying a cell; confirmed live | TAUGHT |
| patchShapes | duel | coachmark `patch-cell-use`, second line ("Arms land exactly as held...") | TAUGHT |
| patchCraft | SOLDER.BAY | WAIVED. SOLDER.BAY's own `FOOT_LINE` and status line (`LINE_HELD = "PICK A PARTNER. THE WELD MUST OUTGROW BOTH."`) carry the outgrow rule at tier 0; confirmed verbatim live in `windows/solder.tsx` this cycle, unaffected by the room rebuild since SOLDER.BAY is unlocked by the `solderBay` repair but otherwise unchanged | WAIVED |
| strainChip | result | coachmark `strain-chip`, plus tip `strain`; confirmed live in `windows/report.tsx` and the room HUD | TAUGHT |
| manualRef | desktop | tip on the MANUAL.TXT dock icon (`shop-os.tsx`'s `DockIcon hint={tip("manualRef")}`) | TAUGHT |
| kitConfig | loadout | tip `modeLocked` on a locked mode button; confirmed live in `windows/loadout.tsx`'s `ProgPanel` mode row | TAUGHT |
| analyzeTell | counter (INBOX's ticket card) | coachmark `analyze-readout`; confirmed live in `windows/inbox.tsx` and the room's `IntakeDialog` | TAUGHT |
| threatTier | counter (INBOX's ticket card) | coachmark `analyze-readout`, plus tip `threatTier`; confirmed live on the `TierPips` control | TAUGHT |
| augmentDraft | result | coachmark `augment-draft`, when a draft is offered; confirmed live in `windows/report.tsx` | TAUGHT |
| ram | opening dive | beats, plus tip `ram`; confirmed live on the dive dock and INBOX's footer | TAUGHT |
| ramCarry | duel | tip `ram` (names the carryover cap) | TAUGHT |
| nightPatch | evening | coachmark `night-shop`; confirmed live in `windows/night.tsx`'s NIGHT PATCH row | TAUGHT |
| darkWebBuy | evening | coachmark `night-shop`; confirmed live in `windows/night.tsx`'s BUY BLIND row, gated on the onion router repair | TAUGHT |
| walkInteract | floor | coachmark `walk-interact`, firstSight on the shop floor; confirmed the affordance it describes is real: a bobbing chevron `promptMarker` plus the bottom `PromptBar` both render whenever the player stands on an interactable (`overworld/scene.ts`, `scene/room-ui.tsx`) | TAUGHT |
| counterIntake | counter | coachmark `counter-intake`; confirmed live in `scene/room-ui.tsx`'s `IntakeDialog` (TAKE THE JOB / SEND THEM ON) | TAUGHT |
| heldVsBanked | result | coachmark `held-banked`, plus tip `held` on the room HUD's HELD chip; confirmed live in `scene/room-ui.tsx`'s `RoomHud` (`sc-hud-held`) | TAUGHT |
| benchSit | floor | coachmark `walk-interact`, second line ("The bench is where the work happens...") | TAUGHT |
| closeBank | floor | WAIVED. The stairs prompt (`ROOM_COPY.closePromptHeld`, `"CLOSE THE SHOP. EVERYTHING HELD BANKS THE MOMENT YOU DO."`) matches the waiver's citation verbatim, confirmed live in `content/story.ts`; the close `ConfirmPanel` (`game-shell.tsx`) itemizes the exact held credits/salvage and, when a ticket is still open, adds "The ticket on the spike goes home unfinished. No charge." before the player commits | WAIVED |
| bustLoss | bust | WAIVED. `bustScene()` (`content/story.ts`) plays the instant strain hits zero and states "TODAY'S TAKE IS GONE WITH IT. NOTHING BANKED TAKES THE HIT."; the bust-phase `ConfirmPanel` sleep body restates "Everything banked is untouched. Tomorrow opens normally." Both confirmed live | WAIVED |
| sundayGate | floor | WAIVED. The tower prompt on a weekday reads `ROOM_COPY.backroomPromptWeekday`, `"THE BACK ROOM DOOR. OPEN, LIKE ALWAYS. THAT IS A SUNDAY PROBLEM."`, confirmed verbatim live in `content/story.ts` and wired through `promptLabel` in `scene/room-ui.tsx` | WAIVED |
| repairsUnlock | floor | WAIVED. Every `StationPanel` (`scene/room-ui.tsx`) states BROKEN/PARTLY REPAIRED/REPAIRED, an UNLOCKS row, and a PRICE row on every visit; confirmed live | WAIVED |
| salvageCurrency | evening | WAIVED. NIGHT.SYS's deck section prices every upgrade in salvage next to the SALVAGE balance (`windows/night.tsx`); REPAIR.LOG itemizes "SALVAGE PULLED +{n} SV" on its own row (`windows/report.tsx`). Both confirmed live | WAIVED |
| deckSlots | loadout | coachmark `deck-slots` (swapOffered), plus tip `boostSlots`; confirmed live in `windows/loadout.tsx`'s BOOST BAYS block | TAUGHT |
| reach2 | opening dive | WAIVED. The legal rotation set is drawn as glowing junctions; unaffected by the room rebuild (DIVE.EXE's board is untouched by it) | WAIVED |
| turnCap | result | WAIVED. REPAIR.LOG's `payRows` names "reduced rate, you hit the turn cap" inline; confirmed live in `windows/report.tsx` | WAIVED |
| credits | counter | WAIVED. Every spend surface puts price and balance in the same row: the room's `StationPanel` PRICE row ("{cost} CR (YOU HOLD {credits})"), NIGHT.SYS's buy rows, DARKNET.LNK's CLI deny line. Confirmed live across all three | WAIVED |
| programTiers | loadout | WAIVED. LOADOUT.CFG's `ProgPanel` shows each program's live RANGE/WIDTH numeral directly beside its TIER meter; confirmed live | WAIVED |
| saveSlots | desktop | WAIVED. Login lists attempts/day reached per slot; unaffected this cycle (`components/os/login.tsx` untouched) | WAIVED |
| diveLoss | duel | **WAIVED, but the citation is false on the live surface.** See Waiver log, urgent. The room's `LossToast` is accurate ("CORE LOST. NO CHARGE, NO STRAIN."); DIVE.EXE's own result overlay is not | WAIVED (broken) |
| backroomOppOpens | duel | WAIVED, citation stale but substance holds. The waiver quotes "the IT IS MOVING turnlight"; the live line is `"The intrusion is moving. Watch the line."` (`duel.tsx`, opp-turn status), renamed under the INTRUSION redesign. The player still watches this line render before their first input on the only dive that opens this way. Citation corrected below | WAIVED |
| patchDrop | result | WAIVED. REPAIR.LOG's RECOVERED cell names the shape and shows its glyph inline in both the banked and capped cases; confirmed live | WAIVED |
| diagDepth | counter | WAIVED. Every unread field renders as a `DeadRow`/`ib-tick ib-dead` naming the exact bench stage that would read it ("BENCH CANNOT READ THIS YET (DIAGNOSTIC BENCH)"), in both `scene/room-ui.tsx`'s `IntakeDialog` and `windows/inbox.tsx`. Confirmed live, identical wording in both places | WAIVED |
| augmentEffects | result | WAIVED, blanket. Every augment carries its own desc; premise `augmentDescs` re-checked by `teach-sim` on every run | WAIVED |
| modeEffects | loadout | WAIVED, blanket. Every mode carries its own desc; premise `modeDescs` re-checked by `teach-sim` on every run | WAIVED |

### Reviewed this cycle and ruled no gap (not inventory rows)

The brief asked specifically whether the room's new surfaces introduced
anything with no inventory row at all. Checked each named example directly
against the shipped code, not the proposal text:

- **The prompt marker** (the bobbing chevron plus the bottom `PromptBar`).
  Real, confirmed in `overworld/scene.ts` and `scene/room-ui.tsx`. It is the
  affordance the `walkInteract` coachmark's own line already claims ("E or a
  click works whatever is glowing"); no separate row needed, same shape as
  `reach2`'s glowing-junctions waiver.
- **Click-to-move.** Real: clicking a walkable tile paths the player there
  (`overworld/scene.ts`'s `clickPath`/`clickTarget`), and clicking furniture
  walks to its stand point and auto-interacts on arrival. This is a second
  input modality reaching the same outcome WASD-plus-E already reaches, the
  identical shape as the `pieceDragCarry, NOT ADDED` and CLI-typing precedents
  from the run era: a redundant accelerator over an already-sufficient,
  already-taught verb is not automatically a teaching gap. No row added.
- **The customer walking out on decline.** Confirmed
  (`bridge.commands.customerLeave()` in `game-shell.tsx`). Already covered:
  `counterIntake`'s coachmark states "declining costs nothing" before the
  player ever declines.
- **Sunday scene cadence.** `sundayScene()` (`content/story.ts`) is a
  scripted story beat, tier 4, the narrative-director's slot. The MECHANICAL
  fact, that the back room answers Sundays only, is `sundayGate`, already
  WAIVED above. "No customers on Sunday" is structural, not taught content:
  the customer-arrival timer only runs in the `"open"` phase, which Sunday
  never is (`game-shell.tsx`), so the room simply never shows a waiting
  customer; the counter's own examine panel plainly reads "SPIKE IS EMPTY."
- **Sector playbacks.** `sectorScene()` (`content/story.ts`), a scripted
  recovered-audio scene per repair, tier 4, narrative-director's slot. Purely
  optional flavor triggered by an action the player already understands
  (finishing a repair); no mechanic to teach.
- **DAD.VOL artifacts surfacing at objects.** Covered by `repairsUnlock`
  above (every repair's payload is a mechanic, a window, and an artifact,
  per `content/repairs.ts`'s own header comment) plus the `FirstRead` panel's
  own copy, which names the destination directly ("Filed to DAD.VOL for the
  rest of it," `content/story.ts`'s `REPAIR_STATION_COPY`). A player is told
  where the rest of it lives at the exact moment it surfaces.
- **LEDGER.LOG** (new this cycle, gated on the `ledgerTerminal` repair).
  Pure reference (today against lifetime), no action the player takes on it,
  same shape as MANUAL.TXT. No row added. Flagged in Open Work below only as
  "not yet re-audited for accuracy," since it is new.

### One real gap found: strain does not reset between days, and the game
### barely says so

**`strainCarryover`, NEW mechanic, not in the inventory before this cycle.**
Confirmed against `day-reducer.ts`'s `sleep` case: `strain =
Math.min(100, day.strain + SLEEP_REGEN)`, where `SLEEP_REGEN = 10`. Strain is
NOT reset to a fresh value each day; it carries forward from whatever it
closed at, plus a flat +10 from sleeping (capped at 100), or +12 from a paid
night patch (`PATCH_HEAL`, `NIGHT_PATCH_COST = 60`).
This is a structural break from the old per-run design, where strain reset
every run; under the day-is-the-run design it is the central cross-day
resource tension, and the game's own economy leans on the player
understanding it (that is the entire point of NIGHT PATCH existing as a
choice against a repair).

The ONLY place this is stated in player-facing copy is a `MORNING_LINES`
flavor line for Tuesday: `"TUESDAY. Strain carries over. So does the mess on
the bench."` (`content/story.ts`). Checked `morningLine()`'s own cycling
logic directly: Tuesday's pool has 4 lines, picked by `pool[week %
pool.length]`, and this is `pool[1]`, so it is IMPOSSIBLE to see before the
second Tuesday of play, day 9 at the earliest. `strainChip`'s existing
coverage ("Strain is shared across every job today and does not recover
between them," the `strain-chip` coachmark) is explicitly scoped to "today"
and, read in isolation, could reasonably be taken to imply a fresh start
tomorrow, the opposite of the truth. See the gate file and Open Work below
for the proposed fix.

## Waiver log

A waiver is a claim about the interface, so it expires when the interface
changes. Re-check these whenever the named surface is touched.

- **diveLoss, URGENT, new 2026-08-19: the waiver is false on the shipped
  surface.** The `diveLoss` mechanic claims "The dive's own CORE LOST overlay
  states it the instant it happens... no charge, no strain." Read directly
  against `components/game/duel.tsx`'s result overlay (`dv-result-bill`
  block): the row `{state.phase !== "won" && (...NEURAL STRAIN / ZEROED. THE
  RUN IS OVER....)}` fires on EVERY loss, unconditionally, including an
  ordinary ticket loss where `day-reducer.ts`'s `duelFinished` handler
  explicitly does the opposite ("A loss bills no strain: the loss already
  costs the ticket," code comment directly above the branch, confirmed no
  strain field is touched and the day continues in the `"open"` phase). This
  is leftover copy from the old per-run architecture, where a duel loss really
  did end the run; it was never updated for the day-is-the-run redesign,
  where losing a single ticket is a normal, survivable outcome and only an
  actual strain-zero bust ends the day. It directly contradicts the room's
  own `LossToast` (`scene/room-ui.tsx`), which correctly reads "// CORE LOST.
  NO CHARGE, NO STRAIN. _" for the exact same event. A player who loses a
  job dive is told, in the same breath, two opposite things depending on
  which surface they read: the truth (LossToast) and a false alarm (the
  DIVE.EXE overlay) claiming their run just ended. `teach-sim` cannot catch
  this: the waiver string in `content/teaching.ts` never changed, and the
  screen drifted out from under it, the exact shape of last cycle's `jobBoard`
  finding. Filed to the gate as the headline item; `ui-spec`
  `dive-loss-overlay-strain-accuracy` proposed (tier 0, not a teaching moment:
  the fix is making an existing label true, not adding a lesson).
  `expiresIf`: already expired; re-confirm only once the overlay's condition
  is fixed to distinguish an ordinary ticket loss from a real bust.
- **backroomOppOpens, citation corrected 2026-08-19.** Substance re-confirmed,
  wording updated. The waiver used to quote "the IT IS MOVING turnlight." The
  live opponent-turn status line in `duel.tsx` now reads `"The intrusion is
  moving. Watch the line."`, following the INTRUSION rename (loremaster's
  call, not this seat's). The underlying claim, that the player watches this
  line render before their own first input on the only dive that opens this
  way, still holds, confirmed live. Citation updated so this does not become
  a second silent `jobBoard`-style break. `expiresIf`: the opp-first-turn
  status line stops rendering before the player's first legal action, or the
  backroom/Sunday dive stops being the only config with `oppOpens: true`
  (`content/tiers.ts`).
- **patchCraft, re-confirmed 2026-08-19 under the room rebuild.** SOLDER.BAY
  is now reached by walking to it and it is gated behind the `solderBay`
  repair, but the bench component itself (`windows/solder.tsx`) is otherwise
  unchanged: `FOOT_LINE` and `LINE_HELD` ("PICK A PARTNER. THE WELD MUST
  OUTGROW BOTH.") still render exactly as before. Waiver holds.
- **closeBank, bustLoss, sundayGate, repairsUnlock, salvageCurrency, new
  2026-08-19.** All five are new to the inventory this cycle, covering the
  room's own close/sleep/back-room/repair/salvage systems that did not exist
  under the old per-run architecture. Each citation above was read directly
  against the live `scene/room-ui.tsx` and `content/story.ts`, not inferred
  from the room's design intent. `expiresIf` for each: the exact prompt or
  panel line it cites stops rendering, or stops matching this description.
- **diagDepth, credits, turnCap, patchDrop, programTiers, saveSlots, reach2,
  augmentEffects, modeEffects, re-confirmed 2026-08-19.** All nine carried
  over from the run-era table with an unchanged claim; each was re-read
  against the current shipped component this cycle (`windows/report.tsx`,
  `windows/loadout.tsx`, `windows/inbox.tsx`, `scene/room-ui.tsx`,
  `components/os/login.tsx`) rather than assumed to still hold. All nine
  confirmed accurate as written.

## Open work

- **URGENT: fix DIVE.EXE's loss overlay before this ships further.** See
  `diveLoss` above. `ui-spec` `dive-loss-overlay-strain-accuracy` filed in
  `pipeline/proposals/tutorial-agent.json`: gate the "NEURAL STRAIN / ZEROED.
  THE RUN IS OVER." row to an actual bust (strain genuinely hit zero), and
  give the ordinary-ticket-loss case its own accurate row, matching
  `LossToast`'s wording ("no charge, no strain billed, the ticket goes home
  unfinished"). This is a correctness bug wearing teaching-copy clothes, not
  a missing lesson, so it is filed as a tier 0 fix, not a coachmark: making
  the existing label true is strictly better than teaching around a false one.
- **New mechanic, gated this cycle: `strainCarryover`.** See above. Proposed
  in `pipeline/proposals/tutorial-agent.json` as a new `mechanic` row plus a
  tier 2 `teaching-moment` (`strain-carryover-notice`) on the evening surface,
  conditional on `day.strain < 100` when NIGHT.SYS is first reached (a new
  `TeachWhen` value, `strainShort`, is needed in `content/teaching.ts`'s
  union; the signal itself is a one-line read of `day.strain` at the call
  site, no reducer change). Copy order filed:
  `pipeline/copy/orders/strain-carryover-notice.json`. The existing "SLEEP
  RESTORES +10" label on NIGHT.SYS already covers the NUMBER at tier 0/1;
  what is missing is the RULE, which is why this is a coachmark and not a
  second tip.
- **LEDGER.LOG not yet re-audited for accuracy.** New window this cycle
  (gated on the `ledgerTerminal` repair). Ruled "no teaching gap" on
  structural grounds (pure reference, like MANUAL.TXT) but its actual
  numbers/claims were not checked line by line the way DAD.LOG's were in a
  prior cycle (`journalRunGate`'s history is the cautionary example: a vague
  claim survives unaudited a long time, a specific one does not). Worth a
  pass next cycle if LEDGER.LOG's copy makes any causal claim about how a
  stat is computed.
- **`vault/70-teaching/` is now stale relative to this file.** Per this
  file's own footer, the vault mirrors the durable half (charter, placement
  bias, standing lessons). This cycle's full rebuild of the Coverage table
  and the `diveLoss`/`strainCarryover` findings have not been ported there
  yet; flagged for the next documentation pass, out of scope for a gate cycle.

## Archived: run era (through 2026-07-31)

Everything below this point describes the pre-day-is-the-run architecture:
JobBoard, the old per-run day board, run-keyed strain (full reset each run)
and run-keyed journal gates (`runCount`). The interface it describes no
longer exists in this shape; do not cite line numbers or waiver text from
this section against the current game. Full verbatim history lives in this
file's git log. Standing lessons worth carrying forward, extracted from that
history rather than re-derived:

- **A ledger describing a plan needs a return visit once the plan ships, on a
  schedule, not only when someone notices.** Caught a full cohort of stale
  `PLANNED` rows once (2026-07-29) and a fully broken `jobBoard` waiver
  another time; this cycle's `diveLoss` finding is the same failure mode a
  third time, now against a wholesale interface rebuild instead of a single
  window.
- **`teach-sim` checks that a waiver string exists, never that the sentence
  it quotes still renders anywhere.** Every waiver-breaks-silently finding in
  this file's history, `jobBoard`, and now `diveLoss`, passed a green harness
  the entire time. Only a direct read of the live component catches this.
- **A denser, more polished redesign can lose plain-language sentences
  precisely because it is better at everything else.** True again this
  cycle in reverse: the day-is-the-run rebuild is a substantial upgrade
  (physical repairs, held-vs-banked, face to face intake) and still shipped
  one screen (DIVE.EXE's loss overlay) that never got its copy updated for
  the new rules.
- **"New input modality, therefore teach it" is not automatically true.**
  Confirmed a third time this cycle against click-to-move: a gesture that is
  strictly additive to an already-sufficient, already-learned verb is not
  the same class of gap as a gesture that is the only way to do something.
- **Verify progression numbers against the reducer, never against how the
  copy scans.** The augment cadence (one per cleared ticket, not one per day)
  was the original example; `SLEEP_REGEN`/`PATCH_HEAL`/`NIGHT_PATCH_COST`
  were re-verified against `day-reducer.ts` directly this cycle before being
  cited, not assumed from the window copy.
- **A vague placeholder claim can never fail an accuracy check; a specific
  one can.** `journalRunGate`'s history is the clean example: it sat
  unflagged for a long time because "keep diving" was too vague to be
  falsifiable, then became a real, dated bug the moment it was replaced with
  a specific causal claim. It is now fully resolved: DAD.LOG's unlock gate is
  `shop.repairs`-keyed (`content/journal.ts`'s `visibleJournal`), matching
  `repairsUnlock` above, and the damaged-page copy states the correct,
  repair-keyed cadence ("THE VOLUME REASSEMBLES AS THE SHOP DOES. FIX WHAT HE
  LEFT AND THE DRIVE GIVES MORE BACK."), confirmed live in `journal.ts`'s
  `DADLOG_CHROME`. No open finding remains on this mechanic; it is folded
  into `repairsUnlock`'s row above rather than kept as its own row, since the
  old per-run distinction it existed to track no longer applies.

## Loop history

- **2026-08-19, the day is the run: full audit of the rebuilt game.** Brief:
  teaching audit of the integrated day-as-run build. Reviewed all 42 shipped
  mechanics against the live room (`scene/room-ui.tsx`, `scene/game-shell.tsx`)
  and window components (`windows/inbox.tsx`, `night.tsx`, `loadout.tsx`,
  `report.tsx`, `solder.tsx`, `dadlog.tsx`, `ledger.tsx`), not against this
  file's own prior (run-era) account of them. 40 rows confirmed accurate as
  written; two waivers did not survive re-reading: `diveLoss` is actively
  false on the shipped surface (DIVE.EXE's loss overlay claims "THE RUN IS
  OVER" on every ordinary ticket loss, contradicting both the reducer and the
  room's own `LossToast`), filed urgent; `backroomOppOpens` had only drifted
  in its exact quoted line (INTRUSION rename), citation corrected, substance
  intact. One genuine new mechanic found ungated: `strainCarryover`, the fact
  that Neural Strain persists across days and only partially regenerates,
  which the shipped game states almost nowhere reliable (a flavor line that
  cannot appear before day 9). Checked seven named candidates for
  missing-mechanic status (the prompt marker, click-to-move, customer walkout
  on decline, Sunday's scene cadence, the room HUD's HELD chip, sector
  playbacks, DAD.VOL artifacts surfacing at objects) and ruled all seven
  already covered, with reasoning recorded above rather than asserted.
  Confirmed the opening dive still teaches only the four verbs (`CORE_VERBS`
  in `teach-sim.ts`) and that no surface exceeds the two-unconditional-callout
  cap; the day-as-run's new surfaces (floor, counter, evening, bust) sit
  comfortably under it. Compressed the pre-2026-08-19 waiver log and loop
  history into "Archived: run era" above rather than deleting it, since most
  of its line-level citations describe windows that no longer exist in that
  shape; its standing lessons were extracted and carried forward instead.
  Filed `pipeline/proposals/tutorial-agent.json` (one `mechanic`, one
  `teaching-moment`, one `ui-spec`), `pipeline/copy/orders/
  strain-carryover-notice.json`, and this file's rewrite. Full verdicts:
  `pipeline/gates/tutorial-day-is-the-run-2026-08-19.md`.

---

## Where the durable half lives

**This file stays operational.** It carries the coverage table, the waiver log
and the dated cycle retrospectives, and `pipeline/gates/tutorial-review.md`
cites it BY LINE NUMBER, so it must not be reflowed without reason. This
cycle is the documented exception: the shipped interface itself was rebuilt
wholesale (the run layer removed, the day made the run), so line-level
citations to the old table were dead on arrival regardless of whether the
file moved. This pointer is appended at the end for exactly that reason.

The durable half is mirrored and expanded in the Obsidian vault at
`vault/70-teaching/`: the charter, the placement bias order, the coverage
model, the waiver rationales, and the standing lessons extracted out of the
loop history. Read the vault to understand the system; edit here to record
work. **It is stale relative to this cycle's rebuild; see Open Work above.**
