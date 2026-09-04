---
name: validation-file-gap-pattern
description: pipeline/validation/report.md has repeatedly failed to receive an agent's Write; verify the exact numbers you were told exist in the file before designing from them.
metadata:
  type: project
---

`pipeline/validation/report.md` has a recorded history (visible in its own text, deep-balance-2026-07-28
Checkpoints A and D) of the validation agent's Write not landing, requiring the Orchestrator to
re-verify numbers by direct harness run and land the entry by hand. On 2026-09-01 this recurred
from the consumer side: I was told a fresh validation summary (Day 3/5/Finale percentages, verdict
PASS WITH DRIFT) that does not appear anywhere in the file as it exists on disk (grepped for the
exact figures, zero matches; newest section on disk was still headed
`# Cycle ui-integration-2026-07-29`).

**Why:** my own design law is never to design from remembered or unverified numbers; the
validation file is supposed to be the single source, per [[balance-history]]. When the file and
the session's word disagree, CLAUDE.md's ground-truth ordering puts "the user's word in the
current session" above any doc, so I proceeded on the session's numbers but flagged the file gap
loudly as a suggestion item rather than silently trusting either source uncritically.

**How to apply:** every future cycle, actually grep the validation file for the specific figures
you were told before writing a proposal that cites them as ground truth. If they are not in the
file, say so explicitly in the proposal's `notes` and file a `report-missing-latest-entry`-style
suggestion; do not just quietly use the given numbers as if the file confirmed them, and do not
refuse to work either, since a live session directive still outranks a stale doc.
