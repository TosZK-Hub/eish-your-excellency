# Hettie Hadida: art notes

Hettie Hadida is a Kleinspan character. The poses and icon come from the Kleinspan brand kit by Solo Kit AU.

## What ships

| Use | File | Source |
| --- | --- | --- |
| Flying bird | `body_hettie` in `js/pack-art.js` | our painted hadeda rig, with Hettie's cheek stripe, eye and neckerchief painted in and aligned to the old body, so the wing pivots haven't moved. The neckerchief is enlarged 1.32× so it reads at play size |
| Doek bow | `scarf_bow` in `js/pack-art.js` | the bow from her side-view turnaround, cut out, mirrored to face right and colour-matched to the neckerchief. Drawn last so a wing never hides it |
| Title wave, new-best cheer, think, sleep, shop crown | `js/pack-hettie.js` | brand kit standing poses, 288 px WebP |
| App icon and launcher | `icons/icon-hettie.svg`, `icons/favicon-hettie.svg`, `tools/icons-pack.json` | brand kit head on protea pink `#F4C3CB` |

The reference sheets aren't committed because they're large binaries and reference only. They are the Hettie sheet, the turnaround and the 35-pose sheet in the Kleinspan brand kit.

## Rules for any new Hettie art

- Always a proper bird: two legs, wings stay wings, long curved bill.
- Protea-pink neckerchief (`#D9677F`); the Bok-green doek is a skin.
- Cheeky, never mean.
- Match the painted v4 world for anything that flies. Keep the picture-book gouache poses for the UI only.

## Flight set

The flight set is the painted rig plus code, so the existing pivots, tilt and squash keep working. Open `index.html?sheet=hettie` (add `&tod=night` for night) to see the set.

| State | How |
| --- | --- |
| Wing up / mid / down | the painted wing frames on Hettie's body |
| Glide | after about 0.4 s without a flap while falling, the open wing lifts about 0.32 rad and holds, with a small tremble |
| Near miss | a "Close!" pass opens her eye wide, raises the brow and adds a sweat bead for about 0.6 s |
| Crash tumble | the wings flail for 0.55 s while she spins, eye wide; once she is down, the eye closes |
| Night | each piece gets a cool `#1c2752` wash at 36 % that fades in with the sky |

Solo Kit AU won't make flight frames. A real hand-painted side-on frame set in the v4 style would still be the next step up.

Stills: `?still=1&scene=play&near=1` and `?still=1&scene=play&crash=1`.
