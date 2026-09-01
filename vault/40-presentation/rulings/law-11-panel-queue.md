---
title: Law 11 - Panel queue
status: canon
source: rulings
owner: ux-agent
updated: 2026-08-31
related: ["[[ui-rulings]]", "[[40-presentation]]"]
---

# Law 11 - Panel queue

The worklist. [[loadout-cfg]] (`loadout-eva`) is the reference; the rest were independent conversions.

| Panel | Shipped component | Status | What the hard part was |
|---|---|---|---|
| [[inbox]] | `windows/inbox.tsx` | converted 2026-08-01 | **Two focal candidates** (CUSTOMER.REC card vs DIVE button); the glance order had to be decided first. |
| [[repair-log]] | `windows/report.tsx` | converted 2026-08-01 | Already dense; the verdict became the focal element, the ECG strain trace a `--r-warn` surface. |
| [[solder-bay]] | `windows/solder.tsx` | converted 2026-08-01 | Drag-to-craft, interaction-heavy: the **motion budget**. |
| [[dad-log-window]] | `windows/dadlog.tsx` | converted 2026-08-01 | Long documents: **paging discipline**. |
| [[darknet-lnk]] | `windows/darknet.tsx` | converted 2026-08-01 | Deliberately the odd one out **via stepped-notch chrome, not colour**. Keep that. |
| [[manual-txt]] | `windows/manual.tsx` | **REMAINING** | Tabbed reference; the **18-card AUGMENTS page** is the hard case. |
| [[night-sys]] | `windows/night.tsx` | converted 2026-08-01 | Proved the system at **low density**. |
| [[ledger-log]] | `windows/ledger.tsx` | **REMAINING** | Small, table-shaped. |
| [[dive-exe]] | full-screen duel | converted 2026-08-01 | Full-screen, real-time; the machine's two-beat telegraph stayed readable. **It does not follow the window rules.** |

> [!info] Reconciled 2026-08-31
> Seven of the nine panels converted in the 2026-08-01 v3 burst; **[[manual-txt]] and [[ledger-log]] are the last two pre-v3 windows on the shipped desktop.** The spec's own copy of this queue (`ui-demos/RULINGS.md` law 11) now carries per-row statuses and must be updated in the same change that converts a panel. `ui-demos/manifest.json` remains the durable live record.

## Two notes worth keeping even after the queue empties

**INBOX has two focal candidates.** A surface where the customer card and the dive button both want to be the one big thing is precisely the case [[law-2-hierarchy]] exists for.

**DIVE.EXE is exempt.** It is full-screen and its own thing, and the telegraph readability constraint outranks the panel system. It converted in the same 2026-08-01 burst as the rest; the exemption from the window rules is what endures.

## See also

- [[ui-rulings]] · [[law-9-build-recipe]]
