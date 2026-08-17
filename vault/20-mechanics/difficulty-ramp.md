---
title: The difficulty ramp
status: draft
source: none
owner: arc-composer
updated: 2026-08-16
related: ["[[difficulty-dials]]", "[[customers]]", "[[arc-composer]]"]
---

# The difficulty ramp

> [!warning] status: draft
> Replaces `the-ten-day-arc` and its ten day notes. The findings below were harvested from them before deletion; the model around those findings is a proposal.

An open calendar cannot have a ten-row table indexed by day. `DAY_CONFIGS` has to become something that answers the question "how hard is *this* dive" from facts that still exist.

## The proposal: tier is the index, depth is the modifier

**Job tier 1 to 5** carries the configuration. Each tier is one row of the same dials the day table used to hold: grid, `oppRam`, `horizon`, `focus`, `parFlat`, `slag`, `patchDrop`. A tier 3 device is a tier 3 device on the first Monday and on the hundredth.

**Depth into the day** modifies it. The nth customer of a day arrives from a higher tier band than the first, so a long day escalates on its own without anything about the player changing. This is what replaces the arc's rising pressure, and it is better than the arc was: the pressure is something the player chose by not closing.

**Shop progression opens the band.** The city sends work matching the shop it thinks you are. Early on nobody brings a tier 5 device to a bench that cannot read it. That stops the player farming tier 1 forever and keeps [[customers|the roster]] honest, since profiles are already tier-banded rather than day-banded.

Nothing here needs the player's own strength as an input, and it should not have it: difficulty that tracks the build punishes building.

## Findings carried over from the old arc

These were measured and are worth keeping whatever the ramp becomes.

**Horizon is the intelligence dial, and each step is a different opponent:**

- **0**: no cut scoring at all. It races its own board and never reaches across. The player meets the race before they meet the duel.
- **1**: it scores twists by how much they raise the player's [[route-cost-and-par|route cost]]. Interference enters the game, all at once.
- **2**: it also scores by how much of the player's live grid goes dark. Cuts stop being about route cost and start being about tempo damage.
- **3**: it weights cuts by what they cost the player to repair, so it twists elbows and tees over straights. **Below horizon 3 the machine is always trying to win. At horizon 3 it is sometimes trying to make you lose.**

**`headStart` is real, not cosmetic.** The intrusion arrives with junctions already aligned along its route, and the board generator compensates the opponent's target cost by `round(headStart * 1.8 * 0.6)`.

**`minPd` exists to stop turn-one solutions.** Once a player has boosts, banked [[cascades-and-surge|cascade]] RAM and [[patch-pieces|pieces]], an opening burst can close a short board outright. A floor on the opening route cost prevents the generator handing one out.

**Slag rises while patch drops fall.** Board material gets scarcer exactly as it gets more necessary. Keep that relationship in whatever the tiers become.

**A tier 5 opponent** fields all three attack and all three defend modes and casts three wide. It is the top of the band and should stay rare.

**The tutorial is separate and unwinnable by construction**, and must post 0 wins in 200 seeds. See [[the-tutorial]] and [[verification-gate]].

## What this breaks

The verification gate's curve is nine days plus a finale, and the harnesses walk a fixed ten-day loop. Both need rebuilding around a per-tier win rate and a distribution over day lengths. See [[simulation-harnesses]].

## Open questions

- [ ] Five tier rows, or five rows plus a separate back room config? The back room is currently the old finale row.
- [ ] What is the depth modifier: a tier band shift, a dial multiplier, or extra customers drawn from a higher band?
- [ ] What opens the band, exactly? Repairs completed, credits earned, days survived, or an explicit reputation number?
- [ ] Target win rate per tier. The old curve gated a deploy and there is nothing in its place.

## See also

- [[difficulty-dials]] · [[opponent-ai]] · [[the-board]] · [[verification-gate]]
