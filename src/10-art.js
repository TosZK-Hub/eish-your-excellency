// Khaya Lane scene. Sprites are original Blender renders. The veld, sky and UI motion are drawn here.
var DRAW = (function () {
  var SPRITE = 3.6;
  var img = {};
  var ready = false;
  var names = [
    "home1", "home2", "home3", "spaza1", "spaza2",
    "bed_empty", "bed_sown",
    "bed_maize_mid", "bed_maize_ready", "bed_spinach_mid", "bed_spinach_ready",
    "bed_tomato_mid", "bed_tomato_ready", "bed_aloe_mid", "bed_aloe_ready",
    "tank", "workshop", "solar", "jacaranda", "acacia", "aloeplant", "fence",
    "person0", "person1", "person2", "person3", "hen0", "hen1", "dog0", "dog1", "neighbour"
  ];
  var PATH = [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [4, 5], [4, 4], [4, 3]];

  function load(done) {
    var left = names.length;
    names.forEach(function (n) {
      var el = new Image();
      el.onload = el.onerror = function () {
        if (el.naturalWidth) img[n] = el;
        left -= 1;
        if (left === 0) { ready = true; if (done) done(); }
      };
      el.src = "assets/khaya/" + n + ".png";
    });
  }

  function north(x, y, o) { return KHAYA.cellNorth(x, y, o.ox, o.oy, o.tw, o.th); }

  function corners(x, y, w, h, o) {
    return { n: north(x, y, o), e: north(x + w, y, o), s: north(x + w, y + h, o), w: north(x, y + h, o) };
  }

  function mid(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  function layout(w, h) {
    var cols = KHAYA.COLS;
    var rows = KHAYA.ROWS;
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
    var plotW = (cols + rows) * tw / 2;
    var ox = (w - plotW) / 2 + rows * tw / 2;
    var oy = horizon + Math.max(th, (h - horizon - plotH) * 0.42);
    return { tw: tw, th: th, ox: ox, oy: oy, horizon: horizon };
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
    veld.addColorStop(0, "#c6a15a");
    veld.addColorStop(0.18, "#8eae55");
    veld.addColorStop(1, "#6d9448");
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
    var n;
    for (n = 0; n < 3; n++) {
      blit(ctx, img.neighbour, w * (0.18 + n * 0.28), hy + 6, o.tw * 1.15);
    }
  }

  function blit(ctx, image, cx, cy, tw, scale) {
    if (!image) return;
    var dw = tw * SPRITE * (scale || 1);
    ctx.drawImage(image, cx - dw / 2, cy - dw / 2, dw, dw);
  }

  function hash(x, y) {
    var n = (x * 17 + y * 31) % 5;
    return n < 0 ? n + 5 : n;
  }

  function ground(ctx, x, y, o) {
    var c = corners(x, y, 1, 1, o);
    var kind = KHAYA.terrainAt(x, y);
    var fill = kind === "path" ? "#e4c79a" : kind === "tree" ? "#6ea356" : (hash(x, y) % 4 === 0 ? "#74a85a" : "#7eb262");
    poly(ctx, [c.n, c.e, c.s, c.w], fill);
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

  function bedName(b, now) {
    var view = KHAYA.bedView(b, now);
    if (!view || view.phase === "empty") return "bed_empty";
    if (view.phase === "sown" || view.progress < 0.34) return "bed_sown";
    if (view.progress < 0.72) return "bed_" + b.crop + "_mid";
    return "bed_" + b.crop + "_ready";
  }

  function spriteName(b, now) {
    if (b.type === "home") return "home" + Math.max(1, Math.min(3, b.level));
    if (b.type === "spaza") return "spaza" + Math.max(1, Math.min(2, b.level));
    if (b.type === "bed") return bedName(b, now);
    return b.type === "tank" ? "tank" : b.type;
  }

  function centerOf(b, o) {
    var c = corners(b.x, b.y, b.w, b.h, o);
    return mid(c.n, c.s, 0.5);
  }

  function drawSprite(ctx, name, b, o, now, pop) {
    var p = centerOf(b, o);
    var sc = 1;
    if (pop && now - pop < 560) {
      var u = (now - pop) / 560;
      sc = 0.25 + u * 0.85;
      if (u > 0.72) sc = 1 + Math.sin((u - 0.72) / 0.28 * Math.PI) * 0.07;
    }
    ctx.save();
    if (sc !== 1) {
      ctx.translate(p.x, p.y);
      ctx.scale(sc, sc);
      ctx.translate(-p.x, -p.y);
    }
    blit(ctx, img[name], p.x, p.y, o.tw, 1);
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

  function life(ctx, o, now) {
    var spots = [
      { name: "person", offset: 0, scale: 0.72 },
      { name: "person", offset: 0.45, scale: 0.72 },
      { name: "hen", offset: 0.2, scale: 0.55, wobble: true },
      { name: "hen", offset: 0.7, scale: 0.5, wobble: true },
      { name: "dog", offset: 0.15, scale: 0.62 }
    ];
    var i;
    for (i = 0; i < spots.length; i++) {
      var s = spots[i];
      var u = ((now / 7000) + s.offset) % 1;
      var f = u * PATH.length;
      var a = Math.floor(f) % PATH.length;
      var b = (a + 1) % PATH.length;
      var k = f - Math.floor(f);
      var x = PATH[a][0] + (PATH[b][0] - PATH[a][0]) * k;
      var y = PATH[a][1] + (PATH[b][1] - PATH[a][1]) * k;
      if (s.name === "hen") {
        x = 5.4 + Math.sin(now / 900 + s.offset * 6) * 0.7;
        y = 4.2 + Math.cos(now / 1100 + s.offset) * 0.45;
      }
      if (s.name === "dog") {
        x = 2.3 + Math.sin(now / 1400) * 0.35;
        y = 4.15;
      }
      var n = north(x, y, o);
      var frame = Math.floor(now / 180 + s.offset * 8) % (s.name === "person" ? 4 : 2);
      var key = s.name + frame;
      blit(ctx, img[key], n.x, n.y + o.th * 0.35, o.tw, s.scale);
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
      var k;
      for (k = 0; k < 6; k++) {
        var ang = k / 6 * Math.PI * 2 + f.t;
        ctx.beginPath();
        ctx.arc(f.x + Math.cos(ang) * a * 26, f.y - 10 + Math.sin(ang) * a * 16, 3.2 * (1 - a), 0, 7);
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
    var o = layout(w, h);
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
      ground(ctx, x, y, o);
      if (KHAYA.terrainAt(x, y) === "tree") {
        var tree = hash(x, y) % 2 ? img.jacaranda : img.acacia;
        var n = north(x + 0.5, y + 0.5, o);
        blit(ctx, tree, n.x, n.y, o.tw, 1);
      }
    }
    var items = [];
    for (i = 0; i < state.buildings.length; i++) {
      var b = state.buildings[i];
      items.push({ k: b.x + b.y + 0.1, b: b });
    }
    items.sort(function (a, b) { return a.k - b.k; });
    for (i = 0; i < items.length; i++) {
      var building = items[i].b;
      drawSprite(ctx, spriteName(building, now), building, o, now, view.born && view.born[building.id]);
    }
    life(ctx, o, now);
    if (view.ghost) {
      var gok = KHAYA.canPlace(state, view.ghost.type, view.ghost.x, view.ghost.y).ok;
      var ghost = {
        type: view.ghost.type, x: view.ghost.x, y: view.ghost.y,
        w: KHAYA.BUILDINGS[view.ghost.type].w, h: KHAYA.BUILDINGS[view.ghost.type].h, level: 1
      };
      ctx.save();
      ctx.globalAlpha = 0.6;
      drawSprite(ctx, spriteName(ghost, now), ghost, o, now, 0);
      ctx.restore();
      ring(ctx, ghost.x, ghost.y, ghost.w, ghost.h, o, gok ? "#f2c14e" : "#d64545");
    }
    if (view.selected) ring(ctx, view.selected.x, view.selected.y, view.selected.w, view.selected.h, o, "#f2c14e");
    if (view.floats) floats(ctx, view.floats, now);
    return o;
  }

  return { load: load, render: render, layout: layout, ready: function () { return ready; } };
})();
