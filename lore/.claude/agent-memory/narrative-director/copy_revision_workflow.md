---
name: copy-revision-workflow
description: How to shape a proposal when the task is "rewrite this exact shipped line" rather than "add new story content" - validated approach from the 2026-07-25 canon-correction task.
metadata:
  type: feedback
---

When a task hands me exact shipped copy to replace (a specific line number,
an exact quoted string) rather than asking for new journal/scene content,
this shape worked without correction:

- Treat it as a copy-revision proposal: same envelope, same item types
  (`scene`, `journal`, `dayline`), but the `notes` field on each item states
  plainly which shipped id/line it replaces and which lines stay verbatim.
- For a `scene` item where only one line of one beat changes, still submit
  the FULL beats array for that scene (every beat, unchanged ones included)
  so the item is a valid drop-in replacement, not a diff fragment. Say in
  `notes` exactly which beat/line is the actual change, for the orchestrator
  and gate's benefit.
- When asked for candidates: give exactly two full variants per target, add
  `preferred: true/false` and a `rationale` string per item (these are
  additive fields beyond the strict contract schema; the envelope tolerates
  extra fields fine, no lint bounce). Rationale should name the specific
  craft tradeoff (tighter parallel structure vs more concrete imagery,
  understated vs more expository), not just restate the line.
- Do a repo-wide grep for the pattern being retired (e.g. "dust", the exact
  proper noun, the pronoun) before finalizing, to catch other shipped spots
  the task didn't name. Flag those as out-of-scope conflicts in the
  proposal's top-level `notes` rather than silently fixing or silently
  ignoring them. See [[flagged-followups-2026-07]] for the concrete example.
- No art order needed for a pure copy-revision pass that reuses existing
  stills/portraits and adds no new story beat.

This has not yet been explicitly confirmed by the user as "correct" beyond
completing without pushback; treat as a working default, not settled
doctrine, until reused successfully again.
