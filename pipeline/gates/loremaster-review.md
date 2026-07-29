# Loremaster gate review

Cycle: `ui-integration-2026-07-29` (`pipeline/BRIEF.md`). This file REPLACES
the prior `loremaster-review.md` (the `ux-2026-07-28-kpos-redesign` review)
wholesale, per this cycle's instructions. That prior review's one REVISE
(the shipped `boot.tsx` "OVERBY REPAIR BENCH BIOS v9.2" line) is CONFIRMED
FIXED: re-grepped `boot.tsx`, `desk.tsx`, `report.tsx`, and the whole
`components/os` tree for "overby" (case-insensitive) this session and found
nothing; the line now reads `"REPAIR BENCH BIOS v9.2"`.

Gated against `lore/bible.md` and `lore/ledger.md`, both current as of this
session's edits (below). Cross-checked copy-reuse and "unchanged"/"adopt"
claims directly against shipped source: `content/customers.ts` (full
12-customer roster), `content/story.ts` (Rhea's day-open voice, the sector
reveal lines), `content/journal.ts`, `content/kit.ts`, `components/os/boot.tsx`,
`components/game/duel-board.tsx`, `components/game/duel.tsx`,
`components/game/screens.tsx` (`FinalePre`), `components/os/shop-os.tsx`
(the tutorial/finale `isFinale` branch), and the two Dex Marlowe art files
in `ui-demos/kpos-shell/art/`. No em or en dash found anywhere in
`pipeline/proposals/narrative-director.json`, `pipeline/proposals/ux-agent.json`,
or `ui-demos/kpos-shell/README.md`.

## Canon rulings made this gate

Two genuine gaps, decided and written into the lore files before gating
against them, per the standing "decide the gap, then gate" method:

**1. Customer appearance canon (`lore/bible.md`, "The customers" section).**
No customer in `content/customers.ts` or the bible ever had a physical
description; this cycle's art orders are the first request for one. Ruled
in the bible for the five customers this cycle's open orders need (Juno
Vex, Sable Okonkwo, Aldous Wick, Wren Tallis, Bram Hollander), adopting the
ux-agent's own proposed descriptions (they were already well-grounded in
each customer's shipped `quotes`/`winLine`, e.g. Aldous's cardigan-and-
glasses reading against his "forty years of accounts" line, Bram's apron
against his "eleven years" line) rather than inventing competing ones.
Also ratified Dex Marlowe's already-shipped card art
(`ui-demos/kpos-shell/art/dex-portrait.png`) into the bible as the single
written source of truth, per this brief's own instruction to treat it as
established. The other six customers (June Aksoy, Ines Calloway, Emeric
Snow, Vera Stanek, Casimir Bell, Noor Behzadi) still have no appearance
canon; that is correct, since no art is on order for them this cycle, and
the bible's new intro line says so explicitly so nobody invents one early.

**2. Dive opponent identity tag, "INTRUSION" (`lore/ledger.md`, new
Resolved ruling 11).** The narrative-director's `ui-copy-dive-intrusion-identity`
item asked for a ruling rather than deciding it themselves; this is that
ruling. Full reasoning under the item's own verdict below; summary: APPROVE,
because INTRUSION is the world's own generic diagnostic classification
("Every shop ticket is an intrusion job," bible), not a name, and it says
no more than the already-shipped threat-banner prose and the already-shipped
"THE MACHINE" job title said on these same pre-finale dives before this
cycle touched anything.

## Explicit questions this brief asked directly

**Is the INBOX subject-line voice Rhea's, and does she route orders to the
bench in canon?** Yes to both. Voice: the bible's Rhea entry is exact -
"Voice: dry, protective, deflects feeling into logistics" - and all twelve
subjects read that register: dry factual relay ("RE: Copperline register.
His own till locked him out after eleven years."), the protective instinct
surfacing as urgency ("RE: Ferrox lifter suit... Before somebody gets
hurt."), and dry deadpan humor ("RE: Nocta cram deck... Convenient.").
Several are near-verbatim reuses of the customer's own shipped `quotes` or
the bible's own flavor line (Emeric's "Fifty years I have played that
cabinet" from `customers.ts`; Casimir's "the vault grew a lock nobody
bought" from the bible itself), which is exactly the "reads as Rhea
relaying what she was told" register the brief asked for, not the
customer's own first-person voice. Routing: the will is explicit about the
shop's division of labor - "You take the bench. You are bad with people and
she is bad with computers. Between the two of you there is exactly one
whole shopkeeper" (bible, The player - the son) - and Rhea already narrates
incoming jobs to the player in shipped `story.ts` day-open scenes ("The
Kestrel courier drone is back. Same customer, new complaint.",
`story.ts:808`). An inbox of Rhea's subject lines routing tickets to the
bench is a UI-native version of a behavior the game already ships, not an
invention.

**Diegetic claims: BENCH FEED and the DIVE.EXE device cell.** Both APPROVE,
same reasoning, different strength. BENCH FEED (carried into this cycle
from LOADOUT.CFG, already approved last gate) rests on an inference from
"watches the feed" (bible, Rhea). The DIVE.EXE/INBOX device cell ("ON THE
BENCH // {DEVICE}", "the OS shows what the bench is tapped into") needs no
inference at all: "the bench (the player's)" is named shop furniture
(bible, The shop) and "a dive is a duel on a shared grid" happens because a
tech physically connects to the customer's device to work it (bible,
Technology rules; "repair techs dive customer machines for pay," The
world). A terminal readout naming whatever is wired in at the player's own
station is the more mundane of the two claims, not a new one.

## `narrative-director.json`

Inbox subjects (all twelve; voice and routing question answered above,
each also checked individually against its customer's `tiers`/`dominant`/
`quotes` in `content/customers.ts` and the bible's flavor line for drift -
none found):

- subject-juno-vex: APPROVE
- subject-sable-okonkwo: APPROVE
- subject-aldous-wick: APPROVE
- subject-wren-tallis: APPROVE
- subject-bram-hollander: APPROVE
- subject-dex-marlowe: APPROVE
- subject-june-aksoy: APPROVE
- subject-ines-calloway: APPROVE
- subject-emeric-snow: APPROVE
- subject-vera-stanek: APPROVE
- subject-casimir-bell: APPROVE
- subject-noor-behzadi: APPROVE

UI copy:

- ui-copy-loadout-status: APPROVE. All eight lines adopt verbatim from an
  already-approved window (`kpos-loadout`, prior gate). "BENCH FEED"
  photo-tag re-confirmed under this cycle's diegetic-claims ruling above.
- ui-copy-solder-dialogue: APPROVE. Adopts verbatim from the already-
  approved SOLDER.BAY window; consistent with the established soldering
  register (bible: "the soldering lesson: 'it only sticks where you have
  cleaned'"; journal's SOLDER SMOKE entry).
- ui-copy-dive-console: APPROVE. Pure engine-notice/targeting prose, no
  story claim, terminal voice, no dashes.
- ui-copy-dive-routes: APPROVE. Qualitative route states only (OPEN /
  SEVERED / CLOSING / CUT / AT THE CORE); correctly notes it says YOUR/ITS
  only, never an opponent identity noun, so it does not touch the
  INTRUSION ruling either way.
- ui-copy-dive-threat-banner: APPROVE. `closingBanner` replaces a countdown
  number with qualitative urgency; already used "INTRUSION" as a common
  noun in this exact banner before this cycle touched it (verified,
  `duel.tsx:631`, current shipped text), so this is continuity, not a new
  claim.
- ui-copy-dive-intrusion-identity: APPROVE, per new ledger Resolved ruling
  11 above. One more sub-question this item itself raised, now closed:
  no relabeling is needed if the finale dive is won, since the identity
  reveal (the name Patch) is sequenced into the `finaleWinScene` that plays
  after the dive ends, not into the dive's own UI (ledger: "A finale win on
  any run unlocks the full truth and the PATCH entry immediately"). DIVE.EXE
  may read INTRUSION straight through the winning finale dive itself.
- ui-copy-dive-buslog: APPROVE. All 26 lines are mechanical bus-event
  prose (`twist {addr}`, `cascade x{n}`), no character voice, no reveal-
  schedule content, no dashes. The item's own open question (whether
  REPAIR.LOG's dive-log rail should inherit this lowercase register or a
  distinct ALL CAPS "closed case" register) is a presentation call for
  ux-agent, not a canon one; noting it here only to confirm it does not
  block this item.
- ui-copy-dive-device-tag: APPROVE, per the diegetic-claims ruling above.
- ui-copy-dive-result-overlay: APPROVE. Hero verdicts and VIEW BOARD are
  already-shipped strings (confirmed, `screens.tsx`). Checked the new
  `billNeuralStrainLossValue` ("ZEROED. THE RUN IS OVER.") against two
  distinct existing strings to make sure it collides with neither: it is a
  caps-compressed version of the RESULT screen's own existing sentence
  ("Neural Strain zeroes. The run is over.", `duel.tsx:907`), not the
  separate run-death blackout line the bible quotes verbatim ("NEURAL
  STRAIN: ZERO. CONNECTION SEVERED.", `story.ts:36`) - the two surfaces
  stay distinct strings, nothing here overwrites the bible's quoted line.
- ui-copy-repairlog-connect-lines: APPROVE. All twelve checked individually
  against `customers.ts`; each names the correct device brand and reflects
  that customer's actual complaint (e.g. Bram's "CHECKS ITS OWN ID FIRST"
  against his `dominant: "lock"` and his own register-walls-off-the-till
  line; Vera's "HUMS ON BACKUP POWER" against her power-rationing quote).
  No new fiction, just device-boot flavor.
- ui-copy-inbox-footer: APPROVE. Matches the shop's established paperwork
  vocabulary (bible, The shop: "the ticket spike, the ledger").

## `ux-agent.json`

- kpos-v2-tokens-system: APPROVE. Tokens, footprint table, chrome
  housekeeping; no player-facing prose beyond bare labels.
- kpos-inbox-window: APPROVE. The device-macro/portrait fallback rule
  ("never blank... shows either its ordered macro art or a second copy of
  the customer's existing portrait") is sound regardless of the appearance-
  canon ruling above. Dropping the card study's own TICKET RATE / LAST
  CLEAN BOOT / POUCH DROPS rows (no reducer backing, flavor-only) in favor
  of the real READOUT field set is the correct call: those three would have
  been invented facts with no source, and the item correctly keeps
  `MODE_TELL`'s honest tell line (bible, Technology rules: "The Analyze
  diagnostic's tell is always honest").
- kpos-repairlog-window: APPROVE. The new "NO PIECE THIS TICKET" patch-
  poster state ("Nothing came off this one. The next clean run still
  banks.") is consistent with the shipped drop rule (pieces "come off the
  darknet, drop from cleared jobs, or bank on clean wins," `screens.tsx`
  `PouchCard`). All itemized bill rows are stated as reading existing
  `lastResult` fields, no new claims.
- kpos-dive-exe: APPROVE. Conditional SIG-0/INTRUSION swap now clears per
  ledger ruling 11 above; proceed with the rename. The no-countdown-number
  banner change is a legibility choice, not a fiction claim.
- kpos-dive-tutorial-finale-dressing: APPROVE. Verified the two lines this
  item leans on hardest are genuinely unchanged, not just claimed so:
  `jobTitle`/`jobSub`/tell-line branch confirmed at `shop-os.tsx:229-246`
  ("THE MACHINE", "Everything it has. Everything you have.", "It runs
  every config you have ever seen, at full width." - all pre-existing).
  Worth noting for the record: this same source confirms the tutorial dive
  shares the "THE MACHINE" job title with the finale (`isTutorial ||
  isFinale`), which is the fact that makes the INTRUSION ruling's coverage
  of pre-finale tutorial dives a real case, not a hypothetical one - and
  "THE MACHINE" is already at least as identity-bearing as "INTRUSION"
  would be, so nothing here is a bigger reveal than what already ships.
- kpos-night-sys: APPROVE. BUY BLIND becoming a redirect to DARKNET.LNK
  instead of a direct purchase is a UI-flow change, not a fiction change;
  the darknet purchase fiction itself is unmodified (ledger Resolved
  ruling 9).
- kpos-morning-log: APPROVE. No copy or scene content changes; chip
  styling only.
- kpos-backroom-lck: APPROVE. Verified "OPEN THE BACK ROOM" and "CONFIGURE
  KIT" are already-shipped labels (`screens.tsx:106-108`), not new copy;
  the danger-styling change for Day 10's one-way door is presentation, and
  matches the bible's own framing of the seal as the thing that "does not
  open so much as let go."
- kpos-desktop-idle: APPROVE. Byte-identical copy claim confirmed against
  `screens.tsx`'s existing DesktopIdle text; only frame chrome changes.
- kpos-abandon-dialog: APPROVE. Confirmation chrome only; dispatch and
  copy unchanged.
- kpos-teach-callout-v2: APPROVE. Pure geometry/re-anchoring; no copy.
- kpos-utility-window-deltas: APPROVE. LEDGER.LOG/DAD.LOG/MANUAL.TXT stay
  byte-identical per the item's own claim; the new MANUAL.TXT diagram cell
  is covered by its own art order below.
- solderPickup, solderHoverLegal, solderHoverIllegal, solderArc,
  solderReject: APPROVE (all five, by reference to the prior gate-cleared
  craft-station cycle; carried forward unchanged). Pure sound design, no
  player-facing prose.
- pageFlip: APPROVE. Pure sound design.
- winFocus: APPROVE. Pure sound design.

## Art orders (`pipeline/art/orders/*.json`, status open)

Device macros need no appearance ruling (they visualize already-named
shop hardware, not a person):

- cust-card-juno-device: APPROVE. Matches "Hexlight arcade handheld" and
  Juno's own quote about the menu loading before she touches it.
- cust-card-sable-device: APPROVE. Matches "Kestrel courier drone" and her
  route-hijack complaint.
- cust-card-aldous-device: APPROVE. Matches "Meridian ledger terminal" and
  his own "forty years of accounts in that terminal" line exactly.

Portrait and figure orders, now cleared by this session's new bible
appearance canon (see Canon rulings above):

- cust-card-juno-portrait: APPROVE, per bible "The customers" (Juno Vex
  appearance line added this session).
- cust-card-sable-portrait: APPROVE, per bible (Sable Okonkwo appearance
  line added this session).
- cust-card-aldous-portrait: APPROVE, per bible (Aldous Wick appearance
  line added this session). Confirmed the brief's own read of his winLine
  is accurate ("You do honest work, son," `customers.ts:62`) and is a term
  of address, not a name; the bible's new line says so explicitly so this
  never gets misread as a naming-law violation later.
- repairlog-figure-wren: APPROVE, per bible (Wren Tallis appearance line
  added this session).
- repairlog-figure-bram: APPROVE, per bible (Bram Hollander appearance
  line added this session).

Reuse order:

- manual-patch-bench-diagram: APPROVE. Zero new generation; the same
  diegetic reasoning already established for LOADOUT.CFG's service-manual
  plate applies directly to a MANUAL.TXT equipment diagram (a manual
  showing a picture of the tool it documents is the paradigm case of
  "why would the OS show this," not an edge case of it).

## `ui-demos/kpos-shell/README.md` standing demo-mock inventory

Per this cycle's instruction, one ruling where the narrative-director
already adopted a line:

- LOADOUT.CFG labels (DIVE KIT, load/ready lines, photo tags, SEVERS AT
  ZERO): covered by `ui-copy-loadout-status` above. Same verdict: APPROVE.
- SOLDER.BAY dialogue-box status lines: covered by `ui-copy-solder-dialogue`
  above. Same verdict: APPROVE.
- INBOX footer hint: covered by `ui-copy-inbox-footer` above. Same verdict:
  APPROVE.
- REPAIR.LOG furniture, "KP/OS REPAIR BENCH v9.2": no narrative-director
  item covers this one; it is desktop/window chrome, not a copy-pass item.
  Verified directly: it already ships, name-free, in three places
  (`boot.tsx:13` as "REPAIR BENCH BIOS v9.2", `desk.tsx:27` as "KP/OS v9.2
  // REPAIR BENCH", `report.tsx:614` as "KP/OS REPAIR BENCH v9.2"),
  consistent with the anonymized register ledger Resolved ruling 8 requires
  ("Overby leaves canon... Forbids any bill, document, gravestone, or line
  ever spelling out a first or last name for the son, Dad, or a surname for
  Rhea"). APPROVE, confirmed clean, nothing further needed.

## Voice check (em/en dashes)

Grepped `pipeline/proposals/narrative-director.json`, `pipeline/proposals/ux-agent.json`,
and `ui-demos/kpos-shell/README.md` for `—` and `–`: no matches in any of
the three (bible, Voice - hard laws: "NEVER em dashes or en dashes in
player-facing copy. Periods, commas, or '...' only."). Two incidental
hits for the word "virus" were checked and are both non-player-facing: one
in the narrative-director's own analysis notes quoting the ledger's phrase
"Rhea's virus theory... was always a reasonable in-world inference"
verbatim (rationale field, never shown to a player), one a CSS class name
(`dv-virus`) in a ux-agent spec field describing DOM structure. Also
re-confirmed the whole `components/os` tree and `boot.tsx` grep clean for
both "overby" and em/en dashes.

## Tally

Items seen: 52 (23 narrative-director.json + 19 ux-agent.json + 9 open art
orders + 1 standalone README item; 3 further README items cross-reference
already-counted narrative-director items per this cycle's own instruction
and are not double-counted). Approved: 52. Revised: 0. No NOTE issued.
Two canon gaps closed this pass, both written into the lore files before
gating against them: `lore/bible.md` gained appearance canon for five
customers plus Dex Marlowe's ratified established look; `lore/ledger.md`
gained Resolved ruling 11 (the INTRUSION dive-opponent identity tag).
