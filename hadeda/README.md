# Hadeda Flap

A one-tap portrait flyer. A hadeda ibis, a suburb, and a gap.

Open `index.html` in a browser. No build step. Paths are relative, so a static host works, including:

`https://raw.githack.com/TosZK-Hub/eish-your-excellency/<branch>/hadeda/index.html`

## Play

Tap, click, or press space to flap. Each gap you clear is one point. A koeksister in the gap is a coin. Best score and coins stay in `localStorage` under `hadeda_flap_v1`.

Medals land at 10, 20, 40 and 80. The suburb changes with the score: dawn chorus, high sun, veld gold, stoep lights.

The wardrobe spends coins on scarves, hats, and wing sheen, plus a one-hit stoep shield, a wider opening for the first ten gaps, and more koeksisters. None of that is required to fly. "One more flap" plays a two-second stand-in card. No advert SDK is loaded.

## Query knobs

- `?bot=1` flies by itself
- `?scene=title|play|over|shop&still=1` holds a frame
- `?tod=dawn|day|sunset|night` picks the sky
- `?sheet=bird` is the model sheet
- `?hit=1` draws hitboxes
- `?fps=1` writes a frame rate onto the stage element
