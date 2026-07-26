# Brief: story-retune-1

Goal: a full story pass (explicit openers and enders for runs 1-12, day-open
cutscenes for days 1-10, tutorial framing) plus a gameplay retune driven by
playtesting: only LOCK and HALT feel viable, halt has a flood-stopping bug,
and the loop needs a par system, end-of-day strain regen, and a credits sink.

## Engine changes (Orchestrator-owned, landing BEFORE proposals)

These are already being implemented in the game repo. Design your content
against the post-change engine, described here:

1. **Halt trap fix.** A sprung trap no longer stops the victim's flood
   cascade. The cascade completes, THEN the turn ends (halt) or the RAM
   drains (siphon). Traps are pure tempo hits now, not walls.
2. **PAR.** Every dive computes a rotation par from the player's starting
   route cost plus a margin. The duel HUD shows PAR and rotations used.
   On a win, strain chip = over-par rotations times a per-rotation cost,
   plus the existing trap penalty (4 per sprung trap), capped at 40. The
   old opponent-progress formula is gone. At or under par with no traps
   sprung = a clean win, zero strain.
3. **Strain regen.** Closing a day auto-restores +10 strain (cap 100).
   Night Patch stays as a purchasable extra on top.
4. **PATCH CELLS.** A new single-use consumable: convert one slag block
   within reach into an open cross junction (all four arms), 1 RAM,
   once per turn, consumed on use. Bought at day close for credits
   (default 35 cr, hold at most 3). This is the credits sink.

## Scope

- **narrative-director**:
  - Explicit opener AND ender scenes for every run number 1-12 (no
    fallback rotation). Rhea gets multi-beat dialogue in each: at least
    two sister beats per opener, real progression of her virus theory
    across runs 7-12 (currently it stalls at run 8's "it is waiting").
    Keep every existing beat that works; extend, do not churn.
  - Day-open cutscenes for days 1-10: new scene slot `"day"` with a
    `day` field (1-10), id `day-open-<n>`, 2-4 beats each. Day 10's
    replaces the finale-door copy as the morning frame. These play once
    when the day starts, before the job board. DAY_LINES stay as the
    board's one-liner; refresh any that clash with the new scenes.
  - Tutorial framing: slot `"tutorial-intro"` (before the scripted first
    dive, Rhea warns + bench notes boot) and `"tutorial-outro"` (right
    after the machine seals, before run 1 day 1), 2-3 beats each.
  - Art: NO new art budget. Reuse SISTER / FATHER / COMPANION portraits
    and the four existing stills.
- **ability-agent**: viability retune. Playtest verdict: only LOCK and
  HALT get picked; REDIRECT, SIPHON, PURGE, WARD feel weak. Retune
  numbers and propose reducer-hook changes (engineNote) to make every
  mode a real choice against the post-fix engine (traps no longer stop
  floods, so trap value shifts too). Up to 4 new augments allowed,
  including ones that play with PAR or PATCH CELLS. All programs stay
  1 RAM; no new verbs beyond the patch-cell placement described above.
  Design from the fresh validation report (post-engine-change numbers).
- **arc-composer**: re-target the day curve after the halt fix, par, and
  patch cells land. Hold the reference curve unless the fresh report
  shows drift; day deltas only, tutorial and finale configs untouched.
  Also propose the PAR margin formula constants if the default (route
  cost x 1.35 + 2) produces degenerate pars at any day size.
- **ux-agent**: ui-specs for the PAR HUD readout (par vs used, over-par
  warning state), patch-cell purchase row at day close and in-duel
  placement affordance, day-open cutscene presentation (reuses the
  StoryScene player), end-of-day regen feedback on the upgrade screen,
  and sfx presets for: patch-cell placement, over-par tick, day-close
  regen. No new music track.
- **encounter-generator**: NOT in scope this cycle.

## Curve targets

Reference curve holds: D1 82, D2 77, D3 74, D4 56, D5 58, D6 56, D7 49,
D8 42, D9 39, finale ~25 percent (kit-less proxy, 200 seeds). Tutorial 0
wins in 200 seeds, always. Drift beyond ~6 points on any day the brief
cares about triggers the balance loop.

## Art budget

None. Reuse existing assets only. Art orders will be rejected.
