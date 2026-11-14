import {
  LEVEL_COUNT,
  buildLevel,
  difficultyOf,
  generateDaily,
  isLose,
  isWin,
  noteBump,
  replay,
  solve,
} from '../src/engine.js';

const stats = {
  easy: [], medium: [], hard: [], super: [],
};
const mechs = {};
let failed = 0;
let nodes = 0;
const started = Date.now();

function check(name, cond) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', name);
  }
}

const sample = buildLevel(2);
const bumped = noteBump(sample && { moves: 0 });
check('a blocked tap does not spend a move', bumped.moves === 0);

for (let n = 1; n <= LEVEL_COUNT; n += 1) {
  const level = buildLevel(n);
  check(`level ${n} exists`, !!level && level.taxis.length > 0);
  if (!level) continue;
  const played = replay(level, level.guide);
  if (!played.ok) {
    check(`level ${n} guide wins`, false);
    continue;
  }
  const proof = solve(level, { nodeLimit: 50000 });
  nodes += proof.nodes || 0;
  if (!proof.solvable) {
    check(`level ${n} solver (${proof.nodes} nodes)`, false);
    continue;
  }
  check(`level ${n} par ${level.par} vs solver ${proof.moves}`, proof.moves === level.par);
  const band = difficultyOf(n);
  stats[band].push(level.par);
  if (level.tutorial) mechs[level.tutorial.mech] = (mechs[level.tutorial.mech] || 0) + 1;
  const easier = buildLevel(n, { easier: 1 });
  const easyPlay = replay(easier, easier.guide);
  check(`level ${n} easier variant`, easyPlay.ok && easier.bays >= level.bays);
}

const daily = generateDaily(new Date('2026-11-13T12:00:00'));
const again = generateDaily(new Date('2026-11-13T18:00:00'));
check('daily is stable for a date', JSON.stringify(daily.taxis) === JSON.stringify(again.taxis));
check('daily guide wins', replay(daily, daily.guide).ok);
check('daily solver', solve(daily).solvable);

function avg(list) {
  if (!list.length) return 0;
  return Math.round((list.reduce((sum, n) => sum + n, 0) / list.length) * 10) / 10;
}

console.log(JSON.stringify({
  levels: LEVEL_COUNT,
  failed,
  ms: Date.now() - started,
  nodes,
  par: {
    easy: { n: stats.easy.length, avg: avg(stats.easy) },
    medium: { n: stats.medium.length, avg: avg(stats.medium) },
    hard: { n: stats.hard.length, avg: avg(stats.hard) },
    super: { n: stats.super.length, avg: avg(stats.super) },
  },
  tutorials: mechs,
}, null, 2));

if (failed) process.exit(1);
