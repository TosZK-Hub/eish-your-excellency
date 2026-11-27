# Credits

Hadeda Flap is an original one-tap flyer. It is not affiliated with Nintendo, .GEARS, or any bird-flapping game.

## Hettie Hadida

**Hettie Hadida is a Kleinspan character**, used as the game's mascot. Her standing poses (wave, cheer, think, sleep, crown) and her head for the app icon come from the Kleinspan brand kit by Solo Kit AU. They were copied into the repo, not hotlinked: shrunk to 288 px WebP and packed as base64 in `js/pack-hettie.js`, with the head inside `icons/*.svg` and `tools/icons-pack.json`. They are not covered by this repo's code licence. Ask Kleinspan before reusing them.

The in-flight Hettie is a side-on painted flight body with her mascot face (big eye, lashes, cream cheek), colour-matched and aligned to the v4 wing rig. The calm, shocked (near-miss) and dazed (crash) faces are the same pose. They started as a composite of her Kleinspan head onto the painted body, then were cleaned up and painted over so the neck seam holds; they are not a raw image-model dump. The doek bow is cut from that flight body and drawn last so a wing never hides it. Her Kleinspan turnaround and portraits were the reference. The reference sheets themselves are not shipped. See `art/hettie/README.md`.

The Kleinspan Display face in `css/hettie-font.css` is **Fraunces** (Soft, SemiBold), copyright 2018 The Fraunces Project Authors (https://github.com/undercasetype/Fraunces), SIL Open Font License 1.1. See `font/OFL-Fraunces.txt`.

## Ideas from Flappy Hadida

The daily early-bird bonus and streak, the milestone captions, bobbing gates after 30 and the gentler early gap steps were inspired by Jesse Hobbs's earlier prototype, `TosZK-Hub/flappy-hadida`. Only the ideas were reimplemented. No code, art or sound was copied, and that repo has no licence file.

## Font

Nunito, copyright 2014 The Nunito Project Authors (https://github.com/googlefonts/nunito).
Licensed under the SIL Open Font License 1.1. See `font/OFL.txt`.
The file `font/nunito-latin.woff2` is the Latin subset (weights 600–800) from the Google Fonts distribution.

## Art

The bird, obstacles, skies, hills, houses, ground and koeksister are original paintings made for this game, cut out and tiled, then shipped as compressed WebP in `assets/`. Anatomy reference photos (not included in the game) are listed in `assets` source notes: Patty McGann (CC BY 2.0), Sumeet Moghe (CC BY-SA 3.0), and Ken and Nyetta (CC BY 2.0), via Wikimedia Commons. They were used only to check the hadeda's shape. No stock sprites.

## Sound

The hadeda calls are real field recordings of hadeda ibises (*Bostrychia hagedash hagedash*) in Pretoria, South Africa, recorded by **JMK** ([Wikimedia Commons user JMK](https://commons.wikimedia.org/wiki/User:JMK)) and used and adapted under the [Creative Commons Attribution-ShareAlike 4.0 International licence](https://creativecommons.org/licenses/by-sa/4.0/) (CC BY-SA 4.0).

Hadeda calls recorded in Pretoria by JMK, used and adapted under CC BY-SA 4.0 (Wikimedia Commons).

| Game sound | Used for | Source recording (Wikimedia Commons) |
| --- | --- | --- |
| `flap_honk_1` | some flaps | [Bostrychia hagedash hagedash, aandskemerroep, 2022-11-26 18h53, Moreletakloof NR](https://commons.wikimedia.org/wiki/File:Bostrychia_hagedash_hagedash,_aandskemerroep,_2022-11-26_18h53,_Moreletakloof_NR,_a.mp3), cut 2.56–3.08 s |
| `flap_honk_2` | some flaps | [Bostrychia hagedash hagadash, roepe in Pta, 2022-05-24 06h53](https://commons.wikimedia.org/wiki/File:Bostrychia_hagedash_hagadash,_roepe_in_Pta,_2022-05-24_06h53,_a.mp3), cut 17.44–18.14 s |
| `flap_honk_3` | some flaps | [Bostrychia hagedash hagadash, roepe 20s, 2022-09-25 06h43, Pretoria](https://commons.wikimedia.org/wiki/File:Bostrychia_hagedash_hagadash,_roepe_20s,_2022-09-25_06h43,_Pretoria,_a.mp3), cut 3.38–3.88 s |
| `crash_squawk` | crash | same roost-departure recording, cut 16.28–17.10 s |
| `title_call` | title screen | [Bostrychia hagedash hagedash, aandskemerroep, 2022-11-26 18h56, Moreletakloof NR](https://commons.wikimedia.org/wiki/File:Bostrychia_hagedash_hagedash,_aandskemerroep,_2022-11-26_18h56,_Moreletakloof_NR,_a.mp3), cut 0.88–3.74 s |
| `ambient_flock` | dawn ambience (looped, low) | same roost-departure recording, cut 8.15–15.55 s |

Changes made: cut, downmixed to mono, resampled to 48 kHz, high-passed at 200 Hz, lightly denoised, faded in and out, loudness-normalised, and encoded as 56 kbps AAC. The adapted clips (packed as base64 in `js/pack-sfx.js`) are themselves released under CC BY-SA 4.0, as the licence requires.

The flap whoosh, coin, score and hit blips and the music loop are synthesised in the browser in `js/audio.js`; they are original and not sampled.

## Joburg skyline, Hillbrow Tower, power lines, pylon and 10c coin

Original paintings made for this game in the same pipeline as the rest of the art, shipped as WebP inside `js/pack-art.js`. The Hillbrow Tower and skyline were painted from shape references only; no photographs are shipped. The 10c coin is a made-up game coin in an SA style (arum lily and "10c"); it carries no coat of arms, bank name or other official marking.
