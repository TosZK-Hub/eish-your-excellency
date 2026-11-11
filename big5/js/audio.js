/* Short tones from the Web Audio API. No sample files. */
(function (B) {
  'use strict';

  let ctx = null;
  let noiseBuf = null;

  function context() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function unlock() {
    const c = context();
    if (c && c.state === 'suspended') c.resume();
    return c;
  }

  function muted() {
    return !!(B.state && B.state.data && B.state.data.muted);
  }

  function envGain(duration, peak, attack) {
    const c = context();
    const g = c.createGain();
    const now = c.currentTime;
    const a = attack == null ? 0.01 : attack;
    g.connect(c.destination);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), now + a);
    g.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(a + 0.02, duration));
    return g;
  }

  function tone(freq, duration, type, peak) {
    if (muted()) return;
    const c = unlock();
    if (!c) return;
    const o = c.createOscillator();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime);
    const g = envGain(duration, peak == null ? 0.07 : peak, 0.012);
    o.connect(g);
    o.start();
    o.stop(c.currentTime + duration + 0.02);
  }

  function slide(from, to, duration, type, peak) {
    if (muted()) return;
    const c = unlock();
    if (!c) return;
    const o = c.createOscillator();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(from, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(40, to), c.currentTime + duration);
    const g = envGain(duration, peak == null ? 0.06 : peak, 0.01);
    o.connect(g);
    o.start();
    o.stop(c.currentTime + duration + 0.02);
  }

  function noise(duration, peak, freq) {
    if (muted()) return;
    const c = unlock();
    if (!c) return;
    if (!noiseBuf) {
      const len = c.sampleRate * 0.4;
      noiseBuf = c.createBuffer(1, len, c.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq || 800;
    filter.Q.value = 0.7;
    const g = envGain(duration, peak == null ? 0.05 : peak, 0.005);
    src.connect(filter);
    filter.connect(g);
    src.start();
    src.stop(c.currentTime + duration + 0.02);
  }

  B.audio = {
    unlock,
    blip() { tone(620, 0.07, 'sine', 0.05); },
    coin() {
      tone(880, 0.08, 'sine', 0.06);
      setTimeout(() => tone(1320, 0.12, 'sine', 0.05), 70);
    },
    munch() { noise(0.09, 0.06, 480); },
    squeak() { tone(980, 0.05, 'triangle', 0.04); },
    splash() { noise(0.18, 0.07, 1200); },
    poo() { slide(220, 90, 0.16, 'sine', 0.06); },
    giggle() {
      [740, 880, 1040, 880].forEach((f, i) => setTimeout(() => tone(f, 0.07, 'sine', 0.045), i * 55));
    },
    jump() { slide(280, 620, 0.1, 'sine', 0.05); },
    land() { noise(0.06, 0.04, 240); },
    hit() { slide(280, 90, 0.12, 'triangle', 0.05); },
    no() { tone(180, 0.09, 'sine', 0.04); },
    chime() { tone(523, 0.1, 'sine', 0.05); setTimeout(() => tone(659, 0.14, 'sine', 0.05), 90); },
    fanfare() {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'triangle', 0.055), i * 90));
    },
    flicker() { noise(0.18, 0.03, 220); }
  };
})(window.Big5 = window.Big5 || {});
