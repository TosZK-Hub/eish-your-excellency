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
