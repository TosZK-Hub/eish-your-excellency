#!/usr/bin/env python3
"""Cut magenta walk sheets into foot-aligned WebP strips for Khaya Lane."""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "sprites", "gen")
SRC = os.environ.get("ANIM_SRC", "/opt/cursor/artifacts/assets")

# Idle cells that were drawn facing the opposite way from that sheet's walk.
FLIPS = {"char_jersey_anim": (0, 1)}

SHEETS = [
    ("farmer-walk-sheet.jpg", "char_farmer_anim", 256),
    ("doek-walk-sheet.jpg", "char_doek_anim", 256),
    ("gogo-walk-sheet.jpg", "char_gogo_anim", 256),
    ("kid-walk-sheet.jpg", "char_kid_anim", 215),
    ("jersey-walk-sheet.jpg", "char_jersey_anim", 256),
    ("basotho-walk-sheet.jpg", "char_basotho_anim", 256),
    ("taxi-walk-sheet.jpg", "char_taxi_anim", 256),
]


def key_magenta(im):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    bg = px[0, 0]
    seen = bytearray(w * h)
    stack = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for x in range(0, w, 8):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(0, h, 8):
        stack.append((0, y))
        stack.append((w - 1, y))

    def near_bg(r, g, b):
        if g < 150 and r > 140 and b > 100 and (r + b) > g * 2.1:
            return True
        return abs(r - bg[0]) < 36 and abs(g - bg[1]) < 36 and abs(b - bg[2]) < 42

    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h:
            continue
        i = y * w + x
        if seen[i]:
            continue
        r, g, b, a = px[x, y]
        if not near_bg(r, g, b):
            continue
        seen[i] = 1
        px[x, y] = (0, 0, 0, 0)
        stack.append((x + 1, y))
        stack.append((x - 1, y))
        stack.append((x, y + 1))
        stack.append((x, y - 1))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            spill = min(r, b) - g
            if spill > 28 and g < 170:
                fade = max(0, 255 - int((spill - 28) * 5))
                nr = min(r, g + 18)
                nb = min(b, g + 18)
                px[x, y] = (nr, g, nb, fade if fade < a else a)
    return im


def components(im, min_area=80):
    px = im.load()
    w, h = im.size
    seen = bytearray(w * h)
    out = []
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if seen[i] or px[x, y][3] < 24:
                continue
            stack = [(x, y)]
            seen[i] = 1
            cells = []
            minx = maxx = x
            miny = maxy = y
            while stack:
                cx, cy = stack.pop()
                cells.append((cx, cy))
                if cx < minx:
                    minx = cx
                if cx > maxx:
                    maxx = cx
                if cy < miny:
                    miny = cy
                if cy > maxy:
                    maxy = cy
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= w or ny >= h:
                        continue
                    j = ny * w + nx
                    if seen[j] or px[nx, ny][3] < 24:
                        continue
                    seen[j] = 1
                    stack.append((nx, ny))
            if len(cells) >= min_area:
                out.append({"box": (minx, miny, maxx, maxy), "n": len(cells), "cells": cells})
    return out


def merge_parts(parts, gap=36):
    parts = sorted(parts, key=lambda p: p["box"][0])
    merged = []
    for p in parts:
        if not merged:
            merged.append(p)
            continue
        prev = merged[-1]
        x0, y0, x1, y1 = p["box"]
        px0, py0, px1, py1 = prev["box"]
        overlap = min(x1, px1) - max(x0, px0)
        close = x0 - px1 < gap
        if close or overlap > 0:
            prev["cells"].extend(p["cells"])
            prev["n"] += p["n"]
            prev["box"] = (min(px0, x0), min(py0, y0), max(px1, x1), max(py1, y1))
        else:
            merged.append(p)
    return merged


def crop_part(im, part, pad=2):
    x0, y0, x1, y1 = part["box"]
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width - 1, x1 + pad)
    y1 = min(im.height - 1, y1 + pad)
    frame = Image.new("RGBA", (x1 - x0 + 1, y1 - y0 + 1), (0, 0, 0, 0))
    dst = frame.load()
    src = im.load()
    for x, y in part["cells"]:
        dst[x - x0 + (0 if x0 == part["box"][0] else pad), y - y0 + (0 if y0 == part["box"][1] else pad)] = src[x, y]
    # The pad offset above is messy if pad is applied. Place cells directly.
    frame = Image.new("RGBA", (x1 - x0 + 1, y1 - y0 + 1), (0, 0, 0, 0))
    dst = frame.load()
    ox, oy = part["box"][0] - pad, part["box"][1] - pad
    for x, y in part["cells"]:
        dst[x - ox, y - oy] = src[x, y]
    return frame


def foot_center(frame):
    px = frame.load()
    w, h = frame.size
    rows = []
    for y in range(h - 1, -1, -1):
        xs = [x for x in range(w) if px[x, y][3] > 40]
        if xs:
            rows.append(xs)
        if len(rows) >= 10:
            break
    if not rows:
        return w / 2
    flat = [x for row in rows for x in row]
    return sum(flat) / len(flat)


def fit_frame(frame, target_h):
    bb = frame.getchannel("A").getbbox()
    if not bb:
        return Image.new("RGBA", (target_h // 2, target_h), (0, 0, 0, 0))
    frame = frame.crop(bb)
    scale = target_h / frame.height
    nw = max(1, int(round(frame.width * scale)))
    nh = target_h
    return frame.resize((nw, nh), Image.Resampling.LANCZOS)


def pack(frames, target_h):
    fitted = [fit_frame(f, target_h) for f in frames]
    anchors = [foot_center(f) for f in fitted]
    need = 4
    for frame, anchor in zip(fitted, anchors):
        need = max(need, anchor, frame.width - anchor)
    cell_w = int(need * 2) + 16
    cell_h = target_h + 6
    sheet = Image.new("RGBA", (cell_w * len(fitted), cell_h), (0, 0, 0, 0))
    for i, frame in enumerate(fitted):
        left = int(round(i * cell_w + cell_w / 2 - anchors[i]))
        top = cell_h - frame.height - 2
        sheet.alpha_composite(frame, (left, top))
    return sheet, cell_w, cell_h


def hen_sheet():
    src = Image.open(os.path.join(OUT, "animal_hen.webp")).convert("RGBA")
    w, h = src.size
    rest = src
    peck = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = src.load()
    out = peck.load()
    neck = int(h * 0.42)
    pivot_x = w * 0.48
    pivot_y = h * 0.46
    import math
    ang = math.radians(16)
    ca, sa = math.cos(ang), math.sin(ang)
    for y in range(h):
        for x in range(w):
            if y < neck:
                dx, dy = x - pivot_x, y - pivot_y
                sx = pivot_x + dx * ca + dy * sa
                sy = pivot_y - dx * sa + dy * ca
            else:
                sx, sy = x, y
            x0, y0 = int(sx), int(sy)
            if x0 < 0 or y0 < 0 or x0 >= w or y0 >= h:
                continue
            out[x, y] = px[x0, y0]
    # Two cells, foot aligned, same height as the source.
    sheet, cw, ch = pack([rest, peck], h)
    path = os.path.join(OUT, "animal_hen_anim.webp")
    sheet.save(path, "WEBP", quality=76, method=6)
    print(f"hen {sheet.size} -> {os.path.getsize(path)}")


def main():
    preview = Image.new("RGBA", (1600, 900), (196, 214, 150, 255))
    draw = ImageDraw.Draw(preview)
    y_cursor = 16
    for fname, out_name, target_h in SHEETS:
        path = os.path.join(SRC, fname)
        if not os.path.exists(path):
            # generator saved jpg even when we asked for png
            alt = path.replace(".jpg", ".png")
            path = alt if os.path.exists(alt) else path
        raw = Image.open(path)
        keyed = key_magenta(raw)
        parts = sorted(components(keyed), key=lambda p: p["box"][0])
        # A loose prop (keys, a dirt clod) joins the figure it overlaps.
        bodies = [p for p in parts if p["n"] > 4000]
        specks = [p for p in parts if p["n"] <= 4000]
        for speck in specks:
            sx = (speck["box"][0] + speck["box"][2]) / 2
            host = min(bodies, key=lambda b: abs((b["box"][0] + b["box"][2]) / 2 - sx))
            host["cells"].extend(speck["cells"])
            hb = host["box"]
            sb = speck["box"]
            host["box"] = (min(hb[0], sb[0]), min(hb[1], sb[1]), max(hb[2], sb[2]), max(hb[3], sb[3]))
        parts = bodies
        print(f"{fname}: {len(parts)} figures")
        if len(parts) != 8:
            raise SystemExit("expected 8 figures in " + fname)
        frames = [crop_part(keyed, p) for p in parts]
        for idx in FLIPS.get(out_name, ()):
            frames[idx] = frames[idx].transpose(Image.FLIP_LEFT_RIGHT)
        sheet, cw, ch = pack(frames, target_h)
        dest = os.path.join(OUT, out_name + ".webp")
        sheet.save(dest, "WEBP", quality=72, method=6)
        print(f"  {out_name} {sheet.size} cells {len(frames)} cell {cw}x{ch} bytes {os.path.getsize(dest)}")
        # preview row at ~56px
        scale = 56 / ch
        small = sheet.resize((max(1, int(sheet.width * scale)), 56), Image.Resampling.BILINEAR)
        preview.alpha_composite(small, (12, y_cursor))
        draw.line((8, y_cursor + 54, 1580, y_cursor + 54), fill=(80, 50, 30, 255))
        draw.text((12, y_cursor + 58), out_name, fill=(40, 24, 16, 255))
        y_cursor += 78
    hen_sheet()
    preview_path = "/tmp/khaya-anim-preview.png"
    preview.convert("RGB").save(preview_path, "PNG")
    print("preview", preview_path)


if __name__ == "__main__":
    main()
