// Original synthesis only. No samples. The hadeda call is a three-note
// nasal honk — short, short, longer and falling — the "ha-de-dah" contour.

export function createAudio() {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let comp = null;
  let noiseBuf = null;
  let muted = false;
  let musicOn = false;
  let nextNote = 0;
  let step = 0;
  let unlocked = false;

  function ensure() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 10;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;
    master = ctx.createGain();
    master.gain.value = 0.9;
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.16;
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.85;
    const musicLP = ctx.createBiquadFilter();
    musicLP.type = "lowpass";
    musicLP.frequency.value = 2200;
    musicLP.Q.value = 0.4;
    musicGain.connect(musicLP);
    musicLP.connect(master);
    sfxGain.connect(master);
    master.connect(comp);
    comp.connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 0.4);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return true;
  }

  function unlock() {
    if (!ensure()) return false;
    const was = unlocked;
    if (ctx.state === "suspended") ctx.resume();
    unlocked = true;
    return !was;
  }

  function setMuted(flag) {
    muted = !!flag;
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(muted ? 0 : 0.9, t, 0.03);
  }

  function envGain(time, peak, dur) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    return g;
  }

  function noise(time, dur) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.start(time);
    src.stop(time + dur + 0.02);
    return src;
  }

  function flap() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const src = noise(t, 0.09);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1400, t);
    bp.frequency.exponentialRampToValueAtTime(500, t + 0.08);
    bp.Q.value = 0.7;
    const g = envGain(t, 0.22, 0.09);
    src.connect(bp);
    bp.connect(g);
    g.connect(sfxGain);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(240, t);
    o.frequency.exponentialRampToValueAtTime(90, t + 0.08);
    const g2 = envGain(t, 0.1, 0.08);
    o.connect(g2);
    g2.connect(sfxGain);
    o.start(t);
    o.stop(t + 0.1);
  }

  function coin() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = envGain(t + i * 0.04, 0.16, 0.18);
      o.connect(g);
      g.connect(sfxGain);
      o.start(t + i * 0.04);
      o.stop(t + 0.24);
    });
  }

  function score() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    [523.25, 659.25].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = envGain(t + i * 0.03, 0.07, 0.22);
      o.connect(g);
      g.connect(sfxGain);
      o.start(t + i * 0.03);
      o.stop(t + 0.28);
    });
  }

  function hit() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const src = noise(t, 0.28);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.exponentialRampToValueAtTime(120, t + 0.25);
    const g = envGain(t, 0.4, 0.3);
    src.connect(lp);
    lp.connect(g);
    g.connect(sfxGain);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.28);
    const g2 = envGain(t, 0.3, 0.3);
    o.connect(g2);
    g2.connect(sfxGain);
    o.start(t);
    o.stop(t + 0.32);
  }

  function honk(time, freq, dur, peak) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 0.7), time + dur);
    const sub = ctx.createOscillator();
    sub.type = "square";
    sub.frequency.setValueAtTime(freq * 0.5, time);
    sub.frequency.exponentialRampToValueAtTime(Math.max(50, freq * 0.34), time + dur);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1500, time);
    bp.frequency.exponentialRampToValueAtTime(880, time + dur);
    bp.Q.value = 6;
    const peakF = ctx.createBiquadFilter();
    peakF.type = "peaking";
    peakF.frequency.value = 2500;
    peakF.Q.value = 2.2;
    peakF.gain.value = 7;
    const trem = ctx.createGain();
    trem.gain.value = 0.65;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 32;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0.28;
    lfo.connect(lfoG);
    lfoG.connect(trem.gain);
    const g = envGain(time, peak, dur);
    const src = noise(time, dur);
    const nbp = ctx.createBiquadFilter();
    nbp.type = "bandpass";
    nbp.frequency.value = 1700;
    nbp.Q.value = 1.1;
    const ng = envGain(time, peak * 0.28, dur);
    osc.connect(bp);
    sub.connect(bp);
    bp.connect(peakF);
    peakF.connect(trem);
    trem.connect(g);
    g.connect(sfxGain);
    src.connect(nbp);
    nbp.connect(ng);
    ng.connect(sfxGain);
    osc.start(time);
    sub.start(time);
    lfo.start(time);
    osc.stop(time + dur + 0.02);
    sub.stop(time + dur + 0.02);
    lfo.stop(time + dur + 0.02);
  }

  function squawk() {
    if (!ctx || muted) return;
    const t = ctx.currentTime + 0.01;
    musicGain.gain.setTargetAtTime(0.04, t, 0.04);
    musicGain.gain.setTargetAtTime(muted ? 0 : 0.16, t + 0.85, 0.25);
    honk(t, 620, 0.15, 0.28);
    honk(t + 0.2, 690, 0.13, 0.26);
    honk(t + 0.38, 540, 0.46, 0.32);
  }

  const PENT = [0, 2, 4, 7, 9, 12, 14];
  function noteFreq(degree, root) {
    const semi = PENT[((degree % PENT.length) + PENT.length) % PENT.length];
    const oct = Math.floor(degree / PENT.length);
    return root * Math.pow(2, (semi + oct * 12) / 12);
  }

  // Sparse marimba-like loop. Original, not a quotation.
  const PATTERN = [
    [0, 4],
    null,
    [2],
    null,
    [4],
    null,
    [1, 3],
    null,
    [0],
    [2],
    null,
    [4],
    null,
    [3],
    [0],
    null,
  ];

  function pluck(time, freq, peak, dur) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = "triangle";
    o2.frequency.value = freq * 2.01;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq * 4;
    bp.Q.value = 1.4;
    const g = envGain(time, peak, dur);
    const g2 = envGain(time, peak * 0.18, dur * 0.6);
    o.connect(bp);
    bp.connect(g);
    g.connect(musicGain);
    o2.connect(g2);
    g2.connect(musicGain);
    o.start(time);
    o2.start(time);
    o.stop(time + dur + 0.02);
    o2.stop(time + dur + 0.02);
  }

  function tickMusic() {
    if (!ctx || !musicOn || muted) return;
    const now = ctx.currentTime;
    if (nextNote < now - 0.05) nextNote = now + 0.02;
    const stepDur = 0.46;
    while (nextNote < now + 0.35) {
      const slot = PATTERN[step % PATTERN.length];
      if (slot) {
        for (const d of slot) pluck(nextNote, noteFreq(d, 293.66), 0.045, 0.42);
      }
      if (step % 8 === 0) pluck(nextNote, 146.83, 0.05, 0.7);
      step = (step + 1) % PATTERN.length;
      nextNote += stepDur;
    }
  }

  function startMusic() {
    musicOn = true;
    if (!ctx) return;
    nextNote = ctx.currentTime + 0.05;
  }

  function stopMusic() {
    musicOn = false;
  }

  return {
    unlock,
    setMuted,
    flap,
    coin,
    score,
    hit,
    squawk,
    startMusic,
    stopMusic,
    tickMusic,
    get unlocked() {
      return unlocked;
    },
  };
}
