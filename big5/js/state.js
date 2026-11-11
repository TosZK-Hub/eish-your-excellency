/* Care, economy, and save. Patterns follow the lodge toy in tokoloshe/
   (local save, soft floors, streak, shop) and were rewritten for Big 5. */
(function (B) {
  'use strict';

  const KEY = 'big5-lodge-v1';

  const ANIMALS = [
    {
      id: 'lion',
      title: 'Lion',
      youngWord: 'cub',
      personality: 'Small roar, big heart. Sure the sun clocks in for him.',
      names: ['Lerato', 'Tau', 'Khosi', 'Sizwe'],
      stages: ['Cub', 'Youngster', 'Lion', 'Legend']
    },
    {
      id: 'leopard',
      title: 'Leopard',
      youngWord: 'cub',
      personality: 'Quiet, then sudden. Calls the laundry basket stealth.',
      names: ['Naledi', 'Zola', 'Thandi', 'Ingwe'],
      stages: ['Cub', 'Youngster', 'Leopard', 'Legend']
    },
    {
      id: 'elephant',
      title: 'Elephant',
      youngWord: 'calf',
      personality: 'Remembers every snack. Sprays when happy, which is often.',
      names: ['Amahle', 'Lindi', 'Ndlovu', 'Tembo'],
      stages: ['Calf', 'Youngster', 'Elephant', 'Legend']
    },
    {
      id: 'rhino',
      title: 'Rhino',
      youngWord: 'calf',
      personality: 'Gentle tank. Only charges toward the melon.',
      names: ['Bheki', 'Thabo', 'Nandi', 'Sello'],
      stages: ['Calf', 'Youngster', 'Rhino', 'Legend']
    },
    {
      id: 'buffalo',
      title: 'Buffalo',
      youngWord: 'calf',
      personality: 'The herd\'s little boss. Naps like it is a meeting.',
      names: ['Ayanda', 'Jabu', 'Nomsa', 'Vusi'],
      stages: ['Calf', 'Youngster', 'Buffalo', 'Legend']
    }
  ];

  const FOODS = {
    lion: [
      { id: 'wors', name: 'Wors bite', hunger: 28, fun: 6, clean: -2, energy: 2, xp: 10 },
      { id: 'biltong', name: 'Biltong', hunger: 24, fun: 4, clean: 0, energy: 3, xp: 9 },
      { id: 'milk', name: 'Warm milk', hunger: 18, fun: 10, clean: 1, energy: 2, xp: 8, sweet: true },
      { id: 'broth', name: 'Bone broth', hunger: 30, fun: 3, clean: 0, energy: 6, xp: 11 }
    ],
    leopard: [
      { id: 'biltong', name: 'Biltong', hunger: 26, fun: 5, clean: 0, energy: 3, xp: 9 },
      { id: 'drum', name: 'Drumstick', hunger: 28, fun: 7, clean: -2, energy: 2, xp: 10 },
      { id: 'milk', name: 'Warm milk', hunger: 16, fun: 10, clean: 1, energy: 2, xp: 8, sweet: true },
      { id: 'egg', name: 'Boiled egg', hunger: 20, fun: 4, clean: 0, energy: 4, xp: 8 }
    ],
    elephant: [
      { id: 'marula', name: 'Marula', hunger: 26, fun: 12, clean: -1, energy: 3, xp: 10, sweet: true },
      { id: 'naartjie', name: 'Naartjie', hunger: 18, fun: 8, clean: 2, energy: 3, xp: 8, sweet: true },
      { id: 'melon', name: 'Melon', hunger: 24, fun: 8, clean: 1, energy: 2, xp: 9, sweet: true },
      { id: 'leaves', name: 'Sweet leaves', hunger: 30, fun: 3, clean: 0, energy: 5, xp: 11 }
    ],
    rhino: [
      { id: 'lucerne', name: 'Lucerne', hunger: 30, fun: 3, clean: 0, energy: 5, xp: 10 },
      { id: 'melon', name: 'Melon', hunger: 22, fun: 9, clean: 1, energy: 2, xp: 9, sweet: true },
      { id: 'carrot', name: 'Carrot', hunger: 20, fun: 5, clean: 1, energy: 3, xp: 8 },
      { id: 'grass', name: 'Green grass', hunger: 28, fun: 2, clean: 0, energy: 4, xp: 9 }
    ],
    buffalo: [
      { id: 'mielie', name: 'Mielie', hunger: 26, fun: 6, clean: 0, energy: 4, xp: 9 },
      { id: 'grass', name: 'Green grass', hunger: 28, fun: 2, clean: 0, energy: 5, xp: 9 },
      { id: 'salt', name: 'Salt lick', hunger: 14, fun: 8, clean: 0, energy: 2, xp: 8 },
      { id: 'lucerne', name: 'Lucerne', hunger: 30, fun: 3, clean: 0, energy: 5, xp: 10 }
    ]
  };

  const ITEMS = [
    { id: 'bandana', name: 'Bush bandana', slot: 'neck', price: 16 },
    { id: 'beads', name: 'Lucky beads', slot: 'neck', price: 18 },
    { id: 'bell', name: 'Bell collar', slot: 'charm', price: 18 },
    { id: 'flower', name: 'Flower crown', slot: 'hat', price: 20 },
    { id: 'bucket', name: 'Bucket hat', slot: 'hat', price: 22 },
    { id: 'shades', name: 'Sun shades', slot: 'face', price: 24 },
    { id: 'scarf', name: 'Gold scarf', slot: 'neck', price: 26 },
    { id: 'safari', name: 'Safari hat', slot: 'hat', price: 30 },
    { id: 'sun', name: 'Sun pendant', slot: 'charm', price: 0, earned: 'legend' }
  ];

  const DECOR = [
    { id: 'kettle', name: 'Lodge kettle', price: 0 },
    { id: 'hadeda', name: 'Hadeda visitor', price: 14 },
    { id: 'lantern', name: 'Stoep lantern', price: 16 },
    { id: 'acacia', name: 'Pot acacia', price: 18 }
  ];

  const BOOSTS = [
    { id: 'spring', game: 'dash', name: 'Higher spring', max: 3, price: 16 },
    { id: 'basket', game: 'fruit', name: 'Wider catch', max: 3, price: 16 },
    { id: 'spray', game: 'splash', name: 'Bigger splash', max: 3, price: 16 },
    { id: 'focus', game: 'pounce', name: 'Wider focus', max: 3, price: 16 }
  ];

  const FLOOR = 32;

  function fresh() {
    return {
      v: 1,
      animal: null,
      petName: '',
      hunger: 72,
      clean: 78,
      energy: 80,
      fun: 76,
      coins: 36,
      xp: 0,
      level: 1,
      stageSeen: 1,
      legendOn: false,
      legendSeen: false,
      owned: [],
      worn: { hat: null, neck: null, face: null, charm: null },
      best: { dash: 0, fruit: 0, splash: 0, pounce: 0 },
      upgrades: { spring: 0, basket: 0, spray: 0, focus: 0 },
      decorOwned: ['kettle'],
      decorOn: { kettle: true, hadeda: false, lantern: false, acacia: false },
      achievements: [],
      streak: 0,
      lastGift: null,
      seenIntro: false,
      poos: [],
      muted: false,
      lastTick: Date.now()
    };
  }

  function xpNeed(level) {
    return 24 + (level - 1) * 10;
  }

  function stageFromLevel(level) {
    if (level >= 6) return 3;
    if (level >= 3) return 2;
    return 1;
  }

  function num(p, key, min, max, fallback) {
    const n = Number(p[key]);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function sanitize(p) {
    const d = fresh();
    if (!p || typeof p !== 'object') return d;
    const animal = ANIMALS.find((a) => a.id === p.animal);
    d.animal = animal ? animal.id : null;
    d.petName = typeof p.petName === 'string' ? p.petName.replace(/[^\w\s'-]/g, '').slice(0, 16) : '';
    d.seenIntro = !!(p.seenIntro && d.animal && d.petName);
    if (!d.seenIntro) {
      d.animal = null;
      d.petName = '';
    }
    d.hunger = num(p, 'hunger', 0, 100, d.hunger);
    d.clean = num(p, 'clean', 0, 100, d.clean);
    d.energy = num(p, 'energy', 0, 100, d.energy);
    d.fun = num(p, 'fun', 0, 100, d.fun);
    d.coins = Math.floor(num(p, 'coins', 0, 9999, d.coins));
    d.level = Math.floor(num(p, 'level', 1, 30, 1));
    d.xp = num(p, 'xp', 0, 100000, 0);
    d.stageSeen = Math.floor(num(p, 'stageSeen', 1, 3, 1));
    d.legendOn = !!p.legendOn && d.level >= 9;
    d.legendSeen = !!p.legendSeen && d.level >= 9;
    d.muted = !!p.muted;
    d.lastGift = typeof p.lastGift === 'string' ? p.lastGift : null;
    d.owned = Array.isArray(p.owned) ? p.owned.filter((id) => ITEMS.some((item) => item.id === id)) : [];
    if (p.worn && typeof p.worn === 'object') {
      Object.keys(d.worn).forEach((slot) => {
        const id = p.worn[slot];
        const item = ITEMS.find((entry) => entry.id === id && entry.slot === slot);
        if (item && d.owned.indexOf(id) !== -1) d.worn[slot] = id;
      });
    }
    if (p.best && typeof p.best === 'object') {
      ['dash', 'fruit', 'splash', 'pounce'].forEach((key) => {
        const n = Number(p.best[key]);
        if (Number.isFinite(n)) d.best[key] = Math.max(0, Math.min(99999, Math.floor(n)));
      });
    }
    if (p.upgrades && typeof p.upgrades === 'object') {
      ['spring', 'basket', 'spray', 'focus'].forEach((key) => {
        const n = Number(p.upgrades[key]);
        if (Number.isFinite(n)) d.upgrades[key] = Math.max(0, Math.min(3, Math.floor(n)));
      });
    }
    d.decorOwned = Array.isArray(p.decorOwned)
      ? p.decorOwned.filter((id) => DECOR.some((item) => item.id === id))
      : ['kettle'];
    if (d.decorOwned.indexOf('kettle') === -1) d.decorOwned.unshift('kettle');
    if (p.decorOn && typeof p.decorOn === 'object') {
      DECOR.forEach((item) => {
        if (d.decorOwned.indexOf(item.id) !== -1) d.decorOn[item.id] = !!p.decorOn[item.id];
      });
    }
    d.achievements = Array.isArray(p.achievements)
      ? p.achievements.filter((id) => typeof id === 'string').slice(0, 24)
      : [];
    d.streak = Math.max(0, Math.min(999, Math.floor(num(p, 'streak', 0, 999, 0))));
    if (Array.isArray(p.poos)) d.poos = p.poos.filter((n) => n === 0 || n === 1).slice(0, 2);
    const last = Number(p.lastTick);
    if (Number.isFinite(last)) {
      const elapsed = Math.max(0, Math.min(Date.now() - last, 1000 * 60 * 30));
      const mins = elapsed / 60000;
      if (mins > 0.5) {
        d.hunger = Math.max(FLOOR, d.hunger - mins * 0.7);
        d.clean = Math.max(FLOOR, d.clean - mins * 0.45);
        d.energy = Math.max(FLOOR, d.energy - mins * 0.55);
        d.fun = Math.max(FLOOR, d.fun - mins * 0.5);
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
    } catch (err) { /* private mode should not crash the toy */ }
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

  function animalById(id) {
    return ANIMALS.find((a) => a.id === id) || ANIMALS[0];
  }

  B.clamp = function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  };
  B.FLOOR = FLOOR;
  B.animals = ANIMALS;
  B.foods = FOODS;
  B.items = ITEMS;
  B.decor = DECOR;
  B.boosts = BOOSTS;
  B.xpNeed = xpNeed;
  B.stageFromLevel = stageFromLevel;
  B.todayKey = todayKey;
  B.animalById = animalById;
  B.state = { data, save, addXp, fresh, KEY };
})(window.Big5 = window.Big5 || {});
