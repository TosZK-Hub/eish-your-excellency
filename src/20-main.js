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
    who: 0,
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
    sheet: q.sheet || "",
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
    document.body.classList.toggle("menu", (app.screen === "title" || app.screen === "how") && !app.sheet);
    document.body.classList.toggle("sheetmode", !!app.sheet);
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
    if (app.screen !== "play") return;
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
    app.dt = dt;
    if (q.hold) app.time = +q.hold;
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

  if (window.ResizeObserver) new ResizeObserver(function () { resize(); }).observe(view);
  root.__EISH = app;
  root.__metrics = function () { return WORLD.metrics(); };
  function beginLoop() {
    requestAnimationFrame(loop);
  }
  if (WORLD.loadHero) WORLD.loadHero("assets/lerato.glb", beginLoop);
  else beginLoop();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
