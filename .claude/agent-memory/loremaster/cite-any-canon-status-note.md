---
name: cite-any-canon-status-note
description: gate REVISE citations can quote any vault note carrying status:canon, not only the four headline files
metadata:
  type: feedback
---

When gating shipped copy, a REVISE citation does not have to come from `ground-truth.md`,
`reveal-schedule.md`, `canon-rulings.md`, or the numbered `rulings/*.md` files. Any vault note
marked `status: canon` that describes a specific artifact's allowed content is binding and
citable, most often the per-entry notes under `vault/30-content/journal/entry-*.md` (each one
documents its own "knowledge ceiling" for that specific journal artifact, e.g. `entry-bills.md`:
"This may surface the illness as mystery only. A billing system prints a balance and a service
class; it does not print a diagnosis.").

**Why:** on the 2026-08-18 redesign copy gate, the strongest and most precise finding (a diagnosis
code leaking into the wrong journal entry) rested entirely on `entry-bills.md`, a `30-content`
note, not on `reveal-schedule.md`'s eight numbered prohibitions. The Orchestrator accepted and
fixed all three findings from that gate without pushback, including this one, confirming the
citation was treated as real canon.

**How to apply:** when gating, read not just [[2026-08-16-redesign]]'s headline files but the
specific `entry-*.md` / character / mechanic notes that describe the exact artifact or scene under
review. Their "knowledge ceiling", "forbids", or design-rationale sections are gate-grade citations
even when the note's own status line says `draft` for the broader topic, as long as the specific
clause being cited is written as settled fact rather than an open question.
