# Brief: ui-integration-2026-07-29

Goal: the kpos-shell v2 desktop (user-approved) becomes THE game UI. Fully
integrate the new desktop shell, the four study windows (INBOX, LOADOUT.CFG,
SOLDER.BAY, REPAIR.LOG), and the DIVE.EXE duel view from `ui-demos/kpos-shell/`
into `kernel-panic-site/app/` as native React surfaces bound to live run
state. Bring every remaining surface to the same standard: DARKNET.LNK,
LEDGER.LOG, DAD.LOG, MANUAL.TXT, story windows, DIAG, NIGHT.SYS (end of
day), BACKROOM.LCK + the finale (the machine) presentation, DesktopIdle,
the abandon dialog, boot/login. Everything on every new window must
FUNCTION: live data, working buttons, working charts/logs. New dialogue
where surfaces need it (inbox subjects are real Rhea lines about the order,
not riffs). New art fills the windows in the established mixed language:
pixel art for icons/glyphs, 1-bit dithered anime-esque imagery for window
cells (dither.py recipes).

SOURCE OF TRUTH: `ui-demos/kpos-shell/` and its README.md rulings. The demo
is approved; nothing re-litigates its look. Agents extend its grammar to
the surfaces it does not cover and supply the copy and art it stubbed.

## Integration architecture (Orchestrator, for reference)

- Native React ports, no iframes. Demo CSS (kp.css/system.css/windows.css +
  study styles) lands as the app's game stylesheet; class vocabulary is the
  demo's `kp-*`.
- INBOX becomes the day-loop front door: subject list; opening a ticket
  shows the CUSTOMER.REC card. The reducer's `analyze` screen RENDERS AS
  the expanded card inside INBOX (same surface id, same teaching anchors)
  with READOUT datarows (tell, dominant routine, threat, grid, intrusion
  RAM, head-start warning) and actions: CONFIGURE KIT / DIVE. The card's
  DIVE dispatches the real dive. JOBS.QUE icon and badge fold into INBOX.
- REPAIR.LOG renders the `result` screen (dossier: verdict, strain trace,
  itemized payout, AUGMENT CACHE draft, patch poster, pouch strip, dive
  log rail, sparklines). All widgets live: the log lists the actual duel
  events of the finished dive, charts draw from the actual result numbers.
- DIVE.EXE replaces the duel presentation wholesale (schematic board,
  BUS.LOG, program rail, telemetry, console strip, INTRUSION naming, the
  countless threat banner). Finale and tutorial get dressed variants.
- NIGHT.SYS, story framing (MORNING.LOG), DARKNET.LNK, LEDGER.LOG,
  DAD.LOG, MANUAL.TXT port from the demo's w-* windows, bound to live
  state.

## Scope: ux-agent

Round-2 revision of `pipeline/proposals/ux-agent.json` (the v2 system
supersedes the per-window channel assignments of round 1). Items:

1. A `ui-spec` codifying the v2 token/system block for the app (hue sets,
   inverse-video danger, ink-tint imagery, solid-ink title bars, X-only
   chrome, no-scrollbar law, window footprints).
2. Specs for surfaces WITHOUT a study, extending demo grammar (each with
   acceptance checks): INBOX analyze-card absorb (card + READOUT + DIVE
   button placement), NIGHT.SYS (from w-shopfront paintNight), MORNING.LOG
   story framing (paintStory), BACKROOM.LCK finale-eve screen, finale
   DIVE.EXE dressing (vs the standard skin), DesktopIdle (no-run desktop +
   OPEN THE SHOP moment), abandon dialog, tutorial dive dressing (bench
   coach line form), REPAIR.LOG live-widget bindings (what each chart and
   the dive log show, empty/edge states), LEDGER.LOG and MANUAL.TXT and
   DAD.LOG deltas if the demo versions need live-state adjustments.
3. The leader-line teach callout as an integrated spec (form only; anchor
   classes preserved so existing moments re-anchor).
4. SFX: port list for the demo sound.ts additions into audio.ts presets
   (ids, buses, when), flagged add vs tune.
5. Art orders (`pipeline/art/orders/`, treatment field per kp-contracts):
   the customer roster's card imagery (1-bit portrait + device macro per
   customer missing one), REPAIR.LOG happy-client figures for the roster,
   MANUAL.TXT diagram pages (the banked solder-bench art is available in
   `ui-demos/kpos-shell/art/`), DARKNET.LNK vendor cell if the window
   wants one, story still re-treatments only if the pixel originals fail
   the ink-tint. Sizes are exact cell px per the spec you write.

Constraint: structure and interaction of the studies are settled; specs
cover only what integration needs decided. No mechanics changes.

## Scope: narrative-director

New player-facing copy, filed as proposal items (envelope per contracts;
`scene`/`journal` types only if a gap demands them, this is a copy pass):

1. INBOX subject lines: real one-line subjects FROM RHEA about each
   pending order, one per customer job (subject format the spec names,
   e.g. "RE: <device>"). Cover every customer in `content/customers.ts`
   for every tier they appear at; subjects read as Rhea routing work to
   the bench, terminal voice.
2. Replacement lines for every demo-mock string in the kpos-shell README
   inventory that ships: LOADOUT.CFG ("DIVE KIT", load/ready status
   lines, photo tags, "SEVERS AT ZERO."), SOLDER.BAY dialogue-box status
   lines and SCHEMATIC/WORKPIECE/LAST WELD labels, DIVE.EXE console
   default hints, route-row labels and states (YOUR ROUTE / ITS ROUTE,
   OPEN / SEVERED / CLOSING / CUT / AT THE CORE), the countless threat
   banner, the BUS.LOG vocabulary (tap spliced / bus live / twist /
   charging / round dividers), result bill framing, NEW DIVE, the device
   cell tag, REPAIR.LOG dive-log flavor lines, INBOX footer hint. Where a
   demo line is already right, adopt it verbatim as your item so it gets
   gated on the record.
3. The INTRUSION rename: the machine is INTRUSION on every duel surface
   (replaces SIG-0). Present it as an item for the loremaster to rule on.
4. Any copy orders the tutorial gate files this cycle.

## Gates

- loremaster: everything above, PLUS the standing demo-mock inventory in
  the kpos-shell README (it ships this cycle), the INTRUSION rename, the
  Rhea subject lines (is this how Rhea talks? does she route orders?),
  customer figure likenesses (no appearance canon exists; ruling or bible
  addendum needed before art-lead draws the roster), diegetic claims (the
  BENCH FEED camera, the device cell "the OS shows what the bench is
  tapped into").
- tutorial-agent: the INBOX analyze-card absorb (anchors and moments
  survive the move), BUS.LOG and route-row legibility, REPAIR.LOG widget
  comprehension, the owed solder-bay-intro moment (the demo's gain-arm
  blink is claimed as partial tier-0 coverage; rule on it), night/darknet
  flow, teach callout form change, and whether any new surface adds a
  mechanic row or waiver.

## Budgets

- Art: up to 60 Higgsfield credits this cycle (nano_banana_pro, ~2/img).
  PixelLab stays reserved. Two attempts per order max, per art-lead rules.
- Copy: no line count cap, but every line passes both gates.
- Balance: ZERO. No curve, kit, or arc changes. Curve targets unchanged
  (D1 82 ... finale 25). Sims must stay green through integration.

## Copy rules

Terminal voice, clipped, diegetic. No em or en dashes anywhere in game
copy. Rhea calls the machine "the virus" until the story says otherwise;
duel surfaces name it INTRUSION pending the loremaster ruling.
