import { el, hero, datarows, ruler, segMeter, pipRow, nodes } from "./ui";
import { run, meta, on, PATCH_POUCH_MAX, MODE_LABEL, CUSTOMERS, FINAL_DAY, AUGMENTS } from "./data";
import type { Win } from "./wm";

/** LEDGER.LOG: kpos-ledger. Phosphor data sheet, slash rows, RUN/LIFETIME ruler. */

function topOf(counts: Record<string, number>): { key: string; n: number } | null {
  let best: { key: string; n: number } | null = null;
  for (const [key, n] of Object.entries(counts)) {
    if (!best || n > best.n) best = { key, n };
  }
  return best;
}

export function buildLedger(win: Win): void {
  const paint = () => {
    win.body.textContent = "";
    const sheet = el("div", "kp-ledger");
    nodes(sheet, true);

    const heroRow = el("div", "kp-ledger-hero");
    heroRow.appendChild(hero(`LEDGER №${meta.runCount}`));
    sheet.appendChild(heroRow);

    const strainWrap = el("span", "kp-ledger-strain");
    strainWrap.appendChild(segMeter(run.strain, 16, 300, 8));
    strainWrap.appendChild(el("em", "", `${run.strain}/100`));

    const boosts = AUGMENTS.filter((a) => a.kind === "boost").length;
    sheet.appendChild(
      datarows(
        [
          { label: "ATTEMPT", value: String(run.runNumber) },
          { label: "DAY", value: `${Math.min(run.day, FINAL_DAY)}/10` },
          { label: "NEURAL STRAIN", value: strainWrap },
          { label: "CREDITS", value: `${run.credits} cr` },
          { label: "RAM / TURN", value: String(run.ramPerTurn) },
          { label: "PATCH POUCH", value: pouchPips() },
          { label: "BOOST BAYS", value: bayPips() },
          { label: "KIT TIERS", value: `S${run.kit.scanTier} A${run.kit.attackTier} D${run.kit.defendTier}` },
          { label: "AUGMENTS", value: `${run.kit.augments.length}/${boosts}` },
        ],
        true,
      ),
    );

    sheet.appendChild(ruler("RUN", "LIFETIME"));

    const mode = topOf(meta.stats.modeUse);
    const lethal = topOf(meta.stats.lostTo);
    const lethalName = lethal ? (CUSTOMERS.find((c) => c.id === lethal.key)?.name ?? lethal.key) : null;
    sheet.appendChild(
      datarows(
        [
          { label: "ATTEMPTS", value: String(meta.runCount) },
          { label: "MACHINE BEATEN", value: String(meta.stats.runsWon) },
          { label: "JOBS CLEARED", value: String(meta.stats.divesCleared) },
          { label: "DIVES LOST", value: String(meta.stats.divesLost) },
          { label: "SCANS RUN", value: String(meta.stats.scans) },
          { label: "MOST USED MODE", value: mode ? `${MODE_LABEL[mode.key as keyof typeof MODE_LABEL] ?? mode.key} x${mode.n}` : "none yet" },
          { label: "MOST LETHAL", value: lethalName ? `${lethalName} x${lethal!.n}` : "nobody yet" },
        ],
        true,
      ),
    );

    win.body.appendChild(sheet);
  };

  const pouchPips = () => {
    const wrap = el("span", "kp-pip-row");
    wrap.appendChild(pipRow(run.patchPouch.length, PATCH_POUCH_MAX, "sm"));
    wrap.appendChild(el("em", "", ` ${run.patchPouch.length}/${PATCH_POUCH_MAX}`));
    return wrap;
  };
  const bayPips = () => {
    const wrap = el("span", "kp-pip-row");
    wrap.appendChild(pipRow(run.kit.augments.length, run.boostSlots, "sm"));
    wrap.appendChild(el("em", "", ` ${run.kit.augments.length}/${run.boostSlots}`));
    return wrap;
  };

  paint();
  on("pouch", paint);
  on("credits", paint);
  on("day", paint);
}
