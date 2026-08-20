---
name: 2026-08-19-day-is-the-run-gate
description: full-file gate on the integrated day-as-run build; four REVISEs found and all four fixed same-day, ruling 21 added, diagBench station wired up and reachability gap resolved
metadata:
  type: project
---

> **All clear as of the 2026-08-19 re-gate.** Every item below was fixed same-day and verified
> against shipped source (not just the fix report); see the "Re-gate 2026-08-19" section appended
> to `pipeline/gates/loremaster-day-is-the-run-2026-08-19.md`. Kept the detail below because the
> failure patterns are worth recognizing fast on the next content pass over this same story spine.

Ran the first full-file (not proposal-item) Loremaster gate on the integrated day-as-run build,
`pipeline/gates/loremaster-day-is-the-run-2026-08-19.md`. Audited `story.ts`, `journal.ts`,
`teaching.ts`, `repairs.ts`, `room-ui.tsx`, `game-shell.tsx`, `night.tsx`, `inbox.tsx` line by line
against every ruling. 56 items, 52 approved, 4 revised, 2 advisory notes.

**The four REVISEs, in case a follow-up gate needs to re-check them:**
1. `story.ts` `SECTOR_SCENES[6]` (bottom drawer, reachable pre-win, no gate at all) states the seal
   condition almost verbatim against `ground-truth.md` ("Not until he can beat you square. Promise
   me."). This was the clearest violation of the cycle: ground truth's own operative sentence,
   given to a 60-credit evening repair. Sectors are NOT win-gated, only the DAD.VOL entries and
   scenes carry any gating at all - this is worth checking first on any future pass, since it is
   the easiest way for a spoiler to leak (sector content reads as "safe" flavor but isn't ceiling-checked
   the way journal entries visibly are).
2. `story.ts` `ROOM_COPY.backroomPromptOpened` used "HE IS IN THERE" for Patch, post-win. The
   pronoun law (`characters/patch.md`) is absolute even after the win: the player's own voice never
   switches off "it" for Patch, ever. Watch for this specifically on POST-win copy, where authors
   reasonably assume the naming/personality restrictions have lifted and forget the pronoun one
   hasn't.
3. `journal.ts` `receipts` entry body stated "LAST STUB DATED FOUR DAYS BEFORE HE DIED" in the
   artifact body. Ruling 12 (artifact body vs bench annotation) is easy to violate specifically
   with date-comparison / cross-reference claims, because the underlying FACT is usually fine to
   reveal (reveal-schedule's ceiling permits "the illness" at any time) - the violation is only
   about which voice states it. When auditing DAD.VOL bodies, check every sentence for whether the
   artifact's own diegetic source (a receipt, a bill, a query) could compute that specific claim
   alone, not just whether the fact is spoiler-safe.
4. `repairs.ts` `diagBench3` (480 CR, the most expensive repair) has no artifactId, no sector, and
   (per room-ui.tsx) no distinct firstRead text of its own - it silently inherits `diagBench1`'s
   station-level copy. This exposed a real gap in `repairs-and-unlocks.md`'s three-payload law
   (never said which of journal/sector/firstRead satisfies it, or whether all three are needed),
   closed as [[ruling-21-artifact-payload-channels]].

**Structural finding, advisory only (no canon line to cite, so NOTE not REVISE):** `"diagBench"` is
entirely absent from `StationId` in `game/overworld/world.ts` and from `REPAIR_STATIONS` in
`room-ui.tsx`. As shipped, there is no walkable diagnostic-bench object in the room, so
`diagBench1/2/3` cannot currently be purchased at all through the floor - this makes the
`diagnosis` journal entry and sector 2 unreachable in practice, independent of the diagBench3 content
gap above. Worth checking on any future gate whether this got wired up.

**Process note:** `REPAIR_STATION_COPY[def.station]` keys firstRead text by physical station, not
by `RepairId`. Harmless for single-stage stations; for `diagBench`'s three stages it means stage 2
and 3 replay stage 1's "something surfaced, filed to DAD.VOL" text verbatim, which becomes a false
claim on repeat (nothing new is actually filed for those stages). Flagged as part of the
`diagBench3` finding, not a separate item.
