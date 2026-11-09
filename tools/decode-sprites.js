#!/usr/bin/env node
// Decode base64 sprite copies (assets/sprites/gen-b64/*.png.b64) into real PNGs (assets/sprites/gen/).
// Usage: node tools/decode-sprites.js
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const src = path.join(root, 'assets', 'sprites', 'gen-b64');
const out = path.join(root, 'assets', 'sprites', 'gen');
const manifestPath = path.join(src, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

fs.mkdirSync(out, { recursive: true });
let ok = 0, bad = 0;
for (const file of fs.readdirSync(src).sort()) {
  if (!file.endsWith('.png.b64')) continue;
  const name = file.slice(0, -4); // strip ".b64"
  const buf = Buffer.from(fs.readFileSync(path.join(src, file), 'utf8').replace(/\s+/g, ''), 'base64');
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const want = manifest[name] && manifest[name].sha256;
  if (!buf.subarray(0, 8).equals(PNG_SIG) || (want && want !== sha)) {
    console.error(`FAIL ${name}: ${!buf.subarray(0, 8).equals(PNG_SIG) ? 'not a PNG' : 'sha256 mismatch'}`);
    bad++;
    continue;
  }
  fs.writeFileSync(path.join(out, name), buf);
  ok++;
}
console.log(`Decoded ${ok} sprite(s) to ${path.relative(root, out)}${bad ? `, ${bad} failed` : ''}.`);
process.exit(bad ? 1 : 0);
