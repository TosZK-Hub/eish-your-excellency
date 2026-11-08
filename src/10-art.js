// EISH! Jozi Run — illustrated cast and props. Original, not a likeness of any commercial runner.
// Next iteration: tweak CAST colours and the pose tables in cycleFrame(); keep the ink outline weight.
(function (root) {
  "use strict";
  var INK = "#241820";
  var LW = 7;
  var CAST = [
    {
      id: "lerato", name: "Lerato", place: "Braamfontein",
      line: "Teal tracksuit, coral bun. She takes the jump before the rank fills.",
      skin: "#c4845c", shade: "#8a5340", lite: "#efc09a", blush: "rgba(212,100,96,0.55)",
      hair: "#1b140f", band: "#ff6b4a", cloth: "#128f86", clothD: "#0c645e",
      accent: "#ff6b4a", pants: "#173632", shoe: "#f6f3ec", kick: "#ff6b4a", lip: "#b15d62",
      style: "bun"
    },
    {
      id: "jabu", name: "Jabu", place: "Yeoville",
      line: "Red golf shirt, khaki shorts. He slips the gap between the minibuses.",
      skin: "#e2ae80", shade: "#b67c4c", lite: "#f6d0b0", blush: "rgba(210,120,90,0.4)",
      hair: "#16120e", band: "#fffaf2", cloth: "#d4534a", clothD: "#a83632",
      accent: "#fffaf2", pants: "#c6a15a", shoe: "#f7f4ee", kick: "#d4534a", lip: "#c47a68",
      style: "fade"
    },
    {
      id: "naledi", name: "Naledi", place: "Maboneng",
      line: "A sun on her back, beads in her twists. She runs the streets she paints.",
      skin: "#6e3e2e", shade: "#4a271e", lite: "#94604e", blush: "rgba(168,80,74,0.45)",
      hair: "#140e0c", band: "#f0c14d", cloth: "#2d439e", clothD: "#1c2d74",
      accent: "#ffb703", pants: "#e2a12b", shoe: "#ff5d8f", kick: "#fffaf2", lip: "#8d4038",
      style: "twists", beads: ["#c46bdc", "#ffb703", "#ff6b4a", "#49c2b0"]
    }
  ];

  function ink(ctx, w) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = w == null ? LW : w;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }
  function fillStroke(ctx, fill, w) {
    ctx.fillStyle = fill;
    ctx.fill();
    ink(ctx, w == null ? 7 : w);
  }
  function taper(ctx, x1, y1, r1, x2, y2, r2) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    var ang = Math.atan2(dy, dx);
    var off = Math.atan2(r1 - r2, len);
    ctx.beginPath();
    ctx.arc(x1, y1, r1, ang + Math.PI / 2 + off, ang + (Math.PI * 3) / 2 - off, false);
    ctx.arc(x2, y2, r2, ang - Math.PI / 2 - off, ang + Math.PI / 2 + off, false);
    ctx.closePath();
  }
  function limb(ctx, x1, y1, r1, x2, y2, r2, fill, w) {
    taper(ctx, x1, y1, r1, x2, y2, r2);
    fillStroke(ctx, fill, w || 6.5);
  }
  function ellipse(ctx, x, y, rx, ry, fill, w, rot) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), rot || 0, 0, Math.PI * 2);
    fillStroke(ctx, fill, w == null ? 6 : w);
  }
  function eye(ctx, x, y, rx, ry, look) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fffaf4";
    ctx.fill();
    ink(ctx, 4);
    ctx.beginPath();
    ctx.ellipse(x + look, y + 1, rx * 0.62, ry * 0.68, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3a2418";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + look, y + 2, rx * 0.32, ry * 0.36, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a100c";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + look - rx * 0.22, y - ry * 0.18, Math.max(2, rx * 0.22), 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  function hairBehind(ctx, c, x, y) {
    // Sits behind the skull. Nothing here is allowed to cross the eyes.
    if (c.style === "bun") {
      ellipse(ctx, x + 4, y - 92, 38, 34, c.hair, LW * 0.8);
      ellipse(ctx, x + 4, y - 92, 20, 14, c.band, LW * 0.6);
    } else if (c.style === "twists") {
      var beads = c.beads;
      for (var i = 0; i < 8; i++) {
        var a = -2.6 + i * 0.62;
        var len = 46 + (i % 3) * 12;
        var x2 = x + Math.sin(a) * (len * 0.85);
        var y2 = y - 70 - Math.cos(a) * 10 - (i % 2) * 8;
        if (y2 > y - 36) continue;
        limb(ctx, x + Math.sin(a) * 18, y - 58, 7, x2, y2, 5, c.hair, LW * 0.55);
        ellipse(ctx, x2, y2, 6.5, 6.5, beads[i % beads.length], LW * 0.4);
      }
    }
  }

  function fringe(ctx, c, x, y) {
    // y is the head centre. Fringe stays above the brows.
    ctx.beginPath();
    if (c.style === "fade") {
      ctx.moveTo(x - 58, y - 18);
      ctx.quadraticCurveTo(x - 40, y - 78, x, y - 84);
      ctx.quadraticCurveTo(x + 48, y - 78, x + 60, y - 14);
      ctx.quadraticCurveTo(x + 20, y - 42, x - 10, y - 28);
      ctx.quadraticCurveTo(x - 36, y - 8, x - 58, y - 18);
    } else if (c.style === "bun") {
      ctx.moveTo(x - 62, y - 8);
      ctx.quadraticCurveTo(x - 66, y - 70, x - 10, y - 78);
      ctx.quadraticCurveTo(x + 20, y - 88, x + 48, y - 60);
      ctx.quadraticCurveTo(x + 58, y - 20, x + 40, y - 16);
      ctx.quadraticCurveTo(x + 8, y - 48, x - 24, y - 36);
      ctx.quadraticCurveTo(x - 48, y - 18, x - 62, y - 8);
    } else {
      ctx.moveTo(x - 54, y - 6);
      ctx.quadraticCurveTo(x - 40, y - 70, x + 10, y - 74);
      ctx.quadraticCurveTo(x + 52, y - 60, x + 48, y - 16);
      ctx.quadraticCurveTo(x + 10, y - 40, x - 20, y - 28);
      ctx.quadraticCurveTo(x - 44, y - 10, x - 54, y - 6);
    }
    ctx.fillStyle = c.hair;
    ctx.fill();
    ink(ctx, LW * 0.75);
  }

  function brow(ctx, c, x, y, dir, arch) {
    ctx.beginPath();
    ctx.moveTo(x - 16 * dir, y);
    ctx.quadraticCurveTo(x, y - arch, x + 16 * dir, y + 1);
    ctx.strokeStyle = c.hair;
    ctx.lineWidth = c.style === "fade" ? 5 : 4;
    ctx.stroke();
  }

  function smile(ctx, c, x, y, wide) {
    ctx.beginPath();
    ctx.moveTo(x - wide, y);
    ctx.quadraticCurveTo(x, y + wide * 0.7, x + wide, y - (c.style === "fade" ? 2 : 0));
    ctx.strokeStyle = c.shade;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - wide + 3, y + 1);
    ctx.quadraticCurveTo(x, y + wide * 0.55, x + wide - 3, y + 1);
    ctx.lineTo(x + wide - 6, y + 2);
    ctx.quadraticCurveTo(x, y + 8, x - wide + 6, y + 2);
    ctx.fillStyle = c.lip;
    ctx.fill();
    if (wide > 16) {
      ctx.fillStyle = "#fffaf4";
      ctx.fillRect(x - 8, y + 1, 16, 4);
    }
  }

  function shoe(ctx, x, y, angle, c, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-16, -8);
    ctx.quadraticCurveTo(-18, 8, -6, 12);
    ctx.lineTo(28, 10);
    ctx.quadraticCurveTo(40, 8, 36, -2);
    ctx.quadraticCurveTo(20, -14, -16, -8);
    ctx.closePath();
    fillStroke(ctx, c.shoe, 5);
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(30, 7);
    ctx.lineTo(28, 12);
    ctx.lineTo(-10, 12);
    ctx.fillStyle = INK;
    ctx.fill();
    ctx.fillStyle = c.kick;
    ctx.fillRect(-4, -6, 22, 6);
    ctx.restore();
  }

  // Offsets from the hip / shoulder: +y is down the sprite. A run is a high knee and a long back leg.
  function cycleFrame(i) {
    var t = [
      { l: [18, 78, 26, 188], r: [-10, 118, -28, 210], la: -0.7, ra: 0.55, bob: 0 },
      { l: [8, 96, 12, 198], r: [4, 100, 8, 190], la: -0.15, ra: 0.1, bob: 12 },
      { l: [-16, 70, -30, 36], r: [20, 72, 28, 176], la: 0.5, ra: -0.65, bob: 2 },
      { l: [-8, 108, -18, 150], r: [22, 64, 30, 168], la: 0.7, ra: -0.5, bob: -14 },
      { l: [6, 100, 10, 196], r: [10, 92, 14, 186], la: 0.1, ra: -0.12, bob: 10 },
      { l: [22, 68, 30, 170], r: [-14, 64, -26, 40], la: -0.55, ra: 0.6, bob: -4 }
    ];
    return t[i % 6];
  }

  function drawRunner(ctx, who, pose, frame) {
    var c = CAST[who];
    var f = pose === "run" ? cycleFrame(frame || 0) : { l: [14, 100, 18, 200], r: [14, 100, 22, 200], la: 0.1, ra: 0.1, bob: 0 };
    if (pose === "jump") f = { l: [22, 36, 10, 8], r: [24, 40, 36, 12], la: -1.05, ra: -0.95, bob: -28 };
    if (pose === "slide") f = { l: [34, 46, 78, 78], r: [-6, 70, 10, 120], la: 0.2, ra: 1.15, bob: 78 };
    if (pose === "hit") f = { l: [6, 110, 8, 200], r: [-20, 90, -36, 170], la: -1.2, ra: -0.7, bob: 10 };
    var bob = f.bob;
    var hipY = (pose === "slide" ? -168 : -248) + bob;
    var shY = (pose === "slide" ? -300 : -390) + bob;
    var hx = pose === "slide" ? 16 : 0;
    function leg(side, off) {
      var hx0 = (side === "l" ? -26 : 26) + hx;
      var kx = hx0 + off[0], ky = hipY + off[1];
      var fx = hx0 + off[2], fy = hipY + off[3];
      limb(ctx, hx0, hipY, side === "l" ? 22 : 20, kx, ky, 14, c.pants, LW * 0.75);
      limb(ctx, kx, ky, 13, fx, fy, 8, c.skin, LW * 0.65);
      shoe(ctx, fx, fy, side === "l" ? -0.15 : 0.2, c);
    }
    function arm(side, ang) {
      var sx = side === "l" ? -56 : 56;
      var elx = sx + Math.sin(ang) * 36;
      var ely = shY + 78;
      var hx2 = sx + Math.sin(ang) * 70;
      var hy = shY + 150;
      if (pose === "jump") hy = shY + 20;
      if (pose === "slide" && side === "r") { ely = shY + 90; hy = shY + 130; }
      limb(ctx, sx, shY + 16, 16, elx, ely, 12, c.cloth, LW * 0.7);
      limb(ctx, elx, ely, 11, hx2, hy, 9, c.skin, LW * 0.6);
    }
    var backLeg = f.l[1] > f.r[1] ? "l" : "r";
    if (backLeg === "l") { leg("l", f.l); arm("l", f.la); }
    else { leg("r", f.r); arm("r", f.ra); }
    // torso
    ctx.beginPath();
    ctx.moveTo(-62, shY);
    ctx.quadraticCurveTo(-70, shY + 40, -48, hipY + 10);
    ctx.lineTo(48, hipY + 10);
    ctx.quadraticCurveTo(70, shY + 40, 62, shY);
    ctx.quadraticCurveTo(0, shY - 18, -62, shY);
    fillStroke(ctx, c.cloth, 7);
    ctx.beginPath();
    ctx.moveTo(-48, hipY + 4);
    ctx.lineTo(48, hipY + 4);
    ctx.lineTo(40, hipY + 36);
    ctx.lineTo(-40, hipY + 36);
    ctx.fillStyle = c.pants;
    ctx.fill();
    if (c.style === "bun") {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-50, shY + 36, 100, 16);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.strokeRect(-50, shY + 36, 100, 16);
    } else if (c.style === "twists") {
      ctx.beginPath();
      ctx.arc(0, shY + 70, 28, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ink(ctx, 4);
      ctx.beginPath();
      ctx.arc(0, shY + 70, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#fff4d0";
      ctx.fill();
    } else {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-20, shY + 8, 40, 14);
    }
    // near limbs
    if (backLeg === "l") { leg("r", f.r); arm("r", f.ra); }
    else { leg("l", f.l); arm("l", f.la); }
    // neck + head from behind, a sliver of cheek
    limb(ctx, 0, shY + 6, 14, 8, shY - 36, 12, c.skin, LW * 0.7);
    hairBehind(ctx, c, 0, shY - 70);
    ellipse(ctx, 4, shY - 86, 56, 62, c.skin, LW * 0.85);
    // One ear and a sliver of cheek — the runner is seen from behind, not as a blank oval.
    ellipse(ctx, 48, shY - 84, 12, 16, c.skin, LW * 0.55);
    fringe(ctx, c, 0, shY - 78);
    if (c.style !== "twists") {
      eye(ctx, 26, shY - 90, 6, 7, 1);
      brow(ctx, c, 26, shY - 104, 1, 5);
    }
    if (pose === "hit") {
      ctx.beginPath();
      ctx.arc(24, shY - 70, 6, 0, Math.PI);
      ctx.strokeStyle = c.shade;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function drawHero(ctx, who, blink) {
    var c = CAST[who];
    var shY = -400, hipY = -250;
    // back arm on hip
    limb(ctx, -70, shY + 20, 18, -92, hipY + 10, 12, c.cloth, 6);
    limb(ctx, -92, hipY + 10, 11, -78, hipY + 28, 11, c.skin, 5);
    // legs
    limb(ctx, -32, hipY, 24, -40, -20, 14, c.pants, 6);
    limb(ctx, 32, hipY, 24, 44, -18, 14, c.pants, 6);
    limb(ctx, -40, -20, 13, -46, 4, 9, c.skin, 5);
    limb(ctx, 44, -18, 13, 52, 4, 9, c.skin, 5);
    shoe(ctx, -46, 2, -0.15, c);
    shoe(ctx, 54, 2, 0.2, c);
    // torso
    ctx.beginPath();
    ctx.moveTo(-78, shY);
    ctx.quadraticCurveTo(-86, -340, -52, hipY);
    ctx.quadraticCurveTo(0, hipY + 28, 52, hipY);
    ctx.quadraticCurveTo(86, -340, 78, shY);
    ctx.quadraticCurveTo(0, shY - 24, -78, shY);
    fillStroke(ctx, c.cloth, LW);
    ctx.beginPath();
    ctx.moveTo(18, shY + 8);
    ctx.quadraticCurveTo(70, -330, 40, hipY - 6);
    ctx.lineTo(8, hipY - 6);
    ctx.quadraticCurveTo(24, -340, 8, shY + 20);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();
    if (c.style === "bun") {
      ctx.fillStyle = "#f4f1ea";
      ctx.beginPath();
      ctx.moveTo(-22, shY + 8);
      ctx.lineTo(22, shY + 8);
      ctx.lineTo(14, shY + 48);
      ctx.lineTo(-14, shY + 48);
      ctx.fill();
      ctx.fillStyle = c.accent;
      ctx.fillRect(-56, shY + 52, 112, 18);
    } else if (c.style === "fade") {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-28, shY + 6, 56, 16);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.strokeRect(-28, shY + 6, 56, 16);
      ctx.fillStyle = c.accent;
      ctx.fillRect(-70, shY + 28, 16, 36);
      ctx.fillRect(54, shY + 28, 16, 36);
    } else {
      ctx.beginPath();
      ctx.arc(0, shY + 58, 26, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();
      ink(ctx, 4);
      ctx.beginPath();
      ctx.arc(-6, shY + 52, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff6d4";
      ctx.fill();
      ctx.fillStyle = c.accent;
      ctx.fillRect(-74, shY + 8, 148, 12);
    }
    // near arm relaxed
    limb(ctx, 74, shY + 16, 18, 96, -300, 13, c.cloth, 6);
    limb(ctx, 96, -300, 12, 88, -230, 11, c.skin, 5);
    // neck, ears, head
    limb(ctx, 0, shY + 4, 16, 0, shY - 34, 14, c.skin, LW * 0.7);
    hairBehind(ctx, c, 0, -470);
    ellipse(ctx, -66, -478, 13, 18, c.skin, LW * 0.6);
    ellipse(ctx, 66, -478, 13, 18, c.skin, LW * 0.6);
    ellipse(ctx, 0, -486, 62, 70, c.skin, LW);
    // blush
    ctx.fillStyle = c.blush;
    ctx.beginPath();
    ctx.ellipse(-28, -460, 14, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(30, -460, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    if (c.style === "twists") {
      ctx.beginPath();
      ctx.ellipse(36, -452, 10, 6, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#49c2b0";
      ctx.fill();
    }
    var look = blink ? 0 : 2;
    var eyeRy = blink ? 2 : (c.style === "fade" ? 13 : 15);
    eye(ctx, -26, -500, 14, eyeRy, look);
    eye(ctx, 28, -500, c.style === "naledi" || c.style === "twists" ? 15 : 13, eyeRy, look);
    var arch = c.style === "fade" ? 4 : c.style === "twists" ? 12 : 8;
    brow(ctx, c, -26, -524, 1, arch);
    brow(ctx, c, 28, -524, 1, arch + (c.style === "fade" ? 0 : 2));
    // nose
    ctx.beginPath();
    if (c.style === "fade") {
      ctx.moveTo(0, -492);
      ctx.quadraticCurveTo(14, -470, 0, -464);
      ctx.quadraticCurveTo(-14, -470, 0, -492);
      ctx.fillStyle = c.shade;
      ctx.fill();
    } else {
      ctx.moveTo(0, -488);
      ctx.quadraticCurveTo(10, -472, 0, -468);
      ctx.strokeStyle = c.shade;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    smile(ctx, c, 2, -444, c.style === "fade" ? 20 : 16);
    fringe(ctx, c, 0, -486);
    if (c.style === "bun") ellipse(ctx, 70, -470, 5, 7, "#f0c14d", LW * 0.4);
    if (c.style === "fade") ellipse(ctx, -70, -470, 5, 7, "#f0c14d", LW * 0.4);
  }

  function shadow(ctx, x, y, rx, ry) {
    ctx.save();
    ctx.fillStyle = "rgba(36,24,32,0.28)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function paintRunner(ctx, who, pose, frame, x, footY, height) {
    var sc = height / 540;
    LW = Math.max(6, 3.4 / sc);
    ctx.save();
    ctx.translate(x, footY);
    ctx.scale(sc, sc);
    if (pose === "hero") drawHero(ctx, who, false);
    else drawRunner(ctx, who, pose, frame);
    ctx.restore();
  }

  function paintHeroBlink(ctx, who, x, footY, height, blink) {
    var sc = height / 540;
    LW = Math.max(6, 3.6 / sc);
    ctx.save();
    ctx.translate(x, footY);
    ctx.scale(sc, sc);
    drawHero(ctx, who, blink);
    ctx.restore();
  }

  function taxi(ctx, w, h, stripe) {
    var x = -w / 2, y = -h;
    // wheels
    ellipse(ctx, x + w * 0.22, -h * 0.08, w * 0.12, h * 0.1, "#2a2428", 4);
    ellipse(ctx, x + w * 0.78, -h * 0.08, w * 0.12, h * 0.1, "#2a2428", 4);
    ctx.beginPath();
    rrPath(ctx, x, y + h * 0.08, w, h * 0.78, 12);
    fillStroke(ctx, "#f7f4ee", 6);
    ctx.fillStyle = stripe || "#1f8f5a";
    ctx.fillRect(x + 6, y + h * 0.38, w - 12, h * 0.12);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 6, y + h * 0.38, w - 12, h * 0.12);
    // rear window
    ctx.beginPath();
    rrPath(ctx, x + w * 0.12, y + h * 0.16, w * 0.76, h * 0.2, 6);
    fillStroke(ctx, "#243044", 4);
    ctx.fillStyle = "rgba(255,244,220,0.35)";
    for (var i = 0; i < 3; i++) ctx.fillRect(x + w * (0.22 + i * 0.2), y + h * 0.2, w * 0.08, h * 0.1);
    // lights
    ctx.fillStyle = "#e23b3b";
    ctx.fillRect(x + 8, y + h * 0.62, w * 0.14, h * 0.08);
    ctx.fillRect(x + w - w * 0.14 - 8, y + h * 0.62, w * 0.14, h * 0.08);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(x + w * 0.34, y + h * 0.78, w * 0.32, h * 0.1);
    ctx.strokeRect(x + w * 0.34, y + h * 0.78, w * 0.32, h * 0.1);
    ctx.fillStyle = INK;
    ctx.font = "700 " + Math.max(10, h * 0.07) + "px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GP", 0, y + h * 0.86);
  }

  function rrPath(ctx, x, y, w, h, r) {
    var r2 = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r2, y);
    ctx.arcTo(x + w, y, x + w, y + h, r2);
    ctx.arcTo(x + w, y + h, x, y + h, r2);
    ctx.arcTo(x, y + h, x, y, r2);
    ctx.arcTo(x, y, x + w, y, r2);
    ctx.closePath();
  }

  function drums(ctx, w, h) {
    function drum(x, col, stripe) {
      ctx.beginPath();
      rrPath(ctx, x, -h, w * 0.42, h * 0.92, 8);
      fillStroke(ctx, col, 5);
      ctx.fillStyle = stripe;
      ctx.fillRect(x + 4, -h * 0.72, w * 0.42 - 8, h * 0.12);
      ctx.fillRect(x + 4, -h * 0.4, w * 0.42 - 8, h * 0.12);
    }
    drum(-w * 0.46, "#f08a24", "#fffaf2");
    drum(w * 0.04, "#2a6fbf", "#fffaf2");
  }

  function barrier(ctx, w, h) {
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w * 0.32, -h);
    ctx.lineTo(w * 0.32, -h);
    ctx.lineTo(w / 2, 0);
    ctx.closePath();
    fillStroke(ctx, "#d9d3c8", 6);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(-w * 0.22, -h * 0.62, w * 0.44, h * 0.16);
  }

  function pothole(ctx, w, h) {
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.2, w * 0.46, h * 0.36, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1614";
    ctx.fill();
    ink(ctx, 5);
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.28, w * 0.28, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3a342e";
    ctx.fill();
  }

  function scaffold(ctx, w, h) {
    ctx.fillStyle = "#c9ccd1";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.fillRect(-w / 2, -h, 10, h);
    ctx.strokeRect(-w / 2, -h, 10, h);
    ctx.fillRect(w / 2 - 10, -h, 10, h);
    ctx.strokeRect(w / 2 - 10, -h, 10, h);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(-w / 2, -h * 0.72, w, 16);
    ctx.strokeRect(-w / 2, -h * 0.72, w, 16);
    ctx.fillStyle = "#e23b3b";
    for (var i = 0; i < 4; i++) ctx.fillRect(-w / 2 + 8 + i * (w / 4), -h * 0.7, w / 10, 10);
  }

  function signBoard(ctx, w, h) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, -h);
    ctx.lineTo(-w * 0.2, -h * 0.62);
    ctx.moveTo(w * 0.2, -h);
    ctx.lineTo(w * 0.2, -h * 0.62);
    ctx.stroke();
    ctx.beginPath();
    rrPath(ctx, -w / 2, -h * 0.62, w, h * 0.28, 8);
    fillStroke(ctx, "#fffaf2", 5);
    ctx.fillStyle = "#d4534a";
    ctx.font = "800 " + Math.max(12, h * 0.12) + "px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPAZA", 0, -h * 0.44);
  }

  function branch(ctx, w, h) {
    limb(ctx, w * 0.35, -h, 8, -w * 0.1, -h * 0.55, 5, "#6b4a32", 4);
    ellipse(ctx, -w * 0.05, -h * 0.58, w * 0.28, h * 0.16, "#b06cc8", 4);
    ellipse(ctx, w * 0.12, -h * 0.7, w * 0.18, h * 0.1, "#d7a4e2", 3);
    ellipse(ctx, -w * 0.22, -h * 0.5, w * 0.14, h * 0.08, "#8e44ad", 3);
  }

  function boom(ctx, w, h, open, colour) {
    // robot pole
    ctx.fillStyle = "#2c3138";
    ctx.fillRect(w * 0.28, -h, 10, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.28, -h, 10, h);
    var lights = ["#5a3030", "#5a5030", "#24543a"];
    if (open) lights[2] = "#1fa971";
    else lights[0] = "#e23b3b";
    for (var i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.28 + 5, -h + 16 + i * 16, 6, 0, Math.PI * 2);
      ctx.fillStyle = lights[i];
      ctx.fill();
    }
    ctx.save();
    ctx.translate(-w * 0.05, -h * 0.62);
    if (open) ctx.rotate(-1.15);
    ctx.fillStyle = "#f0c14d";
    ctx.fillRect(0, -7, w * 0.7, 14);
    ctx.strokeStyle = INK;
    ctx.strokeRect(0, -7, w * 0.7, 14);
    ctx.fillStyle = INK;
    for (var k = 0; k < 4; k++) ctx.fillRect(8 + k * 18, -7, 8, 14);
    ctx.restore();
    if (colour) {
      ctx.fillStyle = colour;
      ctx.fillRect(-w * 0.45, -h * 0.95, 16, 10);
    }
  }

  function fare(ctx, w, h, variant, wave) {
    var shirts = ["#ffb703", "#49c2b0", "#d4534a"];
    var col = shirts[variant % 3];
    var arm = Math.sin(wave) * 0.6;
    limb(ctx, -8, -h * 0.28, h * 0.08, -16, -4, h * 0.045, "#3d6ea8", 4);
    limb(ctx, 10, -h * 0.28, h * 0.08, 18, -4, h * 0.045, "#3d6ea8", 4);
    limb(ctx, 0, -h * 0.78, h * 0.1, 0, -h * 0.32, h * 0.12, col, 4);
    limb(ctx, 18, -h * 0.7, h * 0.05, 26 + arm * 20, -h * (0.92 + arm * 0.1), h * 0.045, "#e2ae80", 3);
    ellipse(ctx, 0, -h * 0.9, h * 0.13, h * 0.14, "#6e3e2e", 4);
    ellipse(ctx, 0, -h * 1.02, h * 0.14, h * 0.08, "#1b140f", 3);
  }

  function coin(ctx, r) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#f0c14d";
    ctx.fill();
    ink(ctx, 3);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = "#a97820";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function shield(ctx, r) {
    var cols = ["#fffaf2", "#d4534a", "#2d439e", "#128f86", "#ffb703"];
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = cols[i % cols.length];
      ctx.fill();
      ink(ctx, 2);
    }
  }

  function kota(ctx, w, h) {
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    fillStroke(ctx, "#e6c48a", 4);
    ctx.fillStyle = "#f2d15a";
    ctx.fillRect(-w * 0.28, -h * 0.08, w * 0.56, h * 0.12);
    ctx.fillStyle = "#d4534a";
    ctx.fillRect(-w * 0.28, -h * 0.22, w * 0.56, h * 0.1);
    ctx.fillStyle = "#3d8f45";
    ctx.fillRect(-w * 0.22, -h * 0.32, w * 0.2, h * 0.08);
  }

  function prop(ctx, kind, variant, w, h, extra) {
    if (kind === "block") taxi(ctx, w, h, extra || "#1f8f5a");
    else if (kind === "low" && variant === 1) barrier(ctx, w, h);
    else if (kind === "low" && variant === 2) pothole(ctx, w, h);
    else if (kind === "low") drums(ctx, w, h);
    else if (kind === "high" && variant === 1) signBoard(ctx, w, h);
    else if (kind === "high" && variant === 2) branch(ctx, w, h);
    else if (kind === "high") scaffold(ctx, w, h);
    else if (kind === "boom") boom(ctx, w, h, extra && extra.open, extra && extra.colour);
    else if (kind === "fare") fare(ctx, w, h, variant, extra || 0);
    else if (kind === "coin") coin(ctx, w);
    else if (kind === "shield") shield(ctx, w);
    else if (kind === "kota") kota(ctx, w, h);
  }

  root.ART = {
    INK: INK,
    CAST: CAST,
    paintRunner: paintRunner,
    paintHeroBlink: paintHeroBlink,
    prop: prop,
    shadow: shadow,
    rrPath: rrPath
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
