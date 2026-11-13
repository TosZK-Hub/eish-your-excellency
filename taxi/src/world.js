/**
 * Low-poly rank. Orthographic camera, flat toon materials, procedural combis.
 * The puzzle rules stay in engine.js. This module only shows them.
 */

import { DIRS } from './engine.js';
import { COLORS } from './theme.js';
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CircleGeometry,
  Clock,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  NoColorSpace,
  OrthographicCamera,
  PCFSoftShadowMap,
  PlaneGeometry,
  Raycaster,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from '../vendor/three.module.js';

const CELL = 1.16;
const ELEV = 52 * Math.PI / 180;
const AZIM = 18 * Math.PI / 180;

const geo = new Map();
function boxGeo(w, h, d) {
  const key = `b${w}_${h}_${d}`;
  let g = geo.get(key);
  if (!g) {
    g = new BoxGeometry(w, h, d);
    geo.set(key, g);
  }
  return g;
}
function cylGeo(r, h, n) {
  const key = `c${r}_${h}_${n}`;
  let g = geo.get(key);
  if (!g) {
    g = new CylinderGeometry(r, r, h, n);
    geo.set(key, g);
  }
  return g;
}
function sphGeo(r, w, h) {
  const key = `s${r}_${w}_${h}`;
  let g = geo.get(key);
  if (!g) {
    g = new SphereGeometry(r, w, h);
    geo.set(key, g);
  }
  return g;
}

let gradient;
function toonGradient() {
  if (gradient) return gradient;
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ['#6a6a6a', '#9d9d9d', '#d2d2d2', '#ffffff'].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i, 0, 1, 1);
  });
  gradient = new CanvasTexture(canvas);
  gradient.magFilter = NearestFilter;
  gradient.minFilter = NearestFilter;
  gradient.generateMipmaps = false;
  gradient.colorSpace = NoColorSpace;
  return gradient;
}

const mats = new Map();
function toon(color) {
  const key = typeof color === 'number' ? color : String(color);
  let mat = mats.get(key);
  if (!mat) {
    mat = new MeshToonMaterial({ color, gradientMap: toonGradient() });
    mats.set(key, mat);
  }
  return mat;
}

const glassMat = new MeshBasicMaterial({ color: 0x243044 });
const lampMat = new MeshBasicMaterial({ color: 0xffe08a });
const tailMat = new MeshBasicMaterial({ color: 0xc5363a });
const arrowMat = new MeshBasicMaterial({ color: 0xfff3c4 });
const pickMat = new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });

function mesh(geometry, material, x, y, z, cast = false) {
  const m = new Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = false;
  return m;
}

function slab(w, h, d, material, x, y, z, cast = false) {
  return mesh(boxGeo(w, h, d), material, x, y, z, cast);
}

/** Nose points down local -Z. Yaw 0 parks the combi facing the queue. */
export function makeCombi(color) {
  const root = new Group();
  const body = new Group();
  root.add(body);
  const white = toon(0xf4f7fb);
  const stripe = toon(color);
  const black = toon(0x1c1f26);
  const rubber = toon(0x22262e);
  const silver = toon(0xd5dbe3);
  const trim = toon(0xc5ced6);

  body.add(slab(0.64, 0.26, 1.02, white, 0, 0.36, 0.04, true));
  body.add(slab(0.62, 0.42, 0.74, white, 0, 0.66, 0.14, true));
  body.add(slab(0.66, 0.07, 0.78, white, 0, 0.90, 0.14, true));
  body.add(slab(0.50, 0.03, 0.74, stripe, 0, 0.945, 0.14));

  const bonnet = slab(0.58, 0.08, 0.30, white, 0, 0.40, -0.42, true);
  bonnet.rotation.x = -0.45;
  body.add(bonnet);

  body.add(slab(0.66, 0.07, 0.06, black, 0, 0.22, -0.52));
  body.add(slab(0.66, 0.07, 0.06, black, 0, 0.22, 0.56));
  body.add(slab(0.035, 0.12, 0.92, stripe, 0.328, 0.40, 0.05));
  body.add(slab(0.035, 0.12, 0.92, stripe, -0.328, 0.40, 0.05));

  const wind = slab(0.50, 0.24, 0.02, glassMat, 0, 0.64, -0.22);
  wind.rotation.x = -0.42;
  body.add(wind);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i += 1) {
      body.add(slab(0.02, 0.16, 0.16, glassMat, side * 0.318, 0.66, 0.02 + i * 0.20));
    }
  }
  body.add(slab(0.02, 0.30, 0.018, black, -0.322, 0.50, -0.02));
  body.add(slab(0.16, 0.035, 0.20, trim, 0, 0.99, 0.08));
  body.add(slab(0.10, 0.02, 0.14, silver, 0, 1.02, 0.08));
  body.add(slab(0.025, 0.03, 0.62, toon(0x8d97a3), 0.24, 1.0, 0.16));
  body.add(slab(0.025, 0.03, 0.62, toon(0x8d97a3), -0.24, 1.0, 0.16));
  body.add(slab(0.50, 0.02, 0.03, toon(0x8d97a3), 0, 1.0, 0.0));
  body.add(slab(0.50, 0.02, 0.03, toon(0x8d97a3), 0, 1.0, 0.36));
  body.add(slab(0.10, 0.045, 0.04, black, 0.36, 0.56, -0.26));
  body.add(slab(0.10, 0.045, 0.04, black, -0.36, 0.56, -0.26));
  body.add(slab(0.07, 0.05, 0.02, lampMat, -0.18, 0.32, -0.54));
  body.add(slab(0.07, 0.05, 0.02, lampMat, 0.18, 0.32, -0.54));
  body.add(slab(0.07, 0.045, 0.02, tailMat, -0.18, 0.34, 0.58));
  body.add(slab(0.07, 0.045, 0.02, tailMat, 0.18, 0.34, 0.58));

  const wheels = [];
  for (const [x, z] of [[-0.28, -0.32], [0.28, -0.32], [-0.28, 0.40], [0.28, 0.40]]) {
    const axle = new Group();
    axle.position.set(x, 0.135, z);
    const tire = mesh(cylGeo(0.135, 0.08, 10), rubber, 0, 0, 0, true);
    tire.rotation.z = Math.PI / 2;
    const hub = mesh(cylGeo(0.05, 0.09, 8), silver, 0, 0, 0);
    hub.rotation.z = Math.PI / 2;
    axle.add(tire, hub);
    body.add(axle);
    wheels.push(axle);
  }

  const seats = [];
  for (let i = 0; i < 4; i += 1) {
    const dot = mesh(sphGeo(0.045, 6, 5), stripe, 0.30, 0.58, -0.02 + i * 0.16);
    dot.visible = false;
    body.add(dot);
    seats.push(dot);
  }

  root.userData.body = body;
  root.userData.wheels = wheels;
  root.userData.seats = seats;
  root.userData.color = color;
  return root;
}

function addLivery(root, id) {
  if (!id || id === 'plain') return;
  const body = root.userData.body;
  const color = root.userData.color;
  const stripe = toon(color);
  if (id === 'stripes') {
    body.add(slab(0.025, 0.045, 0.88, stripe, 0.335, 0.52, 0.06));
    body.add(slab(0.025, 0.045, 0.88, stripe, -0.335, 0.52, 0.06));
    body.add(slab(0.10, 0.03, 0.70, stripe, 0, 0.985, 0.14));
  } else if (id === 'chequers') {
    const dark = toon(0x1c2430);
    for (let i = 0; i < 7; i += 1) {
      const mat = i % 2 ? stripe : dark;
      body.add(slab(0.028, 0.08, 0.09, mat, 0.335, 0.48, -0.34 + i * 0.12));
      body.add(slab(0.028, 0.08, 0.09, mat, -0.335, 0.48, -0.34 + i * 0.12));
    }
  } else if (id === 'stars') {
    const star = toon(0xf2c14e);
    for (const z of [-0.12, 0.12, 0.36]) {
      body.add(mesh(sphGeo(0.045, 6, 5), star, 0.34, 0.56, z));
      body.add(mesh(sphGeo(0.045, 6, 5), star, -0.34, 0.56, z));
    }
  } else if (id === 'zigzag') {
    for (let i = 0; i < 4; i += 1) {
      for (const side of [-1, 1]) {
        const piece = slab(0.028, 0.05, 0.18, stripe, side * 0.335, 0.50, -0.22 + i * 0.2);
        piece.rotation.x = i % 2 ? 0.7 : -0.7;
        body.add(piece);
      }
    }
  } else if (id === 'flowers') {
    const petal = toon(0xe56aa8);
    const heart = toon(0xf2c14e);
    for (const z of [-0.02, 0.22, 0.46]) {
      for (const side of [-1, 1]) {
        body.add(mesh(sphGeo(0.05, 6, 5), petal, side * 0.22, 1.0, z));
        body.add(mesh(sphGeo(0.025, 5, 4), heart, side * 0.22, 1.04, z));
      }
    }
  } else if (id === 'flames') {
    const hot = toon(0xf07a2a);
    const core = toon(0xf2c14e);
    for (const side of [-1, 1]) {
      const outer = slab(0.04, 0.12, 0.24, hot, side * 0.33, 0.44, 0.34);
      outer.rotation.y = side * 0.15;
      const inner = slab(0.03, 0.07, 0.14, core, side * 0.34, 0.44, 0.38);
      body.add(outer, inner);
    }
  }
}

function makeTarp() {
  const g = new Group();
  const cloth = toon(0xc6b48a);
  const hem = toon(0xb09a72);
  g.add(slab(0.78, 0.50, 1.10, cloth, 0, 0.46, 0.04, true));
  g.add(slab(0.62, 0.18, 0.62, cloth, 0.04, 0.76, 0.08, true));
  const nose = slab(0.58, 0.22, 0.32, cloth, 0, 0.36, -0.46);
  nose.rotation.x = -0.5;
  g.add(nose);
  g.add(slab(0.80, 0.06, 1.14, hem, 0, 0.24, 0.04));
  return g;
}

let lockMat;
function makePadlock() {
  if (!lockMat) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1c2430';
    ctx.stroke();
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(64, 54, 16, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    ctx.fillStyle = '#1c2430';
    roundRect(ctx, 44, 58, 40, 32, 6);
    ctx.fill();
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    lockMat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  }
  const sprite = new Sprite(lockMat);
  sprite.scale.set(0.46, 0.46, 1);
  sprite.position.y = 1.28;
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

let questionMat;
function makeQuestion() {
  if (!questionMat) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1c2430';
    ctx.stroke();
    ctx.fillStyle = '#1c2430';
    ctx.font = '700 78px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 64, 70);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    questionMat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ctx.clearRect(0, 0, 128, 128);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(64, 64, 56, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#1c2430';
        ctx.stroke();
        ctx.fillStyle = '#1c2430';
        ctx.font = '700 78px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 64, 70);
        tex.needsUpdate = true;
      }).catch(() => {});
    }
  }
  const sprite = new Sprite(questionMat);
  sprite.scale.set(0.46, 0.46, 1);
  sprite.position.y = 1.32;
  return sprite;
}

function makeArrow() {
  const g = new Group();
  const left = mesh(boxGeo(0.20, 0.035, 0.06), arrowMat, -0.07, 1.08, -0.02);
  left.rotation.y = 0.55;
  const right = mesh(boxGeo(0.20, 0.035, 0.06), arrowMat, 0.07, 1.08, -0.02);
  right.rotation.y = -0.55;
  g.add(left, right);
  return g;
}

function makePerson(color, variant, vip) {
  const g = new Group();
  const cloth = toon(color);
  const skin = toon(0xf0c7a2);
  const body = mesh(new CapsuleGeometry(0.11, 0.16, 2, 8), cloth, 0, 0.32, 0, true);
  const head = mesh(sphGeo(0.105, 8, 6), skin, 0, 0.56, 0, true);
  g.add(body, head);
  if (vip) {
    const vest = slab(0.18, 0.14, 0.12, toon(0xf2c14e), 0, 0.32, 0.02);
    const cap = mesh(cylGeo(0.09, 0.045, 8), toon(0x243044), 0, 0.66, 0);
    const brim = slab(0.14, 0.02, 0.08, toon(0x243044), 0, 0.64, 0.06);
    g.add(vest, cap, brim);
  } else if (variant !== 2) {
    const hair = mesh(sphGeo(0.11, 8, 6), toon(variant === 0 ? 0x2a2420 : 0x5a3a28), 0, 0.62, -0.01);
    hair.scale.y = 0.55;
    g.add(hair);
  }
  if (!vip && variant === 1) {
    g.add(slab(0.08, 0.09, 0.05, toon(0x1c2430), 0.12, 0.30, 0));
  }
  const scale = variant === 2 ? 1.06 : variant === 0 ? 0.94 : 1;
  g.scale.setScalar(scale);
  return g;
}

function yawForDir(dir) {
  return [0, -Math.PI / 2, Math.PI, Math.PI / 2][dir] || 0;
}

function lerpAngle(a, b, u) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * u;
}

function makeRenderer(canvas, alpha) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha,
    powerPreference: 'default',
  });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  if (!alpha) renderer.setClearColor(0xb7def2, 1);
  return renderer;
}

function addLights(scene, shadow) {
  scene.add(new HemisphereLight(0xd7eeff, 0x8aa07a, 0.7));
  scene.add(new AmbientLight(0xffffff, 0.28));
  const sun = new DirectionalLight(0xfff6ea, 1.35);
  sun.position.set(-5, 11, 6);
  if (shadow) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    const cam = sun.shadow.camera;
    cam.near = 1;
    cam.far = 32;
    cam.left = -10;
    cam.right = 10;
    cam.top = 10;
    cam.bottom = -10;
  }
  scene.add(sun);
  scene.add(sun.target);
  return sun;
}

export function createBoard(canvas) {
  const reduced = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = makeRenderer(canvas, false);
  } catch (error) {
    return { ok: false, error };
  }

  const scene = new Scene();
  scene.background = new Color(0xb7def2);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 80);
  const sun = addLights(scene, true);
  const clock = new Clock();
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const tweens = [];
  const dustPool = [];
  const dustGeo = sphGeo(0.045, 5, 4);

  let root = null;
  let running = false;
  let raf = 0;
  let shakeAmp = 0;
  const camBase = new Vector3();
  let level = null;
  let state = null;
  let hidden = [];
  let showArrows = false;
  let plan = null;
  let views = [];
  let people = [];
  let queueRoot = null;
  let plus = null;
  let plusCtx = null;
  let plusTex = null;
  let ring = null;
  const forceVisible = new Set();
  const look = new Vector3();

  function seconds(ms) {
    return reduced ? Math.min(0.045, ms / 1000) : ms / 1000;
  }

  function animate(duration, ease, update) {
    return new Promise((resolve) => {
      tweens.push({ t: 0, duration: Math.max(0.016, duration), ease, update, resolve });
    });
  }

  function stepTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i -= 1) {
      const tw = tweens[i];
      tw.t += dt;
      let u = Math.min(1, tw.t / tw.duration);
      if (tw.ease === 'in') u = u * u * u;
      else if (tw.ease === 'out') u = 1 - (1 - u) * (1 - u);
      try {
        tw.update(u);
      } catch (err) {
        console.error(err);
        tw.t = tw.duration;
      }
      if (tw.t >= tw.duration) {
        try { tw.update(1); } catch (err) { console.error(err); }
        tw.resolve();
        tweens.splice(i, 1);
      }
    }
  }

  function clearTweens() {
    for (const tw of tweens) tw.resolve();
    tweens.length = 0;
  }

  function puff(x, z) {
    let puffMesh = dustPool.pop();
    if (!puffMesh) {
      const material = new MeshBasicMaterial({
        color: 0xe7eef2,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });
      puffMesh = new Mesh(dustGeo, material);
    }
    puffMesh.visible = true;
    puffMesh.position.set(x, 0.06, z);
    puffMesh.scale.setScalar(0.6);
    puffMesh.material.opacity = 0.7;
    scene.add(puffMesh);
    animate(seconds(280), 'out', (u) => {
      puffMesh.position.y = 0.06 + u * 0.22;
      puffMesh.material.opacity = 0.7 * (1 - u);
      puffMesh.scale.setScalar(0.6 + u * 0.8);
    }).then(() => {
      puffMesh.visible = false;
      scene.remove(puffMesh);
      dustPool.push(puffMesh);
    });
  }

  function layoutPlan(nextLevel, bayCount) {
    const cols = nextLevel.cols;
    const rows = nextLevel.rows;
    const gridW = cols * CELL;
    const bayPitch = Math.max(0.98, gridW / bayCount);
    const rowW = bayPitch * bayCount;
    const span = Math.max(gridW, rowW);
    const queueZ = 0;
    const bayZ = 1.55;
    const gridZ0 = 2.7;
    return {
      cols,
      rows,
      gridW,
      bayPitch,
      rowW,
      span,
      queueZ,
      bayZ,
      gridZ0,
      cell(c, r) {
        return {
          x: -gridW / 2 + (c + 0.5) * CELL,
          z: gridZ0 + r * CELL,
        };
      },
      bay(i) {
        return {
          x: -rowW / 2 + (i + 0.5) * bayPitch,
          z: bayZ,
        };
      },
      inside(c, r) {
        return c >= 0 && r >= 0 && c < cols && r < rows;
      },
      minX: -span / 2 - 0.55,
      maxX: span / 2 + 0.55,
      minZ: queueZ - 0.7,
      maxZ: gridZ0 + (rows - 1) * CELL + 0.55,
    };
  }

  function buildEnvironment() {
    const grass = new Mesh(new PlaneGeometry(plan.span + 8, (plan.maxZ - plan.minZ) + 8), toon(0x7dbe6a));
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(0, -0.02, (plan.minZ + plan.maxZ) / 2);
    grass.receiveShadow = true;
    root.add(grass);

    const yardNear = plan.queueZ + 0.45;
    const yardFar = plan.maxZ - 0.2;
    const asphalt = new Mesh(
      new PlaneGeometry(plan.span + 1.15, yardFar - yardNear),
      toon(0x4e5968),
    );
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.set(0, 0, (yardNear + yardFar) / 2);
    asphalt.receiveShadow = true;
    root.add(asphalt);

    const kerb = toon(0xe4e0d8);
    const yardW = plan.span + 1.35;
    const yardD = plan.maxZ - plan.minZ - 0.2;
    const yardZ = (plan.minZ + plan.maxZ) / 2;
    root.add(slab(yardW, 0.08, 0.12, kerb, 0, 0.04, plan.minZ + 0.15));
    root.add(slab(yardW, 0.08, 0.12, kerb, 0, 0.04, plan.maxZ - 0.15));
    root.add(slab(0.12, 0.08, yardD, kerb, -yardW / 2, 0.04, yardZ));
    root.add(slab(0.12, 0.08, yardD, kerb, yardW / 2, 0.04, yardZ));

    const line = toon(0xf7f4ee);
    for (let r = 0; r < plan.rows; r += 1) {
      for (let c = 0; c < plan.cols; c += 1) {
        const p = plan.cell(c, r);
        const w = CELL * 0.86;
        root.add(slab(w, 0.012, 0.035, line, p.x, 0.02, p.z - w / 2));
        root.add(slab(w, 0.012, 0.035, line, p.x, 0.02, p.z + w / 2));
        root.add(slab(0.035, 0.012, w, line, p.x - w / 2, 0.02, p.z));
        root.add(slab(0.035, 0.012, w, line, p.x + w / 2, 0.02, p.z));
      }
    }

    const bayFill = toon(0xd5dde6);
    const bayEdge = toon(0xff8a1f);
    for (let i = 0; i < state.bayTaxi.length; i += 1) {
      const p = plan.bay(i);
      root.add(slab(plan.bayPitch * 0.82, 0.025, 1.05, bayFill, p.x, 0.02, p.z));
      root.add(slab(plan.bayPitch * 0.82, 0.02, 0.06, bayEdge, p.x, 0.035, p.z - 0.5));
      root.add(slab(0.05, 0.02, 1.05, line, p.x - plan.bayPitch * 0.41, 0.035, p.z));
      root.add(slab(0.05, 0.02, 1.05, line, p.x + plan.bayPitch * 0.41, 0.035, p.z));
    }

    const roofW = Math.min(plan.span + 0.4, Math.max(plan.rowW, 2.4));
    const post = toon(0xd5dbe3);
    const roof = toon(0xf7fbff);
    const trim = toon(0xff8a1f);
    root.add(slab(roofW, 0.07, 0.85, roof, 0, 1.18, plan.queueZ - 0.15, true));
    root.add(slab(roofW, 0.045, 0.08, trim, 0, 1.16, plan.queueZ + 0.24));
    for (const x of [-roofW * 0.38, roofW * 0.38]) {
      root.add(slab(0.06, 1.12, 0.06, post, x, 0.56, plan.queueZ - 0.35, true));
    }
    root.add(slab(roofW * 0.7, 0.08, 0.28, toon(0xc5ced6), 0, 0.18, plan.queueZ - 0.35));

    const foliage = toon(0x3e9b4f);
    const trunk = toon(0x8a5a32);
    const spots = [
      [plan.minX + 0.35, plan.maxZ - 0.15],
      [plan.maxX - 0.35, plan.maxZ - 0.15],
      [plan.minX + 0.55, plan.minZ + 0.2],
      [plan.maxX - 0.55, (plan.minZ + plan.maxZ) * 0.55],
    ];
    spots.forEach(([x, z], i) => {
      root.add(slab(0.1, 0.35, 0.1, trunk, x, 0.18, z, true));
      const crown = new Mesh(new ConeGeometry(0.28 + (i % 2) * 0.06, 0.55, 6), foliage);
      crown.position.set(x, 0.62, z);
      crown.castShadow = true;
      root.add(crown);
    });

    const coneMat = toon(0xf07a2a);
    const band = toon(0xf7f4ee);
    for (const x of [plan.minX + 0.85, plan.maxX - 0.85]) {
      const cone = new Mesh(new ConeGeometry(0.09, 0.22, 7), coneMat);
      cone.position.set(x, 0.12, plan.maxZ - 0.45);
      cone.castShadow = true;
      root.add(cone);
      root.add(slab(0.1, 0.04, 0.1, band, x, 0.12, plan.maxZ - 0.45));
    }
  }

  function paintPlus(count) {
    if (!plusCtx) return;
    plusCtx.clearRect(0, 0, 128, 64);
    plusCtx.fillStyle = '#1c2430';
    plusCtx.font = '700 36px Nunito, sans-serif';
    plusCtx.textAlign = 'center';
    plusCtx.textBaseline = 'middle';
    plusCtx.fillText(`+${count}`, 64, 34);
    plusTex.needsUpdate = true;
  }

  function buildPeople(force) {
    queueRoot.clear();
    people = [];
    forceVisible.clear();
    for (const idx of force) forceVisible.add(idx);
    for (let i = 0; i < state.queue.length; i += 1) {
      const vip = i === state.gaartjie;
      const person = makePerson(COLORS_HEX(state.queue[i]), i % 3, vip);
      person.userData.phase = i * 0.8;
      person.userData.leaving = false;
      queueRoot.add(person);
      people.push(person);
    }
    placePeople();
  }

  function placePeople() {
    const open = [];
    for (let i = 0; i < state.queue.length; i += 1) {
      if (people[i] && people[i].userData.leaving) continue;
      if (!state.boarded[i] || forceVisible.has(i)) open.push(i);
    }
    const shown = open.slice(0, 6);
    const gap = 0.48;
    const start = -((Math.max(shown.length, 1) - 1) * gap) / 2;
    for (const person of people) {
      if (!person.userData.leaving) person.visible = false;
    }
    shown.forEach((idx, n) => {
      const person = people[idx];
      person.visible = true;
      person.position.set(start + n * gap, 0, plan.queueZ);
      person.userData.baseY = 0;
    });
    const extra = open.length - shown.length;
    plus.visible = extra > 0;
    if (extra > 0) {
      paintPlus(extra);
      plus.position.set(start + shown.length * gap, 0.45, plan.queueZ);
    }
    ring.visible = shown.length > 0;
    if (shown.length) ring.position.set(start, 0.025, plan.queueZ);
  }

  function applyVisual(view, taxi) {
    const covered = !!hidden[taxi.id];
    view.body.visible = !covered;
    view.tarp.visible = covered;
    view.question.visible = covered;
    view.lock.visible = state.locks[taxi.id] > 0;
    view.arrow.visible = showArrows;
    view.question.position.y = 1.32;
    view.lock.position.set(covered ? 0.28 : 0, 1.28, 0);
  }

  function showSeats(id, count) {
    const seats = views[id] && views[id].group.userData.seats;
    if (!seats) return;
    seats.forEach((dot, i) => {
      dot.visible = i < count;
    });
  }

  function placeTaxi(taxi) {
    const view = views[taxi.id];
    if (state.exited[taxi.id]) {
      let bay = -1;
      for (let i = 0; i < state.bayTaxi.length; i += 1) {
        if (state.bayTaxi[i] === taxi.id) bay = i;
      }
      view.pick.visible = false;
      if (bay < 0) {
        view.group.visible = false;
        return;
      }
      const p = plan.bay(bay);
      view.group.visible = true;
      view.group.position.set(p.x, 0, p.z);
      view.group.rotation.y = 0;
      showSeats(taxi.id, state.bayFilled[bay]);
    } else {
      const p = plan.cell(taxi.c, taxi.r);
      view.group.visible = true;
      view.group.position.set(p.x, 0, p.z);
      view.group.rotation.y = yawForDir(taxi.dir);
      view.pick.visible = true;
      showSeats(taxi.id, 0);
    }
    view.body.rotation.set(0, 0, 0);
    view.body.scale.set(1, 1, 1);
    applyVisual(view, taxi);
  }

  function frame() {
    const aspect = (canvas.clientWidth || 1) / (canvas.clientHeight || 1);
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    look.set(0, 0.35, (plan.minZ + plan.maxZ) / 2);
    const dist = 26;
    camBase.set(
      look.x + Math.sin(AZIM) * Math.cos(ELEV) * dist,
      look.y + Math.sin(ELEV) * dist,
      look.z + Math.cos(AZIM) * Math.cos(ELEV) * dist,
    );
    camera.position.copy(camBase);
    camera.lookAt(look);
    camera.updateMatrixWorld(true);
    const corners = [];
    for (const x of [plan.minX, plan.maxX]) {
      for (const y of [0, 1.25]) {
        for (const z of [plan.minZ, plan.maxZ]) corners.push(new Vector3(x, y, z));
      }
    }
    let maxX = 0.001;
    let maxY = 0.001;
    for (const corner of corners) {
      const v = corner.clone().project(camera);
      maxX = Math.max(maxX, Math.abs(v.x));
      maxY = Math.max(maxY, Math.abs(v.y));
    }
    camera.zoom = 0.9 / Math.max(maxX, maxY);
    camera.updateProjectionMatrix();
    const shadowCam = sun.shadow.camera;
    const half = Math.max(7, (plan.maxX - plan.minX) * 0.62);
    shadowCam.left = -half;
    shadowCam.right = half;
    shadowCam.top = half;
    shadowCam.bottom = -half;
    shadowCam.updateProjectionMatrix();
    sun.position.set(look.x - 5, 12, look.z + 5);
    sun.target.position.copy(look);
    sun.target.updateMatrixWorld();
  }

  function load(nextLevel, nextState, nextHidden, opts) {
    clearTweens();
    level = nextLevel;
    state = nextState;
    hidden = nextHidden;
    showArrows = !!(opts && opts.showArrows);
    const livery = (opts && opts.livery) || 'plain';
    plan = layoutPlan(level, state.bayTaxi.length);
    if (root) scene.remove(root);
    root = new Group();
    scene.add(root);
    views = [];
    buildEnvironment();

    queueRoot = new Group();
    root.add(queueRoot);
    ring = new Mesh(
      new CircleGeometry(0.2, 18),
      new MeshBasicMaterial({ color: 0xff8a1f, transparent: true, opacity: 0.95, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    root.add(ring);
    const plusCanvas = document.createElement('canvas');
    plusCanvas.width = 128;
    plusCanvas.height = 64;
    plusCtx = plusCanvas.getContext('2d');
    plusTex = new CanvasTexture(plusCanvas);
    plusTex.colorSpace = SRGBColorSpace;
    plus = new Sprite(new SpriteMaterial({ map: plusTex, transparent: true, depthWrite: false }));
    plus.scale.set(0.55, 0.28, 1);
    root.add(plus);

    for (const taxi of level.taxis) {
      const group = makeCombi(COLORS_HEX(taxi.color));
      addLivery(group, livery);
      const tarp = makeTarp();
      const question = makeQuestion();
      const lock = makePadlock();
      const arrow = makeArrow();
      const pick = mesh(boxGeo(CELL * 0.92, 1.3, CELL * 0.92), pickMat, 0, 0.65, 0);
      pick.userData.id = taxi.id;
      group.add(tarp, question, lock, arrow, pick);
      root.add(group);
      views[taxi.id] = {
        group,
        body: group.userData.body,
        tarp,
        question,
        lock,
        arrow,
        pick,
      };
      placeTaxi(taxi);
    }
    buildPeople([]);
    resize();
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || !plan) return;
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    frame();
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, clock.getDelta());
    const elapsed = clock.elapsedTime;
    stepTweens(dt);
    if (!reduced) {
      for (const person of people) {
        if (!person.visible || person.userData.hopping) continue;
        person.position.y = Math.sin(elapsed * 2.5 + person.userData.phase) * 0.03;
      }
      for (const view of views) {
        if (view && view.question.visible) {
          view.question.position.y = 1.32 + Math.sin(elapsed * 2.2 + view.pick.userData.id) * 0.04;
        }
      }
    }
    camera.position.copy(camBase);
    if (shakeAmp > 0.001) {
      camera.position.x += (Math.random() - 0.5) * shakeAmp;
      camera.position.y += (Math.random() - 0.5) * shakeAmp * 0.45;
      shakeAmp *= 0.86;
    }
    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    clock.getDelta();
    loop();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return -1;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const targets = [];
    for (const view of views) {
      if (view && view.pick.visible) targets.push(view.pick);
    }
    const hits = raycaster.intersectObjects(targets, false);
    if (!hits.length) return -1;
    return hits[0].object.userData.id;
  }

  function project(id) {
    const view = views[id];
    if (!view) return null;
    const v = new Vector3(view.group.position.x, 1.2, view.group.position.z);
    v.project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + (v.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-v.y * 0.5 + 0.5) * rect.height,
    };
  }

  function pathPoints(id) {
    const taxi = level.taxis[id];
    const dir = DIRS[taxi.dir];
    const points = [plan.cell(taxi.c, taxi.r)];
    let c = taxi.c + dir.x;
    let r = taxi.r + dir.y;
    while (plan.inside(c, r)) {
      points.push(plan.cell(c, r));
      c += dir.x;
      r += dir.y;
    }
    const last = points[points.length - 1];
    points.push({ x: last.x + dir.x * CELL, z: last.z + dir.y * CELL });
    return points;
  }

  async function drive(group, points, dustOn) {
    const body = group.userData.body;
    const wheels = group.userData.wheels;
    const lengths = [];
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
      const len = Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z);
      lengths.push(len);
      total += len;
    }
    if (total < 0.001) return;
    let spun = 0;
    let lastPuff = 0;
    await animate(seconds(160 + total * 130), 'in', (u) => {
      const dist = u * total;
      let acc = 0;
      let seg = 0;
      while (seg < lengths.length - 1 && acc + lengths[seg] < dist) {
        acc += lengths[seg];
        seg += 1;
      }
      const segLen = lengths[seg] || 1;
      const f = Math.min(1, (dist - acc) / segLen);
      const a = points[seg];
      const b = points[seg + 1];
      group.position.x = a.x + (b.x - a.x) * f;
      group.position.z = a.z + (b.z - a.z) * f;
      group.rotation.y = Math.atan2(-(b.x - a.x), -(b.z - a.z));
      body.rotation.x = 0.045;
      body.rotation.z = Math.sin(u * Math.PI * 2) * 0.02;
      const delta = (dist - spun) / 0.135;
      spun = dist;
      for (const wheel of wheels) wheel.rotation.x += delta;
      if (dustOn && !reduced) {
        const now = performance.now();
        if (now - lastPuff > 48) {
          lastPuff = now;
          const rearX = Math.sin(group.rotation.y) * 0.35;
          const rearZ = Math.cos(group.rotation.y) * 0.35;
          puff(group.position.x + rearX, group.position.z + rearZ);
        }
      }
    });
    body.rotation.x = 0;
    body.rotation.z = 0;
  }

  async function turnYaw(group, target, ms) {
    const start = group.rotation.y;
    await animate(seconds(ms), 'out', (u) => {
      group.rotation.y = lerpAngle(start, target, u);
    });
    group.rotation.y = target;
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
    reveal(id) {
      const taxi = level.taxis[id];
      if (taxi) applyVisual(views[id], taxi);
    },
    async bump(id) {
      const view = views[id];
      const dir = DIRS[level.taxis[id].dir];
      const baseX = view.group.position.x;
      const baseZ = view.group.position.z;
      shakeAmp = Math.max(shakeAmp, reduced ? 0 : 0.12);
      await animate(seconds(80), 'out', (u) => {
        view.group.position.x = baseX + dir.x * 0.2 * u;
        view.group.position.z = baseZ + dir.y * 0.2 * u;
        view.body.rotation.x = 0.08 * u;
      });
      await animate(seconds(120), 'out', (u) => {
        view.group.position.x = baseX + dir.x * 0.2 * (1 - u);
        view.group.position.z = baseZ + dir.y * 0.2 * (1 - u);
        view.body.rotation.x = 0.08 * (1 - u);
      });
      view.body.rotation.x = 0;
    },
    async unlock(id, locksLeft) {
      const view = views[id];
      const lock = view.lock;
      const y0 = lock.position.y;
      await animate(seconds(160), 'out', (u) => {
        lock.position.y = y0 + u * 0.4;
        lock.scale.setScalar(1 + u * 0.35);
      });
      lock.visible = locksLeft > 0;
      lock.position.y = y0;
      lock.scale.setScalar(1);
      await animate(seconds(140), 'out', (u) => {
        const s = Math.sin(u * Math.PI);
        view.body.scale.set(1 + s * 0.05, 1 - s * 0.07, 1);
      });
      view.body.scale.set(1, 1, 1);
    },
    async exit(id, bay) {
      const view = views[id];
      view.pick.visible = false;
      const points = pathPoints(id);
      points.push(plan.bay(bay));
      await drive(view.group, points, true);
      await turnYaw(view.group, 0, 160);
      showSeats(id, 0);
    },
    async board(event) {
      const person = people[event.pIndex];
      if (!person) return;
      if (!person.visible) {
        person.position.set(plus.position.x, 0, plus.position.z);
        person.visible = true;
      }
      const from = person.position.clone();
      person.userData.leaving = true;
      person.userData.hopping = true;
      placePeople();
      const to = plan.bay(event.bay);
      await animate(seconds(220), 'out', (u) => {
        person.position.x = from.x + (to.x - from.x) * u;
        person.position.z = from.z + (to.z - from.z) * u;
        person.position.y = Math.sin(u * Math.PI) * 0.55;
      });
      person.visible = false;
      person.userData.leaving = false;
      person.userData.hopping = false;
      person.position.y = 0;
      forceVisible.delete(event.pIndex);
      showSeats(event.taxiId, event.filled);
      placePeople();
    },
    async depart(id) {
      const view = views[id];
      if (!view || !view.group.visible) return;
      const from = view.group.position.clone();
      const yaw = view.group.rotation.y;
      const dirx = -Math.sin(yaw);
      const dirz = -Math.cos(yaw);
      await drive(view.group, [
        { x: from.x, z: from.z },
        { x: from.x + dirx * 3.2, z: from.z + dirz * 3.2 },
      ], true);
      view.group.visible = false;
      showSeats(id, 0);
    },
    syncPeople(next, pretend) {
      state = next;
      buildPeople(pretend || []);
    },
    shake() {
      shakeAmp = Math.max(shakeAmp, reduced ? 0 : 0.1);
    },
  };
}

function COLORS_HEX(index) {
  const hex = (COLORS[index] || COLORS[0]).hex;
  return Number.parseInt(hex.slice(1), 16);
}

export function createTurntable(canvas) {
  const reduced = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = makeRenderer(canvas, true);
  } catch (error) {
    return { ok: false, error };
  }
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  addLights(scene, true);
  const clock = new Clock();
  let group = null;
  let running = false;
  let raf = 0;

  const ground = new Mesh(
    new CircleGeometry(1.15, 28),
    new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.left = -aspect * 1.15;
    camera.right = aspect * 1.15;
    camera.top = 1.15;
    camera.bottom = -1.15;
    camera.zoom = 1.15;
    camera.updateProjectionMatrix();
    const elev = 28 * Math.PI / 180;
    camera.position.set(Math.sin(0.5) * Math.cos(elev) * 8, Math.sin(elev) * 8 + 0.4, Math.cos(0.5) * Math.cos(elev) * 8);
    camera.lookAt(0, 0.4, 0);
  }

  function setLook(livery) {
    if (group) scene.remove(group);
    group = makeCombi(0xe23d3d);
    addLivery(group, livery);
    group.rotation.y = 0.4;
    scene.add(group);
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, clock.getDelta());
    if (group && !reduced) group.rotation.y += dt * 0.45;
    renderer.render(scene, camera);
  }

  return {
    ok: true,
    resize,
    setLook,
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      loop();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}

let thumbKit = null;
export function renderThumb(target, livery) {
  if (!thumbKit) {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 120;
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(192, 120, false);
    renderer.outputColorSpace = SRGBColorSpace;
    const scene = new Scene();
    scene.background = new Color(0xeef3f8);
    const camera = new OrthographicCamera(-1.15, 1.15, 0.78, -0.78, 0.1, 20);
    addLights(scene, false);
    camera.position.set(-2.2, 1.45, -2.0);
    camera.lookAt(0, 0.42, 0);
    thumbKit = { renderer, scene, camera, canvas, group: null };
  }
  if (thumbKit.group) thumbKit.scene.remove(thumbKit.group);
  thumbKit.group = makeCombi(0xe23d3d);
  addLivery(thumbKit.group, livery);
  thumbKit.group.rotation.y = -0.55;
  thumbKit.scene.add(thumbKit.group);
  thumbKit.renderer.render(thumbKit.scene, thumbKit.camera);
  const ctx = target.getContext('2d');
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.drawImage(thumbKit.canvas, 0, 0, target.width, target.height);
}
