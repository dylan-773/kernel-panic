---
title: Credits
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[job-pay-and-billing]]", "[[the-night-shop]]", "[[economy]]"]
---

# Credits

> [!info] Source
> `content/arc.ts:jobPay`; `run-reducer.ts:jobPayFor`, `SALVAGE_PAY`.

The shop's money. Earned by clearing jobs, banked by closing the day, spent in the evening.

## Earning

```
jobPay(tier) = 40 + 25 * tier
```

| Job tier | Pay |
|---|---|
| 1 | 65 |
| 2 | 90 |
| 3 | 115 |
| 4 | 140 |
| 5 | 165 |

Modifiers:
- **Cap win**: 50%, or 75% with [[overtime-clause]].
- **Salvage**: 25 credits (`SALVAGE_PAY`) when the [[augment-drafts|draft pool]] is dry.
- **[[clean-run]]**: 15 credits on a trap-free cap win.

Total credited per ticket is `ticketPay + salvage + cleanRunBonus`.

## Spending

| Purchase | Cost |
|---|---|
| [[repairs-and-unlocks|A repair]] | open |
| Night patch, +12 [[neural-strain|strain]] | day-indexed, needs re-deriving |
| [[the-darknet|Dark pull]] | day-indexed, less 15% with [[darknet-rate]] |
| [[patch-pieces|Craft a weld]] | free (`CRAFT_COST = 0`) |

Deck upgrades are **not** on this list. They cost salvage, not money. See [[the-neural-deck]].

## The shape of the decision

Credits convert into survival now (patches), board material (pulls), or the shop itself (repairs). Only the last one compounds, and only the last one carries story.

**Saving for later is now a real option**, which it never was when credits died with the run. A player can bank a thin day and spend nothing, holding for the repair they actually want. See [[meta-progression]].

Credits earned today are held, not banked, until the day closes. A big day carried too far pays nothing at all. See [[day-close-and-banking]].

## Fiction

Credits are also the bills. The shop is behind, and the [[entry-bills|drawer of Meridian final notices]] is the reason the money always matters. There is no debt mechanic and nothing to pay down; the notices are texture, and what they explain is why [[dad]] kept diving. See [[the-shop]].

## See also

- [[economy]] · [[scoring-and-lifetime-stats]]
