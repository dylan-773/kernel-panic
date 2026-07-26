---
name: feel-shake-vocabulary
description: Screen-shake tiers are reserved for combat/threat impacts only; utility and reward events get pulse/pop feedback with zero shake.
metadata:
  type: project
---

Screen-shake (`.kp-shake-1/2/3` in kernel-panic-site/app/src/styles.css) stays reserved for genuine combat impacts: trap sprung, siphon fired, turn lost, win/lose, redirect. Utility or reward events (patch-cell placement, cascade RAM banking, scan/purge/ward) get an info/good pulse label (`.kp-pulse-info`, `.kp-pulse-good`) and, where relevant, the `kp-banked-pop`/`kp-claimpop` pop-in -- never shake.

**Why:** the duel's two-beat aim-then-strike telegraph is the thing players read to judge danger. Diluting shake with non-threat events would blur that signal. See `pipeline/proposals/ux-agent.json` (brief story-retune-1) for the patch-cell-duel-affordance item, which explicitly calls out zero shake for the same reason.

**How to apply:** when speccing new duel feedback, default new economy/utility actions to pulse-only. Only reach for shake when the event is something the opponent (or a trap) is doing to the player, or a duel-ending beat.
