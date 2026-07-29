# Tutorial gate: ui-integration-2026-07-29

Brief: `ui-integration-2026-07-29` (`pipeline/BRIEF.md`). **This file REWRITES
`pipeline/gates/tutorial-review.md` wholesale**, replacing the
`ux-2026-07-28-kpos-redesign` review. That prior review's two "still owed"
items (`solder-bay-intro`/`pieceDragCarry`, and the `copy-patch-craft`
wording revision) are resolved below, not carried forward: both are
overtaken by direct evidence from the now-shipped surface.

**Ground truth read in full this cycle, not assumed from proposal text**:
`kernel-panic-site/app/src/game/content/teaching.ts`,
`dev/teach-sim.ts`, `components/game/screens.tsx`, `components/game/duel.tsx`,
`components/game/duel-board.tsx` (grep), `components/os/shop-os.tsx`, and
every new window component: `components/os/windows/inbox.tsx`, `report.tsx`,
`solder.tsx`, `night.tsx`, `loadout.tsx`, `darknet.tsx`. Also
`ui-demos/kpos-shell/w-solder.ts`, `dive.ts`, `inbox.html`, and the README.

**Load-bearing finding before anything else**: the actual shipped app is
substantially further along than either `pipeline/proposals/ux-agent.json`'s
own notes or the prior ledger entry assumed. INBOX, REPAIR.LOG, LOADOUT.CFG,
NIGHT.SYS, and DARKNET.LNK all already exist as real, wired, native
`components/os/windows/*.tsx` components bound to live run state, not
proposals awaiting integration. Only DIVE.EXE (the duel screen's own reskin)
is still the pre-redesign `kp-dive2` layout in `duel.tsx`. Every verdict
below is grounded in which of these two states actually applies, named
explicitly per item.

---

## Verdict table: `pipeline/proposals/ux-agent.json`, all 12 `ui-spec` items

| # | item | verdict | cites |
|---|---|---|---|
| 1 | `kpos-v2-tokens-system` | COVERED | n/a, pure chrome; `WIN_DEFS` already carries 9 entries in `shop-os.tsx:46-56` |
| 2 | `kpos-inbox-window` | **NEEDS-TEACHING** | ledger `jobBoard` (line 86, waiver log 172-187), `threatTier` (line 89) |
| 3 | `kpos-repairlog-window` | COVERED | ledger `strainChip` (85), `turnCap` (102), `patchDrop` (103), `gridlockChip` (104), `augmentDraft`/`augmentCadence`/`boostSwap` (92-95) |
| 4 | `kpos-dive-exe` | COVERED (plan) | no mechanic-inventory entry changes; reasoning below |
| 5 | `kpos-dive-tutorial-finale-dressing` | COVERED (plan), one non-blocking note | n/a |
| 6 | `kpos-night-sys` | COVERED | ledger `darkWebBuy` (99), `slotBuy` (100), `nightPatch` (97), `credits` (105, waiver log 136-145) |
| 7 | `kpos-morning-log` | COVERED (plan) | ledger `finaleGate` (108), unaffected |
| 8 | `kpos-backroom-lck` | COVERED (plan) | ledger `finaleGate` (108), unaffected |
| 9 | `kpos-desktop-idle` | COVERED (plan) | ledger `saveSlots`-adjacent, no mechanic touched |
| 10 | `kpos-abandon-dialog` | COVERED | ledger `runReset` (107, waiver log 148-159) |
| 11 | `kpos-teach-callout-v2` | COVERED, one anchor now moot | ledger `patchCraft` (84, waiver log 208-234) |
| 12 | `kpos-utility-window-deltas` | COVERED | ledger `manualRef` (87), `augmentEffects`/`modeEffects` (110-111) |

One item is **NEEDS-TEACHING**. Everything else is COVERED, several
confirmed directly against already-live code rather than judged as a plan.

---

## Reasoning on the five scrutiny questions the brief named

### (a) INBOX absorb: do `analyze-readout` and `threatTier` survive the move?

Read directly against the shipped `components/os/windows/inbox.tsx`, not the
proposal text.

**The coachmark and the expanded card: yes, confirmed, byte-for-byte.**
`CustomerCard` (inbox.tsx:170-293) mounts `<Teach id="analyze-readout" />`
(line 290) exactly where the brief promised, and the MODE_TELL line the
brief singled out as at-risk is present and correctly labeled: `<p
className="kp-readout-tell"><Typed text={MODE_TELL[job.dominant]} .../></p>`
under a `READOUT` label (lines 256-260). The full READOUT field set
(dominant routine, THREAT TIERS as diamonds, GRID, INTRUSION RAM, the
head-start WARNING) is present and matches the old `AnalyzeScreen` fields
one for one; none of the card study's own demo-only TICKET RATE / LAST CLEAN
BOOT / POUCH DROPS rows survive, as speced. The THREAT TIERS row on the
expanded card is wrapped in `<TapTip text={tip("threatTier")}>` (line
238), so the tip renders correctly there too. **COVERED**, cites ledger
`analyzeTell` (line 88) and the coachmark half of `threatTier` (line 89).

**The tip's OTHER home, and a waiver's entire premise: no, confirmed broken.**
Before this integration, `threatTier`'s tip lived on the JobBoard's
per-ticket badge (`screens.tsx:234-239`, every row), letting a player
compare all three tickets' difficulty before opening any of them. The
shipped `InboxContent`'s collapsed list (inbox.tsx:384-400) renders each
`kp-inbox-item` row as `{subjectFor(c)}` and nothing else (a `CLEARED` tag
if done): no tier, no portrait, no payout. This is not a reading of the
proposal's intent, it is the literal JSX. Separately, and more seriously:
the `jobBoard` waiver's entire premise ("JobBoard's own header states this
permanently, every visit: three tickets, strain shared, order is yours")
depended on a header paragraph that also does not exist in the shipped
component. `InboxContent`'s `kp-screen-head` (lines 373-379) renders only
the `DAY N OF 10` hero, no subtitle. **This waiver does not currently
hold**, and `teach-sim` cannot see it, since it only checks that the waiver
string exists in code and is long enough, never that the sentence it quotes
still renders anywhere. See ledger waiver log (172-187) for the full
account, and Open work (278-293) for what is owed. The footer (STRAIN/RAM
tips, credits, pouch, kit summary) is confirmed intact, so this is narrower
than "INBOX lost its day-board data": exactly two things are gone, both
identified precisely, neither hypothetical.

**Verdict: NEEDS-TEACHING for `kpos-inbox-window`.** Mechanic: `jobBoard`
(a waiver, currently false) and the list-view half of `threatTier` (a tip
that lost one of its two homes). Surface: the INBOX collapsed list. Tier: 0
for both, a UI fix, not a new coachmark, since both facts were previously
carried by a permanent, always-visible element and the fix is to restore an
equivalent element, not to interrupt with a callout. Trigger: `firstSight`
of the collapsed list, i.e. every time INBOX is open on `day`. `ui-spec`
`inbox-collapsed-row-parity` filed this cycle
(`pipeline/proposals/tutorial-agent.json`) asks for both back and flags,
non-blocking, that the per-ticket payout also vanished for the same reason
(porting `inbox.html`'s bare demo anatomy, which never modeled live data at
all, rather than a deliberate cut).

### (b) DIVE.EXE respec: BUS.LOG legibility, qualitative route rows, INTRUSION rename

`duel.tsx` is confirmed unintegrated for this item: it still renders the
pre-redesign `kp-dive2` layout, still shows the countdown threat banner
(`INTRUSION {oppNear} ROTATION{S} FROM THE CORE`, `duel.tsx:670`), and
`duel-board.tsx:186` still tags the opposing port `SIG-0`. Judgment below is
therefore on the PLAN, matching the `PLANNED` convention this ledger already
uses for exactly this situation.

**BUS.LOG needs no new mechanic-inventory entry.** It is a live transcript
of events the player is already causing or watching (rotate, cast, cascade,
a trap firing), all of which are already-taught mechanics (`rotate`,
`scan`, `defend`, `attack`, `cascade`). A log line appearing in tight
correlation with an event the player just performed or watched happen on the
board is self-teaching by co-occurrence, the same way a fighting game's
input log needs no tutorial of its own once the moves themselves are taught.
Nothing about the log gates a decision the player cannot already make from
the board and the existing coachmarks. **COVERED.** Flagging for the
record, non-blocking: the actual `duel.tsx` already builds an ALL-CAPS,
round-prefixed transcript today (`R01 TRAP SPRUNG. 4 STRAIN BILLED`,
confirmed at `duel.tsx:340-365`) for REPAIR.LOG's dive-log rail, which is a
different register from the narrative-director's proposed lowercase
`ui-copy-dive-buslog` vocabulary (`twist 0x2A`, `trap sprung`). Both
registers are equally self-evident from a teaching standpoint; which one
ships is a presentation call for the Orchestrator and ux-agent, not a
teaching question.

**Qualitative route rows (OPEN/SEVERED/CLOSING/CUT/AT THE CORE) need no new
teaching.** Checked the exact thresholds in `dive.ts:1478-1482`: the
player's own route is binary (OPEN/SEVERED), the opponent's is four-bucket
(OPEN/CLOSING at `oppNear <= 2`/AT THE CORE at `oppNear === 0`/CUT). These
are self-evident English words, and the underlying skill they support
(reading rising danger and reacting to it) is already taught by the opening
dive's telegraph beats (`watch-it-move`, `holding-back`,
`no-longer-holding`), which train pattern-reading over exact-count
tracking as the actual intended skill. **COVERED**, no coachmark, no tip.
One legibility note for the record, not a teaching gap: collapsing "1
rotation away" and "2 rotations away" into a single CLOSING bucket removes
the exact number a player could previously read off the countdown banner.
This is a real information-density question, but it is a balance/UX
judgment already settled by the study's own "NO COUNTDOWN NUMBERS" ruling
(quoted in the README and in the narrative-director's own item text), not a
comprehension gap this seat gates.

**The SIG-0 to INTRUSION rename carries no teaching consequence either
way.** No mechanic in the inventory names the opponent's identity tag;
`telegraph`'s coverage is about the fact that the machine aims before it
strikes, independent of what its port is labeled. Whichever way the
loremaster rules, no coachmark, tip, or mechanic-inventory entry changes.
Deferring entirely to that gate.

**Verdict: COVERED (plan)** for `kpos-dive-exe`.

### (c) REPAIR.LOG: itemized bill, cache, and telemetry readable without new teaching?

Confirmed live, not a plan: `components/os/windows/report.tsx` is fully
integrated and already handles this cleanly.

- **Itemized bill.** `chipRows` (report.tsx:305-311) reproduces the exact
  wording the `turnCap` and `gridlockChip` waivers cite ("reduced rate, you
  hit the turn cap", "link collapsed in gridlock") verbatim from the old
  `ResultScreen`, rendered through a `<Receipt>` list. Both waivers'
  premises hold, confirmed directly, cited at ledger lines 102 and 104.
- **The patch poster.** The `poster` object (report.tsx:324-362) reproduces
  the banked/capped/no-piece-this-ticket three-state machine exactly as
  speced, and the glyph rendering (`poster.mask !== null ? <PatchGlyph
  .../> : ...`) is UNCONDITIONAL on `r.patchDrop.mask` for the drop case,
  meaning the capped case gets a glyph too, which exceeds what the
  `patch-drop-row-naming` ui-spec actually required (it asked only that the
  capped case NAME the shape in text, not necessarily show its glyph). The
  `patchDrop` waiver (line 103) is confirmed earned, not merely provisional.
- **Telemetry.** The ROTATIONS quad's header reads `OVER PAR
  ${r.overRotations}` verbatim, matching the exact wording the prior
  cycle's ui-spec required so it never claims data the reducer does not
  keep (report.tsx:546). TRAP FEED reads the real `r.trapsFired` count.
  RAM FLOW and LINK NOISE stay flavor-shaped, as speced, with no false claim
  attached to either.
- **Augment cache.** `<Teach id="strain-chip" />`, `<Teach id="augment-draft"
  signals={{draftOffered: ...}} />`, and `<Teach id="boost-swap"
  signals={{swapOffered: ...}} />` are all mounted (report.tsx:639-641),
  wired to the identical `pickAugment` dispatch and swap-panel state machine
  as the old `ResultScreen`.

**Verdict: COVERED**, no new teaching needed, confirmed rather than assumed.
Cites ledger lines 85, 92-95, 102-104.

### (d) The leader-line teach callout form change (`kpos-teach-callout-v2`)

The item's own scope (re-anchoring eight existing CSS classes against new
window layouts, no trigger/copy change) is sound and unaffected by anything
found this cycle, with one update: the item's text explicitly keeps
`kp-teach-craft` (the `patch-craft` moment's anchor) on NIGHT.SYS,
"reskinned in place, not relocated." This gate's ruling on the SOLDER.BAY
question below retires that moment entirely, so `kp-teach-craft` is now an
orphaned anchor class with nothing mounted to it. Harmless to leave
unstyled; nothing points at it. The other seven anchor reassignments
(`readout`, `rows`, `draft`, `par`, `screen`, `patch`, `grid`) are
unaffected and stand as speced. **COVERED**, noted in the ledger's Open
work (line 306-310).

### (e) SOLDER.BAY: is the owed `solder-bay-intro` coachmark still owed?

**No. Retiring the recommendation, not merely declining to act on it again.**
Read `components/os/windows/solder.tsx` in full, since it now exists as a
real, shipped component the prior gate never had access to (SOLDER.BAY was
still a study when `pieceDragCarry` was first recommended). Two separate
questions, both resolved by direct code evidence:

**Is the drag gesture a "new input modality nothing rewards," as the prior
gate assumed?** No. `onSlotPointerMove` (solder.tsx:299-323) only arms a
drag `if ((e.pointerType === "mouse" || e.pointerType === "pen") && dist >
6)`; touch input never satisfies this and always falls through to the plain
`onClick`/`tapActivate` handler, the identical tap-to-select-then-CRAFT flow
every other interaction in this game already teaches and uses. Both paths
resolve through the same legality check and reach identical outcomes
(`fuseAt` on a legal pair, `rejectCancel` otherwise). Nothing is reachable
by drag that tap cannot also reach; drag is a strictly optional accelerator
over an already-complete, already-familiar verb. This fails the bar for even
a coachmark ("does this change what they should do?": no) let alone a beat.

**Does the outgrow rule (the actual thing the prior gate wanted taught) need
a coachmark?** No, and by a wide margin. `SolderContent`'s status line
states it verbatim, every single time a piece is picked up, for the life of
the save: `"PICK A PARTNER. THE WELD MUST OUTGROW BOTH."` (solder.tsx:36).
The `Schematic` component visually blinks exactly which arms a candidate
partner would add (the `arm-gain` styling, solder.tsx:82-118). The rack
marks any non-outgrowing partner dead and disabled
(`legalPartners`/`kp-slot-dead`, solder.tsx:155-159, 413-415), meaning a
player cannot select, drag onto, or drop on an illegal partner through the
shipped interface AT ALL. The specific risk the old `patch-craft` coachmark
warned about ("equal or smaller spends both pieces for nothing") cannot
actually be triggered by a player using the real interface. This is tier 0,
stronger than a coachmark could ever be (re-stated on every interaction,
never dismissed once and gone).

**Consequence beyond the direct question asked**: this finding does not
just clear `solder-bay-intro`, it also retires the EXISTING `patch-craft`
coachmark outright (see the ruling on the brief's third integration
question, directly below), since the same evidence that makes a NEW
coachmark unnecessary also makes the OLD one redundant.

**Verdict: no coachmark owed, on either question.** `MECHANIC_INVENTORY`
gains no `pieceDragCarry` entry. Full reasoning and the standing lesson in
`tutorial/ledger.md`'s waiver log ("pieceDragCarry, NOT ADDED", "boost-swap,
considered and kept" for the control case that was checked the same way and
kept).

---

## Integration facts (item 3 of the task)

### NIGHT.SYS's blind-buy signpost

Confirmed live and correct, not a plan: `components/os/windows/night.tsx`'s
patch row (lines 147-157) is already `<Btn label="BUY BLIND: SEE
DARKNET.LNK" variant="ghost" onClick={onOpenDarknet} />`, dispatching
nothing itself; `components/os/windows/darknet.tsx`'s own `BUY BLIND ({cost}
cr)` button (lines 42-52) is the one that dispatches `buyDarkPatch`, with
the cost, a hatch bar, and the live balance all in the same row
(`kp-darknet-row`). The `night-shop` coachmark's shipped copy ("DARKNET.LNK
sells one blind pull, price climbing by the day") was already forward-
compatible with this exact behavior; no rewrite needed. This also widens
the `credits` waiver's confirmed scope to include DARKNET.LNK, now a real
transactional surface for the first time. **COVERED**, ledger lines 99, 105
(waiver log 136-145).

### The `patch-craft` moment's anchor

Resolved above under (e): not relocated to a new `solder` surface as the
brief's own framing anticipated, but retired entirely, since direct
inspection of the shipped bench found its rule taught better at tier 0 than
any coachmark placement could achieve. This also surfaced a live defect the
relocation framing would have quietly worked around rather than fixed: the
coachmark's current mount (`night.tsx:199-208`, keyed to a live `craftReady`
signal) sits on a DIFFERENT window than the one with the actual crafting
interface (`solder.tsx`, which mounts no `<Teach>` at all). A player who
crafts mid-day in SOLDER.BAY, consuming their legal pair before NIGHT.SYS
next opens, could complete a full run without this coachmark ever firing.
Retiring it removes a moment that was simultaneously misplaced and made
redundant by superior always-on coverage. See `tutorial/ledger.md` waiver
log (208-234) for the full citation trail, and the `mechanic-waiver` and
`mechanic` items in `pipeline/proposals/tutorial-agent.json`.

Engine ask, pre-authorized, small: `TeachSurface` (`content/teaching.ts`)
gains a `"solder"` member and `WINDOW_SURFACES` (`dev/teach-sim.ts:54`)
gains `"solder"` alongside `loadout`/`desktop`/`tutorial`, purely so
`patchCraft`'s `firstContact` can name its real surface and be exempted from
the run-walk reachability check the same way the other window surfaces
already are. No new moment, anchor, or copy order rides on this.

---

## One more surface-changed waiver check, outside the named 12 items

The task's fourth instruction (check every existing waiver whose named
surface changed this cycle) covers more than the 12 items under direct
review, since `LOADOUT.CFG` is one of the four study windows this whole
integration arc is landing (`pipeline/BRIEF.md`'s own list: INBOX,
LOADOUT.CFG, SOLDER.BAY, REPAIR.LOG) even though no `ui-spec` item in the
CURRENT `ux-agent.json` targets it again this round (it landed under a
prior cycle's `kpos-loadout`). Read `components/os/windows/loadout.tsx`
directly rather than skip it because it is not one of the 12.

**Finding: `programTiers`'s citation is dead, but the mechanic is better
supported than before, not worse.** The waiver's original text cited the
old `KitScreen` header (`screens.tsx:359-364`, "tiers come from closed
days..."). That header does not exist anywhere in the shipped
`LoadoutContent`, confirmed directly: its replacement, a `DIVE KIT` status
readout, does not restate the fact in prose anywhere. But `LoadoutContent`'s
`ProgRow` (loadout.tsx:137-203) shows each program's live RANGE or WIDTH
number directly beside its TIER segment meter, every visit, for all three
programs, which demonstrates the fact this mechanic actually cares about (a
tier number correlates with a bigger output number) more concretely than
the old prose sentence ever did. **Re-cited, not broken**: filed a
`mechanic-waiver` item this cycle updating the citation. `kitConfig`, the
sibling mechanic the same dead header used to also back, is unaffected: its
TAUGHT status was never resting on that header alone, only partly (the
ledger's own standing "kitConfig: NOT a waiver" entry), and its actual
basis, the `modeLocked` tip, is confirmed still live on every locked mode
button in `ProgRow`'s `tipFor` (loadout.tsx:348, 365).

This is the same failure shape as `jobBoard`'s break (a plain-language
sentence a waiver depended on silently dropped when its window was
redesigned), landing on the safer side purely because a replacement fact
happened to exist nearby. Both are cited together in `tutorial/ledger.md`'s
Loop history as the same systemic pattern this cycle surfaced twice.

---

## `pipeline/proposals/narrative-director.json`: teaching implications only

Thirteen `inbox-subject`/`ui-copy` items reviewed for exactly one question
each: does any new label hide a cost or a state the player needs?

Twelve are clean. Costs are named inline wherever a number changes hands
(`{PLACE_COST} RAM` in the console hints, the darknet/night-patch/boost-bay
prices, all pre-existing live values, not new copy inventing a number). The
route-row and threat-banner replacements are addressed under (b) above. The
INTRUSION identity item is explicitly routed to the loremaster by its own
text; no teaching consequence either way, also addressed under (b).

**One real finding**: `ui-copy-dive-result-overlay`'s `newDiveButton`
("NEW DIVE" replacing the shipped small overlay's single "CONTINUE" label,
`duel.tsx:918`) is proposed as an unconditional replacement, but `duel.tsx`
uses that ONE button for all four dive outcomes today (win/core,
win/gridlock, loss/severed, loss/core). Relabeling all four "NEW DIVE" would
misstate two of them: a loss (there is no new dive, the run just ended, the
next screen is the run-end scene) and a win that closes the day's last
ticket (the next screen is NIGHT.SYS, not a dive). This is a label-accuracy
question in this seat's charter, the same shape as the `runReset` waiver's
prior finding about the ABANDON dialog's old inaccurate confirm text: a
control's face has to tell the truth about what pressing it does. `ui-spec`
`dive-overlay-continue-label-accuracy` filed this cycle: NEW DIVE only when
the result is a win with at least one ticket still open that day, CONTINUE
(accurate for all four cases, the existing safe default) otherwise. The
narrative-director's own notes on this item independently flagged the exact
same ambiguity ("whether removing... is an Orchestrator integration
decision, not a copy one"); this gate is answering that open question with
a concrete rule.

---

## Items filed this cycle

`pipeline/proposals/tutorial-agent.json` (brief `ui-integration-2026-07-29`):

- `ui-spec` `inbox-collapsed-row-parity`, restoring the `jobBoard` header
  sentence and the `threatTier` tip's list-view badge to INBOX's collapsed
  view.
- `ui-spec` `dive-overlay-continue-label-accuracy`, conditioning the dive
  overlay's NEW DIVE label on a win with a ticket remaining.
- `mechanic` (revision) plus `mechanic-waiver` `patchCraft`, retiring the
  `patch-craft` coachmark, waiving the mechanic to SOLDER.BAY's shipped
  tier-0 coverage, moving `firstContact` to the new `solder` surface.
- `mechanic-waiver` (re-citation) `programTiers`, same waiver, new
  citation, since the old one (KitScreen's header) no longer exists.
- `mechanic-waiver` (narrowing) `jobBoard`, stating plainly that the waiver
  does not currently hold, pending `inbox-collapsed-row-parity`.

No new coachmark this cycle, so no new copy order for a moment. One copy
order cancelled: `pipeline/copy/orders/copy-patch-craft.json`, status set to
`cancelled`, superseded by the `patch-craft` retirement; no further words
are owed on it.

---

## `tutorial/ledger.md` updates this cycle

Full rewrite of the Coverage table and Waiver log against direct code
evidence, not the prior entry's word. Net: seven mechanics graduated from a
stale `PLANNED` to their true current `TAUGHT`/`WAIVED` status
(`patchShapes`, `darkWebBuy`, `slotBuy`, `boostSlots`, `boostSwap`,
`patchDrop`, `gridlockChip`), five firing-correctness asterisks cleared
after direct re-confirmation (`cascade`, `ram`, `strainChip`, `credits`,
`runReset`), one waiver re-cited (`programTiers`), one waiver found broken
and narrowed (`jobBoard`, the most severe finding this cycle since
`teach-sim` cannot detect it), one coachmark retired in favor of a stronger
waiver (`patchCraft`), and one two-cycle-old gate recommendation overturned
rather than acted on (`pieceDragCarry`). Two items in "Flagged to other
seats" moved from open to resolved after direct re-confirmation
(`ram-upgrade-cap-parity`, `touch-safe-tooltips`), having already shipped
without the ledger catching up. Full reasoning, citations, and three
standing lessons recorded in the new Loop history entry.
