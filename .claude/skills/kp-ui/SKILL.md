---
name: kp-ui
description: Run a Kernel Panic UX pass - brief, ux-agent specs (layout, feel, animation, sound), both gates, copy orders, integrate, build check against acceptance.
disable-model-invocation: true
---

# UX Pass (Orchestrator play)

Scope: KP/OS surfaces - layout, interaction feel, animation, SFX and music briefs, teaching UI form, and the art orders those need. No mechanics, no balance, no story content.

DESIGN STANDARD: the KP/OS v2 "single-phosphor poster" system, integrated into the app 2026-07-29. The LIVE surfaces under `kernel-panic-site/app/src/` (styles.css, components/os/, components/os/windows/, kp-ui.tsx) are the standard; `ui-demos/kpos-shell/` and its README remain the design-history reference for the rulings. Every spec extends that grammar: one ink accent per the `data-hue` scheme, inverse-video danger, solid-ink title bars with a pixel X only, boxed data rows, no internal scrollbars ever (page or tab instead), 1-bit ink-tinted imagery (diegetic only), leader-line teach callouts. Never spec back toward the pre-v2 grey/navy look.

1. Write/refresh `pipeline/BRIEF.md` (`ux-<date>`): the surfaces or feel problems in scope and the art budget (default: none - specs must reuse existing assets).
2. Spawn `ux-agent`. It writes `pipeline/proposals/ux-agent.json` (`ui-spec`, `sfx`, `music-brief` items) and files art orders under `pipeline/art/orders/`. Tell it in the spawn about any waiting tier 0 requests or teaching-UI needs from the Tutorial Agent, and any Narrative Director items in flight it should reference by id rather than duplicate.
3. Gates (parallel batch): `loremaster` asks "is it true?" of every outward-facing label and fiction-touching surface, writing `pipeline/gates/loremaster-review.md`; `tutorial-agent` asks "does the player know?" of every spec that changes what the player sees or must understand, writing `pipeline/gates/tutorial-review.md`. REVISE and NEEDS-TEACHING items go back to `ux-agent` with the citation; max 2 rounds, still-contested items drop to the report.
4. Copy: the ux-agent specs surfaces, never words. Player-facing lines a spec needs (dialogue, labels beyond a bare noun, teaching copy) become orders under `pipeline/copy/orders/`; spawn `narrative-director` to fulfill them, and re-gate the filled lines through `loremaster` if they touch fiction. No em or en dashes in game copy.
5. Integrate approved items by hand: ui-specs into the components and `styles.css` they name (palette tokens only, steps() timing, no border-radius), sfx presets into `audio.ts` (envelope values are PLAIN SECONDS), music briefs to the generation pipeline - a new track name is a `MusicTrack` union change plus an mp3, flag it.
6. Verify: `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app && bun run typecheck && bun run build`, then `bun run preview` and walk each integrated spec's `acceptance` checks against the served page (dev SSR is broken in this template; preview serves the built bundle plus static assets). Run `bun run src/game/dev/teach-sim.ts` if any teaching surface or moment changed.
7. If art orders were filed and budgeted, run the `/kp-art` play next. Report: items shipped/dropped by type, orders filed, acceptance checks walked and their results. STOP; deploy only on explicit user OK.
