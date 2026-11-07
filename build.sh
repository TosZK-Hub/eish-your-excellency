#!/bin/sh
cd "$(dirname "$0")" && cat src/00-core.js src/10-stage.js src/20-games.js src/90-meta.js > game.js && node --check game.js && echo built $(wc -c < game.js)
