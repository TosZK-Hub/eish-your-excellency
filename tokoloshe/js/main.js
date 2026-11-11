(function (T) {
  'use strict';

  const app = document.getElementById('app');
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('view');
  const ctx = canvas.getContext('2d');
  const speech = document.getElementById('speech');
  const toastEl = document.getElementById('toast');
  const banner = document.getElementById('banner');
  const hint = document.getElementById('hint');
  const trayBody = document.getElementById('tray-body');
  const modalEl = document.getElementById('modal');
  const gameover = document.getElementById('gameover');
  const hudLive = document.getElementById('hud-live');
  const hudPlay = document.getElementById('hud-play');
  const coinNum = document.getElementById('coin-num');
  const lvlEl = document.getElementById('lvl');
  const xpbar = document.getElementById('xpbar');
  const muteBtn = document.getElementById('mute');
  const gScore = document.getElementById('g-score');
  const gTime = document.getElementById('g-time');
  const gExtra = document.getElementById('g-extra');
  const gExtraLabel = document.getElementById('g-extra-label');

  const data = T.state.data;
  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rooms = ['kitchen', 'bath', 'stoep', 'shop', 'play'];

  const lines = {
    greet: ['Howzit!', 'Sharp sharp, you came back.', 'Eish, I missed you.'],
    eatGood: ['Lekker!', 'Yoh, that hit the spot.', 'Sharp, more of that.'],
    eatSweet: ['Yoh, sweet tooth!', 'Hehe, syrup everywhere.', 'Lekker. I regret nothing.'],
    hungry: ['Eish, my tummy.', 'Ag shame, feed me?', 'I could eat a whole mielie.'],
    dirty: ['Ag shame, I am grubby.', 'Eish, flies. Rude.', 'Bath time, sharp sharp.'],
    clean: ['Lekker and shiny!', 'Hehe, bubbles.', 'Sharp, I smell like soap.'],
    sleep: ['Night night.', 'Eish, so sleepy.', 'Wake me if the lights come back.'],
    wake: ['Yoh, I am up!', 'Howzit. Morning-ish.', 'Sharp sharp.'],
    tickle: ['Hehehe!', 'Eish, stop. No, do not.', 'Yoh, that tickles!'],
    shy: ['Hehe, you cannot see me.', 'I am basically a pebble.', 'Shh. I am invisible.'],
    found: ['Yoh! Sharp eyes.', 'Ag, you found me.', 'Eish, fine, I am here.'],
    poo: ['Hehe. Eish.', 'That was not me. It was me.', 'Bathroom? Sharp sharp.'],
    scoop: ['Ag shame, thanks.', 'Lekker, all gone.', 'You are a real pal.'],
    shed: ['Eish, the lights!', 'Load shedding. I have the candle.', 'Yoh, it is dark. Come closer.'],
    shedOn: ['Sharp sharp, they are back.', 'Lekker, light!', 'Hehe, I kept the candle anyway.'],
    socks: ['Hehe. Where is your other sock?', 'Socks are mine now.', 'Eish, laundry gremlins.'],
    honk: ['HOOT.', 'Hehe, hoot hoot!', 'Yoh, that horn works.'],
    salt: ['I only swapped the labels.', 'Hehe, salt in the tea.', 'Ag, it is a tiny prank.'],
    hide: ['Hehe, under the bed!', 'Bricks will not stop me.', 'Peekaboo from down here.'],
    locked: ['A bit more play and it is yours.', 'Level up first, then hats.', 'Soon. Sharp sharp.'],
    poor: ['Eish, not enough coins.', 'Almost. Play a game?', 'Ag shame, the price.'],
    miss: ['Eish, my mouth is up here.', 'Ag, so close.', 'Aim for the grin.'],
    bored: ['Eish, play with me.', 'Ag, I am bored.', 'Game room? I am keen.']
  };

  let room = 'kitchen';
  let W = 360;
  let H = 360;
  let last = 0;
  let hudTick = 0;
  let drag = null;
  let gesture = null;
  let modalOn = false;
  let currentModal = null;
  const modalQ = [];
  const hotspots = [];
  const anchors = { mouth: null, head: null, hand: null };
  const marks = {};
  const particles = [];
  const floaters = [];
  let toastTimer = 0;

  const session = {
    t: 0,
    foam: 0,
    rinsing: 0,
    sleeping: false,
    hiding: false,
    hideLeft: 0,
    shedding: 0,
    shedIn: 22,
    lampOn: true,
    prank: null,
    prankIn: 12,
    prankN: 0,
    eat: 0,
    giggle: 0,
    shy: 0,
    scrubbing: false,
    scrubDist: 0,
    lastSqueak: 0,
    lastTickle: 0,
    tickleTimes: [],
    tickleXp: 0,
    sleepPaid: false,
    pooIn: 58,
    lookX: 0,
    lookY: 0,
    taste: null,
    tasteT: 0,
    pop: 0,
    mischief: null,
    mischiefIn: 8,
    pointer: null,
    saveIn: 2,
    greeted: false,
    dragging: false
  };

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function say(text, sec) {
    speech.textContent = text;
    speech.hidden = false;
    session.speech = sec || 2.7;
    positionSpeech();
  }

  function toast(text) {
    toastEl.textContent = text;
    toastEl.hidden = false;
    toastTimer = 2.2;
  }

  function positionSpeech() {
    speech.style.top = '8px';
    speech.style.transform = 'translateX(-50%)';
    speech.style.left = room === 'kitchen' ? '68%' : room === 'stoep' ? '34%' : '50%';
  }

  function renderHud() {
    coinNum.textContent = String(data.coins);
    lvlEl.textContent = 'Lv ' + data.level + (data.streak ? ' · ' + data.streak + 'd' : '');
    const need = T.xpNeed(data.level);
    xpbar.style.width = Math.max(0, Math.min(100, (data.xp / need) * 100)) + '%';
    ['hunger', 'clean', 'energy', 'fun'].forEach((key) => {
      const meter = document.querySelector('.meter[data-k="' + key + '"]');
      const value = Math.round(data[key]);
      meter.querySelector('b').textContent = String(value);
      meter.querySelector('.bar i').style.width = value + '%';
      meter.classList.toggle('low', value < 28);
    });
    muteBtn.textContent = data.muted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', data.muted ? 'Unmute sound' : 'Mute sound');
  }

  function onLevel(n) {
    if (!n) return;
    const unlocked = T.items.filter((item) => item.level === data.level).map((item) => item.name);
    toast('Level ' + data.level + '!' + (unlocked.length ? ' ' + unlocked[0] + ' unlocked.' : ''));
    T.audio.chime();
    renderHud();
  }

  function bumpSave() {
    renderHud();
    T.state.save();
  }

  function moodLine() {
    if (data.hunger < 36) return pick(lines.hungry);
    if (data.clean < 36) return pick(lines.dirty);
    if (data.energy < 36) return pick(lines.sleep);
    if (data.fun < 36) return pick(lines.bored);
    return pick(lines.greet);
  }

  function buildAnim() {
    const worn = data.worn;
    let eyes = 'open';
    let mouth = 'smile';
    let brow = 'none';
    let blush = 0.4;
    let armL = 1.95;
    let armR = 1.22;
    let pose = 'stand';
    if (room === 'bath' || (room === 'stoep' && !session.hiding)) pose = 'sit';
    if (session.sleeping) {
      eyes = 'shut';
      mouth = 'small';
    } else if (data.energy < 34) {
      eyes = 'open';
      mouth = 'small';
      session.lid = 0.62;
    } else if (data.hunger < 36) {
      brow = 'worry';
      mouth = 'frown';
      armR = 2.35;
    } else if (data.fun > 68 && data.clean > 48 && data.hunger > 48) {
      mouth = 'grin';
      blush = 0.6;
    }
    if (session.lid == null) session.lid = 0;
    if (data.energy >= 34) session.lid = 0;
    if (room === 'play' && !session.sleeping) {
      armR = -0.7 + Math.sin(session.t * 4) * 0.35;
      mouth = 'grin';
    }
    if (session.giggle > 0) {
      eyes = 'happy';
      mouth = 'open';
      blush = 0.85;
      armL = -2.55;
      armR = -0.55;
    }
    if (session.eat > 0) {
      mouth = 'open';
      eyes = 'happy';
      armR = -2.35;
    }
    if (session.taste === 'yum') {
      mouth = 'yum';
      eyes = 'happy';
      blush = 0.9;
    } else if (session.taste === 'yuck') {
      mouth = 'yuck';
      eyes = 'open';
      brow = 'worry';
    }
    if (data.fun < 36 && data.energy >= 34 && data.hunger >= 36 && !session.sleeping) {
      session.lid = 0.35;
      mouth = mouth === 'grin' ? 'small' : mouth;
    }
    if (session.scrubbing && room === 'bath') {
      armR = 0.4 + Math.sin(session.t * 16) * 0.45;
    }
    let hold = null;
    if (session.prank && session.prank.type === 'honk') {
      hold = 'horn';
      armR = -0.25;
      mouth = 'grin';
    }
    if (session.shedding > 0) {
      hold = 'candle';
      armR = 0.62;
      eyes = 'open';
      mouth = 'oh';
    }
    const dirt = T.clamp((50 - data.clean) / 50, 0, 1);
    let alpha = 1;
    if (session.shy > 0) {
      alpha = session.shy > 1 ? 0.13 : 0.13 + (1 - session.shy) * 0.87;
    }
    return T.makeAnim(session.t, {
      eyes: eyes,
      mouth: mouth,
      brow: brow,
      blush: blush,
      armL: armL,
      armR: armR,
      pose: pose,
      foam: session.foam,
      dirt: dirt,
      alpha: alpha,
      worn: worn,
      hold: hold,
      shy: session.shy > 0,
      shake: !reduced && session.giggle > 0 ? 1.4 : 0,
      squash: (session.pop || 0) + (session.eat > 0 ? Math.sin(session.eat * 16) * 0.06 : 0),
      lookX: session.lookX,
      lookY: session.lookY || 0,
      lid: session.lid || 0,
      lean: session.mischief && session.mischief.type === 'peek' ? 0.22 : 0,
      crouch: !!(session.mischief && session.mischief.type === 'hide'),
      chew: session.eat > 0,
      leg: session.t * 8
    });
  }

  function renderTray() {
    const hints = {
      kitchen: 'Drag a snack to my mouth.',
      bath: 'Rub me soapy, then rinse. Tap a poo, or use the scoop.',
      stoep: 'Lamp to sleep. Tickle me. Peek under the bed. The wall box drops the lights.',
      shop: 'Wardrobe shop. You have ' + data.coins + ' coins.',
      play: 'Four short games. Spend coins on boosts.'
    };
    hint.textContent = hints[room] || '';
    if (room === 'kitchen') {
      trayBody.innerHTML = '<div class="grid4">' + T.foods.map((food) => {
        return '<button type="button" class="food" data-food="' + food.id + '" aria-label="' + (food.title || food.name) + '"><span class="ico">' +
          (T.icons.foods[food.id] || '') + '</span><span class="nm">' + food.name + '</span></button>';
      }).join('') + '</div>';
      trayBody.querySelectorAll('.food').forEach((btn) => {
        const food = T.foods.find((entry) => entry.id === btn.dataset.food);
        btn.addEventListener('pointerdown', (e) => startFoodDrag(e, btn, food));
      });
    } else if (room === 'bath') {
      trayBody.innerHTML = '<div class="grid3">' +
        '<button type="button" class="tool" data-tool="soap"><span class="ico">' + T.icons.tools.soap + '</span>Soap</button>' +
        '<button type="button" class="tool" data-tool="shower"><span class="ico">' + T.icons.tools.shower + '</span>Rinse</button>' +
        '<button type="button" class="tool" data-tool="scoop"><span class="ico">' + T.icons.tools.scoop + '</span>Scoop</button>' +
        '</div>';
      trayBody.querySelector('[data-tool="soap"]').addEventListener('click', () => {
        T.audio.blip();
        say('Rub my tummy till I foam.');
      });
      trayBody.querySelector('[data-tool="shower"]').addEventListener('click', () => rinse());
      trayBody.querySelector('[data-tool="scoop"]').addEventListener('click', () => scoop(null));
    } else if (room === 'shop') {
      trayBody.innerHTML = '<div class="grid4">' + T.items.map((item) => {
        const owned = data.owned.indexOf(item.id) !== -1;
        const locked = data.level < item.level;
        const worn = data.worn[item.slot] === item.id;
        let meta = item.price + ' coins';
        let metaClass = 'price';
        if (locked) { meta = 'Lv ' + item.level; metaClass = ''; }
        else if (worn) { meta = 'Wearing'; metaClass = ''; }
        else if (owned) { meta = 'Wear'; metaClass = ''; }
        return '<button type="button" class="item' + (worn ? ' worn' : '') + (locked ? ' locked' : '') + '" data-item="' + item.id + '">' +
          '<span class="ico">' + (T.icons.items[item.id] || '') + '</span>' +
          '<span class="nm">' + item.name + '</span>' +
          '<span class="meta ' + metaClass + '">' + meta + '</span></button>';
      }).join('') + '</div><div class="grid3" style="margin-top:6px">' + T.decor.map((item) => {
        const owned = data.decorOwned.indexOf(item.id) !== -1;
        const on = owned && data.decorOn[item.id];
        const locked = data.level < item.level;
        const meta = locked ? 'Lv ' + item.level : owned ? (on ? 'In the room' : 'Put it out') : item.price + ' coins';
        return '<button type="button" class="item' + (on ? ' worn' : '') + (locked ? ' locked' : '') + '" data-decor="' + item.id + '"><span class="nm">' + item.name + '</span><span class="meta">' + meta + '</span></button>';
      }).join('') + '</div>';
      trayBody.querySelectorAll('.item[data-item]').forEach((btn) => {
        btn.addEventListener('click', () => onItem(btn.dataset.item));
      });
      trayBody.querySelectorAll('[data-decor]').forEach((btn) => {
        btn.addEventListener('click', () => onDecor(btn.dataset.decor));
      });
    } else if (room === 'play') {
      const cards = [
        ['hop', 'Hadeda Hop', 'Flap the lines.', '#d9f3c4'],
        ['taxi', 'Taxi Dodge', 'Dodge taxis and goats.', '#f6e2a8'],
        ['mielie', 'Mielie Catch', 'Catch snacks, not chillies.', '#f8d0c4'],
        ['braai', 'Braai Flip', 'Tap the wors in the glow.', '#f3c7a4']
      ];
      const marks = { hop: '🐦', taxi: '🚕', mielie: '🌽', braai: '🔥' };
      const boostRow = '<div class="boosts">' + T.boosts.map((boost) => {
        const lv = data.upgrades[boost.id] || 0;
        const meta = lv >= boost.max ? 'Max' : (boost.price * (lv + 1)) + ' coins';
        return '<button type="button" class="tool" data-boost="' + boost.id + '"><span class="nm">' + boost.name + '</span><span class="meta">Lv ' + lv + ' · ' + meta + '</span></button>';
      }).join('') + '</div>';
      trayBody.innerHTML = boostRow + '<div class="cards">' + cards.map((card) => {
        return '<button type="button" class="card" data-game="' + card[0] + '">' +
          '<span class="mark" style="background:' + card[3] + '">' + marks[card[0]] + '</span>' +
          '<span class="copy"><b>' + card[1] + '</b><span>' + card[2] + '</span>' +
          '<span class="best">Best ' + (data.best[card[0]] || 0) + '</span></span>' +
          '<span class="playpill">Play</span></button>';
      }).join('') + '</div>';
      trayBody.querySelectorAll('.card').forEach((btn) => {
        btn.addEventListener('click', () => startGame(btn.dataset.game));
      });
      trayBody.querySelectorAll('[data-boost]').forEach((btn) => {
        btn.addEventListener('click', () => onBoost(btn.dataset.boost));
      });
    } else {
      trayBody.innerHTML = '';
    }
  }

  function setRoom(next) {
    if (rooms.indexOf(next) === -1 || next === room) return;
    if (app.dataset.mode === 'play') return;
    room = next;
    app.dataset.room = room;
    document.querySelectorAll('.tab').forEach((btn) => {
      btn.setAttribute('aria-selected', btn.dataset.room === room ? 'true' : 'false');
    });
    session.scrubbing = false;
    renderTray();
    resize();
    T.audio.blip();
  }

  function shiftRoom(dir) {
    const idx = rooms.indexOf(room);
    const next = rooms[(idx + dir + rooms.length) % rooms.length];
    setRoom(next);
  }

  function startFoodDrag(e, btn, food) {
    if (drag || session.eat > 0 || !food) return;
    if (!modalEl.hidden || !gameover.hidden) return;
    e.preventDefault();
    T.audio.unlock();
    const rect = btn.getBoundingClientRect();
    const ghost = btn.cloneNode(true);
    ghost.classList.add('ghost-food');
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    document.body.appendChild(ghost);
    drag = {
      food: food,
      ghost: ghost,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      pid: e.pointerId
    };
    btn.classList.add('dim');
    session.dragging = true;
  }

  function tryFeed(food, cx, cy, ax, ay) {
    if (!anchors.mouth) {
      say(pick(lines.miss));
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mx = rect.left + anchors.mouth.x;
    const my = rect.top + anchors.mouth.y;
    const near = (x, y) => Math.hypot(x - mx, y - my) < 96;
    if (!near(cx, cy) && !(ax != null && near(ax, ay))) {
      say(pick(lines.miss));
      T.audio.no();
      return;
    }
    if (data.hunger > 92) {
      say('Eish, I am stuffed.');
      return;
    }
    const reward = data.hunger < 90;
    data.hunger = T.clamp(data.hunger + food.hunger, 0, 100);
    data.fun = T.clamp(data.fun + food.fun, 0, 100);
    data.clean = T.clamp(data.clean + food.clean, 0, 100);
    data.energy = T.clamp(data.energy + (food.energy || 0), 0, 100);
    if (reward) data.coins = Math.min(9999, data.coins + 1);
    const levels = T.state.addXp(food.xp);
    session.eat = 0.8;
    grant('fed', 'Achievement: first bite');
    T.audio.munch();
    say(food.sweet ? pick(lines.eatSweet) : pick(lines.eatGood));
    floaters.push({ text: '+' + food.hunger, x: anchors.mouth.x, y: anchors.mouth.y, life: 0.9, color: '#d4652f' });
    for (let i = 0; i < 6; i++) {
      particles.push({
        x: anchors.mouth.x, y: anchors.mouth.y,
        vx: (Math.random() - 0.5) * 50, vy: -20 - Math.random() * 30,
        g: 80, life: 0.6, r: 2 + Math.random() * 2, color: food.sweet ? '#f0a030' : '#f2c431'
      });
    }
    onLevel(levels);
    bumpSave();
  }

  function rinse() {
    T.audio.unlock();
    if (session.foam < 0.12 && data.clean >= 98) {
      say('I am already shiny.');
      return;
    }
    const before = data.clean;
    const gain = session.foam > 0.18 ? 16 + Math.round(session.foam * 18) : 8;
    data.clean = T.clamp(data.clean + gain, 0, 100);
    session.foam = 0;
    session.rinsing = 1.15;
    session.giggle = 0.35;
    if (before < 96) {
      data.coins = Math.min(9999, data.coins + 2);
      onLevel(T.state.addXp(10));
    }
    T.audio.splash();
    grant('bath', 'Achievement: squeaky clean');
    say(pick(lines.clean));
    const hx = anchors.head ? anchors.head.x : W / 2;
    const hy = anchors.head ? anchors.head.y : 70;
    floaters.push({ text: '+' + gain, x: hx, y: hy, life: 0.9, color: '#3aa3a0' });
    bumpSave();
  }

  function scoop(slot) {
    T.audio.unlock();
    if (!data.poos.length) {
      say('All clear. Lekker.');
      return;
    }
    const use = slot == null ? data.poos[0] : slot;
    const idx = data.poos.indexOf(use);
    if (idx === -1) return;
    data.poos.splice(idx, 1);
    data.clean = T.clamp(data.clean + 12, 0, 100);
    data.fun = T.clamp(data.fun + 4, 0, 100);
    data.coins = Math.min(9999, data.coins + 3);
    onLevel(T.state.addXp(8));
    T.audio.poo();
    say(pick(lines.scoop));
    bumpSave();
  }

  function tickle() {
    const now = performance.now();
    if (now - session.lastTickle < 360) return;
    session.lastTickle = now;
    session.giggle = 0.7;
    session.tickleTimes.push(now);
    session.tickleTimes = session.tickleTimes.filter((stamp) => now - stamp < 12000);
    data.fun = T.clamp(data.fun + 8, 0, 100);
    if (session.tickleXp < 8) {
      session.tickleXp += 1;
      onLevel(T.state.addXp(3));
    }
    if (session.tickleTimes.length >= 5 && session.shy <= 0) {
      session.shy = 7;
      say(pick(lines.shy));
    } else {
      say(pick(lines.tickle));
    }
    T.audio.giggle();
    bumpSave();
  }

  function toggleSleep() {
    if (session.shedding > 0) {
      say('Eish, not while the lights are out.');
      return;
    }
    session.hiding = false;
    session.sleeping = !session.sleeping;
    if (session.sleeping) {
      session.sleepPaid = data.energy < 80;
      session.lampOn = false;
      say(pick(lines.sleep));
    } else {
      session.lampOn = true;
      if (session.sleepPaid && data.energy > 88) {
        data.coins = Math.min(9999, data.coins + 4);
        onLevel(T.state.addXp(6));
        session.sleepPaid = false;
      }
      say(pick(lines.wake));
      bumpSave();
    }
  }

  function toggleHide() {
    if (session.sleeping) {
      toggleSleep();
      return;
    }
    session.hiding = !session.hiding;
    if (session.hiding) {
      session.hideLeft = 6.2;
      data.fun = T.clamp(data.fun + 6, 0, 100);
      say(pick(lines.hide));
      T.audio.giggle();
      bumpSave();
    } else {
      say(pick(lines.found));
    }
  }

  function triggerShed() {
    if (session.shedding > 0) return;
    session.shedding = 7;
    session.sleeping = false;
    session.hiding = false;
    session.lampOn = false;
    say(pick(lines.shed));
    T.audio.flicker();
  }

  function grant(id, label) {
    if (!data.achievements) data.achievements = [];
    if (data.achievements.indexOf(id) !== -1) return;
    data.achievements.push(id);
    toast(label);
  }

  function onDecor(id) {
    const item = T.decor.find((entry) => entry.id === id);
    if (!item) return;
    T.audio.unlock();
    if (data.level < item.level) {
      say('Level ' + item.level + ' for that. Almost!');
      return;
    }
    if (data.decorOwned.indexOf(id) === -1) {
      if (data.coins < item.price) {
        say(pick(lines.poor));
        return;
      }
      data.coins -= item.price;
      data.decorOwned.push(id);
      data.decorOn[id] = true;
      say('Lekker, ' + item.name + ' is in.');
      T.audio.coin();
    } else {
      data.decorOn[id] = !data.decorOn[id];
      say(data.decorOn[id] ? 'Out it goes.' : 'Tucked away.');
    }
    bumpSave();
    renderTray();
  }

  function onBoost(id) {
    const boost = T.boosts.find((entry) => entry.id === id);
    if (!boost) return;
    const lv = data.upgrades[id] || 0;
    if (lv >= boost.max) {
      say('That one is maxed. Sharp.');
      return;
    }
    const price = boost.price * (lv + 1);
    if (data.coins < price) {
      say(pick(lines.poor));
      return;
    }
    data.coins -= price;
    data.upgrades[id] = lv + 1;
    say(boost.name + ', level ' + (lv + 1) + '.');
    T.audio.coin();
    grant('boost', 'Achievement: first boost');
    bumpSave();
    renderTray();
  }

  function onItem(id) {
    const item = T.items.find((entry) => entry.id === id);
    if (!item) return;
    T.audio.unlock();
    if (data.level < item.level) {
      say('Level ' + item.level + ' unlocks that. Almost!');
      T.audio.no();
      return;
    }
    const owned = data.owned.indexOf(id) !== -1;
    if (!owned) {
      if (data.coins < item.price) {
        say(pick(lines.poor));
        T.audio.no();
        return;
      }
      data.coins -= item.price;
      data.owned.push(id);
      data.worn[item.slot] = id;
      say('Lekker, ' + item.name + '.');
      T.audio.coin();
      onLevel(T.state.addXp(6));
    } else if (data.worn[item.slot] === id) {
      data.worn[item.slot] = null;
      say('Off it comes.');
      T.audio.blip();
    } else {
      data.worn[item.slot] = id;
      say('Sharp look.');
      T.audio.blip();
    }
    bumpSave();
    renderTray();
  }

  function localPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function hitTest(x, y) {
    for (let i = hotspots.length - 1; i >= 0; i--) {
      const spot = hotspots[i];
      if (x >= spot.x && y >= spot.y && x <= spot.x + spot.w && y <= spot.y + spot.h) return spot;
    }
    return null;
  }

  function onStageDown(e) {
    if (!modalEl.hidden || !gameover.hidden) return;
    if (app.dataset.mode === 'play') {
      const p = localPoint(e);
      T.games.pointer('down', p.x, p.y);
      gesture = { pid: e.pointerId, game: true };
      return;
    }
    const p = localPoint(e);
    const spot = hitTest(p.x, p.y);
    gesture = {
      pid: e.pointerId,
      x: p.x,
      y: p.y,
      cx: e.clientX,
      cy: e.clientY,
      t: performance.now(),
      id: spot ? spot.id : null,
      slot: spot ? spot.slot : null,
      game: false
    };
    session.pointer = p;
    session.scrubDist = 0;
    if (room === 'bath' && spot && spot.id === 'pet') session.scrubbing = true;
  }

  function onStageMove(e) {
    if (!gesture || e.pointerId !== gesture.pid) return;
    const p = localPoint(e);
    session.pointer = p;
    if (gesture.game) {
      T.games.pointer('move', p.x, p.y);
      return;
    }
    if (session.scrubbing && room === 'bath') {
      const dist = Math.hypot(p.x - gesture.x, p.y - gesture.y);
      gesture.x = p.x;
      gesture.y = p.y;
      if (dist > 0.4) {
        session.scrubDist += dist;
        session.foam = Math.min(1, session.foam + dist * 0.0035);
        data.clean = T.clamp(data.clean + Math.min(0.35, dist * 0.008), 0, 100);
        if (performance.now() - session.lastSqueak > 140) {
          session.lastSqueak = performance.now();
          T.audio.squeak();
        }
        particles.push({
          x: p.x, y: p.y, vx: (Math.random() - 0.5) * 16, vy: -12 - Math.random() * 16,
          g: -8, life: 0.7, r: 3 + Math.random() * 3, color: 'rgba(255,255,255,.85)'
        });
      }
    }
  }

  function onStageUp(e) {
    if (!gesture || e.pointerId !== gesture.pid) return;
    const p = localPoint(e);
    if (gesture.game) {
      T.games.pointer('up', p.x, p.y);
      gesture = null;
      session.scrubbing = false;
      return;
    }
    const dx = p.x - gesture.cx + (gesture.x - gesture.x);
    const movedX = e.clientX - gesture.cx;
    const movedY = e.clientY - gesture.cy;
    const dt = performance.now() - gesture.t;
    const flick = dt < 340 && Math.abs(movedX) > 58 && Math.abs(movedX) > Math.abs(movedY) * 1.3;
    session.scrubbing = false;
    if (flick && session.scrubDist < 160) {
      shiftRoom(movedX < 0 ? 1 : -1);
      gesture = null;
      return;
    }
    if (Math.abs(movedX) < 16 && Math.abs(movedY) < 16) tapSpot(gesture.id, gesture.slot);
    gesture = null;
  }

  function tapSpot(id, slot) {
    T.audio.unlock();
    if (!id) return;
    if (id === 'pet' && session.shy > 0) {
      session.shy = 0;
      data.fun = T.clamp(data.fun + 4, 0, 100);
      say(pick(lines.found));
      bumpSave();
      return;
    }
    if (id.indexOf('poo-') === 0) {
      scoop(slot);
      return;
    }
    if (id === 'shower') { rinse(); return; }
    if (id === 'lamp') { toggleSleep(); return; }
    if (id === 'power') { triggerShed(); return; }
    if (id === 'under') { toggleHide(); return; }
    if (id === 'jar-salt' || id === 'jar-sugar' || id === 'jars') {
      data.saltSwapped = !data.saltSwapped;
      session.taste = id === 'jar-sugar' ? 'yum' : 'yuck';
      session.tasteT = 1.25;
      data.fun = T.clamp(data.fun + 3, 0, 100);
      say(session.taste === 'yum' ? 'Lekker, that is sugar!' : 'Yoh, salt! Yuck.');
      bumpSave();
      return;
    }
    if (id === 'pet') {
      session.pop = 0.12;
      if (room === 'stoep') {
        if (session.hiding) toggleHide();
        else if (session.sleeping) toggleSleep();
        else tickle();
        return;
      }
      if (room === 'bath') {
        say('Keep rubbing. Soap likes a chat.');
        return;
      }
      say(moodLine());
    }
  }

  function startPrank() {
    const types = ['socks', 'honk', 'salt'];
    const type = types[session.prankN % types.length];
    session.prankN += 1;
    session.prank = { type: type, t: 0, dur: type === 'honk' ? 1.6 : 2.3 };
    if (type === 'salt') data.saltSwapped = !data.saltSwapped;
    if (type === 'socks') say(pick(lines.socks));
    else if (type === 'honk') { say(pick(lines.honk)); T.audio.honk(); }
    else say(pick(lines.salt));
    T.state.save();
  }

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (w < 20 || h < 20) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    W = w;
    H = h;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnDrops() {
    if (session.rinsing <= 0 || !marks.shower) return;
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: marks.shower.x + (Math.random() - 0.5) * 16,
        y: marks.shower.y,
        vx: (Math.random() - 0.5) * 12,
        vy: 80 + Math.random() * 40,
        g: 20,
        life: 0.55,
        r: 1.6,
        color: '#7ec8e3'
      });
    }
  }

  function updateWorld(dt) {
    session.t += dt;
    if (session.speech > 0) {
      session.speech -= dt;
      if (session.speech <= 0) speech.hidden = true;
    }
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) toastEl.hidden = true;
    }
    if (session.eat > 0) session.eat -= dt;
    if (session.pop > 0) session.pop = Math.max(0, session.pop - dt * 0.35);
    if (session.tasteT > 0) {
      session.tasteT -= dt;
      if (session.tasteT <= 0) session.taste = null;
    }
    if (!session.mischief && session.mischiefIn != null) {
      session.mischiefIn -= dt;
      if (session.mischiefIn <= 0 && !session.sleeping && session.shedding <= 0) {
        const kinds = ['peek', 'giggle', 'hide'];
        const type = kinds[Math.floor(Math.random() * kinds.length)];
        session.mischief = { type: type, t: 0 };
        session.mischiefIn = 16 + Math.random() * 10;
        if (type === 'giggle') session.giggle = 0.8;
      }
    }
    if (session.mischief) {
      session.mischief.t += dt;
      if (session.mischief.t > 1.5) session.mischief = null;
    }
    if (session.giggle > 0) session.giggle -= dt;
    if (session.rinsing > 0) session.rinsing -= dt;
    if (session.shy > 0) session.shy = Math.max(0, session.shy - dt);
    if (session.hiding) {
      session.hideLeft -= dt;
      if (session.hideLeft <= 0) {
        session.hiding = false;
        say('Hehe. I am back.');
      }
    }
    if (session.shedding > 0) {
      session.shedding -= dt;
      if (session.shedding <= 0) {
        session.shedding = 0;
        session.lampOn = !session.sleeping;
        say(pick(lines.shedOn));
      }
    } else if (room === 'stoep' && !session.sleeping && modalEl.hidden) {
      session.shedIn -= dt;
      if (session.shedIn <= 0) {
        triggerShed();
        session.shedIn = 170;
      }
    }
    if (!session.prank && session.prankIn > 0 && modalEl.hidden && gameover.hidden && !session.sleeping && session.shedding <= 0) {
      session.prankIn -= dt;
      if (session.prankIn <= 0) {
        startPrank();
        session.prankIn = 34 + Math.random() * 18;
      }
    }
    if (session.prank) {
      session.prank.t += dt;
      session.prank.p = Math.min(1, session.prank.t / session.prank.dur);
      if (session.prank.t >= session.prank.dur) session.prank = null;
    }
    if (anchors.head && session.pointer) {
      const target = T.clamp((session.pointer.x - anchors.head.x) / 70, -2.4, 2.4);
      const targetY = T.clamp((session.pointer.y - anchors.head.y) / 80, -2, 2);
      session.lookX += (target - session.lookX) * Math.min(1, dt * 8);
      session.lookY += (targetY - session.lookY) * Math.min(1, dt * 8);
    } else {
      session.lookX += (0 - session.lookX) * Math.min(1, dt * 4);
      session.lookY += (0 - session.lookY) * Math.min(1, dt * 4);
    }

    if (app.dataset.mode === 'live') {
      if (session.sleeping) {
        data.energy = T.clamp(data.energy + dt * 10, 0, 100);
        data.hunger = T.clamp(data.hunger - dt * 0.04, 0, 100);
      } else {
        data.hunger = T.clamp(data.hunger - dt * 0.16, 0, 100);
        data.clean = T.clamp(data.clean - dt * 0.11, 0, 100);
        data.energy = T.clamp(data.energy - dt * 0.13, 0, 100);
        data.fun = T.clamp(data.fun - dt * 0.15, 0, 100);
        session.pooIn -= dt;
        if (session.pooIn <= 0) {
          session.pooIn = 72;
          if (data.poos.length < 3 && data.hunger > 40) {
            const slot = [0, 1, 2].find((n) => data.poos.indexOf(n) === -1);
            if (slot != null) {
              data.poos.push(slot);
              data.clean = T.clamp(data.clean - 6, 0, 100);
              say(pick(lines.poo));
              T.audio.poo();
            }
          }
        }
      }
    }
    spawnDrops();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.g || 0) * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    if (particles.length > 90) particles.splice(0, particles.length - 90);
    floaters.forEach((f) => {
      f.y -= 28 * dt;
      f.life -= dt;
    });
    for (let i = floaters.length - 1; i >= 0; i--) if (floaters[i].life <= 0) floaters.splice(i, 1);
    hudTick -= dt;
    if (hudTick <= 0) {
      hudTick = 0.2;
      renderHud();
    }
    session.saveIn -= dt;
    if (session.saveIn <= 0) {
      session.saveIn = 2.5;
      T.state.save();
    }
  }

  function drawWorld() {
    if (W < 20 || H < 20) return;
    const env = {
      room: room,
      anim: buildAnim(),
      t: session.t,
      hotspots: hotspots,
      anchors: anchors,
      marks: marks,
      poos: data.poos,
      swapped: data.saltSwapped,
      foam: session.foam,
      rinsing: session.rinsing,
      sleeping: session.sleeping,
      hiding: session.hiding,
      shedding: session.shedding,
      prank: session.prank,
      dragging: session.dragging,
      lampOn: session.lampOn,
      decor: data.decorOn
    };
    T.draw.frame(ctx, W, H, env);
    particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 16px "Segoe UI", sans-serif';
    floaters.forEach((f) => {
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
    if (location.hash === '#debug') {
      ctx.strokeStyle = 'rgba(212,40,40,.8)';
      ctx.lineWidth = 1;
      hotspots.forEach((spot) => ctx.strokeRect(spot.x, spot.y, spot.w, spot.h));
    }
    positionSpeech();
  }

  function drawGameHud() {
    const v = T.games.view;
    if (gScore.textContent !== String(v.score)) {
      gScore.textContent = String(v.score);
      gScore.parentElement.classList.remove('pop');
      void gScore.parentElement.offsetWidth;
      gScore.parentElement.classList.add('pop');
    }
    gTime.textContent = String(Math.ceil(v.time));
    gExtra.textContent = String(v.extra);
    gExtraLabel.textContent = v.extraLabel;
    if (v.banner) {
      banner.hidden = false;
      banner.textContent = v.banner;
    } else banner.hidden = true;
  }

  function loop(ts) {
    if (!last) last = ts;
    const dt = Math.min(0.034, (ts - last) / 1000);
    last = ts;
    if (app.dataset.mode === 'play') {
      T.games.update(dt, W, H);
      ctx.clearRect(0, 0, W, H);
      T.games.draw(ctx, W, H);
      drawGameHud();
    } else {
      updateWorld(dt);
      drawWorld();
    }
    requestAnimationFrame(loop);
  }

  function leaveGame() {
    app.dataset.mode = 'live';
    hudPlay.hidden = true;
    hudLive.hidden = false;
    gameover.hidden = true;
    banner.hidden = true;
    T.games.clear();
    renderTray();
    renderHud();
    resize();
  }

  function startGame(kind) {
    T.audio.unlock();
    app.dataset.mode = 'play';
    hudLive.hidden = true;
    hudPlay.hidden = false;
    gameover.hidden = true;
    speech.hidden = true;
    toastEl.hidden = true;
    resize();
    T.games.start(kind, W, H);
    drawGameHud();
  }

  T.games.onFinish = function (result) {
    if (!result) return;
    const bestKey = result.kind;
    if (result.isBest) data.best[bestKey] = result.score;
    if (result.coins) data.coins = Math.min(9999, data.coins + result.coins);
    if (result.xp) onLevel(T.state.addXp(result.xp));
    document.getElementById('go-title').textContent = result.title;
    document.getElementById('go-body').textContent = result.body;
    document.getElementById('go-score').textContent = String(result.score);
    document.getElementById('go-best').textContent = String(data.best[bestKey] || 0);
    document.getElementById('go-coins').textContent = String(result.coins);
    gameover.hidden = false;
    if (result.coins) T.audio.coin();
    grant('played', 'Achievement: first game');
    bumpSave();
  };

  function openModal() {
    const next = modalQ.shift();
    if (!next) {
      modalOn = false;
      modalEl.hidden = true;
      currentModal = null;
      if (!session.greeted) {
        session.greeted = true;
        say('Howzit!');
      }
      return;
    }
    modalOn = true;
    currentModal = next;
    document.getElementById('modal-title').textContent = next.title;
    document.getElementById('modal-body').textContent = next.body;
    document.getElementById('modal-ok').textContent = next.ok;
    modalEl.hidden = false;
  }

  function bootModals() {
    if (!data.seenIntro) {
      modalQ.push({
        id: 'intro',
        title: 'Howzit!',
        body: 'I am your tokoloshe. Feed me, scrub the grub, and mind your socks. I only bite the mielies.',
        ok: "Let's play"
      });
    }
    if (data.lastGift !== T.todayKey()) {
      modalQ.push({
        id: 'gift',
        title: 'A little something',
        body: 'Daily treat: 30 coins and a warm vetkoek. Do not tell the flies.',
        ok: 'Sharp sharp'
      });
    }
    if (modalQ.length) openModal();
    else session.greeted = true;
  }

  document.getElementById('modal-ok').addEventListener('click', () => {
    T.audio.unlock();
    if (currentModal && currentModal.id === 'intro') data.seenIntro = true;
    if (currentModal && currentModal.id === 'gift') {
      const prev = data.lastGift;
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const ykey = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
      data.streak = prev === ykey ? (data.streak || 0) + 1 : 1;
      data.lastGift = T.todayKey();
      if (data.streak >= 2) grant('streak', 'Achievement: ' + data.streak + ' day streak');
      data.coins = Math.min(9999, data.coins + 30);
      data.hunger = T.clamp(data.hunger + 14, 0, 100);
      T.audio.chime();
    }
    T.state.save();
    renderHud();
    modalEl.hidden = true;
    modalOn = false;
    currentModal = null;
    if (modalQ.length) openModal();
    else if (!session.greeted) {
      session.greeted = true;
      say('Howzit!');
    }
  });

  document.getElementById('exit-game').addEventListener('click', () => {
    if (!T.games.started()) {
      T.games.clear();
      leaveGame();
      return;
    }
    T.games.stop();
  });

  document.getElementById('go-again').addEventListener('click', () => {
    const kind = T.games.kind();
    gameover.hidden = true;
    resize();
    T.games.start(kind || 'hop', W, H);
  });

  document.getElementById('go-done').addEventListener('click', () => leaveGame());

  muteBtn.addEventListener('click', () => {
    data.muted = !data.muted;
    T.audio.unlock();
    if (!data.muted) T.audio.blip();
    bumpSave();
  });

  document.querySelectorAll('.tab').forEach((btn) => {
    const key = btn.dataset.room;
    btn.querySelector('.ico').innerHTML = T.icons.tabs[key] || '';
    btn.addEventListener('click', () => setRoom(key));
  });

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    T.audio.unlock();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    onStageDown(e);
  });
  canvas.addEventListener('pointermove', onStageMove);
  canvas.addEventListener('pointerup', onStageUp);
  canvas.addEventListener('pointercancel', onStageUp);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  function moveGhost(e) {
    if (!drag) return;
    drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
    drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
    drag.px = e.clientX;
    drag.py = e.clientY;
  }
  window.addEventListener('pointermove', moveGhost);
  window.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const ghost = drag.ghost;
    const food = drag.food;
    const rect = ghost.getBoundingClientRect();
    const gx = rect.left + rect.width / 2;
    const gy = rect.top + rect.height / 2;
    ghost.remove();
    document.querySelectorAll('.food.dim').forEach((el) => el.classList.remove('dim'));
    drag = null;
    session.dragging = false;
    tryFeed(food, e.clientX || gx, e.clientY || gy, gx, gy);
  });
  window.addEventListener('pointercancel', () => {
    if (!drag) return;
    drag.ghost.remove();
    drag = null;
    session.dragging = false;
    document.querySelectorAll('.food.dim').forEach((el) => el.classList.remove('dim'));
  });

  document.addEventListener('visibilitychange', () => {
    T.state.save();
    if (document.hidden) {
      session.hiddenAt = Date.now();
    } else if (session.hiddenAt) {
      const mins = Math.min(20, (Date.now() - session.hiddenAt) / 60000);
      data.hunger = T.clamp(data.hunger - mins * 0.8, 0, 100);
      data.clean = T.clamp(data.clean - mins * 0.5, 0, 100);
      data.energy = T.clamp(data.energy - mins * 0.7, 0, 100);
      data.fun = T.clamp(data.fun - mins * 0.7, 0, 100);
      session.hiddenAt = 0;
      renderHud();
    }
    last = 0;
  });
  window.addEventListener('beforeunload', () => T.state.save());
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  renderHud();
  renderTray();
  resize();
  bootModals();
  requestAnimationFrame(loop);

  T.app = {
    hotspots: function () { return hotspots.slice(); },
    anchors: function () { return { mouth: anchors.mouth, head: anchors.head, hand: anchors.hand }; },
    room: function () { return room; },
    session: session,
    setRoom: setRoom
  };
})(window.Toko = window.Toko || {});
