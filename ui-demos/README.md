# ui-demos

Interactive UI variations for Kernel Panic, built by the Orchestrator to be
reviewed BEFORE anything integrates into `kernel-panic-site/`. Each demo is a
standalone page in the KP/OS idiom: it copies the token/chrome subset it needs
(see each demo's `kp.css`) and imports game logic and the sfxr synth directly
from `kernel-panic-site/app/src/game/` so behavior and sound cannot drift from
the shipped modules.

A demo is a proposal, not a product: the paired ui-spec in
`pipeline/proposals/ux-agent.json` is what integrates once a variation wins.

## Building a demo

```
cd ui-demos/<demo>
bun build main.ts --outfile dist/main.js --format iife --target browser
open index.html
```

## Demos

- `craft-station/` - the patch crafting bench as its own KP/OS window: a
  mini soldering station with drag-to-craft (ux-2026-07-28-craft-station).
- `kpos-shell/` - the whole desktop environment redesigned: boot, login,
  taskbar, all seven windows, three accent channels, the no-scrollbar
  sizing law, and the SOLDER.BAY bench in the new skin
  (ux-2026-07-28-kpos-redesign). See its README for build findings the
  integration pass must fold back into the spec. Also hosts the standalone
  poster studies: SOLDER.BAY (solder.html), INBOX (inbox.html),
  LOADOUT.CFG (loadout.html), REPAIR.LOG (dive-report.html), CUSTOMER.REC
  (card.html), and DIVE.EXE (dive.html) - the playable duel itself on the
  shipped engine, drawn as a circuit-schematic instrument panel.
