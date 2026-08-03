import { rotateArms } from "../../kernel-panic-site/app/src/game/types";

/**
 * DOM port of the game's PatchGlyph (patch-glyph.tsx): a piece as a mini
 * junction, hub plus its exact arms, drawn with the same kp-pp-arm /
 * kp-pp-node classes so the demo's kp.css subset styles it identically.
 */

const SVG = "http://www.w3.org/2000/svg";

export { rotateArms };

export function armCount(mask: number): number {
  let n = 0;
  for (let d = 0; d < 4; d++) if (mask & (1 << d)) n++;
  return n;
}

export function patchGlyph(mask: number, size = 22, tone: "signal" | "gold" | "dim" | "crimson" = "signal"): SVGSVGElement {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "-12 -12 24 24");
  svg.setAttribute("class", `kp-patch-glyph kp-glyph-${tone}`);
  svg.setAttribute("aria-hidden", "true");
  const ends: Array<[number, number]> = [[0, -10], [10, 0], [0, 10], [-10, 0]];
  for (let d = 0; d < 4; d++) {
    if ((mask & (1 << d)) === 0) continue;
    const line = document.createElementNS(SVG, "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", String(ends[d][0]));
    line.setAttribute("y2", String(ends[d][1]));
    line.setAttribute("class", "kp-pp-arm");
    line.setAttribute("stroke-width", "3.5");
    svg.appendChild(line);
  }
  const hub = document.createElementNS(SVG, "circle");
  hub.setAttribute("cx", "0");
  hub.setAttribute("cy", "0");
  hub.setAttribute("r", "3");
  hub.setAttribute("class", "kp-pp-node");
  svg.appendChild(hub);
  return svg;
}
