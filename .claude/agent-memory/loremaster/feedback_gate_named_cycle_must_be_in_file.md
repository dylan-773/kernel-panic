---
name: feedback-gate-named-cycle-must-be-in-file
description: Before gating a cycle by name, confirm the target proposal file's own brief/items are actually that cycle - single-current-cycle-file house style means a later cycle can silently erase an earlier, ungated one.
metadata:
  type: feedback
aliases: [feedback-gate-named-cycle-must-be-in-file]

---

Asked to gate `ux-2026-07-29-v2-sound` (13 sfx presets, 1 retire, 3 wiring
specs, 3 music briefs) inside `pipeline/proposals/ux-agent.json`. Read the
file: its `"brief"` field said `"ux-2026-07-29-dadlog"` and every item
belonged to that cycle instead; grepped directly for `darknetLinkUp`,
`teachIn`, `dayClose` and got zero matches. The sound cycle was real, not a
bad request: ux-agent's own memory (`feel_decisions_v2_sound.md`) names
the same pass ("a full 40-preset audit plus 13 new presets"), but it had
already been overwritten. ux-agent treats `pipeline/proposals/<agent>.json`
as a single current-cycle file, replaced wholesale each cycle, never
appended (see ux-agent's own `ux_agent_proposal_house_style.md`, and the
dadlog proposal's own notes field, which says outright it "REPLACES the
prior cycle's content wholesale... safe in git history at commit
e21ec05/84e9aea"). The dadlog cycle ran and overwrote the sound cycle
before I ever gated it, and this session had no git/shell tool to recover
the old commit.

**Why this matters:** a gate request naming a cycle is a claim that the
cycle's content is sitting in the named file right now. It can be stale
(written before a later cycle ran) or simply wrong. Gating from the
request's own paraphrase instead of the file, or silently reviewing
whatever IS in the file under the requested cycle's name, both produce a
false paper trail: fabricated verdicts on text never read, or a gate
record that looks like it covers cycle A when it actually re-covers an
already-gated cycle B.

**How to apply:** when asked to gate a named cycle, check the target
file's own cycle-identifying field (`brief`, or an item's own `cycle` key)
actually matches the requested name before writing a single verdict line.
If it doesn't match, do not improvise a review from the request's
description, and do not silently gate whatever cycle IS present under a
different name. Write a BLOCKED verdict to the gate file instead, citing
exactly what's on disk vs. what was requested, note where the real content
likely lives (git history; another agent's memory confirming it existed),
and say plainly what unblocks it (the orchestrator restoring or re-running
the cycle). A well-evidenced block is a passed review of the situation; a
fabricated APPROVE/REVISE list is not, however detailed the request's
paraphrase is. This generalizes [[feedback_verify_unchanged_claims]] one
level up: that memory says verify a claim within a proposal against source
before gating it; this one says verify the proposal is even the cycle
being requested before gating anything in it at all.
