---
title: INBOX
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[customers]]", "[[traps-and-telegraphs]]", "[[law-11-panel-queue]]"]
---

# INBOX

`inbox` · `windows/inbox.tsx`

The work queue and the CUSTOMER.REC card. Holds what the player has taken in at [[the-counter]], carries the diagnostic readout, and launches the dive.

## What it shows

- **Whatever the player has accepted today**, takeable in any order, and as long as they keep saying yes at the counter it keeps growing.
- Per ticket: the [[customers|customer]], the device, the **threat pips** (job tier 1 to 5), and the **dominant-routine tell**.
- A **head-start RISK warning** where `headStart` is non-zero.
- The DIVE button.

Two widths, `INBOX_W_LIST` and `INBOX_W_CARD`, because the collapsed list and the expanded customer record are genuinely different surfaces rather than one surface with a detail pane.

## The tell is the whole point

The dominant-mode line is **honest**, always, and the machine is guaranteed to use that mode early. `MODE_TELL` carries the six lines. See [[traps-and-telegraphs]].

That honesty is what makes the loadout a real decision: a `redirect` job and an `armHalt` job want different [[the-neural-deck|deck]] configurations, and the player can see which is which before committing [[ram]] or [[neural-strain|strain]]. How much of the tell they get depends on how good the bench is, so this window's density grows with the shop. See [[scan]].

> [!warning] This window no longer fronts the day
> Work arrives at the counter, in the room, from a person. INBOX is the record of what was accepted, which resolves the old two-focal-candidate problem: the customer card belongs to the intake scene and the DIVE button belongs here.

## Teaching

`analyze-readout` (order **20**, the earliest coachmark in the game) fires here on first sight, teaching `analyzeTell` and `threatTier` together. It is first because everything downstream depends on the player believing the diagnostic. See [[coachmarks]].

## The design problem it carries

> [!warning] Two focal candidates
> The customer card and the DIVE button both want to be the one big thing. [[law-2-hierarchy]] requires the glance order be decided **before** the panel is built, and this is the surface where that decision is hardest.

## See also

- [[customers]] · [[core-loop]] · [[difficulty-dials]]
