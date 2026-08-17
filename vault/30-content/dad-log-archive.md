---
title: DAD.LOG archive
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[ruling-12-dad-log-reframe]]", "[[reveal-schedule]]", "[[dad-log-window]]"]
---

# DAD.LOG archive

> [!info] Source
> `content/journal.ts:JOURNAL_ENTRIES`, ten entries; `DADLOG_CHROME`, `visibleJournal(meta)`.

**Not a diary the player keeps.** An archive reader over DAD.VOL, [[dad]]'s own read-only recovered volume, mounted and read file by file, one more file pieced back with every repair the player makes. See [[ruling-12-dad-log-reframe]].

```ts
{ id, unlockAtRepair, requiresOpened?, kind: "note"|"bill"|"memo",
  filename, doctype, provenance, title, body: string[], benchNote? }
```

## The ten files

> [!warning] The unlock column is being re-authored
> Every row below was keyed to a run number. The triggers shown are the proposed repairs, and the full mapping is [[repairs-and-unlocks]]. One is still unassigned. The order of the rows is not a sequence and the writing must not assume one.

| Trigger | File | Doctype | Title | Provenance |
|---|---|---|---|---|
| start | `WILL.SCN` | SCAN | [[entry-will\|THE WILL]] | scanned paper, taped inside the register, folded in four |
| start | `TICKET_QUERY.LOG` | LOG | [[entry-backroom\|THE BACK ROOM]] | shop system query, bench terminal, day one |
| first attempt | `SESSION_001.LOG` | LOG | [[entry-first-session\|IT SHUT THE DOOR]] | tower telemetry, first dive |
| the bench drawer | `NOTICE_07.SCN` | SCAN | [[entry-bills\|FINAL NOTICE]] | scanned paper, bottom drawer, one of eleven filed under W |
| the solder bay | `FRAGMENT_03.REC` | FRAG | [[entry-solder\|SOLDER SMOKE]] | partial recovery, surfaced while rebuilding the bay |
| storage and shelving | `RECEIPTS.SCN` | SCAN | [[entry-receipts\|RECEIPTS]] | scanned paper, shoebox, pharmacy on 9th, six years of stubs |
| to be assigned | `CONSULT_SUMMARY.SCN` | SCAN | [[entry-diagnosis\|THE DIAGNOSIS]] | scanned paper, sealed envelope, never opened until now |
| the ledger terminal | `LEDGER_XREF.QRY` | QUERY | [[entry-notickets\|NO TICKETS]] | ledger cross reference, run twice to be sure |
| the drive recovery rig | `SESSION_SUMMARY.LOG` | LOG | [[entry-grading\|IT IS GRADING ME]] | tower telemetry, aggregate, every session logged |
| a win | `PATCH.SYS` | SYS | [[entry-patch\|PATCH]] | full volume unlocked, recovered whole, the morning after |

Locked entries render as `doctype: DAMAGED`, title `????`, provenance "partial recovery, more passes needed".

That fiction gets better under the new key, not worse. A recovery pass used to be an abstraction over failing; it is now literally true, because the player fixed the drive rig, or cleared the shelf, or repaired the bench the thing was sitting under.

## Three kinds of artifact

- **note** - papers. The will, and PATCH.
- **bill** - paperwork from institutions. The notices, the receipts, the consult summary.
- **memo** - machine output. Queries and telemetry.

The mix matters: the story arrives as **documents that already existed**, not as narration. A clinic's billing system and a shop's ledger tell the truth accidentally, because that is all they can do.

## The two voices

Per [[ruling-12-dad-log-reframe]]:

- The **artifact body** prints only what its own diegetic source could plausibly print.
- The **bench annotation** carries the player's inference, comparison or reaction, typographically subordinate, never sharing the artifact's treatment.

An artifact that draws a conclusion is a canon violation.

## Provenance is a ruling

Telemetry about the player's own current dives sits on the same volume as Dad's historical papers, because it is the same machine and the only drive it has. That is legitimate and ruled. What is forbidden is attributing that telemetry to Dad's authorship. See [[ruling-13-dad-vol-provenance]].

## See also

- [[dad-log-window]] - the reader
- [[reveal-schedule]] - the ceiling every entry sits under
- [[repairs-and-unlocks]] - what turns each one up
