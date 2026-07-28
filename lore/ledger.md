# KERNEL PANIC - STORY LEDGER

Maintained by LOREMASTER. Ground truth plus the run-by-run knowledge table.
The Narrative Director's reveal schedule must never outrun this table.
Sources: `content/story.ts` (scenes keyed by run number), `content/journal.ts`
(unlockAtRun fields), `content/customers.ts`. Shipped copy outranks the GDD.

## Ground truth

What actually happened to Dad:
1. Dad raised the two kids alone; the family's shape is never explained and
   never will be (there is no "she"; excised from canon, Resolved ruling 1).
   He started spending his nights with the machine, building something for
   his son: "The shop and I have some talking to do." (sector 2; the
   sector's opening line is being rewritten this session, see note below).
2. He built and trained an AI by diving his own back-room tower nightly after
   close, for years: 9,000+ logged hours, no client, no ticket, no pay.
3. The hours scarred him: NF-3 neurofilament degradation, stage three. He hid
   it: weekly cash suppressants for six years from the pharmacy on 9th,
   eleven unpaid Meridian Neurocare bills filed under W.
4. Ordered to CEASE ALL DIVE ACTIVITY IMMEDIATELY, he kept diving: once the
   diagnosis landed, finishing Patch stopped being a project and became the
   inheritance. He would not leave his kids with nothing, and he had faith
   they would be smart enough to reach what he built; that is why the order
   changed nothing. The last suppressant receipt is dated four days before
   he died. The strain killed him: "not an accident and it was not a job."
5. He recorded fragments of himself into the machine as cargo (nine sectors)
   and left a final message. He sealed the back room himself with a standing
   order: open only for a fair, assist-free win by his son. "Not until he can
   beat you square. Promise me."
6. The will splits the shop: counter to Rhea, bench to the son, "The back
   room stays locked until it does not."

What Patch is:
- The AI companion Dad built FOR HIS SON. Not a virus, not a weapon, not a
  tool ("I stopped thinking of you that way a long time ago"). Shares the
  same substrate as every intrusion in the city, a living AI inside a
  machine (Resolved ruling 5), but was built and raised, not caught; "not a
  virus" is hard law regardless.
- Gatekeeper, sparring partner, curriculum: it paces difficulty to the
  player and never throws a game. It was the opponent in every back-room
  dive and "never once let you win".
- Custodian of sectors 1-7 and of sector 8 (the day Dad died, withheld as
  its own grief, not training cargo). The finale message is sector 9: Dad's
  real, degraded recordings as source, reconstructed by a voice Patch
  practiced "until it matched his" (Resolved ruling 4).
- Named Patch under the house naming rule: "the thing that holds a broken
  thing together while it mends." After the finale it joins the shop; the
  back room is his.

What Rhea believes vs what she knows:
- Believes (runs 1-2): the quarantined-virus story, asserted flatly and then
  repeated to steady herself ("That is all it has to be."). She invented
  this story herself; Dad never told her (Resolved ruling 2). It was a
  reasonable guess, not naivety: viruses in this world are living AI, so it
  was the ordinary explanation for an extraordinary, locked-off machine
  (Resolved ruling 5).
- Knows from childhood, before any run: Dad spent nights in that room for
  years, talking through the wall (she thought it was the radio), and came
  out smiling.
- Learns by investigation, never by diving: run 3 watches the feed (it
  waited), run 4 reads the intrusion logs (it paces), run 5 (it learns, it
  is kind first), run 7 the power bills (he fed it for years; "You do not do
  that for a virus"), run 8 renounces the theory ("I do not think it is a
  virus... I think it has been waiting").
- She never reaches the ground truth before the finale: no shipped line gives
  her Patch's name, Dad's diagnosis, or the seal condition. Nothing shipped
  says she was ever lying; play the erosion as honest.
- Post-finale: acceptance. "Some virus. He laughs at the edges the way Dad
  did." She sits with Patch; she still calls it the virus as a joke.

## Reveal channels

- Openers: `runOpenerScene(run)`, bespoke for runs 1-6, three-scene fallback
  cycle for 7+ (7 coffee, 8 "so does my theory", 9 the dream, then repeat).
- Enders: `runEndScene(run)`, bespoke for runs 1-8. Sectors 1-7 play on runs
  2-8. Runs 9+ alternate two fallbacks: "SECTOR SCAN: NO NEW DATA", echoing
  sector 1 (odd runs) and sector 4 (even runs).
- Journal DAD.LOG (`unlockAtRun`, visible once runCount >= N): 0 THE WILL and
  THE BACK ROOM; 1 ANOTHER FAILED RUN; 2 THE DRAWER OF BILLS; 3 SOLDER
  SMOKE; 4 RECEIPTS; 5 THE DIAGNOSIS; 6 NO TICKETS; 8 IT IS GRADING ME;
  finale-gated (requiresOpened) PATCH.
- The finale sits on Day 10 of EVERY run. A finale win on any run unlocks the
  full truth and the PATCH entry immediately, regardless of table row.

## Run-by-run knowledge table

"After run N" = run N has ended: openers 1..N and enders 1..N seen, journal
entries with unlockAtRun <= N readable. Knowledge is cumulative.

| Run | New this run (source) | After run N the player can possibly know |
|---|---|---|
| 1 | Opener 1, Ender 1; J: WILL, BACK ROOM (0), ANOTHER FAILED RUN (1) | Shop inherited with debt. Rhea's virus story. The room's lock opened "like it was expecting me". The machine did not fight; it graded him and shut the door. |
| 2 | Ender 2 = SECTOR 1 (solder lesson); J: BILLS (2) | Dad had stage-three NF-3 and secret medical debt bigger than a year of shop income ("He was not a diver. As far as I knew."). The machine emits Dad-memories on a loss. Rhea's certainty cracks ("That is all it has to be."). |
| 3 | Ender 3 = SECTOR 2 (Dad begins his nights with the machine); J: SOLDER SMOKE (3) | It waited at the core: not virus behavior. Dad started spending his nights building something in the back room. Player theory: the fragments are cargo, not corruption. (Sector 2's opening line is gated and pending integration to remove the excised "she" reference, Resolved ruling 1.) |
| 4 | Ender 4 = SECTOR 3 (recording test); J: RECEIPTS (4) | The machine paces its opponent. Dad deliberately recorded messages meant to be heard in his voice ("He should hear it in my voice"). Suppressants weekly for six years, last filled four days before he died: the illness was strain, hidden, long. |
| 5 | Ender 5 = SECTOR 4 (keep the door shut); J: THE DIAGNOSIS (5) | The machine learns and is kind first. Dad instructed it: "Not until he can beat you square... No shortcuts." 9,000+ logged dive hours; CEASE ALL DIVE ACTIVITY; he kept going. Inferable now: Dad built the test, and diving killed him. |
| 6 | Ender 6 = SECTOR 5 (not a tool); J: NO TICKETS (6) | The thing in the machine is a someone: Dad apologized to it and would not call it a tool. No client ever existed; the hours, the strain, and the death were for something he was building in secret, "on an installment plan". |
| 7 | Fallback opener; Ender 7 = SECTOR 6 (one more game) | The power bills: he fed it for years, out of pocket. "You do not do that for a virus." Dad played it nightly, trained it, ordered it never to go easy on him. |
| 8 | Opener "so does my theory"; Ender 8 = SECTOR 7 (naming); J: IT IS GRADING ME (8) | Its name is Patch, built for "him", named for holding a broken thing together while it mends. Rhea drops the virus theory. Player concludes: a curriculum, not a lock. "Dad did not seal something in. He left something waiting." Knowledge is now complete except direct confirmation, Patch's own voice, and Dad's final message. |
| 9 | Fallbacks (echo of sector 1) | Nothing new. Rhea: "One of these nights it is going to let you through. I have started believing that." |
| 10 | Fallbacks (echo of sector 4) | Nothing new. |
| 11 | Fallbacks (echo cycle repeats) | Nothing new. |
| 12 | Fallbacks | Nothing new. Knowledge plateaus at the run-8 state until a finale win. |
| Finale win (any run) | `finaleWinScene()`; J: PATCH (requiresOpened) | Full truth: seal condition "A FAIR WIN, NO ASSISTS"; Patch was across the grid every dive and never once let him win; Dad's final message in his voice; Rhea sits with Patch; counter hers, bench his, back room Patch's. |

Reveal-schedule rules derived from the table:
- Nothing may name Patch before the run-8 ender (sector 7).
- Nothing may state the seal condition before the run-5 ender (sector 4);
  IT IS GRADING ME (run 8) may restate it as the player's inference.
- Dad's own diving and the 9,000 hours: not before run 5 (THE DIAGNOSIS).
  From run 2 (BILLS) his illness may surface as mystery only.
- Rhea's first crack is the run-2 ender; first evidence-based doubt is run 3;
  renunciation is run 8. Nothing earlier, nothing later.
- Before the finale, no content may confirm that the machine's occupant
  speaks, or give it a personality or pronoun beyond the player's "it".
- No content may ever reference a mother, an absent parent, or explain the
  family's shape beyond "Dad raised the two kids alone" (Resolved ruling 1).
- No content may show or imply Dad ever told Rhea the quarantine story; it
  is hers alone, invented (Resolved ruling 2).
- Sectors 8 and 9 never appear as numbered playback fragments, in the run
  2-8 schedule or any run 9+ fallback cycle (Resolved ruling 3).
- No given name or surname for the son, Dad, or Rhea's family line may ever
  appear in any content, official-document copy included (Resolved
  ruling 8).

## Resolved rulings (2026-07-25)

All eight prior open questions are decided by the user. This record stands;
do not reopen without a new explicit ruling.

1. THE MOTHER: excised from canon entirely. There is no "she". Dad raised
   the two kids alone; the family's shape is never explained, ever. Forbids
   any future reference to a mother, her fate, or why it was just Dad. The
   shipped sector 2 line "She took the car and the quiet with her." is being
   rewritten this session (see note below).
2. COVER STORY: Rhea invented the quarantine story herself; Dad never told
   her. Forbids any flashback or line of Dad briefing her on it. Permits it
   to stand as her honest, self-generated guess.
3. SECTORS 8/9: sector 8 is the day Dad died, withheld by Patch as its own
   grief, not training cargo; it never plays as a numbered fragment in runs
   1-12. Sector 9 is the raw material behind the final message, delivered
   whole at the finale, never staged separately. Forbids either sector
   appearing in the run 2-8 schedule or any run 9+ fallback cycle.
4. FINALE MECHANISM: reconstruction. Dad's real, degraded recordings
   (sector 3) are the source; Patch's practiced voice carries the rest,
   blended without a seam. Forbids any future line claiming pure archival
   tape, or pure Patch synthesis with no real recording behind it.
5. NATURE OF INTRUSIONS: viruses in this world are AI, dynamic and alive,
   infecting machines the way biological viruses infect a body; clearing
   one fights back, which is why every job is a dive. Mundane, unexplained
   epidemic; no causal link to Patch, Dad, or the shop. Patch shares the
   substrate (a living AI in a machine) but was built and raised, not
   caught; "not a virus" stays hard law regardless. Bonus this buys: Rhea's
   virus theory was always a reasonable in-world inference, not naivety,
   supporting the erosion being played as honest.
6. MERIDIAN: one conglomerate spanning office/ledger hardware and Meridian
   Neurocare the clinic. Optional dark irony; never required to surface.
7. TIMELINE: no dust. The shop is buried in Dad's clutter; he was a messy
   genius and Rhea has been clearing it since he died. Death-to-run-1 gap is
   short, days to weeks. The padlock survives as the one deliberately
   cared-for thing amid the mess. Forbids any "decade of dust" or long
   post-death gap framing. Two shipped run-1 opener lines were rewritten and
   integrated this session (see note below).
8. NAMES: total anonymity is permanent hard law for the whole family, given
   name and surname, forever. Overby leaves canon. Rhea's given name stays
   (already shipped). Forbids any bill, document, gravestone, or line ever
   spelling out a first or last name for the son, Dad, or a surname for
   Rhea. The journal.ts "Patient: Overby" bill line was rewritten and
   integrated this session as cold, nameless account-style paperwork (see
   note below).

Note - shipped/canon realignment status (updated 2026-07-25, story-retune-1
gate): all four shipped lines that contradicted the rulings above are now
confirmed integrated in the live repo. Verified directly against
`kernel-panic-site/app/src/game/content/story.ts` during this gate: run-1
opener no longer mentions dust ("He would have hated how clean I kept it.",
"The padlock is the only thing in this shop Dad ever put away properly.");
run-6 opener's second line reads "The clutter shrinks a little more every
week. The padlock never has."; run-end-3's sector 2 opening line reads "This
bench light is the only one on the block." with no mother reference; and
journal.ts's bills entry carries no "Patient: Overby" line. Shipped copy and
this ledger now agree on all four lines. No outstanding realignment items
remain.

9. DARKNET (added 2026-07-28, Loremaster gate on the deep-balance-2026-07-28
   cycle, ruling a gap the brief exposed rather than a direct user call): a
   gray-market trade in patch pieces exists in the city, salvage off
   scrapped and dead machines, reachable by signal only after the shop
   closes. The dealer is permanently anonymous, no name, no ID on file; no
   causal link to Patch, Dad, or the shop's back room, the same pattern as
   Resolved ruling 5 (mundane, unexplained, no causal tie). The dealer's
   cash-only anonymity may mirror Dad's own secrecy in a future arc; that is
   a hook, not a commitment. No named character attaches to this market
   without a later explicit ruling.
10. OVERTIME BILLING (added 2026-07-28, Loremaster gate 2 on the
    deep-balance-2026-07-28 cycle, ruling the OVERTIME CLAUSE tone flag the
    brief named): the shop may bill a cap win (a job that ran past its
    deadline) at full overtime rate instead of splitting the loss with the
    client. This is ordinary trade practice, not exploitative labor
    framing, and it is well within motive for a shop this precarious
    ("Debt: the Meridian balance alone is more than the shop clears in a
    year"; "Small businesses run close to the bone"). The lever is back
    office only: it changes no customer facing line (win lines, loss lines,
    and every customer's flavor text are untouched by it), so it does not
    contradict "Customers are fond of their machines; the intrusion is a
    betrayal, not an inconvenience." A build that farms the bonus by
    stalling to the round cap on purpose is a balance-loop incentive
    question, not a canon one; no line forbids a player-optimal strategy
    from reading as hard invoicing. Forbids: any future scene or customer
    line where a client is shown resenting, disputing, or calling out the
    shop for overbilling; that reading would need its own explicit ruling
    first.
