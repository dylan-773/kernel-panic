# DARKNET.LNK terminal study

Demo: `ui-demos/darknet/index.html` (cycle `ux-2026-07-29-darknet-cli`)
System laws: [`../RULINGS.md`](../RULINGS.md)

Standalone page (the shell is untouched by it): the gray market rebuilt
as a REAL dark-web CLI, replacing round 1's w-darknet form window. The
whole beat is the access ritual: an unregistered-channel dial ("resolving
name... no such address on record. / trying anyway."), three relay hops
with dot-crawl progress, "crypt: keys traded. names were not.", a
300-baud carrier lock, then the vendor banner (pixel double-chevron mark
with the second stroke hot, scanline-masked DARKNET wordmark, solid tag
strip) and a live prompt (`nobody@nowhere:~$`). The prompt is a real
keyboard target - type HELP / LIST / BUY / BAL / POUCH / EXIT, arrow-up
history, plus easter eggs (WHO, REFUND, HAGGLE) - and the same trades
ride clickable chips that type themselves into the prompt. BUY runs the
full purchase: escrow hatch-bar fill with the balance ticking down in the
status chips, a relay handoff beat, then a SIGNAL DROP card whose glyph
scrambles through shapes on a decelerating steps cadence before landing
(shake + scan sweep) with SHAPE / ARMS / GUARANTEE NONE rows; a Cross
lands an inverse-video JACKPOT strip. Pouch-full and short-of-credits
denies, MARKET OFFLINE outside night hours (hop 2 hits dead air), and an
EXIT teardown to a dim NO CARRIER hero with the ROUTE chip inverted.

Identity per the standing ruling: the odd one out via the stepped-notch
title bar, the chevron mark, and HEAVIER dither (8px ch2 checker over the
4px fine grain in the log field), never a second hue. Danger is inverse
video; the vendor speaks in the support tone (--ch2) with a `??>` prefix,
the same tint-echo law as the intrusion. The log is BUS.LOG plumbing: a
bottom-anchored absolutely positioned column in a clipped viewport, ring
trimmed at 110 nodes, old lines fading off the top, no scrollbar ever.

Game numbers are shipped constants inlined verbatim (patch-cells.ts /
duel-types.ts): darkPatchCost(day) = 25 + 5 * (day - 1), PATCH_POUCH_MAX
5, roll weights I 40 / L 45 / T 12 / X 3 with uniform rotation. Pulls
come off a seeded LCG stream (seed 25 rolls L, T, L, X, I - the jackpot
demos on the fourth fresh-night pull), never Math.random. Scenarios:
NIGHT 4/5 (the shipped data.ts mock run state, one pull then the full
deny), FRESH NIGHT (empty pouch, five pulls to exactly full and broke),
BROKE (day 6 price 50 against 35 cr), SHOP HOURS (offline). `?instant`
in the URL forces the reduced-motion path - every beat lands
synchronously - which is also exactly what prefers-reduced-motion
players get; no build step, the page is inline script only.

Demo-mock copy owing gates at integration: the whole dial-in and
teardown vocabulary (UNREGISTERED CHANNEL, hop / dead relay / [no
record] / LINKED / dead air, the crypt and baud lines, "keys burned.
session never happened.", NO CARRIER), the prompt label nobody@nowhere,
the banner tag "SALVAGE EXCHANGE // NO NAMES ON FILE", the command nouns
and help descriptions, the listing rows (TONIGHT ONLY, UNSORTED, A CRATE
FULL), the SHORT and JACKPOT strips, and the new vendor lines ("Tonight,
same as every night. One crate.", "It spends the same as clean money.",
"No tab. A tab needs a name and there are no names here.", the closer
rotation, the easter-egg replies). Reused round-1 w-darknet lines
("Salvage off a hundred dead machines...", "Pay first. Shape is the
surprise...", "Told you. Never know what you're gonna get.", "Dealer is
not a storage locker...", "No refunds. No complaints line...", "Signal
only holds after the shop shuts...") still owe the same gate. Canon
anchor is lore ledger ruling 9 (anonymous dealer, no ID, signal only
after close) - the study is built inside it. Teaching note for the
tutorial gate: teaching.ts already owes darkWebBuy at first contact
"upgrade"; the HELP/LIST flow here is tier-0 self-teaching and should be
weighed against that moment at integration. Sound note: the reveal beat
pairs with the shipped darknetReveal preset (audio.ts); studies ship
silent.

INTEGRATED 2026-07-29 (cycle ux-2026-07-29-darknet-cli) as a full rewrite
of `kernel-panic-site/app/src/components/os/windows/darknet.tsx` (the
terminal engine ported to React: imperative append-only log region inside
a React shell, one engine per mount) plus the `.kp-dnet` block in
styles.css and shop-os wiring (window width 560 to 680, EXIT closes the
window via onExit). Gates: loremaster 9/9 copy groups APPROVE plus both
structural questions (ledger ruling 9 covers everything; the vendor's
--ch2 voice ruled a legal tint echo); tutorial 4 COVERED, 1 tier-0
NEEDS-TEACHING. Deltas vs this study, both gate-driven and both approved
by the loremaster in addendum: a fifth persistent RATE chip in the status
strip (always shows darkPullPrice while the market is open, "----"
offline; the study buried tonight's price behind HELP/LIST) and the
dial-in closer now reads "type HELP for trades, or click one below."
In-game beats the study could not carry: BUY dispatches the reducer's
own buyDarkPatch (the reveal scramble lands on run.lastDarkBuy, the
reducer's deterministic roll, never a client roll), the shipped
darknetLinkUp / darknetLinkDown / darknetReveal presets voice the link
and the drop, closing the night under an open channel plays a live
"carrier lost." link-drop beat, and EXIT's NO CARRIER teardown closes
the window itself. The demo rig's seeded-LCG pulls and scenario rows
stay demo-only; this page remains the design-history reference.
