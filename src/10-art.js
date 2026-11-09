// Khaya Lane scene. Sprites are original Blender renders. The veld, sky and UI motion are drawn here.
var DRAW = (function () {
  var SPRITE = 3.6;
  var img = {};
  var ready = false;

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
    for (id in LOOK.actors) add(LOOK.actors[id].file);
    for (i = 0; i < LOOK.trees.length; i++) add(LOOK.trees[i]);
    for (i = 0; i < LOOK.neighbours.length; i++) add(LOOK.neighbours[i]);
    for (i = 0; i < LOOK.dress.length; i++) add(LOOK.dress[i].file);
    add("tile_grass");
    add("tile_dirt");
    return list;
  }

  function loadSet(names, done) {
    if (!names.length) { if (done) done(); return; }
    var left = names.length;
    names.forEach(function (n) {
      var el = new Image();
      el.onload = el.onerror = function () {
        if (el.naturalWidth) img[n] = el;
        left -= 1;
        if (left === 0 && done) done();
      };
      el.src = LOOK.root + n + LOOK.ext;
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

  function layout(w, h, cam) {
    cam = cam || { x: 0, y: 0, z: 1 };
    var z = cam.z || 1;
    if (z < 0.55) z = 0.55;
    if (z > 2.2) z = 2.2;
    var cols = 8;
    var rows = 8;
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
    var o = layout(w, h, cam);
    var north = KHAYA.cellNorth(0, 0, o.ox, o.oy, o.tw, o.th);
    var south = KHAYA.cellNorth(KHAYA.COLS, KHAYA.ROWS, o.ox, o.oy, o.tw, o.th);
    var east = KHAYA.cellNorth(KHAYA.COLS, 0, o.ox, o.oy, o.tw, o.th);
    var west = KHAYA.cellNorth(0, KHAYA.ROWS, o.ox, o.oy, o.tw, o.th);
    if (south.y < h * 0.42) cam.y += h * 0.42 - south.y;
    if (north.y > h * 0.62) cam.y -= north.y - h * 0.62;
    if (east.x < w * 0.18) cam.x += w * 0.18 - east.x;
    if (west.x > w * 0.82) cam.x -= west.x - w * 0.82;
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
    var south = north(KHAYA.COLS, KHAYA.ROWS, o);
    ctx.fillStyle = "#d7b56a";
    ctx.beginPath();
    ctx.moveTo(south.x - o.tw * 0.55, south.y - 4);
    ctx.lineTo(w * 0.5 - Math.min(120, w * 0.16), h + 30);
    ctx.lineTo(w * 0.5 + Math.min(120, w * 0.16), h + 30);
    ctx.lineTo(south.x + o.tw * 0.55, south.y - 4);
    ctx.fill();
    var spots = [0.12, 0.4, 0.7];
    var n;
    for (n = 0; n < LOOK.neighbours.length; n++) {
      blitFoot(ctx, img[LOOK.neighbours[n]], w * spots[n], hy + 18, o.tw * 0.72, 0.9);
    }
    blitFoot(ctx, img.tree_jacaranda, w * 0.88, hy + 36, o.tw * 0.7, 1);
    blitFoot(ctx, img.tree_acacia, w * 0.26, hy + 42, o.tw * 0.7, 1);
  }

  function blitFoot(ctx, image, footX, footY, tw, scale) {
    if (!image || !image.naturalWidth) return;
    var px = (tw / 256) * (scale || 1);
    var dw = image.naturalWidth * px;
    var dh = image.naturalHeight * px;
    ctx.drawImage(image, footX - dw / 2, footY - dh, dw, dh);
  }

  function hash(x, y) {
    var n = (x * 17 + y * 31) % 5;
    return n < 0 ? n + 5 : n;
  }

  function ground(ctx, x, y, o, state) {
    var c = corners(x, y, 1, 1, o);
    var kind = KHAYA.terrainAt(x, y);
    var open = !state || KHAYA.plotOpen(state, x, y);
    var tile = kind === "path" ? img.tile_dirt : img.tile_grass;
    if (tile) {
      var midCell = north(x + 0.5, y + 0.5, o);
      ctx.drawImage(tile, midCell.x - o.tw / 2, midCell.y - o.th / 2, o.tw, o.th);
    } else {
      var fill = kind === "path" ? "#c47a45" : "#c6a84a";
      poly(ctx, [c.n, c.e, c.s, c.w], fill);
    }
    if (!open) {
      ctx.save();
      ctx.globalAlpha = 0.38;
      poly(ctx, [c.n, c.e, c.s, c.w], "#3a2416");
      ctx.restore();
    }
    if (tile) return;
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

  function shadowAt(ctx, x, y, rx, ry) {
    ctx.save();
    ctx.fillStyle = "rgba(72, 44, 18, 0.30)";
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(4, rx), Math.max(3, ry), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSprite(ctx, name, b, o, now, pop, squash) {
    var spot = placePoint(b, o);
    var scale = spot.spec.scale || 1;
    var sc = scale;
    var sx = 1;
    var sy = 1;
    if (pop && now - pop < 560) {
      var u = (now - pop) / 560;
      sc = scale * (0.25 + u * 0.85);
      if (u > 0.72) sc = scale * (1 + Math.sin((u - 0.72) / 0.28 * Math.PI) * 0.08);
    }
    if (squash && now - squash < 220) {
      var q = (now - squash) / 220;
      sx = 1 + Math.sin(q * Math.PI) * 0.14;
      sy = 1 - Math.sin(q * Math.PI) * 0.12;
    }
    var sh = spot.spec.shadow || [0.6, 0.22];
    shadowAt(ctx, spot.x, spot.y + o.th * 0.08, o.tw * sh[0] * 0.55, o.th * sh[1] * 1.3);
    ctx.save();
    ctx.translate(spot.x, spot.y);
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
    return {
      x: route[a][0] + (route[b][0] - route[a][0]) * k,
      y: route[a][1] + (route[b][1] - route[a][1]) * k,
      dir: facing(route[b][0] - route[a][0], route[b][1] - route[a][1])
    };
  }

  function actorFrame(spec, now, dir, pose) {
    if (pose === "water" && spec.water) return spec.water[Math.floor(now / 180) % spec.water.length];
    if (pose === "wave" && spec.wave) return spec.wave[Math.floor(now / 160) % spec.wave.length];
    if (spec.walk) return spec.walk + "_" + (dir || 0) + "_" + (Math.floor(now / 140) % spec.frames);
    if (spec.idle) return spec.idle[Math.floor(now / 280) % spec.idle.length];
    return "";
  }

  function queueActors(queue, state, o, now, ctx) {
    var known = state.collection || {};
    var i;
    for (i = 0; i < LOOK.cast.length; i++) {
      (function (entry) {
        if (!known[entry.id] || !known[entry.id].have) return;
        var spec = LOOK.actors[entry.id];
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
          var bi;
          for (bi = 0; bi < state.buildings.length; bi++) if (state.buildings[bi].type === "home") home = state.buildings[bi];
          if (home) { x = home.x + home.w + 0.55; y = home.y + home.h + 0.15; }
          pose = "idle";
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
            var bed = null;
            for (bi = 0; bi < state.buildings.length; bi++) {
              if (state.buildings[bi].type === "bed" && state.buildings[bi].phase && state.buildings[bi].phase !== "empty") bed = state.buildings[bi];
            }
            if (bed) { x = bed.x + 0.15; y = bed.y + 1.05; pose = "water"; }
          }
          if (entry.id === "jersey" && Math.floor(now / 5000) % 6 === 0) pose = "wave";
          if (entry.id === "doek") {
            var spaza = null;
            for (bi = 0; bi < state.buildings.length; bi++) if (state.buildings[bi].type === "spaza") spaza = state.buildings[bi];
            if (spaza) { x = spaza.x + 0.2; y = spaza.y + 1.15; dir = 0; }
          }
        }
        var n = north(x, y, o);
        var moving = pose === "walk" && !housed;
        var phase = now / 170 + x;
        var bob = moving ? Math.sin(phase) * o.th * 0.08 : Math.sin(now / 700 + y) * o.th * 0.02;
        var stretch = moving ? 1 + Math.sin(phase) * 0.045 : 1;
        var squashY = moving ? 1 - Math.sin(phase) * 0.04 : 1;
        var lean = moving ? (dir === 1 || dir === 0 ? -0.08 : 0.08) : 0;
        var flip = dir === 1 || dir === 0 ? -1 : 1;
        queue.push({ y: n.y, draw: function () {
          var sh = spec.shadow || [0.3, 0.12];
          shadowAt(ctx, n.x, n.y, o.tw * sh[0] * 0.55, o.th * sh[1] * 1.1);
          ctx.save();
          ctx.translate(n.x, n.y + bob);
          ctx.rotate(lean);
          ctx.scale(flip * stretch, squashY);
          blitFoot(ctx, img[spec.file], 0, 0, o.tw, spec.scale);
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
      ctx.fillText(f.text, f.x, f.y - a * 42);
      var bits = f.coins || 6;
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
    var o = layout(w, h, view && view.cam);
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
      ground(ctx, x, y, o, state);
    }
    var queue = [];
    for (i = 0; i < cells.length; i++) {
      x = cells[i].x;
      y = cells[i].y;
      if (KHAYA.terrainAt(x, y) !== "tree") continue;
      (function (tx, ty) {
        var file = LOOK.trees[hash(tx, ty) % LOOK.trees.length];
        var n = north(tx + 0.5, ty + 0.5, o);
        queue.push({ y: n.y, draw: function () {
          shadowAt(ctx, n.x, n.y, o.tw * 0.42, o.th * 0.28);
          blitFoot(ctx, img[file], n.x, n.y, o.tw, 1);
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
          if (job && !dragging) barOver(ctx, drawn.x, drawn.y - o.th * 1.3, o.tw * 0.7, job.progress, "#7eb6e0");
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
        queue.push({ y: n.y, draw: function () {
          shadowAt(ctx, n.x, n.y, o.tw * 0.28, o.th * 0.2);
          blitFoot(ctx, img[piece.file], n.x, n.y, o.tw, piece.scale || 1);
          if (piece.file === "taxi") puff(ctx, n.x + o.tw * 0.05, n.y - o.th * 0.35, now, "steam");
        } });
      })(LOOK.dress[di]);
    }
    queueActors(queue, state, o, now, ctx);
    queue.sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < queue.length; i++) queue[i].draw();
    var pid;
    for (pid in KHAYA.PLOTS) {
      if (KHAYA.plotOpen(state, KHAYA.PLOTS[pid].x, KHAYA.PLOTS[pid].y)) continue;
      var plot = KHAYA.PLOTS[pid];
      var lock = north(plot.x + plot.w / 2, plot.y + plot.h / 2, o);
      ctx.save();
      ctx.fillStyle = "#243028";
      ctx.beginPath();
      ctx.arc(lock.x, lock.y, 14, 0, 7);
      ctx.fill();
      ctx.fillStyle = "#f6efe2";
      ctx.font = "700 14px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(plot.notes, lock.x, lock.y);
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
    if (view.floats) floats(ctx, view.floats, now);
    return o;
  }

  return { load: load, render: render, layout: layout, clampCamera: clampCamera, ready: function () { return ready; } };
})();
