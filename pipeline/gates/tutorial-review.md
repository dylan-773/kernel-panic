# Tutorial gate: full-sweep audit

Brief: `teaching-2026-07-26` (pipeline/BRIEF.md). Not a proposal review; there
were no incoming proposals this cycle. Subject is the entire shipped surface
as it sits in the uncommitted working tree right now, one cycle after the
teaching layer itself was stood up during `story-retune-1`.

Read for ground truth: `tutorial/ledger.md`, `content/teaching.ts`,
`run-reducer.ts`, `duel-reducer.ts`, `duel-actions.ts`, `duel-power.ts`,
`duel-setup.ts`, `duel-types.ts`, `opponent.ts`, `save.ts`, `content/kit.ts`,
`content/arc.ts`, `content/customers.ts`, `content/story.ts`,
`content/journal.ts`, `dev/teach-sim.ts`, and every screen: `duel.tsx`,
`duel-board.tsx`, `screens.tsx`, `teach.tsx`, `shop-os.tsx`, `login.tsx`,
`icons.tsx`.

Every verdict below is `COVERED` or `NEEDS-TEACHING` and cites a
`tutorial/ledger.md` Coverage-table line. Nothing in this pass adds a new
mechanic to the game; every finding either names a gap in how an existing
mechanic is explained, corrects a factual error in the ledger's own metadata,
or retires teaching that turned out to be redundant with the interface.

---

## Sweep 1: Inventory completeness

Walked every reducer and every screen against `MECHANIC_INVENTORY` (31
entries). One real gap found; two coachmarks found to be teaching things the
interface already says permanently, which is a completeness problem in the
other direction (over-teaching crowds the one-callout budget for no reason).

### Gap: RAM carryover is not named anywhere

`duel-setup.ts:45-59` (`initialEcon`) and `duel-actions.ts` `endPlayerTurn` /
`beginTurnEconomy` (~459-476, 534-540) carry up to `carryCap` unspent RAM
(2 by default, 4 with the CARRY CACHE augment, `duel-setup.ts:136`) into the
player's next turn; the remainder is forfeit. No inventory row names this,
no control states it, and the dock's "+N NEXT" badge (`duel.tsx:567`) today
only lights up for cascade/trap RAM swings (see Sweep 3), never for plain
carryover, so a player can watch that badge for an entire run and never once
see it explain the base rule.

**Verdict: NEEDS-TEACHING.** New inventory row `ramCarry`, first contact
`duel`. Not in the ledger yet (this cycle adds the row). Tier: 1, a tip. This
is exactly the "does the player want this number again" case the ledger's
own par worked-example describes (`tutorial/ledger.md:29-34`): reference, not
a one-time rule. Closed by folding it into the existing `ram` tip (see Sweep
3, which also fixes that tip's mounting) rather than a new coachmark.

### Over-teaching found: two coachmarks duplicate a permanent tier-0 header

`KitScreen`'s header (`screens.tsx:241-244`) reads: *"Three programs, 1 RAM
each, once per turn each. Tiers come from closed days; configs come from
cleared jobs. Tune it whenever; it holds until you change it."* The
`kit-config` coachmark (`content/teaching.ts:230-242`) says, word for word in
substance: *"Three programs, 1 RAM each, once per turn each. Swap modes
whenever you like."* / *"Tiers come from closed days and widen a cast.
Configs come from cleared jobs."* Every fact in the coachmark is already
permanent, always-visible screen copy. The coachmark adds nothing tier 0
does not already say, forever, on every visit.

`JobBoard`'s header (`screens.tsx:103`) reads: *"Three tickets. Strain is
shared across all of them. Pick your order."* The `day-board` coachmark's
first line (`content/teaching.ts:210`) is a near-restatement: *"Three
tickets, one strain meter shared across all of them. The order is yours to
choose."* Only the coachmark's SECOND line adds anything new: the pointer to
MANUAL.TXT (the `manualRef` mechanic).

**Verdict: NEEDS-TEACHING, in the placement-bias sense** (the placement is
wrong, not absent). The ledger's own rule is "always reach for the highest
tier that works" (`tutorial/ledger.md:18-19`); both of these skipped
straight to tier 2 for facts tier 0 already carries permanently. Recommend:

- Retire the `kit-config` coachmark entirely. `kitConfig` and
  `programTiers` become waivers citing `screens.tsx:241-244`.
- Retire the `day-board` coachmark's `jobBoard` half. `jobBoard` becomes a
  waiver citing `screens.tsx:103`. Move `manualRef` to a new tip on the
  MANUAL.TXT desktop icon instead of a coachmark line that only fires once,
  on day 1, before the player has anything to look up yet.

**Build-order dependency, stated plainly so the harness stays green:**
`teach-sim.ts` asserts a mechanic cannot be both waived and taught in the
same build (`dev/teach-sim.ts:110-112`, the "both waived and taught" check).
Adding the three waivers below is only safe paired with removing (or
narrowing) the `day-board` and `kit-config` `TeachingMoment` entries in the
same edit:

- Remove `content/teaching.ts:201-214` (`day-board`) and its mount at
  `screens.tsx:145`, OR narrow its `teaches` to `[]`/delete it outright once
  `jobBoard` and `manualRef` both move off it.
- Remove `content/teaching.ts:229-242` (`kit-config`) and its mount at
  `screens.tsx:346`.

Copy orders for both are still filed below per the brief's explicit
instruction to close out all ten existing coachmarks; each is flagged with
this recommendation so the Orchestrator can choose to skip fulfilling it.

`day-upgrade` and `night-shop` carry a weaker version of the same overlap
(the Upgrade screen's own header and per-button captions already state the
raw numbers) but each coachmark's first line still adds real orienting
information the header does not ("it holds for the rest of the run" as a
consequence, "credits buy two things here" as a frame) so I am not
recommending retirement, only leaner copy. Flagged in their copy orders.

---

## Sweep 2: Waiver re-check

All nine waivers opened and checked against the literal current interface.

| waiver | verdict | evidence |
|---|---|---|
| `reach2` | **valid, re-confirmed** | Legal cells still carry `kp-dlegal` / `kp-dlegal-ring` (`duel-board.tsx:78,143`); the glow affordance is unchanged. |
| `turnCap` | **valid, re-confirmed** | `screens.tsx:373`: `` {r.pay} cr{r.capWin ? " (half rate: you hit the turn cap)" : ""} ``, matching `jobPayFor` halving in `run-reducer.ts:98-103` exactly. |
| `credits` | **partially broken** | See below. |
| `saveSlots` | **valid, re-confirmed** | `login.tsx:98-107`: slot line states `attempt N - day D - strain S` or `N attempts logged`, plus machine-opened state. |
| `runReset` | **partially broken** | See below. |
| `finaleGate` | **player-facing claim true; metadata wrong** | See below. |
| `augmentPoolDry` | **valid, re-confirmed** | `screens.tsx:413-415`: dry-cache line renders exactly when `r.draft.length === 0`, and the +25 salvage is folded into `duelFinished`'s `pay` (`run-reducer.ts:233`) so it is paid, if not literally itemized (minor, see Sweep 3 strain note; not treated as a break). |
| `augmentEffects` | **valid, premise still holds** | `dev/teach-sim.ts:77-84` (`augmentDescs`) checks every `AUGMENTS` entry has a name and a >=20-char desc; verified by hand against `content/kit.ts:127-240` - every entry has both. |
| `modeEffects` | **valid, premise still holds** | `dev/teach-sim.ts:85-98` (`modeDescs`) checks every attack/defend mode desc at all three tiers; verified against `attackModeDesc`/`defendModeDesc` (`content/kit.ts:79-102`) - all substantial at T1-T3. |

### `credits`: broken for the patch-cell control specifically

The waiver's own test is "every screen that spends puts the price and the
balance in the same row" (`tutorial/ledger.md:93-94`). The NIGHT PATCH row
(`screens.tsx:496-511`) passes: price is in the button
(`PATCH_COST` cr), balance is in the very next line of the same row
(`screens.tsx:509`, `{run.credits} cr`). The BUY PATCH CELL row
(`screens.tsx:512-540`) does not: it states the price
(`screens.tsx:529`) and the cell count (`screens.tsx:531-533`) but never
restates the credits balance in that row. This is the exact crack the
ledger predicted: *"the night screen is the one at risk"*
(`tutorial/ledger.md:94`).

**Verdict: NEEDS-TEACHING**, closed by a tier-0 fix, not a coachmark. Filed
`ui-spec` `night-shop-credit-adjacency`.

### `runReset`: the duel-loss path is covered; the Abandon path is not, and the mechanic's `firstContact` field is wrong

The waiver's evidence is real and stronger than the ledger currently
documents: TWO texts state the reset on an ordinary strain-zero loss, not
one. The duel screen's own overlay fires first
(`duel.tsx:683-686`): *"CORE LOST... Its flood got there first. Neural
Strain zeroes. The run is over."* The `runEnd` story scene's `strainBeat`
restates it in voice immediately after (`content/story.ts:33-38`):
*"NEURAL STRAIN: ZERO. CONNECTION SEVERED. RUN N LOGGED."*

But the mechanic's `firstContact` field (`content/teaching.ts:157`) reads
`"result"`. That is factually wrong: `duelFinished` never routes a loss
through `"result"` (`run-reducer.ts:216-221`; `"result"` is win-only). This
means `teach-sim`'s reachability check for `runReset`
(`dev/teach-sim.ts:382-388`) has never actually verified the real
first-contact surface, only that `"result"` (an unrelated, always-reached
screen) happens to be visited.

More importantly: the ABANDON button (`shop-os.tsx:537-548`, always visible
on the taskbar whenever a run exists) reaches the identical reset - `run`
set to `null`, kit wiped on the next `startRun` - through NEITHER of the two
texts above. It shows only a native `window.confirm`
(`shop-os.tsx:542`): *"Abandon this run? Unlocked routines are kept."* Kit
tiers, program configs, augments, credits, and patch cells do not persist
between runs (`baseRunKit()` resets on every `startRun`,
`run-reducer.ts:135`); the phrase "unlocked routines are kept" names nothing
real and could be read as promising kit progress carries over, which it does
not.

**Verdict: NEEDS-TEACHING** (the Abandon path, specifically). Recommend:
1. Correct `firstContact` from `"result"` to `"duel"` (a mechanic-row fix;
   `"duel"` is already a valid, already-visited `TeachSurface`, so no type
   change needed for this half).
2. Widen the waiver text to cite both real texts above.
3. Fix the Abandon confirm string so it does not imply persistence that
   does not exist and plainly states the run ends. Filed `ui-spec`
   `abandon-confirm-accuracy`. Tier 0: the existing native confirm is
   already the right intrusiveness for a rare, deliberate, irreversible
   action; it just needs to say something true.

### `finaleGate`: true on screen; wrong in the ledger's own bookkeeping

The player-facing claim is fine and needs no new teaching: day 10's morning
scene (`content/story.ts:892-908`) states *"NO TICKETS ON THE SPIKE. THE
BACK ROOM SETTLES UP TODAY,"* and the screen that follows
(`FinalePre`, `screens.tsx:551-573`) shows no job board at all, only the
`DAY 10` header and the door. But the mechanic's `firstContact`
(`content/teaching.ts:163`) reads `"upgrade"`, which is the wrong screen -
the fact is realized on `FinalePre`, and `"finalePre"` is not currently a
member of the `TeachSurface` union (`content/teaching.ts:20-28`).

**Verdict: COVERED**, player experience unaffected. Flagged as a
ledger/type correction only: widen `TeachSurface` with `"finalePre"` (and,
while touching that union, `"runEnd"`, since several future waivers may want
to cite it precisely even though `runReset` above does not need it this
cycle) and correct this entry's `firstContact` to `"finalePre"`.

---

## Sweep 3: Firing correctness

### `<Teach>` mount audit (all ten coachmarks)

| moment | mounted at | `surface` matches | `when`/signal supplied | `order` unique | `notBeforeDay` correct |
|---|---|---|---|---|---|
| `day-board` | `screens.tsx:145` | yes | `firstSight`, none needed | 10 | yes |
| `analyze-readout` | `screens.tsx:222` | yes | `firstSight`, none needed | 20 | yes |
| `kit-config` | `screens.tsx:346` | yes | `firstSight`, none needed | 30 | yes |
| `par-budget` | `duel.tsx:504` | yes | `overPar: overPar > 0` - matches | 40 | yes |
| `cascade-bank` | `duel.tsx:505` | yes | `cascadeBanked: banked > 0` - **wrong signal, see below** | 50 | yes |
| `strain-chip` | `screens.tsx:426` | yes | `firstSight`, none needed | 60 | yes |
| `augment-draft` | `screens.tsx:427` | yes | `draftOffered: r.draft.length > 0` - matches | 61 | yes |
| `day-upgrade` | `screens.tsx:541` | yes | `firstSight`, none needed | 70 | yes |
| `night-shop` | `screens.tsx:542` | yes | `firstSight`, none needed | 71 | yes |
| `patch-cell-use` | `duel.tsx:506` | yes | `holdingCells: state.patchCells > 0` - matches | 80 | yes |

Every id, surface, and order is internally consistent and every order value
is globally unique, so ties resolve deterministically and nothing is dead
code by omission. Two providers exist (`shop-os.tsx:292` for the dive,
`shop-os.tsx:432` for the desktop); the desktop one wraps every floating
window at once (loadout included, since `WIN_DEFS` render independent of
`run.screen`), so `kit-config` can in practice compete with `day-board` or
`analyze-readout` if the player has the Loadout window open alongside the
Job Board or Analyze windows. That is a real, working use of the shared
`order` tie-break, not a bug - flagging only so the Orchestrator knows it is
intentional and confirmed working, not an accident of file layout.

### Bug: `cascade-bank`'s signal fires on the wrong mechanic

`cascadeBanked` is computed in `duel.tsx:419` as
`econ.drainNext < 0 ? -econ.drainNext : 0`. `drainNext` going negative has
THREE unrelated causes in `duel-actions.ts` `settleFloods`:

1. A genuine claim-cascade of 4+ nodes (`duel-actions.ts:115-119`, which
   also emits a distinct `"cascadeRam"` fx event for exactly this case).
2. The player's own SIPHON trap (`cfgArmSiphon` augment) firing on the
   opponent (`duel-actions.ts:140-142`, emits `"siphonFire"`, a different fx
   kind, never `"cascadeRam"`).
3. The ECHO TAP augment's flat +2 RAM grant when an enemy trap fires on the
   player (`duel-actions.ts:151-153`) - which emits no fx event at all.

The `cascade-bank` coachmark's copy is specifically about claim cascades
("Four or more claims off one rotation banks bonus RAM"). Because its
trigger reads the raw, cause-blind `drainNext` delta instead of the
already-distinct `"cascadeRam"` fx, a player who first benefits from a
SIPHON trap or ECHO TAP - both reachable well before a real 4+ cascade,
since neither requires lining up a chain - gets the CASCADE lesson
permanently marked taught (`meta.taught`, `save.ts:17-22`) without ever
having seen the thing it describes.

**Fix (pure UI-layer wiring, no reducer change needed):** derive
`cascadeBanked` from whether a `"cascadeRam"` fx was seen for the player
this settle, not from the sign of `drainNext`. The distinguishing fx kind
already exists; only the derivation in `duel.tsx` needs to change.

### Bug: the `ram` tip is mounted where it matters least

The tip's `control` claims "the RAM per turn readout." The only place
`tip("ram")` is actually wired to a `title` is the day board's static
summary (`screens.tsx:139`, `RAM {run.ramPerTurn}/turn` - a fixed per-day
number, seen before a dive even starts). The live RAM dock the player
actually manages turn to turn during a dive
(`duel.tsx:564-569`, `kp-dock-ram`) carries no `title` at all. This is the
"a moment whose signal is never passed is dead code that reads as coverage"
failure mode, applied to a tip instead of a coachmark: the reference exists
in the data and satisfies `teach-sim`, but is absent from the one control a
player is most likely to want it on. Folded into the `ram` tip's fix in the
proposal (mount `title={tip("ram")}` on `duel.tsx:565` as well, and rewrite
the text to also name the carryover rule, closing the `ramCarry` gap from
Sweep 1 in the same control).

### `TUTORIAL_BEATS`: reachable, one low-severity edge case

Traced all ten beats against a real opening dive by hand: `watch-it-move` /
`holding-back` / `no-longer-holding` gate correctly on `turn === "opp"`;
`first-rotation` / `chain-toward-core` gate on `round === 1`; `scan-it` /
`purge-it` / `purge-waiting` / `attack-it` progress in the order the script
demonstrates each program (`programUnlocked`, `duel-actions.ts:60-67`
confirms SCAN unlocks the moment the machine's first trap exists, which
`decideProgram`'s tutorial branch, `opponent.ts:53-58`, guarantees by the
opponent's first move); `whole-toolbox` is an unconditional catch-all.
`dev/teach-sim.ts:240-264` already exhaustively checks every reachable
`(turn, round, owned, scanned, purged, attacked, trapShown)` combination and
currently reports zero holes.

One low-severity edge case for awareness, not a blocking finding: board
generation (`duel-setup.ts:180-184`) can pre-claim up to 3 nodes for the
player before the tutorial even starts (the fairness filter only rejects
boards where either flood claims MORE than 3). `first-rotation`'s test is
`ownedNodes <= 2`; on the rare seed where the pre-claim lands at exactly 3,
the ladder skips straight to `chain-toward-core` and the player never sees
the explicit "click a glowing junction to rotate it" line. Noted for the
record; not proposing a fix this cycle given how rare the seed condition is
and that `chain-toward-core`'s line still explains the same verb in
context.

### Strain chip: the formula has three inputs, the copy names one

`finishDuel` (`duel-actions.ts:79-95`) computes the strain chip from THREE
things: rotations over par (`PAR_STRAIN_PER = 2` each,
`content/kit.ts:41`), traps sprung against the player (4 each,
`duel-actions.ts:88`), and a flat +10 if the win came from hitting the
round cap (`duel-actions.ts:89`), total capped at 40. The `par-budget`
coachmark and the `par` tip both only ever describe the first input. The
`strain-chip` coachmark's actual current line - "A clean dive costs
nothing. A messy one bills you." - is true but names nothing specific
enough to change a decision: a player who stays under par but walks into a
trap has no way to know that is what cost them strain, since the result
row shows one combined number (`screens.tsx:378-380`) with no breakdown.

**Verdict: NEEDS-TEACHING** for the trap and turn-cap contributions
specifically (par-over is already covered). Tier-0 first: filed `ui-spec`
`strain-chip-breakdown` to make the result row itemize what produced a
nonzero chip, which is the fix that actually helps every player, every
time, rather than a coachmark that fires once. Paired with a copy amendment
to the existing `strain-chip` coachmark (see its copy order) so the RULE
("traps sprung against you bill you too, not just extra rotations") is
still said once even before the breakdown ships.

### Cross-cutting: no tip or hover panel survives touch input

Every `teach-tip` is a plain HTML `title` (`duel.tsx:458,463`;
`screens.tsx:126,137,139,271,298`), and the only place ATTACK/DEFEND mode
descriptions are visible mid-dive is the `kp-ability-info` hover panel
(`duel.tsx:591-599`, `onMouseEnter`/`onMouseLeave` only). Neither fires
reliably from a tap. The Loadout window, where the same mode descriptions
exist as always-visible static text (`screens.tsx:279,306`), is not
reachable while a dive is in progress (the dive owns the whole screen,
`shop-os.tsx:270-336`). A touch player has no way to read ANY tip or ANY
mid-dive ability description at all. Filed `ui-spec` `touch-safe-tooltips`.
This is exactly the "a tooltip that survives touch input" gap this seat is
supposed to hand to the ux-agent rather than invent.

### RAM upgrade button: no cap parity with the tier buttons

`UpgradeScreen`'s `tierBtn` (`screens.tsx:451-468`) disables and relabels
"MAXED" once a program tier hits 3. The `+1 RAM / TURN` button
(`screens.tsx:485-491`) has no `disabled` prop at all and never changes
label; once `run.ramPerTurn` reaches `MAX_RAM` (9, `run-reducer.ts:48`),
clicking it still consumes the player's one nightly upgrade
(`chooseUpgrade`, `run-reducer.ts:303-311`, silently clamps via `Math.min`)
for zero effect. The only signal is the button's own text collapsing to
"9 to 9," which is easy to miss and inconsistent with how the other three
buttons handle the identical situation. Given the day curve's nine upgrade
opportunities (`content/arc.ts:26-35`) and a base of 5 RAM, a player who
always picks RAM hits this dead click by day 4 and could repeat it five
more times before the finale. Not strictly a teaching gap (the `dayUpgrade`
mechanic's own coachmark claim - "one upgrade a night, holds for the run" -
stays true regardless) but a real, reachable interface inconsistency.
Filed `ui-spec` `ram-upgrade-cap-parity`.

---

## Verdicts (every mechanic, one line, cites the ledger)

`tutorial/ledger.md` Coverage table lines in parentheses.

| mechanic | verdict | note |
|---|---|---|
| rotate (50) | COVERED | beat `first-rotation`, reachable, confirmed. |
| flood (51) | COVERED | beat `chain-toward-core`, reachable, confirmed. |
| scan (52) | COVERED | beat `scan-it`, unlock timing confirmed against `programUnlocked`. |
| defend (53) | COVERED | beats `purge-it`/`purge-waiting`, reachable, confirmed. |
| attack (54) | COVERED | beat `attack-it`, reachable, confirmed. |
| telegraph (55) | COVERED | beats `watch-it-move`/`holding-back`/`no-longer-holding`, all reachable. |
| cascade (56) | **NEEDS-TEACHING** | signal bug, Sweep 3: can fire on siphon/echoTap instead of a real cascade. |
| par (57) | COVERED | tip + coachmark correctly mounted and accurate against `PAR_RATE`/`PAR_FLAT`. |
| ram (58) | **NEEDS-TEACHING** | tip mis-mounted (Sweep 3) and misses carryover (Sweep 1, `ramCarry`). |
| patchCellUse (59) | COVERED | coachmark correctly mounted on `holdingCells`. |
| strainChip (60) | **NEEDS-TEACHING** | formula has 3 inputs, copy/UI name 1; see Sweep 3. |
| jobBoard (61) | **NEEDS-TEACHING** (placement) | fully redundant with `screens.tsx:103`; recommend waiver, retire coachmark. |
| manualRef (62) | **NEEDS-TEACHING** (placement) | migrate to a tip on the MANUAL.TXT icon; coachmark it rides on is being retired. |
| analyzeTell (63) | COVERED | raw facts are tier 0, but the coachmark earns its tier 2 slot teaching the readout's trustworthiness/purpose, not just restating numbers. |
| threatTier (64) | COVERED | tip correctly mounted on the ticket pips. |
| kitConfig (65) | **NEEDS-TEACHING** (placement) | fully redundant with `screens.tsx:241-244`; recommend waiver, retire coachmark. |
| programTiers (66) | **NEEDS-TEACHING** (placement) | same coachmark, same fix. |
| augmentDraft (67) | COVERED | coachmark correctly mounted on `draftOffered`. |
| augmentCadence (68) | COVERED | re-verified against the reducer: one draft per cleared ticket, three tickets a day (`run-reducer.ts:212-264`); copy states this correctly. |
| dayUpgrade (69) | COVERED | claim remains true regardless of the RAM-button parity papercut (Sweep 3). |
| nightPatch (70) | COVERED | coachmark accurate; button states cost and effect. |
| patchCellBuy (71) | COVERED | coachmark accurate; button states cost, cap, and disables correctly with a reason. |
| reach2 (72) | COVERED (waiver valid) | re-confirmed, Sweep 2. |
| turnCap (73) | COVERED (waiver valid) | re-confirmed, Sweep 2. |
| credits (74) | **NEEDS-TEACHING** | waiver breaks on the patch-cell row, Sweep 2. |
| saveSlots (75) | COVERED (waiver valid) | re-confirmed, Sweep 2. |
| runReset (76) | **NEEDS-TEACHING** | Abandon path uncovered + wrong `firstContact`, Sweep 2. |
| finaleGate (77) | COVERED | player experience fine; `firstContact` metadata wrong, Sweep 2 (non-blocking). |
| augmentPoolDry (78) | COVERED (waiver valid) | re-confirmed, Sweep 2. |
| augmentEffects (79) | COVERED (waiver valid, premise re-verified) | Sweep 2. |
| modeEffects (80) | COVERED (waiver valid, premise re-verified) | Sweep 2. |
| ramCarry (new) | **NEEDS-TEACHING** | new row, Sweep 1; closed by the `ram` tip rewrite. |

Totals: 31 existing + 1 new = 32 reviewed. 8 `NEEDS-TEACHING` (2 of them
placement corrections rather than absent teaching), 24 `COVERED`. All 8 are
closed by items in `pipeline/proposals/tutorial-agent.json` this cycle;
none require a new coachmark, and none require weakening `teach-sim`.

---

## Routing by tier

**Tier 0 (ui-spec, to ux-agent on re-spawn):**
- `night-shop-credit-adjacency` - closes `credits`.
- `ram-upgrade-cap-parity` - papercut parity, not a hard teaching gap.
- `abandon-confirm-accuracy` - closes half of `runReset`.
- `strain-chip-breakdown` - closes the numeric half of `strainChip`.
- `touch-safe-tooltips` - cross-cutting, affects every tip and the mid-dive
  ability panel.

**Tier 1 (stays with tutorial-agent, in this proposal):**
- `ram` tip rewritten (closes `ramCarry` and the mounting bug together).
- new `manualRef` tip on the MANUAL.TXT desktop icon.

**Tier 2 (stays with tutorial-agent):** no new coachmarks this cycle.
Two are being retired (`day-board`'s `jobBoard` half, `kit-config`
entirely) rather than added to.

**Tier 3 (narrative-director, as a scene request):** none raised this
cycle. Nothing found needed physical performance to teach; nothing found
warranted story weight.

**Pure code fixes with no design decision (state directly for the
Orchestrator, not routed through ux-agent since nothing new is being
invented):**
- `cascade-bank` signal derivation (`duel.tsx:419` and its `Teach` mount at
  `duel.tsx:505`) - swap the `drainNext`-sign check for a check against a
  `"cascadeRam"` fx seen this settle.
- `ram` tip mount (`duel.tsx:564-569`) - add `title={tip("ram")}`.
- `TeachSurface` union widen (`content/teaching.ts:20-28`) - add
  `"finalePre"` and `"runEnd"`.
- `runReset` / `finaleGate` `firstContact` corrections
  (`content/teaching.ts:157,163`).
- Retire `day-board` and `kit-config` `TeachingMoment` entries
  (`content/teaching.ts:201-214, 229-242`) and their mounts
  (`screens.tsx:145,346`), paired with the three new waivers so
  `teach-sim`'s "both waived and taught" check does not fail the build.
- `DesktopIconProps` needs a `title?: string` passthrough
  (`icons.tsx:128-146`) to carry the new `manualRef` tip.

---

## Copy orders filed (closes the ledger's open item)

All ten existing coachmarks, per the brief's explicit instruction. Filed at
`pipeline/copy/orders/`. Two are flagged for likely retirement per Sweep 1;
fulfill them only if the Orchestrator keeps the moment rather than acting on
the retirement recommendation above.

- `copy-day-board` - **flagged: likely retirement of the `jobBoard` half.**
- `copy-analyze-readout`
- `copy-kit-config` - **flagged: likely full retirement.**
- `copy-par-budget`
- `copy-cascade-bank`
- `copy-strain-chip` - intent widened to cover traps sprung, not just
  rotations past par.
- `copy-augment-draft`
- `copy-day-upgrade` - constraint added: do not restate the per-button
  numbers, they are already on screen permanently.
- `copy-night-shop` - same constraint.
- `copy-patch-cell-use`

Tips are not routed through copy orders (this agent writes those directly,
per standing practice): the `ram` tip rewrite and the new `manualRef` tip
are both in `pipeline/proposals/tutorial-agent.json` with final text.
