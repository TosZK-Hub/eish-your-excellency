(function (T) {
  'use strict';

  const TAU = Math.PI * 2;
  const FUR = '#8d6848';
  const FUR_DEEP = '#5c4030';
  const FUR_LIGHT = '#b08968';
  const BELLY = '#c4a27c';
  const FACE = '#a07858';
  const HAIR = '#2a1c14';
  const INK = '#3a291f';
  const OUTLINE = '#3a291f';

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (w <= 0 || h <= 0) return;
    const rr = Math.max(0, Math.min(r || 0, w / 2, h / 2));
    if (rr < 0.5) {
      ctx.rect(x, y, w, h);
      return;
    }
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function disc(ctx, x, y, r, color) {
    if (!(r > 0)) return;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function oval(ctx, x, y, rx, ry, color, rot) {
    if (!(rx > 0) || !(ry > 0)) return;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function box(ctx, x, y, w, h, r, color) {
    if (w <= 0 || h <= 0) return;
    roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function capsule(ctx, x1, y1, x2, y2, r, color) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    disc(ctx, x1, y1, r, color);
    disc(ctx, x2, y2, r, color);
    if (len < 0.5) return;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(ang);
    roundRect(ctx, 0, -r, len, r * 2, r);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function makeAnim(t, o) {
    const cycle = t % 3.8;
    let blink = 0;
    if (cycle > 3.48) blink = Math.sin(((cycle - 3.48) / 0.32) * Math.PI);
    return Object.assign({
      t: t || 0,
      blink: blink,
      lid: 0,
      eyes: 'open',
      brow: 'none',
      mouth: 'smile',
      lookX: 0,
      lookY: 0,
      armL: 1.95,
      armR: 1.22,
      pose: 'stand',
      foam: 0,
      dirt: 0,
      alpha: 1,
      worn: { hat: null, top: null, shoes: null, face: null, charm: null },
      hold: null,
      squash: 0,
      blush: 0.4,
      lean: 0,
      leg: 0,
      shy: false,
      shake: 0
    }, o || {});
  }

  function scaleFor(footY, hat, reserve) {
    const need = hat ? 178 : 162;
    const avail = Math.max(90, footY - (reserve || 8));
    return clamp(avail / need, 0.46, 1.45);
  }

  function armEnd(side, ang, len) {
    const sx = side * 27;
    const sy = -64;
    return {
      sx: sx,
      sy: sy,
      x: sx + Math.cos(ang) * len,
      y: sy + Math.sin(ang) * len
    };
  }

  function bodyPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -88);
    ctx.bezierCurveTo(40, -86, 44, -56, 36, -36);
    ctx.bezierCurveTo(30, -20, 16, -12, 0, -10);
    ctx.bezierCurveTo(-16, -12, -30, -20, -36, -36);
    ctx.bezierCurveTo(-44, -56, -40, -86, 0, -88);
    ctx.closePath();
  }

  function ear(ctx, x, y, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.rotate(-0.95);
    const g = ctx.createLinearGradient(0, 6, 16, -24);
    g.addColorStop(0, FUR_DEEP);
    g.addColorStop(0.45, FUR);
    g.addColorStop(1, FUR_LIGHT);
    ctx.beginPath();
    ctx.moveTo(1, 8);
    ctx.bezierCurveTo(10, -4, 20, -10, 8, -26);
    ctx.quadraticCurveTo(2, -18, -1, 2);
    ctx.quadraticCurveTo(-2, 8, 1, 8);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.bezierCurveTo(8, -6, 12, -16, 5, -28);
    ctx.bezierCurveTo(3, -16, 2, -4, 4, 4);
    ctx.fillStyle = '#c48b78';
    ctx.fill();
    ctx.restore();
  }

  function hairTuft(ctx, t) {
    const tufts = [
      [-16, -128, -8, 11],
      [-8, -132, -18, 16],
      [0, -130, -26, 18],
      [7, -132, -16, 15],
      [14, -128, -6, 12],
      [4, -134, -32, 10]
    ];
    ctx.fillStyle = HAIR;
    ctx.strokeStyle = '#1a120e';
    ctx.lineWidth = 1.2;
    ctx.lineJoin = 'round';
    tufts.forEach((sp, i) => {
      const wob = Math.sin(t * 2.4 + i) * 1.2;
      ctx.beginPath();
      ctx.moveTo(sp[0] - 3, sp[1]);
      ctx.quadraticCurveTo(sp[0] + wob, sp[1] + sp[2], sp[0] + 4, sp[1] - 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  function drawLeg(ctx, hipX, phase, shoe) {
    const ang = Math.PI / 2 + Math.sin(phase || 0) * 0.4;
    const fx = hipX + Math.cos(ang) * 16;
    const fy = -18 + Math.sin(ang) * 16;
    capsule(ctx, hipX, -18, fx, fy, 6.2, FUR);
    if (shoe === 'vellies') {
      box(ctx, fx - 8, fy - 14, 16, 12, 5, '#a56b45');
      oval(ctx, fx, fy - 1, 9, 5, '#8a5a3a');
    } else if (shoe === 'takkies') {
      oval(ctx, fx, fy, 10, 5, '#f7f4ef');
      box(ctx, fx - 9, fy - 1, 18, 4, 2, '#2a6f7f');
      disc(ctx, fx + 5, fy - 5, 2.3, '#d4652f');
    } else {
      oval(ctx, fx, fy, 8, 4.2, FUR_DEEP);
    }
  }

  function drawArm(ctx, side, ang, sleeve) {
    const a = armEnd(side, ang, 30);
    capsule(ctx, a.sx, a.sy, a.x, a.y, 6.6, FUR_LIGHT);
    disc(ctx, a.x, a.y, 7.2, '#c49674');
    if (sleeve) {
      const mx = a.sx + Math.cos(ang) * 15;
      const my = a.sy + Math.sin(ang) * 15;
      capsule(ctx, a.sx, a.sy, mx, my, 7.4, sleeve);
    }
    return a;
  }

  function drawMouth(ctx, style) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    const y = -86;
    if (style === 'yuck') {
      oval(ctx, 0, y + 2, 7, 4.5, '#5c2e2a');
      oval(ctx, 1, y + 9, 3.4, 4.2, '#e07a78');
      return;
    }
    if (style === 'open') {
      oval(ctx, 0, y + 4, 9, 6.2, '#4a2824');
      oval(ctx, 0, y + 7, 5.5, 2.8, '#e08a84');
      box(ctx, -4, y + 1, 3.2, 3.4, 1, '#fffdf8');
      box(ctx, 1, y + 1, 3.2, 3.4, 1, '#fffdf8');
      return;
    }
    if (style === 'oh') {
      oval(ctx, 0, y + 1, 3.8, 5, '#4a2824');
      return;
    }
    if (style === 'frown') {
      ctx.beginPath();
      ctx.arc(0, y + 12, 9, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      return;
    }
    const wide = style === 'grin' ? 13 : style === 'small' ? 6.5 : 10;
    ctx.beginPath();
    ctx.arc(0, y - 4, wide, Math.PI * 0.08, Math.PI * 0.92);
    ctx.stroke();
    ctx.fillStyle = '#4a2824';
    ctx.beginPath();
    ctx.arc(0, y - 2, wide - 2, Math.PI * 0.12, Math.PI * 0.88);
    ctx.fill();
    if (style === 'grin' || style === 'smile' || style === 'yum') {
      box(ctx, -5.2, y - 1, 3.4, 4.2, 1.2, '#fffdf8');
      box(ctx, 1.8, y - 1, 3.4, 4.2, 1.2, '#fffdf8');
    }
  }

  function drawEye(ctx, x, y, anim, side) {
    if (anim.eyes === 'happy' || anim.eyes === 'shut') {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (anim.eyes === 'happy') ctx.arc(x, y + 1, 7, Math.PI * 0.14, Math.PI * 0.86);
      else ctx.arc(x, y + 4, 7, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
    } else {
      const open = Math.max(0.08, 1 - (anim.blink || 0) - (anim.lid || 0) * 0.58);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, open);
      disc(ctx, 0, 0, 10.2, '#fffdf8');
      const lx = clamp(anim.lookX || 0, -3, 3);
      const ly = clamp(anim.lookY || 0, -2.2, 2.2);
      disc(ctx, lx, ly, 5.2, '#14805c');
      disc(ctx, lx + 0.3, ly + 0.6, 2.7, '#10241c');
      disc(ctx, lx - 2.1, ly - 2.1, 1.6, '#fff');
      ctx.restore();
    }
    if (anim.brow === 'worry') {
      ctx.strokeStyle = HAIR;
      ctx.lineWidth = 1.7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const lift = side < 0 ? 1 : -1;
      ctx.moveTo(x - 7 * lift, y - 13);
      ctx.quadraticCurveTo(x, y - 15, x + 7 * lift, y - 11);
      ctx.stroke();
    }
  }

  function drawCharm(ctx, id) {
    if (id === 'beads') {
      const colors = ['#e07a3d', '#f4efe6', '#2a6f7f', '#e6b341', '#e07a3d', '#2f6d4f', '#f7f4ef'];
      colors.forEach((color, i) => {
        const x = -18 + i * 6;
        const y = -58 + Math.sin(i) * 3;
        disc(ctx, x, y, 3.1, color);
      });
    } else if (id === 'pebble') {
      ctx.strokeStyle = '#8a7568';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-8, -78);
      ctx.quadraticCurveTo(0, -68, 8, -78);
      ctx.stroke();
      oval(ctx, 0, -62, 7, 5.5, '#9aabb3');
      oval(ctx, -2, -64, 2.2, 1.3, 'rgba(255,255,255,.65)');
    }
  }

  function drawHat(ctx, id) {
    if (id === 'bucket') {
      oval(ctx, 0, -138, 15, 11, '#e6d3a4');
      box(ctx, -16, -132, 32, 12, 4, '#d7b97a');
      oval(ctx, 0, -122, 32, 6.5, '#c9a66a');
      oval(ctx, -6, -140, 5, 2.4, 'rgba(255,255,255,.35)');
    } else if (id === 'beanie') {
      oval(ctx, 0, -134, 20, 16, '#c4543c');
      disc(ctx, 0, -150, 5.5, '#c4543c');
      oval(ctx, -2, -152, 2, 1.4, 'rgba(255,255,255,.3)');
      oval(ctx, 0, -120, 20, 5, '#a84330');
    } else if (id === 'doek') {
      oval(ctx, 0, -118, 28, 14, '#d4652f');
      oval(ctx, 0, -112, 30, 6, '#f4efe6');
      oval(ctx, 8, -124, 10, 5, '#2a6f7f', 0.4);
    } else if (id === 'visor') {
      ctx.strokeStyle = '#2f6d4f';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -108, 30, Math.PI * 1.18, Math.PI * 1.82);
      ctx.stroke();
      oval(ctx, 0, -122, 26, 6.5, '#2f6d4f');
    }
  }

  function drawHold(ctx, anim, hand) {
    if (!hand || !anim.hold) return;
    if (anim.hold === 'candle') {
      box(ctx, hand.x - 3, hand.y - 18, 6, 18, 2, '#f7f1e4');
      const fy = hand.y - 22 + Math.sin(anim.t * 18) * 0.8;
      oval(ctx, hand.x, fy, 3.6, 5.5, '#f0a030');
      oval(ctx, hand.x, fy + 1, 1.8, 2.6, '#ffe7a0');
    } else if (anim.hold === 'horn') {
      capsule(ctx, hand.x, hand.y, hand.x + 14, hand.y - 2, 5, '#d4533c');
      disc(ctx, hand.x + 16, hand.y - 2, 6, '#f0c14a');
    }
  }

function drawPet(ctx, x, y, scale, anim, out) {
  if (photoReady('happy')) return drawPhotoPet(ctx, x, y, scale, anim, out);
  const worn = (anim && anim.worn) || {};
    const anchors = { mouth: { x: x, y: y - 84 * scale }, head: { x: x, y: y - 108 * scale }, hand: null };
    ctx.save();
    ctx.translate(x, y + Math.sin((anim.t || 0) * 2.2) * (anim.crouch ? 0.4 : 1.6));
    ctx.scale(scale, scale);
    if (anim.crouch) ctx.translate(0, 10);
    oval(ctx, 0, 5, 30, 7, 'rgba(60,40,24,0.2)');
    ctx.rotate(anim.lean || 0);
    ctx.translate((anim.shake || 0) * Math.sin((anim.t || 0) * 34), 0);
    const br = Math.sin((anim.t || 0) * 2.4) * 0.012;
    const sq = anim.squash || 0;
    ctx.scale(1 + br + sq, 1 - br - sq * 0.55);
    const alpha = clamp(anim.alpha == null ? 1 : anim.alpha, 0, 1);
    ctx.globalAlpha = alpha;

    if (anim.pose !== 'sit') {
      const phase = anim.pose === 'run' ? (anim.leg || 0) : 0;
      drawLeg(ctx, -13, phase, worn.shoes);
      drawLeg(ctx, 13, phase + Math.PI, worn.shoes);
    }
    oval(ctx, -32, -28, 9, 6, FUR_DEEP, -0.5);

    const bg = ctx.createRadialGradient(-12, -62, 8, 4, -42, 48);
    bg.addColorStop(0, '#c49a74');
    bg.addColorStop(0.55, '#8d6848');
    bg.addColorStop(1, '#5c4030');
    ctx.fillStyle = bg;
    bodyPath(ctx);
    ctx.fill();
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.save();
    bodyPath(ctx);
    ctx.clip();
    oval(ctx, -18, -70, 16, 10, 'rgba(255,236,214,0.28)');
    oval(ctx, 16, -28, 14, 10, 'rgba(60,36,24,0.18)');
    ctx.restore();

    if (!worn.top) oval(ctx, 1, -44, 15, 13, BELLY);

    if (worn.top === 'jersey' || worn.top === 'safari') {
      ctx.save();
      bodyPath(ctx);
      ctx.clip();
      if (worn.top === 'jersey') {
        ctx.fillStyle = '#2a6f7f';
        ctx.fillRect(-46, -82, 92, 74);
        ctx.fillStyle = '#f6f1e8';
        ctx.fillRect(-46, -62, 92, 6);
        ctx.fillRect(-46, -50, 92, 6);
      } else {
        ctx.fillStyle = '#cbb892';
        ctx.fillRect(-46, -82, 92, 74);
      }
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(-7, -80);
      ctx.lineTo(0, -68);
      ctx.lineTo(7, -80);
      ctx.fillStyle = FUR;
      ctx.fill();
      if (worn.top === 'safari') {
        box(ctx, -16, -56, 12, 10, 2, '#b7a57a');
        box(ctx, 4, -56, 12, 10, 2, '#b7a57a');
        disc(ctx, 0, -72, 1.5, '#6b5438');
        disc(ctx, 0, -64, 1.5, '#6b5438');
        disc(ctx, 0, -56, 1.5, '#6b5438');
      }
    }

    if (worn.top === 'apron') {
      ctx.strokeStyle = '#e07a3d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, -82);
      ctx.lineTo(-14, -74);
      ctx.moveTo(8, -82);
      ctx.lineTo(14, -74);
      ctx.stroke();
      box(ctx, -20, -74, 40, 52, 10, '#e07a3d');
      box(ctx, -10, -52, 20, 12, 3, '#c9652f');
      box(ctx, -20, -28, 40, 5, 1, '#f4efe6');
    }

    const sleeve = worn.top === 'jersey' ? '#2a6f7f' : (worn.top === 'safari' ? '#cbb892' : null);
    drawArm(ctx, -1, anim.armL, sleeve);
    const right = drawArm(ctx, 1, anim.armR, sleeve);
    anchors.hand = { x: x + right.x * scale, y: y + right.y * scale };

    ear(ctx, -30, -112, -1);
    ear(ctx, 30, -112, 1);

    const hg = ctx.createRadialGradient(-10, -122, 6, 2, -104, 36);
    hg.addColorStop(0, '#c9a07c');
    hg.addColorStop(0.62, '#a07858');
    hg.addColorStop(1, '#6a4a34');
    ctx.beginPath();
    ctx.arc(0, -106, 31, 0, TAU);
    ctx.fillStyle = hg;
    ctx.fill();
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 236, 214, 0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -106, 27, Math.PI * 1.15, Math.PI * 1.72);
    ctx.stroke();
    oval(ctx, -12, -118, 8, 4, 'rgba(255,244,230,0.22)');

    const blushA = clamp(anim.blush == null ? 0.4 : anim.blush, 0, 1);
    oval(ctx, -18, -96, 6, 3.2, 'rgba(240,140,128,' + (0.28 + blushA * 0.35) + ')');
    oval(ctx, 18, -96, 6, 3.2, 'rgba(240,140,128,' + (0.28 + blushA * 0.35) + ')');

    drawEye(ctx, -12, -108, anim, -1);
    drawEye(ctx, 13, -108, anim, 1);
    oval(ctx, 1, -94, 3.6, 2.6, '#8d5348');
    oval(ctx, -0.6, -95, 1.3, 0.8, 'rgba(255,255,255,.4)');
    const chew = anim.chew ? (Math.sin((anim.t || 0) * 14) > 0 ? 'open' : 'grin') : (anim.mouth || 'smile');
    drawMouth(ctx, chew);

    if (!worn.hat || worn.hat === 'visor') hairTuft(ctx, anim.t || 0);
    if (worn.hat) drawHat(ctx, worn.hat);
    if (worn.neck === 'scarf') {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, -78, 16, 7, 0, 0, TAU);
      ctx.fillStyle = '#1f6b3a';
      ctx.fill();
      ctx.fillStyle = '#e6b341';
      ctx.fillRect(-16, -80, 32, 3);
      ctx.fillStyle = '#1f6b3a';
      ctx.fillRect(4, -74, 7, 16);
      ctx.fillStyle = '#e6b341';
      ctx.fillRect(4, -68, 7, 3);
      ctx.restore();
    }
    if (worn.extra === 'vuvu' && !anim.hold && right) {
      capsule(ctx, right.x, right.y, right.x + 18, right.y - 14, 3.2, '#f0c14a');
      disc(ctx, right.x + 20, right.y - 16, 5, '#f0c14a');
    }
    if (worn.face === 'shades') {
      oval(ctx, -12, -106, 11, 9, 'rgba(28,36,42,.78)');
      oval(ctx, 12, -106, 11, 9, 'rgba(28,36,42,.78)');
      ctx.strokeStyle = '#e6b341';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.arc(-12, -106, 11, 0, TAU);
      ctx.arc(12, -106, 11, 0, TAU);
      ctx.moveTo(-1, -106);
      ctx.lineTo(1, -106);
      ctx.stroke();
      oval(ctx, -16, -109, 3, 1.5, 'rgba(255,255,255,.35)');
    }
    if (worn.charm && !(anim.shy && alpha < 0.95)) drawCharm(ctx, worn.charm);

    if (anim.foam > 0.02) {
      const n = Math.round(3 + anim.foam * 7);
      for (let i = 0; i < n; i++) {
        const a = anim.t * 2 + i * 1.7;
        oval(ctx, Math.cos(a) * (10 + (i % 4) * 4), -48 + Math.sin(a) * 16, 3.5 + (i % 3), 3, 'rgba(255,255,255,' + (0.35 + anim.foam * 0.4) + ')');
      }
    }
    if (anim.dirt > 0.08) {
      ctx.globalAlpha = alpha * Math.min(1, anim.dirt);
      oval(ctx, -12, -40, 5, 3.2, '#6d4b34');
      oval(ctx, 14, -32, 4, 2.6, '#6d4b34');
      oval(ctx, 6, -116, 3, 2, '#6d4b34');
      ctx.globalAlpha = alpha;
    }

    drawHold(ctx, anim, right);

    if (anim.shy) {
      ctx.globalAlpha = 1;
      if (worn.charm) drawCharm(ctx, worn.charm);
      for (let i = 0; i < 3; i++) {
        const a = anim.t * 3 + i * 2.1;
        disc(ctx, Math.cos(a) * 22, -78 + Math.sin(a * 1.4) * 16, 2.1, 'rgba(255,214,120,.95)');
      }
    }

    ctx.restore();
    if (out) {
      out.mouth = anchors.mouth;
      out.head = anchors.head;
      out.hand = anchors.hand;
    }
    return anchors;
  }

  function placePet(ctx, x, y, scale, anim, env) {
    const a = drawPet(ctx, x, y, scale, anim);
    env.anchors.mouth = a.mouth;
    env.anchors.head = a.head;
    env.anchors.hand = a.hand;
    const top = y - ((anim.worn && anim.worn.hat) ? 178 : 162) * scale;
    const half = 60 * scale;
    env.hotspots.push({
      id: 'pet',
      x: x - half,
      y: Math.max(0, top),
      w: half * 2,
      h: Math.max(48, y - Math.max(0, top))
    });
    return a;
  }

  function drawWindow(ctx, x, y, w, h, mode) {
    box(ctx, x - 4, y - 4, w + 8, h + 8, 8, '#f7efe4');
    const g = ctx.createLinearGradient(x, y, x, y + h);
    if (mode === 'dusk') {
      g.addColorStop(0, '#3c4f73');
      g.addColorStop(0.55, '#d9896a');
      g.addColorStop(1, '#f2c39a');
    } else {
      g.addColorStop(0, '#8ecaf0');
      g.addColorStop(0.7, '#d9f3c4');
      g.addColorStop(1, '#c6e6a4');
    }
    box(ctx, x, y, w, h, 4, '#fff');
    ctx.save();
    roundRect(ctx, x, y, w, h, 4);
    ctx.clip();
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    if (mode === 'dusk') {
      disc(ctx, x + w * 0.72, y + 16, 7, '#ffe1a8');
      ctx.fillStyle = '#2c3d34';
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.quadraticCurveTo(x + w * 0.4, y + h * 0.45, x + w, y + h * 0.72);
      ctx.lineTo(x + w, y + h);
      ctx.fill();
      aloe(ctx, x + 18, y + h - 6);
    } else {
      disc(ctx, x + w - 18, y + 16, 8, '#ffe28a');
      ctx.fillStyle = '#7aaa62';
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.5, x + w, y + h * 0.78);
      ctx.lineTo(x + w, y + h);
      ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();
  }

  function aloe(ctx, x, y) {
    [-0.9, -0.35, 0.15, 0.7].forEach((rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      oval(ctx, 0, -14, 3.2, 14, '#3f8f62');
      ctx.restore();
    });
    box(ctx, x - 7, y - 2, 14, 8, 3, '#c47a4a');
  }

  function drawJar(ctx, x, y, label, fill) {
    const w = 40;
    const h = 48;
    const left = x - w / 2;
    const top = y - h;
    box(ctx, left + 4, top + 10, w - 8, h - 12, 6, 'rgba(255,255,255,.45)');
    box(ctx, left + 7, top + 18, w - 14, h - 26, 4, fill);
    box(ctx, left + 8, top + 2, w - 16, 10, 3, '#e4d2b4');
    ctx.fillStyle = INK;
    ctx.font = '700 8px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, top + 30);
  }

  function drawPoo(ctx, x, y) {
    oval(ctx, x, y + 8, 14, 5, 'rgba(80,50,30,.16)');
    oval(ctx, x, y + 1, 13, 9, '#8a5a3c');
    oval(ctx, x - 1, y - 8, 9, 7, '#a56b48');
    oval(ctx, x - 2, y - 14, 6, 5, '#c48a62');
    oval(ctx, x - 4, y - 16, 2.2, 1.3, 'rgba(255,255,255,.55)');
  }

  function tubGeom(w, h) {
    const tubW = Math.min(w - 76, 300);
    const tubH = Math.min(150, Math.max(100, h * 0.42));
    const x = (w - tubW) / 2;
    const y = Math.max(78, h - tubH - 36);
    return { x: x, y: y, tubW: tubW, tubH: tubH, cx: x + tubW / 2, cy: y + tubH / 2 };
  }

  function drawTubBack(ctx, geom, env) {
    const x = geom.x;
    const y = geom.y;
    const cx = geom.cx;
    const cy = geom.cy;
    oval(ctx, cx, cy + geom.tubH * 0.46, geom.tubW * 0.46, 14, 'rgba(60,70,80,.18)');
    const g = ctx.createLinearGradient(x, y, x + geom.tubW, y + geom.tubH);
    g.addColorStop(0, '#f4f7f8');
    g.addColorStop(0.35, '#c5ced3');
    g.addColorStop(0.72, '#8d9aa0');
    g.addColorStop(1, '#6f7c82');
    ctx.beginPath();
    ctx.ellipse(cx, cy, geom.tubW / 2, geom.tubH / 2, 0, 0, TAU);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f7fbfc';
    ctx.stroke();
    const water = env.rinsing > 0 ? '#9fd4e4' : (env.foam > 0.05 ? '#d5eef2' : '#8ea0a6');
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8, geom.tubW / 2 - 22, Math.max(16, geom.tubH / 2 - 24), 0, 0, TAU);
    ctx.fillStyle = water;
    ctx.fill();
    oval(ctx, cx - geom.tubW * 0.22, cy - geom.tubH * 0.18, 16, 6, 'rgba(255,255,255,.35)');
    oval(ctx, x + 4, cy, 8, 14, '#dfe7ea');
    oval(ctx, x + geom.tubW - 4, cy, 8, 14, '#dfe7ea');
    for (let i = 0; i < 4; i++) {
      disc(ctx, cx - 40 + i * 26, cy - geom.tubH * 0.28, 2.2, '#6c797f');
    }
  }

  function drawTubFront(ctx, geom) {
    ctx.beginPath();
    ctx.ellipse(geom.cx, geom.cy + 2, geom.tubW / 2 - 2, geom.tubH / 2 - 2, 0, 0.05 * Math.PI, 0.95 * Math.PI);
    ctx.strokeStyle = '#f4f8f8';
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.strokeStyle = '#9aa6ab';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function bedLayout(w, h) {
    const bedW = Math.min(w - 112, 290);
    const x = 16;
    const brickH = 26;
    const mattressH = 40;
    const bottom = h - 12;
    const brickTop = bottom - brickH;
    const mattressTop = brickTop - mattressH - 4;
    return { x: x, bedW: bedW, brickH: brickH, brickTop: brickTop, mattressH: mattressH, mattressTop: mattressTop, bottom: bottom };
  }

  function drawBrick(ctx, x, y) {
    box(ctx, x, y, 24, 22, 2, '#b5523a');
    box(ctx, x, y, 24, 5, 1, '#d47862');
  }

  function drawBed(ctx, layout) {
    ctx.fillStyle = '#2a2422';
    ctx.fillRect(layout.x + 18, layout.brickTop - 2, layout.bedW - 36, layout.brickH + 4);
    const bw = 26;
    const gap = (layout.bedW - 36 - bw * 4) / 3;
    for (let i = 0; i < 4; i++) {
      const bx = layout.x + 18 + i * (bw + Math.max(6, gap));
      box(ctx, bx, layout.brickTop + 2, bw, layout.brickH - 2, 2, '#c44734');
      box(ctx, bx, layout.brickTop + 2, bw, 5, 1, '#e7a090');
      ctx.strokeStyle = 'rgba(90,30,24,.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 3, layout.brickTop + 8, bw - 6, 6);
    }
    box(ctx, layout.x, layout.mattressTop + layout.mattressH - 6, layout.bedW, 10, 3, '#a56b43');
    box(ctx, layout.x + 4, layout.mattressTop, layout.bedW - 8, layout.mattressH, 8, '#f7f1e8');
    box(ctx, layout.x + 12, layout.mattressTop + 6, 46, 22, 6, '#fffdf8');
  }

  function drawBlanket(ctx, layout) {
    const top = layout.mattressTop + 18;
    const height = Math.max(12, layout.mattressH - 20);
    box(ctx, layout.x + 8, top, layout.bedW - 16, height, 8, '#3d8f8a');
    box(ctx, layout.x + 8, top, layout.bedW - 16, 5, 3, '#f7f4ea');
  }

  function drawLamp(ctx, x, y, on, t) {
    box(ctx, x, y + 34, 36, 8, 2, '#cbb89a');
    ctx.strokeStyle = '#8a7568';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 34);
    ctx.lineTo(x + 18, y + 16);
    ctx.stroke();
    if (on) {
      const flick = 0.82 + Math.sin(t * 28) * 0.1 + Math.sin(t * 63) * 0.06;
      const g = ctx.createRadialGradient(x + 18, y + 10, 4, x + 18, y + 12, 46 * flick);
      g.addColorStop(0, 'rgba(255,214,120,.55)');
      g.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + 18, y + 12, 46, 0, TAU);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 16);
    ctx.lineTo(x + 32, y + 16);
    ctx.lineTo(x + 26, y);
    ctx.lineTo(x + 10, y);
    ctx.closePath();
    ctx.fillStyle = on ? '#f6d98a' : '#d9c7a2';
    ctx.fill();
  }

  function drawPower(ctx, x, y) {
    box(ctx, x, y, 36, 46, 4, '#e4ddd2');
    box(ctx, x + 8, y + 8, 20, 16, 2, '#2a2118');
    ctx.strokeStyle = '#e6b341';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 10);
    ctx.lineTo(x + 16, y + 17);
    ctx.lineTo(x + 21, y + 17);
    ctx.lineTo(x + 17, y + 23);
    ctx.stroke();
    disc(ctx, x + 18, y + 34, 3, '#d4652f');
  }

  function drawSock(ctx, x, y, color, rot, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    ctx.scale(sc || 1, sc || 1);
    box(ctx, -6, -16, 12, 18, 5, color);
    box(ctx, -6, -2, 18, 8, 4, color);
    box(ctx, -6, -18, 12, 5, 2, '#fff');
    ctx.restore();
  }

  function drawFlies(ctx, head, t) {
    if (!head) return;
    for (let i = 0; i < 3; i++) {
      const ang = t * 3.2 + i * 2.1;
      const x = head.x + Math.cos(ang) * (26 + i * 4);
      const y = head.y + Math.sin(ang * 1.2) * 14 - 6;
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = 'rgba(40,40,40,.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(-3, -2, 4, 2, -0.6, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(3, -2, 4, 2, 0.6, 0, TAU);
      ctx.stroke();
      disc(ctx, 0, 0, 2.3, '#2a2420');
      ctx.restore();
    }
  }

  const art = {};
  let fadeMood = 'happy';
  let fadeFrom = 'happy';
  let fadeStart = 0;

  function loadArt(name, src) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    art[name] = img;
  }
  ['happy', 'hungry', 'sleepy', 'dirty', 'yum'].forEach((name) => {
    loadArt(name, 'assets/' + name + '.webp');
  });
  loadArt('bg-kitchen', 'assets/bg-kitchen.webp');
  loadArt('bg-bath', 'assets/bg-bath.webp');
  loadArt('bg-stoep', 'assets/bg-stoep.webp');

  function photoReady(name) {
    const img = art[name];
    return !!(img && img.complete && img.naturalWidth);
  }

  function coverBottom(ctx, img, w, h) {
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, h - dh, dw, dh);
    return { dx: (w - dw) / 2, dy: h - dh, dw: dw, dh: dh };
  }

  function spriteFor(anim) {
    if (!anim) return 'happy';
    if (anim.sprite) return anim.sprite;
    if (anim.chew || anim.mouth === 'yum') return 'yum';
    if (anim.mouth === 'yuck') return 'hungry';
    if (anim.eyes === 'shut' || (anim.lid || 0) > 0.45) return 'sleepy';
    if (anim.mouth === 'frown' || anim.brow === 'worry') return 'hungry';
    if ((anim.dirt || 0) > 0.35) return 'dirty';
    return 'happy';
  }

  function drawPhotoPet(ctx, x, y, scale, anim, out) {
    const mood = spriteFor(anim);
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
    if (mood !== fadeMood) {
      fadeFrom = fadeMood;
      fadeMood = mood;
      fadeStart = now;
    }
    const u = clamp((now - fadeStart) / 0.28, 0, 1);
    const bob = Math.sin((anim.t || 0) * 2.1) * 5;
    const hop = mood === 'happy' ? Math.abs(Math.sin((anim.t || 0) * 2.4)) * -6 : 0;
    const br = 1 + Math.sin((anim.t || 0) * 2.5) * 0.018;
    const sq = anim.squash || 0;
    const sway = Math.sin((anim.t || 0) * 1.3) * 0.03 + (anim.lean || 0);
    const dh = 198 * (scale || 1);
    const img = art[mood] && art[mood].naturalWidth ? art[mood] : art.happy;
    const dw = dh * (img.naturalWidth / img.naturalHeight);
    const anchors = {
      mouth: { x: x, y: y - dh * 0.60 },
      head: { x: x, y: y - dh * 0.74 },
      hand: { x: x + dw * 0.28, y: y - dh * 0.42 }
    };
    ctx.save();
    ctx.translate(x, y + bob + hop);
    ctx.rotate(sway + (anim.shake || 0) * Math.sin((anim.t || 0) * 36) * 0.04);
    ctx.scale((1 + sq) * (anim.crouch ? 1.04 : 1), (br - sq * 0.65) * (anim.crouch ? 0.92 : 1));
    oval(ctx, 0, 2, dw * 0.28, 8, 'rgba(40,24,12,0.28)');
    const drawOne = (image, alpha) => {
      if (!image || !image.naturalWidth || alpha < 0.02) return;
      ctx.save();
      ctx.globalAlpha = alpha * (anim.alpha == null ? 1 : anim.alpha);
      const wimg = dh * (image.naturalWidth / image.naturalHeight);
      ctx.drawImage(image, -wimg / 2, -dh, wimg, dh);
      ctx.restore();
    };
    if (u < 1 && photoReady(fadeFrom)) drawOne(art[fadeFrom], 1 - u);
    drawOne(img, u < 1 ? u : 1);
    if ((anim.blink || 0) > 0.45 && mood !== 'sleepy' && mood !== 'yum') {
      ctx.fillStyle = 'rgba(196, 138, 104, 0.92)';
      const shut = Math.min(1, (anim.blink - 0.45) / 0.4);
      [-0.13, 0.14].forEach((side) => {
        ctx.beginPath();
        ctx.ellipse(side * dw, -dh * 0.735, dw * 0.07, dh * 0.035 * shut, 0, 0, TAU);
        ctx.fill();
      });
    }
    ctx.restore();
    if (out) {
      out.mouth = anchors.mouth;
      out.head = anchors.head;
      out.hand = anchors.hand;
    }
    return anchors;
  }

  function kitchen(ctx, w, h, env) {
    if (photoReady('bg-kitchen')) {
      coverBottom(ctx, art['bg-kitchen'], w, h);
      const shelfY = Math.min(h * 0.34, 150);
      drawJar(ctx, 46, shelfY, env.swapped ? 'SUGAR' : 'SALT', '#f7f4ee');
      drawJar(ctx, 98, shelfY, env.swapped ? 'SALT' : 'SUGAR', '#f6d7a8');
      const s = clamp(h / 430, 0.72, 1.25);
      placePet(ctx, w * 0.62, h - 4, s, env.anim, env);
      env.hotspots.push({ id: 'jar-salt', x: 22, y: shelfY - 58, w: 48, h: 62 });
      env.hotspots.push({ id: 'jar-sugar', x: 74, y: shelfY - 58, w: 50, h: 62 });
      if (env.decor && env.decor.hadeda) {
        const hx = ((env.t * 26) % (w + 50)) - 30;
        oval(ctx, hx, h - 28, 14, 8, '#5c6563');
        ctx.strokeStyle = '#e07a3d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hx + 10, h - 30);
        ctx.lineTo(hx + 22, h - 28);
        ctx.stroke();
      }
      return;
    }
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#fbe6d2');
    g.addColorStop(0.72, '#f3c9a4');
    g.addColorStop(1, '#e7b184');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const floorTop = h - 42;
    ctx.fillStyle = '#c9845a';
    ctx.fillRect(0, floorTop, w, h - floorTop);
    ctx.strokeStyle = 'rgba(120,60,30,.16)';
    ctx.lineWidth = 1;
    for (let y = floorTop + 12; y < h; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    box(ctx, 0, floorTop - 7, w, 8, 0, '#f7efe4');
    drawWindow(ctx, 12, 12, Math.min(104, w * 0.28), 70, 'day');
    const shelfY = clamp(h * 0.4, 128, 188);
    box(ctx, 14, shelfY, 112, 8, 3, '#a86b45');
    drawJar(ctx, 42, shelfY, env.swapped ? 'SUGAR' : 'SALT', '#f7f4ee');
    drawJar(ctx, 96, shelfY, env.swapped ? 'SALT' : 'SUGAR', '#f6d7a8');
    const hat = !!(env.anim.worn && env.anim.worn.hat);
    const footY = h - 6;
    const scale = scaleFor(footY, hat, 96);
    const footX = clamp(w * 0.66, 150, w - 78);
    placePet(ctx, footX, footY, scale, env.anim, env);
    env.hotspots.push({ id: 'jar-salt', x: 20, y: shelfY - 62, w: 46, h: 66 });
    env.hotspots.push({ id: 'jar-sugar', x: 70, y: shelfY - 62, w: 50, h: 66 });
    if (env.decor && env.decor.kettle) {
      const kx = Math.min(w - 36, footX - 78 * scale);
      const ky = floorTop - 8;
      oval(ctx, kx, ky - 10, 16, 12, '#c0c6c8');
      box(ctx, kx - 4, ky - 28, 8, 10, 2, '#8a9294');
      disc(ctx, kx + 14, ky - 8, 4, '#8a9294');
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const rise = ((env.t * 24 + i * 10) % 28);
        disc(ctx, kx + Math.sin(env.t + i) * 3, ky - 30 - rise, 3 - rise * 0.06, 'rgba(255,255,255,' + (0.45 - rise / 70) + ')');
      }
    }
    if (env.decor && env.decor.hadeda) {
      const hx = ((env.t * 22) % (w + 40)) - 20;
      oval(ctx, hx, floorTop - 14, 10, 6, '#6e7270');
      ctx.strokeStyle = '#e07a3d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx + 8, floorTop - 16);
      ctx.lineTo(hx + 18, floorTop - 14);
      ctx.stroke();
    }
  }

  function bath(ctx, w, h, env) {
    if (photoReady('bg-bath')) {
      const place = coverBottom(ctx, art['bg-bath'], w, h);
      const s = clamp(h / 460, 0.7, 1.2);
      placePet(ctx, w * 0.42, h - 2, s, Object.assign({}, env.anim, { pose: 'stand' }), env);
      const tub = {
        x: place.dx + place.dw * 0.12,
        y: place.dy + place.dh * 0.46,
        w: place.dw * 0.42,
        h: place.dh * 0.16
      };
      env.hotspots.push({ id: 'shower', x: place.dx + place.dw * 0.62, y: place.dy + place.dh * 0.48, w: 64, h: 54 });
      const spots = [
        { id: 0, x: 36, y: h - 28 },
        { id: 1, x: w - 40, y: h - 26 },
        { id: 2, x: w * 0.72, y: h - 22 }
      ];
      spots.forEach((spot) => {
        if (env.poos.indexOf(spot.id) === -1) return;
        drawPoo(ctx, spot.x, spot.y);
        env.hotspots.push({ id: 'poo-' + spot.id, x: spot.x - 22, y: spot.y - 26, w: 44, h: 44, slot: spot.id });
      });
      env.marks.shower = { x: place.dx + place.dw * 0.7, y: place.dy + place.dh * 0.5 };
      if (env.rinsing > 0 && env.marks.shower) {
        ctx.strokeStyle = 'rgba(186, 220, 245, 0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(env.marks.shower.x, env.marks.shower.y);
        ctx.lineTo(env.marks.shower.x - 10, env.marks.shower.y + 36);
        ctx.moveTo(env.marks.shower.x + 8, env.marks.shower.y);
        ctx.lineTo(env.marks.shower.x + 4, env.marks.shower.y + 42);
        ctx.stroke();
      }
      void tub;
      return;
    }
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#e7f6f2');
    wall.addColorStop(0.62, '#d4ebe4');
    wall.addColorStop(1, '#e7d7c8');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 2;
    for (let y = 28; y < h * 0.55; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    const geom = tubGeom(w, h);
    drawTubBack(ctx, geom, env);
    const hat = !!(env.anim.worn && env.anim.worn.hat);
    const footY = geom.y + geom.tubH * 0.78;
    let scale = Math.min(scaleFor(footY, hat, 8), geom.tubW / 160);
    scale = clamp(scale, 0.62, 1.35);
    const sit = Object.assign({}, env.anim, { pose: 'sit' });
    placePet(ctx, geom.cx, footY, scale, sit, env);
    drawTubFront(ctx, geom);

    const spots = [
      { id: 0, x: 34, y: h - 28 },
      { id: 1, x: w - 36, y: h - 28 },
      { id: 2, x: w / 2, y: h - 20 }
    ];
    spots.forEach((spot) => {
      if (env.poos.indexOf(spot.id) === -1) return;
      drawPoo(ctx, spot.x, spot.y);
      env.hotspots.push({ id: 'poo-' + spot.id, x: spot.x - 22, y: spot.y - 28, w: 44, h: 44, slot: spot.id });
    });

    const sx = Math.min(w - 36, geom.x + geom.tubW + 8);
    const sy = Math.max(78, geom.y + 8);
    ctx.strokeStyle = '#8e9ba0';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, sy - 8);
    ctx.stroke();
    disc(ctx, sx, sy, 14, '#d5dee2');
    disc(ctx, sx, sy, 8, '#edf3f4');
    ctx.strokeStyle = '#7d8c93';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, 14, 0, TAU);
    ctx.stroke();
    if (env.rinsing > 0) {
      ctx.strokeStyle = '#7ec8e3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - 6, sy + 16);
      ctx.lineTo(sx - 8, sy + 34);
      ctx.moveTo(sx, sy + 16);
      ctx.lineTo(sx, sy + 40);
      ctx.moveTo(sx + 6, sy + 16);
      ctx.lineTo(sx + 8, sy + 34);
      ctx.stroke();
    }
    env.hotspots.push({ id: 'shower', x: sx - 26, y: sy - 26, w: 52, h: 52 });
    env.marks.shower = { x: sx, y: sy + 16 };
    box(ctx, geom.x + 8, geom.y + 8, 28, 16, 4, '#f7f3ea');
  }

  function stoep(ctx, w, h, env) {
    if (photoReady('bg-stoep')) {
      const place = coverBottom(ctx, art['bg-stoep'], w, h);
      const bed = {
        x: place.dx + place.dw * 0.02,
        y: place.dy + place.dh * 0.55,
        w: place.dw * 0.46,
        h: place.dh * 0.2
      };
      env.hotspots.push({ id: 'under', x: bed.x + 8, y: bed.y + bed.h - 18, w: bed.w * 0.7, h: 36 });
      env.hotspots.push({
        id: 'lamp',
        x: place.dx + place.dw * 0.48,
        y: place.dy + place.dh * 0.48,
        w: 70,
        h: 78
      });
      env.hotspots.push({ id: 'power', x: 8, y: 64, w: 52, h: 56 });
      const s = clamp(h / 480, 0.68, 1.15);
      if (!env.hiding) {
        const footY = env.sleeping ? bed.y + bed.h * 0.42 : h - 2;
        const anim = Object.assign({}, env.anim, { sprite: env.sleeping ? 'sleepy' : env.anim.sprite });
        placePet(ctx, env.sleeping ? bed.x + bed.w * 0.45 : w * 0.68, footY, env.sleeping ? s * 0.72 : s, anim, env);
      } else {
        const eyeX = bed.x + bed.w * 0.35;
        const eyeY = bed.y + bed.h - 6;
        [-10, 10].forEach((dx) => {
          disc(ctx, eyeX + dx, eyeY, 6, '#fffdf8');
          disc(ctx, eyeX + dx, eyeY, 2.6, '#c47a28');
        });
        env.anchors.head = { x: eyeX, y: eyeY - 10 };
        env.anchors.mouth = env.anchors.head;
        env.hotspots.push({ id: 'pet', x: eyeX - 24, y: eyeY - 14, w: 56, h: 32 });
      }
      if (env.decor && env.decor.braai) {
        box(ctx, w - 70, h - 46, 48, 18, 4, '#3a3330');
        oval(ctx, w - 46, h - 40, 10, 4, 'rgba(240,140,50,' + (0.4 + Math.sin(env.t * 10) * 0.15) + ')');
      }
      return;
    }
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#f6e2cf');
    g.addColorStop(0.7, '#f0d2b8');
    g.addColorStop(1, '#e7c3a4');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const winW = Math.min(108, w * 0.3);
    drawWindow(ctx, w - winW - 14, 12, winW, 72, 'dusk');
    drawPower(ctx, 12, 108);

    const layout = bedLayout(w, h);
    drawBed(ctx, layout);
    const standX = layout.x + layout.bedW + 10;
    const standW = Math.max(36, Math.min(58, w - standX - 10));
    const lampOk = standX + standW < w - 4;
    if (lampOk) drawLamp(ctx, standX, layout.mattressTop - 8, env.lampOn && env.shedding <= 0, env.t);

    if (!env.hiding) {
      drawBlanket(ctx, layout);
      if (!(env.prank && env.prank.type === 'socks')) {
        drawSock(ctx, layout.x + 20, layout.mattressTop + 14, '#f7f4ea', -0.6, 0.85);
        drawSock(ctx, layout.x + 42, layout.mattressTop + 18, '#f2b8c4', 0.35, 0.85);
      }
      const hat = !!(env.anim.worn && env.anim.worn.hat);
      const footY = layout.mattressTop + 24;
      const scale = Math.min(scaleFor(footY, hat, 72), layout.bedW / 190);
      const sit = Object.assign({}, env.anim, { pose: 'sit' });
      placePet(ctx, layout.x + layout.bedW * 0.52, footY, scale, sit, env);
    } else {
      const eyeX = layout.x + layout.bedW * 0.5;
      const eyeY = layout.brickTop + layout.brickH * 0.45;
      const bob = Math.sin(env.t * 3) * 1;
      [-12, 12].forEach((dx) => {
        disc(ctx, eyeX + dx, eyeY + bob, 7, '#fffdf8');
        disc(ctx, eyeX + dx + 1, eyeY + bob, 3, '#14805c');
        disc(ctx, eyeX + dx - 1, eyeY + bob - 1, 1.2, '#fff');
      });
      env.anchors.head = { x: eyeX, y: eyeY - 16 };
      env.anchors.mouth = env.anchors.head;
      env.hotspots.push({ id: 'pet', x: eyeX - 28, y: eyeY - 16, w: 56, h: 36 });
    }
    env.hotspots.push({ id: 'power', x: 6, y: 100, w: 52, h: 60 });
    if (lampOk) env.hotspots.push({ id: 'lamp', x: standX - 6, y: layout.mattressTop - 16, w: Math.max(52, standW + 8), h: 64 });
    env.hotspots.push({
      id: 'under',
      x: layout.x + 8,
      y: layout.brickTop - 4,
      w: layout.bedW - 16,
      h: layout.brickH + 10
    });

    if (env.decor && env.decor.braai) {
      const bx = w - 78;
      const by = h - 36;
      box(ctx, bx, by, 46, 16, 3, '#4a4038');
      box(ctx, bx + 4, by - 8, 38, 10, 2, '#2a2420');
      const glow = 0.35 + Math.sin(env.t * 12) * 0.15;
      oval(ctx, bx + 23, by - 4, 12, 4, 'rgba(240,120,40,' + glow + ')');
    }

    if (env.sleeping && env.shedding <= 0) {
      ctx.fillStyle = 'rgba(48, 38, 72, 0.22)';
      ctx.fillRect(0, 0, w, h);
      if (env.anchors.head) {
        ctx.fillStyle = 'rgba(42,33,24,.8)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const zx = Math.min(w - 36, env.anchors.head.x + 28);
        ctx.font = '700 14px "Segoe UI", sans-serif';
        ctx.fillText('z', zx, env.anchors.head.y - 6);
        ctx.font = '700 18px "Segoe UI", sans-serif';
        ctx.fillText('z', zx + 12, env.anchors.head.y - 22);
        ctx.font = '700 24px "Segoe UI", sans-serif';
        ctx.fillText('Z', zx + 26, env.anchors.head.y - 42);
      }
    }
  }

  function shop(ctx, w, h, env) {
    if (photoReady('bg-stoep')) {
      coverBottom(ctx, art['bg-stoep'], w, h);
      ctx.fillStyle = 'rgba(255, 236, 214, 0.28)';
      ctx.fillRect(0, 0, w, h);
      const s = clamp(h / 420, 0.7, 1.2);
      placePet(ctx, w * 0.5, h - 2, s, env.anim, env);
      return;
    }
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#fdeff3');
    g.addColorStop(1, '#f6e0e7');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e7cbb8';
    ctx.fillRect(0, h - 28, w, 28);
    const hat = !!(env.anim.worn && env.anim.worn.hat);
    const footY = h - 8;
    const scale = scaleFor(footY, hat, 72);
    oval(ctx, w / 2, footY - 2, 54 * scale, 12, 'rgba(212,101,47,.16)');
    placePet(ctx, w / 2, footY, scale, env.anim, env);
  }

  function playroom(ctx, w, h, env) {
    if (photoReady('bg-bath')) {
      coverBottom(ctx, art['bg-bath'], w, h);
      ctx.fillStyle = 'rgba(255, 248, 236, 0.2)';
      ctx.fillRect(0, 0, w, h);
      const s = clamp(h / 460, 0.62, 1.05);
      placePet(ctx, w * 0.5, h - 2, s, Object.assign({}, env.anim, { sprite: 'happy' }), env);
      return;
    }
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#e7f6ea');
    g.addColorStop(1, '#d3ead8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    disc(ctx, w - 42, 36, 18, '#ffe28a');
    ctx.fillStyle = '#b7d7a8';
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h - 20, w * 0.45, 28, 0, 0, TAU);
    ctx.fill();
    const hat = !!(env.anim.worn && env.anim.worn.hat);
    const footY = h - 8;
    const scale = scaleFor(footY, hat, 64);
    placePet(ctx, w * 0.5, footY, scale, env.anim, env);
    disc(ctx, w * 0.22, h - 28, 12, '#e06a8a');
    disc(ctx, w * 0.22 - 3, h - 32, 4, 'rgba(255,255,255,.35)');
  }

  function drawFx(ctx, w, h, env) {
    if (env.prank && env.prank.type === 'socks') {
      const p = env.prank.p;
      const tx = env.anchors.head ? env.anchors.head.x : w * 0.6;
      const ty = env.anchors.head ? env.anchors.head.y : 80;
      drawSock(ctx, 40 + (tx - 40) * p, (h - 24) + (ty - (h - 24)) * p, '#f4efe6', -0.4, 1 - p * 0.6);
      drawSock(ctx, 70 + (tx + 16 - 70) * p, (h - 18) + (ty - (h - 18)) * p, '#f2b8c4', 0.2, 1 - p * 0.6);
    }
    if (env.prank && env.prank.type === 'honk' && env.anchors.hand) {
      ctx.globalAlpha = 0.35 + Math.sin(env.t * 16) * 0.15;
      ctx.fillStyle = '#d4652f';
      ctx.font = '800 22px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const hx = clamp(env.anchors.hand.x, 40, w - 40);
      const hy = clamp(env.anchors.hand.y - 8, 28, h - 10);
      ctx.fillText('HOOT', hx, hy);
      ctx.globalAlpha = 1;
    }
    if (env.dragging && env.anchors.mouth) {
      ctx.beginPath();
      ctx.arc(env.anchors.mouth.x, env.anchors.mouth.y, 20 + Math.sin(env.t * 8) * 2, 0, TAU);
      ctx.strokeStyle = 'rgba(212,101,47,.8)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function drawShed(ctx, w, h, env) {
    const flick = env.shedding > 5.4 ? (Math.sin(env.t * 46) * 0.5 + 0.5) : 0.12;
    ctx.fillStyle = 'rgba(18, 22, 48,' + (0.28 + flick * 0.12) + ')';
    ctx.fillRect(0, 0, w, h);
    const hx = env.anchors.hand ? env.anchors.hand.x : w * 0.62;
    const hy = env.anchors.hand ? env.anchors.hand.y - 20 : h * 0.45;
    const glow = ctx.createRadialGradient(hx, hy, 4, hx, hy, 70);
    glow.addColorStop(0, 'rgba(255,206,110,.55)');
    glow.addColorStop(1, 'rgba(255,160,40,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  function frame(ctx, w, h, env) {
    env.hotspots.length = 0;
    env.anchors.mouth = null;
    env.anchors.head = null;
    env.anchors.hand = null;
    env.marks.shower = null;
    if (!env.anim) return;
    if (env.room === 'kitchen') kitchen(ctx, w, h, env);
    else if (env.room === 'bath') bath(ctx, w, h, env);
    else if (env.room === 'stoep') stoep(ctx, w, h, env);
    else if (env.room === 'shop') shop(ctx, w, h, env);
    else playroom(ctx, w, h, env);

    if (env.shedding > 0) drawShed(ctx, w, h, env);
    if (!photoReady('happy') && env.anim.dirt > 0.28 && env.anim.alpha > 0.45 && !env.sleeping && !env.hiding) {
      drawFlies(ctx, env.anchors.head, env.t);
    }
    drawFx(ctx, w, h, env);
  }

  function treat(ctx, kind, x, y, rot) {
    ctx.save();
    ctx.translate(x, y);
    if (kind === 'coin') {
      const s = 0.35 + 0.65 * Math.abs(Math.cos(rot || 0));
      ctx.scale(s, 1);
      disc(ctx, 0, 0, 11, '#e6b341');
      disc(ctx, 0, 0, 7, '#f6d98a');
      ctx.restore();
      return;
    }
    ctx.rotate(rot || 0);
    if (kind === 'mielie') {
      oval(ctx, 0, 2, 8, 13, '#f2c431');
      disc(ctx, -3, -4, 1.4, '#ffe38a');
      disc(ctx, 2, -1, 1.4, '#ffe38a');
      disc(ctx, -1, 4, 1.4, '#ffe38a');
      oval(ctx, -7, 4, 3, 8, '#7dae45', -0.4);
    } else if (kind === 'vetkoek') {
      oval(ctx, 0, 2, 12, 9, '#f6c453');
      oval(ctx, -3, -2, 4, 2, 'rgba(255,255,255,.35)');
    } else if (kind === 'orange') {
      disc(ctx, 0, 1, 10, '#f28c28');
      oval(ctx, -3, -3, 3, 1.5, 'rgba(255,255,255,.4)');
      ctx.strokeStyle = '#3e8a45';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.quadraticCurveTo(4, -14, 7, -8);
      ctx.stroke();
    } else if (kind === 'chilli') {
      ctx.strokeStyle = '#d4533c';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 8);
      ctx.quadraticCurveTo(8, 0, 0, -10);
      ctx.stroke();
      ctx.strokeStyle = '#3e8a45';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.quadraticCurveTo(6, -14, 7, -8);
      ctx.stroke();
    }
    ctx.restore();
  }

  function taxi(ctx, x, y) {
    oval(ctx, x, y + 34, 26, 6, 'rgba(0,0,0,.15)');
    box(ctx, x - 24, y - 30, 48, 58, 10, '#f2c230');
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    roundRect(ctx, x - 18, y - 26, 10, 40, 4);
    ctx.fill();
    box(ctx, x - 16, y - 46, 32, 18, 6, '#f7f4ea');
    box(ctx, x - 14, y - 8, 28, 16, 4, '#243038');
    box(ctx, x - 18, y + 14, 10, 8, 2, '#2a2118');
    box(ctx, x + 8, y + 14, 10, 8, 2, '#2a2118');
    disc(ctx, x, y - 48, 4, '#fff');
  }

  function goat(ctx, x, y) {
    oval(ctx, x, y + 8, 16, 12, '#f3efe4');
    oval(ctx, x, y - 8, 12, 10, '#f7f4ea');
    oval(ctx, x - 10, y - 10, 5, 3, '#f3efe4', -0.6);
    oval(ctx, x + 10, y - 10, 5, 3, '#f3efe4', 0.6);
    ctx.strokeStyle = '#8a7568';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 16);
    ctx.quadraticCurveTo(x - 8, y - 26, x - 2, y - 20);
    ctx.moveTo(x + 4, y - 16);
    ctx.quadraticCurveTo(x + 8, y - 26, x + 2, y - 20);
    ctx.stroke();
    disc(ctx, x - 4, y - 8, 1.5, '#2a2118');
    disc(ctx, x + 4, y - 8, 1.5, '#2a2118');
    box(ctx, x - 8, y + 16, 4, 10, 1, '#d8d0c4');
    box(ctx, x + 4, y + 16, 4, 10, 1, '#d8d0c4');
  }

  function potjie(ctx, x, y) {
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 20, y + 6);
    ctx.lineTo(x - 30, y + 26);
    ctx.moveTo(x + 20, y + 6);
    ctx.lineTo(x + 30, y + 26);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 28);
    ctx.stroke();
    oval(ctx, x, y + 4, 32, 20, '#2c2c2c');
    oval(ctx, x, y, 32, 14, '#3a3a3a');
    oval(ctx, x, y - 8, 34, 10, '#4e4e4e');
    oval(ctx, x, y - 10, 24, 6, '#262626');
    oval(ctx, x - 10, y - 12, 8, 2.2, 'rgba(255,255,255,.28)');
  }

  T.makeAnim = makeAnim;
  T.draw = {
    frame: frame,
    pet: drawPet,
    scaleFor: scaleFor,
    disc: disc,
    oval: oval,
    box: box,
    treat: treat,
    taxi: taxi,
    goat: goat,
    potjie: potjie
  };
})(window.Toko = window.Toko || {});
