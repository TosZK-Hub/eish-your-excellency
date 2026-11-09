// Khaya Lane rules: farming, building, skills, and capped mini-game pay.
// Original game logic. No account, no real-money currency.
var KHAYA = (function () {
  var COLS = 8;
  var ROWS = 8;
  var ELAPSE_CAP = 10 * 60 * 1000;
  var TANK_MS = 20000;
  var WATER_CAP = 24;
  var NOTE_CAP = 9999;
  var STACK_CAP = 99;

  var MAP = [
    "tggggggt",
    "gggggggg",
    "ggggpggg",
    "ggggpggg",
    "ggggpggg",
    "ggggpggg",
    "ppppgggg",
    "gggggggg"
  ];

  var CROPS = {
    maize: { name: "Maize", grow: 16000, water: 1, seed: 1, yield: 3, xp: 8, level: 1, price: 4 },
    spinach: { name: "Spinach", grow: 12000, water: 1, seed: 1, yield: 2, xp: 6, level: 1, price: 3 },
    tomato: { name: "Tomato", grow: 22000, water: 2, seed: 1, yield: 2, xp: 12, level: 2, price: 6 },
    aloe: { name: "Aloe", grow: 20000, water: 1, seed: 1, yield: 1, xp: 10, level: 3, price: 8 }
  };

  var FARM_STEPS = [0, 24, 70, 140];
  var BUILD_STEPS = [0, 16, 48, 100];

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
      stats: { sown: 0, watered: 0, harvested: 0, placed: 0, upgraded: 0, played: 0 },
      paid: {},
      tankAcc: 0,
      seenAt: now,
      nextId: 3,
      welcomed: false,
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
    var dx, dy, land, block;
    for (dy = 0; dy < def.h; dy++) {
      for (dx = 0; dx < def.w; dx++) {
        land = terrainAt(x + dx, y + dy);
        if (land === "out") return { ok: false, reason: "That sits outside the lane." };
        if (land === "path") return { ok: false, reason: "The path stays open for neighbours." };
        if (land === "tree") return { ok: false, reason: "The jacaranda stays." };
        block = occupied(state, x + dx, y + dy);
        if (block) return { ok: false, reason: "Something is already there." };
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
    var raw = BUILDINGS[b.type].upgrades[b.level];
    pay(state, upgradeCost(state, b));
    b.level += 1;
    state.buildXp += raw.xp || 12;
    state.stats.upgraded += 1;
    return { ok: true, level: b.level, xp: raw.xp || 12 };
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
    state.farmXp += 2;
    state.stats.sown += 1;
    return { ok: true, xp: 2 };
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
    state.farmXp += def.xp;
    state.stats.harvested += 1;
    b.crop = null;
    b.phase = "empty";
    b.plantedAt = 0;
    return { ok: true, crop: name, amount: amount, xp: def.xp };
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
    if (hasType(state, "tank")) {
      state.tankAcc = (state.tankAcc || 0) + used;
      while (state.tankAcc >= TANK_MS && state.water < WATER_CAP) {
        state.water += 1;
        state.tankAcc -= TANK_MS;
      }
      if (state.water >= WATER_CAP) state.tankAcc = Math.min(state.tankAcc, TANK_MS);
    }
    state.seenAt = now;
    return { elapsed: used, discarded: discarded };
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

  function tasks(state) {
    return [
      { id: "sow", done: state.stats.sown > 0, text: "Sow maize in a veggie bed" },
      { id: "water", done: state.stats.watered > 0, text: "Water the bed" },
      { id: "harvest", done: state.stats.harvested > 0, text: "Harvest when the crop is ready" },
      { id: "place", done: state.stats.placed > 0, text: "Place a spaza, tank, or workshop" },
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
    s.buildings = [];
    s.nextId = 1;
    var list = Array.isArray(data.buildings) ? data.buildings : [];
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
        level: clamp(raw.level, 1, def.upgrades ? def.upgrades.length : 1)
      };
      ok = true;
      for (dy = 0; dy < b.h && ok; dy++) {
        for (dx = 0; dx < b.w; dx++) {
          land = terrainAt(b.x + dx, b.y + dy);
          block = occupied(s, b.x + dx, b.y + dy);
          if (land !== "grass" || block) { ok = false; break; }
        }
      }
      if (!ok) continue;
      if (countType(s, b.type) >= def.limit) continue;
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
    return s;
  }

  return {
    COLS: COLS,
    ROWS: ROWS,
    MAP: MAP,
    CROPS: CROPS,
    BUILDINGS: BUILDINGS,
    FARM_STEPS: FARM_STEPS,
    BUILD_STEPS: BUILD_STEPS,
    ELAPSE_CAP: ELAPSE_CAP,
    fresh: fresh,
    sanitize: sanitize,
    farmLevel: farmLevel,
    buildLevel: buildLevel,
    nextStep: nextStep,
    terrainAt: terrainAt,
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
    hasType: hasType
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = KHAYA;
// Khaya Lane scene. Sprites are original Blender renders. The veld, sky and UI motion are drawn here.
var DRAW = (function () {
  var SPRITE = 3.6;
  var img = {};
  var ready = false;
  var names = [
    "home1", "home2", "home3", "spaza1", "spaza2",
    "bed_empty", "bed_sown",
    "bed_maize_mid", "bed_maize_ready", "bed_spinach_mid", "bed_spinach_ready",
    "bed_tomato_mid", "bed_tomato_ready", "bed_aloe_mid", "bed_aloe_ready",
    "tank", "workshop", "solar", "jacaranda", "acacia", "aloeplant", "fence",
    "person0", "person1", "person2", "person3", "hen0", "hen1", "dog0", "dog1", "neighbour"
  ];
  var PATH = [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [4, 5], [4, 4], [4, 3]];

  function load(done) {
    var left = names.length;
    names.forEach(function (n) {
      var el = new Image();
      el.onload = el.onerror = function () {
        if (el.naturalWidth) img[n] = el;
        left -= 1;
        if (left === 0) { ready = true; if (done) done(); }
      };
      el.src = "assets/khaya/" + n + ".png";
    });
  }

  function north(x, y, o) { return KHAYA.cellNorth(x, y, o.ox, o.oy, o.tw, o.th); }

  function corners(x, y, w, h, o) {
    return { n: north(x, y, o), e: north(x + w, y, o), s: north(x + w, y + h, o), w: north(x, y + h, o) };
  }

  function mid(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  function layout(w, h) {
    var cols = KHAYA.COLS;
    var rows = KHAYA.ROWS;
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
    var plotW = (cols + rows) * tw / 2;
    var ox = (w - plotW) / 2 + rows * tw / 2;
    var oy = horizon + Math.max(th, (h - horizon - plotH) * 0.42);
    return { tw: tw, th: th, ox: ox, oy: oy, horizon: horizon };
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
    veld.addColorStop(0, "#c6a15a");
    veld.addColorStop(0.18, "#8eae55");
    veld.addColorStop(1, "#6d9448");
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
    var n;
    for (n = 0; n < 3; n++) {
      blit(ctx, img.neighbour, w * (0.18 + n * 0.28), hy + 6, o.tw * 1.15);
    }
  }

  function blit(ctx, image, cx, cy, tw, scale) {
    if (!image) return;
    var dw = tw * SPRITE * (scale || 1);
    ctx.drawImage(image, cx - dw / 2, cy - dw / 2, dw, dw);
  }

  function hash(x, y) {
    var n = (x * 17 + y * 31) % 5;
    return n < 0 ? n + 5 : n;
  }

  function ground(ctx, x, y, o) {
    var c = corners(x, y, 1, 1, o);
    var kind = KHAYA.terrainAt(x, y);
    var fill = kind === "path" ? "#e4c79a" : kind === "tree" ? "#6ea356" : (hash(x, y) % 4 === 0 ? "#74a85a" : "#7eb262");
    poly(ctx, [c.n, c.e, c.s, c.w], fill);
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

  function bedName(b, now) {
    var view = KHAYA.bedView(b, now);
    if (!view || view.phase === "empty") return "bed_empty";
    if (view.phase === "sown" || view.progress < 0.34) return "bed_sown";
    if (view.progress < 0.72) return "bed_" + b.crop + "_mid";
    return "bed_" + b.crop + "_ready";
  }

  function spriteName(b, now) {
    if (b.type === "home") return "home" + Math.max(1, Math.min(3, b.level));
    if (b.type === "spaza") return "spaza" + Math.max(1, Math.min(2, b.level));
    if (b.type === "bed") return bedName(b, now);
    return b.type === "tank" ? "tank" : b.type;
  }

  function centerOf(b, o) {
    var c = corners(b.x, b.y, b.w, b.h, o);
    return mid(c.n, c.s, 0.5);
  }

  function drawSprite(ctx, name, b, o, now, pop) {
    var p = centerOf(b, o);
    var sc = 1;
    if (pop && now - pop < 560) {
      var u = (now - pop) / 560;
      sc = 0.25 + u * 0.85;
      if (u > 0.72) sc = 1 + Math.sin((u - 0.72) / 0.28 * Math.PI) * 0.07;
    }
    ctx.save();
    if (sc !== 1) {
      ctx.translate(p.x, p.y);
      ctx.scale(sc, sc);
      ctx.translate(-p.x, -p.y);
    }
    blit(ctx, img[name], p.x, p.y, o.tw, 1);
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

  function life(ctx, o, now) {
    var spots = [
      { name: "person", offset: 0, scale: 0.72 },
      { name: "person", offset: 0.45, scale: 0.72 },
      { name: "hen", offset: 0.2, scale: 0.55, wobble: true },
      { name: "hen", offset: 0.7, scale: 0.5, wobble: true },
      { name: "dog", offset: 0.15, scale: 0.62 }
    ];
    var i;
    for (i = 0; i < spots.length; i++) {
      var s = spots[i];
      var u = ((now / 7000) + s.offset) % 1;
      var f = u * PATH.length;
      var a = Math.floor(f) % PATH.length;
      var b = (a + 1) % PATH.length;
      var k = f - Math.floor(f);
      var x = PATH[a][0] + (PATH[b][0] - PATH[a][0]) * k;
      var y = PATH[a][1] + (PATH[b][1] - PATH[a][1]) * k;
      if (s.name === "hen") {
        x = 5.4 + Math.sin(now / 900 + s.offset * 6) * 0.7;
        y = 4.2 + Math.cos(now / 1100 + s.offset) * 0.45;
      }
      if (s.name === "dog") {
        x = 2.3 + Math.sin(now / 1400) * 0.35;
        y = 4.15;
      }
      var n = north(x, y, o);
      var frame = Math.floor(now / 180 + s.offset * 8) % (s.name === "person" ? 4 : 2);
      var key = s.name + frame;
      blit(ctx, img[key], n.x, n.y + o.th * 0.35, o.tw, s.scale);
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
      var k;
      for (k = 0; k < 6; k++) {
        var ang = k / 6 * Math.PI * 2 + f.t;
        ctx.beginPath();
        ctx.arc(f.x + Math.cos(ang) * a * 26, f.y - 10 + Math.sin(ang) * a * 16, 3.2 * (1 - a), 0, 7);
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
    var o = layout(w, h);
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
      ground(ctx, x, y, o);
      if (KHAYA.terrainAt(x, y) === "tree") {
        var tree = hash(x, y) % 2 ? img.jacaranda : img.acacia;
        var n = north(x + 0.5, y + 0.5, o);
        blit(ctx, tree, n.x, n.y, o.tw, 1);
      }
    }
    var items = [];
    for (i = 0; i < state.buildings.length; i++) {
      var b = state.buildings[i];
      items.push({ k: b.x + b.y + 0.1, b: b });
    }
    items.sort(function (a, b) { return a.k - b.k; });
    for (i = 0; i < items.length; i++) {
      var building = items[i].b;
      drawSprite(ctx, spriteName(building, now), building, o, now, view.born && view.born[building.id]);
    }
    life(ctx, o, now);
    if (view.ghost) {
      var gok = KHAYA.canPlace(state, view.ghost.type, view.ghost.x, view.ghost.y).ok;
      var ghost = {
        type: view.ghost.type, x: view.ghost.x, y: view.ghost.y,
        w: KHAYA.BUILDINGS[view.ghost.type].w, h: KHAYA.BUILDINGS[view.ghost.type].h, level: 1
      };
      ctx.save();
      ctx.globalAlpha = 0.6;
      drawSprite(ctx, spriteName(ghost, now), ghost, o, now, 0);
      ctx.restore();
      ring(ctx, ghost.x, ghost.y, ghost.w, ghost.h, o, gok ? "#f2c14e" : "#d64545");
    }
    if (view.selected) ring(ctx, view.selected.x, view.selected.y, view.selected.w, view.selected.h, o, "#f2c14e");
    if (view.floats) floats(ctx, view.floats, now);
    return o;
  }

  return { load: load, render: render, layout: layout, ready: function () { return ready; } };
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

  return { crateStart: crateStart, marketStart: marketStart };
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
  var taskEl = document.getElementById("task");
  var resEl = document.getElementById("res");
  var notesEl = document.getElementById("notes");
  var toastEl = document.getElementById("toast");
  var placingEl = document.getElementById("placing");
  var q = new URLSearchParams(location.search);
  var tag = document.getElementById("buildTag");
  if (tag) tag.textContent = q.get("build") ? "build " + q.get("build") : "";

  var now0 = Date.now();
  var state = load() || KHAYA.fresh(now0);
  KHAYA.tick(state, now0);
  var selectedId = null;
  var ghost = null;
  var stopGame = null;
  var toastTimer = 0;
  var born = {};
  var floats = [];
  var muted = localStorage.getItem("eish-khaya-mute") === "1";
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
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 1600);
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
    var task = KHAYA.currentTask(state);
    taskEl.textContent = task.done ? task.text : "Next: " + task.text;
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
      var up = KHAYA.canUpgrade(state, b.id);
      var price = KHAYA.upgradeCost(state, b);
      if (price) {
        html += "<p class=\"fine\">" + costLine(price) + "</p>";
        html += "<button type=\"button\" class=\"hot\" data-do=\"upgrade\"" + (up.ok ? "" : " disabled") + ">Upgrade</button>";
        if (!up.ok) html += "<p class=\"fine\">" + up.reason + "</p>";
      } else html += "<p class=\"fine\">Fully built.</p>";
    }
    card.innerHTML = html;
  }

  function cellPoint(b) {
    var o = DRAW.layout(canvas.clientWidth, canvas.clientHeight);
    var n = KHAYA.cellNorth(b.x + b.w / 2, b.y + b.h / 2, o.ox, o.oy, o.tw, o.th);
    return { x: n.x, y: n.y };
  }

  function paint() {
    paintHud();
    paintCard();
    placingEl.hidden = !ghost;
    if (ghost) placingEl.textContent = "Placing " + KHAYA.BUILDINGS[ghost.type].name + " — tap the grass, or cancel";
    DRAW.render(canvas, state, { ghost: ghost, selected: selected(), born: born, floats: floats }, Date.now());
  }

  function act(result) {
    if (!result || !result.ok) {
      chime("no");
      toast(result && result.reason ? result.reason : "That did not work.");
      paint();
      return;
    }
    var focus = selected() || (result.id ? KHAYA.buildingById(state, result.id) : null);
    if (result.id) {
      born[result.id] = Date.now();
      chime("place");
    }
    if (result.level && focus) {
      born[focus.id] = Date.now();
      chime("place");
    }
    if (result.amount) {
      chime("harvest");
      if (focus) {
        var p = cellPoint(focus);
        floats.push({ x: p.x, y: p.y, t: Date.now(), text: "+" + result.amount + " " + result.crop, color: "#2f6d4f" });
      }
    } else if (result.notes) {
      chime("harvest");
      toast("+" + result.notes + " notes");
    } else if (result.xp) {
      chime("tap");
    }
    save();
    paint();
  }

  function openBuild() {
    var html = "";
    Object.keys(KHAYA.BUILDINGS).forEach(function (type) {
      var def = KHAYA.BUILDINGS[type];
      if (!def.cost) return;
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
    openModal("Play", "<p class=\"rules\">Two games on the lane. They pay notes and supplies once when you finish. Leaving early pays nothing. There is no fee and nothing to wager.</p><article class=\"build\"><h3>Crate Day</h3><p>Sort the harvest into the right crate before the bar runs out.</p><button type=\"button\" data-game=\"crate\">Play Crate Day</button></article><article class=\"build\"><h3>Spaza counter</h3><p>Match the customer’s slip, then hand it over.</p><button type=\"button\" data-game=\"market\">Open the counter</button></article>");
    modalBody.querySelectorAll("[data-game]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-game");
        modalTitle.textContent = kind === "crate" ? "Crate Day" : "Spaza counter";
        stopGame = kind === "crate" ? PLAY.crateStart(modalBody, finishGame) : PLAY.marketStart(modalBody, finishGame);
      });
    });
  }

  function openMore() {
    var list = KHAYA.tasks(state).map(function (t) {
      return "<li>" + (t.done ? "Done · " : "") + t.text + "</li>";
    }).join("");
    var sell = "";
    Object.keys(KHAYA.CROPS).forEach(function (k) {
      if (state.crops[k] > 0) sell += "<button type=\"button\" data-sell=\"" + k + "\">Sell 1 " + KHAYA.CROPS[k].name.toLowerCase() + " · " + KHAYA.CROPS[k].price + " notes</button>";
    });
    if (!sell) sell = "<p class=\"fine\">Harvest something, then sell it once a spaza is up.</p>";
    openModal("The lane", "<ul class=\"unlocks\">" + list + "</ul><div class=\"row\">" + sell + "</div><button type=\"button\" id=\"reset\">Reset neighbourhood</button>");
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

  canvas.addEventListener("pointerdown", function (ev) {
    if (!modal.hidden) return;
    var rect = canvas.getBoundingClientRect();
    var o = DRAW.layout(canvas.clientWidth, canvas.clientHeight);
    var cell = KHAYA.pickCell(ev.clientX - rect.left, ev.clientY - rect.top, o.ox, o.oy, o.tw, o.th);
    if (ghost) {
      ghost.x = cell.x;
      ghost.y = cell.y;
      var placed = KHAYA.place(state, ghost.type, cell.x, cell.y);
      if (placed.ok) {
        ghost = null;
        selectedId = placed.id;
      }
      act(placed);
      return;
    }
    var hit = KHAYA.occupied(state, cell.x, cell.y);
    selectedId = hit ? hit.id : null;
    paint();
  });

  card.addEventListener("click", function (ev) {
    var sow = ev.target.getAttribute && ev.target.getAttribute("data-sow");
    var todo = ev.target.getAttribute && ev.target.getAttribute("data-do");
    if (sow) act(KHAYA.sow(state, selectedId, sow));
    if (todo === "water") act(KHAYA.water(state, selectedId, Date.now()));
    if (todo === "harvest") act(KHAYA.harvest(state, selectedId, Date.now()));
    if (todo === "upgrade") act(KHAYA.upgrade(state, selectedId));
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

  if (!state.welcomed) {
    state.welcomed = true;
    save();
    openModal("Welcome to Khaya Lane", "<p class=\"rules\">This is your lane. Sow a bed, water it, and harvest. Place a spaza to sell the crop, upgrade the home, and try Crate Day or the spaza counter when you want. Notes, seeds, and timber stay on this device.</p><button type=\"button\" class=\"hot\" data-close>Start on the lane</button>");
  }

  var muteBtn = document.getElementById("mute");
  function paintMute() {
    if (!muteBtn) return;
    muteBtn.textContent = muted ? "Sound off" : "Sound";
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
  canvas.addEventListener("pointerdown", function () { ensureWind(); }, { once: true });

  var hudAt = 0;
  function frame() {
    var now = Date.now();
    if (now - hudAt > 350) {
      KHAYA.tick(state, now);
      paintHud();
      if (selected() && selected().type === "bed") paintCard();
      hudAt = now;
    }
    floats = floats.filter(function (f) { return now - f.t < 1000; });
    DRAW.render(canvas, state, { ghost: ghost, selected: selected(), born: born, floats: floats }, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(function () {});
}
DRAW.load(function () { paint(); });
window.__EISH_OK = true;
  var boot = document.getElementById("boot");
  if (boot) boot.hidden = true;
  paint();
  save();
})();
