// Khaya Lane scene. Sprites are original Blender renders. The veld, sky and UI motion are drawn here.
var DRAW = (function () {
  var img = {};
  var ready = false;
  var contact = typeof WeakMap === "function" ? new WeakMap() : null;
  var plate = null;
  var plateKey = "";
  var backdrop = null;
  var backdropKey = "";
  var markGround = false;
  var groundMarks = [];
  var lastFace = {};

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
    for (id in LOOK.actors) {
      add(LOOK.actors[id].file);
      if (LOOK.actors[id].sheet) add(LOOK.actors[id].sheet);
    }
    for (i = 0; i < LOOK.trees.length; i++) add(LOOK.trees[i]);
    for (i = 0; i < LOOK.neighbours.length; i++) add(LOOK.neighbours[i]);
    for (i = 0; i < LOOK.dress.length; i++) add(LOOK.dress[i].file);
    add("tile_grass");
    add("tile_dirt");
    var crops = [
      "maize_sown", "maize_growing", "maize_ready",
      "morogo_sown", "morogo_growing", "morogo_ready", "morogo_ready_basket",
      "pumpkin_sown", "pumpkin_growing", "pumpkin_fruiting", "pumpkin_ready"
    ];
    for (i = 0; i < crops.length; i++) add(crops[i]);
    return list;
  }

  function loadSet(names, done) {
    if (!names.length) { if (done) done(); return; }
    var left = names.length;
    names.forEach(function (n) {
      var el = new Image();
      el.onload = el.onerror = function () {
        if (el.naturalWidth) {
          img[n] = el;
          measureContact(el);
        }
        left -= 1;
        if (left === 0) {
          sliceSheets();
          if (done) done();
        }
      };
      el.src = LOOK.root + n + LOOK.ext;
      if (el.decode) el.decode().catch(function () {});
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

  function easeOut(t) { return 1 - (1 - t) * (1 - t); }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function layout(w, h, cam) {
    cam = cam || { x: 0, y: 0, z: 1 };
    var z = cam.z || 1;
    if (z < 0.55) z = 0.55;
    if (z > 2.2) z = 2.2;
    var phone = w < 560;
    var cols = phone ? 6.5 : 8;
    var rows = phone ? 6.5 : 8;
    var horizon = phone ? Math.max(20, h * 0.08) : Math.max(64, h * 0.22);
    var availW = w * (phone ? 1.04 : 0.96);
    var availH = Math.max(80, (h - horizon) * (phone ? 1.02 : 0.98));
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
    var limX = Math.max(40, w * 0.18);
    var limY = Math.max(28, h * 0.12);
    if (cam.x > limX) { cam.x = limX; cam.vx = 0; }
    if (cam.x < -limX) { cam.x = -limX; cam.vx = 0; }
    if (cam.y > limY) { cam.y = limY; cam.vy = 0; }
    if (cam.y < -limY) { cam.y = -limY; cam.vy = 0; }
    var maxV = 10;
    if (cam.vx > maxV) cam.vx = maxV;
    if (cam.vx < -maxV) cam.vx = -maxV;
    if (cam.vy > maxV) cam.vy = maxV;
    if (cam.vy < -maxV) cam.vy = -maxV;
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

  var SKY = {
    dawn: ["#d98978", "#f3c7a8", "#f6dcc0", "#e7b888"],
    day: ["#6eaddf", "#b7d4ee", "#f3d2a4", "#e7b27a"],
    gold: ["#e08a55", "#f3c48a", "#f6d7a8", "#e0a56e"],
    dusk: ["#4d5f92", "#c98880", "#f0b48a", "#c48468"],
    night: ["#1a2744", "#31456f", "#5c5274", "#3a342e"]
  };
  var VEIL = {
    dawn: "rgba(255, 196, 150, 0.06)",
    gold: "rgba(255, 168, 80, 0.10)",
    dusk: "rgba(64, 48, 110, 0.10)",
    night: "rgba(16, 24, 58, 0.16)"
  };

  function phaseOf(now, light) {
    if (light === "dawn" || light === "day" || light === "gold" || light === "dusk" || light === "night") return light;
    var d = new Date(now);
    var h = d.getHours() + d.getMinutes() / 60;
    if (h >= 5 && h < 7) return "dawn";
    if (h >= 7 && h < 16.5) return "day";
    if (h >= 16.5 && h < 18.5) return "gold";
    if (h >= 18.5 && h < 20) return "dusk";
    return "night";
  }

  function sky(ctx, w, h, phase) {
    var stops = SKY[phase] || SKY.day;
    var g = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    g.addColorStop(0, stops[0]);
    g.addColorStop(0.45, stops[1]);
    g.addColorStop(0.78, stops[2]);
    g.addColorStop(1, stops[3]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var night = phase === "night" || phase === "dusk";
    if (night) {
      ctx.fillStyle = phase === "night" ? "rgba(255, 248, 230, .85)" : "rgba(255, 248, 230, .7)";
      var spots = [[0.12, 0.08], [0.28, 0.16], [0.46, 0.06], [0.63, 0.14], [0.78, 0.07], [0.9, 0.15]];
      var i;
      for (i = 0; i < (phase === "night" ? spots.length : 3); i++) {
        ctx.beginPath();
        ctx.arc(w * spots[i][0], h * spots[i][1], i % 2 ? 1.3 : 0.8, 0, 7);
        ctx.fill();
      }
    }
    ctx.beginPath();
    ctx.fillStyle = night ? "rgba(244, 236, 210, .92)" : "rgba(255, 244, 210, .95)";
    ctx.arc(w * (night ? 0.78 : 0.82), h * (night ? 0.1 : 0.12), night ? 11 : 16, 0, 7);
    ctx.fill();
  }

  function drawClouds(ctx, w, h, now) {
    var i;
    ctx.save();
    for (i = 0; i < 3; i++) {
      var cx = ((now / 80 + i * w * 0.37) % (w + 220)) - 110;
      var cy = h * (0.07 + (i % 3) * 0.045);
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 48 + (i % 2) * 14, 13, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 26, cy + 3, 30, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBird(ctx, w, h, now) {
    var cycle = 42000;
    var t = now % cycle;
    if (t > 8000) return;
    var u = t / 8000;
    var x = -24 + u * (w + 48);
    var y = h * 0.09 + Math.sin(u * Math.PI) * h * 0.02;
    var wing = Math.sin(now / 160) > 0 ? -4 : 3;
    ctx.save();
    ctx.strokeStyle = "rgba(48, 36, 28, .45)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.quadraticCurveTo(x - 2, y + wing, x, y);
    ctx.quadraticCurveTo(x + 2, y + wing, x + 6, y);
    ctx.stroke();
    ctx.restore();
  }

  function distant(ctx, w, h, o) {
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
    var spots = [0.12, 0.4, 0.7];
    var n;
    for (n = 0; n < LOOK.neighbours.length; n++) {
      blitFoot(ctx, img[LOOK.neighbours[n]], w * spots[n], hy + 18, o.tw * 0.72, 0.9);
    }
    blitFoot(ctx, img.tree_jacaranda, w * 0.94, hy + 18, o.tw * 0.48, LOOK.treeScale.tree_jacaranda || 1);
    blitFoot(ctx, img.tree_acacia, w * 0.06, hy + 22, o.tw * 0.42, LOOK.treeScale.tree_acacia || 1);
  }

  function road(ctx, w, h, o) {
    var south = north(KHAYA.COLS, KHAYA.ROWS, o);
    ctx.fillStyle = "#d7b56a";
    ctx.beginPath();
    ctx.moveTo(south.x - o.tw * 0.55, south.y - 4);
    ctx.lineTo(w * 0.5 - Math.min(120, w * 0.16), h + 30);
    ctx.lineTo(w * 0.5 + Math.min(120, w * 0.16), h + 30);
    ctx.lineTo(south.x + o.tw * 0.55, south.y - 4);
    ctx.fill();
  }

  function srcSize(image) {
    return { w: image.naturalWidth || image.width || 0, h: image.naturalHeight || image.height || 0 };
  }

  function sliceSheets() {
    var id, spec, sheet, cells, size, cw, i, c, g, key;
    for (id in LOOK.actors) {
      spec = LOOK.actors[id];
      if (!spec.sheet || !img[spec.sheet] || img[spec.sheet + "_0"]) continue;
      sheet = img[spec.sheet];
      size = srcSize(sheet);
      cells = spec.cells || 8;
      if (!size.w || !size.h) continue;
      cw = Math.floor(size.w / cells);
      for (i = 0; i < cells; i++) {
        c = document.createElement("canvas");
        c.width = cw;
        c.height = size.h;
        g = c.getContext("2d");
        g.drawImage(sheet, i * cw, 0, cw, size.h, 0, 0, cw, size.h);
        key = spec.sheet + "_" + i;
        img[key] = c;
        measureContact(c);
      }
    }
  }

  function measureContact(image) {
    var size = srcSize(image);
    if (!contact || !size.w || !size.h) return;
    var w = size.w;
    var h = size.h;
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    var g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(image, 0, 0);
    var data = g.getImageData(0, 0, w, h).data;
    var y, x, count, found = h - 1;
    for (y = h - 1; y >= 0; y--) {
      count = 0;
      for (x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 48) {
          count += 1;
          if (count >= 3) { found = y; y = -1; break; }
        }
      }
    }
    contact.set(image, found);
  }

  function groundShadow(ctx, x, y, tw, shadow) {
    if (!shadow) return;
    ctx.save();
    ctx.fillStyle = "rgba(48, 32, 16, 0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y - 1, Math.max(3, tw * shadow[0] * 0.22), Math.max(2, tw * shadow[1] * 0.18), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function blitFoot(ctx, image, footX, footY, tw, scale) {
    var size = image ? srcSize(image) : { w: 0, h: 0 };
    if (!image || !size.w) return;
    var px = (tw / 256) * (scale || 1);
    var dw = size.w * px;
    var dh = size.h * px;
    var row = contact && contact.get(image);
    if (row === undefined || row === null) row = size.h - 1;
    ctx.drawImage(image, footX - dw / 2, footY - (row + 1) * px, dw, dh);
    if (markGround) groundMarks.push(footX, footY);
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

  function shadowAt() {}

  var grewFile = {};
  var grewAt = {};

  function drawSprite(ctx, name, b, o, now, pop, squash) {
    var spot = placePoint(b, o);
    var scale = spot.spec.scale || 1;
    var sc = scale;
    var sx = 1;
    var sy = 1;
    if (squash && now - squash < 220) {
      var q = (now - squash) / 220;
      sx = 1 + Math.sin(q * Math.PI) * 0.14;
      sy = 1 - Math.sin(q * Math.PI) * 0.12;
    }
    if (b && b.id) {
      if (grewFile[b.id] && grewFile[b.id] !== name) grewAt[b.id] = now;
      grewFile[b.id] = name;
      if (grewAt[b.id] && now - grewAt[b.id] < 280) sc *= 1 + Math.sin((now - grewAt[b.id]) / 280 * Math.PI) * 0.1;
    }
    var drop = 0;
    if (pop && now - pop < 640) {
      var u = (now - pop) / 640;
      var fall = u < 0.72 ? 1 - easeOut(u / 0.72) : 0;
      drop = fall * o.th * 1.1;
      var land = u > 0.72 ? Math.sin((u - 0.72) / 0.28 * Math.PI) : 0;
      sx *= 1 + land * 0.1;
      sy *= 1 - land * 0.12;
      sc = scale * (0.92 + Math.min(1, u / 0.3) * 0.08);
    }
    ctx.save();
    groundShadow(ctx, spot.x, spot.y, o.tw, spot.spec.shadow);
    ctx.translate(spot.x, spot.y - drop);
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

  function readyMark(ctx, x, y, now) {
    var bob = Math.sin(now / 360) * 2;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.fillStyle = "#2f6d4f";
    ctx.strokeStyle = "#1d4a34";
    ctx.lineWidth = 2;
    roundRect(ctx, -16, -11, 32, 18, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fffaf3";
    ctx.font = "700 11px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Pick", 0, -1);
    ctx.restore();
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
    var step = k * 2;
    var half = step < 1 ? 0 : 1;
    var local = step - half;
    var eased = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
    var along = (half + eased) / 2;
    return {
      x: route[a][0] + (route[b][0] - route[a][0]) * along,
      y: route[a][1] + (route[b][1] - route[a][1]) * along,
      dir: facing(route[b][0] - route[a][0], route[b][1] - route[a][1]),
      plant: k
    };
  }

  function actorImage(spec, now, pose) {
    var list = spec.idle;
    var rate = 720;
    if (pose === "walk" && spec.walk) { list = spec.walk; rate = 150; }
    else if ((pose === "work" || pose === "water" || pose === "wave") && spec.work) { list = spec.work; rate = 280; }
    if (!spec.sheet || !list || !list.length || !img[spec.sheet]) return img[spec.file];
    var idx = list[Math.floor(now / rate) % list.length];
    return img[spec.sheet + "_" + idx] || img[spec.file];
  }

  function artScaleX(spec, screenRight) {
    if (!spec.sheet || !img[spec.sheet]) return screenRight ? -1 : 1;
    var facesRight = spec.face > 0;
    if (screenRight == null) return 1;
    return screenRight === facesRight ? 1 : -1;
  }

  function actorWhere(entry, state, now) {
    var known = state.collection || {};
    if (!known[entry.id] || !known[entry.id].have) return null;
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
      for (bi = 0; bi < state.buildings.length; bi++) if (state.buildings[bi].type === "home") home = state.buildings[bi];
      if (home) { x = home.x + home.w + 0.55; y = home.y + home.h + 0.15; }
      pose = Math.floor(now / 2800) % 4 === 0 ? "work" : "idle";
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
        for (bi = 0; bi < state.buildings.length; bi++) {
          var bed = state.buildings[bi];
          if (bed.type !== "bed" || !bed.phase || bed.phase === "empty") continue;
          var dx = x - (bed.x + 0.55);
          var dy = y - (bed.y + 0.55);
          if (dx * dx + dy * dy < 0.1) pose = "work";
        }
      }
      if (entry.id === "doek") {
        var spaza = null;
        for (bi = 0; bi < state.buildings.length; bi++) if (state.buildings[bi].type === "spaza") spaza = state.buildings[bi];
        if (spaza) { x = spaza.x + 0.2; y = spaza.y + 1.15; pose = "work"; }
      }
    }
    return { x: x, y: y, dir: dir, pose: pose, housed: housed };
  }

  function importantFeet(state, o, now) {
    var pts = [];
    var i, b, spot;
    for (i = 0; i < state.buildings.length; i++) {
      b = state.buildings[i];
      pts.push(north(b.x + b.w * 0.5, b.y + b.h * 0.55, o));
    }
    for (i = 0; i < LOOK.cast.length; i++) {
      spot = actorWhere(LOOK.cast[i], state, now);
      if (spot) pts.push(north(spot.x, spot.y, o));
    }
    pts.push(north(1.35, 6.35, o));
    return pts;
  }

  function treeCovers(foot, file, scale, o, points) {
    var image = img[file];
    var size = image ? srcSize(image) : { w: 0, h: 0 };
    if (!size.w || !points) return false;
    var px = (o.tw / 256) * (scale || 1);
    var dw = size.w * px;
    var dh = size.h * px;
    var i, p, dx, dy;
    for (i = 0; i < points.length; i++) {
      p = points[i];
      dy = foot.y - p.y;
      if (dy < 6) continue;
      dx = Math.abs(p.x - foot.x);
      if (dx < dw * 0.46 && dy < dh * 0.88) return true;
    }
    return false;
  }

  function queueActors(queue, state, o, now, ctx) {
    var i;
    for (i = 0; i < LOOK.cast.length; i++) {
      (function (entry) {
        var spot = actorWhere(entry, state, now);
        if (!spot) return;
        var spec = LOOK.actors[entry.id];
        var x = spot.x;
        var y = spot.y;
        var dir = spot.dir;
        var pose = spot.pose;
        var housed = spot.housed;
        var n = north(x, y, o);
        var moving = pose === "walk" && !housed && !entry.spot;
        var framed = !!(spec.sheet && img[spec.sheet]);
        var screenRight = dir === 1 || dir === 0;
        if (moving) lastFace[entry.id] = screenRight;
        var flip = artScaleX(spec, lastFace[entry.id] == null ? null : (moving ? screenRight : lastFace[entry.id]));
        var bob = 0;
        var squashY = 1;
        if (!framed && entry.id === "hen") {
          var peck = (now / 1100 + y) % 1;
          if (peck > 0.78) { squashY = 0.82; bob = o.th * 0.03; }
        } else if (!framed && entry.spot) {
          bob = Math.sin(now / 900 + y) * o.th * 0.01;
        }
        var sprite = actorImage(spec, now, moving ? "walk" : pose);
        queue.push({ y: n.y, draw: function () {
          ctx.save();
          groundShadow(ctx, n.x, n.y, o.tw, spec.shadow);
          ctx.translate(n.x, n.y + bob);
          ctx.scale(flip, squashY);
          blitFoot(ctx, sprite, 0, 0, o.tw, spec.scale);
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
      ctx.fillText(f.text, f.x, f.y - a * 36);
      if (f.kind === "water") {
        var d;
        for (d = 0; d < 4; d++) {
          ctx.fillStyle = "rgba(61, 142, 201, " + (1 - a) + ")";
          ctx.beginPath();
          ctx.ellipse(f.x - 10 + d * 7, f.y - 8 - a * 28 - (d % 2) * 6, 2.2, 3.4, 0, 0, 7);
          ctx.fill();
        }
        ctx.restore();
        continue;
      }
      var bits = f.coins || 4;
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

  function plotsKey(state) {
    var s = "";
    var id;
    var plots = (state && state.plots) || {};
    for (id in KHAYA.PLOTS) s += plots[id] ? "1" : "0";
    return s;
  }

  function ensureBackdrop(w, h, o, dpr, phase) {
    var stamp = (img.neighbour_mural ? 1 : 0) + (img.tree_acacia ? 2 : 0) + (img.tree_jacaranda ? 4 : 0);
    var key = [w, h, dpr, Math.round(o.horizon), Math.round(o.tw * 2), phase, stamp].join(":");
    if (backdrop && backdropKey === key) return backdrop;
    var c = document.createElement("canvas");
    c.width = Math.max(1, Math.floor(w * dpr));
    c.height = Math.max(1, Math.floor(h * dpr));
    var g = c.getContext("2d", { alpha: false });
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    sky(g, w, h, phase);
    distant(g, w, h, o);
    backdrop = c;
    backdropKey = key;
    return c;
  }

  function ensurePlate(o, state, dpr) {
    var key = (img.tile_grass ? "g" : "0") + dpr + ":" + Math.round(o.tw * 4) + "x" + Math.round(o.th * 4) + ":" + plotsKey(state);
    if (plate && plateKey === key) return plate;
    var cols = KHAYA.COLS;
    var rows = KHAYA.ROWS;
    var pad = Math.ceil(Math.max(o.tw, o.th) * 1.5);
    var bw = Math.ceil((cols + rows) * o.tw / 2 + pad * 2);
    var bh = Math.ceil((cols + rows) * o.th / 2 + pad * 2);
    var c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(bw * dpr));
    c.height = Math.max(1, Math.ceil(bh * dpr));
    var g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var local = { tw: o.tw, th: o.th, ox: pad + rows * o.tw / 2, oy: pad };
    var x, y;
    for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) ground(g, x, y, local, state);
    plate = { canvas: c, ox: local.ox, oy: local.oy, w: bw, h: bh };
    plateKey = key;
    return plate;
  }

  function render(canvas, state, view, now) {
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var sharp = (view && view.sharp) || 1;
    var scale = sharp < 1 ? Math.max(1 / ratio, sharp) : 1;
    var dpr = ratio * scale;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    var ctx = canvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = true;
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var o = layout(w, h, view && view.cam);
    markGround = !!(view && view.ground);
    groundMarks.length = 0;
    var phase = phaseOf(now, view && view.light);
    var calm = view && view.calm;
    ctx.drawImage(ensureBackdrop(w, h, o, dpr, phase), 0, 0, w, h);
    if (!calm && phase !== "night") drawClouds(ctx, w, h, now);
    if (!calm && phase !== "night" && phase !== "dusk") drawBird(ctx, w, h, now);
    road(ctx, w, h, o);
    var plated = ensurePlate(o, state, dpr);
    var origin = north(0, 0, o);
    ctx.drawImage(plated.canvas, origin.x - plated.ox, origin.y - plated.oy, plated.w, plated.h);
    var queue = [];
    var feet = importantFeet(state, o, now);
    var x, y, i;
    for (y = 0; y < KHAYA.ROWS; y++) for (x = 0; x < KHAYA.COLS; x++) {
      if (KHAYA.terrainAt(x, y) !== "tree") continue;
      if (LOOK.treeSkip && LOOK.treeSkip[x + "," + y]) continue;
      (function (tx, ty) {
        var file = (LOOK.treeAt && LOOK.treeAt[tx + "," + ty]) || "tree_acacia";
        var nudge = (LOOK.treeNudge && LOOK.treeNudge[tx + "," + ty]) || [0, 0];
        var n = north(tx + 0.5 + nudge[0], ty + 0.5 + nudge[1], o);
        var treeScale = (LOOK.treeScale && LOOK.treeScale[file]) || 1;
        var fade = treeCovers(n, file, treeScale, o, feet);
        queue.push({ y: n.y, draw: function () {
          ctx.save();
          if (fade) ctx.globalAlpha = 0.38;
          if (!calm) {
            ctx.translate(n.x, n.y);
            ctx.rotate(Math.sin(now / 1400 + tx) * 0.012);
            ctx.translate(-n.x, -n.y);
          }
          blitFoot(ctx, img[file], n.x, n.y, o.tw, treeScale);
          ctx.restore();
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
          if (job && !dragging) {
            barOver(ctx, drawn.x, drawn.y - o.th * 1.3, o.tw * 0.7, job.progress, "#7eb6e0");
            puff(ctx, drawn.x + o.tw * 0.1, drawn.y - o.th * 0.35, now, "steam");
          }
          if (building.type === "bed" && !dragging) {
            var growth = KHAYA.bedView(building, now);
            if (growth && growth.phase === "growing") barOver(ctx, drawn.x, drawn.y - o.th * 1.55, o.tw * 0.5, growth.progress, "#7dcea0");
            if (growth && growth.phase === "ready") readyMark(ctx, drawn.x, drawn.y - o.th * 1.7, now);
          }
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
        var tree = piece.file.indexOf("tree_") === 0;
        var fade = tree && treeCovers(n, piece.file, piece.scale || 1, o, feet);
        var sway = tree || piece.file === "washing_line";
        queue.push({ y: n.y, draw: function () {
          ctx.save();
          if (fade) ctx.globalAlpha = 0.38;
          if (sway && !calm) {
            ctx.translate(n.x, n.y);
            ctx.rotate(Math.sin(now / (tree ? 1600 : 900) + piece.x) * (tree ? 0.012 : 0.03));
            ctx.translate(-n.x, -n.y);
          }
          blitFoot(ctx, img[piece.file], n.x, n.y, o.tw, piece.scale || 1);
          ctx.restore();
        } });
      })(LOOK.dress[di]);
    }
    queueActors(queue, state, o, now, ctx);
    (function () {
      var orders = state.orders || {};
      var spot = { x: 1.35, y: 6.35 };
      var since = now - (orders.at || now);
      var drive = 0;
      if (orders.phase === "here" && since < 2800) {
        drive = easeInOut(Math.min(1, since / 2800));
        spot = { x: -1.4 + (1.35 + 1.4) * drive, y: 6.35 };
      } else if (orders.phase === "away" && since < 2600) {
        drive = easeInOut(Math.min(1, since / 2600));
        spot = { x: 1.35 + drive * 5, y: 6.35 };
      }
      var movingTaxi = (orders.phase === "here" && since < 2800) || (orders.phase === "away" && since < 2600);
      var bounce = movingTaxi ? Math.sin(since / 90) * 0.035 * (1 - Math.min(1, since / 2600)) : 0;
      if (!movingTaxi && orders.phase === "here" && since < 3400) bounce = Math.sin((since - 2800) / 600 * Math.PI) * 0.03;
      var n = north(spot.x, spot.y + bounce, o);
      queue.push({ y: n.y, draw: function () {
        blitFoot(ctx, img.taxi, n.x, n.y, o.tw, 0.85);
        if (movingTaxi) puff(ctx, n.x - o.tw * 0.18, n.y - o.th * 0.15, now, "steam");
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
    if (VEIL[phase]) {
      ctx.fillStyle = VEIL[phase];
      ctx.fillRect(0, 0, w, h);
    }
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
    if (view.hint) {
      ctx.save();
      ctx.globalAlpha = 0.55 + Math.sin(now / 320) * 0.25;
      ring(ctx, view.hint.x, view.hint.y, view.hint.w, view.hint.h, o, "#e2a53a");
      ctx.restore();
    }
    if (view.floats) floats(ctx, view.floats, now);
    if (markGround) {
      ctx.save();
      ctx.strokeStyle = "#ff2d55";
      ctx.lineWidth = 2;
      var mi;
      for (mi = 0; mi < groundMarks.length; mi += 2) {
        ctx.beginPath();
        ctx.moveTo(groundMarks[mi] - 10, groundMarks[mi + 1]);
        ctx.lineTo(groundMarks[mi] + 10, groundMarks[mi + 1]);
        ctx.stroke();
      }
      ctx.restore();
    }
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
