---
name: kpos-window-sizing-law
description: The no-internal-scrollbar law for KP/OS floating windows -- floor/ceiling numbers, the kill list, and paging-vs-tabbing policy
metadata:
  type: project
---

Decided in the ux-2026-07-28-kpos-redesign pass (`pipeline/proposals/ux-agent.json`,
item `kpos-window-sizing`), directly answering the user's named anger that
shipped KP/OS windows are small and grow internal scrollbars.

**The law.** Windows size to their intrinsic content height; no
`.kp-fw-body` or `.kp-window-body` rule ever carries `overflow: auto` or a
vh-based `max-height` again. Content that cannot fit gets PAGED (fixed-height
content frame, PREV/NEXT + a `.kp-chip-pct` counter) or TABBED (named section
buttons swapping a fixed-height frame), never scrolled. If content still
busts the outer ceiling despite that, it should visibly overflow the frame
(a loud dev-time bug) rather than silently clip or silently scroll --
overflow is deliberately left `visible`, not `hidden`, on the outer `.kp-fw`.

**Numbers** (assumed desktop 1280x800, taskbar 44px):
- Floor: `--kp-win-w-floor: 420px` (was `MIN_WIDTH = 220` in wm.tsx).
- Width scale: `--kp-win-w-narrow: 480px` / `standard: 760px` / `wide: 860px`
  / `hero: 940px`.
- Outer height ceiling: `--kp-win-h-ceiling: min(calc(100vh - 120px), 760px)`,
  lives on `.kp-fw` itself (which previously had NO outer cap at all; only
  the now-deleted `.kp-fw-body` carried one).
- Below an 860px-wide viewport: width clamps to `min(target, 96vw)`, same
  graceful-degradation pattern the (dead) legacy `.kp-window` class already
  used.

**Kill list found by grepping the live CSS** (worth re-checking if this
surfaces again): `wm.css:108-109` (`.kp-fw-body` 62vh/auto -- the main
offender, every utility window shares this body class) and
`styles.css:1039-1042` (`.kp-aug-list` 30vh/auto, LOADOUT.CFG's boost-bay
list). `styles.css:540-609` (`.kp-window*` family) is DEAD CODE, not
referenced by any `.tsx` in the tree -- confirmed by grep, flagged for
deletion as housekeeping, not a functional fix. `.kp-dboard`/`.kp-dive2-opp`
overflow rules are duel/dive chrome and were deliberately left alone (out of
scope for this pass, see `[[kpos-redesign-scope]]`).

**Which windows actually need paging vs. just more width.** Checked real
content volume before deciding: AUGMENTS has 18 entries (`kit.ts`), journal
has 11 entries (`journal.ts`), boost bays cap at 5 (`BOOST_SLOTS_MAX`,
`run-reducer.ts:87`), patch pouch caps at 5 (`PATCH_POUCH_MAX`,
`patch-cells.ts:20`). Result: MANUAL.TXT and DAD.LOG are the only two windows
that genuinely need paging (open-ended/large content); everything else
(LOADOUT.CFG's augment bays, LEDGER.LOG's ~16 rows) just needed a wider
window and a smarter layout (a 3-column grid instead of a 1-column list, a
two-column dossier instead of a 2x2 grid), not a paging mechanism. **How to
apply:** before reaching for tabs/paging on a future window, count the real
content volume first -- a wider window or a multi-column layout is the
cheaper, more idiom-consistent fix, and paging should be reserved for content
that grows open-endedly over a save's lifetime (journal entries, augment
catalog) rather than anything with a small fixed cap.

See also `[[kpos-channel-and-pip-design]]` and `[[kpos-redesign-scope]]`.
