---
title: Cutscenes and scenes
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[reveal-schedule]]", "[[day-sys]]", "[[narrative-director]]"]
---

# Cutscenes and scenes

> [!info] Source
> `content/story.ts`, 924 lines. Scenes are **functions**, not a table.

```ts
StoryBeat { speaker: "father"|"system"|"companion",
            name?, portrait?, still?, lines: string[] }
Scene     { id, beats }
```

> [!warning] status: this note is draft below the type declaration
> The run-keyed scene functions are gone with the runs, and nothing has replaced them in code.

## What the scene set becomes

| Scene | When |
|---|---|
| the opening | once, before the first customer, ending in the failed attempt at the tower |
| the tutorial intro and outro | once, around that attempt |
| a day line | each morning, one line, not a scene |
| Sunday scenes | the story beats, hand-placed. See [[sunday]] |
| an artifact scene | optional, when a repair turns up something that wants a moment rather than a document |
| the win | on opening the machine, and then the shop opens again on Monday |

The two that carried the whole story, `runOpenerScene(runCount)` and `runEndScene(runCount)`, have no successor by design. Story is not paid out for failing any more. See [[ruling-16-reveals-are-upgrade-keyed]].

## Three speakers

- **father** - [[dad]], `father.png`, fragments only
- **system** - the terminal voice, short caps declaratives
- **companion** - [[patch]], **after a win only**

The **sister** speaker is deleted along with `sister.png`. Nothing replaces it, and the absence is the design: there is no second voice in the shop to react, doubt, or soften anything.

> [!warning] The companion speaker may not appear before a win
> Before it, no content may confirm the occupant speaks at all. See [[reveal-schedule]], prohibition 2.

## Stills

`still-locked.png`, `still-bench.png`, `still-counter.png`, `still-open.png` were four states of the same shop, standing in for a place the game did not have. The game has the place now, so most of what stills were for is better done by [[the-shop-floor]]. `still-counter` in particular was the sister's post.

Worth keeping only where a scene needs a framing the walkable camera cannot give.

## Where they play

Day lines and short system beats stay in the flow window, [[day-sys]]. **Sunday scenes play in the shop**, because they are about being in a room rather than reading a screen, and because the old "no full-screen takeover" rule was a virtue made of a limitation. See [[the-shop-floor]].

## Owned by

The [[narrative-director]] writes them; the [[loremaster]] gates them against [[reveal-schedule]].

## See also

- [[dad-log-archive]] - the other delivery channel
