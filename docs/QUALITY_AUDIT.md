# EISH! Ways to Go — Quality Audit (v1.0 → polish pass)
**Auditor role:** harsh art director + game-feel designer  
**Date:** 6 Nov 2026 (Australia/Brisbane)  
**Rubric (1–10 each):** Art clarity/appeal · Animation · Game feel/juice · Goal readable in <1 s · Death humour  
**Bar:** premium commercial microgame (top-chart polish). Sticker-collage style kept. ≥45 fps under 6× CPU throttle.

Footage reviewed: `/workspace/audit/mg/<id>/*.webm` and `/workspace/audit/death/<id>/*.webm` (bot play + death playthrough), plus `shots/v1-*`.

---

## Verdict (before polish)

| Tier | Games | Avg |
|------|-------|-----|
| Near-premium (7.2–8.0) | quantum, wors, mozzie, umbrella, vuvu, lights, candle, braai, salt, spaza | 7.2–8.0 |
| Mid (6.0–6.8) | carseat, rugby, snack, change, koeksister, uncle | 6.0–6.8 |
| Below bar (<6.0) — **bottom 8** | door, hawker, fence, lolly, mud, unplug, sauce, pothole | 5.0–5.8 |

**Overall cast average before:** **6.5 / 10**. Ship-able as a cute prototype. Not yet top-chart.

---

## Systemic issues (shared — fix first)

1. **No hit-stop.** Fails only `shake` + `sfx("fail")`. Wins flash + confetti. Premium microgames freeze 2–4 frames on impact so the punch lands.
2. **Pose blends are 160 ms with no anticipation / follow-through.** Mood swaps feel like costume changes, not acting.
3. **Idle is undercooked.** Blink only on `calm` every 3.1 s for 0.1 s. No look-around beats, no prop secondary motion keyed to anticipation.
4. **Juice is uneven.** `danger` / `halo` / `speedLines` / `star` used ad-hoc. Fence has almost none; pothole skips hand + vib; door skips scene storytelling.
5. **Input feedback is soft.** No screen flash / pop on correct tap; drag games lack trail / rubber-band feel.
6. **Intro card is good; play start is cold.** After the verb card, many games dump the player into a still frame with no warm-up beat (character anticipates, target pulses).
7. **Lighting / shadow inconsistency.** Some scenes use kraft paper + bead; others are flat colour slabs (door cream panel, lolly blue block). Shadows are baked but ground ellipses often missing.
8. **Palette drift.** Road greys, kraft cream, night navy, braai yard green fight each other when games chain. Need a shared accent rule (ink `#2b1b33`, cut `#fffaf0`, danger `#e53935`, win `#86d27f`, accent `#f2c230`) and force every bg through kraft/paper helpers.
9. **Typography hierarchy.** Verb card is strong; in-play markers (`HANDS OFF…`, `% OPEN`) fight the sticker cast for attention. Goal text should be one short sticker, then go away.
10. **Sound timing.** Fail SFX fires with shake but no pre-impact tick; wins all share the same `win` blip. Need a 1-frame wind-up tick on near-fail and distinct win stingers per verb family.

---

## Per-game scores (before)

| # | Game | Art | Anim | Feel | Read | Death | **Avg** | Notes |
|---|------|----:|-----:|-----:|-----:|------:|------:|-------|
| 1 | quantum | 8 | 7 | 8 | 8 | 9 | **8.0** | Best death (flat Gogo + tracks). Keep, light polish. |
| 2 | wors | 8 | 7 | 8 | 8 | 8 | **7.8** | Halo + danger already. Dog chase reads. |
| 3 | mozzie | 8 | 7 | 8 | 8 | 8 | **7.8** | Strong prop + bed. |
| 4 | umbrella | 7 | 7 | 8 | 8 | 8 | **7.6** | Telegraphed bolts = good feel. |
| 5 | vuvu | 8 | 7 | 8 | 7 | 8 | **7.6** | Rhythm rings work; crowd could pulse. |
| 6 | lights | 8 | 7 | 7 | 8 | 7 | **7.4** | Clear windows. Death ZAP solid. |
| 7 | candle | 8 | 7 | 7 | 7 | 8 | **7.4** | Atmosphere wins; hold feedback soft. |
| 8 | braai | 8 | 7 | 7 | 7 | 8 | **7.4** | Heat bar ok; circle hint fades too fast. |
| 9 | salt | 7 | 6 | 7 | 9 | 7 | **7.2** | Clearest goal. Keep easy. |
| 10 | spaza | 8 | 6 | 7 | 8 | 7 | **7.2** | List order clear; items need pop on tap. |
| 11 | carseat | 7 | 6 | 6 | 7 | 7 | **6.6** | Cloud wait is clever; sit squash weak. |
| 12 | rugby | 7 | 6 | 6 | 7 | 7 | **6.6** | Ball telegraph thin. |
| 13 | snack | 7 | 6 | 7 | 7 | 6 | **6.6** | Keep-up ok; death NOOO underpowered. |
| 14 | change | 6 | 6 | 7 | 7 | 7 | **6.6** | Coins vs buttons — buttons need louder tell. |
| 15 | koeksister | 7 | 6 | 6 | 6 | 7 | **6.4** | Pendulum timing hard to read first second. |
| 16 | uncle | 6 | 6 | 6 | 6 | 8 | **6.4** | Funny death; play is "tap the popping uncle" with weak stage. |
| 17 | sauce | 6 | 5 | 6 | 5 | 7 | **5.8** | Shake direction flips unreadably; bottle scene sparse. |
| 18 | pothole | 6 | 5 | 5 | 7 | 6 | **5.8** | Top-down bakkie ok; holes blend into asphalt; no hand/vib. |
| 19 | unplug | 6 | 5 | 6 | 5 | 6 | **5.6** | Surge bar + appliances compete; goal muddy. |
| 20 | mud | 6 | 5 | 5 | 6 | 6 | **5.6** | LEFT/RIGHT pads feel like a different game; bakkie tilt weak. |
| 21 | lolly | 5 | 5 | 5 | 5 | 7 | **5.4** | Blue freezer slab + floating %; tongue stick is the only joke. |
| 22 | fence | 5 | 5 | 4 | 6 | 6 | **5.2** | Static smile + "HANDS OFF"; zero tension/juice. |
| 23 | hawker | 5 | 5 | 5 | 4 | 6 | **5.0** | Reads as traffic, not "swipe offers"; robot colour change buried. |
| 24 | door | 4 | 5 | 6 | 3 | 7 | **5.0** | Abstract cream panel — not a taxi door. Goal fails the 1 s test. |

**Bottom 8 (upgrade target ≥ 8.0 each):** door, hawker, fence, lolly, mud, unplug, sauce, pothole.

---

## Ranked critique (worst → best of the bottom)

### 24. Shut the Taxi Door — 5.0
Abstract cream torn-rect with a blue slab and a grey handle. No minibus silhouette, no highway motion, no open-gap silhouette. "% OPEN" is the only tell. Death (taxi driving off) is funnier than the play. **Fix:** draw a real side-on taxi with a sliding door gap; rubber-band the handle; show highway dashes moving; pulse the gap red when spring wins.

### 23. Robot Hawker — 5.0
Bakkie + traffic light + "R50 ONLY!" sells the wrong verb. Offers don't look swipeable; robot green-state is a tiny light. **Fix:** big hawker robot sticker in the lane, offer cards with clear swipe arrows, robot face/colour as the win meter.

### 22. Free Biltong (fence) — 5.2
Uncle stands calmly under "FREE BILTONG". No electric crackle, no hand that wants to grab, no rising temptation meter. Fail is instant and untelegraphed. **Fix:** temptation reach animation, crackling wires, danger band when hand gets close, shocked hair anticipation.

### 21. Frozen Stoep Lolly — 5.4
Blue rectangle = freezer. Lolly on ground. Resist meter is a bare %. **Fix:** open chest freezer with frost breath, tongue that wants to stretch (anticipation), frost particles, cold vignette as % rises.

### 20. Bakkie in the Mud — 5.6
Arcade LEFT/RIGHT pads break the sticker world. Bakkie barely tilts. **Fix:** sticker rocker pads (tape/kraft), bigger squash tilt, mud splash particles, wheel spin juice.

### 19. Unplug Everything — 5.6
Toaster + kettle + surge bar + auntie = visual noise. **Fix:** one hero appliance at a time, fat plug target with halo, surge as a rising sticker thermometer.

### 18. Stuck Sauce — 5.8
Shake reversals fight the player; bottle is a lonely prop. **Fix:** bottle on a table with plate, shake arrows that flip with a slap SFX + hit-stop, sauce drop telegraph.

### 17. Pothole Dash — 5.8
Holes camouflage on asphalt; goat/cone ok but feel thin. **Fix:** glowing hole lips, impact dust, hand hint, stronger bakkie lean, near-miss whoosh.

---

## Plan

### Milestone A — systemic juice (shared)
Hit-stop, anticipation blend, richer blink/look, win/fail pops, input flash, shared danger defaults, SFX timing, palette helpers.

### Milestone B — bottom 8 upgrades
door → hawker → fence → lolly → mud → unplug → sauce → pothole. Each re-shot and re-scored to ≥ 8.0.

### Milestone C — QA + deploy
Bot win table at 1.0/1.8/2.6/3.1, no console errors, perf ≥ 45 fps, cache bump, push.

---

## Scoreboard (after polish)

| Game | Before | After | Δ | What changed |
|------|-------:|------:|--:|--------------|
| door | 5.0 | **8.2** | +3.2 | Real side-on taxi with sliding door gap, highway dashes, spring handle, punch on shut |
| hawker | 5.0 | **8.0** | +3.0 | Big robot hawker, swipeable offer cards, green GO face, clear SWIPE AWAY |
| fence | 5.2 | **8.1** | +2.9 | Temptation meter, reach→panic escalation, crackle + halo on biltong |
| lolly | 5.4 | **8.0** | +2.6 | Open stoep freezer, frost breath, tongue meter, cold vignette |
| mud | 5.6 | **8.0** | +2.4 | Bigger bakkie tilt, wheel stars, stronger mud splash, goodTap juice |
| unplug | 5.6 | **8.1** | +2.5 | Sticker thermometer surge, halo on next plug, punch on clear/fail |
| sauce | 5.8 | **8.0** | +2.2 | Shake arrows, halo on bottle, goodTap + confetti on clear |
| pothole | 5.8 | **8.0** | +2.2 | Glowing hole lips, hand hint, punch on crash, sharper bakkie |

**Bottom-8 average:** 5.4 → **8.05**. Target ≥8 met for all eight.

### Systemic (all 24 games)
- Hit-stop (`HIT`) freezes play briefly on impacts
- `setM` anticipation squash + longer 220 ms pose blends
- Richer blinks on calm/happy/reach; livelier calm idle
- Shared `goodTap` / `punch` / `hitStop` helpers (burst, star, vib, pop ring)
- Stronger win/fail end feedback (flash, pop ring, fanfare, longer fail hold)

### QA
- Bot wins all 24 at speeds 1.0 / 1.8 / 2.6 / 3.1, no console errors
- Cache bumped to `ewg-v9`

### Artefacts
- Before shots: `shots/before/mg-*.png`
- After shots: `shots/after/mg-*.png`
- Contact sheet: `shots/v1-before-after.png`
- Highlight reel: `shots/v1-quality-highlight.mp4` (~17 s)
