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
      cursor: 34,
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
// EISH! Jozi Run — illustrated cast and props. Original, not a likeness of any commercial runner.
// Next iteration: tweak CAST colours and the pose tables in cycleFrame(); keep the ink outline weight.
(function (root) {
  "use strict";
  var INK = "#241820";
  var LW = 7;
  var CAST = [
    {
      id: "lerato", name: "Lerato", place: "Braamfontein",
      line: "Teal tracksuit, coral bun. She takes the jump before the rank fills.",
      skin: "#c4845c", shade: "#8a5340", lite: "#efc09a", blush: "rgba(212,100,96,0.55)",
      hair: "#1b140f", band: "#ff6b4a", cloth: "#128f86", clothD: "#0c645e",
      accent: "#ff6b4a", pants: "#173632", shoe: "#f6f3ec", kick: "#ff6b4a", lip: "#b15d62",
      style: "bun"
    },
    {
      id: "jabu", name: "Jabu", place: "Yeoville",
      line: "Red golf shirt, khaki shorts. He slips the gap between the minibuses.",
      skin: "#e2ae80", shade: "#b67c4c", lite: "#f6d0b0", blush: "rgba(210,120,90,0.4)",
      hair: "#16120e", band: "#fffaf2", cloth: "#d4534a", clothD: "#a83632",
      accent: "#fffaf2", pants: "#c6a15a", shoe: "#f7f4ee", kick: "#d4534a", lip: "#c47a68",
      style: "fade"
    },
    {
      id: "naledi", name: "Naledi", place: "Maboneng",
      line: "A sun on her back, beads in her twists. She runs the streets she paints.",
      skin: "#6e3e2e", shade: "#4a271e", lite: "#94604e", blush: "rgba(168,80,74,0.45)",
      hair: "#140e0c", band: "#f0c14d", cloth: "#2d439e", clothD: "#1c2d74",
      accent: "#ffb703", pants: "#e2a12b", shoe: "#ff5d8f", kick: "#fffaf2", lip: "#8d4038",
      style: "twists", beads: ["#c46bdc", "#ffb703", "#ff6b4a", "#49c2b0"]
    }
  ];

  function ink(ctx, w) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = w == null ? LW : w;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }
  function fillStroke(ctx, fill, w) {
    ctx.fillStyle = fill;
    ctx.fill();
    ink(ctx, w == null ? 7 : w);
  }
  function taper(ctx, x1, y1, r1, x2, y2, r2) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    var ang = Math.atan2(dy, dx);
    var off = Math.atan2(r1 - r2, len);
    ctx.beginPath();
    ctx.arc(x1, y1, r1, ang + Math.PI / 2 + off, ang + (Math.PI * 3) / 2 - off, false);
    ctx.arc(x2, y2, r2, ang - Math.PI / 2 - off, ang + Math.PI / 2 + off, false);
    ctx.closePath();
  }
  function limb(ctx, x1, y1, r1, x2, y2, r2, fill, w) {
    taper(ctx, x1, y1, r1, x2, y2, r2);
    fillStroke(ctx, fill, w || 6.5);
  }
  function ellipse(ctx, x, y, rx, ry, fill, w, rot) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), rot || 0, 0, Math.PI * 2);
    fillStroke(ctx, fill, w == null ? 6 : w);
  }
  function eye(ctx, x, y, rx, ry, look) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fffaf4";
    ctx.fill();
    ink(ctx, 4);
    ctx.beginPath();
    ctx.ellipse(x + look, y + 1, rx * 0.62, ry * 0.68, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3a2418";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + look, y + 2, rx * 0.32, ry * 0.36, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a100c";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + look - rx * 0.22, y - ry * 0.18, Math.max(2, rx * 0.22), 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  function hairBehind(ctx, c, x, y) {
    // Sits behind the skull. Nothing here is allowed to cross the eyes.
    if (c.style === "bun") {
      ellipse(ctx, x + 4, y - 92, 38, 34, c.hair, LW * 0.8);
      ellipse(ctx, x + 4, y - 92, 20, 14, c.band, LW * 0.6);
    } else if (c.style === "twists") {
      var beads = c.beads;
      for (var i = 0; i < 8; i++) {
        var a = -2.6 + i * 0.62;
        var len = 46 + (i % 3) * 12;
        var x2 = x + Math.sin(a) * (len * 0.85);
        var y2 = y - 70 - Math.cos(a) * 10 - (i % 2) * 8;
        if (y2 > y - 36) continue;
        limb(ctx, x + Math.sin(a) * 18, y - 58, 7, x2, y2, 5, c.hair, LW * 0.55);
        ellipse(ctx, x2, y2, 6.5, 6.5, beads[i % beads.length], LW * 0.4);
      }
    }
  }

  function fringe(ctx, c, x, y) {
    // y is the head centre. Fringe stays above the brows.
    ctx.beginPath();
    if (c.style === "fade") {
      ctx.moveTo(x - 58, y - 18);
      ctx.quadraticCurveTo(x - 40, y - 78, x, y - 84);
      ctx.quadraticCurveTo(x + 48, y - 78, x + 60, y - 14);
      ctx.quadraticCurveTo(x + 20, y - 42, x - 10, y - 28);
      ctx.quadraticCurveTo(x - 36, y - 8, x - 58, y - 18);
    } else if (c.style === "bun") {
      ctx.moveTo(x - 62, y - 8);
      ctx.quadraticCurveTo(x - 66, y - 70, x - 10, y - 78);
      ctx.quadraticCurveTo(x + 20, y - 88, x + 48, y - 60);
      ctx.quadraticCurveTo(x + 58, y - 20, x + 40, y - 16);
      ctx.quadraticCurveTo(x + 8, y - 48, x - 24, y - 36);
      ctx.quadraticCurveTo(x - 48, y - 18, x - 62, y - 8);
    } else {
      ctx.moveTo(x - 54, y - 6);
      ctx.quadraticCurveTo(x - 40, y - 70, x + 10, y - 74);
      ctx.quadraticCurveTo(x + 52, y - 60, x + 48, y - 16);
      ctx.quadraticCurveTo(x + 10, y - 40, x - 20, y - 28);
      ctx.quadraticCurveTo(x - 44, y - 10, x - 54, y - 6);
    }
    ctx.fillStyle = c.hair;
    ctx.fill();
    ink(ctx, LW * 0.75);
  }

  function brow(ctx, c, x, y, dir, arch) {
    ctx.beginPath();
    ctx.moveTo(x - 16 * dir, y);
    ctx.quadraticCurveTo(x, y - arch, x + 16 * dir, y + 1);
    ctx.strokeStyle = c.hair;
    ctx.lineWidth = c.style === "fade" ? 5 : 4;
    ctx.stroke();
  }

  function smile(ctx, c, x, y, wide) {
    ctx.beginPath();
    ctx.moveTo(x - wide, y);
    ctx.quadraticCurveTo(x, y + wide * 0.7, x + wide, y - (c.style === "fade" ? 2 : 0));
    ctx.strokeStyle = c.shade;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - wide + 3, y + 1);
    ctx.quadraticCurveTo(x, y + wide * 0.55, x + wide - 3, y + 1);
    ctx.lineTo(x + wide - 6, y + 2);
    ctx.quadraticCurveTo(x, y + 8, x - wide + 6, y + 2);
    ctx.fillStyle = c.lip;
    ctx.fill();
    if (wide > 16) {
      ctx.fillStyle = "#fffaf4";
      ctx.fillRect(x - 8, y + 1, 16, 4);
    }
  }

  function shoe(ctx, x, y, angle, c, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-16, -8);
    ctx.quadraticCurveTo(-18, 8, -6, 12);
    ctx.lineTo(28, 10);
    ctx.quadraticCurveTo(40, 8, 36, -2);
    ctx.quadraticCurveTo(20, -14, -16, -8);
    ctx.closePath();
    fillStroke(ctx, c.shoe, 5);
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(30, 7);
    ctx.lineTo(28, 12);
    ctx.lineTo(-10, 12);
    ctx.fillStyle = INK;
    ctx.fill();
    ctx.fillStyle = c.kick;
    ctx.fillRect(-4, -6, 22, 6);
    ctx.restore();
  }

  // Offsets from the hip / shoulder: +y is down the sprite. A run is a high knee and a long back leg.
  function cycleFrame(i) {
    var t = [
      { l: [18, 78, 26, 188], r: [-10, 118, -28, 210], la: -0.7, ra: 0.55, bob: 0 },
      { l: [8, 96, 12, 198], r: [4, 100, 8, 190], la: -0.15, ra: 0.1, bob: 12 },
      { l: [-16, 70, -30, 36], r: [20, 72, 28, 176], la: 0.5, ra: -0.65, bob: 2 },
      { l: [-8, 108, -18, 150], r: [22, 64, 30, 168], la: 0.7, ra: -0.5, bob: -14 },
      { l: [6, 100, 10, 196], r: [10, 92, 14, 186], la: 0.1, ra: -0.12, bob: 10 },
      { l: [22, 68, 30, 170], r: [-14, 64, -26, 40], la: -0.55, ra: 0.6, bob: -4 }
    ];
    return t[i % 6];
  }

  function drawRunner(ctx, who, pose, frame) {
    var c = CAST[who];
    var f = pose === "run" ? cycleFrame(frame || 0) : { l: [14, 100, 18, 200], r: [14, 100, 22, 200], la: 0.1, ra: 0.1, bob: 0 };
    if (pose === "jump") f = { l: [22, 36, 10, 8], r: [24, 40, 36, 12], la: -1.05, ra: -0.95, bob: -28 };
    if (pose === "slide") f = { l: [34, 46, 78, 78], r: [-6, 70, 10, 120], la: 0.2, ra: 1.15, bob: 78 };
    if (pose === "hit") f = { l: [6, 110, 8, 200], r: [-20, 90, -36, 170], la: -1.2, ra: -0.7, bob: 10 };
    var bob = f.bob;
    var hipY = (pose === "slide" ? -168 : -248) + bob;
    var shY = (pose === "slide" ? -300 : -390) + bob;
    var hx = pose === "slide" ? 16 : 0;
    function leg(side, off) {
      var hx0 = (side === "l" ? -26 : 26) + hx;
      var kx = hx0 + off[0], ky = hipY + off[1];
      var fx = hx0 + off[2], fy = hipY + off[3];
      limb(ctx, hx0, hipY, side === "l" ? 22 : 20, kx, ky, 14, c.pants, LW * 0.75);
      limb(ctx, kx, ky, 13, fx, fy, 8, c.skin, LW * 0.65);
      shoe(ctx, fx, fy, side === "l" ? -0.15 : 0.2, c);
    }
    function arm(side, ang) {
      var sx = side === "l" ? -56 : 56;
      var elx = sx + Math.sin(ang) * 36;
      var ely = shY + 78;
      var hx2 = sx + Math.sin(ang) * 70;
      var hy = shY + 150;
      if (pose === "jump") hy = shY + 20;
      if (pose === "slide" && side === "r") { ely = shY + 90; hy = shY + 130; }
      limb(ctx, sx, shY + 16, 16, elx, ely, 12, c.cloth, LW * 0.7);
      limb(ctx, elx, ely, 11, hx2, hy, 9, c.skin, LW * 0.6);
    }
    var backLeg = f.l[1] > f.r[1] ? "l" : "r";
    if (backLeg === "l") { leg("l", f.l); arm("l", f.la); }
    else { leg("r", f.r); arm("r", f.ra); }
    // torso
    ctx.beginPath();
    ctx.moveTo(-62, shY);
    ctx.quadraticCurveTo(-70, shY + 40, -48, hipY + 10);
    ctx.lineTo(48, hipY + 10);
    ctx.quadraticCurveTo(70, shY + 40, 62, shY);
    ctx.quadraticCurveTo(0, shY - 18, -62, shY);
    fillStroke(ctx, c.cloth, 7);
    ctx.beginPath();
    ctx.moveTo(-48, hipY + 4);
    ctx.lineTo(48, hipY + 4);
    ctx.lineTo(40, hipY + 36);
    ctx.lineTo(-40, hipY + 36);
    ctx.fillStyle = c.pants;
    ctx.fill();
    if (c.style === "bun") {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-50, shY + 36, 100, 16);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.strokeRect(-50, shY + 36, 100, 16);
    } else if (c.style === "twists") {
      ctx.beginPath();
      ctx.arc(0, shY + 70, 28, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ink(ctx, 4);
      ctx.beginPath();
      ctx.arc(0, shY + 70, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#fff4d0";
      ctx.fill();
    } else {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-20, shY + 8, 40, 14);
    }
    // near limbs
    if (backLeg === "l") { leg("r", f.r); arm("r", f.ra); }
    else { leg("l", f.l); arm("l", f.la); }
    // neck + head from behind, a sliver of cheek
    limb(ctx, 0, shY + 6, 14, 8, shY - 36, 12, c.skin, LW * 0.7);
    hairBehind(ctx, c, 0, shY - 70);
    ellipse(ctx, 4, shY - 86, 56, 62, c.skin, LW * 0.85);
    // One ear and a sliver of cheek — the runner is seen from behind, not as a blank oval.
    ellipse(ctx, 48, shY - 84, 12, 16, c.skin, LW * 0.55);
    fringe(ctx, c, 0, shY - 78);
    if (c.style !== "twists") {
      eye(ctx, 26, shY - 90, 6, 7, 1);
      brow(ctx, c, 26, shY - 104, 1, 5);
    }
    if (pose === "hit") {
      ctx.beginPath();
      ctx.arc(24, shY - 70, 6, 0, Math.PI);
      ctx.strokeStyle = c.shade;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function drawHero(ctx, who, blink) {
    var c = CAST[who];
    var shY = -400, hipY = -250;
    // back arm on hip
    limb(ctx, -70, shY + 20, 18, -92, hipY + 10, 12, c.cloth, 6);
    limb(ctx, -92, hipY + 10, 11, -78, hipY + 28, 11, c.skin, 5);
    // legs
    limb(ctx, -32, hipY, 24, -40, -20, 14, c.pants, 6);
    limb(ctx, 32, hipY, 24, 44, -18, 14, c.pants, 6);
    limb(ctx, -40, -20, 13, -46, 4, 9, c.skin, 5);
    limb(ctx, 44, -18, 13, 52, 4, 9, c.skin, 5);
    shoe(ctx, -46, 2, -0.15, c);
    shoe(ctx, 54, 2, 0.2, c);
    // torso
    ctx.beginPath();
    ctx.moveTo(-78, shY);
    ctx.quadraticCurveTo(-86, -340, -52, hipY);
    ctx.quadraticCurveTo(0, hipY + 28, 52, hipY);
    ctx.quadraticCurveTo(86, -340, 78, shY);
    ctx.quadraticCurveTo(0, shY - 24, -78, shY);
    fillStroke(ctx, c.cloth, LW);
    ctx.beginPath();
    ctx.moveTo(18, shY + 8);
    ctx.quadraticCurveTo(70, -330, 40, hipY - 6);
    ctx.lineTo(8, hipY - 6);
    ctx.quadraticCurveTo(24, -340, 8, shY + 20);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();
    if (c.style === "bun") {
      ctx.fillStyle = "#f4f1ea";
      ctx.beginPath();
      ctx.moveTo(-22, shY + 8);
      ctx.lineTo(22, shY + 8);
      ctx.lineTo(14, shY + 48);
      ctx.lineTo(-14, shY + 48);
      ctx.fill();
      ctx.fillStyle = c.accent;
      ctx.fillRect(-56, shY + 52, 112, 18);
    } else if (c.style === "fade") {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-28, shY + 6, 56, 16);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.strokeRect(-28, shY + 6, 56, 16);
      ctx.fillStyle = c.accent;
      ctx.fillRect(-70, shY + 28, 16, 36);
      ctx.fillRect(54, shY + 28, 16, 36);
    } else {
      ctx.beginPath();
      ctx.arc(0, shY + 58, 26, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ink(ctx, 4);
      ctx.beginPath();
      ctx.arc(-6, shY + 52, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff6d4";
      ctx.fill();
      ctx.fillStyle = c.accent;
      ctx.fillRect(-74, shY + 8, 148, 12);
    }
    // near arm relaxed
    limb(ctx, 74, shY + 16, 18, 96, -300, 13, c.cloth, 6);
    limb(ctx, 96, -300, 12, 88, -230, 11, c.skin, 5);
    // neck, ears, head
    limb(ctx, 0, shY + 4, 16, 0, shY - 34, 14, c.skin, LW * 0.7);
    hairBehind(ctx, c, 0, -470);
    ellipse(ctx, -66, -478, 13, 18, c.skin, LW * 0.6);
    ellipse(ctx, 66, -478, 13, 18, c.skin, LW * 0.6);
    ellipse(ctx, 0, -486, 62, 70, c.skin, LW);
    // blush
    ctx.fillStyle = c.blush;
    ctx.beginPath();
    ctx.ellipse(-28, -460, 14, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(30, -460, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (c.style === "twists") {
      ctx.beginPath();
      ctx.ellipse(36, -452, 10, 6, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#49c2b0";
      ctx.fill();
    }
    var look = blink ? 0 : 2;
    var eyeRy = blink ? 2 : (c.style === "fade" ? 13 : 15);
    eye(ctx, -26, -500, 14, eyeRy, look);
    eye(ctx, 28, -500, c.style === "naledi" || c.style === "twists" ? 15 : 13, eyeRy, look);
    var arch = c.style === "fade" ? 4 : c.style === "twists" ? 12 : 8;
    brow(ctx, c, -26, -524, 1, arch);
    brow(ctx, c, 28, -524, 1, arch + (c.style === "fade" ? 0 : 2));
    // nose
    ctx.beginPath();
    if (c.style === "fade") {
      ctx.moveTo(0, -492);
      ctx.quadraticCurveTo(14, -470, 0, -464);
      ctx.quadraticCurveTo(-14, -470, 0, -492);
      ctx.fillStyle = c.shade;
      ctx.fill();
    } else {
      ctx.moveTo(0, -488);
      ctx.quadraticCurveTo(10, -472, 0, -468);
      ctx.strokeStyle = c.shade;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    smile(ctx, c, 2, -444, c.style === "fade" ? 20 : 16);
    fringe(ctx, c, 0, -486);
    if (c.style === "bun") ellipse(ctx, 70, -470, 5, 7, "#f0c14d", LW * 0.4);
    if (c.style === "fade") ellipse(ctx, -70, -470, 5, 7, "#f0c14d", LW * 0.4);
  }

  function shadow(ctx, x, y, rx, ry) {
    ctx.save();
    ctx.fillStyle = "rgba(36,24,32,0.28)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function paintRunner(ctx, who, pose, frame, x, footY, height) {
    var sc = height / 540;
    LW = Math.max(6, 3.4 / sc);
    ctx.save();
    ctx.translate(x, footY);
    ctx.scale(sc, sc);
    if (pose === "hero") drawHero(ctx, who, false);
    else drawRunner(ctx, who, pose, frame);
    ctx.restore();
  }

  function paintHeroBlink(ctx, who, x, footY, height, blink) {
    var sc = height / 540;
    LW = Math.max(6, 3.6 / sc);
    ctx.save();
    ctx.translate(x, footY);
    ctx.scale(sc, sc);
    drawHero(ctx, who, blink);
    ctx.restore();
  }

  function taxi(ctx, w, h, stripe) {
    var x = -w / 2, y = -h;
    // wheels
    ellipse(ctx, x + w * 0.22, -h * 0.08, w * 0.12, h * 0.1, "#2a2428", 4);
    ellipse(ctx, x + w * 0.78, -h * 0.08, w * 0.12, h * 0.1, "#2a2428", 4);
    ctx.beginPath();
    rrPath(ctx, x, y + h * 0.08, w, h * 0.78, 12);
    fillStroke(ctx, "#f7f4ee", 6);
    ctx.fillStyle = stripe || "#1f8f5a";
    ctx.fillRect(x + 6, y + h * 0.38, w - 12, h * 0.12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 6, y + h * 0.38, w - 12, h * 0.12);
    // rear window
    ctx.beginPath();
    rrPath(ctx, x + w * 0.12, y + h * 0.16, w * 0.76, h * 0.2, 6);
    fillStroke(ctx, "#243044", 4);
    ctx.fillStyle = "rgba(255,244,220,0.35)";
    for (var i = 0; i < 3; i++) ctx.fillRect(x + w * (0.22 + i * 0.2), y + h * 0.2, w * 0.08, h * 0.1);
    // lights
    ctx.fillStyle = "#e23b3b";
    ctx.fillRect(x + 8, y + h * 0.62, w * 0.14, h * 0.08);
    ctx.fillRect(x + w - w * 0.14 - 8, y + h * 0.62, w * 0.14, h * 0.08);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(x + w * 0.34, y + h * 0.78, w * 0.32, h * 0.1);
    ctx.strokeRect(x + w * 0.34, y + h * 0.78, w * 0.32, h * 0.1);
    ctx.fillStyle = INK;
    ctx.font = "700 " + Math.max(10, h * 0.07) + "px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GP", 0, y + h * 0.86);
  }

  function rrPath(ctx, x, y, w, h, r) {
    var r2 = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r2, y);
    ctx.arcTo(x + w, y, x + w, y + h, r2);
    ctx.arcTo(x + w, y + h, x, y + h, r2);
    ctx.arcTo(x, y + h, x, y, r2);
    ctx.arcTo(x, y, x + w, y, r2);
    ctx.closePath();
  }

  function drums(ctx, w, h) {
    function drum(x, col, stripe) {
      ctx.beginPath();
      rrPath(ctx, x, -h, w * 0.42, h * 0.92, 8);
      fillStroke(ctx, col, 5);
      ctx.fillStyle = stripe;
      ctx.fillRect(x + 4, -h * 0.72, w * 0.42 - 8, h * 0.12);
      ctx.fillRect(x + 4, -h * 0.4, w * 0.42 - 8, h * 0.12);
    }
    drum(-w * 0.46, "#f08a24", "#fffaf2");
    drum(w * 0.04, "#2a6fbf", "#fffaf2");
  }

  function barrier(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w * 0.32, -h);
    ctx.lineTo(w * 0.32, -h);
    ctx.lineTo(w / 2, 0);
    ctx.closePath();
    fillStroke(ctx, "#d9d3c8", 6);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(-w * 0.22, -h * 0.62, w * 0.44, h * 0.16);
  }

  function pothole(ctx, w, h) {
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.2, w * 0.46, h * 0.36, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1614";
    ctx.fill();
    ink(ctx, 5);
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.28, w * 0.28, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3a342e";
    ctx.fill();
  }

  function scaffold(ctx, w, h) {
    ctx.fillStyle = "#c9ccd1";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.fillRect(-w / 2, -h, 10, h);
    ctx.strokeRect(-w / 2, -h, 10, h);
    ctx.fillRect(w / 2 - 10, -h, 10, h);
    ctx.strokeRect(w / 2 - 10, -h, 10, h);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(-w / 2, -h * 0.72, w, 16);
    ctx.strokeRect(-w / 2, -h * 0.72, w, 16);
    ctx.fillStyle = "#e23b3b";
    for (var i = 0; i < 4; i++) ctx.fillRect(-w / 2 + 8 + i * (w / 4), -h * 0.7, w / 10, 10);
  }

  function signBoard(ctx, w, h) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, -h);
    ctx.lineTo(-w * 0.2, -h * 0.62);
    ctx.moveTo(w * 0.2, -h);
    ctx.lineTo(w * 0.2, -h * 0.62);
    ctx.stroke();
    ctx.beginPath();
    rrPath(ctx, -w / 2, -h * 0.62, w, h * 0.28, 8);
    fillStroke(ctx, "#fffaf2", 5);
    ctx.fillStyle = "#d4534a";
    ctx.font = "800 " + Math.max(12, h * 0.12) + "px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPAZA", 0, -h * 0.44);
  }

  function branch(ctx, w, h) {
    limb(ctx, w * 0.35, -h, 8, -w * 0.1, -h * 0.55, 5, "#6b4a32", 4);
    ellipse(ctx, -w * 0.05, -h * 0.58, w * 0.28, h * 0.16, "#b06cc8", 4);
    ellipse(ctx, w * 0.12, -h * 0.7, w * 0.18, h * 0.1, "#d7a4e2", 3);
    ellipse(ctx, -w * 0.22, -h * 0.5, w * 0.14, h * 0.08, "#8e44ad", 3);
  }

  function boom(ctx, w, h, open, colour) {
    // robot pole
    ctx.fillStyle = "#2c3138";
    ctx.fillRect(w * 0.28, -h, 10, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.28, -h, 10, h);
    var lights = ["#5a3030", "#5a5030", "#24543a"];
    if (open) lights[2] = "#1fa971";
    else lights[0] = "#e23b3b";
    for (var i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.28 + 5, -h + 16 + i * 16, 6, 0, Math.PI * 2);
      ctx.fillStyle = lights[i];
      ctx.fill();
    }
    ctx.save();
    ctx.translate(-w * 0.05, -h * 0.62);
    if (open) ctx.rotate(-1.15);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(0, -7, w * 0.7, 14);
    ctx.strokeStyle = INK;
    ctx.strokeRect(0, -7, w * 0.7, 14);
    ctx.fillStyle = INK;
    for (var k = 0; k < 4; k++) ctx.fillRect(8 + k * 18, -7, 8, 14);
    ctx.restore();
    if (colour) {
      ctx.fillStyle = colour;
      ctx.fillRect(-w * 0.45, -h * 0.95, 16, 10);
    }
  }

  function fare(ctx, w, h, variant, wave) {
    var shirts = ["#ffb703", "#49c2b0", "#d4534a"];
    var col = shirts[variant % 3];
    var arm = Math.sin(wave) * 0.6;
    limb(ctx, -8, -h * 0.28, h * 0.08, -16, -4, h * 0.045, "#3d6ea8", 4);
    limb(ctx, 10, -h * 0.28, h * 0.08, 18, -4, h * 0.045, "#3d6ea8", 4);
    limb(ctx, 0, -h * 0.78, h * 0.1, 0, -h * 0.32, h * 0.12, col, 4);
    limb(ctx, 18, -h * 0.7, h * 0.05, 26 + arm * 20, -h * (0.92 + arm * 0.1), h * 0.045, "#e2ae80", 3);
    ellipse(ctx, 0, -h * 0.9, h * 0.13, h * 0.14, "#6e3e2e", 4);
    ellipse(ctx, 0, -h * 1.02, h * 0.14, h * 0.08, "#1b140f", 3);
  }

  function coin(ctx, r) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#f0c14d";
    ctx.fill();
    ink(ctx, 3);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = "#a97820";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function shield(ctx, r) {
    var cols = ["#fffaf2", "#d4534a", "#2d439e", "#128f86", "#ffb703"];
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = cols[i % cols.length];
      ctx.fill();
      ink(ctx, 2);
    }
  }

  function kota(ctx, w, h) {
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    fillStroke(ctx, "#e6c48a", 4);
    ctx.fillStyle = "#f2d15a";
    ctx.fillRect(-w * 0.28, -h * 0.08, w * 0.56, h * 0.12);
    ctx.fillStyle = "#d4534a";
    ctx.fillRect(-w * 0.28, -h * 0.22, w * 0.56, h * 0.1);
    ctx.fillStyle = "#3d8f45";
    ctx.fillRect(-w * 0.22, -h * 0.32, w * 0.2, h * 0.08);
  }

  function prop(ctx, kind, variant, w, h, extra) {
    if (kind === "block") taxi(ctx, w, h, extra || "#1f8f5a");
    else if (kind === "low" && variant === 1) barrier(ctx, w, h);
    else if (kind === "low" && variant === 2) pothole(ctx, w, h);
    else if (kind === "low") drums(ctx, w, h);
    else if (kind === "high" && variant === 1) signBoard(ctx, w, h);
    else if (kind === "high" && variant === 2) branch(ctx, w, h);
    else if (kind === "high") scaffold(ctx, w, h);
    else if (kind === "boom") boom(ctx, w, h, extra && extra.open, extra && extra.colour);
    else if (kind === "fare") fare(ctx, w, h, variant, extra || 0);
    else if (kind === "coin") coin(ctx, w);
    else if (kind === "shield") shield(ctx, w);
    else if (kind === "kota") kota(ctx, w, h);
  }

  root.ART = {
    INK: INK,
    CAST: CAST,
    paintRunner: paintRunner,
    paintHeroBlink: paintHeroBlink,
    prop: prop,
    shadow: shadow,
    rrPath: rrPath
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
// EISH! Jozi Run — street, camera, HUD. Perspective is in metres; EISH.LANE_X stays the source of lane positions.
// Next iteration: camera() owns the framing. Building styles live in facade().
(function (root) {
  "use strict";
  var ART = root.ART;
  var INK = "#241820";
  var STRIPES = ["#1f8f5a", "#2a6fbf", "#d4534a", "#e2a12b", "#7a4ad4"];
  var ROAD_X = 1.78;
  var BUILD_X = 2.25;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function hsh(n) {
    n = (n | 0) * 374761393 + 668265263 | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function rr(ctx, x, y, w, h, r) {
    ART.rrPath(ctx, x, y, w, h, r);
  }
  function font(ctx, px, weight) {
    ctx.font = (weight || "700") + " " + px + "px \"Trebuchet MS\", Verdana, sans-serif";
  }

  function camera(W, H, top, bot) {
    var horizon = Math.round(H * 0.34);
    var scale = (W * 0.5 - Math.max(10, W * 0.03)) / 1.88;
    scale = clamp(scale, 68, 148);
    var feetY = Math.min(H * 0.8, H - bot - 18);
    var camH = (feetY - horizon) / scale;
    if (camH < 1.85) {
      horizon = Math.round(feetY - 1.9 * scale);
      camH = 1.9;
    }
    return { W: W, H: H, top: top, bot: bot, horizon: horizon, feetY: feetY, scale: scale, camH: camH, camDist: 8.2, focal: scale * 8.2 };
  }
  function project(cam, x, y, zDist) {
    var s = cam.focal / Math.max(0.45, zDist);
    return { x: cam.W * 0.5 + x * s, y: cam.horizon + (cam.camH - y) * s, s: s };
  }
  function zOf(travel, worldZ, cam) { return (worldZ - travel) + cam.camDist; }

  function sky(ctx, cam, travel) {
    var g = ctx.createLinearGradient(0, 0, 0, cam.horizon + 40);
    g.addColorStop(0, "#5eafd4");
    g.addColorStop(0.42, "#f09a62");
    g.addColorStop(0.78, "#f6c98a");
    g.addColorStop(1, "#ffe0b0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cam.W, cam.H);
    var sunX = cam.W * 0.78, sunY = cam.horizon * 0.42;
    var rg = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, cam.W * 0.28);
    rg.addColorStop(0, "rgba(255,236,180,0.95)");
    rg.addColorStop(1, "rgba(255,236,180,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sunX, sunY, cam.W * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,250,242,0.55)";
    var drift = (travel * 0.15) % (cam.W + 200);
    ctx.beginPath();
    ctx.ellipse(80 - drift * 0.05, cam.horizon * 0.28, 70, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(cam.W * 0.3 - drift * 0.08, cam.horizon * 0.18, 90, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // mine dumps and a cable bridge — skyline cues, not labelled landmarks
    ctx.fillStyle = "#e7b08a";
    ctx.beginPath();
    ctx.moveTo(0, cam.horizon);
    ctx.quadraticCurveTo(cam.W * 0.12, cam.horizon - 48, cam.W * 0.22, cam.horizon);
    ctx.quadraticCurveTo(cam.W * 0.3, cam.horizon - 28, cam.W * 0.4, cam.horizon);
    ctx.lineTo(0, cam.horizon);
    ctx.fill();
    var bx = cam.W * 0.12 + Math.sin(travel * 0.002) * 4;
    ctx.fillStyle = "#c98462";
    ctx.fillRect(bx, cam.horizon - 110, 28, 110);
    ctx.beginPath();
    ctx.ellipse(bx + 14, cam.horizon - 110, 18, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#b87458";
    ctx.fill();
    ctx.strokeStyle = "rgba(60,40,48,0.35)";
    ctx.lineWidth = 2;
    var p1 = cam.W * 0.58, p2 = cam.W * 0.86;
    ctx.beginPath();
    ctx.moveTo(p1, cam.horizon);
    ctx.lineTo(p1 + 10, cam.horizon - 70);
    ctx.lineTo(p2, cam.horizon);
    ctx.stroke();
    for (var i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(p1 + 10, cam.horizon - 68);
      ctx.lineTo(p1 + 20 + i * 18, cam.horizon);
      ctx.stroke();
    }
  }

  function ground(ctx, cam) {
    function quad(x0, x1, z0, z1) {
      var a = project(cam, x0, 0, z0), b = project(cam, x1, 0, z0);
      var c = project(cam, x1, 0, z1), d = project(cam, x0, 0, z1);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
      ctx.closePath();
    }
    quad(-6, 6, 3.1, 92);
    ctx.fillStyle = "#d7c3a4";
    ctx.fill();
    quad(-ROAD_X, ROAD_X, 3.1, 92);
    var g = ctx.createLinearGradient(0, cam.horizon, 0, cam.H);
    g.addColorStop(0, "#6a625c");
    g.addColorStop(0.35, "#4a4541");
    g.addColorStop(1, "#3a342f");
    ctx.fillStyle = g;
    ctx.fill();
    // kerb
    quad(-ROAD_X - 0.08, -ROAD_X, 3.2, 70);
    quad(ROAD_X, ROAD_X + 0.08, 3.2, 70);
    ctx.fillStyle = "#efe6d4";
    ctx.fill();
    // yellow kerb line, the way a Jozi lane edge is painted
    quad(-ROAD_X, -ROAD_X + 0.06, 3.4, 64);
    quad(ROAD_X - 0.06, ROAD_X, 3.4, 64);
    ctx.fillStyle = "rgba(240,193,77,0.9)";
    ctx.fill();
  }

  function markings(ctx, cam, travel, sim) {
    var step = 5;
    var z0 = Math.floor((travel - 6) / step) * step;
    for (var z = z0; z < travel + 72; z += step) {
      var d0 = zOf(travel, z, cam);
      if (d0 < 3.4) continue;
      var d1 = d0 + 2.1;
      for (var side = -1; side <= 1; side += 2) {
        var x = side * 0.52;
        var a = project(cam, x - 0.05, 0, d0), b = project(cam, x + 0.05, 0, d0);
        var c = project(cam, x + 0.05, 0, d1), d = project(cam, x - 0.05, 0, d1);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(244,239,228,0.85)";
        ctx.fill();
      }
    }
    if (!sim) return;
    // Tell the verb in the road itself: chevrons ahead of the next obstacle in each lane.
    for (var lane = 0; lane < 3; lane++) {
      var nxt = null;
      for (var i = 0; i < sim.ents.length; i++) {
        var e = sim.ents[i];
        if (e.dead || e.kind !== "obs" || e.lane !== lane) continue;
        if (e.z < sim.travel) continue;
        if (!nxt || e.z < nxt.z) nxt = e;
      }
      if (!nxt) continue;
      var col = nxt.verb === "low" ? "rgba(240,193,77,0.9)" : nxt.verb === "high" ? "rgba(90,170,220,0.9)" : "rgba(226,70,60,0.75)";
      var lx = root.EISH.LANE_X[lane];
      for (var k = 1; k <= 3; k++) {
        var zz = nxt.z - 2.2 * k;
        if (zz < sim.travel + 1) continue;
        var dd = zOf(sim.travel, zz, cam);
        var p = project(cam, lx, 0, dd);
        var s = p.s;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 8 * (s / cam.scale));
        ctx.lineTo(p.x + 10 * (s / cam.scale), p.y + 6 * (s / cam.scale));
        ctx.lineTo(p.x - 10 * (s / cam.scale), p.y + 6 * (s / cam.scale));
        ctx.fill();
      }
    }
  }

  function facade(ctx, cam, travel, side, index) {
    var zNear = index * 13;
    var depth = 7.5 + hsh(index + side * 19) * 4;
    var zFar = zNear + depth;
    var dNear = zOf(travel, zNear, cam);
    var dFar = zOf(travel, zFar, cam);
    if (dFar < 2.2) return;
    var height = 5 + hsh(index + 5) * 14;
    if (index % 11 === 3) height += 8;
    var inner = side * BUILD_X;
    var outer = side * (BUILD_X + 3.4);
    var style = (Math.abs(index) + (side < 0 ? 1 : 0)) % 5;
    var cols = ["#e7d3b0", "#d9825a", "#c9c3b8", "#f3e6c4", "#5e6a73"];
    var col = cols[style];
    function face(x0, zA, x1, zB, y0, y1, color) {
      var a = project(cam, x0, y0, zA), b = project(cam, x1, y0, zB);
      var c = project(cam, x1, y1, zB), d = project(cam, x0, y1, zA);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    var shade = style === 2 ? "#b7b1a6" : "#cbb89a";
    if (dFar > 2) face(inner, dFar, inner, Math.max(dNear, 2.3), 0, height, col);
    if (dNear > 2) face(inner, dNear, outer, dNear, 0, height * 0.92, shade);
    // windows on the road face
    if (style !== 4 && dNear < 60) {
      var rows = Math.min(10, Math.floor(height / 1.35));
      var colsN = 4;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < colsN; c++) {
          var wz = zFar - 0.8 - c * (depth / (colsN + 0.2));
          var wy = 1.5 + r * 1.25;
          var wd = zOf(travel, wz, cam);
          if (wd < 3) continue;
          var p = project(cam, inner, wy, wd);
          var ww = Math.min(18, 0.34 * p.s), hh = Math.min(22, 0.42 * p.s);
          if (hh < 4 || ww < 3) continue;
          var lit = hsh(index * 31 + r * 7 + c) > 0.78;
          ctx.fillStyle = lit ? "#ffe1a0" : "#243044";
          ctx.fillRect(p.x - ww / 2, p.y - hh / 2, ww, hh);
        }
      }
    }
    if (style === 4 && dNear > 2 && dNear < 40) {
      var muralZ = (zNear + zFar) * 0.5;
      var md = zOf(travel, muralZ, cam);
      var mp = project(cam, inner, height * 0.55, md);
      var ms = mp.s;
      ctx.fillStyle = "#ffb703";
      ctx.beginPath();
      ctx.arc(mp.x, mp.y, 1.1 * ms, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#128f86";
      ctx.beginPath();
      ctx.moveTo(mp.x - 1.4 * ms, mp.y + 0.8 * ms);
      ctx.lineTo(mp.x, mp.y - 1.3 * ms);
      ctx.lineTo(mp.x + 1.4 * ms, mp.y + 0.8 * ms);
      ctx.fill();
      ctx.fillStyle = "#d4534a";
      ctx.fillRect(mp.x - 0.4 * ms, mp.y + 0.9 * ms, 0.8 * ms, 1.1 * ms);
    }
    if (dNear > 6 && dNear < 18 && hsh(index + 4) > 0.45) {
      var names = ["KOTA", "RANK", "SHARP", "BEADS"];
      var awnings = ["#d4534a", "#128f86", "#ffb703", "#7a4ad4"];
      var shop = project(cam, inner, 2.1, dNear);
      if (shop.x > 36 && shop.x < cam.W - 36) {
        var aw = Math.min(78, Math.max(28, 0.7 * shop.s));
        ctx.fillStyle = awnings[Math.abs(index) % awnings.length];
        ctx.fillRect(shop.x - aw * 0.5, shop.y, aw, 12);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        ctx.strokeRect(shop.x - aw * 0.5, shop.y, aw, 12);
        ctx.fillStyle = "#fffaf2";
        ctx.font = "700 11px Trebuchet MS, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(names[Math.abs(index) % names.length], shop.x, shop.y - 3);
      }
    }
    if (hsh(index + 11) > 0.35 && dNear > 3 && dNear < 34) {
      var treeZ = zNear + 1;
      var td = zOf(travel, treeZ, cam);
      var base = project(cam, side * (ROAD_X + 0.16), 0, td);
      var top = project(cam, side * (ROAD_X + 0.16), 3.2, td);
      ctx.strokeStyle = "#6b4a32";
      ctx.lineWidth = Math.max(2, 0.12 * base.s);
      ctx.beginPath();
      ctx.moveTo(base.x, base.y);
      ctx.lineTo(top.x, top.y);
      ctx.stroke();
      var blobs = [[0, 0, 1.05, 0.62, "#9b59b6"], [0.35, -0.25, 0.7, 0.42, "#d7a4e2"], [-0.4, -0.1, 0.62, 0.4, "#7d3c98"]];
      for (var b = 0; b < blobs.length; b++) {
        ctx.fillStyle = blobs[b][4];
        ctx.beginPath();
        ctx.ellipse(top.x + blobs[b][0] * top.s, top.y + blobs[b][1] * top.s, blobs[b][2] * top.s * 0.55, blobs[b][3] * top.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawEnt(ctx, cam, travel, e, time) {
    // Drop props once they pass the runner so a boom does not fill the foreground.
    if (e.z < travel - 0.35) return;
    var dist = zOf(travel, e.z, cam);
    if (dist < 5.8 || dist > 88) return;
    if (e.kind === "gate") {
      for (var lane = 0; lane < 3; lane++) {
        var open = lane === e.lane;
        var gp = project(cam, root.EISH.LANE_X[lane], 0, dist);
        ctx.save();
        ctx.translate(gp.x, gp.y);
        ART.prop(ctx, "boom", 0, 1.15 * gp.s, 2.15 * gp.s, { open: open, colour: open ? "#1fa971" : "#e23b3b" });
        ctx.restore();
      }
      return;
    }
    var p = project(cam, e.x, e.y || 0, dist);
    ctx.save();
    ctx.translate(p.x, p.y);
    if (e.kind === "coin") {
      var spin = Math.max(0.25, Math.abs(Math.sin(time * 6 + e.z)));
      ctx.scale(spin, 1);
      ART.prop(ctx, "coin", 0, 0.2 * p.s, 0, null);
    } else if (e.kind === "shield") {
      ctx.translate(0, -0.9 * p.s);
      ART.prop(ctx, "shield", 0, 0.28 * p.s, 0, null);
    } else if (e.kind === "kota") {
      ctx.translate(0, -0.45 * p.s);
      ART.prop(ctx, "kota", 0, 0.55 * p.s, 0.36 * p.s, null);
    } else if (e.kind === "fare") {
      var ring = project(cam, e.x, 0, dist);
      ctx.restore();
      ctx.beginPath();
      ctx.ellipse(ring.x, ring.y, 0.4 * ring.s, 0.12 * ring.s, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(240,193,77,0.9)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.save();
      ctx.translate(p.x, p.y);
      ART.prop(ctx, "fare", e.variant, 0.7 * p.s, 1.6 * p.s, time * 6 + e.z);
    } else if (e.kind === "obs") {
      var stripe = STRIPES[(e.id || 1) % STRIPES.length];
      if (e.verb === "block") ART.prop(ctx, "block", e.variant, 1.05 * p.s, 1.85 * p.s, stripe);
      else if (e.verb === "low" && e.variant === 2) ART.prop(ctx, "low", 2, 1.15 * p.s, 0.55 * p.s, null);
      else if (e.verb === "low") ART.prop(ctx, "low", e.variant, 1.2 * p.s, 0.85 * p.s, null);
      else ART.prop(ctx, "high", e.variant, 1.35 * p.s, 2.15 * p.s, null);
    }
    ctx.restore();
  }

  function drawPlayer(ctx, cam, sim, who) {
    var dist = cam.camDist;
    var groundP = project(cam, sim.x, 0, dist);
    var lift = sim.y * cam.scale;
    var h = 2.05 * cam.scale * 1.12;
    var pose = "run", frame = Math.floor(Math.abs(sim.phase)) % 6;
    if (!sim.alive) pose = "hit";
    else if (sim.air > 0) { pose = "jump"; frame = 0; }
    else if (sim.slide > 0) { pose = "slide"; frame = 0; h *= 0.72; }
    var sw = h * 0.22 * (sim.y > 0.2 ? 0.65 : 1);
    ART.shadow(ctx, groundP.x, groundP.y + 4, sw, h * 0.05);
    if (sim.invuln > 0 && Math.floor(sim.t * 16) % 2 === 0) ctx.globalAlpha = 0.45;
    ART.paintRunner(ctx, who, pose, frame, groundP.x, groundP.y - lift, h);
    ctx.globalAlpha = 1;
    if (sim.shield) {
      ctx.save();
      ctx.translate(groundP.x + h * 0.22, groundP.y - lift - h * 0.72);
      ART.prop(ctx, "shield", 0, h * 0.08, 0, null);
      ctx.restore();
    }
    if (sim.magnet > 0) {
      ctx.strokeStyle = "rgba(240,193,77,0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(groundP.x, groundP.y - lift - h * 0.45, h * 0.38 + Math.sin(sim.t * 8) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function street(ctx, cam, travel, sim, time) {
    sky(ctx, cam, travel);
    ground(ctx, cam);
    markings(ctx, cam, travel, sim);
    var i0 = Math.floor((travel - 8) / 13) - 1;
    var i1 = Math.floor((travel + 78) / 13) + 1;
    for (var i = i1; i >= i0; i--) {
      facade(ctx, cam, travel, -1, i);
      facade(ctx, cam, travel, 1, i);
      // Parked minibuses live on the outer edge, never in a running lane.
      if (i % 3 === 0) {
        var pz = i * 13 + 4;
        var pd = zOf(travel, pz, cam);
        if (pd > 4 && pd < 40) {
          var sideP = i % 2 === 0 ? 1 : -1;
          var pk = project(cam, sideP * 1.95, 0, pd);
          ctx.save();
          ctx.translate(pk.x, pk.y);
          ART.prop(ctx, "block", 0, 0.95 * pk.s, 1.55 * pk.s, STRIPES[Math.abs(i) % STRIPES.length]);
          ctx.restore();
        }
      }
    }
    if (sim) {
      var ents = sim.ents.slice().sort(function (a, b) { return b.z - a.z; });
      for (var k = 0; k < ents.length; k++) if (!ents[k].dead) drawEnt(ctx, cam, sim.travel, ents[k], time);
      drawPlayer(ctx, cam, sim, sim.who != null ? sim.who : 0);
    }
    // edge speed shade
    var vg = ctx.createLinearGradient(0, 0, cam.W, 0);
    vg.addColorStop(0, "rgba(36,24,32,0.18)");
    vg.addColorStop(0.18, "rgba(36,24,32,0)");
    vg.addColorStop(0.82, "rgba(36,24,32,0)");
    vg.addColorStop(1, "rgba(36,24,32,0.18)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, cam.W, cam.H);
  }

  function wordmark(ctx, x, y, scale) {
    var letters = ["E", "I", "S", "H", "!"];
    var cols = ["#e23b3b", "#128f86", "#f0c14d", "#7a4ad4", "#241820"];
    var w = 46 * scale, h = 58 * scale, gap = 6 * scale;
    var total = letters.length * w + (letters.length - 1) * gap;
    var x0 = x - total / 2;
    font(ctx, 40 * scale, "800");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var i = 0; i < letters.length; i++) {
      var lx = x0 + i * (w + gap);
      ctx.save();
      ctx.translate(lx + w / 2, y);
      ctx.rotate((i - 2) * 0.06);
      rr(ctx, -w / 2, -h / 2, w, h, 8 * scale);
      ctx.fillStyle = cols[i];
      ctx.fill();
      ctx.lineWidth = 4 * scale;
      ctx.strokeStyle = "#fffaf2";
      ctx.stroke();
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = INK;
      ctx.stroke();
      ctx.fillStyle = i === 2 ? INK : "#fffaf2";
      ctx.fillText(letters[i], 0, 2 * scale);
      ctx.restore();
    }
  }

  function button(ctx, r, label, sub, hot) {
    ctx.save();
    rr(ctx, r.x, r.y, r.w, r.h, 14);
    ctx.fillStyle = hot ? "#ffb703" : "#fffaf2";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    font(ctx, sub ? 22 : 20, "800");
    ctx.fillText(label, r.x + r.w / 2, r.y + (sub ? r.h * 0.38 : r.h / 2));
    if (sub) {
      font(ctx, 13, "600");
      ctx.fillStyle = "#5c4a42";
      ctx.fillText(sub, r.x + r.w / 2, r.y + r.h * 0.72);
    }
    ctx.restore();
  }

  function hit(app, id, x, y, w, h) { app.hits.push({ id: id, x: x, y: y, w: w, h: h }); }

  function drawTitle(ctx, cam, app) {
    street(ctx, cam, app.menuT, null, app.menuT);
    var wide = cam.W > cam.H * 1.15;
    var heroH = wide ? Math.min(cam.H * 0.74, 560) : Math.min(cam.H * 0.4, 380);
    var foot = wide ? cam.H * 0.88 : cam.H * 0.55;
    var hx = wide ? cam.W * 0.32 : cam.W * 0.5;
    ART.shadow(ctx, hx, foot, heroH * 0.18, heroH * 0.035);
    var blink = !app.reduced && Math.sin(app.menuT * 0.7) > 0.92;
    ART.paintHeroBlink(ctx, app.who, hx, foot, heroH, blink);
    wordmark(ctx, wide ? cam.W * 0.32 : cam.W * 0.5, cam.top + 42, wide ? 0.62 : Math.min(0.86, cam.W / 460));
    var cardW = wide ? Math.min(380, cam.W * 0.34) : cam.W - 28;
    var cardH = wide ? cam.H * 0.72 : Math.min(cam.H * 0.4, 340);
    var cardX = wide ? cam.W - cardW - 24 : 14;
    var cardY = wide ? cam.H * 0.14 : cam.H - cardH - cam.bot - 10;
    ctx.fillStyle = "rgba(255,248,236,0.94)";
    rr(ctx, cardX, cardY, cardW, cardH, 18);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    var c = ART.CAST[app.who];
    var nameY = cardY + 18;
    button(ctx, { x: cardX + 16, y: nameY, w: 48, h: 44 }, "<", null, false);
    button(ctx, { x: cardX + cardW - 64, y: nameY, w: 48, h: 44 }, ">", null, false);
    hit(app, "who-prev", cardX + 16, nameY, 48, 44);
    hit(app, "who-next", cardX + cardW - 64, nameY, 48, 44);
    font(ctx, 22, "800");
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.fillText(c.name, cardX + cardW / 2, nameY + 18);
    font(ctx, 13, "600");
    ctx.fillStyle = "#5c4a42";
    ctx.fillText(c.place, cardX + cardW / 2, nameY + 38);
    var modes = ["run", "rush", "robot"];
    var by = nameY + 62;
    var bh = Math.min(64, (cardH - 130) / 3.4);
    for (var i = 0; i < modes.length; i++) {
      var m = root.EISH.MODES[modes[i]];
      var best = app.best[modes[i]] ? "Best " + Math.floor(app.best[modes[i]]) : m.blurb;
      var rect = { x: cardX + 16, y: by + i * (bh + 8), w: cardW - 32, h: bh };
      button(ctx, rect, m.name, best, app.mode === modes[i]);
      hit(app, "mode-" + modes[i], rect.x, rect.y, rect.w, rect.h);
    }
    var footY = cardY + cardH - 48;
    button(ctx, { x: cardX + 16, y: footY, w: (cardW - 40) / 2, h: 36 }, "How", null, false);
    button(ctx, { x: cardX + 24 + (cardW - 40) / 2, y: footY, w: (cardW - 40) / 2, h: 36 }, app.mute ? "Sound off" : "Sound on", null, false);
    hit(app, "how", cardX + 16, footY, (cardW - 40) / 2, 36);
    hit(app, "mute", cardX + 24 + (cardW - 40) / 2, footY, (cardW - 40) / 2, 36);
  }

  function pill(ctx, x, y, w, h) {
    ctx.fillStyle = "rgba(28,22,32,0.55)";
    rr(ctx, x, y, w, h, 12);
    ctx.fill();
  }

  function hud(ctx, cam, app) {
    var s = app.sim;
    var top = cam.top + 10;
    pill(ctx, 12, top, 150, 54);
    font(ctx, 26, "800");
    ctx.fillStyle = "#fffaf2";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.floor(s.score)), 24, top + 20);
    font(ctx, 13, "700");
    ctx.fillStyle = "#fffaf2";
    var sub = s.mode === "rush" ? (s.fares + " fares") : s.mode === "robot" ? (s.routes + " robots") : (Math.floor(s.dist) + " m");
    ctx.fillText(sub + "   " + s.coins + " coins", 24, top + 40);
    var label = root.EISH.MODES[s.mode].name;
    font(ctx, 14, "800");
    var lw = ctx.measureText(label).width + 24;
    pill(ctx, cam.W / 2 - lw / 2, top, lw, 28);
    ctx.fillStyle = "#fffaf2";
    ctx.textAlign = "center";
    ctx.fillText(label, cam.W / 2, top + 14);
    if (s.mode === "rush") {
      pill(ctx, cam.W - 118, top, 58, 36);
      font(ctx, 20, "800");
      ctx.fillStyle = s.timeLeft < 10 ? "#ffb4a8" : "#fffaf2";
      var sec = Math.ceil(s.timeLeft);
      ctx.fillText(sec + "s", cam.W - 89, top + 18);
    }
    if (s.mode === "robot") {
      for (var i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cam.W - 108 + i * 18, top + 18, 6, 0, Math.PI * 2);
        ctx.fillStyle = i < s.strikes ? "#e23b3b" : "rgba(255,250,242,0.35)";
        ctx.fill();
      }
    }
    var py = top + (s.mode === "run" ? 0 : 40);
    button(ctx, { x: cam.W - 64, y: py, w: 52, h: 44 }, "II", null, false);
    hit(app, "pause", cam.W - 64, py, 52, 44);
    // gate banner
    var gate = null;
    for (var g = 0; g < s.ents.length; g++) {
      var e = s.ents[g];
      if (e.kind === "gate" && !e.resolved && e.z > s.travel) {
        if (!gate || e.z < gate.z) gate = e;
      }
    }
    if (gate && gate.z - s.travel < Math.max(26, s.speed * 1.7)) {
      var names = ["LEFT", "MID", "RIGHT"];
      var bw = Math.min(280, cam.W - 40);
      pill(ctx, cam.W / 2 - bw / 2, top + 64, bw, 44);
      font(ctx, 20, "800");
      ctx.fillStyle = "#b8f0cf";
      ctx.textAlign = "center";
      ctx.fillText("OPEN ROBOT  " + names[gate.lane], cam.W / 2, top + 86);
    }
    if (app.hint > 0) {
      font(ctx, 15, "700");
      ctx.textAlign = "center";
      pill(ctx, cam.W / 2 - 148, top + 108, 296, 28);
      ctx.fillStyle = "#fffaf2";
      ctx.fillText("Swipe   ·   up jump   ·   down slide", cam.W / 2, top + 122);
    }
    // thumb buttons, centred so they stay on the road on a wide window
    var by = cam.H - cam.bot - 74;
    var bw = 62, gap = 10, total = bw * 4 + gap * 3;
    var x0 = Math.max(12, (cam.W - total) / 2);
    var specs = [["left", x0, "◀"], ["slide", x0 + (bw + gap), "▼"], ["jump", x0 + 2 * (bw + gap), "▲"], ["right", x0 + 3 * (bw + gap), "▶"]];
    ctx.globalAlpha = 0.78;
    for (var b = 0; b < specs.length; b++) {
      var bx = specs[b][1];
      button(ctx, { x: bx, y: by, w: bw, h: 56 }, specs[b][2], null, false);
      hit(app, "btn-" + specs[b][0], bx, by, bw, 56);
    }
    ctx.globalAlpha = 1;
    for (var f = 0; f < app.floaters.length; f++) {
      var fl = app.floaters[f];
      ctx.globalAlpha = clamp(fl.life, 0, 1);
      font(ctx, 16, "800");
      ctx.fillStyle = "#fffaf2";
      ctx.textAlign = "center";
      ctx.fillText(fl.text, fl.x, fl.y);
      ctx.globalAlpha = 1;
    }
  }

  function cardOverlay(ctx, cam, title, lines, buttons) {
    ctx.fillStyle = "rgba(28,22,32,0.45)";
    ctx.fillRect(0, 0, cam.W, cam.H);
    var w = Math.min(360, cam.W - 36);
    var h = 120 + lines.length * 26 + buttons.length * 58;
    var x = (cam.W - w) / 2, y = (cam.H - h) / 2;
    ctx.fillStyle = "#fffaf2";
    rr(ctx, x, y, w, h, 18);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    font(ctx, 28, "800");
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, cam.W / 2, y + 36);
    font(ctx, 16, "600");
    ctx.fillStyle = "#5c4a42";
    for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], cam.W / 2, y + 72 + i * 24);
    return { x: x, y: y + 80 + lines.length * 26, w: w };
  }

  function drawHow(ctx, cam, app) {
    ctx.fillStyle = "#f6e7cf";
    ctx.fillRect(0, 0, cam.W, cam.H);
    wordmark(ctx, cam.W / 2, cam.top + 52, 0.55);
    font(ctx, 16, "700");
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.fillText("Three lanes on a Jozi street", cam.W / 2, cam.top + 96);
    var rows = [
      ["◀ ▶", "Move lane", "Swipe sideways, or the arrows."],
      ["▲", "Jump", "Drums, barriers and potholes."],
      ["▼", "Slide", "Signs, scaffolds and branches."]
    ];
    for (var i = 0; i < rows.length; i++) {
      var y = cam.top + 130 + i * 88;
      ctx.fillStyle = "#fffaf2";
      rr(ctx, 24, y, cam.W - 48, 78, 14);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.stroke();
      font(ctx, 22, "800");
      ctx.fillStyle = "#128f86";
      ctx.textAlign = "left";
      ctx.fillText(rows[i][0], 40, y + 32);
      ctx.fillStyle = INK;
      ctx.fillText(rows[i][1], 120, y + 28);
      font(ctx, 14, "600");
      ctx.fillStyle = "#5c4a42";
      ctx.fillText(rows[i][2], 120, y + 52);
    }
    var noteY = cam.top + 400;
    font(ctx, 14, "600");
    ctx.textAlign = "center";
    ctx.fillStyle = INK;
    var notes = [
      "Jozi Run — one hit, unless a bead bracelet takes it.",
      "Taxi Rush — 75 seconds. Passengers are fares, not traffic.",
      "Green Robot — stand in the open lane. Three strikes end it.",
      "A kota pulls the coins in for a moment."
    ];
    for (i = 0; i < notes.length; i++) ctx.fillText(notes[i], cam.W / 2, noteY + i * 22);
    var by = cam.H - cam.bot - 110;
    button(ctx, { x: cam.W / 2 - 140, y: by, w: 280, h: 48 }, app.reduced ? "Motion: reduced" : "Motion: full", null, app.reduced);
    hit(app, "rm", cam.W / 2 - 140, by, 280, 48);
    button(ctx, { x: cam.W / 2 - 140, y: by + 58, w: 280, h: 44 }, "Back", null, false);
    hit(app, "back", cam.W / 2 - 140, by + 58, 280, 44);
  }

  function drawPause(ctx, cam, app) {
    var slot = cardOverlay(ctx, cam, "Paused", ["The street will wait."], [1, 2, 3]);
    var labels = [["resume", "Resume"], ["restart", "Restart"], ["menu", "Menu"]];
    for (var i = 0; i < labels.length; i++) {
      var r = { x: slot.x + 24, y: slot.y + i * 56, w: slot.w - 48, h: 48 };
      button(ctx, r, labels[i][1], null, i === 0);
      hit(app, labels[i][0], r.x, r.y, r.w, r.h);
    }
  }

  function drawOver(ctx, cam, app) {
    var s = app.sim;
    var title = s.win ? "You made the rank" : s.reason === "strikes" ? "Three red robots" : "Eish";
    var lines = [
      "Score " + Math.floor(s.score),
      s.mode === "rush" ? (s.fares + " fares banked") : s.mode === "robot" ? (s.routes + " open robots, " + s.strikes + " strikes") : (Math.floor(s.dist) + " metres"),
      app.newBest ? "New best." : "Best " + Math.floor(app.best[s.mode] || 0)
    ];
    var slot = cardOverlay(ctx, cam, title, lines, [1, 2]);
    button(ctx, { x: slot.x + 24, y: slot.y, w: slot.w - 48, h: 48 }, "Again", null, true);
    hit(app, "restart", slot.x + 24, slot.y, slot.w - 48, 48);
    button(ctx, { x: slot.x + 24, y: slot.y + 58, w: slot.w - 48, h: 48 }, "Menu", null, false);
    hit(app, "menu", slot.x + 24, slot.y + 58, slot.w - 48, 48);
  }

  function drawSheet(ctx, W, H) {
    ctx.fillStyle = "#f6e7cf";
    ctx.fillRect(0, 0, W, H);
    var poses = ["hero", "run", "jump", "slide", "hit"];
    for (var w = 0; w < 3; w++) {
      for (var p = 0; p < poses.length; p++) {
        var x = 80 + p * 150;
        var y = 180 + w * 200;
        if (poses[p] === "hero") ART.paintHeroBlink(ctx, w, x, y, 170, false);
        else ART.paintRunner(ctx, w, poses[p], p === 1 ? 3 : 0, x, y, 160);
      }
    }
  }

  function draw(ctx, app, W, H) {
    app.hits = [];
    var cam = camera(W, H, app.safeTop, app.safeBot);
    if (app.sheet) { drawSheet(ctx, W, H); return cam; }
    ctx.clearRect(0, 0, W, H);
    if (app.screen === "how") { drawHow(ctx, cam, app); return cam; }
    if (app.screen === "title") { drawTitle(ctx, cam, app); return cam; }
    var sim = app.sim;
    if (sim) {
      sim.who = app.who;
      street(ctx, cam, sim.travel, sim, app.time || sim.t);
    }
    if (app.screen === "play") hud(ctx, cam, app);
    if (app.screen === "pause") { hud(ctx, cam, app); drawPause(ctx, cam, app); }
    if (app.screen === "over") drawOver(ctx, cam, app);
    if (app.flash > 0) {
      ctx.fillStyle = "rgba(255,80,60," + (app.flash * 0.35) + ")";
      ctx.fillRect(0, 0, W, H);
    }
    return cam;
  }

  root.WORLD = { draw: draw, camera: camera, project: project };
})(typeof globalThis !== "undefined" ? globalThis : this);
// EISH! Jozi Run — input, audio, screens. Swipes count when the finger has moved, not on a short timer.
// A finger keeps working until pointerup or pointercancel. lostpointercapture does not cancel the stroke.
(function (root) {
  "use strict";
  var EISH = root.EISH;
  var WORLD = root.WORLD;
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
    flash: 0,
    floaters: [],
    hits: [],
    lanes: [],
    jump: false,
    slide: false,
    safeTop: 0,
    safeBot: 0,
    sheet: q.sheet === "1",
    bot: q.bot === "1",
    newBest: false,
    cam: null
  };
  if (q.mode === "rush" || q.mode === "robot" || q.mode === "run") app.mode = q.mode;
  if (q.mute === "1") app.mute = true;
  if (q.who) app.who = (+q.who) % 3;

  var cv = document.getElementById("c");
  var ctx = cv.getContext("2d", { alpha: false });
  var dpr = 1, W = 360, H = 640, last = 0, acc = 0;
  var ptr = null;

  function resize() {
    var topEl = document.getElementById("sat");
    var botEl = document.getElementById("sab");
    app.safeTop = topEl ? topEl.offsetHeight : 0;
    app.safeBot = botEl ? botEl.offsetHeight : 0;
    W = window.innerWidth;
    H = window.innerHeight;
    var next = Math.min(1.75, window.devicePixelRatio || 1);
    if (app.reduced) next = Math.min(next, 1.25);
    dpr = next;
    cv.width = Math.max(1, Math.round(W * dpr));
    cv.height = Math.max(1, Math.round(H * dpr));
    cv.style.width = W + "px";
    cv.style.height = H + "px";
  }

  var AC = null, master = null, noiseBuf = null;
  function ac() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain();
        master.gain.value = app.mute ? 0 : 0.35;
        master.connect(AC.destination);
      } catch (e) { return null; }
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
    var t = AC.currentTime, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noiseBuf; f.type = "bandpass"; f.frequency.value = 900;
    g.gain.setValueAtTime(vol || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t); s.stop(t + d);
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
    else if (name === "shieldbreak") noise(0.12, 0.08);
  }

  function floater(text) {
    var cam = app.cam;
    app.floaters.push({
      x: cam ? cam.W * 0.5 : W * 0.5,
      y: cam ? cam.feetY - 120 : H * 0.55,
      text: text,
      life: 0.8
    });
  }

  function react(events) {
    for (var i = 0; i < events.length; i++) {
      var n = events[i];
      sfx(n);
      if (n === "coin") floater("+10");
      if (n === "fare") floater("FARE");
      if (n === "near") floater("SHARP");
      if (n === "gate") floater("OPEN");
      if (n === "die" || n === "crash" || n === "strike" || n === "shieldbreak") app.flash = 0.45;
    }
  }

  function rememberBest() {
    var s = app.sim;
    if (!s) return;
    var prev = app.best[s.mode] || 0;
    app.newBest = s.score > prev;
    if (app.newBest) {
      app.best[s.mode] = s.score;
      save("eish_run_best", app.best);
    }
  }

  function begin(mode) {
    ac();
    app.mode = mode;
    var seed = q.seed ? (q.seed >>> 0) : ((Date.now() ^ (Math.random() * 1e9)) >>> 0);
    app.sim = EISH.create(mode, seed);
    app.sim.who = app.who;
    app.screen = "play";
    app.hint = app.seenHint ? 2.2 : 5;
    app.seenHint = true;
    save("eish_run_hint", true);
    app.floaters = [];
    app.flash = 0;
    music(true);
  }

  function tap(id) {
    if (id === "mute") {
      app.mute = !app.mute;
      save("eish_run_mute", app.mute);
      if (master) master.gain.value = app.mute ? 0 : 0.35;
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
      if (id === "rm") { app.reduced = !app.reduced; save("eish_run_rm", app.reduced); }
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

  function pointIn(h, x, y) { return x >= h.x && y >= h.y && x <= h.x + h.w && y <= h.y + h.h; }
  function hitTest(x, y) {
    var list = app.hits || [];
    for (var i = list.length - 1; i >= 0; i--) if (pointIn(list[i], x, y)) return list[i].id;
    return null;
  }

  cv.addEventListener("pointerdown", function (e) {
    if (ptr) return;
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    ptr = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, used: false, button: hitTest(e.clientX, e.clientY) };
    ac();
  });
  cv.addEventListener("pointermove", function (e) {
    if (!ptr || e.pointerId !== ptr.id || ptr.used || ptr.button) return;
    var dx = e.clientX - ptr.sx, dy = e.clientY - ptr.sy;
    if (Math.abs(dx) < 26 && Math.abs(dy) < 26) return;
    ptr.used = true;
    swipe(dx, dy);
  });
  function endPointer(e) {
    if (!ptr || e.pointerId !== ptr.id) return;
    var dx = e.clientX - ptr.sx, dy = e.clientY - ptr.sy;
    var adx = Math.abs(dx), ady = Math.abs(dy);
    // A press that starts on a button stays a button. It must not become a lane change.
    if (ptr.button && adx < 40 && ady < 40) tap(ptr.button);
    else if (!ptr.button && !ptr.used && adx < 18 && ady < 18) {
      var id = hitTest(e.clientX, e.clientY);
      if (id) tap(id);
    } else if (!ptr.button && !ptr.used && (adx >= 26 || ady >= 26)) swipe(dx, dy);
    ptr = null;
  }
  cv.addEventListener("pointerup", endPointer);
  cv.addEventListener("pointercancel", endPointer);

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

  function loop(now) {
    var dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    app.time += dt;
    if (app.screen === "title") app.menuT += dt * (app.reduced ? 1.5 : 7);
    if (app.screen === "play" && app.sim) {
      var input = takeInput();
      EISH.step(app.sim, dt, input);
      react(app.sim.events);
      if (app.hint > 0) app.hint -= dt;
      if (!app.sim.alive || app.sim.finished) {
        rememberBest();
        app.screen = "over";
        music(false);
      }
    }
    if (app.flash > 0) app.flash = Math.max(0, app.flash - dt);
    for (var i = app.floaters.length - 1; i >= 0; i--) {
      app.floaters[i].life -= dt;
      app.floaters[i].y -= dt * 30;
      if (app.floaters[i].life <= 0) app.floaters.splice(i, 1);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    app.cam = WORLD.draw(ctx, app, W, H);
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  if (q.play === "1") begin(app.mode);
  if (q.pause === "1") {
    begin(app.mode);
    app.screen = "pause";
  }
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
  }
  var live = document.getElementById("live");
  setInterval(function () {
    if (!live) return;
    if (app.screen === "play" && app.sim) live.textContent = root.EISH.MODES[app.sim.mode].name + ", score " + Math.floor(app.sim.score);
    else live.textContent = app.screen;
  }, 1000);

  root.__EISH = app;
  requestAnimationFrame(loop);
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
