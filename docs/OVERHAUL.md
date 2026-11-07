# EISH! Ways to Go — illustrated overhaul

This is a gameplay and art rebuild of the playable game. It is not a score. Production Pages was not updated.

## What changed

The vector sticker-puppet is gone. The six characters are painted illustrations. Each active verb has at least one action drawing (crouch, air, land, reach, fan, pull, lean, toot, sit, shove, slam, cup, swat, flip, pinch) played as a short clip: the wind-up drawing, then the action drawing, then the settle. Scale stays at 1. A dragged character still lags the finger. Backgrounds paint once onto a second canvas. Taxi Rank is a flat side-on street with closed vans in cream, blue and orange cut from one drawing. The shut-door result is that same van with the door closed.

The roster is **12 games**, chosen so each one is a different physical verb. Salt stays the approachable one.

| ID | Verb | What you actually do |
|----|------|----------------------|
| salt | LET GO | Hold the shaker, release inside the green band |
| quantum | HOP | Swipe up only when the next lane is lit |
| wors | SNATCH | Drag Uncle onto the wors before the dog |
| door | SLAM | Grab the door and drag it shut against the spring |
| pothole | STEER | Drag the bakkie; holes grow as they approach |
| candle | CUP | Hold only while the wind crosses the flame |
| braai | FAN | Move inside the ring; the petrol can is a fail |
| vuvu | TOOT | Tap when the note sits in the ring |
| fence | PULL | Drag Uncle back into the safe patch |
| carseat | COVER | Drag the paper onto the seat, then tap |
| mozzie | SWIPE | Swipe through the ring when it pops |
| lights | FLIP | Swipe down the switch that is sparking |

Retired from the rotation, captions kept if you already earned them: uncle, change, snack, koeksister, rugby, lolly, mud, unplug, umbrella, sauce, hawker, spaza.

## Tests

Internal step simulation (bot, 30Hz, no drawing advantage): 12 games × speeds 1 / 1.8 / 2.6 × seeds 1 / 7 / 21 / 42 = **144/144 wins**.

Independent driver afterwards, in a real Chrome page, reading only `game.pub` (the positions and meters that are drawn) and sending real mouse events. Internal bot switched off with `fair=1`. Speeds 1 and 2.6, seeds 4 and 9: **24/24 wins**.

Letting go of the salt immediately: **fail**, as it should. A 4-game survival with the built-in bot scored 4. Reduced-motion and mute survive a reload. After the service worker activated, a reload with the network forced offline still reached the ready screen. No page errors in that run.

## Performance

Measured in headless desktop Chrome, viewport 390×844, `Emulation.setCPUThrottlingRate` for the 6× pass. Frame times are `requestAnimationFrame` deltas while Taxi Rank was playing.

| | n | mean | p50 | p95 | p99 | max |
|--|--:|--:|--:|--:|--:|--:|
| Unthrottled | 150 | 16.67 ms | 16.7 | 16.7 | 16.8 | 16.8 |
| 6× CPU | 150 | 16.78 ms | 16.7 | 16.7 | 16.8 | 33.3 |

The 6× pass did **not** pull this machine off vsync, apart from one 33 ms frame. That means the VM still had CPU to spare. It is not a low-end phone result, and it should not be quoted as one. One input sample (pointerdown to the frame that consumed it) was 15 ms; the salt round ended before a real distribution was collected.

Backing DPR cap is 1.75 and still drops when the frame average goes over 22 ms (`ewg_q`). Backgrounds are not redrawn every frame. Characters and props are single `drawImage` calls from bitmaps decoded up front.

Illustrated art on disk is about **2.3 MB** of WebP, cached by `ewg-v11`.

## Honest visual notes

What holds up: the cast reads as one picture-book family; Salt, the candle room, the braai yard and the FLAT! death are composed scenes rather than diagrams; the green band, the safe patch, the sparking switch and the note ring are visible rules.

What is still weak:

- These are authored pose drawings, not a frame-by-frame limb cycle. Braai alternates two fan drawings. Salt holds one pinch drawing. Pothole swaps two leans. A short crossfade still sits between drawings.
- The win word often covers the landing. On the CROSSED! frame Gogo is still in the air drawing.
- While the door is moving, a crop of the closed van's door slides over the open van. They share the livery. They are not one registered painting. The shut result and the rank traffic are the closed van.
- Hats sit on each pose's crown point. They are still simple vector stickers, and every hat on every panic pose was not re-shot.
- Uncle is painted more naturalistically than the candy-coloured rest of the cast.
- A few keyed edges still carry a cyan speck.
