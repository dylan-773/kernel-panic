---
name: ruling-21-artifact-channels
description: a repair's required "beat of Dad" can arrive via DAD.VOL entry, recovered sector, or the station's own firstRead vignette; firstRead is currently keyed per station, which breaks multi-stage stations
metadata:
  type: project
---

`vault/60-story/rulings/ruling-21-artifact-payload-channels.md` (added 2026-08-19 by the
loremaster gate on the day-is-the-run integration) settled a gap in
`vault/20-mechanics/repairs-and-unlocks.md`'s requirement that every repair carry "an
artifact... in his handwriting": the payload may land through any of three channels, and
one is sufficient:

1. A DAD.VOL journal entry (`journal.ts`, `JOURNAL_ENTRIES`).
2. A recovered sector (`story.ts`, `SECTOR_SCENES`, one of the seven findable fragments;
   8 and 9 are permanently withheld per ruling 3).
3. The repair station's own `firstRead` vignette in `REPAIR_STATION_COPY`, if it carries
   a genuine beat of Dad rather than pure mechanical flavor text.

**Why this matters for future proposals:** `REPAIR_STATION_COPY.firstRead` in
`kernel-panic-site/app/src/game/content/story.ts` is keyed by *station*
(`RepairDef["station"]`), not by the specific `RepairId`. That's harmless for
single-stage stations but breaks multi-stage ones: `diagBench` has three repair stages
(`diagBench1/2/3`) sharing one `firstRead` array, so stages 2 and 3 both replayed stage
1's "sealed envelope... Filed to DAD.VOL" text, which is false on replay (nothing new is
filed at stage 2 or 3) and left the 480 CR stage 3 repair with *no* beat of Dad at all,
the exact thing ruling 21 forbids ("a repair carrying none of the three... is an upgrade,
not a repair").

**How to apply:** before proposing new repair-station copy, check whether the station is
multi-stage. If so, don't reuse one `firstRead` block across stages; write distinct text
per `RepairId` and flag in `notes` that the Orchestrator needs to re-key `firstRead` from
per-station to per-RepairId (an engine/data-shape change, not narrative-director's lane,
but worth naming so it doesn't get missed again). See [[proposal-envelope-mandatory]] for
how to package that flag inside the standard envelope.
