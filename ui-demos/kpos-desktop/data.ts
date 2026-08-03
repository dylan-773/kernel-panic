import { CUSTOMERS, CustomerProfile } from "../../kernel-panic-site/app/src/game/content/customers";
import { AUGMENTS, AUGMENT_BY_ID, MODE_LABEL, MODE_TELL, ATTACK_MODE_LABEL, DEFEND_MODE_LABEL, scanDesc, attackModeDesc, defendModeDesc, OppMode, AttackMode, DefendMode } from "../../kernel-panic-site/app/src/game/content/kit";
import { JOURNAL_ENTRIES, JournalEntry } from "../../kernel-panic-site/app/src/game/content/journal";
import { DAY_CONFIGS, FINAL_DAY, jobPay } from "../../kernel-panic-site/app/src/game/content/arc";
import { dayOpenScene, Scene } from "../../kernel-panic-site/app/src/game/content/story";
import { tip } from "../../kernel-panic-site/app/src/game/content/teaching";
import { PATCH_POUCH_MAX, armUnionCraft, shapeClassOf, darkPatchCost } from "../../kernel-panic-site/app/src/game/patch-cells";

/**
 * kpos-shell demo state. Mock run/meta shaped like the shipped RunState /
 * MetaState where the redesigned surfaces read them; all catalog data
 * (customers, augments, journal, arc, teaching copy) imports from the real
 * game modules so labels and numbers cannot drift from shipped content.
 */

export {
  CUSTOMERS, AUGMENTS, AUGMENT_BY_ID, MODE_LABEL, MODE_TELL,
  ATTACK_MODE_LABEL, DEFEND_MODE_LABEL, scanDesc, attackModeDesc,
  defendModeDesc, JOURNAL_ENTRIES, DAY_CONFIGS, FINAL_DAY, jobPay,
  dayOpenScene, tip, PATCH_POUCH_MAX, armUnionCraft, shapeClassOf,
};
export type { CustomerProfile, JournalEntry, Scene, OppMode, AttackMode, DefendMode };

/** file:// asset root: the game's public dir, reached relatively. */
export const ASSET = "../../kernel-panic-site/app/public";

export const SHAPE_NOUN: Record<"I" | "L" | "T" | "X", string> = {
  I: "Straight",
  L: "Elbow",
  T: "Tee",
  X: "Cross",
};

export const NO_JOIN_LINE = "No legal join for that piece. The result must be strictly bigger than both.";
export const FOOT_LINE =
  "A piece fills one slag block with exactly the arms it shows, welded where it lands. " +
  "2 RAM, one per turn, single use. Pieces come off the darknet, drop from cleared jobs, " +
  `or bank on clean wins; the pouch holds ${PATCH_POUCH_MAX}.`;

export interface MockJob {
  customer: CustomerProfile;
  tier: number;
  quoteIndex: 0 | 1;
  dominant: OppMode;
}

export interface MockRun {
  runNumber: number;
  day: number;
  strain: number;
  credits: number;
  ramPerTurn: number;
  boostSlots: number;
  patchPouch: number[];
  kit: {
    scanTier: number;
    attackTier: number;
    defendTier: number;
    attackMode: AttackMode;
    defendMode: DefendMode;
    attackModes: AttackMode[];
    defendModes: DefendMode[];
    augments: string[];
  };
  jobs: MockJob[];
  jobsDone: boolean[];
}

function jobOf(id: string, quoteIndex: 0 | 1, tier?: number): MockJob {
  const customer = CUSTOMERS.find((c) => c.id === id) ?? CUSTOMERS[0];
  return { customer, tier: tier ?? customer.tiers[0], quoteIndex, dominant: customer.dominant };
}

export const run: MockRun = {
  runNumber: 7,
  day: 4,
  strain: 62,
  credits: 210,
  ramPerTurn: 6,
  boostSlots: 3,
  patchPouch: [0b0101, 0b0011, 0b1111, 0b0111],
  kit: {
    scanTier: 2,
    attackTier: 1,
    defendTier: 2,
    attackMode: "redirect",
    defendMode: "purge",
    attackModes: ["redirect", "armHalt"],
    defendModes: ["purge", "ward"],
    augments: ["hotBoot", "cleanRun"],
  },
  jobs: [jobOf("juno-vex", 0, 1), jobOf("sable-okonkwo", 1, 2), jobOf("aldous-wick", 0, 4)],
  jobsDone: [false, false, false],
};

export const meta = {
  runCount: 7,
  machineOpened: false,
  stats: {
    runsWon: 0,
    divesCleared: 23,
    divesLost: 6,
    scans: 41,
    modeUse: { purge: 18, redirect: 12, ward: 5 } as Record<string, number>,
    lostTo: { "aldous-wick": 3, "juno-vex": 1 } as Record<string, number>,
  },
};

export function darkPullPrice(): number {
  const base = darkPatchCost(run.day);
  return run.kit.augments.includes("darkDiscount") ? Math.round(base * 0.85) : base;
}

export function openJobs(): number {
  return run.jobsDone.filter((d) => !d).length;
}

export function visibleJournalMock(): { unlocked: JournalEntry[]; nextLocked: JournalEntry | null } {
  const visible = JOURNAL_ENTRIES.filter(
    (e) => meta.runCount >= e.unlockAtRun && (!e.requiresOpened || meta.machineOpened),
  );
  const locked = JOURNAL_ENTRIES.find(
    (e) => meta.runCount < e.unlockAtRun || (e.requiresOpened && !meta.machineOpened),
  );
  return { unlocked: visible, nextLocked: locked ?? null };
}

/* -------- tiny pubsub so pouch/credits changes repaint every window -------- */

type Topic = "pouch" | "credits" | "screen" | "kit" | "day";
const subs: Record<string, Array<() => void>> = {};

export function on(topic: Topic, fn: () => void): void {
  (subs[topic] ??= []).push(fn);
}

export function emit(topic: Topic): void {
  for (const fn of subs[topic] ?? []) fn();
}
