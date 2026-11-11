/* Lodge loop: feed, bath, scoop, sleep, shop, play. */
(function (B) {
  'use strict';

  const app = document.getElementById('app');
  const stageEl = document.getElementById('stage');
  const canvas = document.getElementById('view');
  const ctx = canvas.getContext('2d');
  const fx = document.getElementById('fx');
  const fxc = fx.getContext('2d');
  const pickCanvas = document.getElementById('pick-view');
  const pickCtx = pickCanvas.getContext('2d');
  const speech = document.getElementById('speech');
  const toastEl = document.getElementById('toast');
  const banner = document.getElementById('banner');
  const hint = document.getElementById('hint');
  const trayBody = document.getElementById('tray-body');
  const sheet = document.getElementById('sheet');
  const picker = document.getElementById('picker');
  const hudLive = document.getElementById('hud-live');
  const hudPlay = document.getElementById('hud-play');
  const data = B.state.data;
  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const params = new URLSearchParams(location.search);
  const qa = params.has('qa');
  const lineup = params.get('lineup');
  const rooms = ['kitchen', 'bath', 'play', 'boma', 'shop'];

  const qAnimal = ['lion', 'leopard', 'elephant', 'rhino', 'buffalo'].indexOf(params.get('animal')) >= 0
    ? params.get('animal') : null;
  const qStage = parseInt(params.get('stage'), 10);
  const preview = {
    on: !!(qAnimal || (qStage >= 1 && qStage <= 4)),
    species: qAnimal,
    stage: qStage >= 1 && qStage <= 4 ? qStage : 0
  };

  const lines = {
    greet: ['Howzit!', 'Sharp sharp, you came back.', 'The lodge kept your spot.'],
    eat: ['Lekker!', 'Yoh, that hit the spot.', 'Sharp, more of that.'],
    sweet: ['Yoh, sweet tooth.', 'Hehe, sticky chin.', 'Lekker. No regrets.'],
    full: ['Eish, I am full. Lekker though.'],
    hungry: ['A snack would be lekker.', 'Ag, tummy is chatting.'],
    dirty: ['A splash would be nice.', 'Hehe, a bit dusty.'],
    clean: ['Lekker and shiny.', 'Hehe, bubbles.'],
    sleep: ['Night night.', 'Wake me if the lights come back.'],
    wake: ['Yoh, I am up.', 'Howzit. Morning-ish.'],
    tickle: ['Hehehe!', 'Eish, stop. No, carry on.'],
    scoop: ['Ag, thanks.', 'Lekker, all gone.'],
    poo: ['Hehe. Eish.', 'That was me. Sorry-not-sorry.'],
    shed: ['Eish, the lights.', 'Load shedding. I have the candle.'],
    shedOn: ['Sharp, they are back.', 'Lekker, light!'],
    poor: ['Eish, a few more coins.', 'Almost. A game will do it.'],
    miss: ['Eish, my mouth is up here.', 'Ag, so close.'],
    bored: ['Play with me?', 'The savanna is calling.']
  };

  let room = rooms.indexOf(params.get('room')) >= 0 ? params.get('room') : 'kitchen';
  let W = 360;
  let H = 360;
  let last = 0;
  let drag = null;
  let gesture = null;
  let toastTimer = 0;
  let pickIndex = Math.max(0, B.animals.findIndex((a) => a.id === (qAnimal || 'lion')));
  const sheetQ = [];
  let sheetMode = null;
  const hotspots = [];
  const particles = [];
  const floaters = [];
  const confetti = [];
  const fxImg = {};
  ['star', 'circle', 'spark', 'twirl'].forEach((name) => {
    const img = new Image();
    img.src = 'assets/fx/' + name + '.png';
    fxImg[name] = img;
  });

  const session = {
    t: 0, foam: 0, sleeping: false, shedding: 0, shedIn: 40, lampOn: true,
    eat: 0, giggle: 0, scrubbing: false, scrubDist: 0, lastSqueak: 0,
    lookX: 0, lookY: 0, pop: 0, pointer: null, saveIn: 2, pooIn: 50,
    speech: 0, shift: 0, prevRoom: null, greeted: false
  };

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function species() {
    if (preview.on && preview.species) return preview.species;
    return data.animal || 'lion';
  }
  function stage() {
    if (preview.on && preview.stage) return preview.stage > 3 ? 3 : preview.stage;
    return B.stageFromLevel(data.level);
  }
  function legend() {
    if (preview.on && preview.stage === 4) return true;
    return !!data.legendOn;
  }
  function meta() { return B.animalById(species()); }

  function say(text) {
    speech.textContent = text;
    speech.hidden = false;
    session.speech = 2.6;
  }
  function toast(text) {
    toastEl.textContent = text;
    toastEl.hidden = false;
    toastTimer = 2.2;
  }

  function renderHud() {
    const animal = meta();
    const st = stage();
    document.getElementById('pet-name').textContent = data.petName || animal.title;
    document.getElementById('pet-stage').textContent = animal.stages[legend() ? 3 : st - 1];
    document.getElementById('coin-num').textContent = String(data.coins);
    const streak = data.streak ? ' · ' + data.streak + 'd' : '';
    document.getElementById('lvl').textContent = 'Lv ' + data.level + streak;
    const need = B.xpNeed(data.level);
    document.getElementById('xpbar').style.transform = 'scaleX(' + Math.max(0, Math.min(1, data.xp / need)) + ')';
    ['hunger', 'clean', 'energy', 'fun'].forEach((key) => {
      const meter = document.querySelector('.meter[data-k="' + key + '"]');
      if (!meter) return;
      const value = Math.round(data[key]);
      const p = Math.max(0, Math.min(1, value / 100));
      meter.style.setProperty('--p', String(p));
      meter.classList.toggle('low', value < 40);
    });
    const audio = document.querySelector('#mute .kicon');
    audio.classList.toggle('off', !!data.muted);
    document.getElementById('mute').setAttribute('aria-label', data.muted ? 'Unmute sound' : 'Mute sound');
  }

  function buildMeters() {
    const root = document.getElementById('meters');
    root.innerHTML = ['hunger', 'clean', 'energy', 'fun'].map((key) => {
      const icon = B.icons.meters[key];
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return '<div class="meter" data-k="' + key + '" role="img" aria-label="' + label + '">' +
        '<span class="m-ico"><span class="ink">' + icon + '</span><span class="fill">' + icon + '</span></span>' +
        '<span class="m-bar"><i></i></span></div>';
    }).join('');
  }

  function moodLine() {
    if (data.hunger < 42) return pick(lines.hungry);
    if (data.clean < 42) return pick(lines.dirty);
    if (data.energy < 42) return pick(lines.sleep);
    if (data.fun < 42) return pick(lines.bored);
    return pick(lines.greet);
  }

  function buildAnim() {
    let eyes = 'open';
    let mouth = 'smile';
    if (session.sleeping || data.energy < 38) eyes = data.energy < 38 && !session.sleeping ? 'open' : 'shut';
    if (session.sleeping) mouth = 'sleep';
    if (data.fun > 70 && data.hunger > 50 && !session.sleeping) mouth = 'grin';
    if (session.giggle > 0) { eyes = 'happy'; mouth = 'open'; }
    if (session.eat > 0) { mouth = 'open'; eyes = 'happy'; }
    return {
      species: species(),
      stage: stage(),
      legend: legend(),
      t: session.t,
      eyes: eyes,
      mouth: mouth,
      lid: !session.sleeping && data.energy < 40 ? 0.45 : 0,
      lookX: session.lookX,
      lookY: session.lookY,
      dirt: B.clamp((48 - data.clean) / 48, 0, 1),
      foam: session.foam,
      worn: data.worn,
      hold: session.shedding > 0 ? 'candle' : null,
      happy: session.giggle > 0,
      squash: session.pop || 0,
      pose: (room === 'bath' || room === 'boma') ? 'sit' : 'stand',
      alpha: 1
    };
  }

  function renderTray() {
    const foods = B.foods[species()] || B.foods.lion;
    const hints = {
      kitchen: 'Drag a snack onto the mouth.',
      bath: 'Rub until it foams, then rinse. Tap a pile or use the scoop.',
      boma: 'Lamp for a nap. The little box drops the lights.',
      shop: 'Curio stall. Wear what you like.',
      play: 'Short games. Upgrades stay.'
    };
    hint.textContent = hints[room] || '';
    if (room === 'kitchen') {
      trayBody.innerHTML = '<div class="grid4">' + foods.map((food) => {
        return '<button type="button" class="food" data-food="' + food.id + '"><span class="ico">' +
          (B.icons.foods[food.id] || '') + '</span><span>' + food.name + '</span></button>';
      }).join('') + '</div>';
      trayBody.querySelectorAll('.food').forEach((btn) => {
        const food = foods.find((entry) => entry.id === btn.dataset.food);
        btn.addEventListener('pointerdown', (e) => startFoodDrag(e, btn, food));
      });
    } else if (room === 'bath') {
      trayBody.innerHTML = '<div class="grid3">' +
        '<button type="button" class="tool" data-tool="soap"><span class="ico">' + B.icons.tools.soap + '</span>Soap</button>' +
        '<button type="button" class="tool" data-tool="shower"><span class="ico">' + B.icons.tools.shower + '</span>Rinse</button>' +
        '<button type="button" class="tool" data-tool="scoop"><span class="ico">' + B.icons.tools.scoop + '</span>Scoop</button>' +
        '</div>';
      trayBody.querySelector('[data-tool="soap"]').addEventListener('click', () => { B.audio.blip(); say('Rub the tummy. Foam likes a chat.'); });
      trayBody.querySelector('[data-tool="shower"]').addEventListener('click', rinse);
      trayBody.querySelector('[data-tool="scoop"]').addEventListener('click', () => scoop(null));
    } else if (room === 'shop') {
      trayBody.innerHTML = '<div class="grid4">' + B.items.map((item) => {
        if (item.earned === 'legend' && data.level < 9 && !(preview.on && preview.stage === 4)) return '';
        const owned = data.owned.indexOf(item.id) !== -1 || (item.id === 'sun' && data.legendOn);
        const worn = data.worn[item.slot] === item.id;
        let meta = item.price ? item.price + ' coins' : 'Yours';
        let cls = item.price ? 'price' : '';
        if (worn) { meta = 'Wearing'; cls = ''; }
        else if (owned) { meta = 'Wear'; cls = ''; }
        return '<button type="button" class="item' + (worn ? ' worn' : '') + '" data-item="' + item.id + '"><span>' +
          item.name + '</span><span class="meta ' + cls + '">' + meta + '</span></button>';
      }).join('') + '</div><div class="grid3" style="margin-top:8px">' + B.decor.map((item) => {
        const owned = data.decorOwned.indexOf(item.id) !== -1;
        const on = owned && data.decorOn[item.id];
        const meta = owned ? (on ? 'In the room' : 'Put it out') : (item.price ? item.price + ' coins' : 'Yours');
        return '<button type="button" class="item' + (on ? ' worn' : '') + '" data-decor="' + item.id + '"><span>' +
          item.name + '</span><span class="meta">' + meta + '</span></button>';
      }).join('') + '</div>';
      trayBody.querySelectorAll('[data-item]').forEach((btn) => btn.addEventListener('click', () => onItem(btn.dataset.item)));
      trayBody.querySelectorAll('[data-decor]').forEach((btn) => btn.addEventListener('click', () => onDecor(btn.dataset.decor)));
    } else if (room === 'play') {
      const cards = [
        ['dash', 'Savanna Dash', 'Tap to jump mounds and warthogs.'],
        ['fruit', 'Fruit Drop', 'Catch marula. Dodge thorns.'],
        ['splash', 'Waterhole Splash', 'Tap the gold ripples.'],
        ['pounce', 'Pounce', 'Tap when the hare is gold.']
      ];
      trayBody.innerHTML = '<div class="boosts">' + B.boosts.map((boost) => {
        const lv = data.upgrades[boost.id] || 0;
        const meta = lv >= boost.max ? 'Maxed' : (boost.price * (lv + 1)) + ' coins';
        return '<button type="button" class="boost" data-boost="' + boost.id + '">' + boost.name + ' · Lv ' + lv + '<br>' + meta + '</button>';
      }).join('') + '</div><div class="cards">' + cards.map((card) => {
        return '<button type="button" class="card" data-game="' + card[0] + '"><b>' + card[1] + '</b>' +
          '<span class="copy">' + card[2] + ' <span class="best">Best ' + (data.best[card[0]] || 0) + '</span></span>' +
          '<span class="playpill">Play</span></button>';
      }).join('') + '</div>';
      trayBody.querySelectorAll('[data-game]').forEach((btn) => btn.addEventListener('click', () => startGame(btn.dataset.game)));
      trayBody.querySelectorAll('[data-boost]').forEach((btn) => btn.addEventListener('click', () => onBoost(btn.dataset.boost)));
    } else trayBody.innerHTML = '';
  }

  function setRoom(next) {
    if (rooms.indexOf(next) === -1 || next === room || app.dataset.mode === 'play') return;
    const dir = rooms.indexOf(next) >= rooms.indexOf(room) ? 1 : -1;
    if (!reduced) {
      session.prevRoom = room;
      session.shift = dir * W;
    }
    room = next;
    app.dataset.room = room;
    document.querySelectorAll('.tab').forEach((btn) => {
      btn.setAttribute('aria-selected', btn.dataset.room === room ? 'true' : 'false');
    });
    session.scrubbing = false;
    renderTray();
    B.audio.blip();
    if (navigator.vibrate) navigator.vibrate(8);
  }

  function startFoodDrag(e, btn, food) {
    if (drag || !food || !sheet.hidden) return;
    e.preventDefault();
    B.audio.unlock();
    const rect = btn.getBoundingClientRect();
    const ghost = btn.cloneNode(true);
    ghost.classList.add('ghost-food');
    ghost.style.width = rect.width + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    document.body.appendChild(ghost);
    drag = { food: food, ghost: ghost, dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    btn.classList.add('dim');
  }

  function tryFeed(food, cx, cy) {
    const mouth = B.art.anchors.mouth;
    if (!mouth) return;
    const rect = canvas.getBoundingClientRect();
    const mx = rect.left + mouth.x;
    const my = rect.top + mouth.y;
    if (Math.hypot(cx - mx, cy - my) > 110) {
      say(pick(lines.miss));
      B.audio.no();
      return;
    }
    if (data.hunger > 94) { say(pick(lines.full)); return; }
    data.hunger = B.clamp(data.hunger + food.hunger, 0, 100);
    data.fun = B.clamp(data.fun + food.fun, 0, 100);
    data.clean = B.clamp(data.clean + food.clean, 0, 100);
    data.energy = B.clamp(data.energy + (food.energy || 0), 0, 100);
    data.coins = Math.min(9999, data.coins + 1);
    session.eat = 0.7;
    B.audio.munch();
    say(food.sweet ? pick(lines.sweet) : pick(lines.eat));
    flyCoins(cx, cy, 1);
    grantXp(food.xp);
    B.state.save();
    renderHud();
  }

  function rinse() {
    B.audio.unlock();
    const gain = session.foam > 0.2 ? 18 : 8;
    data.clean = B.clamp(data.clean + gain, 0, 100);
    data.fun = B.clamp(data.fun + 4, 0, 100);
    session.foam = 0;
    session.giggle = 0.4;
    data.coins = Math.min(9999, data.coins + 2);
    B.audio.splash();
    say(pick(lines.clean));
    const head = B.art.anchors.head || { x: W / 2, y: 80 };
    const rect = canvas.getBoundingClientRect();
    flyCoins(rect.left + head.x, rect.top + head.y, 2);
    grantXp(8);
    B.state.save();
    renderHud();
  }

  function scoop(slot) {
    B.audio.unlock();
    if (!data.poos.length) { say('All clear. Lekker.'); return; }
    const use = slot == null ? data.poos[0] : slot;
    const idx = data.poos.indexOf(use);
    if (idx === -1) return;
    data.poos.splice(idx, 1);
    data.clean = B.clamp(data.clean + 10, 0, 100);
    data.fun = B.clamp(data.fun + 4, 0, 100);
    data.coins = Math.min(9999, data.coins + 3);
    B.audio.poo();
    say(pick(lines.scoop));
    grantXp(6);
    B.state.save();
    renderHud();
  }

  function tickle() {
    session.giggle = 0.7;
    data.fun = B.clamp(data.fun + 6, 0, 100);
    say(pick(lines.tickle));
    B.audio.giggle();
    grantXp(2);
    B.state.save();
  }

  function toggleSleep() {
    if (session.shedding > 0) { say('Not while the lights are out. Come closer.'); return; }
    session.sleeping = !session.sleeping;
    session.lampOn = !session.sleeping;
    if (session.sleeping) say(pick(lines.sleep));
    else {
      if (data.energy > 90) {
        data.coins = Math.min(9999, data.coins + 4);
        grantXp(6);
      }
      say(pick(lines.wake));
      B.state.save();
    }
  }

  function triggerShed() {
    if (session.shedding > 0) return;
    session.shedding = 8;
    session.sleeping = false;
    session.lampOn = false;
    say(pick(lines.shed));
    B.audio.flicker();
  }

  function onItem(id) {
    const item = B.items.find((entry) => entry.id === id);
    if (!item) return;
    B.audio.unlock();
    if (item.earned === 'legend' && data.level < 9) { say('Keep playing. This one finds you.'); return; }
    const owned = data.owned.indexOf(id) !== -1 || (item.id === 'sun' && data.legendSeen);
    if (!owned) {
      if (data.coins < item.price) { say(pick(lines.poor)); B.audio.no(); return; }
      data.coins -= item.price;
      data.owned.push(id);
      data.worn[item.slot] = id;
      say('Lekker, ' + item.name + '.');
      B.audio.coin();
    } else if (data.worn[item.slot] === id) {
      data.worn[item.slot] = null;
      say('Off it comes.');
    } else {
      data.worn[item.slot] = id;
      say('Sharp look.');
    }
    B.state.save();
    renderHud();
    renderTray();
  }

  function onDecor(id) {
    const item = B.decor.find((entry) => entry.id === id);
    if (!item) return;
    if (data.decorOwned.indexOf(id) === -1) {
      if (data.coins < item.price) { say(pick(lines.poor)); return; }
      data.coins -= item.price;
      data.decorOwned.push(id);
      data.decorOn[id] = true;
      B.audio.coin();
    } else data.decorOn[id] = !data.decorOn[id];
    B.state.save();
    renderHud();
    renderTray();
  }

  function onBoost(id) {
    const boost = B.boosts.find((entry) => entry.id === id);
    if (!boost) return;
    const lv = data.upgrades[id] || 0;
    if (lv >= boost.max) { say('That one is maxed. Sharp.'); return; }
    const price = boost.price * (lv + 1);
    if (data.coins < price) { say(pick(lines.poor)); return; }
    data.coins -= price;
    data.upgrades[id] = lv + 1;
    B.audio.coin();
    say(boost.name + ', level ' + (lv + 1) + '.');
    B.state.save();
    renderHud();
    renderTray();
  }

  function grantXp(amount) {
    if (!amount || preview.on) {
      renderHud();
      return;
    }
    const before = B.stageFromLevel(data.level);
    const levels = B.state.addXp(amount);
    const after = B.stageFromLevel(data.level);
    if (data.level >= 9 && !data.legendSeen) {
      data.legendSeen = true;
      data.legendOn = true;
      if (data.owned.indexOf('sun') === -1) data.owned.push('sun');
      data.worn.charm = 'sun';
      queueSheet({ mode: 'evo', stage: 4, level: data.level });
    } else if (after > before) {
      data.stageSeen = after;
      queueSheet({ mode: 'evo', stage: after, level: data.level });
    } else if (levels > 0) {
      data.coins = Math.min(9999, data.coins + 8);
      queueSheet({ mode: 'level', level: data.level });
    }
    renderHud();
  }

  function queueSheet(opts) {
    sheetQ.push(opts);
    if (sheet.hidden && app.dataset.mode !== 'play') openNextSheet();
  }

  function openNextSheet() {
    const next = sheetQ.shift();
    if (!next) { sheet.hidden = true; sheetMode = null; return; }
    sheetMode = next;
    sheet.hidden = false;
    sheet.classList.toggle('evo', next.mode === 'evo');
    sheet.classList.toggle('chest-open', next.mode === 'chest');
    document.getElementById('chest-art').hidden = next.mode !== 'chest';
    document.getElementById('sheet-stats').hidden = next.mode !== 'over';
    document.getElementById('sheet-alt').hidden = next.mode !== 'over';
    const animal = meta();
    if (next.mode === 'evo') {
      const label = next.stage === 4 ? animal.stages[3] : animal.stages[next.stage - 1];
      document.getElementById('sheet-kicker').textContent = next.stage === 4 ? 'Legend' : 'They grew';
      document.getElementById('sheet-title').textContent = label;
      document.getElementById('sheet-body').textContent = next.stage === 4
        ? 'Yoh. A sun pendant, and the whole savanna noticed.'
        : 'Look at that. Level ' + next.level + ', and a brand new silhouette.';
      document.getElementById('sheet-ok').textContent = 'Lekker';
      burst(18);
      B.audio.fanfare();
    } else if (next.mode === 'level') {
      document.getElementById('sheet-kicker').textContent = 'Level up';
      document.getElementById('sheet-title').textContent = 'Level ' + next.level;
      document.getElementById('sheet-body').textContent = 'Sharp sharp. Eight coins for the stall.';
      document.getElementById('sheet-ok').textContent = 'Howzit';
      burst(10);
      B.audio.chime();
    } else if (next.mode === 'chest') {
      document.getElementById('sheet-kicker').textContent = 'Day ' + data.streak;
      document.getElementById('sheet-title').textContent = 'A little something';
      document.getElementById('sheet-body').textContent = 'Daily chest: ' + next.coins + ' coins. The lodge remembers you.';
      document.getElementById('sheet-ok').textContent = 'Open';
      B.audio.chime();
    } else if (next.mode === 'over') {
      document.getElementById('sheet-kicker').textContent = 'Game';
      document.getElementById('sheet-title').textContent = next.title;
      document.getElementById('sheet-body').textContent = next.body;
      document.getElementById('go-score').textContent = String(next.score);
      document.getElementById('go-best').textContent = String(data.best[next.kind] || 0);
      document.getElementById('go-coins').textContent = String(next.coins);
      document.getElementById('sheet-ok').textContent = 'Again';
      document.getElementById('sheet-alt').textContent = 'Done';
    }
  }

  function closeSheet(which) {
    const mode = sheetMode;
    sheet.hidden = true;
    sheet.classList.remove('evo', 'chest-open');
    sheetMode = null;
    if (mode && mode.mode === 'chest' && which === 'ok') {
      const rect = document.getElementById('coins').getBoundingClientRect();
      flyCoins(rect.left, rect.top + 80, 6);
    }
    if (mode && mode.mode === 'over') {
      if (which === 'ok') {
        const kind = B.games.kind();
        resize();
        B.games.start(kind || 'dash', W, H);
        return;
      }
      leaveGame();
    }
    if (sheetQ.length) openNextSheet();
  }

  function flyCoins(x, y, n) {
    const dest = document.getElementById('coin-num').getBoundingClientRect();
    const coins = document.getElementById('coins');
    const count = reduced ? 0 : Math.min(8, n);
    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      el.className = 'flyer';
      el.style.left = (x + (Math.random() - 0.5) * 24) + 'px';
      el.style.top = y + 'px';
      document.body.appendChild(el);
      const dx = dest.left + dest.width / 2 - x;
      const dy = dest.top + dest.height / 2 - y;
      el.animate([
        { transform: 'translate(0,0) scale(1)' },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.45)' }
      ], { duration: 650, delay: i * 40, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      setTimeout(() => el.remove(), 760 + i * 40);
    }
    coins.classList.remove('ping');
    void coins.offsetWidth;
    coins.classList.add('ping');
    if (n) B.audio.coin();
  }

  function burst(n) {
    if (reduced) return;
    const names = ['star', 'spark', 'circle', 'twirl'];
    for (let i = 0; i < n; i++) {
      confetti.push({
        x: Math.random() * W,
        y: H * 0.2,
        vx: (Math.random() - 0.5) * 140,
        vy: -80 - Math.random() * 120,
        g: 280,
        life: 1.6 + Math.random() * 0.6,
        s: 12 + Math.random() * 14,
        img: names[i % names.length],
        rot: Math.random() * 6
      });
    }
  }

  function resize() {
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    if (w < 20 || h < 20) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    fx.width = canvas.width;
    fx.height = canvas.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fxc.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = w;
    H = h;
    const pr = pickCanvas.getBoundingClientRect();
    if (pr.width > 20) {
      pickCanvas.width = Math.round(pr.width * dpr);
      pickCanvas.height = Math.round(pr.height * dpr);
      pickCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
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

  function onDown(e) {
    if (!sheet.hidden || app.dataset.mode === 'pick' || app.dataset.mode === 'lineup') return;
    const p = localPoint(e);
    if (app.dataset.mode === 'play') {
      B.games.pointer('down', p.x, p.y);
      gesture = { pid: e.pointerId, game: true };
      return;
    }
    const spot = hitTest(p.x, p.y);
    gesture = { pid: e.pointerId, x: p.x, y: p.y, cx: e.clientX, cy: e.clientY, t: performance.now(), id: spot && spot.id, slot: spot && spot.slot };
    session.pointer = p;
    session.scrubDist = 0;
    if (room === 'bath' && spot && spot.id === 'pet') session.scrubbing = true;
  }

  function onMove(e) {
    if (!gesture || e.pointerId !== gesture.pid) return;
    const p = localPoint(e);
    session.pointer = p;
    if (gesture.game) { B.games.pointer('move', p.x, p.y); return; }
    if (session.scrubbing) {
      const dist = Math.hypot(p.x - gesture.x, p.y - gesture.y);
      gesture.x = p.x;
      gesture.y = p.y;
      if (dist > 0.5) {
        session.scrubDist += dist;
        session.foam = Math.min(1, session.foam + dist * 0.004);
        data.clean = B.clamp(data.clean + Math.min(0.25, dist * 0.006), 0, 100);
        if (performance.now() - session.lastSqueak > 160) {
          session.lastSqueak = performance.now();
          B.audio.squeak();
        }
      }
    }
  }

  function onUp(e) {
    if (!gesture || e.pointerId !== gesture.pid) return;
    const p = localPoint(e);
    if (gesture.game) { B.games.pointer('up', p.x, p.y); gesture = null; session.scrubbing = false; return; }
    const movedX = e.clientX - gesture.cx;
    const movedY = e.clientY - gesture.cy;
    const dt = performance.now() - gesture.t;
    session.scrubbing = false;
    const flick = dt < 360 && Math.abs(movedX) > 64 && Math.abs(movedX) > Math.abs(movedY) * 1.4 && session.scrubDist < 80;
    if (flick) {
      const idx = rooms.indexOf(room);
      setRoom(rooms[(idx + (movedX < 0 ? 1 : -1) + rooms.length) % rooms.length]);
      gesture = null;
      return;
    }
    if (Math.abs(movedX) < 18 && Math.abs(movedY) < 18) tapSpot(gesture.id, gesture.slot);
    gesture = null;
  }

  function tapSpot(id, slot) {
    B.audio.unlock();
    if (!id) return;
    if (String(id).indexOf('poo-') === 0) { scoop(slot); return; }
    if (id === 'shower') { rinse(); return; }
    if (id === 'lamp') { toggleSleep(); return; }
    if (id === 'power') { triggerShed(); return; }
    if (id === 'pet') {
      session.pop = 0.1;
      if (room === 'boma' && session.sleeping) toggleSleep();
      else if (room === 'boma' || room === 'play') tickle();
      else say(moodLine());
    }
  }

  function updateWorld(dt) {
    session.t += dt;
    if (!reduced && session.prevRoom) {
      session.shift += (0 - session.shift) * Math.min(1, dt * 8);
      if (Math.abs(session.shift) < 0.6) { session.shift = 0; session.prevRoom = null; }
    }
    if (session.speech > 0) {
      session.speech -= dt;
      if (session.speech <= 0) speech.hidden = true;
    }
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) toastEl.hidden = true;
    }
    if (session.eat > 0) session.eat -= dt;
    if (session.pop > 0) session.pop = Math.max(0, session.pop - dt * 0.4);
    if (session.giggle > 0) session.giggle -= dt;
    if (session.shedding > 0) {
      session.shedding -= dt;
      if (session.shedding <= 0) { session.lampOn = !session.sleeping; say(pick(lines.shedOn)); }
    } else if (room === 'boma' && !session.sleeping && sheet.hidden) {
      session.shedIn -= dt;
      if (session.shedIn <= 0) { triggerShed(); session.shedIn = 150; }
    }
    const head = B.art.anchors.head;
    if (head && session.pointer) {
      const tx = B.clamp((session.pointer.x - head.x) / 80, -1, 1);
      const ty = B.clamp((session.pointer.y - head.y) / 90, -1, 1);
      session.lookX += (tx - session.lookX) * Math.min(1, dt * 8);
      session.lookY += (ty - session.lookY) * Math.min(1, dt * 8);
    } else {
      session.lookX += (0 - session.lookX) * Math.min(1, dt * 3);
      session.lookY += (0 - session.lookY) * Math.min(1, dt * 3);
    }
    if (app.dataset.mode === 'live' && !preview.on) {
      if (session.sleeping) data.energy = B.clamp(data.energy + dt * 8, 0, 100);
      else {
        data.hunger = B.clamp(data.hunger - dt * 0.12, B.FLOOR, 100);
        data.clean = B.clamp(data.clean - dt * 0.08, B.FLOOR, 100);
        data.energy = B.clamp(data.energy - dt * 0.1, B.FLOOR, 100);
        data.fun = B.clamp(data.fun - dt * 0.1, B.FLOOR, 100);
        session.pooIn -= dt;
        if (session.pooIn <= 0) {
          session.pooIn = 70;
          if (data.poos.length < 2 && data.hunger > 45) {
            const slot = data.poos.indexOf(0) === -1 ? 0 : 1;
            data.poos.push(slot);
            data.clean = B.clamp(data.clean - 4, B.FLOOR, 100);
            say(pick(lines.poo));
          }
        }
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    session.saveIn -= dt;
    if (session.saveIn <= 0) { session.saveIn = 3; B.state.save(); }
  }

  function drawRoom(which, shift) {
    hotspots.length = 0;
    ctx.save();
    ctx.translate(shift || 0, 0);
    B.world.draw(ctx, W, H, {
      room: which,
      t: session.t,
      anim: buildAnim(),
      poos: data.poos,
      decor: data.decorOn,
      shedding: session.shedding,
      lampOn: session.lampOn,
      hotspots: hotspots,
      reduced: reduced
    });
    ctx.restore();
  }

  function drawLineup() {
    ctx.fillStyle = '#FFF6E8';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#E7C49A';
    ctx.fillRect(0, H * 0.78, W, H);
    ctx.fillStyle = '#3A271C';
    ctx.textAlign = 'center';
    ctx.font = '700 16px Fredoka, Nunito, sans-serif';
    if (lineup === 'adults') {
      const ids = ['lion', 'leopard', 'elephant', 'rhino', 'buffalo'];
      const scale = Math.min(0.85, (W / ids.length) / 150);
      ids.forEach((id, i) => {
        const x = (i + 0.5) * W / ids.length;
        B.art.drawPet(ctx, x, H * 0.74, scale, {
          species: id, stage: 3, t: session.t, eyes: 'open', mouth: 'smile', worn: {}
        });
        ctx.fillStyle = '#3A271C';
        ctx.fillText(B.animalById(id).title, x, H * 0.9);
      });
      return;
    }
    const id = lineup && lineup !== '1' ? lineup : 'lion';
    const labels = ['Baby', 'Youngster', 'Adult'];
    [1, 2, 3].forEach((st, i) => {
      const x = (i + 0.5) * W / 3;
      B.art.drawPet(ctx, x, H * 0.72, Math.min(0.95, W / 3 / 160), {
        species: id, stage: st, t: session.t, eyes: 'open', mouth: 'smile', worn: {}
      });
      ctx.fillStyle = '#3A271C';
      ctx.fillText(labels[i], x, H * 0.9);
    });
  }

  function drawPicker() {
    const rect = pickCanvas.getBoundingClientRect();
    const animal = B.animals[pickIndex];
    pickCtx.clearRect(0, 0, rect.width, rect.height);
    B.art.drawPet(pickCtx, rect.width / 2, rect.height * 0.86, Math.min(rect.width, rect.height) / 280, {
      species: animal.id, stage: 1, t: session.t, eyes: 'open', mouth: 'smile', worn: {}
    });
  }

  function showPicker() {
    app.dataset.mode = 'pick';
    picker.hidden = false;
    paintPick();
    requestAnimationFrame(resize);
  }

  function paintPick() {
    const animal = B.animals[pickIndex];
    document.getElementById('pick-title').textContent = animal.title + ' ' + animal.youngWord;
    document.getElementById('pick-person').textContent = animal.personality;
    const input = document.getElementById('pick-name');
    if (!input.dataset.dirty) input.value = animal.names[0];
    document.getElementById('pick-dots').innerHTML = B.animals.map((a, i) => {
      return '<i class="' + (i === pickIndex ? 'on' : '') + '"></i>';
    }).join('');
  }

  function confirmPick() {
    const animal = B.animals[pickIndex];
    const name = document.getElementById('pick-name').value.replace(/[^\w\s'-]/g, '').trim().slice(0, 16) || animal.names[0];
    data.animal = animal.id;
    data.petName = name;
    data.seenIntro = true;
    data.stageSeen = 1;
    B.state.save();
    picker.hidden = true;
    app.dataset.mode = 'live';
    renderHud();
    renderTray();
    say('Howzit, ' + name + '.');
    B.audio.fanfare();
    if (data.lastGift !== B.todayKey()) offerChest();
  }

  function offerChest() {
    const prev = data.lastGift;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const ykey = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    data.streak = prev === ykey ? (data.streak || 0) + 1 : 1;
    data.lastGift = B.todayKey();
    const coins = Math.min(40, 18 + data.streak * 2);
    data.coins = Math.min(9999, data.coins + coins);
    B.state.save();
    renderHud();
    queueSheet({ mode: 'chest', coins: coins });
  }

  function startGame(kind) {
    B.audio.unlock();
    B.games.look = { species: species(), stage: stage(), legend: legend() };
    app.dataset.mode = 'play';
    hudLive.hidden = true;
    hudPlay.hidden = false;
    sheet.hidden = true;
    speech.hidden = true;
    resize();
    B.games.start(kind, W, H);
  }

  function leaveGame() {
    app.dataset.mode = 'live';
    hudPlay.hidden = true;
    hudLive.hidden = false;
    sheet.hidden = true;
    banner.hidden = true;
    B.games.clear();
    renderTray();
    renderHud();
    resize();
    if (sheetQ.length) openNextSheet();
  }

  B.games.onFinish = function (result) {
    if (!result) return;
    if (result.isBest) data.best[result.kind] = result.score;
    if (result.coins) data.coins = Math.min(9999, data.coins + result.coins);
    if (result.xp) grantXp(result.xp);
    else renderHud();
    B.state.save();
    const rect = canvas.getBoundingClientRect();
    if (result.coins) flyCoins(rect.left + rect.width / 2, rect.top + rect.height / 2, Math.min(7, result.coins));
    sheetQ.unshift({
      mode: 'over', title: result.title, body: result.body,
      score: result.score, coins: result.coins, kind: result.kind
    });
    openNextSheet();
  };

  let frames = 0;
  let fpsAcc = 0;
  function loop(ts) {
    if (!last) last = ts;
    const dt = Math.min(0.034, (ts - last) / 1000);
    last = ts;
    if (qa) {
      frames += 1;
      fpsAcc += dt;
      if (fpsAcc >= 1) {
        const el = document.getElementById('qa');
        el.hidden = false;
        el.textContent = frames + ' fps';
        frames = 0;
        fpsAcc = 0;
      }
    }
    if (app.dataset.mode === 'pick') {
      session.t += dt;
      drawPicker();
    } else if (lineup && app.dataset.mode === 'lineup') {
      session.t += dt;
      drawLineup();
    } else if (app.dataset.mode === 'play') {
      B.games.update(dt, W, H);
      ctx.clearRect(0, 0, W, H);
      B.games.draw(ctx, W, H);
      const v = B.games.view;
      document.getElementById('g-score').textContent = String(v.score);
      document.getElementById('g-time').textContent = String(Math.ceil(v.time));
      document.getElementById('g-extra').textContent = String(v.extra);
      document.getElementById('g-extra-label').textContent = v.extraLabel;
      banner.hidden = !v.banner;
      banner.textContent = v.banner || '';
    } else {
      updateWorld(dt);
      if (session.prevRoom) drawRoom(session.prevRoom, session.shift - Math.sign(session.shift) * W);
      drawRoom(room, session.shift);
      const head = B.art.anchors.head;
      if (head) speech.style.left = Math.max(70, Math.min(W - 70, head.x)) + 'px';
      if (Math.floor(session.t * 4) % 2 === 0) renderHud();
    }
    fxc.clearRect(0, 0, W, H);
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += c.g * dt;
      c.life -= dt;
      c.rot += dt * 4;
      const img = fxImg[c.img];
      if (img && img.complete && c.life > 0) {
        fxc.save();
        fxc.translate(c.x, c.y);
        fxc.rotate(c.rot);
        fxc.globalAlpha = Math.max(0, Math.min(1, c.life));
        fxc.drawImage(img, -c.s / 2, -c.s / 2, c.s, c.s);
        fxc.restore();
      }
      if (c.life <= 0) confetti.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }

  document.querySelectorAll('.tab').forEach((btn) => {
    btn.querySelector('.ico').innerHTML = B.icons.tabs[btn.dataset.room] || '';
    btn.addEventListener('click', () => setRoom(btn.dataset.room));
  });
  document.getElementById('mute').addEventListener('click', () => {
    data.muted = !data.muted;
    B.audio.unlock();
    if (!data.muted) B.audio.blip();
    B.state.save();
    renderHud();
  });
  document.getElementById('exit-game').addEventListener('click', () => {
    if (!B.games.started()) { B.games.clear(); leaveGame(); return; }
    B.games.stop();
  });
  document.getElementById('sheet-ok').addEventListener('click', () => closeSheet('ok'));
  document.getElementById('sheet-alt').addEventListener('click', () => closeSheet('alt'));
  document.getElementById('pick-prev').addEventListener('click', () => {
    pickIndex = (pickIndex + B.animals.length - 1) % B.animals.length;
    document.getElementById('pick-name').dataset.dirty = '';
    paintPick();
    B.audio.blip();
  });
  document.getElementById('pick-next').addEventListener('click', () => {
    pickIndex = (pickIndex + 1) % B.animals.length;
    document.getElementById('pick-name').dataset.dirty = '';
    paintPick();
    B.audio.blip();
  });
  document.getElementById('pick-name').addEventListener('input', (e) => { e.target.dataset.dirty = '1'; });
  document.getElementById('pick-ok').addEventListener('click', confirmPick);

  let pickDrag = null;
  picker.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input')) return;
    pickDrag = { x: e.clientX };
  });
  picker.addEventListener('pointerup', (e) => {
    if (!pickDrag) return;
    const dx = e.clientX - pickDrag.x;
    pickDrag = null;
    if (dx > 40) document.getElementById('pick-prev').click();
    else if (dx < -40) document.getElementById('pick-next').click();
  });

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    B.audio.unlock();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    onDown(e);
  });
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
    drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
  });
  window.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const ghost = drag.ghost;
    const food = drag.food;
    const rect = ghost.getBoundingClientRect();
    ghost.remove();
    drag = null;
    document.querySelectorAll('.food.dim').forEach((el) => el.classList.remove('dim'));
    tryFeed(food, e.clientX || rect.left, e.clientY || rect.top);
  });

  document.addEventListener('visibilitychange', () => {
    B.state.save();
    if (!document.hidden && !preview.on) {
      data.hunger = B.clamp(data.hunger, B.FLOOR, 100);
      renderHud();
    }
    last = 0;
  });
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stageEl);

  if (qa) {
    window.addEventListener('error', (e) => {
      const el = document.getElementById('qa');
      el.hidden = false;
      el.textContent = 'ERR ' + e.message;
    });
    const el = document.getElementById('qa');
    try {
      localStorage.setItem('big5-qa', '1');
      if (localStorage.getItem('big5-qa') !== '1') throw new Error('save');
      localStorage.removeItem('big5-qa');
      el.dataset.save = 'ok';
    } catch (err) {
      el.dataset.save = 'fail';
    }
    requestAnimationFrame(() => {
      el.dataset.wide = String(document.documentElement.scrollWidth > window.innerWidth + 2);
    });
  }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  buildMeters();
  app.dataset.room = room;
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.setAttribute('aria-selected', btn.dataset.room === room ? 'true' : 'false');
  });
  renderHud();
  renderTray();
  resize();

  if (lineup) {
    app.dataset.mode = 'lineup';
    picker.hidden = true;
  } else if (!data.seenIntro && !preview.on) {
    showPicker();
  } else {
    picker.hidden = true;
    if (!session.greeted && data.petName) {
      session.greeted = true;
      say('Howzit, ' + data.petName + '.');
    }
    if (data.seenIntro && !preview.on && data.lastGift !== B.todayKey() && params.get('chest') !== '0') offerChest();
    if (params.get('evo') === '1') {
      queueSheet({ mode: 'evo', stage: stage() === 1 && !preview.stage ? 2 : (preview.stage || stage()), level: data.level });
    }
    if (params.get('chest') === '1') queueSheet({ mode: 'chest', coins: 24 });
    const qGame = params.get('game');
    if (qGame && ['dash', 'fruit', 'splash', 'pounce'].indexOf(qGame) >= 0) startGame(qGame);
  }

  requestAnimationFrame(loop);
})(window.Big5 = window.Big5 || {});
