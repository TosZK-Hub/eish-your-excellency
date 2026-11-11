(function (T) {
  'use strict';

  const KEY = 'my-tokoloshe-v1';

  const ITEMS = [
    { id: 'bucket', name: 'Bucket hat', slot: 'hat', price: 20, level: 1 },
    { id: 'jersey', name: 'Rugby jersey', slot: 'top', price: 30, level: 1 },
    { id: 'beanie', name: 'Beanie', slot: 'hat', price: 25, level: 2 },
    { id: 'visor', name: 'Sun visor', slot: 'hat', price: 25, level: 2 },
    { id: 'takkies', name: 'Takkies', slot: 'shoes', price: 25, level: 2 },
    { id: 'shades', name: 'Sunglasses', slot: 'face', price: 30, level: 2 },
    { id: 'safari', name: 'Safari shirt', slot: 'top', price: 35, level: 3 },
    { id: 'apron', name: 'Braai apron', slot: 'top', price: 40, level: 3 },
    { id: 'beads', name: 'Lucky beads', slot: 'charm', price: 35, level: 3 },
    { id: 'vellies', name: 'Vellies', slot: 'shoes', price: 35, level: 3 },
    { id: 'pebble', name: 'Pebble charm', slot: 'charm', price: 40, level: 4 }
  ];

  const FOODS = [
    { id: 'vetkoek', name: 'Vetkoek', hunger: 26, fun: 8, clean: -3, energy: 1, xp: 6, sweet: true },
    { id: 'mielie', name: 'Mielie', hunger: 24, fun: 3, clean: 0, energy: 5, xp: 8, sweet: false },
    { id: 'wors', name: 'Wors roll', hunger: 30, fun: 7, clean: -2, energy: 2, xp: 8, sweet: false },
    { id: 'rusk', name: 'Rusk', hunger: 16, fun: 4, clean: -1, energy: 1, xp: 5, sweet: false },
    { id: 'koeksister', name: 'Koeksister', hunger: 14, fun: 14, clean: -4, energy: 0, xp: 6, sweet: true },
    { id: 'pap', name: 'Pap', title: 'Pap and chakalaka', hunger: 34, fun: 4, clean: 0, energy: 6, xp: 10, sweet: false },
    { id: 'orange', name: 'Orange', hunger: 22, fun: 3, clean: 2, energy: 4, xp: 8, sweet: false }
  ];

  function fresh() {
    return {
      v: 1,
      hunger: 64,
      clean: 72,
      energy: 80,
      fun: 76,
      coins: 60,
      xp: 0,
      level: 1,
      owned: [],
      worn: { hat: null, top: null, shoes: null, face: null, charm: null },
      best: { hop: 0, taxi: 0, mielie: 0 },
      lastGift: null,
      seenIntro: false,
      poos: [0],
      muted: false,
      saltSwapped: false,
      lastTick: Date.now()
    };
  }

  function xpNeed(level) {
    return 30 + (level - 1) * 20;
  }

  function num(p, key, min, max, fallback) {
    const n = Number(p[key]);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function sanitize(p) {
    const d = fresh();
    if (!p || typeof p !== 'object') return d;
    d.hunger = num(p, 'hunger', 0, 100, d.hunger);
    d.clean = num(p, 'clean', 0, 100, d.clean);
    d.energy = num(p, 'energy', 0, 100, d.energy);
    d.fun = num(p, 'fun', 0, 100, d.fun);
    d.coins = Math.floor(num(p, 'coins', 0, 9999, d.coins));
    d.level = Math.floor(num(p, 'level', 1, 30, 1));
    d.xp = num(p, 'xp', 0, 100000, 0);
    d.muted = !!p.muted;
    d.seenIntro = !!p.seenIntro;
    d.saltSwapped = !!p.saltSwapped;
    d.lastGift = typeof p.lastGift === 'string' ? p.lastGift : null;
    d.owned = Array.isArray(p.owned) ? p.owned.filter((id) => ITEMS.some((item) => item.id === id)) : [];
    if (p.worn && typeof p.worn === 'object') {
      Object.keys(d.worn).forEach((slot) => {
        const id = p.worn[slot];
        const item = ITEMS.find((entry) => entry.id === id && entry.slot === slot);
        if (item && d.owned.indexOf(id) !== -1) d.worn[slot] = id;
      });
    }
    d.best = {
      hop: 0,
      taxi: 0,
      mielie: 0
    };
    if (p.best && typeof p.best === 'object') {
      ['hop', 'taxi', 'mielie'].forEach((key) => {
        const n = Number(p.best[key]);
        if (Number.isFinite(n)) d.best[key] = Math.max(0, Math.min(99999, Math.floor(n)));
      });
    }
    if (Array.isArray(p.poos)) {
      d.poos = p.poos.filter((n) => n === 0 || n === 1 || n === 2).slice(0, 3);
    } else if (typeof p.poos === 'number') {
      const count = Math.max(0, Math.min(3, p.poos | 0));
      d.poos = [0, 1, 2].slice(0, count);
    }
    const last = Number(p.lastTick);
    if (Number.isFinite(last)) {
      const elapsed = Math.max(0, Math.min(Date.now() - last, 1000 * 60 * 45));
      const mins = elapsed / 60000;
      if (mins > 0.5) {
        d.hunger = Math.max(20, d.hunger - mins * 1.1);
        d.clean = Math.max(20, d.clean - mins * 0.7);
        d.energy = Math.max(20, d.energy - mins * 0.9);
        d.fun = Math.max(20, d.fun - mins * 1.0);
      }
    }
    d.lastTick = Date.now();
    return d;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      return sanitize(JSON.parse(raw));
    } catch (err) {
      return fresh();
    }
  }

  const data = load();

  function save() {
    data.lastTick = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (err) {
      /* private mode or a full disk should not crash the toy */
    }
  }

  function addXp(amount) {
    data.xp += amount;
    let levels = 0;
    while (data.level < 20 && data.xp >= xpNeed(data.level)) {
      data.xp -= xpNeed(data.level);
      data.level += 1;
      levels += 1;
    }
    return levels;
  }

  function todayKey() {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }

  T.clamp = function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  };
  T.items = ITEMS;
  T.foods = FOODS;
  T.xpNeed = xpNeed;
  T.todayKey = todayKey;
  T.state = { data, save, addXp, fresh, KEY };
})(window.Toko = window.Toko || {});
