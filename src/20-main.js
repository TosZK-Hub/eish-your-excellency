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
  var state = load() || KHAYA.fresh(now0);
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
    var info = KHAYA.nextStep(KHAYA.playerXp(state), KHAYA.PLAYER_STEPS);
    var lv = KHAYA.playerLevel(state);
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
  }

  function celebrate() {
    var after = KHAYA.playerLevel(state);
    if (after > laneLevel) {
      toast("Level " + after);
      chime("place");
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
    var o = DRAW.layout(canvas.clientWidth, canvas.clientHeight);
    var n = KHAYA.cellNorth(b.x + b.w / 2, b.y + b.h / 2, o.ox, o.oy, o.tw, o.th);
    return { x: n.x, y: n.y };
  }

  function paint() {
    paintHud();
    paintCard();
    placingEl.hidden = !ghost;
    if (ghost) placingEl.textContent = "Placing " + KHAYA.BUILDINGS[ghost.type].name + " — tap the grass, or cancel";
    var dragging = drag && drag.moved && !drag.ghost ? { id: drag.id, x: drag.cx, y: drag.cy } : null;
    DRAW.render(canvas, state, { ghost: ghost, selected: selected(), born: born, floats: floats, drag: dragging }, Date.now());
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
      chime("harvest");
      if (focus) {
        var p = cellPoint(focus);
        floats.push({ x: p.x, y: p.y, t: Date.now(), text: "+" + result.amount + " " + result.crop, color: "#2f6d4f" });
      }
    } else if (result.notes) {
      chime("harvest");
      toast("+" + result.notes + " notes");
      if (result.collected && focus) {
        var coin = cellPoint(focus);
        floats.push({ x: coin.x, y: coin.y, t: Date.now(), text: "+" + result.notes, color: "#c4841a", coins: Math.min(8, result.notes) });
      }
    } else if (result.xp) {
      chime("tap");
    }
    celebrate();
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

  function cellFrom(ev) {
    var rect = canvas.getBoundingClientRect();
    var o = DRAW.layout(canvas.clientWidth, canvas.clientHeight);
    return KHAYA.pickCell(ev.clientX - rect.left, ev.clientY - rect.top, o.ox, o.oy, o.tw, o.th);
  }

  canvas.addEventListener("pointerdown", function (ev) {
    if (!modal.hidden) return;
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
      selectedId = null;
      paint();
      return;
    }
    drag = { id: hit.id, px: ev.clientX, py: ev.clientY, moved: false, cx: hit.x, cy: hit.y, pointer: ev.pointerId };
    try { canvas.setPointerCapture(ev.pointerId); } catch (err) { /* ignore */ }
  });

  canvas.addEventListener("pointermove", function (ev) {
    if (!drag || ev.pointerId !== drag.pointer) return;
    if (Math.hypot(ev.clientX - drag.px, ev.clientY - drag.py) > 12) drag.moved = true;
    if (!drag.moved) return;
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
    if (!drag || (ev && ev.pointerId !== drag.pointer)) return;
    var item = drag;
    drag = null;
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
  canvas.addEventListener("pointercancel", function (ev) { drag = null; paint(); });

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

  if (!state.welcomed) {
    state.welcomed = true;
    save();
    openModal("Welcome to Khaya Lane", "<p class=\"rules\">Sow a bed, water it, and harvest. The spaza earns notes while you are away — tap the coin to collect. Drag a building to move it. Upgrade the home when you can. Notes stay on this device.</p><button type=\"button\" class=\"hot\" data-close>Start on the lane</button>");
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
      var ticked = KHAYA.tick(state, now);
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
    DRAW.render(canvas, state, { ghost: ghost, selected: selected(), born: born, floats: floats, drag: dragging }, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  if ("serviceWorker" in navigator && location.protocol !== "file:" && location.search.indexOf("nosw=1") < 0) {
  navigator.serviceWorker.register("sw.js").catch(function () {});
}
DRAW.load(function () { paint(); });
window.__EISH_OK = true;
  var boot = document.getElementById("boot");
  if (boot) boot.hidden = true;
  paint();
  save();
})();
