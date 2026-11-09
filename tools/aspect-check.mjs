// Measures the live WebGL canvas against the camera aspect in portrait, landscape, and after a resize.
import { spawn } from "node:child_process";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9333;
const chrome = spawn("google-chrome", [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
  "--user-data-dir=/tmp/aspect-chrome", "--remote-debugging-port=" + port,
  "--window-size=390,844",
  "http://127.0.0.1:8753/?mute=1&play=1&bot=1&freeze=0.4&mode=run"
], { stdio: "ignore" });

function close() { try { chrome.kill("SIGKILL"); } catch (e) {} }

const fail = [];
function assert(cond, msg) { if (!cond) fail.push(msg); }

async function page() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await fetch("http://127.0.0.1:" + port + "/json").then((r) => r.json());
      const hit = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (hit) return hit;
    } catch (e) {}
    await sleep(200);
  }
  throw new Error("no page");
}

(async () => {
  const tab = await page();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const d = JSON.parse(ev.data);
    if (d.id && pending.has(d.id)) pending.get(d.id)(d);
  });
  function send(method, params) {
    const msgId = ++id;
    return new Promise((res) => {
      pending.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }
  await new Promise((res) => ws.addEventListener("open", res));
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Runtime.evaluate", { expression: "window.dispatchEvent(new Event('resize'))", returnByValue: true });
  await sleep(500);
  async function read(label) {
    const out = await send("Runtime.evaluate", {
      expression: "JSON.stringify(window.__metrics && window.__metrics())",
      returnByValue: true
    });
    const raw = out.result && out.result.result && out.result.result.value;
    const m = raw ? JSON.parse(raw) : null;
    console.log(label, JSON.stringify(m));
    if (!m) { fail.push(label + " no metrics"); return; }
    const d1 = Math.abs(m.cssAspect - m.bufAspect);
    const d2 = Math.abs(m.cssAspect - m.cameraAspect);
    assert(d1 < 0.03, label + " css vs buffer " + d1.toFixed(3) + " css " + m.cssAspect.toFixed(3) + " buf " + m.bufAspect.toFixed(3));
    assert(d2 < 0.03, label + " css vs camera " + d2.toFixed(3) + " cam " + m.cameraAspect.toFixed(3));
    return m;
  }
  var portrait = await read("portrait-390x844");
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send("Runtime.evaluate", { expression: "window.dispatchEvent(new Event('resize'))", returnByValue: true });
  await sleep(400);
  var wide = await read("resized-1280x800");
  await send("Emulation.setDeviceMetricsOverride", { width: 844, height: 390, deviceScaleFactor: 1, mobile: false });
  await send("Runtime.evaluate", { expression: "window.dispatchEvent(new Event('resize'))", returnByValue: true });
  await sleep(400);
  await read("resized-844x390");
  if (portrait && wide) {
    console.log("hfov portrait", portrait.hfov.toFixed(1), "wide", wide.hfov.toFixed(1));
    assert(portrait.hfov > 48, "portrait horizontal view collapsed to " + portrait.hfov.toFixed(1));
    assert(wide.hfov > 60, "wide horizontal view collapsed to " + wide.hfov.toFixed(1));
  }
  ws.close();
  close();
  if (fail.length) {
    console.error(fail.join("\n"));
    process.exit(1);
  }
  console.log("aspect-check: css, buffer, and camera agree");
})().catch((e) => { console.error(e); close(); process.exit(1); });
