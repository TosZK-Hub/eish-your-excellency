import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const www = join(root, "www");
rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });
for (const name of ["index.html", "privacy.html", "manifest.webmanifest", "sw.js", "icon.svg", "css", "js", "font", "icons", "assets"]) {
  cpSync(join(root, name), join(www, name), { recursive: true });
}
// Hettie Hadida icons (web PNGs and Android launcher mipmaps) ship as base64 in
// tools/icons-pack.json, because the repo is updated through a text-only
// connector. Decode them here so the APK and www/ get real PNG files.
const pack = JSON.parse(readFileSync(join(root, "tools", "icons-pack.json"), "utf8"));
for (const [rel, b64] of Object.entries(pack)) {
  const out = join(root, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(b64, "base64"));
}
console.log("synced", www, "+", Object.keys(pack).length, "icons");
