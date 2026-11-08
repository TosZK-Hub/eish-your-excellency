# EISH! Jozi Run

An original three-lane runner set on a Johannesburg street. This branch replaces the microgame set with one playable run so the new direction can be reviewed before anything replaces production.

Production Pages is unchanged. Do not treat this branch as the live game.

## Play

Open `index.html` (after `./build.sh` if you changed `src/`). Pick a runner, then a mode.

- **Jozi Run** — endless. Distance and coins. A bead bracelet absorbs one hit.
- **Taxi Rush** — 75 seconds. Run through waving passengers to bank fares. A crash costs time, not the whole shift. The clock ending is you making the rank.
- **Green Robot** — the open boom is the only safe lane. Three wrong robots end the run. Hurdles between robots are lighter.

Swipe, or the arrow keys / WASD. Up jumps drums, barriers and potholes. Down slides under signs, scaffolds and branches. Esc pauses. On-screen arrows are there for a thumb that does not want to swipe.

A kota pulls coins in for a few seconds. The road paints the next verb: gold marks a jump, blue a slide, red a taxi.

`?bot=1&play=1&mode=rush&seed=3&mute=1` lets the built-in runner drive. `?sheet=1` is the pose sheet. `?freeze=2` holds a frame a couple of seconds in.

## Layout

- `src/00-logic.js` — modes, fair chunks, collision. No drawing. `node tools/sim-runner.js` checks it.
- `src/10-art.js` — Lerato, Jabu, Naledi, taxis and street props.
- `src/15-world.js` — trailing camera, street, HUD.
- `src/20-main.js` — input, sound, screens.

`./build.sh` writes `game.js`. Lane positions live in `EISH.LANE_X`. The camera fit lives in `camera()` in `src/15-world.js`. Obstacle patterns and the gap between them live in `src/00-logic.js`.

Sound is a small original loop made in the browser. Nothing here is a commercial runner's characters, name, or music.

The illustrated microgame art is still in `art/` from the previous build. This mode does not load it.
