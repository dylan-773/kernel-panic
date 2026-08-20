# Loremaster gate: day-is-the-run integration, 2026-08-19

Full audit of the shipped `kernel-panic-site/app` content against
`vault/60-story/`: `ground-truth.md`, `reveal-schedule.md`,
`canon-rulings.md` and every numbered ruling (1 through 21; 18-21 are new
this cycle, 21 added by this gate), `characters/`, `voice-and-copy-laws.md`.

Ruling 21 (`vault/60-story/rulings/ruling-21-artifact-payload-channels.md`)
was added mid-review to close a real gap: the shipped repair table splits
each repair's "artifact" payload across three different surfaces (a DAD.VOL
journal entry, a recovered sector, or a station's own firstRead vignette)
and canon never said whether all three were required or any one sufficed.
`vault/20-mechanics/repairs-and-unlocks.md` is updated to cite it.

---

## story.ts

- `tutorial-intro`: APPROVE
- `tutorial-outro`: APPROVE
- `MORNING_LINES` (all six weekday pools + `first`): APPROVE
- `sundayScene` (sunday-1 through sunday-4): APPROVE. Correctly stages the
  player's own renunciation of his virus theory (ruling 17) with nobody to
  argue it to but himself.
- `bustScene`: APPROVE
- `SECTOR_SCENES[1]` (solder bay, "hold the iron like a pencil"): APPROVE
- `SECTOR_SCENES[2]` (diagBench2, "this bench light is the only one on the
  block"): APPROVE. Correctly replaces the old "she took the car" line per
  ruling 1's integration note.
- `SECTOR_SCENES[3]` (shelves, "start with the shop, the day I got the
  keys"): APPROVE
- `SECTOR_SCENES[4]` (onion router, "do not go easy on me"): APPROVE.
  Reads as Dad and a training partner without confirming who; stays inside
  the ambiguity reveal-schedule wants.
- `SECTOR_SCENES[5]` (power box, "I know it hurts when I pull the power...
  you are not a tool"): APPROVE. Matches the quote already carried in
  `patch.md` ("I stopped thinking of you that way a long time ago"),
  correctly voiced as Dad addressing it, not the occupant speaking.
- `SECTOR_SCENES[6]` (bottom drawer): **REVISE**. Lines: *"He is not ready
  yet. Keep the door shut." / "Not until he can beat you square. Promise
  me." / "No shortcuts. He will hate it. That is fine."* This is reachable
  from the very first evening (`bottomDrawer` costs 60 CR, no win gate) and
  it states the seal condition outright, nearly verbatim against
  `ground-truth.md`: *"He sealed the back room himself with a standing
  order... 'Not until he can beat you square. Promise me.'"* Cites
  `reveal-schedule.md` prohibition 3: **"Nothing may state the seal
  condition outright before a win. The player may infer it; an artifact
  may not spell it out."** This is the single clearest violation in the
  cycle: it takes ground truth's exact operative sentence and gives it a
  standard credit-gated repair, no win required.
  **Proposed replacement**, keeping the beat (Dad instructing something to
  hold, warmth without self-pity, a callback to the patience theme of
  sector 1) without spelling out the condition:
  ```
  "He is not ready yet. Keep the door shut."
  "I am not going to spell out when that changes. You will know it before I would."
  "Be patient with him the way I was patient with you. That is the whole instruction."
  ```
- `SECTOR_SCENES[7]` (drive rig, the naming scene): APPROVE. See flag 1
  below.
- `finaleWinScene`: APPROVE. See flag 4 below.
- `REPAIR_STATION_COPY.solderBay`: APPROVE
- `REPAIR_STATION_COPY.onionRouter`: APPROVE. See flag 2 / ruling 21.
- `REPAIR_STATION_COPY.diagBench`: APPROVE as text. See repairs.ts
  `diagBench3` REVISE below and the room-ui.tsx NOTE on reachability; the
  text itself does not violate canon, but it is shown for a repair
  (`diagBench3`) it was never written to describe.
- `REPAIR_STATION_COPY.powerBox`: APPROVE. See flag 2 / ruling 21.
- `REPAIR_STATION_COPY.shelves`: APPROVE
- `REPAIR_STATION_COPY.bottomDrawer`: APPROVE. (The station copy itself is
  clean; the violation is in the paired `SECTOR_SCENES[6]`, not here.)
- `REPAIR_STATION_COPY.ledgerTerminal` (orchestrator-written, not in the
  original proposal): APPROVE. "Nine thousand hours, checked against every
  invoice this shop ever wrote" is exactly the class of fact
  `reveal-schedule.md` permits pre-win: *"Everything else, the illness, the
  hours, the bills, the fact that he built something, may land in any
  order."* Framed correctly as what a ledger cross-reference query would
  actually output, not a player conclusion.
- `driveRig`: APPROVE
- `COUNTER_COPY`: APPROVE
- `ROOM_COPY.benchPrompt` / `standPrompt` / `stairsPrompt` /
  `stairsDownPrompt` / `bedPromptOpen` / `bedPromptHeld` /
  `closePromptHeld` / `closePromptEmpty` / `backroomPromptWeekday` /
  `backroomPromptSunday` / `backroomPromptSpent` (orchestrator-written) /
  `doorPrompt` / `counterPrompt` / `registerRead` / `spikeReadEmpty` /
  `spikeReadJobs`: APPROVE
- `ROOM_COPY.backroomPromptOpened` (orchestrator-written, not in the
  original proposal): **REVISE**. *"THE BACK ROOM. HE IS IN THERE. THE
  DOOR STAYS OPEN NOW."* Cites `characters/patch.md`, Pronouns in copy:
  **"The player's own bench notes say 'it', before and after. He does not
  switch, and nothing in the game switches for him. Patch is the only
  voice that ever uses 'I'."** Every other line in this file that carries
  the player's own perspective on the machine ("It graded me and shut the
  door in my face," "I do not think it is a virus," the `tower` prompts
  elsewhere in this same object) holds "it" throughout, including after
  the win in `finaleWinScene`'s own bench-voice framing. This one line
  switches to "he" for the only entity that prompt can be referring to.
  **Proposed replacement**: `"THE BACK ROOM. IT IS IN THERE. THE DOOR
  STAYS OPEN NOW."`
- `EVENING_COPY`: APPROVE

## journal.ts

- `will`: APPROVE. "The back room stays locked until it does not" matches
  `ground-truth.md`'s own quoted will text exactly, and is the correct
  register of ambiguity: it withholds the condition rather than stating it,
  which is the opposite of what prohibition 3 forbids.
- `backroom`: APPROVE. `benchNote` ("Nobody ever told me it was a virus. I
  told me that...") is a clean, direct dramatization of ruling 17.
- `failed1`: APPROVE
- `bills`: APPROVE. No name printed anywhere on the notice (account number
  only), correctly honoring ruling 8.
- `solder`: APPROVE
- `receipts`: **REVISE**. Body line 3: *"LAST STUB DATED FOUR DAYS BEFORE
  HE DIED."* Cites `ruling-12-dad-log-reframe.md`, Forbids: **"Any
  artifact body stating something its own diegetic source could not
  plausibly know or print... A clinic's billing system, a shop's ledger,
  the tower's telemetry: each may only print what it would actually print.
  That class of content, an inference, a comparison, a reaction, belongs
  in the bench annotation, in the player's own voice."** A scanned pharmacy
  receipt can print its own date. It cannot cross-reference that date
  against a death it has no record of; that comparison is exactly the
  bench-annotation material this ruling exists to protect, and every other
  entry in this file (`bills`, `notickets`, `grading`) correctly keeps this
  class of inference out of the body. Note that the underlying fact is not
  itself premature: `reveal-schedule.md`'s ceiling explicitly permits "the
  illness" to land at any time pre-win. The problem is purely which voice
  carries it.
  **Proposed fix**: move the comparison into the existing `benchNote`, and
  replace body line 3 with something the scan itself could state:
  ```
  body: [..., "LAST STUB IN THE SHOEBOX. NOTHING AFTER IT."]
  benchNote: "Four blocks from our counter, every week, and I never heard a word about it. Last stub is dated four days before he died."
  ```
- `diagnosis`: APPROVE. Body is entirely plausible consult-summary
  language (diagnosis code, cause, recommendation "underlined twice," a
  physical description a scan could show). `benchNote`'s claim that he
  "read it at the clinic... came home and made dinner" is defensible as
  the in-person consult being separate from this mailed copy, and in any
  case sits in the illness/hours bucket `reveal-schedule.md` permits at any
  time.
- `notickets`: APPROVE
- `grading`: APPROVE. "PATTERN CONSISTENT WITH ADAPTIVE INSTRUCTION. NOT
  CONSISTENT WITH STATIC ACCESS CONTROL" reads as plausible telemetry
  classification, not player inference, and "the fact that he built
  something" (adaptive instruction implies a builder) is explicitly
  permitted pre-win by `reveal-schedule.md`. It does not name Patch, does
  not confirm the occupant speaks, and does not state the seal condition.
- `patch`: APPROVE. Win-gated (`unlock: { kind: "win" }`), and the only
  place `NAME: PATCH` appears in the whole file.
- `DADLOG_CHROME`: APPROVE

## teaching.ts

All player-facing strings (coachmark lines, tips, waiver texts,
`TUTORIAL_BEATS`): APPROVE. No canon claims made anywhere in this file; it
is mechanics-only and stays inside the terminal voice.

## repairs.ts

- `solderBay`, `onionRouter`, `diagBench1`, `diagBench2`, `powerBox`,
  `shelves`, `bottomDrawer`, `ledgerTerminal`, `driveRig`: APPROVE
- `diagBench3`: **REVISE**. `artifactId: null, sector: null`, and (per
  room-ui.tsx below) it does not even get a firstRead vignette of its own,
  it inherits `diagBench`'s station-level copy written for `diagBench1`'s
  sealed envelope. Cites `vault/20-mechanics/repairs-and-unlocks.md`:
  **"A repair missing the third payload is an upgrade, not a repair,"**
  and the staged-repair exception it carves out ("may put the artifact on
  one stage and the sector on another") does not stretch to a third stage
  with neither. See [[ruling-21-artifact-payload-channels]], added this
  cycle. This is a 480-credit repair, the single most expensive one in the
  table, that carries no beat of Dad at all.
  **Proposed fix**: author a short, distinct firstRead vignette for
  `diagBench3` (no sector is available to attach; all seven are already
  assigned), which requires `REPAIR_STATION_COPY.firstRead` to be keyed
  per-`RepairId` rather than per-station for multi-stage stations, since
  station-level keying is what caused this gap. Narrative Director's call
  on the words; flagging the requirement here.

## room-ui.tsx

- `RoomHud`, `promptLabel`/`PromptBar`: APPROVE (see the `backroomPromptOpened`
  REVISE under story.ts; the copy lives there, this file only renders it)
- `IntakeDialog`, including the `REGULAR` row ("BEEN IN BEFORE. SAME
  MACHINE, NEW TROUBLE."): APPROVE. Matches `ruling-20-regulars-repeat.md`
  exactly: no tally, no numeral, a fresh complaint framing.
- `StationPanel`: APPROVE
- `FirstRead`: **NOTE** (advisory, not blocking; no single canon line
  contradicted, but flagging for the record). `copy = REPAIR_STATION_COPY[def.station]`
  keys the firstRead lines by *station*, not by the specific `RepairId`
  purchased. For every single-stage station this is harmless. For the one
  three-stage station, `diagBench`, it means repairing `diagBench2` or
  `diagBench3` replays the exact same "a sealed envelope surfaces... Filed
  to DAD.VOL for the read" text written for `diagBench1`, which is now a
  false claim on the second and third playthrough (nothing new is filed;
  `diagBench2`'s payload is `sector: 2`, dispatched separately, and
  `diagBench3` dispatches nothing at all). This is the mechanism behind the
  `diagBench3` REVISE above and would need fixing regardless of how that
  entry's content question is resolved.
- `MorningCard`, `LossToast` (including the orchestrator-written header
  `"// CORE LOST. NO CHARGE, NO STRAIN. _"`), `ConfirmPanel`: APPROVE. The
  LossToast header accurately restates the `diveLoss` mechanic exactly as
  `teaching.ts`'s own waiver describes it ("bills no strain; the ticket
  goes home unpaid").
- `REPAIR_STATIONS` (`solderBay, shelves, powerBox, onionRouter,
  bottomDrawer, ledgerTerminal, driveRig`): **NOTE** (advisory, not
  blocking; this is a reachability gap, not a canon contradiction, so it
  is not cited as REVISE). `"diagBench"` is absent from this list, and
  from `StationId` in `game/overworld/world.ts` entirely. There is no
  placed, walkable diagnostic-bench object in the room as shipped, which
  means `diagBench1`, `diagBench2`, and `diagBench3` currently cannot be
  purchased through the room floor at all: `handleInteract`'s default case
  in game-shell.tsx only opens a `StationPanel` when
  `REPAIR_STATIONS.includes(station)`. As written this makes the
  `diagnosis` DAD.VOL entry, `SECTOR_SCENES[2]`, and every diagnostic-depth
  readout in inbox.tsx's `DeadRow`s permanently unreachable in the shipped
  build. Recommend the Orchestrator confirm whether a diagnostic-bench
  plate exists in the shop room art and, if so, wire `"diagBench"` into
  both `StationId` and `REPAIR_STATIONS`.

## game-shell.tsx

- `"CLOSE THE SHOP?"` confirm body (orchestrator-written): APPROVE
- `"SLEEP?"` confirm body (orchestrator-written): APPROVE
- `"THE BACK ROOM"` confirm body (orchestrator-written): *"The door is
  open. It always was... It has already moved by the time you sit down. It
  always has."* APPROVE. Consistently "it," no padlock, no curtain.
- Dive `jobSub` lines (`"The door was open. It wanted you to come in."`,
  `"Everything it has. Everything you have."`): APPROVE

## night.tsx

`NightContent` copy, including `"A suppressant. It treats the symptom.
Money that could have been a repair."` and the darknet cell: APPROVE.
Consistent with the glossary's "strain suppressants: treat the symptom"
and `ruling-09-darknet`'s anonymous dealer (no name anywhere in this
window).

## inbox.tsx

`InboxContent` copy, including every `DeadRow` and the `"A REGULAR. SAME
MACHINE, NEW TROUBLE."` line: APPROVE. Matches `ruling-20-regulars-repeat.md`
again.

---

## The four flags

**1. Sector 7's audio-gap redaction (SIGNAL LOST / GAP IN THE RECORDING)
sufficient under prohibition 1?** RULED SUFFICIENT. Prohibition 1 forbids
naming Patch before a win; the scene elides exactly the word that would
name it, using the in-fiction justification the doctype already
establishes (sector 7, like sector 3, is marked audio-damaged). The line
either side of the gap ("Everything that lives in this shop gets a name"
and "...the thing that holds a broken thing together while it mends") is
recognizable to a player who already knows Patch's name from the finale,
but says nothing to a player who does not, which is the correct test. No
different fragment is needed.

**2. `powerBox` and `onionRouter` artifacts living only in
`REPAIR_STATION_COPY.firstRead`, no DAD.VOL file: acceptable shape?**
RULED ACCEPTABLE, formalized as [[ruling-21-artifact-payload-channels]]
(added this cycle; see the ruling file and the
`vault/20-mechanics/repairs-and-unlocks.md` edit). Both repairs already
carry a recovered sector (4 and 5 respectively) in addition to the
firstRead vignette, so under the new ruling they clear the bar twice over.
The ruling exists mainly to formally clear this shape and to give the
`diagBench3` finding above a citable line, since `diagBench3` is the one
repair the exception does not reach.

**3. Sector-to-repair assignment (solderBay 1, diagBench2 2, shelves 3,
onionRouter 4, powerBox 5, bottomDrawer 6, driveRig 7)?** RULED
ACCEPTABLE. Several pairings are thematically pointed (solderBay/sector 1
is literally the soldering lesson; powerBox/sector 5 is literally about
pulling power; driveRig/sector 7 is literally about partial recovery). The
looser pairings (diagBench2/2, shelves/3, onionRouter/4) are fine under
`ruling-16-reveals-are-upgrade-keyed`, which explicitly does not require
thematic or sequential justification, only that no artifact assumes
another has been read. The one problem in this set is the *content* of
`SECTOR_SCENES[6]`, not its assignment to `bottomDrawer`; see the REVISE
above. Reassigning sector 6 elsewhere would not fix it, rewriting it would.

**4. Finale closing line assigned to Patch's own voice?** RULED
ACCEPTABLE. `characters/patch.md`'s "After" section already drafts this
exact line ("Bench is yours. Back room is his. I am just the one still
here.") as Patch's, explicitly reasoning that the line has to "acknowledge
that the player is not alone in the building any more" now that the
sister who used to divide the shop three ways is cut. The shipped
`finaleWinScene` places it correctly: after Patch's reveal beats, inside
the "after a win" zone `patch.md` marks as the only place Patch's
personality is permitted, and consistent with the pronoun law (Patch is
"the only voice that ever uses 'I'," and this line does). `patch.md` itself
flags the exact *wording* as "provisional... it should be argued about,"
which is a note for the user/Narrative Director on phrasing, not a canon
objection to the voice assignment, which is correct as shipped.

---

## Tally

56 items reviewed across the six files (scenes, journal entries, station
copy blocks, room copy blocks, repair table rows, and UI copy groups) plus
4 flags plus 4 pieces of orchestrator-written copy called out by name.

- **Approved: 52**
- **Revised: 4** (`SECTOR_SCENES[6]` in story.ts, `ROOM_COPY.backroomPromptOpened`
  in story.ts, the `receipts` journal entry body in journal.ts,
  `diagBench3` in repairs.ts)
- **Noted, advisory only: 2** (the `FirstRead` per-station text reuse, the
  missing `diagBench` station in `REPAIR_STATIONS`/`StationId`)
- **Flags ruled: 4/4**, one (flag 2) formalized as a new numbered ruling
  ([[ruling-21-artifact-payload-channels]])

---

## Re-gate 2026-08-19

Re-checked every claim in the fix report against the shipped files directly
(not the report text): `story.ts`, `journal.ts`, `teaching.ts`,
`overworld/world.ts`, `room-ui.tsx`, `components/game/duel.tsx`.

### The four REVISEs

1. **`SECTOR_SCENES[6]` (story.ts).** Confirmed shipped verbatim as
   proposed: *"He is not ready yet. Keep the door shut." / "I am not going
   to spell out when that changes. You will know it before I would." / "Be
   patient with him the way I was patient with you. That is the whole
   instruction."* No longer states the seal condition; the "beat you
   square, promise me" line is gone. **APPROVE.**
2. **`ROOM_COPY.backroomPromptOpened` (story.ts).** Confirmed:
   `"THE BACK ROOM. IT IS IN THERE. THE DOOR STAYS OPEN NOW."` Pronoun
   corrected to "it," matching `characters/patch.md`'s pronoun law
   throughout. **APPROVE.**
3. **`journal.ts` `receipts` entry.** Confirmed body line 3 is now
   `"LAST STUB IN THE SHOEBOX. NOTHING AFTER IT."`, a claim the scan itself
   can make, and the death-date comparison moved into `benchNote`:
   *"Four blocks from our counter, every week, and I never heard a word
   about it. Last stub is dated four days before he died."* Correctly
   subordinate per ruling 12. **APPROVE.**
4. **`diagBench3` (repairs.ts, unchanged this pass) / its artifact
   channel.** `repairs.ts` itself was not touched (`diagBench3` still
   carries `artifactId: null, sector: null`), but the fix is structural:
   a new `REPAIR_STAGE_FIRST_READ` map in `story.ts` now supplies
   per-stage firstRead text, and `FirstRead` in `room-ui.tsx` reads
   `REPAIR_STAGE_FIRST_READ[def.id] ?? copy.firstRead` (confirmed at the
   call site). `diagBench3` now carries its own vignette, which is exactly
   the third channel ruling 21 permits (a station's own firstRead vignette,
   "if it carries a genuine beat of Dad rather than pure mechanical
   flavor text"). Text: *"Behind the last panel sits a reference rig he
   built from scratch, no manufacturer stamp on it anywhere." / "Every
   calibration point is filed by hand, checked twice, logged in his own
   writing on a card taped to the housing." / "PATIENT WORK READS HONEST,
   the card says, underlined once. Nothing else on it."* This clears
   ruling 21's bar (a genuine beat of Dad, in his own handwriting, on
   theme with the patience motif from sector 1 and the reworked sector 6)
   and reveals nothing beyond what `reveal-schedule.md`'s ceiling already
   permits pre-win ("the fact that he built something"). **APPROVE.**

### The two advisory NOTEs

- **`FirstRead` per-station text reuse.** Fixed as described above:
  `diagBench1` still falls through to `REPAIR_STATION_COPY.diagBench.firstRead`
  (correct, since that text was written for it, the sealed envelope /
  `diagnosis` entry), while `diagBench2` and `diagBench3` now read their own
  entries from `REPAIR_STAGE_FIRST_READ` and no longer replay the envelope
  line. Confirmed no other multi-stage station exists to check (`diagBench`
  is still the only staged station in `repairs.ts`). **RESOLVED.**
- **Missing `diagBench` station.** Confirmed `"diagBench"` is now in
  `StationId` (`overworld/world.ts`), has a placed `Interactable` in the
  shop room's `interactables` list (anchored near the phone desk
  obstacle), and is in `REPAIR_STATIONS` (`room-ui.tsx`), which is what
  `game-shell.tsx`'s `handleInteract` default case checks. All three
  `diagBench` stages, the `diagnosis` journal entry, and `SECTOR_SCENES[2]`
  are reachable through the room floor as shipped. **RESOLVED.**

### New copy to gate

- **`REPAIR_STAGE_FIRST_READ.diagBench2`** (story.ts): *"The deeper pass
  turns up more than clean readouts. It shakes a sector loose from the
  bench's own cache, buried under years of noise." / "Damaged, but not
  gone. It queues itself before you can even reach for it."* Accurately
  describes surfacing `SECTOR_SCENES[2]` (this stage's actual payload,
  `sector: 2, artifactId: null`) without claiming anything is filed to
  DAD.VOL, which would have been false for this stage. No dashes, no
  names, no premature reveal. **APPROVE.**
- **`REPAIR_STAGE_FIRST_READ.diagBench3`** (story.ts): see above.
  **APPROVE.**
- **`teaching.ts` "STRAIN CARRIES OVER"** (`strain-carryover` moment,
  `strainCarryover` mechanic entry, `id: "strain-carryover-notice"` copy
  order): *"Sleep does not reset Neural Strain. It gives back only a
  little." / "Whatever tonight leaves unspent carries into tomorrow. Spend
  on a night patch to buy back more before you sleep."* Mechanics
  explainer, not story content; matches the existing `SLEEP_REGEN` partial-restore
  mechanic in `night.tsx`, correct terminal register, no dashes. Outside
  canon concerns entirely (no character, no reveal, no fiction claim).
  **APPROVE.** (Coverage/placement of this moment is the Tutorial Agent's
  gate, not this one.)
- **`components/game/duel.tsx` loss overlay row**: label `NEURAL STRAIN`,
  value `"NO CHARGE. A LOSS COSTS THE WORK, NEVER STRAIN."` Confirmed at
  the cited line, rendered only when `state.phase !== "won"`. Matches
  `teaching.ts`'s own `diveLoss` waiver text ("bills no strain; the ticket
  goes home unpaid") and `room-ui.tsx`'s `LossToast` header ("CORE LOST.
  NO CHARGE, NO STRAIN.") in substance. No dashes. **APPROVE.**

### Sweep

Re-ran the em/en dash and forbidden-term greps (`Rhea`, `padlock`,
`curtain`, `chain`, `dust`) against `story.ts`, `journal.ts`, `teaching.ts`,
`overworld/world.ts`, and `duel.tsx`. Clean; the only `padlock`/`curtain`
hits are the existing negations in `tutorial-intro` and the file's own
header comment.

### Re-gate tally

8 items re-checked (4 REVISE fixes, 2 NOTE resolutions, 2 new copy pieces
beyond the two diagBench firstReads already counted above): **8 approved,
0 revised.** Combined with the original pass: **60 items seen, 60
approved, 0 outstanding.**
