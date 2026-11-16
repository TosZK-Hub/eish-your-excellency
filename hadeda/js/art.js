// Hand-built flat vector art. Paths, not images, not primitives-as-placeholders.

const TAU = Math.PI * 2;

export const GROUND_Y = 726;

export const GATE = {
  iron: { w: 104, hit: [4, 100], yForgive: 8 },
  jacaranda: { w: 96, hit: [28, 70], yForgive: 20 },
  pole: { w: 90, hit: [32, 62], yForgive: 6 },
  palisade: { w: 108, hit: [6, 102], yForgive: 16 },
  tower: { w: 116, hit: [14, 104], yForgive: 8 },
};

const LOOK = {
  dawn: {
    sky: ["#16365C", "#3E5F86", "#E38B86", "#F6B98A", "#FBD7B0", "#F6E3C8"],
    skyAt: [0, 0.28, 0.5, 0.66, 0.82, 1],
    sun: { x: 268, y: 500, r: 34, halo: 170, color: "rgba(255,231,184,0.95)", glow: "rgba(255,196,140,0.55)" },
    cloud: "rgba(255,236,224,0.94)",
    cloudUnder: "rgba(232,150,120,0.28)",
    hill: "#E7B7AE",
    hillFar: "#F3D2CC",
    haze: "rgba(255,214,196,0.38)",
    grassTop: "#8EAA72",
    grassMid: "#6E8E58",
    path: "#E4D3BC",
    kerb: "#F3EBDF",
    wallA: "#F6E0D0",
    sideA: "#E7CDB8",
    roofA: "#C4544A",
    roofA2: "#9E3C36",
    wallB: "#E7C8A4",
    sideB: "#D2B08A",
    roofB: "#3E6B4A",
    roofB2: "#2C4E36",
    wallC: "#F4EFE6",
    sideC: "#DDD6CA",
    roofC: "#C5CCD4",
    roofC2: "#8E959E",
    door: "#6E4038",
    trunk: "#6A4A3A",
    blossom: ["#8A5A9A", "#B07CC4", "#D4B0E0", "#6E4484"],
    distant: ["#E4B2A8", "#D7A79E", "#EBD0C6"],
    window: 0.45,
  },
  day: {
    sky: ["#6EB4E8", "#A9D4F5", "#E7F4FB", "#F7FBFE"],
    skyAt: [0, 0.42, 0.75, 1],
    sun: { x: 312, y: 128, r: 26, halo: 120, color: "rgba(255,248,220,1)", glow: "rgba(255,236,180,0.45)" },
    cloud: "rgba(255,255,255,0.96)",
    cloudUnder: "rgba(190,214,230,0.45)",
    hill: "#C5D7E4",
    hillFar: "#D9E8F2",
    haze: "rgba(255,255,255,0.28)",
    grassTop: "#8FBF5A",
    grassMid: "#6A9A42",
    path: "#EFE3D2",
    kerb: "#F7F3EC",
    wallA: "#FFF6EC",
    sideA: "#F0E0D0",
    roofA: "#D24B3E",
    roofA2: "#A83830",
    wallB: "#F0D2AE",
    sideB: "#DCBA94",
    roofB: "#3F7A4E",
    roofB2: "#2C5A38",
    wallC: "#F7F4EE",
    sideC: "#E4E0D8",
    roofC: "#D5DCE4",
    roofC2: "#9AA3AD",
    door: "#7A4638",
    trunk: "#6E4E3C",
    blossom: ["#7A3E96", "#A56BC4", "#D7B6EA", "#5C2E78"],
    distant: ["#D5E2EC", "#C9D6E2", "#E4EEF4"],
    window: 0,
  },
  sunset: {
    sky: ["#2A1B42", "#A23B5C", "#F08A4A", "#F6C15A", "#F8D9A0"],
    skyAt: [0, 0.34, 0.56, 0.76, 1],
    sun: { x: 108, y: 520, r: 46, halo: 210, color: "rgba(255,226,170,0.95)", glow: "rgba(255,150,70,0.5)" },
    cloud: "rgba(255,206,160,0.88)",
    cloudUnder: "rgba(210,90,60,0.4)",
    hill: "#C4624A",
    hillFar: "#E39A78",
    haze: "rgba(255,176,110,0.32)",
    grassTop: "#E2B15A",
    grassMid: "#C4843A",
    path: "#C48A52",
    kerb: "#E2C090",
    trunk: "#4A3024",
    canopy: "#6E7038",
    canopyHi: "#C2A85A",
    distant: ["#D47858", "#C46248", "#E09070"],
    window: 0,
  },
  night: {
    sky: ["#0C1428", "#14233C", "#1A3050", "#24344A"],
    skyAt: [0, 0.5, 0.82, 1],
    sun: { x: 300, y: 118, r: 20, halo: 90, color: "rgba(246,241,226,0.95)", glow: "rgba(210,220,255,0.25)", moon: true },
    cloud: "rgba(170,186,210,0.08)",
    cloudUnder: "rgba(0,0,0,0)",
    hill: "#1A2740",
    hillFar: "#243352",
    haze: "rgba(10,16,32,0.2)",
    grassTop: "#24362C",
    grassMid: "#1A2820",
    path: "#2A2622",
    kerb: "#3A342E",
    wallA: "#323848",
    sideA: "#262B3A",
    roofA: "#6A3038",
    roofA2: "#4A2228",
    wallB: "#3A342E",
    sideB: "#2A241E",
    roofB: "#1E3A30",
    roofB2: "#142820",
    wallC: "#2C343C",
    sideC: "#22282E",
    roofC: "#5A616A",
    roofC2: "#333840",
    door: "#1A1412",
    trunk: "#1A1412",
    blossom: ["#2A2038", "#3A3050", "#4A4060", "#241C30"],
    distant: ["#1C2840", "#241C30", "#1A2438"],
    window: 1,
  },
};

const WING = {
  classic: {
    deep: "#24352C",
    green: "#1F7A49",
    greenLite: "#3EAA72",
    bronze: "#A56B32",
    teal: "#1A6A62",
    sheen: "rgba(210,255,226,0.75)",
    purple: "#6E4A86",
    primary: "#3E342E",
    primaryLite: "#5C4E44",
  },
  bronze: {
    deep: "#3A2A1C",
    green: "#8A5A28",
    greenLite: "#C4843C",
    bronze: "#E0A15A",
    teal: "#A86838",
    sheen: "rgba(255,226,180,0.8)",
    purple: "#8A5A48",
    primary: "#4A3424",
    primaryLite: "#6A4C32",
  },
};

function wingOf(skin) {
  return skin === "bronze" ? WING.bronze : WING.classic;
}

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function rounded(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

const caches = new Map();

export function clearThemeCaches() {
  caches.clear();
}

function renderLayer(w, h, dpr, draw) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  draw(ctx);
  return { canvas: c, w, h };
}

export function ensureTheme(theme, dpr) {
  const key = theme + "@" + dpr.toFixed(2);
  const hit = caches.get(key);
  if (hit) return hit;
  const pack = {
    far: renderLayer(900, 210, dpr, (ctx) => drawFar(ctx, 900, 210, theme)),
    mid: renderLayer(1120, 300, dpr, (ctx) => drawMid(ctx, 1120, 300, theme)),
    near: renderLayer(760, 130, dpr, (ctx) => drawNear(ctx, 760, 130, theme)),
    ground: renderLayer(480, 150, dpr, (ctx) => drawGround(ctx, 480, 150, theme)),
  };
  caches.set(key, pack);
  return pack;
}

function fillRidge(ctx, w, h, base, amp, color, phase) {
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 8) {
    const u = (x / w) * TAU;
    const y = base + Math.sin(u + phase) * amp + Math.sin(u * 2 + phase * 1.7) * amp * 0.35;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawFar(ctx, w, h, theme) {
  const L = LOOK[theme];
  fillRidge(ctx, w, h, h * 0.42, 26, L.hillFar, 0.4);
  fillRidge(ctx, w, h, h * 0.58, 32, L.hill, 1.3);
  if (theme === "sunset") {
    ctx.fillStyle = "#A85A48";
    ctx.beginPath();
    ctx.ellipse(w * 0.72, h * 0.7, 78, 28, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#C47860";
    ctx.beginPath();
    ctx.ellipse(w * 0.68, h * 0.6, 44, 16, -0.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#8E4A3C";
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 0.72, 56, 18, 0.1, 0, TAU);
    ctx.fill();
    return;
  }
  for (let i = 0; i < 9; i++) {
    const x = 18 + i * (w / 9.4);
    const hw = 26 + hash(i + 2) * 22;
    const rh = 16 + hash(i + 5) * 32;
    const base = h - 18;
    ctx.fillStyle = L.distant[i % L.distant.length];
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.lineTo(x, base - rh);
    ctx.lineTo(x + hw * 0.15, base - rh - 4);
    ctx.lineTo(x + hw * 0.5, base - rh - 16);
    ctx.lineTo(x + hw * 0.85, base - rh - 4);
    ctx.lineTo(x + hw, base - rh);
    ctx.lineTo(x + hw, base);
    ctx.closePath();
    ctx.fill();
    if (theme === "night" && hash(i + 11) > 0.35) {
      ctx.fillStyle = "rgba(246,197,107,0.85)";
      ctx.fillRect(x + 6, base - rh + 8, 3, 4);
      ctx.fillRect(x + hw - 12, base - rh + 12, 3, 4);
    }
  }
  const tx = w * 0.86;
  const ty = h - 86;
  ctx.fillStyle = theme === "night" ? "#2A3A52" : "#E7C8C0";
  rounded(ctx, tx, ty + 8, 5, 52, 2);
  ctx.fill();
  rounded(ctx, tx + 18, ty + 8, 5, 52, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(tx + 11, ty + 8, 20, 9, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(tx + 11, ty + 6, 14, 6, 0, 0, TAU);
  ctx.fillStyle = theme === "night" ? "#334860" : "#F3DDD6";
  ctx.fill();
}

function drawMid(ctx, w, h, theme) {
  if (theme === "sunset") {
    drawVeld(ctx, w, h);
    return;
  }
  const L = LOOK[theme];
  const base = h - 8;
  house(ctx, 36, base, {
    w: 132,
    wallH: 78,
    wall: L.wallA,
    side: L.sideA,
    roof: L.roofB,
    roofDark: L.roofB2,
    door: L.door,
    lit: theme === "night" || theme === "dawn",
    stoep: true,
    chimney: false,
    dish: false,
  });
  jacarandaTree(ctx, 250, base, 1, L);
  house(ctx, 390, base, {
    w: 150,
    wallH: 86,
    wall: L.wallB,
    side: L.sideB,
    roof: L.roofA,
    roofDark: L.roofA2,
    door: L.door,
    lit: theme !== "day",
    stoep: true,
    chimney: true,
    dish: false,
    brick: true,
  });
  lowWall(ctx, 600, base, L);
  house(ctx, 760, base, {
    w: 140,
    wallH: 74,
    wall: L.wallC,
    side: L.sideC,
    roof: L.roofC,
    roofDark: L.roofC2,
    door: L.door,
    lit: theme === "night",
    stoep: false,
    chimney: false,
    dish: true,
  });
  jacarandaTree(ctx, 980, base, 0.85, L);
  if (theme === "dawn") {
    ctx.save();
    ctx.translate(470, base - 118);
    ctx.scale(0.28, 0.28);
    drawHadeda(ctx, { wing: 0.2, skin: "classic", beak: 0.15, micro: true });
    ctx.restore();
  }
  stoepDog(ctx, 168, base - 2, theme);
  washingLine(ctx, 300, base - 92, 390, base - 78);
}

function drawVeld(ctx, w, h) {
  const base = h - 6;
  ctx.fillStyle = "#E2B15A";
  ctx.fillRect(0, base - 36, w, 42);
  ctx.fillStyle = "#C9963E";
  for (let x = 0; x < w; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.quadraticCurveTo(x + 3, base - 22 - (x % 5) * 2, x + 1, base - 30);
    ctx.quadraticCurveTo(x + 6, base - 18, x + 8, base);
    ctx.fill();
  }
  acacia(ctx, 180, base, 1.15);
  acacia(ctx, 520, base, 0.9);
  acacia(ctx, 860, base, 1.25);
  koppie(ctx, 680, base);
  // A fence line, small and far, so it doesn't compete with the play obstacles.
  ctx.strokeStyle = "#6A4632";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(40, base - 18);
  ctx.lineTo(320, base - 26);
  ctx.stroke();
  for (let x = 40; x < 320; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.lineTo(x + 2, base - 22);
    ctx.stroke();
  }
}

function koppie(ctx, x, y) {
  ctx.fillStyle = "#B85A42";
  ctx.beginPath();
  ctx.moveTo(x - 70, y);
  ctx.quadraticCurveTo(x - 40, y - 70, x, y - 86);
  ctx.quadraticCurveTo(x + 50, y - 60, x + 80, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#D4845C";
  ctx.beginPath();
  ctx.moveTo(x - 30, y - 20);
  ctx.quadraticCurveTo(x, y - 78, x + 20, y - 30);
  ctx.quadraticCurveTo(x, y - 40, x - 30, y - 20);
  ctx.fill();
  ctx.fillStyle = "rgba(90,40,30,0.25)";
  ctx.beginPath();
  ctx.ellipse(x + 10, y - 8, 36, 8, 0, 0, TAU);
  ctx.fill();
}

function acacia(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = "#5A3A28";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-4, -34, -20, -52);
  ctx.moveTo(0, -8);
  ctx.quadraticCurveTo(6, -36, 22, -50);
  ctx.stroke();
  ctx.fillStyle = "#5E6A34";
  ctx.beginPath();
  ctx.ellipse(0, -58, 52, 14, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#8EA050";
  ctx.beginPath();
  ctx.ellipse(-8, -64, 30, 8, -0.1, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "rgba(50,40,16,0.2)";
  ctx.beginPath();
  ctx.ellipse(4, -50, 40, 6, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function house(ctx, x, base, opt) {
  const w = opt.w;
  const wallH = opt.wallH;
  const y = base - wallH;
  const depth = 16;
  ctx.fillStyle = "rgba(70,36,24,0.1)";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.55, base + 3, w * 0.46, 6, 0, 0, TAU);
  ctx.fill();

  ctx.fillStyle = opt.side;
  ctx.beginPath();
  ctx.moveTo(x + w, y + 4);
  ctx.lineTo(x + w + depth, y - 6);
  ctx.lineTo(x + w + depth, base - 8);
  ctx.lineTo(x + w, base);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = opt.wall;
  rounded(ctx, x, y, w, wallH, 3);
  ctx.fill();
  if (opt.brick) {
    ctx.save();
    rounded(ctx, x, y, w, wallH, 3);
    ctx.clip();
    ctx.strokeStyle = "rgba(120,60,40,0.18)";
    ctx.lineWidth = 1;
    for (let row = 0; row < wallH; row += 8) {
      const off = (row / 8) % 2 ? 8 : 0;
      ctx.beginPath();
      ctx.moveTo(x, y + row);
      ctx.lineTo(x + w, y + row);
      ctx.stroke();
      for (let col = off; col < w; col += 16) {
        ctx.beginPath();
        ctx.moveTo(x + col, y + row);
        ctx.lineTo(x + col, y + row + 8);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  const rw = w + 18;
  const rx = x - 12;
  const ry = y - 26;
  ctx.fillStyle = opt.roof;
  ctx.beginPath();
  ctx.moveTo(rx, y + 3);
  ctx.lineTo(rx + 18, ry);
  ctx.lineTo(rx + rw - 14, ry);
  ctx.lineTo(rx + rw, y + 3);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < rw; i += 7) {
    ctx.beginPath();
    ctx.moveTo(rx + i, ry);
    ctx.lineTo(rx + i - 8, y + 3);
    ctx.stroke();
  }
  ctx.restore();
  // redraw roof path for clip was consumed; fascia:
  ctx.fillStyle = "#F7F1E8";
  rounded(ctx, rx, y - 1, rw, 6, 2);
  ctx.fill();

  ctx.fillStyle = opt.roofDark;
  ctx.beginPath();
  ctx.moveTo(rx + rw - 14, ry);
  ctx.lineTo(rx + rw + depth - 8, ry - 8);
  ctx.lineTo(rx + rw + depth, y - 4);
  ctx.lineTo(rx + rw, y + 3);
  ctx.closePath();
  ctx.fill();

  if (opt.stoep) {
    ctx.fillStyle = "#EADCCB";
    rounded(ctx, x + 10, base - 14, w * 0.42, 14, 3);
    ctx.fill();
    column(ctx, x + 16, y + 18, base - 14);
    column(ctx, x + w * 0.42, y + 18, base - 14);
    potPlant(ctx, x + w * 0.42 + 16, base - 4);
  }

  const dw = 16;
  const dh = 30;
  const dx = x + w * 0.62;
  const dy = base - dh;
  ctx.fillStyle = opt.door;
  rounded(ctx, dx, dy, dw, dh, 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,220,180,0.28)";
  ctx.lineWidth = 1;
  rounded(ctx, dx + 3, dy + 4, dw - 6, 9, 1);
  ctx.stroke();
  rounded(ctx, dx + 3, dy + 16, dw - 6, 9, 1);
  ctx.stroke();
  ctx.fillStyle = "#E6C36A";
  ctx.beginPath();
  ctx.arc(dx + dw - 4, dy + 17, 1.5, 0, TAU);
  ctx.fill();

  window4(ctx, x + 14, y + 16, 30, 24, opt.lit);

  if (opt.chimney) {
    ctx.fillStyle = "#A65A48";
    rounded(ctx, x + w * 0.72, ry - 16, 12, 22, 1);
    ctx.fill();
    ctx.fillStyle = "#8E4638";
    rounded(ctx, x + w * 0.72 - 2, ry - 20, 16, 6, 1);
    ctx.fill();
  }
  if (opt.dish) {
    ctx.strokeStyle = opt.side;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.3, y - 4);
    ctx.lineTo(x + w * 0.3 + 4, y - 16);
    ctx.stroke();
    ctx.fillStyle = "#F4F1EC";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3 + 8, y - 16, 10, 6, -0.6, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#C8C2BA";
    ctx.stroke();
  }
}

function column(ctx, x, y, y2) {
  ctx.fillStyle = "#F7F1E8";
  rounded(ctx, x, y, 7, y2 - y, 3);
  ctx.fill();
  ctx.fillStyle = "#E4D5C4";
  rounded(ctx, x - 1, y, 9, 4, 2);
  ctx.fill();
}

function potPlant(ctx, x, y) {
  ctx.fillStyle = "#C46A4A";
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 10);
  ctx.lineTo(x + 6, y - 10);
  ctx.lineTo(x + 4, y);
  ctx.lineTo(x - 4, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#3E7A48";
  ctx.beginPath();
  ctx.arc(x, y - 16, 8, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#6AAA62";
  ctx.beginPath();
  ctx.arc(x - 3, y - 19, 4, 0, TAU);
  ctx.fill();
}

function window4(ctx, x, y, w, h, lit) {
  if (lit) {
    ctx.fillStyle = "rgba(246,196,110,0.35)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w * 0.9, h * 0.8, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = lit ? "#F6D48A" : "#C5DFF0";
  rounded(ctx, x, y, w, h, 2);
  ctx.fill();
  ctx.strokeStyle = lit ? "rgba(255,244,210,0.8)" : "#F7F3EC";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 2);
  ctx.lineTo(x + w / 2, y + h - 2);
  ctx.moveTo(x + 2, y + h / 2);
  ctx.lineTo(x + w - 2, y + h / 2);
  ctx.stroke();
  ctx.strokeStyle = "#E4D5C4";
  ctx.lineWidth = 2.5;
  rounded(ctx, x, y, w, h, 2);
  ctx.stroke();
  ctx.fillStyle = "#F7F3EC";
  rounded(ctx, x - 2, y + h, w + 4, 3.5, 1);
  ctx.fill();
}

function jacarandaTree(ctx, x, base, s, L) {
  ctx.save();
  ctx.translate(x, base);
  ctx.scale(s, s);
  trunk(ctx, 0, -78, 16, 26, 78, L.trunk);
  branch(ctx, 0, -70, -34, -110);
  branch(ctx, 2, -64, 36, -104);
  blossomCluster(ctx, -16, -124, 32, L.blossom);
  blossomCluster(ctx, 22, -116, 28, L.blossom);
  blossomCluster(ctx, 2, -140, 26, L.blossom);
  petalFlower(ctx, -34, -112, 4, L.blossom);
  petalFlower(ctx, 36, -100, 3.4, L.blossom);
  ctx.restore();
}

function branch(ctx, x, y, x2, y2) {
  ctx.strokeStyle = "#5A3E30";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo((x + x2) / 2, y - 10, x2, y2);
  ctx.stroke();
}

function trunk(ctx, x, y, topW, botW, h, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - topW / 2, y);
  ctx.quadraticCurveTo(x - botW / 2 - 3, y + h * 0.55, x - botW / 2, y + h);
  ctx.lineTo(x + botW / 2, y + h);
  ctx.quadraticCurveTo(x + botW / 2 + 2, y + h * 0.5, x + topW / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(40,22,12,0.28)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const ox = -topW * 0.25 + i * (topW * 0.18);
    ctx.beginPath();
    ctx.moveTo(x + ox, y + 4);
    ctx.quadraticCurveTo(x + ox + 2, y + h * 0.5, x + ox - 1, y + h - 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,226,196,0.28)";
  ctx.beginPath();
  ctx.moveTo(x - topW * 0.15, y + 2);
  ctx.quadraticCurveTo(x - botW * 0.1, y + h * 0.5, x - botW * 0.18, y + h);
  ctx.stroke();
}

function blossomCluster(ctx, x, y, r, cols) {
  ctx.fillStyle = cols[3] || cols[0];
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.08, r * 0.92, r * 0.58, 0, 0, TAU);
  ctx.fill();
  const spots = [
    [-0.28, -0.22, 0.58, 0],
    [0.3, -0.16, 0.54, 1],
    [0, -0.4, 0.46, 2],
    [-0.48, 0.08, 0.4, 1],
    [0.5, 0.12, 0.38, 0],
    [0.02, 0.18, 0.42, 1],
  ];
  for (const [ox, oy, s, ci] of spots) {
    ctx.fillStyle = cols[ci % cols.length];
    ctx.beginPath();
    ctx.arc(x + ox * r, y + oy * r, r * s, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.18, y - r * 0.2, r * 0.26, r * 0.14, -0.4, 0, TAU);
  ctx.fill();
}

function woodLimb(ctx, x1, y1, w1, x2, y2, w2, color) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const px = Math.cos(a + Math.PI / 2);
  const py = Math.sin(a + Math.PI / 2);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1 + px * w1, y1 + py * w1);
  ctx.quadraticCurveTo((x1 + x2) / 2 + px * ((w1 + w2) / 2), (y1 + y2) / 2 + py * ((w1 + w2) / 2), x2 + px * w2, y2 + py * w2);
  ctx.lineTo(x2 - px * w2, y2 - py * w2);
  ctx.quadraticCurveTo((x1 + x2) / 2 - px * ((w1 + w2) / 2), (y1 + y2) / 2 - py * ((w1 + w2) / 2), x1 - px * w1, y1 - py * w1);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,230,200,0.22)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x1 + px * w1 * 0.35, y1 + py * w1 * 0.35);
  ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2, x2 + px * w2 * 0.2, y2 + py * w2 * 0.2);
  ctx.stroke();
}

function petalFlower(ctx, x, y, s, cols) {
  const petal = cols ? cols[2] : "#E7D0F2";
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * s, y + Math.sin(a) * s, s * 0.7, s * 0.42, a, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#F6E7A4";
  ctx.beginPath();
  ctx.arc(x, y, s * 0.38, 0, TAU);
  ctx.fill();
}

function lowWall(ctx, x, base, L) {
  ctx.fillStyle = "#E7D3C0";
  rounded(ctx, x, base - 36, 120, 36, 3);
  ctx.fill();
  ctx.fillStyle = "#F7F1E8";
  rounded(ctx, x - 2, base - 42, 16, 44, 3);
  ctx.fill();
  rounded(ctx, x + 106, base - 42, 16, 44, 3);
  ctx.fill();
  ctx.fillStyle = "#C46A4A";
  rounded(ctx, x + 2, base - 40, 12, 6, 1);
  ctx.fill();
  rounded(ctx, x + 110, base - 40, 12, 6, 1);
  ctx.fill();
  aloe(ctx, x + 150, base, 0.7);
}

function aloe(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const cols = ["#2F5538", "#3E6B45", "#4F8A52"];
  for (let i = -3; i <= 3; i++) {
    ctx.fillStyle = cols[(i + 3) % 3];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(i * 8, -18, i * 11, -2);
    ctx.quadraticCurveTo(i * 5, 2, 0, 0);
    ctx.fill();
    // little teeth
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(i * 4, -8);
    ctx.lineTo(i * 4 + 2, -6);
    ctx.stroke();
  }
  ctx.strokeStyle = "#6B8F4A";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1, -2);
  ctx.quadraticCurveTo(8, -30, 3, -46);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#E07A32" : "#F2A05A";
    ctx.beginPath();
    ctx.ellipse(3 + (i % 2 ? 3 : -2), -20 - i * 4, 2.6, 3.4, 0.5, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawNear(ctx, w, h, theme) {
  const L = LOOK[theme];
  const y = h - 2;
  if (theme === "sunset") {
    for (let i = 0; i < 9; i++) {
      const x = 30 + i * 84;
      grassTuft(ctx, x, y, theme === "sunset" ? "#C9963E" : L.grassTop, 1 + hash(i) * 0.4);
    }
    return;
  }
  aloe(ctx, 80, y, 1);
  grassTuft(ctx, 150, y, L.grassTop, 1.1);
  daisy(ctx, 210, y - 8);
  grassTuft(ctx, 360, y, L.grassMid, 0.9);
  aloe(ctx, 470, y, 0.75);
  daisy(ctx, 560, y - 6);
  grassTuft(ctx, 660, y, L.grassTop, 1.2);
}

function grassTuft(ctx, x, y, color, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(i * 5, -16, i * 7, -26 - Math.abs(i));
    ctx.quadraticCurveTo(i * 3, -12, 0, 0);
    ctx.fill();
  }
  ctx.restore();
}

function daisy(ctx, x, y) {
  ctx.fillStyle = "#F7F3EC";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 4, y + Math.sin(a) * 3, 3.2, 1.8, a, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#F0C14A";
  ctx.beginPath();
  ctx.arc(x, y, 2.1, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#6E8E58";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
}

function drawGround(ctx, w, h, theme) {
  const L = LOOK[theme];
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, grassEdge(0, w));
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, grassEdge(x, w));
  ctx.lineTo(w, h);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, L.grassTop);
  g.addColorStop(0.45, L.grassMid);
  g.addColorStop(0.72, L.path);
  g.addColorStop(1, theme === "night" ? "#1A1816" : "#D9CBB6");
  ctx.fillStyle = g;
  ctx.fill();
  // kerb
  ctx.fillStyle = L.kerb;
  ctx.fillRect(0, 78, w, 7);
  ctx.strokeStyle = theme === "night" ? "rgba(255,255,255,0.04)" : "rgba(80,60,40,0.13)";
  ctx.lineWidth = 1;
  for (let x = 24; x < w; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 92);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  // blades along the top, kept off the seam
  for (let i = 0; i < 8; i++) {
    const x = 28 + i * 54;
    ctx.strokeStyle = theme === "sunset" ? "#A87830" : "rgba(40,70,30,0.35)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, grassEdge(x, w));
    ctx.quadraticCurveTo(x + 3, grassEdge(x, w) - 10, x + 1, grassEdge(x, w) - 16);
    ctx.stroke();
  }
  if (theme === "night") {
    const glow = ctx.createRadialGradient(120, 40, 4, 120, 70, 90);
    glow.addColorStop(0, "rgba(246,197,107,0.18)");
    glow.addColorStop(1, "rgba(246,197,107,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }
}

function grassEdge(x, w) {
  const u = (x / w) * TAU;
  return 18 + Math.sin(u) * 5 + Math.sin(u * 2) * 2.2;
}

function blit(ctx, layer, speed, y, camera, viewW) {
  const { canvas, w, h } = layer;
  let shift = (camera * speed) % w;
  if (shift < 0) shift += w;
  let x = -shift;
  while (x < viewW) {
    ctx.drawImage(canvas, x, y, w, h);
    x += w;
  }
}

export function paintWorld(ctx, opt) {
  const { camera, theme, next, fade, time, dpr, w, h } = opt;
  paintTheme(ctx, theme, camera, time, dpr, w, h, 1);
  if (next && fade > 0) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, fade));
    paintTheme(ctx, next, camera, time, dpr, w, h, 1);
    ctx.restore();
  }
}

function paintTheme(ctx, theme, camera, time, dpr, w, h) {
  const pack = ensureTheme(theme, dpr);
  drawSky(ctx, theme, w, h, time, camera);
  blit(ctx, pack.far, 0.14, 392, camera, w);
  // haze
  const L = LOOK[theme];
  const haze = ctx.createLinearGradient(0, 470, 0, 640);
  haze.addColorStop(0, "rgba(0,0,0,0)");
  haze.addColorStop(1, L.haze);
  ctx.fillStyle = haze;
  ctx.fillRect(0, 470, w, 180);
  blit(ctx, pack.mid, 0.34, 436, camera, w);
  blit(ctx, pack.near, 0.62, 606, camera, w);
  blit(ctx, pack.ground, 1, GROUND_Y - 16, camera, w);
  if (theme === "sunset") {
    const mx = ((640 - camera * 0.34) % 1120 + 1120) % 1120 - 40;
    windmill(ctx, mx, GROUND_Y, 0.85, time);
  }
  if (theme === "night") {
    const lampX = ((180 - camera * 0.34) % 1120 + 1120) % 1120;
    streetGlow(ctx, lampX, 560);
  }
}

function drawSky(ctx, theme, w, h, time, camera) {
  const L = LOOK[theme];
  const g = ctx.createLinearGradient(0, 0, 0, h);
  L.sky.forEach((c, i) => g.addColorStop(L.skyAt[i], c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const sun = L.sun;
  const sx = sun.x + Math.sin(time * 0.05) * 6;
  const halo = ctx.createRadialGradient(sx, sun.y, sun.r * 0.2, sx, sun.y, sun.halo);
  halo.addColorStop(0, sun.glow);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sx, sun.y, sun.halo, 0, TAU);
  ctx.fill();
  ctx.fillStyle = sun.color;
  ctx.beginPath();
  ctx.arc(sx, sun.y, sun.r, 0, TAU);
  ctx.fill();
  if (sun.moon) {
    ctx.fillStyle = "rgba(180,190,170,0.35)";
    ctx.beginPath();
    ctx.arc(sx - 6, sun.y - 4, 4, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sx + 5, sun.y + 3, 2.4, 0, TAU);
    ctx.fill();
    for (let i = 0; i < 32; i++) {
      const x = hash(i * 3.1) * w;
      const y = hash(i * 7.7) * h * 0.5;
      const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * 1.6 + i));
      ctx.fillStyle = `rgba(255,248,230,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 6 === 0 ? 1.5 : 0.8, 0, TAU);
      ctx.fill();
    }
  }
  const clouds = [
    { x: 30, y: 110, s: 1.15, v: 7 },
    { x: 210, y: 78, s: 0.72, v: 11 },
    { x: 360, y: 150, s: 1.05, v: 6 },
    { x: 140, y: 190, s: 0.5, v: 9 },
  ];
  for (const c of clouds) {
    const x = ((c.x + time * c.v - camera * 0.05) % (w + 180) + (w + 180)) % (w + 180) - 70;
    drawCloud(ctx, x, c.y, c.s, theme);
  }
  if (theme === "dawn" || theme === "day") {
    distantHadeda(ctx, 70 + Math.sin(time * 0.4) * 10, 250 + Math.sin(time * 1.2) * 6, Math.sin(time * 5));
    if (theme === "dawn") distantHadeda(ctx, 300, 210 + Math.sin(time * 0.8) * 8, Math.sin(time * 5 + 1));
  }
}

function drawCloud(ctx, x, y, s, theme) {
  const L = LOOK[theme];
  ctx.fillStyle = L.cloud;
  ctx.beginPath();
  ctx.ellipse(x, y, 28 * s, 15 * s, 0, 0, TAU);
  ctx.ellipse(x + 24 * s, y + 4 * s, 20 * s, 12 * s, 0, 0, TAU);
  ctx.ellipse(x - 22 * s, y + 6 * s, 18 * s, 11 * s, 0, 0, TAU);
  ctx.fill();
  if (theme === "sunset" || theme === "dawn") {
    ctx.fillStyle = L.cloudUnder;
    ctx.beginPath();
    ctx.ellipse(x + 2 * s, y + 8 * s, 26 * s, 7 * s, 0, 0, TAU);
    ctx.fill();
  }
}

function distantHadeda(ctx, x, y, flap) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(58,42,36,0.55)";
  ctx.beginPath();
  ctx.ellipse(-2, 0, 6, 2.6, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(40,28,24,0.65)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(3, -0.4);
  ctx.quadraticCurveTo(10, -1, 13, 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-4, -1 - flap * 2, 5, 1.6, -0.6 - flap * 0.5, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function windmill(ctx, x, y, s, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = "#6A543C";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-4, -58);
  ctx.moveTo(12, 0);
  ctx.lineTo(4, -58);
  for (let i = 0; i < 4; i++) {
    const y1 = -i * 14;
    const y2 = -(i + 1) * 14;
    const x1 = 12 - i * 2;
    const x2 = 12 - (i + 1) * 2;
    ctx.moveTo(-x1, y1);
    ctx.lineTo(x2 * 0.7, y2);
    ctx.moveTo(x1, y1);
    ctx.lineTo(-x2 * 0.7, y2);
  }
  ctx.stroke();
  ctx.translate(0, -62);
  ctx.fillStyle = "#5C4632";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.rotate(time * 0.8);
  ctx.strokeStyle = "#F3EEE4";
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5);
    ctx.lineTo(Math.cos(a) * 18, Math.sin(a) * 18);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = "#E4D2B0";
  ctx.beginPath();
  ctx.moveTo(4, -2);
  ctx.lineTo(20, -5);
  ctx.lineTo(20, 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function streetGlow(ctx, x, y) {
  const g = ctx.createRadialGradient(x, y, 4, x, y + 40, 90);
  g.addColorStop(0, "rgba(255,214,140,0.35)");
  g.addColorStop(1, "rgba(255,214,140,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y + 20, 90, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "#D8D2C8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, GROUND_Y);
  ctx.lineTo(x, y);
  ctx.quadraticCurveTo(x + 8, y - 6, x + 16, y + 2);
  ctx.stroke();
  ctx.fillStyle = "#F6E2A8";
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 4, 8, 4, 0, 0, TAU);
  ctx.fill();
}

function stoepDog(ctx, x, y, theme) {
  const night = theme === "night";
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = night ? "#3A2E28" : "#8A5A32";
  ctx.beginPath();
  ctx.ellipse(0, -8, 11, 7, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, -14, 6, 5.2, 0.2, 0, TAU);
  ctx.fill();
  ctx.fillStyle = night ? "#2A221C" : "#6E4428";
  ctx.beginPath();
  ctx.ellipse(14, -16, 2.4, 3.6, 0.4, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#1A120E";
  ctx.beginPath();
  ctx.arc(13, -15, 0.7, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = night ? "#2A221C" : "#6E4428";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-10, -8);
  ctx.quadraticCurveTo(-16, -14, -12, -6);
  ctx.stroke();
  ctx.fillStyle = night ? "#2A221C" : "#6E4428";
  rounded(ctx, -4, -2, 3, 6, 1);
  ctx.fill();
  rounded(ctx, 4, -2, 3, 6, 1);
  ctx.fill();
  ctx.restore();
}

function washingLine(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = "#5C4A3C";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo((x1 + x2) / 2, y1 + 10, x2, y2);
  ctx.stroke();
  const shirt = (t, col) => {
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 8;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + 5, y);
    ctx.lineTo(x + 4, y + 12);
    ctx.lineTo(x - 4, y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 2);
    ctx.lineTo(x - 9, y + 7);
    ctx.lineTo(x - 5, y + 6);
    ctx.moveTo(x + 5, y + 2);
    ctx.lineTo(x + 9, y + 7);
    ctx.lineTo(x + 5, y + 6);
    ctx.fill();
  };
  shirt(0.35, "#F4EFE6");
  shirt(0.62, "#2C6B4A");
}

export function drawHadeda(ctx, opt = {}) {
  const wing = opt.wing ?? 0;
  const blink = opt.blink ?? 0;
  const skin = opt.skin || "classic";
  const beak = opt.beak ?? 0;
  const night = !!opt.night;
  const micro = !!opt.micro;
  const time = opt.time || 0;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (night && !micro) {
    ctx.shadowColor = "rgba(255,196,140,0.85)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "rgba(255,196,140,0.02)";
    ctx.beginPath();
    ctx.arc(8, -4, 8, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  const rim = night ? "#F0C9A0" : "#3A2E28";
  drawTail(ctx, wing, rim);
  drawWing(ctx, wing * 0.45, true, skin, rim);
  drawNeck(ctx);
  drawBody(ctx, rim);
  drawHead(ctx, blink, beak, rim);
  drawWing(ctx, wing, false, skin, rim);
  if (!micro) drawLegs(ctx, wing);
  drawHat(ctx, skin, time);
  ctx.restore();
}

function drawNeck(ctx) {
  ctx.fillStyle = "#6A5548";
  ctx.beginPath();
  ctx.moveTo(-8, 10);
  ctx.quadraticCurveTo(4, 0, 18, -8);
  ctx.quadraticCurveTo(32, -16, 46, -14);
  ctx.lineTo(40, -2);
  ctx.quadraticCurveTo(26, 8, 12, 18);
  ctx.quadraticCurveTo(0, 20, -8, 10);
  ctx.closePath();
  ctx.fill();
}

function drawBody(ctx, rim) {
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(16, -10);
    ctx.bezierCurveTo(28, -4, 26, 10, 8, 16);
    ctx.bezierCurveTo(-12, 22, -32, 14, -32, 2);
    ctx.bezierCurveTo(-33, -12, -14, -18, 2, -15);
    ctx.bezierCurveTo(10, -16, 12, -13, 16, -10);
    ctx.closePath();
  };
  body();
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.35;
  ctx.stroke();
  ctx.fillStyle = "#7A6556";
  body();
  ctx.fill();
  ctx.save();
  body();
  ctx.clip();
  ctx.fillStyle = "rgba(255, 232, 206, 0.22)";
  ctx.beginPath();
  ctx.ellipse(-2, -8, 14, 8, -0.6, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#8E7664";
  ctx.beginPath();
  ctx.moveTo(10, 2);
  ctx.bezierCurveTo(15, 8, 6, 15, -4, 15);
  ctx.bezierCurveTo(-14, 14, -16, 8, -8, 3);
  ctx.bezierCurveTo(-2, 0, 4, 0, 10, 2);
  ctx.closePath();
  ctx.fill();
}

function drawTail(ctx, wing, rim) {
  ctx.save();
  ctx.translate(-26, 1);
  ctx.rotate(-0.2 + wing * 0.12);
  const feather = (dy, len, col) => {
    ctx.beginPath();
    ctx.moveTo(6, dy);
    ctx.quadraticCurveTo(-4, dy - 5, -len, dy - 1);
    ctx.quadraticCurveTo(-6, dy + 3, 6, dy + 4);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.6;
    ctx.stroke();
  };
  feather(-5, 15, "#3E342E");
  feather(0, 20, "#4A3E36");
  feather(5, 14, "#3A302A");
  ctx.restore();
}

function drawHead(ctx, blink, beak, rim) {
  ctx.beginPath();
  ctx.ellipse(37, -21, 13.4, 12.6, -0.12, 0, TAU);
  ctx.fillStyle = "#6A5548";
  ctx.fill();
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.35;
  ctx.stroke();
  ctx.fillStyle = "#534236";
  ctx.beginPath();
  ctx.ellipse(35, -28, 9.2, 5.4, -0.18, Math.PI * 1.02, Math.PI * 1.98);
  ctx.fill();
  drawEye(ctx, 41, -22.5, blink);
  drawBill(ctx, beak);
}

function drawEye(ctx, x, y, blink) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, Math.max(0.12, 1 - blink));
  ctx.fillStyle = "#2A1A14";
  ctx.beginPath();
  ctx.ellipse(0, 0, 4.15, 3.9, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#100C0A";
  ctx.beginPath();
  ctx.arc(0.35, 0.25, 2.05, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#E4D0BA";
  ctx.beginPath();
  ctx.arc(-1.15, -1.25, 0.72, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "#3A2E28";
  ctx.lineWidth = 1.45;
  ctx.beginPath();
  ctx.moveTo(x - 4.8, y - 4.2);
  ctx.quadraticCurveTo(x - 0.2, y - 6.8, x + 5.1, y - 3.6);
  ctx.stroke();
}

function drawBill(ctx, open) {
  ctx.beginPath();
  ctx.moveTo(47, -23);
  ctx.bezierCurveTo(62, -34, 82, -28, 96, -16);
  ctx.quadraticCurveTo(88, -12, 76, -16);
  ctx.bezierCurveTo(64, -22, 54, -18, 47, -14);
  ctx.quadraticCurveTo(43, -18, 47, -23);
  ctx.closePath();
  ctx.fillStyle = "#1C1714";
  ctx.fill();
  ctx.strokeStyle = "#100C0A";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.strokeStyle = "#8E302C";
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(50, -24.4);
  ctx.quadraticCurveTo(56, -29.5, 62, -26.2);
  ctx.stroke();
  ctx.fillStyle = "#0C0908";
  ctx.beginPath();
  ctx.ellipse(55, -19.2, 1.3, 0.55, -0.45, 0, TAU);
  ctx.fill();
  if (open > 0.12) {
    ctx.save();
    ctx.translate(49, -15);
    ctx.rotate(Math.min(0.4, open) * 0.7);
    ctx.fillStyle = "#161210";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(14, 4, 30, 8);
    ctx.quadraticCurveTo(16, 9, 4, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function vane(ctx, len, wid) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.55, -wid, len, -wid * 0.15);
  ctx.quadraticCurveTo(len * 0.62, wid * 0.55, 0, wid * 0.2);
  ctx.closePath();
}

function broadFeather(ctx, len, half) {
  ctx.beginPath();
  ctx.moveTo(0, -half * 0.15);
  ctx.quadraticCurveTo(len * 0.45, -half, len, -half * 0.05);
  ctx.quadraticCurveTo(len * 0.55, half * 0.85, 0, half * 0.35);
  ctx.closePath();
}

function covertPanel(ctx) {
  ctx.beginPath();
  ctx.moveTo(18, -2);
  ctx.quadraticCurveTo(6, -18, -12, -12);
  ctx.quadraticCurveTo(-22, -2, -14, 7);
  ctx.quadraticCurveTo(-6, 3, -8, 11);
  ctx.quadraticCurveTo(2, 5, 4, 13);
  ctx.quadraticCurveTo(12, 7, 14, 12);
  ctx.quadraticCurveTo(20, 6, 18, -2);
  ctx.closePath();
}

function drawWing(ctx, lift, far, skin, rim) {
  const col = wingOf(skin);
  const up = lift > 0.35;
  const down = lift < -0.2;
  ctx.save();
  ctx.translate(-6, -1);
  ctx.rotate(up ? -1.05 : down ? 0.72 : -0.2);
  if (far) {
    ctx.translate(4, 10);
    ctx.scale(0.62, 0.52);
  }
  const spread = up ? 0.08 : down ? 0.15 : 0.07;
  const fan = up ? -0.82 : down ? 0.18 : -0.22;
  for (let i = 0; i < 7; i++) {
    ctx.save();
    ctx.translate(-2, 5);
    ctx.rotate(fan + i * spread);
    const len = 36 + (6 - i) * 1.8;
    ctx.fillStyle = far ? "#241C18" : i % 2 ? col.primaryLite : col.primary;
    broadFeather(ctx, len, down ? 4.6 : 3.8);
    ctx.fill();
    ctx.restore();
  }
  covertPanel(ctx);
  if (far) {
    ctx.fillStyle = "#1A2820";
    ctx.fill();
  } else {
    const g = ctx.createLinearGradient(-14, -14, 16, 12);
    g.addColorStop(0, col.greenLite);
    g.addColorStop(0.36, col.green);
    g.addColorStop(0.68, col.bronze);
    g.addColorStop(1, col.purple);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.save();
    covertPanel(ctx);
    ctx.clip();
    ctx.strokeStyle = "rgba(36, 20, 14, 0.38)";
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(-14, -4);
    ctx.quadraticCurveTo(0, 0, 16, 4);
    ctx.moveTo(-12, 2);
    ctx.quadraticCurveTo(2, 6, 14, 10);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 246, 230, 0.3)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.quadraticCurveTo(2, -5, 12, -1);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = rim;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1.1;
    covertPanel(ctx);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawLegs(ctx, lift) {
  const tuck = lift * 2;
  ctx.strokeStyle = "#3A2C2A";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  leg(ctx, -6, 14, -16, 22 + tuck, -24, 28 + tuck);
  leg(ctx, 2, 14, -6, 24 + tuck, -12, 30 + tuck);
}

function leg(ctx, x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(x2, y2, x3, y3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x3, y3);
  ctx.lineTo(x3 - 5, y3 + 1);
  ctx.moveTo(x3, y3);
  ctx.lineTo(x3 - 1, y3 + 4);
  ctx.moveTo(x3, y3);
  ctx.lineTo(x3 + 3, y3 + 1.5);
  ctx.stroke();
}

function drawHat(ctx, skin, time) {
  if (skin === "scarf") drawScarf(ctx, time);
  else if (skin === "protea") drawProtea(ctx, 34, -38, 1);
  else if (skin === "beanie") drawBeanie(ctx);
  else if (skin === "straw") drawStrawHat(ctx);
}

function drawScarf(ctx, time) {
  const wave = Math.sin(time * 5) * 2;
  ctx.save();
  ctx.translate(16, -8);
  ctx.rotate(-0.55);
  ctx.fillStyle = "#1B6B45";
  rounded(ctx, -14, -5, 26, 10, 5);
  ctx.fill();
  ctx.fillStyle = "#F6F1E6";
  rounded(ctx, -12, -1.3, 22, 2.6, 1);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#145C38";
  ctx.beginPath();
  ctx.moveTo(10, -4);
  ctx.quadraticCurveTo(0, 4 + wave, -8, 14 + wave);
  ctx.lineTo(-3, 15 + wave);
  ctx.quadraticCurveTo(4, 6, 12, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#F6F1E6";
  ctx.fillRect(-4, 8 + wave, 5, 1.8);
}

function drawProtea(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU - Math.PI / 2;
    ctx.fillStyle = i % 2 ? "#D84E72" : "#F2A0B4";
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 3.2, Math.sin(a) * 3.2, 2.4, 7.2, a + Math.PI / 2, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#F7F3EA";
  ctx.beginPath();
  ctx.arc(0, 1, 3.4, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#E6C15A";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 1.4, 1 + Math.sin(a) * 1.4, 0.7, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawBeanie(ctx) {
  ctx.fillStyle = "#243044";
  ctx.beginPath();
  ctx.moveTo(26, -28);
  ctx.quadraticCurveTo(24, -48, 38, -48);
  ctx.quadraticCurveTo(52, -46, 48, -26);
  ctx.quadraticCurveTo(36, -30, 26, -28);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(30 + i * 4.5, -30);
    ctx.quadraticCurveTo(32 + i * 4.5, -42, 34 + i * 3.5, -46);
    ctx.stroke();
  }
  ctx.fillStyle = "#1A2436";
  rounded(ctx, 26, -30, 22, 5, 2);
  ctx.fill();
  ctx.fillStyle = "#F4F0E4";
  ctx.beginPath();
  ctx.arc(38, -48, 3.6, 0, TAU);
  ctx.fill();
}

function drawStrawHat(ctx) {
  ctx.fillStyle = "#E7C78A";
  ctx.beginPath();
  ctx.ellipse(36, -36, 18, 4.8, -0.08, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#F3D7A4";
  ctx.beginPath();
  ctx.moveTo(26, -36);
  ctx.quadraticCurveTo(28, -52, 38, -52);
  ctx.quadraticCurveTo(48, -50, 46, -36);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2C6B4A";
  rounded(ctx, 28, -38, 16, 3.2, 1);
  ctx.fill();
}
export function drawGate(ctx, obs, time, groundY, theme) {
  const spec = GATE[obs.kind];
  const x = obs.x;
  const w = spec.w;
  const topH = obs.gapTop;
  const botY = obs.gapBot;
  const botH = groundY - botY + 30;
  if (topH > 10) drawHalf(ctx, obs.kind, x, 0, w, topH, "top", obs.variant, time, theme);
  if (botH > 10) drawHalf(ctx, obs.kind, x, botY, w, botH, "bottom", obs.variant, time, theme);
  if (botH > 10) {
    ctx.fillStyle = "rgba(40,24,16,0.13)";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5, groundY + 1, w * 0.36, 5.5, 0, 0, TAU);
    ctx.fill();
  }
}

function drawHalf(ctx, kind, x, y, w, h, side, variant, time, theme) {
  if (kind === "iron") drawIron(ctx, x, y, w, h, side, variant, theme);
  else if (kind === "jacaranda") drawJacarandaGate(ctx, x, y, w, h, side, variant, time, theme);
  else if (kind === "pole") drawPole(ctx, x, y, w, h, side, variant, time, theme);
  else if (kind === "palisade") drawPalisade(ctx, x, y, w, h, side);
  else drawTower(ctx, x, y, w, h, side, theme);
}

function drawIron(ctx, x, y, w, h, side, variant, theme) {
  const palettes = [
    { base: "#C24B3E", hi: "#E07A68", sh: "#8E342C", ridge: "#F0B2A4" },
    { base: "#3E6E4A", hi: "#6FA56E", sh: "#2A4C34", ridge: "#C6E2C4" },
    { base: "#B7BCC4", hi: "#EEF1F4", sh: "#8E949C", ridge: "#FFFFFF" },
  ];
  const pal = palettes[variant % 3];
  // brick pier
  const pierW = 18;
  ctx.save();
  rounded(ctx, x, y, pierW, h, 2);
  ctx.clip();
  ctx.fillStyle = theme === "night" ? "#6A4038" : "#C47862";
  ctx.fillRect(x, y, pierW, h);
  ctx.strokeStyle = "rgba(255,236,220,0.45)";
  ctx.lineWidth = 1;
  for (let row = 0; row < h; row += 8) {
    const off = Math.floor(row / 8) % 2 ? 8 : 0;
    ctx.beginPath();
    ctx.moveTo(x, y + row);
    ctx.lineTo(x + pierW, y + row);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + off, y + row);
    ctx.lineTo(x + off, y + row + 8);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = theme === "night" ? "#4A2824" : "#A85A48";
  const capY = side === "top" ? y + h - 8 : y;
  rounded(ctx, x - 2, capY, pierW + 4, 8, 2);
  ctx.fill();

  const sx = x + pierW + 2;
  const sw = w - pierW - 2;
  ctx.save();
  rounded(ctx, sx, y, sw, h, 4);
  ctx.clip();
  ctx.fillStyle = pal.base;
  ctx.fillRect(sx, y, sw, h);
  const pitch = 8;
  for (let i = 0; i < sw / pitch + 1; i++) {
    const cx = sx + i * pitch;
    const g = ctx.createLinearGradient(cx, y, cx + pitch, y);
    g.addColorStop(0, pal.sh);
    g.addColorStop(0.35, pal.hi);
    g.addColorStop(0.55, pal.base);
    g.addColorStop(1, pal.sh);
    ctx.fillStyle = g;
    ctx.fillRect(cx, y, pitch + 0.5, h);
  }
  // rust
  ctx.fillStyle = "rgba(120,52,28,0.35)";
  ctx.beginPath();
  ctx.ellipse(sx + sw * 0.62, y + h * 0.4, 10, 7, 0.4, 0, TAU);
  ctx.fill();
  ctx.restore();
  // rivets
  ctx.fillStyle = "#E8D7B8";
  const edge = side === "top" ? y + h : y;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(sx + 8 + i * ((sw - 16) / 3), edge + (side === "top" ? -8 : 8), 1.6, 0, TAU);
    ctx.fill();
  }
  // timber lip facing the gap
  ctx.fillStyle = "#8A5A3C";
  const lipY = side === "top" ? y + h - 8 : y;
  rounded(ctx, sx - 2, lipY, sw + 4, 8, 3);
  ctx.fill();
  ctx.fillStyle = "#C4926A";
  rounded(ctx, sx, lipY + 2, sw, 2.5, 1);
  ctx.fill();

  if (variant % 3 === 1 && side === "top" && h > 40) {
    // tea towel on the face of the sheet, barely into the gap
    const ty = y + h - 2;
    ctx.strokeStyle = "#6B5344";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sx + 16, ty - 10);
    ctx.quadraticCurveTo(sx + 28, ty + 4, sx + 44, ty - 6);
    ctx.stroke();
    ctx.fillStyle = "#F4EFE6";
    rounded(ctx, sx + 30, ty - 2, 14, 16, 2);
    ctx.fill();
    ctx.fillStyle = "#E25B4A";
    ctx.fillRect(sx + 30, ty + 4, 14, 3);
    ctx.fillStyle = "#2C6B4A";
    ctx.fillRect(sx + 30, ty + 9, 14, 3);
  }
}

function drawJacarandaGate(ctx, x, y, w, h, side, variant, time, theme) {
  const night = theme === "night";
  const trunkC = night ? "#2A201C" : "#5C4032";
  const bark = night ? "#1A1412" : "#3E2C22";
  const cols = night
    ? ["#3A3050", "#4A4068", "#2A2038", "#241C34"]
    : ["#7A3E96", "#A56BC4", "#D7B6EA", "#5C2E78"];
  const lean = variant % 2 === 0 ? -8 : 8;
  const cx = x + w * 0.5;
  if (side === "bottom") {
    trunk(ctx, cx + lean * 0.3, y + 18, 26, 38, h - 18, trunkC);
    woodLimb(ctx, cx - 6, y + h - 16, 8, x + 6, y + h, 5, bark);
    woodLimb(ctx, cx + 8, y + h - 12, 7, x + w - 8, y + h, 4, bark);
    blossomCluster(ctx, cx + lean, y + 8, 34, cols);
    petalFlower(ctx, cx - 22, y + 4, 3.2, cols);
    petalFlower(ctx, cx + 24, y - 2, 2.8, cols);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = cols[i % 3];
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.ellipse(x + 14 + i * 15, y + h - 16, 3, 1.6, i * 0.6, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  } else {
    const edge = y + h;
    woodLimb(ctx, cx, y - 8, 16, cx + lean, edge - 36, 11, trunkC);
    woodLimb(ctx, cx + lean * 0.4, edge - 48, 10, cx - 26, edge - 8, 6, bark);
    woodLimb(ctx, cx + lean * 0.3, edge - 44, 9, cx + 28, edge - 12, 6, bark);
    blossomCluster(ctx, cx + lean * 0.4, edge - 22, 48, cols);
    blossomCluster(ctx, cx - 30, edge - 6, 30, cols);
    blossomCluster(ctx, cx + 32, edge - 10, 28, cols);
    petalFlower(ctx, cx - 46, edge - 18, 3.6, cols);
    petalFlower(ctx, cx + 48, edge - 24, 3.2, cols);
    petalFlower(ctx, cx + 4, edge - 48, 3, cols);
    for (let i = 0; i < 3; i++) {
      const px = cx + Math.sin(time * 1.3 + i) * 14 + (i - 1) * 18;
      const py = edge + 10 + Math.sin(time * 2 + i) * 5;
      ctx.fillStyle = cols[2];
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.ellipse(px, py, 2.4, 1.4, time + i, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

function drawPole(ctx, x, y, w, h, side, variant, time, theme) {
  const cx = x + w * 0.48;
  const night = theme === "night" || theme === "dawn";
  const concrete = theme === "night" ? "#4A515A" : "#E4E7EC";
  const concreteDk = theme === "night" ? "#2E343C" : "#B4BAC4";
  const wood = theme === "night" ? "#3A3028" : "#6A4E38";
  if (side === "bottom") {
    ctx.fillStyle = concrete;
    ctx.beginPath();
    ctx.moveTo(cx - 8, y + 18);
    ctx.lineTo(cx + 8, y + 18);
    ctx.lineTo(cx + 12, y + h - 8);
    ctx.lineTo(cx - 12, y + h - 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(cx - 6, y + 20, 3, h - 36);
    ctx.fillStyle = concreteDk;
    rounded(ctx, cx - 18, y + h - 14, 40, 14, 3);
    ctx.fill();
    ctx.fillStyle = wood;
    rounded(ctx, cx - 34, y + 6, 68, 8, 2);
    ctx.fill();
    ctx.fillStyle = "#8A6848";
    rounded(ctx, cx - 34, y + 6, 68, 2.5, 1);
    ctx.fill();
    for (let i = -1; i <= 1; i++) {
      const ix = cx + i * 18;
      ctx.fillStyle = "#F7F4EE";
      ctx.beginPath();
      ctx.moveTo(ix - 4, y + 14);
      ctx.quadraticCurveTo(ix, y + 22, ix + 4, y + 14);
      ctx.lineTo(ix + 3, y + 26);
      ctx.quadraticCurveTo(ix, y + 30, ix - 3, y + 26);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#C8BBA8";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.strokeStyle = "#2A2724";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(cx - 18, y + 24);
    ctx.quadraticCurveTo(cx - 8, y + 46, cx + 6, y + 34);
    ctx.quadraticCurveTo(cx + 16, y + 26, cx + 18, y + 22);
    ctx.moveTo(cx, y + 26);
    ctx.quadraticCurveTo(cx + 10, y + 40, cx + 4, y + 48);
    ctx.stroke();
    const lx = cx - 26;
    ctx.strokeStyle = concreteDk;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, y + 10);
    ctx.quadraticCurveTo(lx, y - 2, lx, y + 8);
    ctx.stroke();
    ctx.fillStyle = night ? "#F6E2A8" : "#F4F1EA";
    rounded(ctx, lx - 10, y + 6, 16, 7, 3);
    ctx.fill();
    if (night) {
      const glow = ctx.createRadialGradient(lx, y + 16, 2, lx, y + 28, 36);
      glow.addColorStop(0, "rgba(246,210,140,0.45)");
      glow.addColorStop(1, "rgba(246,210,140,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx, y + 24, 36, 0, TAU);
      ctx.fill();
    }
    const rx = cx + 22;
    ctx.fillStyle = concrete;
    rounded(ctx, rx, y + 36, 5, Math.max(20, h - 56), 2);
    ctx.fill();
    ctx.fillStyle = "#2C3136";
    rounded(ctx, rx - 5, y + 42, 16, 36, 4);
    ctx.fill();
    ctx.fillStyle = "#3A4046";
    rounded(ctx, rx - 3, y + 44, 4, 32, 2);
    ctx.fill();
    const lamps = ["#E25B4A", "#E6C14A", "#3EAA72"];
    for (let i = 0; i < 3; i++) {
      const on = night ? i === 0 : i === 2;
      ctx.fillStyle = on ? lamps[i] : "#3A3E44";
      ctx.beginPath();
      ctx.arc(rx + 3, y + 50 + i * 10, 3.2, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = wood;
    rounded(ctx, cx - 8, y + h * 0.55, 18, 14, 2);
    ctx.fill();
    ctx.strokeStyle = "#E8D7B0";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 5, y + h * 0.55 + 3, 12, 8);
  } else {
    ctx.fillStyle = concrete;
    ctx.beginPath();
    ctx.moveTo(cx - 6, y);
    ctx.lineTo(cx + 6, y);
    ctx.lineTo(cx + 5, y + h - 46);
    ctx.lineTo(cx - 5, y + h - 46);
    ctx.closePath();
    ctx.fill();
    const drumY = y + h - 44;
    ctx.fillStyle = "#5C5348";
    rounded(ctx, cx - 22, drumY, 44, 28, 8);
    ctx.fill();
    ctx.fillStyle = "#7A6E60";
    for (let i = 0; i < 3; i++) ctx.fillRect(cx - 22, drumY + 6 + i * 7, 44, 2.5);
    ctx.fillStyle = "#3E3832";
    ctx.beginPath();
    ctx.ellipse(cx, drumY + 28, 20, 6, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#E7E2DA";
    ctx.beginPath();
    ctx.arc(cx + 10, drumY + 10, 2, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#241E1C";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - 16, drumY + 12);
    ctx.quadraticCurveTo(cx - 30, drumY + 4, cx - 18, drumY - 8);
    ctx.quadraticCurveTo(cx - 8, drumY + 2, cx - 4, drumY + 14);
    ctx.moveTo(cx + 12, drumY + 16);
    ctx.quadraticCurveTo(cx + 28, drumY + 8, cx + 16, y + h + 4);
    ctx.stroke();
  }
  void variant;
  void time;
}
function drawPalisade(ctx, x, y, w, h, side) {
  const down = side === "top";
  const count = 7;
  const paleW = 8;
  const gap = (w - 8 - count * paleW) / (count - 1);
  const tip = 18;
  ctx.fillStyle = "#163C28";
  const railA = down ? y + h - tip - 16 : y + tip + 10;
  const railB = down ? y + h - tip - 30 : y + tip + 24;
  if (railA > y && railA < y + h) {
    rounded(ctx, x + 2, railA, w - 4, 5, 2);
    ctx.fill();
  }
  if (railB > y && railB < y + h) {
    rounded(ctx, x + 2, railB, w - 4, 5, 2);
    ctx.fill();
  }
  for (let i = 0; i < count; i++) {
    const px = x + 4 + i * (paleW + gap);
    ctx.fillStyle = i % 2 ? "#1E4E34" : "#246844";
    ctx.beginPath();
    if (down) {
      ctx.moveTo(px, y);
      ctx.lineTo(px + paleW, y);
      ctx.lineTo(px + paleW, y + h - tip);
      ctx.lineTo(px + paleW / 2, y + h);
      ctx.lineTo(px, y + h - tip);
    } else {
      ctx.moveTo(px + paleW / 2, y);
      ctx.lineTo(px + paleW, y + tip);
      ctx.lineTo(px + paleW, y + h);
      ctx.lineTo(px, y + h);
      ctx.lineTo(px, y + tip);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(px + 1, down ? y + 2 : y + tip, 2, Math.max(0, h - tip - 6));
    // brass spear
    ctx.fillStyle = "#E1C56A";
    ctx.beginPath();
    if (down) {
      ctx.moveTo(px + 1.5, y + h - tip);
      ctx.lineTo(px + paleW - 1.5, y + h - tip);
      ctx.lineTo(px + paleW / 2, y + h - 2);
    } else {
      ctx.moveTo(px + 1.5, y + tip);
      ctx.lineTo(px + paleW - 1.5, y + tip);
      ctx.lineTo(px + paleW / 2, y + 2);
    }
    ctx.closePath();
    ctx.fill();
  }
  if (!down) {
    ctx.fillStyle = "#E4DDD4";
    rounded(ctx, x, y + h - 12, w, 12, 2);
    ctx.fill();
    ctx.fillStyle = "#CFC6BC";
    ctx.fillRect(x, y + h - 12, w, 3);
  }
}

function drawTower(ctx, x, y, w, h, side, theme) {
  const night = theme === "night";
  const concrete = night ? "#3E4650" : "#E4E0D8";
  const concreteDk = night ? "#2C343C" : "#C8C2B8";
  const cx = x + w * 0.5;
  if (side === "bottom") {
    const leg = (lx) => {
      ctx.fillStyle = concrete;
      ctx.beginPath();
      ctx.moveTo(lx - 5, y + 24);
      ctx.lineTo(lx + 5, y + 24);
      ctx.lineTo(lx + 8, y + h);
      ctx.lineTo(lx - 8, y + h);
      ctx.closePath();
      ctx.fill();
    };
    leg(cx - 22);
    leg(cx + 22);
    ctx.strokeStyle = concreteDk;
    ctx.lineWidth = 3;
    const rows = Math.max(1, Math.floor((h - 30) / 36));
    for (let i = 0; i < rows; i++) {
      const y1 = y + 30 + i * 36;
      const y2 = Math.min(y + h - 8, y1 + 36);
      ctx.beginPath();
      ctx.moveTo(cx - 22, y1);
      ctx.lineTo(cx + 22, y2);
      ctx.moveTo(cx + 22, y1);
      ctx.lineTo(cx - 22, y2);
      ctx.stroke();
    }
    // ladder
    ctx.strokeStyle = night ? "#9AA2AA" : "#8E949C";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 4, y + 20);
    ctx.lineTo(cx - 4, y + h - 8);
    ctx.moveTo(cx + 4, y + 20);
    ctx.lineTo(cx + 4, y + h - 8);
    ctx.stroke();
    for (let yy = y + 28; yy < y + h - 10; yy += 10) {
      ctx.beginPath();
      ctx.moveTo(cx - 4, yy);
      ctx.lineTo(cx + 4, yy);
      ctx.stroke();
    }
    ctx.fillStyle = concreteDk;
    rounded(ctx, x + 10, y + h - 10, w - 20, 10, 2);
    ctx.fill();
  } else {
    const drumH = Math.min(78, h);
    const drumY = y + h - drumH;
    // neck
    ctx.fillStyle = concreteDk;
    rounded(ctx, cx - 8, y, 16, Math.max(8, drumY - y), 3);
    ctx.fill();
    // drum
    ctx.fillStyle = concrete;
    rounded(ctx, x + 6, drumY, w - 12, drumH - 10, 16);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    rounded(ctx, x + 12, drumY + 6, 8, drumH - 24, 4);
    ctx.fill();
    // green municipal band, no lettering
    ctx.fillStyle = night ? "#1E4A38" : "#2C6B4A";
    ctx.fillRect(x + 6, drumY + drumH * 0.42, w - 12, 8);
    ctx.fillStyle = "#F4EFE6";
    ctx.fillRect(x + 6, drumY + drumH * 0.42 + 8, w - 12, 3);
    // lip
    ctx.fillStyle = concreteDk;
    ctx.beginPath();
    ctx.ellipse(cx, y + h - 8, (w - 12) / 2, 8, 0, 0, TAU);
    ctx.fill();
    // hatch
    ctx.fillStyle = "#8A847C";
    ctx.beginPath();
    ctx.ellipse(cx + 16, drumY + 16, 6, 3, 0.2, 0, TAU);
    ctx.fill();
  }
}

export function drawKoeksister(ctx, x, y, time, scale) {
  const s = scale || 1;
  const bob = Math.sin(time * 3) * 3;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(Math.sin(time * 1.4) * 0.18);
  ctx.scale(s, s);
  ctx.fillStyle = "rgba(80,40,20,0.13)";
  ctx.beginPath();
  ctx.ellipse(0, 10, 10, 3, 0, 0, TAU);
  ctx.fill();
  const strands = ["#A86528", "#E0A04A", "#C47A32"];
  ctx.lineCap = "round";
  for (let k = 0; k < 3; k++) {
    ctx.strokeStyle = strands[k];
    ctx.lineWidth = 4.2 - k * 0.4;
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const px = -13 + i * 2.6;
      const py = Math.sin(i * 0.85 + k * 2.1) * 4.2;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,236,190,0.85)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-8, -3);
  ctx.quadraticCurveTo(0, -7, 9, -2);
  ctx.stroke();
  // sparkle
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const sp = 0.5 + 0.5 * Math.sin(time * 6);
  ctx.globalAlpha = sp;
  ctx.beginPath();
  ctx.arc(6, -6, 1.3, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function drawFeather(ctx, x, y, rot, len, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(len, 0);
  ctx.quadraticCurveTo(0, len * 0.38, -len * 0.15, 0);
  ctx.quadraticCurveTo(0, -len * 0.38, len, 0);
  ctx.fill();
  ctx.strokeStyle = "rgba(40,28,20,0.35)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(-len * 0.05, 0);
  ctx.lineTo(len * 0.75, 0);
  ctx.stroke();
  ctx.restore();
}

const MEDAL = {
  bronze: ["#E0A36A", "#A86B32", "#F3D2A4"],
  silver: ["#F4F6FA", "#9AA3B2", "#FFFFFF"],
  gold: ["#FFE08A", "#D09A22", "#FFF6D0"],
  iris: ["#7DCEA0", "#C9843A", "#D7B6EA"],
};

export function drawMedal(ctx, tier) {
  ctx.clearRect(0, 0, 96, 96);
  if (!tier) {
    ctx.strokeStyle = "#E4D5C8";
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(48, 52, 26, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#B7A89C";
    ctx.font = "800 12px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("10", 48, 56);
    return;
  }
  const [a, b, c] = MEDAL[tier] || MEDAL.bronze;
  ctx.fillStyle = tier === "iris" ? "#2C6B4A" : "#C4544A";
  rounded(ctx, 28, 10, 16, 42, 4);
  ctx.fill();
  rounded(ctx, 52, 10, 16, 42, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  rounded(ctx, 30, 14, 4, 28, 2);
  ctx.fill();
  ctx.fillStyle = b;
  ctx.beginPath();
  ctx.arc(48, 56, 28, 0, TAU);
  ctx.fill();
  const g = ctx.createLinearGradient(26, 34, 72, 82);
  g.addColorStop(0, c);
  g.addColorStop(0.45, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(48, 56, 22, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(48, 56, 22, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  if (tier === "iris") {
    ctx.strokeStyle = "#1F7A49";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(48, 56, 16, 0.4, 2.2);
    ctx.stroke();
    ctx.strokeStyle = "#C9843A";
    ctx.beginPath();
    ctx.arc(48, 56, 12, 2.4, 4.2);
    ctx.stroke();
  }
  const feather = tier === "silver" ? "#4E5964" : "#FFF8F1";
  ctx.save();
  ctx.translate(48, 58);
  ctx.rotate(-0.5);
  ctx.fillStyle = feather;
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.quadraticCurveTo(2, 7, -8, 0);
  ctx.quadraticCurveTo(2, -7, 16, 0);
  ctx.fill();
  ctx.strokeStyle = tier === "silver" ? "#2C3440" : "rgba(90,60,30,0.45)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(13, 0);
  ctx.stroke();
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-2 + i * 4, 0);
    ctx.lineTo(i * 4, -4.5);
    ctx.moveTo(-2 + i * 4, 0);
    ctx.lineTo(i * 4, 4.5);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawAppIcon(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, "#3E5F86");
  g.addColorStop(0.45, "#E38B86");
  g.addColorStop(1, "#F6C29A");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size * 0.4, size * 0.56);
  ctx.scale(size / 230, size / 230);
  drawHadeda(ctx, { wing: 0.75, skin: "classic", beak: 0.15 });
  ctx.restore();
}
