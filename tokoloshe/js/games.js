(function (T) {
  'use strict';

  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let g = null;

  function viewBlank() {
    return { score: 0, time: 0, extra: 0, extraLabel: 'best', banner: '', over: false };
  }

  const view = viewBlank();

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function hits(cx, cy, r, x, y, w, h) {
    if (w <= 0 || h <= 0) return false;
    const nx = clamp(cx, x, x + w);
    const ny = clamp(cy, y, y + h);
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  function syncView() {
    if (!g) return;
    view.score = g.score;
    view.time = Math.max(0, g.dur - g.elapsed);
    view.over = !!g.over;
    view.banner = !g.started && !g.over ? g.banner : '';
    if (g.kind === 'taxi') {
      view.extraLabel = 'lives';
      view.extra = g.lives;
    } else if (g.combo > 1) {
      view.extraLabel = 'combo';
      view.extra = g.combo;
    } else {
      view.extraLabel = 'best';
      view.extra = g.best;
    }
  }

  function resultOf(reason) {
    const d = T.state.data;
    let coins = 0;
    let xp = 12;
    let title = 'Lekker';
    let body = '';
    const boost = 1 + Math.min(g.bestCombo || g.combo || 0, 8) * 0.1;
    if (g.kind === 'hop') {
      coins = Math.round(g.score * 2 * boost);
      xp = Math.min(36, 12 + g.score);
      if (reason === 'crash') title = 'Eish, clipped it';
      else if (reason === 'clear') title = 'Lekker landing';
      else title = 'Sharp, that is enough';
    } else if (g.kind === 'taxi') {
      coins = Math.round(g.coins * boost);
      if (g.coins === 0 && g.elapsed > 8) coins = 1;
      xp = Math.min(36, 12 + g.coins * 2);
      title = reason === 'lives' ? 'Ag, the street won' : 'Lekker dodging';
    } else if (g.kind === 'mielie') {
      const raw = Math.max(0, g.catches - g.chillies);
      coins = g.catches > 0 ? Math.max(1, Math.round(raw * boost)) : 0;
      xp = Math.min(36, 12 + g.catches);
      title = 'Potjie time';
    } else {
      coins = Math.round((g.perfect || 0) * boost) + Math.floor((g.ok || 0) * 0.5);
      xp = Math.min(36, 12 + (g.perfect || 0));
      title = 'Lekker braai';
      g.score = g.perfect || 0;
    }
    if (reason === 'back' && g.kind !== 'hop') title = 'Sharp, that is enough';
    const bestKey = g.kind;
    const prev = d.best[bestKey] || 0;
    const isBest = g.score > prev;
    if (coins > 0) body = 'You pocketed ' + coins + ' coins.';
    else body = 'No coins that round, and that is fine.';
    if (isBest && g.score > 0) body += ' New best. Yoh!';
    if (xp > 0 && g.started) body += ' A little experience too.';
    return {
      kind: g.kind,
      score: g.score,
      coins: coins,
      xp: g.started ? xp : 0,
      title: title,
      body: body,
      isBest: isBest,
      reason: reason
    };
  }

  function finish(reason) {
    if (!g || g.settled) return null;
    g.settled = true;
    g.over = true;
    g.reason = reason;
    g.banner = '';
    const result = resultOf(reason);
    syncView();
    if (typeof T.games.onFinish === 'function') T.games.onFinish(result);
    return result;
  }

  function makeGate(x, h, i) {
    const gapH = clamp(h * 0.36, 150, 188);
    const margin = 56;
    const span = Math.max(8, h - gapH - margin * 2);
    const gapY = margin + Math.random() * span;
    return {
      x: x,
      gapY: gapY,
      gapH: gapH,
      w: 96,
      kind: i % 2 ? 'power' : 'wash',
      passed: false
    };
  }

  function drawHadeda(ctx, x, y) {
    if (y < 30) return;
    T.draw.oval(ctx, x, y - 16, 12, 7, '#6e7270');
    T.draw.disc(ctx, x + 10, y - 18, 5, '#6e7270');
    ctx.strokeStyle = '#e07a3d';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 14, y - 18);
    ctx.lineTo(x + 26, y - 16);
    ctx.stroke();
    ctx.strokeStyle = '#5c534c';
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 10);
    ctx.lineTo(x - 2, y);
    ctx.moveTo(x + 4, y - 10);
    ctx.lineTo(x + 4, y);
    ctx.stroke();
  }

  function drawGate(ctx, o, h) {
    const x = o.x;
    const gw = o.w;
    ctx.lineCap = 'round';
    if (o.kind === 'wash') {
      ctx.strokeStyle = '#8d6a4a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, o.gapY);
      ctx.lineTo(x + gw, o.gapY);
      ctx.moveTo(x, o.gapY + o.gapH);
      ctx.lineTo(x + gw, o.gapY + o.gapH);
      ctx.stroke();
      const lineY = Math.max(18, o.gapY - 58);
      if (o.gapY - lineY > 16) {
        ctx.beginPath();
        ctx.moveTo(x + 4, lineY);
        ctx.lineTo(x + gw - 4, lineY);
        ctx.stroke();
        const colors = ['#e07a3d', '#f4efe6', '#2a6f7f', '#e6b341'];
        for (let i = 0; i < 3; i++) {
          const cx = x + 10 + i * 18;
          const ch = Math.min(40, o.gapY - lineY - 4);
          if (ch > 8) T.draw.box(ctx, cx, lineY, 14, ch, 3, colors[i]);
        }
      }
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 8, 0);
      ctx.lineTo(x + 8, Math.max(0, o.gapY));
      ctx.moveTo(x + gw - 8, o.gapY + o.gapH);
      ctx.lineTo(x + gw - 8, h);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#2c3338';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, o.gapY);
      ctx.lineTo(x + gw, o.gapY);
      ctx.moveTo(x, o.gapY + o.gapH);
      ctx.lineTo(x + gw, o.gapY + o.gapH);
      ctx.stroke();
      T.draw.disc(ctx, x + 8, o.gapY, 4, '#d7dde0');
      T.draw.disc(ctx, x + gw - 8, o.gapY, 4, '#d7dde0');
      T.draw.disc(ctx, x + gw / 2, o.gapY + o.gapH, 4, '#d7dde0');
      drawHadeda(ctx, x + gw * 0.45, o.gapY);
    }
  }

  function drawHop(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#8ec7ea');
    sky.addColorStop(1, '#d9f3c4');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    const drift = (g.elapsed * 18) % (w + 80);
    ctx.beginPath();
    ctx.ellipse(40 - drift * 0.2, 36, 28, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.7 - drift * 0.15, 58, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8fbf72';
    ctx.beginPath();
    ctx.ellipse(w * 0.2, h + 28, w * 0.4, 36, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.85, h + 34, w * 0.36, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    g.obs.forEach((o) => drawGate(ctx, o, h));
    const scale = clamp(h / 700, 0.48, 0.66);
    const flap = g.vy < 0;
    const anim = T.makeAnim(g.t, {
      worn: T.state.data.worn,
      sprite: 'happy',
      pose: 'stand',
      eyes: g.over && g.reason === 'crash' ? 'open' : 'happy',
      mouth: g.over && g.reason === 'crash' ? 'oh' : 'grin',
      armL: flap ? -2.4 : 2.1,
      armR: flap ? -0.6 : 1.0,
      blush: 0.55,
      lean: clamp(-g.vy / 900, -0.35, 0.4)
    });
    T.draw.pet(ctx, g.px, g.y + 198 * scale * 0.46, scale, anim);
    if (g.near > 0) {
      ctx.fillStyle = '#d4652f';
      ctx.font = '800 16px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Close!', g.px, g.y - 36);
    }
  }

  function drawBraai(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#f8e2cf');
    sky.addColorStop(1, '#e7b184');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const gy = h * 0.58;
    T.draw.box(ctx, 20, gy, w - 40, 22, 6, '#3a3330');
    T.draw.box(ctx, 28, gy + 26, w - 56, 10, 3, '#f0a040');
    ctx.strokeStyle = 'rgba(255,244,210,.95)';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.42, gy - 18, w * 0.16, 28);
    (g.bits || []).forEach((bit) => {
      if (bit.done) return;
      T.draw.box(ctx, bit.x - 18, gy - 8, 36, 14, 6, '#c46a45');
      T.draw.box(ctx, bit.x - 14, gy - 5, 28, 4, 2, '#8a4030');
    });
    if (g.near > 0) {
      ctx.fillStyle = '#d4652f';
      ctx.font = '800 16px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Close!', w * 0.5, gy - 36);
    }
  }

  function updateBraai(dt, w) {
    if (!g.started || g.over) return;
    g.elapsed += dt;
    if (g.near > 0) g.near -= dt;
    const speed = 80 + Math.min(160, g.elapsed * 5 + (g.perfect || 0) * 2);
    g.spawn -= dt;
    if (g.spawn <= 0) {
      g.bits.push({ x: -24, done: false });
      g.spawn = Math.max(0.42, 0.95 - g.elapsed * 0.01);
    }
    g.bits.forEach((bit) => {
      if (!bit.done) bit.x += speed * dt;
    });
    g.bits = g.bits.filter((bit) => !bit.done && bit.x < w + 30);
    if (g.elapsed >= g.dur) finish('clear');
  }

  function tapBraai(w) {
    g.started = true;
    let best = null;
    let bestD = 999;
    (g.bits || []).forEach((bit) => {
      if (bit.done) return;
      const d = Math.abs(bit.x - w * 0.5);
      if (d < bestD) {
        best = bit;
        bestD = d;
      }
    });
    if (!best || bestD > w * 0.22) return;
    best.done = true;
    if (bestD < w * 0.07) {
      g.perfect += 1;
      g.combo += 1;
      g.bestCombo = Math.max(g.bestCombo, g.combo);
      T.audio.coin();
    } else {
      g.ok += 1;
      g.near = 0.35;
      g.combo = 0;
      T.audio.blip();
    }
    g.score = g.perfect;
  }

  function updateHop(dt, w, h) {
    g.px = Math.max(72, w * 0.28);
    if (!g.started || g.over) {
      g.y = h * 0.46 + Math.sin(g.t * 2) * 6;
      return;
    }
    g.elapsed += dt;
    g.vy += 860 * dt;
    g.vy = Math.min(g.vy, 540);
    g.y += g.vy * dt;
    const scale = clamp(h / 700, 0.48, 0.66);
    const top = 24 + 88 * scale;
    const bot = h - 28;
    if (g.invuln > 0) g.invuln -= dt;
    if (g.near > 0) g.near -= dt;
    if (g.y < top) {
      g.y = top;
      g.vy = 20;
    }
    if (g.y > bot) {
      g.y = bot;
      finish('crash');
      return;
    }
    const speed = 118 + Math.min(70, g.score * 4);
    g.obs.forEach((o) => {
      if (g.over) return;
      o.x -= speed * dt;
      if (!o.passed && o.x + o.w < g.px - 8) {
        o.passed = true;
        g.score += 1;
        g.combo = (g.combo || 0) + 1;
        g.bestCombo = Math.max(g.bestCombo || 0, g.combo);
        T.audio.coin();
      }
      const r = 12;
      const inset = 14;
      const hitTop = hits(g.px, g.y, r, o.x + inset, 0, o.w - inset * 2, o.gapY - 6);
      const hitBot = hits(g.px, g.y, r, o.x + inset, o.gapY + o.gapH + 6, o.w - inset * 2, h);
      if ((hitTop || hitBot) && g.invuln <= 0) {
        if (g.shieldLeft > 0) {
          g.shieldLeft -= 1;
          g.invuln = 0.9;
          g.shake = 0.25;
          g.combo = 0;
          T.audio.hit();
        } else {
          g.shake = 0.35;
          g.combo = 0;
          finish('crash');
        }
      } else if (!o.grazed && o.x < g.px && o.x + o.w > g.px) {
        const edge = Math.min(Math.abs(g.y - o.gapY), Math.abs(g.y - (o.gapY + o.gapH)));
        if (edge < 28) {
          o.grazed = true;
          g.combo += 1;
          g.bestCombo = Math.max(g.bestCombo, g.combo);
          g.near = 0.4;
        }
      }
    });
    if (g.over) return;
    if (g.obs.length && g.obs[0].x < -120) g.obs.shift();
    const last = g.obs[g.obs.length - 1];
    if (!last || last.x < w - 250) {
      g.obs.push(makeGate((last ? last.x : w) + 270, h, g.obs.length));
    }
    if (g.elapsed >= g.dur) finish('clear');
  }

  function drawStreet(ctx, w, h) {
    ctx.fillStyle = '#e7d3b4';
    ctx.fillRect(0, 0, w, h);
    T.draw.box(ctx, 18, 0, w - 36, h, 0, '#4c5258');
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 18]);
    ctx.beginPath();
    ctx.moveTo(w / 2, (g.scroll || 0) % 34);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#d7e6c8';
    ctx.fillRect(0, 0, w, 26);
    ctx.fillStyle = '#c47a4a';
    ctx.fillRect(8, 8, 28, 12);
    ctx.fillStyle = '#e6b341';
    ctx.fillRect(w - 40, 6, 28, 14);
  }

  function drawTaxiGame(ctx, w, h) {
    drawStreet(ctx, w, h);
    g.ents.forEach((ent) => {
      if (ent.kind === 'taxi') T.draw.taxi(ctx, ent.x, ent.y);
      else if (ent.kind === 'goat') T.draw.goat(ctx, ent.x, ent.y);
      else T.draw.treat(ctx, 'coin', ent.x, ent.y, g.t * 5);
    });
    const scale = clamp(h / 760, 0.42, 0.64);
    const anim = T.makeAnim(g.t, {
      worn: T.state.data.worn,
      sprite: 'happy',
      pose: 'run',
      leg: g.t * 10,
      eyes: g.invuln > 0 ? 'open' : 'happy',
      mouth: 'grin',
      lean: 0.06,
      alpha: g.invuln > 0 && Math.sin(g.t * 28) > 0 ? 0.45 : 1,
      dirt: 0
    });
    const feet = h - 16;
    T.draw.pet(ctx, g.px, feet, scale, anim);
  }

  function spawnTaxi(w) {
    const roll = Math.random();
    const kind = roll < 0.42 ? 'coin' : (roll < 0.7 ? 'goat' : 'taxi');
    let x = 46 + Math.random() * (w - 92);
    if (g.lastX && Math.abs(x - g.lastX) < 54) x = clamp(x + (x < w / 2 ? 80 : -80), 46, w - 46);
    g.lastX = x;
    const size = kind === 'taxi' ? { w: 52, h: 64 } : kind === 'goat' ? { w: 36, h: 40 } : { w: 22, h: 22 };
    g.ents.push({
      kind: kind,
      x: x,
      y: -40,
      vy: (kind === 'goat' ? 150 : kind === 'coin' ? 170 : 200 + Math.random() * 40) + Math.min(120, (g.elapsed || 0) * 6),
      hw: size.w,
      hh: size.h
    });
  }

  function updateTaxi(dt, w, h) {
    const scale = clamp(h / 760, 0.42, 0.64);
    const feet = h - 16;
    const bodyY = feet - 48 * scale;
    g.px = clamp(g.px, 48, w - 48);
    if (!g.started || g.over) return;
    g.elapsed += dt;
    g.scroll = (g.scroll || 0) + dt * 180;
    g.spawn -= dt;
    if (g.spawn <= 0) {
      spawnTaxi(w);
      g.spawn = 0.72;
    }
    g.ents.forEach((ent) => { ent.y += ent.vy * dt; });
    g.ents = g.ents.filter((ent) => ent.y < h + 60);
    if (g.invuln > 0) g.invuln -= dt;
    const magnet = (T.state.data.upgrades && T.state.data.upgrades.magnet) || 0;
    g.ents.forEach((ent) => {
      if (g.over || ent.y > h + 40) return;
      if (magnet && ent.kind === 'coin' && Math.abs(ent.x - g.px) < 30 + magnet * 34 && ent.y > h * 0.3) {
        ent.x += (g.px - ent.x) * Math.min(1, dt * (1.5 + magnet));
      }
      const hit = Math.abs(ent.x - g.px) < (ent.hw + 28 * scale) * 0.45 &&
        Math.abs(ent.y - bodyY) < (ent.hh + 36 * scale) * 0.42;
      if (!hit) return;
      if (ent.kind === 'coin') {
        ent.y = h + 80;
        g.coins += 1;
        g.combo = (g.combo || 0) + 1;
        g.bestCombo = Math.max(g.bestCombo || 0, g.combo);
        g.score = g.coins * 10 + Math.floor(g.elapsed);
        T.audio.coin();
        return;
      }
      if (g.invuln > 0) return;
      ent.y = h + 80;
      g.lives -= 1;
      g.invuln = 1.15;
      g.shake = 0.3;
      T.audio.hit();
      if (g.lives <= 0) finish('lives');
    });
    if (g.over) return;
    g.score = g.coins * 10 + Math.floor(g.elapsed);
    if (g.elapsed >= g.dur) finish('clear');
  }

  function drawMielie(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#f6e2cf');
    sky.addColorStop(0.45, '#f3d5b5');
    sky.addColorStop(1, '#d7e6c8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#b7d7a8';
    ctx.fillRect(0, h - 70, w, 70);
    g.items.forEach((item) => T.draw.treat(ctx, item.kind, item.x, item.y, item.rot));
    const bob = g.shake > 0 && !reduced ? Math.sin(g.t * 40) * 3 : 0;
    T.draw.potjie(ctx, g.px + bob, h - 40);
  }

  function updateMielie(dt, w, h) {
    g.px = clamp(g.px, 48, w - 48);
    if (!g.started || g.over) return;
    g.elapsed += dt;
    g.spawn -= dt;
    if (g.spawn <= 0) {
      const kinds = ['mielie', 'mielie', 'orange', 'vetkoek', 'chilli'];
      g.items.push({
        kind: kinds[Math.floor(Math.random() * kinds.length)],
        x: 30 + Math.random() * (w - 60),
        y: -16,
        vy: 150 + Math.random() * 70,
        rot: Math.random() * 3
      });
      g.spawn = Math.max(0.32, 0.55 - g.elapsed * 0.006);
    }
    const mouth = h - 48;
    g.items.forEach((item) => {
      item.y += item.vy * dt;
      item.rot += dt * 2;
      if (item.done) return;
      if (item.y > mouth && item.y < mouth + 26 && Math.abs(item.x - g.px) < 36) {
        item.done = true;
        if (item.kind === 'chilli') {
          g.chillies += 1;
          g.shake = 0.28;
          T.audio.hit();
        } else {
          g.catches += 1;
          T.audio.coin();
        }
        g.score = Math.max(0, g.catches - g.chillies);
      }
    });
    g.items = g.items.filter((item) => !item.done && item.y < h + 20);
    if (g.elapsed >= g.dur) finish('clear');
  }

  function boot(kind, w, h) {
    const best = (T.state.data.best && T.state.data.best[kind]) || 0;
    if (kind === 'hop') {
      g = {
        kind: 'hop', t: 0, elapsed: 0, dur: 48, started: false, over: false, settled: false,
        score: 0, y: h * 0.46, vy: 0, px: w * 0.28, obs: [], best: best, shake: 0,
        combo: 0, bestCombo: 0, shieldLeft: (T.state.data.upgrades && T.state.data.upgrades.shield) || 0, invuln: 0, near: 0,
        banner: 'Tap to flap', reason: ''
      };
      let x = Math.round(w * 0.72);
      for (let i = 0; i < 4; i++) {
        const gate = makeGate(x, h, i);
        if (i === 0) gate.gapY = Math.max(70, h * 0.42 - gate.gapH * 0.5);
        g.obs.push(gate);
        x += 280;
      }
    } else if (kind === 'taxi') {
      g = {
        kind: 'taxi', t: 0, elapsed: 0, dur: 42, started: false, over: false, settled: false,
        score: 0, coins: 0, lives: 3 + ((T.state.data.upgrades && T.state.data.upgrades.heart) || 0), px: w / 2, ents: [], spawn: 0.4, best: best,
        combo: 0, bestCombo: 0,
        shake: 0, invuln: 0, banner: 'Drag left and right', scroll: 0, lastX: w / 2, reason: ''
      };
    } else if (kind === 'braai') {
      g = {
        kind: 'braai', t: 0, elapsed: 0, dur: 45, started: false, over: false, settled: false,
        score: 0, perfect: 0, ok: 0, px: w / 2, bits: [], spawn: 0.4, best: best,
        combo: 0, bestCombo: 0, near: 0, shake: 0, banner: 'Tap in the glow', reason: ''
      };
    } else {
      g = {
        kind: 'mielie', t: 0, elapsed: 0, dur: 40, started: false, over: false, settled: false,
        score: 0, catches: 0, chillies: 0, px: w / 2, items: [], spawn: 0.35, best: best,
        combo: 0, bestCombo: 0,
        shake: 0, banner: 'Catch the snacks', reason: ''
      };
    }
    syncView();
  }

  T.games = {
    view: view,
    onFinish: null,
    start: function (kind, w, h) {
      boot(kind, w, h);
    },
    clear: function () {
      g = null;
      const blank = viewBlank();
      Object.keys(blank).forEach((key) => { view[key] = blank[key]; });
    },
    started: function () { return !!(g && g.started); },
    kind: function () { return g ? g.kind : null; },
    stop: function () {
      if (!g) return;
      if (!g.started) {
        g = null;
        return;
      }
      finish('back');
    },
    update: function (dt, w, h) {
      if (!g) return;
      g.viewW = w;
      g.t += dt;
      if (g.shake > 0) g.shake = Math.max(0, g.shake - dt);
      if (!g.over) {
        if (g.kind === 'hop') updateHop(dt, w, h);
        else if (g.kind === 'taxi') updateTaxi(dt, w, h);
        else if (g.kind === 'braai') updateBraai(dt, w);
        else updateMielie(dt, w, h);
      }
      syncView();
    },
    draw: function (ctx, w, h) {
      if (!g) return;
      ctx.save();
      if (g.shake > 0 && !reduced) ctx.translate(Math.sin(g.t * 42) * g.shake * 8, 0);
      if (g.kind === 'hop') drawHop(ctx, w, h);
      else if (g.kind === 'taxi') drawTaxiGame(ctx, w, h);
      else if (g.kind === 'braai') drawBraai(ctx, w, h);
      else drawMielie(ctx, w, h);
      ctx.restore();
    },
    pointer: function (type, x) {
      if (!g || g.over) return;
      if (g.kind === 'hop') {
        if (type !== 'down') return;
        g.started = true;
        g.vy = -340;
        T.audio.flap();
        return;
      }
      if (g.kind === 'braai') {
        if (type !== 'down') return;
        tapBraai(g.viewW || 360);
        return;
      }
      g.px = x;
      if (type === 'down' || type === 'move') g.started = true;
    }
  };
})(window.Toko = window.Toko || {});
