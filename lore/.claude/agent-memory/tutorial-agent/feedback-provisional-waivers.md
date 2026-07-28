---
name: feedback-provisional-waivers
description: When a tier-0 waiver's evidence (an itemized row, inline naming, a glyph) depends on a ui-spec that has not landed yet, mark the waiver PROVISIONAL and say exactly what is missing.
metadata:
  type: feedback
---

A waiver is a claim that the interface already carries a mechanic unaided.
Normally that claim is checked against code that exists. In a cycle where
this seat proposes a waiver for a mechanic whose supporting UI has not
shipped yet (e.g. `patchDrop` and `gridlockChip` in
`deep-balance-2026-07-28`, both modeled on existing precedent, `turnCap`
and `runReset`, but needing NEW itemized rows that only exist as ui-specs
filed the same cycle), the waiver is not actually earned yet.

**Why:** "a waiver is a claim about the interface, so it expires when the
interface changes" (the ledger's own craft rule) implicitly assumes the
interface already makes the claim. Here it does not yet. Silently writing
the waiver as if it already held would be indistinguishable, to a future
reader, from a waiver that had drifted true-to-false; the point is it was
never true-to-code in the first place, only true-to-plan.

**How to apply:** Write the waiver normally (same fields, same reasoning,
citing the precedent it mirrors), but mark it `PROVISIONAL` in both the
waiver log dating and the mechanic-waiver item's `rationale`. Name exactly
what is missing (usually a specific ui-spec id and, if plumbing is
involved, the specific boolean/field that needs threading through the
reducer chain, e.g. `gridlockWin` mirroring how `capWin` already threads
from `duel.tsx` through `run-reducer.ts` into `save.ts`). File the ui-spec
in the same proposal so the dependency is closeable in the next
integration pass, not just noted. Pair with [[feedback-planned-status-pattern]]
on the ledger side.
