/**
 * Sound effects stay on their own gain. Music is a second gain that can be
 * ducked without changing the effect levels. Nothing plays until unlock(),
 * which the first tap calls.
 */

const TRACKS = {
  menu: 'music_menu.mp3',
  gameplay: 'music_gameplay.mp3',
  rushhour: 'music_rushhour.mp3',
};

const SCENE_FADE = 0.6;
const LOOP_FADE = 0.45;
const DUCK_LEVEL = 0.4;
const MUSIC_LEVEL = 0.72;

let ctx = null;
let sfxGain = null;
let musicGain = null;
let duckGain = null;
let sfxMuted = false;
let musicOn = true;
let unlocked = false;
let desired = 'menu';
let active = '';
let current = null;
let duckRelease = 0;
const fetched = {};
const buffers = {};

function trackUrl(name) {
  return new URL(`../assets/audio/${TRACKS[name]}`, import.meta.url);
}

function prefetch(name) {
  if (!TRACKS[name]) return Promise.reject(new Error('unknown track'));
  if (!fetched[name]) {
    fetched[name] = fetch(trackUrl(name)).then((res) => {
      if (!res.ok) throw new Error(`missing ${name}`);
      return res.arrayBuffer();
    });
  }
  return fetched[name];
}

/** Menu first. The other two wait so the opening screen can paint. */
export function preloadMenu() {
  prefetch('menu').then(() => {
    setTimeout(() => {
      prefetch('gameplay');
      prefetch('rushhour');
    }, 700);
  }).catch(() => {});
}

function ensureGraph() {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 1;
    sfxGain.connect(ctx.destination);
    duckGain = ctx.createGain();
    duckGain.gain.value = 1;
    musicGain = ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(duckGain);
    duckGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(value) {
  sfxMuted = !!value;
}

export function isMuted() {
  return sfxMuted;
}

export function setMusicOn(on) {
  musicOn = !!on;
  if (!ctx || !musicGain) return;
  const now = ctx.currentTime;
  rampGain(musicGain.gain, musicOn ? MUSIC_LEVEL : 0.0008, 0.25);
  if (musicOn && unlocked) beginDesired();
}

export function isMusicOn() {
  return musicOn;
}

export function setMusicScene(scene) {
  desired = TRACKS[scene] ? scene : 'menu';
  if (unlocked && musicOn) beginDesired();
}

export function unlock() {
  const c = ensureGraph();
  if (!c) return;
  unlocked = true;
  if (musicOn) beginDesired();
}

function bufferFor(name) {
  if (buffers[name]) return Promise.resolve(buffers[name]);
  return prefetch(name).then((bytes) => {
    const c = ensureGraph();
    if (!c) throw new Error('no audio');
    return c.decodeAudioData(bytes.slice(0));
  }).then((audio) => {
    buffers[name] = audio;
    return audio;
  });
}

function startLoop(buffer, destination) {
  const c = ctx;
  const fade = Math.min(LOOP_FADE, buffer.duration * 0.08);
  let alive = true;
  const timers = [];
  const sources = [];

  function arm(when, overlap) {
    if (!alive) return;
    const start = Math.max(when, c.currentTime + 0.01);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const gain = c.createGain();
    src.connect(gain);
    gain.connect(destination);
    const end = start + buffer.duration;
    const fadeIn = overlap ? fade : 0.03;
    gain.gain.setValueAtTime(0.0008, start);
    gain.gain.exponentialRampToValueAtTime(1, start + fadeIn);
    gain.gain.setValueAtTime(1, Math.max(start + fadeIn + 0.02, end - fade));
    gain.gain.exponentialRampToValueAtTime(0.0008, end);
    src.start(start);
    src.stop(end + 0.03);
    sources.push(src);
    const nextAt = end - fade;
    const wake = (nextAt - c.currentTime) * 1000 - 180;
    timers.push(setTimeout(() => arm(nextAt, true), Math.max(0, wake)));
  }

  arm(c.currentTime + 0.02, false);
  return () => {
    alive = false;
    for (const timer of timers) clearTimeout(timer);
    for (const src of sources) {
      try { src.stop(); } catch { /* already finished */ }
    }
  };
}

function rampGain(param, value, seconds) {
  const now = ctx.currentTime;
  const from = Math.max(0.0008, param.value || 0.0008);
  const to = Math.max(0.0008, value);
  param.cancelScheduledValues(now);
  param.setValueAtTime(from, now);
  param.exponentialRampToValueAtTime(to, now + Math.max(0.02, seconds));
}

function crossfadeTo(scene, buffer) {
  if (active === scene && current) return;
  const slot = ctx.createGain();
  slot.gain.setValueAtTime(0.0008, ctx.currentTime);
  slot.connect(musicGain);
  rampGain(slot.gain, 1, SCENE_FADE);
  const stop = startLoop(buffer, slot);
  const previous = current;
  current = { scene, slot, stop };
  active = scene;
  rampGain(musicGain.gain, MUSIC_LEVEL, 0.08);
  if (previous) {
    rampGain(previous.slot.gain, 0.0008, SCENE_FADE);
    setTimeout(() => previous.stop(), SCENE_FADE * 1000 + 60);
  }
}

function beginDesired() {
  const scene = desired;
  bufferFor(scene).then((audio) => {
    if (!unlocked || !musicOn || desired !== scene) return;
    crossfadeTo(scene, audio);
  }).catch((err) => console.error(err));
}

export function duck(seconds) {
  if (!ctx || !duckGain) return;
  const now = ctx.currentTime;
  const until = now + Math.max(0.08, seconds);
  duckRelease = Math.max(duckRelease, until);
  rampGain(duckGain.gain, DUCK_LEVEL, 0.04);
  duckGain.gain.setValueAtTime(Math.max(0.0008, DUCK_LEVEL), duckRelease);
  duckGain.gain.exponentialRampToValueAtTime(1, duckRelease + 0.3);
}

function tone(freq, dur, type, peak, slide) {
  if (sfxMuted) return;
  const c = ensureGraph();
  if (!c) return;
  duck(dur + 0.05);
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(sfxGain);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function tap() {
  tone(640, 0.05, 'sine', 0.05);
}

const HORNS = {
  hoot: [540, 360],
  sharp: [760, 520],
  low: [280, 180],
  bell: [880, 660],
};
let horn = 'hoot';

export function setHorn(id) {
  if (HORNS[id]) horn = id;
}

export function hoot() {
  const pair = HORNS[horn] || HORNS.hoot;
  tone(pair[0], 0.09, 'square', 0.07, pair[0]);
  tone(pair[1], 0.16, 'square', 0.06);
}

export function cheer(combo) {
  const lift = Math.min(4, Math.max(1, combo || 1));
  tone(420 + lift * 70, 0.12, 'square', 0.07);
  tone(560 + lift * 80, 0.16, 'square', 0.06);
}

export function vroom() {
  tone(220, 0.26, 'sawtooth', 0.045, 80);
}

export function pop() {
  tone(880, 0.08, 'sine', 0.07, 1320);
}

export function coin() {
  tone(660, 0.08, 'triangle', 0.06);
  setTimeout(() => tone(880, 0.1, 'triangle', 0.06), 70);
}

export function brake() {
  tone(240, 0.06, 'square', 0.05, 180);
}

export function win() {
  duck(0.55);
  tone(523, 0.12, 'triangle', 0.06);
  setTimeout(() => tone(659, 0.12, 'triangle', 0.06), 90);
  setTimeout(() => tone(784, 0.18, 'triangle', 0.07), 180);
}

export function lose() {
  duck(0.5);
  tone(330, 0.14, 'triangle', 0.06, 180);
  setTimeout(() => tone(196, 0.22, 'triangle', 0.05), 120);
}
