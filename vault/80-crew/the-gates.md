---
title: The gates
status: canon
source: code
owner: orchestrator
updated: 2026-08-31
related: ["[[loremaster]]", "[[tutorial-agent]]", "[[canon-rulings]]"]
---

# The gates

**Two questions, asked of the same artifacts, before anything integrates.**

| Gate | Asks | Cites | Verdicts |
|---|---|---|---|
| [[loremaster]] | **Is it true?** | `vault/60-story/` | APPROVE / REVISE / CHALLENGE / NOTE |
| [[tutorial-agent]] | **Does the player know?** | the teaching ledger | COVERED / NEEDS-TEACHING / CHALLENGE |

Either can hold an item back.

## Every REVISE must cite

> `REVISE - <what breaks canon> (canon: "<the line it contradicts>")`

**If you cannot cite a line, you may not revise on canon grounds.** You may flag it as `NOTE`, which is advisory and does not block.

That rule is what stops a gate becoming taste. A reviewer with an opinion and no citation is a reviewer with an opinion.

## The doc can lose: CHALLENGE

Added 2026-08-31, by user ruling. The doc is presumed CURRENT, not presumed
CORRECT. When the artifact is good and the cited line is the problem (stale,
wrong, or worse than what the proposal implies), the verdict is CHALLENGE:
quote the doc line, state what the artifact wants instead, recommend which
side bends. A CHALLENGE never resolves inside the gate; the [[orchestrator]]
carries it to the user, who rules, and the winning side gets written before
the item integrates. An author can raise the same dispute preemptively with
a `suggestion` item carrying a `disputes` quote; the gate must answer it
with CHALLENGE or a cited REVISE, never by silently siding with the doc.

Citations are by **quoted text**, not line number, which is why the canon files could be reorganized into this vault without invalidating a single verdict. See [[canon-rulings]].

## What the Loremaster checks

- The [[reveal-schedule]] knowledge table: anything revealing more than the player can know at its unlock point is a REVISE.
- [[voice-and-copy-laws]], including the em dash law.
- **"Looks good" without reading every item is a failed review.** The file ends with a tally: items seen, approved, revised.

## What the Tutorial Agent checks

Every artifact that adds a mechanic, a stat, a screen, a resource or a purchase. NEEDS-TEACHING verdicts cite a ledger line.

Standing preferences: teach at first contact, never by cramming the opening dive; and **prefer a clearer interface (tier 0) over a coachmark**. See [[placement-bias-order]].

## Gates may create canon

If a proposal exposes a genuine gap, the Loremaster **decides it**, preferring to ADOPT the proposal's implied answer when it contradicts nothing existing: writes the ruling, gates against it, and flags it in the review as freshly written so the user can veto. Four of the first fourteen rulings arrived this way: [[ruling-09-darknet]], [[ruling-10-overtime-billing]], [[ruling-11-opponent-identity-tag]], [[ruling-13-dad-vol-provenance]].

## When the gates do not apply

> [!info] Redesigning an existing window is pure UI
> No loremaster gate, no tutorial gate, no detours into game code. The gates are for surfaces introducing **new** fiction or **new** things a player must understand. See [[ui-rulings]].

## See also

- [[the-pipeline]] · [[standing-lessons]]
