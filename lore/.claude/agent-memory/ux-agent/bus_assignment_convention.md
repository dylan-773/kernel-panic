---
name: bus-assignment-convention
description: Bus choice for new sfx is decided by which screen the call site lives on (duel vs everything else), not by how "game-like" the sound feels.
metadata:
  type: project
---

In kernel-panic-site/app/src/game/audio.ts there are three buses: `ui` (gain 0.7, quiet chrome), `game` (gain 1.0, present), `music` (0.3, bed). The rule that matters when filing new sfx items: in-duel events (the `duel`/dive screen, `.kp-dive2*`) always route to `game`; anything on a non-duel screen (day close, job board, result, analyze, login, journal) routes to `ui`, even when the sound represents a resource/feedback moment that would otherwise feel like "game" feedback (e.g. a strain-regen fill on the Upgrade screen).

**Why:** this is the explicit contract rule in `.claude/skills/kp-contracts/` ("Route UI feedback to the ui bus, in-duel events to game"), and it keeps the overall mix legible -- `game` is louder and reserved for the dive itself.

**How to apply:** before picking a bus for a new sfx item, check which component/screen the call site lives in, not whether the event "feels" combat-y. Example: `dayCloseRegen` (Upgrade screen) is `ui`; `patchPlace` and `overParTick` (both inside DuelScreen) are `game`, even though patchPlace is a placement/utility action rather than combat.
