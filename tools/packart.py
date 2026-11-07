#!/usr/bin/env python3
"""Key cyan-backed illustrations and resize painted backgrounds into art/."""
import json, os
from PIL import Image
import numpy as np

SRC = "/opt/cursor/artifacts/assets"
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "art")

def is_cyan(rgb):
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    return (b > 150) & (g > 140) & (r < 130) & ((b - r) > 70) & ((g - r) > 55)

def connected_bg(mask):
    h, w = mask.shape
    bg = np.zeros((h, w), np.bool_)
    bg[0, :] = mask[0, :]
    bg[-1, :] = mask[-1, :]
    bg[:, 0] = mask[:, 0]
    bg[:, -1] = mask[:, -1]
    for _ in range(max(h, w)):
        prev = bg
        dil = bg.copy()
        dil[1:, :] |= bg[:-1, :]
        dil[:-1, :] |= bg[1:, :]
        dil[:, 1:] |= bg[:, :-1]
        dil[:, :-1] |= bg[:, 1:]
        bg = dil & mask
        if np.array_equal(bg, prev):
            break
    return bg

def key_image(im):
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3]
    mask = is_cyan(rgb)
    bg = connected_bg(mask)
    # eat a 1px cyan fringe, keep the ink line
    dil = bg.copy()
    dil[1:, :] |= bg[:-1, :]
    dil[:-1, :] |= bg[1:, :]
    dil[:, 1:] |= bg[:, :-1]
    dil[:, :-1] |= bg[:, 1:]
    fringe = dil & ~bg & mask
    arr[:, :, 3] = np.where(bg | fringe, 0, 255).astype(np.uint8)
    # despill on remaining edge pixels
    edge = (arr[:, :, 3] == 255) & dil
    r = arr[:, :, 0].astype(np.int16)
    arr[:, :, 1] = np.where(edge, np.minimum(arr[:, :, 1], r + 18), arr[:, :, 1])
    arr[:, :, 2] = np.where(edge, np.minimum(arr[:, :, 2], r + 24), arr[:, :, 2])
    return Image.fromarray(arr)

def anchors(alpha):
    ys, xs = np.where(alpha > 24)
    if len(xs) == 0:
        return None
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    sub = alpha[y0:y1 + 1, x0:x1 + 1]
    h, w = sub.shape
    # Feet: lowest pixels in the middle half, so a stick or ball at the side does not become the ground.
    c0, c1 = int(w * 0.30), int(w * 0.70)
    mid = sub[:, c0:c1]
    mrows = np.where((mid > 24).any(1))[0]
    if len(mrows) == 0:
        mrows = np.where((sub > 24).any(1))[0]
    foot_row = int(mrows[-1])
    y_from = max(0, foot_row - max(2, int(h * 0.04)))
    fcols = np.where((mid[y_from:foot_row + 1] > 24).any(0))[0]
    fx = float(fcols.mean() + c0) / w if len(fcols) else 0.5
    fy = float(foot_row) / max(1, h - 1)
    # Crown: top of a narrow center column, so raised arms do not steal the hat.
    k0, k1 = int(w * 0.42), int(w * 0.58)
    crown = sub[:, k0:k1]
    crows = np.where((crown > 24).any(1))[0]
    if len(crows):
        hy = float(crows[0]) / h
        cc = np.where(crown[int(crows[0])] > 24)[0]
        hx = float(cc.mean() + k0) / w if len(cc) else 0.5
    else:
        hy, hx = 0.08, 0.5
    return x0, y0, x1 + 1, y1 + 1, fx, fy, hx, hy

def save_webp(im, path, q):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=q, method=4)

def main():
    manifest = {}
    total = 0
    files = sorted(os.listdir(SRC))
    for name in files:
        if not name.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        stem = os.path.splitext(name)[0]
        src = os.path.join(SRC, name)
        im = Image.open(src)
        if stem.startswith("bg-"):
            key = stem[3:]
            im = im.convert("RGB")
            w = 540
            h = round(im.height * w / im.width)
            im = im.resize((w, h), Image.Resampling.LANCZOS)
            path = os.path.join(ROOT, "bg", key + ".webp")
            save_webp(im, path, 66)
            manifest["bg/" + key] = {"bw": w, "bh": h, "fx": 0.5, "fy": 0.5, "hx": 0.5, "hy": 0.2}
        else:
            if stem.startswith("prop-"):
                kind, ident = "prop", stem[5:]
                height = 420
                q = 76
            else:
                kind, ident = "cast", stem  # boet-calm
                height = 640
                q = 74
            rgba = key_image(im)
            arr = np.array(rgba)
            box = anchors(arr[:, :, 3])
            if not box:
                print("EMPTY", name)
                continue
            x0, y0, x1, y1, fx, fy, hx, hy = box
            pad = 2
            x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
            x1 = min(arr.shape[1], x1 + pad); y1 = min(arr.shape[0], y1 + pad)
            crop = rgba.crop((x0, y0, x1, y1))
            sc = height / crop.height
            crop = crop.resize((max(1, round(crop.width * sc)), height), Image.Resampling.LANCZOS)
            if kind == "cast":
                who, pose = ident.rsplit("-", 1)
                if who == "jabu":
                    who = "gaatjie"
                path = os.path.join(ROOT, "cast", who + "-" + pose + ".webp")
                mkey = "cast/" + who + "/" + pose
            else:
                path = os.path.join(ROOT, "prop", ident + ".webp")
                mkey = "prop/" + ident
            save_webp(crop, path, q)
            manifest[mkey] = {"bw": crop.width, "bh": crop.height, "fx": fx, "fy": min(0.995, fy), "hx": hx, "hy": hy}
        total += os.path.getsize(path)
        print(f"{os.path.getsize(path):7d}  {os.path.relpath(path, ROOT)}")
    man_path = os.path.join(ROOT, "manifest.json")
    with open(man_path, "w") as f:
        json.dump(manifest, f, separators=(",", ":"))
    print("TOTAL", total, "files", len(manifest), "manifest", os.path.getsize(man_path))

if __name__ == "__main__":
    main()
