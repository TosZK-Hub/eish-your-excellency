// Khaya Lane rules: farming, building, skills, and capped mini-game pay.
// Original game logic. No account, no real-money currency.
var KHAYA = (function () {
  var COLS = 16;
  var ROWS = 14;
  var ELAPSE_CAP = 10 * 60 * 1000;
  var TANK_MS = 20000;
  var WATER_CAP = 24;
  var NOTE_CAP = 9999;
  var STACK_CAP = 99;

  var MAP = [
    "tggggggtggpggggt",
    "gggggggggggggggg",
    "ggggpgggggggpggg",
    "ggggpgggggggpggg",
    "ggggpgggggggpggg",
    "ggggpgggggggpggg",
    "ppppggggppppgggg",
    "gggggggggggggggg",
    "ggggpgggtggggggg",
    "ggggpggggggggggg",
    "gggggggggggggggt",
    "gggggggggggggggg",
    "ppppggggggggpggg",
    "gggggggggggggggg"
  ];

  var PLOTS = {
    lane: { id: "lane", name: "The lane", x: 0, y: 0, w: 8, h: 8, notes: 0, level: 1, start: 1 },
    east: { id: "east", name: "East yard", x: 8, y: 0, w: 8, h: 8, notes: 80, level: 2 },
    south: { id: "south", name: "South field", x: 0, y: 8, w: 8, h: 6, notes: 120, level: 3 },
    koppie: { id: "koppie", name: "The koppie", x: 8, y: 8, w: 8, h: 6, notes: 180, level: 4 }
  };

  var DAILY = [
    { notes: 8 },
    { seeds: 2 },
    { notes: 12, water: 2 },
    { notes: 16 },
    { seeds: 3, water: 2 },
    { notes: 22 },
    { notes: 30, seeds: 2, water: 2 }
  ];

  var FOLK = {
    farmer: { name: "Thabo", kind: "villager", where: ["home", "bed"], bonus: { farmXp: 1 }, blurb: "Harvests teach a little more." },
    doek: { name: "Naledi", kind: "villager", where: ["spaza", "home"], bonus: { cap: 1 }, blurb: "The spaza holds one extra note." },
    jersey: { name: "Sipho", kind: "villager", where: ["workshop", "home"], bonus: { buildXp: 2 }, blurb: "Building work counts for a little more." },
    gogo: { name: "Gogo", kind: "villager", where: ["home"], bonus: { waterCap: 1 }, blurb: "The tank keeps one extra bottle." },
    kid: { name: "Aya", kind: "villager", where: ["home", "bed"], bonus: { sowXp: 1 }, blurb: "Sowing is a bit more fun." },
    hen: { name: "Hen", kind: "animal", where: ["home"], bonus: { cap: 1 }, blurb: "Notes pile a little higher." },
    dog: { name: "Biscuit", kind: "animal", where: ["home"], bonus: {}, blurb: "Keeps the yard company." }
  };

  var CROPS = {
    maize: { name: "Maize", grow: 16000, water: 1, seed: 1, yield: 3, xp: 8, level: 1, price: 4 },
    spinach: { name: "Spinach", grow: 12000, water: 1, seed: 1, yield: 2, xp: 6, level: 1, price: 3 },
    tomato: { name: "Tomato", grow: 22000, water: 2, seed: 1, yield: 2, xp: 12, level: 2, price: 6 },
    aloe: { name: "Aloe", grow: 20000, water: 1, seed: 1, yield: 1, xp: 10, level: 3, price: 8 }
  };

  var FARM_STEPS = [0, 24, 70, 140];
  var BUILD_STEPS = [0, 16, 48, 100];
  var PLAYER_STEPS = [0, 18, 48, 100, 180];
  var UPGRADE_MS = 16000;
  var PRODUCE = {
    spaza: { every: 8000, notes: 1, cap: 12 },
    workshop: { every: 12000, notes: 1, cap: 8 },
    solar: { every: 10000, notes: 1, cap: 8 }
  };

  var BUILDINGS = {
    home: {
      name: "Home", w: 2, h: 2, limit: 1, skill: 1,
      blurb: "The heart of the lane. Upgrade it as the place grows.",
      upgrades: [
        null,
        { notes: 24, timber: 3, bricks: 2, skill: 1, xp: 14 },
        { notes: 40, timber: 4, bricks: 4, skill: 2, xp: 20 }
      ]
    },
    bed: {
      name: "Veggie bed", w: 1, h: 1, limit: 8, skill: 1,
      cost: { notes: 10, timber: 1 },
      blurb: "A square of soil for maize, greens, tomatoes, and aloe."
    },
    spaza: {
      name: "Spaza", w: 1, h: 1, limit: 1, skill: 1,
      cost: { notes: 18, timber: 2, bricks: 1 },
      blurb: "The neighbourhood shop. Sell crops and fill orders here.",
      upgrades: [null, { notes: 22, timber: 2, bricks: 1, skill: 1, xp: 12 }]
    },
    tank: {
      name: "Rain tank", w: 1, h: 1, limit: 1, skill: 1,
      cost: { notes: 16, timber: 2, bricks: 1 },
      blurb: "Catches rain for the beds. A bottle of water, every few moments."
    },
    workshop: {
      name: "Workshop", w: 1, h: 1, limit: 1, skill: 1,
      cost: { notes: 20, timber: 3, bricks: 2 },
      blurb: "A bright shed for mending, and the home of Crate Day."
    },
    solar: {
      name: "Solar stand", w: 1, h: 1, limit: 1, skill: 2,
      cost: { notes: 28, timber: 2, bricks: 3 },
      blurb: "Shared power. The next building upgrade spends one less timber."
    },
    aloe_clump: {
      name: "Aloe clump", w: 1, h: 1, limit: 4, skill: 1, decor: 1,
      cost: { notes: 8 },
      blurb: "A pot of aloe. Each clump helps the lane earn a little faster."
    },
    palisade: {
      name: "Palisade", w: 1, h: 1, limit: 3, skill: 1, decor: 1,
      cost: { notes: 12 },
      blurb: "A short painted fence. It makes the yard feel finished."
    }
  };

  function clamp(n, lo, hi) {
    n = Math.floor(Number(n));
    if (!isFinite(n)) n = 0;
    if (n < lo) n = lo;
    if (n > hi) n = hi;
    return n;
  }

  function levelFor(xp, steps) {
    var lv = 1;
    var i;
    for (i = 1; i < steps.length; i++) if (xp >= steps[i]) lv = i + 1;
    return lv;
  }

  function farmLevel(state) { return levelFor(state.farmXp, FARM_STEPS); }
  function buildLevel(state) { return levelFor(state.buildXp, BUILD_STEPS); }
  function playerXp(state) { return (state.farmXp || 0) + (state.buildXp || 0); }
  function playerLevel(state) { return levelFor(playerXp(state), PLAYER_STEPS); }

  function nextStep(xp, steps) {
    var i;
    for (i = 1; i < steps.length; i++) if (xp < steps[i]) return { next: steps[i], prev: steps[i - 1], level: i };
    return { next: steps[steps.length - 1], prev: steps[steps.length - 1], level: steps.length, max: true };
  }

  function hasType(state, type) {
    var i;
    for (i = 0; i < state.buildings.length; i++) if (state.buildings[i].type === type) return true;
    return false;
  }

  function countType(state, type) {
    var n = 0;
    var i;
    for (i = 0; i < state.buildings.length; i++) if (state.buildings[i].type === type) n++;
    return n;
  }

  function terrainAt(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return "out";
    var ch = MAP[y].charAt(x);
    if (ch === "p") return "path";
    if (ch === "t") return "tree";
    return "grass";
  }

  function plotAt(x, y) {
    var id, p;
    for (id in PLOTS) {
      p = PLOTS[id];
      if (x >= p.x && y >= p.y && x < p.x + p.w && y < p.y + p.h) return p;
    }
    return null;
  }

  function plotOpen(state, x, y) {
    var p = plotAt(x, y);
    if (!p) return false;
    return !!(state.plots && state.plots[p.id]);
  }

  function cellBlock(state, x, y, ignoreId) {
    var land = terrainAt(x, y);
    if (land === "out") return { ok: false, reason: "That sits outside the lane." };
    var plot = plotAt(x, y);
    if (plot && !plotOpen(state, x, y)) return { ok: false, reason: "Unlock the " + plot.name.toLowerCase() + " first." };
    if (land === "path") return { ok: false, reason: "The path stays open for neighbours." };
    if (land === "tree") return { ok: false, reason: "The jacaranda stays." };
    if (occupied(state, x, y, ignoreId)) return { ok: false, reason: "Something is already there." };
    return { ok: true };
  }

  function footprint(b) {
    var cells = [];
    var dy, dx;
    for (dy = 0; dy < b.h; dy++) {
      for (dx = 0; dx < b.w; dx++) cells.push([b.x + dx, b.y + dy]);
    }
    return cells;
  }

  function occupied(state, x, y, ignoreId) {
    var i, cells, c;
    for (i = 0; i < state.buildings.length; i++) {
      if (state.buildings[i].id === ignoreId) continue;
      cells = footprint(state.buildings[i]);
      for (c = 0; c < cells.length; c++) {
        if (cells[c][0] === x && cells[c][1] === y) return state.buildings[i];
      }
    }
    return null;
  }

  function buildingById(state, id) {
    var i;
    for (i = 0; i < state.buildings.length; i++) if (state.buildings[i].id === id) return state.buildings[i];
    return null;
  }

  function cellNorth(x, y, ox, oy, tw, th) {
    return { x: ox + (x - y) * tw / 2, y: oy + (x + y) * th / 2 };
  }

  function pickCell(sx, sy, ox, oy, tw, th) {
    var a = (sx - ox) / (tw / 2);
    var b = (sy - oy) / (th / 2);
    return { x: Math.floor((a + b) / 2), y: Math.floor((b - a) / 2) };
  }

  function fresh(now) {
    now = now || 0;
    return {
      v: 1,
      notes: 60,
      seeds: 12,
      water: 10,
      timber: 8,
      bricks: 5,
      crops: { maize: 0, spinach: 0, tomato: 0, aloe: 0 },
      farmXp: 0,
      buildXp: 0,
      stats: { sown: 0, watered: 0, harvested: 0, placed: 0, upgraded: 0, played: 0, collected: 0, expanded: 0 },
      paid: {},
      tankAcc: 0,
      seenAt: now,
      nextId: 3,
      welcomed: false,
      plots: { lane: 1 },
      daily: { last: "", day: 0 },
      collection: {
        farmer: { have: 1, home: 0, seen: 1 },
        hen: { have: 1, home: 0, seen: 1 },
        doek: { have: 0, home: 0, seen: 0 },
        jersey: { have: 0, home: 0, seen: 0 },
        gogo: { have: 0, home: 0, seen: 0 },
        kid: { have: 0, home: 0, seen: 0 },
        dog: { have: 0, home: 0, seen: 0 }
      },
      buildings: [
        { id: 1, type: "home", x: 1, y: 2, w: 2, h: 2, level: 1 },
        { id: 2, type: "bed", x: 6, y: 2, w: 1, h: 1, level: 1, crop: null, phase: "empty", plantedAt: 0 }
      ]
    };
  }

  function afford(state, cost) {
    cost = cost || {};
    var missing = [];
    if ((cost.notes || 0) > state.notes) missing.push((cost.notes - state.notes) + " more notes");
    if ((cost.seeds || 0) > state.seeds) missing.push((cost.seeds - state.seeds) + " more seeds");
    if ((cost.water || 0) > state.water) missing.push((cost.water - state.water) + " more water");
    if ((cost.timber || 0) > state.timber) missing.push((cost.timber - state.timber) + " more timber");
    if ((cost.bricks || 0) > state.bricks) missing.push((cost.bricks - state.bricks) + " more bricks");
    if (missing.length) return { ok: false, reason: "Need " + missing.join(", ") + "." };
    return { ok: true };
  }

  function pay(state, cost) {
    var check = afford(state, cost);
    if (!check.ok) return check;
    state.notes -= cost.notes || 0;
    state.seeds -= cost.seeds || 0;
    state.water -= cost.water || 0;
    state.timber -= cost.timber || 0;
    state.bricks -= cost.bricks || 0;
    return { ok: true };
  }

  function timberDiscount(state, cost) {
    var copy = {
      notes: cost.notes || 0,
      timber: cost.timber || 0,
      bricks: cost.bricks || 0,
      seeds: cost.seeds || 0,
      water: cost.water || 0
    };
    if (hasType(state, "solar") && copy.timber > 0) copy.timber -= 1;
    return copy;
  }

  function placeCost(state, type) {
    var def = BUILDINGS[type];
    if (!def || !def.cost) return null;
    return timberDiscount(state, def.cost);
  }

  function canPlace(state, type, x, y) {
    var def = BUILDINGS[type];
    if (!def || !def.cost) return { ok: false, reason: "That cannot be placed." };
    if (buildLevel(state) < (def.skill || 1)) {
      return { ok: false, reason: "Building level " + def.skill + " unlocks the " + def.name.toLowerCase() + "." };
    }
    if (countType(state, type) >= def.limit) return { ok: false, reason: "You already have a " + def.name.toLowerCase() + "." };
    var dx, dy, block;
    for (dy = 0; dy < def.h; dy++) {
      for (dx = 0; dx < def.w; dx++) {
        block = cellBlock(state, x + dx, y + dy);
        if (!block.ok) return block;
      }
    }
    return afford(state, placeCost(state, type));
  }

  function place(state, type, x, y) {
    var check = canPlace(state, type, x, y);
    if (!check.ok) return check;
    var def = BUILDINGS[type];
    pay(state, placeCost(state, type));
    var b = { id: state.nextId++, type: type, x: x, y: y, w: def.w, h: def.h, level: 1 };
    if (type === "bed") { b.crop = null; b.phase = "empty"; b.plantedAt = 0; }
    state.buildings.push(b);
    state.buildXp += 8;
    if (type !== "bed") state.stats.placed += 1;
    return { ok: true, id: b.id, xp: 8 };
  }

  function upgradeCost(state, b) {
    var def = BUILDINGS[b.type];
    if (!def || !def.upgrades) return null;
    if (b.level >= def.upgrades.length) return null;
    var raw = def.upgrades[b.level];
    if (!raw) return null;
    return timberDiscount(state, raw);
  }

  function canUpgrade(state, id) {
    var b = buildingById(state, id);
    if (!b) return { ok: false, reason: "Nothing selected." };
    if ((b.buildLeft || 0) > 0) return { ok: false, reason: "Still building." };
    var def = BUILDINGS[b.type];
    var raw = def && def.upgrades ? def.upgrades[b.level] : null;
    if (!raw) return { ok: false, reason: def.name + " is fully built." };
    if (buildLevel(state) < (raw.skill || 1)) {
      return { ok: false, reason: "Building level " + raw.skill + " unlocks the next step." };
    }
    return afford(state, upgradeCost(state, b));
  }

  function upgrade(state, id) {
    var check = canUpgrade(state, id);
    if (!check.ok) return check;
    var b = buildingById(state, id);
    if ((b.buildLeft || 0) > 0) return { ok: false, reason: "Still building." };
    var raw = BUILDINGS[b.type].upgrades[b.level];
    pay(state, upgradeCost(state, b));
    b.buildLeft = UPGRADE_MS;
    b.buildTotal = UPGRADE_MS;
    b.pendingLevel = b.level + 1;
    b.pendingXp = raw.xp || 12;
    return { ok: true, building: true, left: UPGRADE_MS };
  }

  function finishBuild(state, b) {
    if (!b.pendingLevel || b.pendingLevel <= b.level) {
      b.pendingLevel = 0;
      b.pendingXp = 0;
      b.buildLeft = 0;
      return null;
    }
    var xp = (b.pendingXp || 12) + folkBonus(state).buildXp;
    b.level = b.pendingLevel;
    b.pendingLevel = 0;
    b.pendingXp = 0;
    b.buildLeft = 0;
    b.buildTotal = 0;
    state.buildXp += xp;
    state.stats.upgraded += 1;
    return { id: b.id, level: b.level, xp: xp };
  }

  function cropReady(b, now) {
    if (!b || b.type !== "bed" || b.phase !== "growing") return false;
    var def = CROPS[b.crop];
    if (!def) return false;
    return now - b.plantedAt >= def.grow;
  }

  function sow(state, id, crop) {
    var b = buildingById(state, id);
    var def = CROPS[crop];
    if (!b || b.type !== "bed") return { ok: false, reason: "Choose a veggie bed." };
    if (b.phase !== "empty") return { ok: false, reason: "That bed is already planted." };
    if (!def) return { ok: false, reason: "Unknown crop." };
    if (farmLevel(state) < def.level) return { ok: false, reason: "Farming level " + def.level + " unlocks " + def.name.toLowerCase() + "." };
    var spent = pay(state, { seeds: def.seed });
    if (!spent.ok) return spent;
    b.crop = crop;
    b.phase = "sown";
    b.plantedAt = 0;
    var sowXp = 2 + folkBonus(state).sowXp;
    state.farmXp += sowXp;
    state.stats.sown += 1;
    return { ok: true, xp: sowXp };
  }

  function water(state, id, now) {
    var b = buildingById(state, id);
    if (!b || b.type !== "bed") return { ok: false, reason: "Choose a veggie bed." };
    if (b.phase !== "sown") return { ok: false, reason: b.phase === "growing" ? "Already watered." : "Sow something first." };
    var def = CROPS[b.crop];
    var spent = pay(state, { water: def.water });
    if (!spent.ok) return spent;
    b.phase = "growing";
    b.plantedAt = now;
    state.farmXp += 2;
    state.stats.watered += 1;
    return { ok: true, xp: 2, grow: def.grow };
  }

  function harvest(state, id, now) {
    var b = buildingById(state, id);
    if (!b || b.type !== "bed") return { ok: false, reason: "Choose a veggie bed." };
    if (b.phase !== "growing") return { ok: false, reason: "Nothing is ready to pick." };
    if (!cropReady(b, now)) return { ok: false, reason: "Still growing." };
    var def = CROPS[b.crop];
    var name = b.crop;
    var amount = def.yield;
    state.crops[name] = clamp((state.crops[name] || 0) + amount, 0, STACK_CAP);
    var gained = def.xp + folkBonus(state).farmXp;
    state.farmXp += gained;
    state.stats.harvested += 1;
    b.crop = null;
    b.phase = "empty";
    b.plantedAt = 0;
    return { ok: true, crop: name, amount: amount, xp: gained };
  }

  function sell(state, crop, n) {
    var def = CROPS[crop];
    n = clamp(n, 0, STACK_CAP);
    if (!def) return { ok: false, reason: "Unknown crop." };
    if (!hasType(state, "spaza")) return { ok: false, reason: "Build a spaza first." };
    if (n < 1) return { ok: false, reason: "Choose how many to sell." };
    if ((state.crops[crop] || 0) < n) return { ok: false, reason: "Not enough " + def.name.toLowerCase() + "." };
    state.crops[crop] -= n;
    state.notes = clamp(state.notes + def.price * n, 0, NOTE_CAP);
    return { ok: true, notes: def.price * n };
  }

  function tick(state, now) {
    var last = state.seenAt == null ? now : state.seenAt;
    var gap = now - last;
    if (gap < 0) gap = 0;
    var used = gap > ELAPSE_CAP ? ELAPSE_CAP : gap;
    var discarded = gap - used;
    var i, b;
    if (discarded > 0) {
      for (i = 0; i < state.buildings.length; i++) {
        b = state.buildings[i];
        if (b.phase === "growing" && b.plantedAt != null) b.plantedAt += discarded;
      }
    }
    var waterCap = WATER_CAP + folkBonus(state).waterCap;
    if (hasType(state, "tank")) {
      state.tankAcc = (state.tankAcc || 0) + used;
      while (state.tankAcc >= TANK_MS && state.water < waterCap) {
        state.water += 1;
        state.tankAcc -= TANK_MS;
      }
      if (state.water >= waterCap) state.tankAcc = Math.min(state.tankAcc, TANK_MS);
    }
    var finished = [];
    for (i = 0; i < state.buildings.length; i++) {
      b = state.buildings[i];
      if ((b.buildLeft || 0) > 0) {
        b.buildLeft -= used;
        if (b.buildLeft <= 0) {
          var done = finishBuild(state, b);
          if (done) finished.push(done);
        }
      }
      var tune = tuneProduce(state, b);
      if (!tune) continue;
      b.prodAcc = (b.prodAcc || 0) + used;
      while (b.prodAcc >= tune.every && (b.stored || 0) < tune.cap) {
        b.stored = (b.stored || 0) + tune.notes;
        b.prodAcc -= tune.every;
      }
      if ((b.stored || 0) >= tune.cap) b.prodAcc = Math.min(b.prodAcc, tune.every);
    }
    var found = syncFolk(state);
    state.seenAt = now;
    return { elapsed: used, discarded: discarded, finished: finished, found: found };
  }

  function decorCount(state) {
    var n = 0;
    var i;
    for (i = 0; i < state.buildings.length; i++) {
      if (BUILDINGS[state.buildings[i].type] && BUILDINGS[state.buildings[i].type].decor) n++;
    }
    return n;
  }

  function folkBonus(state) {
    var out = { cap: 0, farmXp: 0, sowXp: 0, buildXp: 0, waterCap: 0 };
    if (!state || !state.collection) return out;
    var id, rec, spec;
    for (id in FOLK) {
      rec = state.collection[id];
      spec = FOLK[id];
      if (!rec || !rec.have || !rec.home) continue;
      if (spec.bonus.cap) out.cap += spec.bonus.cap;
      if (spec.bonus.farmXp) out.farmXp += spec.bonus.farmXp;
      if (spec.bonus.sowXp) out.sowXp += spec.bonus.sowXp;
      if (spec.bonus.buildXp) out.buildXp += spec.bonus.buildXp;
      if (spec.bonus.waterCap) out.waterCap += spec.bonus.waterCap;
    }
    out.cap = Math.min(3, out.cap);
    out.waterCap = Math.min(2, out.waterCap);
    return out;
  }

  function tuneProduce(state, b) {
    var spec = PRODUCE[b.type];
    if (!spec) return null;
    var decor = Math.min(4, decorCount(state));
    var folk = folkBonus(state);
    var cap = spec.cap + Math.max(0, (b.level || 1) - 1) * 4 + decor + folk.cap;
    if (cap > spec.cap + 8) cap = spec.cap + 8;
    var every = spec.every;
    if (decor) every = Math.max(4000, Math.floor(spec.every * (1 - 0.05 * decor)));
    return { cap: cap, every: every, notes: spec.notes };
  }

  function produceView(b, state) {
    if (!b) return null;
    var tune = state ? tuneProduce(state, b) : null;
    var spec = PRODUCE[b.type];
    if (!spec && !tune) return null;
    if (!tune) tune = { cap: spec.cap + Math.max(0, (b.level || 1) - 1) * 4, every: spec.every, notes: spec.notes };
    var stored = b.stored || 0;
    var acc = b.prodAcc || 0;
    return {
      stored: stored,
      cap: tune.cap,
      progress: stored >= tune.cap ? 1 : Math.min(1, acc / tune.every),
      left: stored >= tune.cap ? 0 : Math.max(0, tune.every - acc),
      ready: stored > 0
    };
  }

  function buildView(b) {
    if (!b || !(b.buildLeft > 0)) return null;
    var total = b.buildTotal || UPGRADE_MS;
    var left = b.buildLeft;
    return { left: left, progress: Math.max(0, Math.min(1, 1 - left / total)) };
  }

  function collect(state, id) {
    var b = buildingById(state, id);
    if (!b) return { ok: false, reason: "Nothing there." };
    if (!PRODUCE[b.type]) return { ok: false, reason: "That does not hold notes." };
    var n = b.stored || 0;
    if (n < 1) return { ok: false, reason: "Nothing to collect yet." };
    b.stored = 0;
    state.notes = clamp(state.notes + n, 0, NOTE_CAP);
    state.stats.collected = (state.stats.collected || 0) + 1;
    return { ok: true, notes: n, collected: true };
  }

  function canMove(state, id, x, y) {
    var b = buildingById(state, id);
    if (!b) return { ok: false, reason: "Nothing selected." };
    if (b.x === x && b.y === y) return { ok: true, same: true };
    var dx, dy, block;
    for (dy = 0; dy < b.h; dy++) {
      for (dx = 0; dx < b.w; dx++) {
        block = cellBlock(state, x + dx, y + dy, id);
        if (!block.ok) return block;
      }
    }
    return { ok: true };
  }

  function move(state, id, x, y) {
    var check = canMove(state, id, x, y);
    if (!check.ok) return check;
    var b = buildingById(state, id);
    b.x = x;
    b.y = y;
    return { ok: true, moved: !check.same, same: !!check.same };
  }

  function cratePayout(correct) {
    correct = clamp(correct, 0, 12);
    return { notes: Math.min(24, correct * 2), seeds: correct >= 8 ? 1 : 0, water: 0 };
  }

  function marketPayout(served) {
    served = clamp(served, 0, 5);
    return { notes: Math.min(25, served * 5), seeds: 0, water: served >= 5 ? 1 : 0 };
  }

  function collectReward(state, token, payout) {
    if (!token || typeof token !== "string" || token.length > 80) return { ok: false, reason: "Bad reward." };
    if (state.paid[token]) return { ok: false, reason: "Already collected." };
    payout = payout || {};
    var notes = clamp(payout.notes, 0, 25);
    var seeds = clamp(payout.seeds, 0, 2);
    var water = clamp(payout.water, 0, 2);
    if (notes + seeds + water <= 0) return { ok: false, reason: "Nothing to collect." };
    state.paid[token] = 1;
    var keys = Object.keys(state.paid);
    if (keys.length > 30) delete state.paid[keys[0]];
    state.notes = clamp(state.notes + notes, 0, NOTE_CAP);
    state.seeds = clamp(state.seeds + seeds, 0, STACK_CAP);
    state.water = clamp(state.water + water, 0, WATER_CAP);
    state.stats.played += 1;
    return { ok: true, notes: notes, seeds: seeds, water: water };
  }

  function canUnlock(state, id) {
    var plot = PLOTS[id];
    if (!plot || plot.start) return { ok: false, reason: "That ground is already open." };
    if (state.plots && state.plots[id]) return { ok: false, reason: "Already open." };
    if (playerLevel(state) < plot.level) return { ok: false, reason: "Lane level " + plot.level + " opens the " + plot.name.toLowerCase() + "." };
    return afford(state, { notes: plot.notes });
  }

  function unlockPlot(state, id) {
    var check = canUnlock(state, id);
    if (!check.ok) return check;
    pay(state, { notes: PLOTS[id].notes });
    state.plots[id] = 1;
    state.stats.expanded = (state.stats.expanded || 0) + 1;
    return { ok: true, plot: id, notes: PLOTS[id].notes };
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function dayKey(date) {
    return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
  }

  function prevDay(key) {
    var p = String(key || "").split("-");
    if (p.length !== 3) return "";
    var dt = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (!isFinite(dt.getTime())) return "";
    dt.setDate(dt.getDate() - 1);
    return dayKey(dt);
  }

  function claimDaily(state, key) {
    if (!state.daily) state.daily = { last: "", day: 0 };
    if (typeof key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return { ok: false, reason: "Bad day." };
    if (state.daily.last === key) return { ok: false, reason: "Already collected today." };
    var next = 1;
    if (state.daily.last && prevDay(key) === state.daily.last) next = (state.daily.day % 7) + 1;
    var reward = DAILY[next - 1];
    state.daily.last = key;
    state.daily.day = next;
    var notes = reward.notes || 0;
    var seeds = reward.seeds || 0;
    var water = reward.water || 0;
    state.notes = clamp(state.notes + notes, 0, NOTE_CAP);
    state.seeds = clamp(state.seeds + seeds, 0, STACK_CAP);
    state.water = clamp(state.water + water, 0, WATER_CAP + folkBonus(state).waterCap);
    return { ok: true, day: next, notes: notes, seeds: seeds, water: water };
  }

  function folkReady(state, id) {
    var stats = state.stats || {};
    if (id === "farmer" || id === "hen") return true;
    if (id === "doek") return stats.placed > 0 || playerLevel(state) >= 2;
    if (id === "kid") return stats.harvested > 0;
    if (id === "jersey") return stats.upgraded > 0;
    if (id === "gogo") return playerLevel(state) >= 3;
    if (id === "dog") return stats.played > 0;
    return false;
  }

  function syncFolk(state) {
    var found = [];
    if (!state.collection) state.collection = {};
    var id;
    for (id in FOLK) {
      if (!state.collection[id]) state.collection[id] = { have: 0, home: 0, seen: 0 };
      if (!state.collection[id].have && folkReady(state, id)) {
        state.collection[id].have = 1;
        found.push(id);
      }
    }
    return found;
  }

  function housedCount(state, buildingId, except) {
    var n = 0;
    var id;
    for (id in state.collection) {
      if (id === except) continue;
      if (state.collection[id] && state.collection[id].home === buildingId) n++;
    }
    return n;
  }

  function houseFolk(state, folkId, buildingId) {
    var spec = FOLK[folkId];
    if (!state.collection) state.collection = {};
    var rec = state.collection[folkId];
    if (!spec || !rec || !rec.have) return { ok: false, reason: "You have not met them yet." };
    var b = buildingById(state, buildingId);
    if (!b) return { ok: false, reason: "Choose a building." };
    var allowed = false;
    var i;
    for (i = 0; i < spec.where.length; i++) if (spec.where[i] === b.type) allowed = true;
    if (!allowed) return { ok: false, reason: spec.name + " stays by the " + spec.where[0] + "." };
    var room = b.type === "home" ? 3 : 1;
    if (housedCount(state, b.id, folkId) >= room) return { ok: false, reason: "That building is full." };
    rec.home = b.id;
    return { ok: true, housed: folkId };
  }

  function unhouseFolk(state, folkId) {
    if (!state.collection || !state.collection[folkId]) return { ok: false, reason: "Nobody by that name." };
    state.collection[folkId].home = 0;
    return { ok: true };
  }

  function seeFolk(state, folkId) {
    if (!state.collection || !state.collection[folkId] || !state.collection[folkId].have) return { ok: false };
    state.collection[folkId].seen = 1;
    return { ok: true };
  }

  function unseenFolk(state) {
    var n = 0;
    var id;
    if (!state.collection) return 0;
    for (id in state.collection) if (state.collection[id].have && !state.collection[id].seen) n++;
    return n;
  }

  function tasks(state) {
    return [
      { id: "sow", done: state.stats.sown > 0, text: "Sow maize in a veggie bed" },
      { id: "water", done: state.stats.watered > 0, text: "Water the bed" },
      { id: "harvest", done: state.stats.harvested > 0, text: "Harvest when the crop is ready" },
      { id: "place", done: state.stats.placed > 0, text: "Place a spaza, tank, or workshop" },
      { id: "collect", done: (state.stats.collected || 0) > 0, text: "Collect notes from the spaza" },
      { id: "upgrade", done: state.stats.upgraded > 0, text: "Upgrade your home" },
      { id: "play", done: state.stats.played > 0, text: "Finish a lane mini-game" }
    ];
  }

  function currentTask(state) {
    var list = tasks(state);
    var i;
    for (i = 0; i < list.length; i++) if (!list[i].done) return list[i];
    return { id: "done", done: true, text: "The lane is underway. Keep growing it." };
  }

  function bedView(b, now) {
    if (!b || b.type !== "bed") return null;
    if (b.phase === "empty") return { phase: "empty", progress: 0 };
    if (b.phase === "sown") return { phase: "sown", progress: 0, crop: b.crop };
    var def = CROPS[b.crop];
    var p = def ? (now - b.plantedAt) / def.grow : 0;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    return { phase: p >= 1 ? "ready" : "growing", progress: p, crop: b.crop, left: Math.max(0, def.grow - (now - b.plantedAt)) };
  }

  function sanitize(data) {
    if (!data || typeof data !== "object" || data.v !== 1) return null;
    var now = clamp(data.seenAt, 0, 8.64e15);
    var s = fresh(now);
    s.notes = clamp(data.notes, 0, NOTE_CAP);
    s.seeds = clamp(data.seeds, 0, STACK_CAP);
    s.water = clamp(data.water, 0, WATER_CAP);
    s.timber = clamp(data.timber, 0, STACK_CAP);
    s.bricks = clamp(data.bricks, 0, STACK_CAP);
    s.farmXp = clamp(data.farmXp, 0, 100000);
    s.buildXp = clamp(data.buildXp, 0, 100000);
    s.tankAcc = clamp(data.tankAcc, 0, TANK_MS);
    s.welcomed = !!data.welcomed;
    s.seenAt = now;
    var crops = data.crops || {};
    var k;
    for (k in CROPS) s.crops[k] = clamp(crops[k], 0, STACK_CAP);
    var stats = data.stats || {};
    for (k in s.stats) s.stats[k] = clamp(stats[k], 0, 100000);
    s.paid = {};
    if (data.paid && typeof data.paid === "object") {
      var tokens = Object.keys(data.paid).slice(-30);
      var t;
      for (t = 0; t < tokens.length; t++) {
        if (typeof tokens[t] === "string" && tokens[t].length <= 80) s.paid[tokens[t]] = 1;
      }
    }
    s.plots = { lane: 1 };
    if (data.plots && typeof data.plots === "object") {
      var pid;
      for (pid in PLOTS) if (data.plots[pid]) s.plots[pid] = 1;
    }
    s.plots.lane = 1;
    s.daily = { last: "", day: 0 };
    if (data.daily && typeof data.daily === "object") {
      if (typeof data.daily.last === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.daily.last)) s.daily.last = data.daily.last;
      s.daily.day = clamp(data.daily.day, 0, 7);
    }
    if (data.collection && typeof data.collection === "object") {
      var fid, rawF;
      for (fid in FOLK) {
        rawF = data.collection[fid];
        if (!rawF || typeof rawF !== "object") continue;
        s.collection[fid] = {
          have: rawF.have ? 1 : s.collection[fid].have,
          home: clamp(rawF.home, 0, 999999),
          seen: rawF.seen ? 1 : 0
        };
      }
    }
    s.buildings = [];
    s.nextId = 1;
    var list = Array.isArray(data.buildings) ? data.buildings : [];
    var idMap = {};
    var i, raw, def, b, dx, dy, ok, land, block;
    for (i = 0; i < list.length; i++) {
      raw = list[i];
      if (!raw || typeof raw !== "object") continue;
      def = BUILDINGS[raw.type];
      if (!def) continue;
      b = {
        id: s.nextId++,
        type: raw.type,
        x: clamp(raw.x, 0, COLS - 1),
        y: clamp(raw.y, 0, ROWS - 1),
        w: def.w,
        h: def.h,
        level: clamp(raw.level, 1, def.upgrades ? def.upgrades.length : 1),
        stored: clamp(raw.stored, 0, 30),
        prodAcc: clamp(raw.prodAcc, 0, 60000),
        buildLeft: clamp(raw.buildLeft, 0, 120000),
        buildTotal: clamp(raw.buildTotal, 0, 120000),
        pendingLevel: clamp(raw.pendingLevel, 0, def.upgrades ? def.upgrades.length : 1),
        pendingXp: clamp(raw.pendingXp, 0, 100)
      };
      if (b.pendingLevel <= b.level) {
        b.pendingLevel = 0;
        b.pendingXp = 0;
        if (!(raw.buildLeft > 0)) b.buildLeft = 0;
      }
      ok = true;
      for (dy = 0; dy < b.h && ok; dy++) {
        for (dx = 0; dx < b.w; dx++) {
          land = terrainAt(b.x + dx, b.y + dy);
          block = occupied(s, b.x + dx, b.y + dy);
          if (land !== "grass" || block || !plotOpen(s, b.x + dx, b.y + dy)) { ok = false; break; }
        }
      }
      if (!ok) continue;
      if (countType(s, b.type) >= def.limit) continue;
      if (typeof raw.id === "number") idMap[raw.id] = b.id;
      if (b.type === "bed") {
        b.crop = CROPS[raw.crop] ? raw.crop : null;
        b.phase = raw.phase === "sown" || raw.phase === "growing" ? raw.phase : "empty";
        if (!b.crop) b.phase = "empty";
        b.plantedAt = b.phase === "growing" ? clamp(raw.plantedAt, 0, 8.64e15) : 0;
        if (b.phase === "sown") b.plantedAt = 0;
      }
      s.buildings.push(b);
    }
    if (!hasType(s, "home")) {
      var hx = 1;
      var hy = 2;
      var free = true;
      var hx2, hy2;
      for (hy2 = 0; hy2 < 2 && free; hy2++) {
        for (hx2 = 0; hx2 < 2; hx2++) {
          if (terrainAt(hx + hx2, hy + hy2) !== "grass" || occupied(s, hx + hx2, hy + hy2)) free = false;
        }
      }
      if (free) s.buildings.unshift({ id: s.nextId++, type: "home", x: hx, y: hy, w: 2, h: 2, level: 1 });
    }
    var folkId;
    for (folkId in s.collection) {
      if (!s.collection[folkId].home) continue;
      if (!idMap[s.collection[folkId].home]) s.collection[folkId].home = 0;
      else s.collection[folkId].home = idMap[s.collection[folkId].home];
    }
    return s;
  }

  return {
    COLS: COLS,
    ROWS: ROWS,
    MAP: MAP,
    PLOTS: PLOTS,
    DAILY: DAILY,
    FOLK: FOLK,
    CROPS: CROPS,
    BUILDINGS: BUILDINGS,
    FARM_STEPS: FARM_STEPS,
    BUILD_STEPS: BUILD_STEPS,
    PLAYER_STEPS: PLAYER_STEPS,
    UPGRADE_MS: UPGRADE_MS,
    ELAPSE_CAP: ELAPSE_CAP,
    fresh: fresh,
    sanitize: sanitize,
    farmLevel: farmLevel,
    buildLevel: buildLevel,
    playerXp: playerXp,
    playerLevel: playerLevel,
    nextStep: nextStep,
    terrainAt: terrainAt,
    plotAt: plotAt,
    plotOpen: plotOpen,
    occupied: occupied,
    buildingById: buildingById,
    footprint: footprint,
    cellNorth: cellNorth,
    pickCell: pickCell,
    afford: afford,
    canPlace: canPlace,
    place: place,
    canUpgrade: canUpgrade,
    upgrade: upgrade,
    collect: collect,
    canMove: canMove,
    move: move,
    produceView: produceView,
    buildView: buildView,
    upgradeCost: upgradeCost,
    placeCost: placeCost,
    sow: sow,
    water: water,
    harvest: harvest,
    sell: sell,
    tick: tick,
    cropReady: cropReady,
    bedView: bedView,
    cratePayout: cratePayout,
    marketPayout: marketPayout,
    collectReward: collectReward,
    tasks: tasks,
    currentTask: currentTask,
    hasType: hasType,
    canUnlock: canUnlock,
    unlockPlot: unlockPlot,
    dayKey: dayKey,
    prevDay: prevDay,
    claimDaily: claimDaily,
    syncFolk: syncFolk,
    houseFolk: houseFolk,
    unhouseFolk: unhouseFolk,
    seeFolk: seeFolk,
    unseenFolk: unseenFolk,
    folkBonus: folkBonus,
    decorCount: decorCount,
    tuneProduce: tuneProduce
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = KHAYA;
