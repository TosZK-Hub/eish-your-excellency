/* Skeletal pet rig. Parts are bones: translate, rotate, scale. Original vector art. */
(function (B) {
  'use strict';

  const TAU = Math.PI * 2;
  const INK = '#3A271C';

  const PAL = {
    lion: { fur: '#F0B033', shade: '#D48922', light: '#FFE09A', belly: '#F8D7A8', accent: '#E06A22', accent2: '#C44E16', nose: '#C46A58', ear: '#F0A088', iris: '#E08A20' },
    leopard: { fur: '#F2C56A', shade: '#D9A44A', light: '#FFE3A0', belly: '#F8E2C0', accent: '#5C3A22', accent2: '#E8C27A', nose: '#C4886A', ear: '#F0B0A0', iris: '#6E9A48' },
    elephant: { fur: '#C8C0B0', shade: '#9A9284', light: '#E6E0D4', belly: '#D9D2C6', accent: '#F0B0B4', accent2: '#E09098', nose: '#8A8074', ear: '#F0B0B4', iris: '#6A5346' },
    rhino: { fur: '#B7B7A4', shade: '#8E8E78', light: '#DCD8C6', belly: '#C9C6B4', accent: '#F0E2C0', accent2: '#D4C4A0', nose: '#7A7A68', ear: '#E0B0A8', iris: '#6E7A55' },
    buffalo: { fur: '#5C4034', shade: '#3E2A22', light: '#7A5844', belly: '#6A4A3A', accent: '#F0E2C0', accent2: '#D8C49A', nose: '#3A2A22', ear: '#C48878', iris: '#E0A040' }
  };

  function ell(ctx, x, y, rx, ry, fill, stroke) {
    if (!(rx > 0) || !(ry > 0)) return;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  }

  function volume(ctx, x, y, rx, ry, fur, shade, light) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fillStyle = fur;
    ctx.fill();
    ctx.clip();
    ctx.beginPath();
    ctx.ellipse(x + rx * 0.34, y + ry * 0.36, rx * 0.48, ry * 0.4, 0.35, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - rx * 0.32, y - ry * 0.34, rx * 0.36, ry * 0.26, -0.5, 0, TAU);
    ctx.fillStyle = light;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }

  function flick(t, seed) {
    const period = 4.2 + seed;
    const x = (t + seed * 1.7) % period;
    if (x < 0.16) return Math.sin((x / 0.16) * Math.PI) * 0.42;
    return 0;
  }

  function blinkAt(t) {
    const cycle = t % 3.6;
    if (cycle > 3.28) return Math.sin(((cycle - 3.28) / 0.32) * Math.PI);
    return 0;
  }

  function poseOf(anim) {
    const t = anim.t || 0;
    const breath = Math.sin(t * 2.2);
    const eating = anim.mouth === 'open';
    let blink = anim.eyes === 'shut' ? 1 : Math.max(anim.lid || 0, blinkAt(t));
    if (anim.eyes === 'happy') blink = 1;
    return {
      breath: breath,
      sx: 1 - breath * 0.018 - (anim.squash || 0) * 0.5,
      sy: 1 + breath * 0.03 + (anim.squash || 0),
      bob: (anim.happy ? Math.abs(Math.sin(t * 6)) * -7 : 0) + (anim.pose === 'sit' ? 8 : 0) + (anim.hop || 0),
      lookX: anim.lookX || 0,
      lookY: anim.lookY || 0,
      headRot: (anim.lookX || 0) * 0.045 + Math.sin(t * 1.4) * 0.02,
      tail: Math.sin(t * 2.7) * 0.42 + (anim.pose === 'run' ? Math.sin(t * 14) * 0.2 : 0),
      earL: flick(t, 0.4),
      earR: flick(t, 2.2),
      leg: anim.pose === 'run' ? Math.sin(t * 12) : Math.sin(t * 1.7) * 0.06,
      blink: blink,
      happy: anim.eyes === 'happy',
      chomp: eating ? 0.45 + Math.abs(Math.sin(t * 14)) * 0.55 : (anim.mouth === 'grin' ? 0.22 : 0),
      curl: Math.sin(t * 1.8) * 0.18 + (anim.spray || 0)
    };
  }

  function eye(ctx, x, y, s, pose, iris, fur) {
    ctx.save();
    ctx.translate(x, y);
    if (pose.happy || pose.blink > 0.92) {
      ctx.beginPath();
      ctx.lineWidth = Math.max(3, s * 0.22);
      ctx.strokeStyle = INK;
      ctx.lineCap = 'round';
      ctx.arc(0, s * 0.2, s * 0.78, Math.PI, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 1.08, 0, 0, TAU);
    ctx.fillStyle = '#FFFCFA';
    ctx.fill();
    ctx.lineWidth = Math.max(2.6, s * 0.16);
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.9, s * 0.98, 0, 0, TAU);
    ctx.clip();
    const lx = pose.lookX * s * 0.22;
    const ly = pose.lookY * s * 0.14;
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(lx, ly, s * 0.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#24170F';
    ctx.beginPath();
    ctx.arc(lx, ly + s * 0.05, s * 0.26, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(lx - s * 0.2, ly - s * 0.22, s * 0.15, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx + s * 0.16, ly + s * 0.14, s * 0.06, 0, TAU);
    ctx.fill();
    if (pose.blink > 0.02) {
      ctx.fillStyle = fur;
      ctx.fillRect(-s * 2, -s * 1.4, s * 4, pose.blink * s * 2.3);
    }
    ctx.restore();
    ctx.restore();
  }

  function smile(ctx, y, w, open) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.2;
    if (open > 0.35) {
      const h = 6 + open * 10;
      ctx.beginPath();
      ctx.ellipse(0, y, w * 0.55, h, 0, 0, TAU);
      ctx.fillStyle = '#6A3030';
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, y + h * 0.35, w * 0.32, h * 0.35, 0, 0, TAU);
      ctx.fillStyle = '#E07A7A';
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.arc(0, y - w * 0.35, w, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();
  }

  function catNose(ctx, y, s, color) {
    ctx.beginPath();
    ctx.moveTo(0, y + s * 0.7);
    ctx.quadraticCurveTo(-s, y, -s * 0.7, y - s * 0.45);
    ctx.quadraticCurveTo(0, y - s * 0.05, s * 0.7, y - s * 0.45);
    ctx.quadraticCurveTo(s, y, 0, y + s * 0.7);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }

  function limb(ctx, x, y, len, w, rot, fur, shade) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(-w * 0.42, 2);
    ctx.quadraticCurveTo(-w * 0.62, len * 0.62, -w * 0.7, len);
    ctx.quadraticCurveTo(0, len + w * 0.55, w * 0.7, len);
    ctx.quadraticCurveTo(w * 0.62, len * 0.62, w * 0.42, 2);
    ctx.closePath();
    ctx.fillStyle = fur;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(w * 0.15, len * 0.55, w * 0.22, len * 0.22, 0.4, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.restore();
  }

  function tail(ctx, spec, pose, fur, spots) {
    const tailSpec = spec.tail;
    ctx.save();
    ctx.translate(tailSpec.x, tailSpec.y);
    ctx.rotate(-0.55 + pose.tail);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-tailSpec.len * 0.35, tailSpec.len * 0.45, -6, tailSpec.len);
    ctx.strokeStyle = INK;
    ctx.lineWidth = tailSpec.w + 5;
    ctx.stroke();
    ctx.strokeStyle = fur;
    ctx.lineWidth = tailSpec.w;
    ctx.stroke();
    ell(ctx, -6, tailSpec.len, tailSpec.tuft, tailSpec.tuft * 0.8, spec.pal.accent, true);
    if (spots) {
      for (let i = 1; i <= 3; i++) {
        ell(ctx, -4, tailSpec.len * (i / 4), 3.2, 2.6, spec.pal.accent, false);
      }
    }
    ctx.restore();
  }

  function ear(ctx, x, y, dir, rot, rx, ry, fur, inner, spot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(dir * -0.4 + rot * dir);
    ell(ctx, 0, 0, rx, ry, fur, true);
    ell(ctx, 0, 4, rx * 0.55, ry * 0.55, inner, false);
    if (spot) ell(ctx, 0, -ry * 0.15, rx * 0.45, ry * 0.35, '#3A271C', false);
    ctx.restore();
  }

  function maneRing(ctx, r, n, dist, rad, pal, skipChin) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / n) * TAU;
      const down = Math.sin(a);
      if (skipChin && down > 0.55) continue;
      const color = i % 2 ? pal.accent : pal.accent2;
      ell(ctx, Math.cos(a) * dist, Math.sin(a) * dist, rad, rad * 0.92, color, true);
    }
  }

  function rosette(ctx, x, y, r) {
    ctx.fillStyle = '#5C3A22';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#E8C27A';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.58, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#3E2918';
    [[0, -0.22], [-0.24, 0.16], [0.24, 0.16]].forEach(function (d) {
      ctx.beginPath();
      ctx.arc(x + d[0] * r, y + d[1] * r, r * 0.16, 0, TAU);
      ctx.fill();
    });
  }

  function faceCat(ctx, spec, pose) {
    const h = spec.head;
    const s = h.r * spec.eye;
    const gap = h.r * 0.34;
    const fur = spec.pal.fur;
    eye(ctx, -gap, -h.r * 0.06, s, pose, spec.pal.iris, fur);
    eye(ctx, gap, -h.r * 0.06, s, pose, spec.pal.iris, fur);
    ell(ctx, 0, h.r * 0.28, h.r * 0.46, h.r * 0.34, spec.pal.belly, false);
    catNose(ctx, h.r * 0.22, h.r * 0.16, spec.pal.nose);
    smile(ctx, h.r * 0.48, h.r * 0.28, pose.chomp);
    ctx.globalAlpha = 0.45;
    ell(ctx, -h.r * 0.42, h.r * 0.22, h.r * 0.16, h.r * 0.1, '#F0A0A8', false);
    ell(ctx, h.r * 0.42, h.r * 0.22, h.r * 0.16, h.r * 0.1, '#F0A0A8', false);
    ctx.globalAlpha = 1;
  }

  function drawCat(ctx, spec, pose, anim) {
    const pal = spec.pal;
    const h = spec.head;
    limb(ctx, spec.hipB[0], spec.hipY, spec.legB, spec.legW, pose.leg, pal.fur, pal.shade);
    limb(ctx, spec.hipB[1], spec.hipY, spec.legB, spec.legW, -pose.leg, pal.fur, pal.shade);
    volume(ctx, spec.body.x, spec.body.y, spec.body.rx, spec.body.ry, pal.fur, pal.shade, pal.light);
    ell(ctx, 4, spec.body.y + spec.body.ry * 0.15, spec.body.rx * 0.48, spec.body.ry * 0.42, pal.belly, false);
    if (spec.kind === 'leopard') {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(spec.body.x, spec.body.y, spec.body.rx * 0.9, spec.body.ry * 0.86, 0, 0, TAU);
      ctx.clip();
      spec.spots.forEach(function (s) {
        rosette(ctx, spec.body.x + s[0] * spec.body.rx, spec.body.y + s[1] * spec.body.ry, s[2] * spec.body.rx);
      });
      ctx.restore();
    }
    const hold = anim.hold === 'candle';
    limb(ctx, spec.hipF[0], spec.hipY + 8, spec.legF, spec.legW * 0.92, pose.leg * 0.6, pal.fur, pal.shade);
    limb(ctx, spec.hipF[1], spec.hipY + 6, spec.legF, spec.legW * 0.92, hold ? -1.15 : -pose.leg * 0.6, pal.fur, pal.shade);
    if (hold) candle(ctx, spec.hipF[1] + 18, spec.hipY + spec.legF * 0.2);
    tail(ctx, spec, pose, pal.fur, spec.kind === 'leopard');

    ctx.save();
    ctx.translate(h.x + pose.lookX * 1.4, h.y);
    ctx.rotate(pose.headRot);
    if (spec.mane === 'full') maneRing(ctx, h.r, 12, h.r * 0.78, h.r * 0.42, pal, false);
    else if (spec.mane === 'ruff') maneRing(ctx, h.r, 9, h.r * 0.9, h.r * 0.28, pal, true);
    ear(ctx, -spec.ear.dx, spec.ear.dy, -1, pose.earL, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, spec.kind === 'leopard');
    ear(ctx, spec.ear.dx, spec.ear.dy, 1, pose.earR, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, spec.kind === 'leopard');
    volume(ctx, 0, 0, h.r, h.r * 0.96, pal.fur, pal.shade, pal.light);
    if (spec.kind === 'leopard') {
      rosette(ctx, -h.r * 0.28, -h.r * 0.35, h.r * 0.16);
      rosette(ctx, h.r * 0.32, -h.r * 0.22, h.r * 0.13);
    }
    faceCat(ctx, spec, pose);
    if (spec.mane === 'tuft') {
      ell(ctx, 0, -h.r * 1.02, h.r * 0.24, h.r * 0.2, pal.accent, true);
      ell(ctx, -h.r * 0.95, -h.r * 0.35, h.r * 0.22, h.r * 0.18, pal.accent2, true);
      ell(ctx, h.r * 0.95, -h.r * 0.35, h.r * 0.22, h.r * 0.18, pal.accent, true);
    } else if (spec.mane === 'full') {
      ell(ctx, 0, h.r * 0.88, h.r * 0.34, h.r * 0.26, pal.accent, true);
    }
    cosmetics(ctx, spec, anim, pose);
    ctx.restore();
  }

  function trunk(ctx, curl, len, skin, shade) {
    ctx.save();
    ctx.translate(10, 16);
    ctx.rotate(0.2);
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.bezierCurveTo(-16, len * 0.45, -18 - curl * 26, len * 0.75, -6 - curl * 30, len);
    ctx.bezierCurveTo(2 - curl * 18, len + 8, 12, len * 0.8, 12, len * 0.62);
    ctx.bezierCurveTo(16, len * 0.35, 14, len * 0.12, 11, 0);
    ctx.closePath();
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-2, len * 0.45, 5, len * 0.18, 0.4, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.fillStyle = '#5C5348';
    ctx.beginPath();
    ctx.arc(-4 - curl * 12, len - 2, 2.5, 0, TAU);
    ctx.arc(3 - curl * 8, len - 4, 2.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function tusk(ctx, x, y, len, dir) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + dir * len * 0.8, y + len * 0.2, x + dir * len * 0.35, y + len);
    ctx.quadraticCurveTo(x + dir * 2, y + len * 0.45, x, y);
    ctx.fillStyle = '#F4E6C8';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }

  function drawElephant(ctx, spec, pose, anim) {
    const pal = spec.pal;
    const h = spec.head;
    limb(ctx, spec.hipB[0], spec.hipY, spec.legB, spec.legW, pose.leg * 0.4, pal.fur, pal.shade);
    limb(ctx, spec.hipB[1], spec.hipY, spec.legB, spec.legW, -pose.leg * 0.4, pal.fur, pal.shade);
    volume(ctx, spec.body.x, spec.body.y, spec.body.rx, spec.body.ry, pal.fur, pal.shade, pal.light);
    ell(ctx, 6, spec.body.y + 8, spec.body.rx * 0.42, spec.body.ry * 0.36, pal.belly, false);
    limb(ctx, spec.hipF[0], spec.hipY + 10, spec.legF, spec.legW, 0.05, pal.fur, pal.shade);
    limb(ctx, spec.hipF[1], spec.hipY + 8, spec.legF, spec.legW, anim.hold === 'candle' ? -0.8 : -0.05, pal.fur, pal.shade);
    if (anim.hold === 'candle') candle(ctx, spec.hipF[1] + 16, spec.hipY);
    tail(ctx, spec, pose, pal.fur, false);

    ctx.save();
    ctx.translate(h.x + pose.lookX * 1.2, h.y);
    ctx.rotate(pose.headRot);
    ear(ctx, -spec.ear.dx, spec.ear.dy, -1, pose.earL, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, false);
    ear(ctx, spec.ear.dx, spec.ear.dy, 1, pose.earR, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, false);
    volume(ctx, 0, 0, h.r * 1.05, h.r * 0.92, pal.fur, pal.shade, pal.light);
    const s = h.r * spec.eye;
    eye(ctx, -h.r * 0.38, -h.r * 0.12, s, pose, pal.iris, pal.fur);
    eye(ctx, h.r * 0.32, -h.r * 0.12, s, pose, pal.iris, pal.fur);
    ctx.globalAlpha = 0.4;
    ell(ctx, -h.r * 0.48, h.r * 0.1, h.r * 0.12, h.r * 0.08, '#F0A0A8', false);
    ell(ctx, h.r * 0.42, h.r * 0.1, h.r * 0.12, h.r * 0.08, '#F0A0A8', false);
    ctx.globalAlpha = 1;
    trunk(ctx, pose.curl, spec.trunk, pal.fur, pal.shade);
    if (spec.tusk > 4) {
      tusk(ctx, -22, 8, spec.tusk, -1);
      tusk(ctx, 20, 10, spec.tusk * 0.8, 1);
    }
    cosmetics(ctx, spec, anim, pose);
    ctx.restore();
  }

  function horn(ctx, x, y, len, girth) {
    ctx.beginPath();
    ctx.moveTo(x - girth, y);
    ctx.quadraticCurveTo(x - girth * 0.2, y - len * 0.65, x + 1, y - len);
    ctx.quadraticCurveTo(x + girth * 0.45, y - len * 0.4, x + girth * 0.35, y);
    ctx.closePath();
    ctx.fillStyle = '#F0E2C0';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - girth * 0.2, y - 2);
    ctx.quadraticCurveTo(x, y - len * 0.55, x + 1, y - len + 3);
    ctx.strokeStyle = '#D4C4A0';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawRhino(ctx, spec, pose, anim) {
    const pal = spec.pal;
    const h = spec.head;
    limb(ctx, spec.hipB[0], spec.hipY, spec.legB, spec.legW, pose.leg * 0.25, pal.fur, pal.shade);
    limb(ctx, spec.hipB[1], spec.hipY, spec.legB, spec.legW, -pose.leg * 0.25, pal.fur, pal.shade);
    volume(ctx, spec.body.x, spec.body.y, spec.body.rx, spec.body.ry, pal.fur, pal.shade, pal.light);
    ctx.strokeStyle = pal.shade;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(spec.body.x - 6, spec.body.y, spec.body.rx * 0.45, 0.2, 1.4);
    ctx.stroke();
    limb(ctx, spec.hipF[0], spec.hipY + 6, spec.legF, spec.legW, 0.04, pal.fur, pal.shade);
    limb(ctx, spec.hipF[1], spec.hipY + 4, spec.legF, spec.legW, anim.hold === 'candle' ? -0.7 : -0.04, pal.fur, pal.shade);
    if (anim.hold === 'candle') candle(ctx, 36, spec.hipY);
    tail(ctx, spec, pose, pal.fur, false);

    ctx.save();
    ctx.translate(h.x + pose.lookX, h.y);
    ctx.rotate(pose.headRot);
    ear(ctx, -spec.ear.dx, spec.ear.dy, -1, pose.earL, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, false);
    ear(ctx, spec.ear.dx, spec.ear.dy, 1, pose.earR, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, false);
    volume(ctx, 8, 6, h.r * 1.15, h.r * 0.78, pal.fur, pal.shade, pal.light);
    horn(ctx, 18, -h.r * 0.15, spec.horn, 7 + spec.stage);
    if (spec.horn2) horn(ctx, 2, -h.r * 0.35, spec.horn2, 5);
    const s = h.r * spec.eye;
    eye(ctx, -h.r * 0.15, -h.r * 0.05, s, pose, pal.iris, pal.fur);
    eye(ctx, h.r * 0.55, -h.r * 0.02, s, pose, pal.iris, pal.fur);
    ell(ctx, h.r * 0.85, h.r * 0.28, h.r * 0.28, h.r * 0.2, pal.shade, true);
    smile(ctx, h.r * 0.42, h.r * 0.2, pose.chomp * 0.6);
    cosmetics(ctx, spec, anim, pose);
    ctx.restore();
  }

  function buffaloHorns(ctx, r, stage) {
    const hornCol = '#F0E2C0';
    if (stage === 1) {
      ell(ctx, -16, -r * 0.9, 8, 11, hornCol, true);
      ell(ctx, 16, -r * 0.9, 8, 11, hornCol, true);
      return;
    }
    ell(ctx, 0, -r * 0.72, r * 0.62, r * 0.26, hornCol, true);
    const len = stage === 2 ? r * 0.42 : r * 0.7;
    [-1, 1].forEach(function (dir) {
      ctx.save();
      ctx.translate(dir * r * 0.2, -r * 0.62);
      ctx.rotate(dir * (stage === 3 ? 1.05 : 0.55));
      ell(ctx, 0, -len * 0.45, r * 0.16, len * 0.55, hornCol, true);
      ctx.restore();
    });
  }

  function drawBuffalo(ctx, spec, pose, anim) {
    const pal = spec.pal;
    const h = spec.head;
    limb(ctx, spec.hipB[0], spec.hipY, spec.legB, spec.legW, pose.leg * 0.3, pal.fur, pal.shade);
    limb(ctx, spec.hipB[1], spec.hipY, spec.legB, spec.legW, -pose.leg * 0.3, pal.fur, pal.shade);
    volume(ctx, spec.body.x, spec.body.y, spec.body.rx, spec.body.ry, pal.fur, pal.shade, pal.light);
    limb(ctx, spec.hipF[0], spec.hipY + 6, spec.legF, spec.legW, 0.05, pal.fur, pal.shade);
    limb(ctx, spec.hipF[1], spec.hipY + 4, spec.legF, spec.legW, anim.hold === 'candle' ? -0.75 : -0.05, pal.fur, pal.shade);
    if (anim.hold === 'candle') candle(ctx, 34, spec.hipY);
    tail(ctx, spec, pose, pal.fur, false);

    ctx.save();
    ctx.translate(h.x + pose.lookX, h.y);
    ctx.rotate(pose.headRot);
    ear(ctx, -spec.ear.dx, spec.ear.dy, -1, pose.earL + 0.5, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, false);
    ear(ctx, spec.ear.dx, spec.ear.dy, 1, pose.earR + 0.5, spec.ear.rx, spec.ear.ry, pal.fur, pal.ear, false);
    volume(ctx, 0, 4, h.r * 1.08, h.r * 0.9, pal.fur, pal.shade, pal.light);
    buffaloHorns(ctx, h.r, spec.stage);
    const s = h.r * spec.eye;
    eye(ctx, -h.r * 0.32, -h.r * 0.02, s, pose, pal.iris, pal.fur);
    eye(ctx, h.r * 0.32, -h.r * 0.02, s, pose, pal.iris, pal.fur);
    ell(ctx, 0, h.r * 0.38, h.r * 0.42, h.r * 0.28, pal.nose, true);
    smile(ctx, h.r * 0.5, h.r * 0.22, pose.chomp * 0.5);
    ell(ctx, 0, h.r * 0.78, 10, 12, pal.shade, true);
    cosmetics(ctx, spec, anim, pose);
    ctx.restore();
  }

  function candle(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ell(ctx, 0, 10, 6, 12, '#F4E6C8', true);
    ctx.fillStyle = '#F0A020';
    ctx.beginPath();
    ctx.ellipse(0, -6, 4, 7, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#FFF6E8';
    ctx.beginPath();
    ctx.ellipse(0, -8, 2, 3.5, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function hat(ctx, r, id) {
    if (id === 'flower') {
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * TAU / 5;
        ell(ctx, Math.cos(a) * 8, -r - 6 + Math.sin(a) * 6, 6, 5, i % 2 ? '#F0A0A8' : '#E07A3C', true);
      }
      ell(ctx, 0, -r - 6, 4, 4, '#F0A020', true);
      return;
    }
    const brim = id === 'safari' ? r * 0.95 : r * 0.78;
    ell(ctx, 0, -r * 0.72, brim, 8, id === 'safari' ? '#C4A574' : '#E7C49A', true);
    ell(ctx, 0, -r * 0.95, r * 0.48, r * 0.32, id === 'safari' ? '#A88858' : '#F0B033', true);
  }

  function neckwear(ctx, r, id) {
    const y = r * 0.78;
    if (id === 'beads') {
      [[-16, '#E07A3C'], [-6, '#2E9A90'], [4, '#F0A020'], [14, '#F0A0A8']].forEach(function (b) {
        ell(ctx, b[0], y, 5.5, 5.5, b[1], true);
      });
    } else if (id === 'bandana') {
      ell(ctx, 0, y, r * 0.55, 7, '#E07A3C', true);
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(16, y + 16);
      ctx.lineTo(4, y + 8);
      ctx.fillStyle = '#C45A1A';
      ctx.fill();
      ctx.stroke();
    } else if (id === 'scarf') {
      ell(ctx, 0, y, r * 0.6, 8, '#1F6B3A', true);
      ctx.fillStyle = '#F0A020';
      ctx.fillRect(-r * 0.5, y - 2, r, 4);
      ctx.fillStyle = '#1F6B3A';
      ctx.fillRect(8, y, 8, 18);
      ctx.strokeRect(8, y, 8, 18);
    }
  }

  function cosmetics(ctx, spec, anim) {
    const worn = anim.worn || {};
    const r = spec.head.r;
    if (worn.hat) hat(ctx, r, worn.hat);
    if (worn.neck) neckwear(ctx, r, worn.neck);
    if (worn.charm === 'bell') {
      ell(ctx, 0, r * 0.9, 7, 8, '#F0A020', true);
      ell(ctx, 0, r * 0.95, 2, 2, '#3A271C', false);
    }
    if (worn.charm === 'sun' || anim.legend) {
      ctx.save();
      ctx.translate(0, -r * 0.15);
      ctx.strokeStyle = '#F0A020';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5);
        ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10);
        ctx.stroke();
      }
      ell(ctx, 0, 0, 4, 4, '#F0A020', true);
      ctx.restore();
    }
    if (worn.face === 'shades') {
      ell(ctx, -r * 0.32, -r * 0.02, r * 0.28, r * 0.2, '#2C241C', true);
      ell(ctx, r * 0.32, -r * 0.02, r * 0.28, r * 0.2, '#2C241C', true);
      ctx.strokeStyle = '#2C241C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-r * 0.08, -r * 0.02);
      ctx.lineTo(r * 0.08, -r * 0.02);
      ctx.stroke();
    }
    if (anim.legend) {
      ctx.strokeStyle = '#F0A020';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-spec.ear.dx, spec.ear.dy, spec.ear.rx + 2, 0, TAU);
      ctx.stroke();
    }
  }

  function spotsFor(stage) {
    const baby = [[-0.45, -0.2, 0.2], [0.4, -0.25, 0.18], [0.15, 0.35, 0.16], [-0.2, 0.2, 0.17]];
    const young = baby.concat([[0.5, 0.15, 0.15], [-0.5, 0.25, 0.16], [0.05, -0.45, 0.14]]);
    const adult = young.concat([[-0.15, -0.05, 0.16], [0.25, 0.05, 0.15], [0, 0.05, 0.13]]);
    return stage === 1 ? baby : stage === 2 ? young : adult;
  }

  function specFor(id, stage) {
    const s = stage < 1 ? 1 : stage > 3 ? 3 : stage | 0;
    const pal = PAL[id] || PAL.lion;
    const k = s - 1;
    if (id === 'elephant') {
      return {
        kind: 'elephant', stage: s, pal: pal, eye: 0.2 - k * 0.012,
        body: { x: 0, y: -70 - k * 8, rx: 62 + k * 6, ry: 48 + k * 4 },
        head: { x: 4, y: -132 - k * 14, r: 46 - k * 2 },
        ear: { dx: 34 + k * 6, dy: -8, rx: 28 + k * 12, ry: 36 + k * 14 },
        hipB: [-36 - k * 2, 36 + k * 2], hipF: [-18, 22], hipY: -36 - k * 4,
        legB: 30 + k * 8, legF: 28 + k * 8, legW: 16 + k,
        tail: { x: -48, y: -78 - k * 6, len: 28 + k * 6, w: 7, tuft: 8 },
        trunk: 46 + k * 16, tusk: k === 0 ? 0 : 8 + k * 8
      };
    }
    if (id === 'rhino') {
      return {
        kind: 'rhino', stage: s, pal: pal, eye: 0.16,
        body: { x: -4, y: -68 - k * 6, rx: 70 + k * 4, ry: 46 + k * 2 },
        head: { x: 18, y: -118 - k * 10, r: 36 },
        ear: { dx: 28, dy: -30, rx: 8, ry: 12 },
        hipB: [-40, 28], hipF: [-8, 30], hipY: -32 - k * 2,
        legB: 32 + k * 6, legF: 30 + k * 6, legW: 18,
        tail: { x: -62, y: -70, len: 26, w: 6, tuft: 8 },
        horn: 12 + k * 14, horn2: s === 3 ? 12 : 0
      };
    }
    if (id === 'buffalo') {
      return {
        kind: 'buffalo', stage: s, pal: pal, eye: 0.18,
        body: { x: 0, y: -72 - k * 6, rx: 64 + k * 4, ry: 48 + k * 2 },
        head: { x: 6, y: -130 - k * 12, r: 42 - k },
        ear: { dx: 40, dy: 4, rx: 12, ry: 16 },
        hipB: [-34, 34], hipF: [-16, 24], hipY: -34 - k * 3,
        legB: 32 + k * 7, legF: 30 + k * 7, legW: 16,
        tail: { x: -50, y: -74, len: 30 + k * 8, w: 7, tuft: 10 + k * 2 }
      };
    }
    const lion = id !== 'leopard';
    return {
      kind: lion ? 'lion' : 'leopard', stage: s, pal: pal,
      eye: lion ? 0.3 - k * 0.02 : 0.28 - k * 0.02,
      body: { x: 0, y: -64 - k * 8, rx: (lion ? 54 : 50) + k * 5, ry: (lion ? 46 : 42) + k * 3 },
      head: { x: 0, y: -128 - k * 16, r: (lion ? 50 : 46) - k * 4 },
      ear: {
        dx: lion ? 38 - k * 2 : 36,
        dy: lion ? -36 - k * 2 : -34,
        rx: 15, ry: 18
      },
      hipB: [-30 - k * 2, 30 + k * 2], hipF: [-16, 20], hipY: -30 - k * 4,
      legB: 28 + k * 8, legF: 26 + k * 8, legW: 14,
      tail: {
        x: lion ? -40 : -42,
        y: -76 - k * 6,
        len: (lion ? 34 : 48) + k * 12,
        w: lion ? 9 : 8,
        tuft: (lion ? 11 : 8) + k * 3
      },
      mane: lion ? (s === 1 ? 'tuft' : s === 2 ? 'ruff' : 'full') : 'none',
      spots: lion ? [] : spotsFor(s)
    };
  }

  function overlay(ctx, spec, anim) {
    if (anim.dirt > 0.08) {
      ctx.globalAlpha = Math.min(0.55, anim.dirt);
      [[-20, spec.body.y], [24, spec.body.y + 10], [6, spec.body.y - 16], [-8, spec.head.y + 20]].forEach(function (p) {
        ell(ctx, p[0], p[1], 7, 5, '#8A6238', false);
      });
      ctx.globalAlpha = 1;
    }
    if (anim.foam > 0.05) {
      const t = anim.t || 0;
      for (let i = 0; i < 6; i++) {
        const y = spec.body.y - 10 + (i % 3) * 16 + Math.sin(t * 3 + i) * 2;
        ell(ctx, -28 + i * 12, y, 6 + (i % 2) * 2, 5, 'rgba(255,255,255,.9)', false);
      }
    }
  }

  function drawAnimal(ctx, spec, pose, anim) {
    if (spec.kind === 'elephant') drawElephant(ctx, spec, pose, anim);
    else if (spec.kind === 'rhino') drawRhino(ctx, spec, pose, anim);
    else if (spec.kind === 'buffalo') drawBuffalo(ctx, spec, pose, anim);
    else drawCat(ctx, spec, pose, anim);
    overlay(ctx, spec, anim);
  }

  function screenPoint(ctx, x, y) {
    const m = ctx.getTransform();
    return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
  }

  B.art = {
    anchors: { mouth: null, head: null, body: null },
    specFor: specFor,
    poseOf: poseOf,
    drawPet: function (ctx, x, feetY, scale, anim) {
      const species = anim.species || 'lion';
      const stage = anim.stage || 1;
      const spec = specFor(species, stage);
      const pose = poseOf(anim);
      const grow = stage >= 3 ? 1.12 : stage === 2 ? 1.06 : 1;
      ctx.save();
      ctx.translate(x, feetY + pose.bob);
      ctx.scale(scale * grow * pose.sx, scale * grow * pose.sy);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.globalAlpha = anim.alpha == null ? 1 : anim.alpha;
      ell(ctx, 0, 6, spec.body.rx * 0.72, 10, 'rgba(58,39,24,0.13)', false);
      drawAnimal(ctx, spec, pose, anim);
      const mouth = screenPoint(ctx, spec.head.x, spec.head.y + spec.head.r * 0.35);
      const head = screenPoint(ctx, spec.head.x, spec.head.y);
      const body = screenPoint(ctx, 0, spec.body.y);
      ctx.restore();
      B.art.anchors = { mouth: mouth, head: head, body: body };
      return B.art.anchors;
    }
  };
})(window.Big5 = window.Big5 || {});
