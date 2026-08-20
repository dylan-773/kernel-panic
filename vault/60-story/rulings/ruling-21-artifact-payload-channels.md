---
title: Ruling 21 - THE ARTIFACT PAYLOAD HAS THREE CHANNELS
status: canon
source: lore
owner: loremaster
updated: 2026-08-19
related: ["[[canon-rulings]]", "[[repairs-and-unlocks]]", "[[dad-log-archive]]"]
---

# Ruling 21 - THE ARTIFACT PAYLOAD HAS THREE CHANNELS

*Added 2026-08-19, Loremaster gate on the day-as-run integration cycle
(`loremaster-day-is-the-run-2026-08-19`). Ruled a gap the shipped repair
table exposed: [[repairs-and-unlocks]] requires every repair to carry "an
artifact... the lesson he taught you at that bench, in his handwriting," but
never says through which surface that artifact has to arrive.*

## What it decided

A repair's artifact payload may be delivered through any of three channels,
and the repair satisfies the law if it uses **at least one**:

1. **A DAD.VOL journal entry** ([[dad-log-archive]]), filed to the archive
   reader and re-readable there.
2. **A recovered sector** ([[ruling-03-sectors-8-and-9]]), one of the seven
   findable numbered fragments of Dad's own voice.
3. **The station's own firstRead vignette**, read once at the object, if it
   carries a genuine beat of Dad rather than pure mechanical flavor text.

None of the three outranks the others, and a repair may use more than one.
As shipped, [[the-shop]]'s onion router and power box carry their whole
artifact payload as a recovered sector plus a firstRead vignette, with no
journal file, and that is sufficient.

## Forbids

A repair carrying **none** of the three: mechanic and window only, no beat
of Dad anywhere. That is [[repairs-and-unlocks]]'s "upgrade, not a repair,"
and must be reconsidered before it ships.

## Permits

The shipped shape, where several of the ten repairs route their story
payload through a sector or a firstRead vignette rather than through DAD.VOL
specifically. This is what the day-as-run redesign's repair-keyed reveal
model was always going to produce once seven sectors and ten journal files
had to divide across more than seven repair stations.

## Integration

Closes the open question the gate cycle raised about `onionRouter` and
`powerBox` in `story.ts` having no matching `journal.ts` entry. Both pass
under this ruling. It does **not** rescue `diagBench3` in `repairs.ts`,
which carries neither a journal entry, nor a sector, nor a distinct
firstRead vignette (it currently reuses `diagBench`'s station-level copy,
written for `diagBench1`'s sealed envelope). See the gate verdict for the
citation.

## See also

- [[repairs-and-unlocks]] · [[dad-log-archive]] · [[canon-rulings]]
