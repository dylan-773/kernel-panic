(() => {
  // ../../kernel-panic-site/app/src/game/content/kit.ts
  var PROGRAM_COST = 1;
  var SCAN_RANGE = { 1: 3, 2: 6, 3: 99 };
  var ATTACK_WIDTH = { 1: 1, 2: 2, 3: 3 };
  var DEFEND_WIDTH = { 1: 1, 2: 2, 3: 3 };
  var WARD_RADIUS = { 1: 1, 2: 2, 3: 3 };
  var LOCK_ROUNDS = 2;
  var WARD_ROUNDS = 2;
  var SIPHON_STEAL = { 1: 2, 2: 3, 3: 4 };
  var PAR_RATE = 1.25;
  var PAR_FLAT = 2;
  var PAR_STRAIN_PER = 2;
  var BASE_REACH = 2;
  function cascadeRam(claimed) {
    return Math.min(2, Math.floor(claimed / 4));
  }
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
  var GRIDLOCK_CHIP = 6;
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

  // ../../kernel-panic-site/app/src/game/rng.ts
  function seedRng(seed) {
    return seed >>> 0;
  }
  function nextU32(state) {
    let a = state + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return [((t ^ t >>> 14) >>> 0) / 4294967296, a];
  }

  class Rng {
    state;
    constructor(seed) {
      this.state = seedRng(seed);
    }
    next() {
      const [v, s] = nextU32(this.state);
      this.state = s;
      return v;
    }
    int(n) {
      return Math.floor(this.next() * n);
    }
    pick(arr) {
      return arr[this.int(arr.length)];
    }
    shuffle(arr) {
      for (let i = arr.length - 1;i > 0; i--) {
        const j = this.int(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  }

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
  var ATTACK_ALL = ["redirect", "armHalt", "armSiphon"];
  var DEFEND_ALL = ["purge", "lock", "ward"];
  function isAttackMode(m) {
    return ATTACK_ALL.includes(m);
  }
  function oppKitFor(tier, dominant, seed) {
    const rng = new Rng(seed ^ 20973);
    const atk = new Set;
    const def = new Set;
    if (isAttackMode(dominant))
      atk.add(dominant);
    else
      def.add(dominant);
    if (atk.size === 0)
      atk.add("redirect");
    const addRandom = (set, pool) => {
      const rest = pool.filter((m) => !set.has(m));
      if (rest.length > 0)
        set.add(rest[rng.int(rest.length)]);
    };
    if (tier >= 2)
      addRandom(atk, ATTACK_ALL);
    if (tier >= 3)
      addRandom(def, DEFEND_ALL);
    if (tier >= 4) {
      addRandom(atk, ATTACK_ALL);
      addRandom(def, DEFEND_ALL);
    }
    if (tier >= 5) {
      for (const m of ATTACK_ALL)
        atk.add(m);
      for (const m of DEFEND_ALL)
        def.add(m);
    }
    const oppTier = tier <= 2 ? 1 : tier <= 4 ? 2 : 3;
    return { attackModes: [...atk], defendModes: [...def], oppTier };
  }
  function dayDuelConfig(day, dominant, tier, kitSeed) {
    const d = DAY_CONFIGS[day];
    const kit = oppKitFor(tier, dominant, kitSeed);
    return {
      w: d.grid[0],
      h: d.grid[1],
      oppRam: d.oppRam,
      greed: d.greed,
      abilityFreq: d.abilityFreq,
      minCost: d.minCost,
      minPd: d.minPd,
      headStart: d.headStart,
      oppAttackModes: kit.attackModes,
      oppDefendModes: kit.defendModes,
      oppTier: kit.oppTier,
      dominant,
      parFlat: d.parFlat,
      slag: d.slag
    };
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

  // ../../kernel-panic-site/app/src/game/duel-types.ts
  function otherSide(s) {
    return s === "player" ? "opp" : "player";
  }
  var PIECE_I = 5;
  var PIECE_L = 3;
  var PIECE_T = 7;
  var PIECE_X = 15;
  var ROUND_CAP = 25;

  // ../../kernel-panic-site/app/src/game/types.ts
  var DX = [0, 1, 0, -1];
  var DY = [-1, 0, 1, 0];
  function oppositeDir(d) {
    return (d + 2) % 4;
  }
  function rotateArms(mask, rot) {
    const r = (rot % 4 + 4) % 4;
    return (mask << r | mask >> 4 - r) & 15;
  }
  function cellIndex(w, x, y) {
    return y * w + x;
  }

  // ../../kernel-panic-site/app/src/game/duel-power.ts
  function effectiveDuelArms(c) {
    return rotateArms(c.base, c.rot);
  }
  function entryOf(side) {
    return side === "player" ? "entryP" : "entryO";
  }
  function passable(c, side) {
    if (c.kind === "block")
      return false;
    if (c.kind === "core")
      return true;
    if (c.kind === "entryP")
      return side === "player";
    if (c.kind === "entryO")
      return side === "opp";
    return c.owner === "none" || c.owner === side;
  }
  function runFlood(s, side) {
    const start = side === "player" ? s.entryP : s.entryO;
    const enemy = otherSide(side);
    const reached = new Array(s.cells.length).fill(false);
    const claimed = [];
    const trapsFired = [];
    let reachedCore = false;
    reached[start] = true;
    const queue = [start];
    while (queue.length > 0) {
      const i = queue.shift();
      const c = s.cells[i];
      const arms = effectiveDuelArms(c);
      for (let d = 0;d < 4; d++) {
        if ((arms & 1 << d) === 0)
          continue;
        const nx = c.x + DX[d];
        const ny = c.y + DY[d];
        if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h)
          continue;
        const ni = cellIndex(s.w, nx, ny);
        if (reached[ni])
          continue;
        const nc = s.cells[ni];
        if (!passable(nc, side))
          continue;
        if ((effectiveDuelArms(nc) & 1 << oppositeDir(d)) === 0)
          continue;
        reached[ni] = true;
        if (nc.kind === "core") {
          reachedCore = true;
          continue;
        }
        if (nc.kind === "node" && nc.owner === "none") {
          nc.owner = side;
          nc.claimSeq = ++s.claimCounter;
          nc.claimWave = claimed.length;
          claimed.push(ni);
          if (nc.trap && nc.trap.by === enemy) {
            const trap = nc.trap;
            nc.trap = null;
            trapsFired.push({ idx: ni, kind: trap.kind, drain: trap.drain });
          }
        }
        queue.push(ni);
      }
    }
    return { reached, claimed, trapsFired, reachedCore };
  }
  function computeDuelPower(s) {
    const read = (side) => {
      const start = side === "player" ? s.entryP : s.entryO;
      const out = new Array(s.cells.length).fill(false);
      out[start] = true;
      const queue = [start];
      while (queue.length > 0) {
        const i = queue.shift();
        const c = s.cells[i];
        const arms = effectiveDuelArms(c);
        for (let d = 0;d < 4; d++) {
          if ((arms & 1 << d) === 0)
            continue;
          const nx = c.x + DX[d];
          const ny = c.y + DY[d];
          if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h)
            continue;
          const ni = cellIndex(s.w, nx, ny);
          if (out[ni])
            continue;
          const nc = s.cells[ni];
          if (nc.kind === "block")
            continue;
          if (nc.kind === "entryP" && side !== "player")
            continue;
          if (nc.kind === "entryO" && side !== "opp")
            continue;
          if (nc.kind === "node" && nc.owner !== side)
            continue;
          if ((effectiveDuelArms(nc) & 1 << oppositeDir(d)) === 0)
            continue;
          out[ni] = true;
          if (nc.kind !== "core")
            queue.push(ni);
        }
      }
      return out;
    };
    return { player: read("player"), opp: read("opp") };
  }
  function rotCostFor(c, needed) {
    if (c.fused) {
      return (rotateArms(c.base, c.rot) & needed) === needed ? 0 : Infinity;
    }
    for (let k = 0;k < 4; k++) {
      if ((rotateArms(c.base, (c.rot + k) % 4) & needed) === needed)
        return k;
    }
    return Infinity;
  }
  function routePlan(s, side, avoid, depth = 0) {
    const n = s.cells.length;
    const start = side === "player" ? s.entryP : s.entryO;
    const dist = new Array(n * 4).fill(Infinity);
    const prev = new Array(n * 4).fill(-1);
    const buckets = [[]];
    const push = (state, d) => {
      while (buckets.length <= d)
        buckets.push([]);
      buckets[d].push(state);
    };
    const startCell = s.cells[start];
    const startArms = effectiveDuelArms(startCell);
    for (let d = 0;d < 4; d++) {
      if ((startArms & 1 << d) === 0)
        continue;
      const nx = startCell.x + DX[d];
      const ny = startCell.y + DY[d];
      if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h)
        continue;
      const ni = cellIndex(s.w, nx, ny);
      const nc = s.cells[ni];
      if (!passable(nc, side) || avoid && avoid.has(ni))
        continue;
      if (nc.kind === "core")
        return { cost: 0, path: [], steps: [] };
      if (nc.kind !== "node")
        continue;
      const st = ni * 4 + d;
      if (dist[st] > 0) {
        dist[st] = 0;
        push(st, 0);
      }
    }
    let bestGoal = Infinity;
    let bestGoalState = -1;
    for (let d = 0;d < buckets.length; d++) {
      if (d >= bestGoal)
        break;
      const bucket = buckets[d];
      if (!bucket)
        continue;
      while (bucket.length > 0) {
        const st = bucket.pop();
        if (dist[st] < d)
          continue;
        const i = st >> 2;
        const dIn = st & 3;
        const c = s.cells[i];
        for (let dOut = 0;dOut < 4; dOut++) {
          if (dOut === oppositeDir(dIn))
            continue;
          const nx = c.x + DX[dOut];
          const ny = c.y + DY[dOut];
          if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h)
            continue;
          const ni = cellIndex(s.w, nx, ny);
          const nc = s.cells[ni];
          if (!passable(nc, side) || avoid && avoid.has(ni))
            continue;
          const needed = 1 << oppositeDir(dIn) | 1 << dOut;
          let k = rotCostFor(c, needed);
          if (!isFinite(k))
            continue;
          if (k > 0 && c.owner === side)
            k += 1;
          const nd = d + k;
          if (nc.kind === "core") {
            if (nd < bestGoal) {
              bestGoal = nd;
              bestGoalState = st;
            }
            continue;
          }
          if (nc.kind !== "node")
            continue;
          const nst = ni * 4 + dOut;
          if (nd < dist[nst]) {
            dist[nst] = nd;
            prev[nst] = st;
            push(nst, nd);
          }
        }
      }
    }
    if (bestGoalState === -1)
      return null;
    const chain = [];
    let cur = bestGoalState;
    while (cur !== -1) {
      chain.push(cur);
      cur = prev[cur];
    }
    chain.reverse();
    const path = [];
    let total = 0;
    const seenRot = new Map;
    let conflict = -1;
    for (let ci = 0;ci < chain.length; ci++) {
      const st = chain[ci];
      const i = st >> 2;
      const dIn = st & 3;
      const c = s.cells[i];
      const nextIdx = ci + 1 < chain.length ? chain[ci + 1] >> 2 : s.coreIdx;
      const dOut = dirBetween(c, s.cells[nextIdx]);
      const needed = 1 << oppositeDir(dIn) | 1 << dOut;
      const k = rotCostFor(c, needed);
      if (!isFinite(k))
        return null;
      const targetRot = (c.rot + k) % 4;
      const prior = seenRot.get(i);
      if (prior !== undefined) {
        if (prior !== targetRot)
          conflict = i;
        continue;
      }
      seenRot.set(i, targetRot);
      total += k;
      path.push({ idx: i, targetRot, turns: k });
    }
    if (conflict !== -1) {
      if (depth < 4) {
        const nextAvoid = new Set(avoid ?? []);
        nextAvoid.add(conflict);
        return routePlan(s, side, nextAvoid, depth + 1);
      }
      return { cost: total, path, steps: path.filter((p) => p.turns > 0), approx: true };
    }
    return { cost: total, path, steps: path.filter((p) => p.turns > 0) };
  }
  function dirBetween(a, b) {
    if (b.x - a.x === 1)
      return 1;
    if (b.x - a.x === -1)
      return 3;
    if (b.y - a.y === 1)
      return 2;
    return 0;
  }
  function routeCost(s, side, avoid) {
    const plan = routePlan(s, side, avoid);
    return plan ? plan.cost : Infinity;
  }
  function isFrontier(s, side, idx) {
    const c = s.cells[idx];
    if (c.kind !== "node" || c.owner !== "none")
      return false;
    for (let d = 0;d < 4; d++) {
      const nx = c.x + DX[d];
      const ny = c.y + DY[d];
      if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h)
        continue;
      const nc = s.cells[cellIndex(s.w, nx, ny)];
      if (nc.kind === entryOf(side))
        return true;
      if (nc.kind === "node" && nc.owner === side)
        return true;
    }
    return false;
  }
  function reachOf(s, side) {
    if (side === "player" && s.kit.augments.includes("longArms"))
      return BASE_REACH + 2;
    return BASE_REACH;
  }
  function inReach(s, side, idx, reach) {
    const c0 = s.cells[idx];
    if (c0.kind !== "node" || c0.owner !== "none")
      return false;
    return withinReachWalk(s, side, idx, reach);
  }
  function canPlace(s, side, idx) {
    const c0 = s.cells[idx];
    if (!c0 || c0.kind !== "block")
      return false;
    return withinReachWalk(s, side, idx, reachOf(s, side));
  }
  function withinReachWalk(s, side, idx, reach) {
    const seen = new Set([idx]);
    let frontier = [idx];
    for (let step = 1;step <= reach; step++) {
      const next = [];
      for (const i of frontier) {
        const c = s.cells[i];
        for (let d = 0;d < 4; d++) {
          const nx = c.x + DX[d];
          const ny = c.y + DY[d];
          if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h)
            continue;
          const ni = cellIndex(s.w, nx, ny);
          if (seen.has(ni))
            continue;
          const nc = s.cells[ni];
          if (nc.kind === entryOf(side))
            return true;
          if (nc.kind === "node" && nc.owner === side)
            return true;
          if (nc.kind === "node" && nc.owner === "none" && step < reach) {
            seen.add(ni);
            next.push(ni);
          }
        }
      }
      frontier = next;
      if (frontier.length === 0)
        break;
    }
    return false;
  }
  function canRotate(s, side, idx) {
    const c = s.cells[idx];
    if (!c || c.kind !== "node")
      return false;
    if (c.fused)
      return false;
    const enemy = otherSide(side);
    if (c.lockedThroughRound >= s.round && c.lockedBy === enemy)
      return false;
    if (c.owner === side)
      return true;
    if (c.owner !== "none")
      return false;
    return inReach(s, side, idx, reachOf(s, side));
  }

  // ../../kernel-panic-site/app/src/game/patch-cells.ts
  var PLACE_COST = 2;
  function armCount(mask) {
    let n = 0;
    for (let d = 0;d < 4; d++)
      if (mask & 1 << d)
        n++;
    return n;
  }

  // ../../kernel-panic-site/app/src/game/duel-actions.ts
  function emit(s, kind, n) {
    s.fx.push({ id: s.fxNext++, kind, n });
  }
  function say(s, text) {
    s.notice = { id: s.fxNext++, text };
  }
  function roll(s) {
    const [v, next] = nextU32(s.rngState);
    s.rngState = next;
    return v;
  }
  function kitHas(s, aug) {
    return s.kit.augments.includes(aug);
  }
  function tierOf(s, side, prog) {
    if (side === "opp")
      return s.cfg.oppTier;
    if (prog === "scan")
      return s.kit.scanTier;
    if (prog === "attack")
      return s.kit.attackTier;
    return s.kit.defendTier;
  }
  function tutorialLessonDone(s) {
    return s.tutFlags.scanned && s.tutFlags.purged && s.tutFlags.attacked;
  }
  function programUnlocked(s, prog) {
    if (!s.cfg.tutorial)
      return true;
    if (prog === "scan") {
      return s.tutFlags.scanned || s.cells.some((c) => c.trap && c.trap.by === "opp");
    }
    if (prog === "defend")
      return s.tutFlags.scanned;
    return s.tutFlags.purged;
  }
  function attackCost(s, side) {
    if (side === "player" && s.econ.player.attacksCast === 0 && kitHas(s, "cheapShot"))
      return 0;
    return PROGRAM_COST;
  }
  function programCost(s, side, prog) {
    return prog === "attack" ? attackCost(s, side) : PROGRAM_COST;
  }
  function finishDuel(s, winner, kind, reason) {
    s.phase = winner === "player" ? "won" : "lost";
    s.winKind = kind;
    if (reason)
      s.endReason = reason;
    s.notice = null;
    if (winner === "player") {
      const over = Math.max(0, s.econ.player.rotations - s.par);
      let chip = PAR_STRAIN_PER * over;
      chip += 4 * Math.max(0, s.econ.player.trapsFired - (kitHas(s, "firstFault") ? 1 : 0));
      if (kind === "cap")
        chip += 10;
      if (kind === "gridlock")
        chip += GRIDLOCK_CHIP;
      s.strainChip = Math.min(40, chip);
    } else {
      s.strainChip = 0;
    }
    emit(s, winner === "player" ? "win" : "lose", s.strainChip);
  }
  function settleFloods(s, acting) {
    let actingTrapped = false;
    for (const side of [acting, otherSide(acting)]) {
      if (s.phase !== "playing")
        break;
      const f = runFlood(s, side);
      const mine = side === "player";
      if (f.claimed.length >= 3) {
        emit(s, mine ? "cascade" : "cascadeOpp", f.claimed.length);
      } else if (f.claimed.length > 0) {
        emit(s, mine ? "claim" : "claimOpp", f.claimed.length);
      }
      let bonus = cascadeRam(f.claimed.length);
      if (bonus > 0) {
        s.econ[side].drainNext -= bonus;
        emit(s, side === "player" ? "cascadeRam" : "cascadeRamOpp", bonus);
      }
      for (const trap of f.trapsFired) {
        const econ = s.econ[side];
        const enemyEcon = s.econ[otherSide(side)];
        econ.trapsFired++;
        if (trap.kind === "halt") {
          econ.drainNext += trap.drain;
          if (side === acting) {
            actingTrapped = true;
          } else {
            econ.loseNextTurn = true;
          }
          emit(s, "trapFire", 1);
          say(s, side === "player" ? "HALT TRAP. Your signal hit an armed node. The cascade lands, then your turn is forfeit." : "Your halt trap fired. The intrusion stalls a full cycle.");
        } else {
          econ.drainNext += trap.drain;
          enemyEcon.drainNext -= trap.drain;
          emit(s, "siphonFire", trap.drain);
          say(s, side === "player" ? `SIPHON TRAP. It bleeds ${trap.drain} RAM out of your next turn.` : `Your siphon fired. ${trap.drain} RAM drains out of its next turn, into yours.`);
        }
        if (otherSide(side) === "player" && kitHas(s, "echoTap")) {
          s.econ.player.drainNext -= 2;
        }
      }
      if (f.reachedCore) {
        if (s.cfg.tutorial && side === "player") {
          finishDuel(s, "opp", "core", "Your flood touched the core, and every port on the machine slammed shut at once.");
        } else {
          finishDuel(s, side, "core", side === "player" ? "Your flood touched the core first. The intrusion collapses." : "Its flood reached the core before yours did.");
        }
      }
    }
    s.power = computeDuelPower(s);
    return actingTrapped;
  }
  function applyRotate(s, side, idx) {
    const econ = s.econ[side];
    if (econ.ram < 1)
      return false;
    const c = s.cells[idx];
    c.rot = (c.rot + 1) % 4;
    c.spin += 1;
    econ.ram -= 1;
    econ.rotations += 1;
    emit(s, "rotate");
    const trapped = settleFloods(s, side);
    if (trapped && s.phase === "playing") {
      if (side === "player")
        forceEndPlayerTurn(s);
      else
        endOppTurn(s);
    }
    return true;
  }
  function applyPlace(s, side, idx, pouchIdx) {
    const econ = s.econ[side];
    if (econ.ram < PLACE_COST || econ.placedThisTurn)
      return false;
    const mask = s.patchPouch[pouchIdx];
    if (mask === undefined)
      return false;
    const c = s.cells[idx];
    c.kind = "node";
    c.base = mask;
    c.rot = 0;
    c.fused = true;
    econ.ram -= PLACE_COST;
    if (side === "player" && kitHas(s, "patchRefund"))
      econ.ram += PLACE_COST;
    econ.placedThisTurn = true;
    s.patchPouch = s.patchPouch.filter((_, i) => i !== pouchIdx);
    emit(s, "place");
    say(s, "PATCH PIECE. The slag melts into a live junction, arms exactly as held.");
    const trapped = settleFloods(s, side);
    if (trapped && s.phase === "playing") {
      if (side === "player")
        forceEndPlayerTurn(s);
      else
        endOppTurn(s);
    }
    return true;
  }
  function armTargetLegal(s, caster, idx) {
    const c = s.cells[idx];
    if (!c || c.kind !== "node" || c.owner !== "none")
      return false;
    if (c.trap)
      return false;
    if (c.wardThroughRound >= s.round && c.wardBy === otherSide(caster))
      return false;
    return true;
  }
  function redirectTargetLegal(s, caster, idx) {
    const c = s.cells[idx];
    if (!c || c.kind !== "node")
      return false;
    if (c.fused)
      return false;
    if (c.owner === caster)
      return false;
    if (c.lockedThroughRound >= s.round && c.lockedBy === otherSide(caster))
      return false;
    if (c.wardThroughRound >= s.round && c.wardBy === otherSide(caster))
      return false;
    return true;
  }
  function purgeTargetLegal(s, caster, idx) {
    const c = s.cells[idx];
    if (!c || c.kind !== "node" || !c.trap)
      return false;
    if (c.trap.by !== otherSide(caster))
      return false;
    if (caster === "player" && !c.trap.revealed)
      return false;
    return true;
  }
  function lockTargetLegal(s, caster, idx) {
    const c = s.cells[idx];
    if (!c || c.kind !== "node")
      return false;
    if (c.owner === otherSide(caster))
      return false;
    if (c.lockedThroughRound >= s.round)
      return false;
    return true;
  }
  function wardTargetLegal(s, caster, idx) {
    const c = s.cells[idx];
    if (!c || c.kind !== "node")
      return false;
    if (c.owner === otherSide(caster))
      return false;
    return true;
  }
  function attackTargetLegal(s, caster, mode, idx) {
    return mode === "redirect" ? redirectTargetLegal(s, caster, idx) : armTargetLegal(s, caster, idx);
  }
  function defendTargetLegal(s, caster, mode, idx) {
    if (mode === "purge")
      return purgeTargetLegal(s, caster, idx);
    if (mode === "lock")
      return lockTargetLegal(s, caster, idx);
    return wardTargetLegal(s, caster, idx);
  }
  function entryKindOf(side) {
    return side === "player" ? "entryP" : "entryO";
  }
  function applyCast(s, side, prog, mode, targets) {
    const econ = s.econ[side];
    econ.ram -= programCost(s, side, prog);
    econ.used[prog] = true;
    if (prog === "attack")
      econ.attacksCast++;
    if (prog === "scan")
      econ.scansCast++;
    if (prog === "defend")
      econ.defendsCast++;
    if (s.cfg.tutorial && side === "player") {
      if (prog === "scan")
        s.tutFlags.scanned = true;
      if (prog === "defend")
        s.tutFlags.purged = true;
      if (prog === "attack")
        s.tutFlags.attacked = true;
      if (s.tutorialLessonRound === 0 && tutorialLessonDone(s)) {
        s.tutorialLessonRound = s.round;
      }
    }
    const enemy = otherSide(side);
    if (prog === "scan") {
      const range = SCAN_RANGE[tierOf(s, side, "scan")];
      const owned = s.cells.filter((c) => c.kind === "node" && c.owner === side || c.kind === entryKindOf(side));
      let found = 0;
      for (const c of s.cells) {
        if (!c.trap || c.trap.by !== enemy || c.trap.revealed)
          continue;
        if (owned.some((o) => Math.abs(o.x - c.x) + Math.abs(o.y - c.y) <= range)) {
          c.trap.revealed = true;
          found++;
        }
      }
      if (side === "player" && kitHas(s, "tapLine")) {
        const plan = routePlan(s, "opp");
        if (plan) {
          s.routeTrace = { round: s.round + 1, cells: plan.path.map((p) => p.idx) };
          emit(s, "trace");
        }
      }
      emit(s, "scan");
      if (side === "player") {
        say(s, found > 0 ? `SCAN: ${found} armed node${found === 1 ? "" : "s"} exposed, permanently.` : "SCAN: nothing armed in range.");
      }
      return;
    }
    if (prog === "attack") {
      if (mode === "redirect") {
        for (const idx of targets) {
          const c = s.cells[idx];
          c.rot = (c.rot + 1) % 4;
          c.spin += 1;
          if (side === "player" && kitHas(s, "jamAnchor")) {
            c.lockedThroughRound = Math.max(c.lockedThroughRound, s.round + 1);
            c.lockedBy = "player";
          }
        }
        if (side === "player")
          s.lastPlayerHitRound = s.round;
        emit(s, "redirect", targets.length);
        say(s, side === "player" ? "REDIRECT. Their line twists off true." : "It twisted one of your junctions off true. Power is down past the break.");
        settleFloods(s, side);
      } else {
        const kind = mode === "armSiphon" ? "siphon" : "halt";
        let drain = 0;
        if (kind === "siphon") {
          drain = SIPHON_STEAL[tierOf(s, side, "attack")] + (side === "player" ? 1 : 0) + (side === "player" && kitHas(s, "siphonPlus") ? 1 : 0);
        } else if (side === "player" && kitHas(s, "tripwire")) {
          drain = 3;
        }
        for (const idx of targets) {
          s.cells[idx].trap = { by: side, revealed: side === "player", kind, drain };
        }
        if (side === "player")
          s.lastPlayerHitRound = s.round;
        emit(s, "trapSet");
        say(s, side === "player" ? kind === "siphon" ? "Siphon armed. Let it walk into your meter." : "Halt trap armed. Let it walk into it." : "It planted a trap on an open junction nearby. Tread carefully.");
      }
      return;
    }
    if (mode === "purge") {
      let n = 0;
      for (const idx of targets) {
        if (s.cells[idx].trap) {
          s.cells[idx].trap = null;
          n++;
        }
      }
      if (n > 0 && side === "player" && kitHas(s, "sweepCredit")) {
        econ.ram += Math.min(n, 3) * PROGRAM_COST;
      }
      emit(s, "purge", n);
      say(s, side === "player" ? `PURGE. ${n} trap${n === 1 ? "" : "s"} defused.` : "It swept your traps off its lane.");
    } else if (mode === "lock") {
      const through = side === "player" ? s.round + LOCK_ROUNDS - 1 : s.round + LOCK_ROUNDS;
      for (const idx of targets) {
        const c = s.cells[idx];
        c.lockedThroughRound = Math.max(c.lockedThroughRound, through);
        c.lockedBy = side;
      }
      if (side === "player" && targets.some((i) => s.cells[i].owner === "none")) {
        s.lastPlayerHitRound = s.round;
      }
      emit(s, "lock");
      say(s, side === "player" ? "LOCK. That junction is frozen solid." : "It clamped a junction solid. You cannot turn that one for now.");
    } else if (mode === "ward") {
      const radius = WARD_RADIUS[tierOf(s, side, "defend")];
      const through = s.round + WARD_ROUNDS;
      const center = s.cells[targets[0]];
      for (const c of s.cells) {
        if (c.kind !== "node" || c.owner === enemy)
          continue;
        if (Math.abs(c.x - center.x) + Math.abs(c.y - center.y) > radius)
          continue;
        c.wardThroughRound = Math.max(c.wardThroughRound, through);
        c.wardBy = side;
      }
      emit(s, "ward");
      say(s, side === "player" ? "WARD up. Nothing gets planted in that patch." : "It warded a whole approach. Your traps will not land there.");
    }
  }
  function beginTurnEconomy(s, side) {
    const econ = s.econ[side];
    econ.used = { scan: false, attack: false, defend: false };
    econ.placedThisTurn = false;
    if (econ.loseNextTurn) {
      econ.loseNextTurn = false;
      econ.ram = 0;
      econ.carry = 0;
      emit(s, "turnLost");
      say(s, side === "player" ? "Your turn burns away in the trap's wake." : "The intrusion stalls a full cycle.");
      return false;
    }
    const ram = econ.ramPerTurn + econ.carry - econ.drainNext;
    econ.drainNext = 0;
    econ.ram = Math.max(0, ram);
    econ.carry = 0;
    return true;
  }
  function startOppTurn(s) {
    s.turn = "opp";
    s.oppTurn = { started: false, pendingCast: null, queue: [], replans: 3, lastReplanCost: Infinity, ramAtStart: 0, aim: null };
    const acts = beginTurnEconomy(s, "opp");
    s.oppTurn.ramAtStart = s.econ.opp.ram;
    if (!acts) {
      endOppTurn(s);
    }
  }
  function endOppTurn(s) {
    if (s.phase !== "playing")
      return;
    const econ = s.econ.opp;
    econ.carry = Math.min(econ.carryCap, Math.max(0, econ.ram));
    s.round++;
    if (s.routeTrace && s.routeTrace.round < s.round)
      s.routeTrace = null;
    if (s.cfg.tutorial) {
      const lessonOver = tutorialLessonDone(s) && s.round > s.tutorialLessonRound + 1;
      if (lessonOver || s.round >= 7) {
        finishDuel(s, "opp", "core", "The machine stopped pretending and sealed itself. The door was never really open.");
        return;
      }
    }
    if (s.round > ROUND_CAP) {
      const pd = routeCost(s, "player");
      const od = routeCost(s, "opp");
      const playerCloser = pd <= od;
      finishDuel(s, playerCloser ? "player" : "opp", "cap", playerCloser ? "The link timed out with your route closer to the core than its. It counts, barely." : "The link timed out with its route closer to the core than yours.");
      return;
    }
    if (!playerHasRoute(s)) {
      s.severedStreak++;
      if (s.severedStreak >= 2) {
        if (isFinite(routeCost(s, "opp"))) {
          finishDuel(s, "opp", "severed", "SEVERED. Its territory walls your port off from the core. No rotation and no patch piece opens a route, so the link is already lost.");
        } else {
          finishDuel(s, "player", "gridlock", "Total gridlock. Neither signal can reach the core. The link collapses in your favor, and the dead link bites on the way out.");
        }
        return;
      }
      say(s, "ROUTE LOST. No path from your port to the core. Open one this turn or the link is called.");
    } else {
      s.severedStreak = 0;
    }
    s.turn = "player";
    const acts = beginTurnEconomy(s, "player");
    if (!acts) {
      startOppTurn(s);
    }
  }
  function endPlayerTurn(s) {
    if (s.phase !== "playing")
      return;
    const econ = s.econ.player;
    econ.carry = Math.min(econ.carryCap, Math.max(0, econ.ram));
    emit(s, "endTurn");
    startOppTurn(s);
  }
  var RESCUE_DEPTH = 2;
  function rescueMasks(pouch) {
    if (pouch.some((m) => armCount(m) >= 4))
      return [PIECE_X];
    return [...new Set(pouch)];
  }
  function withoutOne(pouch, mask) {
    const idx = pouch.indexOf(mask);
    return pouch.filter((_, i) => i !== idx);
  }
  function playerHasRoute(s) {
    if (isFinite(routeCost(s, "player")))
      return true;
    return rescueWithPieces(s, s.patchPouch, Math.min(s.patchPouch.length, RESCUE_DEPTH));
  }
  function rescueWithPieces(s, pouch, cellsLeft) {
    if (cellsLeft <= 0 || pouch.length === 0)
      return false;
    const masks = rescueMasks(pouch);
    for (let i = 0;i < s.cells.length; i++) {
      if (!canPlace(s, "player", i))
        continue;
      const c = s.cells[i];
      const prev = { kind: c.kind, base: c.base, rot: c.rot, fused: c.fused };
      for (const mask of masks) {
        c.kind = "node";
        c.base = mask;
        c.rot = 0;
        c.fused = true;
        const ok = isFinite(routeCost(s, "player")) || rescueWithPieces(s, withoutOne(pouch, mask), cellsLeft - 1);
        c.kind = prev.kind;
        c.base = prev.base;
        c.rot = prev.rot;
        c.fused = prev.fused;
        if (ok)
          return true;
      }
    }
    return false;
  }
  function forceEndPlayerTurn(s) {
    if (s.phase !== "playing")
      return;
    s.econ.player.ram = 0;
    s.econ.player.carry = 0;
    startOppTurn(s);
  }

  // ../../kernel-panic-site/app/src/game/opponent.ts
  function coreDist(s, idx) {
    const c = s.cells[idx];
    const core = s.cells[s.coreIdx];
    return Math.abs(c.x - core.x) + Math.abs(c.y - core.y);
  }
  var ATTACK_MODES = ["redirect", "armHalt", "armSiphon"];
  function progOf(mode) {
    return ATTACK_MODES.includes(mode) ? "attack" : "defend";
  }
  function decideProgram(s) {
    const econ = s.econ.opp;
    if (econ.ram < 1)
      return;
    const atk = s.cfg.oppAttackModes;
    const def = s.cfg.oppDefendModes;
    if (s.cfg.tutorial) {
      const hasTrap = s.cells.some((c) => c.trap && c.trap.by === "opp");
      if (!tutorialLessonDone(s) && !hasTrap && !econ.used.attack && atk.length > 0) {
        s.oppTurn.pendingCast = { prog: "attack", mode: atk[0] };
      }
      return;
    }
    const playerCost = routeCost(s, "player");
    const ownCost = routeCost(s, "opp");
    if (isFinite(playerCost) && playerCost <= 4 && playerCost <= ownCost && !econ.used.attack) {
      const armMode = atk.find((m) => m !== "redirect");
      if (armMode && roll(s) < 0.55) {
        s.oppTurn.pendingCast = { prog: "attack", mode: armMode };
        return;
      }
      if (atk.includes("redirect")) {
        s.oppTurn.pendingCast = { prog: "attack", mode: "redirect" };
        return;
      }
      if (def.includes("lock") && !econ.used.defend) {
        s.oppTurn.pendingCast = { prog: "defend", mode: "lock" };
        return;
      }
    }
    if (def.includes("purge") && !econ.used.defend) {
      const plan = routePlan(s, "opp");
      const trapped = plan?.path.some((p) => {
        const c = s.cells[p.idx];
        return c.trap && c.trap.by === "player";
      });
      if (trapped && roll(s) < 0.7) {
        s.oppTurn.pendingCast = { prog: "defend", mode: "purge" };
        return;
      }
    }
    if (s.lastPlayerHitRound >= s.round - 1 && s.lastPlayerHitRound > 0 && roll(s) < 0.5) {
      const guard = def.find((m) => m === "lock") ?? def.find((m) => m === "ward");
      if (guard && !econ.used.defend) {
        s.oppTurn.pendingCast = { prog: "defend", mode: guard };
        return;
      }
    }
    if (!s.oppDominantUsed && s.round >= 2) {
      const dom = s.cfg.dominant;
      const prog = progOf(dom);
      const available = prog === "attack" ? atk.includes(dom) : def.includes(dom);
      if (available && !econ.used[prog]) {
        s.oppTurn.pendingCast = { prog, mode: dom };
        return;
      }
    }
    if (roll(s) < s.cfg.abilityFreq) {
      const pool = [];
      for (const m of atk)
        if (!econ.used.attack)
          pool.push({ prog: "attack", mode: m });
      for (const m of def)
        if (!econ.used.defend)
          pool.push({ prog: "defend", mode: m });
      for (const entry of [...pool])
        if (entry.mode === s.cfg.dominant)
          pool.push(entry);
      if (pool.length > 0) {
        s.oppTurn.pendingCast = pool[Math.floor(roll(s) * pool.length)];
      }
    }
  }
  function computeIntent(s) {
    if (s.oppTurn.pendingCast) {
      s.oppNextIntent = `Charging ${s.oppTurn.pendingCast.mode.toUpperCase()}`;
      return;
    }
    const cost = routeCost(s, "opp");
    if (!isFinite(cost))
      s.oppNextIntent = "Probing for a route";
    else if (cost <= 3)
      s.oppNextIntent = "FINAL APPROACH to the core";
    else
      s.oppNextIntent = "Aligning junctions toward the core";
  }
  function prepareCastFor(s, side, prog, mode) {
    const enemy = otherSide(side);
    const width = prog === "attack" ? ATTACK_WIDTH[tierOf(s, side, "attack")] : DEFEND_WIDTH[tierOf(s, side, "defend")];
    const targets = [];
    switch (mode) {
      case "armHalt":
      case "armSiphon": {
        const plan = routePlan(s, enemy);
        let pool = (plan ? plan.path.map((p) => p.idx) : []).filter((i) => armTargetLegal(s, side, i));
        if (!s.cfg.tutorial)
          pool = pool.reverse();
        if (pool.length === 0) {
          pool = s.cells.map((_, i) => i).filter((i) => armTargetLegal(s, side, i) && isFrontier(s, enemy, i));
        }
        targets.push(...pool.slice(0, width));
        if (targets.length === 0)
          return null;
        break;
      }
      case "redirect": {
        const candidates = s.cells.map((_, i) => i).filter((i) => redirectTargetLegal(s, side, i) && s.cells[i].owner === enemy).sort((a, b) => coreDist(s, a) - coreDist(s, b)).slice(0, 6);
        let best = -1;
        let bestGain = -1;
        const before = routeCost(s, enemy);
        for (const i of candidates) {
          const c = s.cells[i];
          c.rot = (c.rot + 1) % 4;
          const after = routeCost(s, enemy);
          c.rot = (c.rot + 3) % 4;
          const gain = (isFinite(after) ? after : 99) - (isFinite(before) ? before : 99);
          if (gain > bestGain) {
            bestGain = gain;
            best = i;
          }
        }
        if (best === -1)
          return null;
        targets.push(best);
        targets.push(...candidates.filter((i) => i !== best).slice(0, width - 1));
        break;
      }
      case "purge": {
        const plan = routePlan(s, side);
        const onRoute = (plan ? plan.path.map((p) => p.idx) : []).filter((i) => purgeTargetLegal(s, side, i));
        const anywhere = s.cells.map((_, i) => i).filter((i) => purgeTargetLegal(s, side, i));
        const pool = [...new Set([...onRoute, ...anywhere])];
        targets.push(...pool.slice(0, width));
        if (targets.length === 0)
          return null;
        break;
      }
      case "lock": {
        const enemyCost = routeCost(s, enemy);
        if (isFinite(enemyCost) && enemyCost <= 4) {
          const plan = routePlan(s, enemy);
          const chokes = (plan?.path ?? []).filter((p) => s.cells[p.idx].owner === "none" && lockTargetLegal(s, side, p.idx)).map((p) => p.idx);
          targets.push(...chokes.slice(0, width));
        }
        if (targets.length < width) {
          const own = s.cells.map((_, i) => i).filter((i) => s.cells[i].owner === side && lockTargetLegal(s, side, i) && !targets.includes(i)).sort((a, b) => coreDist(s, a) - coreDist(s, b));
          targets.push(...own.slice(0, width - targets.length));
        }
        if (targets.length === 0)
          return null;
        break;
      }
      case "ward": {
        const plan = routePlan(s, side);
        const ahead = plan?.path.find((p) => s.cells[p.idx].owner === "none" && wardTargetLegal(s, side, p.idx));
        if (!ahead)
          return null;
        targets.push(ahead.idx);
        break;
      }
    }
    return { kind: "cast", prog, mode, targets };
  }
  function prepareCast(s) {
    const pc = s.oppTurn.pendingCast;
    if (!pc)
      return null;
    s.oppTurn.pendingCast = null;
    const econ = s.econ.opp;
    if (econ.used[pc.prog] || econ.ram < 1)
      return null;
    return prepareCastFor(s, "opp", pc.prog, pc.mode);
  }
  function executeCast(s, aim) {
    const econ = s.econ.opp;
    if (econ.used[aim.prog] || econ.ram < 1)
      return;
    applyCast(s, "opp", aim.prog, aim.mode, aim.targets);
    if (aim.mode === s.cfg.dominant)
      s.oppDominantUsed = true;
  }
  function buildQueue(s, side) {
    let plan = routePlan(s, side);
    if (plan && plan.steps.some((p) => s.cells[p.idx].lockedThroughRound >= s.round && s.cells[p.idx].lockedBy !== side)) {
      const avoid = new Set(plan.steps.filter((p) => s.cells[p.idx].lockedThroughRound >= s.round && s.cells[p.idx].lockedBy !== side).map((p) => p.idx));
      plan = routePlan(s, side, avoid) ?? plan;
    }
    if (!plan)
      return [];
    return plan.steps.map((p) => ({ idx: p.idx, targetRot: p.targetRot }));
  }
  function pickFromQueue(s, side, queue, greed, replan) {
    const econ = s.econ[side];
    if (econ.ram < 1)
      return -1;
    while (queue.length > 0 && s.cells[queue[0].idx].rot === queue[0].targetRot)
      queue.shift();
    let head = queue[0];
    if (!head) {
      replan();
      while (queue.length > 0 && s.cells[queue[0].idx].rot === queue[0].targetRot)
        queue.shift();
      head = queue[0];
      if (!head)
        return -1;
    }
    if (!canRotate(s, side, head.idx)) {
      queue.length = 0;
      replan();
      while (queue.length > 0 && s.cells[queue[0].idx].rot === queue[0].targetRot)
        queue.shift();
      head = queue[0];
      if (!head || !canRotate(s, side, head.idx))
        return -1;
    }
    if (roll(s) >= greed) {
      const pool = s.cells.map((_, i) => i).filter((i) => i !== head.idx && canRotate(s, side, i) && s.cells[i].owner === "none");
      if (pool.length > 0) {
        return pool[Math.floor(roll(s) * pool.length)];
      }
    }
    return head.idx;
  }
  function makeReplanner(s, side, queue, mem) {
    return () => {
      if (mem.n <= 0)
        return;
      const cost = routeCost(s, side);
      if (!(cost < mem.lastCost)) {
        return;
      }
      mem.lastCost = cost;
      mem.n--;
      queue.length = 0;
      queue.push(...buildQueue(s, side));
    };
  }
  function oppStep(s) {
    if (s.phase !== "playing" || s.turn !== "opp")
      return;
    const ot = s.oppTurn;
    if (s.cfg.tutorial && !isFinite(routeCost(s, "opp"))) {
      finishDuel(s, "opp", "core", "The machine stopped pretending and sealed itself. The door was never really open.");
      return;
    }
    if (!ot.started) {
      ot.started = true;
      decideProgram(s);
      computeIntent(s);
      ot.queue = buildQueue(s, "opp");
      return;
    }
    if (ot.aim) {
      const aim = ot.aim;
      ot.aim = null;
      if (aim.kind === "cast") {
        executeCast(s, aim);
        ot.queue = buildQueue(s, "opp");
        return;
      }
      if (canRotate(s, "opp", aim.idx) && s.econ.opp.ram >= 1) {
        applyRotate(s, "opp", aim.idx);
        return;
      }
    }
    if (ot.pendingCast) {
      const prepared = prepareCast(s);
      if (prepared) {
        ot.aim = prepared;
        emit(s, `oppCast:${prepared.mode}`);
        return;
      }
    }
    if (s.cfg.tutorial && (!tutorialLessonDone(s) || s.round <= s.tutorialLessonRound) && ot.ramAtStart - s.econ.opp.ram >= 4) {
      endOppTurn(s);
      return;
    }
    const mem = { n: ot.replans, lastCost: ot.lastReplanCost };
    const replan = makeReplanner(s, "opp", ot.queue, mem);
    const idx = pickFromQueue(s, "opp", ot.queue, s.cfg.greed, replan);
    ot.replans = mem.n;
    ot.lastReplanCost = mem.lastCost;
    if (idx !== -1) {
      ot.aim = { kind: "rotate", idx };
      emit(s, "oppAim", idx);
      return;
    }
    endOppTurn(s);
  }

  // ../../kernel-panic-site/app/src/game/duel-reducer.ts
  function cloneState(s) {
    return {
      ...s,
      cells: s.cells.map((c) => ({ ...c, trap: c.trap ? { ...c.trap } : null })),
      econ: {
        player: { ...s.econ.player, used: { ...s.econ.player.used } },
        opp: { ...s.econ.opp, used: { ...s.econ.opp.used } }
      },
      kit: { ...s.kit, augments: [...s.kit.augments], patchPouch: [...s.kit.patchPouch] },
      patchPouch: [...s.patchPouch],
      tutFlags: { ...s.tutFlags },
      oppTurn: { ...s.oppTurn },
      fx: [...s.fx]
    };
  }
  function playerCanAct(s) {
    return s.phase === "playing" && s.turn === "player";
  }
  function deny(s, msg) {
    emit(s, "deny");
    if (msg)
      say(s, msg);
    return s;
  }
  function duelReducer(state, action) {
    switch (action.type) {
      case "fxDrain": {
        if (state.fx.length === 0)
          return state;
        return { ...state, fx: state.fx.filter((e) => e.id > action.upTo) };
      }
      case "rotate": {
        if (!playerCanAct(state))
          return state;
        const s = cloneState(state);
        if (s.econ.player.ram < 1)
          return deny(s, "No RAM left. End the turn.");
        if (!canRotate(s, "player", action.idx)) {
          const c = s.cells[action.idx];
          if (c && c.kind === "node" && c.fused) {
            return deny(s, "That junction is welded. A placed piece never turns.");
          }
          if (c && c.lockedThroughRound >= s.round && c.lockedBy === "opp") {
            return deny(s, "That junction is clamped frozen.");
          }
          if (c && c.kind === "node" && c.owner === "opp") {
            return deny(s, "Enemy territory. ATTACK: REDIRECT can reach it.");
          }
          return deny(s, "Out of reach. Work outward from your territory.");
        }
        applyRotate(s, "player", action.idx);
        return s;
      }
      case "place": {
        if (!playerCanAct(state))
          return state;
        const s = cloneState(state);
        if (s.patchPouch.length < 1)
          return deny(s, "The pouch is empty.");
        if (s.econ.player.placedThisTurn)
          return deny(s, "One patch piece per turn.");
        if (s.econ.player.ram < PLACE_COST)
          return deny(s, "Placing a piece takes 2 RAM.");
        if (s.patchPouch[action.pouchIdx] !== action.mask)
          return deny(s);
        if (!canPlace(s, "player", action.idx)) {
          return deny(s, "Patch pieces only fill slag within reach of your territory.");
        }
        applyPlace(s, "player", action.idx, action.pouchIdx);
        return s;
      }
      case "cast": {
        if (!playerCanAct(state))
          return state;
        const s = cloneState(state);
        const econ = s.econ.player;
        const prog = action.prog;
        if (!programUnlocked(s, prog))
          return deny(s, "That program is still offline. Follow the bench notes.");
        if (econ.used[prog])
          return deny(s, "Each program runs once per turn.");
        if (econ.ram < programCost(s, "player", prog))
          return deny(s, "Not enough RAM.");
        const t = action.targets;
        if (prog === "scan") {
          applyCast(s, "player", "scan", null, []);
          return s;
        }
        if (prog === "attack") {
          const want2 = ATTACK_WIDTH[tierOf(s, "player", "attack")];
          if (t.length < 1 || t.length > want2)
            return deny(s);
          if (!t.every((i) => attackTargetLegal(s, "player", s.kit.attackMode, i)))
            return deny(s);
          applyCast(s, "player", "attack", s.kit.attackMode, t);
          return s;
        }
        const want = s.kit.defendMode === "ward" ? 1 : DEFEND_WIDTH[tierOf(s, "player", "defend")];
        if (t.length < 1 || t.length > want)
          return deny(s);
        if (!t.every((i) => defendTargetLegal(s, "player", s.kit.defendMode, i)))
          return deny(s);
        applyCast(s, "player", "defend", s.kit.defendMode, t);
        return s;
      }
      case "endTurn": {
        if (!playerCanAct(state))
          return state;
        const s = cloneState(state);
        endPlayerTurn(s);
        return s;
      }
      case "oppStep": {
        if (state.phase !== "playing" || state.turn !== "opp")
          return state;
        const s = cloneState(state);
        oppStep(s);
        return s;
      }
    }
  }

  // ../../kernel-panic-site/app/src/game/duel-setup.ts
  var MAX_OPENING_CLAIM = 3;
  function drawMask(rng) {
    const v = rng.next();
    if (v < 0.4)
      return PIECE_I;
    if (v < 0.85)
      return PIECE_L;
    if (v < 0.97)
      return PIECE_T;
    return PIECE_X;
  }
  function initialEcon(ramPerTurn, carryCap) {
    return {
      ramPerTurn,
      ram: 0,
      carry: 0,
      carryCap,
      drainNext: 0,
      loseNextTurn: false,
      used: { scan: false, attack: false, defend: false },
      attacksCast: 0,
      scansCast: 0,
      defendsCast: 0,
      trapsFired: 0,
      rotations: 0,
      placedThisTurn: false
    };
  }
  function buildCells(cfg, rng) {
    const { w, h } = cfg;
    const midY = Math.floor(h / 2);
    const entryP = cellIndex(w, 0, midY);
    const entryO = cellIndex(w, w - 1, midY);
    const coreIdx = cellIndex(w, Math.floor(w / 2), midY);
    const near = (i, j) => {
      const ax = i % w;
      const ay = Math.floor(i / w);
      const bx = j % w;
      const by = Math.floor(j / w);
      return Math.abs(ax - bx) + Math.abs(ay - by);
    };
    const cells = [];
    for (let y = 0;y < h; y++) {
      for (let x = 0;x < w; x++) {
        const i = cellIndex(w, x, y);
        const protectedCell = i === entryP || i === entryO || i === coreIdx || near(i, entryP) < 2 || near(i, entryO) < 2 || near(i, coreIdx) < 2;
        const slag = !protectedCell && rng.next() < (cfg.slag ?? (cfg.tutorial ? 0.12 : 0.18));
        cells.push({
          x,
          y,
          kind: slag ? "block" : "node",
          base: slag ? 0 : drawMask(rng),
          rot: slag ? 0 : rng.int(4),
          fused: false,
          spin: 0,
          owner: "none",
          claimSeq: 0,
          claimWave: 0,
          trap: null,
          lockedThroughRound: 0,
          lockedBy: null,
          wardThroughRound: 0,
          wardBy: null
        });
      }
    }
    cells[entryP].kind = "entryP";
    cells[entryP].base = 7;
    cells[entryP].rot = 0;
    cells[entryP].owner = "player";
    cells[entryO].kind = "entryO";
    cells[entryO].base = 13;
    cells[entryO].rot = 0;
    cells[entryO].owner = "opp";
    cells[coreIdx].kind = "core";
    cells[coreIdx].base = 15;
    cells[coreIdx].rot = 0;
    cells[coreIdx].owner = "none";
    for (const c of cells)
      c.spin = c.rot;
    return { cells, entryP, entryO, coreIdx };
  }
  function createDuel(cfg, seed, kit, playerRamPerTurn, retry = 0) {
    const rng = new Rng(seed ^ 625341585);
    const carryCap = 2;
    let best = null;
    let bestScore = Infinity;
    let loose = null;
    let looseScore = Infinity;
    let lastResort = null;
    let lastResortScore = Infinity;
    let anyFair = null;
    let anyFairScore = Infinity;
    for (let attempt = 0;attempt < 160; attempt++) {
      const { cells, entryP, entryO, coreIdx } = buildCells(cfg, rng);
      const s2 = {
        cfg,
        seed,
        w: cfg.w,
        h: cfg.h,
        cells,
        entryP,
        entryO,
        coreIdx,
        power: { player: [], opp: [] },
        phase: "playing",
        winKind: null,
        endReason: null,
        round: 1,
        turn: "player",
        econ: { player: initialEcon(playerRamPerTurn, carryCap), opp: initialEcon(cfg.oppRam, 2) },
        kit: { ...kit, augments: [...kit.augments] },
        oppNextIntent: null,
        routeTrace: null,
        oppStartCost: 0,
        par: 0,
        patchPouch: [...kit.patchPouch],
        severedStreak: 0,
        strainChip: 0,
        rngState: seedRng(seed ^ 1597463007),
        claimCounter: 0,
        fx: [],
        fxNext: 1,
        notice: null,
        oppTurn: { started: false, pendingCast: null, queue: [], replans: 3, lastReplanCost: Infinity, ramAtStart: 0, aim: null },
        oppDominantUsed: false,
        lastPlayerHitRound: 0,
        tutFlags: { scanned: false, purged: false, attacked: false },
        tutorialLessonRound: 0
      };
      const fp = runFlood(s2, "player");
      const fo = runFlood(s2, "opp");
      if (fp.reachedCore || fo.reachedCore)
        continue;
      if (fp.claimed.length > MAX_OPENING_CLAIM || fo.claimed.length > MAX_OPENING_CLAIM)
        continue;
      const pd = routeCost(s2, "player");
      const od = routeCost(s2, "opp");
      if (!isFinite(pd) || !isFinite(od))
        continue;
      if (Math.abs(pd - od) > 2)
        continue;
      const shorter = Math.min(pd, od);
      const score = Math.abs(shorter - cfg.minCost);
      let shortcutOk = true;
      if (!cfg.tutorial && cfg.minPd !== undefined) {
        let shortcut = pd;
        for (let i = 0;i < s2.cells.length && shortcut > cfg.minPd - 6; i++) {
          if (!canPlace(s2, "player", i))
            continue;
          const c = s2.cells[i];
          const prev = { kind: c.kind, base: c.base, rot: c.rot, fused: c.fused };
          c.kind = "node";
          c.base = PIECE_X;
          c.rot = 0;
          c.fused = true;
          const after = routeCost(s2, "player");
          c.kind = prev.kind;
          c.base = prev.base;
          c.rot = prev.rot;
          c.fused = prev.fused;
          if (after < shortcut)
            shortcut = after;
        }
        shortcutOk = shortcut > cfg.minPd - 6;
      }
      const looseOk = cfg.tutorial ? pd > playerRamPerTurn * 2 + 1 : shortcutOk && pd > Math.max(playerRamPerTurn, (cfg.minPd ?? 0) - 2);
      if (looseOk && score < looseScore) {
        looseScore = score;
        loose = s2;
      } else if (!looseOk && cfg.tutorial && pd > playerRamPerTurn + 3 && score < lastResortScore) {
        lastResortScore = score;
        lastResort = s2;
      }
      if (!cfg.tutorial && score < anyFairScore) {
        anyFairScore = score;
        anyFair = s2;
      }
      if (cfg.tutorial) {
        if (od <= cfg.oppRam || od > cfg.oppRam * 2 || pd <= playerRamPerTurn * 2 + 3)
          continue;
      } else {
        const pdFloor = Math.max(playerRamPerTurn, cfg.minPd ?? 0);
        if (pd <= pdFloor || od <= cfg.oppRam || !shortcutOk)
          continue;
      }
      if (score < bestScore) {
        bestScore = score;
        best = s2;
        if (score <= 1)
          break;
      }
    }
    let s = best ?? loose ?? lastResort;
    if (!s) {
      const maxRetry = cfg.minPd !== undefined ? 12 : 5;
      if (retry >= maxRetry) {
        if (anyFair) {
          s = anyFair;
        } else if (cfg.minPd !== undefined) {
          return createDuel({ ...cfg, minPd: undefined }, seed, kit, playerRamPerTurn, 0);
        } else {
          throw new Error("duel generator could not produce a fair board");
        }
      } else {
        return createDuel(cfg, seed + 40503 >>> 0, kit, playerRamPerTurn, retry + 1);
      }
    }
    if (cfg.headStart > 0) {
      const applied = [];
      for (let k = 0;k < cfg.headStart; k++) {
        const plan = routePlan(s, "opp");
        if (!plan)
          break;
        const next = plan.path.find((p) => s.cells[p.idx].owner === "none");
        if (!next)
          break;
        const c = s.cells[next.idx];
        const core = s.cells[s.coreIdx];
        if (Math.abs(c.x - core.x) + Math.abs(c.y - core.y) <= 1)
          break;
        const prev = { idx: next.idx, rot: c.rot, spin: c.spin };
        const turns = (next.targetRot - c.rot + 4) % 4;
        c.rot = next.targetRot;
        c.spin += turns;
        c.owner = "opp";
        c.claimSeq = ++s.claimCounter;
        c.claimWave = 0;
        if (!isFinite(routeCost(s, "player"))) {
          c.rot = prev.rot;
          c.spin = prev.spin;
          c.owner = "none";
          c.claimSeq = 0;
          break;
        }
        applied.push(prev);
      }
      const flood = runFlood(s, "opp");
      if (!isFinite(routeCost(s, "player"))) {
        for (const i of flood.claimed) {
          s.cells[i].owner = "none";
          s.cells[i].claimSeq = 0;
        }
        for (const u of [...applied].reverse()) {
          const c = s.cells[u.idx];
          c.rot = u.rot;
          c.spin = u.spin;
          c.owner = "none";
          c.claimSeq = 0;
        }
      }
    }
    {
      const rc = routeCost(s, "opp");
      s.oppStartCost = Math.max(1, isFinite(rc) ? rc : cfg.minCost);
    }
    {
      const pd = routeCost(s, "player");
      const base = isFinite(pd) ? pd : cfg.minCost;
      s.par = Math.ceil(base * PAR_RATE) + (cfg.parFlat ?? PAR_FLAT);
    }
    s.power = computeDuelPower(s);
    s.econ.player.ram = playerRamPerTurn + (kit.augments.includes("hotBoot") ? 1 : 0);
    if (cfg.oppOpens && !cfg.tutorial) {
      startOppTurn(s);
    }
    return s;
  }

  // ../_shared/glyph.ts
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

  // ../_shared/ui.ts
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text)
      n.textContent = text;
    return n;
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

  // ../_shared/sound.ts
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
  function tone(freq, dur, opts = {}) {
    const c = ensureCtx();
    if (!c || !gameBus)
      return;
    const t0 = c.currentTime + (opts.at ?? 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = opts.type ?? "square";
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slide)
      osc.frequency.exponentialRampToValueAtTime(opts.slide, t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(opts.vol ?? 0.5, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(gameBus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  function playCascade(n) {
    const steps = Math.min(n, 9);
    for (let i = 0;i < steps; i++) {
      play("claimTick", { rate: Math.pow(2, i * 2 / 12), at: i * 0.048, vol: 0.9, bus: "game" });
    }
    if (n >= 4)
      play("cascadeEnd", { at: steps * 0.048, bus: "game" });
  }
  function playStinger(won) {
    if (won) {
      tone(392, 0.12, { vol: 0.5 });
      tone(523, 0.12, { at: 0.1, vol: 0.5 });
      tone(659, 0.14, { at: 0.2, vol: 0.55 });
      tone(784, 0.34, { at: 0.32, type: "triangle", vol: 0.6 });
      tone(1046, 0.4, { at: 0.42, type: "triangle", vol: 0.4 });
      play("unlock", { at: 0.45, vol: 0.7, bus: "game" });
    } else {
      tone(220, 0.18, { vol: 0.55 });
      tone(174, 0.2, { at: 0.16, vol: 0.55 });
      tone(116, 0.5, { at: 0.34, type: "sawtooth", vol: 0.6, slide: 60 });
      play("turnLost", { at: 0.3, vol: 0.8, bus: "game" });
    }
  }
  var drone = null;
  function startDrone() {
    if (drone)
      return;
    const c = ensureCtx();
    if (!c || !gameBus)
      return;
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 46;
    const lfo = c.createOscillator();
    lfo.frequency.value = 1.7;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 3.5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);
    const gain = c.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.16, c.currentTime, 0.25);
    osc.connect(gain);
    gain.connect(gameBus);
    osc.start();
    lfo.start();
    drone = { osc, lfo, gain };
  }
  function stopDrone() {
    if (!drone || !ctx)
      return;
    const d = drone;
    drone = null;
    d.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    const stopAt = ctx.currentTime + 0.6;
    d.osc.stop(stopAt);
    d.lfo.stop(stopAt);
  }

  // dive.ts
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVGNS = "http://www.w3.org/2000/svg";
  var CS = 52;
  var HALF = CS / 2;
  var SCENARIOS = [
    {
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
        patchPouch: []
      },
      ramPerTurn: 6,
      strain: 84,
      seed: 20898
    },
    {
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
        patchPouch: [5, 3, 15, 7]
      },
      ramPerTurn: 6,
      strain: 62,
      seed: 21681
    },
    {
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
        patchPouch: [7, 15]
      },
      ramPerTurn: 6,
      strain: 47,
      seed: 22302
    }
  ];
  var VIRUS_LINES = {
    armHalt: ["DA3M0N R3L3AS3D. H4PPY HUNT1NG >:)", "M1N3S 1N TH3 W1R3S. ST3P L1GHTLY", "S0M3TH1NG SL33PS WH3R3 Y0U W4LK"],
    armSiphon: ["Y0UR R4M T4ST3S B3TT3R TH4N M1N3", "L1TTL3 L33CH, B1G 4PP3T1T3 >:)", "F33D M3"],
    redirect: ["R3R0UT1NG Y0UR L1F3 >:)", "Y0UR W0RK. MY RUL3S", "TW1ST. SN4P. S0RRY N0T S0RRY"],
    lock: ["TH1S 0N3 1S M1N3 N0W", "FR0Z3N S0L1D. TRY 4G41N L4T3R"],
    ward: ["N0 G1FTS 4LL0W3D 1N MY H0US3", "W4RD3D. K33P Y0UR T0YS"],
    purge: ["SW3PT CL34N. N1C3 TRY", "F0UND Y0UR L1TTL3 G1FTS >:)"]
  };
  var scenario = SCENARIOS[1];
  var state;
  var soundOn = true;
  var targeting = null;
  var placing = null;
  var reviewing = false;
  var parWasOver = false;
  var feed = "ink";
  var holdOpp = false;
  var oppTimer = null;
  var heartbeatTimer = null;
  var heartbeatTier = 0;
  var virusTimer = null;
  var consoleTimer = null;
  var noticeSeen = 0;
  var noticeUntil = 0;
  var lastRound = 1;
  var R = {};
  var consoleShown = "";
  function sv(tag, cls) {
    const n = document.createElementNS(SVGNS, tag);
    if (cls)
      n.setAttribute("class", cls);
    return n;
  }
  function svAttr(n, attrs) {
    for (const [k, v] of Object.entries(attrs))
      n.setAttribute(k, String(v));
  }
  function customer() {
    return CUSTOMERS.find((c) => c.id === scenario.customerId) ?? CUSTOMERS[0];
  }
  function playerTurn() {
    return state.phase === "playing" && state.turn === "player";
  }
  function arming() {
    return targeting !== null || placing !== null;
  }
  function addr(idx) {
    return `0x${idx.toString(16).toUpperCase().padStart(2, "0")}`;
  }
  function logLine(actor, text, divider = false) {
    if (!R.log)
      return;
    const line = el("span", divider ? "dv-log-div" : `dv-log-${actor}`);
    if (!divider) {
      line.appendChild(el("b", "", actor === "you" ? "YOU>" : actor === "int" ? "INT>" : "SYS>"));
    }
    line.appendChild(document.createTextNode(text));
    R.log.appendChild(line);
    while (R.log.children.length > 40)
      R.log.firstChild?.remove();
  }
  function logAction(action, fx) {
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
  function dispatch(action) {
    state = duelReducer(state, action);
    if (state.fx.length > 0) {
      const upTo = state.fx[state.fx.length - 1].id;
      logAction(action, new Set(state.fx.map((e) => e.kind)));
      for (const e of state.fx)
        handleFx(e.kind, e.n);
      state = duelReducer(state, { type: "fxDrain", upTo });
    }
    render();
  }
  function shake(mag) {
    if (REDUCED || !R.shell)
      return;
    const cls = `dv-shake-${Math.min(3, Math.max(1, mag))}`;
    R.shell.classList.remove("dv-shake-1", "dv-shake-2", "dv-shake-3");
    R.shell.offsetWidth;
    R.shell.classList.add(cls);
    window.setTimeout(() => R.shell && R.shell.classList.remove(cls), 420);
  }
  function pulse(text, bad) {
    if (!R.pulses)
      return;
    const p = el("div", `dv-pulse ${bad ? "dv-pulse-bad" : ""}`, text);
    R.pulses.appendChild(p);
    while (R.pulses.children.length > 2)
      R.pulses.firstChild?.remove();
    window.setTimeout(() => p.remove(), 1500);
  }
  function showVirus(mode) {
    if (!R.boardWrap)
      return;
    R.boardWrap.querySelector(".dv-virus")?.remove();
    const lines = VIRUS_LINES[mode] ?? VIRUS_LINES.armHalt;
    const v = el("div", "dv-virus", lines[Math.floor(Math.random() * lines.length)]);
    R.boardWrap.appendChild(v);
    if (virusTimer !== null)
      clearTimeout(virusTimer);
    virusTimer = window.setTimeout(() => v.remove(), 2400);
    if (mode === "armHalt" || mode === "armSiphon") {
      const sw = el("div", "dv-sweep");
      R.boardWrap.appendChild(sw);
      window.setTimeout(() => sw.remove(), 900);
    }
  }
  function handleFx(kind, n) {
    const s = soundOn;
    if (kind === "oppAim") {
      if (s)
        play("aim", { jitter: 0.04, bus: "game" });
      return;
    }
    if (kind.startsWith("oppCast:")) {
      const mode = kind.slice(8);
      showVirus(mode);
      logLine("int", `charging ${(MODE_LABEL[mode] ?? mode).toLowerCase()}`);
      if (s)
        play("virusSting", { bus: "game" });
      shake(1);
      return;
    }
    switch (kind) {
      case "cascade":
        shake(n && n >= 5 ? 2 : 1);
        pulse(`CASCADE x${n ?? 2}`, false);
        logLine("you", `cascade x${n ?? 2}`);
        if (s)
          playCascade(n ?? 2);
        break;
      case "cascadeOpp":
        shake(1);
        pulse(`IT CLAIMED x${n ?? 2}`, true);
        logLine("int", `cascade x${n ?? 2}`);
        if (s)
          play("claimTick", { vol: 0.5, rate: 0.7, bus: "game" });
        break;
      case "claim":
        if (s)
          playCascade(1);
        break;
      case "claimOpp":
        if (s)
          play("claimTick", { vol: 0.4, rate: 0.7, bus: "game" });
        break;
      case "cascadeRam":
        pulse(`+${n ?? 1} RAM BANKED`, false);
        logLine("you", `+${n ?? 1} ram banked`);
        if (s)
          play("overclockCast", { vol: 0.8, bus: "game" });
        break;
      case "cascadeRamOpp":
        pulse(`IT BANKED +${n ?? 1} RAM`, true);
        logLine("int", `+${n ?? 1} ram banked`);
        break;
      case "trapFire":
        shake(3);
        pulse("TRAP SPRUNG", true);
        logLine("sys", "trap sprung");
        if (s)
          play("trapFire", { bus: "game" });
        break;
      case "siphonFire":
        shake(2);
        pulse(`SIPHONED ${n ?? 2} RAM`, true);
        logLine("sys", `${n ?? 2} ram siphoned`);
        if (s)
          play("overloadCast", { bus: "game" });
        break;
      case "turnLost":
        shake(2);
        pulse("TURN LOST", true);
        logLine("sys", "turn lost");
        if (s)
          play("trapFire", { bus: "game" });
        break;
      case "win":
        shake(3);
        logLine("sys", "core seized. link closed.");
        if (s)
          playStinger(true);
        break;
      case "lose":
        shake(3);
        logLine("sys", "core lost. link closed.");
        if (s)
          playStinger(false);
        break;
      case "redirect":
        shake(1);
        if (state.turn === "opp")
          logLine("int", "redirect hit");
        if (s)
          play("redirect", { jitter: 0.03, bus: "game" });
        break;
      case "rotate":
        if (state.turn === "opp")
          logLine("int", "twist");
        if (s)
          play("rotate", { jitter: 0.06, bus: "game" });
        if (s && state.turn === "player" && state.econ.player.rotations > state.par) {
          play("overParTick", { jitter: 0.05, bus: "game" });
        }
        break;
      case "deny":
        if (s)
          play("deny", { bus: "game" });
        break;
      case "endTurn":
        if (s)
          play("endTurn", { bus: "game" });
        break;
      case "trapSet":
        if (state.turn === "opp")
          logLine("int", "something armed");
        if (s)
          play("trapSet", { bus: "game" });
        break;
      case "scan":
        if (s)
          play("scanCast", { bus: "game" });
        pulse("SCANNED", false);
        break;
      case "trace":
        logLine("sys", "route traced");
        pulse("ROUTE TRACED", false);
        break;
      case "purge":
        if (state.turn === "opp")
          logLine("int", "traps swept");
        if (s)
          play("backdoorCast", { bus: "game" });
        pulse("DEFUSED", false);
        break;
      case "place":
        if (s)
          play("patchPlace", { bus: "game" });
        pulse("PIECE PLACED", false);
        break;
      case "lock":
        if (state.turn === "opp")
          logLine("int", "clamp locked");
        if (s)
          play("shieldCast", { bus: "game" });
        break;
      case "ward":
        if (state.turn === "opp")
          logLine("int", "ward raised");
        if (s)
          play("firewallCast", { bus: "game" });
        pulse("WARDED", false);
        break;
      default:
        break;
    }
  }
  function armLine(mask, cls, width, len = HALF) {
    const ends = [[0, -len], [len, 0], [0, len], [-len, 0]];
    const out = [];
    for (let d = 0;d < 4; d++) {
      if ((mask & 1 << d) === 0)
        continue;
      const line = sv("line", cls);
      svAttr(line, { x1: 0, y1: 0, x2: ends[d][0], y2: ends[d][1], "stroke-width": width });
      out.push(line);
    }
    return out;
  }
  function slagPoints(idx) {
    let s = idx * 2654435761 >>> 0;
    const next = () => {
      s = Math.imul(s, 1664525) + 1013904223 >>> 0;
      return (s >>> 8) / 16777215;
    };
    const pts = [];
    const n = 7;
    for (let i = 0;i < n; i++) {
      const a = Math.PI * 2 * i / n + next() * 0.5;
      const r = 11 + next() * 6;
      pts.push(`${Math.round(Math.cos(a) * r)},${Math.round(Math.sin(a) * r)}`);
    }
    return pts.join(" ");
  }
  function buildCellG(cell, idx) {
    const g = sv("g", "dv-cell");
    svAttr(g, { transform: `translate(${cell.x * CS + HALF} ${cell.y * CS + HALF})` });
    const hit = sv("rect", "dv-hit");
    svAttr(hit, { x: -HALF, y: -HALF, width: CS, height: CS, fill: "transparent" });
    g.appendChild(hit);
    const refs = {
      g,
      pop: null,
      arms: null,
      ghost: null,
      lit: [],
      rotates: false,
      snap: "",
      claimSeq: cell.claimSeq,
      base: cell.base,
      kind: cell.kind
    };
    const addLit = (mask, host) => {
      const ends = [[0, -HALF], [HALF, 0], [0, HALF], [-HALF, 0]];
      for (let d = 0;d < 4; d++) {
        if ((mask & 1 << d) === 0)
          continue;
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
      jit.style.animationDelay = `${idx % 7 * 0.11}s`;
      const pop = sv("g", "dv-popg");
      const arms = sv("g", "dv-arms");
      arms.style.transform = `rotate(${cell.spin * 90}deg)`;
      for (const l of armLine(cell.base, "dv-arm", 4))
        arms.appendChild(l);
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
      for (const l of armLine(rotateArms(cell.base, cell.rot), "dv-arm", 4))
        arms.appendChild(l);
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
      if (cell.kind === "entryO")
        tag.setAttribute("class", "dv-tag dv-tag-o");
      g.appendChild(tag);
    }
    if (cell.kind === "core") {
      const arms = sv("g", "dv-arms");
      for (const l of armLine(rotateArms(cell.base, cell.rot), "dv-arm dv-arm-core", 4))
        arms.appendChild(l);
      addLit(rotateArms(cell.base, cell.rot), arms);
      g.appendChild(arms);
      const body = sv("rect", "dv-corebody");
      svAttr(body, { x: -15, y: -15, width: 30, height: 30 });
      g.appendChild(body);
      for (const [d, x, y] of [
        ["M 0 0 L 0 -7 L 7 -7", -21, -14],
        ["M 0 0 L 7 0 L 7 7", 14, -21],
        ["M 0 0 L 0 7 L -7 7", 21, 14],
        ["M 0 0 L -7 0 L -7 -7", -14, 21]
      ]) {
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
    g.addEventListener("click", () => onCell(idx));
    return refs;
  }
  function buildBoard() {
    if (!R.boardWrap)
      return;
    R.board?.remove();
    const svg = sv("svg", "dv-board");
    svAttr(svg, {
      viewBox: `-10 -10 ${state.w * CS + 20} ${state.h * CS + 20}`,
      preserveAspectRatio: "xMidYMid meet"
    });
    svg.setAttribute("role", "application");
    svg.setAttribute("aria-label", `Duel grid, ${state.w} by ${state.h}`);
    const defs = sv("defs");
    const pat = sv("pattern");
    svAttr(pat, { id: "dvGrid", width: CS, height: CS, patternUnits: "userSpaceOnUse" });
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
  function legalSet() {
    const out = new Set;
    if (!playerTurn())
      return out;
    const econ = state.econ.player;
    if (placing !== null) {
      if (econ.ram < PLACE_COST)
        return out;
      for (let i = 0;i < state.cells.length; i++)
        if (canPlace(state, "player", i))
          out.add(i);
      return out;
    }
    if (targeting) {
      for (let i = 0;i < state.cells.length; i++) {
        if (targeting.picked.includes(i))
          continue;
        if (targeting.prog === "attack" && attackTargetLegal(state, "player", targeting.mode, i))
          out.add(i);
        if (targeting.prog === "defend" && defendTargetLegal(state, "player", state.kit.defendMode, i))
          out.add(i);
      }
      return out;
    }
    if (econ.ram < 1)
      return out;
    for (let i = 0;i < state.cells.length; i++)
      if (canRotate(state, "player", i))
        out.add(i);
    return out;
  }
  function flowDepths(side) {
    const D = new Array(state.cells.length).fill(Infinity);
    const entry = side === "player" ? state.entryP : state.entryO;
    const pow = state.power[side];
    D[entry] = 0;
    const q = [entry];
    while (q.length > 0) {
      const i = q.shift();
      const c = state.cells[i];
      const arms = effectiveDuelArms(c);
      for (let d = 0;d < 4; d++) {
        if ((arms & 1 << d) === 0)
          continue;
        const nx = c.x + DX[d];
        const ny = c.y + DY[d];
        if (nx < 0 || nx >= state.w || ny < 0 || ny >= state.h)
          continue;
        const n = ny * state.w + nx;
        if (!pow[n] || isFinite(D[n]))
          continue;
        if ((effectiveDuelArms(state.cells[n]) & 1 << oppositeDir(d)) === 0)
          continue;
        D[n] = D[i] + 1;
        q.push(n);
      }
    }
    return D;
  }
  function updateFlow() {
    if (!R.cells)
      return;
    const depths = {
      player: flowDepths("player"),
      opp: flowDepths("opp")
    };
    for (let idx = 0;idx < state.cells.length; idx++) {
      const refs = R.cells[idx];
      if (refs.lit.length === 0)
        continue;
      const side = state.power.player[idx] ? "player" : state.power.opp[idx] ? "opp" : null;
      const cell = state.cells[idx];
      for (const { d, el: el2 } of refs.lit) {
        let cls = "dv-armlit";
        if (side) {
          const D = depths[side];
          const live = refs.rotates ? (d + cell.rot) % 4 : d;
          const nx = cell.x + DX[live];
          const ny = cell.y + DY[live];
          if (nx >= 0 && nx < state.w && ny >= 0 && ny < state.h) {
            const n = ny * state.w + nx;
            const facing = (effectiveDuelArms(state.cells[n]) & 1 << oppositeDir(live)) !== 0;
            if (state.power[side][n] && facing && isFinite(D[n]) && isFinite(D[idx])) {
              cls += D[n] < D[idx] ? " dv-flow-in" : " dv-flow-out";
            }
          }
        }
        if (el2.getAttribute("class") !== cls)
          el2.setAttribute("class", cls);
      }
    }
  }
  function updateBoard() {
    if (!R.cells)
      return;
    const legal = legalSet();
    const picked = new Set(targeting?.picked ?? []);
    const aim = state.oppTurn.aim;
    const aimed = new Set(aim && state.phase === "playing" ? aim.kind === "rotate" ? [aim.idx] : aim.targets : []);
    const traced = new Set(state.routeTrace?.cells ?? []);
    for (let idx = 0;idx < state.cells.length; idx++) {
      const cell = state.cells[idx];
      const refs = R.cells[idx];
      if (cell.kind !== refs.kind || cell.base !== refs.base) {
        const fresh = buildCellG(cell, idx);
        refs.g.replaceWith(fresh.g);
        R.cells[idx] = fresh;
        fresh.claimSeq = -1;
        updateOne(cell, idx, legal, picked, aimed, traced);
        continue;
      }
      updateOne(cell, idx, legal, picked, aimed, traced);
    }
    updateFlow();
  }
  function updateOne(cell, idx, legal, picked, aimed, traced) {
    const refs = R.cells[idx];
    const litP = state.power.player[idx] ?? false;
    const litO = state.power.opp[idx] ?? false;
    const locked = cell.lockedThroughRound >= state.round;
    const warded = cell.wardThroughRound >= state.round;
    const trapVisible = !!cell.trap && (cell.trap.by === "player" || cell.trap.revealed || state.phase !== "playing");
    const cls = ["dv-cell", `dv-k-${cell.kind}`];
    if (cell.kind === "node") {
      if (cell.owner === "player")
        cls.push("dv-own-p");
      else if (cell.owner === "opp")
        cls.push("dv-own-o");
      else
        cls.push("dv-own-n");
    }
    if (cell.kind === "entryP")
      cls.push("dv-own-p");
    if (cell.kind === "entryO")
      cls.push("dv-own-o");
    if (litP)
      cls.push("dv-lit-p");
    if (litO)
      cls.push("dv-lit-o");
    if (legal.has(idx))
      cls.push("dv-legal");
    if (picked.has(idx))
      cls.push("dv-picked");
    if (aimed.has(idx))
      cls.push("dv-aimed");
    if (traced.has(idx))
      cls.push("dv-traced");
    if (locked)
      cls.push("dv-locked");
    if (warded && !locked)
      cls.push("dv-warded");
    if (cell.fused)
      cls.push("dv-fused");
    if (trapVisible && cell.trap) {
      cls.push("dv-trapped", cell.trap.by === "player" ? "dv-trap-p" : "dv-trap-o");
      if (cell.trap.kind === "siphon")
        cls.push("dv-trap-siphon");
    }
    const snap = cls.join(" ");
    if (snap !== refs.snap) {
      refs.snap = snap;
      refs.g.setAttribute("class", refs.g.classList.contains("dv-cell-in") ? `${snap} dv-cell-in` : snap);
    }
    if (refs.arms && cell.kind === "node") {
      const want = `rotate(${cell.spin * 90}deg)`;
      if (refs.arms.style.transform !== want)
        refs.arms.style.transform = want;
    }
    if (refs.pop && cell.claimSeq !== refs.claimSeq) {
      refs.claimSeq = cell.claimSeq;
      if (cell.claimSeq > 0 && !REDUCED) {
        refs.pop.classList.remove("dv-pop");
        refs.pop.getBoundingClientRect();
        refs.pop.style.animationDelay = `${cell.claimWave * 55}ms`;
        refs.pop.classList.add("dv-pop");
      }
    }
    if (refs.ghost) {
      const mask = placing !== null ? state.patchPouch[placing] : undefined;
      const wantGhost = legal.has(idx) && mask !== undefined;
      if (wantGhost && refs.ghost.childNodes.length === 0 && mask !== undefined) {
        for (const l of armLine(mask, "dv-ghostarm", 3, HALF - 6))
          refs.ghost.appendChild(l);
        const nub = sv("rect", "dv-ghostnode");
        svAttr(nub, { x: -4, y: -4, width: 8, height: 8 });
        refs.ghost.appendChild(nub);
      } else if (!wantGhost && refs.ghost.childNodes.length > 0) {
        refs.ghost.textContent = "";
      }
    }
  }
  function onCell(idx) {
    if (!playerTurn())
      return;
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
      if (!legalSet().has(idx))
        return;
      const picked = [...targeting.picked, idx];
      if (soundOn)
        play("tick", { jitter: 0.04 });
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
  function onProgram(prog) {
    if (!playerTurn() || state.econ.player.used[prog])
      return;
    unlock();
    if (soundOn)
      play("press");
    placing = null;
    targeting = null;
    if (prog === "scan") {
      dispatch({ type: "cast", prog: "scan", targets: [] });
      return;
    }
    if (prog === "attack") {
      const mode2 = state.kit.attackMode;
      targeting = {
        prog: "attack",
        mode: mode2,
        picked: [],
        want: ATTACK_WIDTH[tierOf(state, "player", "attack")],
        label: ATTACK_MODE_LABEL[mode2]
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
      label: DEFEND_MODE_LABEL[mode]
    };
    render();
  }
  function castNow() {
    if (!targeting || targeting.picked.length === 0)
      return;
    const t = targeting;
    targeting = null;
    dispatch({ type: "cast", prog: t.prog, targets: t.picked });
  }
  function cancelArming() {
    targeting = null;
    placing = null;
    render();
  }
  function keyButton(prog) {
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
  function showInfo(prog) {
    if (!R.infoBox)
      return;
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
  function hideInfo() {
    R.infoBox?.classList.remove("dv-info-on");
  }
  function datarow(label) {
    const row = el("div", "kp-datarow");
    row.appendChild(el("span", "", label));
    const em = el("em");
    row.appendChild(em);
    return { row, em };
  }
  function buildShell() {
    const root = document.getElementById("root");
    root.textContent = "";
    const cust = customer();
    const shell = el("div", "dv-shell");
    R.shell = shell;
    const bar = el("header", "dv-bar");
    const title = el("h1", "", "DIVE.EXE");
    R.barTitle = title;
    const barRight = el("div", "dv-bar-right");
    R.barSub = el("span", "dv-bar-dev");
    const glyphs = el("span", "dv-bar-glyphs");
    for (let i = 0;i < 3; i++)
      glyphs.appendChild(el("i"));
    barRight.append(R.barSub, glyphs);
    bar.append(title, barRight);
    shell.appendChild(bar);
    const crumb = el("div", "dv-crumb");
    R.crumbPath = el("span", "dv-crumb-path");
    const crumbRight = el("div", "dv-crumb-right");
    const roundBox = el("span", "dv-round");
    R.roundNum = el("em");
    const segs = el("span", "dv-roundsegs");
    R.roundSegs = [];
    for (let i = 0;i < ROUND_CAP; i++) {
      const seg = el("i", i >= ROUND_CAP - 5 ? "dv-seg-late" : "");
      segs.appendChild(seg);
      R.roundSegs.push(seg);
    }
    roundBox.append(el("span", "", "ROUND"), R.roundNum, segs);
    const turnRead = el("span", "dv-round dv-turnread");
    R.turnVal = el("em");
    turnRead.append(el("span", "", "TURN"), R.turnVal);
    R.daySlot = el("span", "dv-day");
    R.sndBtn = el("button", "dv-snd", `SND ${soundOn ? "ON" : "OFF"}`);
    R.sndBtn.type = "button";
    R.sndBtn.addEventListener("click", () => {
      unlock();
      soundOn = !soundOn;
      if (!soundOn)
        stopDrone();
      R.sndBtn.textContent = `SND ${soundOn ? "ON" : "OFF"}`;
      render();
    });
    crumbRight.append(turnRead, roundBox, R.daySlot, R.sndBtn);
    crumb.append(R.crumbPath, crumbRight);
    shell.appendChild(crumb);
    const stage = el("div", "dv-stage");
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
      defend: keyButton("defend")
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
    R.endBtn = el("button", "kp-btn2 dv-end", "END TURN (E)");
    R.endBtn.type = "button";
    R.endBtn.addEventListener("click", () => {
      unlock();
      if (soundOn)
        play("press");
      dispatch({ type: "endTurn" });
    });
    railL.appendChild(R.endBtn);
    stage.appendChild(railL);
    const wrap = el("div", "dv-boardwrap kp-frame-ticks");
    wrap.appendChild(el("i", "kp-tick2"));
    wrap.appendChild(el("i", "dv-boardtex"));
    wrap.appendChild(el("span", "dv-wm", "DIVE.EXE"));
    const hexcorner = el("span", "dv-hexcorner");
    let hs = scenario.seed >>> 0;
    const hnext = () => {
      hs = Math.imul(hs, 1664525) + 1013904223 >>> 0;
      return hs;
    };
    hexcorner.textContent = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => (hnext() % 65535).toString(16).toUpperCase().padStart(4, "0")).join(" ")).join(`
`);
    wrap.appendChild(hexcorner);
    wrap.appendChild(el("i", "dv-ruler-b"));
    wrap.appendChild(el("i", "dv-ruler-r"));
    R.boardWrap = wrap;
    R.pulses = el("div", "dv-pulses");
    wrap.appendChild(R.pulses);
    R.threats = el("div", "dv-threats");
    wrap.appendChild(R.threats);
    stage.appendChild(wrap);
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
    const img = new Image;
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
  function setConsole(text) {
    if (!R.consoleLine || text === consoleShown)
      return;
    consoleShown = text;
    if (consoleTimer !== null)
      clearInterval(consoleTimer);
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
      R.consoleLine.textContent = text.slice(0, i);
      if (i < text.length)
        R.consoleLine.appendChild(caret);
      else if (consoleTimer !== null)
        clearInterval(consoleTimer);
    }, 14);
  }
  function consoleText() {
    if (state.phase !== "playing" && reviewing) {
      return state.winKind === "severed" ? "FINAL BOARD. Your territory has no open corridor left to the core." : "FINAL BOARD. Every trap on the grid is exposed.";
    }
    if (placing !== null) {
      const any = legalSet().size > 0;
      return any ? `PATCH PIECE: pick a slag block within reach. ${PLACE_COST} RAM. ESC cancels.` : "PATCH PIECE: no slag block in reach. ESC cancels.";
    }
    if (targeting) {
      const left = targeting.want - targeting.picked.length;
      return `${targeting.label}: pick ${left} target${left === 1 ? "" : "s"}. ESC cancels.`;
    }
    if (state.notice && state.notice.id !== noticeSeen) {
      noticeSeen = state.notice.id;
      noticeUntil = Date.now() + 4000;
    }
    if (state.notice && Date.now() < noticeUntil)
      return state.notice.text;
    if (state.phase !== "playing")
      return "LINK CLOSED.";
    if (state.turn === "opp")
      return "The intrusion is moving. Watch the line.";
    if (state.econ.player.ram < 1)
      return "No RAM left. E ends the turn.";
    return "Your move. Twist a junction in reach, run a program, or end the turn.";
  }
  function renderConsoleActions() {
    if (!R.consoleActions)
      return;
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
  function renderThreats(playerNear, oppNear) {
    if (!R.threats)
      return;
    R.threats.textContent = "";
    if (state.phase !== "playing")
      return;
    if (playerNear >= 99) {
      R.threats.appendChild(el("div", "dv-threat dv-threat-max", "NO ROUTE FROM YOUR PORT TO THE CORE"));
    }
    if (oppNear <= 2) {
      R.threats.appendChild(el("div", `dv-threat ${oppNear === 0 ? "dv-threat-max" : ""}`, oppNear === 0 ? "ITS ROUTE IS OPEN TO THE CORE" : "THE INTRUSION IS CLOSING ON THE CORE"));
    }
  }
  function renderOverlay() {
    if (!R.overlay)
      return;
    if (state.phase === "playing" || reviewing) {
      R.overlay.classList.remove("dv-overlay-on");
      R.overlay.textContent = "";
      return;
    }
    if (R.overlay.classList.contains("dv-overlay-on"))
      return;
    R.overlay.classList.add("dv-overlay-on");
    R.overlay.textContent = "";
    const won = state.phase === "won";
    const box = el("div", `dv-result ${won ? "dv-result-w" : "dv-result-l"}`);
    const hero = won ? state.winKind === "gridlock" ? "LINK COLLAPSED" : "CORE SEIZED" : state.winKind === "severed" ? "ROUTE SEVERED" : "CORE LOST";
    box.appendChild(el("h2", "", hero));
    box.appendChild(el("div", "kp-frame-stripe"));
    box.appendChild(el("p", "dv-result-reason", state.endReason ?? (won ? "Your flood touched the core first. The intrusion collapses." : "Its flood got there first.")));
    const econ = state.econ.player;
    const overRot = Math.max(0, econ.rotations - state.par);
    const bill = el("div", "kp-datarow-list dv-result-bill");
    const rows = [
      ["ROUNDS", `${Math.min(state.round, ROUND_CAP)}/${ROUND_CAP}`, false],
      ["ROTATIONS", `${econ.rotations} / PAR ${state.par}`, overRot > 0],
      ["TRAPS FIRED ON YOU", `${econ.trapsFired}`, econ.trapsFired > 0]
    ];
    if (won && state.strainChip > 0)
      rows.push(["STRAIN CHIP", `-${state.strainChip}`, true]);
    if (!won)
      rows.push(["NEURAL STRAIN", "ZEROED. THE RUN IS OVER.", true]);
    for (const [label, value, warn] of rows) {
      const { row, em } = datarow(label);
      if (warn)
        row.classList.add("kp-datarow-warn", "dv-hazrow");
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
      boot(scenario, Math.random() * 4294967295 >>> 0);
    });
    actions.append(view, again);
    box.appendChild(actions);
    R.overlay.appendChild(box);
  }
  function render() {
    if (!R.shell)
      return;
    const econ = state.econ.player;
    const oppEcon = state.econ.opp;
    const isP = playerTurn();
    if (state.round !== lastRound) {
      lastRound = state.round;
      logLine("sys", `== round ${String(Math.min(state.round, ROUND_CAP)).padStart(2, "0")} ==`, true);
    }
    const round = Math.min(state.round, ROUND_CAP);
    R.roundNum.textContent = `${String(round).padStart(2, "0")}/${ROUND_CAP}`;
    R.roundSegs.forEach((seg, i) => {
      seg.classList.toggle("dv-seg-on", i < round - 1);
      seg.classList.toggle("dv-seg-now", i === round - 1 && state.phase === "playing");
    });
    R.railL.classList.toggle("dv-rail-idle", !isP && state.phase === "playing");
    R.ramNum.textContent = String(isP ? econ.ram : 0);
    const banked = econ.drainNext < 0 ? -econ.drainNext : 0;
    R.ramBanked.textContent = banked > 0 ? `+${banked} NEXT` : "";
    const pipTotal = Math.max(econ.ramPerTurn + 3, econ.ram);
    const pips = R.ramPips;
    while (pips.children.length < pipTotal)
      pips.appendChild(el("i"));
    while (pips.children.length > pipTotal)
      pips.lastChild?.remove();
    for (let i = 0;i < pips.children.length; i++) {
      pips.children[i].className = i < econ.ram && isP ? "dv-pip-on" : "";
    }
    for (const prog of ["scan", "attack", "defend"]) {
      const k = R.keys[prog];
      const cost = programCost(state, "player", prog);
      const offline = !programUnlocked(state, prog);
      const used = econ.used[prog];
      const tier2 = tierOf(state, "player", prog);
      const sub = prog === "scan" ? `R${SCAN_RANGE[tier2] >= 99 ? "∞" : SCAN_RANGE[tier2]}` : prog === "attack" ? ATTACK_MODE_LABEL[state.kit.attackMode] : DEFEND_MODE_LABEL[state.kit.defendMode];
      k.meta.textContent = offline ? "OFFLINE" : `${sub} // ${cost} RAM`;
      k.chip.textContent = targeting?.prog === prog ? `PICK ${targeting.want - targeting.picked.length}` : used ? "USED" : "RDY";
      k.chip.classList.toggle("dv-chip-used", used);
      k.chip.classList.toggle("dv-chip-arm", targeting?.prog === prog);
      k.chip.classList.toggle("dv-chip-rdy", !used && !offline && targeting?.prog !== prog);
      k.root.disabled = !isP || offline || used || econ.ram < cost;
      k.root.classList.toggle("dv-key-arming", targeting?.prog === prog);
      if (k.pips.children.length !== 3) {
        k.pips.textContent = "";
        for (let i = 0;i < 3; i++)
          k.pips.appendChild(el("i"));
      }
      for (let i = 0;i < 3; i++)
        k.pips.children[i].className = i < tier2 ? "dv-on" : "";
    }
    const pouch = state.patchPouch;
    R.patchCount.textContent = pouch.length > 0 ? `x${pouch.length}` : "NONE HELD";
    const slots = R.patchSlots;
    slots.textContent = "";
    for (let i = 0;i < pouch.length; i++) {
      const b = el("button", `dv-piece ${placing === i ? "dv-piece-armed" : ""}`);
      b.type = "button";
      b.disabled = !isP || econ.placedThisTurn || econ.ram < PLACE_COST;
      b.title = econ.placedThisTurn ? "One piece per turn" : `Place this piece (${PLACE_COST} RAM)`;
      b.appendChild(patchGlyph(pouch[i], 22, econ.placedThisTurn ? "dim" : "signal"));
      const at = i;
      b.addEventListener("click", () => {
        unlock();
        if (soundOn)
          play("press");
        targeting = null;
        placing = placing === at ? null : at;
        render();
      });
      slots.appendChild(b);
    }
    R.patchWrap.classList.toggle("dv-patch-empty", pouch.length === 0);
    R.endBtn.disabled = !isP || arming();
    R.endBtn.textContent = arming() ? "PLACING..." : "END TURN (E)";
    R.endBtn.classList.toggle("kp-btn2-signal", isP && !arming() && econ.ram === 0);
    const oppActing = state.turn === "opp" && state.phase === "playing";
    R.turnVal.textContent = state.turn === "opp" ? "INTRUSION" : "YOU";
    R.turnVal.classList.toggle("dv-turnval-you", state.turn === "player" && state.phase === "playing");
    R.turnVal.classList.toggle("dv-turnval-opp", oppActing);
    R.turnVal.classList.toggle("dv-turnval-live", oppActing);
    const threat = state.phase === "playing" ? { player: routeCost(state, "player"), opp: routeCost(state, "opp") } : { player: Infinity, opp: Infinity };
    const playerNear = isFinite(threat.player) ? threat.player : 99;
    const oppNear = isFinite(threat.opp) ? threat.opp : 99;
    R.routeYou.textContent = playerNear >= 99 ? "SEVERED" : "OPEN";
    R.routeYou.parentElement.classList.toggle("kp-datarow-warn", playerNear >= 99);
    R.routeOpp.textContent = oppNear >= 99 ? "CUT" : oppNear === 0 ? "AT THE CORE" : oppNear <= 2 ? "CLOSING" : "OPEN";
    R.routeOpp.parentElement.classList.toggle("kp-datarow-warn", oppNear <= 2);
    R.routeOpp.parentElement.classList.toggle("dv-warn-max", oppNear === 0);
    R.oppRam.textContent = `${state.turn === "opp" ? oppEcon.ram : oppEcon.ramPerTurn} / ${oppEcon.ramPerTurn} PER TURN`;
    const oppBanked = oppEcon.drainNext < 0 ? -oppEcon.drainNext : 0;
    R.oppBank.textContent = oppBanked > 0 ? `+${oppBanked} NEXT` : "";
    const armedCount = state.cells.filter((c) => c.trap && c.trap.by === "opp").length;
    const revealed = state.cells.filter((c) => c.trap && c.trap.by === "opp" && c.trap.revealed).length;
    R.oppArmed.textContent = armedCount > 0 ? `${armedCount}${revealed < armedCount ? " (HIDDEN)" : ""}` : "0";
    R.oppArmed.parentElement.classList.toggle("kp-datarow-warn", armedCount > revealed);
    R.oppIntent.textContent = state.oppNextIntent && state.turn === "opp" ? `INTENT: ${state.oppNextIntent}` : "";
    const overPar = econ.rotations - state.par;
    R.parVal.textContent = `${econ.rotations}/${state.par}${overPar > 0 ? ` +${overPar} OVER` : ""}`;
    R.parRow.classList.toggle("kp-datarow-warn", overPar > 0);
    if (overPar > 0 && !parWasOver && !REDUCED) {
      R.parRow.classList.remove("dv-par-pop");
      R.parRow.offsetWidth;
      R.parRow.classList.add("dv-par-pop");
    }
    parWasOver = overPar > 0;
    R.strainFill.style.width = `${scenario.strain}%`;
    R.strainPct.textContent = `${scenario.strain}%`;
    R.strainRow.classList.toggle("kp-datarow-warn", scenario.strain <= 35);
    updateBoard();
    renderThreats(playerNear, oppNear);
    setConsole(consoleText());
    renderConsoleActions();
    renderOverlay();
    const oppMoving = state.phase === "playing" && state.turn === "opp" && !holdOpp;
    if (oppMoving && oppTimer === null) {
      if (soundOn)
        startDrone();
      oppTimer = window.setInterval(() => dispatch({ type: "oppStep" }), 420);
    } else if (!oppMoving && oppTimer !== null) {
      clearInterval(oppTimer);
      oppTimer = null;
      stopDrone();
    }
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
  function boot(sc, seed) {
    scenario = sc;
    targeting = null;
    placing = null;
    reviewing = false;
    parWasOver = false;
    noticeSeen = 0;
    noticeUntil = 0;
    heartbeatTier = 0;
    if (oppTimer !== null)
      clearInterval(oppTimer);
    oppTimer = null;
    if (heartbeatTimer !== null)
      clearInterval(heartbeatTimer);
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
  function radioRow(rowId, opts, initial, onPick) {
    const row = document.getElementById(rowId);
    row.textContent = "";
    for (const o of opts) {
      const b = el("button", o.id === initial ? "rig-on" : "", o.label);
      b.addEventListener("click", () => {
        row.querySelectorAll("button").forEach((x) => x.className = "");
        b.className = "rig-on";
        onPick(o.id);
      });
      row.appendChild(b);
    }
    return row;
  }
  function setScheme(id) {
    if (id === "default")
      delete document.documentElement.dataset.scheme;
    else
      document.documentElement.dataset.scheme = id;
  }
  var glassEl = document.getElementById("glass");
  var glassLayers = Array.prototype.slice.call(glassEl.children);
  function setCrt(mode) {
    document.getElementById("stage").classList.toggle("crt-on", mode !== "off");
    glassEl.textContent = "";
    if (mode !== "off")
      glassLayers.forEach((l) => glassEl.appendChild(l));
  }
  var VIEWPORTS = [
    { id: "169", label: "16:9 1366x768", w: 1366, h: 768 },
    { id: "219", label: "21:9 2560x1080", w: 2560, h: 1080 },
    { id: "laptop", label: "LAPTOP 1280x800", w: 1280, h: 800 }
  ];
  var VP = VIEWPORTS[0];
  function fit() {
    const availW = Math.max(320, window.innerWidth - 300);
    const availH = Math.max(320, window.innerHeight - 90);
    const k = Math.min(1, availW / VP.w, availH / VP.h);
    document.getElementById("fit").style.transform = `scale(${k})`;
    const wrap = document.getElementById("fitwrap");
    wrap.style.width = `${Math.round(VP.w * k)}px`;
    wrap.style.height = `${Math.round(VP.h * k)}px`;
    const meas = document.getElementById("meas");
    if (meas)
      meas.textContent = `STAGE ${VP.w}x${VP.h} FULL-SCREEN (no window ceiling)`;
  }
  function applyViewport(v) {
    VP = v;
    const stage = document.getElementById("stage");
    stage.style.width = `${v.w}px`;
    stage.style.height = `${v.h}px`;
    fit();
  }
  window.addEventListener("resize", fit);
  new Image().src = "art/cramdeck-color.png";
  function setFeed(id) {
    feed = id;
    if (R.mon)
      R.mon.dataset.feed = id;
    if (R.monImg)
      R.monImg.src = id === "color" ? "art/cramdeck-color.png" : "../_shared/art/dex-cramdeck.png";
  }
  function forceTelegraph() {
    holdOpp = true;
    targeting = null;
    placing = null;
    reviewing = false;
    if (state.phase !== "playing")
      boot(scenario);
    holdOpp = true;
    if (state.turn === "player")
      dispatch({ type: "endTurn" });
    let guard = 0;
    while (state.phase === "playing" && guard < 400 && !(state.turn === "opp" && state.oppTurn.aim && state.oppTurn.aim.kind === "cast")) {
      if (state.turn === "player")
        dispatch({ type: "endTurn" });
      else
        dispatch({ type: "oppStep" });
      guard++;
    }
    const aim = state.oppTurn.aim;
    if (aim && aim.kind === "cast") {
      showVirus(aim.mode);
      if (virusTimer !== null)
        clearTimeout(virusTimer);
      R.boardWrap?.querySelector(".dv-virus")?.classList.add("dv-virus-hold");
    }
    if (soundOn)
      play("aim", { bus: "game" });
    render();
  }
  function forceEnd(won) {
    holdOpp = false;
    reviewing = false;
    targeting = null;
    placing = null;
    if (state.phase !== "playing")
      boot(scenario);
    state = {
      ...state,
      phase: won ? "won" : "lost",
      winKind: "core",
      endReason: won ? "Your flood touched the core first. The intrusion collapses." : "Its flood got there first."
    };
    if (soundOn)
      playStinger(won);
    render();
  }
  function resumeLive() {
    if (!holdOpp && state.phase === "playing")
      return;
    holdOpp = false;
    boot(scenario);
  }
  (function rig() {
    radioRow("schemerow", [
      { id: "default", label: "DEFAULT" },
      { id: "nerv", label: "NERV" },
      { id: "tokyo", label: "TOKYO NIGHT" }
    ], "nerv", setScheme);
    radioRow("crtrow", [
      { id: "flat", label: "FLAT" },
      { id: "off", label: "OFF" }
    ], "flat", setCrt);
    radioRow("vprow", VIEWPORTS.map((v) => ({ id: v.id, label: v.label })), "169", (id) => {
      applyViewport(VIEWPORTS.find((v) => v.id === id));
    });
    const scRow = document.getElementById("screrow");
    SCENARIOS.forEach((sc) => {
      const b = el("button", sc.id === scenario.id ? "rig-on" : "", sc.label);
      b.addEventListener("click", () => {
        scRow.querySelectorAll("button").forEach((x) => x.className = "");
        b.className = "rig-on";
        holdOpp = false;
        boot(sc);
        syncBeatRow("live");
      });
      scRow.appendChild(b);
    });
    const reRow = document.getElementById("rerow");
    const re = el("button", "", "RESEED");
    re.addEventListener("click", () => {
      holdOpp = false;
      boot(scenario, Math.random() * 4294967295 >>> 0);
      syncBeatRow("live");
    });
    reRow.appendChild(re);
    radioRow("beatrow", [
      { id: "live", label: "LIVE" },
      { id: "telegraph", label: "TELEGRAPH ARMED" },
      { id: "win", label: "END (WIN)" },
      { id: "loss", label: "END (LOSS)" }
    ], "live", (id) => {
      if (id === "live")
        resumeLive();
      else if (id === "telegraph")
        forceTelegraph();
      else
        forceEnd(id === "win");
    });
    radioRow("feedrow", [
      { id: "ink", label: "INK TINT" },
      { id: "true", label: "TRUE 1-BIT" },
      { id: "color", label: "FULL COLOUR" }
    ], "ink", (id) => setFeed(id));
  })();
  function syncBeatRow(id) {
    const row = document.getElementById("beatrow");
    const ids = ["live", "telegraph", "win", "loss"];
    row.querySelectorAll("button").forEach((b, i) => {
      b.className = ids[i] === id ? "rig-on" : "";
    });
  }
  setScheme("nerv");
  setCrt("flat");
  applyViewport(VP);
  boot(scenario);
})();
