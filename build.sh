#!/bin/sh
cd "$(dirname "$0")" && cat src/00-core.js src/10-kit.js src/20-games-a.js src/21-games-port.js src/22-games-port.js src/23-games-port.js src/24-games-new.js src/90-meta.js > game.js && node --check game.js && echo built $(wc -c < game.js)
