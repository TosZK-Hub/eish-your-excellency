// Painted world. Sprites are compressed WebP; this file only places them.

const R = 390 / 1080;

export const GROUND_Y = 726;

const PIECE = {
  crane_top: { w: 270, cap: 584, body: 164 },
  jojo_bot: { w: 250, cap: 517, body: 179 },
  gantry_top: { w: 280, cap: 298, body: 289 },
  overpass_bot: { w: 270, cap: 229, body: 915 },
  washing_top: { w: 150, cap: 582, body: 388 },
  brickpillar_bot: { w: 210, cap: 256, body: 1074 },
  jacaranda_top: { w: 270, cap: 283, body: 360 },
  palisade_bot: { w: 270, cap: 110, body: 331 },
};

export const GATE = {
  site: { w: 270 * R, hit: [0, 270 * R], yForgive: 16, top: "crane_top", bot: "jojo_bot", anchor: "crane" },
  freeway: { w: 280 * R, hit: [0, 280 * R], yForgive: 14, top: "gantry_top", bot: "overpass_bot", anchor: "gantry" },
  yard: { w: 210 * R, hit: [0, 210 * R], yForgive: 16, top: "washing_top", bot: "brickpillar_bot", anchor: "wash" },
  jac: { w: 270 * R, hit: [8 * R, 270 * R - 8 * R], yForgive: 18, top: "jacaranda_top", bot: "palisade_bot", anchor: "limb" },
};

const FILES = [
  "sky_dawn", "sky_day", "sky_sunset", "sky_night",
  "hills", "houses", "ground", "koeksister",
  "body", "wing_up", "wing_mid", "wing_down",
  "crane_top_cap", "crane_top_body", "jojo_bot_cap", "jojo_bot_body",
  "gantry_top_cap", "gantry_top_body", "overpass_bot_cap", "overpass_bot_body",
  "washing_top_cap", "washing_top_body", "brickpillar_bot_cap", "brickpillar_bot_body",
  "jacaranda_top_cap", "jacaranda_top_body", "palisade_bot_cap", "palisade_bot_body",
  "anchor_crane", "anchor_gantry", "anchor_wash", "anchor_limb",
];

const img = {};
const darkWing = {};
const bronzeWing = {};
let ready = false;

function loadOne(name) {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(name));
    el.src = "assets/" + name + ".webp";
  });
}

function tinted(source, color, alpha) {
  const c = document.createElement("canvas");
  c.width = source.width;
  c.height = source.height;
  const g = c.getContext("2d");
  g.drawImage(source, 0, 0);
  g.globalCompositeOperation = "source-atop";
  g.fillStyle = color;
  g.globalAlpha = alpha;
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

export function loadArt() {
  if (ready) return Promise.resolve();
  return Promise.all(FILES.map((name) => loadOne(name).then((el) => { img[name] = el; }))).then(() => {
    for (const key of ["wing_up", "wing_mid", "wing_down"]) {
      darkWing[key] = tinted(img[key], "#140e16", 0.48);
      bronzeWing[key] = tinted(img[key], "#c4843c", 0.42);
    }
    ready = true;
  });
}

export function artReady() {
  return ready;
}

export function clearThemeCaches() {}

export function ensureTheme() {
  return ready;
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function skyWeights(tod) {
  const t = clamp(tod, 0, 3);
  if (t < 1) return { sky_dawn: 1 - t, sky_day: t };
  if (t < 2) return { sky_day: 2 - t, sky_sunset: t - 1 };
  const u = Math.min(1, t - 2);
  return { sky_sunset: 1 - u, sky_night: u };
}

function blitCover(ctx, image, camera, time, w, h) {
  const drift = Math.sin(time * 0.05) * 16 + camera * 0.01;
  const srcH = Math.round(image.height * 0.58);
  ctx.drawImage(image, 0, 0, image.width, srcH, -28 - (drift % 40), -30, w + 56, Math.round(h * 0.7));
}

function tileLayer(ctx, image, camera, y, height, parallax) {
  if (!image) return;
  const width = height * (image.width / image.height);
  const shift = ((camera * parallax) % width + width) % width;
  const start = -shift - width;
  for (let x = start; x < 390 + width; x += width) {
    ctx.drawImage(image, x, y, width, height);
  }
}

export function paintWorld(ctx, opt) {
  const w = opt.w || 390;
  const h = opt.h || 844;
  const tod = opt.tod ?? 1;
  const time = opt.time || 0;
  const camera = opt.camera || 0;
  if (!ready) {
    ctx.fillStyle = "#7eb6e6";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  const weights = Object.entries(skyWeights(tod)).filter((pair) => pair[1] >= 0.03);
  weights.sort((a, b) => b[1] - a[1]);
  weights.forEach(([name, a], i) => {
    ctx.globalAlpha = i === 0 ? 1 : a;
    blitCover(ctx, img[name], camera, time, w, h);
  });
  ctx.globalAlpha = 1;

  tileLayer(ctx, img.hills, camera, 430, 200, 0.18);
  tileLayer(ctx, img.houses, camera, 548, 168, 0.42);

  const night = clamp(tod - 2, 0, 1);
  const sunset = tod > 1 && tod < 2.4 ? clamp(1 - Math.abs(tod - 1.7) / 0.9, 0, 1) : 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 500, w, h - 500);
  ctx.clip();
  ctx.globalCompositeOperation = "multiply";
  if (sunset > 0.05) {
    ctx.globalAlpha = sunset * 0.45;
    ctx.fillStyle = "#e07048";
    ctx.fillRect(0, 500, w, h);
  }
  if (night > 0.05) {
    ctx.globalAlpha = night * 0.72;
    ctx.fillStyle = "#1a2748";
    ctx.fillRect(0, 500, w, h);
  }
  const zoneTint = opt.zoneTint;
  if (zoneTint) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = zoneTint;
    ctx.fillRect(0, 500, w, h);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  if (night > 0.25) {
    ctx.globalAlpha = (night - 0.25) * 0.9;
    const glow = ((camera * 0.42) % 220 + 220) % 220;
    for (let x = -glow; x < w + 40; x += 220) {
      const g = ctx.createRadialGradient(x + 70, 640, 2, x + 70, 640, 28);
      g.addColorStop(0, "rgba(255, 214, 140, 0.9)");
      g.addColorStop(1, "rgba(255, 214, 140, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + 70, 640, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawAnchor(ctx, opt.anchor || "limb", w);
}

export function drawGround(ctx, camera) {
  if (!ready) return;
  tileLayer(ctx, img.ground, camera, GROUND_Y - 28, 168, 1);
}

function drawAnchor(ctx, kind, w) {
  const map = {
    crane: ["anchor_crane", 22],
    gantry: ["anchor_gantry", 20],
    wash: ["anchor_wash", 12],
    limb: ["anchor_limb", 30],
  };
  const spec = map[kind] || map.limb;
  const bar = img[spec[0]];
  if (!bar) return;
  const h = spec[1];
  ctx.drawImage(bar, 0, 0, w, h);
  if (kind === "wash") {
    const rope = img.washing_top_body;
    if (rope) {
      ctx.drawImage(rope, 16, 0, 10, 78);
      ctx.drawImage(rope, w - 26, 0, 10, 78);
    }
  }
}

function px(piece, key) {
  return PIECE[piece][key] * R;
}

function tileBody(ctx, image, x, y0, y1, bw, bh, dir) {
  if (!image || bh < 2) return;
  if (dir < 0) {
    let y = y0;
    while (y > y1 - bh) {
      y -= bh;
      ctx.drawImage(image, x, y, bw, bh);
    }
  } else {
    let y = y0;
    while (y < y1) {
      ctx.drawImage(image, x, y, bw, bh);
      y += bh;
    }
  }
}

export function drawGate(ctx, obs) {
  if (!ready) return;
  const spec = GATE[obs.kind];
  if (!spec) return;
  drawHalf(ctx, spec.top, obs.x, spec.w, obs.gapTop, "top");
  drawHalf(ctx, spec.bot, obs.x, spec.w, obs.gapBot, "bot");
}

function drawHalf(ctx, piece, colX, colW, edge, side) {
  const meta = PIECE[piece];
  const cap = img[piece + "_cap"];
  const body = img[piece + "_body"];
  if (!cap || !meta) return;
  const pw = meta.w * R;
  const capH = meta.cap * R;
  const bodyH = meta.body * R;
  const x = colX + (colW - pw) / 2;
  if (side === "top") {
    const capY = edge - capH;
    tileBody(ctx, body, x, capY, -bodyH, pw, bodyH, -1);
    ctx.drawImage(cap, x, capY, pw, capH);
  } else {
    ctx.drawImage(cap, x, edge, pw, capH);
    tileBody(ctx, body, x, edge + capH, GROUND_Y + 20, pw, bodyH, 1);
  }
}

const BODY_W = 128;
const ROOT = {
  wing_up: [0.55, 0.92],
  wing_mid: [0.86, 0.5],
  wing_down: [0.85, 0.14],
};
const WING_FIT = {
  wing_up: ["height", 0.92],
  wing_mid: ["width", 0.78],
  wing_down: ["width", 0.84],
};

function wingSize(key, image) {
  const [axis, scale] = WING_FIT[key];
  if (axis === "height") {
    const dh = BODY_W * scale;
    return [dh * (image.width / image.height), dh];
  }
  const dw = BODY_W * scale;
  return [dw, dw * (image.height / image.width)];
}

function posesFor(wing) {
  if (wing > 0.28) return [["wing_up", 1]];
  if (wing > -0.42) return [["wing_mid", 1]];
  return [["wing_down", 1]];
}

export function drawHadeda(ctx, opt = {}) {
  if (!ready) return;
  const body = img.body;
  const bodyH = BODY_W * (body.height / body.width);
  const shoulderX = -BODY_W / 2 + 0.48 * BODY_W;
  const shoulderY = -bodyH / 2 + 0.36 * bodyH;
  const poses = posesFor(opt.wing ?? 0);
  const skin = opt.skin || "classic";
  const pack = skin === "bronze" ? bronzeWing : img;

  ctx.save();
  const lead = poses.slice().sort((a, b) => b[1] - a[1])[0];
  if (lead && lead[1] > 0.2) {
    ctx.globalAlpha = 1;
    drawWing(ctx, lead[0], darkWing[lead[0]], shoulderX, shoulderY, bodyH, true);
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(body, -BODY_W / 2, -bodyH / 2, BODY_W, bodyH);
  drawSkin(ctx, skin, BODY_W, bodyH, opt.time || 0);
  if (opt.blink > 0.45) drawLid(ctx, BODY_W, bodyH);
  for (const [key, a] of poses) {
    if (a < 0.04) continue;
    ctx.globalAlpha = a;
    const source = skin === "bronze" ? pack[key] : img[key];
    drawWing(ctx, key, source, shoulderX, shoulderY, bodyH, false);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawWing(ctx, key, source, shoulderX, shoulderY, bodyH, far) {
  const [dw, dh] = wingSize(key, img[key]);
  const root = ROOT[key];
  const scale = far ? 0.72 : 1;
  const ox = far ? BODY_W * 0.04 : 0;
  const oy = far ? -bodyH * 0.08 : 0;
  const w = dw * scale;
  const h = dh * scale;
  const x = shoulderX - root[0] * w + ox;
  const y = shoulderY - root[1] * h + oy;
  ctx.drawImage(source, x, y, w, h);
}

function drawLid(ctx, bw, bh) {
  const x = -bw / 2 + 0.735 * bw;
  const y = -bh / 2 + 0.3 * bh;
  ctx.fillStyle = "#c2ae9c";
  ctx.beginPath();
  ctx.ellipse(x, y, 5.2, 3.4, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSkin(ctx, skin, bw, bh, time) {
  if (skin === "classic" || skin === "bronze") return;
  const neckX = -bw / 2 + 0.6 * bw;
  const neckY = -bh / 2 + 0.42 * bh;
  const headX = -bw / 2 + 0.7 * bw;
  const headY = -bh / 2 + 0.16 * bh;
  if (skin === "scarf") {
    const wave = Math.sin(time * 6) * 2;
    ctx.save();
    ctx.translate(neckX, neckY);
    ctx.rotate(-0.7);
    ctx.fillStyle = "#1b6b45";
    roundRect(ctx, -16, -5, 30, 11, 5);
    ctx.fill();
    ctx.fillStyle = "#f4efe4";
    roundRect(ctx, -13, -1.4, 24, 2.6, 1);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#145c38";
    ctx.beginPath();
    ctx.moveTo(neckX + 2, neckY + 2);
    ctx.quadraticCurveTo(neckX - 10, neckY + 10 + wave, neckX - 16, neckY + 20 + wave);
    ctx.lineTo(neckX - 10, neckY + 21 + wave);
    ctx.quadraticCurveTo(neckX - 4, neckY + 12, neckX + 6, neckY + 4);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (skin === "protea") {
    ctx.save();
    ctx.translate(headX, headY);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.fillStyle = i % 2 ? "#d84e72" : "#f2a0b4";
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 2.2, 6.4, a + Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#f7f3ea";
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  if (skin === "beanie") {
    ctx.fillStyle = "#243044";
    ctx.beginPath();
    ctx.ellipse(headX, headY + 4, 12, 8, -0.1, Math.PI, 0);
    ctx.quadraticCurveTo(headX + 8, headY - 14, headX, headY - 16);
    ctx.quadraticCurveTo(headX - 10, headY - 12, headX - 12, headY + 4);
    ctx.fill();
    ctx.fillStyle = "#f4efe4";
    ctx.beginPath();
    ctx.arc(headX + 1, headY - 15, 3.2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (skin === "straw") {
    ctx.fillStyle = "#e7c78a";
    ctx.beginPath();
    ctx.ellipse(headX, headY + 6, 16, 4.2, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f3d7a4";
    ctx.beginPath();
    ctx.moveTo(headX - 8, headY + 4);
    ctx.quadraticCurveTo(headX - 4, headY - 12, headX + 2, headY - 14);
    ctx.quadraticCurveTo(headX + 10, headY - 10, headX + 8, headY + 4);
    ctx.fill();
    ctx.fillStyle = "#2c6b4a";
    roundRect(ctx, headX - 7, headY + 2, 14, 2.6, 1);
    ctx.fill();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function drawKoeksister(ctx, x, y, time, scale) {
  const pic = img.koeksister;
  if (!pic) return;
  const s = 30 * (scale || 1);
  const h = s * (pic.height / pic.width);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin((time || 0) * 2.2) * 0.15);
  ctx.drawImage(pic, -s / 2, -h / 2, s, h);
  const spark = 0.35 + 0.45 * Math.sin((time || 0) * 7);
  ctx.globalAlpha = spark;
  ctx.fillStyle = "#fff6d2";
  ctx.beginPath();
  ctx.arc(s * 0.28, -h * 0.32, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawFeather(ctx, x, y, rot, len, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(2, len), Math.max(1.2, len * 0.32), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawDust(ctx, x, y, r, alpha) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#c4a07a";
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

const MEDAL = {
  bronze: ["#E0B07A", "#A86B32", "#F3D7B0"],
  silver: ["#F4F7FB", "#8E9AAB", "#C5CEDA"],
  gold: ["#FFE38A", "#E0A03A", "#FFF6D4"],
  iris: ["#D7FFE8", "#1F8A52", "#F2C14E"],
};

export function drawMedal(ctx, tier) {
  ctx.clearRect(0, 0, 96, 96);
  if (!tier) {
    ctx.strokeStyle = "#C4B09A";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(48, 52, 26, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  const [a, b, c] = MEDAL[tier] || MEDAL.bronze;
  ctx.fillStyle = tier === "iris" ? "#2C6B4A" : "#C4544A";
  roundRect(ctx, 28, 10, 16, 42, 4);
  ctx.fill();
  roundRect(ctx, 52, 10, 16, 42, 4);
  ctx.fill();
  const g = ctx.createLinearGradient(26, 34, 72, 82);
  g.addColorStop(0, c);
  g.addColorStop(0.5, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(48, 56, 26, 0, Math.PI * 2);
  ctx.fill();
}

export function drawAppIcon(ctx, size) {
  if (!ready) {
    ctx.fillStyle = "#E38B86";
    ctx.fillRect(0, 0, size, size);
    return;
  }
  ctx.drawImage(img.sky_dawn, 0, 0, size, size);
  ctx.save();
  ctx.translate(size * 0.48, size * 0.56);
  ctx.scale(size / 220, size / 220);
  drawHadeda(ctx, { wing: 0.85, skin: "classic" });
  ctx.restore();
}

export const ZONE_ANCHOR = {
  suburb: "wash",
  site: "crane",
  freeway: "gantry",
  yard: "wash",
  jac: "limb",
};

export const ZONE_TINT = {
  suburb: "#f0d2c0",
  site: "#d8b48a",
  freeway: "#b7c6d4",
  yard: "#e7c2a4",
  jac: "#d7b4dc",
};
