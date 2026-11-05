# EISH! Ways to Go
Rapid-fire, cute and silly South African microgame chaos. 24 one-thumb microgames, 3 lives, speed rises every round, boss rounds every 10th. Every fail is a cartoon "way to go" sticker for your album. Free, offline (service worker), tiny, fictional.

Play: https://toszk-hub.github.io/eish-your-excellency/

Debug: `?mg=<id>&sp=1.8` plays one microgame; `?mg=survival` / `?mg=daily` start runs; `?death=<id>` shows a death screen; `&bot=1` lets the built-in bot play.
IDs: pothole, lights, uncle, change, mozzie, snack, koeksister, rugby, fence, lolly, mud, unplug, salt, umbrella, carseat, sauce, wors, quantum, candle, vuvu, hawker, door, braai, spaza.

Build: `./build.sh` concatenates `src/*.js` into `game.js`.

## v0.4 - Sticker Collage vertical slice
- All 6 cast members are rigged sticker cut-outs (`art/<who>-calm|panic.webp`): head/body parts, die-cut white border, baked drop shadow, pop-in, wobble, paper squash, 12 fps stop-motion timing, calm/panic expression swap. Canvas beans remain as fallback.
- Re-skinned: Rescue the Wors (`?mg=wors`) and Taxi Rank Crossing (`?mg=quantum`, now 4 lanes) with layered photo-texture backgrounds, tape and marker accents, plus their deaths.
- Menu/UI: kraft-paper background, cut-out title letters, sticker buttons, original beadwork/Ndebele-inspired pattern bands.
- Art is ~550 KB WebP, cached offline by the service worker (`ewg-v5`). Packed as base64 tars in `art/pack*.b64` and unpacked by the Pages workflow at deploy time.


## v0.5 — slice quality pass
- Characters rebuilt as one vector sticker-puppet rig (shared skeleton, separate limbs, die-cut outline, ink line, halftone shade) with eased pose blending, squash/stretch and 12 fps stop-motion stepping. `?sheet=1` shows the model sheet.
- Vector props (wors, dog, fictional minibus taxi), calmer backgrounds with clear focal areas.
- Juice: paper-tear transitions, impact frames, confetti, speed lines, shake, sticker HUD, bead-band timer.
- Debug: `?death=dog|flat` jumps to a death screen.
- Fonts: Luckiest Guy and Permanent Marker (both Apache License 2.0), ASCII-subset WOFF in `art/`.

## v0.6 — performance pass
- Rig groups (head, torso, hands, shoes, props), dog, taxi and wors pre-rendered into an LRU ImageBitmap sprite cache; limbs stay live.
- Backgrounds on a separate canvas layer redrawn only on change; HUD timer strip, bead pattern, text strips and captions cached.
- Shadows merged into sprites (no per-frame shadow passes); halftone baked into sprites.
- Canvas backing capped at DPR 2 with adaptive quality (drops when frame EMA > 20 ms, persisted in localStorage `ewg_q`).
- Menu animation redraws only on 12 fps frame changes. Cache bumped to ewg-v7.

## v1.0 — full game
- All 16 original microgames ported to the sticker rig with polished death vignettes; Taxi Rank death redrawn; difficulty rebalanced (salt stays easy); varied verbs (CATCH, SWAT, DIP, DUCK, ROCK, SHAKE, HOLD...).
- 6 new microgames: Candle (hold through gusts), Vuvuzela (rhythm), Robot Hawker (swipe offers away), Taxi Door (drag against the spring), Fan the Braai (draw circles), Spaza Queue (tap the list in order).
- Meta: 3-card onboarding, game-over screen with new-sticker reveal, sticker album with replayable death vignettes, cosmetic hats wardrobe, daily seeded set with streak, settings (sound, music, vibration, reduced motion), haptics, more SFX and music variants.
- Share card (1080x1350 PNG via Web Share, download fallback).
- PNG icons 48-512 plus maskable 192/512, manifest polish, splash; cache `ewg-v8`.
- Android: offline WebView debug APK built from `android/` (see `docs/PLAY_STORE.md`).
- QA: bot wins every game at speeds 1.0/1.8/2.6/3.1, no console errors, ≥45 fps on every screen under 6x CPU throttle.
