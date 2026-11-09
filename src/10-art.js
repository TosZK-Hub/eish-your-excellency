// Isometric neighbourhood. Original drawing, no external art.
var DRAW = (function () {
  var ink = "rgba(36, 44, 38, .38)";

  function north(x, y, o) {
    return KHAYA.cellNorth(x, y, o.ox, o.oy, o.tw, o.th);
  }

  function corners(x, y, w, h, o) {
    return {
      n: north(x, y, o),
      e: north(x + w, y, o),
      s: north(x + w, y + h, o),
      w: north(x, y + h, o)
    };
  }

  function poly(ctx, pts, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    var i;
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke !== false) {
      ctx.strokeStyle = stroke || ink;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
  }

  function lift(p, h) { return { x: p.x, y: p.y - h }; }

  function mid(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function prism(ctx, c, h, top, left, right) {
    poly(ctx, [c.w, c.s, lift(c.s, h), lift(c.w, h)], left);
    poly(ctx, [c.s, c.e, lift(c.e, h), lift(c.s, h)], right);
    poly(ctx, [lift(c.n, h), lift(c.e, h), lift(c.s, h), lift(c.w, h)], top);
  }

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function layout(w, h) {
    var cols = KHAYA.COLS;
    var rows = KHAYA.ROWS;
    var margin = Math.max(12, Math.min(w, h) * 0.04);
    var availW = Math.max(80, w - margin * 2);
    var availH = Math.max(80, h - margin * 2);
    var tw = availW / ((cols + rows) / 2);
    var th = tw * 0.5;
    var roof = th * 2.6;
    if ((cols + rows) * th / 2 + roof > availH) {
      var scale = availH / ((cols + rows) * th / 2 + roof);
      tw *= scale;
      th *= scale;
    }
    var plotW = (cols + rows) * tw / 2;
    var plotH = (cols + rows) * th / 2;
    var ox = (w - plotW) / 2 + rows * tw / 2;
    var oy = h - margin - (cols + rows) * th / 2;
    if (oy < th * 1.6) oy = th * 1.6;
    return { tw: tw, th: th, ox: ox, oy: oy };
  }

  function sky(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#f7d7ae");
    g.addColorStop(0.45, "#f3c49a");
    g.addColorStop(1, "#e7a57a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(232, 154, 112, .55)";
    ctx.beginPath();
    ctx.ellipse(w * 0.2, h * 0.42, w * 0.42, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(214, 122, 92, .35)";
    ctx.beginPath();
    ctx.ellipse(w * 0.78, h * 0.38, w * 0.36, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function hash(x, y) {
    var n = (x * 17 + y * 31) % 5;
    if (n < 0) n += 5;
    return n;
  }

  function ground(ctx, x, y, o) {
    var kind = KHAYA.terrainAt(x, y);
    var c = corners(x, y, 1, 1, o);
    var fill = kind === "path" ? "#e4c79a" : kind === "tree" ? "#6a9a52" : (hash(x, y) % 4 === 0 ? "#6fa858" : "#78b05e");
    poly(ctx, [c.n, c.e, c.s, c.w], fill, "rgba(70, 100, 55, .18)");
    if (kind === "path") {
      ctx.fillStyle = "rgba(160, 116, 70, .45)";
      var p1 = mid(c.n, c.s, 0.35);
      var p2 = mid(c.w, c.e, 0.62);
      ctx.beginPath();
      ctx.ellipse(p1.x, p1.y, o.tw * 0.06, o.th * 0.08, 0.4, 0, Math.PI * 2);
      ctx.ellipse(p2.x, p2.y, o.tw * 0.05, o.th * 0.06, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (hash(x, y) % 3 === 0) {
      var d = mid(c.n, c.s, 0.58);
      ctx.fillStyle = hash(x, y) % 2 ? "#e07a9a" : "#f2d36b";
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(2, o.tw * 0.045), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tree(ctx, x, y, o, now) {
    var c = corners(x, y, 1, 1, o);
    var base = mid(c.n, c.s, 0.5);
    var sway = Math.sin(now / 700 + x) * 2;
    prism(ctx, c, o.th * 0.35, "#8d5a32", "#a56b3c", "#6e4324");
    ctx.fillStyle = "#6b3f86";
    ctx.beginPath();
    ctx.ellipse(base.x + sway, base.y - o.th * 1.15, o.tw * 0.42, o.th * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a56a8";
    ctx.beginPath();
    ctx.ellipse(base.x - o.tw * 0.12 + sway, base.y - o.th * 1.35, o.tw * 0.28, o.th * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.stroke();
  }

  function soil(ctx, b, o, now) {
    var c = corners(b.x, b.y, 1, 1, o);
    var view = KHAYA.bedView(b, now);
    prism(ctx, c, o.th * 0.28, "#c9854a", "#a86b38", "#8d572c");
    var top = {
      n: lift(c.n, o.th * 0.28),
      e: lift(c.e, o.th * 0.28),
      s: lift(c.s, o.th * 0.28),
      w: lift(c.w, o.th * 0.28)
    };
    c = top;
    var inner = {
      n: mid(c.n, mid(c.n, c.s, 0.5), 0.22),
      e: mid(c.e, mid(c.n, c.s, 0.5), 0.22),
      s: mid(c.s, mid(c.n, c.s, 0.5), 0.18),
      w: mid(c.w, mid(c.n, c.s, 0.5), 0.22)
    };
    inner = {
      n: mid(c.n, c.s, 0.18),
      e: mid(c.e, mid(c.w, c.s, 0.5), 0.25),
      s: mid(c.s, c.n, 0.16),
      w: mid(c.w, mid(c.e, c.n, 0.5), 0.25)
    };
    poly(ctx, [
      mid(c.n, c.s, 0.22),
      mid(c.e, c.w, 0.72),
      mid(c.s, c.n, 0.18),
      mid(c.w, c.e, 0.72)
    ], view.phase === "empty" ? "#8d5b38" : "#6e4428", false);
    if (view.phase === "empty") {
      ctx.strokeStyle = "rgba(90,50,30,.35)";
      ctx.beginPath();
      ctx.moveTo(mid(c.w, c.e, 0.35).x, mid(c.w, c.e, 0.35).y);
      ctx.lineTo(mid(c.w, c.e, 0.65).x, mid(c.w, c.e, 0.65).y);
      ctx.stroke();
      return;
    }
    var center = mid(c.n, c.s, 0.5);
    var p = view.progress;
    var h = view.phase === "sown" ? 4 : 8 + p * o.th * 0.9;
    var sway = Math.sin(now / 380 + b.x) * 1.5;
    var leaf = view.crop === "tomato" ? "#d24b4b" : view.crop === "aloe" ? "#7dcea0" : view.crop === "spinach" ? "#3e9a4a" : "#e2b23a";
    var stalks = view.phase === "sown" ? 3 : 5;
    var i;
    for (i = 0; i < stalks; i++) {
      var fx = center.x + (i - 2) * o.tw * 0.08 + sway;
      var fy = center.y + ((i % 2) - 0.5) * o.th * 0.12;
      ctx.strokeStyle = "#3f6b32";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + sway, fy - h);
      ctx.stroke();
      ctx.fillStyle = leaf;
      ctx.beginPath();
      ctx.ellipse(fx + sway, fy - h, view.phase === "ready" ? 7 : 4.5, view.phase === "ready" ? 6 : 3.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (view.phase === "sown") {
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.font = "600 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("water", center.x, center.y - 8);
    }
  }

  function home(ctx, b, o) {
    var c = corners(b.x, b.y, 2, 2, o);
    var wall = o.th * 1.35;
    prism(ctx, c, wall, "#f4e2c8", "#f0d7b6", "#d7b48a");
    var roof = o.th * 0.9;
    var center = mid(c.n, c.s, 0.5);
    function eave(p) {
      return { x: center.x + (p.x - center.x) * 1.08, y: center.y + (p.y - center.y) * 1.08 - wall };
    }
    var peak = { x: center.x, y: center.y - wall - roof };
    poly(ctx, [eave(c.w), eave(c.n), peak], "#c4533c");
    poly(ctx, [eave(c.n), eave(c.e), peak], "#e07052");
    poly(ctx, [eave(c.e), eave(c.s), peak], "#b84734");
    poly(ctx, [eave(c.s), eave(c.w), peak], "#9c3b2c");
    var doorTop = lift(mid(c.s, c.e, 0.38), wall * 0.72);
    var doorBot = mid(c.s, c.e, 0.42);
    poly(ctx, [doorTop, mid(doorTop, lift(c.e, wall * 0.2), 0.35), mid(doorBot, c.e, 0.2), doorBot], b.level > 1 ? "#2f8f78" : "#8d5a32", false);
    var win = lift(mid(c.s, c.w, 0.45), wall * 0.62);
    poly(ctx, [win, mid(win, lift(c.s, wall * 0.4), 0.45), mid(c.s, c.w, 0.55), mid(c.s, c.w, 0.4)], "#f6e7b4", false);
    if (b.level >= 2) {
      ctx.fillStyle = "#e25b78";
      ctx.beginPath();
      ctx.arc(mid(c.w, c.s, 0.25).x, mid(c.w, c.s, 0.25).y - 4, 5, 0, Math.PI * 2);
      ctx.arc(mid(c.e, c.s, 0.3).x, mid(c.e, c.s, 0.3).y - 4, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (b.level >= 3) {
      var p = lift(mid(c.n, c.e, 0.45), wall + roof * 0.35);
      poly(ctx, [p, mid(p, lift(c.e, wall), 0.5), mid(p, lift(c.s, wall), 0.35), mid(p, lift(c.n, wall), 0.2)], "#3d7ea6", false);
    }
  }

  function spaza(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var h = o.th * 0.7;
    prism(ctx, c, h, "#f0d7a4", "#e2c48a", "#c9a56c");
    var lip = o.th * 0.42;
    poly(ctx, [lift(c.w, h), lift(c.n, h), lift(c.e, h), lift(mid(c.e, c.s, 0.35), h - lip), lift(c.s, h - lip)], "#2f8f78", false);
    poly(ctx, [lift(mid(c.w, c.n, 0.5), h), lift(mid(c.n, c.e, 0.5), h), lift(mid(c.e, c.s, 0.65), h - lip), lift(mid(c.s, c.w, 0.5), h - lip)], "#f4e4c4", false);
    var sign = lift(mid(c.n, c.s, 0.42), h + o.th * 0.35);
    ctx.fillStyle = "#243028";
    ctx.font = "700 " + Math.max(10, o.tw * 0.2) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPAZA", sign.x, sign.y);
    ctx.fillStyle = "#d4654a";
    var crate = mid(c.s, c.w, 0.35);
    ctx.beginPath();
    ctx.arc(crate.x, crate.y - 3, Math.max(3, o.tw * 0.06), 0, Math.PI * 2);
    ctx.fill();
    if (b.level > 1) {
      ctx.fillStyle = "#e2b23a";
      ctx.beginPath();
      ctx.arc(mid(c.s, c.e, 0.3).x, mid(c.s, c.e, 0.3).y - 4, Math.max(3, o.tw * 0.06), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tank(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var base = mid(c.n, c.s, 0.55);
    var rw = o.tw * 0.28;
    var rh = o.th * 0.22;
    var h = o.th * 0.95;
    ctx.fillStyle = "#3f8f64";
    ctx.beginPath();
    ctx.ellipse(base.x, base.y - h, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2f6d4f";
    ctx.fillRect(base.x - rw, base.y - h, rw * 2, h);
    ctx.fillStyle = "#3f8f64";
    ctx.beginPath();
    ctx.ellipse(base.x, base.y, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.fillStyle = "#d7b48a";
    ctx.fillRect(base.x + rw - 2, base.y - h * 0.45, 8, 4);
  }

  function workshop(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var h = o.th * 0.8;
    prism(ctx, c, h, "#e7c49a", "#d7ae7a", "#c49662");
    poly(ctx, [lift(c.n, h), lift(c.e, h), lift(mid(c.n, c.s, 0.5), h + o.th * 0.55)], "#a36b3c");
    poly(ctx, [lift(c.n, h), lift(c.w, h), lift(mid(c.n, c.s, 0.5), h + o.th * 0.55)], "#8a552c");
    ctx.fillStyle = "#f6e2a8";
    var win = lift(mid(c.s, c.e, 0.45), h * 0.45);
    ctx.fillRect(win.x - 6, win.y - 6, 12, 8);
  }

  function solar(ctx, b, o) {
    var c = corners(b.x, b.y, 1, 1, o);
    var post = mid(c.n, c.s, 0.5);
    ctx.strokeStyle = "#8d6a45";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(post.x, post.y);
    ctx.lineTo(post.x, post.y - o.th * 0.7);
    ctx.stroke();
    poly(ctx, [
      { x: post.x - o.tw * 0.28, y: post.y - o.th * 0.7 },
      { x: post.x + o.tw * 0.22, y: post.y - o.th * 0.95 },
      { x: post.x + o.tw * 0.28, y: post.y - o.th * 0.7 },
      { x: post.x - o.tw * 0.16, y: post.y - o.th * 0.5 }
    ], "#3d7ea6");
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(post.x, post.y - o.th * 0.78);
    ctx.lineTo(post.x + o.tw * 0.05, post.y - o.th * 0.62);
    ctx.stroke();
  }

  function building(ctx, b, o, now) {
    if (b.type === "bed") soil(ctx, b, o, now);
    else if (b.type === "home") home(ctx, b, o);
    else if (b.type === "spaza") spaza(ctx, b, o);
    else if (b.type === "tank") tank(ctx, b, o);
    else if (b.type === "workshop") workshop(ctx, b, o);
    else if (b.type === "solar") solar(ctx, b, o);
  }

  function footprintStroke(ctx, x, y, w, h, o, color) {
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
    sky(ctx, w, h);
    ctx.fillStyle = "#e7b07a";
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.62, w * 0.62, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    var o = layout(w, h);
    var shadow = corners(0, 0, KHAYA.COLS, KHAYA.ROWS, o);
    ctx.fillStyle = "rgba(90, 50, 30, .13)";
    ctx.beginPath();
    ctx.ellipse((shadow.n.x + shadow.s.x) / 2, (shadow.n.y + shadow.s.y) / 2 + 8, (shadow.e.x - shadow.w.x) * 0.48, o.th * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    var cells = [];
    var x, y;
    for (y = 0; y < KHAYA.ROWS; y++) {
      for (x = 0; x < KHAYA.COLS; x++) cells.push({ x: x, y: y, k: x + y });
    }
    cells.sort(function (a, b) { return a.k - b.k; });
    var i, kind, anchor;
    for (i = 0; i < cells.length; i++) {
      x = cells[i].x;
      y = cells[i].y;
      ground(ctx, x, y, o);
      kind = KHAYA.terrainAt(x, y);
      if (kind === "tree") tree(ctx, x, y, o, now);
      anchor = null;
      var bi;
      for (bi = 0; bi < state.buildings.length; bi++) {
        if (state.buildings[bi].x === x && state.buildings[bi].y === y) anchor = state.buildings[bi];
      }
      if (anchor) building(ctx, anchor, o, now);
    }
    if (view.ghost) {
      var gok = KHAYA.canPlace(state, view.ghost.type, view.ghost.x, view.ghost.y).ok;
      ctx.save();
      ctx.globalAlpha = 0.55;
      building(ctx, {
        type: view.ghost.type,
        x: view.ghost.x,
        y: view.ghost.y,
        w: KHAYA.BUILDINGS[view.ghost.type].w,
        h: KHAYA.BUILDINGS[view.ghost.type].h,
        level: 1,
        phase: "empty",
        crop: null
      }, o, now);
      ctx.restore();
      var def = KHAYA.BUILDINGS[view.ghost.type];
      footprintStroke(ctx, view.ghost.x, view.ghost.y, def.w, def.h, o, gok ? "#f2c14e" : "#d64545");
    }
    if (view.selected) {
      footprintStroke(ctx, view.selected.x, view.selected.y, view.selected.w, view.selected.h, o, "#f2c14e");
    }
    return o;
  }

  return { render: render, layout: layout };
})();
