/* Lodge rooms. Same ink, flat shapes, and light as the pet. */
(function (B) {
  'use strict';

  const INK = '#3A271C';

  function ell(ctx, x, y, rx, ry, fill, stroke) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function box(ctx, x, y, w, h, r, fill, stroke) {
    roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  }

  function sky(ctx, w, h, top, bot) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top);
    g.addColorStop(1, bot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function sun(ctx, x, y, r) {
    ctx.fillStyle = 'rgba(240,160,32,0.18)';
    ctx.beginPath();
    ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ell(ctx, x, y, r, r, '#FFE09A', true);
  }

  function acacia(ctx, x, y, s) {
    ctx.fillStyle = '#6B4630';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.06, y);
    ctx.lineTo(x - s * 0.1, y - s * 0.55);
    ctx.lineTo(x + s * 0.1, y - s * 0.55);
    ctx.lineTo(x + s * 0.06, y);
    ctx.fill();
    ctx.stroke();
    ell(ctx, x, y - s * 0.72, s * 0.62, s * 0.2, '#3E8F55', true);
    ell(ctx, x - s * 0.36, y - s * 0.58, s * 0.34, s * 0.14, '#4E9A52', true);
    ell(ctx, x + s * 0.34, y - s * 0.56, s * 0.32, s * 0.13, '#2F7A40', true);
  }

  function hill(ctx, w, y, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, y + h);
    ctx.quadraticCurveTo(w * 0.25, y - 10, w * 0.5, y + 16);
    ctx.quadraticCurveTo(w * 0.75, y + 40, w, y);
    ctx.lineTo(w, y + h + 40);
    ctx.lineTo(0, y + h + 40);
    ctx.fill();
  }

  function hadeda(ctx, x, y, t) {
    const wing = Math.sin(t * 5) * 6;
    ell(ctx, x, y, 16, 8, '#6E7270', true);
    ell(ctx, x + 12, y - 2, 6, 5, '#5C534C', true);
    ctx.strokeStyle = '#E07A3C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 2);
    ctx.lineTo(x + 28, y);
    ctx.stroke();
    ctx.strokeStyle = '#5C534C';
    ctx.beginPath();
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x - 18, y - 8 - wing);
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 14, y - 10 + wing);
    ctx.stroke();
  }

  function kettle(ctx, x, y) {
    ell(ctx, x, y, 16, 12, '#C4C8CC', true);
    ell(ctx, x - 2, y - 2, 8, 5, '#E6E8EA', false);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 14, y - 2);
    ctx.quadraticCurveTo(x + 26, y - 8, x + 22, y + 6);
    ctx.moveTo(x - 4, y - 12);
    ctx.lineTo(x + 8, y - 12);
    ctx.stroke();
  }

  function poo(ctx, x, y) {
    ell(ctx, x, y, 14, 8, '#A07248', true);
    ell(ctx, x - 6, y - 7, 8, 6, '#B88858', true);
    ell(ctx, x + 6, y - 6, 7, 5, '#C49868', true);
    ell(ctx, x - 4, y - 9, 3, 2, '#E2C49A', false);
  }

  function placePet(ctx, w, h, env, feetX, feetY, sit) {
    const anim = Object.assign({}, env.anim, { pose: sit ? 'sit' : (env.anim.pose || 'stand') });
    const scale = Math.min(w / 360, h / 460) * (env.lineup ? 1 : 1);
    B.art.drawPet(ctx, feetX, feetY, Math.max(0.55, scale), anim);
    const a = B.art.anchors;
    if (!env.hotspots || env.lineup) return;
    const head = a.head || { x: feetX, y: feetY - 80 };
    env.hotspots.push({
      id: 'pet',
      x: head.x - 70,
      y: head.y - 70,
      w: 150,
      h: feetY - head.y + 90
    });
  }

  function kitchen(ctx, w, h, env) {
    ctx.fillStyle = '#F6E2C4';
    ctx.fillRect(0, 0, w, h);
    box(ctx, 0, 0, w, 18, 0, '#E7C49A', false);
    const winX = w * 0.58;
    const winY = h * 0.08;
    const winW = Math.min(150, w * 0.36);
    const winH = h * 0.28;
    box(ctx, winX, winY, winW, winH, 12, '#8EC7EA', true);
    ctx.save();
    roundRect(ctx, winX + 6, winY + 6, winW - 12, winH - 12, 8);
    ctx.clip();
    ctx.fillStyle = '#F6D48A';
    ctx.fillRect(winX, winY + winH * 0.55, winW, winH);
    acacia(ctx, winX + winW * 0.5, winY + winH * 0.72, winW * 0.7);
    ctx.restore();
    const counterY = h * 0.58;
    box(ctx, 0, counterY, w, h * 0.16, 0, '#C4894A', true);
    box(ctx, 0, counterY, w, 10, 0, '#E7B56A', false);
    ctx.fillStyle = '#E7C9A0';
    ctx.fillRect(0, h * 0.78, w, h);
    if (env.decor && env.decor.kettle) kettle(ctx, w * 0.22, counterY + 8);
    if (env.decor && env.decor.acacia) acacia(ctx, w * 0.84, counterY + 18, 70);
    if (env.decor && env.decor.hadeda) hadeda(ctx, w * 0.12, h * 0.2, env.t);
    placePet(ctx, w, h, env, w * 0.5, h * 0.9, false);
    (env.poos || []).forEach(function (slot) {
      const x = w * (slot === 0 ? 0.22 : 0.78);
      const y = h * 0.9;
      poo(ctx, x, y);
      if (env.hotspots) env.hotspots.push({ id: 'poo-' + slot, slot: slot, x: x - 20, y: y - 20, w: 40, h: 28 });
    });
  }

  function bath(ctx, w, h, env) {
    sky(ctx, w, h, '#9FD4E8', '#E7F4C8');
    sun(ctx, w * 0.78, h * 0.16, 22);
    hill(ctx, w, h * 0.42, 40, '#C9D98A');
    acacia(ctx, w * 0.18, h * 0.48, 80);
    ctx.fillStyle = '#2E9A90';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.72, w * 0.62, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(w * 0.38, h * 0.66, w * 0.16, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2F6A38';
    ctx.lineWidth = 3;
    [0.08, 0.14, 0.86, 0.92].forEach(function (px, i) {
      ctx.beginPath();
      ctx.moveTo(w * px, h * 0.58);
      ctx.quadraticCurveTo(w * px + (i % 2 ? 8 : -8), h * 0.48, w * px, h * 0.4);
      ctx.stroke();
    });
    ctx.fillStyle = '#E7C49A';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.86);
    ctx.quadraticCurveTo(w * 0.5, h * 0.78, w, h * 0.88);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    placePet(ctx, w, h, env, w * 0.5, h * 0.74, true);
    const hx = w * 0.82;
    const hy = h * 0.42;
    if (env.marks) env.marks.shower = { x: hx, y: hy };
    if (env.hotspots) env.hotspots.push({ id: 'shower', x: hx - 24, y: hy - 16, w: 48, h: 36 });
    (env.poos || []).forEach(function (slot) {
      const x = w * (slot === 0 ? 0.2 : 0.8);
      const y = h * 0.9;
      poo(ctx, x, y);
      if (env.hotspots) env.hotspots.push({ id: 'poo-' + slot, slot: slot, x: x - 20, y: y - 18, w: 40, h: 28 });
    });
  }

  function boma(ctx, w, h, env) {
    const dark = env.shedding > 0;
    ctx.fillStyle = dark ? '#2C241C' : '#F0D2B4';
    ctx.fillRect(0, 0, w, h);
    if (!dark) {
      sky(ctx, w, h * 0.34, '#F6C48A', '#F0D2B4');
    }
    ctx.fillStyle = dark ? '#4A3428' : '#C4894A';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (w / 7) - 10, 28);
      ctx.lineTo(i * (w / 7) + w / 14, 4);
      ctx.lineTo((i + 1) * (w / 7), 28);
      ctx.fill();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 26, w, 4);
    const bedY = h * 0.62;
    box(ctx, w * 0.18, bedY, w * 0.64, h * 0.16, 18, '#C45A3A', true);
    box(ctx, w * 0.28, bedY - 16, w * 0.22, 28, 10, '#FFF6E8', true);
    if (!dark || (env.decor && env.decor.lantern)) {
      const lx = w * 0.8;
      const ly = h * 0.28;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lx, ly - 16);
      ctx.lineTo(lx, ly);
      ctx.stroke();
      box(ctx, lx - 12, ly, 24, 28, 6, env.lampOn && !dark ? '#FFE09A' : '#8A6A52', true);
      if (env.hotspots) env.hotspots.push({ id: 'lamp', x: lx - 20, y: ly - 20, w: 48, h: 56 });
    }
    box(ctx, w * 0.08, h * 0.36, 36, 28, 6, '#6B4630', true);
    ctx.fillStyle = dark ? '#F0A020' : '#3A271C';
    ctx.fillRect(w * 0.08 + 8, h * 0.36 + 8, 8, 12);
    if (env.hotspots) env.hotspots.push({ id: 'power', x: w * 0.06, y: h * 0.34, w: 44, h: 36 });
    if (env.decor && env.decor.hadeda && !dark) hadeda(ctx, w * 0.3, 48, env.t);
    if (dark) {
      ctx.fillStyle = 'rgba(20,14,10,0.55)';
      ctx.fillRect(0, 0, w, h);
    }
    placePet(ctx, w, h, env, w * 0.48, h * 0.78, true);
    if (dark) {
      const head = B.art.anchors.head || { x: w * 0.5, y: h * 0.4 };
      const glow = ctx.createRadialGradient(head.x, head.y, 10, head.x, head.y, 160);
      glow.addColorStop(0, 'rgba(240,160,32,0.4)');
      glow.addColorStop(1, 'rgba(240,160,32,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function savanna(ctx, w, h, env) {
    const drift = env.reduced ? 0 : Math.sin((env.t || 0) * 0.25) * 8;
    sky(ctx, w, h, '#8EC7EA', '#F6E2A8');
    sun(ctx, w * 0.78 + drift * 0.2, h * 0.16, 26);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ell(ctx, w * 0.2 + drift, h * 0.18, 28, 10, 'rgba(255,255,255,0.85)', false);
    hill(ctx, w, h * 0.48, 30, '#E7D39A');
    acacia(ctx, w * 0.16 + drift * 0.3, h * 0.62, 110);
    acacia(ctx, w * 0.86 - drift * 0.3, h * 0.58, 90);
    ctx.fillStyle = '#C9D98A';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.quadraticCurveTo(w * 0.5, h * 0.66, w, h * 0.74);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.fillStyle = '#8FBF72';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.84);
    ctx.quadraticCurveTo(w * 0.4, h * 0.78, w, h * 0.86);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    placePet(ctx, w, h, env, w * 0.5, h * 0.9, false);
  }

  function shop(ctx, w, h, env) {
    ctx.fillStyle = '#F8E6D4';
    ctx.fillRect(0, 0, w, h);
    const stripes = ['#E07A3C', '#FFF6E8', '#F0A020', '#FFF6E8'];
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = stripes[i % stripes.length];
      ctx.beginPath();
      ctx.moveTo(i * (w / 7), 0);
      ctx.lineTo((i + 1) * (w / 7), 0);
      ctx.lineTo((i + 0.5) * (w / 7), 46);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    box(ctx, w * 0.08, h * 0.22, w * 0.84, h * 0.28, 12, '#FFF6E8', true);
    box(ctx, w * 0.12, h * 0.28, w * 0.2, h * 0.14, 8, '#F0D2B4', true);
    box(ctx, w * 0.68, h * 0.28, w * 0.18, h * 0.14, 8, '#E7C49A', true);
    ctx.fillStyle = '#E7C9A0';
    ctx.fillRect(0, h * 0.78, w, h);
    placePet(ctx, w, h, env, w * 0.5, h * 0.9, false);
  }

  const rooms = { kitchen: kitchen, bath: bath, boma: boma, play: savanna, shop: shop };

  B.world = {
    draw: function (ctx, w, h, env) {
      const fn = rooms[env.room] || kitchen;
      ctx.clearRect(0, 0, w, h);
      fn(ctx, w, h, env);
    }
  };
})(window.Big5 = window.Big5 || {});
