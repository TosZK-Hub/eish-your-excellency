#!/bin/sh
cd "$(dirname "$0")" && cat src/00-logic.js src/05-catalog.js src/10-art.js src/15-world.js src/20-main.js > game.js && node --check game.js && echo built $(wc -c < game.js)
