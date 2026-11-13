/**
 * Pure rules for Taxi Rank Rush: placement, boarding, generation, solver.
 * No Phaser and no DOM, so Node can prove every level.
 *
 * A taxi drives straight along its facing direction and only leaves the rank
 * when every cell in front of it is empty. It then takes a free loading bay.
 * Passengers board FIFO into a bay of their colour. A gaartjie jumps ahead
 * onto the first bay of their colour. A taxi departs when its seats are full.
 * Spare (decoy) taxis have no passengers, so a bay they occupy never clears.
 */

import { COLORS, SPARE_COLOR } from './theme.js';

export const DIRS = [
  { x: 0, y: -1, name: 'up' },
  { x: 1, y: 0, name: 'right' },
  { x: 0, y: 1, name: 'down' },
  { x: -1, y: 0, name: 'left' },
];

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

export function prepare(level) {
  const grid = new Int16Array(level.cols * level.rows);
  grid.fill(-1);
  for (const taxi of level.taxis) grid[taxi.r * level.cols + taxi.c] = taxi.id;
  level.grid = grid;
  return level;
}

export function createState(level) {
  return {
    locks: Uint8Array.from(level.taxis.map((t) => t.locks | 0)),
    exited: new Uint8Array(level.taxis.length),
    bayTaxi: new Int16Array(level.bays).fill(-1),
    bayFilled: new Uint8Array(level.bays),
    boarded: new Uint8Array(level.queue.length),
    queue: level.queue.slice(),
    gaartjie: level.gaartjie ?? -1,
    moves: 0,
    extraUsed: 0,
  };
}

function cloneState(state) {
  return {
    locks: state.locks.slice(),
    exited: state.exited.slice(),
    bayTaxi: state.bayTaxi.slice(),
    bayFilled: state.bayFilled.slice(),
    boarded: state.boarded.slice(),
    queue: state.queue.slice(),
    gaartjie: state.gaartjie,
    moves: state.moves,
    extraUsed: state.extraUsed,
  };
}

export function pathClear(level, state, id) {
  const taxi = level.taxis[id];
  const dir = DIRS[taxi.dir];
  let c = taxi.c + dir.x;
  let r = taxi.r + dir.y;
  const { cols, rows, grid } = level;
  while (c >= 0 && r >= 0 && c < cols && r < rows) {
    const occ = grid[r * cols + c];
    if (occ >= 0 && !state.exited[occ]) return false;
    c += dir.x;
    r += dir.y;
  }
  return true;
}

export function firstBlocker(level, state, id) {
  const taxi = level.taxis[id];
  const dir = DIRS[taxi.dir];
  let c = taxi.c + dir.x;
  let r = taxi.r + dir.y;
  const { cols, rows, grid } = level;
  while (c >= 0 && r >= 0 && c < cols && r < rows) {
    const occ = grid[r * cols + c];
    if (occ >= 0 && !state.exited[occ]) return occ;
    c += dir.x;
    r += dir.y;
  }
  return -1;
}

function firstFreeBay(state) {
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    if (state.bayTaxi[i] < 0) return i;
  }
  return -1;
}

function findBay(state, level, color) {
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    const id = state.bayTaxi[i];
    if (id < 0) continue;
    const taxi = level.taxis[id];
    if (taxi.color === color && state.bayFilled[i] < taxi.seats) return i;
  }
  return -1;
}

function board(state, level, bay, pIndex, events) {
  state.boarded[pIndex] = 1;
  state.bayFilled[bay] += 1;
  const taxiId = state.bayTaxi[bay];
  const seats = level.taxis[taxiId].seats;
  events.push({
    t: 'board',
    bay,
    taxiId,
    pIndex,
    filled: state.bayFilled[bay],
    seats,
  });
  if (state.bayFilled[bay] >= seats) {
    events.push({ t: 'depart', bay, taxiId });
    state.bayTaxi[bay] = -1;
    state.bayFilled[bay] = 0;
  }
}

export function resolve(state, level, events) {
  const limit = state.queue.length + 3;
  for (let guard = 0; guard < limit; guard += 1) {
    if (state.gaartjie >= 0 && !state.boarded[state.gaartjie]) {
      const bay = findBay(state, level, state.queue[state.gaartjie]);
      if (bay >= 0) {
        board(state, level, bay, state.gaartjie, events);
        continue;
      }
    }
    let front = -1;
    for (let i = 0; i < state.boarded.length; i += 1) {
      if (!state.boarded[i]) {
        front = i;
        break;
      }
    }
    if (front < 0) return;
    const bay = findBay(state, level, state.queue[front]);
    if (bay < 0) return;
    board(state, level, bay, front, events);
  }
}

function occupied(state) {
  let n = 0;
  for (let i = 0; i < state.bayTaxi.length; i += 1) if (state.bayTaxi[i] >= 0) n += 1;
  return n;
}

export function isWin(state) {
  if (!state.boarded.length) return false;
  for (let i = 0; i < state.boarded.length; i += 1) if (!state.boarded[i]) return false;
  return true;
}

export function hasProgress(state, level) {
  let free = false;
  for (let i = 0; i < state.bayTaxi.length; i += 1) if (state.bayTaxi[i] < 0) free = true;
  if (!free) return false;
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (state.exited[i]) continue;
    if (pathClear(level, state, i)) return true;
  }
  return false;
}

export function isLose(state, level) {
  if (isWin(state)) return false;
  return !hasProgress(state, level);
}

export function loseReason(state) {
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    if (state.bayTaxi[i] < 0) return 'jam';
  }
  return 'full';
}

export function interpret(state, level, id) {
  if (id < 0 || id >= level.taxis.length || state.exited[id]) return { t: 'none' };
  if (state.locks[id] > 0) return { t: 'unlock', id };
  if (!pathClear(level, state, id)) {
    return { t: 'bump', id, blocker: firstBlocker(level, state, id) };
  }
  if (firstFreeBay(state) < 0) return { t: 'nobay', id };
  return { t: 'exit', id };
}

export function noteBump(state) {
  const next = cloneState(state);
  next.moves += 1;
  return next;
}

export function applyAction(state, level, action) {
  if (!action) return null;
  if (action.t === 'unlock') {
    const id = action.id;
    if (state.exited[id] || state.locks[id] <= 0) return null;
    const next = cloneState(state);
    next.locks[id] -= 1;
    next.moves += 1;
    return { state: next, events: [{ t: 'unlock', id }], peak: occupied(next) };
  }
  if (action.t === 'exit') {
    const id = action.id;
    if (state.exited[id] || state.locks[id] > 0) return null;
    if (!pathClear(level, state, id)) return null;
    const bay = firstFreeBay(state);
    if (bay < 0) return null;
    const next = cloneState(state);
    next.exited[id] = 1;
    next.bayTaxi[bay] = id;
    next.bayFilled[bay] = 0;
    next.moves += 1;
    const placed = occupied(next);
    const events = [{ t: 'exit', id, bay }];
    resolve(next, level, events);
    return { state: next, events, peak: Math.max(placed, occupied(next)) };
  }
  return null;
}

export function replay(level, actions) {
  prepare(level);
  let state = createState(level);
  let peak = 0;
  for (const action of actions) {
    const res = applyAction(state, level, action);
    if (!res) return { ok: false, state, peak };
    state = res.state;
    peak = Math.max(peak, res.peak);
    if (isLose(state, level)) return { ok: false, state, peak, lost: true };
  }
  return { ok: isWin(state), state, peak };
}

export function grantExtraBay(state, level) {
  if (state.extraUsed) return null;
  const next = cloneState(state);
  const bayTaxi = new Int16Array(state.bayTaxi.length + 1);
  bayTaxi.set(state.bayTaxi);
  bayTaxi[bayTaxi.length - 1] = -1;
  const bayFilled = new Uint8Array(state.bayFilled.length + 1);
  bayFilled.set(state.bayFilled);
  next.bayTaxi = bayTaxi;
  next.bayFilled = bayFilled;
  next.extraUsed = 1;
  next.moves += 1;
  const events = [{ t: 'bay' }];
  resolve(next, level, events);
  return { state: next, events };
}

export function shuffleRemaining(state, level, rng) {
  const next = cloneState(state);
  const open = [];
  for (let i = 0; i < next.boarded.length; i += 1) {
    if (!next.boarded[i]) open.push(i);
  }
  const people = open.map((i) => ({
    color: next.queue[i],
    vip: i === next.gaartjie,
  }));
  for (let i = people.length - 1; i > 0; i -= 1) {
    const j = (rng() * (i + 1)) | 0;
    const tmp = people[i];
    people[i] = people[j];
    people[j] = tmp;
  }
  next.gaartjie = -1;
  open.forEach((idx, k) => {
    next.queue[idx] = people[k].color;
    if (people[k].vip) next.gaartjie = idx;
  });
  next.moves += 1;
  const events = [{ t: 'shuffle' }];
  resolve(next, level, events);
  return { state: next, events };
}

function capacityOk(state, level) {
  const need = new Int16Array(8);
  for (let i = 0; i < state.queue.length; i += 1) {
    if (!state.boarded[i]) need[state.queue[i]] += 1;
  }
  const cap = new Int16Array(8);
  for (let b = 0; b < state.bayTaxi.length; b += 1) {
    const id = state.bayTaxi[b];
    if (id < 0) continue;
    const taxi = level.taxis[id];
    cap[taxi.color] += taxi.seats - state.bayFilled[b];
  }
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (state.exited[i] || level.taxis[i].decoy) continue;
    cap[level.taxis[i].color] += level.taxis[i].seats;
  }
  for (let c = 0; c < 8; c += 1) if (need[c] > cap[c]) return false;
  return true;
}

function stateKey(state, level) {
  let exited = 0;
  let locks = 0;
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (state.exited[i]) exited += 2 ** i;
    else locks = locks * 3 + state.locks[i];
  }
  let boarded = 0n;
  for (let i = 0; i < state.boarded.length; i += 1) {
    if (state.boarded[i]) boarded |= 1n << BigInt(i);
  }
  let bay = '';
  for (let i = 0; i < state.bayTaxi.length; i += 1) {
    const id = state.bayTaxi[i];
    if (id < 0) bay += '.';
    else {
      const taxi = level.taxis[id];
      bay += `${taxi.color}${state.bayFilled[i]}${taxi.seats}`;
    }
  }
  return `${exited}|${locks}|${boarded.toString(36)}|${bay}`;
}

function legalActions(state, level, banDecoys) {
  const free = firstFreeBay(state) >= 0;
  if (!free) return [];
  const actions = [];
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (state.exited[i]) continue;
    if (banDecoys && level.taxis[i].decoy) continue;
    if (!pathClear(level, state, i)) continue;
    if (state.locks[i] > 0) actions.push({ t: 'unlock', id: i });
    else actions.push({ t: 'exit', id: i });
  }
  return actions;
}

function bfs(level, opts) {
  const limit = opts.nodeLimit ?? 200000;
  const banDecoys = !!opts.banDecoys;
  prepare(level);
  const start = createState(level);
  const queue = [start];
  const depth = [0];
  const seen = new Set();
  seen.add(stateKey(start, level));
  let head = 0;
  let nodes = 0;
  while (head < queue.length) {
    const state = queue[head];
    const dist = depth[head];
    head += 1;
    if (isWin(state)) return { solvable: true, moves: dist, nodes };
    nodes += 1;
    if (nodes > limit) return { solvable: false, nodes, limited: true };
    if (isLose(state, level)) continue;
    const actions = legalActions(state, level, banDecoys);
    for (let a = 0; a < actions.length; a += 1) {
      const res = applyAction(state, level, actions[a]);
      if (!res) continue;
      if (!isWin(res.state) && (isLose(res.state, level) || !capacityOk(res.state, level))) continue;
      const key = stateKey(res.state, level);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push(res.state);
      depth.push(dist + 1);
    }
  }
  return { solvable: false, nodes };
}

/** Independent search. Spares are ignored unless the rank is otherwise unsolvable. */
export function solve(level, opts = {}) {
  const first = bfs(level, { ...opts, banDecoys: true });
  if (first.solvable || !level.taxis.some((t) => t.decoy)) return first;
  const second = bfs(level, { ...opts, banDecoys: false });
  second.nodes += first.nodes;
  return second;
}

function pickDir(c, r, cols, rows, rng, bias) {
  if (rng() < bias) {
    const up = r;
    const down = rows - 1 - r;
    const left = c;
    const right = cols - 1 - c;
    const m = Math.min(up, down, left, right);
    if (m === up) return 0;
    if (m === down) return 2;
    if (m === left) return 3;
    return 1;
  }
  return (rng() * 4) | 0;
}

function computeOrder(level, rng) {
  const exited = new Uint8Array(level.taxis.length);
  const order = [];
  let guard = 0;
  while (order.length < level.taxis.length && guard < 80) {
    guard += 1;
    const movable = [];
    for (let i = 0; i < level.taxis.length; i += 1) {
      if (!exited[i] && pathClear(level, { exited }, i)) movable.push(i);
    }
    if (!movable.length) return null;
    const id = movable[(rng() * movable.length) | 0];
    order.push(id);
    exited[id] = 1;
  }
  return order.length === level.taxis.length ? order : null;
}

function blockedCount(level) {
  const exited = new Uint8Array(level.taxis.length);
  let n = 0;
  for (let i = 0; i < level.taxis.length; i += 1) {
    if (!pathClear(level, { exited }, i)) n += 1;
  }
  return n;
}

function queueFor(order, taxis, window) {
  const queue = [];
  for (let start = 0; start < order.length; start += window) {
    const chunk = order.slice(start, start + window);
    const seats = taxis[chunk[0]].seats;
    for (let s = 0; s < seats; s += 1) {
      for (const id of chunk) queue.push(taxis[id].color);
    }
  }
  return queue;
}

function shuffleSome(queue, rng, swaps) {
  const q = queue.slice();
  for (let i = 0; i < swaps; i += 1) {
    const a = (rng() * q.length) | 0;
    const delta = ((rng() * 5) | 0) - 2;
    const b = Math.min(q.length - 1, Math.max(0, a + delta));
    const tmp = q[a];
    q[a] = q[b];
    q[b] = tmp;
  }
  return q;
}

function exitGuide(order) {
  return order.map((id) => ({ t: 'exit', id }));
}

function safeCells(level, order) {
  const forbidden = new Set();
  for (const id of order) {
    const taxi = level.taxis[id];
    const dir = DIRS[taxi.dir];
    let c = taxi.c + dir.x;
    let r = taxi.r + dir.y;
    while (c >= 0 && r >= 0 && c < level.cols && r < level.rows) {
      forbidden.add(`${c},${r}`);
      c += dir.x;
      r += dir.y;
    }
  }
  const used = new Set(level.taxis.map((t) => `${t.c},${t.r}`));
  const safe = [];
  for (let r = 0; r < level.rows; r += 1) {
    for (let c = 0; c < level.cols; c += 1) {
      const key = `${c},${r}`;
      if (!used.has(key) && !forbidden.has(key)) safe.push({ c, r });
    }
  }
  return safe;
}

function attemptPlacement(rng, spec) {
  const { cols, rows } = spec;
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) cells.push({ c, r });
  }
  const shuffled = shuffle(cells, rng);
  const span = spec.maxTaxis - spec.minTaxis + 1;
  const want = spec.minTaxis + ((rng() * span) | 0);
  if (shuffled.length < want) return null;
  const taxis = [];
  for (let i = 0; i < want; i += 1) {
    const cell = shuffled[i];
    taxis.push({
      id: i,
      c: cell.c,
      r: cell.r,
      dir: pickDir(cell.c, cell.r, cols, rows, rng, spec.biasOut ?? 0.45),
      color: 0,
      seats: spec.seats,
      locks: 0,
      hidden: false,
      decoy: false,
    });
  }
  const level = {
    cols,
    rows,
    bays: spec.bays,
    taxis,
    queue: [],
    gaartjie: -1,
  };
  prepare(level);
  const order = computeOrder(level, rng);
  if (!order) return null;
  order.forEach((id, i) => {
    level.taxis[id].color = i % spec.colours;
  });
  if (blockedCount(level) < (spec.minBlocked || 0)) return null;

  const maxWindow = Math.max(1, Math.min(spec.targetPeak || 1, spec.colours, spec.bays, order.length));
  let best = null;
  for (let window = maxWindow; window >= 1; window -= 1) {
    const base = queueFor(order, level.taxis, window);
    const candidates = [base];
    for (let s = 0; s < 5; s += 1) candidates.push(shuffleSome(base, rng, 2 + s));
    for (const queue of candidates) {
      const trial = { ...level, queue, gaartjie: -1 };
      const rep = replay(trial, exitGuide(order));
      if (!rep.ok) continue;
      if (!best || rep.peak > best.peak) best = { queue, peak: rep.peak, window };
      if (best.peak >= (spec.targetPeak || 1)) break;
    }
    if (best && best.peak >= (spec.targetPeak || 1)) break;
  }
  if (!best) return null;
  if (spec.minPeak && best.peak < spec.minPeak) return null;

  let gaartjie = -1;
  if (spec.gaartjie) {
    for (let i = best.queue.length - 1; i >= 0; i -= 1) {
      const rep = replay({ ...level, queue: best.queue, gaartjie: i }, exitGuide(order));
      if (rep.ok) {
        gaartjie = i;
        break;
      }
    }
    if (gaartjie < 0) return null;
  }
  level.queue = best.queue;
  level.gaartjie = gaartjie;
  level.peak = best.peak;

  const decoys = spec.decoys || 0;
  if (decoys) {
    const safe = shuffle(safeCells(level, order), rng);
    const n = Math.min(decoys, safe.length);
    for (let i = 0; i < n; i += 1) {
      const cell = safe[i];
      level.taxis.push({
        id: level.taxis.length,
        c: cell.c,
        r: cell.r,
        dir: pickDir(cell.c, cell.r, cols, rows, rng, 0.85),
        color: SPARE_COLOR,
        seats: spec.seats,
        locks: 0,
        hidden: false,
        decoy: true,
      });
    }
    prepare(level);
  }

  const demand = level.taxis.filter((t) => !t.decoy);
  const hiddenNeed = Math.min(spec.hidden || 0, Math.max(0, demand.length - 1));
  if (hiddenNeed) {
    const picks = shuffle(demand.map((t) => t.id), rng).slice(0, hiddenNeed);
    for (const id of picks) level.taxis[id].hidden = true;
  }
  const lockNeed = Math.min(spec.locks || 0, demand.length);
  if (lockNeed) {
    const picks = shuffle(demand.map((t) => t.id), rng).slice(0, lockNeed);
    for (const id of picks) level.taxis[id].locks = 1;
  }

  const guide = [];
  for (const id of order) {
    const locks = level.taxis[id].locks | 0;
    for (let k = 0; k < locks; k += 1) guide.push({ t: 'unlock', id });
    guide.push({ t: 'exit', id });
  }
  const proved = replay(level, guide);
  if (!proved.ok) return null;
  level.guide = guide;
  level.par = guide.length;
  level.parTime = Math.max(22, Math.round(16 + guide.length * 5));
  level.seed = spec.seed || 0;
  return level;
}

export function generateFromSeed(seed, spec) {
  const rng = mulberry32(seed >>> 0);
  for (let attempt = 0; attempt < (spec.attempts || 30); attempt += 1) {
    const level = attemptPlacement(rng, spec);
    if (level) {
      level.seed = seed >>> 0;
      return level;
    }
  }
  return null;
}

export function generateBest(baseSeed, spec, tries = 48) {
  for (let k = 0; k < tries; k += 1) {
    const seed = (baseSeed + k * 9973) >>> 0;
    const level = generateFromSeed(seed, { ...spec, attempts: 12 });
    if (level) return level;
  }
  return null;
}

function taxi(id, c, r, dir, color, seats, extra = {}) {
  return {
    id,
    c,
    r,
    dir,
    color,
    seats,
    locks: extra.locks || 0,
    hidden: !!extra.hidden,
    decoy: !!extra.decoy,
  };
}

function hand(level, guide) {
  level.guide = guide;
  level.par = guide.length;
  level.parTime = Math.max(24, 18 + guide.length * 6);
  level.seed = 1000 + level.id;
  const proved = replay(level, guide);
  if (!proved.ok) {
    throw new Error(`Handcrafted level ${level.id} does not clear`);
  }
  return level;
}

/** Tutorial levels are hand-placed so the first twists are obvious and fast. */
export function handcrafted(id) {
  if (id === 1) {
    return hand({
      id: 1,
      cols: 3,
      rows: 3,
      bays: 4,
      gaartjie: -1,
      queue: [0, 0, 0, 1, 1, 1],
      taxis: [
        taxi(0, 0, 1, 2, 0, 3),
        taxi(1, 1, 1, 2, 1, 3),
      ],
    }, [{ t: 'exit', id: 0 }, { t: 'exit', id: 1 }]);
  }
  if (id === 2) {
    return hand({
      id: 2,
      cols: 4,
      rows: 4,
      bays: 4,
      gaartjie: -1,
      queue: [0, 0, 0, 1, 1, 1, 2, 2, 2],
      taxis: [
        taxi(0, 1, 1, 2, 0, 3),
        taxi(1, 1, 2, 2, 1, 3),
        taxi(2, 3, 1, 1, 2, 3),
      ],
    }, [{ t: 'exit', id: 1 }, { t: 'exit', id: 2 }, { t: 'exit', id: 0 }]);
  }
  if (id === 3) {
    return hand({
      id: 3,
      cols: 4,
      rows: 4,
      bays: 4,
      gaartjie: -1,
      queue: [2, 2, 2, 1, 1, 1, 0, 0, 0],
      taxis: [
        taxi(0, 0, 2, 3, 2, 3),
        taxi(1, 2, 2, 2, 1, 3),
        taxi(2, 2, 1, 2, 0, 3),
      ],
    }, [{ t: 'exit', id: 0 }, { t: 'exit', id: 1 }, { t: 'exit', id: 2 }]);
  }
  if (id === 4) {
    return hand({
      id: 4,
      cols: 4,
      rows: 4,
      bays: 4,
      gaartjie: -1,
      queue: [1, 1, 1, 2, 2, 2, 0, 0, 0],
      taxis: [
        taxi(0, 1, 2, 2, 1, 3),
        taxi(1, 1, 1, 2, 0, 3, { hidden: true }),
        taxi(2, 3, 2, 2, 2, 3),
      ],
    }, [{ t: 'exit', id: 0 }, { t: 'exit', id: 2 }, { t: 'exit', id: 1 }]);
  }
  if (id === 8) {
    return hand({
      id: 8,
      cols: 4,
      rows: 4,
      bays: 4,
      gaartjie: -1,
      queue: [0, 0, 0, 1, 1, 1],
      taxis: [
        taxi(0, 1, 2, 2, 0, 3, { locks: 1 }),
        taxi(1, 2, 2, 2, 1, 3),
      ],
    }, [
      { t: 'unlock', id: 0 },
      { t: 'exit', id: 0 },
      { t: 'exit', id: 1 },
    ]);
  }
  if (id === 12) {
    return hand({
      id: 12,
      cols: 4,
      rows: 4,
      bays: 4,
      gaartjie: 5,
      queue: [0, 0, 0, 1, 1, 1],
      taxis: [
        taxi(0, 1, 2, 2, 0, 3),
        taxi(1, 2, 1, 1, 1, 3),
      ],
    }, [{ t: 'exit', id: 0 }, { t: 'exit', id: 1 }]);
  }
  return null;
}

export function specForLevel(n) {
  const late = n >= 40;
  const mid = n >= 22;
  const twists = twistPlan(n);
  return {
    cols: n < 14 ? 4 : n < 36 ? 5 : 5,
    rows: n < 14 ? 4 : n < 36 ? 4 : 5,
    colours: n < 10 ? 3 : n < 24 ? 3 : n < 42 ? 4 : 5,
    bays: n < 30 ? 4 : 3,
    seats: n < 34 ? 3 : 4,
    minTaxis: n < 14 ? 5 : n < 28 ? 6 : late ? 8 : 7,
    maxTaxis: n < 14 ? 6 : n < 28 ? 8 : late ? 10 : 9,
    targetPeak: Math.min(n < 30 ? 4 : 3, n < 16 ? 2 : 3),
    minPeak: n < 10 ? 1 : 2,
    minBlocked: 1,
    biasOut: n < 16 ? 0.5 : 0.28,
    hidden: twists.hidden,
    locks: twists.locks,
    gaartjie: twists.gaartjie,
    decoys: twists.decoys,
  };
}

function twistPlan(n) {
  const hiddenLevels = new Set([4, 7, 10, 16, 22, 26, 31, 36, 41, 46, 52, 58]);
  const lockLevels = new Set([8, 11, 16, 19, 24, 29, 33, 38, 44, 49, 55, 60]);
  const gaartjieLevels = new Set([12, 15, 21, 24, 30, 36, 42, 48, 54, 60]);
  const spareLevels = new Set([18, 23, 28, 34, 40, 45, 51, 57]);
  return {
    hidden: hiddenLevels.has(n) ? (n >= 46 ? 2 : 1) : 0,
    locks: lockLevels.has(n) ? (n >= 49 ? 2 : 1) : 0,
    gaartjie: gaartjieLevels.has(n),
    decoys: spareLevels.has(n) ? (n >= 45 ? 2 : 1) : 0,
  };
}

export function buildCampaignLevel(n) {
  const handmade = handcrafted(n);
  if (handmade) return handmade;
  const spec = specForLevel(n);
  let level = generateBest(8000 + n * 131, spec, 60);
  if (!level && spec.minPeak > 1) {
    level = generateBest(12000 + n * 131, { ...spec, minPeak: spec.minPeak - 1 }, 40);
  }
  if (!level) {
    level = generateBest(24000 + n * 131, {
      ...spec,
      minPeak: 1,
      targetPeak: 1,
      decoys: 0,
      minBlocked: 0,
      biasOut: 0.7,
    }, 40);
  }
  if (!level) throw new Error(`Could not generate level ${n}`);
  level.id = n;
  return level;
}

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function dailySpec() {
  return {
    cols: 4,
    rows: 4,
    colours: 3,
    bays: 4,
    seats: 3,
    minTaxis: 6,
    maxTaxis: 7,
    targetPeak: 2,
    minPeak: 1,
    minBlocked: 1,
    biasOut: 0.4,
    hidden: 1,
    locks: 1,
    gaartjie: true,
    decoys: 1,
    attempts: 20,
  };
}

export function generateDaily(date = new Date()) {
  const key = dateKey(date);
  const base = hashString(`taxi-rank-rush:${key}`);
  const spec = dailySpec();
  if ((base & 3) === 0) spec.gaartjie = true;
  const level = generateBest(base, spec, 36);
  if (!level) throw new Error(`Daily puzzle failed for ${key}`);
  level.id = 0;
  level.daily = key;
  level.name = 'Rush Hour';
  return level;
}

export function starsFor(moves, timeSec, level) {
  const par = level.par || moves;
  const parTime = level.parTime || 60;
  if (moves <= par && timeSec <= parTime) return 3;
  if (moves <= par + 3 && timeSec <= parTime * 2) return 2;
  return 1;
}

export function shareText(level, result, dateLabel) {
  const lines = [];
  lines.push(result.daily ? 'Taxi Rank Rush · Rush Hour' : `Taxi Rank Rush · ${level.name || 'Level'}`);
  if (dateLabel) lines.push(dateLabel);
  const stars = result.stars || 0;
  lines.push(`${'★'.repeat(stars)}${'☆'.repeat(Math.max(0, 3 - stars))}  ${result.moves} moves · ${result.time}s`);
  const grid = [];
  for (let r = 0; r < level.rows; r += 1) {
    const row = [];
    for (let c = 0; c < level.cols; c += 1) row.push('⬛');
    grid.push(row);
  }
  for (const taxi of level.taxis) {
    const icon = taxi.hidden ? '❓' : (COLORS[taxi.color] ? COLORS[taxi.color].emoji : '⬛');
    const arrow = ['⬆️', '➡️', '⬇️', '⬅️'][taxi.dir] || '';
    grid[taxi.r][taxi.c] = icon + arrow;
  }
  for (const row of grid) lines.push(row.join(''));
  lines.push('Sort the rank.');
  return lines.join('\n');
}

export function stripRuntime(level) {
  const copy = { ...level, taxis: level.taxis.map((t) => ({ ...t })) };
  delete copy.grid;
  return copy;
}
