# Taxi Rank Rush: Style Bible v2 (taxi locked from src/taxi_base.png, built by make_base.py)

Based on the Big 5 bible (/workspace/big5_art/STYLE_BIBLE.md), adapted to vehicles and people.

**Look:** premium 2D casual-puzzle sticker art. Hand-inked cartoon, flat cel paint, chunky toy proportions.

**Line:** bold, even dark-brown ink #3B2416 everywhere. In-game sprites get an extra code-added outer ink stroke (recolour.stroke, 5px at 512px) so silhouettes hold up at ~70px. No sketchy strokes or textures.

**Shading:** one base tone, one flat shadow tone on the right and underside, and one small crisp highlight top-left. Light comes from the top-left. No gradients, airbrushing, texture, 3D or glow. The only soft element is a flat 22–25% ink drop shadow, offset down-right, added in code under props and vehicles.

**Camera:**
- Vehicles, props and ground are strictly 90° top-down. Front = up.
- Passengers are front-facing, from slightly above, about 2 heads tall (chibi).
- The logo is a dynamic 3/4 side view.

**Taxi (v2 minibus):**
- Shape: an SA-style 14-seater minibus seen top-down, generic with no brand. It is about 2:1 (body 306 x 610 px in the 401x654 canvas, front = up).
- From front to back: a short rounded bonnet with two round headlights, a wide curved windscreen, round side mirrors, a small square roof hatch, a rectangular roof rack with 3 cross bars, a sliding-door panel on the right side strip, a narrow rear window and two red tail lights.
- **Direction cues:**
  - Front: windscreen, bonnet, headlights and mirrors.
  - Rear: a narrow window plus red lights.
  - `overlay_arrow`: an optional cream double chevron the game can toggle on.
- Built from the v5 generation with code edits in make_base.py: the rear window is narrowed, the door panel is painted in, and 3 tyre-free row bands are removed to reach 2:1.
- All 8 colours are produced by luminance-ramp recolour of the cream body (recolour.py), so the shapes are pixel-identical. Windows, tyres, rack bars and ink are untouched.
- Liveries are overlays on the same canvas, clipped to the body paint. They sit 9px inside the silhouette and hug the rack bars, so they read as painted under the rack.
  - stripes: twin cream bands with a rust core, which contrast on yellow and white too
  - chequers: a bonnet row plus a 2-row rear band
  - zigzag: cream with a rust core
  - flames: on the bonnet
  - flowers / stars: 2 big motifs each, one on the bonnet and one on the roof
- Hidden = `taxi_hidden_tarp_plain` (fitted to the same shape, with the mirrors showing) + `ui/icon_question` drawn upright. `taxi_hidden_tarp` is the pre-composited upright version.
- Locked = `overlay_locked` (dark disc + yellow padlock, centred on the roof) drawn over any colour.

**Palette (base / shadow):**
| Colour | Base | Shadow |
|---|---|---|
| red | #E5483B | #B5322A |
| blue | #3F8FD8 | #2B68AA |
| yellow | #F7C531 | #D39A1E |
| green | #5DB848 | #3D8A33 |
| purple | #9160CC | #6A409E |
| orange | #F28A2E | #C7641C |
| teal | #2BB5A8 | #1B887E |
| white | #F8F2E7 | #D8CBB5 |

The highlight is the base mixed 55% toward white.

| Ground and trim | Colour |
|---|---|
| Asphalt | #7E7872 |
| Asphalt shadow | #6E6863 |
| Paving | #E6D3AE |
| Paving joints | #D2BC93 |
| Kerb | #F3E6C8 |
| Painted lines | #F4EAD2 |
| Bay lines | ochre #E8A84A |
| Livery cream | #F7E4BC |

**People:**
- Diverse South African commuters with warm skin tones, kind smiles and everyday clothes. No caricature.
- Clothing is generated plain white, then recoloured to the 8 colours in code. The mask keeps large white areas only, so eye catchlights and shoe soles stay white.
- The VIP gaartjie has a fixed outfit (yellow vest, teal tee, soft teal cloth cap with a button and seam, not a helmet) and is not recoloured.

**Rules:** no text, brands, logos, number plates or flags in art. HUD text uses Fredoka/Nunito (self-hosted) in code only.

**Production:**
- Generate on flat magenta.
- Run key.py (hue + distance key, unmix, 1px erode, despill, trim).
- Run recolour.py / make_rest.py (variants, liveries, people, lock, tarp).
- Run make_bg.py: the background, bay and tile are drawn in code to guarantee a clean top-down perspective, with keyed top-down props.
- Run make_mockup.py, then make_sheet.py.

**In-game sizes (390pt-wide phone):**

| Element | Size |
|---|---|
| Taxi length | ~84px (about 48px wide incl. mirrors; grid unit 48px, a taxi occupies 1x2 units) |
| Bay | 66x94 |
| Passengers | ~40px tall |
| Gaartjie | ~50px tall |
| Booster icons | 40px in 60px buttons |

Use sprites at 2–3x these sizes (they are 256–526px).

**Yard details (v2):** faded worn bay markings (#958F86), a faded exit chevron, 4 irregular oil stains (#6C6661 / #645E5A), 3 hairline cracks, 3 slotted drain grates on the edges, and 1 manhole cover. All are low-contrast flat tones.
**UI icons:** all icons use the coin/star/extra-bay treatment (one inner shadow tone + a thin offset shadow, no heavy extrusion). Undo, shuffle and hoot were regenerated in v2.
