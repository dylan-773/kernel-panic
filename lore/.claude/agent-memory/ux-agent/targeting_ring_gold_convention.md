---
name: targeting-ring-gold-convention
description: Gold (--kp-gold) is the single accent for "a program cast is armed and awaiting a target", shared by ATTACK/DEFEND and any future single/multi-target consumable.
metadata:
  type: project
---

In the duel (kernel-panic-site/app/src/components/game/duel.tsx and styles.css) gold already means "you are mid-cast": `.kp-ability-arming`, `.kp-targetbar`, `.kp-rail-intent` all use `--kp-gold`. Plain free rotation instead uses the cream/signal `.kp-dlegal-ring`.

When speccing the patch-cell placement affordance (story-retune-1, `patchcell-duel-affordance` item) this was extended rather than replaced: legal slag blocks under an armed PATCH CELL cast get a new `.kp-dblock-patchable` ring that is a gold-recolored copy of `.kp-dlegal-ring`'s geometry and pulse timing, not a new color or a new animation shape.

**Why:** a single consistent accent for "armed cast in progress" lets players recognize the targeting state at a glance regardless of which program (or consumable) armed it, without having to learn a new color per verb.

**How to apply:** any future single- or multi-target cast affordance (including consumables) should reuse the gold legal-ring/targetbar treatment. Reserve new colors for genuinely new state categories (e.g. crimson stays for danger/over-par, per the over-par HUD item in the same proposal).
