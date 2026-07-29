import { el, hero, btn, chip, ticks, nodes } from "./ui";
import { visibleJournalMock, JournalEntry } from "./data";
import { play } from "./sound";
import type { Win } from "./wm";

/**
 * DAD.LOG: kpos-dadlog. Indigo dossier, one entry per page, default landing
 * on the most recently unlocked entry; locked teaser is the final page.
 */

const SVGNS = "http://www.w3.org/2000/svg";

/** Deterministic hash of an entry id: seeds the decorative hex/wave strip. */
function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function waveStrip(id: string): HTMLElement {
  const wrap = el("div", "kp-jentry-wave");
  let s = hashSeed(id);
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s;
  };
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("width", "180");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 180 22");
  const pts: string[] = [];
  for (let x = 0; x <= 180; x += 6) {
    const y = 11 + (((next() % 100) / 100) * 16 - 8);
    pts.push(`${x},${Math.round(y)}`);
  }
  const line = document.createElementNS(SVGNS, "polyline");
  line.setAttribute("points", pts.join(" "));
  line.setAttribute("shape-rendering", "crispEdges");
  svg.appendChild(line);
  wrap.appendChild(svg);

  const groups: string[] = [];
  for (let g = 0; g < 4; g++) {
    groups.push((next() % 0xffff).toString(16).toUpperCase().padStart(4, "0"));
  }
  wrap.appendChild(el("span", "kp-jentry-hex", groups.join(" - ")));
  return wrap;
}

export function buildDadlog(win: Win): void {
  const { unlocked, nextLocked } = visibleJournalMock();
  const total = unlocked.length + (nextLocked ? 1 : 0);
  let page = unlocked.length - 1; // most recently unlocked entry

  const paint = (flip: boolean) => {
    win.body.textContent = "";
    const box = el("div", "kp-dadlog");
    const frame = el("div", "kp-dadlog-frame");
    if (flip) frame.classList.add("kp-page-flip");

    const isLocked = page >= unlocked.length;
    if (!isLocked) {
      const e: JournalEntry = unlocked[page];
      const card = el("article", `kp-jentry kp-jentry-${e.kind}`);
      nodes(card, true);
      const datebar = el("header", "kp-jentry-datebar");
      datebar.append(el("span", "", e.kind.toUpperCase()), el("span", "", e.date));
      card.appendChild(datebar);
      card.appendChild(hero(e.title, "kp-jentry-hero"));
      const body = el("div", "kp-jentry-body");
      for (const line of e.body) body.appendChild(el("p", "", line));
      card.appendChild(body);
      card.appendChild(waveStrip(e.id));
      frame.appendChild(card);
    } else if (nextLocked) {
      const card = el("article", "kp-jentry kp-jentry-locked");
      ticks(card);
      const datebar = el("header", "kp-jentry-datebar");
      datebar.append(el("span", "", "????"), el("span", "", "keep diving"));
      card.appendChild(datebar);
      card.appendChild(hero("????", "kp-jentry-hero"));
      const body = el("div", "kp-jentry-body");
      body.appendChild(el("p", "", "There is more in the drawer. It can wait until you cannot sleep again."));
      card.appendChild(body);
      frame.appendChild(card);
    }

    box.appendChild(frame);

    const foot = el("div", "kp-dadlog-foot");
    const prev = btn("PREV", "ghost", () => nav(-1));
    const next = btn("NEXT", "ghost", () => nav(1));
    prev.disabled = page <= 0;
    next.disabled = page >= total - 1;
    foot.append(prev, next);
    foot.appendChild(chip("ENTRY", `${page + 1}/${total}`));
    box.appendChild(foot);

    win.body.appendChild(box);
  };

  const nav = (d: number) => {
    const target = Math.min(total - 1, Math.max(0, page + d));
    if (target === page) return;
    page = target;
    play("pageFlip");
    paint(true);
  };

  paint(false);
}
