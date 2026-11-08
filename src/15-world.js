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
