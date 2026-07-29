import { el, hero, btn, datarows, diamondRow, ruler, segMeter, pipRow, photoCell, ticks, patchGlyph, chip } from "./ui";
import {
  run, meta, on, emit, ASSET, FINAL_DAY, DAY_CONFIGS, jobPay, MODE_LABEL, MODE_TELL,
  AUGMENTS, AUGMENT_BY_ID, dayOpenScene, tip, PATCH_POUCH_MAX, Scene,
} from "./data";
import { play } from "./sound";
import { setNightOpen } from "./w-darknet";
import type { Win } from "./wm";

/**
 * SHOPFRONT.EXE flow window: kpos-shopfront. Job board (dossier rows, hero
 * day numeral), diagnostic data sheet, stamped result report, night screen,
 * story scene framing. The demo rig can jump between screens; in-window
 * actions walk the same loop the game does (pick -> diag -> dive -> result
 * -> board; all done -> night -> next day).
 */

export type FlowScreen = "board" | "diag" | "result" | "night" | "story";

const TITLE: Record<FlowScreen, string> = {
  board: "JOBS.QUE",
  diag: "DIAGNOSTIC.LOG",
  result: "SHOPFRONT",
  night: "NIGHT.SYS",
  story: "MORNING.LOG",
};

let teachDismissed = false;

export interface Flow {
  set: (s: FlowScreen) => void;
  screen: () => FlowScreen;
}

export function buildShopfront(win: Win, openLoadout: () => void): Flow {
  let screen: FlowScreen = "board";
  let activeJob = 0;
  let nightPick: string | null = null;
  let draftPick: string | null = null;
  let sceneBeat = 0;

  const set = (s: FlowScreen) => {
    screen = s;
    win.titleEl.textContent = TITLE[s];
    setNightOpen(s === "night");
    if (s === "story") sceneBeat = 0;
    if (s === "result") draftPick = null;
    paint();
    emit("screen");
  };

  const paint = () => {
    win.body.textContent = "";
    if (screen === "board") paintBoard();
    else if (screen === "diag") paintDiag();
    else if (screen === "result") paintResult();
    else if (screen === "night") paintNight();
    else paintStory();
  };

  /* ---------------- job board ---------------- */

  const paintBoard = () => {
    const box = el("div", "kp-jobs");

    const head = el("header", "kp-screen-head");
    const day = el("div", "kp-hero-day");
    day.appendChild(el("b", "", "DAY"));
    day.appendChild(hero(String(run.day)));
    day.appendChild(el("b", "", `OF ${FINAL_DAY}`));
    head.appendChild(day);
    head.appendChild(el("p", "", "Three tickets. Strain is shared across all of them. Pick your order."));
    box.appendChild(head);

    run.jobs.forEach((job, i) => {
      const done = run.jobsDone[i];
      const row = el("button", "kp-job-row");
      row.type = "button";
      row.disabled = done;
      row.addEventListener("click", () => {
        if (done) return;
        play("press");
        activeJob = i;
        set("diag");
      });

      row.appendChild(photoCell(ASSET + job.customer.portrait, 96, 96));

      const mid = el("div", "kp-job-mid");
      mid.appendChild(datarows([
        { label: "NAME", value: job.customer.name },
        { label: "DEVICE", value: job.customer.device },
      ]));
      const quote = el("p", "kp-job-quote", `"${job.customer.quotes[job.quoteIndex]}"`);
      ticks(quote);
      mid.appendChild(quote);
      row.appendChild(mid);

      const right = el("div", "kp-job-right");
      right.appendChild(diamondRow(job.tier, 5, "THREAT"));
      right.appendChild(done ? el("span", "kp-job-done-stamp", "CLEARED") : el("span", "kp-job-pay", `${jobPay(job.tier)} cr`));
      row.appendChild(right);

      box.appendChild(row);
    });

    /* teach callout demo: anchored beside the first row's THREAT pips,
     * outside the row button (interactive content cannot nest in it) */
    if (!teachDismissed && !run.jobsDone[0]) {
      box.style.position = "relative";
      box.appendChild(teachCallout());
    }

    const foot = el("footer", "kp-screen-foot");
    foot.appendChild(chip("STRAIN", String(run.strain), run.strain > 70));
    foot.appendChild(chip("CR", String(run.credits)));
    foot.appendChild(chip("RAM", `${run.ramPerTurn}/turn`));
    if (run.patchPouch.length > 0) {
      const p = el("span", "kp-foot-pouch");
      p.appendChild(el("span", "kp-rail-dim", "POUCH"));
      for (const m of run.patchPouch) p.appendChild(patchGlyph(m, 14));
      foot.appendChild(p);
    }
    foot.appendChild(chip("KIT", `S${run.kit.scanTier}/A${run.kit.attackTier}/D${run.kit.defendTier}`));
    box.appendChild(foot);

    win.body.appendChild(box);
  };

  const teachCallout = (): HTMLElement => {
    const card = el("div", "kp-teach kp-frame-ticks");
    card.appendChild(el("i", "kp-tick2"));
    card.addEventListener("click", (e) => e.stopPropagation());
    card.style.right = "240px";
    card.style.top = "128px";
    card.appendChild(el("div", "kp-teach-title", "TEACHING"));
    card.appendChild(el("div", "kp-frame-stripe"));
    card.appendChild(el("div", "kp-teach-body", tip("threatTier") ?? ""));
    const ok = btn("GOT IT", "signal", () => {
      teachDismissed = true;
      play("tick");
      paint();
    });
    ok.classList.add("kp-teach-ok");
    card.appendChild(ok);
    card.appendChild(el("i", "kp-teach-line kp-teach-line-right"));
    card.appendChild(el("i", "kp-teach-dot kp-teach-dot-right"));
    return card;
  };

  /* ---------------- diagnostic ---------------- */

  const paintDiag = () => {
    const job = run.jobs[activeJob];
    const c = job.customer;
    const dayCfg = DAY_CONFIGS[run.day];
    const box = el("div", "kp-analyze");

    const head = el("header", "kp-screen-head");
    head.appendChild(el("span", "kp-analyze-head", "DIAGNOSTIC"));
    head.appendChild(el("p", "", `${c.name} - ${c.device}`));
    box.appendChild(head);

    const grid = el("div", "kp-analyze-grid");

    const intake = el("div", "kp-analyze-block");
    intake.appendChild(el("h3", "", "INTAKE"));
    const q = el("p", "", `"${c.quotes[job.quoteIndex]}"`);
    intake.appendChild(q);
    grid.appendChild(intake);

    const readout = el("div", "kp-analyze-block");
    readout.appendChild(el("h3", "", "READOUT"));
    readout.appendChild(el("p", "kp-analyze-tell", MODE_TELL[job.dominant]));
    const rows = datarows([
      { label: "DOMINANT ROUTINE", value: MODE_LABEL[job.dominant] },
      { label: "THREAT TIER", value: diamondRow(job.tier, 5) },
      { label: "GRID", value: `${dayCfg.grid[0]}x${dayCfg.grid[1]}` },
      { label: "INTRUSION RAM", value: `${dayCfg.oppRam}/turn` },
      ...(dayCfg.headStart > 0
        ? [{ label: "WARNING", value: `Intrusion already ${dayCfg.headStart} nodes deep`, warn: true }]
        : []),
    ]);
    readout.appendChild(rows);
    grid.appendChild(readout);

    box.appendChild(ruler("INTAKE", "READOUT"));
    box.appendChild(grid);

    const actions = el("div", "kp-screen-actions");
    actions.appendChild(btn("BACK", "ghost", () => { play("press"); set("board"); }));
    actions.appendChild(btn("CONFIGURE KIT", "ghost", () => { play("press"); openLoadout(); }));
    actions.appendChild(btn("DIVE", "signal", () => { play("claimTick"); set("result"); }));
    box.appendChild(actions);

    win.body.appendChild(box);
  };

  /* ---------------- result ---------------- */

  const paintResult = () => {
    const job = run.jobs[activeJob];
    const c = job.customer;
    const pay = jobPay(job.tier);
    const box = el("div", "kp-result");

    const stamp = el("div", "kp-stamp");
    stamp.appendChild(el("span", "kp-stamp-base", "REPAIR LOGGED"));
    stamp.appendChild(el("span", "kp-stamp-ghost", "REPAIR LOGGED"));
    box.appendChild(stamp);
    box.appendChild(el("p", "kp-result-win-line", c.winLine));

    box.appendChild(datarows([
      { label: "PAYOUT", value: `${pay} cr` },
      { label: "NEURAL STRAIN", value: `clean (${run.strain} left)` },
    ]));

    const draft = el("div", "kp-draft");
    draft.appendChild(el("h3", "", draftPick ? "AUGMENT INSTALLED" : "AUGMENT DRAFT - PICK ONE"));
    const grid = el("div", "kp-draft-grid");
    const offer = AUGMENTS.filter((a) => !run.kit.augments.includes(a.id)).slice(0, 3);
    for (const a of offer) {
      const card = el("button", "kp-draft-card");
      card.type = "button";
      card.disabled = draftPick !== null;
      if (draftPick && draftPick !== a.id) card.style.opacity = "0.4";
      card.appendChild(el("span", "kp-draft-kind", a.kind === "config" ? "CONFIG" : "BOOST"));
      card.appendChild(el("strong", "", a.name));
      card.appendChild(el("p", "", a.desc));
      if (draftPick === a.id) card.appendChild(el("em", "kp-upg-stamp", "INSTALLED"));
      card.addEventListener("click", () => {
        if (draftPick) return;
        play("claimTick");
        draftPick = a.id;
        if (a.kind === "boost" && run.kit.augments.length < run.boostSlots) run.kit.augments.push(a.id);
        paint();
      });
      grid.appendChild(card);
    }
    draft.appendChild(grid);
    box.appendChild(draft);

    const actions = el("div", "kp-screen-actions");
    const allDoneAfter = run.jobsDone.filter((d, i) => d || i === activeJob).length === run.jobs.length;
    const label = draftPick ? (allDoneAfter ? "CLOSE THE DAY" : "NEXT TICKET") : "SKIP THE DRAFT";
    actions.appendChild(btn(label, "primary", () => {
      play("press");
      run.jobsDone[activeJob] = true;
      run.credits += pay;
      emit("credits");
      set(run.jobsDone.every(Boolean) ? "night" : "board");
    }));
    box.appendChild(actions);

    win.body.appendChild(box);
  };

  /* ---------------- night / upgrade ---------------- */

  const paintNight = () => {
    const box = el("div", "kp-upgrade");

    const head = el("header", "kp-screen-head");
    const day = el("div", "kp-hero-day");
    day.appendChild(el("b", "", "DAY"));
    day.appendChild(hero(String(run.day)));
    day.appendChild(el("b", "", "CLOSED"));
    head.appendChild(day);
    head.appendChild(el("p", "", "One upgrade holds for the rest of the run. Pick it, spend your credits, then close the night. Nothing is locked in until you do."));
    box.appendChild(head);

    const regen = el("div", "kp-regen");
    regen.appendChild(el("span", "", "STRAIN"));
    regen.appendChild(segMeter(run.strain, 30, 300, 8));
    regen.appendChild(el("em", "kp-regen-pop", "+10 STRAIN"));
    box.appendChild(regen);

    const grid = el("div", "kp-upgrade-grid");
    const tile = (pick: string, label: string, detail: string, disabled = false) => {
      const b = el("button", `kp-upg ${nightPick === pick ? "kp-upg-picked" : ""}`.trim());
      b.type = "button";
      b.disabled = disabled;
      b.appendChild(el("strong", "", label));
      b.appendChild(el("span", "", detail));
      if (nightPick === pick) b.appendChild(el("em", "kp-upg-stamp", "SELECTED"));
      b.addEventListener("click", () => {
        play("tick");
        nightPick = pick;
        paint();
      });
      return b;
    };
    grid.appendChild(tile("ram", "+1 RAM / TURN", `${run.ramPerTurn} to ${run.ramPerTurn + 1}. More moves, more programs, every single turn.`));
    grid.appendChild(tile("scan", `SCAN.EXE T${run.kit.scanTier} > T${run.kit.scanTier + 1}`, "Wider sweep radius. Still always 1 RAM.", run.kit.scanTier >= 3));
    grid.appendChild(tile("attack", `ATTACK.EXE T${run.kit.attackTier} > T${run.kit.attackTier + 1}`, "One more node per cast: redirect or trap in bulk.", run.kit.attackTier >= 3));
    grid.appendChild(tile("defend", `DEFEND.EXE T${run.kit.defendTier} > T${run.kit.defendTier + 1}`, "One more node per cast: purge, lock, or a wider ward.", run.kit.defendTier >= 3));
    box.appendChild(grid);

    const shopRow = (label: string, note: string, pips: HTMLElement | null, onBuy: (() => void) | null) => {
      const row = el("div", "kp-patchrow");
      const b = btn(label, "ghost", () => { if (onBuy) { play("claimTick"); onBuy(); } });
      b.disabled = onBuy === null;
      row.appendChild(b);
      row.appendChild(el("span", "kp-rail-dim", note));
      if (pips) row.appendChild(pips);
      return row;
    };
    const patchCost = 45 + 5 * run.day;
    box.appendChild(shopRow(
      `NIGHT PATCH: +12 STRAIN (${patchCost} cr)`,
      `STRAIN ${run.strain}/100 - ${run.credits} cr - rest restored +10`,
      null,
      run.credits >= patchCost && run.strain < 100
        ? () => { run.credits -= patchCost; run.strain = Math.min(100, run.strain + 12); emit("credits"); paint(); }
        : null,
    ));
    const pouchPips = el("span", "kp-pip-row");
    for (const m of run.patchPouch) pouchPips.appendChild(patchGlyph(m, 18));
    box.appendChild(shopRow(
      "BUY BLIND: SEE DARKNET.LNK",
      `POUCH ${run.patchPouch.length}/${PATCH_POUCH_MAX} - ${run.credits} cr - Pay first. Shape is the surprise.`,
      pouchPips,
      null,
    ));
    const bayCost = run.boostSlots === 3 ? 150 : run.boostSlots === 4 ? 300 : null;
    box.appendChild(shopRow(
      `INSTALL BOOST BAY (${bayCost ?? "MAX"}${bayCost !== null ? " cr" : ""})`,
      `BAYS ${run.kit.augments.length}/${run.boostSlots} - ${run.credits} cr - A full bay drafts as a swap.`,
      pipRow(run.boostSlots, 5),
      bayCost !== null && run.credits >= bayCost
        ? () => { run.credits -= bayCost; run.boostSlots++; emit("credits"); paint(); }
        : null,
    ));

    const actions = el("div", "kp-screen-actions kp-nightclose");
    actions.appendChild(el("span", "kp-rail-dim",
      nightPick === null
        ? "Pick one upgrade above to close the night."
        : `Closing the night opens day ${run.day + 1}.`));
    const close = btn("CLOSE THE NIGHT", "signal", () => {
      play("claimTick");
      if (nightPick === "ram") run.ramPerTurn++;
      if (nightPick === "scan") run.kit.scanTier++;
      if (nightPick === "attack") run.kit.attackTier++;
      if (nightPick === "defend") run.kit.defendTier++;
      nightPick = null;
      run.day++;
      run.jobsDone = run.jobs.map(() => false);
      emit("day");
      set("story");
    });
    close.disabled = nightPick === null;
    actions.appendChild(close);
    box.appendChild(actions);

    win.body.appendChild(box);
  };

  /* ---------------- story scene ---------------- */

  const paintStory = () => {
    const scene: Scene = dayOpenScene(Math.min(run.day, FINAL_DAY));
    const b = scene.beats[sceneBeat];
    if (!b) {
      set("board");
      return;
    }
    const last = sceneBeat >= scene.beats.length - 1;
    const box = el("div", "kp-story");
    box.appendChild(el("span", "kp-story-daytag", `DAY ${run.day}`));

    if (b.still) {
      const cell = el("div", "kp-story-still");
      cell.appendChild(photoCell(ASSET + b.still, 576, 384));
      box.appendChild(cell);
    }

    const beat = el("div", `kp-story-beat kp-story-${b.speaker}`);
    if (b.portrait) {
      const cell = photoCell(ASSET + b.portrait, 96, 96);
      cell.classList.add("kp-story-portrait-cell");
      beat.appendChild(cell);
    }
    const text = el("div", "kp-story-text");
    const names: Record<string, string> = { sister: "RHEA", father: "DAD", system: "SYSTEM", companion: "???" };
    text.appendChild(el("span", "kp-story-name", b.name ?? names[b.speaker]));
    for (const line of b.lines) text.appendChild(el("p", "", line));
    const glyph = el("span", "kp-story-nextglyph");
    glyph.append(el("i"), el("i"), el("i"));
    text.appendChild(glyph);
    beat.appendChild(text);
    box.appendChild(beat);

    const advance = () => {
      play("tick");
      if (last) set("board");
      else {
        sceneBeat++;
        paint();
      }
    };
    box.addEventListener("click", advance);
    const next = btn(last ? "CONTINUE" : "NEXT", "ghost");
    next.classList.add("kp-story-next");
    box.appendChild(next);

    win.body.appendChild(box);
  };

  paint();
  on("pouch", () => { if (screen === "board" || screen === "night") paint(); });
  return { set, screen: () => screen };
}
