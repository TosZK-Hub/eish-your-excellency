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
// Isometric neighbourhood. Original drawing, no external art.
var DRAW = (function () {
  var ink = "rgba(36, 44, 38, .38)";

  function north(x, y, o) {
    return KHAYA.cellNorth(x, y, o.ox, o.oy, o.tw, o.th);
  }

  function corners(x, y, w, h, o) {
    return {
      n: north(x, y, o),
      e: north(x + w, y, o),
      s: north(x + w, y + h, o),
      w: north(x, y + h, o)
    };
  }

  function poly(ctx, pts, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    var i;
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke !== false) {
      ctx.strokeStyle = stroke || ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
  }

  function lift(p, h) { return { x: p.x, y: p.y - h }; }

  function mid(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function prism(ctx, c, h, top, left, right) {
    poly(ctx, [c.w, c.s, lift(c.s, h), lift(c.w, h)], left);
    poly(ctx, [c.s, c.e, lift(c.e, h), lift(c.s, h)], right);
    poly(ctx, [lift(c.n, h), lift(c.e, h), lift(c.s, h), lift(c.w, h)], top);
  }

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function layout(w, h) {
    var cols = KHAYA.COLS;
    var rows = KHAYA.ROWS;
    var margin = Math.max(12, Math.min(w, h) * 0.04);
    var availW = Math.max(80, w - margin * 2);
    var availH = Math.max(80, h - margin * 2);
    var tw = availW / ((cols + rows) / 2);
    var th = tw * 0.5;
    var roof = th * 2.6;
    if ((cols + rows) * th / 2 + roof > availH) {
      var scale = availH / ((cols + rows) * th / 2 + roof);
      tw *= scale;
      th *= scale;
    }
    var plotW = (cols + rows) * tw / 2;
    var plotH = (cols + rows) * th / 2;
    var ox = (w - plotW) / 2 + rows * tw / 2;
    var oy = h - margin - (cols + rows) * th / 2;
    if (oy < th * 1.6) oy = th * 1.6;
    return { tw: tw, th: th, ox: ox, oy: oy };
  }

  function sky(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#f7d7ae");
    g.addColorStop(0.45, "#f3c49a");
    g.addColorStop(1, "#e7a57a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(232, 154, 112, .55)";
    ctx.beginPath();
    ctx.ellipse(w * 0.2, h * 0.42, w * 0.42, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(214, 122, 92, .35)";
    ctx.beginPath();
    ctx.ellipse(w * 0.78, h * 0.38, w * 0.36, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function hash(x, y) {
    var n = (x * 17 + y * 31) % 5;
    if (n < 0) n += 5;
    return n;
  }

  function ground(ctx, x, y, o) {
    var kind = KHAYA.terrainAt(x, y);
    var c = corners(x, y, 1, 1, o);
    var fill = kind === "path" ? "#e4c79a" : kind === "tree" ? "#6a9a52" : (hash(x, y) % 4 === 0 ? "#6fa858" : "#78b05e");
    poly(ctx, [c.n, c.e, c.s, c.w], fill, "rgba(70, 100, 55, .18)");
    if (kind === "path") {
      ctx.fillStyle = "rgba(160, 116, 70, .45)";
      var p1 = mid(c.n, c.s, 0.35);
      var p2 = mid(c.w, c.e, 0.62);
      ctx.beginPath();
      ctx.ellipse(p1.x, p1.y, o.tw * 0.06, o.th * 0.08, 0.4, 0, Math.PI * 2);
      ctx.ellipse(p2.x, p2.y, o.tw * 0.05, o.th * 0.06, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (hash(x, y) % 3 === 0) {
      var d = mid(c.n, c.s, 0.58);
      ctx.fillStyle = hash(x, y) % 2 ? "#e07a9a" : "#f2d36b";
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(2, o.tw * 0.045), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tree(ctx, x, y, o, now) {
    var c = corners(x, y, 1, 1, o);
    var base = mid(c.n, c.s, 0.5);
    var sway = Math.sin(now / 700 + x) * 2;
    prism(ctx, c, o.th * 0.35, "#8d5a32", "#a56b3c", "#6e4324");
    ctx.fillStyle = "#6b3f86";
    ctx.beginPath();
    ctx.ellipse(base.x + sway, base.y - o.th * 1.15, o.tw * 0.42, o.th * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a56a8";
    ctx.beginPath();
    ctx.ellipse(base.x - o.tw * 0.12 + sway, base.y - o.th * 1.35, o.tw * 0.28, o.th * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.stroke();
  }

  function soil(ctx, b, o, now) {
    var c = corners(b.x, b.y, 1, 1, o);
    var view = KHAYA.bedView(b, now);
    prism(ctx, c, o.th * 0.28, "#c9854a", "#a86b38", "#8d572c");
    var top = {
      n: lift(c.n, o.th * 0.28),
      e: lift(c.e, o.th * 0.28),
      s: lift(c.s, o.th * 0.28),
      w: lift(c.w, o.th * 0.28)
    };
    c = top;
    var inner = {
      n: mid(c.n, mid(c.n, c.s, 0.5), 0.22),
      e: mid(c.e, mid(c.n, c.s, 0.5), 0.22),
      s: mid(c.s, mid(c.n, c.s, 0.5), 0.18),
      w: mid(c.w, mid(c.n, c.s, 0.5), 0.22)
    };
    inner = {
      n: mid(c.n, c.s, 0.18),
      e: mid(c.e, mid(c.w, c.s, 0.5), 0.25),
      s: mid(c.s, c.n, 0.16),
      w: mid(c.w, mid(c.e, c.n, 0.5), 0.25)
    };
    poly(ctx, [
      mid(c.n, c.s, 0.22),
      mid(c.e, c.w, 0.72),
      mid(c.s, c.n, 0.18),
      mid(c.w, c.e, 0.72)
    ], view.phase === "empty" ? "#8d5b38" : "#6e4428", false);
    if (view.phase === "empty") {
      ctx.strokeStyle = "rgba(90,50,30,.35)";
      ctx.beginPath();
      ctx.moveTo(mid(c.w, c.e, 0.35).x, mid(c.w, c.e, 0.35).y);
      ctx.lineTo(mid(c.w, c.e, 0.65).x, mid(c.w, c.e, 0.65).y);
      ctx.stroke();
      return;
    }
    var center = mid(c.n, c.s, 0.5);
    var p = view.progress;
    var h = view.phase === "sown" ? 4 : 8 + p * o.th * 0.9;
    var sway = Math.sin(now / 380 + b.x) * 1.5;
    var leaf = view.crop === "tomato" ? "#d24b4b" : view.crop === "aloe" ? "#7dcea0" : view.crop === "spinach" ? "#3e9a4a" : "#e2b23a";
    var stalks = view.phase === "sown" ? 3 : 5;
    var i;
    for (i = 0; i < stalks; i++) {
      var fx = center.x + (i - 2) * o.tw * 0.08 + sway;
      var fy = center.y + ((i % 2) - 0.5) * o.th * 0.12;
      ctx.strokeStyle = "#3f6b32";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + sway, fy - h);
      ctx.stroke();
      ctx.fillStyle = leaf;
      ctx.beginPath();
      ctx.ellipse(fx + sway, fy - h, view.phase === "ready" ? 7 : 4.5, view.phase === "ready" ? 6 : 3.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (view.phase === "sown") {
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.font = "600 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("water", center.x, center.y - 8);
    }
  }

  function home(ctx, b, o) {
    var c = corners(b.x, b.y, 2, 2, o);
    var wall = o.th * 1.35;
    prism(ctx, c, wall, "#f4e2c8", "#f0d7b6", "#d7b48a");
    var roof = o.th * 0.9;
    var center = mid(c.n, c.s, 0.5);
    function eave(p) {
      return { x: center.x + (p.x - center.x) * 1.08, y: center.y + (p.y - center.y) * 1.08 - wall };
    }
    var peak = { x: center.x, y: center.y - wall - roof };
    poly(ctx, [eave(c.w), eave(c.n), peak], "#c4533c");
    poly(ctx, [eave(c.n), eave(c.e), peak], "#e07052");
    poly(ctx, [eave(c.e), eave(c.s), peak], "#b84734");
    poly(ctx, [eave(c.s), eave(c.w), peak], "#9c3b2c");
    var doorTop = lift(mid(c.s, c.e, 0.38), wall * 0.72);
    var doorBot = mid(c.s, c.e, 0.42);
    poly(ctx, [doorTop, mid(doorTop, lift(c.e, wall * 0.2), 0.35), mid(doorBot, c.e, 0.2), doorBot], b.level > 1 ? "#2f8f78" : "#8d5a32", false);
    var win = lift(mid(c.s, c.w, 0.45), wall * 0.62);
    poly(ctx, [win, mid(win, lift(c.s, wall * 0.4), 0.45), mid(c.s, c.w, 0.55), mid(c.s, c.w, 0.4)], "#f6e7b4", false);
    if (b.level >= 2) {
      ctx.fillStyle = "#e25b78";
      ctx.beginPath();
      ctx.arc(mid(c.w, c.s, 0.25).x, mid(c.w, c.s, 0.25).y - 4, 5, 0, Math.PI * 2);
      ctx.arc(mid(c.e, c.s, 0.3).x, mid(c.e, c.s, 0.3).y - 4, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (b.level >= 3) {
      var p = lift(mid(c.n, c.e, 0.45), wall + roof * 0.35);
      poly(ctx, [p, mid(p, lift(c.e, wall), 0.5), mid(p, lift(c.s, wall), 0.35), mid(p, lift(c.n, wall), 0.2)], "#3d7ea6", false);
    }
  }

  function spaza(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var h = o.th * 0.7;
    prism(ctx, c, h, "#f0d7a4", "#e2c48a", "#c9a56c");
    var lip = o.th * 0.42;
    poly(ctx, [lift(c.w, h), lift(c.n, h), lift(c.e, h), lift(mid(c.e, c.s, 0.35), h - lip), lift(c.s, h - lip)], "#2f8f78", false);
    poly(ctx, [lift(mid(c.w, c.n, 0.5), h), lift(mid(c.n, c.e, 0.5), h), lift(mid(c.e, c.s, 0.65), h - lip), lift(mid(c.s, c.w, 0.5), h - lip)], "#f4e4c4", false);
    var sign = lift(mid(c.n, c.s, 0.42), h + o.th * 0.35);
    ctx.fillStyle = "#243028";
    ctx.font = "700 " + Math.max(10, o.tw * 0.2) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPAZA", sign.x, sign.y);
    ctx.fillStyle = "#d4654a";
    var crate = mid(c.s, c.w, 0.35);
    ctx.beginPath();
    ctx.arc(crate.x, crate.y - 3, Math.max(3, o.tw * 0.06), 0, Math.PI * 2);
    ctx.fill();
    if (b.level > 1) {
      ctx.fillStyle = "#e2b23a";
      ctx.beginPath();
      ctx.arc(mid(c.s, c.e, 0.3).x, mid(c.s, c.e, 0.3).y - 4, Math.max(3, o.tw * 0.06), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tank(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var base = mid(c.n, c.s, 0.55);
    var rw = o.tw * 0.28;
    var rh = o.th * 0.22;
    var h = o.th * 0.95;
    ctx.fillStyle = "#3f8f64";
    ctx.beginPath();
    ctx.ellipse(base.x, base.y - h, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2f6d4f";
    ctx.fillRect(base.x - rw, base.y - h, rw * 2, h);
    ctx.fillStyle = "#3f8f64";
    ctx.beginPath();
    ctx.ellipse(base.x, base.y, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.fillStyle = "#d7b48a";
    ctx.fillRect(base.x + rw - 2, base.y - h * 0.45, 8, 4);
  }

  function workshop(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var h = o.th * 0.8;
    prism(ctx, c, h, "#e7c49a", "#d7ae7a", "#c49662");
    poly(ctx, [lift(c.n, h), lift(c.e, h), lift(mid(c.n, c.s, 0.5), h + o.th * 0.55)], "#a36b3c");
    poly(ctx, [lift(c.n, h), lift(c.w, h), lift(mid(c.n, c.s, 0.5), h + o.th * 0.55)], "#8a552c");
    ctx.fillStyle = "#f6e2a8";
    var win = lift(mid(c.s, c.e, 0.45), h * 0.45);
    ctx.fillRect(win.x - 6, win.y - 6, 12, 8);
  }

  function solar(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var post = mid(c.n, c.s, 0.5);
    ctx.strokeStyle = "#8d6a45";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(post.x, post.y);
    ctx.lineTo(post.x, post.y - o.th * 0.7);
    ctx.stroke();
    poly(ctx, [
      { x: post.x - o.tw * 0.28, y: post.y - o.th * 0.7 },
      { x: post.x + o.tw * 0.22, y: post.y - o.th * 0.95 },
      { x: post.x + o.tw * 0.28, y: post.y - o.th * 0.7 },
      { x: post.x - o.tw * 0.16, y: post.y - o.th * 0.5 }
    ], "#3d7ea6");
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(post.x, post.y - o.th * 0.78);
    ctx.lineTo(post.x + o.tw * 0.05, post.y - o.th * 0.62);
    ctx.stroke();
  }

  function building(ctx, b, o, now) {
    if (b.type === "bed") soil(ctx, b, o, now);
    else if (b.type === "home") home(ctx, b, o);
    else if (b.type === "spaza") spaza(ctx, b, o);
    else if (b.type === "tank") tank(ctx, b, o);
    else if (b.type === "workshop") workshop(ctx, b, o);
    else if (b.type === "solar") solar(ctx, b, o);
  }

  function footprintStroke(ctx, x, y, w, h, o, color) {
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
    sky(ctx, w, h);
    ctx.fillStyle = "#e7b07a";
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.62, w * 0.62, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    var o = layout(w, h);
    var shadow = corners(0, 0, KHAYA.COLS, KHAYA.ROWS, o);
    ctx.fillStyle = "rgba(90, 50, 30, .13)";
    ctx.beginPath();
    ctx.ellipse((shadow.n.x + shadow.s.x) / 2, (shadow.n.y + shadow.s.y) / 2 + 8, (shadow.e.x - shadow.w.x) * 0.48, o.th * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    var cells = [];
    var x, y;
    for (y = 0; y < KHAYA.ROWS; y++) {
      for (x = 0; x < KHAYA.COLS; x++) cells.push({ x: x, y: y, k: x + y });
    }
    cells.sort(function (a, b) { return a.k - b.k; });
    var i, kind, anchor;
    for (i = 0; i < cells.length; i++) {
      x = cells[i].x;
      y = cells[i].y;
      ground(ctx, x, y, o);
      kind = KHAYA.terrainAt(x, y);
      if (kind === "tree") tree(ctx, x, y, o, now);
      anchor = null;
      var bi;
      for (bi = 0; bi < state.buildings.length; bi++) {
        if (state.buildings[bi].x === x && state.buildings[bi].y === y) anchor = state.buildings[bi];
      }
      if (anchor) building(ctx, anchor, o, now);
    }
    if (view.ghost) {
      var gok = KHAYA.canPlace(state, view.ghost.type, view.ghost.x, view.ghost.y).ok;
      ctx.save();
      ctx.globalAlpha = 0.55;
      building(ctx, {
        type: view.ghost.type,
        x: view.ghost.x,
        y: view.ghost.y,
        w: KHAYA.BUILDINGS[view.ghost.type].w,
        h: KHAYA.BUILDINGS[view.ghost.type].h,
        level: 1,
        phase: "empty",
        crop: null
      }, o, now);
      ctx.restore();
      var def = KHAYA.BUILDINGS[view.ghost.type];
      footprintStroke(ctx, view.ghost.x, view.ghost.y, def.w, def.h, o, gok ? "#f2c14e" : "#d64545");
    }
    if (view.selected) {
      footprintStroke(ctx, view.selected.x, view.selected.y, view.selected.w, view.selected.h, o, "#f2c14e");
    }
    return o;
  }

  return { render: render, layout: layout };
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
    var round = { i: 0, correct: 0, left: 1.6, order: order, over: false, token: "crate-" + Date.now() + "-" + Math.floor(Math.random() * 1e6) };
    body.innerHTML = "<p class=\"rules\">Crate Day. A crop name lights up. Tap its crate before the bar runs out. Ten crops. No entry fee.</p><div class=\"meter\"><span id=\"crateBar\"></span></div><p id=\"crateShow\" class=\"show maize\">Maize</p><div class=\"crates\">" + CROPS.map(chip).join("") + "</div><p id=\"crateScore\" class=\"fine\">0 / 10</p>";
    var show = body.querySelector("#crateShow");
    var bar = body.querySelector("#crateBar");
    var score = body.querySelector("#crateScore");
    function present() {
      if (round.i >= round.order.length) return finish();
      round.left = 1.6;
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
    var last = performance.now();
    function frame(t) {
      if (round.over) return;
      var dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      round.left -= dt;
      bar.style.transform = "scaleX(" + Math.max(0, round.left / 1.6) + ")";
      if (round.left <= 0) answer("__timeout__");
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
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2200);
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
    notesEl.textContent = state.notes + " notes";
    var bits = [
      ["Seeds", state.seeds],
      ["Water", state.water],
      ["Timber", state.timber],
      ["Bricks", state.bricks]
    ];
    var crops = KHAYA.CROPS;
    Object.keys(crops).forEach(function (k) {
      if (state.crops[k] > 0) bits.push([crops[k].name, state.crops[k]]);
    });
    resEl.innerHTML = bits.map(function (b) {
      return "<span><small>" + b[0] + "</small>" + b[1] + "</span>";
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

  function paint() {
    paintHud();
    paintCard();
    placingEl.hidden = !ghost;
    if (ghost) placingEl.textContent = "Placing " + KHAYA.BUILDINGS[ghost.type].name + " — tap the lane, or cancel";
    DRAW.render(canvas, state, { ghost: ghost, selected: selected() }, Date.now());
  }

  function act(result) {
    if (!result || !result.ok) {
      toast(result && result.reason ? result.reason : "That did not work.");
      paint();
      return;
    }
    if (result.xp) toast("+" + result.xp + " skill");
    if (result.amount) toast("Picked " + result.amount + " " + KHAYA.CROPS[result.crop].name.toLowerCase());
    if (result.notes) toast("+" + result.notes + " notes");
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

  setInterval(function () {
    KHAYA.tick(state, Date.now());
    paint();
  }, 400);

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(function () {});
}
window.__EISH_OK = true;
  var boot = document.getElementById("boot");
  if (boot) boot.hidden = true;
  paint();
  save();
})();
