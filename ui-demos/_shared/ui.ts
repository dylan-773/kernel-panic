import { patchGlyph } from "./glyph";

/** Shared DOM builders for the kpos-design-language pieces. */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

export { patchGlyph };

/* ---------- frame grammar ---------- */

/** Corner L-brackets (.kp-frame-ticks). Mutates and returns host. */
export function ticks(host: HTMLElement): HTMLElement {
  host.classList.add("kp-frame-ticks");
  host.appendChild(el("i", "kp-tick2"));
  return host;
}

/** Six node-dot joins (.kp-frame-nodes). Mutates and returns host. */
export function nodes(host: HTMLElement, on = false): HTMLElement {
  host.classList.add("kp-frame-nodes");
  if (on) host.classList.add("kp-nodes-on");
  const wrap = el("i", "kp-nodes");
  for (let i = 0; i < 6; i++) wrap.appendChild(el("i"));
  host.appendChild(wrap);
  return host;
}

export function stripe(): HTMLElement {
  return el("div", "kp-frame-stripe");
}

export function ruler(left: string, right: string): HTMLElement {
  const r = el("div", "kp-ruler");
  r.append(el("span", "", left), el("i"), el("span", "", right));
  return r;
}

export function dotmatrix(): HTMLElement {
  const g = el("div", "kp-dotmatrix");
  for (let i = 0; i < 64; i++) g.appendChild(el("i"));
  return g;
}

/* ---------- type ---------- */

export function hero(text: string, cls = ""): HTMLElement {
  return el("div", `kp-hero ${cls}`.trim(), text);
}

/* ---------- data rows ---------- */

export interface RowDef {
  label: string;
  value: string | Node;
  warn?: boolean;
}

export function datarows(rows: RowDef[], slash = false): HTMLElement {
  const list = el("div", "kp-datarow-list");
  for (const r of rows) {
    const row = el("div", `kp-datarow ${slash ? "kp-datarow-slash" : "kp-datarow-plain"} ${r.warn ? "kp-datarow-warn" : ""}`.trim());
    row.appendChild(el("span", "", r.label));
    const em = el("em");
    if (typeof r.value === "string") em.textContent = r.value;
    else em.appendChild(r.value);
    row.appendChild(em);
    list.appendChild(row);
  }
  return list;
}

/* ---------- meter kit ---------- */

export function pipRow(filled: number, total: number, size: "sm" | "md" | "lg" = "md"): HTMLElement {
  const row = el("span", "kp-pip-row");
  for (let i = 0; i < total; i++) {
    const p = el("i", `kp-pip-sq ${size === "sm" ? "kp-pip-sq-sm" : size === "lg" ? "kp-pip-sq-lg" : ""}`.trim());
    if (i < filled) p.classList.add("kp-pip-on");
    row.appendChild(p);
  }
  return row;
}

export function diamondRow(tier: number, total = 5, label?: string): HTMLElement {
  const row = el("span", "kp-pip-row kp-job-tier");
  if (label) row.appendChild(el("span", "", label));
  for (let i = 0; i < total; i++) {
    const d = el("i", "kp-pip-diamond");
    if (i < tier) d.classList.add("kp-pip-on");
    row.appendChild(d);
  }
  return row;
}

export function chip(label: string, value: string, crimson = false): HTMLElement {
  const c = el("span", `kp-chip-pct ${crimson ? "kp-chip-crimson" : ""}`.trim());
  c.append(el("span", "", label), el("em", "", value));
  return c;
}

/** Segmented meter; fills stepped over `dur` ms in `steps` increments. */
export function segMeter(pct: number, segs = 20, dur = 240, steps = 6): HTMLElement {
  const bar = el("div", "kp-meter-seg");
  const cells: HTMLElement[] = [];
  for (let i = 0; i < segs; i++) {
    const c = el("i");
    bar.appendChild(c);
    cells.push(c);
  }
  const target = Math.round((pct / 100) * segs);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || dur <= 0) {
    cells.forEach((c, i) => { if (i < target) c.classList.add("kp-seg-on"); });
  } else {
    for (let s = 1; s <= steps; s++) {
      const upto = Math.round((target * s) / steps);
      setTimeout(() => {
        cells.forEach((c, i) => c.classList.toggle("kp-seg-on", i < upto));
      }, (dur / steps) * s);
    }
  }
  return bar;
}

export function hatchBar(pct: number): HTMLElement {
  const bar = el("div", "kp-bar-hatch");
  const fill = el("i");
  fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  bar.appendChild(fill);
  return bar;
}

/* ---------- buttons ---------- */

export type BtnVariant = "primary" | "signal" | "danger" | "ghost";

export function btn(label: string, variant: BtnVariant, onClick?: () => void): HTMLButtonElement {
  const cls =
    variant === "ghost" ? "kp-btn2 kp-btn2-ghost"
    : variant === "danger" ? "kp-btn2 kp-btn2-primary kp-btn2-danger"
    : variant === "signal" ? "kp-btn2 kp-btn2-primary kp-btn2-signal"
    : "kp-btn2 kp-btn2-primary";
  const b = el("button", cls, label);
  b.type = "button";
  if (onClick) b.addEventListener("click", onClick);
  return b;
}

/* ---------- photo cell ---------- */

export function photoCell(src: string, w: number, h: number): HTMLElement {
  const cell = el("span", "kp-photo-cell-full");
  const img = new Image(w, h);
  img.src = src;
  img.alt = "";
  cell.appendChild(img);
  return cell;
}

/* ---------- pixel rect icons (ported from icons.tsx, rect data unchanged) ---------- */

const SVGNS = "http://www.w3.org/2000/svg";
type RectDef = [number, number, number, number, string, number?];

export function rectIcon(rects: RectDef[]): SVGSVGElement {
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("aria-hidden", "true");
  for (const [x, y, w, h, fill, opacity] of rects) {
    const r = document.createElementNS(SVGNS, "rect");
    r.setAttribute("x", String(x));
    r.setAttribute("y", String(y));
    r.setAttribute("width", String(w));
    r.setAttribute("height", String(h));
    r.setAttribute("fill", fill);
    if (opacity !== undefined) r.setAttribute("fill-opacity", String(opacity));
    svg.appendChild(r);
  }
  return svg;
}

/* ---------- the KP mark ----------
 * Pixel monogram whose middle scanline has slipped two cells: the mark
 * itself is mid kernel panic. The slipped band renders hot and "heals"
 * for a blink every few seconds (CSS kp-mark-slip); under reduced motion
 * it stays broken, which IS the logo. */
const KP_MARK_ROWS = [
  "##...##..#######.",
  "##..##...##....##",
  "##.##....##....##",
  "####.....##....##",
  "###......#######.",
  "####.....##......",
  "##.##....##......",
  "##..##...##......",
  "##...##..##......",
  "##...##..##......",
];
const KP_SLICE_ROWS = [4, 5];
const KP_SLIP_CELLS = 2;

export function kpMark(cell: number, sliceMono = false): SVGSVGElement {
  const svg = document.createElementNS(SVGNS, "svg") as SVGSVGElement;
  const cols = KP_MARK_ROWS[0].length + KP_SLIP_CELLS;
  const W = cols * cell;
  const H = KP_MARK_ROWS.length * cell;
  svg.setAttribute("class", "kp-mark");
  svg.setAttribute("width", String(W));
  svg.setAttribute("height", String(H));
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("aria-hidden", "true");
  svg.style.setProperty("--slip", `${KP_SLIP_CELLS * cell}px`);
  const slice = document.createElementNS(SVGNS, "g");
  slice.setAttribute("class", "kp-mark-slice");
  KP_MARK_ROWS.forEach((row, y) => {
    const inSlice = KP_SLICE_ROWS.includes(y);
    let run = -1;
    for (let x = 0; x <= row.length; x++) {
      const on = x < row.length && row[x] === "#";
      if (on && run < 0) run = x;
      if (!on && run >= 0) {
        const r = document.createElementNS(SVGNS, "rect");
        r.setAttribute("x", String((run + (inSlice ? KP_SLIP_CELLS : 0)) * cell));
        r.setAttribute("y", String(y * cell));
        r.setAttribute("width", String((x - run) * cell));
        r.setAttribute("height", String(cell));
        r.setAttribute("fill", inSlice && !sliceMono ? "var(--ch-hot)" : "currentColor");
        (inSlice ? slice : svg).appendChild(r);
        run = -1;
      }
    }
  });
  svg.appendChild(slice);
  return svg;
}

/* ---------- desktop icon bitmaps ----------
 * One matched pictogram family in the mark's own language, free-floating
 * (no cell boxes). 24-wide grids at cell 3 = 72px art, five lavender
 * tones for real shading, light from the top-left:
 *   '*' hot highlight / '#' ink / 'o' mid / '+' dim shadow / '-' faint
 * (every tone derives from the hue vars, so the switch recolors them). */
export const PX_ICONS: Record<string, string[]> = {
  /* envelope: lit flap face, shaded body, sheen under the top edge */
  inbox: [
    "########################",
    "##********************##",
    "####oooooooooooooooo####",
    "##-##oooooooooooooo##-##",
    "##--##oooooooooooo##--##",
    "##---##oooooooooo##---##",
    "##----##oooooooo##----##",
    "##-----##oooooo##-----##",
    "##------##oooo##------##",
    "##-------##oo##-------##",
    "##--------####--------##",
    "##--------++++--------##",
    "##--------------------##",
    "##++++++++++++++++++++##",
    "########################",
    "########################",
  ],
  /* socketed chip: beveled package, hot die core */
  loadout: [
    "......##...##...##......",
    "......##...##...##......",
    "..####################..",
    "..##oooooooooooooooo##..",
    "..##o--------------+##..",
    "..##o--------------+##..",
    "####o--------------+####",
    "####o--------------+####",
    "..##o---########---+##..",
    "..##o---#******#---+##..",
    "..##o---#******#---+##..",
    "####o---#******#---+####",
    "####o---#******#---+####",
    "..##o---#******#---+##..",
    "..##o---#******#---+##..",
    "..##o---########---+##..",
    "####o--------------+####",
    "####o--------------+####",
    "..##o--------------+##..",
    "..##++++++++++++++++##..",
    "..####################..",
    "..####################..",
    "......##...##...##......",
    "......##...##...##......",
  ],
  /* iron raised to the work: lit barrel edge, grip grooves, sparks */
  solder: [
    ".....................*..",
    "...................*...*",
    "....................*...",
    "..................*.....",
    ".................##.....",
    "................o##+....",
    "...............o###+....",
    "..............o####+....",
    ".............o####+.....",
    "............o####+......",
    "...........o####+.......",
    "..........o####+........",
    ".........o####+.........",
    "........o####+..........",
    ".......o####+...........",
    "......o####+............",
    ".....o#####+............",
    "....o######+............",
    "...o#######+............",
    "..o++++++++.............",
    ".o#########+............",
    ".o++++++++++............",
    "o##########+............",
    "o##########+............",
  ],
  /* clipboard report: paper in shade lines, hot approval stamp */
  report: [
    "........########........",
    "........##****##........",
    "..####################..",
    "..####################..",
    "..##oooooooooooooooo##..",
    "..##o--------------+##..",
    "..##o-++++++++-----+##..",
    "..##o--------------+##..",
    "..##o-++++++++++---+##..",
    "..##o--------------+##..",
    "..##o-++++++++++---+##..",
    "..##o--------------+##..",
    "..##o-++++++-------+##..",
    "..##o--------------+##..",
    "..##o--------------+##..",
    "..##o--------****--+##..",
    "..##o-------******-+##..",
    "..##o-------******-+##..",
    "..##o--------****--+##..",
    "..##o--------------+##..",
    "..##++++++++++++++++##..",
    "..####################..",
    "..####################..",
    "........................",
  ],
  /* bound journal: lit spine band, strap, hot bookmark, page stack */
  journal: [
    "..####################..",
    "..####################..",
    "..##ooo----------**-##..",
    "..##ooo----------**-##..",
    "..##ooo----------**-##..",
    "..##ooo----------**-##..",
    "..##ooo----------*--##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..##++++++++++++++++##..",
    "..##++++++++++++++++##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..##ooo-------------##..",
    "..####################..",
    "..####################..",
    "...oooooooooooooooooo...",
    "...------------------...",
    "........................",
    "........................",
  ],
  /* dog-eared manual page: folded corner catches the light */
  manual: [
    "...##############.......",
    "...##-----------o#......",
    "...##-----------oo#.....",
    "...##-----------ooo#....",
    "...##-----------oooo#...",
    "...##--------------##...",
    "...##-++++++++-----##...",
    "...##--------------##...",
    "...##-++++++++++---##...",
    "...##--------------##...",
    "...##-++++++++++---##...",
    "...##--------------##...",
    "...##-++++++++++---##...",
    "...##--------------##...",
    "...##-++++++-------##...",
    "...##--------------##...",
    "...##-++++++++-----##...",
    "...##--------------##...",
    "...##--------------##...",
    "...##++++++++++++++##...",
    "...##################...",
    "...##################...",
    "........................",
    "........................",
  ],
  /* credit slabs: offset stack, lit top faces, one glint */
  ledger: [
    "........................",
    "........................",
    "...oooooooooooooooooo...",
    "...##****############...",
    "...##################...",
    "...##################...",
    "...++++++++++++++++++...",
    "........................",
    ".....oooooooooooooooooo.",
    ".....##################.",
    ".....##################.",
    ".....##################.",
    ".....++++++++++++++++++.",
    "........................",
    "..oooooooooooooooooo....",
    "..##################....",
    "..##################....",
    "..##################....",
    "..++++++++++++++++++....",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
  ],
  /* the fence: rim-lit hood, void face, hot eyes, robed shoulders */
  darknet: [
    "..........####..........",
    "........########........",
    ".......oo######++.......",
    "......oo########++......",
    ".....oo###....###++.....",
    "....oo##........##++....",
    "....o##..........##+....",
    "....o##..**..**..##+....",
    "....o##..........##+....",
    "....o###........###+....",
    ".....o###......###+.....",
    ".....o############+.....",
    "....oo############++....",
    "...oo##############++...",
    "..oo################++..",
    ".oo##################++.",
    ".o####################+.",
    ".######################.",
    ".++++++++++++++++++++++.",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
  ],
};

export function pxIcon(rows: string[], cell: number): SVGSVGElement {
  const svg = document.createElementNS(SVGNS, "svg") as SVGSVGElement;
  const W = rows[0].length * cell;
  const H = rows.length * cell;
  svg.setAttribute("width", String(W));
  svg.setAttribute("height", String(H));
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("aria-hidden", "true");
  const FILL: Record<string, string> = {
    "#": "currentColor",
    "*": "var(--ch-hot)",
    "o": "color-mix(in srgb, var(--ch) 74%, var(--px-void))",
    "+": "var(--ch-dim)",
    "-": "var(--ch-faint)",
  };
  rows.forEach((row, y) => {
    let run = -1;
    let tone = "";
    for (let x = 0; x <= row.length; x++) {
      const c = x < row.length ? row[x] : ".";
      if (run >= 0 && c !== tone) {
        const r = document.createElementNS(SVGNS, "rect");
        r.setAttribute("x", String(run * cell));
        r.setAttribute("y", String(y * cell));
        r.setAttribute("width", String((x - run) * cell));
        r.setAttribute("height", String(cell));
        r.setAttribute("fill", FILL[tone]);
        svg.appendChild(r);
        run = -1;
      }
      if (c !== "." && run < 0) {
        run = x;
        tone = c;
      }
    }
  });
  return svg;
}

export const ICON_RECTS: Record<string, RectDef[]> = {
  jobs: [
    [10, 4, 18, 12, "var(--kp-rose)"],
    [4, 10, 18, 16, "currentColor"],
    [7, 16, 12, 2, "var(--kp-bg0)", 0.45],
    [7, 21, 12, 2, "var(--kp-bg0)", 0.45],
  ],
  loadout: [
    [10, 4, 16, 20, "currentColor"],
    [6, 8, 4, 16, "currentColor"],
    [8, 26, 2, 4, "currentColor"],
    [12, 26, 2, 4, "currentColor"],
    [16, 26, 2, 4, "currentColor"],
    [20, 26, 2, 4, "currentColor"],
    [24, 26, 2, 4, "currentColor"],
    [20, 9, 3, 3, "var(--kp-signal)"],
  ],
  manual: [
    [7, 4, 18, 24, "currentColor"],
    [19, 4, 6, 2, "var(--kp-gold)"],
    [19, 6, 4, 2, "var(--kp-gold)"],
    [19, 8, 2, 2, "var(--kp-gold)"],
    [10, 13, 12, 2, "var(--kp-rose)"],
    [10, 18, 9, 2, "var(--kp-rose)"],
  ],
  ledger: [
    [9, 8, 16, 6, "currentColor"],
    [7, 14, 18, 6, "currentColor"],
    [5, 20, 20, 7, "currentColor"],
    [14, 21, 2, 5, "var(--kp-gold)"],
    [12, 22, 6, 2, "var(--kp-gold)"],
  ],
  journal: [
    [7, 4, 19, 24, "currentColor", 0.35],
    [6, 3, 19, 24, "currentColor"],
    [8, 5, 15, 20, "var(--kp-bg0)"],
    [6, 3, 3, 24, "var(--kp-gold)"],
    [4, 6, 3, 2, "currentColor"],
    [4, 12, 3, 2, "currentColor"],
    [4, 18, 3, 2, "currentColor"],
    [4, 24, 3, 2, "currentColor"],
    [18, 3, 4, 9, "var(--kp-rose)"],
    [19, 12, 2, 2, "var(--kp-rose)"],
    [11, 9, 9, 2, "currentColor", 0.8],
    [11, 13, 7, 2, "currentColor", 0.6],
    [11, 17, 9, 2, "currentColor", 0.6],
    [11, 21, 5, 2, "currentColor", 0.4],
  ],
  solder: [
    [4, 22, 14, 6, "currentColor"],
    [16, 18, 6, 4, "currentColor"],
    [20, 14, 4, 4, "currentColor"],
    [22, 10, 3, 4, "currentColor"],
    [23, 7, 3, 3, "var(--kp-gold)"],
    [27, 5, 2, 2, "var(--kp-signal)"],
    [25, 3, 2, 2, "var(--kp-rose)"],
    [29, 9, 2, 2, "var(--kp-gold)"],
  ],
  /* REPAIR.LOG: stamped report sheet */
  report: [
    [8, 4, 17, 24, "currentColor"],
    [13, 2, 7, 4, "var(--kp-gold)"],
    [11, 10, 11, 2, "var(--kp-bg0)", 0.45],
    [11, 14, 11, 2, "var(--kp-bg0)", 0.45],
    [11, 18, 7, 2, "var(--kp-bg0)", 0.45],
    [17, 21, 6, 6, "var(--kp-rose)"],
  ],
};
