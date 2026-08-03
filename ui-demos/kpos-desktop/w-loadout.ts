import { el, datarows, pipRow, patchGlyph, btn } from "../_shared/ui";
import {
  run, on, emit, PATCH_POUCH_MAX, SHAPE_NOUN, shapeClassOf,
  ATTACK_MODE_LABEL, DEFEND_MODE_LABEL, AUGMENT_BY_ID,
  scanDesc, attackModeDesc, defendModeDesc, AttackMode, DefendMode,
} from "./data";
import { play } from "../_shared/sound";
import type { Win } from "./wm";

/**
 * LOADOUT.CFG: kpos-loadout. Two-column dossier: program spec rows left;
 * bay cells, read-only pouch (redirects to SOLDER.BAY), configs note right.
 */

const ATTACK_MODES_ALL: AttackMode[] = ["redirect", "armHalt", "armSiphon"];
const DEFEND_MODES_ALL: DefendMode[] = ["purge", "lock", "ward"];

export function buildLoadout(win: Win, openSolder: () => void): void {
  const paint = () => {
    win.body.textContent = "";

    const head = el("header", "kp-kit-card-head");
    head.append(el("strong", "", "KIT CONFIG"));
    win.body.appendChild(head);
    win.body.appendChild(el("p", "kp-rail-dim",
      "Three programs, 1 RAM each, once per turn each. Tiers come from closed days; configs come " +
      "from cleared jobs. Tune it whenever; it holds until you change it."));

    const grid = el("div", "kp-build");
    const left = el("div", "kp-build-col");
    const right = el("div", "kp-build-col");

    left.appendChild(specRow("SCAN.EXE", run.kit.scanTier, null, scanDesc(run.kit.scanTier)));
    left.appendChild(specRow("ATTACK.EXE", run.kit.attackTier, {
      all: ATTACK_MODES_ALL,
      owned: run.kit.attackModes,
      active: run.kit.attackMode,
      labels: ATTACK_MODE_LABEL,
      set: (m) => { run.kit.attackMode = m as AttackMode; emit("kit"); paint(); },
    }, attackModeDesc(run.kit.attackMode, run.kit.attackTier)));
    left.appendChild(specRow("DEFEND.EXE", run.kit.defendTier, {
      all: DEFEND_MODES_ALL,
      owned: run.kit.defendModes,
      active: run.kit.defendMode,
      labels: DEFEND_MODE_LABEL,
      set: (m) => { run.kit.defendMode = m as DefendMode; emit("kit"); paint(); },
    }, defendModeDesc(run.kit.defendMode, run.kit.defendTier)));

    /* boost bays: always all 5 cells */
    const baysWrap = el("div", "kp-spec-row");
    const baysHead = el("header");
    baysHead.append(el("strong", "", "BOOST BAYS"));
    const baysCount = el("span", "kp-spec-tier");
    baysCount.appendChild(pipRow(run.kit.augments.length, run.boostSlots));
    baysHead.appendChild(baysCount);
    baysWrap.appendChild(baysHead);
    const bays = el("div", "kp-bays-grid");
    for (let i = 0; i < 5; i++) {
      const id = run.kit.augments[i];
      if (id) {
        const a = AUGMENT_BY_ID[id];
        const cell = el("div", "kp-bay-cell");
        cell.append(el("strong", "", a?.name ?? id), el("span", "", a?.desc ?? ""));
        bays.appendChild(cell);
      } else {
        const cell = el("div", "kp-bay-cell kp-bay-empty");
        cell.append(el("strong", "", "EMPTY BAY"));
        bays.appendChild(cell);
      }
    }
    baysWrap.appendChild(bays);
    right.appendChild(baysWrap);

    /* read-only pouch, chrome-matched to SOLDER.BAY's deck */
    const pouch = el("div", "kp-pouch-panel");
    const ph = el("header", "kp-kit-card-head");
    ph.append(el("strong", "", "PATCH POUCH"), el("em", "", `${run.patchPouch.length} / ${PATCH_POUCH_MAX}`));
    pouch.appendChild(ph);
    const rack = el("div", "kp-pieces-ro");
    for (const m of run.patchPouch) {
      const s = el("span");
      s.appendChild(patchGlyph(m, 34));
      s.appendChild(el("span", "", SHAPE_NOUN[shapeClassOf(m)]));
      rack.appendChild(s);
    }
    for (let i = run.patchPouch.length; i < PATCH_POUCH_MAX; i++) {
      const s = el("span");
      s.appendChild(el("span", "kp-piece-hole"));
      rack.appendChild(s);
    }
    pouch.appendChild(rack);
    const craft = btn("CRAFT", "ghost", () => {
      play("press");
      openSolder();
    });
    pouch.appendChild(craft);
    pouch.appendChild(el("p", "kp-pouch-foot",
      "A piece fills one slag block with exactly the arms it shows, welded where it lands. " +
      "2 RAM, one per turn, single use. Pieces come off the darknet, drop from cleared jobs, " +
      `or bank on clean wins; the pouch holds ${PATCH_POUCH_MAX}.`));
    pouch.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("button") === craft) return;
      play("press");
      openSolder();
    });
    right.appendChild(pouch);

    /* configs note */
    const cfg = el("div", "kp-spec-row");
    const cfgHead = el("header");
    const cfgCount = run.kit.attackModes.length - 1 + run.kit.defendModes.length - 1;
    cfgHead.append(el("strong", "", "CONFIGS"), el("em", "", `${cfgCount} / 4`));
    cfg.appendChild(cfgHead);
    cfg.appendChild(el("p", "kp-spec-desc",
      "Mode unlocks live outside the bays and never count against the cap. Switch modes on the " +
      "program cards above."));
    left.appendChild(cfg);

    grid.append(left, right);
    win.body.appendChild(grid);
  };

  interface ModeCfg {
    all: string[];
    owned: string[];
    active: string;
    labels: Record<string, string>;
    set: (m: string) => void;
  }

  const specRow = (name: string, tier: number, modes: ModeCfg | null, desc: string) => {
    const row = el("div", "kp-spec-row");
    const head = el("header");
    head.appendChild(el("strong", "", name));
    const tierWrap = el("span", "kp-spec-tier");
    tierWrap.appendChild(el("span", "kp-tiernum", String(tier)));
    tierWrap.appendChild(pipRow(tier, 3));
    head.appendChild(tierWrap);
    row.appendChild(head);
    if (modes) {
      const mrow = el("div", "kp-kit-modes");
      for (const m of modes.all) {
        const owned = modes.owned.includes(m);
        const b = el("button", `kp-mode ${modes.active === m ? "kp-mode-on" : ""} ${owned ? "" : "kp-mode-locked"}`.trim());
        b.type = "button";
        b.textContent = modes.labels[m] + (owned ? "" : " ?");
        b.disabled = !owned;
        b.addEventListener("click", () => { play("tick"); modes.set(m); });
        mrow.appendChild(b);
      }
      row.appendChild(mrow);
    }
    row.appendChild(el("p", "kp-spec-desc", desc));
    return row;
  };

  paint();
  on("pouch", paint);
}
