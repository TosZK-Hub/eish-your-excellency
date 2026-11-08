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
