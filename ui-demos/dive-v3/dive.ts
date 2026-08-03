import {
  ATTACK_MODE_LABEL,
  ATTACK_WIDTH,
  DEFEND_MODE_LABEL,
  DEFEND_WIDTH,
  MODE_LABEL,
  MODE_TELL,
  OppMode,
  Program,
  SCAN_RANGE,
  attackModeDesc,
  defendModeDesc,
  scanDesc,
} from "../../kernel-panic-site/app/src/game/content/kit";
import { dayDuelConfig } from "../../kernel-panic-site/app/src/game/content/arc";
import { CUSTOMERS } from "../../kernel-panic-site/app/src/game/content/customers";
import {
  attackTargetLegal,
  defendTargetLegal,
  programCost,
  programUnlocked,
  tierOf,
} from "../../kernel-panic-site/app/src/game/duel-actions";
import { canPlace, canRotate, effectiveDuelArms, routeCost } from "../../kernel-panic-site/app/src/game/duel-power";
import { DuelAction, duelReducer } from "../../kernel-panic-site/app/src/game/duel-reducer";
import { createDuel } from "../../kernel-panic-site/app/src/game/duel-setup";
import { DuelCell, DuelKit, DuelState, ROUND_CAP, Side } from "../../kernel-panic-site/app/src/game/duel-types";
import { DX, DY, oppositeDir, rotateArms } from "../../kernel-panic-site/app/src/game/types";
import { PLACE_COST } from "../../kernel-panic-site/app/src/game/patch-cells";
import { el } from "../_shared/ui";
import { patchGlyph } from "../_shared/glyph";
import { play, playCascade, playStinger, startDrone, stopDrone, unlock } from "../_shared/sound";

/**
 * DIVE.EXE v3 instrument-panel study (cycle ux-2026-07-31-desktop-dive;
 * spec pipeline/proposals/ux-agent.json item dive-v3). Supersedes the
 * poster study in ui-demos/dive/ as the candidate under review.
 *
 * The ENTIRE duel is the shipped engine imported verbatim: board gen,
 * reducer, opponent AI, legality, par, traps, patch pieces. This file is
 * presentation only. v3 over the poster study: role tokens with the
 * intrusion as structural hazard and route-threat as the one alarm, fluid
 * cqi rails, the device macro as a 1:1 crop with FEED treatments, the
 * six-layer CRT glass, and a true-resolution stage scaled to fit. The BEAT
 * rig row can freeze the machine mid-telegraph or force an end overlay so
 * both are reviewable on demand.
 */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SVGNS = "http://www.w3.org/2000/svg";
const CS = 52;
const HALF = CS / 2;

/* ================= scenarios (all content shipped; seeds demo-fixed) ================= */

interface Scenario {
  id: string;
  label: string;
  day: number;
  customerId: string;
  tier: number;
  quoteIndex: 0 | 1;
  kit: DuelKit;
  ramPerTurn: number;
  strain: number;
  seed: number;
}

const SCENARIOS: Scenario[] = [
  {
    // The first morning read: base kit, small board, a siphon-hungry ghost.
    id: "d2-juno",
    label: "DAY 2 JUNO",
    day: 2,
    customerId: "juno-vex",
    tier: 1,
    quoteIndex: 0,
    kit: {
      scanTier: 1,
      attackTier: 1,
      defendTier: 1,
      attackMode: "redirect",
      defendMode: "purge",
      augments: [],
      patchPouch: [],
    },
    ramPerTurn: 6,
    strain: 84,
    seed: 0x51a2,
  },
  {
    // The shared day-4 mock run state (data.ts): the study's default.
    id: "d4-sable",
    label: "DAY 4 SABLE",
    day: 4,
    customerId: "sable-okonkwo",
    tier: 2,
    quoteIndex: 1,
    kit: {
      scanTier: 2,
      attackTier: 1,
      defendTier: 2,
      attackMode: "redirect",
      defendMode: "purge",
      augments: ["hotBoot", "cleanRun"],
      patchPouch: [0b0101, 0b0011, 0b1111, 0b0111],
    },
    ramPerTurn: 6,
    strain: 62,
    seed: 0x54b1,
  },
  {
    // Late run: wide programs, trap war, TAP LINE tracing the route.
    id: "d7-ines",
    label: "DAY 7 INES",
    day: 7,
    customerId: "ines-calloway",
    tier: 4,
    quoteIndex: 0,
    kit: {
      scanTier: 3,
      attackTier: 2,
      defendTier: 2,
      attackMode: "armSiphon",
      defendMode: "lock",
      augments: ["cfgArmSiphon", "cfgLock", "cheapShot", "tapLine", "echoTap"],
      patchPouch: [0b0111, 0b1111],
    },
    ramPerTurn: 6,
    strain: 47,
    seed: 0x571e,
  },
];

/** Center-screen virus-speak when the machine charges a program (duel.tsx). */
const VIRUS_LINES: Record<string, string[]> = {
  armHalt: ["DA3M0N R3L3AS3D. H4PPY HUNT1NG >:)", "M1N3S 1N TH3 W1R3S. ST3P L1GHTLY", "S0M3TH1NG SL33PS WH3R3 Y0U W4LK"],
  armSiphon: ["Y0UR R4M T4ST3S B3TT3R TH4N M1N3", "L1TTL3 L33CH, B1G 4PP3T1T3 >:)", "F33D M3"],
  redirect: ["R3R0UT1NG Y0UR L1F3 >:)", "Y0UR W0RK. MY RUL3S", "TW1ST. SN4P. S0RRY N0T S0RRY"],
  lock: ["TH1S 0N3 1S M1N3 N0W", "FR0Z3N S0L1D. TRY 4G41N L4T3R"],
  ward: ["N0 G1FTS 4LL0W3D 1N MY H0US3", "W4RD3D. K33P Y0UR T0YS"],
  purge: ["SW3PT CL34N. N1C3 TRY", "F0UND Y0UR L1TTL3 G1FTS >:)"],
};

/* ================= module state ================= */

let scenario: Scenario = SCENARIOS[1];
let state: DuelState;
let soundOn = true;

interface Targeting {
  prog: "attack" | "defend";
  mode: OppMode;
  picked: number[];
  want: number;
  label: string;
}
let targeting: Targeting | null = null;
let placing: number | null = null;
let reviewing = false;
let parWasOver = false;
/* demo-rig state: FEED treatment on the macro bezel; holdOpp freezes the
 * machine mid-telegraph for the BEAT=TELEGRAPH ARMED review state */
let feed: "ink" | "true" | "color" = "ink";
let holdOpp = false;

let oppTimer: number | null = null;
let heartbeatTimer: number | null = null;
let heartbeatTier = 0;
let virusTimer: number | null = null;
let consoleTimer: number | null = null;
let noticeSeen = 0;
let noticeUntil = 0;
let lastRound = 1;

/* DOM refs, rebuilt per boot */
interface CellRefs {
  g: SVGGElement;
  pop: SVGGElement | null;
  arms: SVGGElement | null;
  ghost: SVGGElement | null;
  /** Powered-overlay lines, one per drawn arm, with the direction they
   * were drawn at. For rotating nodes that is the BASE direction (the
   * group's spin transform carries it to the live one); for ports and the
   * core the rotation is baked in at build, so it is already live. */
  lit: Array<{ d: number; el: SVGLineElement }>;
  rotates: boolean;
  snap: string;
  claimSeq: number;
  base: number;
  kind: string;
}
const R: {
  shell?: HTMLElement;
  barTitle?: HTMLElement;
  barSub?: HTMLElement;
  crumbPath?: HTMLElement;
  daySlot?: HTMLElement;
  roundNum?: HTMLElement;
  roundSegs?: HTMLElement[];
  ramNum?: HTMLElement;
  ramPips?: HTMLElement;
  ramBanked?: HTMLElement;
  railL?: HTMLElement;
  keys?: Record<Program, { root: HTMLButtonElement; meta: HTMLElement; chip: HTMLElement; pips: HTMLElement }>;
  patchWrap?: HTMLElement;
  patchCount?: HTMLElement;
  patchSlots?: HTMLElement;
  endBtn?: HTMLButtonElement;
  boardWrap?: HTMLElement;
  board?: SVGSVGElement;
  cells?: CellRefs[];
  pulses?: HTMLElement;
  threats?: HTMLElement;
  turnVal?: HTMLElement;
  routeYou?: HTMLElement;
  routeOpp?: HTMLElement;
  oppRam?: HTMLElement;
  oppBank?: HTMLElement;
  oppArmed?: HTMLElement;
  oppIntent?: HTMLElement;
  parVal?: HTMLElement;
  parRow?: HTMLElement;
  strainFill?: HTMLElement;
  strainPct?: HTMLElement;
  strainRow?: HTMLElement;
  mon?: HTMLElement;
  monImg?: HTMLImageElement;
  consoleLine?: HTMLElement;
  consoleActions?: HTMLElement;
  log?: HTMLElement;
  sndBtn?: HTMLButtonElement;
  infoBox?: HTMLElement;
  overlay?: HTMLElement;
} = {};

let consoleShown = "";

/* ================= tiny helpers ================= */

function sv<K extends keyof SVGElementTagNameMap>(tag: K, cls?: string): SVGElementTagNameMap[K] {
  const n = document.createElementNS(SVGNS, tag);
  if (cls) n.setAttribute("class", cls);
  return n;
}

function svAttr(n: SVGElement, attrs: Record<string, string | number>): void {
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
}

function customer() {
  return CUSTOMERS.find((c) => c.id === scenario.customerId) ?? CUSTOMERS[0];
}

function playerTurn(): boolean {
  return state.phase === "playing" && state.turn === "player";
}

function arming(): boolean {
  return targeting !== null || placing !== null;
}

/* ================= bus log (the left rail's realtime tap) ================= */

function addr(idx: number): string {
  return `0x${idx.toString(16).toUpperCase().padStart(2, "0")}`;
}

function logLine(actor: "you" | "int" | "sys", text: string, divider = false): void {
  if (!R.log) return;
  const line = el("span", divider ? "dv-log-div" : `dv-log-${actor}`);
  if (!divider) {
    line.appendChild(el("b", "", actor === "you" ? "YOU>" : actor === "int" ? "INT>" : "SYS>"));
  }
  line.appendChild(document.createTextNode(text));
  R.log.appendChild(line);
  // Bottom-anchored ring: the box never scrolls, old lines fall off the top.
  while (R.log.children.length > 40) R.log.firstChild?.remove();
}

/** Player actions log from the dispatch site, where the targets are known;
 * the fx queue only confirms the action actually landed (denies stay out). */
function logAction(action: DuelAction, fx: Set<string>): void {
  if (action.type === "rotate" && fx.has("rotate")) {
    logLine("you", `twist ${addr(action.idx)}`);
  } else if (action.type === "place" && fx.has("place")) {
    logLine("you", `patch weld ${addr(action.idx)}`);
  } else if (action.type === "endTurn" && fx.has("endTurn")) {
    logLine("you", "end of turn");
  } else if (action.type === "cast") {
    const at = action.targets.map(addr).join(" ");
    if (action.prog === "scan" && fx.has("scan")) {
      logLine("you", "scan.exe sweep");
    } else if (action.prog === "attack" && (fx.has("redirect") || fx.has("trapSet"))) {
      logLine("you", `${ATTACK_MODE_LABEL[state.kit.attackMode].toLowerCase()} ${at}`);
    } else if (action.prog === "defend" && (fx.has("purge") || fx.has("lock") || fx.has("ward"))) {
      logLine("you", `${DEFEND_MODE_LABEL[state.kit.defendMode].toLowerCase()} ${at}`);
    }
  }
}

/* ================= engine dispatch + fx ================= */

function dispatch(action: DuelAction): void {
  state = duelReducer(state, action);
  if (state.fx.length > 0) {
    const upTo = state.fx[state.fx.length - 1].id;
    logAction(action, new Set(state.fx.map((e) => e.kind)));
    for (const e of state.fx) handleFx(e.kind, e.n);
    state = duelReducer(state, { type: "fxDrain", upTo });
  }
  render();
}

function shake(mag: number): void {
  if (REDUCED || !R.shell) return;
  const cls = `dv-shake-${Math.min(3, Math.max(1, mag))}`;
  R.shell.classList.remove("dv-shake-1", "dv-shake-2", "dv-shake-3");
  void R.shell.offsetWidth;
  R.shell.classList.add(cls);
  window.setTimeout(() => R.shell && R.shell.classList.remove(cls), 420);
}

function pulse(text: string, bad: boolean): void {
  if (!R.pulses) return;
  const p = el("div", `dv-pulse ${bad ? "dv-pulse-bad" : ""}`, text);
  R.pulses.appendChild(p);
  // Two at a time, same budget as the shipped duel HUD.
  while (R.pulses.children.length > 2) R.pulses.firstChild?.remove();
  window.setTimeout(() => p.remove(), 1500);
}

function showVirus(mode: string): void {
  if (!R.boardWrap) return;
  R.boardWrap.querySelector(".dv-virus")?.remove();
  const lines = VIRUS_LINES[mode] ?? VIRUS_LINES.armHalt;
  const v = el("div", "dv-virus", lines[Math.floor(Math.random() * lines.length)]);
  R.boardWrap.appendChild(v);
  if (virusTimer !== null) clearTimeout(virusTimer);
  virusTimer = window.setTimeout(() => v.remove(), 2400);
  if (mode === "armHalt" || mode === "armSiphon") {
    const sw = el("div", "dv-sweep");
    R.boardWrap.appendChild(sw);
    window.setTimeout(() => sw.remove(), 900);
  }
}

function handleFx(kind: string, n?: number): void {
  const s = soundOn;
  if (kind === "oppAim") {
    if (s) play("aim", { jitter: 0.04, bus: "game" });
    return;
  }
  if (kind.startsWith("oppCast:")) {
    const mode = kind.slice(8);
    showVirus(mode);
    logLine("int", `charging ${(MODE_LABEL[mode as OppMode] ?? mode).toLowerCase()}`);
    if (s) play("virusSting", { bus: "game" });
    shake(1);
    return;
  }
  switch (kind) {
    case "cascade":
      shake(n && n >= 5 ? 2 : 1);
      pulse(`CASCADE x${n ?? 2}`, false);
      logLine("you", `cascade x${n ?? 2}`);
      if (s) playCascade(n ?? 2);
      break;
    case "cascadeOpp":
      shake(1);
      pulse(`IT CLAIMED x${n ?? 2}`, true);
      logLine("int", `cascade x${n ?? 2}`);
      if (s) play("claimTick", { vol: 0.5, rate: 0.7, bus: "game" });
      break;
    case "claim":
      if (s) playCascade(1);
      break;
    case "claimOpp":
      if (s) play("claimTick", { vol: 0.4, rate: 0.7, bus: "game" });
      break;
    case "cascadeRam":
      pulse(`+${n ?? 1} RAM BANKED`, false);
      logLine("you", `+${n ?? 1} ram banked`);
      if (s) play("overclockCast", { vol: 0.8, bus: "game" });
      break;
    case "cascadeRamOpp":
      pulse(`IT BANKED +${n ?? 1} RAM`, true);
      logLine("int", `+${n ?? 1} ram banked`);
      break;
    case "trapFire":
      shake(3);
      pulse("TRAP SPRUNG", true);
      logLine("sys", "trap sprung");
      if (s) play("trapFire", { bus: "game" });
      break;
    case "siphonFire":
      shake(2);
      pulse(`SIPHONED ${n ?? 2} RAM`, true);
      logLine("sys", `${n ?? 2} ram siphoned`);
      if (s) play("overloadCast", { bus: "game" });
      break;
    case "turnLost":
      shake(2);
      pulse("TURN LOST", true);
      logLine("sys", "turn lost");
      if (s) play("trapFire", { bus: "game" });
      break;
    case "win":
      shake(3);
      logLine("sys", "core seized. link closed.");
      if (s) playStinger(true);
      break;
    case "lose":
      shake(3);
      logLine("sys", "core lost. link closed.");
      if (s) playStinger(false);
      break;
    case "redirect":
      shake(1);
      if (state.turn === "opp") logLine("int", "redirect hit");
      if (s) play("redirect", { jitter: 0.03, bus: "game" });
      break;
    case "rotate":
      if (state.turn === "opp") logLine("int", "twist");
      if (s) play("rotate", { jitter: 0.06, bus: "game" });
      if (s && state.turn === "player" && state.econ.player.rotations > state.par) {
        play("overParTick", { jitter: 0.05, bus: "game" });
      }
      break;
    case "deny":
      if (s) play("deny", { bus: "game" });
      break;
    case "endTurn":
      if (s) play("endTurn", { bus: "game" });
      break;
    case "trapSet":
      if (state.turn === "opp") logLine("int", "something armed");
      if (s) play("trapSet", { bus: "game" });
      break;
    case "scan":
      if (s) play("scanCast", { bus: "game" });
      pulse("SCANNED", false);
      break;
    case "trace":
      logLine("sys", "route traced");
      pulse("ROUTE TRACED", false);
      break;
    case "purge":
      if (state.turn === "opp") logLine("int", "traps swept");
      if (s) play("backdoorCast", { bus: "game" });
      pulse("DEFUSED", false);
      break;
    case "place":
      if (s) play("patchPlace", { bus: "game" });
      pulse("PIECE PLACED", false);
      break;
    case "lock":
      if (state.turn === "opp") logLine("int", "clamp locked");
      if (s) play("shieldCast", { bus: "game" });
      break;
    case "ward":
      if (state.turn === "opp") logLine("int", "ward raised");
      if (s) play("firewallCast", { bus: "game" });
      pulse("WARDED", false);
      break;
    default:
      break;
  }
}

/* ================= board (SVG schematic) ================= */

function armLine(mask: number, cls: string, width: number, len = HALF): SVGLineElement[] {
  const ends: Array<[number, number]> = [[0, -len], [len, 0], [0, len], [-len, 0]];
  const out: SVGLineElement[] = [];
  for (let d = 0; d < 4; d++) {
    if ((mask & (1 << d)) === 0) continue;
    const line = sv("line", cls);
    svAttr(line, { x1: 0, y1: 0, x2: ends[d][0], y2: ends[d][1], "stroke-width": width });
    out.push(line);
  }
  return out;
}

/** Irregular slag silhouette, seeded off the index so it never reflows. */
function slagPoints(idx: number): string {
  let s = (idx * 2654435761) >>> 0;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return (s >>> 8) / 0xffffff;
  };
  const pts: string[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + next() * 0.5;
    const r = 11 + next() * 6;
    pts.push(`${Math.round(Math.cos(a) * r)},${Math.round(Math.sin(a) * r)}`);
  }
  return pts.join(" ");
}

function buildCellG(cell: DuelCell, idx: number): CellRefs {
  const g = sv("g", "dv-cell");
  svAttr(g, { transform: `translate(${cell.x * CS + HALF} ${cell.y * CS + HALF})` });

  const hit = sv("rect", "dv-hit");
  svAttr(hit, { x: -HALF, y: -HALF, width: CS, height: CS, fill: "transparent" });
  g.appendChild(hit);

  const refs: CellRefs = {
    g, pop: null, arms: null, ghost: null, lit: [], rotates: false,
    snap: "", claimSeq: cell.claimSeq, base: cell.base, kind: cell.kind,
  };

  const addLit = (mask: number, host: SVGGElement) => {
    const ends: Array<[number, number]> = [[0, -HALF], [HALF, 0], [0, HALF], [-HALF, 0]];
    for (let d = 0; d < 4; d++) {
      if ((mask & (1 << d)) === 0) continue;
      const line = sv("line", "dv-armlit");
      svAttr(line, { x1: 0, y1: 0, x2: ends[d][0], y2: ends[d][1], "stroke-width": 2 });
      host.appendChild(line);
      refs.lit.push({ d, el: line });
    }
  };

  if (cell.kind === "block") {
    const body = sv("polygon", "dv-slagbody");
    svAttr(body, { points: slagPoints(idx) });
    g.appendChild(body);
    const crack = sv("path", "dv-crack");
    svAttr(crack, { d: "M -6 -4 L 4 5 M 2 -7 L -2 2" });
    g.appendChild(crack);
    const ring = sv("rect", "dv-legalring");
    svAttr(ring, { x: -HALF + 5, y: -HALF + 5, width: CS - 10, height: CS - 10 });
    g.appendChild(ring);
    const ghost = sv("g", "dv-ghost");
    g.appendChild(ghost);
    refs.ghost = ghost;
  }

  if (cell.kind === "node") {
    const ring = sv("rect", "dv-legalring");
    svAttr(ring, { x: -HALF + 5, y: -HALF + 5, width: CS - 10, height: CS - 10 });
    g.appendChild(ring);

    const jit = sv("g", "dv-jit");
    jit.style.animationDelay = `${(idx % 7) * 0.11}s`;
    const pop = sv("g", "dv-popg");
    const arms = sv("g", "dv-arms");
    arms.style.transform = `rotate(${cell.spin * 90}deg)`;
    for (const l of armLine(cell.base, "dv-arm", 4)) arms.appendChild(l);
    addLit(cell.base, arms);
    refs.rotates = true;
    pop.appendChild(arms);
    const node = sv("rect", "dv-node");
    svAttr(node, { x: -6, y: -6, width: 12, height: 12 });
    pop.appendChild(node);
    const weld = sv("rect", "dv-weld");
    svAttr(weld, { x: -3, y: -3, width: 6, height: 6 });
    pop.appendChild(weld);
    jit.appendChild(pop);
    g.appendChild(jit);
    refs.arms = arms;
    refs.pop = pop;

    const lock = sv("g", "dv-lock");
    const lb1 = sv("path", "dv-lockb");
    svAttr(lb1, { d: "M -14 -10 L -14 -15 L -9 -15 M 9 -15 L 14 -15 L 14 -10" });
    const lb2 = sv("path", "dv-lockb");
    svAttr(lb2, { d: "M -14 10 L -14 15 L -9 15 M 9 15 L 14 15 L 14 10" });
    const lr = sv("rect", "dv-lockrect");
    svAttr(lr, { x: -4, y: -3, width: 8, height: 6 });
    lock.append(lb1, lb2, lr);
    g.appendChild(lock);

    const ward = sv("rect", "dv-ward");
    svAttr(ward, { x: -12, y: -12, width: 24, height: 24, transform: "rotate(45)" });
    g.appendChild(ward);

    const trap = sv("path", "dv-trap");
    svAttr(trap, { d: "M 0 -14 L 3 -8 L 9 -7 L 5 -2 L 6 4 L 0 1 L -6 4 L -5 -2 L -9 -7 L -3 -8 Z" });
    g.appendChild(trap);

    const trace = sv("rect", "dv-trace");
    svAttr(trace, { x: -HALF + 9, y: -HALF + 9, width: CS - 18, height: CS - 18 });
    g.appendChild(trace);
  }

  if (cell.kind === "entryP" || cell.kind === "entryO") {
    const arms = sv("g", "dv-arms");
    for (const l of armLine(rotateArms(cell.base, cell.rot), "dv-arm", 4)) arms.appendChild(l);
    addLit(rotateArms(cell.base, cell.rot), arms);
    g.appendChild(arms);
    refs.arms = arms;
    const body = sv("rect", "dv-portbody");
    svAttr(body, { x: -12, y: -12, width: 24, height: 24 });
    g.appendChild(body);
    const eye = sv("rect", "dv-porteye");
    svAttr(eye, { x: -4, y: -4, width: 8, height: 8 });
    g.appendChild(eye);
    const tag = sv("text", "dv-tag");
    svAttr(tag, { y: 30, "text-anchor": "middle" });
    tag.textContent = cell.kind === "entryP" ? "YOU" : "INTRUSION";
    if (cell.kind === "entryO") tag.setAttribute("class", "dv-tag dv-tag-o");
    g.appendChild(tag);
  }

  if (cell.kind === "core") {
    const arms = sv("g", "dv-arms");
    for (const l of armLine(rotateArms(cell.base, cell.rot), "dv-arm dv-arm-core", 4)) arms.appendChild(l);
    addLit(rotateArms(cell.base, cell.rot), arms);
    g.appendChild(arms);
    const body = sv("rect", "dv-corebody");
    svAttr(body, { x: -15, y: -15, width: 30, height: 30 });
    g.appendChild(body);
    for (const [d, x, y] of [
      ["M 0 0 L 0 -7 L 7 -7", -21, -14],
      ["M 0 0 L 7 0 L 7 7", 14, -21],
      ["M 0 0 L 0 7 L -7 7", 21, 14],
      ["M 0 0 L -7 0 L -7 -7", -14, 21],
    ] as Array<[string, number, number]>) {
      const b = sv("path", "dv-coreb");
      svAttr(b, { d, transform: `translate(${x} ${y})` });
      g.appendChild(b);
    }
    const eye = sv("rect", "dv-coreeye");
    svAttr(eye, { x: -5, y: -5, width: 10, height: 10 });
    g.appendChild(eye);
    const tag = sv("text", "dv-tag");
    svAttr(tag, { y: 34, "text-anchor": "middle" });
    tag.textContent = "CORE";
    g.appendChild(tag);
  }

  // The whole group takes the click: arms, hub, and overlays all sit above
  // the hit rect and would otherwise swallow it.
  g.addEventListener("click", () => onCell(idx));
  return refs;
}

function buildBoard(): void {
  if (!R.boardWrap) return;
  R.board?.remove();
  const svg = sv("svg", "dv-board");
  svAttr(svg, {
    viewBox: `-10 -10 ${state.w * CS + 20} ${state.h * CS + 20}`,
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.setAttribute("role", "application");
  svg.setAttribute("aria-label", `Duel grid, ${state.w} by ${state.h}`);

  const defs = sv("defs");
  const pat = sv("pattern");
  svAttr(pat, { id: "dvGrid", width: CS, height: CS, patternUnits: "userSpaceOnUse" });
  // faint graph-paper rules along the cell boundaries, under the plus marks
  const gh = sv("rect", "dv-gridline");
  svAttr(gh, { x: 0, y: -0.5, width: CS, height: 1 });
  const gv = sv("rect", "dv-gridline");
  svAttr(gv, { x: -0.5, y: 0, width: 1, height: CS });
  const ph = sv("rect", "dv-griddot");
  svAttr(ph, { x: -3.5, y: -0.5, width: 7, height: 1 });
  const pv = sv("rect", "dv-griddot");
  svAttr(pv, { x: -0.5, y: -3.5, width: 1, height: 7 });
  pat.append(gh, gv, ph, pv);
  const hatch = sv("pattern");
  svAttr(hatch, { id: "dvHatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
  const hr = sv("rect", "dv-hatchline");
  svAttr(hr, { x: 0, y: 0, width: 2.4, height: 6 });
  hatch.appendChild(hr);
  const check = sv("pattern");
  svAttr(check, { id: "dvCheck", width: 4, height: 4, patternUnits: "userSpaceOnUse" });
  const c1 = sv("rect", "dv-checkdot");
  svAttr(c1, { x: 0, y: 0, width: 2, height: 2 });
  const c2 = sv("rect", "dv-checkdot");
  svAttr(c2, { x: 2, y: 2, width: 2, height: 2 });
  check.append(c1, c2);
  defs.append(pat, hatch, check);
  svg.appendChild(defs);

  const grid = sv("rect");
  svAttr(grid, { x: 0, y: 0, width: state.w * CS, height: state.h * CS, fill: "url(#dvGrid)" });
  svg.appendChild(grid);

  R.cells = state.cells.map((cell, idx) => {
    const refs = buildCellG(cell, idx);
    if (!REDUCED) {
      refs.g.classList.add("dv-cell-in");
      refs.g.style.animationDelay = `${(cell.x + cell.y) * 24}ms`;
    }
    svg.appendChild(refs.g);
    return refs;
  });

  R.boardWrap.prepend(svg);
  R.board = svg;
}

function legalSet(): Set<number> {
  const out = new Set<number>();
  if (!playerTurn()) return out;
  const econ = state.econ.player;
  if (placing !== null) {
    if (econ.ram < PLACE_COST) return out;
    for (let i = 0; i < state.cells.length; i++) if (canPlace(state, "player", i)) out.add(i);
    return out;
  }
  if (targeting) {
    for (let i = 0; i < state.cells.length; i++) {
      if (targeting.picked.includes(i)) continue;
      if (targeting.prog === "attack" && attackTargetLegal(state, "player", targeting.mode, i)) out.add(i);
      if (targeting.prog === "defend" && defendTargetLegal(state, "player", state.kit.defendMode, i)) out.add(i);
    }
    return out;
  }
  if (econ.ram < 1) return out;
  for (let i = 0; i < state.cells.length; i++) if (canRotate(state, "player", i)) out.add(i);
  return out;
}

/**
 * Hop count from a side's port through its powered network, walking only
 * aligned arm pairs. Gives every powered arm a direction: current runs
 * away from the port, so an arm facing a shallower neighbor is the inflow.
 */
function flowDepths(side: Side): number[] {
  const D: number[] = new Array(state.cells.length).fill(Infinity);
  const entry = side === "player" ? state.entryP : state.entryO;
  const pow = state.power[side];
  D[entry] = 0;
  const q = [entry];
  while (q.length > 0) {
    const i = q.shift()!;
    const c = state.cells[i];
    const arms = effectiveDuelArms(c);
    for (let d = 0; d < 4; d++) {
      if ((arms & (1 << d)) === 0) continue;
      const nx = c.x + DX[d];
      const ny = c.y + DY[d];
      if (nx < 0 || nx >= state.w || ny < 0 || ny >= state.h) continue;
      const n = ny * state.w + nx;
      if (!pow[n] || isFinite(D[n])) continue;
      if ((effectiveDuelArms(state.cells[n]) & (1 << oppositeDir(d))) === 0) continue;
      D[n] = D[i] + 1;
      q.push(n);
    }
  }
  return D;
}

function updateFlow(): void {
  if (!R.cells) return;
  const depths: Record<Side, number[]> = {
    player: flowDepths("player"),
    opp: flowDepths("opp"),
  };
  for (let idx = 0; idx < state.cells.length; idx++) {
    const refs = R.cells[idx];
    if (refs.lit.length === 0) continue;
    const side: Side | null = state.power.player[idx]
      ? "player"
      : state.power.opp[idx]
        ? "opp"
        : null;
    const cell = state.cells[idx];
    for (const { d, el } of refs.lit) {
      let cls = "dv-armlit";
      if (side) {
        const D = depths[side];
        const live = refs.rotates ? (d + cell.rot) % 4 : d;
        const nx = cell.x + DX[live];
        const ny = cell.y + DY[live];
        if (nx >= 0 && nx < state.w && ny >= 0 && ny < state.h) {
          const n = ny * state.w + nx;
          const facing =
            (effectiveDuelArms(state.cells[n]) & (1 << oppositeDir(live))) !== 0;
          if (state.power[side][n] && facing && isFinite(D[n]) && isFinite(D[idx])) {
            cls += D[n] < D[idx] ? " dv-flow-in" : " dv-flow-out";
          }
        }
      }
      if (el.getAttribute("class") !== cls) el.setAttribute("class", cls);
    }
  }
}

function updateBoard(): void {
  if (!R.cells) return;
  const legal = legalSet();
  const picked = new Set(targeting?.picked ?? []);
  const aim = state.oppTurn.aim;
  const aimed = new Set<number>(
    aim && state.phase === "playing" ? (aim.kind === "rotate" ? [aim.idx] : aim.targets) : [],
  );
  const traced = new Set(state.routeTrace?.cells ?? []);

  for (let idx = 0; idx < state.cells.length; idx++) {
    const cell = state.cells[idx];
    const refs = R.cells[idx];

    // A placed patch piece turns a block into a welded node: rebuild.
    if (cell.kind !== refs.kind || cell.base !== refs.base) {
      const fresh = buildCellG(cell, idx);
      refs.g.replaceWith(fresh.g);
      R.cells[idx] = fresh;
      fresh.claimSeq = -1; // force the claim/owner pass below
      updateOne(cell, idx, legal, picked, aimed, traced);
      continue;
    }
    updateOne(cell, idx, legal, picked, aimed, traced);
  }
  updateFlow();
}

function updateOne(
  cell: DuelCell,
  idx: number,
  legal: Set<number>,
  picked: Set<number>,
  aimed: Set<number>,
  traced: Set<number>,
): void {
  const refs = (R.cells as CellRefs[])[idx];
  const litP = state.power.player[idx] ?? false;
  const litO = state.power.opp[idx] ?? false;
  const locked = cell.lockedThroughRound >= state.round;
  const warded = cell.wardThroughRound >= state.round;
  const trapVisible =
    !!cell.trap && (cell.trap.by === "player" || cell.trap.revealed || state.phase !== "playing");

  const cls = ["dv-cell", `dv-k-${cell.kind}`];
  if (cell.kind === "node") {
    if (cell.owner === "player") cls.push("dv-own-p");
    else if (cell.owner === "opp") cls.push("dv-own-o");
    else cls.push("dv-own-n");
  }
  if (cell.kind === "entryP") cls.push("dv-own-p");
  if (cell.kind === "entryO") cls.push("dv-own-o");
  if (litP) cls.push("dv-lit-p");
  if (litO) cls.push("dv-lit-o");
  if (legal.has(idx)) cls.push("dv-legal");
  if (picked.has(idx)) cls.push("dv-picked");
  if (aimed.has(idx)) cls.push("dv-aimed");
  if (traced.has(idx)) cls.push("dv-traced");
  if (locked) cls.push("dv-locked");
  if (warded && !locked) cls.push("dv-warded");
  if (cell.fused) cls.push("dv-fused");
  if (trapVisible && cell.trap) {
    cls.push("dv-trapped", cell.trap.by === "player" ? "dv-trap-p" : "dv-trap-o");
    if (cell.trap.kind === "siphon") cls.push("dv-trap-siphon");
  }
  const snap = cls.join(" ");
  if (snap !== refs.snap) {
    refs.snap = snap;
    refs.g.setAttribute("class", refs.g.classList.contains("dv-cell-in") ? `${snap} dv-cell-in` : snap);
  }

  if (refs.arms && cell.kind === "node") {
    const want = `rotate(${cell.spin * 90}deg)`;
    if (refs.arms.style.transform !== want) refs.arms.style.transform = want;
  }

  // Claim pop rides its own wrapper so it never fights the glitch jitter.
  if (refs.pop && cell.claimSeq !== refs.claimSeq) {
    refs.claimSeq = cell.claimSeq;
    if (cell.claimSeq > 0 && !REDUCED) {
      refs.pop.classList.remove("dv-pop");
      void (refs.pop as unknown as SVGGraphicsElement).getBoundingClientRect();
      refs.pop.style.animationDelay = `${cell.claimWave * 55}ms`;
      refs.pop.classList.add("dv-pop");
    }
  }

  // Armed patch piece ghosted over legal slag.
  if (refs.ghost) {
    const mask = placing !== null ? state.patchPouch[placing] : undefined;
    const wantGhost = legal.has(idx) && mask !== undefined;
    if (wantGhost && refs.ghost.childNodes.length === 0 && mask !== undefined) {
      for (const l of armLine(mask, "dv-ghostarm", 3, HALF - 6)) refs.ghost.appendChild(l);
      const nub = sv("rect", "dv-ghostnode");
      svAttr(nub, { x: -4, y: -4, width: 8, height: 8 });
      refs.ghost.appendChild(nub);
    } else if (!wantGhost && refs.ghost.childNodes.length > 0) {
      refs.ghost.textContent = "";
    }
  }
}

/* ================= interactions ================= */

function onCell(idx: number): void {
  if (!playerTurn()) return;
  unlock();
  if (placing !== null) {
    const mask = state.patchPouch[placing];
    if (mask === undefined) {
      placing = null;
      render();
      return;
    }
    dispatch({ type: "place", idx, pouchIdx: placing, mask });
    placing = null;
    render();
    return;
  }
  if (targeting) {
    if (!legalSet().has(idx)) return;
    const picked = [...targeting.picked, idx];
    if (soundOn) play("tick", { jitter: 0.04 });
    if (picked.length >= targeting.want) {
      const t = targeting;
      targeting = null;
      dispatch({ type: "cast", prog: t.prog, targets: picked });
    } else {
      targeting = { ...targeting, picked };
      render();
    }
    return;
  }
  dispatch({ type: "rotate", idx });
}

function onProgram(prog: Program): void {
  if (!playerTurn() || state.econ.player.used[prog]) return;
  unlock();
  if (soundOn) play("press");
  placing = null;
  // Any program press abandons the one being aimed (duel.tsx ruling).
  targeting = null;
  if (prog === "scan") {
    dispatch({ type: "cast", prog: "scan", targets: [] });
    return;
  }
  if (prog === "attack") {
    const mode = state.kit.attackMode;
    targeting = {
      prog: "attack",
      mode,
      picked: [],
      want: ATTACK_WIDTH[tierOf(state, "player", "attack")],
      label: ATTACK_MODE_LABEL[mode],
    };
    render();
    return;
  }
  const mode = state.kit.defendMode;
  targeting = {
    prog: "defend",
    mode,
    picked: [],
    want: mode === "ward" ? 1 : DEFEND_WIDTH[tierOf(state, "player", "defend")],
    label: DEFEND_MODE_LABEL[mode],
  };
  render();
}

function castNow(): void {
  if (!targeting || targeting.picked.length === 0) return;
  const t = targeting;
  targeting = null;
  dispatch({ type: "cast", prog: t.prog, targets: t.picked });
}

function cancelArming(): void {
  targeting = null;
  placing = null;
  render();
}

/* ================= panel construction ================= */

function keyButton(prog: Program): { root: HTMLButtonElement; meta: HTMLElement; chip: HTMLElement; pips: HTMLElement } {
  const b = el("button", `dv-key dv-key-${prog}`);
  b.type = "button";
  const name = el("span", "dv-key-name");
  name.appendChild(el("b", "", prog.toUpperCase()));
  const pips = el("span", "dv-key-pips");
  name.appendChild(pips);
  const chip = el("i", "dv-key-chip", "RDY");
  name.appendChild(chip);
  const meta = el("span", "dv-key-meta");
  b.append(name, meta);
  b.addEventListener("click", () => onProgram(prog));
  b.addEventListener("mouseenter", () => showInfo(prog));
  b.addEventListener("mouseleave", () => hideInfo());
  b.addEventListener("focus", () => showInfo(prog));
  b.addEventListener("blur", () => hideInfo());
  return { root: b, meta, chip, pips };
}

function showInfo(prog: Program): void {
  if (!R.infoBox) return;
  let title = "";
  let desc = "";
  if (prog === "scan") {
    const t = tierOf(state, "player", "scan");
    title = `SCAN.EXE T${t} // RANGE ${SCAN_RANGE[t] >= 99 ? "FULL" : SCAN_RANGE[t]}`;
    desc = scanDesc(t);
  } else if (prog === "attack") {
    const t = tierOf(state, "player", "attack");
    title = `ATTACK.EXE T${t} // ${ATTACK_MODE_LABEL[state.kit.attackMode]}`;
    desc = attackModeDesc(state.kit.attackMode, t);
  } else {
    const t = tierOf(state, "player", "defend");
    title = `DEFEND.EXE T${t} // ${DEFEND_MODE_LABEL[state.kit.defendMode]}`;
    desc = defendModeDesc(state.kit.defendMode, t);
  }
  R.infoBox.textContent = "";
  R.infoBox.append(el("strong", "", title), el("p", "", desc));
  R.infoBox.classList.add("dv-info-on");
}

function hideInfo(): void {
  R.infoBox?.classList.remove("dv-info-on");
}

function datarow(label: string): { row: HTMLElement; em: HTMLElement } {
  const row = el("div", "kp-datarow");
  row.appendChild(el("span", "", label));
  const em = el("em");
  row.appendChild(em);
  return { row, em };
}

function buildShell(): void {
  const root = document.getElementById("root")!;
  root.textContent = "";
  const cust = customer();

  const shell = el("div", "dv-shell");
  R.shell = shell;

  /* ---- title strip ---- */
  const bar = el("header", "dv-bar");
  const title = el("h1", "", "DIVE.EXE");
  R.barTitle = title;
  const barRight = el("div", "dv-bar-right");
  R.barSub = el("span", "dv-bar-dev");
  const glyphs = el("span", "dv-bar-glyphs");
  for (let i = 0; i < 3; i++) glyphs.appendChild(el("i"));
  barRight.append(R.barSub, glyphs);
  bar.append(title, barRight);
  shell.appendChild(bar);

  /* ---- breadcrumb strip ---- */
  const crumb = el("div", "dv-crumb");
  R.crumbPath = el("span", "dv-crumb-path");
  const crumbRight = el("div", "dv-crumb-right");
  const roundBox = el("span", "dv-round");
  R.roundNum = el("em");
  const segs = el("span", "dv-roundsegs");
  R.roundSegs = [];
  for (let i = 0; i < ROUND_CAP; i++) {
    const seg = el("i", i >= ROUND_CAP - 5 ? "dv-seg-late" : "");
    segs.appendChild(seg);
    R.roundSegs.push(seg);
  }
  roundBox.append(el("span", "", "ROUND"), R.roundNum, segs);
  /* the TURN readout (round 3): the right rail's YOU / INTRUSION chips
   * read as false buttons and are gone; the status row absorbs the duty
   * as the same unboxed annotation furniture as ROUND */
  const turnRead = el("span", "dv-round dv-turnread");
  R.turnVal = el("em");
  turnRead.append(el("span", "", "TURN"), R.turnVal);
  R.daySlot = el("span", "dv-day");
  R.sndBtn = el("button", "dv-snd", `SND ${soundOn ? "ON" : "OFF"}`) as HTMLButtonElement;
  R.sndBtn.type = "button";
  R.sndBtn.addEventListener("click", () => {
    unlock();
    soundOn = !soundOn;
    if (!soundOn) stopDrone();
    R.sndBtn!.textContent = `SND ${soundOn ? "ON" : "OFF"}`;
    render();
  });
  crumbRight.append(turnRead, roundBox, R.daySlot, R.sndBtn);
  crumb.append(R.crumbPath, crumbRight);
  shell.appendChild(crumb);

  /* ---- stage ---- */
  const stage = el("div", "dv-stage");

  /* left rail: RAM + program keys + patch + end turn */
  const railL = el("div", "dv-rail dv-rail-l");
  R.railL = railL;

  const ramBox = el("div", "dv-rambox kp-frame-ticks");
  ramBox.appendChild(el("i", "kp-tick2"));
  const ramTop = el("div", "dv-ram-top");
  ramTop.appendChild(el("span", "dv-ram-label", "RAM"));
  R.ramNum = el("em", "dv-ram-num");
  ramTop.appendChild(R.ramNum);
  R.ramBanked = el("i", "dv-ram-banked");
  ramTop.appendChild(R.ramBanked);
  R.ramPips = el("div", "dv-ram-pips");
  ramBox.append(ramTop, R.ramPips);
  railL.appendChild(ramBox);

  R.keys = {
    scan: keyButton("scan"),
    attack: keyButton("attack"),
    defend: keyButton("defend"),
  };
  railL.append(R.keys.scan.root, R.keys.attack.root, R.keys.defend.root);

  R.patchWrap = el("div", "dv-patch");
  const patchHead = el("div", "dv-patch-head");
  patchHead.appendChild(el("span", "", "PATCH"));
  R.patchCount = el("i");
  patchHead.appendChild(R.patchCount);
  R.patchSlots = el("div", "dv-patch-slots");
  R.patchWrap.append(patchHead, R.patchSlots);
  railL.appendChild(R.patchWrap);

  const logBox = el("div", "dv-logbox");
  logBox.appendChild(el("span", "dv-log-head", "BUS.LOG"));
  R.log = el("div", "dv-log-lines");
  logBox.appendChild(R.log);
  railL.appendChild(logBox);

  R.endBtn = el("button", "kp-btn2 dv-end", "END TURN (E)") as HTMLButtonElement;
  R.endBtn.type = "button";
  R.endBtn.addEventListener("click", () => {
    unlock();
    if (soundOn) play("press");
    dispatch({ type: "endTurn" });
  });
  railL.appendChild(R.endBtn);
  stage.appendChild(railL);

  /* center: the board, sitting on a dressed instrument surface - dot
   * grid, dither haze, and schematic margin furniture that reads through
   * the sheet (watermark, hex block, rulers all under the SVG) */
  const wrap = el("div", "dv-boardwrap kp-frame-ticks");
  wrap.appendChild(el("i", "kp-tick2"));
  wrap.appendChild(el("i", "dv-boardtex"));
  wrap.appendChild(el("span", "dv-wm", "DIVE.EXE"));
  const hexcorner = el("span", "dv-hexcorner");
  let hs = scenario.seed >>> 0;
  const hnext = () => {
    hs = (Math.imul(hs, 1664525) + 1013904223) >>> 0;
    return hs;
  };
  hexcorner.textContent = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () =>
      (hnext() % 0xffff).toString(16).toUpperCase().padStart(4, "0"),
    ).join(" "),
  ).join("\n");
  wrap.appendChild(hexcorner);
  wrap.appendChild(el("i", "dv-ruler-b"));
  wrap.appendChild(el("i", "dv-ruler-r"));
  R.boardWrap = wrap;
  R.pulses = el("div", "dv-pulses");
  wrap.appendChild(R.pulses);
  R.threats = el("div", "dv-threats");
  wrap.appendChild(R.threats);
  stage.appendChild(wrap);

  /* right rail: telemetry */
  const railR = el("div", "dv-rail dv-rail-r");

  const routes = el("div", "kp-datarow-list");
  const ry = datarow("YOUR ROUTE");
  ry.row.classList.add("dv-warnrow");
  R.routeYou = ry.em;
  const ro = datarow("ITS ROUTE");
  ro.row.classList.add("dv-warnrow");
  R.routeOpp = ro.em;
  routes.append(ry.row, ro.row);
  railR.appendChild(routes);

  const oppBox = el("div", "dv-oppbox");
  /* banked RAM rides the INTRUSION header bar as an inverse stamp (round
   * 3): the BANKED datarow it replaces made the rail grow mid-run, which
   * is what shoved the device macro into the rail's clip edge on short
   * desks. A row you do not share is a row you pay for in full; the
   * header bar has the width to spare and a height nothing can change. */
  const oppHead = el("h3", "", "INTRUSION");
  R.oppBank = el("i", "dv-opp-banked");
  oppHead.appendChild(R.oppBank);
  oppBox.appendChild(oppHead);
  const rows = el("div", "kp-datarow-list");
  const r1 = datarow("RAM");
  R.oppRam = r1.em;
  const r3 = datarow("ARMED NODES");
  r3.row.classList.add("dv-hazrow");
  R.oppArmed = r3.em;
  rows.append(r1.row, r3.row);
  oppBox.appendChild(rows);
  oppBox.appendChild(el("p", "dv-tell", MODE_TELL[state.cfg.dominant]));
  R.oppIntent = el("p", "dv-intent");
  oppBox.appendChild(R.oppIntent);
  railR.appendChild(oppBox);

  const meterBox = el("div", "kp-datarow-list");
  const pr = datarow("PAR");
  pr.row.classList.add("dv-hazrow");
  R.parRow = pr.row;
  R.parVal = pr.em;
  const st = datarow("STRAIN");
  st.row.classList.add("dv-hazrow");
  R.strainRow = st.row;
  const strainWrap = el("span", "dv-strainbar");
  const fill = el("i");
  strainWrap.appendChild(fill);
  R.strainFill = fill;
  R.strainPct = el("b");
  st.em.append(strainWrap, R.strainPct);
  meterBox.append(pr.row, st.row);
  railR.appendChild(meterBox);

  const dev = el("div", "dv-device");
  const mon = el("span", "dv-mon");
  mon.dataset.feed = feed;
  const img = new Image();
  img.src = feed === "color" ? "art/cramdeck-color.png" : "../_shared/art/dex-cramdeck.png";
  img.alt = "";
  mon.appendChild(img);
  mon.appendChild(el("i", "tint"));
  R.monImg = img;
  R.mon = mon;
  dev.appendChild(mon);
  dev.appendChild(el("span", "dv-device-tag", `ON THE BENCH // ${cust.device.toUpperCase()}`));
  railR.appendChild(dev);

  stage.appendChild(railR);
  shell.appendChild(stage);

  /* console strip */
  const cons = el("footer", "dv-console");
  cons.appendChild(el("span", "dv-console-label", "// CONSOLE _"));
  R.consoleLine = el("span", "dv-console-line");
  cons.appendChild(R.consoleLine);
  R.consoleActions = el("span", "dv-console-actions");
  cons.appendChild(R.consoleActions);
  shell.appendChild(cons);

  R.infoBox = el("div", "dv-info");
  shell.appendChild(R.infoBox);

  R.overlay = el("div", "dv-overlay");
  shell.appendChild(R.overlay);

  root.appendChild(shell);
  consoleShown = "";

  R.barSub.textContent = `${cust.device.toUpperCase()} // T${scenario.tier}`;
  R.crumbPath.textContent = `KP_OS//SIGNAL.BUS//DIVE//${cust.id.toUpperCase().replace(/-/g, ".")}`;
  R.daySlot.textContent = `DAY 0${scenario.day}`;

  buildBoard();
}

/* ================= per-state render ================= */

function setConsole(text: string): void {
  if (!R.consoleLine || text === consoleShown) return;
  consoleShown = text;
  if (consoleTimer !== null) clearInterval(consoleTimer);
  if (REDUCED) {
    R.consoleLine.textContent = text;
    return;
  }
  const caret = el("span", "kp-boot-cursor", "_");
  let i = 0;
  R.consoleLine.textContent = "";
  R.consoleLine.appendChild(caret);
  consoleTimer = window.setInterval(() => {
    i += 2;
    R.consoleLine!.textContent = text.slice(0, i);
    if (i < text.length) R.consoleLine!.appendChild(caret);
    else if (consoleTimer !== null) clearInterval(consoleTimer);
  }, 14);
}

function consoleText(): string {
  if (state.phase !== "playing" && reviewing) {
    return state.winKind === "severed"
      ? "FINAL BOARD. Your territory has no open corridor left to the core."
      : "FINAL BOARD. Every trap on the grid is exposed.";
  }
  if (placing !== null) {
    const any = legalSet().size > 0;
    return any
      ? `PATCH PIECE: pick a slag block within reach. ${PLACE_COST} RAM. ESC cancels.`
      : "PATCH PIECE: no slag block in reach. ESC cancels.";
  }
  if (targeting) {
    const left = targeting.want - targeting.picked.length;
    return `${targeting.label}: pick ${left} target${left === 1 ? "" : "s"}. ESC cancels.`;
  }
  if (state.notice && state.notice.id !== noticeSeen) {
    noticeSeen = state.notice.id;
    noticeUntil = Date.now() + 4000;
  }
  if (state.notice && Date.now() < noticeUntil) return state.notice.text;
  if (state.phase !== "playing") return "LINK CLOSED.";
  if (state.turn === "opp") return "The intrusion is moving. Watch the line.";
  if (state.econ.player.ram < 1) return "No RAM left. E ends the turn.";
  return "Your move. Twist a junction in reach, run a program, or end the turn.";
}

function renderConsoleActions(): void {
  if (!R.consoleActions) return;
  R.consoleActions.textContent = "";
  if (state.phase !== "playing" && reviewing) {
    const back = el("button", "dv-cbtn", "BACK TO RESULT");
    back.type = "button";
    back.addEventListener("click", () => {
      reviewing = false;
      render();
    });
    R.consoleActions.appendChild(back);
    return;
  }
  if (targeting && targeting.picked.length > 0) {
    const cast = el("button", "dv-cbtn dv-cbtn-hot", "CAST NOW");
    cast.type = "button";
    cast.addEventListener("click", castNow);
    R.consoleActions.appendChild(cast);
  }
  if (arming()) {
    const cancel = el("button", "dv-cbtn", "CANCEL (ESC)");
    cancel.type = "button";
    cancel.addEventListener("click", cancelArming);
    R.consoleActions.appendChild(cancel);
  }
}

function renderThreats(playerNear: number, oppNear: number): void {
  if (!R.threats) return;
  R.threats.textContent = "";
  if (state.phase !== "playing") return;
  if (playerNear >= 99) {
    R.threats.appendChild(el("div", "dv-threat dv-threat-max", "NO ROUTE FROM YOUR PORT TO THE CORE"));
  }
  if (oppNear <= 2) {
    // Urgency without arithmetic: the exact rotation count stays hidden.
    R.threats.appendChild(
      el(
        "div",
        `dv-threat ${oppNear === 0 ? "dv-threat-max" : ""}`,
        oppNear === 0
          ? "ITS ROUTE IS OPEN TO THE CORE"
          : "THE INTRUSION IS CLOSING ON THE CORE",
      ),
    );
  }
}

function renderOverlay(): void {
  if (!R.overlay) return;
  if (state.phase === "playing" || reviewing) {
    R.overlay.classList.remove("dv-overlay-on");
    R.overlay.textContent = "";
    return;
  }
  if (R.overlay.classList.contains("dv-overlay-on")) return;
  R.overlay.classList.add("dv-overlay-on");
  R.overlay.textContent = "";
  const won = state.phase === "won";
  const box = el("div", `dv-result ${won ? "dv-result-w" : "dv-result-l"}`);
  const hero = won
    ? state.winKind === "gridlock" ? "LINK COLLAPSED" : "CORE SEIZED"
    : state.winKind === "severed" ? "ROUTE SEVERED" : "CORE LOST";
  box.appendChild(el("h2", "", hero));
  box.appendChild(el("div", "kp-frame-stripe"));
  box.appendChild(el("p", "dv-result-reason", state.endReason ?? (won ? "Your flood touched the core first. The intrusion collapses." : "Its flood got there first.")));

  const econ = state.econ.player;
  const overRot = Math.max(0, econ.rotations - state.par);
  const bill = el("div", "kp-datarow-list dv-result-bill");
  const rows: Array<[string, string, boolean]> = [
    ["ROUNDS", `${Math.min(state.round, ROUND_CAP)}/${ROUND_CAP}`, false],
    ["ROTATIONS", `${econ.rotations} / PAR ${state.par}`, overRot > 0],
    ["TRAPS FIRED ON YOU", `${econ.trapsFired}`, econ.trapsFired > 0],
  ];
  if (won && state.strainChip > 0) rows.push(["STRAIN CHIP", `-${state.strainChip}`, true]);
  if (!won) rows.push(["NEURAL STRAIN", "ZEROED. THE RUN IS OVER.", true]);
  for (const [label, value, warn] of rows) {
    const { row, em } = datarow(label);
    if (warn) row.classList.add("kp-datarow-warn", "dv-hazrow");
    em.textContent = value;
    bill.appendChild(row);
  }
  box.appendChild(bill);

  const actions = el("div", "dv-result-actions");
  const view = el("button", "kp-btn2 kp-btn2-ghost", "VIEW BOARD");
  view.type = "button";
  view.addEventListener("click", () => {
    reviewing = true;
    render();
  });
  const again = el("button", "kp-btn2", "CONTINUE");
  again.type = "button";
  again.addEventListener("click", () => {
    boot(scenario, (Math.random() * 0xffffffff) >>> 0);
  });
  actions.append(view, again);
  box.appendChild(actions);
  R.overlay.appendChild(box);
}

function render(): void {
  if (!R.shell) return;
  const econ = state.econ.player;
  const oppEcon = state.econ.opp;
  const isP = playerTurn();

  if (state.round !== lastRound) {
    lastRound = state.round;
    logLine("sys", `== round ${String(Math.min(state.round, ROUND_CAP)).padStart(2, "0")} ==`, true);
  }

  /* round meter */
  const round = Math.min(state.round, ROUND_CAP);
  R.roundNum!.textContent = `${String(round).padStart(2, "0")}/${ROUND_CAP}`;
  R.roundSegs!.forEach((seg, i) => {
    seg.classList.toggle("dv-seg-on", i < round - 1);
    seg.classList.toggle("dv-seg-now", i === round - 1 && state.phase === "playing");
  });

  /* left rail */
  R.railL!.classList.toggle("dv-rail-idle", !isP && state.phase === "playing");
  R.ramNum!.textContent = String(isP ? econ.ram : 0);
  const banked = econ.drainNext < 0 ? -econ.drainNext : 0;
  R.ramBanked!.textContent = banked > 0 ? `+${banked} NEXT` : "";
  const pipTotal = Math.max(econ.ramPerTurn + 3, econ.ram);
  const pips = R.ramPips!;
  while (pips.children.length < pipTotal) pips.appendChild(el("i"));
  while (pips.children.length > pipTotal) pips.lastChild?.remove();
  for (let i = 0; i < pips.children.length; i++) {
    (pips.children[i] as HTMLElement).className = i < econ.ram && isP ? "dv-pip-on" : "";
  }

  for (const prog of ["scan", "attack", "defend"] as Program[]) {
    const k = R.keys![prog];
    const cost = programCost(state, "player", prog);
    const offline = !programUnlocked(state, prog);
    const used = econ.used[prog];
    const tier = tierOf(state, "player", prog);
    const sub =
      prog === "scan"
        ? `R${SCAN_RANGE[tier] >= 99 ? "∞" : SCAN_RANGE[tier]}`
        : prog === "attack"
          ? ATTACK_MODE_LABEL[state.kit.attackMode]
          : DEFEND_MODE_LABEL[state.kit.defendMode];
    k.meta.textContent = offline ? "OFFLINE" : `${sub} // ${cost} RAM`;
    k.chip.textContent = targeting?.prog === prog ? `PICK ${targeting.want - targeting.picked.length}` : used ? "USED" : "RDY";
    k.chip.classList.toggle("dv-chip-used", used);
    k.chip.classList.toggle("dv-chip-arm", targeting?.prog === prog);
    k.chip.classList.toggle("dv-chip-rdy", !used && !offline && targeting?.prog !== prog);
    k.root.disabled = !isP || offline || used || econ.ram < cost;
    k.root.classList.toggle("dv-key-arming", targeting?.prog === prog);
    if (k.pips.children.length !== 3) {
      k.pips.textContent = "";
      for (let i = 0; i < 3; i++) k.pips.appendChild(el("i"));
    }
    for (let i = 0; i < 3; i++) (k.pips.children[i] as HTMLElement).className = i < tier ? "dv-on" : "";
  }

  /* patch strip */
  const pouch = state.patchPouch;
  R.patchCount!.textContent = pouch.length > 0 ? `x${pouch.length}` : "NONE HELD";
  const slots = R.patchSlots!;
  slots.textContent = "";
  for (let i = 0; i < pouch.length; i++) {
    const b = el("button", `dv-piece ${placing === i ? "dv-piece-armed" : ""}`);
    b.type = "button";
    b.disabled = !isP || econ.placedThisTurn || econ.ram < PLACE_COST;
    b.title = econ.placedThisTurn ? "One piece per turn" : `Place this piece (${PLACE_COST} RAM)`;
    b.appendChild(patchGlyph(pouch[i], 22, econ.placedThisTurn ? "dim" : "signal"));
    const at = i;
    b.addEventListener("click", () => {
      unlock();
      if (soundOn) play("press");
      targeting = null;
      placing = placing === at ? null : at;
      render();
    });
    slots.appendChild(b);
  }
  R.patchWrap!.classList.toggle("dv-patch-empty", pouch.length === 0);

  /* end turn */
  R.endBtn!.disabled = !isP || arming();
  R.endBtn!.textContent = arming() ? "PLACING..." : "END TURN (E)";
  R.endBtn!.classList.toggle("kp-btn2-signal", isP && !arming() && econ.ram === 0);

  /* right rail */
  const oppActing = state.turn === "opp" && state.phase === "playing";
  R.turnVal!.textContent = state.turn === "opp" ? "INTRUSION" : "YOU";
  R.turnVal!.classList.toggle("dv-turnval-you", state.turn === "player" && state.phase === "playing");
  R.turnVal!.classList.toggle("dv-turnval-opp", oppActing);
  R.turnVal!.classList.toggle("dv-turnval-live", oppActing);

  const threat = state.phase === "playing"
    ? { player: routeCost(state, "player"), opp: routeCost(state, "opp") }
    : { player: Infinity, opp: Infinity };
  const playerNear = isFinite(threat.player) ? threat.player : 99;
  const oppNear = isFinite(threat.opp) ? threat.opp : 99;
  // Qualitative only: the panel never counts down either side's distance.
  R.routeYou!.textContent = playerNear >= 99 ? "SEVERED" : "OPEN";
  R.routeYou!.parentElement!.classList.toggle("kp-datarow-warn", playerNear >= 99);
  R.routeOpp!.textContent =
    oppNear >= 99 ? "CUT" : oppNear === 0 ? "AT THE CORE" : oppNear <= 2 ? "CLOSING" : "OPEN";
  R.routeOpp!.parentElement!.classList.toggle("kp-datarow-warn", oppNear <= 2);
  // AT THE CORE is the same alarm's hottest cadence, never a second colour
  R.routeOpp!.parentElement!.classList.toggle("dv-warn-max", oppNear === 0);

  R.oppRam!.textContent = `${state.turn === "opp" ? oppEcon.ram : oppEcon.ramPerTurn} / ${oppEcon.ramPerTurn} PER TURN`;
  const oppBanked = oppEcon.drainNext < 0 ? -oppEcon.drainNext : 0;
  R.oppBank!.textContent = oppBanked > 0 ? `+${oppBanked} NEXT` : "";
  const armedCount = state.cells.filter((c) => c.trap && c.trap.by === "opp").length;
  const revealed = state.cells.filter((c) => c.trap && c.trap.by === "opp" && c.trap.revealed).length;
  R.oppArmed!.textContent = armedCount > 0 ? `${armedCount}${revealed < armedCount ? " (HIDDEN)" : ""}` : "0";
  R.oppArmed!.parentElement!.classList.toggle("kp-datarow-warn", armedCount > revealed);
  R.oppIntent!.textContent = state.oppNextIntent && state.turn === "opp" ? `INTENT: ${state.oppNextIntent}` : "";

  const overPar = econ.rotations - state.par;
  R.parVal!.textContent = `${econ.rotations}/${state.par}${overPar > 0 ? ` +${overPar} OVER` : ""}`;
  R.parRow!.classList.toggle("kp-datarow-warn", overPar > 0);
  if (overPar > 0 && !parWasOver && !REDUCED) {
    R.parRow!.classList.remove("dv-par-pop");
    void R.parRow!.offsetWidth;
    R.parRow!.classList.add("dv-par-pop");
  }
  parWasOver = overPar > 0;
  R.strainFill!.style.width = `${scenario.strain}%`;
  R.strainPct!.textContent = `${scenario.strain}%`;
  // the run-layer snapshot: hazard in its low band, never the alarm
  R.strainRow!.classList.toggle("kp-datarow-warn", scenario.strain <= 35);

  /* board + overlays */
  updateBoard();
  renderThreats(playerNear, oppNear);
  setConsole(consoleText());
  renderConsoleActions();
  renderOverlay();

  /* opponent cadence + presence drone */
  const oppMoving = state.phase === "playing" && state.turn === "opp" && !holdOpp;
  if (oppMoving && oppTimer === null) {
    if (soundOn) startDrone();
    oppTimer = window.setInterval(() => dispatch({ type: "oppStep" }), 420);
  } else if (!oppMoving && oppTimer !== null) {
    clearInterval(oppTimer);
    oppTimer = null;
    stopDrone();
  }

  /* tension heartbeat, bucketed like the shipped duel */
  const near = Math.min(playerNear, oppNear);
  const tier = state.phase !== "playing" || !soundOn ? 0 : near <= 1 ? 2 : near <= 3 ? 1 : 0;
  if (tier !== heartbeatTier) {
    heartbeatTier = tier;
    if (heartbeatTimer !== null) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (tier > 0) {
      const beat = () => play("heartbeat", { vol: tier === 2 ? 1 : 0.7, rate: tier === 2 ? 1.15 : 1, bus: "game" });
      beat();
      heartbeatTimer = window.setInterval(beat, tier === 2 ? 650 : 950);
    }
  }
}

/* ================= boot ================= */

function boot(sc: Scenario, seed?: number): void {
  scenario = sc;
  targeting = null;
  placing = null;
  reviewing = false;
  parWasOver = false;
  noticeSeen = 0;
  noticeUntil = 0;
  heartbeatTier = 0;
  if (oppTimer !== null) clearInterval(oppTimer);
  oppTimer = null;
  if (heartbeatTimer !== null) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
  stopDrone();

  const useSeed = seed ?? sc.seed;
  const cfg = dayDuelConfig(sc.day, customer().dominant, sc.tier, useSeed);
  state = createDuel(cfg, useSeed, { ...sc.kit, patchPouch: [...sc.kit.patchPouch] }, sc.ramPerTurn);
  lastRound = 1;
  buildShell();
  logLine("sys", `tap spliced. ${customer().device.toLowerCase()}`);
  logLine("sys", "== round 01 ==", true);
  logLine("sys", "bus live. your move.");
  render();
}

/* ================= input ================= */

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    cancelArming();
  } else if (e.code === "KeyE" && playerTurn() && !arming()) {
    dispatch({ type: "endTurn" });
  } else if (e.code === "Digit1") {
    onProgram("scan");
  } else if (e.code === "Digit2") {
    onProgram("attack");
  } else if (e.code === "Digit3") {
    onProgram("defend");
  }
});

document.addEventListener("pointerdown", () => unlock(), { once: true });

/* ================= demo rig ================= */

function radioRow(rowId: string, opts: Array<{ id: string; label: string }>, initial: string, onPick: (id: string) => void): HTMLElement {
  const row = document.getElementById(rowId)!;
  row.textContent = "";
  for (const o of opts) {
    const b = el("button", o.id === initial ? "rig-on" : "", o.label);
    b.addEventListener("click", () => {
      row.querySelectorAll("button").forEach((x) => (x.className = ""));
      b.className = "rig-on";
      onPick(o.id);
    });
    row.appendChild(b);
  }
  return row;
}

/* SCHEME: DEFAULT is the data-scheme-unset collapse onto the v2 accent */
function setScheme(id: string): void {
  if (id === "default") delete document.documentElement.dataset.scheme;
  else document.documentElement.dataset.scheme = id;
}

/* CRT: layers are added and REMOVED, never faded */
const glassEl = document.getElementById("glass")!;
const glassLayers = Array.prototype.slice.call(glassEl.children) as HTMLElement[];
function setCrt(mode: string): void {
  document.getElementById("stage")!.classList.toggle("crt-on", mode !== "off");
  glassEl.textContent = "";
  if (mode !== "off") glassLayers.forEach((l) => glassEl.appendChild(l));
}

/* VIEWPORT: the stage lays out at true resolution and scales to fit */
const VIEWPORTS = [
  { id: "169", label: "16:9 1366x768", w: 1366, h: 768 },
  { id: "219", label: "21:9 2560x1080", w: 2560, h: 1080 },
  { id: "laptop", label: "LAPTOP 1280x800", w: 1280, h: 800 },
];
let VP = VIEWPORTS[0];
function fit(): void {
  const availW = Math.max(320, window.innerWidth - 300);
  const availH = Math.max(320, window.innerHeight - 90);
  const k = Math.min(1, availW / VP.w, availH / VP.h);
  document.getElementById("fit")!.style.transform = `scale(${k})`;
  const wrap = document.getElementById("fitwrap")!;
  wrap.style.width = `${Math.round(VP.w * k)}px`;
  wrap.style.height = `${Math.round(VP.h * k)}px`;
  const meas = document.getElementById("meas");
  if (meas) meas.textContent = `STAGE ${VP.w}x${VP.h} FULL-SCREEN (no window ceiling)`;
}
function applyViewport(v: typeof VIEWPORTS[number]): void {
  VP = v;
  const stage = document.getElementById("stage")!;
  stage.style.width = `${v.w}px`;
  stage.style.height = `${v.h}px`;
  fit();
}
window.addEventListener("resize", fit);

/* FEED: the macro bezel's treatment */
new Image().src = "art/cramdeck-color.png";
function setFeed(id: "ink" | "true" | "color"): void {
  feed = id;
  if (R.mon) R.mon.dataset.feed = id;
  if (R.monImg) R.monImg.src = id === "color" ? "art/cramdeck-color.png" : "../_shared/art/dex-cramdeck.png";
}

/* BEAT: force the review states the user should not have to wait for.
 * TELEGRAPH ARMED plays real engine turns (end the player's turn, pump
 * oppStep) until the machine's aim is set, then freezes its cadence so the
 * brackets, INTENT line and virus card hold still for review. The END
 * overlays stamp the phase over the live state: presentation forcing only,
 * every number on the bill is the real board's. */
function forceTelegraph(): void {
  holdOpp = true;
  targeting = null;
  placing = null;
  reviewing = false;
  if (state.phase !== "playing") boot(scenario);
  holdOpp = true;
  if (state.turn === "player") dispatch({ type: "endTurn" });
  /* pump real engine turns until a CAST aim arms (a rotate aim carries no
   * virus card, and the review state owes brackets + INTENT + card at
   * once); then hold the card past its burnout so the state stays still */
  let guard = 0;
  while (
    state.phase === "playing" &&
    guard < 400 &&
    !(state.turn === "opp" && state.oppTurn.aim && state.oppTurn.aim.kind === "cast")
  ) {
    if (state.turn === "player") dispatch({ type: "endTurn" });
    else dispatch({ type: "oppStep" });
    guard++;
  }
  const aim = state.oppTurn.aim;
  if (aim && aim.kind === "cast") {
    showVirus(aim.mode);
    if (virusTimer !== null) clearTimeout(virusTimer);
    R.boardWrap?.querySelector(".dv-virus")?.classList.add("dv-virus-hold");
  }
  if (soundOn) play("aim", { bus: "game" });
  render();
}

function forceEnd(won: boolean): void {
  holdOpp = false;
  reviewing = false;
  targeting = null;
  placing = null;
  if (state.phase !== "playing") boot(scenario);
  state = {
    ...state,
    phase: won ? "won" : "lost",
    winKind: "core",
    endReason: won
      ? "Your flood touched the core first. The intrusion collapses."
      : "Its flood got there first.",
  };
  if (soundOn) playStinger(won);
  render();
}

function resumeLive(): void {
  if (!holdOpp && state.phase === "playing") return;
  holdOpp = false;
  boot(scenario);
}

(function rig() {
  radioRow("schemerow", [
    { id: "default", label: "DEFAULT" },
    { id: "nerv", label: "NERV" },
    { id: "tokyo", label: "TOKYO NIGHT" },
  ], "nerv", setScheme);

  radioRow("crtrow", [
    { id: "flat", label: "FLAT" },
    { id: "off", label: "OFF" },
  ], "flat", setCrt);

  radioRow("vprow", VIEWPORTS.map((v) => ({ id: v.id, label: v.label })), "169", (id) => {
    applyViewport(VIEWPORTS.find((v) => v.id === id)!);
  });

  const scRow = document.getElementById("screrow")!;
  SCENARIOS.forEach((sc) => {
    const b = el("button", sc.id === scenario.id ? "rig-on" : "", sc.label);
    b.addEventListener("click", () => {
      scRow.querySelectorAll("button").forEach((x) => (x.className = ""));
      b.className = "rig-on";
      holdOpp = false;
      boot(sc);
      syncBeatRow("live");
    });
    scRow.appendChild(b);
  });

  const reRow = document.getElementById("rerow")!;
  const re = el("button", "", "RESEED");
  re.addEventListener("click", () => {
    holdOpp = false;
    boot(scenario, (Math.random() * 0xffffffff) >>> 0);
    syncBeatRow("live");
  });
  reRow.appendChild(re);

  radioRow("beatrow", [
    { id: "live", label: "LIVE" },
    { id: "telegraph", label: "TELEGRAPH ARMED" },
    { id: "win", label: "END (WIN)" },
    { id: "loss", label: "END (LOSS)" },
  ], "live", (id) => {
    if (id === "live") resumeLive();
    else if (id === "telegraph") forceTelegraph();
    else forceEnd(id === "win");
  });

  radioRow("feedrow", [
    { id: "ink", label: "INK TINT" },
    { id: "true", label: "TRUE 1-BIT" },
    { id: "color", label: "FULL COLOUR" },
  ], "ink", (id) => setFeed(id as "ink" | "true" | "color"));
})();

function syncBeatRow(id: string): void {
  const row = document.getElementById("beatrow")!;
  const ids = ["live", "telegraph", "win", "loss"];
  row.querySelectorAll("button").forEach((b, i) => {
    b.className = ids[i] === id ? "rig-on" : "";
  });
}

setScheme("nerv");
setCrt("flat");
applyViewport(VP);
boot(scenario);
