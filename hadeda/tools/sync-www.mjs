import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const www = join(root, "www");
rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });
for (const name of ["index.html", "privacy.html", "manifest.webmanifest", "sw.js", "icon.svg", "css", "js", "font", "icons"]) {
  cpSync(join(root, name), join(www, name), { recursive: true });
}
console.log("synced", www);
