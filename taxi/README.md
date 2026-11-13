# Taxi Rank Rush

A one-thumb minibus-taxi rank puzzle. Taxis face a direction on a grid. Tap one and it drives out if the lane is clear, then pulls into a loading bay. Passengers board a bay of their colour. A full taxi leaves. You lose if every bay is full and nobody can board. You win when the queue is empty.

This folder is the whole game. It does not touch the rest of the repo, and GitHub Pages only publishes `main`, so a branch preview stays offline from the live site.

## Play locally

Serve this folder over HTTP (modules and the service worker need it):

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/`. Portrait, about 9:16, comfortable from 360px to 430px wide. It runs offline after the first load (`sw.js` is scoped to `taxi/`). Progress, coins, and the equipped livery live in `localStorage` under `trr_save_v1`.

Debug flags:

- `?level=N` jumps to a campaign level
- `?daily=1` opens today's Rush Hour
- `?reset=1` clears the save
- `?bot=1` plays the known solution (with `?level=`)
- `?lose=1` opens the lose panel
- `?mute=1` starts silent
- `?nosw=1` skips the service worker

## What's in the box

- Phaser 4.2.1 MIT, vendored at `vendor/phaser.min.js` (no runtime CDN)
- Fredoka and Nunito, SIL OFL, self-hosted in `assets/fonts/`
- 60 seeded levels in `data/levels.json`
- Generator and breadth-first solver in `src/engine.js` (no Phaser, so Node can prove them)
- Combi art in `assets/art/` (v3 WebP). One sprite per facing, listed in `assets/art/manifest.json`. Do not rotate them.
- Six cosmetic liveries bought with coins. Rewarded boosters are a fake "watch ad" dialog, not an ad SDK
- Daily Rush Hour seeded by the local date, with an emoji-grid share

Twists: tarp taxis (`?`), hand-brake taxis (two taps), a gaartjie who jumps the queue, and grey spares that never fill.

## Reskin

`src/theme.js` holds the name, copy, palette, and colour ids. Art files are swappable PNGs with stable manifest keys (taxi per colour, livery overlays, passenger per colour, rank, bays, icons). Replacing those two is enough for a later "City Rush" skin.

## Checks

```bash
node tools/make-levels.mjs
node tools/verify-levels.mjs
node tools/make-art.mjs
node tools/cache-manifest.mjs
```

`verify` replays each guide and independently solves all 60 levels plus a week of daily puzzles.
