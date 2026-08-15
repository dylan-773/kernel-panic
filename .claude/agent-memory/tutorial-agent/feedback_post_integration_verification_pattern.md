---
name: post-integration-verification-pattern
description: how to handle an Orchestrator follow-up reporting that a gated item landed, before updating the ledger
metadata:
  type: feedback
aliases: [feedback-post-integration-verification-pattern]

---

A distinct case from [[ground_truth_over_proposal_text]]: that memory is
about reading real components before writing a PRE-integration gate verdict.
This one is about the follow-up message that arrives AFTER integration,
reporting specifics (exact chip labels, exact deny-message strings, exact
field names) and asking this seat to verify and record. Treat every claim in
that follow-up message the same way: something to re-derive from the actual
shipped file, not something to transcribe from the message into the ledger.

**Why:** the same failure mode applies in both directions (a description
lagging reality, or a description getting ahead of it): `jobBoard`'s waiver
string sat unchanged in code while the sentence it quoted silently vanished
from the shipped screen, and `teach-sim` never caught it because it only
checks that the string exists, not that it still renders anywhere. These
follow-up messages also say so explicitly: "verify directly against the
source, do not take my word."

**How to apply:** read the named component file(s) in full first. Confirm
exact strings character for character (dash counts in placeholders like
"----", exact chip label sets, exact deny-message wording), not just gist.
Then: (1) update the Coverage row note, (2) update any waiver log citation
pointing at a retired class/selector, (3) close the Open Work bullet the
item tracked by moving it to a dated Closed subsection rather than deleting
the record, (4) mark the item's `status` in the agent's own proposals JSON
(see [[reference_status_field_convention]]), (5) add one loop-history line
naming what was re-confirmed. Reply with one line per file touched plus
anything that did NOT match the description, even a minor one (this is the
part of the reply that actually earns trust in the next follow-up).
