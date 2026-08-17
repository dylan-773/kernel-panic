---
title: Encounter Generator
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[customers]]", "[[intrusions]]"]
---

# Encounter Generator

Customer and encounter profiles. Sonnet, `maxTurns` 20.

## Owns

`pipeline/proposals/encounter-generator.json`.

## The brief: "One Wow" per job

Every customer job carries exactly one memorable thing. Not a backstory: a **device plus a complaint plus a routine** that makes the dive feel specific.

> "A ghost second player keeps setting records" is a wow.
> "Arcade kid with a broken handheld" is not.

## What a profile must supply

`{ id, name, device, portrait, quotes, winLine, lossLine, tiers, dominant }`

The `dominant` mode is a mechanical commitment, not flavour: it is what the Analyze tell reports and what the machine is guaranteed to use early. See [[traps-and-telegraphs]].

## The roster it produced

Twelve regulars, all six modes represented twice, tier bands overlapping so any slot has several plausible candidates. See [[customers]].

> [!warning] Twelve is not enough for an unbounded calendar
> A ten-day arc needed 27 encounters. A game with no last day needs a repeat policy, a much larger roster, procedural walk-ins, or all three, and this seat owns that call. Regulars who come back at rising tiers are the cheapest good answer and [[aldous-wick]] is already built that way.
>
> The profile shape may also need a field for how a customer appears at [[the-counter]] as a person in a room, rather than only as a portrait on a card.

## See also

- [[intrusions]] · [[inbox]]
