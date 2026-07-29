#!/usr/bin/env python3
"""1-bit dither post-pass for KP/OS window imagery (the kpos-shell v2 look).

Generators (Higgsfield nano_banana / nano_banana_pro, anime OVA ink style)
output high-res tonal images; this pass turns them into strict 1-bit
monochrome prints sized so ONE dither dot maps to ONE CSS pixel of the
target cell. The app tints them to the live ink via grayscale + multiply
blend, so output stays pure black/white, never colored.

Recipes (from ui-demos/kpos-shell, hard-won bounds - do not improvise):
  fine   autocontrast, gamma 0.85 shadow lift, Floyd-Steinberg 1-bit.
         Cleanest print; the default for busy or mid-tone scenes and lineart.
  heavy  same, but highlights compressed to 185 with blacks KEPT at 0 before
         dithering, so flats screentone while linework stays solid. Never
         compress blacks upward on line art: 60..200 floods it to mush.
  bayer  gamma 0.7 then an ordered 8x8 Bayer matrix. The patterned print.
Rules: resize to the EXACT inner CSS pixel size of the destination cell
(--width, optionally --height with center crop); never re-dither at higher
res and downscale (mushes to grey); never go coarser than the 1:1 grid.
--invert AFTER the tone map for schematic/plate art (luminous lines on void).

Usage:
  dither.py raw.png done.png --width 304 --variant fine
  dither.py raw.png done.png --width 162 --height 234 --variant fine
  dither.py raw.png done.png --width 304 --variant heavy --invert
"""
from PIL import Image, ImageOps
import argparse

BAYER8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
]

p = argparse.ArgumentParser()
p.add_argument("src")
p.add_argument("dst")
p.add_argument("--width", type=int, required=True, help="exact target pixel width (the cell's inner CSS width)")
p.add_argument("--height", type=int, default=0, help="optional exact height; scales to cover then center-crops")
p.add_argument("--variant", choices=["fine", "heavy", "bayer"], default="fine")
p.add_argument("--invert", action="store_true", help="invert after tone map (schematic plates: lines on void)")
a = p.parse_args()

im = Image.open(a.src).convert("L")
im = ImageOps.autocontrast(im)

gamma = 0.7 if a.variant == "bayer" else 0.85
im = im.point([round(255 * ((i / 255) ** gamma)) for i in range(256)])

if a.variant == "heavy":
    im = im.point([round(i * 185 / 255) for i in range(256)])

if a.invert:
    im = ImageOps.invert(im)

w, h = im.size
if a.height:
    scale = max(a.width / w, a.height / h)
    im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    rw, rh = im.size
    left = (rw - a.width) // 2
    top = (rh - a.height) // 2
    im = im.crop((left, top, left + a.width, top + a.height))
else:
    im = im.resize((a.width, max(1, round(h * a.width / w))), Image.LANCZOS)

if a.variant == "bayer":
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            px[x, y] = 255 if px[x, y] > BAYER8[y % 8][x % 8] * 4 else 0
    out = im.convert("1")
else:
    out = im.convert("1")  # PIL default = Floyd-Steinberg

out.save(a.dst, optimize=True)
print(f"{a.dst}: {out.size[0]}x{out.size[1]} 1-bit {a.variant}{' inverted' if a.invert else ''}")
