---
name: patch-piece-crafting-fiction
description: Where patch-piece/crafting canon grounding already lives, for fast gating of any future crafting-station, pouch, or darknet-sourcing proposal.
metadata:
  type: project
---

Patch-piece crafting already has solid canon grounding spread across three
places, in case a future brief (a redesign of the crafting bench, a new
piece-sourcing feature, a darknet market expansion) needs it re-cited
fast:

1. Shipped `PouchCard` footer copy (`components/game/screens.tsx`) already
   calls a crafted piece "welded where it lands" and states pieces "come
   off the darknet, drop from cleared jobs, or bank on clean wins." Any
   weld/solder/fuse metaphor for crafting reinforces existing shipped
   fiction, it does not invent new fiction.
2. `journal.ts`'s SOLDER SMOKE entry (id `solder`, unlockAtRun 3) is the
   game's most emotionally loaded soldering material: Dad's hands, a
   soldering iron, "it only sticks where you have cleaned... Everything
   joins where it is clean." Soldering vocabulary is core narrative
   register, not decoration.
3. `lore/ledger.md` Resolved ruling 9 (2026-07-28) establishes patch
   pieces as physical salvage off scrapped/dead machines, sold gray-market
   via a permanently anonymous darknet dealer, no causal tie to Patch/Dad/
   the back room.

**Why:** gated `ux-2026-07-28-craft-station`'s SOLDER.BAY window spec
against this and approved cleanly (6/6, no ruling needed) because all
three already agreed with the proposal before the gate opened.

**How to apply:** for any future proposal touching patch pieces, the
pouch, crafting, or the darknet market, check these three sources first
before treating anything as a canon gap. Also worth remembering as a gate
methodology: when a proposal claims a game-copy string is reused
"verbatim," verify against the actual shipped source file, not just the
proposal's own notes, before approving on that basis (see
[[feedback-verify-unchanged-claims]]).

**A cut is fine if the fact survives verbatim elsewhere in the game, not
just elsewhere in the proposal's prose.** `ux-2026-07-31-loadout-eva`
(loadout-eva-instrument-panel) cut LOADOUT.CFG's full pouch paragraph,
including the darknet-sourcing sentence ("Pieces come off the darknet,
drop from cleared jobs, or bank on clean wins"), down to a chip plus the
pointer sentence "CRAFT AT THE BENCH: SOLDER.BAY." Approved after
confirming directly against source (not the proposal's claim) that
`solder.tsx`'s `FOOT_LINE` carries the identical sentence verbatim: the
fact isn't lost from the game, it's relocated to the window the cut chip
points the player toward. The check that matters is "does this fact still
exist verbatim somewhere the player can reach," not "does this specific
window still say it."

See also [[icon_fiction_native_vs_darknet]] for the icon-style side of
this same gate.
