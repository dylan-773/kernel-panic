---
name: icon-fiction-native-vs-darknet
description: The two-tier desktop icon fiction (native KP/OS chrome vs the darknet's deliberate-wrongness style) and how to judge which a new icon should use.
metadata:
  type: project
aliases: [icon-fiction-native-vs-darknet]

---

KP/OS desktop icons split into two visual registers, both canon-load-bearing,
not just an art-style choice:

- Native shop functions (jobs/inbox, loadout, ledger, manual, the
  crafting bench, repair log) render as clean, flat vector glyphs in the
  ink-slate palette.
- `DarknetIcon` is the deliberate exception: rougher, dithered, "the odd
  one out," because DARKNET.LNK is fictionally bootleg contraband software
  installed on top of native KP/OS, not a shop-native window (see
  `pipeline/art/orders/icon-darknet.json`'s brief language, status done).

**Why:** this distinction is a canon signal, not a decoration choice:
which style an icon gets tells the player whether the thing behind it
belongs to the shop or is illicit/external. A new icon that borrowed the
darknet's "wrongness" treatment for something shop-native (or vice versa)
would be lying to the player about what kind of object they are looking
at.

**How to apply:** when gating a new desktop icon, check first whether the
window it opens is a shop-native function (clean vector idiom) or
represents something illicit/external/installed-on-top (earns the
darknet-style treatment). Approved this call for SOLDER.BAY
(`ux-2026-07-28-craft-station`): it correctly used the native idiom since
crafting happens at the player's own bench, per the will's "you take the
bench," even though patch pieces themselves are sourced partly from the
darknet market. Sourcing does not change which style the window itself
gets; the window's identity (shop-native vs. installed-contraband) does.

See also [[patch_piece_crafting_fiction]].
