# Open-source review

Looked at isometric farming, building, and city-builder projects, mostly HTML5 and JavaScript. Nothing was copied. The ideas below were reimplemented in Khaya Lane's own canvas loop. GPL, AGPL, and LGPL projects were read only for the shape of a problem, not for code.

## Sources

| Name | URL | Licence | What we took or learned |
|---|---|---|---|
| rot.js | https://github.com/ondras/rot.js | BSD-3-Clause | Diamond hit-testing: a screen point maps to a tile by adding and subtracting the scaled axes. We already had that. The new tap bias checks the neighbouring tile when the finger lands in the gap beside a building. No source copied. |
| LittleJS | https://github.com/KilledByAPixel/LittleJS | MIT | A camera that coasts and then stops, small bursts for rewards, and skipping sprites that are off the canvas. Reimplemented in the existing frame loop and coin floats. The engine was not added. |
| Excalibur | https://github.com/excaliburjs/Excalibur | BSD-2-Clause | Placement is a preview until the player confirms. A drag moves the ghost. A tap on a legal tile sets it. No source copied. |
| Phaser | https://github.com/phaserjs/phaser | MIT | Camera velocity should die at the edge of the allowed pan instead of flinging the yard into empty ground. Reimplemented as a small reverse and a cap on flick speed. Phaser itself was not added. |
| PixiJS | https://github.com/pixijs/pixijs | MIT | Batch what does not move. The ground plate and the plant stamps were already cached. No library added. |
| melonJS | https://github.com/melonjs/melonJS | MIT | Cull objects whose feet are outside the stage. Applied as a skip in the draw queue. |
| farmsim | https://github.com/msakuta/farmsim | MIT | A crop has stages, and the save stays in the browser. Khaya Lane already did both. Nothing copied. |
| Farm to Stars | https://github.com/simongonzalezdc/Farm-to-Stars | MIT | Phaser isometric farming with offline saves. Useful as a map of the genre. Too heavy to depend on, and the art does not match the painted v2 yard. |
| Homestead | https://github.com/sudokatie/homestead | MIT | A small browser farm with local saves. Confirmed that the loop we have (sow, water, harvest, localStorage) is the right size. |
| OpenTTD | https://github.com/OpenTTD/OpenTTD | GPL-2.0 | Ideas only. A path should be one continuous route, which the lane already does. No code. |
| OpenRCT2 | https://github.com/OpenRCT2/OpenRCT2 | GPL-3.0 | Ideas only. A placement ghost should show legal ground in one colour and blocked ground in another. No code. |
| Lincity-ng | https://github.com/lincity-ng/lincity-ng | GPL-2.0 | Ideas only. Locked land should read as closed, not as random tiles. No code. |

## Adopted

- Fuller beds. Each stage is five clumps instead of four, and the ready stage is a little larger. The clumps still have to sit inside the bed diamond. `layoutAudit` fails if a stamp spills onto the next cell or overlaps another bed.
- Long drags. Flick speed is capped. After the finger lifts, the yard coasts and slows. At the pan limit the velocity turns back a little and dies, so a long drag does not slide into the empty veld.
- Taps. A finger that lands just beside a building still selects that building, within about half a tile of its centre. The placement ghost stays on the exact tile under the finger.
- Ghost. The footprint fills green when the tile is free and red when it is not. An illegal ghost shakes. Dragging only moves it. A tap on a legal tile places it. The bar says "tap to set it".
- Collect and harvest. The note burst and the harvest burst throw a few more coins, and a collect gives the building a small squash. This uses the floats that were already there.
- Drawing. Sprites whose feet are well above or below the stage are not drawn. The ground plate and plant stamps stay cached. No new library.

## Left for later

- A real sprite atlas and one draw call for the whole yard, the way PixiJS and LittleJS batch. The plate cache is enough for the current yard.
- Phaser's camera follow and pinch helpers. Ours is a few lines and stays offline.
- Seasonal crop art and per-day watering from Homestead and farmsim. That would change the pacing Jesse already set.
- GPL city-builder tools (road brushes, zone painting). The lane is one path. A brush would be a new feature.
