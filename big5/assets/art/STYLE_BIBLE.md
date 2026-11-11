# Big 5 Safari Pet: Style Bible v1 (locked from src/lion_baby.png)

**Look:** premium 2D casual pet-game sticker art. Hand-inked cartoon with flat cel paint. Think Pou or Talking Tom charm, drawn flat in 2D.

**Line:** a bold, clean, uniform dark-brown ink outline (#3B2416; buffalo #2A1910). Every outline is the same weight, and the outer silhouette is slightly heavier. No sketchy strokes, fur strands, or whiskers (the adult lion and leopard have a few whiskers, which is tolerated).

**Shading:** flat cel shading. Each area gets one base and one shadow tone (shadow on the right and underside), plus one small crisp white highlight on the head. No gradients, airbrushing, texture, 3D render, or glow.

**Light and camera:** light from the top-left. Sitting pose, front 3/4 view turned slightly to the viewer's left, full body, same framing for all.

**Eyes:** big oval dark-brown eyes with one round white catchlight. Happy pose = upward arcs. Sleepy pose = droopy closed lids with a small yawn.

**Proportions by stage:** the head is about 50-55% of total height for a baby, about 42% for a youngster and about 33-36% for an adult. All stages use the same pear-body family and three toe lines per paw.

**Palette (warm savanna):**
- Lion: ochre #E8A84A, shadow #C47F35, mane #B8692A
- Leopard: paler, yellower cream-gold (lion ochre shifted +3° hue, −7% saturation by recolour_leopard.py), with evenly spaced open rosettes in #4A2E1A
- Elephant: taupe-grey #A8A3A0
- Rhino: neutral stone grey (all rhino images normalised to one grey by neutral_rhino.py)
- Buffalo: chocolate #6B4A35
- Cream (muzzle, nails, tusks, horns): #F7E4BC / #EDE3CF
- Blush #E58A4E, tongue #B5523B

**Stage signatures:**
- Lion: tuft, then a spiky crest, then a huge scalloped mane.
- Elephant: no tusks, then short tusks, then long tusks.
- Rhino: one snout horn, then a front horn plus a second horn behind it on the snout, then a long front horn.
- Buffalo: nubs, then unfused curved horns, then a fused boss with a centre seam and a W-sweep.

**Backgrounds:** same ink and flat-fill rules, a flat sky (no gradient) and a warm palette. Keep the bottom 40% open floor so the pet can stand in the centre. No characters and no text.

**Production:**
- Characters are generated on flat magenta, then keyed with a hue- and distance-based key, unmixed, eroded 1px, despilled, trimmed and exported to WebP q90.
- Always pass src/lion_baby.png, plus the species' baby and the matching lion stage, as reference images.

**Expressions (babies):** happy (closed ^ ^ eyes, open smile, blush), hungry (big hopeful eyes, raised brows, tongue licking lip, one light-blue drool drop, paws together at chest), sleepy (droopy closed lids, small yawn).
**Stage display scale (in-game suggestion):** baby 0.80, youngster 0.92, adult 1.0. The elephant youngster is the only one standing, which helps it read as the lanky teen.
**Rhino anatomy:** wedge-shaped head with a forward snout and broad square lip. Tall, pointed, upright ears with fringe tips. Baby has one snout horn. Youngster and adult have a front horn plus a second horn behind it, both on the snout.
**Tooling:** key.py (chroma key), recolour_leopard.py, neutral_rhino.py, make_sheets.py.
