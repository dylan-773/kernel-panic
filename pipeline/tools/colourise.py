#!/usr/bin/env python3
"""FULL COLOUR treatment for KP/OS window imagery (RULINGS.md law 5).

Same generator loadout-eva used for the bench feed, retuned for paper
scans: the source art is monochrome ink, so this is a COLOURISATION and
not a reveal. Gradient-map the raw greyscale through a lit-desk palette
(cool ink shadow -> aged paper mid -> lamp highlight), add a warm radial
lift where the bench lamp sits, then Floyd-Steinberg dither to a
16-colour adaptive palette AT THE FINAL SIZE so it still reads as a
dithered frame rather than a photograph.
"""
from PIL import Image, ImageOps
import numpy as np
import argparse

# lit-desk ramp: cool ink shadow, aged paper mid, warm lamp highlight
RAMPS = {
    "paper": [(0.00, (22, 30, 44)), (0.34, (86, 78, 78)), (0.62, (168, 150, 118)),
              (0.84, (226, 205, 158)), (1.00, (255, 246, 220))],
    # the inverted device plate: luminous lines on void, so the ramp runs
    # from a cold dead void up through instrument amber
    "plate": [(0.00, (8, 10, 16)), (0.40, (40, 34, 30)), (0.70, (150, 92, 30)),
              (0.88, (233, 160, 56)), (1.00, (255, 226, 168))],
}


def gradient_map(gray, ramp):
    stops = np.array([s for s, _ in ramp])
    cols = np.array([c for _, c in ramp], dtype=float)
    x = gray.astype(float) / 255.0
    out = np.zeros(x.shape + (3,), dtype=float)
    for ch in range(3):
        out[..., ch] = np.interp(x, stops, cols[:, ch])
    return out


def lamp_lift(shape, cx=0.26, cy=0.16, radius=0.95, strength=34.0):
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx / w) - cx) ** 2 + ((yy / h) - cy) ** 2) / radius
    fall = np.clip(1.0 - d, 0.0, 1.0) ** 2
    lift = np.zeros((h, w, 3))
    lift[..., 0] = fall * strength
    lift[..., 1] = fall * strength * 0.72
    lift[..., 2] = fall * strength * 0.34
    return lift


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--width", type=int, required=True)
    ap.add_argument("--height", type=int, required=True)
    ap.add_argument("--ramp", default="paper")
    ap.add_argument("--invert", action="store_true")
    ap.add_argument("--colors", type=int, default=16)
    a = ap.parse_args()

    im = Image.open(a.src).convert("L")
    # exact target size with a centre crop, same arithmetic as dither.py
    im = ImageOps.fit(im, (a.width, a.height), method=Image.LANCZOS, centering=(0.5, 0.5))
    im = ImageOps.autocontrast(im, cutoff=1)
    g = np.array(im, dtype=float)
    g = 255.0 * (g / 255.0) ** 0.85
    if a.invert:
        g = 255.0 - g

    rgb = gradient_map(g, RAMPS[a.ramp])
    rgb = np.clip(rgb + lamp_lift(g.shape), 0, 255).astype(np.uint8)
    col = Image.fromarray(rgb, "RGB")

    # adaptive 16-colour palette, Floyd-Steinberg: still a dithered frame
    out = col.quantize(colors=a.colors, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
    out.convert("RGB").save(a.dst)
    print(f"{a.dst}: {a.width}x{a.height} {a.colors}-colour {a.ramp}{' inverted' if a.invert else ''}")


main()
