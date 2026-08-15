---
name: feedback-verify-unchanged-claims
description: Always verify a proposal's "byte-identical" / "unchanged" copy claims against the actual shipped source file, never take the claim on faith.
metadata:
  type: feedback
aliases: [feedback-verify-unchanged-claims]

---

When a ux-agent or narrative-director proposal claims a string is
"byte-identical to today's shipped text" or that a screen's "copy is
unchanged," grep/Read the actual source file and confirm it directly; do
not gate on the claim alone.

Why: doing this during the `ux-2026-07-28-kpos-redesign` gate surfaced a
real, independent hard-law violation that predated the proposal entirely:
`boot.tsx` still read `"OVERBY REPAIR BENCH BIOS v9.2"`, spelling out the
family surname `lore/ledger.md` Resolved ruling 8 excised. The proposal
under review never touched that line (it only added chrome around it and
asserted "unchanged copy"), so a live canon violation would have sailed
through a gate that trusted the description instead of reading it.
REVISE'd with citation; fixed by the next cycle.

Confirmed durable on `ui-integration-2026-07-29`: re-grepped `boot.tsx`,
`report.tsx`, `desk.tsx`, and the whole `components/os` tree for
"overby" (case-insensitive) and for em/en dashes before trusting this
cycle's proposals. Clean. The fix held, and the same base string now
ships name-free in three places: `boot.tsx` ("REPAIR BENCH BIOS v9.2"),
the wallpaper poster (`desk.tsx`, "KP/OS v9.2 // REPAIR BENCH"), and the
REPAIR.LOG footer (`report.tsx`, "KP/OS REPAIR BENCH v9.2").

How to apply: any time a gate pass touches a screen/window that already
ships in `kernel-panic-site/`, spot-check its literal strings (a few
greps) rather than relying on a proposal's "verified byte-identical"
framing. Cheap, and the only way a stale violation gets caught before
another integration cycle ships it forward again.

Confirmed durable a third time on `ux-2026-07-29-v2-sound` (the
Orchestrator's reconstructed integration record, re-gated after an initial
BLOCKED pass): read `audio.ts` plus every named call site (`duel.tsx`,
`darknet.tsx`, `teach.tsx`, `night.tsx`, `ledger.tsx`, `wm.tsx`) directly
rather than trusting the record's own "as shipped" claim. Everything
checked out this time (params byte-for-byte, specific numbers like the
160/340/520ms boot stagger and the 64 dotmatrix cells at 4.5ms all matched
exactly), which is itself worth recording: this practice does not only
exist to catch violations, reading the source is also what lets a full
APPROVE be stated with actual confidence instead of on faith. Do not skip
the check just because a prior pass on the same file came back clean.
