// EISH! Jozi Run — simulation only (no DOM). Fairness, modes, collision.
// Next iteration: tune GAP feel in worstGap(), verbs in CHUNKS, speeds in speedOf().
(function (root) {
  "use strict";
  var LANE_X = [-1.05, 0, 1.05];
  var JUMP_DUR = 0.58;
  var SLIDE_DUR = 0.56;
  var MODES = {
    run: { id: "run", name: "Jozi Run", blurb: "Endless street. One hit ends it.", timed: false },
    rush: { id: "rush", name: "Taxi Rush", blurb: "75 seconds to bank fares.", timed: true, seconds: 75 },
    robot: { id: "robot", name: "Green Robot", blurb: "Three strikes. Take the open robot.", timed: false }
  };

  function mulberry(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function laneX(i) { return LANE_X[clamp(i, 0, 2)]; }

  // verb per lane: null clear, low = jump, high = slide, block = change lane.
  // Every chunk is survivable from every lane (see worstGap). No three-blocks,
  // and never a low+high mix with no empty lane — that forces two verbs at once.
  var CHUNKS = [
    { id: "L", lanes: ["low", null, null], tier: 0 },
    { id: "C", lanes: [null, "low", null], tier: 0 },
    { id: "R", lanes: [null, null, "low"], tier: 0 },
    { id: "Hl", lanes: ["high", null, null], tier: 0 },
    { id: "Hc", lanes: [null, "high", null], tier: 0 },
    { id: "Hr", lanes: [null, null, "high"], tier: 0 },
    { id: "Bl", lanes: ["block", null, null], tier: 0 },
    { id: "Bc", lanes: [null, "block", null], tier: 0 },
    { id: "Br", lanes: [null, null, "block"], tier: 0 },
    { id: "La", lanes: ["low", "low", "low"], tier: 1 },
    { id: "Ha", lanes: ["high", "high", "high"], tier: 1 },
    { id: "LL", lanes: ["low", "low", null], tier: 1 },
    { id: "RR", lanes: [null, "low", "low"], tier: 1 },
    { id: "HH", lanes: ["high", null, "high"], tier: 1 },
    { id: "openC", lanes: ["block", null, "block"], tier: 1 },
    // Side-by-side blocks only when the open lane is between them.
    // A double block on one side would make the far runner cross a taxi.
    { id: "mix1", lanes: ["low", null, "block"], tier: 2 },
    { id: "mix2", lanes: ["block", null, "low"], tier: 2 },
    { id: "mix3", lanes: [null, "high", "block"], tier: 2 },
    { id: "mix4", lanes: ["block", "high", null], tier: 2 },
    { id: "mix5", lanes: ["low", "low", "block"], tier: 2 },
    { id: "mix6", lanes: ["block", "high", "high"], tier: 2 }
  ];

  var TUTORIAL = [
    { id: "t0", lanes: [null, null, "low"], tier: 0 },
    { id: "t1", lanes: ["high", null, null], tier: 0 },
    { id: "t2", lanes: [null, "low", null], tier: 0 }
  ];

  function chunkStats(ch) {
    var empty = 0, blocks = 0, verbs = {};
    for (var i = 0; i < 3; i++) {
      var v = ch.lanes[i];
      if (!v) empty++;
      else if (v === "block") blocks++;
      else verbs[v] = 1;
    }
    var keys = [];
    for (var k in verbs) if (verbs[k]) keys.push(k);
    return { empty: empty, blocks: blocks, verbs: keys, allLow: empty === 0 && blocks === 0 && keys.length === 1 && keys[0] === "low", allHigh: empty === 0 && blocks === 0 && keys.length === 1 && keys[0] === "high" };
  }

  // Seconds a prepared runner needs, worst starting lane, after the previous chunk.
  function planTime(lane, ch, prev) {
    var v = ch.lanes[lane];
    var recover = 0;
    if (prev && prev.allLow) recover = 0.46;
    else if (prev && prev.allHigh) recover = 0.28;
    if (!v) return 0.42 + recover * 0.35;
    if (v === "low") return 0.5 + (prev && prev.allHigh ? 0.32 : 0);
    if (v === "high") return 0.5 + (prev && prev.allLow ? 0.5 : 0);
    var best = 99;
    for (var i = 0; i < 3; i++) {
      if (i === lane || ch.lanes[i] === "block") continue;
      var t = 0.48 + Math.abs(i - lane) * 0.24 + recover;
      if (ch.lanes[i] === "low" || ch.lanes[i] === "high") t += 0.26;
      if (t < best) best = t;
    }
    return best;
  }

  function worstGap(prev, ch) {
    var need = 0.48;
    for (var lane = 0; lane < 3; lane++) need = Math.max(need, planTime(lane, ch, prev));
    var st = chunkStats(ch);
    if (st.blocks === 3) return 99;
    if (st.empty === 0 && st.verbs.length > 1) return 99;
    return need;
  }

  function speedOf(s) {
    if (s.mode === "rush") return 15 + Math.min(6.5, s.t * 0.09);
    if (s.mode === "robot") return 14.5 + Math.min(6, s.travel / 220);
    return 14 + Math.min(13, s.travel / 95);
  }

  function gapMetres(s, ch) {
    var need = worstGap(s.prevChunk, ch);
    var ease = s.mode === "robot" ? 1.12 : s.mode === "rush" ? 1.02 : 1;
    ease *= Math.max(0.86, 1 - Math.min(0.1, s.travel / 5000));
    return Math.max(13, s.speed * need * ease);
  }

  function create(mode, seed) {
    if (!MODES[mode]) mode = "run";
    var rng = mulberry((seed == null ? 1 : seed) >>> 0);
    var s = {
      mode: mode,
      seed: seed >>> 0,
      rng: rng,
      t: 0,
      travel: 0,
      dist: 0,
      speed: 14,
      score: 0,
      coins: 0,
      fares: 0,
      routes: 0,
      streak: 0,
      strikes: 0,
      shield: false,
      magnet: 0,
      alive: true,
      finished: false,
      win: false,
      reason: "",
      timeLeft: mode === "rush" ? MODES.rush.seconds : 0,
      lane: 1,
      x: 0,
      y: 0,
      air: 0,
      slide: 0,
      invuln: 0,
      hitstun: 0,
      phase: 0,
      queued: 0,
      ents: [],
      cursor: 50,
      nextGate: 72,
      prevChunk: null,
      tut: 0,
      placed: 0,
      events: [],
      seq: 1
    };
    s.speed = speedOf(s);
    return s;
  }

  function pushEnt(s, e) {
    e.id = s.seq++;
    e.dead = false;
    e.resolved = false;
    e.near = false;
    s.ents.push(e);
  }

  function placeChunk(s, z, ch) {
    var variantRoll = s.rng();
    for (var i = 0; i < 3; i++) {
      var v = ch.lanes[i];
      if (!v) continue;
      var variant = 0;
      if (v === "low") variant = variantRoll < 0.55 ? 0 : variantRoll < 0.82 ? 1 : 2;
      else if (v === "high") variant = variantRoll < 0.4 ? 0 : variantRoll < 0.75 ? 1 : 2;
      else variant = variantRoll < 0.72 ? 0 : 1;
      pushEnt(s, { kind: "obs", lane: i, x: laneX(i), z: z, y: 0, verb: v, variant: variant });
    }
    // Coins lead the obstacle so they read as a path, never inside a block.
    for (var c = 0; c < 3; c++) {
      var lane = c;
      var verb = ch.lanes[lane];
      if (verb === "block") continue;
      if (s.rng() > (verb ? 0.72 : 0.55)) continue;
      var air = verb === "low";
      var n = air ? 1 : 3;
      for (var k = 0; k < n; k++) {
        pushEnt(s, {
          kind: "coin",
          lane: lane,
          x: laneX(lane),
          z: z - 7.2 - k * 1.45,
          y: air ? 1.5 : 0.2,
          verb: null,
          variant: 0
        });
      }
    }
    if (s.mode === "rush") {
      for (var f = 0; f < 3; f++) {
        if (ch.lanes[f]) continue;
        if (s.rng() > 0.62) continue;
        pushEnt(s, { kind: "fare", lane: f, x: laneX(f), z: z - 5.4, y: 0, verb: null, variant: (s.rng() * 3) | 0 });
        break;
      }
    }
    if ((s.mode === "run" || s.mode === "robot") && !s.shield && s.travel > 40 && s.rng() < 0.16) {
      for (var g = 0; g < 3; g++) {
        if (ch.lanes[g]) continue;
        pushEnt(s, { kind: "shield", lane: g, x: laneX(g), z: z - 6, y: 0.9, verb: null, variant: 0 });
        break;
      }
    } else if (s.rng() < 0.07 && s.travel > 80) {
      for (var m = 0; m < 3; m++) {
        if (ch.lanes[m] === "block") continue;
        pushEnt(s, { kind: "kota", lane: m, x: laneX(m), z: z - 6.5, y: 0.35, verb: null, variant: 0 });
        break;
      }
    }
    s.prevChunk = chunkStats(ch);
    s.prevChunk.id = ch.id;
    s.placed++;
    if (s.tut < TUTORIAL.length && ch === TUTORIAL[s.tut]) s.tut++;
  }

  function placePocket(s, z) {
    var a = (s.rng() * 3) | 0;
    var b = (a + 1 + ((s.rng() * 2) | 0)) % 3;
    pushEnt(s, { kind: "fare", lane: a, x: laneX(a), z: z, y: 0, verb: null, variant: (s.rng() * 3) | 0 });
    if (s.rng() < 0.65) pushEnt(s, { kind: "fare", lane: b, x: laneX(b), z: z + 1.2, y: 0, verb: null, variant: (s.rng() * 3) | 0 });
    for (var k = 0; k < 4; k++) {
      pushEnt(s, { kind: "coin", lane: a, x: laneX(a), z: z - 3 - k * 1.3, y: 0.2, verb: null, variant: 0 });
    }
    s.prevChunk = { empty: 3, blocks: 0, verbs: [], allLow: false, allHigh: false, id: "pocket" };
  }

  function placeGate(s, z) {
    var lane = (s.rng() * 3) | 0;
    if (s.lastGate === lane && s.rng() < 0.7) lane = (lane + 1 + ((s.rng() * 2) | 0)) % 3;
    s.lastGate = lane;
    var colours = ["#e23d3d", "#f0c14d", "#1fa971"];
    pushEnt(s, { kind: "gate", lane: lane, x: laneX(lane), z: z, y: 0, verb: "boom", variant: lane, colour: colours[lane] });
    s.prevChunk = null;
  }

  function pickChunk(s) {
    if (s.tut < TUTORIAL.length && s.mode !== "rush") {
      return TUTORIAL[s.tut];
    }
    var pool = [];
    var i;
    for (i = 0; i < CHUNKS.length; i++) {
      var ch = CHUNKS[i];
      if (s.mode === "robot" && (ch.tier > 1 || ch.lanes.indexOf("block") >= 0)) continue;
      if (s.travel < 140 && ch.tier > 0) continue;
      if (s.travel < 360 && ch.tier > 1) continue;
      if (s.prevChunk && s.prevChunk.id === ch.id) continue;
      if (worstGap(s.prevChunk, ch) >= 90) continue;
      pool.push(ch);
    }
    if (!pool.length) pool = [CHUNKS[1], CHUNKS[4]];
    return pool[(s.rng() * pool.length) | 0];
  }

  function spawn(s) {
    var horizon = s.travel + 82;
    var guard = 0;
    while (s.cursor < horizon && guard++ < 24) {
      if (s.mode === "robot" && s.cursor > s.nextGate - 28) {
        var gateZ = Math.max(s.cursor + gapMetres(s, { lanes: [null, null, null] }), s.nextGate);
        // Keep a clean run-up so the banner is not sharing space with a hurdle.
        if (s.cursor < gateZ - 20) {
          var early = pickChunk(s);
          var g0 = gapMetres(s, early);
          if (s.cursor + g0 < gateZ - 22) {
            s.cursor += g0;
            placeChunk(s, s.cursor, early);
            s.cursor += 7;
            continue;
          }
        }
        s.cursor = gateZ;
        placeGate(s, s.cursor);
        s.cursor += 16;
        s.nextGate = s.cursor + 48 + (s.rng() * 12);
        continue;
      }
      if (s.mode === "rush" && s.rng() < 0.42 && s.placed > 0) {
        s.cursor += Math.max(12, s.speed * 0.55);
        placePocket(s, s.cursor);
        s.cursor += 8;
        continue;
      }
      var ch = pickChunk(s);
      s.cursor += gapMetres(s, ch);
      placeChunk(s, s.cursor, ch);
      s.cursor += 6.5;
    }
  }

  function tryJump(s) {
    if (s.air > 0 || s.slide > 0) return;
    s.air = 0.001;
    s.events.push("jump");
  }
  function trySlide(s) {
    if (s.air > 0 || s.slide > 0) return;
    s.slide = 0.001;
    s.events.push("slide");
  }
  function queueLane(s, dir) {
    if (!dir) return;
    var next = s.lane + (dir > 0 ? 1 : -1);
    if (next < 0 || next > 2) return;
    if (Math.abs(s.x - laneX(s.lane)) > 0.16) {
      s.queued = dir > 0 ? 1 : -1;
      return;
    }
    s.lane = next;
    s.queued = 0;
    s.events.push("lane");
  }

  function updateBody(s, dt) {
    if (s.queued && Math.abs(s.x - laneX(s.lane)) < 0.1) {
      var dir = s.queued;
      s.queued = 0;
      queueLane(s, dir);
    }
    var target = laneX(s.lane);
    s.x += (target - s.x) * (1 - Math.exp(-14 * dt));
    if (s.air > 0) {
      s.air += dt;
      if (s.air >= JUMP_DUR) { s.air = 0; s.y = 0; }
      else s.y = Math.sin((s.air / JUMP_DUR) * Math.PI) * 1.68;
    } else s.y = 0;
    if (s.slide > 0) {
      s.slide += dt;
      if (s.slide >= SLIDE_DUR) s.slide = 0;
    }
    if (s.invuln > 0) s.invuln -= dt;
    if (s.hitstun > 0) s.hitstun -= dt;
    if (s.magnet > 0) s.magnet -= dt;
    var cadence = 11 * (0.82 + s.speed / 48);
    if (s.slide > 0) cadence = 0;
    s.phase += dt * cadence;
  }

  function collect(s, e, kind) {
    e.dead = true;
    if (kind === "coin") {
      s.coins++;
      s.score += 10;
      s.events.push("coin");
    } else if (kind === "fare") {
      s.fares++;
      s.score += 40;
      s.events.push("fare");
    } else if (kind === "shield") {
      s.shield = true;
      s.score += 15;
      s.events.push("shield");
    } else if (kind === "kota") {
      s.magnet = 5.2;
      s.score += 25;
      s.events.push("kota");
    }
  }

  function wipe(s, reason) {
    s.alive = false;
    s.finished = true;
    s.win = false;
    s.reason = reason;
    s.events.push("die");
  }

  function hurt(s, e) {
    e.dead = true;
    if (s.shield) {
      s.shield = false;
      s.invuln = 1.25;
      s.hitstun = 0.28;
      s.air = 0;
      s.y = 0;
      s.slide = 0;
      s.events.push("shieldbreak");
      return;
    }
    if (s.mode === "rush") {
      s.timeLeft = Math.max(0, s.timeLeft - 7);
      s.fares = Math.max(0, s.fares - 1);
      s.score = Math.max(0, s.score - 20);
      s.invuln = 1.15;
      s.hitstun = 0.34;
      s.air = 0;
      s.y = 0;
      s.slide = 0;
      s.events.push("crash");
      if (s.timeLeft <= 0) {
        s.alive = false;
        s.finished = true;
        s.win = false;
        s.reason = "time";
        s.events.push("finish");
      }
      return;
    }
    wipe(s, "hit");
  }

  function collide(s) {
    var i, e, ahead, half;
    for (i = 0; i < s.ents.length; i++) {
      e = s.ents[i];
      if (e.dead || e.resolved) continue;
      ahead = e.z - s.travel;
      if (e.kind === "coin" || e.kind === "fare" || e.kind === "shield" || e.kind === "kota") {
        if (ahead < 1.15 && ahead > -0.35 && Math.abs(s.x - e.x) < 0.56) {
          if (e.y > 1) { if (s.y > 0.9) collect(s, e, e.kind); }
          else collect(s, e, e.kind);
        }
        continue;
      }
      if (e.kind === "gate") {
        if (ahead > 0.45 || ahead < -0.25) continue;
        e.resolved = true;
        var pl = 0;
        var best = 99;
        for (var li = 0; li < 3; li++) {
          var dx = Math.abs(s.x - laneX(li));
          if (dx < best) { best = dx; pl = li; }
        }
        if (pl === e.lane) {
          s.streak = Math.min(8, s.streak + 1);
          s.routes++;
          s.score += 30 * Math.min(5, s.streak);
          s.events.push("gate");
        } else {
          s.streak = 0;
          s.strikes++;
          s.invuln = 1.15;
          s.hitstun = 0.36;
          s.air = 0;
          s.y = 0;
          s.events.push("strike");
          if (s.strikes >= 3) wipe(s, "strikes");
        }
        continue;
      }
      var front = e.verb === "block" ? 1.25 : 0.8;
      var back = e.verb === "block" ? -0.55 : -0.42;
      if (ahead > front || ahead < back) continue;
      half = e.verb === "block" ? 0.5 : 0.46;
      var adx = Math.abs(s.x - e.x);
      if (adx > half) {
        if (!e.near && adx < half + 0.32 && ahead < 0.45 && ahead > -0.2) {
          e.near = true;
          s.score += 5;
          s.events.push("near");
        }
        continue;
      }
      if (s.invuln > 0) { e.dead = true; continue; }
      if (e.verb === "low") {
        if (s.y > 0.8) { e.dead = true; continue; }
        hurt(s, e);
      } else if (e.verb === "high") {
        if (s.slide > 0.04 && s.slide < SLIDE_DUR - 0.03 && s.y < 0.25) { e.dead = true; continue; }
        hurt(s, e);
      } else hurt(s, e);
      if (!s.alive) return;
    }
  }

  function magnetPull(s, dt) {
    if (s.magnet <= 0) return;
    for (var i = 0; i < s.ents.length; i++) {
      var e = s.ents[i];
      if (e.dead || e.kind !== "coin") continue;
      var ahead = e.z - s.travel;
      if (ahead < -0.5 || ahead > 9) continue;
      e.x += (s.x - e.x) * (1 - Math.exp(-7 * dt));
      e.z += (s.travel - e.z) * (1 - Math.exp(-3.2 * dt));
    }
  }

  function step(s, dt, input) {
    if (!s.alive || s.finished) return s;
    dt = dt > 0.05 ? 0.05 : dt < 0 ? 0 : dt;
    s.events.length = 0;
    s.t += dt;
    s.speed = speedOf(s);
    var moving = s.hitstun > 0 ? s.speed * 0.42 : s.speed;
    s.travel += moving * dt;
    s.dist = s.travel;
    s.score += moving * dt * (s.mode === "rush" ? 0.45 : 1);
    if (s.mode === "rush") {
      s.timeLeft -= dt;
      if (s.timeLeft <= 0.0008) {
        s.timeLeft = 0;
        s.alive = false;
        s.finished = true;
        s.win = true;
        s.reason = "time";
        s.events.push("finish");
        return s;
      }
    }
    input = input || {};
    if (input.jump) tryJump(s);
    if (input.slide) trySlide(s);
    if (input.lane) queueLane(s, input.lane);
    updateBody(s, dt);
    spawn(s);
    magnetPull(s, dt);
    collide(s);
    if (s.ents.length > 80) {
      var keep = [];
      for (var i = 0; i < s.ents.length; i++) if (s.ents[i].z > s.travel - 6) keep.push(s.ents[i]);
      s.ents = keep;
    } else {
      var w = 0;
      for (var j = 0; j < s.ents.length; j++) if (s.ents[j].z > s.travel - 6) s.ents[w++] = s.ents[j];
      s.ents.length = w;
    }
    return s;
  }

  function physicalLane(s) {
    var best = s.lane, bestD = 99;
    for (var i = 0; i < 3; i++) {
      var d = Math.abs(s.x - laneX(i));
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function nextObs(threats, lane, z0, z1) {
    var best = null;
    for (var i = 0; i < threats.length; i++) {
      var o = threats[i];
      if (o.kind !== "obs" || o.lane !== lane || o.z < z0 || o.z > z1) continue;
      if (!best || o.z < best.z) best = o;
    }
    return best;
  }

  // Nearest threat only. Never swerves into a hurdle it cannot jump or slide in time.
  // Used by the fairness sim and ?bot=1.
  function oracle(s) {
    var input = { lane: 0, jump: false, slide: false };
    if (!s.alive || s.finished) return input;
    var speed = Math.max(8, s.speed);
    var look = speed * 1.4;
    var threats = [];
    var gate = null;
    for (var i = 0; i < s.ents.length; i++) {
      var e = s.ents[i];
      var ahead = e.z - s.travel;
      if (ahead < -0.35 || ahead > look + 8) continue;
      if (e.kind === "gate" && !e.resolved) {
        if (!gate || e.z < gate.z) gate = e;
      } else if (e.kind === "obs" && !e.dead) threats.push(e);
    }
    var body = physicalLane(s);
    var bodyNext = nextObs(threats, body, s.travel - 0.2, s.travel + look);
    if (body !== s.lane && bodyNext && (bodyNext.verb === "low" || bodyNext.verb === "high")) {
      var tBody = (bodyNext.z - s.travel) / speed;
      if (tBody < 0.52 && tBody > 0.1) {
        if (bodyNext.verb === "low") input.jump = true;
        else input.slide = true;
        return input;
      }
    }
    var logicalNext = nextObs(threats, s.lane, s.travel - 0.2, s.travel + look);
    var target = s.lane;
    var reasonZ = s.travel + look;
    if (logicalNext && logicalNext.verb === "block") {
      target = -1;
      reasonZ = logicalNext.z;
    }
    if (gate && gate.z <= reasonZ && gate.z - s.travel < speed * 1.12) {
      target = gate.lane;
      reasonZ = gate.z;
    }
    if (target === -1) {
      var best = -1, bestCost = 99;
      for (var li = 0; li < 3; li++) {
        if (li === s.lane) continue;
        var step = li > s.lane ? 1 : -1;
        var cross = false;
        for (var p = s.lane + step; step > 0 ? p < li : p > li; p += step) {
          var mid = nextObs(threats, p, reasonZ - 1.4, reasonZ + 1.5);
          if (mid && mid.verb === "block") cross = true;
        }
        if (cross) continue;
        var dest = nextObs(threats, li, s.travel, reasonZ + speed * 0.7);
        if (dest && dest.verb === "block") continue;
        var cost = Math.abs(li - s.lane) * 2;
        if (dest && (dest.verb === "low" || dest.verb === "high")) {
          var arrive = Math.abs(li - body) * 0.22 + 0.12;
          var t = (dest.z - s.travel) / speed;
          if (t < arrive + 0.34) cost += 40;
          else cost += 1;
        }
        if (cost < bestCost) { bestCost = cost; best = li; }
      }
      target = best < 0 ? s.lane : best;
    }
    if (target !== s.lane) {
      var destNext = nextObs(threats, target, s.travel, reasonZ + 1.5);
      if (destNext && destNext.verb !== "block") {
        var td = (destNext.z - s.travel) / speed;
        var need = Math.abs(target - body) * 0.22 + 0.4;
        var currentBad = logicalNext && logicalNext.verb === "block" && logicalNext.z <= destNext.z + 0.8;
        if (td < need && !currentBad) target = s.lane;
      }
      if (target !== s.lane && Math.abs(target - s.lane) === 2) {
        var midObs = nextObs(threats, 1, s.travel, s.travel + speed * 0.75);
        var blockedHere = logicalNext && logicalNext.verb === "block" && (!midObs || logicalNext.z <= midObs.z + 0.5);
        if (midObs && !blockedHere) target = s.lane;
      }
      if (target !== s.lane) input.lane = target > s.lane ? 1 : -1;
      return input;
    }
    if (logicalNext && logicalNext.verb === "low") {
      var tHit = (logicalNext.z - s.travel) / speed;
      if (tHit < 0.45 && tHit > 0.14) input.jump = true;
    } else if (logicalNext && logicalNext.verb === "high") {
      var tSlide = (logicalNext.z - s.travel) / speed;
      if (tSlide < 0.48 && tSlide > 0.13) input.slide = true;
    }
    return input;
  }

  root.EISH = {
    MODES: MODES,
    LANE_X: LANE_X,
    JUMP_DUR: JUMP_DUR,
    SLIDE_DUR: SLIDE_DUR,
    CHUNKS: CHUNKS,
    create: create,
    step: step,
    oracle: oracle,
    worstGap: worstGap,
    chunkStats: chunkStats,
    laneX: laneX,
    speedOf: speedOf
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
// EISH! Jozi Run — volumetric cast and props.
// Three.js meshes with a joint rig (hips, spine, shoulders, elbows, hips, knees).
// +rotation.x on a limb swings it toward -Z, which is forward down the street.
// Next pass: tune cycle amplitudes in poseRun() and the CAST colours.
(function (root) {
  "use strict";
  function three() { return root.THREE; }

  var CAST = [
    {
      id: "lerato", name: "Lerato", place: "Braamfontein",
      line: "Teal tracksuit, coral bun. She takes the jump before the rank fills.",
      skin: "#c4845c", skinDeep: "#8d5340",
      hair: "#1b140f", band: "#ff6b4a",
      cloth: "#14988e", clothDeep: "#0c645e",
      accent: "#ff6b4a", pants: "#173632", shoe: "#f4f1ea", kick: "#ff6b4a",
      style: "bun", bob: 1.12, arm: 1.05, lean: 0.16
    },
    {
      id: "jabu", name: "Jabu", place: "Yeoville",
      line: "Red golf shirt, khaki shorts. He slips the gap between the minibuses.",
      skin: "#e0aa78", skinDeep: "#b67c4c",
      hair: "#16120e", band: "#f7f4ee",
      cloth: "#d4534a", clothDeep: "#9a302c",
      accent: "#f7f4ee", pants: "#c6a15a", shoe: "#f7f4ee", kick: "#d4534a",
      style: "fade", bob: 0.82, arm: 0.88, lean: 0.1
    },
    {
      id: "naledi", name: "Naledi", place: "Maboneng",
      line: "A sun on her jacket, beads in her twists. She runs the streets she paints.",
      skin: "#6e3e2e", skinDeep: "#4a271e",
      hair: "#140e0c", band: "#f0c14d",
      cloth: "#2d439e", clothDeep: "#1c2d74",
      accent: "#ffb703", pants: "#e2a12b", shoe: "#ff5d8f", kick: "#fffaf2",
      style: "twists", bob: 1.0, arm: 1.18, lean: 0.12,
      beads: ["#c46bdc", "#ffb703", "#ff6b4a", "#49c2b0"]
    }
  ];

  var GEO = {};
  function T() { return three(); }
  function geoCapsule(r, len) {
    var key = "c" + r + ":" + len;
    if (!GEO[key]) GEO[key] = new (T()).CapsuleGeometry(r, Math.max(0.02, len), 4, 8);
    return GEO[key];
  }
  function geoSphere(r, w, h) {
    var key = "s" + r + ":" + (w || 16) + ":" + (h || 12);
    if (!GEO[key]) GEO[key] = new (T()).SphereGeometry(r, w || 16, h || 12);
    return GEO[key];
  }
  function geoBox(x, y, z) {
    var key = "b" + x + ":" + y + ":" + z;
    if (!GEO[key]) GEO[key] = new (T()).BoxGeometry(x, y, z);
    return GEO[key];
  }
  var MAT = {};
  function mat(color, rough, metal, extra) {
    var key = color + ":" + rough + ":" + metal + ":" + (extra || "");
    if (!MAT[key]) {
      var opt = { color: color, roughness: rough, metalness: metal };
      if (extra === "skin") opt.emissive = color, opt.emissiveIntensity = 0.035;
      MAT[key] = new (T()).MeshStandardMaterial(opt);
    }
    return MAT[key];
  }
  function glassMat() {
    if (!MAT.glass) {
      MAT.glass = new (T()).MeshStandardMaterial({
        color: "#1c2838", roughness: 0.15, metalness: 0.6,
        transparent: true, opacity: 0.72
      });
    }
    return MAT.glass;
  }
  function add(parent, geometry, material, x, y, z) {
    var mesh = new (T()).Mesh(geometry, material);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function pivot(parent, x, y, z) {
    var g = new (T()).Group();
    g.position.set(x || 0, y || 0, z || 0);
    parent.add(g);
    return g;
  }
  function limb(parent, len, radius, material) {
    var mesh = add(parent, geoCapsule(radius, Math.max(0.02, len - radius * 2)), material, 0, -len * 0.5, 0);
    return mesh;
  }

  function torsoGeo(who) {
    var key = "torso" + who;
    if (GEO[key]) return GEO[key];
    var hip = who === 1 ? 0.145 : 0.132;
    var waist = who === 1 ? 0.118 : 0.1;
    var chest = who === 1 ? 0.155 : who === 2 ? 0.132 : 0.128;
    var height = 0.46;
    var pts = [];
    var i;
    for (i = 0; i <= 12; i++) {
      var t = i / 12;
      var y = -0.02 + t * height;
      var r;
      if (t < 0.42) r = hip + (waist - hip) * (t / 0.42);
      else r = waist + (chest - waist) * ((t - 0.42) / 0.58);
      var ease = Math.sin(t * Math.PI);
      r *= 0.92 + 0.08 * ease;
      pts.push(new (T()).Vector2(Math.max(0.06, r), y));
    }
    GEO[key] = new (T()).LatheGeometry(pts, 18);
    return GEO[key];
  }

  function buildRunner(index) {
    var THREE = T();
    var c = CAST[index];
    var skin = mat(c.skin, 0.58, 0.02, "skin");
    var cloth = mat(c.cloth, 0.72, 0.04);
    var clothD = mat(c.clothDeep, 0.78, 0.03);
    var pants = mat(c.pants, 0.74, 0.02);
    var hair = mat(c.hair, 0.8, 0.04);
    var shoe = mat(c.shoe, 0.45, 0.08);
    var kick = mat(c.kick, 0.4, 0.12);
    var accent = mat(c.accent, 0.5, 0.08);
    var gold = mat("#f0c14d", 0.28, 0.85);
    var root = new THREE.Group();
    root.name = c.id;

    var hips = pivot(root, 0, 0.92, 0);
    var torso = add(hips, torsoGeo(index), cloth, 0, 0, 0);
    torso.castShadow = true;

    var stripe = add(hips, geoBox(0.18, 0.04, 0.03), accent, 0, c.style === "fade" ? 0.36 : 0.22, -0.12);
    stripe.castShadow = false;
    if (c.style === "fade") {
      add(hips, geoCapsule(0.018, 0.1), accent, -0.16, 0.28, 0);
      add(hips, geoCapsule(0.018, 0.1), accent, 0.16, 0.28, 0);
    } else if (c.style === "twists") {
      var sun = add(hips, geoSphere(0.055, 16, 12), accent, 0, 0.24, -0.115);
      sun.scale.z = 0.45;
      add(hips, geoSphere(0.022, 10, 8), mat("#fff6d0", 0.4, 0.05), -0.012, 0.25, -0.132);
    }

    var neck = pivot(hips, 0, 0.46, 0);
    limb(neck, 0.08, 0.055, skin);
    var headP = pivot(neck, 0, 0.1, 0);
    var skull = add(headP, geoSphere(0.145, 24, 18), skin, 0, 0.02, 0);
    skull.scale.set(1, 1.06, 0.98);

    function eye(x) {
      var dir = new THREE.Vector3(x, 0.035, -1).normalize().multiplyScalar(0.15);
      var g = pivot(headP, dir.x, 0.02 + dir.y, dir.z);
      var white = add(g, geoSphere(0.038, 16, 12), mat("#f7f4ee", 0.28, 0.02), 0, 0, 0);
      white.scale.z = 0.55;
      var iris = add(g, geoSphere(0.02, 12, 10), mat("#3a2418", 0.35, 0.04), 0, 0, -0.012);
      add(g, geoSphere(0.01, 10, 8), mat("#120c0a", 0.3, 0.05), 0, 0, -0.02);
      var catchL = add(g, geoSphere(0.007, 8, 6), mat("#ffffff", 0.15, 0), -0.008, 0.01, -0.024);
      catchL.castShadow = false;
      return { group: g, white: white, iris: iris };
    }
    var eyeL = eye(-0.048);
    var eyeR = eye(0.05);
    function brow(x, tilt) {
      var b = add(headP, geoCapsule(0.011, 0.045), hair, x, 0.105, -0.125);
      b.rotation.z = tilt;
    }
    brow(-0.05, c.style === "fade" ? 0.2 : -0.4);
    brow(0.052, c.style === "fade" ? -0.08 : 0.45);
    var nose = add(headP, geoSphere(0.026, 12, 10), skin, 0, -0.01, -0.155);
    nose.scale.set(c.style === "fade" ? 1.1 : 0.8, 0.65, 0.7);
    var mouth = add(headP, new THREE.TorusGeometry(0.03, 0.007, 8, 16, Math.PI), mat(c.style === "twists" ? "#8d4038" : "#b15d62", 0.45, 0.02), 0, -0.062, -0.145);
    mouth.rotation.z = Math.PI;
    mouth.rotation.x = 0.2;
    add(headP, geoSphere(0.028, 10, 8), mat(c.skin, 0.5, 0), -0.055, -0.01, -0.08).scale.set(1, 0.55, 0.4);
    add(headP, geoSphere(0.028, 10, 8), mat(c.skin, 0.5, 0), 0.058, -0.01, -0.08).scale.set(1, 0.55, 0.4);
    // ears
    add(headP, geoSphere(0.04, 12, 10), skin, -0.14, 0.0, 0.01).scale.set(0.45, 0.7, 0.55);
    add(headP, geoSphere(0.04, 12, 10), skin, 0.145, 0.0, 0.01).scale.set(0.45, 0.7, 0.55);
    if (c.style !== "fade") add(headP, geoSphere(0.018, 10, 8), gold, c.style === "bun" ? -0.155 : 0.16, -0.02, -0.02);
    if (c.style === "twists") {
      var paint = add(headP, geoSphere(0.02, 8, 6), mat("#49c2b0", 0.5, 0.02), 0.07, -0.02, -0.11);
      paint.scale.set(1.4, 0.5, 0.3);
    }

    // Hair sits behind and above the face so the eyes stay visible from the front.
    if (c.style === "bun") {
      var bun = add(headP, geoSphere(0.085, 16, 12), hair, 0.0, 0.18, 0.04);
      bun.scale.set(1, 0.85, 1);
      var wrap = add(headP, new THREE.TorusGeometry(0.05, 0.014, 8, 16), mat(c.band, 0.45, 0.05), 0, 0.175, 0.04);
      wrap.rotation.x = Math.PI / 2;
      add(headP, geoSphere(0.055, 12, 10), hair, -0.1, 0.11, 0.02);
      add(headP, geoSphere(0.04, 12, 10), hair, 0.09, 0.12, 0.01);
    } else if (c.style === "fade") {
      var cap = add(headP, geoSphere(0.148, 20, 14), hair, 0, 0.06, 0.02);
      cap.scale.set(1.02, 0.62, 0.95);
    } else {
      var beads = c.beads;
      var ti;
      for (ti = 0; ti < 8; ti++) {
        var a = -2.4 + ti * 0.62;
        var len = 0.16 + (ti % 3) * 0.035;
        var tw = pivot(headP, Math.sin(a) * 0.06, 0.1, Math.cos(a) * 0.04);
        tw.rotation.z = a * 0.35;
        tw.rotation.x = -0.8 - (ti % 2) * 0.25;
        var strand = add(tw, geoCapsule(0.018, len), hair, 0, len * 0.45, 0);
        strand.castShadow = false;
        var bead = add(tw, geoSphere(0.022, 8, 6), mat(beads[ti % beads.length], 0.35, 0.15), 0, len + 0.02, 0);
        bead.castShadow = false;
      }
    }

    function arm(side) {
      var s = side < 0 ? -1 : 1;
      var shoulder = pivot(hips, s * 0.145, 0.38, 0);
      add(shoulder, geoSphere(0.042, 12, 10), cloth, 0, 0, 0);
      var upper = pivot(shoulder, s * 0.02, -0.02, 0);
      limb(upper, 0.26, 0.048, cloth);
      var elbow = pivot(upper, 0, -0.26, 0);
      add(elbow, geoSphere(0.04, 10, 8), skin, 0, 0, 0);
      var fore = pivot(elbow, 0, -0.02, 0);
      limb(fore, 0.24, 0.04, skin);
      var hand = add(fore, geoSphere(0.042, 12, 10), skin, 0, -0.26, 0);
      hand.scale.set(0.85, 1, 0.65);
      return { upper: upper, fore: fore };
    }
    var aL = arm(-1);
    var aR = arm(1);

    function leg(side) {
      var s = side < 0 ? -1 : 1;
      var hipJ = pivot(hips, s * (c.style === "fade" ? 0.09 : 0.08), -0.02, 0);
      var thighMat = c.style === "fade" ? pants : pants;
      limb(hipJ, 0.4, c.style === "fade" ? 0.078 : 0.07, thighMat);
      var knee = pivot(hipJ, 0, -0.4, 0);
      add(knee, geoSphere(0.05, 10, 8), c.style === "fade" ? skin : pants, 0, 0, 0);
      var shin = pivot(knee, 0, -0.02, 0);
      limb(shin, 0.38, 0.045, c.style === "fade" ? skin : pants);
      var ankle = pivot(shin, 0, -0.38, 0);
      var foot = add(ankle, geoCapsule(0.045, 0.08), shoe, 0, -0.02, -0.06);
      foot.rotation.x = Math.PI / 2;
      var sole = add(ankle, geoBox(0.07, 0.025, 0.16), mat("#241820", 0.7, 0.05), 0, -0.06, -0.05);
      sole.castShadow = true;
      var stripe = add(ankle, geoBox(0.05, 0.02, 0.08), kick, 0, -0.02, -0.08);
      stripe.castShadow = false;
      return { thigh: hipJ, shin: shin };
    }
    var lL = leg(-1);
    var lR = leg(1);

    function apply(info) {
      var phase = info.phase || 0;
      var s = Math.cos(phase * Math.PI * 2);
      var bob = Math.abs(Math.sin(phase * Math.PI * 2)) * 0.05 * c.bob;
      var mode = info.mode || "run";
      var thighL = 0.95 * s;
      var thighR = -0.95 * s;
      var kneeL = -0.4 - 0.85 * Math.max(0, s);
      var kneeR = -0.4 - 0.85 * Math.max(0, -s);
      var armL = -1.05 * s * c.arm;
      var armR = 1.05 * s * c.arm;
      var foreL = -0.55;
      var foreR = -0.55;
      var lean = c.lean;
      var hipY = 0.92 - bob;
      var hipTwist = -0.12 * s;
      var spineTwist = 0.14 * s;
      headP.rotation.x = 0.08;
      headP.rotation.y = -0.08 * s;
      if (mode === "jump") {
        var k = Math.sin(Math.min(1, info.air || 0) * Math.PI);
        thighL = 1.05 * k;
        thighR = 1.1 * k;
        kneeL = -1.25 * k;
        kneeR = -1.3 * k;
        armL = -1.15 * k;
        armR = -1.05 * k;
        foreL = -0.3;
        foreR = -0.35;
        lean = 0.05;
        hipY = 0.92;
        hipTwist = 0;
        spineTwist = 0;
        headP.rotation.x = -0.1 * k;
      } else if (mode === "slide") {
        thighL = 1.15;
        kneeL = -0.35;
        thighR = 0.15;
        kneeR = -1.35;
        armL = 0.35;
        armR = 0.2;
        foreL = -0.2;
        foreR = -1.4;
        lean = -0.55;
        hipY = 0.62;
        hipTwist = 0;
        spineTwist = 0;
        headP.rotation.x = 0.35;
        headP.rotation.y = 0.2;
      } else if (mode === "hit") {
        thighL = 0.25;
        thighR = -0.45;
        kneeL = -0.2;
        kneeR = -0.3;
        armL = -1.3;
        armR = -0.8;
        foreL = -0.4;
        foreR = -0.5;
        lean = -0.25;
        hipY = 0.9;
        headP.rotation.x = -0.2;
      } else if (mode === "idle") {
        var w = Math.sin((info.t || 0) * 1.6);
        thighL = 0.06;
        thighR = -0.02;
        kneeL = -0.18;
        kneeR = -0.12;
        armL = 0.12 + w * 0.05;
        armR = -0.08 + w * 0.04;
        foreL = -0.35;
        foreR = -0.4;
        lean = 0.06;
        hipY = 0.92 + Math.sin((info.t || 0) * 1.6) * 0.012;
        hipTwist = w * 0.03;
        spineTwist = -w * 0.03;
        headP.rotation.y = 0.12;
        headP.rotation.x = -0.06;
        bob = 0;
      }
      hips.position.y = hipY;
      hips.rotation.y = hipTwist;
      hips.rotation.x = lean;
      torso.rotation.y = spineTwist;
      lL.thigh.rotation.x = thighL;
      lR.thigh.rotation.x = thighR;
      lL.shin.rotation.x = kneeL;
      lR.shin.rotation.x = kneeR;
      aL.upper.rotation.x = armL;
      aR.upper.rotation.x = armR;
      aL.upper.rotation.z = 0.18;
      aR.upper.rotation.z = -0.16;
      aL.fore.rotation.x = foreL;
      aR.fore.rotation.x = foreR;
      var blink = info.blink ? 0.12 : 1;
      eyeL.white.scale.y = blink;
      eyeR.white.scale.y = blink;
      eyeL.iris.scale.y = blink;
      eyeR.iris.scale.y = blink;
    }

    apply({ mode: "idle", phase: 0, t: 0 });
    return { object: root, animate: apply, cast: c };
  }

  function stripeMat(color) { return mat(color, 0.4, 0.2); }
  var STRIPES = ["#1f8f5a", "#2a6fbf", "#d4534a", "#e2a12b", "#7a4ad4"];

  function buildTaxi(variant) {
    var THREE = T();
    var g = new THREE.Group();
    var body = add(g, geoBox(0.98, 1.15, 2.15), mat("#f4f1ea", 0.42, 0.18), 0, 0.95, 0);
    var cabin = add(g, geoBox(0.9, 0.48, 1.15), glassMat(), 0, 1.28, -0.05);
    cabin.castShadow = false;
    var band = add(g, geoBox(1.0, 0.12, 2.16), stripeMat(STRIPES[(variant || 0) % STRIPES.length]), 0, 1.05, 0);
    band.castShadow = false;
    add(g, geoBox(0.86, 0.42, 0.06), glassMat(), 0, 1.22, 1.06);
    add(g, geoSphere(0.07, 10, 8), mat("#e23b3b", 0.4, 0.1), -0.36, 0.95, 1.08);
    add(g, geoSphere(0.07, 10, 8), mat("#e23b3b", 0.4, 0.1), 0.36, 0.95, 1.08);
    add(g, geoBox(0.28, 0.1, 0.02), mat("#f0c14d", 0.5, 0.1), 0, 0.72, 1.09);
    add(g, geoBox(1.02, 0.12, 0.12), mat("#2a2428", 0.6, 0.3), 0, 0.48, 1.02);
    add(g, geoBox(0.7, 0.08, 0.35), mat("#d9d3c8", 0.7, 0.1), 0, 1.62, -0.15);
    function wheel(x, z) {
      var w = add(g, new THREE.CylinderGeometry(0.22, 0.22, 0.14, 12), mat("#1a1618", 0.7, 0.2), x, 0.22, z);
      w.rotation.z = Math.PI / 2;
    }
    wheel(-0.48, 0.7);
    wheel(0.48, 0.7);
    wheel(-0.48, -0.7);
    wheel(0.48, -0.7);
    g.userData.kind = "taxi";
    return g;
  }

  function buildDrums() {
    var THREE = T();
    var g = new THREE.Group();
    function drum(x, color) {
      add(g, new THREE.CylinderGeometry(0.22, 0.24, 0.7, 12), mat(color, 0.55, 0.08), x, 0.35, 0);
      var band = add(g, new THREE.CylinderGeometry(0.245, 0.245, 0.08, 12), mat("#f7f4ee", 0.5, 0.05), x, 0.48, 0);
      band.castShadow = false;
    }
    drum(-0.28, "#f08a24");
    drum(0.28, "#2a6fbf");
    return g;
  }

  function buildBarrier() {
    var THREE = T();
    if (!GEO.barrier) {
      var shape = new THREE.Shape();
      shape.moveTo(-0.42, 0);
      shape.lineTo(-0.26, 0.62);
      shape.lineTo(0.26, 0.62);
      shape.lineTo(0.42, 0);
      shape.closePath();
      GEO.barrier = new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
      GEO.barrier.translate(0, 0, -0.35);
    }
    var g = new THREE.Group();
    add(g, GEO.barrier, mat("#d7d1c6", 0.72, 0.04), 0, 0, 0);
    add(g, geoBox(0.36, 0.08, 0.74), mat("#f0c14d", 0.5, 0.08), 0, 0.36, 0);
    return g;
  }

  function buildPothole() {
    var THREE = T();
    var g = new THREE.Group();
    var rim = add(g, new THREE.TorusGeometry(0.38, 0.06, 8, 16), mat("#5c564e", 0.8, 0.05), 0, 0.04, 0);
    rim.rotation.x = Math.PI / 2;
    var hole = add(g, new THREE.CircleGeometry(0.34, 16), mat("#1a1614", 0.9, 0.02), 0, 0.045, 0);
    hole.rotation.x = -Math.PI / 2;
    hole.castShadow = false;
    return g;
  }

  function buildScaffold() {
    var THREE = T();
    var g = new THREE.Group();
    add(g, new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8), mat("#c5c8ce", 0.45, 0.4), -0.55, 1.05, 0);
    add(g, new THREE.CylinderGeometry(0.04, 0.04, 2.1, 8), mat("#c5c8ce", 0.45, 0.4), 0.55, 1.05, 0);
    add(g, new THREE.CylinderGeometry(0.045, 0.045, 1.2, 8), mat("#f0c14d", 0.4, 0.35), 0, 1.22, 0).rotation.z = Math.PI / 2;
    var i;
    for (i = 0; i < 4; i++) {
      add(g, geoBox(0.12, 0.05, 0.08), mat(i % 2 ? "#241820" : "#e23b3b", 0.5, 0.1), -0.36 + i * 0.24, 1.22, 0);
    }
    return g;
  }

  function buildSign() {
    var THREE = T();
    var g = new THREE.Group();
    add(g, new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), mat("#c5c8ce", 0.4, 0.4), -0.28, 1.7, 0);
    add(g, new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), mat("#c5c8ce", 0.4, 0.4), 0.28, 1.7, 0);
    add(g, geoBox(1.15, 0.42, 0.08), mat("#fffaf2", 0.55, 0.05), 0, 1.28, 0);
    add(g, geoBox(0.7, 0.12, 0.02), mat("#d4534a", 0.5, 0.08), 0, 1.28, -0.05);
    return g;
  }

  function buildBranch() {
    var THREE = T();
    var g = new THREE.Group();
    var limb1 = add(g, geoCapsule(0.035, 0.5), mat("#6b4a32", 0.8, 0.02), 0.15, 1.55, 0);
    limb1.rotation.z = 0.9;
    var blossom = add(g, geoSphere(0.28, 14, 12), mat("#9b59b6", 0.7, 0.02), -0.15, 1.25, 0);
    blossom.scale.set(1.3, 0.7, 1);
    add(g, geoSphere(0.16, 12, 10), mat("#d7a4e2", 0.65, 0.02), 0.05, 1.4, -0.05);
    add(g, geoSphere(0.12, 10, 8), mat("#7d3c98", 0.7, 0.02), -0.28, 1.18, 0.05);
    return g;
  }

  function buildBoom(open) {
    var THREE = T();
    var g = new THREE.Group();
    add(g, geoBox(0.08, 1.7, 0.08), mat("#2c3138", 0.5, 0.3), 0.42, 0.85, 0);
    var cols = open ? ["#3a2424", "#3a3420", "#1fa971"] : ["#e23b3b", "#3a3420", "#1d3a2c"];
    var i;
    for (i = 0; i < 3; i++) {
      var lamp = add(g, geoSphere(0.055, 10, 8), mat(cols[i], 0.4, 0.1), 0.42, 1.45 - i * 0.16, -0.02);
      if ((open && i === 2) || (!open && i === 0)) {
        lamp.material = lamp.material.clone();
        lamp.material.emissive = new (T()).Color(cols[i]);
        lamp.material.emissiveIntensity = 0.85;
      }
    }
    var arm = pivot(g, -0.15, 1.15, 0);
    add(arm, geoBox(0.85, 0.07, 0.06), mat("#f0c14d", 0.45, 0.15), 0.4, 0, 0);
    var k;
    for (k = 0; k < 4; k++) add(arm, geoBox(0.08, 0.075, 0.065), mat("#241820", 0.6, 0.1), 0.18 + k * 0.18, 0, 0);
    arm.rotation.z = open ? -1.15 : 0;
    g.userData.arm = arm;
    return g;
  }

  function buildFare(variant) {
    var THREE = T();
    var shirts = ["#ffb703", "#49c2b0", "#d4534a"];
    var skins = ["#e0aa78", "#6e3e2e", "#c4845c"];
    var g = new THREE.Group();
    var shirt = mat(shirts[variant % 3], 0.6, 0.05);
    var skin = mat(skins[variant % 3], 0.58, 0.02, "skin");
    var hips = pivot(g, 0, 0.72, 0);
    add(hips, geoCapsule(0.11, 0.28), shirt, 0, 0.12, 0);
    add(hips, geoSphere(0.11, 14, 12), skin, 0, 0.42, 0);
    add(hips, geoSphere(0.09, 10, 8), mat("#1b140f", 0.8, 0.04), 0, 0.5, 0.01);
    var arm = pivot(hips, 0.12, 0.28, 0);
    limb(arm, 0.28, 0.035, shirt);
    g.userData.arm = arm;
    limb(pivot(hips, -0.08, 0, 0), 0.34, 0.045, mat("#24507a", 0.7, 0.02));
    limb(pivot(hips, 0.08, 0, 0), 0.34, 0.045, mat("#24507a", 0.7, 0.02));
    var ring = add(g, new THREE.TorusGeometry(0.28, 0.025, 8, 16), mat("#f0c14d", 0.4, 0.3), 0, 0.04, 0);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = false;
    return g;
  }

  function buildCoin() {
    var THREE = T();
    var g = new THREE.Group();
    var disc = add(g, new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), mat("#f0c14d", 0.32, 0.75).clone(), 0, 0.9, 0);
    disc.material.emissive = new THREE.Color("#a97820");
    disc.material.emissiveIntensity = 0.15;
    return g;
  }

  function buildShield() {
    var THREE = T();
    var g = new THREE.Group();
    var cols = ["#fffaf2", "#d4534a", "#2d439e", "#128f86", "#ffb703"];
    var i;
    for (i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2;
      add(g, geoSphere(0.045, 8, 6), mat(cols[i % cols.length], 0.4, 0.1), Math.cos(a) * 0.16, 1.15 + Math.sin(a) * 0.16, 0);
    }
    return g;
  }

  function buildKota() {
    var g = new (T()).Group();
    add(g, geoSphere(0.16, 14, 12), mat("#e6c48a", 0.7, 0.02), 0, 0.85, 0).scale.set(1.3, 0.7, 0.9);
    add(g, geoBox(0.16, 0.04, 0.12), mat("#f2d15a", 0.6, 0.02), 0, 0.9, -0.02);
    add(g, geoBox(0.16, 0.035, 0.12), mat("#d4534a", 0.6, 0.02), 0, 0.94, -0.02);
    return g;
  }

  function buildChevron() {
    var THREE = T();
    var g = new THREE.Group();
    var cone = add(g, new THREE.ConeGeometry(0.12, 0.28, 4), mat("#f0c14d", 0.4, 0.1).clone(), 0, 0.08, 0);
    cone.rotation.x = Math.PI / 2;
    g.userData.cone = cone;
    return g;
  }

  root.MESH = {
    CAST: CAST,
    STRIPES: STRIPES,
    buildRunner: buildRunner,
    buildTaxi: buildTaxi,
    buildDrums: buildDrums,
    buildBarrier: buildBarrier,
    buildPothole: buildPothole,
    buildScaffold: buildScaffold,
    buildSign: buildSign,
    buildBranch: buildBranch,
    buildBoom: buildBoom,
    buildFare: buildFare,
    buildCoin: buildCoin,
    buildShield: buildShield,
    buildKota: buildKota,
    buildChevron: buildChevron,
    mat: mat
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
// EISH! Jozi Run — real-time 3D street.
// The runner stays near the origin and faces -Z. The camera sits behind them.
// Buildings start ahead of the camera, inset from the lens, so a near wall cannot fill the screen.
// World Z = travel - mile. Ahead is negative Z.
(function (root) {
  "use strict";
  var BUILD_INSET = 3.55;
  var VIEW = { mobile: false };

  function three() { return root.THREE; }

  var renderer, scene, camera, sun, roadMat, world, runners, active, clockReady;
  var props = [];
  var trees = [];
  var buildings = [];
  var lamps = [];
  var skyline = [];
  var failReason = "";

  function facadeTexture(style) {
    var THREE = three();
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    var g = canvas.getContext("2d");
    var walls = ["#e7d3b0", "#e07a52", "#cfc8bc", "#f3e6c4", "#6a7580"];
    var accents = ["#d4534a", "#128f86", "#ffb703", "#7a4ad4", "#2a6fbf"];
    g.fillStyle = walls[style % walls.length];
    g.fillRect(0, 0, 256, 512);
    if (style === 4) {
      g.fillStyle = "#ffb703";
      g.beginPath();
      g.arc(128, 230, 70, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#128f86";
      g.beginPath();
      g.moveTo(40, 340);
      g.lineTo(128, 160);
      g.lineTo(216, 340);
      g.fill();
      g.fillStyle = accents[0];
      g.fillRect(96, 300, 64, 90);
    }
    var row, col;
    for (row = 0; row < 7; row++) {
      for (col = 0; col < 4; col++) {
        var lit = ((style * 3 + row * 5 + col * 2) % 7) === 0;
        g.fillStyle = lit ? "#ffe1a8" : "#243044";
        g.fillRect(28 + col * 56, 36 + row * 62, 34, 42);
        g.strokeStyle = "rgba(36,24,32,0.35)";
        g.strokeRect(28 + col * 56, 36 + row * 62, 34, 42);
      }
    }
    g.fillStyle = accents[style % accents.length];
    g.fillRect(18, 430, 220, 28);
    g.fillStyle = "#fffaf2";
    g.font = "700 22px Trebuchet MS, sans-serif";
    g.textAlign = "center";
    g.fillText(["KOTA", "RANK", "SHARP", "BEADS", "AIR"][style % 5], 128, 452);
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  function roadTexture() {
    var THREE = three();
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    var g = canvas.getContext("2d");
    g.fillStyle = "#3e3a36";
    g.fillRect(0, 0, 256, 512);
    var i;
    for (i = 0; i < 180; i++) {
      g.fillStyle = "rgba(255,255,255,0.015)";
      g.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
    }
    g.strokeStyle = "rgba(244,239,228,0.9)";
    g.lineWidth = 6;
    g.setLineDash([36, 28]);
    g.beginPath();
    g.moveTo(86, 0);
    g.lineTo(86, 512);
    g.moveTo(170, 0);
    g.lineTo(170, 512);
    g.stroke();
    g.setLineDash([]);
    g.strokeStyle = "#e2b84a";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(8, 0);
    g.lineTo(8, 512);
    g.moveTo(248, 0);
    g.lineTo(248, 512);
    g.stroke();
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 12);
    tex.anisotropy = 4;
    return tex;
  }

  function skyTexture() {
    var THREE = three();
    var canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 256;
    var g = canvas.getContext("2d");
    var grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, "#6eb6d6");
    grd.addColorStop(0.45, "#f3a36a");
    grd.addColorStop(0.75, "#f6c98a");
    grd.addColorStop(1, "#f3d7b0");
    g.fillStyle = grd;
    g.fillRect(0, 0, 16, 256);
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeBuilding(style) {
    var THREE = three();
    var tex = facadeTexture(style);
    var mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.86, metalness: 0.02 });
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    var roof = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 1.05), new THREE.MeshStandardMaterial({ color: "#cbb89a", roughness: 0.8 }));
    roof.position.y = 0.54;
    mesh.add(roof);
    if (style % 2 === 0) {
      var tank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 8), new THREE.MeshStandardMaterial({ color: "#8d9398", roughness: 0.5, metalness: 0.4 }));
      tank.position.set(0.2, 0.66, 0.1);
      mesh.add(tank);
    }
    return mesh;
  }

  function makeTree() {
    var THREE = three();
    var g = new THREE.Group();
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 1.6, 8), new THREE.MeshStandardMaterial({ color: "#6b4a32", roughness: 0.85 }));
    trunk.position.y = 0.8;
    trunk.castShadow = true;
    g.add(trunk);
    var cols = ["#9b59b6", "#d7a4e2", "#7d3c98"];
    var i;
    for (i = 0; i < 3; i++) {
      var canopy = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), new THREE.MeshStandardMaterial({ color: cols[i], roughness: 0.72 }));
      canopy.position.set((i - 1) * 0.28, 1.7 + (i === 1 ? 0.25 : 0), (i === 2 ? 0.1 : -0.05));
      canopy.scale.set(1.15, 0.75, 1);
      canopy.castShadow = true;
      g.add(canopy);
    }
    return g;
  }

  function init(container) {
    var THREE = three();
    failReason = "";
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch (err) {
      failReason = err && err.message ? err.message : "WebGL renderer failed.";
      return { ok: false, error: failReason };
    }
    if (!renderer || !renderer.getContext()) {
      failReason = "WebGL context was not created.";
      return { ok: false, error: failReason };
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xf3d7b0, 1);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = skyTexture();
    scene.fog = new THREE.Fog(0xf0c49a, 22, 68);

    camera = new THREE.PerspectiveCamera(62, 1, 0.1, 120);

    scene.add(new THREE.AmbientLight(0xfff2e0, 0.28));
    var hemi = new THREE.HemisphereLight(0x9fd0ea, 0xc4895c, 0.55);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(0xffe0b8, 2.5);
    sun.position.set(5, 14, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 36;
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -14;
    sun.shadow.bias = -0.0008;
    scene.add(sun);
    scene.add(sun.target);
    var fill = new THREE.DirectionalLight(0xfff0d8, 0.65);
    fill.position.set(-6, 6, -8);
    scene.add(fill);

    var map = roadTexture();
    roadMat = new THREE.MeshStandardMaterial({ map: map, roughness: 0.92, metalness: 0.02 });
    var road = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 140), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -15);
    road.receiveShadow = true;
    scene.add(road);

    var walkMat = new THREE.MeshStandardMaterial({ color: "#d9c4a4", roughness: 0.95 });
    var leftWalk = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 140), walkMat);
    leftWalk.rotation.x = -Math.PI / 2;
    leftWalk.position.set(-3.15, 0.02, -15);
    leftWalk.receiveShadow = true;
    scene.add(leftWalk);
    var rightWalk = leftWalk.clone();
    rightWalk.position.x = 3.15;
    scene.add(rightWalk);

    var i;
    for (i = 0; i < 5; i++) buildings.push(makeBuilding(i));
    for (i = 0; i < 16; i++) {
      var b = buildings[i % 5].clone();
      b.material = buildings[i % 5].material;
      scene.add(b);
      buildings[i] = b;
    }
    // The first 5 were templates also added? I pushed templates then overwrote. Templates not in scene except if I added them. I didn't add templates. Then I clone into buildings[i], but buildings[0..4] were templates and get replaced. The clones of early ones are fine. Wait: loop i=0 replaces buildings[0] which was a template, after clone. clone happens before replace. Good. But buildings.length was 5, then we set [0]..[15], so length becomes 16. Good.
    // Remove the unused extra references... OK.

    for (i = 0; i < 14; i++) {
      var tree = makeTree();
      scene.add(tree);
      trees.push(tree);
    }

    // Distant Jozi cues: a round tower and a pair of bridge pylons. Real meshes, far enough to stay small.
    var towerMat = new THREE.MeshStandardMaterial({ color: "#c98462", roughness: 0.7 });
    var tower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 22, 12), towerMat);
    tower.position.set(-16, 11, -78);
    scene.add(tower);
    skyline.push(tower);
    var pylonMat = new THREE.MeshStandardMaterial({ color: "#5d6a72", roughness: 0.55, metalness: 0.3 });
    var p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 16, 6), pylonMat);
    p1.position.set(8, 8, -70);
    p1.rotation.z = 0.18;
    scene.add(p1);
    var p2 = p1.clone();
    p2.position.x = 14;
    p2.rotation.z = -0.18;
    scene.add(p2);
    skyline.push(p1, p2);

    runners = [root.MESH.buildRunner(0), root.MESH.buildRunner(1), root.MESH.buildRunner(2)];
    for (i = 0; i < runners.length; i++) scene.add(runners[i].object);
    active = 0;

    var sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), new THREE.MeshBasicMaterial({ color: "#ffe7b0" }));
    sunMesh.position.set(18, 16, -40);
    scene.add(sunMesh);

    world = { travel: 0 };
    clockReady = true;
    return { ok: true, canvas: renderer.domElement };
  }

  function resize(w, h, dpr) {
    if (!renderer) return;
    VIEW.mobile = Math.min(w, h) < 760;
    var ratio = Math.min(dpr || 1, VIEW.mobile ? 1.35 : 1.75);
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.fov = VIEW.mobile ? 64 : 56;
    camera.updateProjectionMatrix();
    var shadow = VIEW.mobile ? 1024 : 2048;
    if (sun && sun.shadow.mapSize.x !== shadow) {
      sun.shadow.mapSize.set(shadow, shadow);
      if (sun.shadow.map) sun.shadow.map.dispose();
      sun.shadow.map = null;
    }
  }

  function placeBuildings(travel) {
    var i;
    var base = Math.floor(travel / 11);
    for (i = 0; i < buildings.length; i++) {
      var index = base + i;
      var side = index % 2 === 0 ? -1 : 1;
      var mile = index * 11;
      var width = 4.2 + (index % 3) * 0.7;
      var depth = 5 + (index % 4);
      var height = 6 + (index % 5) * 3.2 + (index % 7 === 0 ? 8 : 0);
      var b = buildings[i];
      b.scale.set(width, height, depth);
      b.position.set(side * (BUILD_INSET + width * 0.5), height * 0.5, travel - mile - 8);
      b.visible = b.position.z < 3 && b.position.z > -72;
      b.rotation.y = side > 0 ? Math.PI : 0;
    }
  }

  function placeTrees(travel) {
    var i;
    var base = Math.floor(travel / 9);
    for (i = 0; i < trees.length; i++) {
      var index = base + i;
      var side = index % 2 === 0 ? 1 : -1;
      var mile = index * 9 + 3;
      trees[i].position.set(side * 2.65, 0, travel - mile);
      trees[i].visible = trees[i].position.z < 1.2 && trees[i].position.z > -60;
    }
  }

  function hideProps() {
    var i;
    for (i = 0; i < props.length; i++) props[i].used = false;
  }
  function takeProp(kind, variant) {
    var i;
    for (i = 0; i < props.length; i++) {
      if (!props[i].used && props[i].kind === kind && props[i].variant === variant) {
        props[i].used = true;
        props[i].object.visible = true;
        return props[i];
      }
    }
    var object = null;
    if (kind === "taxi") object = root.MESH.buildTaxi(variant);
    else if (kind === "drums") object = root.MESH.buildDrums();
    else if (kind === "barrier") object = root.MESH.buildBarrier();
    else if (kind === "pothole") object = root.MESH.buildPothole();
    else if (kind === "scaffold") object = root.MESH.buildScaffold();
    else if (kind === "sign") object = root.MESH.buildSign();
    else if (kind === "branch") object = root.MESH.buildBranch();
    else if (kind === "boom") object = root.MESH.buildBoom(variant === 1);
    else if (kind === "fare") object = root.MESH.buildFare(variant);
    else if (kind === "coin") object = root.MESH.buildCoin();
    else if (kind === "shield") object = root.MESH.buildShield();
    else if (kind === "kota") object = root.MESH.buildKota();
    else if (kind === "chev") object = root.MESH.buildChevron();
    if (!object) return null;
    scene.add(object);
    var slot = { kind: kind, variant: variant, object: object, used: true };
    props.push(slot);
    return slot;
  }

  function parkTaxis(travel) {
    var i;
    for (i = 0; i < 4; i++) {
      var slot = takeProp("taxi", i);
      if (!slot) continue;
      var side = i % 2 === 0 ? -1 : 1;
      var mile = Math.floor(travel / 22) * 22 + i * 22 + 6;
      slot.object.position.set(side * 2.15, 0, travel - mile);
      slot.object.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      slot.object.visible = slot.object.position.z < -2 && slot.object.position.z > -55;
    }
  }

  function syncEnt(e, travel, time) {
    var z = travel - e.z;
    if (z > 1.2 || z < -70) return;
    var kind = "drums";
    var variant = e.variant || 0;
    if (e.kind === "coin") kind = "coin";
    else if (e.kind === "fare") kind = "fare";
    else if (e.kind === "shield") kind = "shield";
    else if (e.kind === "kota") kind = "kota";
    else if (e.kind === "gate") {
      var lane;
      for (lane = 0; lane < 3; lane++) {
        var open = lane === e.lane ? 1 : 0;
        var boom = takeProp("boom", open);
        if (!boom) continue;
        boom.object.position.set(root.EISH.LANE_X[lane], 0, z);
        if (boom.object.userData.arm) boom.object.userData.arm.rotation.z = open ? -1.15 : 0.05;
      }
      var names = ["LEFT", "MID", "RIGHT"];
      return { banner: z > -28 ? names[e.lane] : "" };
    } else if (e.kind === "obs") {
      if (e.verb === "block") kind = "taxi";
      else if (e.verb === "low" && e.variant === 1) kind = "barrier";
      else if (e.verb === "low" && e.variant === 2) kind = "pothole";
      else if (e.verb === "low") kind = "drums";
      else if (e.verb === "high" && e.variant === 1) kind = "sign";
      else if (e.verb === "high" && e.variant === 2) kind = "branch";
      else kind = "scaffold";
      var chev = takeProp("chev", 0);
      if (chev) {
        chev.object.position.set(e.x, 0, z + 2.4);
        var color = e.verb === "low" ? "#f0c14d" : e.verb === "high" ? "#5aaadc" : "#e23b3b";
        if (chev.object.userData.cone) chev.object.userData.cone.material.color.set(color);
        chev.object.visible = true;
      }
    }
    var slot = takeProp(kind, kind === "taxi" ? (e.id || variant) % 5 : variant);
    if (!slot) return;
    slot.object.position.set(e.x, e.kind === "coin" || e.kind === "shield" || e.kind === "kota" ? 0 : 0, z);
    if (kind === "taxi") slot.object.rotation.y = 0;
    if (kind === "coin") slot.object.rotation.y = time * 3;
    if (kind === "fare" && slot.object.userData.arm) slot.object.userData.arm.rotation.x = -0.8 + Math.sin(time * 6 + e.z) * 0.5;
    if (e.kind === "coin" && e.y > 1) slot.object.position.y = 0.7;
    else if (e.kind !== "coin") slot.object.position.y = 0;
  }

  function frameCamera(app, px) {
    var wide = !VIEW.mobile && camera.aspect > 1.15;
    var title = app.screen === "title" || app.screen === "how";
    if (title) {
      // In front of the face, a little to screen-right, so both eyes and the whole body read.
      camera.position.set(0.62, 1.02, 3.25);
      camera.lookAt(-0.02, 0.86, 0);
      camera.fov = wide ? 32 : 30;
    } else {
      var sway = app.reduced ? 0 : Math.sin((app.time || 0) * 1.5) * 0.025;
      camera.position.set(px * 0.28 + 0.22, wide ? 1.85 : 1.62, wide ? 4.6 : 4.05);
      camera.lookAt(px * 0.45, 0.98 + sway, -6.2);
      camera.fov = wide ? 52 : 58;
    }
    camera.updateProjectionMatrix();
  }

  function frame(app) {
    if (!clockReady) return;
    var travel = 0;
    var who = app.who || 0;
    var i;
    for (i = 0; i < runners.length; i++) runners[i].object.visible = i === who;
    var runner = runners[who];
    if (app.screen === "play" || app.screen === "pause" || app.screen === "over") {
      var sim = app.sim;
      if (sim) {
        travel = sim.travel;
        var mode = "run";
        if (!sim.alive) mode = "hit";
        else if (sim.air > 0) mode = "jump";
        else if (sim.slide > 0) mode = "slide";
        runner.animate({
          mode: mode,
          phase: sim.phase / 6,
          air: sim.air / (root.EISH.JUMP_DUR || 0.58),
          t: app.time,
          blink: false
        });
        runner.object.position.set(sim.x, sim.y, 0);
        runner.object.rotation.y = 0;
        frameCamera(app, sim.x);
        sun.target.position.set(sim.x, 0, -6);
      }
    } else {
      travel = app.menuT || 0;
      var blink = !app.reduced && Math.sin(app.time * 0.7) > 0.96;
      runner.animate({ mode: "idle", phase: 0, t: app.time, blink: blink });
      runner.object.position.set(-0.12, 0, 0);
      runner.object.rotation.y = Math.PI + 0.32;
      frameCamera(app, 0);
      sun.target.position.set(0, 0, -4);
    }
    if (roadMat && roadMat.map) roadMat.map.offset.y = travel * 0.09;
    placeBuildings(travel);
    placeTrees(travel);
    hideProps();
    var banner = "";
    if (app.sim && (app.screen === "play" || app.screen === "pause" || app.screen === "over")) {
      var ents = app.sim.ents;
      for (i = 0; i < ents.length; i++) {
        if (ents[i].dead) continue;
        var found = syncEnt(ents[i], travel, app.time || 0);
        if (found && found.banner) banner = found.banner;
      }
    }
    parkTaxis(travel);
    for (i = 0; i < props.length; i++) if (!props[i].used) props[i].object.visible = false;
    renderer.render(scene, camera);
    return { banner: banner };
  }

  root.WORLD = {
    init: init,
    resize: resize,
    frame: frame,
    failReason: function () { return failReason; }
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
// EISH! Jozi Run — input, audio, HTML UI over the 3D street.
// A press that starts on a button stays a button. Swipes count by distance, not a short timer.
(function (root) {
  "use strict";
  var EISH = root.EISH;
  var WORLD = root.WORLD;
  var MESH = root.MESH;
  var q = {};
  try {
    location.search.slice(1).split("&").forEach(function (p) {
      var b = p.split("=");
      if (b[0]) q[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "1");
    });
  } catch (e) {}

  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (err) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) {}
  }
  function $(id) { return document.getElementById(id); }

  var reducedPref = false;
  try { reducedPref = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e2) {}

  var app = {
    screen: "title",
    who: load("eish_run_who", 0) % 3,
    mode: "run",
    sim: null,
    best: load("eish_run_best", {}),
    mute: load("eish_run_mute", false),
    reduced: load("eish_run_rm", reducedPref),
    seenHint: load("eish_run_hint", false),
    menuT: 8,
    time: 0,
    hint: 0,
    lanes: [],
    jump: false,
    slide: false,
    bot: q.bot === "1",
    newBest: false
  };
  if (q.mode === "rush" || q.mode === "robot" || q.mode === "run") app.mode = q.mode;
  if (q.mute === "1") app.mute = true;
  if (q.who) app.who = (+q.who) % 3;

  var view = $("view");
  var started = WORLD.init(view);
  if (!started.ok) {
    var boot = $("boot");
    if (boot) boot.hidden = true;
    var fail = $("glfail");
    if (fail) fail.hidden = false;
    var why = $("glwhy");
    if (why) why.textContent = started.error || "WebGL did not start.";
    return;
  }
  root.__EISH_OK = true;
  var canvas = started.canvas;

  function resize() {
    var w = view.clientWidth || window.innerWidth;
    var h = view.clientHeight || window.innerHeight;
    var dpr = window.devicePixelRatio || 1;
    if (app.reduced) dpr = Math.min(dpr, 1.25);
    WORLD.resize(w, h, dpr);
  }

  var AC = null, master = null, noiseBuf = null;
  function ac() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain();
        master.gain.value = app.mute ? 0 : 0.35;
        master.connect(AC.destination);
      } catch (err) { return null; }
    }
    if (AC.state === "suspended") AC.resume();
    master.gain.value = app.mute ? 0 : 0.35;
    return AC;
  }
  function tone(f, d, type, vol, slide) {
    if (!ac() || app.mute) return;
    var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type || "triangle";
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + d);
    g.gain.setValueAtTime(vol || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + d + 0.02);
  }
  function noise(d, vol) {
    if (!ac() || app.mute) return;
    if (!noiseBuf) {
      noiseBuf = AC.createBuffer(1, AC.sampleRate * 0.2, AC.sampleRate);
      var data = noiseBuf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    var t = AC.currentTime, src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    src.buffer = noiseBuf; f.type = "bandpass"; f.frequency.value = 900;
    g.gain.setValueAtTime(vol || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + d);
  }
  var musicOn = false, musicTimer = 0, stepN = 0, nextT = 0;
  function tickMusic() {
    if (!AC || app.mute || app.screen === "title" || app.screen === "how") return;
    var spb = 60 / 104 / 2;
    while (nextT < AC.currentTime + 0.12) {
      var s = stepN % 16;
      if (s % 4 === 0) tone(98, 0.12, "sine", 0.06, 70);
      if (s % 2 === 0) noise(0.03, 0.03);
      if (s === 4 || s === 12) tone(196, 0.08, "triangle", 0.04);
      nextT += spb;
      stepN++;
    }
  }
  function music(on) {
    if (on && !app.mute && !app.reduced && !musicOn) {
      if (!ac()) return;
      musicOn = true;
      nextT = AC.currentTime + 0.05;
      musicTimer = setInterval(tickMusic, 40);
    } else if (!on && musicOn) {
      musicOn = false;
      clearInterval(musicTimer);
    }
  }
  function sfx(name) {
    if (name === "jump") tone(420, 0.08, "sine", 0.05, 220);
    else if (name === "slide") noise(0.1, 0.06);
    else if (name === "lane") tone(520, 0.04, "square", 0.03);
    else if (name === "coin") tone(880, 0.06, "square", 0.04, 1320);
    else if (name === "fare") { tone(660, 0.08, "triangle", 0.06); tone(880, 0.1, "triangle", 0.04); }
    else if (name === "shield" || name === "kota") tone(520, 0.1, "triangle", 0.06, 780);
    else if (name === "gate") tone(640, 0.12, "triangle", 0.06, 960);
    else if (name === "near") tone(760, 0.05, "sine", 0.03);
    else if (name === "die" || name === "crash" || name === "strike") tone(180, 0.2, "sawtooth", 0.05, 60);
    else if (name === "finish") tone(523, 0.12, "triangle", 0.06, 784);
  }

  function show(id, on) { var el = $(id); if (el) el.hidden = !on; }
  var buildTag = $("buildTag");
  if (buildTag) buildTag.textContent = q.build ? ("build " + q.build) : "";

  function paintUI() {
    document.body.classList.toggle("menu", app.screen === "title" || app.screen === "how");
    resize();
    var title = app.screen === "title";
    show("title", title);
    show("how", app.screen === "how");
    show("pause", app.screen === "pause");
    show("over", app.screen === "over");
    show("hud", app.screen === "play" || app.screen === "pause");
    show("pad", app.screen === "play");
    var cast = MESH.CAST[app.who];
    $("whoName").textContent = cast.name;
    $("whoPlace").textContent = cast.place;
    $("whoLine").textContent = cast.line;
    $("muteBtn").textContent = app.mute ? "Sound off" : "Sound on";
    $("rmBtn").textContent = app.reduced ? "Motion: reduced" : "Motion: full";
    var sim = app.sim;
    if (sim && (app.screen === "play" || app.screen === "pause" || app.screen === "over")) {
      $("score").textContent = String(Math.floor(sim.score));
      var sub = sim.mode === "rush" ? (sim.fares + " fares") : sim.mode === "robot" ? (sim.routes + " robots") : (Math.floor(sim.dist) + " m");
      $("sub").textContent = sub + " · " + sim.coins + " coins";
      $("modeName").textContent = EISH.MODES[sim.mode].name;
      $("timer").hidden = sim.mode !== "rush";
      if (sim.mode === "rush") $("timer").textContent = Math.ceil(sim.timeLeft) + "s";
      $("strikes").hidden = sim.mode !== "robot";
      if (sim.mode === "robot") {
        var dots = $("strikes").querySelectorAll("i");
        for (var i = 0; i < dots.length; i++) dots[i].className = i < sim.strikes ? "on" : "";
      }
      if (app.screen === "over") {
        $("overTitle").textContent = sim.win ? "You made the rank" : sim.reason === "strikes" ? "Three red robots" : "Eish";
        $("overScore").textContent = "Score " + Math.floor(sim.score);
        $("overDetail").textContent = sim.mode === "rush" ? (sim.fares + " fares banked") : sim.mode === "robot" ? (sim.routes + " open robots, " + sim.strikes + " strikes") : (Math.floor(sim.dist) + " metres");
        $("overBest").textContent = app.newBest ? "New best." : "Best " + Math.floor(app.best[sim.mode] || 0);
      }
    }
    $("hint").hidden = !(app.screen === "play" && app.hint > 0);
  }

  function rememberBest() {
    var sim = app.sim;
    if (!sim) return;
    var prev = app.best[sim.mode] || 0;
    app.newBest = sim.score > prev;
    if (app.newBest) {
      app.best[sim.mode] = sim.score;
      save("eish_run_best", app.best);
    }
  }

  function begin(mode) {
    ac();
    app.mode = mode;
    var seed = q.seed ? (q.seed >>> 0) : ((Date.now() ^ (Math.random() * 1e9)) >>> 0);
    app.sim = EISH.create(mode, seed);
    app.screen = "play";
    app.hint = app.seenHint ? 2.4 : 5;
    app.seenHint = true;
    save("eish_run_hint", true);
    music(true);
    paintUI();
  }

  function tap(id) {
    if (id === "mute") {
      app.mute = !app.mute;
      save("eish_run_mute", app.mute);
      if (master) master.gain.value = app.mute ? 0 : 0.35;
      paintUI();
      return;
    }
    if (app.screen === "title") {
      if (id === "who-prev") app.who = (app.who + 2) % 3;
      if (id === "who-next") app.who = (app.who + 1) % 3;
      save("eish_run_who", app.who);
      if (id === "how") app.screen = "how";
      if (id === "mode-run") begin("run");
      if (id === "mode-rush") begin("rush");
      if (id === "mode-robot") begin("robot");
    } else if (app.screen === "how") {
      if (id === "back") app.screen = "title";
      if (id === "rm") { app.reduced = !app.reduced; save("eish_run_rm", app.reduced); resize(); }
    } else if (app.screen === "play") {
      if (id === "pause") { app.screen = "pause"; music(false); }
      if (id === "btn-left") app.lanes.push(-1);
      if (id === "btn-right") app.lanes.push(1);
      if (id === "btn-jump") app.jump = true;
      if (id === "btn-slide") app.slide = true;
    } else if (app.screen === "pause") {
      if (id === "resume") { app.screen = "play"; music(true); }
      if (id === "restart") begin(app.mode);
      if (id === "menu") { app.screen = "title"; app.sim = null; music(false); }
    } else if (app.screen === "over") {
      if (id === "restart") begin(app.sim ? app.sim.mode : app.mode);
      if (id === "menu") { app.screen = "title"; music(false); }
    }
    paintUI();
  }

  function swipe(dirx, diry) {
    if (app.screen !== "play") {
      if (app.screen === "title" && dirx) tap(dirx < 0 ? "who-prev" : "who-next");
      return;
    }
    if (Math.abs(dirx) > Math.abs(diry)) app.lanes.push(dirx > 0 ? 1 : -1);
    else if (diry < 0) app.jump = true;
    else app.slide = true;
  }

  var ptr = null;
  canvas.addEventListener("pointerdown", function (e) {
    if (ptr) return;
    if (e.target && e.target.closest && e.target.closest("button")) return;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    ptr = { id: e.pointerId, sx: e.clientX, sy: e.clientY, used: false };
    ac();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!ptr || e.pointerId !== ptr.id || ptr.used) return;
    var dx = e.clientX - ptr.sx, dy = e.clientY - ptr.sy;
    if (Math.abs(dx) < 26 && Math.abs(dy) < 26) return;
    ptr.used = true;
    swipe(dx, dy);
  });
  function endPointer(e) {
    if (!ptr || e.pointerId !== ptr.id) return;
    var dx = e.clientX - ptr.sx, dy = e.clientY - ptr.sy;
    if (!ptr.used && (Math.abs(dx) >= 26 || Math.abs(dy) >= 26)) swipe(dx, dy);
    ptr = null;
  }
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);

  document.body.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-tap]") : null;
    if (!btn) return;
    e.preventDefault();
    tap(btn.getAttribute("data-tap"));
  });
  $("pauseBtn").addEventListener("click", function () { tap("pause"); });

  window.addEventListener("keydown", function (e) {
    if (e.repeat) return;
    var k = e.key;
    if (k === "ArrowLeft" || k === "a" || k === "A") swipe(-1, 0);
    else if (k === "ArrowRight" || k === "d" || k === "D") swipe(1, 0);
    else if (k === "ArrowUp" || k === "w" || k === "W") swipe(0, -1);
    else if (k === "ArrowDown" || k === "s" || k === "S") swipe(0, 1);
    else if (k === "Escape" || k === "p" || k === "P") {
      if (app.screen === "play") tap("pause");
      else if (app.screen === "pause") tap("resume");
      else if (app.screen === "how" || app.screen === "over") tap(app.screen === "how" ? "back" : "menu");
    } else if (k === "Enter" || k === " ") {
      if (app.screen === "title") begin(app.mode);
      else if (app.screen === "pause") tap("resume");
      else if (app.screen === "over") tap("restart");
      else if (app.screen === "play") app.jump = true;
    } else if (app.screen === "title" && (k === "1" || k === "2" || k === "3")) begin(["run", "rush", "robot"][+k - 1]);
    else return;
    e.preventDefault();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && app.screen === "play") tap("pause");
  });

  function takeInput() {
    var input = { lane: 0, jump: app.jump, slide: app.slide };
    if (app.lanes.length) input.lane = app.lanes.shift();
    app.jump = false;
    app.slide = false;
    if (app.bot && app.sim) {
      var bot = EISH.oracle(app.sim);
      if (!input.lane) input.lane = bot.lane;
      input.jump = input.jump || bot.jump;
      input.slide = input.slide || bot.slide;
    }
    return input;
  }

  var last = 0;
  var bannerEl = $("banner");
  function loop(now) {
    var dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    app.time += dt;
    if (app.screen === "title" || app.screen === "how") app.menuT += dt * (app.reduced ? 1.5 : 7);
    if (app.screen === "play" && app.sim) {
      EISH.step(app.sim, dt, takeInput());
      var ev = app.sim.events;
      for (var i = 0; i < ev.length; i++) sfx(ev[i]);
      if (app.hint > 0) app.hint -= dt;
      if (!app.sim.alive || app.sim.finished) {
        rememberBest();
        app.screen = "over";
        music(false);
        paintUI();
      } else if (app.hint > 0 && app.hint < 0.05) paintUI();
    }
    var viewState = WORLD.frame(app);
    if (bannerEl) {
      var showBanner = app.screen === "play" && viewState && viewState.banner;
      bannerEl.hidden = !showBanner;
      if (showBanner) bannerEl.textContent = "OPEN ROBOT  " + viewState.banner;
    }
    if (app.screen === "play" && app.sim) {
      $("score").textContent = String(Math.floor(app.sim.score));
      var sub = app.sim.mode === "rush" ? (app.sim.fares + " fares") : app.sim.mode === "robot" ? (app.sim.routes + " robots") : (Math.floor(app.sim.dist) + " m");
      $("sub").textContent = sub + " · " + app.sim.coins + " coins";
      if (app.sim.mode === "rush") $("timer").textContent = Math.ceil(app.sim.timeLeft) + "s";
    }
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  paintUI();
  var boot = $("boot");
  if (boot) boot.hidden = true;
  if (q.play === "1") begin(app.mode);
  if (q.pause === "1") { begin(app.mode); app.screen = "pause"; paintUI(); }
  if (q.over === "1") {
    begin(app.mode);
    app.sim.score = 480;
    app.sim.dist = 320;
    app.sim.coins = 12;
    app.sim.alive = false;
    app.sim.finished = true;
    app.sim.reason = "hit";
    app.sim.win = false;
    rememberBest();
    app.screen = "over";
    paintUI();
  }
  if (q.freeze) {
    begin(app.mode);
    var secs = +q.freeze || 1;
    var left = secs;
    while (left > 0 && app.sim && app.sim.alive && !app.sim.finished) {
      var slice = Math.min(0.05, left);
      EISH.step(app.sim, slice, app.bot ? EISH.oracle(app.sim) : {});
      left -= slice;
    }
    app.screen = "play";
    app.bot = false;
    paintUI();
  }
  var live = $("live");
  setInterval(function () {
    if (!live) return;
    if (app.screen === "play" && app.sim) live.textContent = EISH.MODES[app.sim.mode].name + ", score " + Math.floor(app.sim.score);
    else live.textContent = app.screen;
  }, 1000);

  root.__EISH = app;
  requestAnimationFrame(loop);
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
