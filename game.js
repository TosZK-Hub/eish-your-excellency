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
    dog: { name: "Biscuit", kind: "animal", where: ["home"], bonus: {}, blurb: "An Africanis. Keeps the yard company." },
    basotho: { name: "Ntate", kind: "villager", where: ["home"], bonus: { farmXp: 1 }, blurb: "A Basotho elder. Harvests settle in when he stays." },
    taxi: { name: "Jabu", kind: "villager", where: ["home", "workshop"], bonus: { buildXp: 1 }, blurb: "Drives the taxi. Building counts for a little more." },
    cow: { name: "Nguni", kind: "animal", where: ["home"], bonus: { cap: 1 }, blurb: "A Nguni cow. Notes pile a little higher when she stays." },
    goat: { name: "Boer", kind: "animal", where: ["home"], bonus: {}, blurb: "A Boer goat. Company for the kraal." }
  };

  var CROPS = {
    maize: { name: "Maize", grow: 16000, water: 1, seed: 1, yield: 3, xp: 8, level: 1, price: 4 },
    spinach: { name: "Spinach", grow: 12000, water: 1, seed: 1, yield: 2, xp: 6, level: 1, price: 3, offer: false },
    tomato: { name: "Tomato", grow: 22000, water: 2, seed: 1, yield: 2, xp: 12, level: 2, price: 6, offer: false },
    aloe: { name: "Aloe", grow: 20000, water: 1, seed: 1, yield: 1, xp: 10, level: 3, price: 8 },
    morogo: { name: "Morogo", grow: 14000, water: 1, seed: 1, yield: 2, xp: 7, level: 1, price: 4 },
    pumpkin: { name: "Pumpkin", grow: 24000, water: 2, seed: 1, yield: 2, xp: 14, level: 2, price: 7 }
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
      name: "Palisade", w: 1, h: 1, limit: 3, skill: 1, decor: 1, menu: false,
      cost: { notes: 12 },
      blurb: "A short painted fence. It makes the yard feel finished."
    },
    braai: { name: "Braai", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 14 }, blurb: "An oil-drum braai. The yard smells like boerewors." },
    potjie: { name: "Potjie", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 16 }, blurb: "A three-legged pot over a small fire." },
    imbawula: { name: "Imbawula", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 10 }, blurb: "A coal brazier with a kettle on top." },
    barrow: { name: "Wheelbarrow", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 12 }, blurb: "Bricks and a spade, ready for the next job." },
    mielie: { name: "Mielie cart", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 18 }, blurb: "Roasting cobs for anyone walking past." },
    wash: { name: "Washing line", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 10 }, blurb: "Monday's washing, bright against the sky." },
    coop: { name: "Chicken coop", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 22 }, blurb: "A tidy coop. The hens already know the way." },
    patch: { name: "Pumpkin patch", w: 1, h: 1, limit: 1, skill: 1, decor: 1, cost: { notes: 12 }, blurb: "Vines and Boer pumpkins on the red earth." },
    kraal: { name: "Kraal", w: 2, h: 2, limit: 1, skill: 1, decor: 1, cost: { notes: 36 }, blurb: "Poles and thorn branches, with room for the cow and the goat." }
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
      crops: { maize: 0, spinach: 0, tomato: 0, aloe: 0, morogo: 0, pumpkin: 0 },
      farmXp: 0,
      buildXp: 0,
      stats: { sown: 0, watered: 0, harvested: 0, placed: 0, upgraded: 0, played: 0, collected: 0, expanded: 0 },
      paid: {},
      tankAcc: 0,
      seenAt: now,
      nextId: 5,
      welcomed: false,
      today: "",
      combo: 0,
      lastHarvest: 0,
      chests: {},
      chest: null,
      orders: { phase: "here", at: now, seq: 1, list: rollOrders(1), hoot: 1 },
      laneEvent: { next: (now || 0) + 8000, n: 0, current: null },
      stories: {},
      braai: { key: "", n: 0, claimed: 0 },
      plots: { lane: 1 },
      daily: { last: "", day: 0 },
      collection: {
        farmer: { have: 1, home: 0, seen: 1 },
        hen: { have: 1, home: 0, seen: 1 },
        doek: { have: 0, home: 0, seen: 0 },
        jersey: { have: 0, home: 0, seen: 0 },
        gogo: { have: 0, home: 0, seen: 0 },
        kid: { have: 0, home: 0, seen: 0 },
        dog: { have: 0, home: 0, seen: 0 },
        basotho: { have: 0, home: 0, seen: 0 },
        taxi: { have: 0, home: 0, seen: 0 },
        cow: { have: 0, home: 0, seen: 0 },
        goat: { have: 0, home: 0, seen: 0 }
      },
      buildings: [
        { id: 1, type: "home", x: 1, y: 2, w: 2, h: 2, level: 1 },
        { id: 2, type: "bed", x: 6, y: 2, w: 1, h: 1, level: 1, crop: null, phase: "empty", plantedAt: 0 },
        { id: 3, type: "bed", x: 5, y: 4, w: 1, h: 1, level: 1, crop: "maize", phase: "growing", plantedAt: now },
        { id: 4, type: "bed", x: 6, y: 5, w: 1, h: 1, level: 1, crop: "morogo", phase: "sown", plantedAt: 0 }
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
    var before = playerLevel(state);
    b.level = b.pendingLevel;
    b.pendingLevel = 0;
    b.pendingXp = 0;
    b.buildLeft = 0;
    b.buildTotal = 0;
    state.buildXp += xp;
    state.stats.upgraded += 1;
    var chest = playerLevel(state) > before ? offerChest(state) : null;
    return { id: b.id, level: b.level, xp: xp, chest: chest };
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
    var crit = (state.stats.harvested % 6) === 5;
    var amount = def.yield * (crit ? 3 : 1);
    state.crops[name] = clamp((state.crops[name] || 0) + amount, 0, STACK_CAP);
    var gained = def.xp + folkBonus(state).farmXp;
    var before = playerLevel(state);
    state.farmXp += gained;
    state.stats.harvested += 1;
    if (state.lastHarvest && now - state.lastHarvest < 9000) state.combo = Math.min(5, (state.combo || 0) + 1);
    else state.combo = 1;
    state.lastHarvest = now;
    var bonus = 0;
    if (state.combo >= 3) bonus = Math.min(3, state.combo - 2);
    if (bonus) state.notes = clamp(state.notes + bonus, 0, NOTE_CAP);
    if (crit) state.seeds = clamp(state.seeds + 1, 0, STACK_CAP);
    noteBraai(state);
    var chest = null;
    if (playerLevel(state) > before) chest = offerChest(state);
    b.crop = null;
    b.phase = "empty";
    b.plantedAt = 0;
    return { ok: true, crop: name, amount: amount, xp: gained, crit: crit, combo: state.combo, notes: bonus, chest: chest };
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
    syncTaxi(state, now);
    var laneEvent = syncEvents(state, now);
    var shed = laneEvent.current && laneEvent.current.type === "shed" && !laneEvent.current.solar;
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
      if (shed) continue;
      b.prodAcc = (b.prodAcc || 0) + used;
      while (b.prodAcc >= tune.every && (b.stored || 0) < tune.cap) {
        b.stored = (b.stored || 0) + tune.notes;
        b.prodAcc -= tune.every;
      }
      if ((b.stored || 0) >= tune.cap) b.prodAcc = Math.min(b.prodAcc, tune.every);
    }
    var found = syncFolk(state);
    state.seenAt = now;
    return { elapsed: used, discarded: discarded, finished: finished, found: found, event: laneEvent.current, hoot: state.orders && state.orders.hoot };
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

  function storyOpen(state, id) {
    var stats = state.stats || {};
    if (id === "farmer" || id === "hen") return false;
    if (id === "doek") return stats.placed > 0 || playerLevel(state) >= 2;
    if (id === "kid") return stats.harvested > 0;
    if (id === "jersey") return stats.upgraded > 0;
    if (id === "gogo") return playerLevel(state) >= 3;
    if (id === "dog") return stats.played > 0;
    if (id === "basotho") return playerLevel(state) >= 2;
    if (id === "taxi") return stats.placed > 0;
    if (id === "cow") return (stats.expanded || 0) > 0;
    if (id === "goat") return (stats.collected || 0) > 0;
    return false;
  }

  function folkReady(state, id) {
    if (id === "farmer" || id === "hen") return true;
    var rec = state.collection && state.collection[id];
    return !!(rec && rec.have);
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
    s.combo = clamp(data.combo, 0, 5);
    s.lastHarvest = clamp(data.lastHarvest, 0, 8.64e15);
    if (typeof data.today === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.today)) s.today = data.today;
    s.chests = {};
    if (data.chests && typeof data.chests === "object") {
      var ck;
      for (ck in data.chests) {
        var clv = clamp(ck, 1, 20);
        if (clv > 1 && data.chests[ck]) s.chests[clv] = 1;
      }
    }
    s.chest = null;
    if (data.chest && data.chest.level && !s.chests[data.chest.level]) {
      var chestLv = clamp(data.chest.level, 2, 20);
      if (!s.chests[chestLv]) s.chest = { level: chestLv };
    }
    if (data.stories && typeof data.stories === "object") {
      var sid;
      for (sid in STORIES) s.stories[sid] = clamp(data.stories[sid], 0, STORIES[sid].length);
    }
    if (data.braai && typeof data.braai === "object") {
      s.braai = {
        key: (typeof data.braai.key === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.braai.key)) ? data.braai.key : "",
        n: clamp(data.braai.n, 0, 8),
        claimed: data.braai.claimed ? 1 : 0
      };
    }
    if (data.orders && data.orders.phase === "here" && data.orders.list && data.orders.list.length) {
      s.orders = {
        phase: "here",
        at: clamp(data.orders.at, 0, 8.64e15),
        seq: clamp(data.orders.seq, 0, 100000),
        hoot: 0,
        list: []
      };
      var oi;
      for (oi = 0; oi < data.orders.list.length && oi < 3; oi++) {
        var job = data.orders.list[oi];
        if (!job || !job.need) continue;
        s.orders.list.push({
          name: String(job.name || "Run").slice(0, 40),
          say: String(job.say || "").slice(0, 80),
          need: job.need,
          notes: clamp(job.notes, 0, 36),
          xp: clamp(job.xp, 0, 8),
          rare: job.rare ? 1 : 0
        });
      }
      if (!s.orders.list.length) s.orders = { phase: "away", at: s.seenAt, seq: s.orders.seq, list: [], hoot: 0 };
    }
    return s;
  }

  var ORDER_STAY = 42000;
  var ORDER_GAP = 70000;
  var RUNS = [
    { name: "Soweto run", say: "6 mielies and 2 morogo for the Soweto run", need: { maize: 6, morogo: 2 } },
    { name: "Alex rank", say: "4 mielies for the Alex rank", need: { maize: 4 } },
    { name: "Vetkoek stop", say: "3 morogo and a pumpkin", need: { morogo: 3, pumpkin: 1 } },
    { name: "Clinic lift", say: "2 aloe for the clinic", need: { aloe: 2 } },
    { name: "School run", say: "5 mielies for the school run", need: { maize: 5 } }
  ];

  function rollOrders(seq) {
    var picks = [seq % RUNS.length, (seq + 2) % RUNS.length];
    if (seq % 3 === 0) picks.push((seq + 4) % RUNS.length);
    var list = [];
    var i, run, notes, k;
    for (i = 0; i < picks.length; i++) {
      run = RUNS[picks[i]];
      notes = 0;
      for (k in run.need) notes += (CROPS[k] ? CROPS[k].price : 4) * run.need[k];
      notes = Math.min(36, Math.max(8, Math.floor(notes * 1.5)));
      list.push({ name: run.name, say: run.say, need: run.need, notes: notes, xp: 6, rare: ((seq + i) % 5) === 0 ? 1 : 0 });
    }
    return list;
  }

  function syncTaxi(state, now) {
    if (!state.orders) state.orders = { phase: "away", at: now, seq: 0, list: [], hoot: 0 };
    var o = state.orders;
    if (o.phase === "here") {
      if (now >= (o.at || 0) + ORDER_STAY) {
        o.phase = "away";
        o.at = now;
        o.list = [];
        o.hoot = 0;
      }
      return o;
    }
    if (now - (o.at || 0) >= ORDER_GAP) {
      o.seq = (o.seq || 0) + 1;
      o.phase = "here";
      o.at = now;
      o.list = rollOrders(o.seq);
      o.hoot = 1;
    }
    return o;
  }

  function fillOrder(state, index, now) {
    syncTaxi(state, now || 0);
    var o = state.orders;
    if (!o || o.phase !== "here") return { ok: false, reason: "Jabu is still on the road." };
    var job = o.list[index];
    if (!job) return { ok: false, reason: "That order has gone." };
    var k;
    for (k in job.need) {
      if ((state.crops[k] || 0) < job.need[k]) return { ok: false, reason: "Not enough " + (CROPS[k] ? CROPS[k].name.toLowerCase() : "food") + "." };
    }
    for (k in job.need) state.crops[k] -= job.need[k];
    var notes = Math.min(36, job.notes || 0);
    state.notes = clamp(state.notes + notes, 0, NOTE_CAP);
    state.farmXp += Math.min(8, job.xp || 0);
    var rare = "";
    if (job.rare) {
      state.seeds = clamp(state.seeds + 1, 0, STACK_CAP);
      rare = "seeds";
    }
    o.list.splice(index, 1);
    if (!o.list.length) {
      o.phase = "away";
      o.at = now || 0;
    }
    return { ok: true, notes: notes, xp: 6, rare: rare };
  }

  function waterSown(state, now) {
    var n = 0;
    var i, b;
    for (i = 0; i < state.buildings.length; i++) {
      b = state.buildings[i];
      if (b.type === "bed" && b.phase === "sown") {
        b.phase = "growing";
        b.plantedAt = now;
        n += 1;
      }
    }
    return n;
  }

  function syncEvents(state, now) {
    if (!state.laneEvent) state.laneEvent = { next: now + 8000, n: 0, current: null };
    var ev = state.laneEvent;
    if (ev.current && now >= ev.current.until) {
      if (ev.current.type === "goat" && (ev.current.taps || 0) < 3) {
        var i, b;
        for (i = 0; i < state.buildings.length; i++) {
          b = state.buildings[i];
          if (b.type === "bed" && b.phase === "growing") { b.plantedAt += 4000; break; }
        }
      }
      ev.current = null;
      ev.next = now + 90000;
    }
    if (!ev.current && now >= (ev.next || 0)) {
      var kinds = ["storm", "shed", "goat", "gogo", "vendor", "ball"];
      var kind = kinds[(ev.n || 0) % kinds.length];
      ev.n = (ev.n || 0) + 1;
      var until = now + 28000;
      ev.current = { type: kind, until: until, say: "" };
      if (kind === "storm") {
        ev.current.until = now + 9000;
        ev.current.say = "Highveld storm. The beds are drinking.";
        ev.current.watered = waterSown(state, now);
      } else if (kind === "shed") {
        ev.current.say = "Eish, load-shedding. Tap to switch the solar on.";
      } else if (kind === "goat") {
        ev.current.say = "The goat is in the mielies! Tap to chase it.";
        ev.current.taps = 0;
      } else if (kind === "gogo") {
        ev.current.say = "Howzit — Gogo needs 2 mielies, sharp sharp.";
      } else if (kind === "vendor") {
        ev.current.say = "Ice-cream bicycle. 2 seeds for 6 notes.";
      } else {
        ev.current.say = "A soccer ball rolled in. Kick it!";
      }
      ev.next = now + 90000;
    }
    return ev;
  }

  function respondEvent(state, now) {
    syncEvents(state, now || 0);
    var cur = state.laneEvent.current;
    if (!cur) return { ok: false, reason: "The lane is quiet." };
    if (cur.type === "storm") return { ok: true, say: cur.say };
    if (cur.type === "shed") {
      if (!hasType(state, "solar")) return { ok: false, reason: "No solar stand yet. The lights stay off." };
      cur.solar = 1;
      state.laneEvent.current = null;
      state.laneEvent.next = (now || 0) + 90000;
      return { ok: true, say: "Solar's on. Sharp sharp." };
    }
    if (cur.type === "goat") {
      cur.taps = (cur.taps || 0) + 1;
      if (cur.taps < 3) return { ok: true, say: "Chase! " + cur.taps + " of 3." };
      state.notes = clamp(state.notes + 4, 0, NOTE_CAP);
      state.laneEvent.current = null;
      return { ok: true, notes: 4, say: "Shoo! The goat is out of the beds." };
    }
    if (cur.type === "gogo") {
      if ((state.crops.maize || 0) < 2) return { ok: false, reason: "Gogo still needs 2 mielies." };
      state.crops.maize -= 2;
      state.notes = clamp(state.notes + 8, 0, NOTE_CAP);
      state.farmXp += 4;
      state.laneEvent.current = null;
      return { ok: true, notes: 8, say: "Lekker. Gogo is pleased." };
    }
    if (cur.type === "vendor") {
      if ((state.notes || 0) < 6) return { ok: false, reason: "Not enough notes for the bicycle." };
      state.notes -= 6;
      state.seeds = clamp(state.seeds + 2, 0, STACK_CAP);
      state.laneEvent.current = null;
      return { ok: true, seeds: 2, say: "Lekker. Two seeds." };
    }
    if (cur.type === "ball") {
      state.notes = clamp(state.notes + 2, 0, NOTE_CAP);
      state.laneEvent.current = null;
      return { ok: true, notes: 2, say: "Goal! Two notes." };
    }
    return { ok: false, reason: "Nothing to do." };
  }

  function offerChest(state) {
    var lv = playerLevel(state);
    if (lv < 2) return null;
    if (!state.chests) state.chests = {};
    if (state.chests[lv]) return null;
    state.chest = { level: lv };
    return lv;
  }

  function claimChest(state) {
    if (!state.chest || !state.chest.level) return { ok: false, reason: "No chest." };
    var lv = state.chest.level;
    if (!state.chests) state.chests = {};
    if (state.chests[lv]) return { ok: false, reason: "Already opened." };
    state.chests[lv] = 1;
    state.chest = null;
    state.notes = clamp(state.notes + 12, 0, NOTE_CAP);
    state.seeds = clamp(state.seeds + 1, 0, STACK_CAP);
    return { ok: true, notes: 12, seeds: 1, level: lv };
  }

  function weekendKey(key) {
    var p = String(key || "").split("-");
    if (p.length !== 3) return "";
    var dt = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (!isFinite(dt.getTime())) return "";
    var day = dt.getDay();
    if (day !== 0 && day !== 6) return "";
    if (day === 0) dt.setDate(dt.getDate() - 1);
    return dayKey(dt);
  }

  function noteBraai(state) {
    var wk = weekendKey(state.today || "");
    if (!wk) return;
    if (!state.braai) state.braai = { key: "", n: 0, claimed: 0 };
    if (state.braai.key !== wk) {
      state.braai.key = wk;
      state.braai.n = 0;
      state.braai.claimed = 0;
    }
    state.braai.n = Math.min(8, (state.braai.n || 0) + 1);
  }

  function claimBraai(state, key) {
    var wk = weekendKey(key);
    if (!wk) return { ok: false, reason: "Braai Day is Saturday and Sunday." };
    if (!state.braai || state.braai.key !== wk || (state.braai.n || 0) < 4) return { ok: false, reason: "Harvest 4 crops this weekend first." };
    if (state.braai.claimed) return { ok: false, reason: "Already shared the braai." };
    state.braai.claimed = 1;
    state.notes = clamp(state.notes + 16, 0, NOTE_CAP);
    state.seeds = clamp(state.seeds + 1, 0, STACK_CAP);
    return { ok: true, notes: 16, seeds: 1 };
  }

  function setToday(state, key) {
    if (typeof key === "string" && /^\d{4}-\d{2}-\d{2}$/.test(key)) state.today = key;
    return state.today || "";
  }

  var STORIES = {
    doek: [
      { say: "Howzit! Two mielies and I'll watch the spaza.", need: { maize: 2 }, notes: 4 },
      { say: "Eish, put something on the lane so I know you're staying.", need: { stat: "placed", n: 1 } },
      { say: "Sharp sharp. I'm home.", unlock: 1, notes: 6 }
    ],
    kid: [
      { say: "Howzit! I want to pick with you.", need: { stat: "harvested", n: 1 } },
      { say: "Lekker. One morogo for the game?", need: { morogo: 1 }, notes: 3 },
      { say: "Sharp sharp, I'll race you to the goal.", unlock: 1, notes: 4 }
    ],
    jersey: [
      { say: "Eish, that roof needs a proper upgrade.", need: { stat: "upgraded", n: 1 } },
      { say: "Lekker hands. Pass me a brick story later.", need: { stat: "upgraded", n: 1 } },
      { say: "Sharp sharp. I'll work from the workshop.", unlock: 1, notes: 6 }
    ],
    gogo: [
      { say: "Howzit, my child. The lane is growing.", need: { maize: 2 }, notes: 4 },
      { say: "Eish, bring the kettle when the imbawula is lit. For now, just visit.", need: { stat: "harvested", n: 1 } },
      { say: "Lekker. Gogo is staying.", unlock: 1, notes: 8 }
    ],
    basotho: [
      { say: "Howzit. A Basotho blanket and a quiet stoep.", need: { maize: 1 } },
      { say: "Lekker soil. One more mielie for the road.", need: { maize: 1 }, notes: 3 },
      { say: "Sharp sharp. I'll sit by the house.", unlock: 1, notes: 6 }
    ],
    taxi: [
      { say: "Howzit! Hoot if you need a lift.", need: { stat: "placed", n: 1 } },
      { say: "Eish, the rank is full. Fill one taxi order.", need: { stat: "harvested", n: 1 } },
      { say: "Sharp sharp. Jabu's on the lane.", unlock: 1, notes: 6 }
    ],
    dog: [
      { say: "A tail at the gate. Finish a game and he'll stay to watch.", need: { stat: "played", n: 1 } },
      { say: "Lekker. He already knows the yard.", need: { stat: "played", n: 1 } },
      { say: "Sharp sharp. Biscuit lives here now.", unlock: 1, notes: 2 }
    ],
    cow: [
      { say: "Howzit. Open a new plot and the Nguni will walk in.", need: { stat: "expanded", n: 1 } },
      { say: "Lekker grass on that side.", need: { stat: "expanded", n: 1 } },
      { say: "Sharp sharp. She has the kraal in mind.", unlock: 1, notes: 6 }
    ],
    goat: [
      { say: "Eish, that goat follows anyone with notes.", need: { stat: "collected", n: 1 } },
      { say: "Lekker. Keep the gate in mind.", need: { stat: "collected", n: 1 } },
      { say: "Sharp sharp. Boer is part of the lane.", unlock: 1, notes: 4 }
    ]
  };

  function advanceStory(state, id) {
    var line = STORIES[id];
    if (!line) return { ok: false, reason: "No story." };
    if (!state.stories) state.stories = {};
    var step = state.stories[id] || 0;
    if (step >= line.length) return { ok: false, reason: "That story is finished." };
    if (!storyOpen(state, id)) return { ok: false, reason: "They are not around yet." };
    var beat = line[step];
    var crop;
    if (beat.need) {
      for (crop in beat.need) {
        if (crop === "stat") continue;
        if (!CROPS[crop]) continue;
        if ((state.crops[crop] || 0) < beat.need[crop]) return { ok: false, reason: "Not enough " + CROPS[crop].name.toLowerCase() + "." };
      }
      if (beat.need.stat && (state.stats[beat.need.stat] || 0) < (beat.need.n || 1)) return { ok: false, reason: beat.say };
      for (crop in beat.need) {
        if (crop === "stat" || !CROPS[crop]) continue;
        state.crops[crop] -= beat.need[crop];
      }
    }
    state.stories[id] = step + 1;
    var notes = Math.min(8, beat.notes || 0);
    if (notes) state.notes = clamp(state.notes + notes, 0, NOTE_CAP);
    var unlock = "";
    if (beat.unlock) {
      if (!state.collection[id]) state.collection[id] = { have: 0, home: 0, seen: 0 };
      state.collection[id].have = 1;
      state.collection[id].seen = 1;
      unlock = id;
    }
    return { ok: true, step: step + 1, say: beat.say, notes: notes, unlock: unlock };
  }

  function storyView(state, id) {
    var line = STORIES[id];
    if (!line) return null;
    var step = (state.stories && state.stories[id]) || 0;
    return { id: id, step: step, done: step >= line.length, open: storyOpen(state, id), say: step < line.length ? line[step].say : "Sharp sharp." };
  }

  function penaltyPayout(goals) {
    goals = clamp(goals, 0, 5);
    return { notes: Math.min(20, goals * 4), seeds: goals >= 4 ? 1 : 0, water: 0 };
  }

  function diketoPayout(hits) {
    hits = clamp(hits, 0, 8);
    return { notes: Math.min(20, hits * 2), seeds: 0, water: hits >= 6 ? 1 : 0 };
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
    tuneProduce: tuneProduce,
    fillOrder: fillOrder,
    syncTaxi: syncTaxi,
    respondEvent: respondEvent,
    syncEvents: syncEvents,
    claimChest: claimChest,
    advanceStory: advanceStory,
    storyView: storyView,
    storyOpen: storyOpen,
    claimBraai: claimBraai,
    setToday: setToday,
    weekendKey: weekendKey,
    penaltyPayout: penaltyPayout,
    diketoPayout: diketoPayout,
    STORIES: STORIES
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = KHAYA;
// Illustrated Khaya Lane art.
//
// World scale. One tile is 256 source pixels wide (128 tall).
// Drawn size = source pixels × (tileWidth / 256) × scale.
// home_l1 is the ruler. Scale 1.08 makes that shack about 1.7 tiles wide,
// inside the 1.5–2 tile house band. Door-to-roof is about 0.9 of its bitmap,
// and every person, animal and prop below is a fraction of that door.
// A person is 60% of the door. A hen is a shin (ankle to knee). A dog stands
// at the knee. A cow reaches a person's shoulder. Props sit at waist height.
// Trees are 1.15–1.5× the full house, jacaranda tallest. The taxi is 1.2 tiles long.
var LOOK = {
  root: "assets/sprites/gen/",
  ext: ".webp",
  world: { tile: 256, house: "home_l1", houseScale: 1.08, houseTiles: 1.7, doorFraction: 0.9, person: 0.6 },
  buildings: {
    home: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [1.05, 0.38], scale: 1.08, yard: 1, levels: ["home_l1", "home_l2", "home_l3"] },
    bed: { anchor: [0.5, 0.58], offset: [0, 0], shadow: [0.72, 0.28], scale: 1, file: "bed_empty" },
    spaza: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.95, 0.36], scale: 0.9, yard: 1, levels: ["spaza", "spaza"] },
    tank: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [0.5, 0.2], scale: 0.85, file: "rain_tank" },
    workshop: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.9, 0.34], scale: 0.9, yard: 1, file: "workshop" },
    solar: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.62, 0.24], scale: 0.82, file: "solar_stand" },
    aloe_clump: { anchor: [0.5, 0.7], offset: [0, 0], shadow: [0.36, 0.16], scale: 0.47, file: "aloe" },
    palisade: { anchor: [0.5, 0.62], offset: [0, 0], shadow: [0.5, 0.2], scale: 0.7, file: "soccer_goal" },
    braai: { anchor: [0.5, 0.68], offset: [0, 0], shadow: [0.42, 0.18], scale: 0.36, file: "braai_drum", smoke: "braai" },
    potjie: { anchor: [0.5, 0.7], offset: [0, 0], shadow: [0.36, 0.16], scale: 0.5, file: "potjie", smoke: "steam" },
    imbawula: { anchor: [0.5, 0.72], offset: [0, 0], shadow: [0.28, 0.14], scale: 0.5, file: "imbawula", smoke: "coal" },
    barrow: { anchor: [0.5, 0.68], offset: [0, 0], shadow: [0.4, 0.16], scale: 0.5, file: "wheelbarrow" },
    mielie: { anchor: [0.5, 0.66], offset: [0, 0], shadow: [0.46, 0.18], scale: 0.48, file: "mielie_cart", smoke: "braai" },
    wash: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.55, 0.2], scale: 0.72, file: "washing_line" },
    coop: { anchor: [0.5, 0.64], offset: [0, 0], shadow: [0.6, 0.22], scale: 0.85, file: "chicken_coop" },
    patch: { anchor: [0.5, 0.6], offset: [0, 0], shadow: [0.62, 0.24], scale: 0.9, file: "pumpkin_patch" },
    kraal: { anchor: [0.5, 0.6], offset: [0, 0], shadow: [1.05, 0.38], scale: 1, yard: 1, file: "kraal" }
  },
  actors: {
    farmer: { file: "char_farmer", scale: 0.71, shadow: [0.28, 0.12] },
    doek: { file: "char_woman_doek", scale: 0.71, shadow: [0.28, 0.12] },
    basotho: { file: "char_basotho_elder", scale: 0.71, shadow: [0.28, 0.12] },
    gogo: { file: "char_gogo", scale: 0.71, shadow: [0.28, 0.12] },
    kid: { file: "char_kid", scale: 0.68, shadow: [0.22, 0.1] },
    jersey: { file: "char_man_jersey", scale: 0.71, shadow: [0.28, 0.12] },
    taxi: { file: "char_taxi_driver", scale: 0.71, shadow: [0.28, 0.12] },
    hen: { file: "animal_hen", scale: 0.42, shadow: [0.16, 0.08] },
    dog: { file: "animal_dog", scale: 0.42, shadow: [0.2, 0.09] },
    cow: { file: "animal_cow", scale: 0.88, shadow: [0.36, 0.14] },
    goat: { file: "animal_goat", scale: 0.7, shadow: [0.24, 0.1] }
  },
  treeScale: { tree_jacaranda: 1.17, tree_acacia: 0.96, tree_marula: 1.03 },
  trees: ["tree_jacaranda", "tree_acacia", "tree_marula"],
  neighbours: ["neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"],
  // Trees line the road and the plot edges. One jacaranda frames the house.
  dress: [
    { file: "taxi", x: 1.35, y: 6.35, scale: 0.85 },
    { file: "washing_line", x: 3.15, y: 1.25, scale: 0.72 },
    { file: "wheelbarrow", x: 3.35, y: 4.15, scale: 0.5 },
    { file: "soccer_goal", x: 10.7, y: 2.4, scale: 0.85 },
    { file: "tree_acacia", x: 3.25, y: 0.75, scale: 0.96 },
    { file: "tree_jacaranda", x: 0.45, y: 5.15, scale: 1.17 },
    { file: "tree_marula", x: 5.35, y: 6.85, scale: 1.03 },
    { file: "tree_acacia", x: 11.15, y: 0.85, scale: 0.96 },
    { file: "tree_acacia", x: 12.75, y: 4.15, scale: 0.92 },
    { file: "tree_marula", x: 11.2, y: 6.7, scale: 1.0 },
    { file: "tree_acacia", x: 1.2, y: 9.55, scale: 0.96 },
    { file: "tree_marula", x: 6.55, y: 8.35, scale: 1.0 },
    { file: "aloe", x: 2.4, y: 1.15, scale: 0.47 },
    { file: "neighbour_mural", x: 9.6, y: 6.55, scale: 0.78 },
    { file: "neighbour_facebrick", x: 2.5, y: 11.45, scale: 0.78 }
  ],
  treeAt: {
    "0,0": "tree_acacia",
    "7,0": "tree_marula",
    "15,0": "tree_acacia",
    "7,8": "tree_acacia",
    "15,10": "tree_marula"
  },
  cast: [
    { id: "farmer", route: [[2, 4], [3, 5], [2, 5], [1, 5]], speed: 9000 },
    { id: "doek", route: [[7, 3], [7, 4], [7, 2], [6, 1]], speed: 11000 },
    { id: "jersey", route: [[4, 5], [3, 6], [2, 6], [1, 6]], speed: 8000 },
    { id: "gogo", route: [[1, 4], [1, 5], [2, 5], [2, 4]], speed: 13000 },
    { id: "kid", near: "home" },
    { id: "basotho", route: [[2, 4], [3, 4], [3, 5], [2, 5]], speed: 15000 },
    { id: "taxi", route: [[1, 6], [2, 6], [2, 5], [1, 5]], speed: 10000 },
    { id: "hen", spot: [2.35, 4.55], wobble: 0.22 },
    { id: "dog", spot: [3.6, 5.4], wobble: 0.2 },
    { id: "cow", spot: [7.4, 5.5], wobble: 0.08 },
    { id: "goat", spot: [6.6, 3.3], wobble: 0.16 }
  ],
  lineup: ["home_l1", "taxi", "tree_jacaranda", "tree_acacia", "aloe", "char_farmer", "char_kid", "animal_hen", "animal_dog", "animal_cow", "braai_drum", "potjie", "wheelbarrow"],
  first: [
    "tile_grass", "tile_dirt", "home_l1", "home_l2", "home_l3", "bed_empty",
    "maize_sown", "maize_growing", "maize_ready", "spaza", "workshop", "rain_tank", "solar_stand",
    "char_farmer", "animal_hen", "animal_dog",
    "tree_jacaranda", "tree_acacia", "tree_marula",
    "washing_line", "wheelbarrow", "taxi",
    "neighbour_ndebele", "neighbour_mural", "neighbour_facebrick"
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = LOOK;
// Khaya Lane scene. Sprites are original Blender renders. The veld, sky and UI motion are drawn here.
var DRAW = (function () {
  var SPRITE = 3.6;
  var img = {};
  var ready = false;

  function catalogFiles() {
    var list = [];
    function add(n) { if (n && list.indexOf(n) < 0) list.push(n); }
    var id, spec, i, d, f;
    for (id in LOOK.buildings) {
      spec = LOOK.buildings[id];
      if (spec.file) add(spec.file);
      if (spec.levels) for (i = 0; i < spec.levels.length; i++) add(spec.levels[i]);
      if (spec.states) for (i = 0; i < spec.states.length; i++) add(spec.states[i]);
    }
    for (id in LOOK.actors) add(LOOK.actors[id].file);
    for (i = 0; i < LOOK.trees.length; i++) add(LOOK.trees[i]);
    for (i = 0; i < LOOK.neighbours.length; i++) add(LOOK.neighbours[i]);
    for (i = 0; i < LOOK.dress.length; i++) add(LOOK.dress[i].file);
    add("tile_grass");
    add("tile_dirt");
    return list;
  }

  function loadSet(names, done) {
    if (!names.length) { if (done) done(); return; }
    var left = names.length;
    names.forEach(function (n) {
      var el = new Image();
      el.onload = el.onerror = function () {
        if (el.naturalWidth) img[n] = el;
        left -= 1;
        if (left === 0 && done) done();
      };
      el.src = LOOK.root + n + LOOK.ext;
    });
  }

  function load(done) {
    var names = catalogFiles();
    var first = [];
    var rest = [];
    var i;
    for (i = 0; i < names.length; i++) {
      if (LOOK.first.indexOf(names[i]) >= 0) first.push(names[i]);
      else rest.push(names[i]);
    }
    loadSet(first, function () {
      ready = true;
      if (done) done();
      loadSet(rest);
    });
  }

  function north(x, y, o) { return KHAYA.cellNorth(x, y, o.ox, o.oy, o.tw, o.th); }

  function corners(x, y, w, h, o) {
    return { n: north(x, y, o), e: north(x + w, y, o), s: north(x + w, y + h, o), w: north(x, y + h, o) };
  }

  function mid(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  function layout(w, h, cam) {
    cam = cam || { x: 0, y: 0, z: 1 };
    var z = cam.z || 1;
    if (z < 0.55) z = 0.55;
    if (z > 2.2) z = 2.2;
    var cols = 8;
    var rows = 8;
    var horizon = Math.max(72, h * 0.30);
    var availW = w * 0.96;
    var availH = Math.max(80, (h - horizon) * 0.98);
    var tw = availW / ((cols + rows) / 2);
    var th = tw * 0.5;
    var plotH = (cols + rows) * th / 2;
    var need = plotH + th * 2.4;
    if (need > availH) {
      var s = availH / need;
      tw *= s;
      th *= s;
      plotH = (cols + rows) * th / 2;
    }
    tw *= z;
    th *= z;
    var plotW = (cols + rows) * tw / 2;
    var ox = (w - plotW) / 2 + rows * tw / 2 + (cam.x || 0);
    var oy = horizon + Math.max(th / z, (h - horizon - plotH * z) * 0.42) + (cam.y || 0);
    return { tw: tw, th: th, ox: ox, oy: oy, horizon: horizon, z: z };
  }

  function clampCamera(w, h, cam) {
    cam = cam || { x: 0, y: 0, z: 1 };
    if (cam.z < 0.55) cam.z = 0.55;
    if (cam.z > 2.2) cam.z = 2.2;
    var o = layout(w, h, cam);
    var north = KHAYA.cellNorth(0, 0, o.ox, o.oy, o.tw, o.th);
    var south = KHAYA.cellNorth(KHAYA.COLS, KHAYA.ROWS, o.ox, o.oy, o.tw, o.th);
    var east = KHAYA.cellNorth(KHAYA.COLS, 0, o.ox, o.oy, o.tw, o.th);
    var west = KHAYA.cellNorth(0, KHAYA.ROWS, o.ox, o.oy, o.tw, o.th);
    if (south.y < h * 0.42) cam.y += h * 0.42 - south.y;
    if (north.y > h * 0.62) cam.y -= north.y - h * 0.62;
    if (east.x < w * 0.18) cam.x += w * 0.18 - east.x;
    if (west.x > w * 0.82) cam.x -= west.x - w * 0.82;
    return cam;
  }

  function poly(ctx, pts, fill) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    var i;
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function sky(ctx, w, h, now) {
    var g = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    g.addColorStop(0, "#6eaddf");
    g.addColorStop(0.45, "#b9d4ef");
    g.addColorStop(0.78, "#f3d2a4");
    g.addColorStop(1, "#e7b27a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var i;
    for (i = 0; i < 5; i++) {
      var cx = ((now / 40 + i * w * 0.23) % (w + 180)) - 90;
      var cy = h * (0.08 + (i % 3) * 0.06);
      ctx.fillStyle = "rgba(255,255,255,.72)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 54 + (i % 3) * 16, 16, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 28, cy + 4, 36, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function land(ctx, w, h, o) {
    var hy = o.horizon + 8;
    ctx.fillStyle = "#c48b78";
    ctx.beginPath();
    ctx.ellipse(w * 0.12, hy + 10, w * 0.22, h * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d7a48a";
    ctx.beginPath();
    ctx.ellipse(w * 0.84, hy + 4, w * 0.2, h * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8f9a62";
    ctx.beginPath();
    ctx.ellipse(w * 0.48, hy + 18, w * 0.16, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    var veld = ctx.createLinearGradient(0, hy, 0, h);
    veld.addColorStop(0, "#e2c07a");
    veld.addColorStop(0.22, "#c6a84e");
    veld.addColorStop(1, "#b08a3e");
    ctx.fillStyle = veld;
    ctx.fillRect(0, hy, w, h - hy);
    var i;
    ctx.strokeStyle = "rgba(70, 110, 40, .28)";
    ctx.lineWidth = 1.2;
    for (i = 0; i < 28; i++) {
      var gx = (i * 97) % w;
      var gy = hy + 24 + ((i * 53) % Math.max(20, h - hy - 30));
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + 2, gy - 7);
      ctx.moveTo(gx + 4, gy);
      ctx.lineTo(gx + 6, gy - 5);
      ctx.stroke();
    }
    var south = north(KHAYA.COLS, KHAYA.ROWS, o);
    ctx.fillStyle = "#d7b56a";
    ctx.beginPath();
    ctx.moveTo(south.x - o.tw * 0.55, south.y - 4);
    ctx.lineTo(w * 0.5 - Math.min(120, w * 0.16), h + 30);
    ctx.lineTo(w * 0.5 + Math.min(120, w * 0.16), h + 30);
    ctx.lineTo(south.x + o.tw * 0.55, south.y - 4);
    ctx.fill();
    var spots = [0.12, 0.4, 0.7];
    var n;
    for (n = 0; n < LOOK.neighbours.length; n++) {
      blitFoot(ctx, img[LOOK.neighbours[n]], w * spots[n], hy + 18, o.tw * 0.72, 0.9);
    }
    blitFoot(ctx, img.tree_jacaranda, w * 0.9, hy + 28, o.tw * 0.7, LOOK.treeScale.tree_jacaranda || 1);
    blitFoot(ctx, img.tree_acacia, w * 0.22, hy + 36, o.tw * 0.7, LOOK.treeScale.tree_acacia || 1);
  }

  function blitFoot(ctx, image, footX, footY, tw, scale) {
    if (!image || !image.naturalWidth) return;
    var px = (tw / 256) * (scale || 1);
    var dw = image.naturalWidth * px;
    var dh = image.naturalHeight * px;
    ctx.drawImage(image, footX - dw / 2, footY - dh, dw, dh);
  }

  function hash(x, y) {
    var n = (x * 17 + y * 31) % 5;
    return n < 0 ? n + 5 : n;
  }

  function ground(ctx, x, y, o, state) {
    var c = corners(x, y, 1, 1, o);
    var kind = KHAYA.terrainAt(x, y);
    var open = !state || KHAYA.plotOpen(state, x, y);
    var midCell = north(x + 0.5, y + 0.5, o);
    if (img.tile_grass) ctx.drawImage(img.tile_grass, midCell.x - o.tw / 2, midCell.y - o.th / 2, o.tw, o.th);
    if (kind === "path" && img.tile_dirt) ctx.drawImage(img.tile_dirt, midCell.x - o.tw / 2, midCell.y - o.th / 2, o.tw, o.th);
    if (!img.tile_grass && !(kind === "path" && img.tile_dirt)) {
      var fill = kind === "path" ? "#c47a45" : "#c6a84a";
      poly(ctx, [c.n, c.e, c.s, c.w], fill);
    }
    if (!open) {
      ctx.save();
      ctx.globalAlpha = 0.38;
      poly(ctx, [c.n, c.e, c.s, c.w], "#3a2416");
      ctx.restore();
    }
    if (img.tile_grass) return;
    var p = mid(c.n, c.s, 0.55);
    ctx.save();
    if (kind === "path") {
      ctx.fillStyle = "rgba(150, 104, 62, .4)";
      ctx.beginPath();
      ctx.ellipse(p.x - 4, p.y, 3.2, 2.2, 0.4, 0, 7);
      ctx.ellipse(p.x + 5, p.y + 2, 2.4, 1.6, -0.2, 0, 7);
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(48, 90, 36, .35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 1, p.y - 5);
      ctx.moveTo(p.x + 4, p.y + 1);
      ctx.lineTo(p.x + 5, p.y - 3);
      ctx.stroke();
      if (hash(x, y) % 3 === 0) {
        ctx.fillStyle = hash(x, y) % 2 ? "#e07a9a" : "#f0d15a";
        ctx.beginPath();
        ctx.arc(p.x - 3, p.y + 2, 1.7, 0, 7);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function buildingFile(b, now) {
    var spec = LOOK.buildings[b.type];
    if (!spec) return b.type;
    if (b.type === "bed") {
      var view = KHAYA.bedView(b, now);
      if (!view || view.phase === "empty") return "bed_empty";
      var crop = b.crop === "spinach" ? "morogo" : b.crop === "tomato" ? "pumpkin" : b.crop;
      if (crop === "aloe") return view.phase === "sown" || view.progress < 0.5 ? "bed_empty" : "aloe";
      if (view.phase === "sown" || view.progress < 0.34) return crop + "_sown";
      if (view.progress < 0.72) return crop + "_growing";
      if (crop === "pumpkin" && view.progress < 0.92) return "pumpkin_fruiting";
      if (crop === "morogo") return "morogo_ready_basket";
      return crop + "_ready";
    }
    if (spec.levels) {
      var lv = Math.max(1, Math.min(spec.levels.length, b.level || 1));
      return spec.levels[lv - 1];
    }
    return spec.file || b.type;
  }

  function placePoint(b, o) {
    var spec = LOOK.buildings[b.type] || { anchor: [0.5, 0.55], offset: [0, 0] };
    var p = north(b.x + b.w * spec.anchor[0], b.y + b.h * spec.anchor[1], o);
    return { x: p.x + (spec.offset[0] || 0), y: p.y + (spec.offset[1] || 0), spec: spec };
  }

  function puff(ctx, x, y, now, kind) {
    var steam = kind === "steam";
    var i;
    ctx.save();
    for (i = 0; i < 5; i++) {
      var t = (now / (steam ? 1100 : 800) + i / 5) % 1;
      var px = x + Math.sin(now / 380 + i * 1.7) * (4 + t * 8);
      var py = y - t * (steam ? 28 : 40);
      ctx.globalAlpha = (1 - t) * (steam ? 0.42 : 0.5);
      ctx.fillStyle = steam ? "rgba(244,248,252,0.95)" : (kind === "coal" ? "rgba(70,64,58,0.9)" : "rgba(90,84,76,0.85)");
      ctx.beginPath();
      ctx.ellipse(px, py, 3 + t * 8, 2.4 + t * 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function peg(ctx, x, y, text) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#6b4524";
    ctx.fillRect(-2, 0, 4, 16);
    ctx.beginPath();
    ctx.fillStyle = "#f3d7a2";
    ctx.strokeStyle = "#6b4524";
    ctx.lineWidth = 2;
    ctx.rect(-20, -26, 40, 20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#3a2416";
    ctx.font = "700 13px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, -16);
    ctx.restore();
  }

  function shadowAt(ctx, x, y, rx, ry) {
    ctx.save();
    ctx.fillStyle = "rgba(72, 44, 18, 0.30)";
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(4, rx), Math.max(3, ry), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSprite(ctx, name, b, o, now, pop, squash) {
    var spot = placePoint(b, o);
    var scale = spot.spec.scale || 1;
    var sc = scale;
    var sx = 1;
    var sy = 1;
    if (pop && now - pop < 560) {
      var u = (now - pop) / 560;
      sc = scale * (0.25 + u * 0.85);
      if (u > 0.72) sc = scale * (1 + Math.sin((u - 0.72) / 0.28 * Math.PI) * 0.08);
    }
    if (squash && now - squash < 220) {
      var q = (now - squash) / 220;
      sx = 1 + Math.sin(q * Math.PI) * 0.14;
      sy = 1 - Math.sin(q * Math.PI) * 0.12;
    }
    var sh = spot.spec.shadow || [0.6, 0.22];
    if (spot.spec.yard) {
      ctx.save();
      ctx.fillStyle = "rgba(176, 112, 64, 0.28)";
      ctx.beginPath();
      ctx.ellipse(spot.x, spot.y + o.th * 0.06, o.tw * sh[0] * 0.42, o.th * sh[1] * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    shadowAt(ctx, spot.x, spot.y + o.th * 0.08, o.tw * sh[0] * 0.55, o.th * sh[1] * 1.3);
    ctx.save();
    ctx.translate(spot.x, spot.y);
    ctx.scale(sx, sy);
    ctx.translate(-spot.x, -spot.y);
    blitFoot(ctx, img[name], spot.x, spot.y, o.tw, sc);
    ctx.restore();
    if (spot.spec.smoke) puff(ctx, spot.x, spot.y - o.th * 0.9, now, spot.spec.smoke);
    return spot;
  }

  function barOver(ctx, x, y, w, progress, color) {
    ctx.save();
    ctx.fillStyle = "rgba(255,250,243,.92)";
    ctx.strokeStyle = "#6b4524";
    ctx.lineWidth = 2;
    roundRect(ctx, x - w / 2, y, w, 8, 4);
    ctx.fill();
    ctx.stroke();
    var fillW = Math.max(0, (w - 4) * progress);
    if (fillW > 1) {
      ctx.fillStyle = color;
      roundRect(ctx, x - w / 2 + 2, y + 2, fillW, 4, 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function coinBadge(ctx, x, y, now) {
    var bob = Math.sin(now / 180) * 3;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.fillStyle = "#f2c14e";
    ctx.strokeStyle = "#7a5410";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#7a5410";
    ctx.font = "700 12px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", 0, 1);
    ctx.restore();
  }

  function ring(ctx, x, y, w, h, o, color) {
    var c = corners(x, y, w, h, o);
    ctx.beginPath();
    ctx.moveTo(c.n.x, c.n.y);
    ctx.lineTo(c.e.x, c.e.y);
    ctx.lineTo(c.s.x, c.s.y);
    ctx.lineTo(c.w.x, c.w.y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function facing(dx, dy) {
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 1 : 3;
    return dy >= 0 ? 2 : 0;
  }

  function routePoint(route, now, speed) {
    var u = (now / speed) % 1;
    var f = u * route.length;
    var a = Math.floor(f) % route.length;
    var b = (a + 1) % route.length;
    var k = f - Math.floor(f);
    return {
      x: route[a][0] + (route[b][0] - route[a][0]) * k,
      y: route[a][1] + (route[b][1] - route[a][1]) * k,
      dir: facing(route[b][0] - route[a][0], route[b][1] - route[a][1])
    };
  }

  function actorFrame(spec, now, dir, pose) {
    if (pose === "water" && spec.water) return spec.water[Math.floor(now / 180) % spec.water.length];
    if (pose === "wave" && spec.wave) return spec.wave[Math.floor(now / 160) % spec.wave.length];
    if (spec.walk) return spec.walk + "_" + (dir || 0) + "_" + (Math.floor(now / 140) % spec.frames);
    if (spec.idle) return spec.idle[Math.floor(now / 280) % spec.idle.length];
    return "";
  }

  function queueActors(queue, state, o, now, ctx) {
    var known = state.collection || {};
    var i;
    for (i = 0; i < LOOK.cast.length; i++) {
      (function (entry) {
        if (!known[entry.id] || !known[entry.id].have) return;
        var spec = LOOK.actors[entry.id];
        var x = 2;
        var y = 2;
        var dir = 0;
        var pose = "walk";
        var bi;
        var housed = known[entry.id].home && KHAYA.buildingById(state, known[entry.id].home);
        if (housed) {
          x = housed.x + housed.w * 0.35;
          y = housed.y + housed.h + 0.2;
          pose = "idle";
        } else if (entry.near === "home") {
          var home = null;
          var bi;
          for (bi = 0; bi < state.buildings.length; bi++) if (state.buildings[bi].type === "home") home = state.buildings[bi];
          if (home) { x = home.x + home.w + 0.55; y = home.y + home.h + 0.15; }
          pose = "idle";
        } else if (entry.spot) {
          x = entry.spot[0] + Math.sin(now / 900 + entry.spot[1]) * (entry.wobble || 0);
          y = entry.spot[1] + Math.cos(now / 1100) * (entry.wobble || 0) * 0.6;
          pose = "idle";
        } else if (entry.route) {
          var step = routePoint(entry.route, now, entry.speed || 9000);
          x = step.x;
          y = step.y;
          dir = step.dir;
          if (entry.id === "farmer") {
            var bed = null;
            for (bi = 0; bi < state.buildings.length; bi++) {
              if (state.buildings[bi].type === "bed" && state.buildings[bi].phase && state.buildings[bi].phase !== "empty") bed = state.buildings[bi];
            }
            if (bed) { x = bed.x + 1.2; y = bed.y + 0.42; pose = "water"; }
          }
          if (entry.id === "jersey" && Math.floor(now / 5000) % 6 === 0) pose = "wave";
          if (entry.id === "doek") {
            var spaza = null;
            for (bi = 0; bi < state.buildings.length; bi++) if (state.buildings[bi].type === "spaza") spaza = state.buildings[bi];
            if (spaza) { x = spaza.x + 0.2; y = spaza.y + 1.15; dir = 0; }
          }
        }
        var n = north(x, y, o);
        var moving = pose === "walk" && !housed;
        var phase = now / 170 + x;
        var bob = moving ? Math.sin(phase) * o.th * 0.08 : Math.sin(now / 700 + y) * o.th * 0.02;
        var stretch = moving ? 1 + Math.sin(phase) * 0.045 : 1;
        var squashY = moving ? 1 - Math.sin(phase) * 0.04 : 1;
        var lean = moving ? (dir === 1 || dir === 0 ? -0.08 : 0.08) : 0;
        var flip = dir === 1 || dir === 0 ? -1 : 1;
        queue.push({ y: n.y, draw: function () {
          var sh = spec.shadow || [0.3, 0.12];
          shadowAt(ctx, n.x, n.y, o.tw * sh[0] * 0.55, o.th * sh[1] * 1.1);
          ctx.save();
          ctx.translate(n.x, n.y + bob);
          ctx.rotate(lean);
          ctx.scale(flip * stretch, squashY);
          blitFoot(ctx, img[spec.file], 0, 0, o.tw, spec.scale);
          ctx.restore();
        } });
      })(LOOK.cast[i]);
    }
  }

  function floats(ctx, list, now) {
    var i;
    for (i = 0; i < list.length; i++) {
      var f = list[i];
      var a = (now - f.t) / 900;
      if (a < 0 || a > 1) continue;
      ctx.save();
      ctx.globalAlpha = 1 - a;
      ctx.fillStyle = f.color || "#243028";
      ctx.font = "700 18px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(f.text, f.x, f.y - a * 42);
      var bits = f.coins || 6;
      var k;
      for (k = 0; k < bits; k++) {
        var ang = k / bits * Math.PI * 2 + f.t;
        var rad = f.coins ? 4.2 : 3.2;
        ctx.beginPath();
        ctx.fillStyle = f.coins ? "#f2c14e" : (f.color || "#243028");
        ctx.arc(f.x + Math.cos(ang) * a * 34, f.y - 12 + Math.sin(ang) * a * 20, rad * (1 - a * 0.4), 0, 7);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function render(canvas, state, view, now) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var o = layout(w, h, view && view.cam);
    sky(ctx, w, h, now);
    land(ctx, w, h, o);
    var cells = [];
    var x, y;
    for (y = 0; y < KHAYA.ROWS; y++) for (x = 0; x < KHAYA.COLS; x++) cells.push({ x: x, y: y, k: x + y });
    cells.sort(function (a, b) { return a.k - b.k; });
    var i;
    for (i = 0; i < cells.length; i++) {
      x = cells[i].x;
      y = cells[i].y;
      ground(ctx, x, y, o, state);
    }
    var queue = [];
    for (i = 0; i < cells.length; i++) {
      x = cells[i].x;
      y = cells[i].y;
      if (KHAYA.terrainAt(x, y) !== "tree") continue;
      (function (tx, ty) {
        var file = (LOOK.treeAt && LOOK.treeAt[tx + "," + ty]) || "tree_acacia";
        var n = north(tx + 0.5, ty + 0.5, o);
        var treeScale = (LOOK.treeScale && LOOK.treeScale[file]) || 1;
        queue.push({ y: n.y, draw: function () {
          shadowAt(ctx, n.x, n.y, o.tw * 0.34, o.th * 0.2);
          blitFoot(ctx, img[file], n.x, n.y, o.tw, treeScale);
        } });
      })(x, y);
    }
    for (i = 0; i < state.buildings.length; i++) {
      (function (building) {
        var dragging = view.drag && view.drag.id === building.id;
        var drawAt = building;
        if (dragging) {
          drawAt = {
            type: building.type, x: view.drag.x, y: view.drag.y,
            w: building.w, h: building.h, level: building.level, crop: building.crop, phase: building.phase, plantedAt: building.plantedAt, id: building.id
          };
        }
        var spot = placePoint(drawAt, o);
        queue.push({ y: spot.y, draw: function () {
          ctx.save();
          if (dragging) ctx.globalAlpha = 0.85;
          var drawn = drawSprite(ctx, buildingFile(drawAt, now), drawAt, o, now, view.born && view.born[building.id], view.squash && view.squash[building.id]);
          ctx.restore();
          var job = KHAYA.buildView(building);
          if (job && !dragging) barOver(ctx, drawn.x, drawn.y - o.th * 1.3, o.tw * 0.7, job.progress, "#7eb6e0");
          var prod = KHAYA.produceView(building, state);
          if (prod && prod.ready && !dragging) coinBadge(ctx, drawn.x, drawn.y - o.th * 1.6, now);
          if (dragging) {
            var okMove = KHAYA.canMove(state, building.id, view.drag.x, view.drag.y).ok;
            ring(ctx, view.drag.x, view.drag.y, building.w, building.h, o, okMove ? "#f2c14e" : "#d64545");
          }
        } });
      })(state.buildings[i]);
    }
    var di;
    for (di = 0; di < LOOK.dress.length; di++) {
      (function (piece) {
        var n = north(piece.x, piece.y, o);
        if (piece.file === "taxi") return;
        queue.push({ y: n.y, draw: function () {
          shadowAt(ctx, n.x, n.y, o.tw * 0.28, o.th * 0.2);
          blitFoot(ctx, img[piece.file], n.x, n.y, o.tw, piece.scale || 1);
        } });
      })(LOOK.dress[di]);
    }
    queueActors(queue, state, o, now, ctx);
    (function () {
      var orders = state.orders || {};
      var spot = { x: 1.35, y: 6.35 };
      var since = now - (orders.at || now);
      if (orders.phase === "here" && since < 2800) spot = { x: -1.4 + (1.35 + 1.4) * (since / 2800), y: 6.35 };
      else if (orders.phase === "away" && since < 2600) spot = { x: 1.35 + (since / 2600) * 5, y: 6.35 };
      var n = north(spot.x, spot.y, o);
      queue.push({ y: n.y, draw: function () {
        shadowAt(ctx, n.x, n.y, o.tw * 0.46, o.th * 0.22);
        blitFoot(ctx, img.taxi, n.x, n.y, o.tw, 0.85);
        if (orders.phase === "here" && since < 3200) puff(ctx, n.x + o.tw * 0.12, n.y - o.th * 0.2, now, "steam");
      } });
      var ev = state.laneEvent && state.laneEvent.current;
      if (ev && ev.type === "goat") {
        var gx = 5.2 + Math.sin(now / 180) * 0.8;
        var gy = 4.2 + Math.cos(now / 220) * 0.35;
        var gn = north(gx, gy, o);
        queue.push({ y: gn.y, draw: function () {
          blitFoot(ctx, img.animal_goat, gn.x, gn.y, o.tw, LOOK.actors.goat.scale);
        } });
      }
      if (ev && ev.type === "ball") {
        var bn = north(4.2, 5.6, o);
        queue.push({ y: bn.y, draw: function () {
          ctx.save();
          ctx.fillStyle = "#f4f1ea";
          ctx.beginPath();
          ctx.arc(bn.x, bn.y - 8 - Math.abs(Math.sin(now / 160)) * 10, 7, 0, 7);
          ctx.fill();
          ctx.strokeStyle = "#243028";
          ctx.stroke();
          ctx.restore();
        } });
      }
    })();
    queue.sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < queue.length; i++) queue[i].draw();
    var pid;
    for (pid in KHAYA.PLOTS) {
      if (KHAYA.plotOpen(state, KHAYA.PLOTS[pid].x, KHAYA.PLOTS[pid].y)) continue;
      var plot = KHAYA.PLOTS[pid];
      var lock = north(plot.x + plot.w / 2, plot.y + plot.h / 2, o);
      peg(ctx, lock.x, lock.y, String(plot.notes));
    }
    var live = state.laneEvent && state.laneEvent.current;
    if (live && live.type === "storm") {
      ctx.save();
      ctx.fillStyle = "rgba(40, 70, 110, 0.18)";
      ctx.fillRect(0, 0, w, h);
      var drop;
      for (drop = 0; drop < 40; drop++) {
        var rx = (drop * 97 + now * 0.4) % w;
        var ry = (drop * 53 + now * 0.8) % h;
        ctx.strokeStyle = "rgba(220, 230, 240, 0.45)";
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 3, ry + 10);
        ctx.stroke();
      }
      if (Math.floor(now / 700) % 5 === 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }
    if (live && live.type === "shed" && !live.solar) {
      ctx.save();
      ctx.fillStyle = "rgba(20, 16, 12, 0.28)";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
    if (view.ghost) {
      var gok = KHAYA.canPlace(state, view.ghost.type, view.ghost.x, view.ghost.y).ok;
      var ghost = {
        type: view.ghost.type, x: view.ghost.x, y: view.ghost.y,
        w: KHAYA.BUILDINGS[view.ghost.type].w, h: KHAYA.BUILDINGS[view.ghost.type].h, level: 1
      };
      ctx.save();
      ctx.globalAlpha = 0.6;
      drawSprite(ctx, buildingFile(ghost, now), ghost, o, now, 0);
      ctx.restore();
      ring(ctx, ghost.x, ghost.y, ghost.w, ghost.h, o, gok ? "#f2c14e" : "#d64545");
    }
    if (view.selected) ring(ctx, view.selected.x, view.selected.y, view.selected.w, view.selected.h, o, "#f2c14e");
    if (view.floats) floats(ctx, view.floats, now);
    return o;
  }

  function lineup(canvas) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#c6d98a";
    ctx.fillRect(0, 0, w, h);
    var row = LOOK.lineup || [];
    var i;
    var gap = w / (row.length + 1);
    var groundY = h * 0.72;
    ctx.fillStyle = "#3a2416";
    ctx.font = "600 12px Fredoka, sans-serif";
    ctx.textAlign = "center";
    for (i = 0; i < row.length; i++) {
      var file = row[i];
      var scale = 1;
      if (file === "home_l1") scale = LOOK.buildings.home.scale;
      else if (file === "taxi") scale = 0.85;
      else if (LOOK.treeScale[file]) scale = LOOK.treeScale[file];
      else if (file === "aloe") scale = LOOK.buildings.aloe_clump.scale;
      else if (file === "char_farmer") scale = LOOK.actors.farmer.scale;
      else if (file === "char_kid") scale = LOOK.actors.kid.scale;
      else if (file === "animal_hen") scale = LOOK.actors.hen.scale;
      else if (file === "animal_dog") scale = LOOK.actors.dog.scale;
      else if (file === "animal_cow") scale = LOOK.actors.cow.scale;
      else if (file === "braai_drum") scale = LOOK.buildings.braai.scale;
      else if (file === "potjie") scale = LOOK.buildings.potjie.scale;
      else if (file === "wheelbarrow") scale = LOOK.buildings.barrow.scale;
      var x = gap * (i + 1);
      shadowAt(ctx, x, groundY, 28, 10);
      blitFoot(ctx, img[file], x, groundY, 72, scale);
      ctx.fillStyle = "#3a2416";
      ctx.fillText(file.replace("char_", "").replace("animal_", "").replace("tree_", ""), x, h * 0.9);
    }
    ctx.font = "700 16px Fredoka, sans-serif";
    ctx.fillText("House ~1.7 tiles · taxi 1.2 · people 60% of the door · hen shin · dog knee · cow shoulder", w / 2, 28);
  }

  return { load: load, render: render, lineup: lineup, layout: layout, clampCamera: clampCamera, ready: function () { return ready; } };
})();
// Crate Day and the spaza counter. Skill games, capped pay, one collect each.
var PLAY = (function () {
  var CROPS = ["maize", "spinach", "tomato"];

  function chip(crop) {
    return "<button type=\"button\" class=\"chip " + crop + "\" data-crop=\"" + crop + "\">" + KHAYA.CROPS[crop].name + "</button>";
  }

  function crateStart(body, done) {
    var order = [];
    var i;
    for (i = 0; i < 10; i++) order.push(CROPS[i % 3]);
    var round = { i: 0, correct: 0, order: order, over: false, token: "crate-" + Date.now() + "-" + Math.floor(Math.random() * 1e6) };
    var deadline = 0;
    var clock = 0;
    body.innerHTML = "<p class=\"rules\">Crate Day. A crop name lights up. Tap its crate before the bar runs out. Ten crops. No entry fee.</p><div class=\"meter\"><span id=\"crateBar\"></span></div><p id=\"crateShow\" class=\"show maize\">Maize</p><div class=\"crates\">" + CROPS.map(chip).join("") + "</div><p id=\"crateScore\" class=\"fine\">0 / 10</p>";
    var show = body.querySelector("#crateShow");
    var bar = body.querySelector("#crateBar");
    var score = body.querySelector("#crateScore");
    function present() {
      if (round.i >= round.order.length) return finish();
      deadline = clock + 8000;
      var crop = round.order[round.i];
      show.textContent = KHAYA.CROPS[crop].name;
      show.className = "show " + crop;
    }
    function finish() {
      round.over = true;
      var pay = KHAYA.cratePayout(round.correct);
      done(round.token, pay, "You sorted " + round.correct + " of 10.");
    }
    function answer(crop) {
      if (round.over) return;
      if (crop === round.order[round.i]) round.correct += 1;
      round.i += 1;
      score.textContent = round.correct + " right · " + round.i + " / 10";
      present();
    }
    body.querySelectorAll("[data-crop]").forEach(function (btn) {
      btn.addEventListener("click", function () { answer(btn.getAttribute("data-crop")); });
    });
    present();
    function frame(t) {
      if (round.over) return;
      clock = t;
      if (!deadline) deadline = t + 8000;
      var left = (deadline - t) / 8000;
      bar.style.transform = "scaleX(" + Math.max(0, Math.min(1, left)) + ")";
      if (left <= 0) {
        if (-left > 0.25) deadline = t + 8000;
        else answer("__timeout__");
      }
      if (!round.over) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return function stop() { round.over = true; };
  }

  function marketStart(body, done) {
    var slips = [
      ["maize", "maize", "spinach"],
      ["tomato", "maize"],
      ["spinach", "spinach"],
      ["tomato", "spinach", "maize"],
      ["aloe", "tomato"]
    ];
    var round = { i: 0, served: 0, picked: [], over: false, token: "market-" + Date.now() + "-" + Math.floor(Math.random() * 1e6) };
    var goods = ["maize", "spinach", "tomato", "aloe"];
    body.innerHTML = "<p class=\"rules\">Spaza counter. Tap every item on the slip, then hand it over. A wrong extra item sends that customer on. Five customers. No entry fee.</p><p id=\"slip\" class=\"slip\"></p><div class=\"crates\">" + goods.map(chip).join("") + "</div><p id=\"basket\" class=\"fine\">Basket: empty</p><button type=\"button\" class=\"hot\" id=\"hand\">Hand over</button>";
    var slip = body.querySelector("#slip");
    var basket = body.querySelector("#basket");
    function names(list) {
      var count = {};
      list.forEach(function (c) { count[c] = (count[c] || 0) + 1; });
      return Object.keys(count).map(function (k) { return count[k] + " " + KHAYA.CROPS[k].name; }).join(", ");
    }
    function present() {
      if (round.i >= slips.length) return finish();
      round.picked = [];
      slip.textContent = "Order: " + names(slips[round.i]);
      basket.textContent = "Basket: empty";
    }
    function same(a, b) {
      if (a.length !== b.length) return false;
      var as = a.slice().sort().join(",");
      var bs = b.slice().sort().join(",");
      return as === bs;
    }
    function finish() {
      round.over = true;
      var pay = KHAYA.marketPayout(round.served);
      done(round.token, pay, "You served " + round.served + " of 5 customers.");
    }
    body.querySelectorAll("[data-crop]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (round.over || round.i >= slips.length) return;
        if (round.picked.length >= 4) return;
        round.picked.push(btn.getAttribute("data-crop"));
        basket.textContent = "Basket: " + names(round.picked);
      });
    });
    body.querySelector("#hand").addEventListener("click", function () {
      if (round.over || round.i >= slips.length) return;
      if (same(round.picked, slips[round.i])) round.served += 1;
      round.i += 1;
      present();
    });
    present();
    return function stop() { round.over = true; };
  }

  function penaltyStart(body, done) {
    var round = { i: 0, goals: 0, over: false, token: "penalty-" + Date.now() };
    var clock = 0;
    body.innerHTML = "<p class=\"rules\">Five penalties. Tap while the marker is in the posts. The keeper dives to one side. No fee.</p><div class=\"meter\"><span id=\"penBar\"></span></div><p id=\"penShow\" class=\"slip\">Kick 1 of 5</p><button type=\"button\" class=\"hot\" id=\"penKick\">Kick</button>";
    var bar = body.querySelector("#penBar");
    var show = body.querySelector("#penShow");
    var marker = 0;
    function finish() {
      if (round.over) return;
      round.over = true;
      done(round.token, KHAYA.penaltyPayout(round.goals), "You scored " + round.goals + " of 5.");
    }
    body.querySelector("#penKick").addEventListener("click", function () {
      if (round.over) return;
      var dive = round.i % 2 === 0 ? 0.2 : 0.8;
      var aimed = marker > 0.38 && marker < 0.62;
      var sameSide = Math.abs(marker - dive) < 0.22;
      if (aimed || !sameSide) round.goals += 1;
      round.i += 1;
      show.textContent = round.goals + " goals · kick " + Math.min(5, round.i + 1) + " of 5";
      if (round.i >= 5) finish();
    });
    function frame(t) {
      if (round.over) return;
      clock = t;
      marker = (Math.sin(t / 280) + 1) / 2;
      bar.style.transform = "scaleX(" + marker + ")";
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return function stop() { round.over = true; };
  }

  function diketoStart(body, done) {
    var round = { i: 0, hits: 0, over: false, token: "diketo-" + Date.now(), lit: 0 };
    body.innerHTML = "<p class=\"rules\">Diketo. Eight stones. Tap the one that lights. A late tap misses. No fee.</p><div class=\"crates\" id=\"stones\"></div><p id=\"diketoScore\" class=\"fine\">0 hits</p>";
    var box = body.querySelector("#stones");
    var score = body.querySelector("#diketoScore");
    var s;
    for (s = 0; s < 8; s++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = String(s + 1);
      b.setAttribute("data-stone", String(s));
      box.appendChild(b);
    }
    function finish() {
      if (round.over) return;
      round.over = true;
      done(round.token, KHAYA.diketoPayout(round.hits), "You caught " + round.hits + " of 8 stones.");
    }
    function light(n) {
      round.lit = n;
      box.querySelectorAll("button").forEach(function (btn, idx) {
        btn.style.background = idx === n ? "#e2a53a" : "";
      });
    }
    light(0);
    var started = 0;
    box.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (round.over) return;
        if (Number(btn.getAttribute("data-stone")) === round.lit) round.hits += 1;
        round.i += 1;
        score.textContent = round.hits + " hits · " + round.i + " / 8";
        if (round.i >= 8) finish();
        else light(round.i);
      });
    });
    function frame(t) {
      if (round.over) return;
      if (!started) started = t;
      if (t - started > 1400) {
        started = t;
        if (round.i < 8) {
          round.i += 1;
          if (round.i >= 8) finish();
          else light(round.i);
          score.textContent = round.hits + " hits · " + round.i + " / 8";
        }
      }
      if (!round.over) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return function stop() { round.over = true; };
  }

  return { crateStart: crateStart, marketStart: marketStart, penaltyStart: penaltyStart, diketoStart: diketoStart };
})();
// Khaya Lane. Tap the lane, grow food, build, and play.
(function () {
  var SAVE = "eish-khaya-1";
  var canvas = document.getElementById("view");
  var modal = document.getElementById("modal");
  var sheet = document.getElementById("sheet");
  var modalTitle = document.getElementById("modalTitle");
  var modalBody = document.getElementById("modalBody");
  var card = document.getElementById("card");
  var goalEl = document.getElementById("goals");
  var levelEl = document.getElementById("lv");
  var xpFill = document.getElementById("xpfill");
  var resEl = document.getElementById("res");
  var notesEl = document.getElementById("notes");
  var toastEl = document.getElementById("toast");
  var placingEl = document.getElementById("placing");
  var q = new URLSearchParams(location.search);
  var tag = document.getElementById("buildTag");
  if (tag) tag.textContent = q.get("build") ? "build " + q.get("build") : "";

  var now0 = Date.now();
  var state = q.get("fresh") ? KHAYA.fresh(now0) : (load() || KHAYA.fresh(now0));
  KHAYA.tick(state, now0);
  var selectedId = null;
  var ghost = null;
  var stopGame = null;
  var toastTimer = 0;
  var born = {};
  var floats = [];
  var muted = localStorage.getItem("eish-khaya-mute") === "1";
  var drag = null;
  var laneLevel = KHAYA.playerLevel(state);
  var cam = { x: 0, y: 0, z: q.get("zoom") ? Number(q.get("zoom")) || 1 : 1, vx: 0, vy: 0 };
  var pointers = {};
  var pinch = 0;
  var squash = {};
  var cheerTimer = 0;
  var actx = null;
  var wind = null;

  function load() {
    try {
      return KHAYA.sanitize(JSON.parse(localStorage.getItem(SAVE) || "null"));
    } catch (err) {
      return null;
    }
  }

  function save() {
    try { localStorage.setItem(SAVE, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  function toast(text) {
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2400);
  }

  function audio() {
    if (muted) return null;
    if (!actx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      actx = new Ctx();
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function tone(freq, dur, type, gain) {
    var ctx = audio();
    if (!ctx) return;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain || 0.06, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  function chime(kind) {
    if (kind === "place") { tone(392, 0.1, "triangle", 0.05); setTimeout(function () { tone(523, 0.14, "triangle", 0.05); }, 80); }
    else if (kind === "harvest") { tone(523, 0.08, "square", 0.03); tone(784, 0.16, "triangle", 0.05); }
    else if (kind === "no") tone(196, 0.12, "sawtooth", 0.02);
    else tone(660, 0.08, "sine", 0.04);
  }

  function ensureWind() {
    var ctx = audio();
    if (!ctx || wind) return;
    var len = ctx.sampleRate * 2;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    var i;
    for (i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.25;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    var g = ctx.createGain();
    g.gain.value = 0.015;
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start();
    wind = src;
  }

  function icon(kind) {
    var paths = {
      seed: '<path d="M13 20c5-2 7-7 5-12-4 2-7 2-10-1 1 5 1 9 5 13z" fill="#d0893a"/><path d="M12 9c2-5 5-7 8-8-2 5-4 7-8 8z" fill="#2f8f4a"/>',
      water: '<path d="M12 3c4 5 7 8 7 12a7 7 0 1 1-14 0c0-4 3-7 7-12z" fill="#3d8ec9"/>',
      timber: '<rect x="3" y="9" width="18" height="6" rx="3" fill="#c4844a"/><circle cx="6" cy="12" r="2.4" fill="#f0d2a4"/><circle cx="18" cy="12" r="2.4" fill="#8a552c"/>',
      bricks: '<rect x="3" y="5" width="8" height="6" rx="1" fill="#d4654a"/><rect x="13" y="5" width="8" height="6" rx="1" fill="#c45640"/><rect x="8" y="13" width="8" height="6" rx="1" fill="#b84734"/>',
      maize: '<rect x="9" y="5" width="6" height="12" rx="3" fill="#e2b23a"/><path d="M12 4c2 2 2 3 0 5" stroke="#3f8f4a" fill="none"/>',
      spinach: '<ellipse cx="12" cy="13" rx="6" ry="4" fill="#3e9a4a"/>',
      tomato: '<circle cx="12" cy="13" r="5" fill="#d64545"/>',
      aloe: '<path d="M12 16 L8 8 L12 11 L16 8 Z" fill="#7dcea0"/>',
      morogo: '<ellipse cx="12" cy="13" rx="6" ry="4" fill="#3f8f4a"/>',
      pumpkin: '<circle cx="12" cy="13" r="5" fill="#e07a2f"/>',
      coin: '<circle cx="12" cy="12" r="8" fill="#f2c14e" stroke="#a67c1a" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="10" font-family="Fredoka,sans-serif" fill="#7a5410">N</text>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (paths[kind] || paths.coin) + "</svg>";
  }

  function selected() {
    return selectedId ? KHAYA.buildingById(state, selectedId) : null;
  }

  function closeModal() {
    if (stopGame) { stopGame(); stopGame = null; }
    modal.hidden = true;
    sheet.setAttribute("aria-hidden", "true");
  }

  function openModal(title, html) {
    if (stopGame) { stopGame(); stopGame = null; }
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.hidden = false;
    sheet.setAttribute("aria-hidden", "false");
  }

  function costLine(cost) {
    if (!cost) return "";
    var bits = [];
    if (cost.notes) bits.push(cost.notes + " notes");
    if (cost.timber) bits.push(cost.timber + " timber");
    if (cost.bricks) bits.push(cost.bricks + " bricks");
    if (cost.seeds) bits.push(cost.seeds + " seeds");
    if (cost.water) bits.push(cost.water + " water");
    return bits.join(" · ");
  }

  function paintHud() {
    notesEl.innerHTML = icon("coin") + "<b>" + state.notes + "</b>";
    var bits = [
      ["seed", state.seeds],
      ["water", state.water],
      ["timber", state.timber],
      ["bricks", state.bricks]
    ];
    Object.keys(KHAYA.CROPS).forEach(function (k) {
      if (state.crops[k] > 0) bits.push([k, state.crops[k]]);
    });
    resEl.innerHTML = bits.map(function (b) {
      return "<span title=\"" + b[0] + "\">" + icon(b[0]) + "<b>" + b[1] + "</b></span>";
    }).join("");
    var info = KHAYA.nextStep(KHAYA.playerXp(state), KHAYA.PLAYER_STEPS);
    var lv = KHAYA.playerLevel(state);
    var ordersBtn = document.getElementById("orders");
    if (ordersBtn) {
      var list = state.orders && state.orders.phase === "here" ? state.orders.list : [];
      ordersBtn.textContent = list && list.length ? "Orders " + list.length : "Orders";
    }
    if (levelEl) levelEl.textContent = String(lv);
    if (xpFill) {
      var span = Math.max(1, info.next - info.prev);
      var pct = info.max ? 1 : (KHAYA.playerXp(state) - info.prev) / span;
      xpFill.style.transform = "scaleX(" + pct + ")";
    }
    if (goalEl) {
      var open = KHAYA.tasks(state).filter(function (t) { return !t.done; }).slice(0, 3);
      if (!open.length) open = [{ done: true, text: "The lane is underway. Keep growing it." }];
      goalEl.innerHTML = open.map(function (t) {
        return "<li" + (t.done ? " class=\"done\"" : "") + ">" + t.text + "</li>";
      }).join("");
    }
    var laneBtn = document.querySelector("[data-act=more]");
    if (laneBtn) {
      var badges = KHAYA.unseenFolk(state);
      if (!state.daily || state.daily.last !== KHAYA.dayKey(new Date())) badges += 1;
      laneBtn.innerHTML = "Lane" + (badges ? "<span class=\"badge\">" + badges + "</span>" : "");
    }
  }

  function flyCoins(x, y, n) {
    if (!notesEl) return;
    var target = notesEl.getBoundingClientRect();
    var i;
    for (i = 0; i < Math.min(8, Math.max(1, n)); i++) {
      var el = document.createElement("i");
      el.className = "fly";
      el.style.left = x + "px";
      el.style.top = y + "px";
      document.body.appendChild(el);
      (function (node, delay) {
        setTimeout(function () {
          node.style.transform = "translate(" + (target.left + target.width / 2 - x) + "px," + (target.top + target.height / 2 - y) + "px) scale(0.35)";
          node.style.opacity = "0.15";
        }, 20 + delay);
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 680 + delay);
      })(el, i * 45);
    }
  }

  function noteArrivals() {
    var found = KHAYA.syncFolk(state);
    if (found.length) toast(KHAYA.FOLK[found[0]].name + " can stay on the lane");
  }

  function celebrate() {
    var after = KHAYA.playerLevel(state);
    if (after > laneLevel) {
      toast("Level " + after);
      chime("place");
      var cheer = document.getElementById("cheer");
      if (cheer) {
        cheer.hidden = false;
        cheer.textContent = "Level " + after;
        clearTimeout(cheerTimer);
        cheerTimer = setTimeout(function () { cheer.hidden = true; }, 1500);
      }
      floats.push({
        x: canvas.clientWidth / 2,
        y: 72,
        t: Date.now(),
        text: "Level " + after,
        color: "#c4841a",
        coins: 8
      });
    }
  }

  function paintCard() {
    var b = selected();
    if (ghost) {
      var def = KHAYA.BUILDINGS[ghost.type];
      var check = KHAYA.canPlace(state, ghost.type, ghost.x, ghost.y);
      card.innerHTML = "<b>Placing " + def.name + "</b><p>" + (check.ok ? "Tap the lane to build it." : check.reason) + "</p>";
      return;
    }
    if (!b) {
      card.innerHTML = "<b>Khaya Lane</b><p>Tap a bed to plant, or open Build.</p>";
      return;
    }
    var spec = KHAYA.BUILDINGS[b.type];
    var html = "<b>" + spec.name + "</b>";
    if (b.type === "bed") {
      var view = KHAYA.bedView(b, Date.now());
      if (view.phase === "empty") {
        html += "<p>Choose a crop.</p><div class=\"row\">";
        Object.keys(KHAYA.CROPS).forEach(function (k) {
          var c = KHAYA.CROPS[k];
          if (c.offer === false) return;
          var locked = KHAYA.farmLevel(state) < c.level;
          html += "<button type=\"button\" data-sow=\"" + k + "\"" + (locked || state.seeds < 1 ? " disabled" : "") + ">" + c.name + (locked ? " · lv " + c.level : "") + "</button>";
        });
        html += "</div>";
      } else if (view.phase === "sown") {
        var waterCost = KHAYA.CROPS[b.crop].water;
        html += "<p>" + KHAYA.CROPS[b.crop].name + " is in. It needs " + waterCost + " water.</p>";
        html += "<button type=\"button\" class=\"hot\" data-do=\"water\"" + (state.water < waterCost ? " disabled" : "") + ">Water</button>";
      } else if (view.phase === "growing") {
        html += "<p>" + KHAYA.CROPS[b.crop].name + " · " + Math.ceil(view.left / 1000) + "s</p><div class=\"meter\"><span style=\"transform:scaleX(" + view.progress + ")\"></span></div>";
      } else {
        html += "<p>" + KHAYA.CROPS[b.crop].name + " is ready.</p><button type=\"button\" class=\"hot\" data-do=\"harvest\">Harvest</button>";
      }
    } else {
      html += "<p>" + spec.blurb + "</p>";
      var job = KHAYA.buildView(b);
      if (job) {
        html += "<p>Building · " + Math.ceil(job.left / 1000) + "s</p><div class=\"meter\"><span style=\"transform:scaleX(" + job.progress + ")\"></span></div>";
      }
      var prod = KHAYA.produceView(b);
      if (prod) {
        html += "<p>" + (prod.ready ? prod.stored + " notes ready" : "Next note in " + Math.ceil(prod.left / 1000) + "s") + "</p>";
        html += "<div class=\"meter\"><span style=\"transform:scaleX(" + prod.progress + ")\"></span></div>";
        if (prod.ready) html += "<button type=\"button\" class=\"hot\" data-do=\"collect\">Collect</button>";
      }
      if (!job) {
        var up = KHAYA.canUpgrade(state, b.id);
        var price = KHAYA.upgradeCost(state, b);
        if (price) {
          html += "<p class=\"fine\">" + costLine(price) + "</p>";
          html += "<button type=\"button\" class=\"hot\" data-do=\"upgrade\"" + (up.ok ? "" : " disabled") + ">Upgrade</button>";
          if (!up.ok) html += "<p class=\"fine\">" + up.reason + "</p>";
        } else html += "<p class=\"fine\">Fully built.</p>";
      }
    }
    card.innerHTML = html;
  }

  function cellPoint(b) {
    var o = DRAW.layout(canvas.clientWidth, canvas.clientHeight, cam);
    var n = KHAYA.cellNorth(b.x + b.w / 2, b.y + b.h / 2, o.ox, o.oy, o.tw, o.th);
    return { x: n.x, y: n.y };
  }

  function paint() {
    paintHud();
    paintCard();
    placingEl.hidden = !ghost;
    if (ghost) placingEl.textContent = "Placing " + KHAYA.BUILDINGS[ghost.type].name + " — tap the grass, or cancel";
    var dragging = drag && drag.moved && !drag.ghost ? { id: drag.id, x: drag.cx, y: drag.cy } : null;
    DRAW.render(canvas, state, { ghost: ghost, selected: selected(), born: born, floats: floats, drag: dragging, cam: cam, squash: squash }, Date.now());
  }

  function act(result) {
    if (!result || !result.ok) {
      chime("no");
      toast(result && result.reason ? result.reason : "That did not work.");
      paint();
      return;
    }
    var focus = selected() || (result.id ? KHAYA.buildingById(state, result.id) : null);
    if (result.building) chime("place");
    if (result.id) {
      born[result.id] = Date.now();
      chime("place");
    }
    if (result.level && focus) {
      born[focus.id] = Date.now();
      chime("place");
    }
    if (result.amount) {
      chime(result.crit ? "place" : "harvest");
      if (focus) {
        var p = cellPoint(focus);
        floats.push({ x: p.x, y: p.y, t: Date.now(), text: (result.crit ? "Golden ×" : "+") + result.amount + " " + result.crop, color: result.crit ? "#e2a53a" : "#2f6d4f" });
      }
      if (result.crit) toast("A golden mielie. Triple harvest.");
      if (result.combo >= 3) toast("Combo " + result.combo + ". +" + (result.notes || 0) + " notes.");
    } else if (result.notes) {
      chime("harvest");
      toast("+" + result.notes + " notes");
      if (result.collected && focus) {
        var coin = cellPoint(focus);
        floats.push({ x: coin.x, y: coin.y, t: Date.now(), text: "+" + result.notes, color: "#c4841a", coins: Math.min(6, result.notes) });
        var rect = canvas.getBoundingClientRect();
        flyCoins(rect.left + coin.x, rect.top + coin.y, result.notes);
      }
    } else if (result.xp) {
      chime("tap");
    }
    if (result.chest) toast("Level " + result.chest + " chest is waiting in the lane book.");
    noteArrivals();
    celebrate();
    save();
    paint();
  }

  function openBuild() {
    var html = "";
    Object.keys(KHAYA.BUILDINGS).forEach(function (type) {
      var def = KHAYA.BUILDINGS[type];
      if (!def.cost || def.menu === false) return;
      var cost = KHAYA.placeCost(state, type);
      var check = KHAYA.canPlace(state, type, -1, -1);
      var skillLock = KHAYA.buildLevel(state) < (def.skill || 1);
      var full = false;
      var n = 0;
      var i;
      for (i = 0; i < state.buildings.length; i++) if (state.buildings[i].type === type) n++;
      if (n >= def.limit) full = true;
      html += "<article class=\"build\"><h3>" + def.name + "</h3><p>" + def.blurb + "</p><p class=\"fine\">" + costLine(cost) + "</p>";
      if (skillLock) html += "<p class=\"fine\">Needs building level " + def.skill + ".</p>";
      else if (full) html += "<p class=\"fine\">Already built.</p>";
      else html += "<button type=\"button\" data-arm=\"" + type + "\"" + (KHAYA.afford(state, cost).ok ? "" : " disabled") + ">Place</button>";
      html += "</article>";
    });
    openModal("Build", html);
    modalBody.querySelectorAll("[data-arm]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        ghost = { type: btn.getAttribute("data-arm"), x: 2, y: 5 };
        selectedId = null;
        closeModal();
        paint();
      });
    });
  }

  function openSkills() {
    function block(label, xp, steps) {
      var info = KHAYA.nextStep(xp, steps);
      var lv = info.max ? steps.length : info.level;
      var span = Math.max(1, info.next - info.prev);
      var pct = info.max ? 1 : (xp - info.prev) / span;
      return "<h3>" + label + " · level " + lv + "</h3><div class=\"meter\"><span style=\"transform:scaleX(" + pct + ")\"></span></div><p class=\"fine\">" + xp + " xp" + (info.max ? " · practised" : " · " + (info.next - xp) + " to the next level") + "</p>";
    }
    var html = block("Farming", state.farmXp, KHAYA.FARM_STEPS) + block("Building", state.buildXp, KHAYA.BUILD_STEPS);
    html += "<ul class=\"unlocks\"><li>Maize and spinach from the start</li><li>Tomatoes at farming level 2</li><li>Aloe at farming level 3</li><li>Solar stand at building level 2</li><li>Home’s last step at building level 2</li></ul>";
    openModal("Skills", html);
  }

  function finishGame(token, payout, line) {
    var empty = !payout || ((payout.notes || 0) + (payout.seeds || 0) + (payout.water || 0) <= 0);
    if (empty) {
      modalBody.innerHTML = "<p class=\"rules\">" + line + " No notes this round. You can try again.</p><button type=\"button\" class=\"hot\" data-close-game>Back to the lane</button>";
      modalBody.querySelector("[data-close-game]").addEventListener("click", closeModal);
      return;
    }
    var granted = KHAYA.collectReward(state, token, payout);
    save();
    var text = line + " ";
    if (granted.ok) {
      var bits = [];
      if (granted.notes) bits.push(granted.notes + " notes");
      if (granted.seeds) bits.push(granted.seeds + " seeds");
      if (granted.water) bits.push(granted.water + " water");
      text += "Added " + bits.join(", ") + ".";
    } else text += granted.reason;
    modalBody.innerHTML = "<p class=\"rules\">" + text + "</p><button type=\"button\" class=\"hot\" data-close-game>Back to the lane</button>";
    modalBody.querySelector("[data-close-game]").addEventListener("click", closeModal);
    paintHud();
  }

  function openPlay() {
    openModal("Play", "<p class=\"rules\">Games on the lane. They pay notes once when you finish. Leaving early pays nothing. There is no fee and nothing to wager.</p><article class=\"build\"><h3>Crate Day</h3><p>Sort the harvest into the right crate before the bar runs out.</p><button type=\"button\" data-game=\"crate\">Play Crate Day</button></article><article class=\"build\"><h3>Spaza counter</h3><p>Match the customer’s slip, then hand it over.</p><button type=\"button\" data-game=\"market\">Open the counter</button></article><article class=\"build\"><h3>Penalty</h3><p>Five kicks. Time the bar. The keeper dives.</p><button type=\"button\" data-game=\"penalty\">Take the kicks</button></article><article class=\"build\"><h3>Diketo</h3><p>Tap the stone while it is lit. Eight stones.</p><button type=\"button\" data-game=\"diketo\">Play diketo</button></article>");
    modalBody.querySelectorAll("[data-game]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-game");
        var titles = { crate: "Crate Day", market: "Spaza counter", penalty: "Penalty", diketo: "Diketo" };
        modalTitle.textContent = titles[kind] || "Play";
        if (kind === "crate") stopGame = PLAY.crateStart(modalBody, finishGame);
        else if (kind === "market") stopGame = PLAY.marketStart(modalBody, finishGame);
        else if (kind === "penalty") stopGame = PLAY.penaltyStart(modalBody, finishGame);
        else stopGame = PLAY.diketoStart(modalBody, finishGame);
      });
    });
  }

  function dailyBlock() {
    var today = KHAYA.dayKey(new Date());
    var ready = !state.daily || state.daily.last !== today;
    var html = "<h3>Seven days</h3><div class=\"days\">";
    var i;
    for (i = 1; i <= 7; i++) {
      var cls = "";
      if (state.daily && i < state.daily.day) cls = " done";
      if (state.daily && i === state.daily.day && !ready) cls = " done";
      if (ready && i === ((state.daily && state.daily.last && KHAYA.prevDay(today) === state.daily.last) ? (state.daily.day % 7) + 1 : 1)) cls = " now";
      html += "<span class=\"day" + cls + "\">" + i + "</span>";
    }
    html += "</div>";
    if (ready) html += "<button type=\"button\" class=\"hot\" data-daily>Collect today's gift</button>";
    else html += "<p class=\"fine\">Already collected today. The next gift waits until tomorrow.</p>";
    return html;
  }

  function bookBlock() {
    var html = "<h3>The lane book</h3><div class=\"book\">";
    var id, spec, rec, homes, hi;
    for (id in KHAYA.FOLK) {
      spec = KHAYA.FOLK[id];
      rec = state.collection[id] || { have: 0 };
      if (rec.have) KHAYA.seeFolk(state, id);
      var tale = KHAYA.storyView(state, id);
      html += "<article class=\"folk" + (rec.have ? "" : " locked") + "\"><b>" + (rec.have ? spec.name : (tale && tale.open ? spec.name : "???")) + "</b><p class=\"fine\">" + (rec.have ? spec.blurb : (tale && tale.open ? tale.say : "Not met yet.")) + "</p>";
      if (tale && tale.open && !tale.done) html += "<button type=\"button\" data-story=\"" + id + "\">Reply</button>";
      if (rec.have) {
        homes = "";
        for (hi = 0; hi < state.buildings.length; hi++) {
          var allow = spec.where.indexOf(state.buildings[hi].type) >= 0;
          if (allow) homes += "<button type=\"button\" data-house=\"" + id + "\" data-bid=\"" + state.buildings[hi].id + "\">" + (rec.home === state.buildings[hi].id ? "Staying · " : "House at ") + KHAYA.BUILDINGS[state.buildings[hi].type].name + "</button>";
        }
        if (rec.home) homes += "<button type=\"button\" data-unhouse=\"" + id + "\">Let them wander</button>";
        html += "<div class=\"row\">" + homes + "</div>";
      }
      html += "</article>";
    }
    html += "</div>";
    return html;
  }

  function openUnlock(id) {
    var plot = KHAYA.PLOTS[id];
    var check = KHAYA.canUnlock(state, id);
    var html = "<p class=\"rules\">Open the " + plot.name.toLowerCase() + " for " + plot.notes + " notes. It needs lane level " + plot.level + ".</p>";
    html += "<button type=\"button\" class=\"hot\" data-unlock=\"" + id + "\"" + (check.ok ? "" : " disabled") + ">Unlock</button>";
    if (!check.ok) html += "<p class=\"fine\">" + check.reason + "</p>";
    openModal(plot.name, html);
    var btn = modalBody.querySelector("[data-unlock]");
    if (btn) btn.addEventListener("click", function () {
      act(KHAYA.unlockPlot(state, id));
      if (!modal.hidden) closeModal();
    });
  }

  function openMore() {
    var list = KHAYA.tasks(state).map(function (t) {
      return "<li>" + (t.done ? "Done · " : "") + t.text + "</li>";
    }).join("");
    var braai = "";
    var today = KHAYA.dayKey(new Date());
    if (KHAYA.weekendKey(today)) {
      var progress = state.braai && state.braai.key === KHAYA.weekendKey(today) ? state.braai.n : 0;
      braai = "<h3>Braai Day</h3><p class=\"fine\">Harvest 4 crops this weekend. " + Math.min(4, progress) + " of 4.</p>";
      if (state.chest) braai += "<button type=\"button\" data-chest>Open the level " + state.chest.level + " chest</button>";
      braai += "<button type=\"button\" data-braai>Share the braai</button>";
    } else if (state.chest) {
      braai = "<button type=\"button\" data-chest>Open the level " + state.chest.level + " chest</button>";
    }
    var head = dailyBlock() + braai + bookBlock();
    save();
    var sell = "";
    Object.keys(KHAYA.CROPS).forEach(function (k) {
      if (state.crops[k] > 0) sell += "<button type=\"button\" data-sell=\"" + k + "\">Sell 1 " + KHAYA.CROPS[k].name.toLowerCase() + " · " + KHAYA.CROPS[k].price + " notes</button>";
    });
    if (!sell) sell = "<p class=\"fine\">Harvest something, then sell it once a spaza is up.</p>";
    openModal("The lane", head + "<ul class=\"unlocks\">" + list + "</ul><div class=\"row\">" + sell + "</div><button type=\"button\" id=\"reset\">Reset neighbourhood</button>");
    var dailyBtn = modalBody.querySelector("[data-daily]");
    if (dailyBtn) dailyBtn.addEventListener("click", function () {
      var got = KHAYA.claimDaily(state, KHAYA.dayKey(new Date()));
      act(got);
      if (!modal.hidden) openMore();
    });
    modalBody.querySelectorAll("[data-house]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        act(KHAYA.houseFolk(state, btn.getAttribute("data-house"), Number(btn.getAttribute("data-bid"))));
        if (!modal.hidden) openMore();
      });
    });
    modalBody.querySelectorAll("[data-story]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var told = KHAYA.advanceStory(state, btn.getAttribute("data-story"));
        act(told.ok ? told : { ok: false, reason: told.reason });
        if (told.say) toast(told.say);
        if (!modal.hidden) openMore();
      });
    });
    var chestBtn = modalBody.querySelector("[data-chest]");
    if (chestBtn) chestBtn.addEventListener("click", function () {
      act(KHAYA.claimChest(state));
      if (!modal.hidden) openMore();
    });
    var braaiBtn = modalBody.querySelector("[data-braai]");
    if (braaiBtn) braaiBtn.addEventListener("click", function () {
      act(KHAYA.claimBraai(state, KHAYA.dayKey(new Date())));
      if (!modal.hidden) openMore();
    });
    modalBody.querySelectorAll("[data-unhouse]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        act(KHAYA.unhouseFolk(state, btn.getAttribute("data-unhouse")));
        if (!modal.hidden) openMore();
      });
    });
    modalBody.querySelectorAll("[data-sell]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        act(KHAYA.sell(state, btn.getAttribute("data-sell"), 1));
        if (modal.hidden) return;
        openMore();
      });
    });
    modalBody.querySelector("#reset").addEventListener("click", function () {
      openModal("Reset neighbourhood?", "<p class=\"rules\">This clears the lane and starts again. It cannot be undone.</p><button type=\"button\" class=\"hot\" id=\"yesReset\">Yes, start again</button>");
      modalBody.querySelector("#yesReset").addEventListener("click", function () {
        state = KHAYA.fresh(Date.now());
        selectedId = null;
        ghost = null;
        save();
        closeModal();
        toast("A new lane.");
        paint();
      });
    });
  }

  function cellFrom(ev) {
    var rect = canvas.getBoundingClientRect();
    var o = DRAW.layout(canvas.clientWidth, canvas.clientHeight, cam);
    return KHAYA.pickCell(ev.clientX - rect.left, ev.clientY - rect.top, o.ox, o.oy, o.tw, o.th);
  }

  function pinchDist() {
    var ids = Object.keys(pointers);
    if (ids.length < 2) return 0;
    var a = pointers[ids[0]];
    var b = pointers[ids[1]];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  }

  canvas.addEventListener("pointerdown", function (ev) {
    if (!modal.hidden) return;
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (Object.keys(pointers).length >= 2) {
      drag = null;
      pinch = pinchDist();
      return;
    }
    var cell = cellFrom(ev);
    if (ghost) {
      ghost.x = cell.x;
      ghost.y = cell.y;
      drag = { ghost: true, px: ev.clientX, py: ev.clientY, moved: false, pointer: ev.pointerId };
      try { canvas.setPointerCapture(ev.pointerId); } catch (err) { /* ignore */ }
      paint();
      return;
    }
    var hit = KHAYA.occupied(state, cell.x, cell.y);
    if (!hit) {
      var plot = KHAYA.plotAt(cell.x, cell.y);
      drag = {
        pan: true, px: ev.clientX, py: ev.clientY, lx: ev.clientX, ly: ev.clientY,
        moved: false, pointer: ev.pointerId,
        plot: plot && !KHAYA.plotOpen(state, cell.x, cell.y) ? plot.id : ""
      };
      try { canvas.setPointerCapture(ev.pointerId); } catch (err) { /* ignore */ }
      return;
    }
    squash[hit.id] = Date.now();
    drag = { id: hit.id, px: ev.clientX, py: ev.clientY, moved: false, cx: hit.x, cy: hit.y, pointer: ev.pointerId };
    try { canvas.setPointerCapture(ev.pointerId); } catch (err) { /* ignore */ }
  });

  canvas.addEventListener("pointermove", function (ev) {
    if (pointers[ev.pointerId]) pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (Object.keys(pointers).length >= 2) {
      var dist = pinchDist();
      if (pinch) {
        cam.z *= dist / pinch;
        DRAW.clampCamera(canvas.clientWidth, canvas.clientHeight, cam);
      }
      pinch = dist;
      paint();
      return;
    }
    if (!drag || ev.pointerId !== drag.pointer) return;
    if (Math.hypot(ev.clientX - drag.px, ev.clientY - drag.py) > 12) drag.moved = true;
    if (!drag.moved) return;
    if (drag.pan) {
      cam.x += ev.clientX - drag.lx;
      cam.y += ev.clientY - drag.ly;
      cam.vx = (ev.clientX - drag.lx) * 0.6;
      cam.vy = (ev.clientY - drag.ly) * 0.6;
      drag.lx = ev.clientX;
      drag.ly = ev.clientY;
      DRAW.clampCamera(canvas.clientWidth, canvas.clientHeight, cam);
      paint();
      return;
    }
    var cell = cellFrom(ev);
    if (drag.ghost) {
      ghost.x = cell.x;
      ghost.y = cell.y;
    } else {
      drag.cx = cell.x;
      drag.cy = cell.y;
    }
    paint();
  });

  function endDrag(ev) {
    if (ev && pointers[ev.pointerId]) delete pointers[ev.pointerId];
    if (Object.keys(pointers).length < 2) pinch = 0;
    if (!drag || (ev && ev.pointerId !== drag.pointer)) return;
    var item = drag;
    drag = null;
    if (item.pan) {
      if (!item.moved && item.plot) openUnlock(item.plot);
      else { selectedId = null; paint(); }
      return;
    }
    if (item.ghost) {
      var placed = KHAYA.place(state, ghost.type, ghost.x, ghost.y);
      if (placed.ok) {
        ghost = null;
        selectedId = placed.id;
      }
      act(placed);
      return;
    }
    if (!item.moved) {
      var b = KHAYA.buildingById(state, item.id);
      selectedId = item.id;
      if (b && (b.stored || 0) > 0) act(KHAYA.collect(state, b.id));
      else paint();
      return;
    }
    selectedId = item.id;
    act(KHAYA.move(state, item.id, item.cx, item.cy));
  }

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", function (ev) {
    if (ev && pointers[ev.pointerId]) delete pointers[ev.pointerId];
    drag = null;
    paint();
  });
  canvas.addEventListener("wheel", function (ev) {
    if (!modal.hidden) return;
    ev.preventDefault();
    cam.z *= ev.deltaY > 0 ? 0.92 : 1.08;
    DRAW.clampCamera(canvas.clientWidth, canvas.clientHeight, cam);
    paint();
  }, { passive: false });

  card.addEventListener("click", function (ev) {
    var sow = ev.target.getAttribute && ev.target.getAttribute("data-sow");
    var todo = ev.target.getAttribute && ev.target.getAttribute("data-do");
    if (sow) act(KHAYA.sow(state, selectedId, sow));
    if (todo === "water") act(KHAYA.water(state, selectedId, Date.now()));
    if (todo === "harvest") act(KHAYA.harvest(state, selectedId, Date.now()));
    if (todo === "upgrade") act(KHAYA.upgrade(state, selectedId));
    if (todo === "collect") act(KHAYA.collect(state, selectedId));
  });

  document.getElementById("dock").addEventListener("click", function (ev) {
    var actName = ev.target.getAttribute && ev.target.getAttribute("data-act");
    if (actName === "build") openBuild();
    if (actName === "skills") openSkills();
    if (actName === "play") openPlay();
    if (actName === "more") openMore();
    if (actName === "cancel") { ghost = null; paint(); }
  });

  modal.addEventListener("click", function (ev) {
    if (ev.target === modal || (ev.target.getAttribute && ev.target.getAttribute("data-close") != null)) closeModal();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") {
      if (!modal.hidden) closeModal();
      else if (ghost) { ghost = null; paint(); }
      else { selectedId = null; paint(); }
    }
  });

  window.addEventListener("resize", paint);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      KHAYA.tick(state, Date.now());
      save();
      paint();
    }
  });

  if (q.get("go") === "1" || q.get("lineup")) state.welcomed = true;
  if (!state.welcomed) {
    state.welcomed = true;
    save();
    openModal("Welcome to Khaya Lane", "<p class=\"rules\">Sow a bed, water it, and harvest. The spaza earns notes while you are away — tap the coin to collect. Drag a building to move it. Upgrade the home when you can. Notes stay on this device.</p><button type=\"button\" class=\"hot\" data-close>Start on the lane</button>");
  }

  var muteBtn = document.getElementById("mute");
  function paintMute() {
    if (!muteBtn) return;
    muteBtn.textContent = muted ? "Off" : "On";
    muteBtn.setAttribute("aria-label", muted ? "Sound off" : "Sound on");
    muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
  }
  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      muted = !muted;
      localStorage.setItem("eish-khaya-mute", muted ? "1" : "0");
      if (muted && actx) actx.suspend();
      else ensureWind();
      paintMute();
    });
  }
  paintMute();
  var ordersBtn = document.getElementById("orders");
  if (ordersBtn) ordersBtn.addEventListener("click", function () {
    var o = state.orders || { list: [], phase: "away" };
    var html = "<p class=\"rules\">Jabu hoots in with neighbourhood orders. Fill one with what you grew. He waits, then the rank goes quiet until the next run.</p>";
    if (o.phase !== "here" || !o.list || !o.list.length) html += "<p>The taxi is on the road.</p>";
    else o.list.forEach(function (job, i) {
      html += "<article class=\"build\"><h3>" + job.name + "</h3><p>" + job.say + "</p><p class=\"fine\">" + job.notes + " notes" + (job.rare ? " · sometimes a seed" : "") + "</p><button type=\"button\" data-fill=\"" + i + "\">Fill</button></article>";
    });
    openModal("Taxi orders", html);
    modalBody.querySelectorAll("[data-fill]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var got = KHAYA.fillOrder(state, Number(btn.getAttribute("data-fill")), Date.now());
        act(got);
        if (got.ok) toast(got.rare ? "Order filled. A seed came with it." : "Order filled.");
      });
    });
  });
  var eventBtn = document.getElementById("event");
  if (eventBtn) eventBtn.addEventListener("click", function () {
    var got = KHAYA.respondEvent(state, Date.now());
    if (got.say) toast(got.say);
    if (!got.ok) toast(got.reason);
    else act(got.notes || got.seeds ? got : { ok: true });
    paint();
  });
  canvas.addEventListener("pointerdown", function () { ensureWind(); }, { once: true });

  var hudAt = 0;
  function frame() {
    var now = Date.now();
    if (!drag || !drag.pan) {
      cam.x += cam.vx;
      cam.y += cam.vy;
      cam.vx *= 0.9;
      cam.vy *= 0.9;
      if (Math.abs(cam.vx) < 0.08) cam.vx = 0;
      if (Math.abs(cam.vy) < 0.08) cam.vy = 0;
      if (cam.vx || cam.vy) DRAW.clampCamera(canvas.clientWidth, canvas.clientHeight, cam);
    }
    if (now - hudAt > 350) {
      KHAYA.setToday(state, KHAYA.dayKey(new Date()));
      var ticked = KHAYA.tick(state, now);
      if (ticked.hoot && state.orders) {
        tone(440, 0.08, "square", 0.04);
        setTimeout(function () { tone(330, 0.12, "square", 0.04); }, 120);
        state.orders.hoot = 0;
      }
      var live = state.laneEvent && state.laneEvent.current;
      var eventBtn = document.getElementById("event");
      if (eventBtn) {
        if (live) {
          if (eventBtn.hidden) toast(live.say);
          eventBtn.hidden = false;
          eventBtn.textContent = live.say;
        } else eventBtn.hidden = true;
      }
      if (ticked.found && ticked.found.length) noteArrivals();
      if (ticked.finished && ticked.finished.length) {
        var i;
        for (i = 0; i < ticked.finished.length; i++) born[ticked.finished[i].id] = now;
        chime("place");
        celebrate();
        save();
        paintCard();
      }
      paintHud();
      var sel = selected();
      if (sel && (sel.type === "bed" || sel.buildLeft || KHAYA.produceView(sel))) paintCard();
      hudAt = now;
    }
    floats = floats.filter(function (f) { return now - f.t < 1000; });
    var dragging = drag && drag.moved && !drag.ghost ? { id: drag.id, x: drag.cx, y: drag.cy } : null;
    DRAW.render(canvas, state, { ghost: ghost, selected: selected(), born: born, floats: floats, drag: dragging, cam: cam, squash: squash }, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  if ("serviceWorker" in navigator && location.protocol !== "file:" && location.search.indexOf("nosw=1") < 0) {
  navigator.serviceWorker.register("sw.js").catch(function () {});
}
  if (q.get("demo")) {
    setTimeout(function () { if (ordersBtn) ordersBtn.click(); }, 800);
    setTimeout(function () { closeModal(); }, 4800);
    setTimeout(function () {
      state.laneEvent = { next: Date.now() - 1, n: 0, current: null };
      KHAYA.tick(state, Date.now());
    }, 5400);
    setTimeout(function () {
      var banner = document.getElementById("event");
      if (banner && !banner.hidden) banner.click();
    }, 8600);
    setTimeout(function () {
      var bed = null;
      var i;
      for (i = 0; i < state.buildings.length; i++) if (state.buildings[i].type === "bed" && state.buildings[i].phase === "empty") bed = state.buildings[i];
      if (!bed) return;
      state.stats.harvested = 5;
      KHAYA.sow(state, bed.id, "maize");
      KHAYA.water(state, bed.id, Date.now() - 20000);
      act(KHAYA.harvest(state, bed.id, Date.now()));
    }, 10200);
    setTimeout(function () { openPlay(); }, 12800);
    setTimeout(function () {
      var kick = modalBody.querySelector("[data-game=\"penalty\"]");
      if (kick) kick.click();
    }, 14600);
    setTimeout(function () {
      var shot = document.getElementById("penKick");
      if (shot) shot.click();
    }, 16200);
  }
DRAW.load(function () {
  if (q.get("lineup")) {
    function drawLine() { DRAW.lineup(canvas); requestAnimationFrame(drawLine); }
    document.getElementById("boot").hidden = true;
    drawLine();
    return;
  }
  paint();
});
window.__EISH_OK = true;
  var boot = document.getElementById("boot");
  if (boot) boot.hidden = true;
  paint();
  save();
})();
