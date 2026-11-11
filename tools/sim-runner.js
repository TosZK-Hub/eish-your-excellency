// Rules for Khaya Lane. Run with: node tools/sim-runner.js
var KHAYA = require("../src/00-logic.js");
var LOOK = require("../src/05-catalog.js");
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
eq("first maize is quick", bed.growFor <= 60000 && bed.growFor >= 40000, true);
eq("not ready", KHAYA.cropReady(bed, 5000 + bed.growFor - 1000), false);
eq("ready", KHAYA.cropReady(bed, 5000 + bed.growFor), true);
var picked = KHAYA.harvest(s, bed.id, 5000 + bed.growFor);
eq("harvest ok", picked.ok, true);
eq("maize yield", s.crops.maize, 3);
eq("harvest once", KHAYA.harvest(s, bed.id, 5000 + bed.growFor).ok, false);
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
var notesBeforeUpgrade = s.notes;
eq("upgrade home", KHAYA.upgrade(s, home.id).ok, true);
eq("home waits", home.level, 1);
eq("upgrade paid", s.notes, notesBeforeUpgrade - 24);
eq("no overlap upgrade", KHAYA.upgrade(s, home.id).ok, false);
eq("notes held while building", s.notes, notesBeforeUpgrade - 24);
var built = KHAYA.tick(s, s.seenAt + KHAYA.UPGRADE_MS);
eq("home level", home.level, 2);
eq("one finish", built.finished.length, 1);
var xpAfterBuild = s.buildXp;
KHAYA.tick(s, s.seenAt + 5000);
eq("xp once", s.buildXp, xpAfterBuild);
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
eq("short gap is not capped", ticked.elapsed, 15 * 60 * 1000);
truth("maize finishes while you are away", KHAYA.cropReady(plot, 15 * 60 * 1000));
truth("tank water bounded", clock.water <= 24);
truth("tank caught up", clock.water > 10);
var overnight = KHAYA.fresh(0);
KHAYA.place(overnight, "spaza", 5, 1);
var nightShop = overnight.buildings.filter(function (b) { return b.type === "spaza"; })[0];
overnight.seenAt = 0;
var nightTick = KHAYA.tick(overnight, 12 * 60 * 60 * 1000);
eq("overnight cap", nightTick.elapsed, KHAYA.ELAPSE_CAP);
eq("spaza stops at its cap", nightShop.stored, 12);
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

eq("tasks start", KHAYA.currentTask(KHAYA.fresh(1)).id, "water");
eq("coach starts on the morogo", KHAYA.coach(KHAYA.fresh(Date.now()), Date.now()).act, "water");
var greens = KHAYA.fresh(1);
eq("pumpkin locked", KHAYA.sow(greens, greens.buildings[1].id, "pumpkin").ok, false);
eq("morogo", KHAYA.sow(greens, greens.buildings[1].id, "morogo").ok, true);
eq("morogo seed", greens.seeds, 11);

var wide = KHAYA.fresh(1);
eq("east locked", KHAYA.canPlace(wide, "bed", 9, 2).ok, false);
eq("lane still open", KHAYA.canPlace(wide, "workshop", 6, 4).ok, true);
eq("east needs level", KHAYA.canUnlock(wide, "east").ok, false);
wide.farmXp = 18;
wide.buildXp = 0;
eq("level 2 still short on notes? wait", KHAYA.playerLevel(wide) >= 2, true);
wide.notes = 80;
eq("unlock east", KHAYA.unlockPlot(wide, "east").ok, true);
eq("east notes spent", wide.notes, 0);
eq("unlock twice", KHAYA.unlockPlot(wide, "east").ok, false);
eq("east place", KHAYA.canPlace(wide, "bed", 9, 2).ok, false);
wide.timber = 8;
wide.notes = 20;
eq("east bed after open", KHAYA.place(wide, "bed", 9, 2).ok, true);
eq("koppie still shut", KHAYA.place(wide, "bed", 10, 10).ok, false);

var day = KHAYA.fresh(1);
var firstDay = KHAYA.claimDaily(day, "2026-11-09");
eq("day 1", firstDay.day, 1);
eq("day 1 notes", day.notes, 68);
eq("same day", KHAYA.claimDaily(day, "2026-11-09").ok, false);
eq("notes held", day.notes, 68);
var second = KHAYA.claimDaily(day, "2026-11-10");
eq("day 2", second.day, 2);
eq("day 2 seeds", second.seeds, 2);
var skipped = KHAYA.claimDaily(day, "2026-11-12");
eq("gap resets", skipped.day, 1);
eq("bad day", KHAYA.claimDaily(day, "tomorrow").ok, false);
eq("month edge", KHAYA.prevDay("2026-03-01"), "2026-02-28");
var kept = KHAYA.sanitize({ v: 1, notes: 5, daily: { last: "2026-11-09", day: 3 }, plots: { east: 1 } });
eq("daily kept", kept.daily.last, "2026-11-09");
eq("daily day kept", kept.daily.day, 3);
eq("plot migrated", kept.plots.east, 1);
eq("lane stays", kept.plots.lane, 1);
eq("claim after load", KHAYA.claimDaily(kept, "2026-11-09").ok, false);

var yard = KHAYA.fresh(1);
eq("pot", KHAYA.place(yard, "aloe_clump", 6, 4).ok, true);
var shop2 = null;
KHAYA.place(yard, "spaza", 5, 1);
shop2 = yard.buildings.filter(function (b) { return b.type === "spaza"; })[0];
shop2.stored = 0;
shop2.prodAcc = 0;
yard.seenAt = 0;
KHAYA.tick(yard, KHAYA.tuneProduce(yard, shop2).every);
eq("decor speeds notes", shop2.stored >= 1, true);
eq("decor cap room", KHAYA.tuneProduce(yard, shop2).cap, 13);

var bare = KHAYA.fresh(0);
KHAYA.place(bare, "spaza", 5, 1);
var bareShop = bare.buildings.filter(function (b) { return b.type === "spaza"; })[0];
bare.seenAt = 0;
KHAYA.tick(bare, KHAYA.PRODUCE.spaza.every * 14);
eq("plain cap unchanged", bareShop.stored, 12);

var folk = KHAYA.fresh(1);
eq("thabo starts known", folk.collection.farmer.have, 1);
eq("naledi locked", folk.collection.doek.have, 0);
folk.stats.placed = 1;
folk.crops.maize = 2;
eq("story needs a word", KHAYA.advanceStory(folk, "doek").step, 1);
eq("story stays", KHAYA.advanceStory(folk, "doek").ok, true);
var met = KHAYA.advanceStory(folk, "doek");
eq("naledi arrives", met.unlock, "doek");
eq("house without spaza", KHAYA.houseFolk(folk, "doek", folk.buildings[0].id).ok, true);
eq("thabo xp housed", KHAYA.folkBonus(folk).cap >= 1, true);
folk.collection.kid.have = 1;
eq("full home", (function () {
  KHAYA.houseFolk(folk, "farmer", folk.buildings[0].id);
  KHAYA.houseFolk(folk, "hen", folk.buildings[0].id);
  return KHAYA.houseFolk(folk, "kid", folk.buildings[0].id).ok;
})(), false);
var oldFolk = KHAYA.sanitize({
  v: 1,
  notes: 10,
  collection: { farmer: { have: 1, home: 1, seen: 0 } },
  buildings: [{ id: 1, type: "home", x: 1, y: 2, level: 1 }]
});
truth("home id remapped", oldFolk.collection.farmer.home > 0);
eq("v3 rejected", KHAYA.sanitize({ v: 3 }), null);
var guided = KHAYA.fresh(1);
guided.stats.sown = 1;
guided.stats.watered = 1;
guided.stats.harvested = 1;
guided.stats.placed = 1;
eq("collect goal", KHAYA.currentTask(guided).id, "collect");
eq("player starts at 1", KHAYA.playerLevel(KHAYA.fresh(1)), 1);
var ranked = KHAYA.fresh(1);
ranked.farmXp = 18;
eq("player level 2", KHAYA.playerLevel(ranked), 2);

var prod = KHAYA.fresh(0);
eq("place for production", KHAYA.place(prod, "spaza", 5, 1).ok, true);
var shop = prod.buildings.filter(function (b) { return b.type === "spaza"; })[0];
eq("stored starts empty", shop.stored || 0, 0);
KHAYA.tick(prod, KHAYA.PRODUCE.spaza.every);
eq("one note ready", shop.stored, 1);
var got = KHAYA.collect(prod, shop.id);
eq("collect notes", got.notes, 1);
eq("notes after collect", prod.notes, 43);
eq("collect twice", KHAYA.collect(prod, shop.id).ok, false);
eq("stored cleared", shop.stored, 0);
shop.prodAcc = 0;
prod.seenAt = 0;
KHAYA.tick(prod, KHAYA.PRODUCE.spaza.every * 14);
eq("production cap", shop.stored, 12);
var cappedNotes = prod.notes;
eq("cap collect", KHAYA.collect(prod, shop.id).notes, 12);
eq("no mint past cap", prod.notes, cappedNotes + 12);
eq("bed does not mint", KHAYA.collect(prod, prod.buildings[1].id).ok, false);

var mv = KHAYA.fresh(1);
var plot = mv.buildings.filter(function (b) { return b.type === "bed"; })[0];
var purse = mv.notes;
eq("path refuses a drag", KHAYA.move(mv, plot.id, 4, 2).ok, false);
eq("tree refuses a drag", KHAYA.move(mv, plot.id, 0, 0).ok, false);
eq("free drag", KHAYA.move(mv, plot.id, 5, 1).ok, true);
eq("bed moved", plot.x, 5);
eq("drag is free", mv.notes, purse);
eq("cannot cover the home", KHAYA.move(mv, plot.id, 1, 2).ok, false);
eq("bed stayed", plot.x, 5);

var savedProd = KHAYA.sanitize({
  v: 1,
  notes: 10,
  buildings: [
    { type: "spaza", x: 5, y: 1, level: 1, stored: -4, prodAcc: 999999 },
    { type: "home", x: 1, y: 2, level: 1, buildLeft: 4000, pendingLevel: 2, pendingXp: 14, buildTotal: 16000 }
  ]
});
var savedShop = savedProd.buildings.filter(function (b) { return b.type === "spaza"; })[0];
eq("stored clamped", savedShop.stored, 0);
eq("acc brought across", savedShop.prodAcc, KHAYA.PRODUCE.spaza.every);
var savedHome = savedProd.buildings.filter(function (b) { return b.type === "home"; })[0];
eq("build fraction kept", Math.round(100 * savedHome.buildLeft / savedHome.buildTotal), 25);
eq("pending kept", savedHome.pendingLevel, 2);
var legacy = KHAYA.sanitize({
  v: 1,
  seenAt: 200000,
  notes: 11,
  buildings: [
    { type: "home", x: 1, y: 2, level: 1 },
    { type: "bed", x: 6, y: 2, phase: "growing", crop: "maize", plantedAt: 200000 - 8000 }
  ]
});
var legBed = legacy.buildings.filter(function (b) { return b.type === "bed"; })[0];
eq("pace stamped", legacy.pace, 2);
eq("half-grown maize kept", legBed.plantedAt, 200000 - Math.round(0.5 * KHAYA.CROPS.maize.grow));
var replay = KHAYA.sanitize(JSON.parse(JSON.stringify(legacy)));
eq("migration runs once", replay.buildings.filter(function (b) { return b.type === "bed"; })[0].plantedAt, legBed.plantedAt);

var taxi = KHAYA.fresh(1000);
eq("taxi is here", taxi.orders.phase, "here");
eq("two or three orders", taxi.orders.list.length >= 2 && taxi.orders.list.length <= 3, true);
var job = taxi.orders.list[0];
var purse = taxi.notes;
var cropName;
for (cropName in job.need) taxi.crops[cropName] = job.need[cropName];
var filled = KHAYA.fillOrder(taxi, 0, 1000);
eq("order filled", filled.ok, true);
eq("order pay capped", filled.notes <= 36, true);
eq("order paid", taxi.notes, purse + filled.notes);
eq("order once", KHAYA.fillOrder(taxi, 0, 1000).ok, false);
var brokeOrder = KHAYA.fresh(1000);
eq("order needs the food", KHAYA.fillOrder(brokeOrder, 0, 1000).ok, false);
brokeOrder.orders.phase = "away";
brokeOrder.crops.maize = 20;
eq("no pay while away", KHAYA.fillOrder(brokeOrder, 0, 1000).ok, false);
var jumped = KHAYA.fresh(0);
jumped.orders = { phase: "away", at: 0, seq: 1, list: [], hoot: 0 };
KHAYA.tick(jumped, 10 * 60 * 1000);
eq("one board after a long gap", jumped.orders.phase === "here" && jumped.orders.seq === 2, true);

var critFarm = KHAYA.fresh(0);
var critBed = critFarm.buildings[1];
var c;
for (c = 0; c < 5; c++) {
  KHAYA.sow(critFarm, critBed.id, "maize");
  KHAYA.water(critFarm, critBed.id, c * 400000);
  KHAYA.harvest(critFarm, critBed.id, c * 400000 + critBed.growFor);
}
eq("five plain harvests", critFarm.crops.maize, 15);
KHAYA.sow(critFarm, critBed.id, "maize");
KHAYA.water(critFarm, critBed.id, 2400000);
var golden = KHAYA.harvest(critFarm, critBed.id, 2400000 + critBed.growFor);
eq("sixth is a crit", golden.crit, true);
eq("crit is triple", golden.amount, 9);
eq("crit stays in the stack", critFarm.crops.maize <= 99, true);
var again = null;
KHAYA.sow(critFarm, critBed.id, "maize");
KHAYA.water(critFarm, critBed.id, 3000000);
var comboAt = 3000000 + critBed.growFor;
critFarm.combo = 2;
critFarm.lastHarvest = comboAt - 2000;
again = KHAYA.harvest(critFarm, critBed.id, comboAt);
eq("combo stacks", again.combo, 3);
eq("combo pays a little", again.notes, 1);

var storm = KHAYA.fresh(0);
var sown = storm.buildings[1];
KHAYA.sow(storm, sown.id, "maize");
storm.laneEvent = { next: 0, n: 0, current: null };
KHAYA.tick(storm, 1000);
eq("storm arrives first", storm.laneEvent.current.type, "storm");
eq("storm waters", sown.phase, "growing");
var shed = KHAYA.fresh(0);
KHAYA.place(shed, "spaza", 5, 1);
var shedShop = shed.buildings.filter(function (b) { return b.type === "spaza"; })[0];
shed.laneEvent = { next: 1e15, n: 1, current: { type: "shed", until: 1e15, say: "out" } };
shed.seenAt = 0;
KHAYA.tick(shed, KHAYA.PRODUCE.spaza.every);
eq("shedding pauses the spaza", shedShop.stored || 0, 0);
shed.buildXp = 16;
eq("solar placed", KHAYA.place(shed, "solar", 6, 4).ok, true);
eq("switch to solar", KHAYA.respondEvent(shed, KHAYA.PRODUCE.spaza.every).ok, true);
shed.seenAt = KHAYA.PRODUCE.spaza.every;
KHAYA.tick(shed, KHAYA.PRODUCE.spaza.every * 2);
eq("spaza runs again", shedShop.stored >= 1, true);

var ball = KHAYA.fresh(0);
ball.laneEvent = { next: 999999, n: 0, current: { type: "ball", until: 5000, say: "kick" } };
var kicked = KHAYA.respondEvent(ball, 1000);
eq("ball pays two", kicked.notes, 2);
eq("ball once", KHAYA.respondEvent(ball, 1000).ok, false);

var goat = KHAYA.fresh(0);
goat.laneEvent = { next: 999999, n: 0, current: { type: "goat", until: 9000, taps: 0, say: "shoo" } };
KHAYA.respondEvent(goat, 1);
KHAYA.respondEvent(goat, 1);
var shoo = KHAYA.respondEvent(goat, 1);
eq("goat pays four", shoo.notes, 4);

eq("penalty cap", KHAYA.penaltyPayout(9).notes, 20);
eq("diketo cap", KHAYA.diketoPayout(8).notes, 16);
eq("penalty empty", KHAYA.penaltyPayout(0).notes, 0);

var braai = KHAYA.fresh(1000);
KHAYA.setToday(braai, "2026-11-09");
var braaiBed = braai.buildings[1];
KHAYA.sow(braai, braaiBed.id, "maize");
KHAYA.water(braai, braaiBed.id, 1000);
eq("weekday is not braai day", KHAYA.claimBraai(braai, "2026-11-09").ok, false);
KHAYA.setToday(braai, "2026-11-07");
var h;
for (h = 0; h < 4; h++) {
  KHAYA.sow(braai, braaiBed.id, "maize");
  KHAYA.water(braai, braaiBed.id, 2000 + h * 400000);
  KHAYA.harvest(braai, braaiBed.id, 2000 + h * 400000 + braaiBed.growFor);
}
var feast = KHAYA.claimBraai(braai, "2026-11-07");
eq("braai day pays", feast.notes, 16);
eq("braai once", KHAYA.claimBraai(braai, "2026-11-07").ok, false);

var freshAudit = KHAYA.layoutAudit(KHAYA.fresh(1000));
truth("fresh yard has no overlap", freshAudit.ok);
if (!freshAudit.ok) console.error(freshAudit.problems);

eq("prop blocks a bed", KHAYA.canPlace(KHAYA.fresh(1000), "bed", 5, 5).ok, false);
eq("prop blocks the barrow cell", KHAYA.canPlace(KHAYA.fresh(1000), "bed", 3, 4).ok, false);

function routeCells(entry) {
  var found = {};
  function add(x, y) {
    var cx = Math.floor(x);
    var cy = Math.floor(y);
    found[cx + "," + cy] = [cx, cy];
  }
  if (entry.at) add(entry.at[0], entry.at[1]);
  var route = entry.route || [];
  var i, a, b, t, steps;
  for (i = 0; i < route.length; i++) {
    a = route[i];
    b = route[(i + 1) % route.length];
    steps = 12;
    for (t = 0; t <= steps; t++) add(a[0] + (b[0] - a[0]) * t / steps, a[1] + (b[1] - a[1]) * t / steps);
  }
  return found;
}

function occupiedMap(state) {
  var used = {};
  var i, b, cells, c, p;
  for (i = 0; i < state.buildings.length; i++) {
    b = state.buildings[i];
    cells = KHAYA.footprint(b);
    for (c = 0; c < cells.length; c++) used[cells[c][0] + "," + cells[c][1]] = b.type;
  }
  for (i = 0; i < KHAYA.PROPS.length; i++) {
    p = KHAYA.PROPS[i];
    cells = KHAYA.footprint(p);
    for (c = 0; c < cells.length; c++) used[cells[c][0] + "," + cells[c][1]] = "prop:" + p.id;
  }
  return used;
}

var seenRoute = {};
var ri, entry, cells, key, walker;
for (ri = 0; ri < LOOK.cast.length; ri++) {
  entry = LOOK.cast[ri];
  cells = routeCells(entry);
  for (key in cells) {
    if (seenRoute[key]) truth(entry.id + " route avoids " + seenRoute[key], false);
    seenRoute[key] = entry.id;
    var cell = cells[key];
    truth(entry.id + " stays on the grid", cell[0] >= 0 && cell[1] >= 0 && cell[0] < KHAYA.COLS && cell[1] < KHAYA.ROWS);
  }
}

var late = KHAYA.fresh(1e15);
late.plots = { lane: 1, east: 1, south: 1, koppie: 1 };
var latePlan = [
  ["spaza", 5, 7, 1, 1],
  ["workshop", 8, 4, 1, 1],
  ["tank", 8, 5, 1, 1],
  ["solar", 8, 1, 1, 1],
  ["bed", 2, 7, 1, 1],
  ["bed", 4, 7, 1, 1],
  ["bed", 0, 7, 1, 1],
  ["bed", 5, 6, 1, 1],
  ["bed", 5, 2, 1, 1],
  ["braai", 1, 0, 1, 1],
  ["potjie", 1, 7, 1, 1],
  ["coop", 8, 2, 1, 1],
  ["kraal", 10, 4, 2, 2],
  ["aloe_clump", 8, 3, 1, 1],
  ["patch", 13, 2, 1, 1],
  ["imbawula", 8, 7, 1, 1],
  ["mielie", 12, 6, 1, 1],
  ["palisade", 14, 2, 1, 1],
  ["barrow", 13, 4, 1, 1],
  ["wash", 13, 6, 1, 1]
];
var lp;
for (lp = 0; lp < latePlan.length; lp++) {
  late.buildings.push({
    id: late.nextId++,
    type: latePlan[lp][0],
    x: latePlan[lp][1],
    y: latePlan[lp][2],
    w: latePlan[lp][3],
    h: latePlan[lp][4],
    level: latePlan[lp][0] === "home" ? 3 : 2
  });
}
var lateAudit = KHAYA.layoutAudit(late);
truth("late yard has no overlap", lateAudit.ok);
if (!lateAudit.ok) console.error(lateAudit.problems);

var lateUsed = occupiedMap(late);
for (key in seenRoute) {
  truth("route " + seenRoute[key] + " avoids late yard at " + key, !lateUsed[key]);
}
var freshUsed = occupiedMap(KHAYA.fresh(1000));
for (key in seenRoute) {
  truth("route " + seenRoute[key] + " avoids the starter yard at " + key, !freshUsed[key]);
}

var piled = KHAYA.fresh(1000);
piled.buildings.push({ id: 99, type: "bed", x: 6, y: 2, w: 1, h: 1, level: 1 });
truth("stacked beds fail the audit", KHAYA.layoutAudit(piled).ok === false);
var outside = KHAYA.fresh(1000);
outside.buildings.push({ id: 98, type: "bed", x: 20, y: 2, w: 1, h: 1, level: 1 });
truth("off-grid bed fails the audit", KHAYA.layoutAudit(outside).ok === false);

var oldBoard = KHAYA.sanitize({ v: 1, notes: 10, buildings: [{ type: "home", x: 1, y: 2, level: 1 }] });
truth("old save still loads", !!oldBoard);
eq("old notes kept", oldBoard.notes, 10);

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("sim-runner: all checks passed");
