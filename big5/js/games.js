/* Four short bush games. The lodge pet is the player. */
(function (B) {
  'use strict';

  const INK = '#3B2416';
  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let g = null;

  function viewBlank() {
    return { score: 0, time: 0, extra: 0, extraLabel: 'best', banner: '', over: false };
  }
  const view = viewBlank();

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function syncView() {
    if (!g) return;
    view.score = g.score;
    view.time = Math.max(0, g.dur - g.elapsed);
    view.over = !!g.over;
    view.banner = !g.started && !g.over ? g.banner : '';
    if (g.kind === 'dash') {
      view.extraLabel = 'stumbles';
      view.extra = g.lives;
    } else if (g.combo > 1) {
      view.extraLabel = 'combo';
      view.extra = g.combo;
    } else {
      view.extraLabel = 'best';
      view.extra = g.best;
    }
  }

  function look() {
    return B.games.look || {};
  }

  function pet(ctx, x, y, scale, extra) {
    const d = B.state.data;
    const L = look();
    B.art.drawPet(ctx, x, y, scale, Object.assign({
      species: L.species || d.animal || 'lion',
      stage: L.stage || B.stageFromLevel(d.level),
      legend: !!(L.legend || d.legendOn),
      worn: d.worn,
      t: g.t,
      eyes: 'open',
      mouth: 'grin'
    }, extra || {}));
  }

  function resultOf(reason) {
    const boost = 1 + Math.min(g.bestCombo || 0, 8) * 0.08;
    let coins = 0;
    let xp = 10;
    let title = 'Lekker';
    let body = '';
    if (g.kind === 'dash') {
      coins = Math.round(g.score * 1.4 * boost);
      xp = Math.min(28, 8 + g.score);
      title = reason === 'stumble' ? 'Ag, nice run' : 'Sharp jumping';
    } else if (g.kind === 'fruit') {
      coins = Math.max(0, Math.round((g.catches - g.thorns) * boost));
      if (g.catches > 0 && coins < 1) coins = 1;
      xp = Math.min(28, 8 + g.catches);
      title = 'Fruit for the lodge';
    } else if (g.kind === 'splash') {
      coins = Math.round(g.score * boost);
      xp = Math.min(28, 8 + g.score);
      title = 'Waterhole hero';
    } else {
      coins = Math.round(((g.perfect || 0) * 2 + (g.good || 0)) * boost);
      xp = Math.min(28, 8 + (g.perfect || 0) * 2);
      title = 'What a pounce';
      g.score = (g.perfect || 0) * 2 + (g.good || 0);
    }
    if (coins > 40) coins = 40;
    if (!g.started) coins = 0;
    const prev = (B.state.data.best && B.state.data.best[g.kind]) || 0;
    const isBest = g.score > prev;
    body = coins > 0 ? 'You pocketed ' + coins + ' coins.' : 'No coins that round, and that is fine.';
    if (isBest && g.score > 0) body += ' New best. Yoh!';
    if (g.started && xp > 0) body += ' A little experience too.';
    return {
      kind: g.kind, score: g.score, coins: coins, xp: g.started ? xp : 0,
      title: title, body: body, isBest: isBest, reason: reason
    };
  }

  function finish(reason) {
    if (!g || g.settled) return null;
    g.settled = true;
    g.over = true;
    g.banner = '';
    const result = resultOf(reason);
    syncView();
    if (typeof B.games.onFinish === 'function') B.games.onFinish(result);
    return result;
  }

  function mound(ctx, x, ground, w, h) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, ground);
    ctx.quadraticCurveTo(x, ground - h - 8, x + w / 2, ground);
    ctx.closePath();
    ctx.fillStyle = '#C4894A';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.fillStyle = '#A86A38';
    ctx.beginPath();
    ctx.ellipse(x - 4, ground - h * 0.45, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function warthog(ctx, x, ground) {
    ctx.save();
    ctx.translate(x, ground - 18);
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#8A6A52';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(22, -2, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#F4E6C8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(28, 2);
    ctx.lineTo(38, 10);
    ctx.moveTo(26, 6);
    ctx.lineTo(34, 14);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(24, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(25, -6, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function fruit(ctx, kind, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    if (kind === 'thorn') {
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(8, 12);
      ctx.lineTo(-8, 12);
      ctx.closePath();
      ctx.fillStyle = '#6B4630';
      ctx.fill();
      ctx.stroke();
    } else if (kind === 'orange') {
      ctx.fillStyle = '#F09A2A';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = '#E2B33A';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#3E8F55';
      ctx.fillRect(-2, -18, 4, 8);
    }
    ctx.restore();
  }

  function hare(ctx, x, y, t) {
    const hop = Math.abs(Math.sin(t * 10)) * 8;
    ctx.save();
    ctx.translate(x, y - hop);
    ctx.fillStyle = '#C4894A';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(14, -16, 4, 12, 0.2, 0, Math.PI * 2);
    ctx.ellipse(8, -16, 4, 12, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(10, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawDash(ctx, w, h) {
    const plate = B.art.gamePlate('play', w, h);
    if (plate) ctx.drawImage(plate, 0, 0, w, h);
    else { ctx.fillStyle = '#E7C49A'; ctx.fillRect(0, 0, w, h); }
    ctx.fillStyle = 'rgba(90, 140, 60, 0.35)';
    ctx.fillRect(0, h * 0.78, w, h);
    ctx.fillStyle = '#C9A06A';
    ctx.fillRect(0, h * 0.78, w, 8);
    const ground = h * 0.78;
    g.obs.forEach(function (o) {
      if (o.kind === 'hog') warthog(ctx, o.x, ground);
      else mound(ctx, o.x, ground, 64, 54 + Math.min(20, g.elapsed));
    });
    const jump = ground - g.y;
    const scale = clamp(h / 640, 0.42, 0.62);
    pet(ctx, g.px, g.y, scale, {
      pose: jump > 8 ? 'jump' : 'run',
      hop: 0,
      eyes: 'open',
      squash: jump < 6 && g.vy > 200 ? 0.08 : 0
    });
  }

  function updateDash(dt, w, h) {
    const ground = h * 0.78;
    g.px = Math.max(64, w * 0.3);
    if (!g.started || g.over) {
      g.y = ground;
      return;
    }
    g.elapsed += dt;
    g.vy += 1600 * dt;
    g.y += g.vy * dt;
    if (g.y > ground) {
      if (g.vy > 200 && !reduced) B.audio.land();
      g.y = ground;
      g.vy = 0;
    }
    if (g.invuln > 0) g.invuln -= dt;
    const speed = 150 + Math.min(160, g.elapsed * 7);
    g.obs.forEach(function (o) {
      o.x -= speed * dt;
      if (!o.passed && o.x < g.px - 20) {
        o.passed = true;
        g.score += 1;
        g.combo += 1;
        g.bestCombo = Math.max(g.bestCombo, g.combo);
        B.audio.coin();
      }
      const hitH = o.kind === 'hog' ? 36 : 48;
      const near = Math.abs(o.x - g.px) < 28 && (ground - g.y) < hitH && g.invuln <= 0;
      if (near && !o.hit) {
        o.hit = true;
        g.lives -= 1;
        g.invuln = 1;
        g.combo = 0;
        B.audio.hit();
        if (g.lives <= 0) finish('stumble');
      }
    });
    g.obs = g.obs.filter(function (o) { return o.x > -80; });
    const last = g.obs[g.obs.length - 1];
    if (!g.over && (!last || last.x < w - 180)) {
      g.obs.push({
        x: (last ? last.x : w) + 200 + Math.random() * 40,
        kind: Math.random() < 0.35 ? 'hog' : 'mound',
        passed: false
      });
    }
    if (!g.over && g.elapsed >= g.dur) finish('clear');
  }

  function drawFruit(ctx, w, h) {
    const plate = B.art.gamePlate('play', w, h);
    if (plate) ctx.drawImage(plate, 0, 0, w, h);
    else { ctx.fillStyle = '#E7C49A'; ctx.fillRect(0, 0, w, h); }
    ctx.fillStyle = 'rgba(90, 140, 60, 0.28)';
    ctx.fillRect(0, h - 70, w, 70);
    g.items.forEach(function (item) { fruit(ctx, item.kind, item.x, item.y); });
    const scale = clamp(h / 700, 0.4, 0.58);
    pet(ctx, g.px, h - 8, scale, { pose: 'stand', mouth: 'open' });
  }

  function updateFruit(dt, w, h) {
    const basket = ((B.state.data.upgrades && B.state.data.upgrades.basket) || 0);
    const reach = 34 + basket * 14;
    if (!g.started || g.over) return;
    g.elapsed += dt;
    g.spawn -= dt;
    if (g.spawn <= 0) {
      const roll = Math.random();
      const kind = roll < 0.18 ? 'thorn' : (roll < 0.45 ? 'orange' : 'marula');
      g.items.push({
        kind: kind,
        x: 28 + Math.random() * (w - 56),
        y: -16,
        vy: 120 + Math.min(160, g.elapsed * 6) + Math.random() * 30
      });
      g.spawn = Math.max(0.32, 0.7 - g.elapsed * 0.008);
    }
    const mouth = h - 70;
    g.items.forEach(function (item) {
      item.y += item.vy * dt;
      if (item.done) return;
      if (item.y > mouth && item.y < mouth + 36 && Math.abs(item.x - g.px) < reach) {
        item.done = true;
        if (item.kind === 'thorn') {
          g.thorns += 1;
          g.combo = 0;
          B.audio.hit();
        } else {
          g.catches += 1;
          g.combo += 1;
          g.bestCombo = Math.max(g.bestCombo, g.combo);
          B.audio.coin();
        }
        g.score = Math.max(0, g.catches - g.thorns);
      }
    });
    g.items = g.items.filter(function (item) { return !item.done && item.y < h + 20; });
    if (g.elapsed >= g.dur) finish('clear');
  }

  function drawSplash(ctx, w, h) {
    const plate = B.art.gamePlate('bath', w, h);
    if (plate) ctx.drawImage(plate, 0, 0, w, h);
    else { ctx.fillStyle = '#9FD4E8'; ctx.fillRect(0, 0, w, h); }
    g.targets.forEach(function (t) {
      ctx.beginPath();
      ctx.arc(t.x, t.y, 16 + (1 - t.life) * 10, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFF6E8';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#F0A020';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    const scale = clamp(h / 680, 0.4, 0.56);
    pet(ctx, w * 0.22, h * 0.78, scale, { spray: g.spray > 0 ? 0.8 : 0, pose: 'sit' });
  }

  function updateSplash(dt) {
    if (!g.started || g.over) return;
    g.elapsed += dt;
    if (g.spray > 0) g.spray -= dt;
    g.spawn -= dt;
    if (g.spawn <= 0) {
      g.targets.push({
        x: g.viewW * (0.35 + Math.random() * 0.55),
        y: g.viewH * (0.32 + Math.random() * 0.4),
        life: 1.15
      });
      g.spawn = Math.max(0.38, 0.85 - g.elapsed * 0.01);
    }
    g.targets.forEach(function (t) { t.life -= dt; });
    g.targets = g.targets.filter(function (t) { return t.life > 0 && !t.done; });
    if (g.elapsed >= g.dur) finish('clear');
  }

  function drawPounce(ctx, w, h) {
    const plate = B.art.gamePlate('play', w, h);
    if (plate) ctx.drawImage(plate, 0, 0, w, h);
    else { ctx.fillStyle = '#F6E2C4'; ctx.fillRect(0, 0, w, h); }
    ctx.fillStyle = '#C9A06A';
    const y = h * 0.58;
    ctx.fillRect(16, y - 18, w - 32, 36);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(16, y - 18, w - 32, 36);
    const zone = g.zone;
    ctx.fillStyle = 'rgba(240,160,32,0.85)';
    ctx.fillRect(zone.x, y - 18, zone.w, 36);
    ctx.fillStyle = 'rgba(255,224,154,0.9)';
    ctx.fillRect(zone.x + zone.w * 0.3, y - 18, zone.w * 0.4, 36);
    if (g.hare) hare(ctx, g.hare.x, y - 8, g.t);
    const scale = clamp(h / 700, 0.38, 0.52);
    pet(ctx, w * 0.18, h * 0.9, scale, {
      pose: g.pounce > 0 ? 'jump' : 'stand',
      squash: g.pounce > 0 ? 0.12 : 0,
      mouth: g.pounce > 0 ? 'open' : 'grin'
    });
  }

  function updatePounce(dt, w, h) {
    const focus = ((B.state.data.upgrades && B.state.data.upgrades.focus) || 0);
    g.zone = { x: w * 0.42, w: w * (0.18 + focus * 0.025) };
    if (!g.started || g.over) {
      if (!g.hare) g.hare = { x: -20 };
      return;
    }
    g.elapsed += dt;
    if (g.pounce > 0) g.pounce -= dt;
    const speed = 180 + Math.min(220, g.elapsed * 8);
    if (!g.hare || g.hare.x > w + 40) {
      g.hare = { x: -30, judged: false };
    }
    g.hare.x += speed * dt;
    if (g.elapsed >= g.dur) finish('clear');
  }

  function tapPounce() {
    g.started = true;
    if (!g.hare || g.hare.judged) return;
    const hx = g.hare.x;
    const z = g.zone;
    g.hare.judged = true;
    g.pounce = 0.25;
    if (hx > z.x + z.w * 0.3 && hx < z.x + z.w * 0.7) {
      g.perfect += 1;
      g.combo += 1;
      g.bestCombo = Math.max(g.bestCombo, g.combo);
      B.audio.coin();
    } else if (hx > z.x && hx < z.x + z.w) {
      g.good += 1;
      g.combo = 0;
      B.audio.blip();
    } else {
      g.combo = 0;
      B.audio.no();
    }
    g.score = g.perfect * 2 + g.good;
  }

  function boot(kind, w, h) {
    const best = (B.state.data.best && B.state.data.best[kind]) || 0;
    const base = {
      kind: kind, t: 0, elapsed: 0, started: false, over: false, settled: false,
      score: 0, best: best, combo: 0, bestCombo: 0, viewW: w, viewH: h, reason: ''
    };
    if (kind === 'dash') {
      const spring = ((B.state.data.upgrades && B.state.data.upgrades.spring) || 0);
      g = Object.assign(base, {
        dur: 52, y: h * 0.78, vy: 0, px: w * 0.3, obs: [],
        lives: 2, invuln: 0, jump: -560 - spring * 40,
        banner: 'Tap to jump'
      });
      g.obs.push({ x: w * 0.72, kind: 'mound', passed: false });
      g.obs.push({ x: w * 0.72 + 230, kind: 'hog', passed: false });
    } else if (kind === 'fruit') {
      g = Object.assign(base, {
        dur: 45, px: w / 2, items: [], spawn: 0.4, catches: 0, thorns: 0,
        banner: 'Catch fruit, dodge thorns'
      });
      g.items.push({ kind: 'marula', x: w * 0.62, y: h * 0.28, vy: 40 });
      g.items.push({ kind: 'thorn', x: w * 0.38, y: h * 0.12, vy: 40 });
    } else if (kind === 'splash') {
      g = Object.assign(base, {
        dur: 42, targets: [], spawn: 0.3, spray: 0,
        banner: 'Tap the gold ripples'
      });
      g.targets.push({ x: w * 0.62, y: h * 0.46, life: 1 });
    } else {
      g = Object.assign(base, {
        dur: 48, perfect: 0, good: 0, hare: { x: -20, judged: false }, pounce: 0,
        zone: { x: w * 0.42, w: w * 0.18 },
        banner: 'Tap when the hare is gold'
      });
      g.hare.x = w * 0.28;
    }
    syncView();
  }

  B.games = {
    view: view,
    look: null,
    onFinish: null,
    start: function (kind, w, h) { boot(kind, w, h); },
    clear: function () {
      g = null;
      const blank = viewBlank();
      Object.keys(blank).forEach(function (key) { view[key] = blank[key]; });
    },
    started: function () { return !!(g && g.started); },
    kind: function () { return g ? g.kind : null; },
    stop: function () {
      if (!g) return;
      if (!g.started) { g = null; return; }
      finish('back');
    },
    update: function (dt, w, h) {
      if (!g) return;
      g.viewW = w;
      g.viewH = h;
      g.t += dt;
      if (!g.over) {
        if (g.kind === 'dash') updateDash(dt, w, h);
        else if (g.kind === 'fruit') updateFruit(dt, w, h);
        else if (g.kind === 'splash') updateSplash(dt);
        else updatePounce(dt, w, h);
      }
      syncView();
    },
    draw: function (ctx, w, h) {
      if (!g) return;
      if (g.kind === 'dash') drawDash(ctx, w, h);
      else if (g.kind === 'fruit') drawFruit(ctx, w, h);
      else if (g.kind === 'splash') drawSplash(ctx, w, h);
      else drawPounce(ctx, w, h);
    },
    pointer: function (type, x, y) {
      if (!g || g.over) return;
      if (g.kind === 'dash') {
        if (type !== 'down') return;
        g.started = true;
        if (g.y >= g.viewH * 0.78 - 2) {
          g.vy = g.jump;
          B.audio.jump();
        }
        return;
      }
      if (g.kind === 'pounce') {
        if (type !== 'down') return;
        tapPounce();
        return;
      }
      if (g.kind === 'splash') {
        if (type !== 'down') return;
        g.started = true;
        g.spray = 0.25;
        const spray = ((B.state.data.upgrades && B.state.data.upgrades.spray) || 0);
        const rad = 36 + spray * 14;
        let hit = false;
        g.targets.forEach(function (t) {
          if (t.done) return;
          if (Math.hypot(t.x - x, t.y - y) < rad) {
            t.done = true;
            hit = true;
            g.score += 1;
            g.combo += 1;
            g.bestCombo = Math.max(g.bestCombo, g.combo);
          }
        });
        if (hit) B.audio.splash();
        else B.audio.blip();
        return;
      }
      g.px = clamp(x, 36, (g.viewW || 360) - 36);
      if (type === 'down' || type === 'move') g.started = true;
    }
  };
})(window.Big5 = window.Big5 || {});
