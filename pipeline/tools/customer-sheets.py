#!/usr/bin/env python3
"""Compose the overworld customer walk sheets from PixelLab exports.

Each sheet is 8 rows (direction order matches scene.ts DIRS) x 8 columns of
48x48 frames. Directions with a generated walk use its 8 frames; the rest
repeat the standing rotation, so the engine can address any row safely.

Usage: python3 customer-sheets.py [id ...]   (default: all twelve)
"""
import io
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

from PIL import Image

DIRS = ["south", "south-east", "east", "north-east", "north", "north-west", "west", "south-west"]

CHARACTERS = {
    "juno-vex": "9708c0c5-c4bb-491d-a2a3-029e323ecc96",
    "sable-okonkwo": "3f7b7828-a5cb-4510-901c-00a366689a6e",
    "aldous-wick": "824bd306-7815-483f-a111-c8b36ca07b30",
    "wren-tallis": "e72d4b61-ad42-42a8-b392-5aab04af3497",
    "bram-hollander": "3249dd50-fbab-4482-acaa-8f4c4411c29e",
    "dex-marlowe": "3a30f07b-5516-4000-b3db-e3f9affb73bc",
    "june-aksoy": "8ea0ba83-5348-43c2-b766-a31c823e4ac5",
    "ines-calloway": "32fe1635-5b6b-4b8a-92d9-4301bef2617f",
    "emeric-snow": "201ba059-b02d-405a-8e18-0ef37a5e966c",
    "vera-stanek": "c176d82c-7d24-42c4-8f87-ec3faefa7cc3",
    "casimir-bell": "167d4abc-968f-45f1-a301-21eb34986a7c",
    "noor-behzadi": "b01d50af-ab2e-4a98-b2dc-373795c07246",
}

OUT = Path(__file__).resolve().parents[2] / "kernel-panic-site/app/public/assets/overworld/customers"
FRAME = 48


def fetch_zip(char_id: str) -> zipfile.ZipFile:
    url = f"https://api.pixellab.ai/mcp/characters/{char_id}/download"
    data = subprocess.check_output(["curl", "-sL", url])
    return zipfile.ZipFile(io.BytesIO(data))


def compose(name: str, char_id: str) -> bool:
    zf = fetch_zip(char_id)
    names = zf.namelist()

    def load(path: str) -> Image.Image | None:
        if path not in names:
            return None
        with zf.open(path) as f:
            return Image.open(io.BytesIO(f.read())).convert("RGBA")

    state = names[0].split("/")[0] if names else "Idle"
    sheet = Image.new("RGBA", (FRAME * 8, FRAME * 8), (0, 0, 0, 0))
    missing_rot = 0
    for row, d in enumerate(DIRS):
        rot = load(f"{state}/rotations/{d}.png")
        if rot is None:
            missing_rot += 1
            continue
        frames = []
        for i in range(8):
            fr = load(f"{state}/animations/walk/{d}/frame_{i:03d}.png")
            if fr is None:
                break
            frames.append(fr)
        if len(frames) < 8:
            frames = [rot] * 8
        for col, fr in enumerate(frames):
            fr = fr.resize((FRAME, FRAME), Image.NEAREST) if fr.size != (FRAME, FRAME) else fr
            sheet.paste(fr, (col * FRAME, row * FRAME), fr)
    if missing_rot == len(DIRS):
        print(f"  {name}: no rotations yet, skipped")
        return False
    OUT.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT / f"{name}-walk.png", optimize=True)
    print(f"  {name}: sheet written ({8 - missing_rot} directions)")
    return True


def main() -> None:
    targets = sys.argv[1:] or list(CHARACTERS)
    done = 0
    for name in targets:
        cid = CHARACTERS.get(name)
        if not cid:
            print(f"  {name}: unknown id")
            continue
        try:
            if compose(name, cid):
                done += 1
        except Exception as e:  # noqa: BLE001
            print(f"  {name}: failed ({e})")
    print(f"{done}/{len(targets)} sheets composed -> {OUT}")


if __name__ == "__main__":
    main()
