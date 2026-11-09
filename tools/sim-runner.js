// Rules for Khaya Lane. Run with: node tools/sim-runner.js
var KHAYA = require("../src/00-logic.js");
var failed = 0;

function eq(name, got, want) {
  var ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) {
    failed++;
    console.error("FAIL", name, "got", got, "want", want);
  }
}

function truth(name, cond) {
  if (!cond) {
    failed++;
    console.error("FAIL", name);
  }
}

var s = KHAYA.fresh(1000);
eq("starter notes", s.notes, 60);
truth("starter home", KHAYA.hasType(s, "home"));
truth("no negatives", s.notes >= 0 && s.seeds >= 0 && s.water >= 0 && s.timber >= 0 && s.bricks >= 0);

var bed = s.buildings.filter(function (b) { return b.type === "bed"; })[0];
eq("sow maize", KHAYA.sow(s, bed.id, "maize").ok, true);
eq("seed spent", s.seeds, 11);
eq("sow twice", KHAYA.sow(s, bed.id, "maize").ok, false);
eq("harvest early", KHAYA.harvest(s, bed.id, 1000).ok, false);
eq("water", KHAYA.water(s, bed.id, 5000).ok, true);
eq("water spent", s.water, 9);
eq("not ready", KHAYA.cropReady(bed, 5000 + 15000), false);
eq("ready", KHAYA.cropReady(bed, 5000 + 16000), true);
var picked = KHAYA.harvest(s, bed.id, 5000 + 16000);
eq("harvest ok", picked.ok, true);
eq("maize yield", s.crops.maize, 3);
eq("harvest once", KHAYA.harvest(s, bed.id, 5000 + 16000).ok, false);
truth("farm xp", s.farmXp > 0);

eq("sell without spaza", KHAYA.sell(s, "maize", 1).ok, false);
var placed = KHAYA.place(s, "spaza", 5, 1);
eq("place spaza", placed.ok, true);
eq("notes after spaza", s.notes, 42);
eq("overlap", KHAYA.place(s, "workshop", 5, 1).ok, false);
eq("path blocked", KHAYA.place(s, "workshop", 4, 2).ok, false);
eq("tree blocked", KHAYA.place(s, "tank", 0, 0).ok, false);
eq("outside", KHAYA.place(s, "tank", 8, 1).ok, false);
var broke = KHAYA.fresh(1);
broke.notes = 0;
broke.timber = 0;
broke.bricks = 0;
eq("cannot afford", KHAYA.place(broke, "spaza", 5, 1).ok, false);
eq("funds unchanged", broke.notes, 0);

eq("sell", KHAYA.sell(s, "maize", 2).ok, true);
eq("notes from sale", s.notes, 50);
eq("stock left", s.crops.maize, 1);
eq("oversell", KHAYA.sell(s, "maize", 5).ok, false);
eq("stock safe", s.crops.maize, 1);

var home = s.buildings.filter(function (b) { return b.type === "home"; })[0];
eq("upgrade home", KHAYA.upgrade(s, home.id).ok, true);
eq("home level", home.level, 2);
eq("upgrade cap", (function () {
  KHAYA.upgrade(s, home.id);
  var third = KHAYA.upgrade(s, home.id);
  return third.ok;
})(), false);
truth("home stays 3 or less", home.level <= 3);

var low = KHAYA.fresh(1);
eq("tomato locked", KHAYA.sow(low, low.buildings[1].id, "tomato").ok, false);
low.farmXp = 24;
eq("tomato unlocked", KHAYA.sow(low, low.buildings[1].id, "tomato").ok, true);
eq("tomato water cost", KHAYA.water(low, low.buildings[1].id, 10).ok, true);
eq("water left", low.water, 8);

eq("solar locked", KHAYA.place(KHAYA.fresh(1), "solar", 5, 1).ok, false);
var skilled = KHAYA.fresh(1);
skilled.buildXp = 16;
eq("solar skill", KHAYA.canPlace(skilled, "solar", 5, 1).ok, true);

var pay = KHAYA.cratePayout(10);
eq("crate cap", pay.notes <= 24, true);
eq("crate seeds", pay.seeds, 1);
eq("market cap", KHAYA.marketPayout(9).notes <= 25, true);
var token = "crate-test";
var first = KHAYA.collectReward(s, token, KHAYA.cratePayout(10));
eq("collect", first.ok, true);
var notesAfter = s.notes;
eq("collect twice", KHAYA.collectReward(s, token, KHAYA.cratePayout(10)).ok, false);
eq("notes once", s.notes, notesAfter);
eq("empty payout", KHAYA.collectReward(s, "other", { notes: 0 }).ok, false);
eq("played stat", s.stats.played, 1);

var clock = KHAYA.fresh(0);
KHAYA.place(clock, "tank", 5, 1);
var plot = clock.buildings.filter(function (b) { return b.type === "bed"; })[0];
KHAYA.sow(clock, plot.id, "maize");
KHAYA.water(clock, plot.id, 0);
clock.seenAt = 0;
clock.water = 10;
var ticked = KHAYA.tick(clock, 15 * 60 * 1000);
eq("elapsed cap", ticked.elapsed, KHAYA.ELAPSE_CAP);
truth("crop not over-grown past cap", !KHAYA.cropReady(plot, 15 * 60 * 1000) || (15 * 60 * 1000 - plot.plantedAt) <= KHAYA.ELAPSE_CAP + 16000);
truth("growth bounded", (15 * 60 * 1000 - plot.plantedAt) <= KHAYA.ELAPSE_CAP);
truth("tank water bounded", clock.water <= 24);
var back = KHAYA.fresh(10000);
var before = back.buildings[1];
KHAYA.sow(back, before.id, "spinach");
KHAYA.water(back, before.id, 10000);
KHAYA.tick(back, 5000);
truth("clock back keeps plant", back.buildings[1].plantedAt === 10000);

eq("bad save", KHAYA.sanitize(null), null);
eq("wrong version", KHAYA.sanitize({ v: 2 }), null);
var dirty = KHAYA.sanitize({
  v: 1,
  notes: -40,
  seeds: "nope",
  water: 3,
  timber: 1,
  bricks: 1,
  farmXp: -5,
  crops: { maize: -2, tomato: 4 },
  buildings: [
    { type: "spaza", x: 4, y: 2, level: 9 },
    { type: "nope", x: 1, y: 1 },
    { type: "bed", x: 6, y: 2, phase: "growing", crop: "maize", plantedAt: 50 }
  ],
  paid: { "ok-token": 1 }
});
truth("sanitized", !!dirty);
eq("notes clamped", dirty.notes, 0);
eq("seeds clamped", dirty.seeds, 0);
eq("maize clamped", dirty.crops.maize, 0);
eq("path building dropped", dirty.buildings.some(function (b) { return b.type === "spaza"; }), false);
truth("home repaired", dirty.buildings.some(function (b) { return b.type === "home"; }));
truth("bed kept", dirty.buildings.some(function (b) { return b.type === "bed" && b.phase === "growing"; }));
eq("paid kept", dirty.paid["ok-token"], 1);

var ox = 400, oy = 80, tw = 64, th = 32;
var c;
for (var y = 0; y < 8; y++) {
  for (var x = 0; x < 8; x++) {
    var n = KHAYA.cellNorth(x, y, ox, oy, tw, th);
    c = KHAYA.pickCell(n.x, n.y + th / 2, ox, oy, tw, th);
    if (c.x !== x || c.y !== y) {
      failed++;
      console.error("FAIL pick", x, y, c);
    }
  }
}

eq("tasks start", KHAYA.currentTask(KHAYA.fresh(1)).id, "sow");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("sim-runner: all checks passed");
