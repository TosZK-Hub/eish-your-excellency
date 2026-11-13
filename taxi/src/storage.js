const KEY = 'trr_save_v1';

function fresh() {
  return {
    unlocked: 1,
    stars: {},
    coins: 0,
    livery: 'plain',
    owned: ['plain'],
    sound: true,
    music: true,
    arrows: false,
    dailyDate: '',
    dailyStreak: 0,
    dailyStars: 0,
  };
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const data = { ...fresh(), ...JSON.parse(raw) };
    if (!Array.isArray(data.owned) || !data.owned.includes('plain')) {
      data.owned = ['plain', ...(data.owned || []).filter((id) => id !== 'plain')];
    }
    if (!data.stars || typeof data.stars !== 'object') data.stars = {};
    return data;
  } catch {
    return fresh();
  }
}

function persist(save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    /* private mode or a full disk — the session still plays */
  }
}

export function reset() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function starsFor(save, id) {
  return save.stars[String(id)] || 0;
}

export function awardLevel(id, stars) {
  const save = load();
  const prev = starsFor(save, id);
  let gain = 0;
  if (!prev) gain = 8 + stars * 6;
  else if (stars > prev) gain = (stars - prev) * 6;
  else gain = 2;
  save.coins += gain;
  save.stars[String(id)] = Math.max(prev, stars);
  if (id >= save.unlocked && id < 60) save.unlocked = id + 1;
  persist(save);
  return { gain, save };
}

function dateParts(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function awardDaily(date, stars) {
  const save = load();
  const first = save.dailyDate !== date;
  let gain = 0;
  if (first) {
    if (save.dailyDate) {
      const prev = dateParts(save.dailyDate);
      const today = dateParts(date);
      const diff = Math.round((today - prev) / 86400000);
      save.dailyStreak = diff === 1 ? (save.dailyStreak || 0) + 1 : 1;
    } else {
      save.dailyStreak = 1;
    }
    gain = 12 + stars * 4;
    save.coins += gain;
    save.dailyDate = date;
    save.dailyStars = stars;
  } else if (stars > (save.dailyStars || 0)) {
    save.dailyStars = stars;
  }
  persist(save);
  return { gain, save, first };
}

export function buyLivery(id, price) {
  const save = load();
  if (save.owned.includes(id)) return { ok: true, save, already: true };
  if (save.coins < price) return { ok: false, reason: 'coins', save };
  save.coins -= price;
  save.owned.push(id);
  save.livery = id;
  persist(save);
  return { ok: true, save };
}

export function equipLivery(id) {
  const save = load();
  if (!save.owned.includes(id)) return save;
  save.livery = id;
  persist(save);
  return save;
}

export function setSound(on) {
  const save = load();
  save.sound = !!on;
  persist(save);
  return save;
}

export function setMusic(on) {
  const save = load();
  save.music = !!on;
  persist(save);
  return save;
}

export function setArrows(on) {
  const save = load();
  save.arrows = !!on;
  persist(save);
  return save;
}
