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
  var bootTick = KHAYA.tick(state, now0);
  var pendingAway = KHAYA.awayLine(bootTick && bootTick.away);
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var sharp = 1;
  var dtEma = 16;
  var framesSeen = 0;
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
    toastEl.classList.remove("in");
    void toastEl.offsetWidth;
    toastEl.classList.add("in");
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

  var closeTimer = 0;
  function closeModal() {
    if (stopGame) { stopGame(); stopGame = null; }
    sheet.classList.add("shut");
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      modal.hidden = true;
      sheet.classList.remove("shut");
      sheet.setAttribute("aria-hidden", "true");
      if (pendingAway) {
        var line = pendingAway;
        pendingAway = "";
        toast(line);
      }
    }, 180);
  }

  function openModal(title, html) {
    if (stopGame) { stopGame(); stopGame = null; }
    clearTimeout(closeTimer);
    sheet.classList.remove("shut");
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

  var hudSig = "";
  function paintHud() {
    var cropSig = "";
    var ck;
    for (ck in state.crops) if (state.crops[ck]) cropSig += ck + state.crops[ck];
    var ordersN = state.orders && state.orders.phase === "here" && state.orders.list ? state.orders.list.length : 0;
    var st = state.stats || {};
    var sig = state.notes + "|" + state.seeds + "|" + state.water + "|" + state.timber + "|" + state.bricks + "|" + cropSig + "|" + KHAYA.playerXp(state) + "|" + ordersN + "|" + (st.harvested || 0) + "|" + (st.placed || 0) + "|" + (selectedId || 0);
    if (sig === hudSig) return;
    hudSig = sig;
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
      var showOrders = (state.stats.harvested || 0) > 0;
      ordersBtn.hidden = !showOrders;
      var list = state.orders && state.orders.phase === "here" ? state.orders.list : [];
      ordersBtn.textContent = showOrders && list && list.length ? "Orders " + list.length : "Orders";
    }
    if (levelEl) levelEl.textContent = String(lv);
    if (xpFill) {
      var span = Math.max(1, info.next - info.prev);
      var pct = info.max ? 1 : (KHAYA.playerXp(state) - info.prev) / span;
      xpFill.style.transform = "scaleX(" + pct + ")";
    }
    if (goalEl) {
      var open = selected() ? KHAYA.tasks(state).filter(function (t) { return !t.done; }).slice(0, 1) : [];
      goalEl.innerHTML = open.map(function (t) {
        return "<li>" + t.text + "</li>";
      }).join("");
    }
    var laneBtn = document.querySelector("[data-act=more]");
    if (laneBtn) {
      var badges = KHAYA.unseenFolk(state);
      if ((state.stats.harvested || 0) > 0 && (!state.daily || state.daily.last !== KHAYA.dayKey(new Date()))) badges += 1;
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

  var cardSig = "";
  function paintCard() {
    var b = selected();
    var now = Date.now();
    var html = "";
    var sig = "";
    if (ghost) {
      var def = KHAYA.BUILDINGS[ghost.type];
      var check = KHAYA.canPlace(state, ghost.type, ghost.x, ghost.y);
      sig = "g" + ghost.type + ghost.x + "," + ghost.y + (check.ok ? 1 : 0);
      html = "<b>Placing " + def.name + "</b><p>" + (check.ok ? "Tap the grass to build it." : check.reason) + "</p>";
    } else if (!b) {
      var guide = KHAYA.coach(state, now);
      sig = "c" + (guide ? guide.act + guide.title + (guide.sow || "") : "quiet") + state.seeds + state.water;
      if (guide) {
        html = "<b>" + guide.title + "</b><p>" + guide.text + "</p>";
        if (guide.act === "water") html += "<button type=\"button\" class=\"hot\" data-coach=\"water\" data-id=\"" + guide.id + "\">Water</button>";
        else if (guide.act === "harvest") html += "<button type=\"button\" class=\"hot\" data-coach=\"harvest\" data-id=\"" + guide.id + "\">Pick</button>";
        else if (guide.act === "sow") html += "<button type=\"button\" class=\"hot\" data-coach=\"sow\" data-id=\"" + guide.id + "\">Sow maize</button>";
        else if (guide.act === "build") html += "<button type=\"button\" class=\"hot\" data-coach=\"build\">Build a spaza</button>";
        else if (guide.sow) html += "<button type=\"button\" class=\"hot\" data-coach=\"sow\" data-id=\"" + guide.sow + "\">Sow maize</button>";
      } else html = "<b>Khaya Lane</b><p>Tap a bed, or open Build.</p>";
    } else {
      var spec = KHAYA.BUILDINGS[b.type];
      html = "<b>" + spec.name + "</b>";
      sig = "b" + b.id + b.level + (b.phase || "") + (b.crop || "") + (b.stored || 0) + (b.buildLeft || 0) + state.water + state.seeds + state.notes;
      if (b.type === "bed") {
        var view = KHAYA.bedView(b, now);
        sig += view.phase + Math.round((view.progress || 0) * 20);
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
          html += "<p>" + KHAYA.CROPS[b.crop].name + " · ready in " + KHAYA.formatSpan(view.left) + "</p><div class=\"meter\"><span style=\"transform:scaleX(" + view.progress + ")\"></span></div>";
        } else {
          html += "<p>" + KHAYA.CROPS[b.crop].name + " is ready.</p><button type=\"button\" class=\"hot\" data-do=\"harvest\">Pick</button>";
        }
      } else {
        html += "<p>" + spec.blurb + "</p>";
        var job = KHAYA.buildView(b);
        if (job) {
          sig += Math.round(job.progress * 20);
          html += "<p>Building · " + KHAYA.formatSpan(job.left) + " left</p><div class=\"meter\"><span style=\"transform:scaleX(" + job.progress + ")\"></span></div>";
        }
        var prod = KHAYA.produceView(b, state);
        if (prod) {
          sig += Math.round(prod.progress * 20);
          html += "<p>" + (prod.ready ? prod.stored + " notes ready" : "Next note in " + KHAYA.formatSpan(prod.left)) + "</p>";
          html += "<div class=\"meter\"><span style=\"transform:scaleX(" + prod.progress + ")\"></span></div>";
          if (prod.ready) html += "<button type=\"button\" class=\"hot\" data-do=\"collect\">Collect</button>";
        }
        if (!job) {
          var up = KHAYA.canUpgrade(state, b.id);
          var price = KHAYA.upgradeCost(state, b);
          if (price) {
            html += "<p class=\"fine\">" + costLine(price) + "</p>";
            html += "<button type=\"button\" class=\"hot\" data-do=\"upgrade\"" + (up.ok ? "" : " disabled") + ">Upgrade · " + KHAYA.formatSpan(KHAYA.upgradeDuration(b)) + "</button>";
            if (!up.ok) html += "<p class=\"fine\">" + up.reason + "</p>";
          } else html += "<p class=\"fine\">Fully built.</p>";
        }
      }
    }
    if (sig === cardSig) return;
    cardSig = sig;
    card.innerHTML = html;
  }

  function scene(dragging) {
    var hint = null;
    var guide = !selectedId && !ghost ? KHAYA.coach(state, Date.now()) : null;
    if (guide && guide.id && (state.stats.harvested || 0) < 1) {
      var target = KHAYA.buildingById(state, guide.id);
      if (target) hint = { x: target.x, y: target.y, w: target.w, h: target.h };
    }
    return {
      ghost: ghost,
      selected: selected(),
      born: born,
      floats: floats,
      drag: dragging,
      cam: cam,
      squash: squash,
      ground: q.get("ground") === "1",
      light: q.get("light") || "",
      calm: reduceMotion,
      hint: hint,
      sharp: sharp
    };
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
    DRAW.render(canvas, state, scene(dragging), Date.now());
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
    if (result.sown && focus) {
      var sownAt = cellPoint(focus);
      floats.push({ x: sownAt.x, y: sownAt.y, t: Date.now(), text: "Sown", color: "#2f6d4f" });
    }
    if (result.grow && focus) {
      var wet = cellPoint(focus);
      floats.push({ x: wet.x, y: wet.y, t: Date.now(), text: "Watered", color: "#2f6d8f", kind: "water" });
    }
    if (result.amount) {
      chime(result.crit ? "place" : "harvest");
      if (focus) {
        var p = cellPoint(focus);
        floats.push({ x: p.x, y: p.y, t: Date.now(), text: (result.crit ? "Golden ×" : "+") + result.amount + " " + result.crop, color: result.crit ? "#e2a53a" : "#2f6d4f" });
      }
      if (result.crit && result.combo >= 3) toast("Golden mielie, combo " + result.combo + ".");
      else if (result.crit) toast("A golden mielie. Triple harvest.");
      else if (result.combo >= 3) toast("Combo " + result.combo + ". +" + (result.notes || 0) + " notes.");
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
    html += "<ul class=\"unlocks\"><li>Maize and morogo from the start. The first ones are quick.</li><li>Pumpkin at farming level 2</li><li>Aloe at farming level 3</li><li>Solar stand at building level 2</li><li>The face-brick home at building level 2</li></ul>";
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
  }, { passive: false });

  card.addEventListener("click", function (ev) {
    var sow = ev.target.getAttribute && ev.target.getAttribute("data-sow");
    var todo = ev.target.getAttribute && ev.target.getAttribute("data-do");
    var coachAct = ev.target.getAttribute && ev.target.getAttribute("data-coach");
    var coachId = Number(ev.target.getAttribute && ev.target.getAttribute("data-id"));
    if (coachAct === "build") { openBuild(); return; }
    if (coachAct === "water" || coachAct === "harvest" || coachAct === "sow") selectedId = coachId;
    if (coachAct === "water") act(KHAYA.water(state, coachId, Date.now()));
    if (coachAct === "harvest") act(KHAYA.harvest(state, coachId, Date.now()));
    if (coachAct === "sow") act(KHAYA.sow(state, coachId, "maize"));
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
      var returned = KHAYA.tick(state, Date.now());
      var line = KHAYA.awayLine(returned && returned.away);
      if (line) toast(line);
      save();
      paint();
    }
  });

  if (q.get("go") === "1" || q.get("lineup")) state.welcomed = true;
  if (!state.welcomed) {
    state.welcomed = true;
    save();
    openModal("Khaya Lane", "<p class=\"rules\">Thabo left mielies growing. Water the morogo, then pick the mielies when the bed says Pick.</p><button type=\"button\" class=\"hot\" id=\"welcomeGo\">Start with the morogo</button>");
    var welcomeGo = document.getElementById("welcomeGo");
    if (welcomeGo) welcomeGo.addEventListener("click", function () {
      var guide = KHAYA.coach(state, Date.now());
      if (guide && guide.id) selectedId = guide.id;
      closeModal();
      paint();
    });
  } else if (pendingAway) {
    toast(pendingAway);
    pendingAway = "";
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
  var bench = q.get("bench") === "1";
  var benchStart = 0;
  var benchLast = 0;
  var benchDts = [];
  function frame() {
    var now = Date.now();
    framesSeen += 1;
    if (framesSeen > 1) {
      var dt = now - (frame.prev || now);
      dtEma = dtEma * 0.9 + dt * 0.1;
      if (framesSeen > 45 && dtEma > 26 && sharp > 0.8) sharp = 0.72;
    }
    frame.prev = now;
    if (bench) {
      if (!benchStart) benchStart = now;
      if (benchLast) benchDts.push(now - benchLast);
      benchLast = now;
      var sweep = (now - benchStart) / 2800;
      if (sweep < 1) {
        cam.x = Math.sin(sweep * Math.PI * 2) * 70;
        cam.y = Math.cos(sweep * Math.PI * 2) * 36;
      } else if (!window.__FPS && benchDts.length > 40) {
        var sum = 0;
        var worst = 0;
        var bi;
        for (bi = 0; bi < benchDts.length; bi++) {
          sum += benchDts[bi];
          if (benchDts[bi] > worst) worst = benchDts[bi];
        }
        window.__FPS = {
          frames: benchDts.length,
          avg: Math.round(1000 / (sum / benchDts.length)),
          worstMs: Math.round(worst)
        };
      }
    }
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
      if (ticked.hoot && state.orders && (state.stats.harvested || 0) > 0) {
        tone(440, 0.08, "square", 0.04);
        setTimeout(function () { tone(330, 0.12, "square", 0.04); }, 120);
        state.orders.hoot = 0;
      }
      var live = state.laneEvent && state.laneEvent.current;
      var eventBtn = document.getElementById("event");
      if (eventBtn) {
        if (live) {
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
    var fi = 0;
    var fn = floats.length;
    for (fi = 0; fi < fn; fi++) {
      if (now - floats[fi].t >= 1000) { floats.splice(fi, 1); fi -= 1; fn -= 1; }
    }
    DRAW.render(canvas, state, scene(dragging), now);
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
      KHAYA.water(state, bed.id, Date.now() - 120000);
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
  var bootEl = document.getElementById("boot");
  if (bootEl) bootEl.hidden = true;
});
window.__EISH_OK = true;
setTimeout(function () {
  var bootEl = document.getElementById("boot");
  if (bootEl) bootEl.hidden = true;
}, 4000);
  save();
})();
