import { el, hero, btn, chip, ticks, stripe } from "./ui";
import {
  AUGMENTS, AUGMENT_BY_ID, ATTACK_MODE_LABEL, DEFEND_MODE_LABEL,
  scanDesc, attackModeDesc, defendModeDesc, PATCH_POUCH_MAX,
} from "./data";
import { play } from "./sound";
import type { Win } from "./wm";

/**
 * MANUAL.TXT: kpos-manual. Five tabs over a fixed 520px frame, hero
 * letterhead per tab, PREV/NEXT + N/5 chip, page-flip on every switch.
 * Copy is the shipped ManualContent text verbatim (shop-os.tsx:103-194).
 */

const TABS = ["DIVE", "KIT", "PATCHES", "AUGMENTS", "BAYS"] as const;
type Tab = (typeof TABS)[number];

function ability(name: string, tag: string, desc: string): HTMLElement {
  const w = el("div", "kp-manual-ability");
  const strong = el("strong");
  strong.append(document.createTextNode(name), el("em", "", tag));
  w.append(strong, el("p", "", desc));
  return w;
}

function pageFor(tab: Tab): HTMLElement {
  const page = el("div", "kp-manual-page");
  if (tab === "DIVE") {
    page.appendChild(el("h3", "", "HOW A DIVE WORKS"));
    page.appendChild(el("p", "",
      "The whole grid is scrambled junctions. Click one to rotate it a quarter turn (1 RAM). Your " +
      "signal floods live from YOUR port through every aligned pipe and claims what it touches. " +
      "One good rotation can cascade a whole chain. First flood to touch the CORE wins the job."));
    page.appendChild(el("p", "",
      "You can rotate your own claimed junctions and any open junction within TWO steps of your " +
      "territory: set up a chain, then trip it. Cascades of four or more claims BANK bonus RAM for " +
      "your next turn. The intrusion floods from the far port under the same rules, on its own " +
      "RAM. Losing a duel zeroes Neural Strain and ends the run. Sloppy wins chip it."));
  } else if (tab === "KIT") {
    page.appendChild(el("h3", "", "THE KIT: three programs, 1 RAM, once per turn each"));
    const list = el("div", "kp-manual-abilities");
    list.appendChild(ability("SCAN.EXE", "always 1 RAM",
      `${scanDesc(1)} Upgrades widen the sweep. Scan before you walk; every trap it finds stays found.`));
    list.appendChild(ability("ATTACK.EXE", "configurable",
      `${ATTACK_MODE_LABEL.redirect}: ${attackModeDesc("redirect", 1)} ` +
      `${ATTACK_MODE_LABEL.armHalt}: ${attackModeDesc("armHalt", 1)} ` +
      `${ATTACK_MODE_LABEL.armSiphon}: ${attackModeDesc("armSiphon", 1)} Upgrades hit more nodes per cast.`));
    list.appendChild(ability("DEFEND.EXE", "configurable",
      `${DEFEND_MODE_LABEL.purge}: ${defendModeDesc("purge", 1)} ` +
      `${DEFEND_MODE_LABEL.lock}: ${defendModeDesc("lock", 1)} ` +
      `${DEFEND_MODE_LABEL.ward}: ${defendModeDesc("ward", 1)} Upgrades cover more nodes per cast.`));
    page.appendChild(list);
  } else if (tab === "PATCHES") {
    page.appendChild(el("h3", "", "PATCH PIECES"));
    page.appendChild(el("p", "",
      "Slag blocks used to take a flat cell. Now they take a shaped piece: straight, elbow, tee, " +
      "or cross. Whatever arms a piece rolls on pickup are the arms it keeps, nothing rotates " +
      "once it is in your pouch, and a placed piece is welded where it lands."));
    page.appendChild(el("p", "",
      "Craft two pieces at the bench into the union of their arms. Legal only when the result is " +
      "strictly bigger than both pieces you started with; equal or smaller, the bench will not " +
      "make the join."));
    page.appendChild(el("p", "",
      "Three ways into the pouch: buy blind off the darknet, pull one from a cleared job, or bank " +
      `a random piece on a clean win. Five pieces, pouch capped.`));
  } else if (tab === "AUGMENTS") {
    // no h3 here: the hero letterhead above the frame already reads AUGMENTS
    const grid = el("div", "kp-aug-3col");
    for (const a of AUGMENTS) {
      const card = ability(a.name, a.kind === "config" ? "config" : "boost", a.desc);
      if (a.requires?.kind === "augment") {
        card.appendChild(el("p", "kp-aug-req", `Needs ${AUGMENT_BY_ID[a.requires.id]?.name ?? a.requires.id}.`));
      }
      if (a.requires?.kind === "pouch") {
        card.appendChild(el("p", "kp-aug-req", "Needs a piece in the pouch."));
      }
      grid.appendChild(card);
    }
    page.appendChild(grid);
  } else {
    page.appendChild(el("h3", "", "BOOST BAYS"));
    page.appendChild(el("p", "",
      "Boosts install into bays, three of them to start. Configs are not boosts and never count " +
      "against the cap."));
    page.appendChild(el("p", "",
      "A full bay does not block a new boost, it swaps one: take the drop or keep what is already " +
      "installed. Buy more bays at day close. First one runs 150 cr, the next 300."));
    page.appendChild(el("p", "kp-rail-dim",
      "Every cleared job offers a draft of augments; every closed day offers +1 RAM or a program " +
      "tier. Everything resets when the run ends. Only you remember."));
  }
  return page;
}

export function buildManual(win: Win): void {
  let active: Tab = "DIVE";

  const paint = (flip: boolean) => {
    win.body.textContent = "";
    const box = el("div", "kp-manual");

    const tabs = el("div", "kp-manual-tabs");
    for (const t of TABS) {
      const b = el("button", `kp-manual-tab ${t === active ? "kp-tab-on" : ""}`.trim(), t);
      b.type = "button";
      b.addEventListener("click", () => nav(t));
      tabs.appendChild(b);
    }
    box.appendChild(tabs);
    const s = stripe();
    s.style.setProperty("--stripe", "var(--kp-line)");
    box.appendChild(s);

    const frame = el("div", `kp-manual-frame ${active === "AUGMENTS" ? "kp-manual-dense" : ""}`.trim());
    if (flip) frame.classList.add("kp-page-flip");
    frame.appendChild(hero(active, "kp-manual-hero"));
    frame.appendChild(pageFor(active));
    box.appendChild(frame);

    const foot = el("div", "kp-manual-foot");
    const idx = TABS.indexOf(active);
    const prev = btn("PREV", "ghost", () => nav(TABS[idx - 1]));
    const next = btn("NEXT", "ghost", () => nav(TABS[idx + 1]));
    prev.disabled = idx <= 0;
    next.disabled = idx >= TABS.length - 1;
    foot.append(prev, next);
    foot.appendChild(chip("PAGE", `${idx + 1}/${TABS.length}`));
    box.appendChild(foot);

    win.body.appendChild(box);
  };

  const nav = (t: Tab | undefined) => {
    if (!t || t === active) return;
    active = t;
    play("pageFlip");
    paint(true);
  };

  paint(false);
}
