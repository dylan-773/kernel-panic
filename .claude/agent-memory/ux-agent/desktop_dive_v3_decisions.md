---
name: desktop_dive_v3_decisions
description: Key calls made redesigning the KP/OS desktop shell and DIVE.EXE to v3 (cycle ux-2026-07-31-desktop-dive) — strain-threshold bug catch, whole-stage cqi container for shell furniture, ambient-motion audit, board-vs-telegraph glance order, and the "one warn owner" demotion mechanic.
metadata:
  type: feedback
---

Verify a shipped UI's alarm THRESHOLD against the underlying reducer's semantics before transcribing it, not just its literal value.

**Why:** shop-os.tsx's taskbar STRAIN chip reads `run.strain > 70` as its danger class, but run-reducer.ts's strain is a depleting health resource (`START_STRAIN = 100`, `Math.max(0, run.strain - chip)`, run ends at 0). The shipped condition is backwards from the fiction: it lights red at full health and stays dark while the run is dying. The brief transcribed the literal `>70` as "current anatomy," but building the v3 alarm on it would ship a signal that actively lies about risk on the ONE surface built to make risk legible. I flagged this in the item's `notes` field, cited the reducer evidence, and wired the actual v3 alarm to the low band (`<=35`, matching loadout-eva's own "risk at or below 35" framing) instead.

**How to apply:** when a brief hands you a shipped conditional as ground truth, grep the value it reads against wherever that value is MUTATED (not just displayed) before trusting the comparison operator's direction. "Transcribe, never invent" covers the NUMBER; it doesn't cover blindly propagating an inverted comparison once you've verified the resource's real direction of travel.

---

RULINGS bans `vw` absolutely (cqi only), but that law was written for WINDOWS. Desktop shell furniture (taskbar, ticker, icon grid, wallpaper) isn't inside a window container.

**Why:** the desktop-dive brief said shell furniture "sizes against the viewport" while RULINGS law 3 says "cqi, never vw" with no shell carve-out. Reconciled by wrapping the WHOLE desktop stage in one `container-type: inline-size` element (`.ds-stage` / `container-name: desk`); every shell clamp() resolves against that container, which in practice equals the viewport width (the stage fills the screen), so "sizes against the viewport" and "never vw" are simultaneously satisfied without inventing an exception to the hard law.

**How to apply:** any future full-bleed, non-windowed KP/OS surface (a future desktop pass, a splash/menu screen) should get the same treatment: one root-level `container-type: inline-size` wrapper, never a `vw` ramp, even where the surface visually IS the viewport.

---

Ambient motion needs a state-payload test, not a vibes test, under v3's "ambient chrome never moves" law.

**Why:** RULINGS explicitly named the WallScope's 9s roll loop as an open question ("must justify itself or go still"). The test I applied and would reuse: does this animation carry LIVE STATE (the ticker's lifetime stats, the bench clock's real seconds — RULINGS' own two pre-approved carve-outs) or is it decorative texture regenerated once and looped forever with no changing payload (the scope's seeded-noise trace, the KP monogram's periodic glitch-slip)? The first kind survives; the second goes static. I cut both the scope roll AND the monogram's glitch-slip on this same test, keeping the scope's small OK status pip blinking (a conventional alive-indicator IS a real signal, just a tiny one, distinct from a full-width decorative band).

**How to apply:** when a brief flags "decide and record" for an ambient animation, ask "what changes if I stop this loop" — if the answer is "nothing, it was decorative," cut the motion (keep the colour/shape). If the answer is "a real value stops updating," it survives.

---

For a real-time, always-animated surface (DIVE.EXE) where "the board" fills the whole stage, law 2's "one focal element at extreme scale" doesn't map cleanly onto a numeral-contrast device the way it did for LOADOUT.CFG's trinity. The resolution: a TWO-TIER glance order — an ambient default focal element (the board, focal by AREA not by numeral scale) plus an EVENT-INTERRUPT focal layer (the telegraph: aim brackets + INTENT + virus card) that is explicitly allowed to outrank the ambient default via its own dedicated colour+blink, separate from the surface's one `--r-warn` alarm.

**Why:** the brief's own framing ("say whether it is the focal element OR whether the focal element is the thing the player must read each beat") is a false binary for a live board — the board is always the biggest object AND the telegraph must periodically win the eye. Also important: law 7's "ambient chrome never moves / only the alarm moves" is a rule about RISK signalling specifically, not a ban on all non-alarm motion — DIVE.EXE is explicitly "the most animated surface in the game" (law 5), so telegraph blink, cascade waves, and turn-cell jitter can all legitimately move as EVENT signals ("something is happening") while staying entirely separate from the ONE alarm's motion ("something is wrong").

**How to apply:** any future full-screen/real-time (non-windowed) v3 surface with a dominant live object should get this same two-tier treatment (ambient-focal-by-area + event-interrupt-focal) rather than forcing a single numeral into the loadout-eva hero-numeral mold.

---

When a shipped surface reuses ONE alarm-flavored CSS class (e.g. duel.tsx's `kp-datarow-warn`) across several unrelated conditions, v3's "risk never shares its colour" forces picking exactly ONE of them as the true `--r-warn` owner and demoting every other condition to `--r-hazard` (same static colour+inverse flood, but never the alarm's motion channel).

**Why:** duel.tsx shares `kp-datarow-warn` across five conditions today (route severed/closing, armed-nodes mismatch, banked RAM, over-par). Under v3 that's five things all silently claiming "this is the risk," which defeats the whole "one owner, three channels" mechanism. The brief named two CANDIDATES for the true owner (strain-low-band vs route-threat); I picked route-threat (the live, reactable-to-right-now signal) and demoted the other four to hazard with the SAME visual weight minus motion — nobody's information got quieter, only the alarm's exclusivity got real.

**How to apply:** whenever auditing a shipped surface for its v3 `--r-warn` owner, first grep every USE of whatever class currently means "danger" there — the list of what you have to demote is usually longer than the brief's own named candidates, and demoting them cleanly (not silently) is the actual deliverable.

---

`--r-aux` can legitimately have NO owner on a surface with no camera/video-class imagery — state that explicitly in the roles field rather than force-assigning it to the nearest live-data element.

**Why:** RULINGS law 1 already establishes the precedent ("if a surface has no alarm state, it has no `--r-warn`"); the same logic extends to any role whose semantic condition (here: diegetic camera imagery) genuinely isn't present. The token stays fully DEFINED in the scheme block (so a window layered on top that DOES have camera imagery still inherits correctly) even though it paints zero pixels on this particular surface.

**How to apply:** when asked to "assign all eight roles" and one role's semantic condition doesn't exist on the surface, write that down as a deliberate absence with the reasoning, rather than either skipping the role silently or stretching its definition to force a use.

---

When a spec claims a size HIERARCHY between named type-ramp tokens (e.g. "numerals never outrank the key label" / "the alarm text is bigger than the rail data"), verify it by comparing the actual `clamp()` floor/ceiling numbers pairwise, not by re-reading the prose that describes the intent. Prose agreement is not number agreement.

**Why:** dive-v3 shipped with `--dv-fs-val` (RAM/ROUND/PAR/STRAIN) at `clamp(18px, 1.2cqi+15px, 26px)` and an acceptance check demanding those numerals never exceed `--dv-fs-key`'s `clamp(13px, 0.6cqi+11px, 16px)` — impossible, since val's OWN FLOOR (18) already exceeds key's ceiling (16). A second instance of the identical bug was hiding one line away: val's ceiling (26) exceeded `--dv-fs-banner`'s ceiling (24), so the "demoted" numeral could out-scale the alarm's own board-side text. The Orchestrator caught it building the demo; I resolved it in favor of legibility (a live-tracked RAM count needs to stay glanceable during real-time play, so it should NOT be forced under a static label's floor) and rebuilt the three ramps with real non-overlapping margins: key 13-16, val 16-20 (floor pinned to key's ceiling), banner 22-32 (floor clear of val's ceiling). Recorded as `dive-v3` in `pipeline/proposals/ux-agent.json`.

**How to apply:** before filing any multi-token type ramp with a claimed ordering, list every token's floor and ceiling in one place and check each adjacent pair (`A.ceiling <= B.floor`) actually holds, the same discipline as a unit test, before writing the acceptance line that asserts the ordering. Do this pass BEFORE the acceptance checks are drafted, not after, or the acceptance text ends up describing the intent instead of the numbers.

---

The Orchestrator sometimes builds a spec's engine-driven scenario differently than the spec literally described, to satisfy the spec's own ACCEPTANCE check rather than its literal mechanism, and reports the divergence back rather than silently deviating.

**Why:** dive-v3's BEAT=TELEGRAPH ARMED variation was specced as "force `state.oppTurn.aim`" without addressing that a rotate-type aim carries no virus card, which would fail my own "all visible simultaneously" acceptance check. The Orchestrator instead pumps real engine turns until a CAST-type aim arms (so a virus card genuinely exists) and holds it without its normal 2400ms burnout timer, satisfying the acceptance check with real engine state rather than a synthetic one. No spec change was needed; this is exactly the "ground truth over proposal text" pattern (see tutorial-agent's memory of the same name) — when an implementer's build choice serves the spec's own stated acceptance better than the spec's literal mechanism did, that's a legitimate build detail, not a deviation to flag back.
