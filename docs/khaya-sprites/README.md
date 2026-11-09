# Khaya Lane sprites v2

The game uses the WebP files in `assets/sprites/gen/`. This folder keeps the provenance notes and the SHA-256 manifest of the original PNGs. The base64 copies were removed after they were decoded and checked. If a `assets/sprites/gen-b64/` folder is restored, `node tools/decode-sprites.js` writes the PNGs again and checks them against `manifest.json`.

These were base64 text copies of the v2 PNG sprites, because the GitHub connector used to commit them can only write text files. Decode them to real PNGs with:

```
node tools/decode-sprites.js
```

That writes `assets/sprites/gen/<name>.png` and checks each file against the SHA-256 in `manifest.json`. Nothing in the game references these yet. Wiring them in is a separate change.

**Provenance:** every image is AI-generated with the GenerateImage tool (Grok Bot) for the Khaya Lane project on 9 Nov 2026 (AEST). This is original art: no third-party game assets, characters, trademarks or logos were used as input. The only reference images passed to the generator were earlier sprites from this same set, used for style consistency.

**Post-processing:** backgrounds removed with rembg (isnet-general-use) plus an adaptive magenta chroma key, edge despill, smoke/steam removal on potjie, braai and imbawula, trimmed and Lanczos-scaled. Tiles are built in code from generated top-down textures: offset-blended to make them seamless, then re-projected to an exact 2:1 diamond (256x128).

**Scale:** 1 ground tile = 256x128 px. Homes 400/460/560 px wide, spaza and workshop 480, neighbours 440, kraal 420, trees 380–420, props 130–360, crop beds 256 (one 2x2-cell bed). Characters are 256 px tall (the kid 215), hen 96, dog 120, goat 130, cow 170. Anchor sprites by bottom-centre. Buildings sit on their own small red-earth base patch.

## Shared style preamble (used verbatim in every object prompt)

> STYLE: Commercial mobile game asset in a bright, saturated, glossy, chunky stylised 3D-rendered look like a top-tier casual city-builder game. Rounded, slightly exaggerated soft proportions, bevelled edges, smooth clean materials with subtle hand-painted texture, soft warm rim light, gentle ambient occlusion, warm sun from the upper left casting soft shadows to the lower right. Classic 2:1 isometric view, camera from the front-left at about 30 degrees elevation, orthographic, whole object fully in frame and centred with generous margin. Single isolated object on a perfectly flat, uniform, solid pure magenta (#FF00FF) background, no ground tile, no cast shadow on background, no logos, no watermark. Authentic South African township and highveld setting: real South African architecture, materials and everyday details, warm palette of ochre, red earth, dry golden veld and clear highveld light; proud, tidy and aspirational, never squalid.

Follow-on prompts appended either *Match the exact angle, lighting, scale and rendering style of the reference image, but a different building; do not copy its tyre border or rockery* (buildings) or *Match only the angle, lighting and rendering style of the reference image* (props, trees).

## Character block (appended to the preamble for people and animals)

> CHARACTER: one single full body chibi game character alone, nothing else in the image, front three-quarter view facing the lower left, seen slightly from above, super-deformed toy-like proportions: oversized round head about 45 percent of total height, small rounded body, short stubby arms and legs, big chunky hands and feet, large glossy friendly eyes, warm smile, simple clean shapes like a vinyl toy figurine, respectful and warm, never a caricature, standing in a relaxed idle pose, feet fully visible, character fills about 80 percent of image height.

## Files

| PNG (decoded name) | Size | Reference | Subject prompt (after preamble) |
|---|---|---|---|
| `home_l1.png` | 400x341 | ref home_l2 | Proud tidy mkhukhu: mismatched painted corrugated-zinc panels, rock- and tyre-weighted zinc roof, green door, curtained window, concrete stoep step, JoJo tank on brick stand, tin of geraniums. |
| `home_l2.png` | 460x398 | none (style anchor) | RDP 'matchbox' house in painted cement block (yellow with turquoise base band), low-pitch corrugated roof, white burglar bars, steel security gate, tiny garden with painted-tyre border, aloes and rockery. |
| `home_l3.png` | 560x464 | ref home_l2 | Extended face-brick family house, terracotta tiled roof with solar panels, satellite dish, burglar bars, carport with green corrugated roof, black steel palisade fence and gate, paved drive, lawn strip and aloe. |
| `spaza.png` | 480x412 | ref home_l2 | Converted red shipping-container spaza; hand-painted mural signage 'SPAZA' plus 'AIRTIME', 'KOTAS', 'VETKOEK', 'COLD DRINKS' with painted kota and bottle; security-grille serving hatch; crates; umbrella. No brands. |
| `workshop.png` | 480x422 | ref home_l2 | Blue corrugated welding & woodwork shed, open front with workbench, welder and gas bottle, timber, finished burglar-bar gate outside, sawhorse, hand-painted sign 'WELDING & WOODWORK'. |
| `neighbour_ndebele.png` | 440x351 | ref home_l2 | Rectangular Ndebele homestead house with parapet facade covered in bold black-outlined geometric Ndebele mural in red, yellow, blue, green, ochre. |
| `neighbour_mural.png` | 440x383 | ref home_l2 | Township house with joyful street-art mural (sun, protea, abstract shapes), low-pitch corrugated roof, red door, barred window, bucket by the door. |
| `neighbour_facebrick.png` | 440x382 | ref home_l2 | Classic brown face-brick house, corrugated roof, long shiny red-polished stoep, burglar bars, cream security door, two plastic chairs, potted fern. |
| `braai_drum.png` | 220x277 | ref home_l1 (style only) | Oil-drum braai: half 210 L drum on welded legs, lid open, boerewors and chops over coals, side shelf with tongs. |
| `potjie.png` | 190x201 | ref home_l1 (style only) | Three-legged cast-iron potjie over a small wood fire in a stone ring, wooden spoon (steam removed in post). |
| `imbawula.png` | 130x223 | ref home_l1 (style only) | Imbawula brazier: holed metal drum with glowing coals, kettle on top, standing on three bricks. |
| `wheelbarrow.png` | 200x198 | ref home_l1 (style only) | Builder's wheelbarrow, green tray, red handles, bricks and a spade. |
| `taxi.png` | 360x326 | ref home_l1 (style only) | White minibus taxi, high-roof van silhouette, roof rack, red/blue stripe, no badges, brands or text. |
| `soccer_goal.png` | 280x256 | ref home_l1 (style only) | Hand-built street soccer goal: crooked gum poles lashed with wire/rope, patched net, worn ball, red-earth patch. |
| `mielie_cart.png` | 240x329 | ref home_l1 (style only) | Roadside mielie vendor push cart with charcoal grill of roasting cobs, crate of green-husked mielies, umbrella. |
| `kraal.png` | 420x353 | ref home_l1 (style only) | Cattle kraal of poles and thorn branches with pole gate, a Nguni-patterned cow, a goat, hay and trough. |
| `pumpkin_patch.png` | 300x201 | ref home_l1 (style only) | Free-form backyard pumpkin patch on red earth: vines, yellow flowers, orange and grey-blue Boer pumpkins. |
| `bed_empty.png` / `maize_sown.png` / `maize_growing.png` / `maize_ready.png` | 256x167, 256x168, 256x201, 256x214 | ref pumpkin_patch (one 2x2 sheet, split) | Identical wooden raised beds on red soil: hoed empty; maize sprouts; leafy young maize (no cobs); tall ripe maize with golden tassels and cobs. |
| `morogo_sown.png` / `morogo_growing.png` / `morogo_ready.png` / `morogo_ready_basket.png` | 256x176, 256x178, 256x183, 256x184 | ref pumpkin_patch (2x2 sheet) | Morogo/spinach: seedlings; young rosettes; lush dense leaves; lush leaves plus a harvest basket. |
| `pumpkin_sown.png` / `pumpkin_growing.png` / `pumpkin_fruiting.png` / `pumpkin_ready.png` | 256x193, 256x194, 256x199, 256x198 | ref pumpkin_patch (2x2 sheet) | Pumpkin: seedlings on mounds; flowering vines; vines with small green pumpkins; ripe orange and grey-blue pumpkins. |
| `tree_jacaranda.png` | 380x432 | ref tree_marula | Jacaranda in full violet bloom, twisting trunk, fallen blossoms on red earth. |
| `tree_acacia.png` | 420x404 | ref wheelbarrow (style only) | Umbrella thorn acacia with glossy sculpted flat canopy pads, forked trunk with white thorns, dry grass tufts. |
| `tree_marula.png` | 380x426 | ref wheelbarrow (style only) | Marula: broad glossy green canopy dotted with yellow-green fruit, pale mottled trunk, fallen fruit. |
| `aloe.png` | 190x270 | ref wheelbarrow (style only) | Glossy blue-green aloe rosettes with coral-red candelabra flower spikes on a red-earth mound. |
| `char_farmer.png` | 171x256 | ref v1 char_farmer (style anchor for v2 people) | Farmer, deep brown skin, short beard, royal-blue work overalls, khaki bucket hat, boots, hoe on shoulder. |
| `char_woman_doek.png` | 116x256 | ref char_farmer | Woman, medium-brown skin, tall red doek, indigo isishweshwe-print dress with ochre border, beaded earrings, enamel dish. |
| `char_basotho_elder.png` | 139x256 | ref char_farmer | Basotho elder, dark brown skin, white beard, navy-and-gold patterned Basotho blanket, mokorotlo hat, carved walking stick. |
| `char_gogo.png` | 146x256 | ref char_farmer | Gogo, deep brown skin, round glasses, headscarf, flat beaded collar, mustard dress, green cardigan, checked woven shopping bag. |
| `char_kid.png` | 122x215 | ref char_farmer | School kid, light golden-brown skin, curly hair, bottle-green school jersey, white shirt, grey shorts and socks, black shoes, backpack, wire car toy. |
| `char_man_jersey.png` | 129x256 | ref char_taxi_driver | Adult young man, fair sun-tanned skin, stubble, plain bottle-green sports jersey with gold collar/cuffs (no badge/logo/number), khaki shorts, veldskoens, rugby ball. |
| `char_taxi_driver.png` | 173x256 | ref char_farmer | Taxi driver, medium-brown skin, goatee, flat cap with sunglasses, geometric-print shirt, keys in hand, friendly wave. |
| `animal_hen.png` | 67x96 | ref char_farmer | Plump Koekoek-style barred black-and-white village hen. |
| `animal_dog.png` | 93x120 | ref char_farmer | Africanis village dog, lean, sandy-fawn coat, white chest, upright ears. |
| `animal_cow.png` | 175x170 | ref char_farmer | Nguni-style cow with patched black/russet/white hide and curved horns. |
| `animal_goat.png` | 106x130 | ref char_farmer | Boer goat, white body, red-brown head, floppy ears, small beaded collar. |
| `tile_grass.png` | 256x128 | none (texture prompt, no preamble) | Top-down seamless dry golden-green highveld veld grass with red-soil patches; post: offset-blend seamless + exact 2:1 diamond re-projection (256x128), slight green tint. |
| `tile_dirt.png` | 256x128 | none (texture prompt, no preamble) | Top-down seamless packed brick-red laterite path; same post-process. |
| `solar_stand.png` / `rain_tank.png` / `washing_line.png` / `chicken_coop.png` | 320x436, 240x327, 320x323, 300x315 | carried over unchanged from v1 set | See v1 README (AI-generated with GenerateImage, same project). |
