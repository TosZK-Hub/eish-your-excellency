# EISH! Ways to Go
Rapid-fire South African microgame chaos. 16 one-thumb microgames (3-5 s each), 3 lives, speed rises every round, boss-speed every 10th round. Every fail is a cute cartoon "way to go"; collect all 16 deaths. Original WebAudio jingle with mute. Free, offline (service worker), no external assets, fictional.

Play: https://toszk-hub.github.io/eish-your-excellency/

Debug: `?mg=<id>` plays one microgame (`&sp=1.8` for speed); `?mg=survival` jumps into a run.
IDs: pothole, lights, uncle, change, mozzie, snack, rugby, fence, lolly, wors, mud, unplug, quantum, salt, umbrella, carseat, sauce, koeksister.

## v0.4 - Sticker Collage vertical slice
- All 6 cast members are rigged sticker cut-outs (`art/<who>-calm|panic.webp`): head/body parts, die-cut white border, baked drop shadow, pop-in, wobble, paper squash, 12 fps stop-motion timing, calm/panic expression swap. Canvas beans remain as fallback.
- Re-skinned: Rescue the Wors (`?mg=wors`) and Taxi Rank Crossing (`?mg=quantum`, now 4 lanes) with layered photo-texture backgrounds, tape and marker accents, plus their deaths.
- Menu/UI: kraft-paper background, cut-out title letters, sticker buttons, original beadwork/Ndebele-inspired pattern bands.
- Art is ~550 KB WebP, cached offline by the service worker (`ewg-v5`). Packed as base64 tars in `art/pack*.b64` and unpacked by the Pages workflow at deploy time.
