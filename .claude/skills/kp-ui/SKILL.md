---
name: kp-ui
description: Run a Kernel Panic UX pass - brief, ux-agent specs (layout, feel, animation, sound), both gates, copy orders, then BUILD A REVIEWABLE DEMO in ui-demos/ and stop. Integrate only what the user approved, with "/kp-ui integrate the approved UI demos".
disable-model-invocation: true
---

# UX Pass (Orchestrator play)

Scope: KP/OS surfaces - layout, interaction feel, animation, SFX and music briefs, teaching UI form, and the art orders those need. No mechanics, no balance, no story content.

DESIGN STANDARD: the KP/OS v3 "instrument panel" system. **`ui-demos/RULINGS.md` IS the spec: read it first and build to it.** Reference implementation `ui-demos/loadout-eva/` (LOADOUT.CFG), whose `NOTES.md` carries the design history and the reasoning behind each law. In short: colour is eight role tokens carrying state, remapped by `data-scheme` (NERV, TOKYO NIGHT) and collapsing onto the single v2 accent by default; risk never shares its colour and never signals by colour alone; one focal element per surface at extreme scale against a stated glance order; sizes are `clamp()` on CONTAINER units (`cqi`, never `vw`) with one breakpoint at 700px; a hard ~700px height ceiling so windows tile; no internal scrollbars ever; 1-bit diegetic imagery at 1:1, cropped never downscaled, in ink-tint/true/full-colour treatments; flat CRT glass over the stage, no curved; `steps()` motion reserved for alarms, animated on compositor properties only. v2's single-phosphor law survives as the default, not the only option; never spec back toward the pre-v2 grey/navy look.

THE REVIEW RULE: UI does not go straight into the game. A cycle ends at a demo the user can look at, and integration is a separate invocation that touches only what they approved. The invocation decides which mode you are in:

- `/kp-ui <a surface or a feel problem>` runs **PROPOSE** (steps 1 to 7).
- `/kp-ui integrate ...` runs **INTEGRATE** (steps 8 to 9). Nothing else.

## PROPOSE

1. Write/refresh `pipeline/BRIEF.md` (`ux-<date>-<slug>`): the surfaces or feel problems in scope and the art budget (default: none - specs must reuse existing assets).
2. Spawn `ux-agent`. It writes `pipeline/proposals/ux-agent.json` (`ui-spec`, `sfx`, `music-brief` items) and files art orders under `pipeline/art/orders/`. Tell it in the spawn about any waiting tier 0 requests or teaching-UI needs from the Tutorial Agent, and any Narrative Director items in flight it should reference by id rather than duplicate. Its ui-specs should name the VARIATIONS worth showing (color schemes, treatments, scenarios) so the demo can offer them to the reviewer.
3. Gates (parallel batch), BEFORE the user sees anything: `loremaster` asks "is it true?" of every outward-facing label and fiction-touching surface, writing `pipeline/gates/loremaster-review.md`; `tutorial-agent` asks "does the player know?" of every spec that changes what the player sees or must understand, writing `pipeline/gates/tutorial-review.md`. REVISE and NEEDS-TEACHING items go back to `ux-agent` with the citation; max 2 rounds, still-contested items drop to the report. Gating first is deliberate: what the user approves is what integrates, so a gate must never change a demo out from under an approval.
4. Copy: the ux-agent specs surfaces, never words. Player-facing lines a spec needs (dialogue, labels beyond a bare noun, teaching copy) become orders under `pipeline/copy/orders/`; spawn `narrative-director` to fulfill them, and re-gate the filled lines through `loremaster` if they touch fiction. No em or en dashes in game copy.
5. BUILD THE DEMO yourself into `ui-demos/<id>/index.html`: a standalone page in the KP/OS idiom that links `../_shared/kp.css` and `../_shared/system.css`, keeps its own art under `<id>/art/`, and inlines the rest. Import game logic from `kernel-panic-site/app/src/game/` (built with `bun build main.ts --outfile dist/main.js --format iife --target browser`) whenever behavior or numbers must not drift from the shipped modules. Write `ui-demos/<id>/NOTES.md`: what it is, what it decides, what it still owes.
6. Register it in `ui-demos/manifest.json` at `"status": "awaiting"` with `cycle`, a one-line `summary`, `notes`, `spec` pointing at the ux-agent item, the `variations` the spec asked for, and a `desktop` block if the page carries `.term-bar` chrome (`mountable: true`, `default: false`, plus `frameW`, `x`, `y`, and any `onReady`/`onOpen` option forcing). Start the review site if it is not up: `bun ui-demos/_review/serve.ts`.
7. Report: items by type, orders filed, what the gates said, and the review URL `http://localhost:4180/kernel-panic-ui`. STOP. `kernel-panic-site/` is NOT touched in this mode. Run `/kp-art` next if art orders were filed and budgeted.

## INTEGRATE

8. Read `ui-demos/manifest.json` and take every demo at `"status": "approved"`. Nothing else is eligible: not `awaiting`, not a demo the user only spoke well of in chat.
   - Port each by hand into the components and `styles.css` it names (palette tokens only, steps() timing, no border-radius), sfx presets into `audio.ts` (envelope values are PLAIN SECONDS), music briefs to the generation pipeline - a new track name is a `MusicTrack` union change plus an mp3, flag it.
   - Verify: `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app && bun run typecheck && bun run build`, then `bun run preview` and walk each integrated spec's `acceptance` checks against the served page (dev SSR is broken in this template; preview serves the built bundle plus static assets). Run `bun run src/game/dev/teach-sim.ts` if any teaching surface or moment changed.
   - Set the demo to `"status": "complete"` with a `history` entry carrying the date and what actually changed in the app, and add `"status": "integrated"` to the matching `pipeline/proposals/ux-agent.json` item.
9. Report: demos integrated, acceptance checks walked and their results, anything left `awaiting` and why. STOP; deploy only on explicit user OK.
