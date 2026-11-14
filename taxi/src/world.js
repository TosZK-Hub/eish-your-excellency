/**
 * Flat-vector rank. Canvas 2D, top-down, no images.
 * Rules stay in engine.js. This module only draws them.
 */

import { DIRS, taxiCells } from './engine.js';
import { colorHex, REGIONS } from './theme.js';

const SKINS = ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac'];
const CLOTHES = ['#2f6fed', '#e23d3d', '#3e9b4f', '#7a4e9a', '#f07a2a', '#1f8a84'];

function hex(index, colorblind) {
  return `#${colorHex(index, colorblind).toString(16).padStart(6, '0')}`;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function easeOut(u) {
  return 1 - (1 - u) * (1 - u);
}

function lerp(a, b, u) {
  return a + (b - a) * u;
}

function lerpAngle(a, b, u) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * u;
}

/** Nose points up. Local origin is the body centre. Length grows with the cell count. */
export function drawCombi(ctx, opts) {
  const len = opts.len || 3;
  const L = opts.length || (52 + len * 18);
  const W = opts.width || Math.min(L * 0.42, 54);
  const color = opts.color || '#e23d3d';
  const alt = opts.alt;
  ctx.save();

  ctx.fillStyle = 'rgba(28, 36, 48, 0.16)';
  roundRect(ctx, -W * 0.46, -L * 0.46 + 5, W * 0.92, L * 0.92, W * 0.28);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, -W / 2, -L / 2, W, L, W * 0.22);
  ctx.fill();
  ctx.fillStyle = '#e7edf2';
  roundRect(ctx, -W / 2, L * 0.34, W, L * 0.16, W * 0.1);
  ctx.fill();

  ctx.fillStyle = '#2c323a';
  const wheelW = Math.max(5, W * 0.14);
  const wheelH = L * 0.18;
  for (const side of [-1, 1]) {
    roundRect(ctx, side * (W * 0.5) - wheelW / 2, -L * 0.32, wheelW, wheelH, 3);
    ctx.fill();
    roundRect(ctx, side * (W * 0.5) - wheelW / 2, L * 0.12, wheelW, wheelH, 3);
    ctx.fill();
  }

  if (!opts.tarp) {
    ctx.fillStyle = color;
    roundRect(ctx, -W / 2 + 1, -L * 0.02, W * 0.09, L * 0.42, 2);
    ctx.fill();
    ctx.fillStyle = alt || color;
    roundRect(ctx, W / 2 - W * 0.09 - 1, -L * 0.02, W * 0.09, L * 0.42, 2);
    ctx.fill();

    ctx.fillStyle = '#243044';
    roundRect(ctx, -W * 0.4, -L * 0.22, W * 0.16, L * 0.48, 5);
    ctx.fill();
    roundRect(ctx, W * 0.24, -L * 0.22, W * 0.16, L * 0.48, 5);
    ctx.fill();
    roundRect(ctx, -W * 0.28, -L * 0.36, W * 0.56, L * 0.12, 4);
    ctx.fill();
    roundRect(ctx, -W * 0.18, L * 0.28, W * 0.36, L * 0.08, 3);
    ctx.fill();

    ctx.fillStyle = '#f7f8fb';
    roundRect(ctx, -W * 0.22, -L * 0.18, W * 0.44, L * 0.42, 8);
    ctx.fill();

    ctx.fillStyle = '#d7dee6';
    roundRect(ctx, -W * 0.08, L * 0.08, W * 0.16, L * 0.05, 2);
    ctx.fill();

    ctx.fillStyle = color;
    roundRect(ctx, -W * 0.16, -L * 0.1, W * 0.32, L * 0.2, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -L * 0.07);
    ctx.lineTo(W * 0.07, L * 0.01);
    ctx.lineTo(W * 0.025, L * 0.01);
    ctx.lineTo(W * 0.025, L * 0.06);
    ctx.lineTo(-W * 0.025, L * 0.06);
    ctx.lineTo(-W * 0.025, L * 0.01);
    ctx.lineTo(-W * 0.07, L * 0.01);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff3c4';
    roundRect(ctx, -W * 0.32, -L / 2 + 2, W * 0.16, Math.max(4, L * 0.04), 2);
    ctx.fill();
    roundRect(ctx, W * 0.16, -L / 2 + 2, W * 0.16, Math.max(4, L * 0.04), 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(28,36,48,0.22)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(W * 0.34, -L * 0.04);
    ctx.lineTo(W * 0.34, L * 0.16);
    ctx.stroke();

    paintLivery(ctx, opts.livery, color, W, L);
    if (opts.seats) {
      ctx.fillStyle = color;
      const n = Math.min(4, opts.seats);
      for (let i = 0; i < n; i += 1) {
        ctx.beginPath();
        ctx.arc(-W * 0.22 + (i % 2) * W * 0.18, -L * 0.02 + Math.floor(i / 2) * 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    ctx.fillStyle = '#c6b48a';
    roundRect(ctx, -W * 0.42, -L * 0.42, W * 0.84, L * 0.84, W * 0.2);
    ctx.fill();
    ctx.fillStyle = '#a89470';
    roundRect(ctx, -W * 0.42, L * 0.22, W * 0.84, L * 0.12, 4);
    ctx.fill();
  }

  if (opts.lock) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -L * 0.02, W * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1c2430';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#1c2430';
    ctx.font = `700 ${Math.round(W * 0.28)}px Fredoka, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(opts.lock), 0, -L * 0.01);
  }

  if (opts.flash > 0.02) {
    ctx.fillStyle = `rgba(226, 61, 61, ${opts.flash})`;
    roundRect(ctx, -W / 2, -L / 2, W, L, W * 0.32);
    ctx.fill();
  }
  ctx.restore();
}

function paintLivery(ctx, id, color, W, L) {
  if (!id || id === 'plain') return;
  ctx.save();
  if (id === 'stripes') {
    ctx.fillStyle = color;
    roundRect(ctx, -W * 0.2, -L * 0.34, W * 0.4, 4, 2);
    ctx.fill();
  } else if (id === 'chequers') {
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i % 2 ? color : '#1c2430';
      ctx.fillRect(-W * 0.3 + i * W * 0.12, L * 0.22, W * 0.12, 6);
    }
  } else if (id === 'stars') {
    ctx.fillStyle = '#f2c14e';
    for (const x of [-W * 0.22, 0, W * 0.22]) {
      ctx.beginPath();
      ctx.arc(x, L * 0.24, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'zigzag') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-W * 0.28, L * 0.2);
    ctx.lineTo(-W * 0.1, L * 0.28);
    ctx.lineTo(W * 0.08, L * 0.2);
    ctx.lineTo(W * 0.26, L * 0.28);
    ctx.stroke();
  } else if (id === 'flowers') {
    ctx.fillStyle = '#e56aa8';
    for (const x of [-W * 0.18, W * 0.18]) {
      ctx.beginPath();
      ctx.arc(x, L * 0.24, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'flames') {
    ctx.fillStyle = '#f07a2a';
    ctx.beginPath();
    ctx.moveTo(-W * 0.1, L * 0.3);
    ctx.quadraticCurveTo(0, L * 0.16, W * 0.12, L * 0.3);
    ctx.fill();
  }
  ctx.restore();
}

function drawPerson(ctx, person, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(28,36,48,0.12)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 9, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = person.cloth;
  roundRect(ctx, -7, 0, 14, 14, 7);
  ctx.fill();
  if (person.vip) {
    ctx.fillStyle = '#f2c14e';
    roundRect(ctx, -7, 3, 14, 7, 3);
    ctx.fill();
  }
  ctx.fillStyle = person.skin;
  ctx.beginPath();
  ctx.arc(0, -6, 6, 0, Math.PI * 2);
  ctx.fill();
  if (person.vip) {
    ctx.fillStyle = '#243044';
    roundRect(ctx, -7, -11, 14, 4, 2);
    ctx.fill();
  }
  if (person.luggage) {
    ctx.fillStyle = '#c9842a';
    roundRect(ctx, 7, 6, 7, 6, 2);
    ctx.fill();
  }
  if (person.sign) {
    ctx.fillStyle = person.sign;
    ctx.beginPath();
    ctx.arc(8, -10, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8, -10, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCone(ctx, s) {
  ctx.save();
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(28,36,48,0.12)';
  ctx.beginPath();
  ctx.ellipse(0, 8, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f07a2a';
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(8, 8);
  ctx.lineTo(-8, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5, 0, 10, 3);
  ctx.restore();
}

function drawRobot(ctx, s, green) {
  ctx.save();
  ctx.scale(s, s);
  ctx.fillStyle = '#243044';
  roundRect(ctx, -3, -4, 6, 22, 2);
  ctx.fill();
  ctx.fillStyle = green ? '#3e9b4f' : '#e23d3d';
  ctx.beginPath();
  ctx.arc(0, -10, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShelter(ctx, x, y, w) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#f7fbff';
  roundRect(ctx, -w / 2, -16, w, 18, 6);
  ctx.fill();
  ctx.fillStyle = '#ff8a1f';
  roundRect(ctx, -w / 2, -2, w, 5, 2);
  ctx.fill();
  ctx.fillStyle = '#d5dbe3';
  roundRect(ctx, -w * 0.38, 0, 6, 22, 2);
  ctx.fill();
  roundRect(ctx, w * 0.38 - 6, 0, 6, 22, 2);
  ctx.fill();
  ctx.restore();
}

function drawStall(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#fff8ef';
  roundRect(ctx, -16, -4, 32, 18, 4);
  ctx.fill();
  ctx.fillStyle = '#e23d3d';
  roundRect(ctx, -20, -12, 40, 8, 3);
  ctx.fill();
  ctx.restore();
}

function drawTree(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#8a5a32';
  roundRect(ctx, -2, 0, 4, 10, 1);
  ctx.fill();
  ctx.fillStyle = '#3e9b4f';
  ctx.beginPath();
  ctx.arc(0, -4, 8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function createBoard(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { ok: false, error: new Error('no 2d') };
  const reduced = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let level = null;
  let state = null;
  let colorblind = false;
  let livery = 'plain';
  let views = [];
  let people = [];
  let layout = null;
  let running = false;
  let raf = 0;
  let shake = 0;
  const tweens = [];
  const rain = [];
  for (let i = 0; i < 18; i += 1) rain.push({ x: (i * 37) % 100, y: (i * 53) % 100, v: 0.6 + (i % 4) * 0.15 });

  function seconds(ms) {
    return reduced ? Math.min(40, ms) : ms;
  }

  function animate(ms, step) {
    return new Promise((resolve) => {
      tweens.push({ t: 0, ms: seconds(ms), step, resolve });
    });
  }

  function cellSize() {
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 400;
    const cols = level.cols;
    const rows = level.rows;
    const byW = (w * 0.92) / cols;
    const byH = (h * 0.88) / (rows + 2.5);
    return Math.max(36, Math.min(byW, byH));
  }

  function measure() {
    const cell = cellSize();
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 400;
    const gridW = level.cols * cell;
    const gridH = level.rows * cell;
    const ox = (w - gridW) / 2;
    const oy = (h - (gridH + cell * 2.3)) / 2 + cell * 0.2;
    layout = {
      cell,
      ox,
      oy,
      gridY: oy + cell * 2.15,
      bayY: oy + cell * 1.15,
      queueY: oy + cell * 0.42,
      gridW,
      bays: state.bayTaxi.length,
    };
  }

  function cellPos(c, r) {
    return {
      x: layout.ox + (c + 0.5) * layout.cell,
      y: layout.gridY + (r + 0.5) * layout.cell,
    };
  }

  function bayPos(i) {
    const n = layout.bays;
    return {
      x: layout.ox + ((i + 0.5) / n) * layout.gridW,
      y: layout.bayY,
    };
  }

  function taxiCenter(taxi) {
    const cells = taxiCells(taxi);
    let x = 0;
    let y = 0;
    for (const cell of cells) {
      const p = cellPos(cell.c, cell.r);
      x += p.x;
      y += p.y;
    }
    return { x: x / cells.length, y: y / cells.length };
  }

  function rotFor(dir) {
    return [0, Math.PI / 2, Math.PI, -Math.PI / 2][dir] || 0;
  }

  function placeAll() {
    for (const view of views) {
      if (!view || view.anim) continue;
      const taxi = level.taxis[view.id];
      if (state.exited[view.id]) {
        let bay = -1;
        for (let i = 0; i < state.bayTaxi.length; i += 1) {
          if (state.bayTaxi[i] === view.id) bay = i;
        }
        if (bay < 0) {
          view.visible = false;
          continue;
        }
        const p = bayPos(bay);
        view.visible = true;
        view.x = p.x;
        view.y = p.y;
        view.rot = 0;
        view.parked = true;
      } else {
        const p = taxiCenter(taxi);
        view.visible = true;
        view.x = p.x;
        view.y = p.y;
        view.rot = rotFor(taxi.dir);
        view.parked = false;
      }
    }
    placePeople();
  }

  function placePeople() {
    people = [];
    const queues = state.queues || [];
    queues.forEach((queue, q) => {
      let shown = 0;
      queue.forEach((person, index) => {
        if (state.boarded[q][index]) return;
        if (shown >= 5) return;
        const slot = shown;
        shown += 1;
        people.push({
          queue: q,
          index,
          x: layout.ox + 22 + slot * (layout.cell * 0.62) + q * 6,
          y: layout.queueY + 10 + q * (layout.cell * 0.48),
          skin: SKINS[(index + q) % SKINS.length],
          cloth: CLOTHES[(person.color + q) % CLOTHES.length],
          luggage: !!person.luggage,
          vip: !!person.vip,
          sign: hex(person.color, colorblind),
          hop: 0,
          visible: true,
        });
      });
    });
  }

  function resize() {
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 400;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (level) {
      measure();
      placeAll();
    }
  }

  function drawGround(w, h) {
    const region = REGIONS.find((item) => item.id === (level.region || 'durban')) || REGIONS[0];
    ctx.fillStyle = '#f6e3b0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = region.grass;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(w * 0.08, h * 0.2, 28, 0, Math.PI * 2);
    ctx.arc(w * 0.92, h * 0.78, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#f7f1e2';
    roundRect(ctx, layout.ox - 18, layout.oy - 8, layout.gridW + 36, layout.gridY + level.rows * layout.cell - layout.oy + 24, 18);
    ctx.fill();
    ctx.fillStyle = '#b7c0c8';
    roundRect(ctx, layout.ox - 6, layout.gridY - 8, layout.gridW + 12, level.rows * layout.cell + 16, 10);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, layout.cell * 0.045);
    for (let r = 0; r <= level.rows; r += 1) {
      const y = layout.gridY + r * layout.cell;
      ctx.beginPath();
      ctx.moveTo(layout.ox + 4, y);
      ctx.lineTo(layout.ox + layout.gridW - 4, y);
      ctx.stroke();
    }
    for (let c = 0; c <= level.cols; c += 1) {
      const x = layout.ox + c * layout.cell;
      ctx.beginPath();
      ctx.moveTo(x, layout.gridY + 4);
      ctx.lineTo(x, layout.gridY + level.rows * layout.cell - 4);
      ctx.stroke();
    }
    for (let i = 0; i < layout.bays; i += 1) {
      const p = bayPos(i);
      ctx.fillStyle = '#e7eef3';
      roundRect(ctx, p.x - layout.cell * 0.38, p.y - layout.cell * 0.28, layout.cell * 0.76, layout.cell * 0.62, 8);
      ctx.fill();
      ctx.fillStyle = '#ff8a1f';
      roundRect(ctx, p.x - layout.cell * 0.38, p.y - layout.cell * 0.28, layout.cell * 0.76, 4, 2);
      ctx.fill();
    }
    drawShelter(ctx, layout.ox + layout.gridW / 2, layout.oy + 4, Math.min(layout.gridW, layout.cell * 4.2));
    drawStall(ctx, layout.ox + layout.gridW + 8, layout.queueY + 8, layout.cell / 70);
    drawTree(ctx, layout.ox - 8, layout.gridY + layout.cell, 1);
    drawTree(ctx, layout.ox + layout.gridW + 10, layout.gridY + level.rows * layout.cell * 0.7, 1.1);
  }

  function drawHazards() {
    const s = layout.cell / 70;
    for (const cone of level.cones || []) {
      const p = cellPos(cone.c, cone.r);
      ctx.save();
      ctx.translate(p.x, p.y);
      drawCone(ctx, s * 1.4);
      ctx.restore();
    }
    if (level.officer) {
      const spot = level.officer.path[Math.floor(state.moves / 3) % level.officer.path.length];
      const p = cellPos(spot.c, spot.r);
      ctx.save();
      ctx.translate(p.x, p.y);
      drawPerson(ctx, { skin: '#e0ac69', cloth: '#1c2430', vip: true, luggage: false, sign: null }, s * 0.95);
      ctx.restore();
    }
    const green = Math.floor(state.moves / 2) % 2 === 0;
    for (const robot of level.robots || []) {
      const vertical = robot.dir % 2 === 0;
      const p = vertical
        ? cellPos(robot.lane, robot.dir === 0 ? 0 : level.rows - 1)
        : cellPos(robot.dir === 1 ? level.cols - 1 : 0, robot.lane);
      ctx.save();
      ctx.translate(p.x, p.y - layout.cell * 0.15);
      drawRobot(ctx, s * 1.3, green);
      ctx.restore();
    }
    for (const view of views) {
      const taxi = level.taxis[view.id];
      if (taxi.tow > view.id && views[taxi.tow] && views[taxi.tow].visible && view.visible) {
        ctx.strokeStyle = '#1c2430';
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(view.x, view.y);
        ctx.lineTo(views[taxi.tow].x, views[taxi.tow].y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = 16;
    for (let i = tweens.length - 1; i >= 0; i -= 1) {
      const tw = tweens[i];
      tw.t += dt;
      const u = Math.min(1, tw.t / tw.ms);
      tw.step(easeOut(u));
      if (u >= 1) {
        tw.resolve();
        tweens.splice(i, 1);
      }
    }
    if (!level || !layout) return;
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 400;
    ctx.save();
    if (shake > 0.2) {
      ctx.translate((Math.sin(now * 0.08) * shake), 0);
      shake *= 0.86;
    }
    drawGround(w, h);
    drawHazards();
    for (const person of people) {
      if (!person.visible) continue;
      ctx.save();
      ctx.translate(person.x, person.y - person.hop);
      drawPerson(ctx, person, layout.cell / 58);
      ctx.restore();
    }
    for (const view of views) {
      if (!view.visible) continue;
      const taxi = level.taxis[view.id];
      const covered = taxi.hidden && !(state.revealed && state.revealed[view.id]);
      const locks = taxi.lockAfter ? Math.max(0, taxi.lockAfter - (state.departed || 0)) : 0;
      const length = layout.cell * taxi.len * (view.parked ? 0.62 : 0.86);
      ctx.save();
      ctx.translate(view.x, view.y);
      ctx.rotate(view.rot);
      ctx.scale(1, view.squash || 1);
      drawCombi(ctx, {
        len: taxi.len,
        length,
        width: layout.cell * (view.parked ? 0.5 : 0.7),
        color: hex((taxi.colors && taxi.colors[0]) || 0, colorblind),
        alt: taxi.colors && taxi.colors[1] != null ? hex(taxi.colors[1], colorblind) : null,
        livery,
        tarp: covered,
        lock: locks || 0,
        seats: view.seats || 0,
        flash: view.flash || 0,
      });
      ctx.restore();
    }
    if (level.rain) {
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.4;
      for (const drop of rain) {
        drop.y += drop.v;
        if (drop.y > 100) drop.y = 0;
        const x = (drop.x / 100) * w;
        const y = (drop.y / 100) * h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 4, y + 10);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function pathFor(id, bay) {
    const taxi = level.taxis[id];
    const dir = DIRS[taxi.dir];
    const points = [taxiCenter(taxi)];
    let c = taxi.c + dir.x;
    let r = taxi.r + dir.y;
    while (c >= 0 && r >= 0 && c < level.cols && r < level.rows) {
      points.push(cellPos(c, r));
      c += dir.x;
      r += dir.y;
    }
    const last = points[points.length - 1];
    const step = layout.cell;
    const out = {
      x: last.x + dir.x * step * 0.9,
      y: last.y + dir.y * step * 0.9,
    };
    points.push(out);
    const bayP = bayPos(bay);
    const frontY = layout.bayY - layout.cell * 0.15;
    if (dir.y < 0) {
      points.push({ x: out.x, y: frontY });
    } else if (dir.y > 0) {
      const side = out.x > layout.ox + layout.gridW / 2 ? layout.ox + layout.gridW + step : layout.ox - step;
      points.push({ x: out.x, y: out.y + step * 0.4 });
      points.push({ x: side, y: out.y + step * 0.4 });
      points.push({ x: side, y: frontY });
    } else {
      const side = dir.x > 0 ? layout.ox + layout.gridW + step : layout.ox - step;
      points.push({ x: side, y: out.y });
      points.push({ x: side, y: frontY });
    }
    points.push({ x: bayP.x, y: frontY });
    points.push(bayP);
    return points;
  }

  async function follow(view, points) {
    let total = 0;
    const lens = [];
    for (let i = 1; i < points.length; i += 1) {
      const len = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
      lens.push(len);
      total += len;
    }
    if (total < 1) return;
    await animate(180 + total * 1.1, (u) => {
      const dist = u * total;
      let acc = 0;
      let seg = 0;
      while (seg < lens.length - 1 && acc + lens[seg] < dist) {
        acc += lens[seg];
        seg += 1;
      }
      const f = Math.min(1, (dist - acc) / (lens[seg] || 1));
      const a = points[seg];
      const b = points[seg + 1];
      view.x = lerp(a.x, b.x, f);
      view.y = lerp(a.y, b.y, f);
      const aim = Math.atan2(b.x - a.x, -(b.y - a.y));
      view.rot = lerpAngle(view.rot, aim, 0.65);
      view.squash = 1 + Math.sin(u * Math.PI) * 0.04;
    });
    view.squash = 1;
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function load(nextLevel, nextState, _hidden, opts) {
    for (const tw of tweens) tw.resolve();
    tweens.length = 0;
    level = nextLevel;
    state = nextState;
    colorblind = !!(opts && opts.colorblind);
    livery = (opts && opts.livery) || 'plain';
    measure();
    views = level.taxis.map((taxi) => ({
      id: taxi.id,
      x: 0,
      y: 0,
      rot: 0,
      visible: true,
      parked: false,
      anim: false,
      flash: 0,
      squash: 1,
      seats: 0,
    }));
    placeAll();
  }

  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    for (let i = people.length - 1; i >= 0; i -= 1) {
      const person = people[i];
      if (!person.visible) continue;
      if (Math.hypot(person.x - x, person.y - y) < layout.cell * 0.28) {
        return { kind: 'queue', queue: person.queue };
      }
    }
    for (let i = views.length - 1; i >= 0; i -= 1) {
      const view = views[i];
      if (!view.visible || view.parked) continue;
      const taxi = level.taxis[view.id];
      const reach = layout.cell * taxi.len * 0.45;
      if (Math.hypot(view.x - x, view.y - y) < reach) return { kind: 'taxi', id: view.id };
    }
    return null;
  }

  function project(id) {
    const view = views[id];
    if (!view) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left + view.x, y: rect.top + view.y };
  }

  return {
    ok: true,
    resize,
    start,
    stop,
    load,
    pick,
    project,
    setState(next) {
      state = next;
    },
    reveal() {},
    async bump(id) {
      const view = views[id];
      const taxi = level.taxis[id];
      const dir = DIRS[taxi.dir];
      const x0 = view.x;
      const y0 = view.y;
      shake = 4;
      await animate(90, (u) => {
        view.x = x0 + dir.x * 8 * u;
        view.y = y0 + dir.y * 8 * u;
      });
      await animate(120, (u) => {
        view.x = x0 + dir.x * 8 * (1 - u);
        view.y = y0 + dir.y * 8 * (1 - u);
      });
    },
    async exit(id, bay) {
      const view = views[id];
      view.anim = true;
      await follow(view, pathFor(id, bay));
      const p = bayPos(bay);
      view.x = p.x;
      view.y = p.y;
      view.rot = 0;
      view.parked = true;
      view.anim = false;
    },
    async board(event) {
      const person = people.find((item) => item.queue === (event.queue || 0) && item.index === event.pIndex);
      const view = views[event.taxiId];
      if (person && view) {
        const x0 = person.x;
        const y0 = person.y;
        await animate(220, (u) => {
          person.x = lerp(x0, view.x, u);
          person.y = lerp(y0, view.y, u);
          person.hop = Math.sin(u * Math.PI) * 18;
        });
        person.visible = false;
      }
      if (view) view.seats = event.filled || 0;
    },
    async depart(id) {
      const view = views[id];
      if (!view) return;
      const y0 = view.y;
      await animate(280, (u) => {
        view.y = y0 - u * layout.cell * 2.2;
        view.squash = 1 - u * 0.08;
      });
      view.visible = false;
      view.seats = 0;
    },
    syncPeople(next) {
      state = next;
      if (layout) placeAll();
    },
    flash(id) {
      const view = views[id];
      if (!view) return;
      animate(180, (u) => {
        view.flash = u < 0.5 ? u * 1.4 : (1 - u) * 1.4;
      });
    },
    pulse(id) {
      const view = views[id];
      if (!view) return;
      const base = view.squash || 1;
      animate(480, (u) => {
        view.squash = base + Math.sin(u * Math.PI) * 0.08;
      });
    },
    shake() {
      shake = 5;
    },
  };
}

export function createTurntable(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { ok: false, error: new Error('no 2d') };
  const reduced = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let livery = 'plain';
  let stage = 0;
  let running = false;
  let raf = 0;
  const colors = ['#e23d3d', '#2f6fed', '#f2c14e', '#3e9b4f'];

  function resize() {
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 180;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 180;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f3d48a';
    roundRect(ctx, 8, 8, w - 16, h - 16, 16);
    ctx.fill();
    ctx.fillStyle = '#b7c0c8';
    roundRect(ctx, 22, h * 0.28, w - 44, h * 0.58, 12);
    ctx.fill();
    drawShelter(ctx, w / 2, h * 0.22, w * 0.72);
    if (stage >= 2) drawStall(ctx, w * 0.84, h * 0.62, 0.9);
    if (stage >= 1) drawTree(ctx, w * 0.12, h * 0.7, 1);
    const spots = [
      { x: 0.28, y: 0.48, len: 3 },
      { x: 0.5, y: 0.58, len: 3 },
      { x: 0.74, y: 0.46, len: 2 },
      { x: 0.46, y: 0.78, len: 4 },
    ];
    spots.forEach((spot, index) => {
      const bob = reduced ? 0 : Math.sin(now * 0.0015 + index) * 2;
      ctx.save();
      ctx.translate(w * spot.x, h * spot.y + bob);
      drawCombi(ctx, {
        len: spot.len,
        length: 54 + spot.len * 10,
        width: 36,
        color: colors[index],
        livery: index === 0 ? livery : 'plain',
      });
      ctx.restore();
    });
  }

  return {
    ok: true,
    resize,
    setLook(next) { livery = next || 'plain'; },
    setStage(next) { stage = next || 0; },
    start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}

export function renderThumb(target, livery) {
  const ctx = target.getContext('2d');
  if (!ctx) return;
  const w = target.width || 96;
  const h = target.height || 64;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#eef3f8';
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2 + 4);
  drawCombi(ctx, { len: 3, length: h * 0.78, width: w * 0.42, color: '#e23d3d', livery });
  ctx.restore();
}
