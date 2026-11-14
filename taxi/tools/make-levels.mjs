import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LEVEL_INTROS, LEVEL_NAMES } from '../src/theme.js';
import { buildCampaignLevel, stripRuntime } from '../src/engine.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const levels = [];
const started = Date.now();

for (let n = 1; n <= 60; n += 1) {
  const t0 = Date.now();
  const level = buildCampaignLevel(n);
  level.name = LEVEL_NAMES[n - 1];
  level.intro = LEVEL_INTROS[n] || '';
  const twists = [];
  if (level.taxis.some((t) => t.hidden)) twists.push('hidden');
  if (level.taxis.some((t) => t.locks > 0)) twists.push('lock');
  if (level.gaartjie >= 0) twists.push('gaartjie');
  if (level.taxis.some((t) => t.decoy)) twists.push('spare');
  level.twists = twists;
  const clean = stripRuntime(level);
  levels.push(clean);
  const ms = Date.now() - t0;
  console.log(
    `#${String(n).padStart(2, '0')} seed=${level.seed} taxis=${level.taxis.length} ` +
    `bays=${level.bays} par=${level.par} peak=${level.peak ?? '-'} ` +
    `twists=${twists.join('+') || '-'} ${ms}ms`,
  );
}

const out = join(root, 'data', 'levels.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ version: 1, levels }));
console.log(`Wrote ${levels.length} levels in ${Date.now() - started}ms`);
