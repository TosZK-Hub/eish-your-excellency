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
  "houses", "ground",
  "body", "wing_up", "wing_mid", "wing_down",
  "crane_top_cap", "crane_top_body", "jojo_bot_cap", "jojo_bot_body",
  "gantry_top_cap", "gantry_top_body", "overpass_bot_cap", "overpass_bot_body",
  "washing_top_cap", "washing_top_body", "brickpillar_bot_cap", "brickpillar_bot_body",
  "jacaranda_top_cap", "jacaranda_top_body", "palisade_bot_cap", "palisade_bot_body",
  "anchor_crane", "anchor_gantry", "anchor_wash", "anchor_limb",
];

// v4 Joburg pack: shipped inline (pack-art.js) so the web preview and the APK read the same bytes.
const PACKED = [
  "hills_v4", "skyline_day", "skyline_sunset", "hillbrow_tower", "hillbrow_tower_sunset",
  "powerlines", "pylon", "coin10c", "body_hettie", "scarf_tails",
];

const img = {};
const darkWing = {};
const greenScarf = {};

// The "Bok-green doek" skin: shift only the pink neckerchief pixels to green.
function recolourScarf(source, minY = 0) {
  const c = document.createElement("canvas");
  c.width = source.width;
  c.height = source.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(source, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height);
  const d = data.data;
  const start = Math.floor(minY * c.height) * c.width * 4; // skip the head (crest tints)
  for (let i = start; i < d.length; i += 4) {
    const r = d[i], gr = d[i + 1], b = d[i + 2];
    if (d[i + 3] < 200 || r < gr + 45 || r < b + 15 || b < gr - 15) continue;
    const l = r * 0.3 + gr * 0.59 + b * 0.11;
    const k = l / 150;
    d[i] = 30 * k + 8; d[i + 1] = 128 * k + 10; d[i + 2] = 78 * k + 8;
  }
  g.putImageData(data, 0, 0);
  return c;
}
const bronzeWing = {};
let ready = false;

function loadOne(name, src) {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(name));
    el.src = src || "assets/" + name + ".webp";
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
  const jobs = FILES.map((name) => loadOne(name).then((el) => { img[name] = el; }));
  jobs.push(
    import("./pack-art.js").then((m) =>
      Promise.all(PACKED.map((name) => loadOne(name, m.ART[name]).then((el) => { img[name] = el; })))
    )
  );
  return Promise.all(jobs).then(() => {
    img.hills = img.hills_v4;
    // Hettie Hadida: the painted rig body with her cheek stripe, lashes and
    // protea-pink neckerchief. The loose scarf tails are a separate piece.
    img.body = img.body_hettie;
    greenScarf.body = recolourScarf(img.body_hettie, 0.17);
    greenScarf.tails = recolourScarf(img.scarf_tails);
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

// ---------------------------------------------------------------------------
// Time-of-day grading. Each layer is graded once per key (dawn, day, sunset,
// night) into an offscreen canvas, then neighbouring keys are cross-faded.
// No full-screen multiply rectangles, so no hard horizontal seams.
// ---------------------------------------------------------------------------

const KEYS = ["dawn", "day", "sunset", "night"];
const graded = {};
let curTod = 1;
let lightPhase = 0;

// Window panes on houses_tile (1216 px wide master), lit at night.
const WINDOWS = [
  [1, 155, 12, 17], [48, 151, 18, 21], [147, 152, 19, 20], [232, 156, 16, 16],
  [299, 150, 12, 9], [329, 150, 13, 9], [383, 149, 17, 24], [521, 152, 22, 20],
  [689, 155, 16, 17], [757, 154, 20, 18], [873, 155, 20, 17], [951, 157, 13, 15],
  [1051, 154, 36, 18], [1138, 153, 19, 19],
];

function gradePixels(d, key) {
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    let r = d[i], g = d[i + 1], b = d[i + 2];
    const l = r * 0.3 + g * 0.59 + b * 0.11;
    if (key === "dawn") {
      r = r * 0.9 + l * 0.08 + 14; g = g * 0.84 + l * 0.06 + 4; b = b * 0.86 + l * 0.06 + 16;
    } else if (key === "sunset") {
      r = r * 0.96 + l * 0.1 + 18; g = g * 0.76 + l * 0.06; b = b * 0.56 + l * 0.04 + 6;
    } else if (key === "night") {
      const m = l * 0.55 + (r + g + b) * 0.15;
      r = m * 0.26 + 6; g = m * 0.32 + 10; b = m * 0.52 + 24;
    }
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
}

function makeGraded(name, key) {
  const painted = key === "sunset" && img[name + "_sunset"];
  const source = painted || img[name];
  const c = document.createElement("canvas");
  c.width = source.width;
  c.height = source.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(source, 0, 0);
  if (key === "day" || painted) return c;
  const data = g.getImageData(0, 0, c.width, c.height);
  gradePixels(data.data, key);
  g.putImageData(data, 0, 0);
  if (key === "night" && name === "houses") litWindows(g, img.houses, c.width / 1216);
  if (key === "night" && name === "hillbrow_tower") podLights(g, c.width, c.height);
  if (key === "night" && name === "skyline") cityLights(g, img.skyline_day);
  return c;
}

function litWindows(g, source, s) {
  const tmp = document.createElement("canvas");
  tmp.width = source.width;
  tmp.height = source.height;
  const t = tmp.getContext("2d", { willReadFrequently: true });
  t.drawImage(source, 0, 0);
  const glow = document.createElement("canvas");
  glow.width = source.width;
  glow.height = source.height;
  const gg = glow.getContext("2d");
  WINDOWS.forEach(([x, y, w, h], n) => {
    const X = Math.round(x * s), Y = Math.round(y * s), Wd = Math.max(2, Math.round(w * s)), Hd = Math.max(2, Math.round(h * s));
    const px = t.getImageData(X, Y, Wd, Hd);
    const d = px.data;
    const warm = n % 4 === 3 ? [255, 228, 170] : [255, 192, 104];
    for (let i = 0; i < d.length; i += 4) {
      const l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255;
      const k = clamp(1.15 - l * 1.25, 0.18, 1);
      d[i] = warm[0] * k; d[i + 1] = warm[1] * k; d[i + 2] = warm[2] * k; d[i + 3] = 255;
    }
    g.putImageData(px, X, Y);
    gg.fillStyle = "rgba(255, 186, 96, 0.55)";
    gg.fillRect(X, Y, Wd, Hd);
  });
  g.save();
  g.globalCompositeOperation = "lighter";
  g.filter = "blur(" + Math.max(3, Math.round(9 * s)) + "px)";
  g.globalAlpha = 0.85;
  g.drawImage(glow, 0, 0);
  g.restore();
}

// Scattered office windows on the far CBD at night (deterministic).
function cityLights(g, source) {
  const t = document.createElement("canvas");
  t.width = source.width;
  t.height = source.height;
  const tc = t.getContext("2d", { willReadFrequently: true });
  tc.drawImage(source, 0, 0);
  const a = tc.getImageData(0, 0, t.width, t.height).data;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.save();
  g.globalCompositeOperation = "lighter";
  const n = Math.round((t.width * t.height) / 260);
  for (let i = 0; i < n; i++) {
    const x = Math.floor(rnd() * t.width);
    const y = Math.floor(rnd() * t.height * 0.82);
    const o = (y * t.width + x) * 4;
    if (a[o + 3] < 250) continue;
    const warm = rnd() < 0.8;
    g.fillStyle = warm ? "rgba(255, 196, 110, 0.75)" : "rgba(200, 225, 255, 0.6)";
    g.fillRect(x, y, 2, 2);
  }
  g.restore();
}

function podLights(g, w, h) {
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 9; i++) {
    const x = w * (0.16 + i * 0.085);
    for (const fy of [0.152, 0.172, 0.236]) {
      if ((i * 7 + Math.round(fy * 1000)) % 3 === 0) continue;
      g.fillStyle = "rgba(255, 200, 120, 0.85)";
      g.fillRect(x, h * fy, Math.max(1.5, w * 0.03), Math.max(1.5, h * 0.004));
    }
  }
  g.restore();
}

function gradedOf(name, key) {
  const id = name + "|" + key;
  if (!graded[id]) graded[id] = makeGraded(name, key);
  return graded[id];
}

function todPair() {
  const t = clamp(curTod, 0, 3);
  const k = Math.min(2, Math.floor(t));
  return [KEYS[k], KEYS[k + 1], t - k];
}

// Draw a layer with the current grade (cross-fade between the two nearest keys).
function dl(ctx, name, x, y, w, h) {
  const [ka, kb, u] = todPair();
  if (u < 0.985) ctx.drawImage(gradedOf(name, ka), x, y, w, h);
  if (u > 0.015) {
    const a = ctx.globalAlpha;
    if (u < 0.985) ctx.globalAlpha = a * u;
    ctx.drawImage(gradedOf(name, kb), x, y, w, h);
    ctx.globalAlpha = a;
  }
}

export function setTod(tod) {
  curTod = tod;
}

// Pre-grade the big layers for one key so the first fade does not hitch.
export function warmArt(key) {
  if (!ready) return;
  for (const n of ["hills", "houses", "ground", "skyline", "hillbrow_tower", "powerlines", "pylon"]) gradedOf(n, key || "day");
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

function tileLayer(ctx, name, camera, y, height, parallax, w) {
  const image = img[name];
  if (!image) return;
  const width = height * (image.width / image.height);
  const shift = ((camera * parallax) % width + width) % width;
  const start = -shift;
  for (let x = start; x < (w || 390); x += width) {
    dl(ctx, name, Math.floor(x), y, Math.ceil(width) + 1, height);
  }
}

// Landmark on a long loop: returns screen x, or null when off screen.
function loopX(camera, parallax, period, offset, width, w) {
  const p = (((offset - camera * parallax) % period) + period) % period;
  const x = p - width - 40;
  return x > w + 40 || x < -width - 40 ? null : x;
}

const TOWER = { h: 340, y: 196 };

function drawTowerLights(ctx, x, w, night, time) {
  if (night < 0.05) return;
  const blink = Math.sin(time * 4.2) > 0.35 ? 1 : 0.18;
  const pts = [[0.5, 0.012, 1], [0.5, 0.06, 0.8], [0.5, 0.11, 0.7]];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [fx, fy, s] of pts) {
    const cx = x + w * fx;
    const cy = TOWER.y + TOWER.h * fy;
    const a = night * blink * s;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
    g.addColorStop(0, "rgba(255, 70, 50," + a + ")");
    g.addColorStop(0.25, "rgba(255, 40, 30," + a * 0.6 + ")");
    g.addColorStop(1, "rgba(255, 30, 20, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - 12, cy - 12, 24, 24);
  }
  ctx.restore();
}

export function paintWorld(ctx, opt) {
  const w = opt.w || 390;
  const h = opt.h || 844;
  const tod = opt.tod ?? 1;
  const time = opt.time || 0;
  const camera = opt.camera || 0;
  curTod = tod;
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
  const night = clamp(tod - 2.2, 0, 0.8) / 0.8;

  // Far Joburg: skyline band, Hillbrow Tower, then the koppies.
  tileLayer(ctx, "skyline", camera, 352, 92, 0.05, w);
  const tw = TOWER.h * (img.hillbrow_tower.width / img.hillbrow_tower.height);
  const tx = loopX(camera, 0.05, 820, 331, tw, w);
  if (tx !== null) {
    dl(ctx, "hillbrow_tower", tx, TOWER.y, tw, TOWER.h);
    drawTowerLights(ctx, tx, tw, night, time);
  }
  tileLayer(ctx, "hills", camera, 428, 204, 0.18, w);
  const ph = 150;
  const pw = ph * (img.pylon.width / img.pylon.height);
  const pxp = loopX(camera, 0.24, 1500, 478, pw, w);
  if (pxp !== null) dl(ctx, "pylon", pxp, 434, pw, ph);
  tileLayer(ctx, "houses", camera, 548, 168, 0.42, w);
  tileLayer(ctx, "powerlines", camera, 584, 128, 0.62, w);

  drawAnchor(ctx, opt.anchor || "limb", w);
}

// The packed skyline uses "skyline_day" as its day art.
Object.defineProperty(img, "skyline", { get() { return img.skyline_day; }, enumerable: false });

export function drawGround(ctx, camera) {
  if (!ready) return;
  tileLayer(ctx, "ground", camera, GROUND_Y - 28, 168, 1);
}

function drawAnchor(ctx, kind, w) {
  const map = {
    crane: ["anchor_crane", 22],
    gantry: ["anchor_gantry", 20],
    wash: ["anchor_wash", 12],
    limb: ["anchor_limb", 30],
  };
  const spec = map[kind] || map.limb;
  if (!img[spec[0]]) return;
  const h = spec[1];
  dl(ctx, spec[0], 0, 0, w, h);
  if (kind === "wash" && img.washing_top_body) {
    dl(ctx, "washing_top_body", 16, 0, 10, 78);
    dl(ctx, "washing_top_body", w - 26, 0, 10, 78);
  }
}

function px(piece, key) {
  return PIECE[piece][key] * R;
}

function tileBody(ctx, name, x, y0, y1, bw, bh, dir) {
  if (!img[name] || bh < 2) return;
  if (dir < 0) {
    let y = y0;
    while (y > y1 - bh) {
      y -= bh;
      dl(ctx, name, x, y, bw, bh + 0.5);
    }
  } else {
    let y = y0;
    while (y < y1) {
      dl(ctx, name, x, y, bw, bh + 0.5);
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
    tileBody(ctx, piece + "_body", x, capY, -bodyH, pw, bodyH, -1);
    dl(ctx, piece + "_cap", x, capY, pw, capH);
  } else {
    dl(ctx, piece + "_cap", x, edge, pw, capH);
    tileBody(ctx, piece + "_body", x, edge + capH, GROUND_Y + 20, pw, bodyH, 1);
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
  const green = skin === "scarf";
  drawScarfTails(ctx, green ? greenScarf.tails : img.scarf_tails, bodyH, opt.time || 0, opt.vy || 0);
  ctx.drawImage(green ? greenScarf.body || body : body, -BODY_W / 2, -bodyH / 2, BODY_W, bodyH);
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

// Scarf tails stream back from the knot behind Hettie's neck and flutter.
// Knot = (460, 97) on the 804 px master body; tails piece pivot = (70, 39).
const KNOT = [460 / 804, 97 / 387];
function drawScarfTails(ctx, tails, bodyH, time, vy) {
  if (!tails) return;
  const k = BODY_W / 804;
  const x = -BODY_W / 2 + KNOT[0] * BODY_W;
  const y = -bodyH / 2 + KNOT[1] * bodyH;
  const lift = Math.max(-0.25, Math.min(0.25, vy / 1600));
  const flap = Math.sin(time * 13.0) * 0.16 + Math.sin(time * 5.3 + 1.1) * 0.08;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.42 + flap + lift);
  ctx.scale(1.05 + Math.sin(time * 9.1) * 0.05, 0.9 + Math.sin(time * 13.0 + 0.8) * 0.12);
  ctx.drawImage(tails, -70 * k, -39 * k, 72 * k, 56 * k);
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
  const x = -bw / 2 + 0.726 * bw;
  const y = -bh / 2 + 0.12 * bh;
  ctx.fillStyle = "#7d6a5b";
  ctx.beginPath();
  ctx.ellipse(x, y, 3.6, 2.6, -0.15, 0, Math.PI * 2);
  ctx.fill();
}

function drawSkin(ctx, skin, bw, bh, time) {
  if (skin === "classic" || skin === "bronze") return;
  const neckX = -bw / 2 + 0.6 * bw;
  const neckY = -bh / 2 + 0.42 * bh;
  const headX = -bw / 2 + 0.7 * bw;
  const headY = -bh / 2 + 0.16 * bh;
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

// The pickup: a painted 10c coin that spins on its vertical axis.
export function drawCoin(ctx, x, y, time, scale) {
  const pic = img.coin10c;
  if (!pic) return;
  const s = 30 * (scale || 1);
  const h = s * (pic.height / pic.width);
  const spin = Math.cos((time || 0) * 3.1 + x * 0.013);
  const sx = Math.max(0.16, Math.abs(spin));
  ctx.save();
  ctx.translate(x, y + Math.sin((time || 0) * 2.4) * 2);
  ctx.scale(sx, 1);
  if (spin < 0) ctx.filter = "brightness(0.82)";
  ctx.drawImage(pic, -s / 2, -h / 2, s, h);
  ctx.filter = "none";
  ctx.restore();
  const glint = Math.max(0, Math.sin((time || 0) * 3.1 + x * 0.013 + 1.2));
  if (glint > 0.85) {
    ctx.save();
    ctx.globalAlpha = (glint - 0.85) * 5;
    ctx.fillStyle = "#fff6d2";
    ctx.beginPath();
    ctx.arc(x + s * 0.2, y - h * 0.24, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export const drawKoeksister = drawCoin;

export function coinImage() {
  return img.coin10c || null;
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
