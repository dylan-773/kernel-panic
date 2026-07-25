#!/usr/bin/env python3
"""Snap a generated image to a true pixel grid on a tight palette.

The Kernel Panic art pipeline: generators (Higgsfield nano_banana_pro) output
high-res pixel-art-STYLE images with irregular "pixels"; this post-pass makes
them pixel-native. Nearest-neighbor downscale to the target grid, then
adaptive-palette quantize. Output lands at ~25KB and reads as hand-placed
pixels at game size.

Usage:
  pxpost.py in.png out.png --width 64            # downscale to 64px wide
  pxpost.py in.png out.png --scale 4             # or divide dimensions by 4
  pxpost.py in.png out.png --width 192 --colors 24
"""
from PIL import Image
import argparse
import os

p = argparse.ArgumentParser()
p.add_argument("src")
p.add_argument("dst")
p.add_argument("--width", type=int, default=0, help="target pixel width (keeps aspect)")
p.add_argument("--scale", type=int, default=4, help="divisor when --width not given")
p.add_argument("--colors", type=int, default=24, help="adaptive palette size")
a = p.parse_args()

im = Image.open(a.src).convert("RGB")
w, h = im.size
if a.width:
    tw = a.width
    th = max(1, round(h * a.width / w))
else:
    tw, th = max(1, w // a.scale), max(1, h // a.scale)

im = im.resize((tw, th), Image.NEAREST)
im = im.quantize(colors=a.colors, method=Image.MEDIANCUT)

dst_dir = os.path.dirname(os.path.abspath(a.dst))
os.makedirs(dst_dir, exist_ok=True)
im.save(a.dst, optimize=True)
print(f"{a.dst}: {tw}x{th}, <= {a.colors} colors, {os.path.getsize(a.dst)} bytes")
