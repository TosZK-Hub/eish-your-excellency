import * as audio from './audio.js';
import {
  LEVEL_COUNT,
  applyAction,
  buildLevel,
  createState,
  dateKey,
  difficultyOf,
  generateDaily,
  grantExtraBay,
  hashString,
  hintTaxi,
  interpret,
  interpretSend,
  isLose,
  isWin,
  loseReason,
  prepare,
  regionFor,
  shareText,
  shuffleRemaining,
  starsFor,
  weekendLevel,
} from './engine.js';
import * as storage from './storage.js';
import { COPY, HORNS, LIVERIES, RANKS, REGIONS, SHOUTS, theme } from './theme.js';
import { createBoard, createTurntable, renderThumb } from './world.js';

const reduced = typeof matchMedia === 'function'
  && matchMedia('(prefers-reduced-motion: reduce)').matches;

const params = new URLSearchParams(location.search);
if (params.has('reset')) storage.reset();
const levelArg = Number(params.get('level'));
const flags = {
  level: Number.isFinite(levelArg) ? levelArg : 0,
  daily: params.has('daily'),
  bot: params.has('bot'),
  mute: params.has('mute'),
  lose: params.has('lose'),
};
globalThis.TRR_FLAGS = flags;

const saveAtBoot = storage.load();
audio.setMuted(flags.mute || saveAtBoot.sound === false);
audio.setMusicOn(saveAtBoot.music !== false);
audio.setHorn(saveAtBoot.horn || 'hoot');
audio.preloadMenu();

const $ = (id) => document.getElementById(id);
let dailyLevel = null;
let board = null;
let turntable = null;
let game = null;
let toastTimer = 0;
let adToken = 0;
let lastTick = performance.now();

const ICONS = {
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  restart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2-4.9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M19 4.5V9h-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" fill="currentColor"/><path d="M15.2 9.2a3.6 3.6 0 0 1 0 5.6M17.4 7a6.2 6.2 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h3.2L12 6.2v11.6L7.2 14H4v-4Z" fill="currentColor"/><path d="m16 10 4 4m0-4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="13.5" r="2.5" fill="currentColor"/></svg>',
  musicOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m15 15 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  arrows: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M12 4l-3.2 3.2M12 4l3.2 3.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="#F2C14E"/><circle cx="12" cy="12" r="5.2" fill="none" stroke="#C9842A" stroke-width="1.6"/></svg>',
  bay: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v6M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  undo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8H5.5V5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M6 12a6 6 0 1 0 1.6-4.1L5.5 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4.2l2.2 3.2L13 7h7M16.5 4.5 20 7l-3.5 2.5M4 17h4.2l2.2-3.2L13 17h7M16.5 14.5 20 17l-3.5 2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function announce(screen, detail = '') {
  document.body.dataset.screen = screen;
  const live = $('live');
  if (live) live.textContent = detail || screen;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, reduced ? Math.min(24, ms) : ms);
  });
}

function buzz(length) {
  if (reduced) return;
  try {
    navigator.vibrate?.(length);
  } catch {
    /* some browsers block vibration */
  }
}

function prettyDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

async function shareResult(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'abort';
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-999px';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok ? 'copied' : 'failed';
  }
}

function showToast(text, clientX, clientY) {
  const toast = $('toast');
  const app = $('app').getBoundingClientRect();
  toast.hidden = false;
  toast.textContent = text;
  const x = clientX == null ? app.left + app.width / 2 : clientX;
  const y = clientY == null ? app.top + app.height * 0.4 : clientY;
  toast.style.left = `${x - app.left}px`;
  toast.style.top = `${y - app.top}px`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 1000);
}

function paintCoins() {
  const amount = storage.load().coins;
  for (const id of ['t-coins', 'm-coins', 's-coins', 'd-coins', 'g-coins']) {
    const node = $(id);
    if (!node) continue;
    const text = node.querySelector('span') || node;
    if (node.querySelector('span')) node.querySelector('span').textContent = String(amount);
    else text.textContent = String(amount);
  }
}

function soundIcon() {
  return audio.isMuted() ? ICONS.mute : ICONS.sound;
}

function paintSound() {
  for (const id of ['t-mute', 'g-mute']) {
    const button = $(id);
    if (!button) continue;
    button.innerHTML = soundIcon();
    button.setAttribute('aria-label', audio.isMuted() ? 'Unmute' : 'Mute');
    button.setAttribute('aria-pressed', audio.isMuted() ? 'true' : 'false');
  }
  for (const id of ['t-music', 'g-music']) {
    const button = $(id);
    if (!button) continue;
    const on = audio.isMusicOn();
    button.innerHTML = on ? ICONS.music : ICONS.musicOff;
    button.classList.toggle('off', !on);
    button.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  const arrows = $('t-arrows');
  if (arrows) {
    arrows.innerHTML = ICONS.arrows;
    arrows.classList.toggle('on', !!storage.load().arrows);
    arrows.setAttribute('aria-pressed', storage.load().arrows ? 'true' : 'false');
  }
}

function toggleMute() {
  const on = audio.isMuted();
  audio.setMuted(!on);
  storage.setSound(on);
  audio.tap();
  paintSound();
}

function toggleMusic() {
  const next = !audio.isMusicOn();
  audio.setMusicOn(next);
  storage.setMusic(next);
  audio.unlock();
  if (next) audio.tap();
  paintSound();
}

function musicForLevel(level, mode) {
  if (mode === 'daily') return 'rushhour';
  if (level && level.id && level.id % 10 === 0) return 'rushhour';
  return 'gameplay';
}

function showOnly(name) {
  for (const screen of document.querySelectorAll('.screen')) screen.hidden = true;
  $(`screen-${name}`).hidden = false;
  announce(name);
  if (name !== 'game' && board && board.stop) board.stop();
  if (name === 'title') {
    if (turntable) {
      turntable.setLook(storage.load().livery);
      turntable.resize();
      turntable.start();
    }
  } else if (turntable) turntable.stop();
  if (name !== 'game') audio.setMusicScene('menu');
}

function showTitle() {
  const save = storage.load();
  const next = Math.min(LEVEL_COUNT, Math.max(1, save.unlocked));
  $('t-play').textContent = save.unlocked > 1 ? `Play ${next}` : COPY.play;
  paintCoins();
  paintSound();
  const weekend = [0, 6].includes(new Date().getDay()) || params.has('event');
  $('t-event').hidden = !weekend;
  showOnly('title');
  if (turntable && turntable.setStage) turntable.setStage(storage.load().rank || 0);
  announce('title', theme.title);
}

let mapPage = 0;
function worldOpts() {
  const save = storage.load();
  return { livery: save.livery, colorblind: !!save.colorblind, showArrows: true };
}

function showMap() {
  const save = storage.load();
  mapPage = Math.floor((Math.min(LEVEL_COUNT, save.unlocked) - 1) / 12);
  paintCoins();
  drawMap();
  showOnly('map');
  announce('map', 'Level map');
}

function drawMap() {
  const save = storage.load();
  $('m-range').textContent = `${mapPage * 12 + 1}–${mapPage * 12 + 12}`;
  const grid = $('m-grid');
  grid.replaceChildren();
  for (let i = 0; i < 12; i += 1) {
    const id = mapPage * 12 + i + 1;
    const open = id <= save.unlocked;
    const stars = storage.starsFor(save, id);
    const level = buildLevel(id);
    const badge = level.difficulty === 'super' ? 'S' : level.difficulty === 'hard' ? 'H' : '';
    const mark = [badge, level.tutorial ? level.tutorial.mech.slice(0, 1).toUpperCase() : ''].filter(Boolean).join(' ');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `level${open ? '' : ' locked'}${id === save.unlocked ? ' current' : ''}`;
    button.innerHTML = `<small>${mark}</small><strong>${id}</strong><em>${'★★★'.slice(0, stars)}${'☆☆☆'.slice(stars)}</em>`;
    button.addEventListener('click', () => {
      if (!open) {
        const rect = button.getBoundingClientRect();
        showToast('Locked', rect.left + rect.width / 2, rect.top);
        return;
      }
      audio.tap();
      startLevel({ mode: 'level', id });
    });
    grid.append(button);
  }
}

function showShop() {
  const list = $('s-list');
  list.replaceChildren();
  const save = storage.load();
  paintCoins();
  for (const item of LIVERIES) {
    const owned = save.owned.includes(item.id);
    const equipped = save.livery === item.id;
    const row = document.createElement('article');
    row.className = 'shop-row';
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 120;
    canvas.className = 'thumb';
    try {
      renderThumb(canvas, item.id);
    } catch (err) {
      console.error(err);
    }
    const copy = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = item.name;
    const blurb = document.createElement('p');
    blurb.textContent = item.blurb;
    copy.append(name, blurb);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn small${equipped ? '' : ' primary'}`;
    button.textContent = equipped ? COPY.equipped : owned ? COPY.equip : String(item.price);
    button.addEventListener('click', () => {
      audio.tap();
      if (equipped) return;
      if (owned) storage.equipLivery(item.id);
      else {
        const result = storage.buyLivery(item.id, item.price);
        if (!result.ok) {
          const rect = button.getBoundingClientRect();
          showToast('Need coins', rect.left + rect.width / 2, rect.top);
          return;
        }
        audio.coin();
      }
      showShop();
    });
    row.append(canvas, copy, button);
    list.append(row);
  }
  showOnly('shop');
  announce('shop', 'Liveries');
}

function showDaily() {
  const today = dateKey(new Date());
  let level = null;
  try {
    level = generateDaily(new Date());
    prepare(level);
    dailyLevel = level;
  } catch (err) {
    console.error(err);
  }
  const save = storage.load();
  $('d-date').textContent = prettyDate(today);
  $('d-lead').textContent = COPY.dailyLead;
  const streak = save.dailyDate === today || save.dailyStreak
    ? `Streak ${save.dailyStreak || 0}`
    : 'Streak 0';
  $('d-streak').textContent = streak;
  const done = save.dailyDate === today;
  $('d-done').hidden = !done;
  $('d-done').textContent = COPY.dailyDone;
  $('d-stars').hidden = !done;
  $('d-stars').textContent = `${'★★★'.slice(0, save.dailyStars || 0)}${'☆☆☆'.slice(save.dailyStars || 0)}`;
  $('d-play').textContent = done ? 'Play again' : COPY.play;
  $('d-share').hidden = !done;
  $('d-play').onclick = () => {
    if (!level) return;
    audio.tap();
    startLevel({ mode: 'daily' });
  };
  $('d-share').onclick = async () => {
    if (!level) return;
    const text = shareText(level, {
      daily: true,
      stars: save.dailyStars || 1,
      moves: level.par,
      time: 0,
    }, prettyDate(today));
    const result = await shareResult(text);
    if (result === 'copied') showToast(COPY.copied);
  };
  paintCoins();
  showOnly('daily');
  announce('daily', `Rush Hour ${prettyDate(today)}`);
}

function ensureBoard() {
  if (board) return !!board.stop;
  const created = createBoard($('board'));
  if (!created.ok) {
    console.error(created.error);
    return false;
  }
  board = created;
  const wrap = $('board-wrap');
  const observer = new ResizeObserver(() => board.resize());
  observer.observe(wrap);
  $('board').addEventListener('pointerdown', (event) => {
    if (!game || game.busy || game.over || game.adOpen) return;
    const hit = board.pick(event.clientX, event.clientY);
    if (!hit) return;
    if (hit.kind === 'queue') onSend(hit.queue);
    else if (hit.kind === 'taxi') onTaxi(hit.id);
  });
  return true;
}

function refresh() {
  if (!game) return;
  $('g-moves').textContent = `Moves ${game.state.moves}`;
  $('g-time').textContent = `${Math.floor(game.elapsed / 1000)}s`;
  const coins = $('g-coins');
  const amount = String(storage.load().coins);
  const label = coins.querySelector('span');
  if (label) label.textContent = amount;
  $('g-bay').disabled = !!game.state.extraUsed || game.over || game.busy;
  $('g-undo').disabled = game.undo.length === 0 || game.over || game.busy;
  $('g-shuffle').disabled = game.over || game.busy;
}

function closeModal() {
  const modal = $('modal');
  modal.hidden = true;
  modal.replaceChildren();
  if (game && !game.over) announce('game', game.level.name || 'Level');
}

function openCard() {
  const modal = $('modal');
  modal.hidden = false;
  modal.replaceChildren();
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  modal.append(card);
  return card;
}

function button(label, className, onClick) {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = className;
  node.textContent = label;
  node.addEventListener('click', onClick);
  return node;
}

function startLevel(launch) {
  if (!ensureBoard()) {
    $('boot').hidden = false;
    $('boot').textContent = 'This browser cannot start the 3D rank.';
    return;
  }
  const save = storage.load();
  let level;
  let modeLaunch = launch;
  if (launch.mode === 'event' && launch.level) {
    level = launch.level;
    prepare(level);
  } else if (launch.mode === 'daily') {
    level = dailyLevel || generateDaily(new Date());
    prepare(level);
    level.intro = level.intro || 'Rush Hour. One shared rank for today.';
    dailyLevel = level;
  } else {
    const id = Math.min(LEVEL_COUNT, Math.max(1, launch.id | 0));
    const fails = storage.load().fails[String(id)] || 0;
    level = buildLevel(id, { easier: fails >= 2 ? 1 : 0 });
    prepare(level);
    modeLaunch = { mode: 'level', id };
  }
  const livery = LIVERIES.some((item) => item.id === save.livery) ? save.livery : 'plain';
  game = {
    launch: modeLaunch,
    level,
    state: createState(level),
    hidden: level.taxis.map((taxi) => !!taxi.hidden),
    squeezeUsed: false,
    adBayUsed: false,
    lastInput: performance.now(),
    hinted: false,
    livery,
    showArrows: !!save.arrows || (modeLaunch.mode !== 'daily' && level.id >= 1 && level.id <= 3),
    elapsed: 0,
    shown: -1,
    timing: false,
    busy: false,
    over: false,
    adOpen: false,
    paid: false,
    undo: [],
    botAt: 0,
    botting: !!(flags.bot && level.guide),
  };
  $('g-title').textContent = level.name || `Level ${level.id}`;
  $('g-par').textContent = `Par ${level.par}`;
  const intro = $('g-intro');
  intro.hidden = !level.intro;
  intro.textContent = level.intro || '';
  closeModal();
  showOnly('game');
  audio.setMusicScene(musicForLevel(level, modeLaunch.mode));
  announce('game', level.name || `Level ${level.id}`);
  board.load(level, game.state, game.hidden, worldOpts());
  const diff = $('g-diff');
  if (diff) {
    diff.textContent = level.difficulty === 'super' ? 'Super Hard' : level.difficulty === 'hard' ? 'Hard' : '';
    diff.hidden = !diff.textContent;
    diff.className = `badge ${level.difficulty || ''}`;
  }
  const timeStat = $('g-time');
  if (timeStat) timeStat.hidden = modeLaunch.mode !== 'daily';
  $('screen-game').classList.toggle('rain', !!level.rain);
  showCoach();
  board.start();
  requestAnimationFrame(() => board.resize());
  paintSound();
  refresh();
  if (flags.lose) setTimeout(() => showLose('full'), 350);
  if (game.botting) setTimeout(() => botNext(), 450);
}

function pushUndo() {
  game.undo.push({
    state: {
      exited: Array.from(game.state.exited),
      bayTaxi: Array.from(game.state.bayTaxi),
      bayFilled: Array.from(game.state.bayFilled),
      boarded: game.state.boarded.map((row) => Array.from(row)),
      queues: game.state.queues.map((queue) => queue.map((person) => ({ ...person }))),
      moves: game.state.moves,
      departed: game.state.departed,
      combo: game.state.combo,
      squeezeUsed: game.state.squeezeUsed,
      revealed: Array.from(game.state.revealed),
    },
    coins: storage.load().coins,
    elapsed: game.elapsed,
  });
  if (game.undo.length > 40) game.undo.shift();
}

function restore(snap) {
  const raw = snap.state;
  game.state = {
    exited: Uint8Array.from(raw.exited),
    bayTaxi: Int16Array.from(raw.bayTaxi),
    bayFilled: Uint8Array.from(raw.bayFilled),
    boarded: raw.boarded.map((row) => Uint8Array.from(row)),
    queues: raw.queues.map((queue) => queue.map((person) => ({ ...person }))),
    moves: raw.moves,
    departed: raw.departed,
    combo: raw.combo,
    squeezeUsed: raw.squeezeUsed,
    revealed: Uint8Array.from(raw.revealed),
  };
  storage.setCoins(snap.coins);
  game.elapsed = snap.elapsed;
  game.shown = -1;
}

function reveal(id) {
  if (!game.hidden[id]) {
    board.reveal(id);
    return;
  }
  game.hidden[id] = false;
  board.reveal(id);
}

function revealAround(id) {
  const taxi = game.level.taxis[id];
  for (const other of game.level.taxis) {
    if (Math.abs(other.c - taxi.c) + Math.abs(other.r - taxi.r) === 1) reveal(other.id);
  }
  reveal(id);
}

async function playEvents(events) {
  for (const event of events) {
    if (event.t === 'exit') {
      audio.vroom();
      await board.exit(event.id, event.bay);
    } else if (event.t === 'board') {
      audio.pop();
      await board.board(event);
    } else if (event.t === 'depart') {
      const shout = event.combo >= 2;
      if (shout) audio.cheer(event.combo);
      else audio.hoot();
      const pay = (2 + (event.combo >= 2 ? event.combo : 0)) * (game.level.reward || 1);
      storage.addCoins(pay);
      bumpMission('depart');
      if (event.combo >= 3) bumpMission('combo', event.combo);
      if (shout) showToast(`${SHOUTS[event.combo % SHOUTS.length]} x${event.combo}`);
      await board.depart(event.taxiId);
      refresh();
    }
  }
  board.syncPeople(game.state);
}

function bumpMission(kind, value) {
  const today = dateKey(new Date());
  const save = storage.load();
  if (save.missionsDate !== today) {
    save.missionsDate = today;
    save.missionProgress = [0, 0, 0];
    save.missionClaimed = [false, false, false];
    storage.setCoins(save.coins);
  }
  const fresh = storage.load();
  if (fresh.missionsDate !== today) return;
  if (kind === 'depart') fresh.missionProgress[0] += 1;
  if (kind === 'combo') fresh.missionProgress[1] = Math.max(fresh.missionProgress[1] || 0, value || 0);
  if (kind === 'clear') fresh.missionProgress[2] += 1;
  localStorage.setItem('trr_save_v1', JSON.stringify(fresh));
}

function offerRescue() {
  if (!game.squeezeUsed) {
    game.adOpen = true;
    const card = openCard();
    const title = document.createElement('h2');
    title.textContent = 'Gaartjie squeeze';
    const body = document.createElement('p');
    body.textContent = 'One free bay for this try. No advert.';
    card.append(title, body, button('Take the bay', 'btn primary', () => {
      game.squeezeUsed = true;
      game.adOpen = false;
      closeModal();
      const res = grantExtraBay(game.state, game.level);
      game.state = res.state;
      board.load(game.level, game.state, null, worldOpts());
      if (isLose(game.state, game.level)) offerRescue();
    }));
    return;
  }
  if (!game.adBayUsed) {
    game.adOpen = true;
    const card = openCard();
    const title = document.createElement('h2');
    title.textContent = COPY.adTitle;
    const body = document.createElement('p');
    body.textContent = 'One more bay. Placeholder ad, nothing plays.';
    card.append(title, body, button(COPY.watch, 'btn primary', () => {
      game.adBayUsed = true;
      game.adOpen = false;
      closeModal();
      const res = grantExtraBay(game.state, game.level);
      game.state = res.state;
      board.load(game.level, game.state, null, worldOpts());
      if (isLose(game.state, game.level)) showLose(loseReason(game.state));
    }), button(COPY.notNow, 'btn', () => {
      game.adBayUsed = true;
      game.adOpen = false;
      closeModal();
      showLose(loseReason(game.state));
    }));
    return;
  }
  showLose(loseReason(game.state));
}

function afterAction() {
  if (isWin(game.state)) showWin();
  else if (isLose(game.state, game.level)) offerRescue();
}

async function finish(work) {
  game.busy = true;
  refresh();
  try {
    await work;
  } catch (err) {
    console.error(err);
  }
  if (!game) return;
  game.busy = false;
  refresh();
  if (game.botting && !game.over && !game.adOpen) {
    await wait(200);
    botNext();
  }
}

function pointOf(id) {
  const spot = board.project(id);
  return spot || null;
}

function touch() {
  game.lastInput = performance.now();
  game.hinted = false;
}

function refuse(id, message, blocker) {
  const spot = pointOf(id);
  finish((async () => {
    audio.hoot();
    buzz(14);
    if (spot) showToast(message, spot.x, spot.y);
    else showToast(message);
    await board.bump(id);
    if (blocker >= 0) board.flash(blocker);
  })());
}

function commit(action) {
  pushUndo();
  const res = applyAction(game.state, game.level, action);
  if (!res) {
    game.undo.pop();
    return;
  }
  game.state = res.state;
  board.setState(game.state);
  finish((async () => {
    await playEvents(res.events);
    afterAction();
  })());
}

function onTaxi(id) {
  if (!game || game.busy || game.over || game.adOpen) return;
  touch();
  const tap = interpret(game.state, game.level, id);
  if (tap.t === 'none') return;
  if (!game.timing && game.launch.mode === 'daily') game.timing = true;
  if (tap.reveal) game.state.revealed[id] = 1;
  if (tap.t === 'bump') {
    refuse(id, COPY.hoot, tap.blocker);
    board.syncPeople(game.state);
    return;
  }
  if (tap.t === 'locked') {
    const left = Math.max(0, (game.level.taxis[id].lockAfter || 0) - game.state.departed);
    refuse(id, `Lock ${left}`, null);
    return;
  }
  if (tap.t === 'red') {
    refuse(id, 'Red robot', null);
    return;
  }
  if (tap.t === 'nobay') {
    finish((async () => {
      audio.hoot();
      board.shake();
      showToast('Bays full');
      await wait(180);
      if (isLose(game.state, game.level)) offerRescue();
    })());
    return;
  }
  commit({ t: tap.t, id: tap.id });
}

function onSend(queue) {
  if (!game || game.busy || game.over || game.adOpen) return;
  touch();
  const tap = interpretSend(game.state, game.level, queue);
  if (tap.t === 'wait') {
    showToast('No seat yet');
    audio.hoot();
    return;
  }
  if (tap.t !== 'send') return;
  commit(tap);
}

function botNext() {
  if (!game || game.over || game.busy) return;
  const action = game.level.guide[game.botAt];
  game.botAt += 1;
  if (!action) return;
  if (action.t === 'send') onSend(action.queue);
  else onTaxi(action.id);
}

function askAd(kind) {
  if (!game || game.busy || game.adOpen) return;
  const tokenKind = kind === 'bay' ? 'bay' : kind;
  if ((storage.load().tokens[tokenKind] || 0) > 0) {
    storage.spendToken(tokenKind);
    if (kind === 'bay') doExtraBay();
    else if (kind === 'undo') doUndo();
    else doShuffle();
    refresh();
    return;
  }
  if (kind === 'undo' && !game.undo.length) {
    showToast('Nothing to undo');
    return;
  }
  if (kind === 'bay' && game.state.extraUsed) return;
  if (kind === 'shuffle') {
      let waiting = 0;
      for (const row of game.state.boarded) for (const flag of row) if (!flag) waiting += 1;
      if (waiting < 2) {
      showToast('Queue is short');
      return;
    }
  }
  game.adOpen = true;
  const token = ++adToken;
  announce('ad', COPY.adTitle);
  const card = openCard();
  const title = document.createElement('h2');
  title.textContent = COPY.adTitle;
  const name = document.createElement('p');
  name.className = 'lead';
  name.textContent = kind === 'bay' ? COPY.extraBay : kind === 'undo' ? COPY.undo : COPY.shuffle;
  const body = document.createElement('p');
  body.textContent = COPY.adBody;
  const bar = document.createElement('div');
  bar.className = 'bar';
  const fill = document.createElement('span');
  bar.append(fill);
  const watch = button(COPY.watch, 'btn primary', () => {
    audio.tap();
    watch.disabled = true;
    const started = performance.now();
    const duration = reduced ? 200 : 1100;
    const step = (now) => {
      if (token !== adToken) return;
      const u = Math.min(1, (now - started) / duration);
      fill.style.width = `${u * 100}%`;
      if (u < 1) requestAnimationFrame(step);
      else {
        game.adOpen = false;
        closeModal();
        if (kind === 'bay') doExtraBay();
        else if (kind === 'undo') doUndo();
        else doShuffle();
      }
    };
    requestAnimationFrame(step);
  });
  const cancel = button(COPY.notNow, 'btn', () => {
    audio.tap();
    adToken += 1;
    game.adOpen = false;
    closeModal();
  });
  card.append(title, name, body, bar, watch, cancel);
}

function doUndo() {
  const snap = game.undo.pop();
  if (!snap) return;
  restore(snap);
  game.over = false;
  game.paid = false;
  closeModal();
  board.load(game.level, game.state, game.hidden, {
    livery: game.livery,
    showArrows: game.showArrows,
  });
  refresh();
}

function doExtraBay() {
  pushUndo();
  const res = grantExtraBay(game.state, game.level);
  if (!res) {
    game.undo.pop();
    return;
  }
  game.state = res.state;
  game.over = false;
  closeModal();
  board.load(game.level, game.state, game.hidden, {
    livery: game.livery,
    showArrows: game.showArrows,
  });
  refresh();
  if (isWin(game.state)) showWin();
  else if (isLose(game.state, game.level)) showLose(loseReason(game.state));
}

function doShuffle() {
  pushUndo();
  let seed = (Date.now() ^ (game.state.moves * 997)) >>> 0;
  const rng = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const res = shuffleRemaining(game.state, game.level, rng);
  game.state = res.state;
  board.setState(game.state);
  const pretend = res.events.filter((event) => event.t === 'board').map((event) => event.pIndex);
  board.syncPeople(game.state, pretend);
  finish((async () => {
    await playEvents(res.events.filter((event) => event.t === 'board' || event.t === 'depart'));
    afterAction();
  })());
}

function burst() {
  const modal = $('modal');
  const layer = document.createElement('div');
  layer.className = 'confetti';
  const colors = ['#E23D3D', '#2F6FED', '#F2C14E', '#3E9B4F', '#F07A2A', '#7A4E9A', '#E56AA8'];
  const count = reduced ? 8 : 24;
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement('i');
    bit.style.background = colors[i % colors.length];
    bit.style.left = `${i % 2 ? 10 : 78}%`;
    bit.style.top = `${18 + (i % 6) * 8}%`;
    bit.style.animationDelay = `${i * 0.02}s`;
    layer.append(bit);
  }
  modal.append(layer);
}

function showWin() {
  if (!game || game.paid) return;
  game.paid = true;
  game.over = true;
  game.timing = false;
  const time = Math.max(0, Math.floor(game.elapsed / 1000));
  const stars = starsFor(game.state.moves, time, game.level);
  const daily = game.launch.mode === 'daily';
  const award = daily
    ? storage.awardDaily(game.level.daily || dateKey(new Date()), stars)
    : storage.awardLevel(game.level.id, stars);
  audio.win();
  audio.coin();
  audio.duck(1.3);
  if (!daily) storage.clearFail(game.level.id);
  bumpMission('clear');
  if ((game.level.reward || 1) > 1) storage.addCoins(award.gain);
  buzz(20);
  announce('win', `Win ${stars} stars ${game.state.moves} moves`);
  const card = openCard();
  burst();
  const title = document.createElement('h2');
  title.textContent = daily ? COPY.winDaily : COPY.win;
  const row = document.createElement('p');
  row.className = 'stars';
  for (let i = 0; i < 3; i += 1) {
    const star = document.createElement('span');
    star.textContent = '★';
    star.className = i < stars ? 'pop' : 'pop off';
    star.style.animationDelay = `${i * 120}ms`;
    row.append(star);
  }
  const stats = document.createElement('p');
  stats.textContent = `${game.state.moves} moves · ${time}s · par ${game.level.par}`;
  const gain = document.createElement('p');
  gain.className = 'lead';
  gain.textContent = `+${award.gain} coins`;
  card.append(title, row, stats, gain);
  paintCoins();
  refresh();
  if (daily) {
    const text = shareText(game.level, {
      daily: true,
      stars,
      moves: game.state.moves,
      time,
    }, prettyDate(game.level.daily || dateKey(new Date())));
    const preview = document.createElement('pre');
    preview.className = 'share';
    preview.textContent = text;
    const share = button(COPY.share, 'btn primary', async () => {
      const result = await shareResult(text);
      if (result === 'copied') showToast(COPY.copied);
    });
    card.append(preview, share);
  }
  if (!daily && game.level.id < LEVEL_COUNT) {
    card.append(button(COPY.next, 'btn primary', () => {
      audio.tap();
      startLevel({ mode: 'level', id: game.level.id + 1 });
    }));
  }
  card.append(button(COPY.retry, 'btn', () => {
    audio.tap();
    startLevel(game.launch);
  }));
  card.append(button(daily ? 'Lobby' : COPY.map, 'btn', () => {
    audio.tap();
    if (daily) showDaily();
    else showMap();
  }));
}

function showLose(reason) {
  if (!game || game.over) return;
  game.over = true;
  game.timing = false;
  audio.lose();
  if (game.launch.mode !== 'daily') storage.noteFail(game.level.id);
  announce('lose', reason === 'full' ? COPY.loseFull : COPY.loseJam);
  const card = openCard();
  const title = document.createElement('h2');
  title.textContent = reason === 'full' ? COPY.loseFull : COPY.loseJam;
  const hint = document.createElement('p');
  hint.textContent = COPY.loseHint;
  card.append(title, hint);
  card.append(button(COPY.retry, 'btn primary', () => {
    audio.tap();
    startLevel(game.launch);
  }));
  if (reason === 'full' && !game.state.extraUsed) {
    card.append(button(COPY.extraBay, 'btn', () => {
      game.over = false;
      closeModal();
      askAd('bay');
    }));
  }
  card.append(button(COPY.map, 'btn', () => {
    audio.tap();
    if (game.launch.mode === 'daily') showDaily();
    else showMap();
  }));
  refresh();
}

function tick(now) {
  const dt = now - lastTick;
  lastTick = now;
  if (game && !game.over && !game.busy && board && board.pulse && now - (game.lastInput || now) > 10000 && !game.hinted) {
    const id = hintTaxi(game.state, game.level);
    if (id >= 0) {
      game.hinted = true;
      board.pulse(id);
    }
  }
  if (game && game.timing && !game.over && !document.hidden) {
    game.elapsed += Math.min(dt, 1000);
    const sec = Math.floor(game.elapsed / 1000);
    if (sec !== game.shown) {
      game.shown = sec;
      $('g-time').textContent = `${sec}s`;
    }
  }
  requestAnimationFrame(tick);
}

function bind() {
  $('t-title').textContent = theme.title;
  $('t-sub').textContent = theme.subtitle;
  $('t-foot').textContent = theme.footnote;
  document.title = theme.title;
  $('t-levels').textContent = COPY.levels;
  $('t-daily').textContent = COPY.daily;
  $('t-shop').textContent = COPY.shop;
  $('m-title').textContent = COPY.levels;
  $('s-title').textContent = COPY.shop;
  $('d-title').textContent = theme.dailyName;
  $('g-bay').innerHTML = `${ICONS.bay}<span>${COPY.extraBay}</span>`;
  $('g-undo').innerHTML = `${ICONS.undo}<span>${COPY.undo}</span>`;
  $('g-shuffle').innerHTML = `${ICONS.shuffle}<span>${COPY.shuffle}</span>`;
  for (const id of ['m-back', 's-back', 'd-back', 'g-back', 'r-back', 'n-back', 'set-back']) $(id).innerHTML = ICONS.back;
  $('g-restart').innerHTML = ICONS.restart;
  for (const id of ['t-coins', 'm-coins', 's-coins', 'g-coins']) {
    const node = $(id);
    node.innerHTML = `${ICONS.coin}<span>0</span>`;
  }

  $('t-play').addEventListener('click', () => {
    audio.tap();
    const next = Math.min(LEVEL_COUNT, Math.max(1, storage.load().unlocked));
    startLevel({ mode: 'level', id: next });
  });
  $('t-levels').addEventListener('click', () => {
    audio.tap();
    showMap();
  });
  $('t-daily').addEventListener('click', () => {
    audio.tap();
    showDaily();
  });
  $('t-shop').addEventListener('click', () => {
    audio.tap();
    showShop();
  });
  $('t-rank').addEventListener('click', () => {
    audio.tap();
    showRank();
  });
  $('t-missions').addEventListener('click', () => {
    audio.tap();
    showMissions();
  });
  $('t-event').addEventListener('click', () => {
    audio.tap();
    showEvent();
  });
  $('t-settings').addEventListener('click', () => {
    audio.tap();
    showOnly('settings');
    $('set-cb').textContent = storage.load().colorblind ? 'Colour-blind palette: on' : 'Colour-blind palette: off';
  });
  $('set-back').addEventListener('click', () => showTitle());
  $('set-cb').addEventListener('click', () => {
    storage.setColorblind(!storage.load().colorblind);
    $('set-cb').textContent = storage.load().colorblind ? 'Colour-blind palette: on' : 'Colour-blind palette: off';
  });
  $('r-back').addEventListener('click', () => showTitle());
  $('n-back').addEventListener('click', () => showTitle());
  $('t-mute').addEventListener('click', toggleMute);
  $('g-mute').addEventListener('click', toggleMute);
  $('t-music').addEventListener('click', toggleMusic);
  $('g-music').addEventListener('click', toggleMusic);
  $('m-back').addEventListener('click', () => {
    audio.tap();
    showTitle();
  });
  $('s-back').addEventListener('click', () => {
    audio.tap();
    showTitle();
  });
  $('d-back').addEventListener('click', () => {
    audio.tap();
    showTitle();
  });
  $('g-back').addEventListener('click', () => {
    if (!game || game.busy) return;
    audio.tap();
    if (game.launch.mode === 'daily') showDaily();
    else showMap();
  });
  $('g-restart').addEventListener('click', () => {
    if (!game || game.busy) return;
    audio.tap();
    startLevel(game.launch);
  });
  $('m-prev').addEventListener('click', () => {
    if (mapPage > 0) {
      mapPage -= 1;
      drawMap();
    }
  });
  $('m-next').addEventListener('click', () => {
    if (mapPage < Math.ceil(LEVEL_COUNT / 12) - 1) {
      mapPage += 1;
      drawMap();
    }
  });
  $('g-bay').addEventListener('click', () => askAd('bay'));
  $('g-undo').addEventListener('click', () => askAd('undo'));
  $('g-shuffle').addEventListener('click', () => askAd('shuffle'));
  document.body.addEventListener('pointerdown', (event) => {
    if (event.target.closest('[data-music]')) return;
    audio.unlock();
  });
  requestAnimationFrame(tick);
}

function showCoach() {
  const coach = $('coach');
  if (!coach) return;
  const lesson = game && game.level && game.level.tutorial;
  if (!lesson || storage.load().seen.includes(lesson.mech)) {
    coach.hidden = true;
    return;
  }
  coach.hidden = false;
  $('coach-text').textContent = lesson.text;
  $('coach-go').onclick = () => {
    storage.markSeen(lesson.mech);
    coach.hidden = true;
    const spot = board.project(lesson.focus || 0);
    const hand = $('coach-hand');
    if (spot && hand) {
      const app = $('app').getBoundingClientRect();
      hand.hidden = false;
      hand.style.left = `${spot.x - app.left}px`;
      hand.style.top = `${spot.y - app.top}px`;
      setTimeout(() => { hand.hidden = true; }, 1800);
    }
  };
}

function showRank() {
  const list = $('rank-list');
  list.replaceChildren();
  const save = storage.load();
  RANKS.forEach((stage, index) => {
    const row = document.createElement('article');
    row.className = 'shop-row';
    const copy = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = stage.name;
    const blurb = document.createElement('p');
    blurb.textContent = index < save.rank ? 'Built' : index === save.rank ? 'Yours now' : `${stage.cost} coins`;
    copy.append(name, blurb);
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'btn small primary';
    action.textContent = index <= save.rank ? 'Built' : 'Build';
    action.disabled = index !== save.rank + 1;
    action.addEventListener('click', () => {
      if (save.coins < stage.cost) {
        showToast('Need coins');
        return;
      }
      storage.addCoins(-stage.cost);
      storage.setRank(index);
      audio.coin();
      showRank();
    });
    row.append(copy, action);
    list.append(row);
  });
  showOnly('rank');
  if (turntable) {
    turntable.setStage(storage.load().rank);
    turntable.resize();
    turntable.start();
  }
  announce('rank', 'Your rank');
}

function showMissions() {
  const list = $('mission-list');
  list.replaceChildren();
  const today = dateKey(new Date());
  const save = storage.load();
  if (save.missionsDate !== today) {
    save.missionsDate = today;
    save.missionProgress = [0, 0, 0];
    save.missionClaimed = [false, false, false];
    localStorage.setItem('trr_save_v1', JSON.stringify(save));
  }
  const jobs = [
    ['Depart 8 combis', 8, 15, null],
    ['Reach a x3 combo', 3, 10, 'undo'],
    ['Clear 2 levels', 2, 12, 'shuffle'],
  ];
  jobs.forEach((job, index) => {
    const row = document.createElement('article');
    row.className = 'shop-row';
    const copy = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = job[0];
    const blurb = document.createElement('p');
    const progress = storage.load().missionProgress[index] || 0;
    blurb.textContent = `${Math.min(progress, job[1])} / ${job[1]}`;
    copy.append(name, blurb);
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'btn small primary';
    const claimed = storage.load().missionClaimed[index];
    action.textContent = claimed ? 'Done' : 'Claim';
    action.disabled = claimed || progress < job[1];
    action.addEventListener('click', () => {
      const current = storage.load();
      current.missionClaimed[index] = true;
      current.coins += job[2];
      if (job[3]) current.tokens[job[3]] = (current.tokens[job[3]] || 0) + 1;
      localStorage.setItem('trr_save_v1', JSON.stringify(current));
      audio.coin();
      showMissions();
    });
    row.append(copy, action);
    list.append(row);
  });
  showOnly('missions');
  announce('missions', 'Missions');
}

function showEvent() {
  const save = storage.load();
  const week = dateKey(new Date()).slice(0, 7);
  if (save.eventWeek !== week) {
    save.eventWeek = week;
    save.eventStep = 0;
    save.eventDone = false;
    localStorage.setItem('trr_save_v1', JSON.stringify(save));
  }
  const current = storage.load();
  if (current.eventDone) {
    showToast('Ladder cleared');
    showTitle();
    return;
  }
  const level = weekendLevel(current.eventStep || 0, hashString(`month-end:${week}`));
  startLevel({ mode: 'event', id: (current.eventStep || 0) + 1, level });
}

async function boot() {
  bind();
  const canvas = $('turntable');
  const created = createTurntable(canvas);
  if (created.ok) {
    turntable = created;
    const observer = new ResizeObserver(() => turntable.resize());
    observer.observe(canvas);
    turntable.setLook(storage.load().livery);
    turntable.resize();
  }
  $('boot').hidden = true;
  const mechLevel = {
    size: 4, luggage: 8, twotone: 12, tarp: 16, lock: 20, gaartjie: 24,
    robot: 28, cone: 32, officer: 36, queues: 40, tow: 44, rain: 48,
  }[params.get('mech')];
  const regionLevel = { durban: 1, joburg: 31, cape: 61, gqeberha: 91, bloem: 121 }[params.get('region')];
  if (flags.level >= 1 && flags.level <= LEVEL_COUNT) startLevel({ mode: 'level', id: flags.level | 0 });
  else if (mechLevel) startLevel({ mode: 'level', id: mechLevel });
  else if (regionLevel) startLevel({ mode: 'level', id: regionLevel });
  else if (params.has('event')) showEvent();
  else if (flags.daily) showDaily();
  else showTitle();
  globalThis.TRR = {
    get screen() { return document.body.dataset.screen; },
    get game() { return game; },
    project(id) {
      return board && board.project ? board.project(id) : null;
    },
  };
}

boot().catch((err) => {
  console.error(err);
  $('boot').hidden = false;
  $('boot').textContent = 'The rank did not load.';
});

if (!params.has('nosw') && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
}
