# Tutorial gate: day-is-the-run full audit (2026-08-19)

Scope: every mechanic in the shipped `MECHANIC_INVENTORY`
(`kernel-panic-site/app/src/game/content/teaching.ts`, 42 rows) plus a check
for anything the day-as-run rebuild introduced with no row at all. Read the
harness (`dev/teach-sim.ts`), the room (`components/scene/room-ui.tsx`,
`game-shell.tsx`), and the windows the waivers cite
(`windows/inbox.tsx`, `night.tsx`, `loadout.tsx`, `report.tsx`, `solder.tsx`,
`dadlog.tsx`, `journal.ts`, `content/story.ts`, `content/repairs.ts`,
`day-reducer.ts`, `duel.tsx`). `tutorial/ledger.md` was rewritten this cycle
to hold the current inventory; all citations below are to that new file.

**Verdict summary: 40 COVERED, 1 NEEDS-TEACHING (new mechanic ungated), 1
WAIVER-BROKEN (an existing waiver's cited copy is false on the live
surface, filed as a tier 0 fix rather than a new teaching moment).**

## Per-mechanic verdicts

The 42 rows below follow the ledger's own Coverage table order
(`tutorial/ledger.md:79-121`). Grouped for readability; every verdict cites
the ledger line that carries the finding.

### Opening dive (6): COVERED

rotate, flood, scan, defend, attack, telegraph. All six taught by the
tutorial beat ladder (`TUTORIAL_BEATS`), confirmed the ladder still opens on
rotation for every claim count the board generator can produce (0..
`MAX_OPENING_BUILT`), matching `teach-sim.ts`'s own assertion. No change.
`tutorial/ledger.md:83-88`.

### Duel-surface mechanics (7): COVERED

cascade, par, patchCellUse, patchShapes, ramCarry, diveLoss (see below,
separately verdicted), backroomOppOpens (see below, separately verdicted).
`cascade-bank`, `par-budget`, and `patch-cell-use` all confirmed mounted live
in `duel.tsx` (`Teach id=...` at the exact lines the ledger cites); the `par`
and `ram` tips confirmed rendered via `TapTip` on the dive dock.
`tutorial/ledger.md:89-92, 97`.

### diveLoss: WAIVER-BROKEN, urgent

**Verdict: the waiver's claim is false on the shipped surface.**
`tutorial/ledger.md:119`, full finding at `tutorial/ledger.md:202-217`
(Waiver log).

The `diveLoss` mechanic ("A lost dive bills no strain; the ticket goes home
unpaid") is marked WAIVED on the claim that "the dive's own CORE LOST overlay
states it the instant it happens." Read directly against
`components/game/duel.tsx`'s result overlay: the row

```
{state.phase !== "won" && (
  <div className="kp-datarow kp-datarow-plain dv-hazrow kp-datarow-warn">
    <span>NEURAL STRAIN</span>
    <em>ZEROED. THE RUN IS OVER.</em>
  </div>
)}
```

fires unconditionally on every loss, including an ordinary ticket loss.
`day-reducer.ts`'s `duelFinished` handler explicitly does the opposite for
that case (comment directly above the branch: "A loss bills no strain: the
loss already costs the ticket"; confirmed no strain field changes and the
day continues in the `"open"` phase). The room's own `LossToast`
(`scene/room-ui.tsx`) gets it right for the identical event: `"// CORE LOST.
NO CHARGE, NO STRAIN. _"`. So the player is told two contradictory things
about the same loss depending which surface they happen to read: the truth,
and a false claim that their run just ended.

This is leftover copy from the old per-run architecture, where a duel loss
really did end the run outright. It was never updated for the day-is-the-run
redesign, where losing a single ticket is a normal, frequent, survivable
outcome. `teach-sim` cannot catch this class of break: the waiver string in
`content/teaching.ts` never changed, the screen drifted out from under it.
Same shape as the prior `jobBoard` finding.

**This is not proposed as a new teaching moment.** The fix is making an
existing, already-relied-upon label true, which is strictly better than
teaching a player to distrust it. Filed as `ui-spec`
`dive-loss-overlay-strain-accuracy` in `pipeline/proposals/tutorial-agent.json`
(tier 0), addressed for Orchestrator/ux-agent integration into `duel.tsx`.

### backroomOppOpens: citation stale, substance holds

**Verdict: COVERED, citation corrected.** `tutorial/ledger.md:120`, full
finding at `tutorial/ledger.md:228-236`.

The waiver quoted "the IT IS MOVING turnlight." The live opp-turn status
line in `duel.tsx` now reads `"The intrusion is moving. Watch the line."`
(the INTRUSION rename, a loremaster call this seat does not re-litigate).
The underlying claim, that the player watches this line render before their
own first input on the only dive with `oppOpens: true`
(`content/tiers.ts`), still holds, confirmed live. No new item filed; the
ledger's own citation is corrected in place so this does not silently break
again the way `jobBoard` did.

### The room and the day-as-run's own new mechanics (10): COVERED

walkInteract, counterIntake, heldVsBanked, benchSit, closeBank, bustLoss,
sundayGate, repairsUnlock, salvageCurrency, deckSlots. All ten re-read
directly against the shipped room components this cycle, not carried over
from a proposal or a plan. Notably: `closeBank`'s and `sundayGate`'s waivers
quote `ROOM_COPY` strings and were checked character-for-character against
`content/story.ts`, both match verbatim. `tutorial/ledger.md:107-116, 118`.

### Windows and reference surfaces (10): COVERED

strainChip, manualRef, kitConfig, analyzeTell, threatTier, augmentDraft, ram,
nightPatch, darkWebBuy, diagDepth. All confirmed live in the window
components named in each row. `diagDepth`'s dead-row wording was checked in
both places it appears (`scene/room-ui.tsx`'s `IntakeDialog` and
`windows/inbox.tsx`) and is identical in both. `tutorial/ledger.md:93-96,
99-100, 122`.

### Long-standing waivers (9): COVERED, re-confirmed

reach2, turnCap, credits, programTiers, saveSlots, patchDrop, patchCraft,
augmentEffects, modeEffects. Re-read against the live components this cycle
rather than assumed from the prior (run-era) ledger entry; all nine hold
exactly as claimed. `patchCraft` specifically re-checked under the room
rebuild (SOLDER.BAY is now repair-gated and reached by walking, but the
bench component's own status line is unchanged). `tutorial/ledger.md:106,
117, 121, 123-124`.

## NEEDS-TEACHING: strainCarryover

**Mechanic, not previously in the inventory.** Full finding:
`tutorial/ledger.md:170-195`.

Neural Strain persists across days under the day-is-the-run design: sleeping
restores a flat +10 (`SLEEP_REGEN`, `day-reducer.ts`), a night patch restores
+12 for 60cr, and otherwise whatever strain a day closed at is what the next
day opens at, capped at 100. This is a structural break from the old
per-run design (full reset each run) and is the central resource tension the
evening's own economy (repair vs. patch vs. do nothing) is built around.

**Why this is a gap and not already covered:** the only player-facing
statement of it is a `MORNING_LINES` flavor line gated to the SECOND Tuesday
of play at the earliest (`morningLine()`'s own `pool[week % pool.length]`
cycling, verified directly against `content/story.ts`: Tuesday's pool index
1 cannot render before day 9). `strainChip`'s existing coverage is scoped
to "today" and, read alone, does not rule out a fresh start tomorrow.

**Tier decision, worked through the ladder in order:**

1. *Can the interface just say it?* Partially, and it already does for the
   NUMBER: NIGHT.SYS's strain block persistently shows `"SLEEP RESTORES
   +10"` (`windows/night.tsx`), unconditionally, every evening. That is
   adequate tier 0/1 coverage for the regen figure itself; not proposing a
   ui-spec for it.
2. *Will the player want this information again?* The number, yes (already
   covered per above). The RULE itself ("it does not reset on its own") is a
   one-time realization that reframes every evening from the moment it
   lands, not something to re-read.
3. *Is it a rule that changes what they should do, needed once, at a
   specific moment?* Yes: exactly the coachmark case. The first evening
   where strain sits below the cap is the moment it starts mattering.

**Proposed fix, tier 2:** new `teaching-moment` `strain-carryover-notice` on
the `"evening"` surface, conditional (not firstSight) on strain actually
being short, so it fires at the first evening where it is true rather than
unconditionally on day one. This needs one new `TeachWhen` union member,
`"strainShort"`; the signal itself is a one-line read of `day.strain < 100`
at the `NightContent` call site, no reducer change. Full item in
`pipeline/proposals/tutorial-agent.json`; copy order filed at
`pipeline/copy/orders/strain-carryover-notice.json` (words owed to the
narrative-director, not written here).

Anchor: a new anchor string, `"strain"`, distinct from `night-shop`'s
existing `"patch"` anchor, so the callout can sit near NIGHT.SYS's strain
block rather than its buy rows. This is an existing-system anchor (the
`kp-teach-<anchor>` CSS class vocabulary already in use), not new teaching
UI, so no `ui-spec` is needed for it; the Orchestrator adds the matching CSS
position the same way every other anchor was added.

Evening's `firstSight` budget is unaffected (still 1 of 2, `night-shop`);
this moment is conditional and does not count against the cap.

## Reviewed and ruled no gap (not new inventory rows)

Checked seven candidates named in the brief against the shipped code
directly, not assumed. All seven ruled COVERED, with the specific reasoning
recorded in the ledger rather than asserted: the prompt marker, click-to-move,
the customer walking out on decline, Sunday's scene cadence, the room HUD's
HELD chip, sector playbacks, and DAD.VOL artifacts surfacing at objects.
Also reviewed LEDGER.LOG (new window this cycle) and ruled it a pure
reference surface needing no mechanic row, same shape as MANUAL.TXT, with a
note in Open Work that its actual claims have not yet been line-audited.
Full reasoning: `tutorial/ledger.md:126-168`.

## Opening dive discipline

Confirmed unchanged: `CORE_VERBS` in `teach-sim.ts` still names exactly
rotate/scan/defend/attack, the tutorial ladder still answers every reachable
state, and no proposal this cycle adds anything to the opening dive.
`notBeforeDay` gating still holds day 0 clear of coachmarks by construction.

## Surface-load discipline

No surface exceeds the two-unconditional-callout cap. `result` sits at its
cap (`strain-chip`, `held-banked`, both firstSight); every other surface has
room. The new `strain-carryover-notice` moment is conditional, so it does not
push `evening` over its own cap. No fold-together action needed this cycle.

## Items filed

- `pipeline/proposals/tutorial-agent.json`: one `mechanic` (`strainCarryover`),
  one `teaching-moment` (`strain-carryover-notice`), one `ui-spec`
  (`dive-loss-overlay-strain-accuracy`).
- `pipeline/copy/orders/strain-carryover-notice.json`: copy order for the
  new coachmark, addressed to the narrative-director.
- `tutorial/ledger.md`: full rewrite of the Coverage table and Waiver log
  against the shipped day-is-the-run surface; old run-era material compressed
  into an "Archived: run era" section rather than deleted (never-cleared
  rule), with its standing lessons carried forward explicitly.
