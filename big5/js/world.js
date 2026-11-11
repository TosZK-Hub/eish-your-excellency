/* Painted rooms. The floor of each plate stays under the pet. */
(function (B) {
  'use strict';

  const INK = '#3B2416';

  function poo(ctx, x, y) {
    ctx.fillStyle = '#A07248';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y, 13, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 6, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function placePet(ctx, w, h, env, feetX, feetY) {
    const scale = Math.min(w / 340, h / 520);
    B.art.drawPet(ctx, feetX, feetY, Math.max(0.62, Math.min(1.05, scale)), env.anim || {});
    const box = B.art.anchors.box;
    if (!env.hotspots || !box) return;
    env.hotspots.push({
      id: 'pet',
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h
    });
  }

  function backdrop(ctx, w, h, room) {
    ctx.fillStyle = '#E7C49A';
    ctx.fillRect(0, 0, w, h);
    const img = B.art.image(B.art.bgFile(room));
    if (!img) return null;
    return B.art.coverBottom(ctx, img, w, h);
  }

  function poos(ctx, w, h, env, y) {
    (env.poos || []).forEach(function (slot) {
      const x = w * (slot === 0 ? 0.22 : 0.78);
      poo(ctx, x, y);
      if (env.hotspots) env.hotspots.push({ id: 'poo-' + slot, slot: slot, x: x - 22, y: y - 18, w: 44, h: 30 });
    });
  }

  function kitchen(ctx, w, h, env) {
    backdrop(ctx, w, h, 'kitchen');
    placePet(ctx, w, h, env, w * 0.5, h * 0.9);
    poos(ctx, w, h, env, h * 0.9);
  }

  function bath(ctx, w, h, env) {
    backdrop(ctx, w, h, 'bath');
    placePet(ctx, w, h, env, w * 0.5, h * 0.8);
    if (env.hotspots) env.hotspots.push({ id: 'shower', x: w * 0.72, y: h * 0.42, w: 56, h: 40 });
    poos(ctx, w, h, env, h * 0.9);
  }

  function boma(ctx, w, h, env) {
    const geom = backdrop(ctx, w, h, 'boma');
    const dark = env.shedding > 0 || env.lampOn === false;
    if (dark) {
      ctx.fillStyle = 'rgba(24, 16, 10, 0.5)';
      ctx.fillRect(0, 0, w, h);
    }
    placePet(ctx, w, h, env, w * 0.46, h * 0.86);
    if (dark) {
      const head = B.art.anchors.head || { x: w * 0.46, y: h * 0.5 };
      const glow = ctx.createRadialGradient(head.x, head.y, 20, head.x, head.y, 180);
      glow.addColorStop(0, 'rgba(240, 180, 60, 0.28)');
      glow.addColorStop(1, 'rgba(240, 180, 60, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }
    let lamp = { x: w * 0.62, y: h * 0.42 };
    if (geom) {
      lamp = { x: geom.dx + geom.dw * 0.56, y: geom.dy + geom.dh * 0.5 };
    }
    if (env.hotspots) {
      env.hotspots.push({ id: 'lamp', x: lamp.x - 28, y: lamp.y - 28, w: 64, h: 70 });
      env.hotspots.push({ id: 'power', x: 8, y: h * 0.28, w: 44, h: 36 });
    }
  }

  function savanna(ctx, w, h, env) {
    backdrop(ctx, w, h, 'play');
    placePet(ctx, w, h, env, w * 0.5, h * 0.88);
  }

  function shop(ctx, w, h, env) {
    backdrop(ctx, w, h, 'shop');
    placePet(ctx, w, h, env, w * 0.5, h * 0.9);
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
