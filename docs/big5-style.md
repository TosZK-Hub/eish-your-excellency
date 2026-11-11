# Big 5 style guide

Bushveld Pop. A warm, chunky, outlined cartoon for a lodge pet, built so every screen looks like one studio shipped it.

## Theme and why

Top casual and pet games (Playrix township-style toys, Supercell’s glossy buttons, Pou, My Talking Tom) share a UI kit, not a unique illustration on every button:

- Chunky rounded panels with a thick warm rim
- A glossy split: light top, saturated bottom, dark lip
- Buttons that visibly depress
- Ribbon or kicker labels, star and coin chips
- A bold rounded display face and a quieter body face

That kit is the right base for a virtual pet. A flat “web app” (thin grey borders, system font, emoji icons) reads as a prototype. A dark battle UI reads as the wrong genre.

Big 5 uses Kenney’s CC0 UI Pack (the gloss and depth buttons) recolored into one savanna range: marula gold, waterhole teal, clay, and warm sand. The same rim thickness, the same split highlight, the same press. Kenney’s coin, star, audio, and trophy glyphs are masked to those colors. Kenney particle sprites (star, spark, circle, twirl) are tinted gold or cream and shrunk for low data. Nothing is left in Kenney’s default lemon, mint, and cool grey, because that mix is what makes a pack look like a pack.

Characters are original vector rigs drawn to the same ink, the same light, and the same chunky geometry, so the pet and the buttons belong together. Dock and meter icons are original strokes in that ink. Kenney did not have a lodge, a waterhole, or a paw that matched, and a second icon family would show.

## Engine

The pet is a skeletal rig in code: body, head, ears, eyes, lids, mouth, legs, tail, and a species bone (mane, trunk, horn, or boss) each get translate, rotate, and scale every frame. That is the same model as a Spine or Rive rig. The Rive runtime and Phaser are not vendored. Both are heavy for a low-data offline toy, and neither draws this cast. One canvas, one requestAnimationFrame, device pixel ratio capped at 2. UI motion is transform and opacity only.

## Palette

Light sits upper left. Shadow sits lower right. Outlines are warm ink, never pure black.

| Role | Hex | Use |
| --- | --- | --- |
| Ink | `#3A271C` | Outlines, text |
| Ink soft | `#8A6A52` | Secondary labels |
| Cream | `#FFF6E8` | App background |
| Paper | `#F6E7C8` | Floor, cards behind buttons |
| Sand | `#F3D7B0` | Walls |
| Gold | `#F0A020` | Primary actions, coins |
| Gold deep | `#C47A12` | Button lip, pressed state |
| Clay | `#E07A3C` | Ribbons, warmth, play accents |
| Teal | `#2E9A90` | Water, clean, secondary buttons |
| Leaf | `#3E8F55` | Bush, good treats |
| Blush | `#F0A0A8` | Cheeks, inner ears |
| Night | `#2C241C` | Load-shedding sky |

Species bases (fill, shadow, highlight):

- Lion fur `#F0B033` / `#D48922` / `#FFE09A`. Mane `#E06A22` / `#C44E16`.
- Leopard fur `#F2C56A` / `#D9A44A` / `#FFE3A0`. Rosettes `#5C3A22` with a fur hole and three seeds.
- Elephant skin `#C8C0B0` / `#9A9284` / `#E6E0D4`. Inner ear `#F0B0B4`. Warm grey, not cold blue.
- Rhino hide `#B7B7A4` / `#8E8E78` / `#DCD8C6`. Horn `#F0E2C0`.
- Buffalo hide `#5C4034` / `#3E2A22` / `#7A5844`. Horns `#F0E2C0`.

Belly and muzzle are a lighter step of the same hue. Eyes are white sclera, a species iris, a dark pupil, and two catchlights (large upper left, tiny lower right).

## Line, shape, shading

- Outer line is 5 units in rig space, round caps and joins, color ink. It scales with the pet.
- Stroke the silhouette parts: body, head, ears, legs, tail, mane tufts, trunk, horns. Do not stroke shadow shapes, highlights, blush, or belly.
- Shading is two tones plus one highlight ellipse. No airbrushed gradients on the character. Room skies may use a two-stop gradient.
- Shape language is circles, capsules, and rounded cones. No skinny limbs, no sharp corners except horn tips and thorns.
- Feet are ovals that tuck into the body. The body is drawn after the back legs so the hips connect.

## Proportions

The pet stays chibi at every stage. Growth is a silhouette change, plus a small scale step (1, 1.06, 1.14).

| Stage | Head vs body width | Eye vs head | What must read at a glance |
| --- | --- | --- | --- |
| 1 baby | Head slightly wider than the ribcage | About 0.22 of the head radius | Cub or calf. Species hint only. |
| 2 youngster | Head about the same width as the body | About 0.20 | The signature starts. |
| 3 adult | Head a little smaller, body longer | About 0.18 | Full silhouette, still cute. |
| 4 legend | Same draw as the adult | Same eyes | Cosmetic: gold ear rim, sun mark, beads. Not a new skeleton. |

Signature by stage:

- Lion: cheek tufts, then a ruff, then a full scalloped mane and a bigger tail tuft.
- Leopard: a few rosettes and a long tail, then more rings on the body and forehead. No mane. Black spot on the ear.
- Elephant: large ears and a short trunk, then a longer trunk and small tusks, then wide ears, a long curling trunk, and longer tusks.
- Rhino: a nub, then one horn, then a long front horn and a small rear horn. Barrel body, thick legs.
- Buffalo: two nubs, then short horns, then a boss across the forehead and horns that curve down.

## Rig and acting

Bones, each frame: root (breathe and squash), tail, hind legs, body, forelegs, ears, mane or horns or trunk, head, eyes, mouth.

Loops that are always available:

- Idle breathe (scale Y about 3%)
- Blink about every 3.6s, plus a held lid when sleepy
- Ear flick on its own timer per ear
- Tail swish
- Pupils chase the pointer, clamped so the iris stays in the eye
- Happy bounce (squash and stretch)
- Eating chomp
- Sleepy lids and a small mouth
- Dust specks when cleanliness is low, bubbles in the bath
- A raised paw and candle during load shedding

No tears, no collapse, no “near death” pose. A peckish pet still looks like a friend.

## UI system

Tokens live in `big5/css/game.css`.

- Display: Fredoka 600 and 700, self-hosted, latin subset. Titles, buttons, the dock, the pet name.
- Body: Nunito 700 and 800, self-hosted, latin subset. Hints and sheets.
- Radius: 18px on cards, 14px on chips, full pills for coins. Kenney bitmaps bring their own corners. Do not add a second radius on top of a border-image.
- Depth: Kenney gloss button as the control, plus a 0 4px 0 lip in the deeper shade. Press is `translateY(3px)` with a shorter shadow, 120ms, easing `cubic-bezier(.2, 1.5, .3, 1)`.
- Dock: four tabs and a center Play control lifted on the round gold button. Active tab is clay on a cream chip.
- Meters: original icons that fill from the bottom and wobble when the need is under 40. The bar uses `scaleX` from the left, not a width animation.
- Room changes: the canvas eases sideways. Hills move a little slower than the foreground. A horizontal flick on the room does the same thing.
- Rewards: coin glyphs fly to the counter with transform only. Level-up and evolution use a sunburst and confetti. The daily chest opens its lid, then the coins fly.
- Type sizes stay readable at 360px. The HUD is name, coins, four icon meters, and a thin level bar. No paragraph in the header.
- `prefers-reduced-motion` turns off bob, confetti, sunburst spin, and the room slide. State still changes immediately.
- Safe areas pad the dock and the sheets.

## Rooms

Same ink and the same flat shapes as the pet. The pet is the largest thing in the room.

- Lodge kitchen: cream wall, a window onto an acacia, a back counter, kettle.
- Waterhole: sky, reeds, a pool, sand under the feet.
- Boma: thatch, a cushion, a lantern, the wall box that drops the lights.
- Savanna: sky, sun, two acacias, grass layers. Mini-games start here.
- Curio stall: striped awning, the pet in whatever they are wearing.

## Copy

Light South African slang, affectionate, never scolding. Howzit, lekker, yoh, eish, sharp sharp, ag. No guilt for being away. Needs do not fall below a comfortable floor.

## Do not

- No AI-generated images, no photos, no stock illustration.
- No extra palette (no purple, no pure black, no cool grey UI).
- No emoji as icons.
- No outline on every freckle. Outline the form.
- No realistic anatomy. If a stage needs a diagram to explain it, the silhouette failed.
