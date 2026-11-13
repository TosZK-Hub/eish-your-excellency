let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = !!value;
}

export function isMuted() {
  return muted;
}

export function unlock() {
  const c = context();
  if (c && c.state === 'suspended') c.resume();
}

function context() {
  if (muted) return null;
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, peak, slide) {
  const c = context();
  if (!c) return;
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
  g.connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function tap() {
  tone(640, 0.05, 'sine', 0.05);
}

export function hoot() {
  tone(540, 0.09, 'square', 0.07, 540);
  tone(360, 0.16, 'square', 0.06);
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
  tone(523, 0.12, 'triangle', 0.06);
  setTimeout(() => tone(659, 0.12, 'triangle', 0.06), 90);
  setTimeout(() => tone(784, 0.18, 'triangle', 0.07), 180);
}
