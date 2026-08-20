---
name: feedback-verify-persistence-claims
description: When a resource carries over between game units (days, runs) instead of resetting, check whether the game actually says so anywhere reliable; players default to assuming a fresh start.
metadata:
  type: feedback
---

Rule: whenever a mechanic changes a resource from "resets each unit" to
"persists and only partially regenerates," treat that as a high-priority
teaching gap to check for, even if the number itself (the regen amount) is
already shown somewhere. The RULE and the NUMBER are separate teaching jobs;
a persistent readout of the number does not imply the player knows the rule.

**Why:** found this cycle as `strainCarryover`. Under Kernel Panic's
day-is-the-run rebuild, Neural Strain no longer resets each run (the old
behavior); it now carries across days, restored only by sleep (+10) or a paid
night patch (+12), capped at 100. The regen NUMBER is shown persistently on
NIGHT.SYS ("SLEEP RESTORES +10"), which looks like adequate coverage at a
glance. But nothing states the RULE that it does not otherwise reset, and the
one place that comes close (a flavor line in the morning-message rotation)
provably cannot appear before day 9 by its own cycling logic. A player
carries the OLD mental model (strain resets, so spend freely) right into the
NEW economy (it doesn't, so a bad day compounds) with nothing correcting
them for over a week of play.

**How to apply:** any time a redesign changes a stat from
reset-per-unit to carries-over-partially-restored, check specifically for a
coachmark stating the carryover fact itself, separate from any tip stating
the regen number. Do not let "the number is visible somewhere" close this
out; ask "does anything state the RULE, and does it fire before the player
needs it, not after." See [[project-day-is-the-run]] and
[[feedback-reread-live-components]].
