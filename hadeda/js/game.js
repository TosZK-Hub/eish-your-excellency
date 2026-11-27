import {
  GROUND_Y,
  GATE,
  clearThemeCaches,
  ensureTheme,
  paintWorld,
  drawGround,
  drawHadeda,
  drawGate,
  drawCoin,
  coinImage,
  drawFeather,
  drawDust,
  drawMedal,
  drawAppIcon,
  loadArt,
  artReady,
  ZONE_ANCHOR,
  ZONE_TINT,
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
  { id: "classic", name: "Protea doek", cost: 0, line: "Hettie's everyday pink." },
  { id: "scarf", name: "Bok-green doek", cost: 30, line: "Her match-day neckerchief." },
  { id: "protea", name: "Protea crown", cost: 50, line: "A little flower from the veld." },
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
    costs: [10, 10, 10],
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
    name: "Loose change",
    line: "10c coins show up more often.",
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

const ZONES = [
  { id: "suburb", name: "The suburb", kinds: ["jac", "yard"] },
  { id: "site", name: "Building site", kinds: ["site"] },
  { id: "freeway", name: "The freeway", kinds: ["freeway"] },
  { id: "yard", name: "Back yards", kinds: ["yard"] },
  { id: "jac", name: "Jacaranda street", kinds: ["jac"] },
];

const MISSIONS = [
  { id: "cranes", label: "Pass 15 crane loads", goal: 15, reward: 10 },
  { id: "sweets", label: "Collect 20 ten-cent coins", goal: 20, reward: 10 },
  { id: "sunset", label: "Reach the sunset", goal: 1, reward: 20 },
];

// Currency: the pickup is a 10c coin; ten of them make one ZarBuck (Z$1).
// Everything is stored and priced in 10c coins internally.
function fmtZ(c) {
  const n = Math.max(0, c | 0);
  const z = Math.floor(n / 10);
  const cents = (n % 10) * 10;
  if (!cents) return "Z$" + z;
  return z ? "Z$" + z + " + " + cents + "c" : cents + "c";
}

// ---- Hettie Hadida (Kleinspan character): poses and lines ----
const HETTIE_SAY = [
  "Môre! Up since five, skat.",
  "Mind the palisade. I'm just saying.",
  "Wings out, bill forward. Kom!",
  "The whole street can hear us. Good.",
  "Ten coins is a ZarBuck. Count them.",
];
const QUIP_LOW = [
  "Ek sê niks nie, ek sê maar net.",
  "Ag nee, skat. Again.",
  "That palisade has been there since 1987.",
  "Probeer weer. I'll wait. I'm up anyway.",
];
const QUIP_MID = [
  "Nie sleg nie! Ek sê maar net.",
  "Jislaaik, the neighbours are watching.",
  "Ek sê niks nie, ek sê maar net.",
];
const MILESTONE = { 10: "Mooi so, skat!", 25: "Jislaaik!", 50: "Hettie is trots!", 100: "Hadida Koningin!" };
const hettieImg = {};
let hettieSayIx = 0;
let hettieSayT = 0;
let dailyNote = "";

function loadHettie() {
  return import("./pack-hettie.js")
    .then((m) => {
      Object.assign(hettieImg, m.HETTIE);
      const set = (id, key) => {
        const el = document.getElementById(id);
        if (el && hettieImg[key]) el.src = hettieImg[key];
      };
      set("hettie-title", "wave");
      set("shop-hettie", "crown");
      if (mode === "over") fillOver();
    })
    .catch(() => {});
}

function hettieSay(text, call) {
  const el = document.getElementById("title-say");
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("is-call", !!call);
  hettieSayT = call ? 3.2 : 6;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function fmtPrice(c) {
  return c % 10 ? "Z$" + (c / 10).toFixed(2) : "Z$" + c / 10;
}

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
const coinMeter = document.getElementById("coin-meter");
let migratedFrom = 0;

function showCoins() {
  coinEl.textContent = fmtZ(coins);
  if (coinMeter) {
    const fill = coins % 10;
    coinMeter.style.setProperty("--fill", String(fill));
    coinMeter.setAttribute("aria-label", fill + " of 10 coins to the next ZarBuck");
  }
}
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
let tod = 0.15;
let zoneShown = 0;
let missionIx = 0;
let missionN = 0;
let missionPaid = false;
let lastZoneName = "";
let score = 0;
let best = 0;
let coins = 0;
let lastDay = "";
let streak = 0;
let titleCallT = 0;
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
let flapAgo = 9;
let glide = 0;
let shockT = 0;
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
    coins = Number.isFinite(d.coins) ? Math.max(0, Math.floor(d.coins)) : 0;
    // v3 and older counted koeksisters. Each old koeksister becomes one 10c coin.
    if ((d.v | 0) < 4 && coins > 0) migratedFrom = coins;
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
    missionIx = clamp(d.mission | 0, 0, MISSIONS.length - 1);
    missionN = Math.max(0, d.missionN | 0);
    if (typeof d.day === "string") lastDay = d.day;
    streak = Math.max(0, Math.min(7, d.streak | 0));
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
        mission: missionIx,
        missionN,
        day: lastDay,
        streak,
        v: 4,
      })
    );
  } catch (err) {
    /* ignore quota / private mode */
  }
}

function themeFor(n) {
  if (n >= 46) return "night";
  if (n >= 28) return "sunset";
  if (n >= 12) return "day";
  return "dawn";
}

function todTarget(n) {
  if (n < 12) return 0.12 + (n / 12) * 0.88;
  if (n < 28) return 1 + (n - 12) / 16;
  if (n < 46) return 2 + (n - 28) / 18;
  return 3;
}

function zoneTarget(dist) {
  const span = 1900;
  return dist / span;
}

function zoneAt(shown) {
  const n = ZONES.length;
  const wrapped = ((shown % n) + n) % n;
  const i = Math.floor(wrapped) % n;
  const next = (i + 1) % n;
  const blend = wrapped - Math.floor(wrapped);
  return { i, next, blend, zone: ZONES[i], upcoming: ZONES[next] };
}

function medalTier(n) {
  if (n >= 80) return "iris";
  if (n >= 40) return "gold";
  if (n >= 20) return "silver";
  if (n >= 10) return "bronze";
  return null;
}

function noteMission(id, n) {
  const mission = MISSIONS[missionIx] || MISSIONS[0];
  if (missionPaid || mission.id !== id) return;
  if (id === "sunset") {
    if (missionN >= 1) return;
    missionN = 1;
  } else missionN = Math.min(mission.goal, missionN + n);
  if (missionN >= mission.goal) {
    missionPaid = true;
    coins += mission.reward;
    floaters.push({ text: "+" + fmtZ(mission.reward), x: bird.x, y: bird.y - 40, vy: -36, life: 0.9, color: "#FFE7A8" });
    caption = "Mission done";
    captionT = 1.6;
    missionIx = (missionIx + 1) % MISSIONS.length;
    missionN = 0;
    missionPaid = false;
    save();
  }
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

function kindFor() {
  const z = zoneAt(zoneShown);
  const useNext = z.blend > 0.72 && rand() < z.blend;
  const zone = useNext ? z.upcoming : z.zone;
  const kinds = zone.kinds;
  return kinds[spawned % kinds.length];
}

function spawn(x) {
  const d = difficulty(score);
  const gap = d.gap;
  const half = gap / 2;
  // First gates wander less, so the opening teaches instead of punishing.
  const harsh = spawned < 2 ? 0 : spawned < 4 ? 0.45 : spawned < 9 ? 0.75 : 1;
  const mid = (76 + half + GROUND_Y - 76 - half) / 2;
  let center = spawned < 2 ? 392 : lastCenter * 0.85 + mid * 0.15 + (rand() * 2 - 1) * 124 * harsh;
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
  if (score >= 31 && spawned % 4 === 3) {
    const o = obstacles[obstacles.length - 1];
    o.bob = true;
    o.bobPhase = rand() * Math.PI * 2;
    o.baseTop = o.gapTop;
    o.baseBot = o.gapBot;
  }
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
  camera = camera % 640;
  shake = 0;
  flash = 0;
  wingT = 0;
  flapAgo = 9;
  glide = 0;
  shockT = 0;
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

function puff(n, power, dust) {
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
      dust: !!dust && i % 2 === 0,
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
  wingT = 0.32;
  flapAgo = 0;
  audio.flap();
  puff(4, 80, true);
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
  audio.crash();
  puff(22, 260);
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
  const quip = document.getElementById("over-quip");
  const pose = document.getElementById("over-hettie");
  let poseKey = "think";
  if (newBest) {
    kicker.textContent = "New best";
    title.textContent = "Lekker, my kind!";
    quip.textContent = "HAA-HAA-HAAA! The whole street heard that.";
    poseKey = score >= 50 ? "crown" : "cheer";
  } else if (score >= 40) {
    kicker.textContent = "What a flight";
    title.textContent = "Lekker.";
    quip.textContent = pick(QUIP_MID);
    poseKey = "cheer";
  } else if (score >= 10) {
    kicker.textContent = "Nice flight";
    title.textContent = "The suburb clapped.";
    quip.textContent = pick(QUIP_MID);
  } else {
    kicker.textContent = "Down you go";
    title.textContent = "Ag, shame.";
    quip.textContent = score <= 2 ? "Ek sê niks nie, ek sê maar net." : pick(QUIP_LOW);
    poseKey = score <= 2 ? "sleep" : "think";
  }
  if (dailyNote) quip.textContent = dailyNote + " " + quip.textContent;
  if (pose) {
    if (hettieImg[poseKey]) pose.src = hettieImg[poseKey];
    pose.hidden = !hettieImg[poseKey];
    pose.dataset.pose = poseKey;
  }
  document.getElementById("over-score").textContent = String(score);
  document.getElementById("over-best").textContent = String(best);
  document.getElementById("over-coins").textContent = fmtZ(runCoins);
  const purse = document.getElementById("over-purse");
  if (purse) purse.textContent = fmtZ(coins);
  const tier = medalTier(score);
  const nextAt = tier === "iris" ? null : tier === "gold" ? 80 : tier === "silver" ? 40 : tier === "bronze" ? 20 : 10;
  document.getElementById("over-next").textContent = nextAt ? "Next medal at " + nextAt : "The whole suburb heard you.";
  const mission = MISSIONS[missionIx] || MISSIONS[0];
  const line = document.getElementById("over-mission");
  if (line) {
    line.textContent = missionPaid
      ? "Mission done · +" + fmtZ(mission.reward)
      : mission.label + " · " + Math.min(missionN, mission.goal) + "/" + mission.goal;
  }
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
  dailyNote = "";
  const today = todayKey();
  if (!freezeSave && lastDay !== today) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yKey = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
    streak = lastDay === yKey ? Math.min(7, streak + 1) : 1;
    lastDay = today;
    const bonus = 10 + (streak - 1) * 2;
    coins += bonus;
    caption = streak > 1 ? "Vroeg op! Day " + streak + " · +" + fmtZ(bonus) : "Vroeg op! +" + fmtZ(bonus);
    captionT = 2.2;
    dailyNote = "Early-bird bonus +" + fmtZ(bonus) + ".";
    save();
  }
  if (fromTitle) {
    intro = 0.3;
    bird.x = 200;
    bird.y = 430;
  }
  mode = "play";
  botStart = time;
  if (bot && params.has("from")) {
    // Test knob: start the autopilot run partway up the score ladder.
    score = +params.get("from") || 0;
    theme = themeFor(score);
    paintTod(theme);
    tod = todTarget(score);
  }
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
  coinPill.hidden = mode === "title" || mode === "shop" || mode === "over" || mode === "ad" || mode === "settings" || mode === "exit";
  document.getElementById("btn-pause").hidden = mode !== "play";
  const hint = document.getElementById("hint");
  hint.hidden = hintSeen || mode !== "play" || hintFlaps > 0 || score > 0;
  showCoins();
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
  // Autopilot, stills and sheets never had a user gesture, so Chrome logs
  // a console error if we call vibrate. Real taps still buzz as before.
  if (params.has("bot") || params.has("still") || sheet || scene) return;
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
    titleCallT = 0;
    audio.titleCall();
    callAnim = 1.2;
  }
}

function closeShop() {
  preview = skin;
  mode = shopFrom || "title";
  if (mode === "over") fillOver();
  syncUI();
}

function renderShop() {
  document.getElementById("shop-coins").textContent = fmtZ(coins);
  const sm = document.getElementById("shop-meter");
  if (sm) sm.style.setProperty("--fill", String(coins % 10));
  const grid = document.getElementById("shop-skins");
  grid.innerHTML = "";
  for (const s of SKINS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "skin-card" + (preview === s.id ? " is-pick" : "") + (skin === s.id ? " is-on" : "");
    const have = owned.includes(s.id);
    const price = have ? (skin === s.id ? "Wearing" : "Owned") : fmtPrice(s.cost);
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
    b.textContent = maxed ? "Maxed" : fmtPrice(cost);
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
    bar.textContent = "Unlock " + s.name + "  ·  " + fmtPrice(s.cost);
    bar.disabled = false;
  } else {
    bar.textContent = "Need " + fmtZ(s.cost - coins) + " more";
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
      toast("Not enough ZarBucks yet");
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
    toast("Not enough ZarBucks yet");
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
    titleCallT = 0;
    audio.titleCall();
    callAnim = 1.2;
  }
  if (mode === "title") startGame(true);
  else if (mode === "play") flap();
  else if (mode === "dead") queueRestart = true;
  else if (mode === "over") startGame(false);
  else if (mode === "pause") resumeGame();
}

let botStart = 0;
function botThink(dt) {
  // Test knob: ?botcrash=S lets the autopilot give up after S seconds.
  if (params.has("botcrash") && time - botStart > +params.get("botcrash")) return;
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
      const u = 1 - clamp(wingT / 0.32, 0, 1);
      wing = u < 0.22 ? u / 0.22 : 1 - ((u - 0.22) / 0.78) * 1.85;
    } else wing += (-0.18 - wing) * Math.min(1, dt * 5);
    flapAgo += dt;
    shockT = Math.max(0, shockT - dt);
    const glideWant = wingT <= 0 && bird.vy > 40 ? clamp((flapAgo - 0.42) / 0.3, 0, 1) : 0;
    glide += (glideWant - glide) * Math.min(1, dt * 7);

    if (bird.y < 34) {
      bird.y = 34;
      if (bird.vy < 0) bird.vy = 40;
    }
    if (invuln > 0) invuln -= dt;

    maybeSpawn();
    for (const o of obstacles) {
      o.x -= d.speed * dt;
      if (o.bob) {
        const off = Math.sin(time * Math.PI * 2 * 0.55 + o.bobPhase) * 9;
        o.gapTop = o.baseTop + off;
        o.gapBot = o.baseBot + off;
      }
      const spec = GATE[o.kind];
      const right = o.x + spec.hit[1];
      if (!o.scored && right < bird.x) {
        o.scored = true;
        score += 1;
        audio.score();
        updateScore();
        if (MILESTONE[score]) {
          caption = MILESTONE[score];
          captionT = 1.6;
          captionEl.hidden = false;
          captionEl.textContent = caption;
          floaters.push({ text: "HAA!", x: bird.x + 24, y: bird.y - 30, vy: -40, life: 0.8, color: "#F4C3CB" });
        }
        document.getElementById("hint").hidden = true;
        rings.push({ x: bird.x, y: bird.y, r: 12, a: 0.45 });
        floaters.push({ text: "+1", x: bird.x + 18, y: bird.y - 10, vy: -42, life: 0.6, color: "#FFF8F1" });
        const clearance = Math.min(bird.y - BIRD_R - o.gapTop, o.gapBot - (bird.y + BIRD_R));
        if (clearance < 26 && clearance > -4) {
          coins += 1;
          runCoins += 1;
          shockT = 0.6;
          floaters.push({ text: "Close! +10c", x: bird.x - 8, y: bird.y - 26, vy: -30, life: 0.8, color: "#FFE7A8" });
          noteMission("sweets", 1);
        }
        if (o.kind === "site") noteMission("cranes", 1);
        const nt = themeFor(score);
        if (nt !== theme) {
          theme = nt;
          caption = THEME_NAME[nt];
          captionT = 1.7;
          captionEl.hidden = false;
          captionEl.textContent = caption;
        }
        const zname = zoneAt(zoneShown).zone.name;
        if (zname !== lastZoneName) {
          lastZoneName = zname;
          caption = zname;
          captionT = 1.6;
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
          noteMission("sweets", 1);
          audio.coin();
          if (coins % 10 === 0) {
            floaters.push({ text: "+Z$1", x: bird.x + 6, y: bird.y - 44, vy: -34, life: 0.9, color: "#FFE7A8" });
          }
          buzz(12);
          flyers.push({ x: cx, y: cy, t: 0 });
          for (let i = 0; i < 5; i++) {
            particles.push({
              x: cx, y: cy,
              vx: (rand() - 0.5) * 80,
              vy: -40 - rand() * 50,
              rot: 0, vr: 0,
              life: 0.4, max: 0.4,
              color: "#FFE7A8", len: 3, dust: true,
            });
          }
          saveTimer = 0.4;
        }
      }
      if (hits(o)) die();
    }
    obstacles = obstacles.filter((o) => o.x + GATE[o.kind].w > -50);

    const wantTod = todTarget(score);
    tod += (wantTod - tod) * Math.min(1, dt * 0.7);
    const wantZone = zoneTarget(camera);
    zoneShown += (wantZone - zoneShown) * Math.min(1, dt * 1.4);
    if (tod >= 1.85) noteMission("sunset", 1);

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
    // Crash tumble: wings flail for a beat, then fold.
    wing = deadT < 0.55 ? (Math.sin(deadT * 38) > 0 ? 0.9 : -0.7) : -0.9;
    glide = 0;
    blink = bird.vy === 0 ? 1 : 0;
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
    showCoins();
  }
  flyers = flyers.filter((f) => f.t < 1);

  if (saveTimer > 0) {
    saveTimer -= dt;
    if (saveTimer <= 0) save();
  }
  audio.tickMusic();
  if (mode === "title" && hettieSayT > 0) {
    hettieSayT -= dt;
    if (hettieSayT <= 0) {
      hettieSayIx = (hettieSayIx + 1) % HETTIE_SAY.length;
      hettieSay(HETTIE_SAY[hettieSayIx], false);
    }
  }
  // Dawn flock under the title and the first gaps; fades as the sun gets up.
  const calm = mode === "title" || mode === "shop" || mode === "settings" || mode === "exit";
  audio.setAmbience(muted ? 0 : calm ? 1 : mode === "play" || mode === "count" || mode === "pause" ? clamp(1.15 - tod, 0, 1) * 0.6 : 0.25);
  if (mode === "title" && titleCalled && !muted && audio.unlocked) {
    titleCallT += dt;
    if (titleCallT > 22) {
      titleCallT = 0;
      audio.titleCall();
      callAnim = 1.2;
    }
  }
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
  if (sheet === "bird" || sheet === "gates" || sheet === "hettie") {
    if (sheet === "bird") renderBirdSheet();
    else if (sheet === "hettie") renderHettieSheet();
    else renderGateSheet();
    return;
  }
  if (params.get("icon") === "1") {
    drawAppIcon(ctx, 390);
    return;
  }
  ctx.save();
  if (shake > 0.02 && !motionOff) {
    const m = shake * 7;
    ctx.translate((Math.random() - 0.5) * 2 * m, (Math.random() - 0.5) * 2 * m);
  }
  const here = zoneAt(zoneShown);
  const anchorId = here.blend > 0.55 ? here.upcoming.id : here.zone.id;
  paintWorld(ctx, {
    camera,
    tod: mode === "play" || mode === "dead" ? tod : theme === "night" ? 2.75 : theme === "sunset" ? 1.75 : theme === "dawn" ? 0.2 : 1.05,
    time,
    w: W,
    h: H,
    anchor: ZONE_ANCHOR[anchorId] || "limb",
    zoneTint: ZONE_TINT[here.zone.id],
  });

  if (mode === "play" || mode === "dead" || mode === "over" || mode === "ad" || mode === "pause" || mode === "count") {
    for (const o of obstacles) drawGate(ctx, o);
    for (const o of obstacles) {
      if (!o.coin || o.coin.taken) continue;
      const spec = GATE[o.kind];
      drawCoin(ctx, o.x + spec.w * 0.5, o.coin.y, time, 1);
    }
  }
  drawGround(ctx, camera);

  for (const p of particles) {
    const a = Math.max(0, p.life / p.max);
    if (p.dust) drawDust(ctx, p.x, p.y, p.len, a * 0.5);
    else {
      ctx.globalAlpha = a;
      drawFeather(ctx, p.x, p.y, p.rot, p.len, p.color);
      ctx.globalAlpha = 1;
    }
  }

  const scale = mode === "title" ? 1.08 : mode === "shop" ? 1.4 : 1;
  const bob = mode === "play" && Math.abs(bird.vy) < 150 ? Math.sin(time * 2.6) * 1.6 : 0;
  ctx.save();
  ctx.translate(bird.x, bird.y + bob);
  ctx.rotate(bird.rot);
  ctx.scale(bird.sx * scale, bird.sy * scale);
  if (invuln > 0 && Math.sin(time * 28) > 0) ctx.globalAlpha = 0.55;
  const showSkin = mode === "shop" ? preview : skin;
  const birdTod = mode === "play" || mode === "dead" ? tod : theme === "night" ? 2.75 : theme === "sunset" ? 1.75 : theme === "dawn" ? 0.2 : 1.05;
  drawHadeda(ctx, {
    wing,
    blink,
    skin: showSkin,
    beak: mode === "title" ? beak : 0,
    time,
    vy: mode === "play" ? bird.vy : 0,
    night: mode === "shop" ? 0 : clamp(birdTod - 2.2, 0, 0.6) / 0.6,
    glide: mode === "play" ? glide : 0,
    shock: mode === "play" ? clamp(shockT / 0.25, 0, 1) : 0,
    crash: mode === "dead" ? 1 : 0,
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
    drawCoin(ctx, x, y, time, 1 - e * 0.4);
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
  ctx.fillText("HAA-HAA-HAAA!", 0, 5);
  ctx.restore();
}

function roundedBubble(ctx) {
  ctx.beginPath();
  ctx.moveTo(-62, -16);
  ctx.arcTo(62, -16, 62, 16, 10);
  ctx.arcTo(62, 16, -62, 16, 10);
  ctx.arcTo(-62, 16, -62, -16, 10);
  ctx.arcTo(-62, -16, 62, -16, 10);
  ctx.closePath();
}

function renderHettieSheet() {
  ctx.fillStyle = "#F3E6D8";
  ctx.fillRect(0, 0, W, H);
  const night = params.get("tod") === "night" ? 1 : 0;
  const cells = [
    ["Wing up", { wing: 0.9 }],
    ["Wing mid", { wing: -0.18 }],
    ["Wing down", { wing: -0.8 }],
    ["Glide", { wing: -0.18, glide: 1 }],
    ["Near miss", { wing: 0.9, shock: 1 }],
    ["Crash tumble", { wing: -0.7, crash: 1, rot: 2.3 }],
  ];
  cells.forEach(([label, p], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 105 + col * 185;
    const cy = 150 + row * 245;
    ctx.save();
    ctx.translate(cx, cy);
    if (p.rot) ctx.rotate(p.rot);
    ctx.scale(1.1, 1.1);
    drawHadeda(ctx, { ...p, skin: "classic", time: 0.3 + i, night });
    ctx.restore();
    ctx.fillStyle = "#2A221C";
    ctx.font = "700 13px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, cx, cy + 112);
  });
  ctx.fillStyle = "#2A221C";
  ctx.font = "800 18px Nunito, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Hettie in flight" + (night ? " (night)" : ""), 16, 30);
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
  const kinds = ["site", "freeway", "yard", "jac"];
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

function paintTod(name) {
  tod = name === "night" ? 2.85 : name === "sunset" ? 1.8 : name === "dawn" ? 0.22 : 1.08;
  zoneShown = name === "sunset" ? 3.15 : name === "night" ? 4.05 : name === "dawn" ? 0.2 : 1.1;
}

function applyStill() {
  const skyName = params.get("tod");
  if (scene === "play") {
    const wanted = skyName || "day";
    const scoreMap = { dawn: 4, day: 14, sunset: 26, night: 48 };
    score = scoreMap[wanted] ?? 14;
    theme = themeFor(score);
    if (skyName) theme = skyName;
    paintTod(theme);
    mode = "play";
    bird.x = 118;
    bird.y = 392;
    bird.vy = -80;
    bird.rot = -0.28;
    wing = 0.7;
    camera = 240;
    const gap = 248;
    const pair = theme === "sunset" ? "jac" : theme === "night" ? "yard" : theme === "dawn" ? "freeway" : "site";
    obstacles = [
      { kind: pair, variant: 0, x: 150, gapTop: 400 - gap / 2, gapBot: 400 + gap / 2, scored: false, coin: { y: 400, taken: false } },
    ];
    coins = Math.max(coins, 14);
    runCoins = 3;
    updateScore();
    if (params.has("near")) {
      // Near miss: skimming under the top gate, eyes wide.
      bird.x = 150;
      bird.y = 400 - gap / 2 + 30;
      bird.rot = 0.12;
      wing = -0.8;
      shockT = 0.6;
      floaters.push({ text: "Close! +10c", x: bird.x - 8, y: bird.y - 34, vy: 0, life: 0.8, color: "#FFE7A8" });
    } else if (params.has("crash")) {
      // Crash tumble: knocked off the gate edge, wings everywhere.
      mode = "dead";
      deadT = 0.2;
      bird.x = 136;
      bird.y = 400 - gap / 2 + 40;
      bird.vy = 320;
      bird.rot = 1.95;
      wing = 0.9;
      flash = 0.18;
      puff(16, 200);
    }
  } else if (scene === "over") {
    score = +(params.get("score") || 42);
    best = Math.max(best, score, +(params.get("best") || 0));
    newBest = score >= best;
    runCoins = 8;
    theme = themeFor(score);
    paintTod(theme);
    mode = "over";
    bird.x = 150;
    bird.y = GROUND_Y - 18;
    bird.rot = 0.72;
    wing = -0.15;
    blink = 1;
    camera = 420;
    obstacles = [
      { kind: "jac", variant: 0, x: -20, gapTop: 280, gapBot: 560, scored: true, coin: null },
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
    theme = skyName || "dawn";
    paintTod(theme);
    camera = 120;
    bird.x = 198;
    bird.y = 392;
    bird.rot = -0.2;
    wing = 0.82;
    beak = 0.7;
    callAnim = 0.7;
  } else if (scene === "settings") {
    mode = "settings";
    theme = skyName || "day";
    paintTod(theme);
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
  loadHettie();
  hettieSay(HETTIE_SAY[0], false);
  loadArt()
    .then(() => {
      const pic = coinImage();
      const icon = document.getElementById("coin-icon");
      if (pic && icon) icon.src = pic.src;
    })
    .catch(() => {});
  if (migratedFrom > 0 && !freezeSave) {
    toast("Your " + migratedFrom + " koeksisters are now " + fmtZ(migratedFrom) + " in 10c coins");
    save();
  }
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
  document.getElementById("ad-kicker").textContent = "Small change";
  document.getElementById("ad-title").textContent = "Twice the ZarBucks";
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
    titleCallT = 0;
    audio.titleCall();
    callAnim = 1.2;
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
