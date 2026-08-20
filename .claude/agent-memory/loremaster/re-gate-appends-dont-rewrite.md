---
name: re-gate-appends-dont-rewrite
description: when asked to re-check specific fixed items from a prior gate, append a dated re-gate section rather than rewriting the verdict file
metadata:
  type: feedback
---

When the Orchestrator applies fixes for a subset of REVISE findings and asks for a narrow
re-review of just those spots, append a new dated section (e.g. "## Re-gate: YYYY-MM-DD, the N
fixes only") to the bottom of the existing gate file instead of rewriting or replacing the
original verdict. Keep the original findings and their citations intact above it; the re-gate
section states scope explicitly (which items were re-checked, that nothing else in the file was
re-reviewed) and ends with a one-line overall verdict.

**Why:** the original gate file is the durable record of what was found and why; overwriting it
loses the paper trail of what changed between the first pass and the fix. This pattern was used on
the 2026-08-18 redesign copy gate (`pipeline/gates/loremaster-redesign-2026-08-18.md`) after the
Orchestrator fixed all three REVISE findings and asked for a targeted re-check.

**How to apply:** any time a coordinator/orchestrator message references "your REVISE findings"
and asks for a follow-up check on a named gate file, edit that same file with an appended section
rather than creating a new file or rewriting history.
