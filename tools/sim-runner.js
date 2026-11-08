// Fairness and mode smoke tests for the Jozi runner sim. No canvas.
require("../src/00-logic.js");
var EISH = globalThis.EISH;
var fails = 0;
function assert(cond, msg) {
  if (!cond) {
    fails++;
    console.error("FAIL: " + msg);
  }
}

function gapAudit() {
  var prevs = [null];
  EISH.CHUNKS.forEach(function (ch) { prevs.push(EISH.chunkStats(ch)); });
  EISH.CHUNKS.forEach(function (ch) {
    prevs.forEach(function (prev) {
      var g = EISH.worstGap(prev, ch);
      assert(g < 3 && g > 0.3, ch.id + " gap " + g + " after " + (prev && prev.id));
      var st = EISH.chunkStats(ch);
      assert(!(st.blocks === 3), "triple block " + ch.id);
      assert(!(st.empty === 0 && st.verbs.length > 1), "mixed verbs " + ch.id);
    });
  });
}

function runOracle(mode, seed, seconds) {
  var s = EISH.create(mode, seed);
  var steps = Math.round(seconds * 60);
  var diedAt = null;
  for (var i = 0; i < steps; i++) {
    var input = EISH.oracle(s);
    EISH.step(s, 1 / 60, input);
    if (!s.alive) { diedAt = s; break; }
  }
  return s;
}

function scripted() {
  // Standing into a low hurdle dies. Jumping clears it.
  var s = EISH.create("run", 1);
  s.tut = 99;
  s.cursor = 5000;
  s.ents.push({ id: 1, kind: "obs", lane: 1, x: 0, z: 8, y: 0, verb: "low", variant: 0, dead: false, resolved: false, near: false });
  for (var i = 0; i < 80; i++) EISH.step(s, 1 / 60, {});
  assert(!s.alive && s.reason === "hit", "low hurdle should hit a runner who does not jump, reason=" + s.reason);

  s = EISH.create("run", 1);
  s.tut = 99;
  s.cursor = 5000;
  s.ents.push({ id: 1, kind: "obs", lane: 1, x: 0, z: 10, y: 0, verb: "low", variant: 0, dead: false, resolved: false, near: false });
  var jumped = false;
  for (i = 0; i < 120; i++) {
    var d = 10 - s.travel;
    var jump = !jumped && d / s.speed < 0.32 && d / s.speed > 0.2;
    if (jump) jumped = true;
    EISH.step(s, 1 / 60, { jump: jump });
    if (!s.alive) break;
  }
  assert(s.alive, "jump should clear a low hurdle, travel=" + s.travel.toFixed(1) + " y=" + s.y.toFixed(2));

  s = EISH.create("run", 1);
  s.tut = 99;
  s.cursor = 5000;
  s.ents.push({ id: 1, kind: "obs", lane: 1, x: 0, z: 10, y: 0, verb: "high", variant: 0, dead: false, resolved: false, near: false });
  var slid = false;
  for (i = 0; i < 120; i++) {
    var d2 = 10 - s.travel;
    var slide = !slid && d2 / s.speed < 0.34 && d2 / s.speed > 0.18;
    if (slide) slid = true;
    EISH.step(s, 1 / 60, { slide: slide });
    if (!s.alive) break;
  }
  assert(s.alive, "slide should clear a high bar");

  s = EISH.create("run", 1);
  s.tut = 99;
  s.cursor = 5000;
  s.ents.push({ id: 1, kind: "obs", lane: 1, x: 0, z: 12, y: 0, verb: "block", variant: 0, dead: false, resolved: false, near: false });
  for (i = 0; i < 30; i++) EISH.step(s, 1 / 60, { lane: -1 });
  for (i = 0; i < 90; i++) EISH.step(s, 1 / 60, {});
  assert(s.alive && s.lane === 0, "lane change should avoid a taxi, lane=" + s.lane + " alive=" + s.alive);

  // Shield absorbs one hit.
  s = EISH.create("run", 1);
  s.tut = 99;
  s.cursor = 5000;
  s.shield = true;
  s.ents.push({ id: 1, kind: "obs", lane: 1, x: 0, z: 6, y: 0, verb: "block", variant: 0, dead: false, resolved: false, near: false });
  for (i = 0; i < 60; i++) EISH.step(s, 1 / 60, {});
  assert(s.alive && !s.shield, "shield should absorb a taxi");

  // Gate: wrong lane strikes, three strikes end it. Right lane scores.
  s = EISH.create("robot", 3);
  s.tut = 99;
  s.cursor = 5000;
  s.ents.push({ id: 1, kind: "gate", lane: 0, x: EISH.laneX(0), z: 8, y: 0, verb: "boom", variant: 0, dead: false, resolved: false, near: false });
  for (i = 0; i < 80; i++) EISH.step(s, 1 / 60, {});
  assert(s.strikes === 1 && s.alive, "wrong robot lane is one strike, strikes=" + s.strikes);

  s = EISH.create("robot", 3);
  s.tut = 99;
  s.cursor = 5000;
  s.lane = 0;
  s.x = EISH.laneX(0);
  s.ents.push({ id: 1, kind: "gate", lane: 0, x: EISH.laneX(0), z: 8, y: 0, verb: "boom", variant: 0, dead: false, resolved: false, near: false });
  for (i = 0; i < 80; i++) EISH.step(s, 1 / 60, {});
  assert(s.alive && s.routes === 1 && s.strikes === 0, "open robot should score a route");

  // Rush ends on the clock even if you never crash.
  s = EISH.create("rush", 5);
  s.tut = 99;
  s.cursor = 9000;
  s.timeLeft = 0.2;
  for (i = 0; i < 20 && !s.finished; i++) EISH.step(s, 1 / 60, {});
  assert(s.finished && s.win && s.reason === "time", "taxi rush should finish when the clock ends");

  // Coin in the same lane scores; coin in another lane does not.
  s = EISH.create("run", 1);
  s.tut = 99;
  s.cursor = 5000;
  s.ents.push({ id: 1, kind: "coin", lane: 1, x: 0, z: 4, y: 0.2, verb: null, variant: 0, dead: false, resolved: false, near: false });
  s.ents.push({ id: 2, kind: "coin", lane: 0, x: EISH.laneX(0), z: 4.2, y: 0.2, verb: null, variant: 0, dead: false, resolved: false, near: false });
  for (i = 0; i < 40; i++) EISH.step(s, 1 / 60, {});
  assert(s.coins === 1, "only the coin in the runner's lane scores, coins=" + s.coins);
}

function survival() {
  [1, 2, 7, 21, 42].forEach(function (seed) {
    var run = runOracle("run", seed, 90);
    assert(run.alive, "classic seed " + seed + " died at " + (run.travel | 0) + "m reason=" + run.reason + " lane=" + run.lane);
    var rush = runOracle("rush", seed, 75);
    assert(rush.finished && rush.reason === "time", "rush seed " + seed + " reason=" + rush.reason + " alive=" + rush.alive + " t=" + rush.timeLeft);
    assert(rush.fares > 0, "rush seed " + seed + " collected no fares");
    var robot = runOracle("robot", seed, 90);
    assert(robot.alive && robot.routes >= 3, "robot seed " + seed + " routes=" + robot.routes + " strikes=" + robot.strikes + " alive=" + robot.alive + " m=" + (robot.travel | 0));
  });
}

gapAudit();
scripted();
survival();
if (fails) {
  console.error(fails + " failure(s)");
  process.exit(1);
}
console.log("sim-runner: all checks passed");
