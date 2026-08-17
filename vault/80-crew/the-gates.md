---
title: The gates
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[loremaster]]", "[[tutorial-agent]]", "[[canon-rulings]]"]
---

# The gates

**Two questions, asked of the same artifacts, before anything integrates.**

| Gate | Asks | Cites | Verdicts |
|---|---|---|---|
| [[loremaster]] | **Is it true?** | `lore/` | APPROVE / REVISE / NOTE |
| [[tutorial-agent]] | **Does the player know?** | the teaching ledger | COVERED / NEEDS-TEACHING |

Either can hold an item back.

## Every REVISE must cite

> `REVISE - <what breaks canon> (bible/ledger: "<the line it contradicts>")`

**If you cannot cite a line, you may not revise on canon grounds.** You may flag it as `NOTE`, which is advisory and does not block.

That rule is what stops a gate becoming taste. A reviewer with an opinion and no citation is a reviewer with an opinion.

Citations are by **quoted text**, not line number, which is why the canon files could be reorganized into this vault without invalidating a single verdict. See [[canon-rulings]].

## What the Loremaster checks

- The [[reveal-schedule]] ceiling: any line that states what is inside the machine before the player has beaten it is a REVISE, and so is any line that only reads correctly in one upgrade order.
- [[voice-and-copy-laws]], including the em dash law.
- **"Looks good" without reading every item is a failed review.** The file ends with a tally: items seen, approved, revised.

## What the Tutorial Agent checks

Every artifact that adds a mechanic, a stat, a screen, a place, an interactable or a purchase. NEEDS-TEACHING verdicts cite a ledger line.

**A place counts.** Once the shop is a room the player walks, an object in it is a mechanic with a body: the broken solder bay teaches its own unlock by standing there broken. That is tier 0 teaching and it still has to be declared. See [[the-shop-floor]].

Standing preferences: teach at first contact, never by cramming the opening dive; and **prefer a clearer interface (tier 0) over a coachmark**. See [[placement-bias-order]].

## Gates may create canon

If a proposal exposes a genuine gap, the Loremaster **decides it**: adds the ruling first, then gates against it, and says so in the review. Four rulings arrived this way: [[ruling-09-darknet]], [[ruling-10-overtime-billing]], [[ruling-11-opponent-identity-tag]], [[ruling-13-dad-vol-provenance]].

## When the gates do not apply

> [!info] Relaying an existing KP/OS window, with its content unchanged, is pure UI
> No loremaster gate, no tutorial gate, no detours into game code. The gates are for surfaces introducing **new** fiction or **new** things a player must understand. See [[ui-rulings]].

The exemption is deliberately narrow, and it **does not reach the scene layer**. A physical object in the shop carries fiction (its story content is readable in place) and a mechanic (what repairing it unlocks) at the same time, so scene work is gated on both questions by default. See [[the-shop-floor]] and [[repairs-and-unlocks]].

## See also

- [[the-pipeline]] · [[standing-lessons]]
