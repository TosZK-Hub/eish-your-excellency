import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyAction,
  createState,
  generateDaily,
  handcrafted,
  interpret,
  isLose,
  isWin,
  prepare,
  replay,
  solve,
} from '../src/engine.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'data', 'levels.json'), 'utf8'));
let failed = 0;

function check(name, cond) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', name);
  }
}

const loseLevel = {
  id: 99,
  cols: 3,
  rows: 1,
  bays: 1,
  gaartjie: -1,
  queue: [1, 1],
  taxis: [
    { id: 0, c: 0, r: 0, dir: 3, color: 0, seats: 2, locks: 0, hidden: false, decoy: false },
    { id: 1, c: 2, r: 0, dir: 1, color: 1, seats: 2, locks: 0, hidden: false, decoy: false },
  ],
};
prepare(loseLevel);
const parked = applyAction(createState(loseLevel), loseLevel, { t: 'exit', id: 0 });
check('wrong colour clogs the only bay', parked && isLose(parked.state, loseLevel) && !isWin(parked.state));
const saved = applyAction(createState(loseLevel), loseLevel, { t: 'exit', id: 1 });
check('matching colour still clears', saved && isWin(saved.state));

const bumped = handcrafted(2);
prepare(bumped);
check('blocked taxi hoots instead of leaving', interpret(createState(bumped), bumped, 0).t === 'bump');

check('60 levels', data.levels.length === 60);

const seen = { hidden: false, lock: false, gaartjie: false, spare: false };
let nodes = 0;
const started = Date.now();

for (const level of data.levels) {
  prepare(level);
  const seats = level.taxis.filter((t) => !t.decoy).reduce((sum, t) => sum + t.seats, 0);
  check(`level ${level.id} queue matches seats`, level.queue.length === seats);
  if (level.gaartjie >= 0) check(`level ${level.id} gaartjie index`, level.gaartjie < level.queue.length);
  const cells = new Set();
  for (const taxi of level.taxis) {
    const key = `${taxi.c},${taxi.r}`;
    check(`level ${level.id} unique cell ${key}`, !cells.has(key));
    cells.add(key);
  }
  const rep = replay(level, level.guide);
  if (!rep.ok) {
    check(`level ${level.id} guide replays`, false);
    continue;
  }
  const t0 = Date.now();
  const proof = solve(level, { nodeLimit: 250000 });
  const ms = Date.now() - t0;
  nodes += proof.nodes || 0;
  if (!proof.solvable) {
    check(`level ${level.id} solver (${proof.nodes} nodes, limited=${!!proof.limited})`, false);
    continue;
  }
  if (proof.moves !== level.par) {
    check(`level ${level.id} par ${level.par} vs solver ${proof.moves}`, false);
  }
  if (ms > 1500) console.log(`slow #${level.id} ${ms}ms nodes=${proof.nodes}`);
  for (const twist of level.twists || []) seen[twist] = true;
  if (level.id === 4) check('level 4 hidden', level.twists.includes('hidden'));
  if (level.id === 8) check('level 8 lock', level.twists.includes('lock'));
  if (level.id === 12) check('level 12 gaartjie', level.twists.includes('gaartjie'));
  if (level.id === 18) check('level 18 spare', level.twists.includes('spare'));
}

check('hidden twist shipped', seen.hidden);
check('lock twist shipped', seen.lock);
check('gaartjie twist shipped', seen.gaartjie);
check('spare twist shipped', seen.spare);

for (let day = 1; day <= 7; day += 1) {
  const date = new Date(2026, 10, day);
  const daily = generateDaily(date);
  prepare(daily);
  const rep = replay(daily, daily.guide);
  const again = generateDaily(date);
  check(`daily ${day} replay`, rep.ok);
  check(`daily ${day} stable`, JSON.stringify(again.taxis) === JSON.stringify(daily.taxis) && again.queue.join() === daily.queue.join());
  const proof = solve(daily, { nodeLimit: 250000 });
  check(`daily ${day} solver`, proof.solvable && proof.moves === daily.par);
}

console.log(`nodes=${nodes} verifyMs=${Date.now() - started} failed=${failed}`);
if (failed) process.exit(1);
console.log('All levels solvable.');
