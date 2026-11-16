import {
  GROUND_Y,
  GATE,
  clearThemeCaches,
  ensureTheme,
  paintWorld,
  drawHadeda,
  drawGate,
  drawKoeksister,
  drawFeather,
  drawMedal,
  drawAppIcon,
} from "./art.js";
import { createAudio } from "./audio.js";
import { beginRewarded, completeRewarded } from "./ads.js";

const W = 390;
const H = 844;
const BIRD_X = 118;
const GRAVITY = 1450;
const FLAP_V = -432;
const BIRD_R = 14;
const KEY = "hadeda_flap_v1";

const SKINS = [
  { id: "classic", name: "Plain feathers", cost: 0, line: "The classic dawn chorus." },
  { id: "scarf", name: "Green scarf", cost: 25, line: "Warm wool for cold dawns." },
  { id: "protea", name: "Protea crown", cost: 45, line: "A little flower from the veld." },
  { id: "beanie", name: "Night watch", cost: 60, line: "For the late flight home." },
  { id: "bronze", name: "Bronze sheen", cost: 40, line: "When the sun catches the wing." },
  { id: "straw", name: "Straw brim", cost: 80, line: "A long weekend on the stoep." },
];

const UPGRADES = [
  {
    id: "shield",
    name: "Stoep shield",
    line: "Brush one obstacle. It pops, you carry on.",
    max: 3,
    costs: [12, 12, 12],
  },
  {
    id: "gap",
    name: "Wider stoep",
    line: "The first ten gaps open a little more.",
    max: 3,
    costs: [20, 40, 70],
  },
  {
    id: "sweet",
    name: "Sweet tooth",
    line: "Koeksisters show up more often.",
    max: 2,
    costs: [30, 60],
  },
];

const THEME_NAME = {
  dawn: "Dawn chorus",
  day: "High sun",
  sunset: "Veld gold",
  night: "Stoep lights",
};

const FEATHERS = ["#7A6556", "#C4B09A", "#1F7A49", "#A56B32", "#EFE6DA", "#3EAA72"];

const params = new URLSearchParams(location.search);
const sheet = params.get("sheet");
const scene = params.get("scene");
const bot = params.has("bot");
const freezeSave = !!(scene || sheet || params.has("icon"));
const systemReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const audio = createAudio();
const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");
const stage = document.getElementById("stage");
const scoreEl = document.getElementById("score");
const captionEl = document.getElementById("score-caption");
const coinEl = document.getElementById("coin-count");
const coinPill = document.getElementById("coin-pill");
const bestEl = document.getElementById("best-score");
const bestMedalEl = document.getElementById("best-medal");
const titleEl = document.getElementById("screen-title");
const overEl = document.getElementById("screen-over");
const shopEl = document.getElementById("screen-shop");
const adEl = document.getElementById("screen-ad");
const muteBtn = document.getElementById("btn-mute");
const toastEl = document.getElementById("toast");
const medalCanvas = document.getElementById("medal");
const medalCtx = medalCanvas.getContext("2d");

let backing = 1;
let mode = "title";
let time = 0;
let camera = 0;
let theme = "dawn";
let nextTheme = null;
let fade = 0;
let score = 0;
let best = 0;
let coins = 0;
let runCoins = 0;
let skin = "classic";
let owned = ["classic"];
let preview = "classic";
let gapLevel = 0;
let sweetLevel = 0;
let shields = 0;
let muted = false;
let sfxOn = true;
let musicOn = true;
let hapticsOn = true;
let motionOff = systemReduce;
let hintSeen = false;
let hintFlaps = 0;
let doubled = false;
let countLeft = 0;
let lowQ = false;
let adSession = null;
let adKind = "continue";
let exitFrom = "title";
let shield = false;
let invuln = 0;
let continued = false;
let newBest = false;
let spawned = 0;
let lastCenter = 390;
let rng = null;
let bird = makeBird();
let obstacles = [];
let particles = [];
let rings = [];
let flyers = [];
let floaters = [];
let wingT = 0;
let wing = 0;
let blink = 0;
let blinkT = 1.6;
let blinking = 0;
let beak = 0;
let callAnim = 0;
let callEvery = 7;
let titleCalled = false;
let shake = 0;
let flash = 0;
let caption = "";
let captionT = 0;
let toastT = 0;
let deadT = 0;
let queueRestart = false;
let intro = 0;
let adT = 0;
let shopFrom = "title";
let botCd = 0;
let last = performance.now();
let fpsEma = 60;
let saveTimer = 0;

function makeBird() {
  return { x: 200, y: 430, vx: 0, vy: 0, rot: -0.2, sx: 1, sy: 1 };
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rand() {
  return rng ? rng() : Math.random();
}

function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object") return;
    best = Number.isFinite(d.best) ? d.best : 0;
    coins = Number.isFinite(d.coins) ? d.coins : 0;
    if (Array.isArray(d.owned) && d.owned.includes("classic")) owned = d.owned.slice();
    if (typeof d.skin === "string" && owned.includes(d.skin)) skin = d.skin;
    preview = skin;
    gapLevel = clamp(d.gap | 0, 0, 3);
    sweetLevel = clamp(d.sweet | 0, 0, 2);
    shields = clamp(d.shields | 0, 0, 3);
    if (typeof d.sfx === "boolean" || typeof d.music === "boolean") {
      sfxOn = d.sfx !== false;
      musicOn = d.music !== false;
    } else if (d.mute) {
      sfxOn = false;
      musicOn = false;
    }
    muted = !sfxOn && !musicOn;
    hapticsOn = d.haptics !== false;
    if (typeof d.reduce === "boolean") motionOff = d.reduce;
    hintSeen = !!d.hint;
  } catch (err) {
    /* private mode or bad JSON — start fresh */
  }
}

function save() {
  if (freezeSave) return;
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        best,
        coins,
        owned,
        skin,
        gap: gapLevel,
        sweet: sweetLevel,
        shields,
        mute: !sfxOn && !musicOn,
        sfx: sfxOn,
        music: musicOn,
        haptics: hapticsOn,
        reduce: motionOff,
        hint: hintSeen,
        v: 2,
      })
    );
  } catch (err) {
    /* ignore quota / private mode */
  }
}

function themeFor(n) {
  if (n >= 40) return "night";
  if (n >= 20) return "sunset";
  if (n >= 10) return "day";
  return "dawn";
}

function medalTier(n) {
  if (n >= 80) return "iris";
  if (n >= 40) return "gold";
  if (n >= 20) return "silver";
  if (n >= 10) return "bronze";
  return null;
}

function medalName(n) {
  return { iris: "Iridescent", gold: "Gold", silver: "Silver", bronze: "Bronze" }[medalTier(n)] || "—";
}

function difficulty(n) {
  let gap;
  let speed;
  let spacing;
  if (n < 5) {
    gap = 292;
    speed = 136;
    spacing = 308;
  } else {
    const t = clamp((n - 5) / 30, 0, 1);
    const e = t * t * (3 - 2 * t);
    gap = 270 + (186 - 270) * e;
    speed = 148 + (226 - 148) * e;
    spacing = 296 + (240 - 296) * e;
  }
  if (n < 10) gap += gapLevel * 22;
  gap = Math.min(gap, GROUND_Y - 168);
  return { gap, speed, spacing };
}

function kindFor(i) {
  const sets = [
    ["iron", "palisade", "jacaranda", "iron"],
    ["jacaranda", "pole", "tower", "palisade"],
    ["tower", "iron", "pole", "jacaranda"],
    ["pole", "palisade", "tower", "iron"],
  ];
  const set = sets[Math.floor(i / 4) % sets.length];
  return set[i % 4];
}

function spawn(x) {
  const d = difficulty(score);
  const gap = d.gap;
  const half = gap / 2;
  let center = spawned < 2 ? 392 : lastCenter + (rand() * 2 - 1) * 118;
  center = clamp(center, 76 + half, GROUND_Y - 76 - half);
  lastCenter = center;
  const kind = kindFor(spawned);
  const chance = 0.55 + sweetLevel * 0.18;
  const hasCoin = spawned === 0 || rand() < chance;
  obstacles.push({
    kind,
    variant: spawned % 3,
    x,
    gapTop: center - half,
    gapBot: center + half,
    scored: false,
    coin: hasCoin ? { y: center + (rand() * 26 - 13), taken: false } : null,
  });
  spawned += 1;
}

function maybeSpawn() {
  const spacing = difficulty(score).spacing;
  const lastObs = obstacles[obstacles.length - 1];
  if (!lastObs) {
    spawn(336);
    return;
  }
  if (lastObs.x + spacing < W + 30) spawn(lastObs.x + spacing);
}

function resetRun() {
  score = 0;
  runCoins = 0;
  continued = false;
  newBest = false;
  spawned = 0;
  lastCenter = 392;
  obstacles = [];
  particles = [];
  rings = [];
  flyers = [];
  floaters = [];
  bird = makeBird();
  bird.x = BIRD_X;
  bird.y = 400;
  shield = false;
  invuln = 0;
  deadT = 0;
  queueRestart = false;
  theme = "dawn";
  nextTheme = null;
  fade = 0;
  camera = 80;
  shake = 0;
  flash = 0;
  wingT = 0;
  caption = "";
  captionT = 0;
  doubled = false;
  hintFlaps = 0;
  if (shields > 0) {
    shields -= 1;
    shield = true;
    save();
  }
  spawn(336);
}

function puff(n, power) {
  if (motionOff || lowQ) n = Math.min(n, lowQ ? 2 : 4);
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const sp = power * (0.35 + rand());
    particles.push({
      x: bird.x - 6,
      y: bird.y + 2,
      vx: Math.cos(a) * sp - 30,
      vy: Math.sin(a) * sp - 10,
      rot: rand() * 6,
      vr: (rand() - 0.5) * 7,
      life: 0.55 + rand() * 0.35,
      max: 0.9,
      color: FEATHERS[i % FEATHERS.length],
      len: 6 + rand() * 7,
    });
  }
  const cap = lowQ ? 22 : 46;
  if (particles.length > cap) particles.splice(0, particles.length - cap);
}

function flap() {
  if (mode !== "play") return;
  bird.vy = FLAP_V;
  bird.sx = 1.16;
  bird.sy = 0.8;
  wingT = 0.22;
  audio.flap();
  puff(3, 70);
  buzz(10);
  hintFlaps += 1;
  if (!hintSeen && hintFlaps >= 2) {
    hintSeen = true;
    save();
  }
}

function die() {
  if (mode !== "play") return;
  if (invuln > 0) return;
  if (shield) {
    shield = false;
    invuln = 1.15;
    shake = motionOff ? 0 : 1;
    flash = 0.25;
    buzz(18);
    audio.hit();
    puff(10, 160);
    floaters.push({ text: "Saved", x: bird.x, y: bird.y - 28, vy: -36, life: 0.8, color: "#E7F6EC" });
    return;
  }
  mode = "dead";
  deadT = 0;
  shake = motionOff ? 0 : 1;
  flash = 0.5;
  audio.hit();
  audio.squawk();
  puff(16, 220);
  buzz(36);
  floaters.push({ text: "HAA!", x: bird.x + 10, y: bird.y - 36, vy: -28, life: 0.9, color: "#FFF8F1" });
}

function showOver() {
  if (score > best) {
    best = score;
    newBest = true;
  } else newBest = false;
  save();
  mode = "over";
  fillOver();
  syncUI();
}

function fillOver() {
  const title = document.getElementById("over-title");
  const kicker = document.getElementById("over-kicker");
  if (newBest) {
    kicker.textContent = "New best";
    title.textContent = "Lekker.";
  } else if (score >= 40) {
    kicker.textContent = "What a flight";
    title.textContent = "Lekker.";
  } else if (score >= 10) {
    kicker.textContent = "Nice flight";
    title.textContent = "The suburb clapped.";
  } else {
    kicker.textContent = "Down you go";
    title.textContent = "Ag, shame.";
  }
  document.getElementById("over-score").textContent = String(score);
  document.getElementById("over-best").textContent = String(best);
  document.getElementById("over-coins").textContent = String(runCoins);
  const tier = medalTier(score);
  const nextAt = tier === "iris" ? null : tier === "gold" ? 80 : tier === "silver" ? 40 : tier === "bronze" ? 20 : 10;
  document.getElementById("over-next").textContent = nextAt ? "Next medal at " + nextAt : "The whole suburb heard you.";
  const dpr = Math.min(2, backing);
  medalCanvas.width = Math.round(96 * dpr);
  medalCanvas.height = Math.round(96 * dpr);
  medalCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawMedal(medalCtx, tier);
  const cont = document.getElementById("btn-continue");
  const note = document.getElementById("continue-note");
  const showCont = !continued && score > 0;
  cont.hidden = !showCont;
  note.hidden = !showCont;
  const dbl = document.getElementById("btn-double");
  const showDbl = runCoins > 0 && !doubled;
  dbl.hidden = !showDbl;
}

function startGame(fromTitle) {
  resetRun();
  if (fromTitle) {
    intro = 0.3;
    bird.x = 200;
    bird.y = 430;
  }
  mode = "play";
  syncUI();
  updateScore();
  audio.startMusic();
  flap();
}

function finishAd() {
  continued = true;
  mode = "play";
  bird.y = 380;
  bird.vy = 0;
  bird.rot = 0;
  bird.sx = 1;
  bird.sy = 1;
  shield = true;
  invuln = 1.25;
  obstacles = obstacles.filter((o) => o.x > bird.x + 210);
  if (!obstacles.length) spawn(W + 40);
  caption = "Up you get";
  captionT = 1.5;
  syncUI();
  audio.startMusic();
}

function updateScore() {
  scoreEl.textContent = String(score);
  scoreEl.classList.remove("pop");
  void scoreEl.offsetWidth;
  scoreEl.classList.add("pop");
  document.body.dataset.score = String(score);
  document.body.dataset.mode = mode;
}

function syncUI() {
  titleEl.hidden = mode !== "title";
  overEl.hidden = mode !== "over";
  shopEl.hidden = mode !== "shop";
  adEl.hidden = mode !== "ad";
  document.getElementById("screen-pause").hidden = mode !== "pause";
  document.getElementById("screen-settings").hidden = mode !== "settings";
  document.getElementById("screen-exit").hidden = mode !== "exit";
  document.getElementById("screen-count").hidden = mode !== "count";
  scoreEl.hidden = mode !== "play" && mode !== "dead" && mode !== "count";
  captionEl.hidden = captionT <= 0 || (mode !== "play" && mode !== "dead");
  coinPill.hidden = mode === "shop" || mode === "over" || mode === "ad" || mode === "settings";
  document.getElementById("btn-pause").hidden = mode !== "play";
  const hint = document.getElementById("hint");
  hint.hidden = hintSeen || mode !== "play" || hintFlaps > 0 || score > 0;
  coinEl.textContent = String(coins);
  bestEl.textContent = String(best);
  bestMedalEl.textContent = medalName(best);
  muted = !sfxOn && !musicOn;
  muteBtn.classList.toggle("is-muted", muted);
  muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
  document.body.dataset.mode = mode;
  if (params.has("fps")) stage.dataset.fps = fpsEma.toFixed(0);
  paintSettings();
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  toastT = 1.5;
}

function buzz(ms) {
  if (!hapticsOn || motionOff) return;
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch (err) {
    /* some browsers throw */
  }
}

function setMuted(flag) {
  sfxOn = !flag;
  musicOn = !flag;
  muted = flag;
  audio.setSfx(sfxOn);
  audio.setMusic(musicOn);
  muteBtn.classList.toggle("is-muted", muted);
  muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  save();
  paintSettings();
}

function paintSettings() {
  const sfx = document.getElementById("tog-sfx");
  const mus = document.getElementById("tog-music");
  const hap = document.getElementById("tog-haptics");
  const red = document.getElementById("tog-motion");
  if (!sfx) return;
  sfx.setAttribute("aria-pressed", sfxOn ? "true" : "false");
  mus.setAttribute("aria-pressed", musicOn ? "true" : "false");
  hap.setAttribute("aria-pressed", hapticsOn ? "true" : "false");
  red.setAttribute("aria-pressed", motionOff ? "true" : "false");
  sfx.textContent = sfxOn ? "On" : "Off";
  mus.textContent = musicOn ? "On" : "Off";
  hap.textContent = hapticsOn ? "On" : "Off";
  red.textContent = motionOff ? "On" : "Off";
}

function openSettings() {
  shopFrom = mode === "pause" ? "pause" : mode === "over" ? "over" : "title";
  mode = "settings";
  syncUI();
}

function closeSettings() {
  mode = shopFrom === "pause" || shopFrom === "over" || shopFrom === "title" ? shopFrom : "title";
  if (mode === "over") fillOver();
  syncUI();
}

function pauseGame() {
  if (mode !== "play") return;
  mode = "pause";
  syncUI();
}

function askExit() {
  exitFrom = mode === "pause" ? "pause" : "title";
  mode = "exit";
  syncUI();
}

function hookNative() {
  const cap = window.Capacitor;
  if (!cap || typeof cap.isNativePlatform !== "function" || !cap.isNativePlatform()) return;
  const app = cap.Plugins && cap.Plugins.App;
  const bar = cap.Plugins && cap.Plugins.StatusBar;
  if (bar) {
    if (bar.setOverlaysWebView) bar.setOverlaysWebView({ overlay: true });
    if (bar.hide) bar.hide();
  }
  if (!app || !app.addListener) return;
  app.addListener("backButton", () => {
    if (mode === "shop") closeShop();
    else if (mode === "settings") closeSettings();
    else if (mode === "play") pauseGame();
    else if (mode === "pause" || mode === "title") askExit();
    else if (mode === "over" || mode === "ad" || mode === "count") {
      mode = "title";
      syncUI();
    } else if (mode === "exit") {
      mode = exitFrom;
      syncUI();
    }
  });
  app.addListener("appStateChange", (state) => {
    if (!state.isActive) {
      audio.suspend();
      if (mode === "play") pauseGame();
    } else audio.resumeCtx();
  });
}

function resumeGame() {
  if (mode !== "pause") return;
  countLeft = 3;
  mode = "count";
  document.getElementById("count-num").textContent = "3";
  syncUI();
}

function openShop() {
  shopFrom = mode === "over" ? "over" : "title";
  preview = skin;
  mode = "shop";
  renderShop();
  syncUI();
  audio.unlock();
  if (!muted && !titleCalled) {
    titleCalled = true;
    audio.squawk();
  }
}

function closeShop() {
  preview = skin;
  mode = shopFrom || "title";
  if (mode === "over") fillOver();
  syncUI();
}

function renderShop() {
  document.getElementById("shop-coins").textContent = String(coins);
  const grid = document.getElementById("shop-skins");
  grid.innerHTML = "";
  for (const s of SKINS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "skin-card" + (preview === s.id ? " is-pick" : "") + (skin === s.id ? " is-on" : "");
    const have = owned.includes(s.id);
    const price = have ? (skin === s.id ? "Wearing" : "Owned") : String(s.cost);
    btn.innerHTML =
      '<span class="skin-name">' +
      s.name +
      "</span>" +
      '<span class="skin-line">' +
      s.line +
      "</span>" +
      '<span class="skin-price">' +
      price +
      "</span>";
    btn.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      preview = s.id;
      renderShop();
    });
    grid.appendChild(btn);
  }
  const ups = document.getElementById("shop-ups");
  ups.innerHTML = "";
  for (const u of UPGRADES) {
    const level = u.id === "shield" ? shields : u.id === "gap" ? gapLevel : sweetLevel;
    const row = document.createElement("div");
    row.className = "up-row";
    const maxed = level >= u.max;
    const cost = maxed ? 0 : u.costs[level];
    const label = u.id === "shield" ? "Stock " + level + " / " + u.max : "Level " + level + " / " + u.max;
    row.innerHTML =
      '<div class="up-copy"><strong>' +
      u.name +
      "</strong><span>" +
      u.line +
      "</span><em>" +
      label +
      "</em></div>";
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn small";
    b.textContent = maxed ? "Maxed" : String(cost);
    b.disabled = maxed;
    b.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      buyUpgrade(u.id);
    });
    row.appendChild(b);
    ups.appendChild(row);
  }
  const s = SKINS.find((x) => x.id === preview) || SKINS[0];
  const bar = document.getElementById("shop-action");
  const have = owned.includes(s.id);
  if (have && skin === s.id) {
    bar.textContent = "Wearing " + s.name;
    bar.disabled = true;
  } else if (have) {
    bar.textContent = "Wear " + s.name;
    bar.disabled = false;
  } else if (coins >= s.cost) {
    bar.textContent = "Unlock " + s.name + "  ·  " + s.cost;
    bar.disabled = false;
  } else {
    bar.textContent = "Need " + (s.cost - coins) + " more";
    bar.disabled = false;
  }
  bar.onclick = (e) => {
    e.stopPropagation();
    if (have) {
      skin = s.id;
      preview = s.id;
      save();
      renderShop();
      return;
    }
    if (coins < s.cost) {
      toast("Not enough koeksisters yet");
      bar.classList.remove("shake");
      void bar.offsetWidth;
      bar.classList.add("shake");
      return;
    }
    coins -= s.cost;
    owned.push(s.id);
    skin = s.id;
    preview = s.id;
    audio.coin();
    save();
    renderShop();
    syncUI();
  };
}

function buyUpgrade(id) {
  const u = UPGRADES.find((x) => x.id === id);
  const level = id === "shield" ? shields : id === "gap" ? gapLevel : sweetLevel;
  if (level >= u.max) return;
  const cost = u.costs[level];
  if (coins < cost) {
    toast("Not enough koeksisters yet");
    return;
  }
  coins -= cost;
  if (id === "shield") shields += 1;
  if (id === "gap") gapLevel += 1;
  if (id === "sweet") sweetLevel += 1;
  audio.coin();
  save();
  renderShop();
  syncUI();
}

function onPrimary() {
  const first = audio.unlock();
  if (muted) audio.setMuted(true);
  if ((mode === "title" || mode === "shop") && first && !muted && !titleCalled) {
    titleCalled = true;
    audio.squawk();
  }
  if (mode === "title") startGame(true);
  else if (mode === "play") flap();
  else if (mode === "dead") queueRestart = true;
  else if (mode === "over") startGame(false);
  else if (mode === "pause") resumeGame();
}

function botThink(dt) {
  botCd -= dt;
  if (botCd > 0 || bird.vy < -70) return;
  const next = obstacles.find((o) => o.x + GATE[o.kind].hit[1] > bird.x - 8);
  const target = next ? (next.gapTop + next.gapBot) / 2 : 390;
  const nearGround = bird.y > GROUND_Y - 150 && bird.vy > 0;
  if (bird.y > target + 2 || nearGround) {
    flap();
    botCd = 0.15;
  }
}

function update(dt) {
  time += dt;
  if (toastT > 0) {
    toastT -= dt;
    if (toastT <= 0) toastEl.hidden = true;
  }
  if (captionT > 0) {
    captionT -= dt;
    captionEl.textContent = caption;
    captionEl.hidden = captionT <= 0 || mode !== "play";
  }
  blinkT -= dt;
  if (blinkT <= 0) {
    blinking = 0.12;
    blinkT = 2.2 + rand() * 2.8;
  }
  if (blinking > 0) {
    blinking -= dt;
    blink = 1;
  } else blink = 0;

  if (mode === "title" || mode === "shop") {
    camera += 22 * dt;
    bird.vy = 0;
    if (mode === "title") {
      bird.x = 198;
      bird.y = 392 + Math.sin(time * 1.6) * 8;
      bird.rot = -0.18 + Math.sin(time * 1.6) * 0.06;
      wing = Math.sin(time * 5.2) * 0.75;
      callEvery -= dt;
      if (callEvery <= 0) {
        callEvery = 8;
        callAnim = 1;
      }
    } else {
      bird.x = 196;
      bird.y = 214 + Math.sin(time * 1.8) * 4;
      bird.rot = -0.12;
      wing = Math.sin(time * 4.4) * 0.65;
    }
  }

  if (callAnim > 0) {
    callAnim -= dt;
    const u = 1 - Math.max(0, callAnim);
    beak = Math.max(0, Math.sin(u * Math.PI * 3)) * 0.85;
  } else if (mode !== "dead") beak = 0;

  if (mode === "count") {
    countLeft -= dt;
    const num = document.getElementById("count-num");
    num.textContent = countLeft <= 0 ? "Fly" : String(Math.max(1, Math.ceil(countLeft)));
    if (countLeft <= 0) {
      mode = "play";
      syncUI();
    }
  }

  if (mode === "ad") {
    adT -= dt;
    const p = clamp(1 - adT / 1.7, 0, 1);
    document.getElementById("ad-fill").style.transform = "scaleX(" + p.toFixed(3) + ")";
    if (adT <= 0) {
      adT = 99;
      const kind = adKind;
      completeRewarded(adSession).then((res) => {
        if (!res || !res.rewarded) {
          mode = "over";
          fillOver();
          syncUI();
          return;
        }
        if (kind === "double") {
          coins += runCoins;
          doubled = true;
          save();
          mode = "over";
          fillOver();
          syncUI();
        } else finishAd();
      });
    }
  }

  if (mode === "play") {
    if (!Number.isFinite(bird.y) || !Number.isFinite(bird.vy)) {
      bird.y = 400;
      bird.vy = 0;
    }
    const d = difficulty(score);
    camera += d.speed * dt;
    if (intro > 0) {
      intro -= dt;
      const t = clamp(1 - intro / 0.3, 0, 1);
      const e = t * t * (3 - 2 * t);
      bird.x = 200 + (BIRD_X - 200) * e;
    } else bird.x = BIRD_X;

    bird.vy = Math.min(GRAVITY * dt + bird.vy, 680);
    bird.y += bird.vy * dt;
    const targetRot = clamp(bird.vy / 640, -0.48, 1.15);
    bird.rot += (targetRot - bird.rot) * Math.min(1, dt * 8);
    if (wingT > 0) {
      wingT -= dt;
      const u = 1 - clamp(wingT / 0.22, 0, 1);
      wing = u < 0.28 ? u / 0.28 : 1 - ((u - 0.28) / 0.72) * 1.75;
    } else wing = -0.28;

    if (bird.y < 34) {
      bird.y = 34;
      if (bird.vy < 0) bird.vy = 40;
    }
    if (invuln > 0) invuln -= dt;

    maybeSpawn();
    for (const o of obstacles) {
      o.x -= d.speed * dt;
      const spec = GATE[o.kind];
      const right = o.x + spec.hit[1];
      if (!o.scored && right < bird.x) {
        o.scored = true;
        score += 1;
        audio.score();
        updateScore();
        rings.push({ x: bird.x, y: bird.y, r: 12, a: 0.45 });
        floaters.push({ text: "+1", x: bird.x + 18, y: bird.y - 10, vy: -42, life: 0.6, color: "#FFF8F1" });
        const nt = themeFor(score);
        if (nt !== theme && nextTheme !== nt) {
          nextTheme = nt;
          fade = 0;
          caption = THEME_NAME[nt];
          captionT = 1.7;
          captionEl.hidden = false;
          captionEl.textContent = caption;
        }
      }
      if (o.coin && !o.coin.taken) {
        const cx = o.x + spec.w * 0.5;
        const cy = o.coin.y;
        const dx = bird.x - cx;
        const dy = bird.y - cy;
        if (dx * dx + dy * dy < 32 * 32) {
          o.coin.taken = true;
          coins += 1;
          runCoins += 1;
          audio.coin();
          buzz(12);
          flyers.push({ x: cx, y: cy, t: 0 });
          saveTimer = 0.4;
        }
      }
      if (hits(o)) die();
    }
    obstacles = obstacles.filter((o) => o.x + GATE[o.kind].w > -50);

    if (nextTheme) {
      fade += dt / 1.25;
      if (fade >= 1) {
        theme = nextTheme;
        nextTheme = null;
        fade = 0;
      }
    }

    if (bird.y + 16 >= GROUND_Y) {
      if (invuln > 0) {
        bird.y = GROUND_Y - 52;
        bird.vy = -300;
      } else if (shield) {
        bird.y = GROUND_Y - 52;
        bird.vy = -300;
        die();
      } else {
        bird.y = GROUND_Y - 16;
        bird.vy = 0;
        die();
      }
    }
    if (bot) botThink(dt);
  }

  if (mode === "dead") {
    deadT += dt;
    bird.vy = Math.min(bird.vy + GRAVITY * dt, 720);
    bird.y += bird.vy * dt;
    bird.rot += dt * 2.4;
    wing = -0.6;
    blink = deadT > 0.25 ? 1 : 0;
    if (bird.y + 16 >= GROUND_Y) {
      bird.y = GROUND_Y - 16;
      bird.vy = 0;
      bird.rot = 0.75;
    }
    if (deadT > 0.62 && (bird.vy === 0 || deadT > 1.25)) {
      if (queueRestart) startGame(false);
      else showOver();
    }
  }

  bird.sx += (1 - bird.sx) * Math.min(1, dt * 9);
  bird.sy += (1 - bird.sy) * Math.min(1, dt * 9);
  shake *= Math.exp(-dt * 6.5);
  flash *= Math.exp(-dt * 8);

  for (const p of particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 280 * dt;
    p.rot += p.vr * dt;
  }
  particles = particles.filter((p) => p.life > 0);
  for (const r of rings) {
    r.r += 90 * dt;
    r.a -= dt * 0.9;
  }
  rings = rings.filter((r) => r.a > 0);
  for (const f of floaters) {
    f.life -= dt;
    f.y += f.vy * dt;
    f.vy *= 0.98;
  }
  floaters = floaters.filter((f) => f.life > 0);
  for (const f of flyers) f.t += dt * 1.35;
  const done = flyers.filter((f) => f.t >= 1);
  if (done.length) {
    coinPill.classList.remove("pop");
    void coinPill.offsetWidth;
    coinPill.classList.add("pop");
    coinEl.textContent = String(coins);
  }
  flyers = flyers.filter((f) => f.t < 1);

  if (saveTimer > 0) {
    saveTimer -= dt;
    if (saveTimer <= 0) save();
  }
  audio.tickMusic();
  if (params.has("fps")) stage.dataset.fps = fpsEma.toFixed(0);
  document.body.dataset.score = String(score);
  document.body.dataset.mode = mode;
}

function hits(o) {
  if (invuln > 0) return false;
  const spec = GATE[o.kind];
  const left = o.x + spec.hit[0] + 2;
  const right = o.x + spec.hit[1] - 2;
  if (bird.x + BIRD_R < left || bird.x - BIRD_R > right) return false;
  const fy = spec.yForgive;
  if (bird.y - BIRD_R < o.gapTop - fy) return true;
  if (bird.y + BIRD_R > o.gapBot + fy) return true;
  return false;
}

function render() {
  ctx.setTransform(backing, 0, 0, backing, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (sheet === "bird" || sheet === "gates") {
    if (sheet === "bird") renderBirdSheet();
    else renderGateSheet();
    return;
  }
  if (params.get("icon") === "1") {
    drawAppIcon(ctx, 390);
    return;
  }
  ctx.save();
  if (shake > 0.02 && !reduceMotion) {
    const m = shake * 7;
    ctx.translate((Math.random() - 0.5) * 2 * m, (Math.random() - 0.5) * 2 * m);
  }
  const night = theme === "night" || (nextTheme === "night" && fade > 0.55);
  paintWorld(ctx, {
    camera,
    theme,
    next: nextTheme,
    fade,
    time,
    dpr: backing,
    w: W,
    h: H,
  });

  if (mode === "play" || mode === "dead" || mode === "over" || mode === "ad") {
    for (const o of obstacles) drawGate(ctx, o, time, GROUND_Y, theme);
    for (const o of obstacles) {
      if (!o.coin || o.coin.taken) continue;
      const spec = GATE[o.kind];
      drawKoeksister(ctx, o.x + spec.w * 0.5, o.coin.y, time, 1);
    }
  }

  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    drawFeather(ctx, p.x, p.y, p.rot, p.len, p.color);
    ctx.globalAlpha = 1;
  }

  const scale = mode === "title" ? 1.28 : mode === "shop" ? 1.62 : 1;
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.rot);
  ctx.scale(bird.sx * scale, bird.sy * scale);
  if (invuln > 0 && Math.sin(time * 28) > 0) ctx.globalAlpha = 0.55;
  const showSkin = mode === "shop" ? preview : skin;
  drawHadeda(ctx, {
    wing,
    blink,
    skin: showSkin,
    beak: mode === "title" ? beak : 0,
    night: night && !lowQ,
    time,
  });
  ctx.restore();

  if (shield && (mode === "play" || mode === "dead")) {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.strokeStyle = "rgba(120, 196, 150, " + (0.4 + 0.25 * Math.sin(time * 6)) + ")";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, 34 + Math.sin(time * 4), 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  ctx.lineWidth = 3;
  for (const r of rings) {
    ctx.strokeStyle = "rgba(255,248,241," + r.a + ")";
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.font = "800 18px Nunito, sans-serif";
  ctx.textAlign = "center";
  for (const f of floaters) {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life * 1.6));
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }

  for (const f of flyers) {
    const e = f.t * f.t;
    const x = f.x + (40 - f.x) * e;
    const y = f.y + (36 - f.y) * e;
    drawKoeksister(ctx, x, y, time, 1 - e * 0.4);
  }

  if (mode === "title" && (callAnim > 0 || (scene === "title" && params.has("still")))) {
    drawBubble(ctx, bird.x + 78, bird.y - 78);
  }

  if (flash > 0.02) {
    ctx.fillStyle = "rgba(255,244,236," + flash * 0.7 + ")";
    ctx.fillRect(-20, -20, W + 40, H + 40);
  }

  if (params.has("hit") && mode === "play") {
    ctx.strokeStyle = "rgba(255,0,80,0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, BIRD_R, 0, Math.PI * 2);
    ctx.stroke();
    for (const o of obstacles) {
      const spec = GATE[o.kind];
      ctx.strokeRect(o.x + spec.hit[0], 0, spec.hit[1] - spec.hit[0], o.gapTop - spec.yForgive);
      ctx.strokeRect(
        o.x + spec.hit[0],
        o.gapBot + spec.yForgive,
        spec.hit[1] - spec.hit[0],
        GROUND_Y - (o.gapBot + spec.yForgive)
      );
    }
  }
  ctx.restore();
}

function drawBubble(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  roundedBubble(ctx);
  ctx.fillStyle = "#FFF8F1";
  ctx.fill();
  ctx.fillStyle = "#2A221C";
  ctx.font = "800 15px Nunito, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("HAA", 0, 5);
  ctx.restore();
}

function roundedBubble(ctx) {
  ctx.beginPath();
  ctx.moveTo(-28, -16);
  ctx.arcTo(28, -16, 28, 16, 10);
  ctx.arcTo(28, 16, -28, 16, 10);
  ctx.arcTo(-28, 16, -28, -16, 10);
  ctx.arcTo(-28, -16, 28, -16, 10);
  ctx.closePath();
}

function renderBirdSheet() {
  ctx.fillStyle = "#F3E6D8";
  ctx.fillRect(0, 0, W, H);
  const poses = [
    { wing: 0.9, beak: 0, skin: "classic", y: 150 },
    { wing: -0.7, beak: 0.4, skin: "classic", y: 150 },
  ];
  poses.forEach((p, i) => {
    ctx.save();
    ctx.translate(100 + i * 180, p.y);
    ctx.scale(1.7, 1.7);
    drawHadeda(ctx, p);
    ctx.restore();
  });
  const skins = ["classic", "scarf", "protea", "beanie", "bronze", "straw"];
  skins.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    ctx.save();
    ctx.translate(70 + col * 120, 340 + row * 150);
    ctx.scale(1.05, 1.05);
    drawHadeda(ctx, { wing: 0.4, skin: s, time });
    ctx.restore();
    ctx.fillStyle = "#2A221C";
    ctx.font = "700 12px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s, 70 + col * 120, 400 + row * 150);
  });
  ctx.fillStyle = "#2A221C";
  ctx.font = "800 18px Nunito, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Hadeda sheet", 16, 36);
}

function renderGateSheet() {
  ctx.fillStyle = "#E7F3FB";
  ctx.fillRect(0, 0, W, H);
  const kinds = ["iron", "jacaranda", "pole", "palisade", "tower"];
  kinds.forEach((kind, i) => {
    const y = 8 + i * 166;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, W, 160);
    ctx.clip();
    ctx.translate(70, y + 8);
    ctx.scale(0.42, 0.42);
    drawGate(
      ctx,
      { kind, variant: i % 3, x: 40, gapTop: 78, gapBot: 210, scored: false, coin: null },
      2.2,
      300,
      "day"
    );
    ctx.restore();
    ctx.fillStyle = "#2A221C";
    ctx.font = "800 13px Nunito, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(kind, 12, y + 18);
  });
}

function fit() {
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  stage.style.transform = "scale(" + s + ")";
  stage.style.left = (window.innerWidth - W * s) / 2 + "px";
  stage.style.top = (window.innerHeight - H * s) / 2 + "px";
  const margin = window.innerWidth - W * s;
  stage.style.borderRadius = margin > 32 ? "28px" : "0px";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const next = Math.min(2, dpr * Math.max(1, s));
  if (Math.abs(next - backing) > 0.05 || canvas.width === 0) {
    backing = next;
    canvas.width = Math.round(W * backing);
    canvas.height = Math.round(H * backing);
    clearThemeCaches();
  }
}

function applyStill() {
  const tod = params.get("tod");
  if (scene === "play") {
    const wanted = tod || "day";
    const scoreMap = { dawn: 4, day: 14, sunset: 26, night: 48 };
    score = scoreMap[wanted] ?? 14;
    theme = themeFor(score);
    if (tod) theme = tod;
    mode = "play";
    bird.x = 118;
    bird.y = 392;
    bird.vy = -80;
    bird.rot = -0.28;
    wing = 0.7;
    camera = 240;
    const gap = 236;
    obstacles = [
      { kind: "jacaranda", variant: 0, x: 168, gapTop: 392 - gap / 2, gapBot: 392 + gap / 2, scored: false, coin: { y: 392, taken: false } },
      { kind: "iron", variant: 1, x: 392, gapTop: 450 - gap / 2, gapBot: 450 + gap / 2, scored: false, coin: null },
    ];
    coins = Math.max(coins, 14);
    runCoins = 3;
    updateScore();
  } else if (scene === "over") {
    score = +(params.get("score") || 42);
    best = Math.max(best, score);
    newBest = true;
    runCoins = 8;
    theme = themeFor(score);
    mode = "over";
    bird.x = 150;
    bird.y = GROUND_Y - 18;
    bird.rot = 0.72;
    wing = -0.15;
    blink = 1;
    camera = 420;
    obstacles = [
      { kind: "palisade", variant: 0, x: -20, gapTop: 280, gapBot: 520, scored: true, coin: null },
    ];
    fillOver();
  } else if (scene === "shop") {
    coins = Math.max(coins, +(params.get("coins") || 86));
    mode = "shop";
    preview = params.get("skin") || "scarf";
    if (params.get("skin")) {
      skin = preview;
      if (!owned.includes(skin)) owned = owned.concat([skin]);
    }
    theme = "day";
    camera = 160;
    bird.x = 196;
    bird.y = 214;
    bird.rot = -0.12;
    wing = 0.55;
    renderShop();
  } else if (scene === "title") {
    mode = "title";
    theme = tod || "dawn";
    camera = 120;
    bird.x = 198;
    bird.y = 392;
    bird.rot = -0.2;
    wing = 0.82;
    beak = 0.7;
    callAnim = 0.7;
  } else if (scene === "settings") {
    mode = "settings";
    theme = tod || "day";
    camera = 80;
  }
  syncUI();
}

function boot() {
  if (params.has("seed")) rng = mulberry32(+params.get("seed") || 1);
  if (sheet || params.get("icon") === "1") stage.classList.add("is-sheet");
  loadSave();
  if (params.has("coins") && scene) coins = +params.get("coins") || 0;
  audio.setSfx(sfxOn);
  audio.setMusic(musicOn);
  fit();
  ensureTheme("dawn", backing);
  const queue = ["day", "sunset", "night"];
  const pump = () => {
    const t = queue.shift();
    if (!t) return;
    ensureTheme(t, backing);
    requestAnimationFrame(pump);
  };
  requestAnimationFrame(pump);

  if (scene || params.has("still")) applyStill();
  else syncUI();

  if (bot && !scene) {
    setTimeout(() => {
      if (mode === "title") startGame(true);
    }, 1200);
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  document.fonts.load("800 56px Nunito").catch(() => {});
  hookNative();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audio.suspend();
      if (mode === "play") pauseGame();
    } else audio.resumeCtx();
  });

  last = performance.now();
  requestAnimationFrame(frame);
}

function frame(now) {
  const dt = Math.min(0.034, Math.max(0.001, (now - last) / 1000));
  last = now;
  fpsEma = fpsEma * 0.94 + (1 / dt) * 0.06;
  if (fpsEma < 42) lowQ = true;
  else if (fpsEma > 55) lowQ = false;
  const paused = document.hidden;
  const frozen = !!(scene || sheet || params.get("icon") === "1");
  if (!paused && !frozen) update(dt);
  else if (!paused && scene === "title" && !params.has("still")) update(dt);
  render();
  requestAnimationFrame(frame);
}

document.getElementById("btn-play").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  onPrimary();
});
document.getElementById("btn-shop").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openShop();
});
document.getElementById("btn-again").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  startGame(false);
});
document.getElementById("btn-continue").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (continued || mode !== "over") return;
  adKind = "continue";
  adSession = beginRewarded("continue");
  mode = "ad";
  adT = 1.7;
  document.getElementById("ad-kicker").textContent = "Stoep Stories";
  document.getElementById("ad-title").textContent = "Back in a moment";
  document.getElementById("ad-fill").style.transform = "scaleX(0)";
  syncUI();
});
document.getElementById("btn-double").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (doubled || runCoins <= 0 || mode !== "over") return;
  adKind = "double";
  adSession = beginRewarded("double");
  mode = "ad";
  adT = 1.7;
  document.getElementById("ad-kicker").textContent = "Stoep sweets";
  document.getElementById("ad-title").textContent = "Twice the koeksisters";
  document.getElementById("ad-fill").style.transform = "scaleX(0)";
  syncUI();
});
document.getElementById("btn-pause").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  pauseGame();
});
document.getElementById("btn-resume").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  resumeGame();
});
document.getElementById("btn-pause-quit").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  mode = "title";
  syncUI();
});
document.getElementById("btn-settings").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openSettings();
});
document.getElementById("btn-settings-back").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeSettings();
});
document.getElementById("tog-sfx").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  sfxOn = !sfxOn;
  audio.unlock();
  audio.setSfx(sfxOn);
  save();
  syncUI();
});
document.getElementById("tog-music").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  musicOn = !musicOn;
  audio.unlock();
  audio.setMusic(musicOn);
  if (musicOn && (mode === "play" || mode === "title")) audio.startMusic();
  save();
  syncUI();
});
document.getElementById("tog-haptics").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  hapticsOn = !hapticsOn;
  save();
  syncUI();
  buzz(12);
});
document.getElementById("tog-motion").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  motionOff = !motionOff;
  save();
  syncUI();
});
document.getElementById("btn-reset").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  best = 0;
  coins = 0;
  owned = ["classic"];
  skin = "classic";
  preview = "classic";
  gapLevel = 0;
  sweetLevel = 0;
  shields = 0;
  hintSeen = false;
  save();
  toast("Progress cleared");
  syncUI();
});
document.getElementById("btn-exit-stay").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  mode = exitFrom;
  syncUI();
});
document.getElementById("btn-exit-leave").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const cap = window.Capacitor;
  const app = cap && cap.Plugins && cap.Plugins.App;
  if (app && app.exitApp) app.exitApp();
  else {
    mode = "title";
    syncUI();
  }
});
document.getElementById("btn-over-shop").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openShop();
});
document.getElementById("btn-shop-back").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeShop();
});
muteBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  audio.unlock();
  setMuted(!muted);
  if (!muted && mode === "title" && !titleCalled) {
    titleCalled = true;
    audio.squawk();
  }
});
overEl.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button")) return;
  onPrimary();
});
canvas.addEventListener("pointerdown", (e) => {
  if (scene && params.has("still")) return;
  e.preventDefault();
  onPrimary();
});
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (mode === "shop" || mode === "settings" || mode === "exit" || mode === "ad") return;
    onPrimary();
  } else if (e.code === "KeyM") {
    audio.unlock();
    setMuted(!muted);
  } else if (e.code === "Escape") {
    if (mode === "play") pauseGame();
    else if (mode === "pause") resumeGame();
    else if (mode === "settings") closeSettings();
    else if (mode === "shop") closeShop();
    else if (mode === "title") askExit();
  }
});
stage.addEventListener(
  "touchmove",
  (e) => {
    if (e.target.closest("#shop-scroll, #settings-scroll")) return;
    e.preventDefault();
  },
  { passive: false }
);
window.addEventListener("resize", fit);

boot();
