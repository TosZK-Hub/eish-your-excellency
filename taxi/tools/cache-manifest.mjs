import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skip = new Set(['sw.js', 'package.json', 'README.md']);

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (name === 'tools' || name === 'node_modules' || name.startsWith('.')) continue;
    const abs = join(dir, name);
    const rel = relative(root, abs).split('\\').join('/');
    if (skip.has(rel)) continue;
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else out.push(rel);
  }
}

const files = ['index.html', 'manifest.webmanifest'];
walk(join(root, 'vendor'), files);
walk(join(root, 'src'), files);
walk(join(root, 'data'), files);
walk(join(root, 'assets'), files);
const unique = [...new Set(files)].sort();
writeFileSync(join(root, 'assets', 'cache-manifest.json'), JSON.stringify(unique, null, 2));
console.log(`cached ${unique.length} files`);
