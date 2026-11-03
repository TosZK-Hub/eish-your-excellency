# Eish, Your Excellency
A Reigns-style swipe game: run the fictional Republic of Mzansiland. HTML5, no backend, works offline.
A work of fictional satire. Any resemblance to real politicians is purely because things are like that.

- `cards.js`: characters, cards, endings (add cards here)
- `game.js`: logic · `style.css`: look · `sw.js`: offline cache

## v0.2 — microgames
- **Survival** (main mode): 8 Dumb-Ways-style microgames (3-5 s each), back-to-back, 3 lives, speed rises with score. Each fail plays a cute cartoon "dumb way to go" with an SA caption.
- **Presidency**: the swipe campaign, now with a 3-card tutorial and a microgame every 4-6 cards (plus trigger cards). Win steadies a meter; lose pushes it toward the edge.
- Debug: `?mg=pothole|lights|uncle|budget|mozzie|snack|rugby|fence|survival` (`&days=N` sets difficulty).
