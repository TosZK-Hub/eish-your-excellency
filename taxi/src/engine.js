/**
 * Taxi Rank Rush rules. See GAME_RULES.md.
 * No DOM, so Node can prove every level.
 */

import { COLORS } from './theme.js';

export const DIRS = [
  { x: 0, y: -1, name: 'up' },
  { x: 1, y: 0, name: 'right' },
  { x: 0, y: 1, name: 'down' },
  { x: -1, y: 0, name: 'left' },
];

export const LEVEL_COUNT = 150;

export const SIZES = {
  hiace: { len: 2, seats: 6, name: 'Hiace' },
  quantum: { len: 3, seats: 9, name: 'Quantum' },
  sprinter: { len: 4, seats: 12, name: 'Sprinter' },
};

export const INTROS = {
  1: 'basics',
  4: 'size',
  8: 'luggage',
  12: 'twotone',
  16: 'tarp',
  20: 'lock',
  24: 'gaartjie',
  28: 'robot',
  32: 'cone',
  36: 'officer',
  40: 'queues',
  44: 'tow',
  48: 'rain',
};

const TUTORIAL = {
  basics: 'Tap a combi. If the lane ahead is clear, it drives into a bay.',
  size: 'A Hiace is short, a Quantum is the usual combi, a Sprinter is the long one.',
  luggage: 'A bag or bucket needs two free seats.',
  twotone: 'A split roof takes either colour.',
  tarp: 'A tarp hides the colour until you tap it, or a neighbour leaves.',
  lock: 'The padlock number is how many other combis must leave first.',
  gaartjie: 'The gaartjie fills that combi the moment they step in.',
  robot: 'A green robot lets them out. Red means wait. It flips every two taps.',
  cone: 'Cones and potholes are solid. Drive around them.',
  officer: 'The officer steps one cell every three taps.',
  queues: 'Two queues. Tap a head to send that passenger first.',
  tow: 'Chained combis leave together. Both lanes must be clear.',
  rain: 'Wet road, same rules. Take it slow in your head, not in the taps.',
};

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function shuffle(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = (rng() * (i + 1)) | 0;
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function difficultyOf(n) {
  const pos = ((n - 1) % 10) + 1;
  if (pos === 10) return 'super';
  if (pos === 5) return 'hard';
  if (pos === 3 || pos === 4 || pos === 8 || pos === 9) return 'medium';
  return 'easy';
}

export function regionFor(n) {
  if (n >= 121) return 'bloem';
  if (n >= 91) return 'gqeberha';
  if (n >= 61) return 'cape';
  if (n >= 31) return 'joburg';
  return 'durban';
}

export function taxiCells(taxi) {
  const dir = DIRS[taxi.dir];
  const cells = [];
  for (let i = 0; i < taxi.len; i += 1) {
    cells.push({ c: taxi.c - dir.x * i, r: taxi.r - dir.y * i });
  }
  return cells;
}

function inBounds(level, c, r) {
  return c >= 0 && r >= 0 && c < level.cols && r < level.rows;
}

export function prepare(level) {
  const grid = new Int16Array(level.cols * level.rows);
  grid.fill(-1);
  for (const taxi of level.taxis) {
    for (const cell of taxiCells(taxi)) {
      if (inBounds(level, cell.c, cell.r)) grid[cell.r * level.cols + cell.c] = taxi.id;
    }
  }
  level.grid = grid;
  level.cones = level.cones || [];
  level.robots = level.robots || [];
  level.queues = level.queues || [[]];
  return level;
}

export function createState(level) {
  return {
    exited: new Uint8Array(level.taxis.length),
    bayTaxi: new Int16Array(level.bays).fill(-1),
    bayFilled: new Uint8Array(level.bays),
    boarded: level.queues.map((queue) => new Uint8Array(queue.length)),
    queues: level.queues.map((queue) => queue.map((person) => ({ ...person }))),
    moves: 0,
    departed: 0,
    combo: 0,
    squeezeUsed: 0,
    revealed: Uint8Array.from(level.taxis.map((taxi) => (taxi.hidden ? 0 : 1))),
  };
}

export function copyState(state) {
  return {
    exited: state.exited.slice(),
    bayTaxi: state.bayTaxi.slice(),
    bayFilled: state.bayFilled.slice(),
    boarded: state.boarded.map((row) => row.slice()),
    queues: state.queues.map((queue) => queue.map((person) => ({ ...person }))),
    moves: state.moves,
    departed: state.departed,
    combo: state.combo,
    squeezeUsed: state.squeezeUsed,
    revealed: state.revealed.slice(),
  };
}

function officerCell(level, state) {
  if (!level.officer || !level.officer.path.length) return null;
  const index = Math.floor(state.moves / 3) % level.officer.path.length;
  return level.officer.path[index];
}

function occupant(level, state, c, r) {
  if (!inBounds(level, c, r)) return null;
  for (const cone of level.cones) {
    if (cone.c === c && cone.r === r) return -2;
  }
  const officer = officerCell(level, state);
  if (officer && officer.c === c && officer.r === r) return -3;
  const occ = level.grid[r * level.cols + c];
  if (occ >= 0 && !state.exited[occ]) return occ;
  return null;
}

export function pathClear(level, state, id) {
  return firstBlocker(level, state, id) === null;
}

export function firstBlocker(level, state, id) {
  const taxi = level.taxis[id];
  const dir = DIRS[taxi.dir];
  let c = taxi.c + dir.x;
  let r = taxi.r + dir.y;
  while (inBounds(level, c, r)) {
    const occ = occupant(level, state, c, r);
    if (occ !== null && occ !== id) return occ;
    c += dir.x;
    r += dir.y;
  }
  return null;
}

function lightGreen(state) {
  return Math.floor(state.moves / 2) % 2 === 0;
}

function lightOk(level, state, taxi) {
  const lane = taxi.dir % 2 === 0 ? taxi.c : taxi.r;
  for (const robot of level.robots) {
    if (robot.dir === taxi.dir && robot.lane === lane && !lightGreen(state)) return false;
  }
  return true;
}

function locked(taxi, state) {
  return (taxi.lockAfter || 0) > state.departed;
}

function freeBays(state) {
  let n = 0;
  for (let i = 0; i < state.bayTaxi.length; i += 1) if (state.bayTaxi[i] < 0) n += 1;
  return n;
}

function firstFreeBay(state) {
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    if (state.bayTaxi[i] < 0) return i;
  }
  return -1;
}

function matches(taxi, color) {
  return taxi.colors.includes(color);
}

function findBay(state, level, person) {
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    const id = state.bayTaxi[i];
    if (id < 0) continue;
    const taxi = level.taxis[id];
    if (!matches(taxi, person.color)) continue;
    const free = taxi.seats - state.bayFilled[i];
    if (person.vip || free >= (person.seats || 1)) return i;
  }
  return -1;
}

function depart(state, bay, events) {
  const taxiId = state.bayTaxi[bay];
  state.combo = Math.min(5, (state.combo || 0) + 1);
  events.push({
    t: 'depart',
    bay,
    taxiId,
    combo: state.combo,
  });
  state.bayTaxi[bay] = -1;
  state.bayFilled[bay] = 0;
  state.departed += 1;
}

function boardPerson(state, level, queueIndex, personIndex, events) {
  const person = state.queues[queueIndex][personIndex];
  const bay = findBay(state, level, person);
  if (bay < 0) return false;
  state.boarded[queueIndex][personIndex] = 1;
  const taxiId = state.bayTaxi[bay];
  const taxi = level.taxis[taxiId];
  if (person.vip) state.bayFilled[bay] = taxi.seats;
  else state.bayFilled[bay] += person.seats || 1;
  events.push({
    t: 'board',
    bay,
    taxiId,
    queue: queueIndex,
    pIndex: personIndex,
    filled: state.bayFilled[bay],
    seats: taxi.seats,
    vip: !!person.vip,
    luggage: !!person.luggage,
  });
  if (state.bayFilled[bay] >= taxi.seats) depart(state, bay, events);
  return true;
}

function headIndex(state, queueIndex) {
  const row = state.boarded[queueIndex];
  for (let i = 0; i < row.length; i += 1) if (!row[i]) return i;
  return -1;
}

function resolve(state, level, events) {
  if (state.queues.length !== 1) return;
  const guard = state.queues[0].length + 2;
  for (let n = 0; n < guard; n += 1) {
    const index = headIndex(state, 0);
    if (index < 0) return;
    if (!boardPerson(state, level, 0, index, events)) return;
  }
}

function revealAround(state, level, id) {
  const mine = taxiCells(level.taxis[id]);
  for (const other of level.taxis) {
    if (!other.hidden || state.revealed[other.id]) continue;
    const cells = taxiCells(other);
    let near = false;
    for (const a of mine) {
      for (const b of cells) {
        if (Math.abs(a.c - b.c) + Math.abs(a.r - b.r) === 1) near = true;
      }
    }
    if (near) state.revealed[other.id] = 1;
  }
}

function park(state, level, id, events) {
  state.combo = 0;
  const bay = firstFreeBay(state);
  state.exited[id] = 1;
  state.revealed[id] = 1;
  state.bayTaxi[bay] = id;
  state.bayFilled[bay] = 0;
  events.push({ t: 'exit', id, bay });
  revealAround(state, level, id);
  return bay;
}

export function canExit(level, state, id) {
  if (state.exited[id]) return false;
  const taxi = level.taxis[id];
  if (taxi.tow >= 0) return false;
  if (locked(taxi, state)) return false;
  if (!pathClear(level, state, id)) return false;
  if (!lightOk(level, state, taxi)) return false;
  return freeBays(state) >= 1;
}

export function canTow(level, state, id) {
  const taxi = level.taxis[id];
  if (taxi.tow < 0) return false;
  const otherId = taxi.tow;
  const lead = Math.min(id, otherId);
  if (id !== lead) return false;
  if (state.exited[id] || state.exited[otherId]) return false;
  if (locked(taxi, state) || locked(level.taxis[otherId], state)) return false;
  if (!pathClear(level, state, id) || !pathClear(level, state, otherId)) return false;
  if (!lightOk(level, state, taxi) || !lightOk(level, state, level.taxis[otherId])) return false;
  return freeBays(state) >= 2;
}

export function interpret(state, level, id) {
  if (id < 0 || id >= level.taxis.length || state.exited[id]) return { t: 'none' };
  const taxi = level.taxis[id];
  if (taxi.hidden && !state.revealed[id] && !pathClear(level, state, id)) {
    return { t: 'bump', id, blocker: firstBlocker(level, state, id), reveal: true };
  }
  if (locked(taxi, state)) return { t: 'locked', id };
  if (taxi.tow >= 0) {
    const lead = Math.min(id, taxi.tow);
    if (canTow(level, state, lead)) return { t: 'tow', id: lead };
    return { t: 'bump', id, blocker: firstBlocker(level, state, id) ?? firstBlocker(level, state, taxi.tow) };
  }
  if (!pathClear(level, state, id)) {
    return { t: 'bump', id, blocker: firstBlocker(level, state, id), reveal: taxi.hidden && !state.revealed[id] };
  }
  if (!lightOk(level, state, taxi)) return { t: 'red', id, reveal: taxi.hidden && !state.revealed[id] };
  if (freeBays(state) < 1) return { t: 'nobay', id };
  return { t: 'exit', id };
}

export function interpretSend(state, level, queueIndex) {
  if (!state.queues[queueIndex]) return { t: 'none' };
  const index = headIndex(state, queueIndex);
  if (index < 0) return { t: 'none' };
  const person = state.queues[queueIndex][index];
  if (findBay(state, level, person) < 0) return { t: 'wait', queue: queueIndex };
  return { t: 'send', queue: queueIndex };
}

export function noteBump(state) {
  return state;
}

export function applyAction(state, level, action) {
  if (!action) return null;
  if (action.t === 'reveal') {
    if (!level.taxis[action.id] || state.revealed[action.id]) return null;
    const next = copyState(state);
    next.revealed[action.id] = 1;
    return { state: next, events: [{ t: 'reveal', id: action.id }] };
  }
  if (action.t === 'send') {
    if (state.queues.length < 2) return null;
    const index = headIndex(state, action.queue);
    if (index < 0) return null;
    const next = copyState(state);
    const events = [];
    if (!boardPerson(next, level, action.queue, index, events)) return null;
    next.moves += 1;
    return { state: next, events };
  }
  if (action.t === 'exit') {
    if (!canExit(level, state, action.id)) return null;
    const next = copyState(state);
    const events = [];
    park(next, level, action.id, events);
    next.moves += 1;
    if (next.queues.length === 1) resolve(next, level, events);
    return { state: next, events };
  }
  if (action.t === 'tow') {
    if (!canTow(level, state, action.id)) return null;
    const next = copyState(state);
    const events = [];
    const other = level.taxis[action.id].tow;
    park(next, level, action.id, events);
    park(next, level, other, events);
    next.moves += 1;
    if (next.queues.length === 1) resolve(next, level, events);
    return { state: next, events };
  }
  return null;
}

export function isWin(state) {
  let any = false;
  for (const row of state.boarded) {
    if (!row.length) continue;
    any = true;
    for (let i = 0; i < row.length; i += 1) if (!row[i]) return false;
  }
  return any;
}

function canBoardSomething(state, level) {
  if (state.queues.length === 1) {
    const index = headIndex(state, 0);
    if (index < 0) return false;
    return findBay(state, level, state.queues[0][index]) >= 0;
  }
  for (let q = 0; q < state.queues.length; q += 1) {
    const index = headIndex(state, q);
    if (index < 0) continue;
    if (findBay(state, level, state.queues[q][index]) >= 0) return true;
  }
  return false;
}

function hasMove(state, level) {
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (canExit(level, state, i) || canTow(level, state, i)) return true;
  }
  if (state.queues.length > 1 && canBoardSomething(state, level)) return true;
  if (state.queues.length === 1 && canBoardSomething(state, level)) return true;
  return false;
}

export function isLose(state, level) {
  if (isWin(state)) return false;
  return !hasMove(state, level);
}

export function loseReason(state) {
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    if (state.bayTaxi[i] < 0) return 'jam';
  }
  return 'full';
}

export function hintTaxi(state, level) {
  if (level.guide) {
    for (const step of level.guide) {
      if (step.t === 'exit' && canExit(level, state, step.id)) return step.id;
      if (step.t === 'tow' && canTow(level, state, step.id)) return step.id;
    }
  }
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (canExit(level, state, i) || canTow(level, state, i)) return i;
  }
  return -1;
}

export function replay(level, actions) {
  prepare(level);
  let state = createState(level);
  for (const action of actions) {
    const res = applyAction(state, level, action);
    if (!res) return { ok: false, state };
    state = res.state;
    if (isLose(state, level)) return { ok: false, state, lost: true };
  }
  return { ok: isWin(state), state };
}

function stateKey(state, level) {
  let exited = 0;
  for (let i = 0; i < state.exited.length; i += 1) if (state.exited[i]) exited += 2 ** i;
  let boarded = '';
  for (const row of state.boarded) {
    for (let i = 0; i < row.length; i += 1) boarded += row[i] ? '1' : '0';
    boarded += '|';
  }
  let bays = '';
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    bays += `${state.bayTaxi[i]}:${state.bayFilled[i]},`;
  }
  const phase = Math.floor(state.moves / 2) % 2;
  const officer = level.officer ? Math.floor(state.moves / 3) % level.officer.path.length : 0;
  return `${exited}|${boarded}|${bays}|${state.departed}|${phase}|${officer}`;
}

export function solve(level, opts = {}) {
  prepare(level);
  const limit = opts.nodeLimit || 40000;
  const start = createState(level);
  if (isWin(start)) return { solvable: true, moves: 0, actions: [], nodes: 1 };
  const queue = [{ state: start, actions: [] }];
  const seen = new Set([stateKey(start, level)]);
  let nodes = 0;
  while (queue.length) {
    const item = queue.shift();
    nodes += 1;
    if (nodes > limit) return { solvable: false, limited: true, nodes, actions: [] };
    const { state } = item;
    const actions = [];
    for (let i = 0; i < level.taxis.length; i += 1) {
      if (canTow(level, state, i)) actions.push({ t: 'tow', id: i });
      else if (canExit(level, state, i)) actions.push({ t: 'exit', id: i });
    }
    if (state.queues.length > 1) {
      for (let q = 0; q < state.queues.length; q += 1) {
        const index = headIndex(state, q);
        if (index >= 0 && findBay(state, level, state.queues[q][index]) >= 0) {
          actions.push({ t: 'send', queue: q });
        }
      }
    }
    for (const action of actions) {
      const res = applyAction(state, level, action);
      if (!res) continue;
      if (isWin(res.state)) {
        return { solvable: true, moves: res.state.moves, actions: item.actions.concat(action), nodes };
      }
      if (isLose(res.state, level)) continue;
      const key = stateKey(res.state, level);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ state: res.state, actions: item.actions.concat(action) });
    }
  }
  return { solvable: false, nodes, actions: [] };
}

export function grantExtraBay(state, level) {
  const next = copyState(state);
  const bayTaxi = new Int16Array(state.bayTaxi.length + 1);
  bayTaxi.set(state.bayTaxi);
  bayTaxi[bayTaxi.length - 1] = -1;
  const bayFilled = new Uint8Array(state.bayFilled.length + 1);
  bayFilled.set(state.bayFilled);
  next.bayTaxi = bayTaxi;
  next.bayFilled = bayFilled;
  next.squeezeUsed = 1;
  const events = [{ t: 'bay' }];
  if (next.queues.length === 1) resolve(next, level, events);
  return { state: next, events };
}

export function shuffleRemaining(state, level, rng) {
  const next = copyState(state);
  for (let q = 0; q < next.queues.length; q += 1) {
    const open = [];
    for (let i = 0; i < next.boarded[q].length; i += 1) {
      if (!next.boarded[q][i]) open.push(next.queues[q][i]);
    }
    const mixed = shuffle(open, rng);
    let k = 0;
    for (let i = 0; i < next.boarded[q].length; i += 1) {
      if (!next.boarded[q][i]) {
        next.queues[q][i] = mixed[k];
        k += 1;
      }
    }
  }
  next.moves += 1;
  const events = [{ t: 'shuffle' }];
  if (next.queues.length === 1) resolve(next, level, events);
  return { state: next, events };
}

export function starsFor(moves, timeSec, level) {
  const par = level.par || moves;
  if (level.daily) {
    const parTime = level.parTime || 90;
    if (moves <= par && timeSec <= parTime) return 3;
    if (moves <= par + 3 && timeSec <= parTime * 2) return 2;
    return 1;
  }
  if (moves <= par) return 3;
  if (moves <= par + 3) return 2;
  return 1;
}

export function shareText(level, result, dateLabel) {
  const lines = [];
  lines.push(result.daily ? 'Taxi Rank Rush · Rush Hour' : `Taxi Rank Rush · ${level.name || 'Level'}`);
  if (dateLabel) lines.push(dateLabel);
  const stars = result.stars || 0;
  lines.push(`${'★'.repeat(stars)}${'☆'.repeat(Math.max(0, 3 - stars))}  ${result.moves} taps`);
  const grid = [];
  for (let r = 0; r < level.rows; r += 1) grid.push(Array.from({ length: level.cols }, () => '⬛'));
  for (const taxi of level.taxis) {
    const icon = taxi.hidden ? '❓' : (COLORS[taxi.colors[0]] ? COLORS[taxi.colors[0]].emoji : '🚐');
    const arrow = ['⬆️', '➡️', '⬇️', '⬅️'][taxi.dir] || '';
    if (inBounds(level, taxi.c, taxi.r)) grid[taxi.r][taxi.c] = icon + arrow;
  }
  for (const row of grid) lines.push(row.join(''));
  lines.push('Sort the rank.');
  return lines.join('\n');
}

function blankLevel(spec) {
  return {
    cols: spec.cols,
    rows: spec.rows,
    bays: spec.bays,
    taxis: [],
    queues: spec.queues > 1 ? [[], []] : [[]],
    cones: [],
    robots: [],
    officer: null,
    rain: !!spec.rain,
  };
}

function traceCells(level, taxi) {
  const dir = DIRS[taxi.dir];
  const cells = [];
  let c = taxi.c + dir.x;
  let r = taxi.r + dir.y;
  while (inBounds(level, c, r)) {
    cells.push({ c, r });
    c += dir.x;
    r += dir.y;
  }
  return cells;
}

function cellKey(c, r) {
  return `${c},${r}`;
}

function occupiedSet(level) {
  const used = new Set();
  for (const taxi of level.taxis) {
    for (const cell of taxiCells(taxi)) used.add(cellKey(cell.c, cell.r));
    for (const cell of traceCells(level, taxi)) used.add(cellKey(cell.c, cell.r));
  }
  return used;
}

function pathAllows(level, taxi) {
  for (const cell of taxiCells(taxi)) {
    if (!inBounds(level, cell.c, cell.r)) return false;
    const occ = level.grid ? level.grid[cell.r * level.cols + cell.c] : -1;
    if (occ >= 0) return false;
  }
  for (const cell of traceCells(level, taxi)) {
    const occ = level.grid[cell.r * level.cols + cell.c];
    if (taxi.needsClear && occ >= 0) return false;
    if (occ >= 0 && occ > taxi.id) return false;
    if (occ < 0) {
      for (const cone of level.cones) {
        if (cone.c === cell.c && cone.r === cell.r) return false;
      }
    }
  }
  return true;
}

function placeTaxi(level, taxi, rng) {
  const spots = [];
  for (let r = 0; r < level.rows; r += 1) {
    for (let c = 0; c < level.cols; c += 1) {
      taxi.c = c;
      taxi.r = r;
      if (pathAllows(level, taxi)) spots.push({ c, r });
    }
  }
  if (!spots.length) return false;
  const spot = spots[(rng() * spots.length) | 0];
  taxi.c = spot.c;
  taxi.r = spot.r;
  prepare(level);
  return true;
}

function pushPeople(list, taxi, spec, rng) {
  if (spec.gaartjie && taxi.gaartjie) {
    list.push({ color: taxi.colors[0], seats: 1, vip: true, luggage: false });
    return;
  }
  let left = taxi.seats;
  const colours = taxi.colors;
  let flip = 0;
  while (left > 0) {
    const color = colours[flip % colours.length];
    flip += 1;
    if (spec.luggage && left >= 2 && rng() < 0.45) {
      list.push({ color, seats: 2, vip: false, luggage: true });
      left -= 2;
    } else {
      list.push({ color, seats: 1, vip: false, luggage: false });
      left -= 1;
    }
  }
}

function buildQueues(level, spec, rng) {
  const blocks = level.taxis.map(() => []);
  for (const taxi of level.taxis) pushPeople(blocks[taxi.id], taxi, spec, rng);
  if (spec.queues > 1) {
    const a = [];
    const b = [];
    blocks.forEach((block, index) => {
      (index % 2 === 0 ? a : b).push(...block);
    });
    level.queues = [a, b.length ? b : [{ color: level.taxis[0].colors[0], seats: 1, vip: false, luggage: false }]];
    if (!b.length) level.queues = [a];
  } else {
    level.queues = [blocks.flat()];
  }
}

function decorate(level, spec, rng) {
  prepare(level);
  const used = occupiedSet(level);
  const free = [];
  for (let r = 0; r < level.rows; r += 1) {
    for (let c = 0; c < level.cols; c += 1) {
      if (!used.has(cellKey(c, r))) free.push({ c, r });
    }
  }
  if (spec.cone) {
    const count = Math.min(2, free.length);
    for (let i = 0; i < count; i += 1) {
      const index = (rng() * free.length) | 0;
      level.cones.push(free.splice(index, 1)[0]);
    }
  }
  if (spec.officer && free.length >= 3) {
    const path = free.slice(0, 3);
    level.officer = { path };
  }
}

function greedy(level) {
  prepare(level);
  let state = createState(level);
  const guide = [];
  const drain = () => {
    if (state.queues.length < 2) return true;
    for (let guard = 0; guard < 40; guard += 1) {
      let sent = false;
      for (let q = 0; q < state.queues.length; q += 1) {
        const index = headIndex(state, q);
        if (index < 0) continue;
        if (findBay(state, level, state.queues[q][index]) < 0) continue;
        const res = applyAction(state, level, { t: 'send', queue: q });
        if (!res) return false;
        guide.push({ t: 'send', queue: q });
        state = res.state;
        sent = true;
        break;
      }
      if (!sent) return true;
    }
    return true;
  };
  for (const taxi of level.taxis) {
    if (!drain()) return null;
    if (taxi.tow >= 0 && taxi.tow < taxi.id) continue;
    const action = taxi.tow >= 0 ? { t: 'tow', id: Math.min(taxi.id, taxi.tow) } : { t: 'exit', id: taxi.id };
    const res = applyAction(state, level, action);
    if (!res) return null;
    guide.push(action);
    state = res.state;
    if (isLose(state, level)) return null;
  }
  if (!drain()) return null;
  if (!isWin(state)) return null;
  return guide;
}

function specFor(n, easier) {
  const difficulty = easier ? 'easy' : difficultyOf(n);
  const intro = INTROS[n] || null;
  const mechs = new Set();
  if (intro && intro !== 'basics') mechs.add(intro);
  const pick = mulberry32(n * 97 + (easier || 0) * 13);
  const unlocked = Object.entries(INTROS)
    .filter(([level, name]) => Number(level) < n && name !== 'basics' && name !== 'rain')
    .map(([, name]) => name);
  const take = easier ? 0 : difficulty === 'super' ? 2 : difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1 : 0;
  const pool = shuffle(unlocked, pick);
  for (let i = 0; i < pool.length && mechs.size < take; i += 1) mechs.add(pool[i]);
  if ((intro === 'rain' || (n >= 48 && n % 9 === 0)) && !easier) mechs.add('rain');
  const sizes = mechs.has('size') || n >= 4;
  let count = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  if (easier) count = Math.max(2, count - 1);
  if (intro === 'basics') count = 2;
  if (intro === 'gaartjie' || intro === 'luggage' || intro === 'twotone') count = 1;
  if (intro === 'tow') count = 4;
  if (intro === 'robot') count = 4;
  return {
    cols: difficulty === 'easy' ? 5 : 6,
    rows: difficulty === 'super' ? 6 : 5,
    bays: easier ? 6 : 5,
    count,
    colours: Math.max(2, (difficulty === 'super' ? 4 : difficulty === 'hard' ? 3 : 2) - (easier ? 1 : 0)),
    sizes,
    mechs,
    rain: mechs.has('rain'),
    queues: mechs.has('queues') ? 2 : 1,
    intro,
  };
}

function chooseSize(spec, index, rng) {
  if (!spec.sizes) return SIZES.quantum;
  if (spec.intro === 'size') {
    return [SIZES.hiace, SIZES.quantum, SIZES.sprinter][index] || SIZES.quantum;
  }
  if (spec.queues > 1) return rng() < 0.5 ? SIZES.hiace : SIZES.quantum;
  const roll = rng();
  if (roll < 0.34) return SIZES.hiace;
  if (roll < 0.75) return SIZES.quantum;
  return SIZES.sprinter;
}

function construct(n, spec, rng) {
  const level = blankLevel(spec);
  level.grid = new Int16Array(level.cols * level.rows).fill(-1);
  for (let i = 0; i < spec.count; i += 1) {
    const size = chooseSize(spec, i, rng);
    const colors = [i % spec.colours];
    if (spec.mechs.has('twotone') && i === 0) colors.push((i + 1) % spec.colours);
    const taxi = {
      id: i,
      c: 0,
      r: 0,
      dir: [0, 1, 2, 3][(rng() * 4) | 0],
      len: size.len,
      seats: size.seats,
      colors,
      hidden: spec.mechs.has('tarp') && i === spec.count - 1,
      lockAfter: spec.mechs.has('lock') && i >= 2 ? 1 : 0,
      tow: -1,
      needsClear: spec.mechs.has('tow') && i < 2,
      gaartjie: spec.mechs.has('gaartjie') && i === 0,
    };
    let placed = false;
    const dirs = shuffle([0, 1, 2, 3], rng);
    for (const dir of dirs) {
      taxi.dir = dir;
      if (placeTaxi(level, taxi, rng)) {
        placed = true;
        break;
      }
    }
    if (!placed) return null;
    level.taxis.push(taxi);
    prepare(level);
    if (spec.mechs.has('robot') && Math.floor(i / 2) % 2 === 0) {
      const lane = taxi.dir % 2 === 0 ? taxi.c : taxi.r;
      if (!level.robots.some((robot) => robot.dir === taxi.dir && robot.lane === lane)) {
        level.robots.push({ dir: taxi.dir, lane });
      }
    }
  }
  if (spec.mechs.has('tow') && level.taxis.length >= 2) {
    level.taxis[0].tow = 1;
    level.taxis[1].tow = 0;
  }
  if (spec.mechs.has('robot') && !level.robots.length) return null;
  decorate(level, { cone: spec.mechs.has('cone'), officer: spec.mechs.has('officer') }, rng);
  if (spec.mechs.has('cone') && !level.cones.length) return null;
  if (spec.mechs.has('officer') && !level.officer) return null;
  buildQueues(level, spec, rng);
  prepare(level);
  const guide = greedy(level);
  if (!guide) return null;
  level.guide = guide;
  level.par = guide.length;
  level.id = n;
  level.difficulty = spec.intro && n ? undefined : undefined;
  return level;
}

const NAMES = [
  'First in line', 'After you', 'Side step', 'Long nose', 'Busy bay',
  'Colour mix', 'Morning rank', 'Short hold', 'Last light', 'Tight bay',
  'Deep row', 'Quiet corner', 'Second wave', 'Full load', 'Home stretch',
  'Early bird', 'Queue hop', 'Big yard', 'Nearly home', 'Final hoot',
];

function finish(level, n, spec) {
  level.id = n;
  level.difficulty = spec.intro === 'basics' ? 'easy' : (spec.difficulty || difficultyOf(n));
  level.reward = level.difficulty === 'hard' || level.difficulty === 'super' ? 2 : 1;
  level.region = regionFor(n);
  level.rain = !!spec.rain;
  const introNames = {
    size: 'Three sizes', luggage: 'Bags and buckets', twotone: 'Split roof',
    tarp: 'Under the tarp', lock: 'Padlock', gaartjie: 'Gaartjie', robot: 'Robot',
    cone: 'Cones', officer: 'Officer', queues: 'Two queues', tow: 'Tow chain', rain: 'Wet road',
  };
  level.name = introNames[spec.intro] || NAMES[(n - 1) % NAMES.length];
  level.tutorial = spec.intro ? {
    mech: spec.intro,
    text: TUTORIAL[spec.intro],
    focus: 0,
  } : null;
  level.parTime = 70;
  return level;
}

function fallback(n) {
  const level = {
    id: n,
    cols: 4,
    rows: 4,
    bays: 5,
    cones: [],
    robots: [],
    officer: null,
    rain: false,
    queues: [[
      { color: 0, seats: 1, vip: false, luggage: false },
      { color: 0, seats: 1, vip: false, luggage: false },
      { color: 0, seats: 1, vip: false, luggage: false },
      { color: 0, seats: 1, vip: false, luggage: false },
      { color: 0, seats: 1, vip: false, luggage: false },
      { color: 0, seats: 1, vip: false, luggage: false },
    ]],
    taxis: [{
      id: 0, c: 1, r: 2, dir: 2, len: 3, seats: 6, colors: [0],
      hidden: false, lockAfter: 0, tow: -1, gaartjie: false,
    }],
    guide: [{ t: 'exit', id: 0 }],
    par: 1,
  };
  // 6 passengers but seats 6, len 3 quantum usually 9. This fallback uses 6 seats on a len 3 so it still clears.
  return finish(level, n, { rain: false, intro: null, difficulty: 'easy' });
}

export function buildLevel(n, opts = {}) {
  const easier = opts.easier || 0;
  const spec = specFor(n, easier);
  spec.difficulty = easier ? 'easy' : difficultyOf(n);
  const rng = mulberry32((n * 0x9e3779b9 + easier * 0x85ebca6b) >>> 0);
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const level = construct(n, spec, rng);
    if (!level) continue;
    finish(level, n, spec);
    return level;
  }
  return finish(fallback(n), n, spec);
}

export function generateDaily(date = new Date()) {
  const key = dateKey(date);
  const seed = hashString(`taxi-rank-rush:${key}`);
  const spec = specFor(20 + (seed % 15), 0);
  spec.queues = 1;
  spec.mechs = new Set(['tarp']);
  spec.rain = false;
  spec.intro = null;
  spec.count = 3;
  spec.colours = 2;
  const rng = mulberry32(seed);
  let level = null;
  for (let attempt = 0; attempt < 40 && !level; attempt += 1) level = construct(0, spec, rng);
  if (!level) level = fallback(0);
  finish(level, 0, spec);
  level.daily = key;
  level.name = 'Rush Hour';
  level.parTime = 80;
  level.tutorial = null;
  level.reward = 1;
  return level;
}

export function weekendLevel(index, weekSeed) {
  const spec = specFor(30, 0);
  spec.count = 3;
  spec.queues = 1;
  spec.intro = null;
  spec.mechs = new Set(index % 2 === 0 ? ['size'] : ['luggage']);
  spec.rain = false;
  const rng = mulberry32((weekSeed + index * 131) >>> 0);
  let level = null;
  for (let attempt = 0; attempt < 30 && !level; attempt += 1) level = construct(index + 1, spec, rng);
  if (!level) level = fallback(index + 1);
  finish(level, index + 1, spec);
  level.name = `Month-end ${index + 1}`;
  level.tutorial = null;
  return level;
}
