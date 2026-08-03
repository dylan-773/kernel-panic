/**
 * The ui-demos manifest: the durable record of every UI submission.
 *
 * This file is NOT per-cycle working state. `pipeline/proposals/` and
 * `pipeline/gates/` are wiped between cycles; a demo's review status has to
 * outlive that, so it lives here beside the demos themselves.
 *
 * Read by three things: the review server (index page + verdict writes), the
 * deck injected into each demo page, and the KP/OS desktop, which builds its
 * mountable window list from the `desktop` blocks.
 */

export const STATUSES = ["awaiting", "approved", "complete", "archived"] as const;
export type Status = (typeof STATUSES)[number];

/** What a variation button or a desktop mount hook actually does. */
export type Apply =
  /** click the first selector in the list that matches (ordered fallback) */
  | { click: string[] }
  /** set an attribute, e.g. data-hue on <html> */
  | { attr: { sel: string; name: string; value: string } }
  /** call window[fn](...args) on the demo page - the escape hatch */
  | { call: string; args?: unknown[] };

/** A desktop mount hook: an Apply that may be limited to the first open. */
export type Hook = Apply & { once?: boolean };

export interface VariationOption {
  id: string;
  label: string;
  apply: Apply;
}

/**
 * A dimension the reviewer can switch: color scheme, dither treatment,
 * scenario. `default` names the option the page loads in; omit it (or null)
 * and the row renders as one-shot action buttons with no latched state.
 */
export interface Variation {
  id: string;
  label: string;
  default?: string | null;
  options: VariationOption[];
}

export interface DesktopDef {
  /** false for pages with no `.term-bar` chrome to hang a window on */
  mountable: boolean;
  /** mounted without being asked for, i.e. the current shipped desktop */
  default: boolean;
  /** key into PX_ICONS; falls back to a generic glyph when absent */
  icon?: string;
  /** the study window's own width; the host adds the shadow halo padding */
  frameW: number;
  x: number;
  y: number;
  /** native desktop window this study supersedes, hidden while it is mounted */
  replaces?: string | null;
  onReady?: Hook[];
  onOpen?: Hook[];
}

export interface HistoryEntry {
  status: Status;
  date: string;
  note: string | null;
}

export interface Demo {
  id: string;
  title: string;
  /** folder under ui-demos/ */
  dir: string;
  entry: string;
  /** the cycle id from pipeline/BRIEF.md that produced it */
  cycle: string;
  summary: string;
  notes: string | null;
  spec: { file: string; item: string } | null;
  status: Status;
  /** the reviewer's most recent note, e.g. what changes were asked for */
  note: string | null;
  history: HistoryEntry[];
  /** inline groups, or a string naming one in `shared.variations` */
  variations: (Variation | string)[];
  desktop: DesktopDef | null;
}

export interface Manifest {
  version: 1;
  shared: { variations: Record<string, Variation> };
  demos: Demo[];
}

import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const UI_DEMOS = dirname(dirname(fileURLToPath(import.meta.url)));
export const REPO_ROOT = dirname(UI_DEMOS);
export const MANIFEST_PATH = join(UI_DEMOS, "manifest.json");

export function load(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

/** Atomic: a half-written manifest would take the whole review site down. */
export function save(m: Manifest): void {
  const tmp = `${MANIFEST_PATH}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(m, null, 2)}\n`);
  renameSync(tmp, MANIFEST_PATH);
}

/** Inline groups pass through; string entries resolve against `shared`. */
export function resolveVariations(m: Manifest, demo: Demo): Variation[] {
  return demo.variations.map((v) => {
    if (typeof v !== "string") return v;
    const shared = m.shared.variations[v];
    if (!shared) throw new Error(`${demo.id}: unknown shared variation "${v}"`);
    return shared;
  });
}

export function demoByPath(m: Manifest, pathname: string): Demo | undefined {
  const parts = pathname.replace(/^\/+/, "").split("/");
  if (parts[0] !== "ui-demos") return undefined;
  return m.demos.find((d) => d.dir === parts[1]);
}

/** Structural check, run at server startup so a typo fails loudly and early. */
export function validate(m: Manifest): string[] {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const d of m.demos) {
    const at = `demo "${d.id}"`;
    if (seen.has(d.id)) errs.push(`${at}: duplicate id`);
    seen.add(d.id);
    if (!STATUSES.includes(d.status)) errs.push(`${at}: bad status "${d.status}"`);
    for (const v of d.variations) {
      if (typeof v === "string") {
        if (!m.shared.variations[v]) errs.push(`${at}: unknown shared variation "${v}"`);
        continue;
      }
      const ids = v.options.map((o) => o.id);
      if (v.default && !ids.includes(v.default)) {
        errs.push(`${at}: variation "${v.id}" default "${v.default}" is not an option`);
      }
    }
    if (d.desktop && !d.desktop.mountable && d.desktop.default) {
      errs.push(`${at}: cannot default-mount an unmountable demo`);
    }
  }
  return errs;
}
