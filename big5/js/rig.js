/* Sprite pets. Stage art from assets/art, with a light motion rig on top. */
(function (B) {
  'use strict';

  const INK = '#3B2416';
  const STAGE_NAME = { 1: 'baby', 2: 'youngster', 3: 'adult' };
  const STAGE_SCALE = { 1: 0.8, 2: 0.92, 3: 1 };
  const imgs = Object.create(null);
  const bgReady = Object.create(null);
  let scratch = null;

  function fileOf(species, stage, mood) {
    const name = STAGE_NAME[stage] || 'baby';
    if (name === 'baby' && mood) return 'webp/' + species + '_baby_' + mood + '.webp';
    return 'webp/' + species + '_' + name + '.webp';
  }

  function want(file) {
    let img = imgs[file];
    if (!img) {
      img = new Image();
      img.decoding = 'async';
      img.src = 'assets/art/' + file;
      imgs[file] = img;
    }
    return img.complete && img.naturalWidth ? img : null;
  }

  function bgFile(room) {
    const map = {
      kitchen: 'bg/lodge_kitchen.webp',
      bath: 'bg/waterhole_bath.webp',
      boma: 'bg/boma_bedroom.webp',
      play: 'bg/savanna_play.webp',
      shop: 'bg/lodge_kitchen.webp'
    };
    return map[room] || map.kitchen;
  }

  function coverGeom(img, w, h) {
    const ir = img.width / img.height;
    let dw = w;
    let dh = w / ir;
    if (dh < h) {
      dh = h;
      dw = h * ir;
    }
    return { dx: (w - dw) / 2, dy: h - dh, dw: dw, dh: dh };
  }

  function coverBottom(ctx, img, w, h) {
    const g = coverGeom(img, w, h);
    ctx.drawImage(img, g.dx, g.dy, g.dw, g.dh);
    return g;
  }

  const plates = Object.create(null);
  function gamePlate(room, w, h) {
    const img = want(bgFile(room));
    if (!img) return null;
    const key = room + ':' + w + 'x' + h;
    if (plates[key]) return plates[key];
    const c = document.createElement('canvas');
    c.width = Math.max(2, w);
    c.height = Math.max(2, h);
    const g = c.getContext('2d');
    try { g.filter = 'blur(5px)'; } catch (err) { /* older engines keep it sharp */ }
    coverBottom(g, img, c.width, c.height);
    g.filter = 'none';
    g.fillStyle = 'rgba(255, 246, 232, 0.18)';
    g.fillRect(0, 0, c.width, c.height);
    plates[key] = c;
    const keys = Object.keys(plates);
    if (keys.length > 6) delete plates[keys[0]];
    return c;
  }

  function silhouette(img) {
    if (!scratch) scratch = document.createElement('canvas');
    if (scratch.width !== img.width || scratch.height !== img.height) {
      scratch.width = img.width;
      scratch.height = img.height;
    }
    const s = scratch.getContext('2d');
    s.clearRect(0, 0, scratch.width, scratch.height);
    s.globalCompositeOperation = 'source-over';
    s.drawImage(img, 0, 0);
    s.globalCompositeOperation = 'source-in';
    s.fillStyle = '#FFF4D2';
    s.fillRect(0, 0, scratch.width, scratch.height);
    s.globalCompositeOperation = 'source-over';
    return scratch;
  }

  function motion(anim) {
    const t = anim.t || 0;
    const mood = anim.mood || '';
    const breathe = 1 + Math.sin(t * 2.05) * 0.03;
    let bob = Math.sin(t * 1.5) * 2.5;
    let sx = 1;
    let sy = breathe;
    let hop = 0;
    let rot = anim.rot || 0;
    if (anim.squash) {
      const k = Math.sin(Math.min(1, anim.squash * 4) * Math.PI);
      sx += k * 0.07;
      sy -= k * 0.06;
    }
    if (anim.eat > 0) {
      const k = Math.abs(Math.sin(t * 13));
      sx += k * 0.045;
      sy -= k * 0.05;
    }
    if (mood === 'happy') hop = Math.abs(Math.sin(t * 5.5)) * 9;
    if (mood === 'sleepy') {
      rot += Math.sin(t * 1.15) * 0.045;
      bob = Math.sin(t * 0.9) * 1.4;
      sy = 1 + Math.sin(t * 1.1) * 0.02;
    }
    return { sx: sx, sy: sy, bob: bob, hop: hop, rot: rot };
  }

  function crown(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(-s, s * 0.35);
    ctx.lineTo(-s * 0.72, -s * 0.15);
    ctx.lineTo(-s * 0.28, s * 0.2);
    ctx.lineTo(0, -s * 0.55);
    ctx.lineTo(s * 0.28, s * 0.2);
    ctx.lineTo(s * 0.72, -s * 0.15);
    ctx.lineTo(s, s * 0.35);
    ctx.closePath();
    ctx.fillStyle = '#F0C14A';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function charm(ctx, worn, x, y) {
    if (!worn) return;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = INK;
    ctx.lineJoin = 'round';
    if (worn.hat === 'flower') {
      ['#E58A4E', '#F0C14A', '#E58A4E'].forEach(function (color, i) {
        ctx.beginPath();
        ctx.arc(x + (i - 1) * 7, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
      });
    } else if (worn.hat) {
      ctx.fillStyle = worn.hat === 'safari' ? '#C4A574' : '#F0C14A';
      ctx.beginPath();
      ctx.ellipse(x, y + 4, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y - 2, 9, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (worn.neck) {
      const colors = ['#E07A3C', '#2E9A90', '#F0C14A', '#E58A4E'];
      colors.forEach(function (color, i) {
        ctx.beginPath();
        ctx.arc(x - 12 + i * 8, y + 28, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
      });
    }
  }

  function emote(ctx, mood, x, y, t) {
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 2) * 2);
    ctx.fillStyle = '#FFF8EC';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-16, -14, 32, 22, 8) : ctx.rect(-16, -14, 32, 22);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = '700 12px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mood === 'sleepy' ? 'z z' : mood === 'hungry' ? '…' : '', 0, -3);
    ctx.restore();
  }

  function drawPet(ctx, x, feetY, scale, anim) {
    const species = anim.species || 'lion';
    const stage = anim.stage > 3 ? 3 : (anim.stage || 1);
    const mood = anim.mood || '';
    let img = mood ? want(fileOf(species, stage, mood)) : null;
    if (!img) img = want(fileOf(species, stage, ''));
    if (!img) img = want(fileOf('lion', 1, ''));
    const mul = STAGE_SCALE[stage] || 1;
    const h = 310 * mul * (scale || 1);
    const m = motion(anim);
    const aspect = img ? img.width / img.height : 0.9;
    const w = h * aspect;
    const top = feetY + m.bob - m.hop - h * m.sy;
    const left = x - (w * m.sx) / 2;
    ctx.save();
    ctx.translate(x, feetY + m.bob - m.hop);
    ctx.rotate(m.rot);
    ctx.scale(m.sx, m.sy);
    ctx.beginPath();
    ctx.ellipse(0, -4, w * 0.28, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 36, 22, 0.18)';
    ctx.fill();
    if (anim.legend) {
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.48, w * 0.42, h * 0.46, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 193, 74, 0.28)';
      ctx.fill();
    }
    if (img) {
      ctx.drawImage(img, -w / 2, -h, w, h);
      const flash = anim.flash || 0;
      if (flash > 0) {
        ctx.globalAlpha = Math.min(0.85, flash);
        ctx.drawImage(silhouette(img), -w / 2, -h, w, h);
        ctx.globalAlpha = 1;
      }
      if (stage > 1 && mood === 'sleepy') {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#7E93B0';
        ctx.beginPath();
        ctx.ellipse(0, -h * 0.48, w * 0.34, h * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    if (anim.legend) crown(ctx, 0, -h - 6, 14);
    charm(ctx, anim.worn, 0, -h * 0.92);
    if (stage > 1 && (mood === 'sleepy' || mood === 'hungry')) {
      emote(ctx, mood, w * 0.28, -h * 0.82, anim.t || 0);
    }
    if (anim.foam > 0.08) {
      const t = anim.t || 0;
      for (let i = 0; i < 5; i++) {
        const bx = -w * 0.22 + i * w * 0.1;
        const by = -h * 0.35 + Math.sin(t * 3 + i) * 4;
        ctx.beginPath();
        ctx.arc(bx, by, 5 + (i % 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = INK;
        ctx.stroke();
      }
    }
    ctx.restore();
    const mouth = { x: x, y: top + h * 0.36 };
    const head = { x: x, y: top + h * 0.3 };
    B.art.anchors = {
      mouth: mouth,
      head: head,
      body: { x: x, y: top + h * 0.62 },
      box: { x: left, y: top, w: w, h: h }
    };
    return B.art.anchors;
  }

  B.art = {
    anchors: { mouth: null, head: null, body: null, box: null },
    preload: function (species, stage, room) {
      const s = !stage || stage < 1 ? 1 : stage > 3 ? 3 : stage;
      const id = species || 'lion';
      want(fileOf(id, s, ''));
      if (s === 1) {
        want(fileOf(id, 1, 'happy'));
        want(fileOf(id, 1, 'hungry'));
        want(fileOf(id, 1, 'sleepy'));
      }
      if (room) want(bgFile(room));
    },
    image: want,
    bgFile: bgFile,
    coverBottom: coverBottom,
    coverGeom: coverGeom,
    gamePlate: gamePlate,
    drawPet: drawPet
  };
  bgReady.ok = true;
})(window.Big5 = window.Big5 || {});
