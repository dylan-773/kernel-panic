(() => {
  // glyph.ts
  var SVG = "http://www.w3.org/2000/svg";
  function patchGlyph(mask, size = 22, tone = "signal") {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "-12 -12 24 24");
    svg.setAttribute("class", `kp-patch-glyph kp-glyph-${tone}`);
    svg.setAttribute("aria-hidden", "true");
    const ends = [[0, -10], [10, 0], [0, 10], [-10, 0]];
    for (let d = 0;d < 4; d++) {
      if ((mask & 1 << d) === 0)
        continue;
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

  // ui.ts
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text)
      n.textContent = text;
    return n;
  }
  function ticks(host) {
    host.classList.add("kp-frame-ticks");
    host.appendChild(el("i", "kp-tick2"));
    return host;
  }
  function nodes(host, on = false) {
    host.classList.add("kp-frame-nodes");
    if (on)
      host.classList.add("kp-nodes-on");
    const wrap = el("i", "kp-nodes");
    for (let i = 0;i < 6; i++)
      wrap.appendChild(el("i"));
    host.appendChild(wrap);
    return host;
  }
  function stripe() {
    return el("div", "kp-frame-stripe");
  }
  function ruler(left, right) {
    const r = el("div", "kp-ruler");
    r.append(el("span", "", left), el("i"), el("span", "", right));
    return r;
  }
  function hero(text, cls = "") {
    return el("div", `kp-hero ${cls}`.trim(), text);
  }
  function datarows(rows, slash = false) {
    const list = el("div", "kp-datarow-list");
    for (const r of rows) {
      const row = el("div", `kp-datarow ${slash ? "kp-datarow-slash" : "kp-datarow-plain"} ${r.warn ? "kp-datarow-warn" : ""}`.trim());
      row.appendChild(el("span", "", r.label));
      const em = el("em");
      if (typeof r.value === "string")
        em.textContent = r.value;
      else
        em.appendChild(r.value);
      row.appendChild(em);
      list.appendChild(row);
    }
    return list;
  }
  function pipRow(filled, total, size = "md") {
    const row = el("span", "kp-pip-row");
    for (let i = 0;i < total; i++) {
      const p = el("i", `kp-pip-sq ${size === "sm" ? "kp-pip-sq-sm" : size === "lg" ? "kp-pip-sq-lg" : ""}`.trim());
      if (i < filled)
        p.classList.add("kp-pip-on");
      row.appendChild(p);
    }
    return row;
  }
  function diamondRow(tier, total = 5, label) {
    const row = el("span", "kp-pip-row kp-job-tier");
    if (label)
      row.appendChild(el("span", "", label));
    for (let i = 0;i < total; i++) {
      const d = el("i", "kp-pip-diamond");
      if (i < tier)
        d.classList.add("kp-pip-on");
      row.appendChild(d);
    }
    return row;
  }
  function chip(label, value, crimson = false) {
    const c = el("span", `kp-chip-pct ${crimson ? "kp-chip-crimson" : ""}`.trim());
    c.append(el("span", "", label), el("em", "", value));
    return c;
  }
  function segMeter(pct, segs = 20, dur = 240, steps = 6) {
    const bar = el("div", "kp-meter-seg");
    const cells = [];
    for (let i = 0;i < segs; i++) {
      const c = el("i");
      bar.appendChild(c);
      cells.push(c);
    }
    const target = Math.round(pct / 100 * segs);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || dur <= 0) {
      cells.forEach((c, i) => {
        if (i < target)
          c.classList.add("kp-seg-on");
      });
    } else {
      for (let s = 1;s <= steps; s++) {
        const upto = Math.round(target * s / steps);
        setTimeout(() => {
          cells.forEach((c, i) => c.classList.toggle("kp-seg-on", i < upto));
        }, dur / steps * s);
      }
    }
    return bar;
  }
  function hatchBar(pct) {
    const bar = el("div", "kp-bar-hatch");
    const fill = el("i");
    fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    bar.appendChild(fill);
    return bar;
  }
  function btn(label, variant, onClick) {
    const cls = variant === "ghost" ? "kp-btn2 kp-btn2-ghost" : variant === "danger" ? "kp-btn2 kp-btn2-primary kp-btn2-danger" : variant === "signal" ? "kp-btn2 kp-btn2-primary kp-btn2-signal" : "kp-btn2 kp-btn2-primary";
    const b = el("button", cls, label);
    b.type = "button";
    if (onClick)
      b.addEventListener("click", onClick);
    return b;
  }
  function photoCell(src, w, h) {
    const cell = el("span", "kp-photo-cell-full");
    const img = new Image(w, h);
    img.src = src;
    img.alt = "";
    cell.appendChild(img);
    return cell;
  }
  var SVGNS = "http://www.w3.org/2000/svg";
  var KP_MARK_ROWS = [
    "##...##..#######.",
    "##..##...##....##",
    "##.##....##....##",
    "####.....##....##",
    "###......#######.",
    "####.....##......",
    "##.##....##......",
    "##..##...##......",
    "##...##..##......",
    "##...##..##......"
  ];
  var KP_SLICE_ROWS = [4, 5];
  var KP_SLIP_CELLS = 2;
  function kpMark(cell, sliceMono = false) {
    const svg = document.createElementNS(SVGNS, "svg");
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
      for (let x = 0;x <= row.length; x++) {
        const on = x < row.length && row[x] === "#";
        if (on && run < 0)
          run = x;
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
  var PX_ICONS = {
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
      "########################"
    ],
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
      "......##...##...##......"
    ],
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
      "o##########+............"
    ],
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
      "........................"
    ],
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
      "........................"
    ],
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
      "........................"
    ],
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
      "........................"
    ],
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
      "........................"
    ]
  };
  function pxIcon(rows, cell) {
    const svg = document.createElementNS(SVGNS, "svg");
    const W = rows[0].length * cell;
    const H = rows.length * cell;
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("aria-hidden", "true");
    const FILL = {
      "#": "currentColor",
      "*": "var(--ch-hot)",
      o: "color-mix(in srgb, var(--ch) 74%, var(--px-void))",
      "+": "var(--ch-dim)",
      "-": "var(--ch-faint)"
    };
    rows.forEach((row, y) => {
      let run = -1;
      let tone = "";
      for (let x = 0;x <= row.length; x++) {
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

  // ../../kernel-panic-site/app/src/game/content/customers.ts
  var CUSTOMERS = [
    {
      id: "juno-vex",
      name: "Juno Vex",
      device: "Hexlight arcade handheld",
      portrait: "/assets/px/portraits/cust-06.png",
      quotes: [
        "There is a second player in there. No cart, no link, and it keeps setting records I cannot touch.",
        "It runs faster every boot. Yesterday the menu loaded before I pressed anything. That is not a feature."
      ],
      winLine: "The records are mine again. First try. Tell nobody how long that actually took me.",
      lossLine: "The ghost keeps the high score. And the handheld.",
      tiers: [1, 2],
      dominant: "armSiphon"
    },
    {
      id: "sable-okonkwo",
      name: "Sable Okonkwo",
      device: "Kestrel courier drone",
      portrait: "/assets/px/portraits/cust-01.png",
      quotes: [
        "Something in her nav keeps rewriting my routes. She flew a package to the wrong district twice and looked proud of it.",
        "I lock the flight plan, it unlocks it. I set a waypoint, it moves it. Get it out of my drone."
      ],
      winLine: "She flies straight again. First clean run all month. You are on my good list, which is short.",
      lossLine: "The drone flies for somebody else now.",
      tiers: [1, 2],
      dominant: "redirect"
    },
    {
      id: "aldous-wick",
      name: "Aldous Wick",
      device: "Meridian ledger terminal",
      portrait: "/assets/px/portraits/cust-02.png",
      quotes: [
        "Every entry I touch costs me twice. It leaves little surprises in my books and waits for me to step on them.",
        "Forty years of accounts in that terminal, and now the machine bites the hand that files."
      ],
      winLine: "The books balance. First time since spring. You do honest work, son.",
      lossLine: "Forty years of accounts, and it kept every one.",
      tiers: [1, 2, 3],
      dominant: "armHalt"
    },
    {
      id: "wren-tallis",
      name: "Wren Tallis",
      device: "Studio master ledger",
      portrait: "/assets/px/portraits/cust-03.png",
      quotes: [
        "Something is hiding in the masters. I can hear it breathing between tracks and I cannot find it.",
        "Notes go missing overnight. Not deleted, hidden. It is playing hide and seek with my album."
      ],
      winLine: "Every track is back. Even the ones I forgot I wrote. You beautiful person.",
      lossLine: "The album belongs to whatever is in there now.",
      tiers: [1, 2],
      dominant: "ward"
    },
    {
      id: "bram-hollander",
      name: "Bram Hollander",
      device: "Copperline register hub",
      portrait: "/assets/px/portraits/cust-05.png",
      quotes: [
        "My own register shields the till from me. Me. I have owned that machine for eleven years.",
        "It walls off a different drawer every day. Today it is the receipts. Tomorrow, who knows, the front door."
      ],
      winLine: "The till opens for its rightful owner. I could kiss you. I will not.",
      lossLine: "Eleven years of loyalty, and the register picked the intruder.",
      tiers: [2, 3],
      dominant: "lock"
    },
    {
      id: "dex-marlowe",
      name: "Dex Marlowe",
      device: "Nocta cram deck",
      portrait: "/assets/px/portraits/cust-06.png",
      quotes: [
        "It undoes my homework. I finish a page, it reroutes the file somewhere I cannot follow.",
        "My study plan keeps pointing at the arcade. I did not set that. I would have, but I did not."
      ],
      winLine: "My essay is back and it is due in an hour. You are my favorite adult. Low bar, still.",
      lossLine: "The deck kept the essay. And the kid's trust.",
      tiers: [2, 3],
      dominant: "redirect"
    },
    {
      id: "june-aksoy",
      name: "June Aksoy",
      device: "Halcyon clinic gateway",
      portrait: "/assets/px/portraits/cust-04.png",
      quotes: [
        "The gateway walls off a ward at a time. Last night it was pediatrics. Please be fast, and please be quiet about it.",
        "It locks the charts the second a shift changes. Like it knows when we are fewest."
      ],
      winLine: "Charts are open and the wards are talking to each other. I owe you a coffee and my silence.",
      lossLine: "The clinic gateway stayed shut. So did she, on the way out.",
      tiers: [3, 4],
      dominant: "ward"
    },
    {
      id: "ines-calloway",
      name: "Ines Calloway",
      device: "Ferrox lifter exosuit",
      portrait: "/assets/px/portraits/cust-01.png",
      quotes: [
        "It cuts my grip servos mid lift, forty crates up. It waits for the worst second. It is good at picking it.",
        "Whatever is in there shuts my systems down one at a time, like it is testing which one I will miss most."
      ],
      winLine: "Servos held through a full lift. No drops. I might even sleep tonight.",
      lossLine: "The suit dropped one crate too many. So did you.",
      tiers: [3, 4],
      dominant: "armHalt"
    },
    {
      id: "emeric-snow",
      name: "Emeric Snow",
      device: "Ivora chess cabinet",
      portrait: "/assets/px/portraits/cust-02.png",
      quotes: [
        "Fifty years I have played that cabinet. Last month it stopped playing chess and started playing me.",
        "It knows my moves before I make them. There is a door in that machine somebody left open."
      ],
      winLine: "It plays fair again. Lost to it twice this morning. Felt wonderful.",
      lossLine: "The cabinet is still playing. You resigned for both of us.",
      tiers: [4, 5],
      dominant: "purge"
    },
    {
      id: "vera-stanek",
      name: "Vera Stanek",
      device: "Apothek dosage safe",
      portrait: "/assets/px/portraits/cust-04.png",
      quotes: [
        "It waits until I reach for the keypad, then it kills the lights. The whole dispensary, dark, every time.",
        "The safe rations power like it rations pills. Tonight it decided the cold storage units were optional."
      ],
      winLine: "Lights stay on and the safe stays honest. Night shift thanks you. Loudly, for once.",
      lossLine: "The dispensary went dark. It is still dark.",
      tiers: [4, 5],
      dominant: "armSiphon"
    },
    {
      id: "casimir-bell",
      name: "Casimir Bell",
      device: "Ledgerstone pawn vault",
      portrait: "/assets/px/portraits/cust-05.png",
      quotes: [
        "My vault grew a lock I did not buy. It walls itself up at noon like it has somewhere better to be.",
        "Everything my customers trusted me with is behind that wall, and the wall gets a new layer every day."
      ],
      winLine: "The vault opens on my word again. Take something off the shelf. Within reason.",
      lossLine: "The vault kept his customers' things. And his word.",
      tiers: [4, 5],
      dominant: "lock"
    },
    {
      id: "noor-behzadi",
      name: "Noor Behzadi",
      device: "Polyverb synth brain",
      portrait: "/assets/px/portraits/cust-03.png",
      quotes: [
        "It performs while I sleep. There are recordings of sets I never played. My style, but colder.",
        "Something slips into my rig through a door I cannot find, and it is getting better than me."
      ],
      winLine: "The rig plays what I play and nothing else. The imposter era is over.",
      lossLine: "The rig plays on without her. Cold, perfect, not hers.",
      tiers: [4, 5],
      dominant: "purge"
    }
  ];

  // ../../kernel-panic-site/app/src/game/content/kit.ts
  var SCAN_RANGE = { 1: 3, 2: 6, 3: 99 };
  var ATTACK_WIDTH = { 1: 1, 2: 2, 3: 3 };
  var DEFEND_WIDTH = { 1: 1, 2: 2, 3: 3 };
  var WARD_RADIUS = { 1: 1, 2: 2, 3: 3 };
  var LOCK_ROUNDS = 2;
  var WARD_ROUNDS = 2;
  var SIPHON_STEAL = { 1: 2, 2: 3, 3: 4 };
  var ATTACK_MODE_LABEL = {
    redirect: "REDIRECT",
    armHalt: "ARM: HALT",
    armSiphon: "ARM: SIPHON"
  };
  var DEFEND_MODE_LABEL = {
    purge: "PURGE",
    lock: "LOCK",
    ward: "WARD"
  };
  var MODE_LABEL = {
    ...ATTACK_MODE_LABEL,
    ...DEFEND_MODE_LABEL
  };
  function attackModeDesc(mode, tier) {
    const w = ATTACK_WIDTH[tier];
    const n = w === 1 ? "one node" : `${w} nodes`;
    switch (mode) {
      case "redirect":
        return `Twist ${w === 1 ? "any enemy or open junction" : `${w} enemy or open junctions`} anywhere on the board a quarter turn, no reach limit. Cuts power to everything downstream.`;
      case "armHalt":
        return `Plant a halt trap on ${n === "one node" ? "an open junction" : `${w} open junctions`}. When their signal claims it, they lose a full turn.`;
      case "armSiphon":
        return `Plant a siphon trap on ${n === "one node" ? "an open junction" : `${w} open junctions`}. When it fires, ${SIPHON_STEAL[tier]} RAM drains from their next turn into yours.`;
    }
  }
  function defendModeDesc(mode, tier) {
    const w = DEFEND_WIDTH[tier];
    switch (mode) {
      case "purge":
        return `Disarm ${w === 1 ? "one revealed trap" : `${w} revealed traps`}. Scan first; you cannot defuse what you cannot see.`;
      case "lock":
        return `Freeze ${w === 1 ? "a junction" : `${w} junctions`} for ${LOCK_ROUNDS} rounds: nothing rotates or redirects ${w === 1 ? "it" : "them"}. Bolt down your line, or a junction it needs.`;
      case "ward":
        return `Ward a junction and everything within ${WARD_RADIUS[tier]} of it for ${WARD_ROUNDS} rounds: no new traps land there, and REDIRECT cannot touch it.`;
    }
  }
  function scanDesc(tier) {
    const r = SCAN_RANGE[tier];
    return r >= 99 ? "Expose every armed node on the entire board, permanently. Always 1 RAM." : `Expose every armed node within ${r} of your territory, permanently. Always 1 RAM.`;
  }
  var AUGMENTS = [
    {
      id: "cfgArmHalt",
      name: "HALT DRIVER",
      kind: "config",
      attackMode: "armHalt",
      desc: "ATTACK config: plant halt traps. A sprung trap costs the intrusion its whole next turn."
    },
    {
      id: "cfgArmSiphon",
      name: "SIPHON DRIVER",
      kind: "config",
      attackMode: "armSiphon",
      desc: "ATTACK config: plant siphon traps. A sprung trap drains RAM from its next turn into yours, more at higher ATTACK tiers, and more again when you are the one springing it."
    },
    {
      id: "cfgLock",
      name: "CLAMP DRIVER",
      kind: "config",
      defendMode: "lock",
      desc: `DEFEND config: freeze junctions for ${LOCK_ROUNDS} rounds against rotation and redirects.`
    },
    {
      id: "cfgWard",
      name: "WARD DRIVER",
      kind: "config",
      defendMode: "ward",
      desc: "DEFEND config: ward an area so no new traps can land in it, and REDIRECT cannot touch anything inside it either, for the full duration on both sides."
    },
    {
      id: "longArms",
      name: "LONG ARMS",
      kind: "boost",
      desc: "Rotate open junctions up to 4 steps from your territory instead of 2, and place patch pieces just as far. Bigger setups, bigger cascades."
    },
    {
      id: "siphonPlus",
      name: "DEEP SIPHON",
      kind: "boost",
      requires: { kind: "augment", id: "cfgArmSiphon" },
      desc: "Your siphon traps steal 1 extra RAM."
    },
    {
      id: "tripwire",
      name: "TRIPWIRE",
      kind: "boost",
      requires: { kind: "augment", id: "cfgArmHalt" },
      desc: "Your halt traps also burn 3 RAM off the victim's next active turn."
    },
    {
      id: "cheapShot",
      name: "CHEAP SHOT",
      kind: "boost",
      desc: "Your first ATTACK each dive costs 0 RAM."
    },
    {
      id: "hotBoot",
      name: "HOT BOOT",
      kind: "boost",
      desc: "Start every dive with +1 RAM on your first turn."
    },
    {
      id: "tapLine",
      name: "TAP LINE",
      kind: "boost",
      desc: "SCAN also traces the intrusion's planned route to the core, visible for 2 rounds."
    },
    {
      id: "echoTap",
      name: "ECHO TAP",
      kind: "boost",
      desc: "Whenever one of your traps fires, gain 2 RAM on your next turn."
    },
    {
      id: "jamAnchor",
      name: "JAM ANCHOR",
      kind: "boost",
      desc: "Your REDIRECT also freezes the junction it twists through the reply and into your next turn. Nothing rotates or redirects it back while it holds."
    },
    {
      id: "sweepCredit",
      name: "SWEEP CREDIT",
      kind: "boost",
      desc: "PURGE refunds 1 RAM per trap it defuses, up to 3 per cast."
    },
    {
      id: "cleanRun",
      name: "CLEAN RUN",
      kind: "boost",
      desc: "Win a dive with zero strain billed and bank one random patch piece. A trap-free win that only misses at the round cap pays 15 credits instead."
    },
    {
      id: "patchRefund",
      name: "SPLICE REFUND",
      kind: "boost",
      requires: { kind: "pouch" },
      desc: "Placing a patch piece refunds its full RAM cost the instant it lands. The pouch still spends the piece itself."
    },
    {
      id: "firstFault",
      name: "FIRST FAULT",
      kind: "boost",
      desc: "The first trap that fires on you each dive bills zero Neural Strain. Every trap after that costs full."
    },
    {
      id: "overtimeClause",
      name: "OVERTIME CLAUSE",
      kind: "boost",
      desc: "Cap wins pay 75 percent of the ticket instead of 50. The client eats every hour past the deadline, not half."
    },
    {
      id: "darkDiscount",
      name: "DARKNET RATE",
      kind: "boost",
      desc: "Dark web patch piece pulls cost 15 percent less. The vendor still only takes credits and the roll stays blind."
    }
  ];
  var AUGMENT_BY_ID = Object.fromEntries(AUGMENTS.map((a) => [a.id, a]));
  var MODE_TELL = {
    redirect: "Diagnostic flags rerouting activity. Your junctions will get twisted off true.",
    armHalt: "Diagnostic flags halt traps. One wrong claim and you lose a whole turn. Scan early.",
    armSiphon: "Diagnostic flags siphon traps. It wants your RAM more than your route. Scan early.",
    purge: "Diagnostic flags self-cleaning routines. Traps you plant will not stick around.",
    lock: "Diagnostic flags clamp routines. Junctions you need will freeze solid.",
    ward: "Diagnostic flags warding fields. Whole approaches will refuse your traps and shrug off your redirects."
  };

  // ../../kernel-panic-site/app/src/game/content/journal.ts
  var JOURNAL_ENTRIES = [
    {
      id: "will",
      unlockAtRun: 0,
      kind: "note",
      title: "THE WILL",
      date: "found taped inside the register",
      body: [
        "Kids. The shop goes to both of you. Do not argue about it, I can hear you arguing about it from here.",
        "Rhea takes the counter. You take the bench. You are bad with people and she is bad with computers. Between the two of you there is exactly one whole shopkeeper. That was always the design.",
        "The back room stays locked until it does not. You will know the difference. Love, Dad."
      ]
    },
    {
      id: "backroom",
      unlockAtRun: 0,
      kind: "memo",
      title: "THE BACK ROOM",
      date: "day one at the bench",
      body: [
        "Every machine in this shop has a ticket, an owner, and a smell. Except one.",
        "The tower in the back room has no ticket. Rhea says it is quarantined, that Dad walled off a nasty virus in there years ago and never got around to wiping it. She says leave it.",
        "The lock opened for me this morning like it was expecting me."
      ]
    },
    {
      id: "failed1",
      unlockAtRun: 1,
      kind: "memo",
      title: "ANOTHER FAILED RUN",
      date: "after the first dive",
      body: [
        "Another failed run. That damned computer.",
        "What was Dad hiding in there? Whatever security protocol he wrote for that thing is unlike anything I have ever seen. It did not fight me. It graded me, and then it shut the door.",
        "Rhea heard me shouting from the counter. She did not ask."
      ]
    },
    {
      id: "bills",
      unlockAtRun: 2,
      kind: "bill",
      title: "THE DRAWER OF BILLS",
      date: "bottom drawer of the bench",
      body: [
        "MERIDIAN NEUROCARE - FINAL NOTICE. Account No. 118823. Diagnosis code NF-3, neurofilament degradation, stage three. Balance outstanding: more than this shop clears in a year.",
        "There are eleven of these. He filed them under W for whatever.",
        "Stage three of what? He fixed computers. He was not a diver. As far as I knew."
      ]
    },
    {
      id: "solder",
      unlockAtRun: 3,
      kind: "memo",
      title: "SOLDER SMOKE",
      date: "cannot place the year",
      body: [
        "The machine leaks when I lose. Fragments. Tonight it was his hands and a soldering iron and my own voice, small, asking why the iron does not stick to everything.",
        "Because it only sticks where you have cleaned, he said. Everything joins where it is clean.",
        "I do not think these fragments are corruption. I think they are cargo."
      ]
    },
    {
      id: "receipts",
      unlockAtRun: 4,
      kind: "bill",
      title: "RECEIPTS",
      date: "pharmacy on 9th, shoebox",
      body: [
        "Strain suppressants. Filled weekly, cash, going back six years. The dosage climbs every few months like a staircase.",
        "The last receipt is dated four days before he died.",
        "He stood at that counter every week, four blocks from ours, and never said a word to either of us."
      ]
    },
    {
      id: "diagnosis",
      unlockAtRun: 5,
      kind: "bill",
      title: "THE DIAGNOSIS",
      date: "sealed envelope, never opened until now",
      body: [
        "Meridian consult summary. Chronic neural strain scarring, cumulative. Cause: sustained high-intensity dive activity, estimated in excess of nine thousand logged hours.",
        "Recommendation, underlined twice by some doctor who clearly did not know him: CEASE ALL DIVE ACTIVITY IMMEDIATELY.",
        "The envelope was sealed. He read his death sentence at the clinic, decided it changed nothing, and came home and made dinner."
      ]
    },
    {
      id: "notickets",
      unlockAtRun: 6,
      kind: "memo",
      title: "NO TICKETS",
      date: "went through the ledger twice",
      body: [
        "Nine thousand hours. I checked the ledger for the client who owned that machine. There is no client. Nobody ever paid for work on the back room tower.",
        "The dive hours were his own. Nightly, after close, for years. The strain that killed him was not an accident and it was not a job.",
        "He was building something in there and he paid for it with his nervous system, on an installment plan, in secret."
      ]
    },
    {
      id: "grading",
      unlockAtRun: 8,
      kind: "memo",
      title: "IT IS GRADING ME",
      date: "cannot sleep",
      body: [
        "Security keeps people out. This is not security.",
        "It goes easy when I am weak. It gets harder exactly as fast as I get better. It uses every trick I have learned, back at me, like a sparring partner who has read my file.",
        "It is not a lock. It is a curriculum. Dad did not seal something in. He left something waiting."
      ]
    },
    {
      id: "patch",
      unlockAtRun: 0,
      requiresOpened: true,
      kind: "note",
      title: "PATCH",
      date: "the morning after",
      body: [
        "Its name is Patch. He named it for the thing that holds a broken thing together while it mends.",
        "Nine thousand hours. The bills, the suppressants, the nights. He spent the last of his signal teaching a machine how to raise the difficulty gently, because he knew he would not be here to do it himself.",
        "Rhea sat with it for an hour today. She still calls it the virus. It seems to like that."
      ]
    }
  ];

  // ../../kernel-panic-site/app/src/game/content/arc.ts
  var DAY_CONFIGS = {
    1: { grid: [9, 7], oppRam: 6, greed: 0.7, abilityFreq: 0.2, minCost: 16, headStart: 0, parFlat: 6, slag: 0.18, patchDrop: 0.35, jobTiers: [1, 1, 1] },
    2: { grid: [9, 7], oppRam: 6, greed: 0.76, abilityFreq: 0.32, minCost: 16, headStart: 0, parFlat: 5, slag: 0.18, patchDrop: 0.35, jobTiers: [1, 1, 2] },
    3: { grid: [9, 9], oppRam: 6, greed: 0.88, abilityFreq: 0.45, minCost: 18, headStart: 1, parFlat: 5, slag: 0.19, patchDrop: 0.24, jobTiers: [1, 2, 2] },
    4: { grid: [9, 9], oppRam: 6, greed: 0.91, abilityFreq: 0.45, minCost: 18, headStart: 2, parFlat: 4, slag: 0.2, patchDrop: 0.22, jobTiers: [2, 2, 3] },
    5: { grid: [11, 9], oppRam: 7, greed: 0.94, abilityFreq: 0.55, minCost: 20, minPd: 9, headStart: 2, parFlat: 4, slag: 0.21, patchDrop: 0.18, jobTiers: [2, 3, 3] },
    6: { grid: [11, 9], oppRam: 7, greed: 0.98, abilityFreq: 0.6, minCost: 20, minPd: 10, headStart: 2, parFlat: 3, slag: 0.22, patchDrop: 0.16, jobTiers: [3, 3, 3] },
    7: { grid: [11, 11], oppRam: 7, greed: 0.99, abilityFreq: 0.65, minCost: 21, minPd: 10, headStart: 3, parFlat: 2, slag: 0.23, patchDrop: 0.13, jobTiers: [3, 3, 4] },
    8: { grid: [13, 11], oppRam: 8, greed: 0.98, abilityFreq: 0.7, minCost: 22, minPd: 10, headStart: 3, parFlat: 2, slag: 0.24, patchDrop: 0.12, jobTiers: [4, 4, 4] },
    9: { grid: [13, 11], oppRam: 10, greed: 0.97, abilityFreq: 0.75, minCost: 24, minPd: 12, headStart: 4, parFlat: 1, slag: 0.25, patchDrop: 0.11, jobTiers: [4, 4, 5] }
  };
  var FINAL_DAY = 10;
  function jobPay(tier) {
    return 40 + 25 * tier;
  }

  // ../../kernel-panic-site/app/src/game/content/story.ts
  var SISTER = "/assets/px/portraits/sister.png";
  var STILL_LOCKED = "/assets/px/stills/still-locked.png";
  var STILL_COUNTER = "/assets/px/stills/still-counter.png";
  function dayOpenScene(day) {
    const id = "day-open-" + day;
    const byDay = {
      1: [
        { speaker: "system", lines: ["DAY 1.", "SPIKE: THREE TICKETS.", "REGISTER: OPEN."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Till is counted. Spike is loaded. Try not to break anything before lunch.",
            "Yell if the fans start smelling like smoke."
          ]
        },
        { speaker: "system", lines: ["THE CURTAIN AT THE BACK DOES NOT MOVE.", "IT NEVER DOES."] }
      ],
      2: [
        { speaker: "system", lines: ["DAY 2.", "STRAIN CARRIES OVER.", "THE COFFEE DOES NOT."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Pot is fresh. Drink it before it is not.",
            "The Kestrel courier drone is back. Same customer, new complaint."
          ]
        }
      ],
      3: [
        { speaker: "system", lines: ["DAY 3.", "WORD IS GETTING AROUND."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Somebody asked if we fix possessed machines now.",
            "I told them we fix intrusions. They looked disappointed either way."
          ]
        },
        { speaker: "system", lines: ["THE TICKET SPIKE IS GETTING TALLER.", "SO IS THE LINE OUTSIDE."] }
      ],
      4: [
        { speaker: "system", lines: ["DAY 4.", "THE INTRUSIONS ARE PACING THEMSELVES.", "WATCH FOR IT."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: ["Ledger is balanced. Barely.", "Four tickets came in already and it is not even ten."]
        }
      ],
      5: [
        { speaker: "system", lines: ["DAY 5.", "HALFWAY.", "THE BACK ROOM HAS BEEN QUIET. JUST QUIET."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Halfway through the book and the shop is still standing. Small miracles.",
            "Eat something. I will not ask twice."
          ]
        },
        {
          speaker: "system",
          still: STILL_LOCKED,
          lines: ["THE PADLOCK CATCHES THE LIGHT WHEN THE SUN COMES THROUGH THE CURTAIN.", "STILL CLOSED."]
        }
      ],
      6: [
        { speaker: "system", lines: ["DAY 6.", "THREE TICKETS. NO EXCUSES."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Coffee is on the bench. Drink it before it becomes a science experiment.",
            "The Ledgerstone pawn vault sent someone over again. Good, they pay on time."
          ]
        }
      ],
      7: [
        { speaker: "system", lines: ["DAY 7.", "THE HARD CASES ARE FINDING YOU."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Take them anyway. Hard cases pay better and complain less.",
            "Three tickets. One of them looks like it bites."
          ]
        }
      ],
      8: [
        { speaker: "system", lines: ["DAY 8.", "STRAIN IS A BUDGET.", "SPEND IT LIKE RENT IS DUE."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "The register drawer is getting fat with customer receipts again.",
            "Do the deposit before you dive into anything. Please."
          ]
        }
      ],
      9: [
        { speaker: "system", lines: ["DAY 9.", "LAST DAY OF PAYING WORK.", "TOMORROW THE BACK ROOM SETTLES UP."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: [
            "Last three tickets before the books close for the cycle.",
            "Whatever is waiting for you tomorrow, it can wait one more day of customers first."
          ]
        }
      ],
      10: [
        { speaker: "system", lines: ["DAY 10.", "NO TICKETS ON THE SPIKE.", "THE BACK ROOM SETTLES UP TODAY."] },
        {
          speaker: "sister",
          still: STILL_COUNTER,
          lines: [
            "No customers today. Just you, the curtain, and that padlock.",
            "I am not going to pretend I am fine with this. I am going to make coffee instead."
          ]
        },
        { speaker: "system", lines: ["THE PADLOCK WAITS WHERE IT ALWAYS WAITS.", "TODAY IT EITHER LETS GO OR IT DOES NOT."] },
        {
          speaker: "sister",
          portrait: SISTER,
          lines: ["Go on, then.", "I will be at the counter. Same as always."]
        }
      ]
    };
    return { id, beats: byDay[day] ?? byDay[1] };
  }

  // ../../kernel-panic-site/app/src/game/content/teaching.ts
  var MECHANIC_INVENTORY = [
    { id: "rotate", label: "Rotate a junction", firstContact: "tutorial" },
    { id: "flood", label: "Signal floods and claims", firstContact: "tutorial" },
    { id: "scan", label: "SCAN.EXE", firstContact: "tutorial" },
    { id: "defend", label: "DEFEND.EXE and purge", firstContact: "tutorial" },
    { id: "attack", label: "ATTACK.EXE and redirect", firstContact: "tutorial" },
    { id: "telegraph", label: "The machine aims a beat before it strikes", firstContact: "tutorial" },
    { id: "cascade", label: "Cascade banking", firstContact: "duel" },
    { id: "par", label: "Par, the rotation budget", firstContact: "duel" },
    { id: "patchCellUse", label: "Spending a patch piece mid dive", firstContact: "duel" },
    { id: "patchShapes", label: "Pieces roll a fixed shape and orientation, never rotating in hand", firstContact: "duel" },
    { id: "patchCraft", label: "Combine two pieces into the union of their arms at the bench", firstContact: "upgrade" },
    { id: "strainChip", label: "Neural Strain as run health", firstContact: "result" },
    { id: "manualRef", label: "MANUAL.TXT as the full reference", firstContact: "desktop" },
    { id: "kitConfig", label: "Swapping program modes", firstContact: "loadout" },
    { id: "analyzeTell", label: "The diagnostic readout and its tell", firstContact: "analyze" },
    { id: "threatTier", label: "Threat tier 1 to 5", firstContact: "analyze" },
    { id: "augmentDraft", label: "The post job augment draft", firstContact: "result" },
    { id: "augmentCadence", label: "One augment per cleared ticket, three tickets a day", firstContact: "result" },
    { id: "ram", label: "RAM per turn as the action budget", firstContact: "tutorial" },
    { id: "ramCarry", label: "Unspent RAM carries into the next turn, capped", firstContact: "duel" },
    { id: "dayUpgrade", label: "One upgrade per closed day", firstContact: "upgrade" },
    { id: "nightPatch", label: "Buying strain back with credits", firstContact: "upgrade" },
    { id: "darkWebBuy", label: "Buying a random patch piece on the darknet", firstContact: "upgrade" },
    { id: "slotBuy", label: "Buying an extra boost bay at night", firstContact: "upgrade" },
    { id: "boostSlots", label: "Boost bays cap ownership at 3, buyable to 5; configs exempt", firstContact: "result" },
    { id: "boostSwap", label: "A full bay swaps a new boost in for one installed", firstContact: "result" },
    {
      id: "reach2",
      label: "Rotating within two steps of your territory",
      firstContact: "tutorial",
      waiver: "The legal set is drawn as glowing junctions. The affordance is the teaching."
    },
    {
      id: "turnCap",
      label: "Turn cap wins pay half",
      firstContact: "result",
      waiver: "The payout row names the halved rate inline on the only screen it can occur."
    },
    {
      id: "credits",
      label: "Credits",
      firstContact: "day",
      waiver: "Every screen that spends puts the price and the balance in the same row."
    },
    {
      id: "jobBoard",
      label: "Three tickets, shared strain",
      firstContact: "day",
      waiver: "The job board header states it every visit: three tickets, strain shared across all of them, order is yours."
    },
    {
      id: "programTiers",
      label: "Program tiers widen a cast",
      firstContact: "loadout",
      waiver: "The same kit header names where tiers and configs come from, and each card draws its own tier."
    },
    {
      id: "saveSlots",
      label: "Three save slots",
      firstContact: "desktop",
      waiver: "Standard login affordance. The slot list already states attempts and day reached."
    },
    {
      id: "runReset",
      label: "The run resets on a loss",
      firstContact: "duel",
      waiver: "The dive's own CORE LOST overlay states it the instant it happens, and the run end scene restates it in story voice."
    },
    {
      id: "finaleGate",
      label: "Day 10 is the back room",
      firstContact: "finalePre",
      waiver: "Day 10 replaces the job board with the door, and the morning scene frames it."
    },
    {
      id: "finaleOppOpens",
      label: "The finale machine takes the first turn",
      firstContact: "duel",
      waiver: "The player watches it happen: the IT IS MOVING turnlight runs before their first input, at the only dive that opens this way."
    },
    {
      id: "patchDrop",
      label: "Post dive piece rewards, the job drop and the CLEAN RUN bank",
      firstContact: "result",
      waiver: "The drop row names the recovered shape in text with its glyph inline, on the only screen a piece can arrive."
    },
    {
      id: "gridlockChip",
      label: "Gridlock wins chip 6 strain at full pay",
      firstContact: "duel",
      waiver: "The gridlock end overlay says the dead link bites, and the result breakdown itemizes the 6 as its own row."
    },
    {
      id: "augmentEffects",
      label: "What each individual augment does",
      firstContact: "result",
      waiver: "Every augment carries its own desc on the draft card, in the loadout, and in MANUAL.TXT.",
      waiverPremise: "augmentDescs"
    },
    {
      id: "modeEffects",
      label: "What each individual attack and defend mode does",
      firstContact: "loadout",
      waiver: "Modes are variations on the three programs the opening dive teaches, and each carries its own desc on hover and in the kit card.",
      waiverPremise: "modeDescs"
    }
  ];
  var MECHANIC_BY_ID = Object.fromEntries(MECHANIC_INVENTORY.map((m) => [m.id, m]));
  var TEACHING = [
    {
      id: "analyze-readout",
      teaches: ["analyzeTell", "threatTier"],
      surface: "analyze",
      when: "firstSight",
      anchor: "readout",
      order: 20,
      notBeforeDay: 1,
      title: "DIAGNOSTIC",
      copyOrder: "copy-analyze-readout",
      lines: [
        "This reads the intrusion cold: its dominant routine, its threat tier. It never bluffs.",
        "Configure your kit against the named tell before you dive, not after you meet it."
      ]
    },
    {
      id: "par-budget",
      teaches: ["par"],
      surface: "duel",
      when: "overPar",
      anchor: "par",
      order: 40,
      notBeforeDay: 1,
      title: "OVER PAR",
      copyOrder: "copy-par-budget",
      lines: [
        "PAR is the clean route, measured in rotations. You just spent past it.",
        "A win still lands, but now it costs Neural Strain. Sloppy is survivable. It is not free."
      ]
    },
    {
      id: "cascade-bank",
      teaches: ["cascade"],
      surface: "duel",
      when: "cascadeBanked",
      anchor: "screen",
      order: 50,
      notBeforeDay: 1,
      title: "CASCADE",
      copyOrder: "copy-cascade-bank",
      lines: [
        "Four or more nodes claimed off one rotation banks bonus RAM for your very next turn.",
        "That is what just happened. Line a chain up first, then trip it, instead of one node at a time."
      ]
    },
    {
      id: "strain-chip",
      teaches: ["strainChip"],
      surface: "result",
      when: "firstSight",
      anchor: "rows",
      order: 60,
      notBeforeDay: 1,
      title: "NEURAL STRAIN",
      copyOrder: "copy-strain-chip",
      lines: [
        "Strain is shared across every ticket today and will not recover between them. Zero ends the run.",
        "It bills you for rotations past par, and separately for any of their traps that actually sprung on you."
      ]
    },
    {
      id: "augment-draft",
      teaches: ["augmentDraft", "augmentCadence"],
      surface: "result",
      when: "draftOffered",
      anchor: "draft",
      order: 61,
      notBeforeDay: 1,
      title: "AUGMENT DRAFT",
      copyOrder: "copy-augment-draft",
      lines: [
        "Clearing a ticket offers three augments. Pick one and it holds for the rest of the run.",
        "Three tickets a day, so a clean day banks three picks. CONFIG unlocks a mode, BOOST bends the economy. A full bay swaps instead of blocking."
      ]
    },
    {
      id: "day-upgrade",
      teaches: ["dayUpgrade"],
      surface: "upgrade",
      when: "firstSight",
      anchor: "grid",
      order: 70,
      notBeforeDay: 1,
      title: "DAY CLOSED",
      copyOrder: "copy-day-upgrade",
      lines: [
        "There is no second pick later. Choose the one that fixes what tonight's dive actually needed."
      ]
    },
    {
      id: "night-shop",
      teaches: ["nightPatch", "darkWebBuy", "slotBuy"],
      surface: "upgrade",
      when: "firstSight",
      anchor: "patch",
      order: 71,
      notBeforeDay: 1,
      title: "NIGHT SHOP",
      copyOrder: "copy-night-shop",
      lines: [
        "You can no longer choose a shape. DARKNET.LNK sells one blind pull, price climbing by the day.",
        "Night patch still buys your strain back. Buy an extra boost bay tonight to raise your cap above 3."
      ]
    },
    {
      id: "patch-craft",
      teaches: ["patchCraft"],
      surface: "upgrade",
      when: "craftReady",
      anchor: "craft",
      order: 75,
      notBeforeDay: 1,
      title: "PATCH CRAFT",
      copyOrder: "copy-patch-craft",
      lines: [
        "Craft two pieces at night or from the loadout bench: free, and you get the union of both pieces' arms.",
        "You only get the craft when the union beats both inputs outright. Equal or smaller spends both pieces for nothing."
      ]
    },
    {
      id: "patch-cell-use",
      teaches: ["patchCellUse", "patchShapes"],
      surface: "duel",
      when: "holdingCells",
      anchor: "screen",
      order: 80,
      notBeforeDay: 1,
      title: "PATCH PIECE",
      copyOrder: "copy-patch-cell-use",
      lines: [
        "You are carrying a piece. Click a slag block within reach to fuse it in for 2 RAM. One use, then it is gone.",
        "Arms land exactly as held, never rotating once placed. Fit it to the wall you cannot route around, not the first slag you see."
      ]
    },
    {
      id: "boost-swap",
      teaches: ["boostSwap"],
      surface: "result",
      when: "swapOffered",
      anchor: "draft",
      order: 62,
      notBeforeDay: 1,
      title: "BAY FULL",
      copyOrder: "copy-boost-swap",
      lines: [
        "Boost bays are full. Take this pick and you choose one installed boost to bench in its place.",
        "CONFIGS never count against the cap and are never affected by a swap."
      ]
    }
  ];
  var TEACH_BY_ID = Object.fromEntries(TEACHING.map((m) => [m.id, m]));
  var TEACH_TIPS = [
    {
      id: "par",
      teaches: ["par"],
      control: "the PAR readout in the dive status bar",
      text: "Rotation budget for a clean route. Every rotation past par costs Neural Strain when you win."
    },
    {
      id: "strain",
      teaches: ["strainChip"],
      control: "the STRAIN meter in the dive status bar and the day footer",
      text: "Neural Strain. Shared across every ticket in the run. At zero the run ends."
    },
    {
      id: "ram",
      teaches: ["ram", "ramCarry"],
      control: "the RAM readout in the dive dock, and the day board's per turn summary",
      text: "Refills every turn. A rotation or a cast costs 1. Up to 2 unspent carries over. The rest is lost."
    },
    {
      id: "manualRef",
      teaches: ["manualRef"],
      control: "the MANUAL.TXT desktop icon",
      text: "Full reference for the loop, the kit, and every augment. Open it any time."
    },
    {
      id: "threatTier",
      teaches: ["threatTier"],
      control: "the THREAT pips on a ticket",
      text: "Threat tier, 1 to 5. Higher tiers field a wider kit and push harder from the first round."
    },
    {
      id: "boostSlots",
      teaches: ["boostSlots"],
      control: "the boost bay counter on the LOADOUT.CFG bay card",
      text: "Boost bays hold 3 at once. Buy more at night, up to 5. Configs never count against this cap."
    },
    {
      id: "modeLocked",
      teaches: ["kitConfig"],
      control: "a locked mode button in the kit",
      text: "Config not installed. Clear jobs and take a CONFIG augment from the draft to unlock it."
    }
  ];
  var TIP_BY_ID = Object.fromEntries(TEACH_TIPS.map((t) => [t.id, t]));
  function tip(id) {
    return TIP_BY_ID[id] ? TIP_BY_ID[id].text : undefined;
  }

  // ../../kernel-panic-site/app/src/game/patch-cells.ts
  var PATCH_POUCH_MAX = 5;
  function darkPatchCost(day) {
    return 25 + 5 * (day - 1);
  }

  // data.ts
  var ASSET = "../../kernel-panic-site/app/public";
  var FOOT_LINE = "A piece fills one slag block with exactly the arms it shows, welded where it lands. " + "2 RAM, one per turn, single use. Pieces come off the darknet, drop from cleared jobs, " + `or bank on clean wins; the pouch holds ${PATCH_POUCH_MAX}.`;
  function jobOf(id, quoteIndex, tier) {
    const customer = CUSTOMERS.find((c) => c.id === id) ?? CUSTOMERS[0];
    return { customer, tier: tier ?? customer.tiers[0], quoteIndex, dominant: customer.dominant };
  }
  var run = {
    runNumber: 7,
    day: 4,
    strain: 62,
    credits: 210,
    ramPerTurn: 6,
    boostSlots: 3,
    patchPouch: [5, 3, 15, 7],
    kit: {
      scanTier: 2,
      attackTier: 1,
      defendTier: 2,
      attackMode: "redirect",
      defendMode: "purge",
      attackModes: ["redirect", "armHalt"],
      defendModes: ["purge", "ward"],
      augments: ["hotBoot", "cleanRun"]
    },
    jobs: [jobOf("juno-vex", 0, 1), jobOf("sable-okonkwo", 1, 2), jobOf("aldous-wick", 0, 4)],
    jobsDone: [false, false, false]
  };
  var meta = {
    runCount: 7,
    machineOpened: false,
    stats: {
      runsWon: 0,
      divesCleared: 23,
      divesLost: 6,
      scans: 41,
      modeUse: { purge: 18, redirect: 12, ward: 5 },
      lostTo: { "aldous-wick": 3, "juno-vex": 1 }
    }
  };
  function darkPullPrice() {
    const base = darkPatchCost(run.day);
    return run.kit.augments.includes("darkDiscount") ? Math.round(base * 0.85) : base;
  }
  function openJobs() {
    return run.jobsDone.filter((d) => !d).length;
  }
  function visibleJournalMock() {
    const visible = JOURNAL_ENTRIES.filter((e) => meta.runCount >= e.unlockAtRun && (!e.requiresOpened || meta.machineOpened));
    const locked = JOURNAL_ENTRIES.find((e) => meta.runCount < e.unlockAtRun || e.requiresOpened && !meta.machineOpened);
    return { unlocked: visible, nextLocked: locked ?? null };
  }
  var subs = {};
  function on(topic, fn) {
    (subs[topic] ??= []).push(fn);
  }
  function emit(topic) {
    for (const fn of subs[topic] ?? [])
      fn();
  }

  // ../../kernel-panic-site/app/src/game/sfxr.ts
  function preset(p) {
    return {
      wave: 0,
      baseFreq: 0.3,
      freqLimit: 0,
      freqSlide: 0,
      freqDeltaSlide: 0,
      duty: 0,
      dutySweep: 0,
      vibDepth: 0,
      vibSpeed: 0,
      attack: 0,
      sustain: 0.1,
      punch: 0,
      decay: 0.15,
      arpMod: 0,
      arpSpeed: 0,
      repeatSpeed: 0,
      phaserOffset: 0,
      phaserSweep: 0,
      lpfCutoff: 1,
      lpfSweep: 0,
      lpfResonance: 0,
      hpfCutoff: 0,
      hpfSweep: 0,
      volume: 0.5,
      ...p
    };
  }
  var SAMPLE_RATE = 44100;
  function renderSfxr(ps) {
    let fperiod = 0;
    let fmaxperiod = 0;
    let fslide = 0;
    let fdslide = 0;
    let squareDuty = 0;
    let squareSlide = 0;
    let arpMod = 0;
    let arpTime = 0;
    let arpLimit = 0;
    const reset = () => {
      fperiod = 100 / (ps.baseFreq * ps.baseFreq + 0.001);
      fmaxperiod = 100 / (ps.freqLimit * ps.freqLimit + 0.001);
      fslide = 1 - Math.pow(ps.freqSlide, 3) * 0.01;
      fdslide = -Math.pow(ps.freqDeltaSlide, 3) * 0.000001;
      squareDuty = 0.5 - ps.duty * 0.5;
      squareSlide = -ps.dutySweep * 0.00005;
      arpMod = ps.arpMod >= 0 ? 1 - Math.pow(ps.arpMod, 2) * 0.9 : 1 + Math.pow(ps.arpMod, 2) * 10;
      arpTime = 0;
      arpLimit = Math.floor(Math.pow(1 - ps.arpSpeed, 2) * 20000 + 32);
      if (ps.arpSpeed === 1)
        arpLimit = 0;
    };
    reset();
    let period = Math.max(8, fperiod);
    let phase = 0;
    const noiseBuffer = new Float32Array(32);
    const reseedNoise = () => {
      for (let i = 0;i < 32; i++)
        noiseBuffer[i] = Math.random() * 2 - 1;
    };
    reseedNoise();
    const envLength = [
      Math.floor(ps.attack * SAMPLE_RATE),
      Math.floor(ps.sustain * SAMPLE_RATE),
      Math.floor(ps.decay * SAMPLE_RATE)
    ];
    const totalLength = Math.max(envLength[0] + envLength[1] + envLength[2], SAMPLE_RATE * 0.02);
    let fltp = 0;
    let fltdp = 0;
    let fltw = Math.pow(ps.lpfCutoff, 3) * 0.1;
    const fltwD = 1 + ps.lpfSweep * 0.0001;
    let fltdmp = 5 / (1 + Math.pow(ps.lpfResonance, 2) * 20) * (0.01 + fltw);
    if (fltdmp > 0.8)
      fltdmp = 0.8;
    let fltphp = 0;
    let flthp = Math.pow(ps.hpfCutoff, 2) * 0.1;
    const flthpD = 1 + ps.hpfSweep * 0.0003;
    let vibPhase = 0;
    const vibSpeed = Math.pow(ps.vibSpeed, 2) * 0.01;
    const vibAmp = ps.vibDepth * 0.5;
    let fphase = Math.pow(ps.phaserOffset, 2) * 1020;
    if (ps.phaserOffset < 0)
      fphase = -fphase;
    let fdphase = Math.pow(ps.phaserSweep, 2);
    if (ps.phaserSweep < 0)
      fdphase = -fdphase;
    let iphase = Math.abs(Math.floor(fphase));
    let ipp = 0;
    const phaserBuffer = new Float32Array(1024);
    let repTime = 0;
    const repLimit = Math.floor(Math.pow(1 - ps.repeatSpeed, 2) * 20000 + 32);
    const useRep = ps.repeatSpeed > 0;
    let envStage = 0;
    let envTime = 0;
    let envVol = 0;
    const out = new Float32Array(totalLength);
    let written = 0;
    for (let t = 0;t < totalLength; t++) {
      if (useRep && ++repTime >= repLimit) {
        repTime = 0;
        reset();
      }
      if (arpLimit !== 0 && ++arpTime >= arpLimit) {
        arpLimit = 0;
        fperiod *= arpMod;
      }
      fslide += fdslide;
      fperiod *= fslide;
      if (fperiod > fmaxperiod) {
        fperiod = fmaxperiod;
        if (ps.freqLimit > 0)
          break;
      }
      let rfperiod = fperiod;
      if (vibAmp > 0) {
        vibPhase += vibSpeed;
        rfperiod = fperiod * (1 + Math.sin(vibPhase) * vibAmp);
      }
      period = Math.max(8, Math.floor(rfperiod));
      squareDuty = Math.min(0.5, Math.max(0, squareDuty + squareSlide));
      if (++envTime > envLength[envStage]) {
        envTime = 0;
        envStage++;
        if (envStage === 3)
          break;
      }
      if (envStage === 0) {
        envVol = envLength[0] === 0 ? 1 : envTime / envLength[0];
      } else if (envStage === 1) {
        envVol = 1 + Math.pow(1 - (envLength[1] === 0 ? 1 : envTime / envLength[1]), 1) * 2 * ps.punch;
      } else {
        envVol = 1 - (envLength[2] === 0 ? 1 : envTime / envLength[2]);
      }
      fphase += fdphase;
      iphase = Math.min(1023, Math.abs(Math.floor(fphase)));
      if (flthpD !== 1) {
        flthp = Math.min(0.1, Math.max(0.00001, flthp * flthpD));
      }
      let ssample = 0;
      for (let si = 0;si < 8; si++) {
        let sample = 0;
        phase++;
        if (phase >= period) {
          phase %= period;
          if (ps.wave === 3)
            reseedNoise();
        }
        const fp = phase / period;
        if (ps.wave === 0) {
          sample = fp < squareDuty ? 0.5 : -0.5;
        } else if (ps.wave === 1) {
          sample = 1 - fp * 2;
        } else if (ps.wave === 2) {
          sample = Math.sin(fp * 2 * Math.PI);
        } else {
          sample = noiseBuffer[Math.floor(fp * 32) & 31];
        }
        const pp = fltp;
        fltw = Math.min(0.1, Math.max(0, fltw * fltwD));
        if (ps.lpfCutoff !== 1) {
          fltdp += (sample - fltp) * fltw;
          fltdp -= fltdp * fltdmp;
        } else {
          fltp = sample;
          fltdp = 0;
        }
        if (ps.lpfCutoff !== 1)
          fltp += fltdp;
        fltphp += fltp - pp;
        fltphp -= fltphp * flthp;
        sample = fltphp;
        phaserBuffer[ipp & 1023] = sample;
        sample += phaserBuffer[ipp - iphase + 1024 & 1023];
        ipp = ipp + 1 & 1023;
        ssample += sample * envVol;
      }
      ssample = ssample / 8 * 0.5 * ps.volume * 2;
      out[t] = Math.max(-1, Math.min(1, ssample));
      written = t + 1;
    }
    return out.slice(0, written);
  }
  var SFXR_SAMPLE_RATE = SAMPLE_RATE;

  // sound.ts
  var ctx = null;
  var uiBus = null;
  var gameBus = null;
  function ensureCtx() {
    if (!ctx) {
      if (!window.AudioContext)
        return null;
      ctx = new AudioContext;
      const master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);
      uiBus = ctx.createGain();
      uiBus.gain.value = 0.7;
      uiBus.connect(master);
      gameBus = ctx.createGain();
      gameBus.gain.value = 1;
      gameBus.connect(master);
    }
    if (ctx.state === "suspended")
      ctx.resume();
    return ctx;
  }
  function unlock() {
    ensureCtx();
  }
  var GAME = {
    tick: preset({ wave: 2, baseFreq: 0.62, sustain: 0.01, decay: 0.045, volume: 0.3 }),
    press: preset({ wave: 0, baseFreq: 0.32, duty: 0.35, sustain: 0.02, decay: 0.1, freqSlide: -0.15, volume: 0.42 }),
    deny: preset({ wave: 1, baseFreq: 0.16, sustain: 0.06, decay: 0.14, freqSlide: -0.05, volume: 0.42 }),
    winOpen: preset({ wave: 0, baseFreq: 0.3, duty: 0.2, freqSlide: 0.24, sustain: 0.05, decay: 0.13, volume: 0.4 }),
    winClose: preset({ wave: 0, baseFreq: 0.42, duty: 0.2, freqSlide: -0.24, sustain: 0.05, decay: 0.13, volume: 0.4 }),
    claimTick: preset({ wave: 0, baseFreq: 0.55, duty: 0.2, punch: 0.35, sustain: 0.02, decay: 0.13, volume: 0.42 }),
    pieceFuse: preset({ wave: 2, baseFreq: 0.26, freqSlide: 0.3, arpMod: 0.5, arpSpeed: 0.6, sustain: 0.1, decay: 0.3, punch: 0.55, lpfCutoff: 0.55, volume: 0.52 }),
    rotate: preset({ wave: 0, baseFreq: 0.26, duty: 0.42, sustain: 0.008, decay: 0.055, freqSlide: -0.1, hpfCutoff: 0.1, volume: 0.44 }),
    cascadeEnd: preset({ wave: 0, baseFreq: 0.6, duty: 0.15, arpMod: 0.5, arpSpeed: 0.65, punch: 0.5, sustain: 0.06, decay: 0.3, volume: 0.5 }),
    endTurn: preset({ wave: 0, baseFreq: 0.22, duty: 0.3, freqSlide: 0.1, sustain: 0.03, decay: 0.12, volume: 0.4 }),
    aim: preset({ wave: 0, baseFreq: 0.4, duty: 0.45, sustain: 0.008, decay: 0.05, volume: 0.32 }),
    heartbeat: preset({ wave: 2, baseFreq: 0.12, punch: 0.5, sustain: 0.03, decay: 0.16, lpfCutoff: 0.35, volume: 0.6 }),
    unlock: preset({ wave: 0, duty: 0.1, baseFreq: 0.5, arpMod: 0.55, arpSpeed: 0.62, punch: 0.5, sustain: 0.1, decay: 0.4, volume: 0.5 }),
    trapSet: preset({ wave: 0, baseFreq: 0.12, duty: 0.1, sustain: 0.02, decay: 0.12, freqSlide: 0.06, lpfCutoff: 0.4, volume: 0.46 }),
    trapFire: preset({ wave: 3, baseFreq: 0.13, punch: 0.7, sustain: 0.08, decay: 0.42, freqSlide: -0.28, phaserOffset: 0.25, phaserSweep: -0.25, volume: 0.85 }),
    turnLost: preset({ wave: 3, baseFreq: 0.09, punch: 0.6, sustain: 0.1, decay: 0.55, freqSlide: -0.2, lpfCutoff: 0.55, volume: 0.8 }),
    redirect: preset({ wave: 1, baseFreq: 0.62, freqSlide: -0.42, sustain: 0.04, decay: 0.16, phaserOffset: 0.15, phaserSweep: -0.15, volume: 0.5 }),
    shieldCast: preset({ wave: 0, baseFreq: 0.2, duty: 0.05, freqSlide: 0.07, sustain: 0.06, decay: 0.16, hpfCutoff: 0.2, punch: 0.3, volume: 0.5 }),
    scanCast: preset({ wave: 2, baseFreq: 0.68, freqSlide: -0.14, vibDepth: 0.18, vibSpeed: 0.55, sustain: 0.15, decay: 0.4, volume: 0.44 }),
    overloadCast: preset({ wave: 3, baseFreq: 0.5, freqSlide: -0.3, sustain: 0.08, decay: 0.25, hpfCutoff: 0.35, phaserOffset: 0.4, phaserSweep: -0.3, volume: 0.55 }),
    overclockCast: preset({ wave: 0, duty: 0.25, baseFreq: 0.3, freqSlide: 0.32, sustain: 0.15, decay: 0.25, vibDepth: 0.1, vibSpeed: 0.6, volume: 0.5 }),
    firewallCast: preset({ wave: 3, baseFreq: 0.1, punch: 0.8, sustain: 0.06, decay: 0.35, lpfCutoff: 0.35, freqSlide: -0.12, volume: 0.8 }),
    backdoorCast: preset({ wave: 0, baseFreq: 0.5, duty: 0.15, arpMod: -0.35, arpSpeed: 0.5, sustain: 0.05, decay: 0.22, volume: 0.46 }),
    virusSting: preset({ wave: 1, baseFreq: 0.3, freqSlide: -0.18, vibDepth: 0.4, vibSpeed: 0.75, sustain: 0.18, decay: 0.35, hpfCutoff: 0.1, volume: 0.55 }),
    patchPlace: preset({ wave: 0, baseFreq: 0.34, duty: 0.2, freqSlide: 0.22, arpMod: 0.4, arpSpeed: 0.5, sustain: 0.06, decay: 0.22, punch: 0.45, lpfCutoff: 0.6, volume: 0.5 }),
    overParTick: preset({ wave: 3, baseFreq: 0.55, sustain: 0.008, decay: 0.05, punch: 0.25, hpfCutoff: 0.3, volume: 0.34 })
  };
  var BENCH = {
    solderPickup: preset({ wave: 0, baseFreq: 0.42, duty: 0.25, sustain: 0.012, decay: 0.07, punch: 0.25, volume: 0.4 }),
    solderHoverLegal: preset({ wave: 2, baseFreq: 0.58, freqSlide: 0.12, sustain: 0.01, decay: 0.06, arpMod: 0.3, arpSpeed: 0.7, volume: 0.32 }),
    solderHoverIllegal: preset({ wave: 1, baseFreq: 0.2, sustain: 0.012, decay: 0.05, freqSlide: -0.05, lpfCutoff: 0.3, volume: 0.24 }),
    solderArc: preset({ wave: 3, baseFreq: 0.7, sustain: 0.006, decay: 0.05, punch: 0.5, hpfCutoff: 0.35, volume: 0.42 }),
    solderReject: preset({ wave: 1, baseFreq: 0.18, sustain: 0.03, decay: 0.1, freqSlide: -0.12, hpfCutoff: 0.15, punch: 0.2, volume: 0.4 }),
    pageFlip: preset({ wave: 3, baseFreq: 0.5, sustain: 0.02, decay: 0.07, punch: 0.25, hpfCutoff: 0.4, volume: 0.28 }),
    winFocus: preset({ wave: 0, baseFreq: 0.22, duty: 0.5, sustain: 0.015, decay: 0.05, punch: 0.15, volume: 0.22 })
  };
  var cache = new Map;
  function bufferFor(name) {
    const c = ensureCtx();
    if (!c)
      return null;
    const params = BENCH[name] ?? GAME[name];
    if (!params)
      return null;
    let buf = cache.get(name) ?? null;
    if (!buf) {
      const data = renderSfxr(params);
      buf = c.createBuffer(1, data.length, SFXR_SAMPLE_RATE);
      buf.getChannelData(0).set(data);
      cache.set(name, buf);
    }
    return buf;
  }
  function play(name, opts = {}) {
    const c = ensureCtx();
    const buf = bufferFor(name);
    if (!c || !buf || !uiBus || !gameBus)
      return;
    const src = c.createBufferSource();
    src.buffer = buf;
    const jitter = opts.jitter ? 1 + (Math.random() * 2 - 1) * opts.jitter : 1;
    src.playbackRate.value = (opts.rate ?? 1) * jitter;
    const gain = c.createGain();
    gain.gain.value = opts.vol ?? 1;
    src.connect(gain);
    gain.connect(opts.bus === "game" ? gameBus : uiBus);
    src.start(c.currentTime + (opts.at ?? 0));
  }

  // wm.ts
  var TITLE_MIN_VISIBLE = 40;
  var BASE_Z = 100;
  var wins = [];
  var zOrder = [];
  var onLayoutChange = null;
  function registerWin(win) {
    wins.push(win);
  }
  function raiseWin(id) {
    const wasTop = topId() === id;
    zOrder = [...zOrder.filter((x) => x !== id), id];
    applyZ();
    return wasTop;
  }
  function dropWin(id) {
    zOrder = zOrder.filter((x) => x !== id);
    applyZ();
  }
  function notifyLayout() {
    onLayoutChange?.();
  }
  function topId() {
    return zOrder.length ? zOrder[zOrder.length - 1] : null;
  }
  function applyZ() {
    for (const w of wins) {
      const idx = zOrder.indexOf(w.def.id);
      w.root.style.zIndex = String(idx === -1 ? BASE_Z : BASE_Z + idx + 1);
      w.root.classList.toggle("kp-fw-focused", w.def.id === topId() && w.isOpen());
    }
  }
  function makeWindow(desk, def) {
    const root = el("div", `kp-fw ${def.channel ?? ""}`.trim());
    root.style.display = "none";
    root.style.left = `${def.x}px`;
    root.style.top = `${def.y}px`;
    root.style.width = `min(${def.w}px, 96vw)`;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", def.title);
    const bar = el("div", `kp-fw-bar ${def.notched ? "kp-frame-notched-bar" : ""}`.trim());
    const titleEl = el("span", "kp-fw-title", def.title);
    bar.appendChild(titleEl);
    if (def.notched) {
      const chev = el("span", "kp-bar-chevron");
      chev.append(el("i"), el("i"), el("i"));
      bar.appendChild(chev);
    }
    const closeBtn = el("button", "kp-fw-close");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", `Close ${def.title}`);
    closeBtn.appendChild(el("i"));
    bar.appendChild(closeBtn);
    const body = el("div", "kp-fw-body");
    root.append(bar, body);
    desk.appendChild(root);
    let openFlag = false;
    const focus = () => {
      if (!openFlag)
        return;
      const wasTop = topId() === def.id;
      zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
      applyZ();
      if (!wasTop) {
        root.classList.remove("kp-fw-refocus");
        root.offsetWidth;
        root.classList.add("kp-fw-refocus");
        setTimeout(() => root.classList.remove("kp-fw-refocus"), 240);
        play("winFocus");
      }
      onLayoutChange?.();
    };
    const open = () => {
      if (openFlag) {
        focus();
        return;
      }
      openFlag = true;
      root.style.display = "flex";
      root.style.animation = "none";
      root.offsetWidth;
      root.style.animation = "";
      zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
      applyZ();
      play("winOpen");
      onLayoutChange?.();
    };
    const close = () => {
      if (!openFlag)
        return;
      openFlag = false;
      root.style.display = "none";
      zOrder = zOrder.filter((x) => x !== def.id);
      applyZ();
      play("winClose");
      onLayoutChange?.();
    };
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });
    root.addEventListener("pointerdown", () => {
      if (topId() !== def.id)
        focus();
    });
    let drag = null;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".kp-fw-close"))
        return;
      if (e.pointerType === "mouse" && e.button !== 0)
        return;
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      drag = { pointerId: e.pointerId, dx: e.clientX - root.offsetLeft, dy: e.clientY - root.offsetTop };
      root.classList.add("kp-fw-dragging");
    });
    bar.addEventListener("pointermove", (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;
      const parentW = desk.clientWidth;
      const parentH = desk.clientHeight;
      const barH = bar.offsetHeight;
      const w = root.offsetWidth;
      const x = Math.min(Math.max(e.clientX - drag.dx, TITLE_MIN_VISIBLE - w), parentW - TITLE_MIN_VISIBLE);
      const y = Math.min(Math.max(e.clientY - drag.dy, 0), parentH - Math.min(barH, TITLE_MIN_VISIBLE));
      root.style.left = `${x}px`;
      root.style.top = `${y}px`;
      onLayoutChange?.();
    });
    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;
      drag = null;
      root.classList.remove("kp-fw-dragging");
    };
    bar.addEventListener("pointerup", endDrag);
    bar.addEventListener("pointercancel", endDrag);
    const win = { def, root, bar, body, titleEl, open, close, focus, isOpen: () => openFlag };
    wins.push(win);
    return win;
  }

  // w-embed.ts
  var EMBED_PAD = 34;
  var TITLE_MIN_VISIBLE2 = 40;
  var embedFrames = [];
  function embedDocs() {
    const out = [];
    for (const f of embedFrames) {
      if (f.contentDocument)
        out.push(f.contentDocument);
    }
    return out;
  }
  var INJECT_CSS = `
/* color-scheme must MATCH the host iframe element's, or the browser
 * backs the canvas with an opaque fill and the halo stops being
 * see-through */
html { color-scheme: dark; }
html, body { background: transparent !important; overflow: hidden !important; }
body {
  display: block !important;
  margin: 0 !important;
  padding: ${EMBED_PAD}px !important;
  height: auto !important;
  min-height: 0 !important;
}
.rig, .kp-crt { display: none !important; }
.term-bar .term-glyphs { display: none !important; }
.term-bar { cursor: grab; user-select: none; touch-action: none; }
`;
  function makeEmbed(desk, def) {
    const root = el("div", "kp-embed");
    root.style.display = "none";
    root.style.left = `${def.x}px`;
    root.style.top = `${def.y}px`;
    const frame = document.createElement("iframe");
    frame.src = def.src;
    frame.style.width = `${def.frameW}px`;
    frame.style.height = "600px";
    frame.setAttribute("title", def.title);
    root.appendChild(frame);
    desk.appendChild(root);
    embedFrames.push(frame);
    let openFlag = false;
    let loaded = false;
    let everOpened = false;
    let pendingOpenFx = false;
    const doc = () => frame.contentDocument;
    const termOf = (d) => d.querySelector(".term");
    const sync = () => {
      const d = doc();
      if (!d)
        return;
      const term = termOf(d);
      if (!term)
        return;
      const r = term.getBoundingClientRect();
      if (r.width === 0)
        return;
      frame.style.height = `${Math.ceil(r.bottom + EMBED_PAD)}px`;
      const clipLeft = Math.max(0, Math.floor(r.left - EMBED_PAD));
      const clipRight = Math.max(0, Math.floor(def.frameW - r.right - EMBED_PAD));
      frame.style.clipPath = `inset(0px ${clipRight}px 0px ${clipLeft}px)`;
      notifyLayout();
    };
    const focus = () => {
      if (!openFlag)
        return;
      const wasTop = raiseWin(def.id);
      if (!wasTop)
        play("winFocus");
      notifyLayout();
    };
    const fireOpenFx = () => {
      const d = doc();
      if (!d)
        return;
      const first = !everOpened;
      everOpened = true;
      def.onOpen?.(d, first);
      sync();
    };
    const open = () => {
      if (openFlag) {
        focus();
        return;
      }
      openFlag = true;
      root.style.display = "block";
      root.style.animation = "none";
      root.offsetWidth;
      root.style.animation = "";
      raiseWin(def.id);
      play("winOpen");
      if (loaded) {
        sync();
        fireOpenFx();
      } else {
        pendingOpenFx = true;
      }
      notifyLayout();
    };
    const close = () => {
      if (!openFlag)
        return;
      openFlag = false;
      root.style.display = "none";
      dropWin(def.id);
      play("winClose");
      notifyLayout();
    };
    frame.addEventListener("load", () => {
      const d = doc();
      if (!d)
        return;
      loaded = true;
      const style = d.createElement("style");
      style.textContent = INJECT_CSS;
      d.head.appendChild(style);
      const term = termOf(d);
      const bar = d.querySelector(".term-bar");
      if (bar) {
        const closeBtn = d.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "kp-embed-close";
        closeBtn.setAttribute("aria-label", `Close ${def.title}`);
        closeBtn.appendChild(d.createElement("i"));
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          close();
        });
        bar.appendChild(closeBtn);
        let drag = null;
        bar.addEventListener("pointerdown", (e) => {
          if (e.target.closest(".kp-embed-close"))
            return;
          if (e.pointerType === "mouse" && e.button !== 0)
            return;
          e.preventDefault();
          bar.setPointerCapture(e.pointerId);
          drag = { pointerId: e.pointerId, sx: e.screenX, sy: e.screenY, left: root.offsetLeft, top: root.offsetTop };
        });
        bar.addEventListener("pointermove", (e) => {
          if (!drag || drag.pointerId !== e.pointerId)
            return;
          const t = term ? term.getBoundingClientRect() : { left: EMBED_PAD, top: EMBED_PAD, width: 400 };
          const parentW = desk.clientWidth;
          const parentH = desk.clientHeight;
          const nl = drag.left + (e.screenX - drag.sx);
          const nt = drag.top + (e.screenY - drag.sy);
          const minL = TITLE_MIN_VISIBLE2 - (t.left + t.width);
          const maxL = parentW - TITLE_MIN_VISIBLE2 - t.left;
          const minT = -t.top;
          const maxT = parentH - TITLE_MIN_VISIBLE2 - t.top;
          root.style.left = `${Math.min(Math.max(nl, minL), maxL)}px`;
          root.style.top = `${Math.min(Math.max(nt, minT), maxT)}px`;
          notifyLayout();
        });
        const endDrag = (e) => {
          if (!drag || drag.pointerId !== e.pointerId)
            return;
          drag = null;
        };
        bar.addEventListener("pointerup", endDrag);
        bar.addEventListener("pointercancel", endDrag);
      }
      d.addEventListener("pointerdown", () => focus(), true);
      if (term && frame.contentWindow) {
        const RO = frame.contentWindow.ResizeObserver;
        if (RO)
          new RO(sync).observe(term);
      }
      def.onReady?.(d);
      sync();
      if (pendingOpenFx) {
        pendingOpenFx = false;
        fireOpenFx();
      }
    });
    const winDef = { id: def.id, title: def.title, x: def.x, y: def.y, w: def.frameW };
    const win = {
      def: winDef,
      root,
      bar: root,
      body: root,
      titleEl: root,
      open,
      close,
      focus,
      isOpen: () => openFlag
    };
    registerWin(win);
    return win;
  }

  // w-darknet.ts
  var nightOpen = false;
  function setNightOpen(v) {
    nightOpen = v;
    emit("credits");
  }
  var PULLS = [10, 6, 13, 3];
  var pullIdx = 0;
  var lastPull = null;
  var buys = 0;
  function buildDarknet(win) {
    const paint = () => {
      win.body.textContent = "";
      const box = el("div", "kp-darknet");
      const dither = el("i", "kp-darknet-dither");
      box.appendChild(dither);
      box.appendChild(el("p", "kp-darknet-tag", "SELLER: SIGNAL SCRAMBLED. NO ID ON FILE."));
      if (!nightOpen) {
        const h = hero("MARKET OFFLINE.", "kp-darknet-offline-hero");
        box.appendChild(h);
        box.appendChild(el("p", "", "Signal only holds after the shop shuts. Trades resume at day close."));
        win.body.appendChild(box);
        return;
      }
      box.appendChild(el("p", "", "Salvage off a hundred dead machines, sorted by nobody."));
      box.appendChild(el("p", "", "Pay first. Shape is the surprise. That is the whole business model here."));
      const cost = darkPullPrice();
      const full = run.patchPouch.length >= PATCH_POUCH_MAX;
      const broke = run.credits < cost;
      const row = el("div", "kp-darknet-row");
      const buy = btn(`BUY BLIND (${cost} cr)`, "primary", () => {
        play("pieceFuse");
        run.credits -= cost;
        lastPull = PULLS[pullIdx % PULLS.length];
        pullIdx++;
        buys++;
        run.patchPouch.push(lastPull);
        emit("pouch");
        emit("credits");
      });
      buy.disabled = full || broke;
      if (full)
        buy.title = `POUCH FULL (${PATCH_POUCH_MAX}/${PATCH_POUCH_MAX})`;
      else if (broke)
        buy.title = `NEED ${cost} CR`;
      row.appendChild(buy);
      row.appendChild(hatchBar(Math.min(100, cost / Math.max(1, run.credits) * 100)));
      row.appendChild(el("span", "kp-darknet-balance", `${run.credits} cr`));
      box.appendChild(row);
      if (full) {
        box.appendChild(el("p", "kp-rail-dim", "Dealer is not a storage locker. Pouch is full. Come back with room."));
      }
      if (lastPull !== null && buys > 0) {
        const reveal = el("div", "kp-darknet-reveal");
        const cell = el("span", "kp-photo-cell-full");
        const g = patchGlyph(lastPull, 44);
        g.classList.add("kp-reveal-pop");
        cell.appendChild(g);
        cell.appendChild(el("i", "kp-scan-sweep"));
        reveal.appendChild(cell);
        const txt = el("div");
        txt.appendChild(el("p", "", "PIECE ACQUIRED. SHAPE CONFIRMED ON ARRIVAL."));
        txt.appendChild(el("p", "kp-rail-dim", "Told you. Never know what you're gonna get."));
        reveal.appendChild(txt);
        box.appendChild(reveal);
      }
      const pouch = el("div", "kp-darknet-pouch");
      pouch.appendChild(el("span", "kp-rail-dim", `POUCH ${run.patchPouch.length}/${PATCH_POUCH_MAX}`));
      for (const m of run.patchPouch)
        pouch.appendChild(patchGlyph(m, 20));
      box.appendChild(pouch);
      box.appendChild(el("p", "kp-rail-dim", "No refunds. No complaints line. Close the window if you want a guarantee."));
      win.body.appendChild(box);
    };
    paint();
    on("pouch", paint);
    on("credits", paint);
    on("screen", paint);
  }

  // w-shopfront.ts
  var TITLE = {
    board: "JOBS.QUE",
    diag: "DIAGNOSTIC.LOG",
    result: "SHOPFRONT",
    night: "NIGHT.SYS",
    story: "MORNING.LOG"
  };
  var teachDismissed = false;
  function buildShopfront(win, openLoadout) {
    let screen = "board";
    let activeJob = 0;
    let nightPick = null;
    let draftPick = null;
    let sceneBeat = 0;
    const set = (s) => {
      screen = s;
      win.titleEl.textContent = TITLE[s];
      setNightOpen(s === "night");
      if (s === "story")
        sceneBeat = 0;
      if (s === "result")
        draftPick = null;
      paint();
      emit("screen");
    };
    const paint = () => {
      win.body.textContent = "";
      if (screen === "board")
        paintBoard();
      else if (screen === "diag")
        paintDiag();
      else if (screen === "result")
        paintResult();
      else if (screen === "night")
        paintNight();
      else
        paintStory();
    };
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
          if (done)
            return;
          play("press");
          activeJob = i;
          set("diag");
        });
        row.appendChild(photoCell(ASSET + job.customer.portrait, 96, 96));
        const mid = el("div", "kp-job-mid");
        mid.appendChild(datarows([
          { label: "NAME", value: job.customer.name },
          { label: "DEVICE", value: job.customer.device }
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
        for (const m of run.patchPouch)
          p.appendChild(patchGlyph(m, 14));
        foot.appendChild(p);
      }
      foot.appendChild(chip("KIT", `S${run.kit.scanTier}/A${run.kit.attackTier}/D${run.kit.defendTier}`));
      box.appendChild(foot);
      win.body.appendChild(box);
    };
    const teachCallout = () => {
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
        ...dayCfg.headStart > 0 ? [{ label: "WARNING", value: `Intrusion already ${dayCfg.headStart} nodes deep`, warn: true }] : []
      ]);
      readout.appendChild(rows);
      grid.appendChild(readout);
      box.appendChild(ruler("INTAKE", "READOUT"));
      box.appendChild(grid);
      const actions = el("div", "kp-screen-actions");
      actions.appendChild(btn("BACK", "ghost", () => {
        play("press");
        set("board");
      }));
      actions.appendChild(btn("CONFIGURE KIT", "ghost", () => {
        play("press");
        openLoadout();
      }));
      actions.appendChild(btn("DIVE", "signal", () => {
        play("claimTick");
        set("result");
      }));
      box.appendChild(actions);
      win.body.appendChild(box);
    };
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
        { label: "NEURAL STRAIN", value: `clean (${run.strain} left)` }
      ]));
      const draft = el("div", "kp-draft");
      draft.appendChild(el("h3", "", draftPick ? "AUGMENT INSTALLED" : "AUGMENT DRAFT - PICK ONE"));
      const grid = el("div", "kp-draft-grid");
      const offer = AUGMENTS.filter((a) => !run.kit.augments.includes(a.id)).slice(0, 3);
      for (const a of offer) {
        const card = el("button", "kp-draft-card");
        card.type = "button";
        card.disabled = draftPick !== null;
        if (draftPick && draftPick !== a.id)
          card.style.opacity = "0.4";
        card.appendChild(el("span", "kp-draft-kind", a.kind === "config" ? "CONFIG" : "BOOST"));
        card.appendChild(el("strong", "", a.name));
        card.appendChild(el("p", "", a.desc));
        if (draftPick === a.id)
          card.appendChild(el("em", "kp-upg-stamp", "INSTALLED"));
        card.addEventListener("click", () => {
          if (draftPick)
            return;
          play("claimTick");
          draftPick = a.id;
          if (a.kind === "boost" && run.kit.augments.length < run.boostSlots)
            run.kit.augments.push(a.id);
          paint();
        });
        grid.appendChild(card);
      }
      draft.appendChild(grid);
      box.appendChild(draft);
      const actions = el("div", "kp-screen-actions");
      const allDoneAfter = run.jobsDone.filter((d, i) => d || i === activeJob).length === run.jobs.length;
      const label = draftPick ? allDoneAfter ? "CLOSE THE DAY" : "NEXT TICKET" : "SKIP THE DRAFT";
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
      const tile = (pick, label, detail, disabled = false) => {
        const b = el("button", `kp-upg ${nightPick === pick ? "kp-upg-picked" : ""}`.trim());
        b.type = "button";
        b.disabled = disabled;
        b.appendChild(el("strong", "", label));
        b.appendChild(el("span", "", detail));
        if (nightPick === pick)
          b.appendChild(el("em", "kp-upg-stamp", "SELECTED"));
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
      const shopRow = (label, note, pips, onBuy) => {
        const row = el("div", "kp-patchrow");
        const b = btn(label, "ghost", () => {
          if (onBuy) {
            play("claimTick");
            onBuy();
          }
        });
        b.disabled = onBuy === null;
        row.appendChild(b);
        row.appendChild(el("span", "kp-rail-dim", note));
        if (pips)
          row.appendChild(pips);
        return row;
      };
      const patchCost = 45 + 5 * run.day;
      box.appendChild(shopRow(`NIGHT PATCH: +12 STRAIN (${patchCost} cr)`, `STRAIN ${run.strain}/100 - ${run.credits} cr - rest restored +10`, null, run.credits >= patchCost && run.strain < 100 ? () => {
        run.credits -= patchCost;
        run.strain = Math.min(100, run.strain + 12);
        emit("credits");
        paint();
      } : null));
      const pouchPips = el("span", "kp-pip-row");
      for (const m of run.patchPouch)
        pouchPips.appendChild(patchGlyph(m, 18));
      box.appendChild(shopRow("BUY BLIND: SEE DARKNET.LNK", `POUCH ${run.patchPouch.length}/${PATCH_POUCH_MAX} - ${run.credits} cr - Pay first. Shape is the surprise.`, pouchPips, null));
      const bayCost = run.boostSlots === 3 ? 150 : run.boostSlots === 4 ? 300 : null;
      box.appendChild(shopRow(`INSTALL BOOST BAY (${bayCost ?? "MAX"}${bayCost !== null ? " cr" : ""})`, `BAYS ${run.kit.augments.length}/${run.boostSlots} - ${run.credits} cr - A full bay drafts as a swap.`, pipRow(run.boostSlots, 5), bayCost !== null && run.credits >= bayCost ? () => {
        run.credits -= bayCost;
        run.boostSlots++;
        emit("credits");
        paint();
      } : null));
      const actions = el("div", "kp-screen-actions kp-nightclose");
      actions.appendChild(el("span", "kp-rail-dim", nightPick === null ? "Pick one upgrade above to close the night." : `Closing the night opens day ${run.day + 1}.`));
      const close = btn("CLOSE THE NIGHT", "signal", () => {
        play("claimTick");
        if (nightPick === "ram")
          run.ramPerTurn++;
        if (nightPick === "scan")
          run.kit.scanTier++;
        if (nightPick === "attack")
          run.kit.attackTier++;
        if (nightPick === "defend")
          run.kit.defendTier++;
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
    const paintStory = () => {
      const scene = dayOpenScene(Math.min(run.day, FINAL_DAY));
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
      const names = { sister: "RHEA", father: "DAD", system: "SYSTEM", companion: "???" };
      text.appendChild(el("span", "kp-story-name", b.name ?? names[b.speaker]));
      for (const line of b.lines)
        text.appendChild(el("p", "", line));
      const glyph = el("span", "kp-story-nextglyph");
      glyph.append(el("i"), el("i"), el("i"));
      text.appendChild(glyph);
      beat.appendChild(text);
      box.appendChild(beat);
      const advance = () => {
        play("tick");
        if (last)
          set("board");
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
    on("pouch", () => {
      if (screen === "board" || screen === "night")
        paint();
    });
    return { set, screen: () => screen };
  }

  // w-manual.ts
  var TABS = ["DIVE", "KIT", "PATCHES", "AUGMENTS", "BAYS"];
  function ability(name, tag, desc) {
    const w = el("div", "kp-manual-ability");
    const strong = el("strong");
    strong.append(document.createTextNode(name), el("em", "", tag));
    w.append(strong, el("p", "", desc));
    return w;
  }
  function pageFor(tab) {
    const page = el("div", "kp-manual-page");
    if (tab === "DIVE") {
      page.appendChild(el("h3", "", "HOW A DIVE WORKS"));
      page.appendChild(el("p", "", "The whole grid is scrambled junctions. Click one to rotate it a quarter turn (1 RAM). Your " + "signal floods live from YOUR port through every aligned pipe and claims what it touches. " + "One good rotation can cascade a whole chain. First flood to touch the CORE wins the job."));
      page.appendChild(el("p", "", "You can rotate your own claimed junctions and any open junction within TWO steps of your " + "territory: set up a chain, then trip it. Cascades of four or more claims BANK bonus RAM for " + "your next turn. The intrusion floods from the far port under the same rules, on its own " + "RAM. Losing a duel zeroes Neural Strain and ends the run. Sloppy wins chip it."));
    } else if (tab === "KIT") {
      page.appendChild(el("h3", "", "THE KIT: three programs, 1 RAM, once per turn each"));
      const list = el("div", "kp-manual-abilities");
      list.appendChild(ability("SCAN.EXE", "always 1 RAM", `${scanDesc(1)} Upgrades widen the sweep. Scan before you walk; every trap it finds stays found.`));
      list.appendChild(ability("ATTACK.EXE", "configurable", `${ATTACK_MODE_LABEL.redirect}: ${attackModeDesc("redirect", 1)} ` + `${ATTACK_MODE_LABEL.armHalt}: ${attackModeDesc("armHalt", 1)} ` + `${ATTACK_MODE_LABEL.armSiphon}: ${attackModeDesc("armSiphon", 1)} Upgrades hit more nodes per cast.`));
      list.appendChild(ability("DEFEND.EXE", "configurable", `${DEFEND_MODE_LABEL.purge}: ${defendModeDesc("purge", 1)} ` + `${DEFEND_MODE_LABEL.lock}: ${defendModeDesc("lock", 1)} ` + `${DEFEND_MODE_LABEL.ward}: ${defendModeDesc("ward", 1)} Upgrades cover more nodes per cast.`));
      page.appendChild(list);
    } else if (tab === "PATCHES") {
      page.appendChild(el("h3", "", "PATCH PIECES"));
      page.appendChild(el("p", "", "Slag blocks used to take a flat cell. Now they take a shaped piece: straight, elbow, tee, " + "or cross. Whatever arms a piece rolls on pickup are the arms it keeps, nothing rotates " + "once it is in your pouch, and a placed piece is welded where it lands."));
      page.appendChild(el("p", "", "Craft two pieces at the bench into the union of their arms. Legal only when the result is " + "strictly bigger than both pieces you started with; equal or smaller, the bench will not " + "make the join."));
      page.appendChild(el("p", "", "Three ways into the pouch: buy blind off the darknet, pull one from a cleared job, or bank " + `a random piece on a clean win. Five pieces, pouch capped.`));
    } else if (tab === "AUGMENTS") {
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
      page.appendChild(el("p", "", "Boosts install into bays, three of them to start. Configs are not boosts and never count " + "against the cap."));
      page.appendChild(el("p", "", "A full bay does not block a new boost, it swaps one: take the drop or keep what is already " + "installed. Buy more bays at day close. First one runs 150 cr, the next 300."));
      page.appendChild(el("p", "kp-rail-dim", "Every cleared job offers a draft of augments; every closed day offers +1 RAM or a program " + "tier. Everything resets when the run ends. Only you remember."));
    }
    return page;
  }
  function buildManual(win) {
    let active = "DIVE";
    const paint = (flip) => {
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
      if (flip)
        frame.classList.add("kp-page-flip");
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
    const nav = (t) => {
      if (!t || t === active)
        return;
      active = t;
      play("pageFlip");
      paint(true);
    };
    paint(false);
  }

  // w-ledger.ts
  function topOf(counts) {
    let best = null;
    for (const [key, n] of Object.entries(counts)) {
      if (!best || n > best.n)
        best = { key, n };
    }
    return best;
  }
  function buildLedger(win) {
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
      sheet.appendChild(datarows([
        { label: "ATTEMPT", value: String(run.runNumber) },
        { label: "DAY", value: `${Math.min(run.day, FINAL_DAY)}/10` },
        { label: "NEURAL STRAIN", value: strainWrap },
        { label: "CREDITS", value: `${run.credits} cr` },
        { label: "RAM / TURN", value: String(run.ramPerTurn) },
        { label: "PATCH POUCH", value: pouchPips() },
        { label: "BOOST BAYS", value: bayPips() },
        { label: "KIT TIERS", value: `S${run.kit.scanTier} A${run.kit.attackTier} D${run.kit.defendTier}` },
        { label: "AUGMENTS", value: `${run.kit.augments.length}/${boosts}` }
      ], true));
      sheet.appendChild(ruler("RUN", "LIFETIME"));
      const mode = topOf(meta.stats.modeUse);
      const lethal = topOf(meta.stats.lostTo);
      const lethalName = lethal ? CUSTOMERS.find((c) => c.id === lethal.key)?.name ?? lethal.key : null;
      sheet.appendChild(datarows([
        { label: "ATTEMPTS", value: String(meta.runCount) },
        { label: "MACHINE BEATEN", value: String(meta.stats.runsWon) },
        { label: "JOBS CLEARED", value: String(meta.stats.divesCleared) },
        { label: "DIVES LOST", value: String(meta.stats.divesLost) },
        { label: "SCANS RUN", value: String(meta.stats.scans) },
        { label: "MOST USED MODE", value: mode ? `${MODE_LABEL[mode.key] ?? mode.key} x${mode.n}` : "none yet" },
        { label: "MOST LETHAL", value: lethalName ? `${lethalName} x${lethal.n}` : "nobody yet" }
      ], true));
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

  // w-dadlog.ts
  var SVGNS2 = "http://www.w3.org/2000/svg";
  function hashSeed(id) {
    let h = 2166136261;
    for (let i = 0;i < id.length; i++) {
      h ^= id.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function waveStrip(id) {
    const wrap = el("div", "kp-jentry-wave");
    let s = hashSeed(id);
    const next = () => {
      s = Math.imul(s, 1664525) + 1013904223 >>> 0;
      return s;
    };
    const svg = document.createElementNS(SVGNS2, "svg");
    svg.setAttribute("width", "180");
    svg.setAttribute("height", "22");
    svg.setAttribute("viewBox", "0 0 180 22");
    const pts = [];
    for (let x = 0;x <= 180; x += 6) {
      const y = 11 + (next() % 100 / 100 * 16 - 8);
      pts.push(`${x},${Math.round(y)}`);
    }
    const line = document.createElementNS(SVGNS2, "polyline");
    line.setAttribute("points", pts.join(" "));
    line.setAttribute("shape-rendering", "crispEdges");
    svg.appendChild(line);
    wrap.appendChild(svg);
    const groups = [];
    for (let g = 0;g < 4; g++) {
      groups.push((next() % 65535).toString(16).toUpperCase().padStart(4, "0"));
    }
    wrap.appendChild(el("span", "kp-jentry-hex", groups.join(" - ")));
    return wrap;
  }
  function buildDadlog(win) {
    const { unlocked, nextLocked } = visibleJournalMock();
    const total = unlocked.length + (nextLocked ? 1 : 0);
    let page = unlocked.length - 1;
    const paint = (flip) => {
      win.body.textContent = "";
      const box = el("div", "kp-dadlog");
      const frame = el("div", "kp-dadlog-frame");
      if (flip)
        frame.classList.add("kp-page-flip");
      const isLocked = page >= unlocked.length;
      if (!isLocked) {
        const e = unlocked[page];
        const card = el("article", `kp-jentry kp-jentry-${e.kind}`);
        nodes(card, true);
        const datebar = el("header", "kp-jentry-datebar");
        datebar.append(el("span", "", e.kind.toUpperCase()), el("span", "", e.date));
        card.appendChild(datebar);
        card.appendChild(hero(e.title, "kp-jentry-hero"));
        const body = el("div", "kp-jentry-body");
        for (const line of e.body)
          body.appendChild(el("p", "", line));
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
    const nav = (d) => {
      const target = Math.min(total - 1, Math.max(0, page + d));
      if (target === page)
        return;
      page = target;
      play("pageFlip");
      paint(true);
    };
    paint(false);
  }

  // main.ts
  var root = document.getElementById("root");
  function kpLockup(cell, wordPx) {
    const wrap = el("div", "kp-lockup");
    wrap.appendChild(kpMark(cell));
    const word = el("pre", "kp-lockup-word", `KERNEL
PANIC`);
    word.style.fontSize = `${wordPx}px`;
    wrap.appendChild(word);
    return wrap;
  }
  function showBoot() {
    root.textContent = "";
    const boot = el("div", "kp-boot");
    boot.appendChild(el("i", "kp-boot-dither"));
    const inner = el("div", "kp-boot-inner");
    ticks(inner);
    inner.appendChild(kpLockup(4, 26));
    const lines = [
      "REPAIR BENCH BIOS v9.2",
      "KERNEL PANIC vDEMO kpos-shell",
      "640K NEURAL BUFFER ... OK",
      "SIGNAL BUS ........... OK",
      "BACK ROOM LOCK ....... ENGAGED",
      "MOUNTING SHOPFRONT ..."
    ];
    lines.forEach((l, i) => {
      const p = el("p", "kp-boot-line", l);
      p.style.animationDelay = `${0.15 + i * 0.22}s`;
      inner.appendChild(p);
    });
    inner.appendChild(el("p", "kp-boot-cursor", "_"));
    boot.appendChild(inner);
    root.appendChild(boot);
    const done = () => {
      clearTimeout(t);
      showLogin();
    };
    const t = setTimeout(done, 1700);
    boot.addEventListener("click", done, { once: true });
  }
  function showLogin() {
    root.textContent = "";
    const login = el("div", "kp-login");
    const head = el("div", "kp-login-head");
    head.appendChild(kpLockup(7, 38));
    head.appendChild(el("p", "kp-login-sub", "KP/OS v9.2 - SELECT USER"));
    login.appendChild(head);
    login.appendChild(el("p", "kp-build-stamp", "BUILD kpos-shell demo"));
    const slots = el("div", "kp-login-slots");
    const occupied = (slotN, sub, rows, dim) => {
      const wrap = el("div", "kp-slotwrap");
      wrap.style.animationDelay = `${(slotN - 1) * 120}ms`;
      const card = el("button", "kp-slot");
      card.type = "button";
      nodes(card);
      card.appendChild(el("span", "kp-slot-avatar", ">_"));
      card.appendChild(el("strong", "", `USER 0${slotN}`));
      card.appendChild(datarows(rows));
      card.appendChild(el("span", "kp-slot-line kp-slot-dim", dim));
      card.addEventListener("click", () => beginLogin(slotN));
      wrap.appendChild(card);
      return wrap;
    };
    slots.appendChild(occupied(1, "", [
      { label: "ATTEMPT", value: String(meta.runCount) },
      { label: "DAY", value: `${run.day}` },
      { label: "STRAIN", value: `${run.strain}` }
    ], "back room sealed"));
    slots.appendChild(occupied(2, "", [
      { label: "ATTEMPT", value: "2" },
      { label: "DAY", value: "1" },
      { label: "STRAIN", value: "88" }
    ], "back room sealed"));
    const emptyWrap = el("div", "kp-slotwrap");
    emptyWrap.style.animationDelay = "240ms";
    const empty = el("button", "kp-slot kp-slot-empty");
    empty.type = "button";
    empty.appendChild(el("span", "kp-slot-plus", "+"));
    empty.appendChild(el("strong", "", "NEW USER"));
    empty.appendChild(el("span", "kp-slot-line", "empty slot"));
    empty.addEventListener("click", () => beginLogin(3));
    emptyWrap.appendChild(empty);
    slots.appendChild(emptyWrap);
    login.appendChild(slots);
    const term = el("div", "kp-login-term");
    login.appendChild(term);
    root.appendChild(login);
    const PASSWORD = "**********";
    const beginLogin = (slotN) => {
      play("press");
      slots.style.display = "none";
      const user = `user_0${slotN}`;
      let typedUser = 0;
      let typedPass = 0;
      const step = () => {
        term.textContent = "";
        const line1 = el("p");
        line1.appendChild(el("span", "kp-login-label", "USERNAME: "));
        line1.appendChild(document.createTextNode(user.slice(0, typedUser)));
        if (typedUser < user.length)
          line1.appendChild(el("span", "kp-boot-cursor", "_"));
        term.appendChild(line1);
        if (typedUser >= user.length) {
          const line2 = el("p");
          line2.appendChild(el("span", "kp-login-label", "PASSWORD: "));
          line2.appendChild(document.createTextNode(PASSWORD.slice(0, typedPass)));
          if (typedPass < PASSWORD.length)
            line2.appendChild(el("span", "kp-boot-cursor", "_"));
          term.appendChild(line2);
        }
        if (typedUser < user.length) {
          typedUser++;
          play("tick");
          setTimeout(step, 70);
        } else if (typedPass < PASSWORD.length) {
          typedPass++;
          play("tick");
          setTimeout(step, 45);
        } else {
          play("claimTick");
          term.appendChild(el("p", "kp-login-granted", "ACCESS GRANTED. WELCOME BACK."));
          setTimeout(() => showDesktop(slotN), 900);
        }
      };
      step();
    };
  }
  function showDesktop(slotN) {
    root.textContent = "";
    const os = el("div", "kp-os");
    const wall = el("div", "kp-wallpaper");
    wall.appendChild(el("i", "kp-dither"));
    const reg = el("div", "kp-wallreg");
    for (let c = 0;c < 4; c++)
      reg.appendChild(el("i"));
    wall.appendChild(reg);
    const poster = makeWallPoster();
    poster.classList.add("kp-slot-anim");
    poster.style.animationDelay = "260ms";
    wall.appendChild(poster);
    const scope = makeWallScope();
    scope.classList.add("kp-slot-anim");
    scope.style.animationDelay = "340ms";
    wall.appendChild(scope);
    os.appendChild(wall);
    const desk = el("main");
    desk.style.position = "absolute";
    desk.style.inset = "0 0 44px 0";
    os.appendChild(desk);
    const ticker = el("div", "kp-ticker");
    const tickerText = el("span");
    const stats = [
      ["ATTEMPTS", meta.runCount],
      ["MACHINE BEATEN", meta.stats.runsWon],
      ["JOBS CLEARED", meta.stats.divesCleared],
      ["DIVES LOST", meta.stats.divesLost],
      ["SCANS RUN", meta.stats.scans]
    ];
    tickerText.textContent = stats.map(([l, v]) => `${l} ${v}`).join(" // ");
    ticker.appendChild(tickerText);
    os.appendChild(ticker);
    const wFlow = makeWindow(desk, { id: "flow", title: "JOBS.QUE", x: 170, y: 34, w: 940 });
    const wManual = makeWindow(desk, { id: "manual", title: "MANUAL.TXT", x: 90, y: 60, w: 760 });
    const wJournal = makeWindow(desk, { id: "journal", title: "DAD.LOG", x: 150, y: 40, w: 760 });
    const wLedger = makeWindow(desk, { id: "ledger", title: "LEDGER.LOG", x: 660, y: 100, w: 480 });
    const wDarknet = makeWindow(desk, { id: "darknet", title: "DARKNET.LNK", x: 560, y: 150, w: 480, notched: true });
    const wInbox = makeEmbed(desk, {
      id: "inbox",
      title: "INBOX",
      src: "inbox.html",
      frameW: 1210 + EMBED_PAD * 2,
      x: 140,
      y: 30
    });
    const wLoadout = makeEmbed(desk, {
      id: "loadout",
      title: "LOADOUT.CFG",
      src: "loadout.html",
      frameW: 1040 + EMBED_PAD * 2,
      x: 100,
      y: -30,
      onReady: (d) => {
        const fine = d.querySelectorAll("#ditherrow button")[1];
        fine?.click();
      },
      onOpen: (d) => d.getElementById("replay")?.click()
    });
    const wSolder = makeEmbed(desk, {
      id: "solder",
      title: "SOLDER.BAY",
      src: "solder.html",
      frameW: 1060 + EMBED_PAD * 2,
      x: 180,
      y: 24,
      onOpen: (d, first) => {
        if (first)
          d.querySelector("#pouchrow button")?.click();
      }
    });
    const wReport = makeEmbed(desk, {
      id: "report",
      title: "REPAIR.LOG",
      src: "dive-report.html",
      frameW: 1150 + EMBED_PAD * 2,
      x: 100,
      y: 10,
      onOpen: (d) => {
        const cur = d.querySelector("#scenrow .rig-on") ?? d.querySelector("#scenrow button");
        cur?.click();
      }
    });
    const flow = buildShopfront(wFlow, () => wLoadout.open());
    buildManual(wManual);
    buildLedger(wLedger);
    buildDadlog(wJournal);
    buildDarknet(wDarknet);
    const grid = el("div", "kp-dicon-grid");
    const icon = (label, key, ch, badge, onOpen) => {
      const b = el("button", "kp-dicon");
      b.type = "button";
      if (ch)
        b.style.setProperty("--icon-ch", ch);
      const glyph = el("span", "kp-dicon-glyph");
      glyph.appendChild(pxIcon(PX_ICONS[key], 3));
      if (badge && badge > 0)
        glyph.appendChild(el("span", "kp-dicon-badge", String(badge)));
      b.appendChild(glyph);
      b.appendChild(el("span", "kp-dicon-label", label));
      b.addEventListener("click", () => {
        play("press");
        onOpen();
      });
      b.classList.add("kp-slot-anim");
      b.style.animationDelay = `${grid.children.length * 50}ms`;
      grid.appendChild(b);
      return b;
    };
    let jobsIcon = icon("INBOX", "inbox", null, openJobs(), () => wInbox.open());
    icon("LOADOUT.CFG", "loadout", null, undefined, () => wLoadout.open());
    icon("SOLDER.BAY", "solder", null, undefined, () => wSolder.open());
    icon("REPAIR.LOG", "report", null, undefined, () => wReport.open());
    icon("DAD.LOG", "journal", null, undefined, () => wJournal.open());
    icon("MANUAL.TXT", "manual", null, undefined, () => wManual.open());
    icon("LEDGER.LOG", "ledger", null, undefined, () => wLedger.open());
    icon("DARKNET.LNK", "darknet", null, undefined, () => wDarknet.open());
    desk.appendChild(grid);
    const repaintJobsBadge = () => {
      const glyph = jobsIcon.querySelector(".kp-dicon-glyph");
      glyph.querySelector(".kp-dicon-badge")?.remove();
      const n = openJobs();
      if (n > 0)
        glyph.appendChild(el("span", "kp-dicon-badge", String(n)));
    };
    on("screen", repaintJobsBadge);
    on("day", repaintJobsBadge);
    const bar = el("footer", "kp-taskbar");
    const mark = el("button", "kp-task-mark");
    mark.type = "button";
    mark.appendChild(kpMark(2, true));
    mark.appendChild(document.createTextNode("KP/OS"));
    bar.appendChild(mark);
    const chips = el("div", "kp-task-chips");
    const paintChips = () => {
      chips.textContent = "";
      chips.appendChild(chip("USER", `0${slotN}`));
      const pct = Math.round(Math.min(run.day, FINAL_DAY) / FINAL_DAY * 100);
      chips.appendChild(chip("DAY", `${Math.min(run.day, FINAL_DAY)}/10 ${pct}%`));
      chips.appendChild(chip("STRAIN", String(run.strain), run.strain > 70));
      chips.appendChild(chip("CR", String(run.credits)));
    };
    paintChips();
    on("credits", paintChips);
    on("day", paintChips);
    bar.appendChild(chips);
    bar.appendChild(el("span", "kp-task-spacer"));
    const abandonBtn = el("button", "kp-task-btn kp-task-danger", "ABANDON");
    abandonBtn.type = "button";
    bar.appendChild(abandonBtn);
    const sndBtn = el("button", "kp-task-btn", "SND ON");
    sndBtn.type = "button";
    sndBtn.addEventListener("click", () => {
      play("press");
      sndBtn.textContent = sndBtn.textContent === "SND ON" ? "SND OFF" : "SND ON";
    });
    bar.appendChild(sndBtn);
    os.appendChild(bar);
    let menu = null;
    mark.addEventListener("click", () => {
      play("press");
      if (menu) {
        menu.remove();
        menu = null;
        mark.classList.remove("kp-task-mark-open");
        return;
      }
      mark.classList.add("kp-task-mark-open");
      menu = el("div", "kp-startmenu");
      nodes(menu);
      menu.appendChild(el("span", "kp-startmenu-user", `USER 0${slotN}`));
      const item = (label, fn) => {
        const b = el("button", "", label);
        b.type = "button";
        b.addEventListener("click", () => {
          play("press");
          fn();
        });
        menu.appendChild(b);
      };
      item("MUSIC OFF", () => {});
      item("TEST SOUND", () => play("claimTick"));
      item("LOG OUT", () => showLogin());
      item("CLOSE", () => {
        menu?.remove();
        menu = null;
        mark.classList.remove("kp-task-mark-open");
      });
      os.appendChild(menu);
    });
    abandonBtn.addEventListener("click", () => {
      play("press");
      const modal = el("div", "kp-modal");
      modal.setAttribute("role", "dialog");
      const box = el("div", "kp-modal-box");
      box.appendChild(el("h3", "", "ABANDON THIS RUN?"));
      box.appendChild(el("p", "", `This ends attempt ${run.runNumber} exactly like a loss. Kit tiers, augments, credits ` + "and patch pieces all reset for the next attempt. The journal and the ledger keep what " + "they already hold."));
      const actions = el("div", "kp-modal-actions");
      const keep = el("button", "kp-btn2 kp-btn2-ghost", "KEEP DIVING");
      keep.type = "button";
      keep.addEventListener("click", () => {
        play("press");
        modal.remove();
      });
      const yes = el("button", "kp-btn2 kp-btn2-primary kp-btn2-danger", "ABANDON");
      yes.type = "button";
      yes.addEventListener("click", () => {
        play("deny");
        modal.remove();
      });
      actions.append(keep, yes);
      box.appendChild(actions);
      modal.appendChild(box);
      os.appendChild(modal);
    });
    root.appendChild(os);
    wInbox.open();
    const rig = el("div", "rig");
    rig.appendChild(el("strong", "", "DEMO RIG"));
    rig.appendChild(el("span", "", "Hue (one scheme, pick the family)"));
    const hueRow = el("div", "rig-row");
    for (const h of ["lavender", "magenta", "phosphor"]) {
      const b = el("button", h === "lavender" ? "rig-on" : "", h.toUpperCase());
      b.addEventListener("click", () => {
        hueRow.querySelectorAll("button").forEach((x) => x.classList.remove("rig-on"));
        b.classList.add("rig-on");
        document.documentElement.dataset.hue = h;
        for (const d of embedDocs())
          d.documentElement.dataset.hue = h;
      });
      hueRow.appendChild(b);
    }
    rig.appendChild(hueRow);
    rig.appendChild(el("span", "", "Screens. BOARD and RESULT open the study windows; OLD marks legacy flow screens that have no redesigned counterpart yet."));
    const row = el("div", "rig-row");
    const rigBtns = [
      ["BOARD", () => wInbox.open(), () => wInbox.isOpen()],
      ["DIAG (OLD)", () => {
        wFlow.open();
        flow.set("diag");
      }, () => wFlow.isOpen() && flow.screen() === "diag"],
      ["RESULT", () => wReport.open(), () => wReport.isOpen()],
      ["NIGHT (OLD)", () => {
        wFlow.open();
        flow.set("night");
      }, () => wFlow.isOpen() && flow.screen() === "night"],
      ["STORY (OLD)", () => {
        wFlow.open();
        flow.set("story");
      }, () => wFlow.isOpen() && flow.screen() === "story"]
    ];
    const rigBtnEls = [];
    const paintRig = () => {
      rigBtnEls.forEach((b, i) => b.classList.toggle("rig-on", rigBtns[i][2]()));
    };
    for (const [label, act] of rigBtns) {
      const b = el("button", "", label);
      b.addEventListener("click", () => {
        act();
        paintRig();
      });
      rigBtnEls.push(b);
      row.appendChild(b);
    }
    rig.appendChild(row);
    on("screen", paintRig);
    paintRig();
    rig.appendChild(el("span", "", "Integrated desktop: INBOX, LOADOUT.CFG, SOLDER.BAY and REPAIR.LOG are the completed study windows, embedded verbatim (lavender, loadout on FINE dither). NIGHT opens the darknet market via the legacy flow window."));
    os.appendChild(rig);
  }
  function seeded(id) {
    let s = 0;
    for (let i = 0;i < id.length; i++)
      s = s * 31 + id.charCodeAt(i) >>> 0;
    return () => {
      s = Math.imul(s, 1664525) + 1013904223 >>> 0;
      return s;
    };
  }
  function makeWallPoster() {
    const poster = el("div", "kp-wallposter");
    poster.appendChild(el("span", "kp-wallposter-tag", "KP/OS v9.2 // REPAIR BENCH"));
    const emblem = el("div", "kp-wallposter-emblem");
    emblem.appendChild(kpMark(13));
    poster.appendChild(emblem);
    poster.appendChild(el("div", "kp-wallposter-word", "KERNEL PANIC"));
    const rowEl = el("div", "kp-wallposter-row");
    rowEl.appendChild(el("span", "", `ATTEMPT 0${meta.runCount}`));
    rowEl.appendChild(el("span", "", `DAY 0${Math.min(run.day, FINAL_DAY)}`));
    rowEl.appendChild(el("span", "", "BACK ROOM SEALED"));
    poster.appendChild(rowEl);
    return poster;
  }
  function makeWallScope() {
    const SVGNS3 = "http://www.w3.org/2000/svg";
    const wrap = el("div", "kp-wallscope");
    const box = el("div", "kp-wallscope-box");
    const tag = el("div", "kp-wallscope-tag");
    tag.appendChild(el("span", "", "// SIGNAL BUS _"));
    const ok = el("span", "", "OK");
    ok.appendChild(el("i", "kp-wallscope-pip"));
    tag.appendChild(ok);
    box.appendChild(tag);
    const svg = document.createElementNS(SVGNS3, "svg");
    const W = 352;
    const H = 84;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("height", String(H));
    const grid = (x1, y1, x2, y2) => {
      const l = document.createElementNS(SVGNS3, "line");
      l.setAttribute("x1", String(x1));
      l.setAttribute("y1", String(y1));
      l.setAttribute("x2", String(x2));
      l.setAttribute("y2", String(y2));
      l.setAttribute("class", "grid");
      svg.appendChild(l);
    };
    for (let x = 0;x <= W; x += 22)
      grid(x, 0, x, H);
    for (let y = 0;y <= H; y += 21)
      grid(0, y, W, y);
    const next = seeded("kp-desk-scope");
    const jitter = [];
    for (let i = 0;i <= W / 8; i++)
      jitter.push((next() % 100 / 100 - 0.5) * 8);
    const pts = [];
    for (let x = 0;x <= 2 * W; x += 8) {
      const base = 42 + Math.sin(x % W / W * Math.PI * 6) * 18;
      pts.push(`${x},${Math.round(base + jitter[x / 8 % (W / 8)])}`);
    }
    const roll = document.createElementNS(SVGNS3, "g");
    roll.setAttribute("class", "kp-wallscope-roll");
    const poly = document.createElementNS(SVGNS3, "polyline");
    poly.setAttribute("points", pts.join(" "));
    poly.setAttribute("shape-rendering", "crispEdges");
    roll.appendChild(poly);
    svg.appendChild(roll);
    box.appendChild(svg);
    wrap.appendChild(box);
    const clockRow = el("div", "kp-wallclock");
    clockRow.appendChild(el("span", "", "BENCH CLOCK"));
    const clockVal = el("em", "", "");
    clockRow.appendChild(clockVal);
    wrap.appendChild(clockRow);
    let tsec = 22 * 3600 + 41 * 60 + 7;
    const paintClock = () => {
      const h = String(Math.floor(tsec / 3600)).padStart(2, "0");
      const m = String(Math.floor(tsec % 3600 / 60)).padStart(2, "0");
      const s = String(tsec % 60).padStart(2, "0");
      clockVal.textContent = `DAY 0${Math.min(run.day, FINAL_DAY)} ${h}:${m}:${s}`;
    };
    paintClock();
    setInterval(() => {
      tsec = (tsec + 1) % 86400;
      paintClock();
    }, 1000);
    const hex = el("div", "kp-wallhex");
    const hnext = seeded("kp-desk-hex");
    for (let r = 0;r < 6; r++) {
      const groups = [];
      for (let g = 0;g < 3; g++)
        groups.push((hnext() % 65535).toString(16).toUpperCase().padStart(4, "0"));
      hex.appendChild(el("span", "", groups.join(" ")));
    }
    wrap.appendChild(hex);
    return wrap;
  }
  document.addEventListener("pointerdown", () => unlock(), { once: true });
  showBoot();
})();
