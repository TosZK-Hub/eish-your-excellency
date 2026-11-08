# EISH! Jozi Run

An original three-lane runner on a Johannesburg street, drawn in real-time 3D. This branch is a review build. Production Pages is unchanged.

## Play

Open `index.html`. Pick Lerato, Jabu, or Naledi, then a mode.

- **Jozi Run** — endless. Distance and coins. A bead bracelet absorbs one hit.
- **Taxi Rush** — 75 seconds. Run through waving passengers to bank fares. A crash costs time. The clock ending is you making the rank.
- **Green Robot** — the open boom is the only safe lane. Three wrong robots end the run.

Swipe, or the arrow keys / WASD. Up jumps. Down slides. The II button pauses. On-screen arrows sit under the road.

`?bot=1&play=1&mode=robot&seed=3&mute=1` lets the built-in runner drive. `?freeze=1` holds a frame. `?pause=1` opens the pause card.

If WebGL cannot start, the page says so instead of a blank canvas.

## Layout

- `src/00-logic.js` — modes, fair chunks, collision. No drawing. `node tools/sim-runner.js` checks it.
- `src/10-art.js` — jointed 3D cast and props (capsules, lathe torso, taxis, booms).
- `src/15-world.js` — Three.js scene, following camera, lit street.
- `src/20-main.js` — input, sound, HTML UI.
- `boot.js` — loads Three.js, then the game.
- `vendor/three.module.js` — Three.js r170, MIT. See the license header in that file.
- `tools/rig-check.mjs` — checks the runners are solid meshes with a real height, without WebGL.

`./build.sh` writes `game.js`. Lane positions live in `EISH.LANE_X`. The camera sits in `frameCamera()` in `src/15-world.js`. Buildings are inset to `BUILD_INSET` so a near wall stays beside the road instead of filling the lens.

The picture is original: three runners, a minibus, jacarandas, and shopfronts (Kota, Rank, Sharp, Beads). It does not use another runner's characters, name, or music. Sound is a small loop made in the browser.

The old microgame pictures in `art/` are not loaded.

## Licenses

- Game code in this repo: the project's own code.
- [Three.js](https://threejs.org/) r170, `vendor/three.module.js`: MIT, Copyright 2010-2024 Three.js Authors. The license text is at the top of that file.
- No paid assets, accounts, or external services.
