/**
 * Low-poly rank. Orthographic camera, flat toon materials, procedural combis.
 * The puzzle rules stay in engine.js. This module only shows them.
 */

import { DIRS, taxiCells } from './engine.js';
import { colorHex, REGIONS } from './theme.js';
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
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
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  NoColorSpace,
  OrthographicCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SphereGeometry,
  Sprite,
  TorusGeometry,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from '../vendor/three.module.js';

const CELL = 1.16;
const ELEV = 68 * Math.PI / 180;
const AZIM = 0;

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
  ['#4a4a4a', '#8d8d8d', '#cfcfcf', '#ffffff'].forEach((color, i) => {
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

const glassMat = new MeshBasicMaterial({ color: 0x1a2430 });
const lampMat = new MeshBasicMaterial({ color: 0xffe08a });
const tailMat = new MeshBasicMaterial({ color: 0xc5363a });
const arrowMat = new MeshBasicMaterial({ color: 0xfff6d0 });
const arrowInk = new MeshBasicMaterial({ color: 0x1c1f26 });
const pickMat = new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });

let toonVC;
let basicVC;
function vertexMaterial(kind) {
  if (kind === 'toon') {
    if (!toonVC) {
      toonVC = new MeshToonMaterial({ color: 0xffffff, vertexColors: true, gradientMap: toonGradient() });
    }
    return toonVC;
  }
  if (!basicVC) basicVC = new MeshBasicMaterial({ color: 0xffffff, vertexColors: true });
  return basicVC;
}

function paintColor(geometry, color) {
  const count = geometry.getAttribute('position').count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
}

function mergeGeometries(geos) {
  let verts = 0;
  let indexCount = 0;
  for (const g of geos) {
    const count = g.getAttribute('position').count;
    verts += count;
    indexCount += g.index ? g.index.count : count;
  }
  const positions = new Float32Array(verts * 3);
  const normals = new Float32Array(verts * 3);
  const colors = new Float32Array(verts * 3);
  const indices = new Uint32Array(indexCount);
  let vertex = 0;
  let index = 0;
  for (const g of geos) {
    const position = g.getAttribute('position');
    const normal = g.getAttribute('normal');
    const color = g.getAttribute('color');
    positions.set(position.array, vertex * 3);
    if (normal) normals.set(normal.array, vertex * 3);
    if (color) colors.set(color.array, vertex * 3);
    if (g.index) {
      for (let i = 0; i < g.index.count; i += 1) indices[index++] = g.index.getX(i) + vertex;
    } else {
      for (let i = 0; i < position.count; i += 1) indices[index++] = vertex + i;
    }
    vertex += position.count;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new BufferAttribute(normals, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setIndex(new BufferAttribute(indices, 1));
  return geometry;
}

function collapse(root) {
  root.updateMatrixWorld(true);
  const inverse = new Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map();
  const remove = [];
  root.traverse((obj) => {
    if (!obj.isMesh || obj.material.transparent) return;
    let parent = obj;
    while (parent) {
      if (parent.userData && parent.userData.keep) return;
      parent = parent.parent;
    }
    const geometry = obj.geometry.clone();
    geometry.applyMatrix4(new Matrix4().multiplyMatrices(inverse, obj.matrixWorld));
    paintColor(geometry, obj.material.color);
    const kind = obj.material.type === 'MeshToonMaterial' ? 'toon' : 'basic';
    let bucket = buckets.get(kind);
    if (!bucket) {
      bucket = { kind, cast: false, geos: [] };
      buckets.set(kind, bucket);
    }
    bucket.cast = bucket.cast || obj.castShadow;
    bucket.geos.push(geometry);
    remove.push(obj);
  });
  for (const obj of remove) obj.removeFromParent();
  for (const bucket of buckets.values()) {
    const merged = new Mesh(mergeGeometries(bucket.geos), vertexMaterial(bucket.kind));
    merged.castShadow = bucket.cast;
    merged.receiveShadow = true;
    root.add(merged);
  }
}

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
  const white = toon(0xf7f8fb);
  const stripe = toon(color);
  const black = toon(0x1c1f26);
  const rubber = toon(0x22262e);
  const arch = toon(0x2a3038);

  body.add(slab(0.62, 0.16, 1.18, white, 0, 0.20, 0.04, true));
  body.add(slab(0.60, 0.36, 0.86, white, 0, 0.44, 0.18, true));
  body.add(slab(0.64, 0.045, 0.84, glassMat, 0, 0.64, 0.18));
  body.add(slab(0.50, 0.05, 0.68, white, 0, 0.68, 0.18, true));
  body.add(slab(0.36, 0.035, 0.46, stripe, 0, 0.72, 0.16));

  const bonnet = slab(0.46, 0.09, 0.30, white, 0, 0.26, -0.50, true);
  bonnet.rotation.x = -0.7;
  body.add(bonnet);
  body.add(slab(0.50, 0.05, 0.07, black, 0, 0.15, -0.60));

  body.add(slab(0.05, 0.10, 1.02, stripe, 0.33, 0.28, 0.06));
  body.add(slab(0.05, 0.10, 1.02, stripe, -0.33, 0.28, 0.06));
  body.add(slab(0.04, 0.05, 0.84, stripe, 0.30, 0.66, 0.18));
  body.add(slab(0.04, 0.05, 0.84, stripe, -0.30, 0.66, 0.18));

  const wind = slab(0.46, 0.16, 0.03, glassMat, 0, 0.46, -0.26);
  wind.rotation.x = -0.6;
  body.add(wind);
  body.add(slab(0.025, 0.14, 0.72, glassMat, 0.31, 0.48, 0.20));
  body.add(slab(0.025, 0.14, 0.72, glassMat, -0.31, 0.48, 0.20));
  body.add(slab(0.018, 0.30, 0.02, black, 0.315, 0.40, 0.02));

  for (const [x, z] of [[-0.34, -0.36], [0.34, -0.36], [-0.34, 0.46], [0.34, 0.46]]) {
    body.add(slab(0.16, 0.07, 0.24, arch, x, 0.18, z));
  }

  body.add(slab(0.08, 0.05, 0.03, lampMat, -0.18, 0.24, -0.60));
  body.add(slab(0.08, 0.05, 0.03, lampMat, 0.18, 0.24, -0.60));
  body.add(slab(0.08, 0.05, 0.03, tailMat, -0.20, 0.26, 0.66));
  body.add(slab(0.08, 0.05, 0.03, tailMat, 0.20, 0.26, 0.66));

  const wheels = [];
  for (const [x, z] of [[-0.38, -0.36], [0.38, -0.36], [-0.38, 0.46], [0.38, 0.46]]) {
    const axle = new Group();
    axle.position.set(x, 0.15, z);
    const tire = mesh(cylGeo(0.155, 0.11, 10), rubber, 0, 0, 0, false);
    tire.rotation.z = Math.PI / 2;
    axle.userData.keep = true;
    axle.add(tire);
    body.add(axle);
    wheels.push(axle);
  }

  const seats = [];
  for (let i = 0; i < 4; i += 1) {
    const dot = mesh(sphGeo(0.045, 6, 5), stripe, 0.30, 0.58, -0.02 + i * 0.16);
    dot.visible = false;
    dot.userData.keep = true;
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
  g.add(mesh(boxGeo(0.16, 0.02, 0.46), arrowInk, 0, 0.78, 0.16));
  const shaft = mesh(boxGeo(0.10, 0.03, 0.34), arrowMat, 0, 0.80, 0.18);
  const left = mesh(boxGeo(0.22, 0.03, 0.08), arrowMat, -0.09, 0.80, -0.02);
  left.rotation.y = 0.65;
  const right = mesh(boxGeo(0.22, 0.03, 0.08), arrowMat, 0.09, 0.80, -0.02);
  right.rotation.y = -0.65;
  g.add(shaft, left, right);
  collapse(g);
  return g;
}

function makeSign(colorIndex) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1c2430';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const mark = colorIndex % 8;
  if (mark === 0) { ctx.beginPath(); ctx.moveTo(32, 14); ctx.lineTo(32, 50); ctx.stroke(); }
  else if (mark === 1) { ctx.beginPath(); ctx.moveTo(14, 32); ctx.lineTo(50, 32); ctx.stroke(); }
  else if (mark === 2) { ctx.beginPath(); ctx.arc(32, 32, 12, 0, Math.PI * 2); ctx.stroke(); }
  else if (mark === 3) { ctx.strokeRect(22, 16, 8, 28); ctx.strokeRect(22, 36, 20, 8); }
  else if (mark === 4) { ctx.beginPath(); ctx.moveTo(18, 44); ctx.lineTo(32, 16); ctx.lineTo(46, 44); ctx.stroke(); }
  else if (mark === 5) { ctx.fillStyle = '#1c2430'; ctx.fillRect(20, 20, 24, 24); }
  else if (mark === 6) { ctx.beginPath(); ctx.moveTo(32, 16); ctx.lineTo(32, 46); ctx.moveTo(22, 36); ctx.lineTo(32, 48); ctx.lineTo(42, 36); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(32, 34, 12, Math.PI * 0.2, Math.PI * 1.4); ctx.stroke(); }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  const sprite = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(0.28, 0.28, 1);
  return sprite;
}

function makeNumberLock() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  const sprite = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(0.42, 0.42, 1);
  sprite.userData.paint = (n) => {
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1c2430';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = '#1c2430';
    ctx.font = '700 64px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(n), 64, 70);
    tex.needsUpdate = true;
  };
  sprite.userData.paint(1);
  return sprite;
}

function makePerson(color, variant, vip, luggage, signIndex) {
  const g = new Group();
  const cloth = toon(color);
  const skin = toon(0xf0c7a2);
  const body = mesh(new CapsuleGeometry(0.11, 0.16, 2, 8), cloth, 0, 0.32, 0, false);
  const head = mesh(sphGeo(0.105, 8, 6), skin, 0, 0.56, 0, false);
  g.add(body, head);
  if (signIndex != null) {
    const sign = makeSign(signIndex);
    sign.position.set(0, 0.78, 0);
    sign.scale.set(0.22, 0.22, 1);
    g.add(sign);
  }
  if (luggage) {
    g.add(mesh(boxGeo(0.16, 0.12, 0.12), toon(0xc9842a), 0.16, 0.2, 0.02));
  }
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
  collapse(g);
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
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  const renderer = new WebGLRenderer({
    canvas,
    antialias: dpr < 1.5,
    alpha,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = 1;
  if (!alpha) renderer.setClearColor(0xb7def2, 1);
  return renderer;
}

function addLights(scene, shadow) {
  scene.add(new HemisphereLight(0xfff0d8, 0x8a6844, 0.55));
  scene.add(new AmbientLight(0xfff8ef, 0.55));
  const sun = new DirectionalLight(0xffe2b8, 1.05);
  sun.position.set(-5, 11, 6);
  if (shadow) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(256, 256);
    sun.shadow.autoUpdate = false;
    sun.shadow.needsUpdate = true;
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
  let shadowWarm = 3;
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
  let heads = [];
  let hazardRoot = null;
  let officerMesh = null;
  let lightMeshes = [];
  let queueRoot = null;
  let plus = null;
  let plusCtx = null;
  let plusTex = null;
  let ring = null;
  const forceVisible = new Set();
  const look = new Vector3();
  const projectScratch = new Vector3();
  const cornerScratch = new Vector3();

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
    const look = regionLook(level && level.region);
    scene.background = new Color(0x5e5852);
    const apron = new Mesh(new PlaneGeometry(48, 48), toon(0x6a6258));
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(0, -0.04, (plan.minZ + plan.maxZ) / 2);
    apron.receiveShadow = true;
    root.add(apron);
    const paving = new Mesh(new PlaneGeometry(plan.span + 6.5, (plan.maxZ - plan.minZ) + 5.5), toon(0xc4b6a4));
    paving.rotation.x = -Math.PI / 2;
    paving.position.set(0, -0.02, (plan.minZ + plan.maxZ) / 2);
    paving.receiveShadow = true;
    root.add(paving);

    const yardNear = plan.queueZ + 0.45;
    const yardFar = plan.maxZ - 0.2;
    const asphalt = new Mesh(
      new PlaneGeometry(plan.span + 1.15, yardFar - yardNear),
      toon(look.ground),
    );
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.set(0, 0, (yardNear + yardFar) / 2);
    asphalt.receiveShadow = true;
    root.add(asphalt);

    const yard = new Group();
    const kerb = toon(0xe4e0d8);
    const yardW = plan.span + 1.35;
    const yardD = plan.maxZ - plan.minZ - 0.2;
    const yardZ = (plan.minZ + plan.maxZ) / 2;
    yard.add(slab(yardW, 0.08, 0.12, kerb, 0, 0.04, plan.minZ + 0.15));
    yard.add(slab(yardW, 0.08, 0.12, kerb, 0, 0.04, plan.maxZ - 0.15));
    yard.add(slab(0.12, 0.08, yardD, kerb, -yardW / 2, 0.04, yardZ));
    yard.add(slab(0.12, 0.08, yardD, kerb, yardW / 2, 0.04, yardZ));

    const line = toon(0xf7f4ee);
    for (let r = 0; r < plan.rows; r += 1) {
      for (let c = 0; c < plan.cols; c += 1) {
        const p = plan.cell(c, r);
        const w = CELL * 0.86;
        yard.add(slab(w, 0.012, 0.035, line, p.x, 0.02, p.z - w / 2));
        yard.add(slab(w, 0.012, 0.035, line, p.x, 0.02, p.z + w / 2));
        yard.add(slab(0.035, 0.012, w, line, p.x - w / 2, 0.02, p.z));
        yard.add(slab(0.035, 0.012, w, line, p.x + w / 2, 0.02, p.z));
      }
    }

    const bayFill = toon(0xd5dde6);
    const bayEdge = toon(0xff8a1f);
    for (let i = 0; i < state.bayTaxi.length; i += 1) {
      const p = plan.bay(i);
      yard.add(slab(plan.bayPitch * 0.82, 0.025, 1.05, bayFill, p.x, 0.02, p.z));
      yard.add(slab(plan.bayPitch * 0.82, 0.02, 0.06, bayEdge, p.x, 0.035, p.z - 0.5));
      yard.add(slab(0.05, 0.02, 1.05, line, p.x - plan.bayPitch * 0.41, 0.035, p.z));
      yard.add(slab(0.05, 0.02, 1.05, line, p.x + plan.bayPitch * 0.41, 0.035, p.z));
    }
    collapse(yard);
    root.add(yard);

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

    const props = new Group();
    props.add(slab(0.72, 0.07, 0.28, toon(0xc9842a), plan.minX - 1.35, 0.28, plan.queueZ + 0.2));
    props.add(slab(0.08, 0.26, 0.28, toon(0x8a5a32), plan.minX - 1.62, 0.14, plan.queueZ + 0.2));
    props.add(slab(0.26, 0.4, 0.26, toon(0x2f6b4f), plan.maxX + 1.25, 0.22, plan.maxZ - 0.2));
    props.add(slab(0.07, 1.15, 0.07, toon(0x243044), plan.minX - 1.15, 0.58, plan.maxZ + 0.15));
    props.add(mesh(sphGeo(0.11, 8, 6), new MeshBasicMaterial({ color: 0xffe08a }), plan.minX - 1.15, 1.2, plan.maxZ + 0.15));
    collapse(props);
    root.add(props);

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
      crown.castShadow = false;
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

  function addHazards() {
    hazardRoot = new Group();
    root.add(hazardRoot);
    for (const cone of level.cones || []) {
      const at = plan.cell(cone.c, cone.r);
      const body = new Mesh(new ConeGeometry(0.16, 0.32, 7), toon(0xf07a2a));
      body.position.set(at.x, 0.16, at.z);
      body.castShadow = true;
      hazardRoot.add(body);
    }
    if (level.officer && level.officer.path) {
      officerMesh = makePerson(0xf2c14e, 0, false, false, 1);
      officerMesh.scale.setScalar(0.85);
      hazardRoot.add(officerMesh);
      syncOfficer();
    }
    lightMeshes = [];
    for (const robot of level.robots || []) {
      const along = robot.dir === 0 ? 0 : robot.dir === 2 ? level.rows - 1 : robot.lane;
      const across = robot.dir % 2 === 0 ? robot.lane : (robot.dir === 1 ? level.cols - 1 : 0);
      const c = robot.dir % 2 === 0 ? robot.lane : across;
      const r = robot.dir % 2 === 0 ? (robot.dir === 2 ? level.rows - 1 : 0) : robot.lane;
      const at = plan.cell(Math.max(0, Math.min(level.cols - 1, c)), Math.max(0, Math.min(level.rows - 1, r)));
      const pole = mesh(boxGeo(0.06, 0.7, 0.06), toon(0x243044), at.x, 0.35, at.z, true);
      const lampMat = new MeshBasicMaterial({ color: 0x3e9b4f });
      const lamp = mesh(sphGeo(0.1, 8, 6), lampMat, at.x, 0.78, at.z);
      lamp.userData.robot = robot;
      lamp.userData.mat = lampMat;
      hazardRoot.add(pole, lamp);
      lightMeshes.push(lamp);
    }
    syncLights();
    if (level.region === 'cape') {
      const hill = new Mesh(new ConeGeometry(0.7, 0.9, 5), toon(0x8aa0b8));
      hill.position.set(plan.maxX + 0.2, 0.4, plan.minZ);
      hazardRoot.add(hill);
    } else if (level.region === 'joburg') {
      const tower = mesh(boxGeo(0.18, 1.1, 0.18), toon(0xd7dde6), plan.minX - 0.1, 0.55, plan.maxZ, true);
      hazardRoot.add(tower);
    } else if (level.region === 'gqeberha') {
      const arch = mesh(boxGeo(0.9, 0.08, 0.08), toon(0xc5ced6), 0, 0.7, plan.maxZ + 0.2);
      hazardRoot.add(arch);
    } else if (level.region === 'bloem') {
      const spire = mesh(boxGeo(0.16, 0.9, 0.16), toon(0xe7d7b0), plan.maxX, 0.45, plan.maxZ, true);
      hazardRoot.add(spire);
    } else {
      const wheel = new Mesh(new TorusGeometry(0.28, 0.05, 6, 10), toon(0xf4f7fb));
      wheel.position.set(plan.minX, 0.35, plan.minZ);
      hazardRoot.add(wheel);
    }
  }

  function syncOfficer() {
    if (!officerMesh || !level.officer) return;
    const index = Math.floor((state.moves || 0) / 3) % level.officer.path.length;
    const cell = level.officer.path[index];
    const at = plan.cell(cell.c, cell.r);
    officerMesh.position.set(at.x, 0, at.z);
  }

  function syncLights() {
    const green = Math.floor((state.moves || 0) / 2) % 2 === 0;
    for (const lamp of lightMeshes || []) {
      lamp.userData.mat.color.set(green ? 0x3e9b4f : 0xe23d3d);
    }
  }

  function buildPeople() {
    queueRoot.clear();
    people = [];
    heads = [];
    const queues = state.queues || [state.queue || []];
    const boarded = state.boarded || [];
    queues.forEach((queue, q) => {
      const flags = boarded[q] || [];
      let shown = 0;
      queue.forEach((person, index) => {
        if (flags[index]) return;
        if (shown >= 5) return;
        const meshPerson = makePerson(COLORS_HEX(person.color), index % 3, !!person.vip, !!person.luggage, person.color);
        meshPerson.userData.queue = q;
        meshPerson.userData.index = index;
        meshPerson.userData.phase = index + q;
        meshPerson.userData.head = shown === 0;
        meshPerson.userData.slot = shown;
        queueRoot.add(meshPerson);
        people.push(meshPerson);
        if (shown === 0) heads.push(meshPerson);
        shown += 1;
      });
    });
    placePeople();
  }

  function placePeople() {
    const rows = [[], []];
    for (const person of people) {
      if (person.userData.leaving) continue;
      rows[person.userData.queue] = rows[person.userData.queue] || [];
      rows[person.userData.queue].push(person);
    }
    rows.forEach((row, q) => {
      const gap = 0.46;
      const start = -((Math.max(row.length, 1) - 1) * gap) / 2;
      const z = plan.queueZ - q * 0.62;
      row.forEach((person, n) => {
        person.visible = true;
        person.position.set(start + n * gap, 0, z);
      });
      if (q === 0 && row[0]) ring.position.set(row[0].position.x, 0.025, z);
    });
    ring.visible = !!(rows[0] && rows[0][0]);
    plus.visible = false;
  }

  function centerOf(taxi) {
    const dir = DIRS[taxi.dir];
    const len = taxi.len || 1;
    const tailC = taxi.c - dir.x * (len - 1);
    const tailR = taxi.r - dir.y * (len - 1);
    return plan.cell((taxi.c + tailC) / 2, (taxi.r + tailR) / 2);
  }

  function fitScale(taxi) {
    const len = taxi.len || 3;
    return (len * CELL * 0.86) / 1.05;
  }

  function applyVisual(view, taxi) {
    const covered = !!(taxi.hidden && state.revealed && !state.revealed[taxi.id]);
    view.body.visible = !covered;
    view.tarp.visible = covered;
    view.question.visible = covered;
    const left = Math.max(0, (taxi.lockAfter || 0) - (state.departed || 0));
    view.lock.visible = left > 0;
    if (left > 0 && view.lock.userData.paint) view.lock.userData.paint(left);
    view.arrow.visible = true;
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
      view.group.scale.set(0.38, 0.38, 0.38);
      showSeats(taxi.id, state.bayFilled[bay]);
    } else {
      const p = centerOf(taxi);
      view.group.visible = true;
      view.group.position.set(p.x, 0, p.z);
      view.group.rotation.y = yawForDir(taxi.dir);
      view.group.scale.set(1, 1, fitScale(taxi));
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
    let maxX = 0.001;
    let maxY = 0.001;
    for (const x of [plan.minX, plan.maxX]) {
      for (const y of [0, 1.25]) {
        for (const z of [plan.minZ, plan.maxZ]) {
          const v = cornerScratch.set(x, y, z).project(camera);
          maxX = Math.max(maxX, Math.abs(v.x));
          maxY = Math.max(maxY, Math.abs(v.y));
        }
      }
    }
    const widthFit = 0.92 / maxX;
    const heightFit = 0.96 / maxY;
    camera.zoom = Math.min(widthFit, heightFit);
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
    showArrows = true;
    colorblind = !!(opts && opts.colorblind);
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

    addHazards();
    for (const taxi of level.taxis) {
      const colors = taxi.colors || [taxi.color || 0];
      const group = makeCombi(COLORS_HEX(colors[0]));
      addLivery(group, livery);
      if (colors[1] != null) {
        const stripe = slab(0.04, 0.07, 0.9, toon(COLORS_HEX(colors[1])), -0.34, 0.52, 0.04);
        group.userData.body.add(stripe);
      }
      const sign = makeSign(colors[0]);
      sign.position.set(0, 0.92, 0.42);
      group.userData.body.add(sign);
      collapse(group.userData.body);
      const tarp = makeTarp();
      const question = makeQuestion();
      const lock = makeNumberLock();
      const arrow = makeArrow();
      const flashBox = mesh(
        boxGeo(0.8, 0.5, 1.1),
        new MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0, depthWrite: false }),
        0, 0.5, 0,
      );
      flashBox.visible = false;
      const pick = mesh(boxGeo(CELL * 0.92, 1.3, 1.05), pickMat, 0, 0.65, 0);
      pick.userData.id = taxi.id;
      pick.layers.set(1);
      pick.castShadow = false;
      pick.receiveShadow = false;
      group.add(tarp, question, lock, arrow, pick, flashBox);
      root.add(group);
      views[taxi.id] = {
        group,
        body: group.userData.body,
        tarp,
        question,
        lock,
        arrow,
        pick,
        flash: flashBox,
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
    sun.shadow.needsUpdate = shadowWarm > 0 || tweens.length > 0 || shakeAmp > 0.001;
    if (shadowWarm > 0) shadowWarm -= 1;
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
    raycaster.layers.enable(1);
    raycaster.setFromCamera(pointer, camera);
    const targets = [];
    for (const head of heads) targets.push(head);
    for (const view of views) {
      if (view && view.pick.visible) targets.push(view.pick);
    }
    const hits = raycaster.intersectObjects(targets, true);
    if (!hits.length) return null;
    let obj = hits[0].object;
    while (obj && obj.userData.queue == null && obj.userData.id == null && obj.parent) obj = obj.parent;
    if (obj && obj.userData.queue != null) return { kind: 'queue', queue: obj.userData.queue };
    if (obj && obj.userData.id != null) return { kind: 'taxi', id: obj.userData.id };
    return null;
  }

  function project(id) {
    const view = views[id];
    if (!view) return null;
    const v = projectScratch;
  v.set(view.group.position.x, 1.2, view.group.position.z);
    v.project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + (v.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-v.y * 0.5 + 0.5) * rect.height,
    };
  }

  function fillet(points) {
    const out = [points[0]];
    for (let i = 1; i < points.length - 1; i += 1) {
      const prev = points[i - 1];
      const at = points[i];
      const next = points[i + 1];
      const inLen = Math.hypot(at.x - prev.x, at.z - prev.z) || 1;
      const outLen = Math.hypot(next.x - at.x, next.z - at.z) || 1;
      const trim = Math.min(0.55, inLen * 0.45, outLen * 0.45);
      const a = {
        x: at.x - ((at.x - prev.x) / inLen) * trim,
        z: at.z - ((at.z - prev.z) / inLen) * trim,
      };
      const b = {
        x: at.x + ((next.x - at.x) / outLen) * trim,
        z: at.z + ((next.z - at.z) / outLen) * trim,
      };
      out.push(a);
      for (let step = 1; step <= 4; step += 1) {
        const t = step / 5;
        const u = 1 - t;
        out.push({
          x: u * u * a.x + 2 * u * t * at.x + t * t * b.x,
          z: u * u * a.z + 2 * u * t * at.z + t * t * b.z,
        });
      }
      out.push(b);
    }
    out.push(points[points.length - 1]);
    points.length = 0;
    for (const point of out) points.push(point);
  }

  function pathPoints(id) {
    const taxi = level.taxis[id];
    const dir = DIRS[taxi.dir];
    const points = [centerOf(taxi)];
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
    await animate(seconds(160 + total * 130), 'out', (u) => {
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
      const bayPoint = plan.bay(bay);
      const taxi = level.taxis[id];
      const dir = DIRS[taxi.dir];
      const end = points[points.length - 1];
      const clear = ((taxi.len || 2) - 1) * CELL + 0.6;
      const out = { x: end.x + dir.x * clear, z: end.z + dir.y * clear };
      points.push(out);
      const frontZ = plan.bayZ - 1.7;
      const sideX = out.x >= 0 ? plan.maxX + 1.8 : plan.minX - 1.8;
      if (dir.y < 0) {
        const laneZ = Math.min(out.z, frontZ);
        if (out.z > laneZ + 0.05) points.push({ x: out.x, z: laneZ });
        points.push({ x: bayPoint.x, z: laneZ });
      } else if (dir.y > 0) {
        points.push({ x: sideX, z: out.z });
        points.push({ x: sideX, z: frontZ });
        points.push({ x: bayPoint.x, z: frontZ });
      } else {
        points.push({ x: out.x, z: frontZ });
        points.push({ x: bayPoint.x, z: frontZ });
      }
      points.push(bayPoint);
      fillet(points);
      const from = view.group.scale.z;
      await drive(view.group, points, true);
      await animate(seconds(200), 'out', (u) => {
        const s = 1 + (0.4 - 1) * u;
        view.group.scale.set(s, s, from + (0.4 - from) * u);
      });
      await turnYaw(view.group, 0, 160);
      showSeats(id, 0);
    },
    async board(event) {
      const person = people.find((item) => item.userData.queue === (event.queue || 0) && item.userData.index === event.pIndex);
      if (event.filled > 4) {
        if (person) person.visible = false;
        showSeats(event.taxiId, event.filled);
        placePeople();
        return;
      }
      if (!person) {
        showSeats(event.taxiId, event.filled);
        return;
      }
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
    syncPeople(next) {
      state = next;
      buildPeople();
      syncOfficer();
      syncLights();
      for (const taxi of level.taxis) if (views[taxi.id]) applyVisual(views[taxi.id], taxi);
    },
    flash(id) {
      const view = views[id];
      if (!view || !view.flash) return;
      view.flash.visible = true;
      animate(seconds(180), 'out', (u) => {
        view.flash.material.opacity = u < 0.5 ? u * 1.2 : (1 - u) * 1.2;
        if (u > 0.98) view.flash.visible = false;
      });
    },
    pulse(id) {
      const view = views[id];
      if (!view) return;
      const base = view.arrow.scale.x || 1;
      animate(seconds(500), 'out', (u) => {
        const s = 1 + Math.sin(u * Math.PI) * 0.35;
        view.arrow.scale.set(base * s, base * s, base * s);
      });
    },
    shake() {
      shakeAmp = Math.max(shakeAmp, reduced ? 0 : 0.1);
    },
  };
}

let colorblind = false;
function COLORS_HEX(index) {
  return colorHex(index, colorblind);
}

function regionLook(id) {
  return REGIONS.find((item) => item.id === id) || REGIONS[0];
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

  renderer.setClearColor(0xc4b6a4, 1);
  const ground = new Mesh(new PlaneGeometry(14, 10), toon(0xc4b6a4));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);
  const yard = new Mesh(new PlaneGeometry(6.2, 3.4), toon(0x5c564e));
  yard.rotation.x = -Math.PI / 2;
  yard.receiveShadow = true;
  scene.add(yard);

  let combis = [];

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.left = -aspect * 1.7;
    camera.right = aspect * 1.7;
    camera.top = 1.7;
    camera.bottom = -1.7;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    const elev = 42 * Math.PI / 180;
    camera.position.set(0.2, Math.sin(elev) * 8.5, Math.cos(elev) * 8.5);
    camera.lookAt(0, 0.35, 0.1);
  }

  function setLook(livery) {
    if (group) scene.remove(group);
    group = new Group();
    const roof = toon(0xf7fbff);
    const trim = toon(0xff8a1f);
    const post = toon(0xd5dbe3);
    group.add(slab(3.6, 0.1, 0.9, roof, 0, 1.15, -1.35));
    group.add(slab(3.6, 0.06, 0.1, trim, 0, 1.12, -0.92));
    group.add(slab(0.1, 1.1, 0.1, post, -1.5, 0.55, -1.45));
    group.add(slab(0.1, 1.1, 0.1, post, 1.5, 0.55, -1.45));
    group.add(slab(0.9, 0.08, 0.32, toon(0xc9842a), -1.7, 0.22, 0.2));
    const paints = [0xe23d3d, 0x2f6fed, 0xf2c14e, 0x3e9b4f];
    const spots = [
      { x: -1.15, z: -0.15, yaw: 0.04 },
      { x: 0.05, z: 0.05, yaw: -0.02 },
      { x: 1.2, z: -0.1, yaw: 0.06 },
      { x: 0.15, z: 0.95, yaw: 0.18 },
    ];
    combis = spots.map((spot, index) => {
      const combi = makeCombi(paints[index]);
      if (index === 0) addLivery(combi, livery);
      collapse(combi.userData.body);
      combi.position.set(spot.x, 0, spot.z);
      combi.rotation.y = spot.yaw;
      combi.scale.setScalar(0.78);
      group.add(combi);
      return combi;
    });
    scene.add(group);
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, clock.getDelta());
    if (!reduced) {
      const t = clock.elapsedTime;
      combis.forEach((combi, index) => {
        combi.position.y = Math.sin(t * 1.3 + index) * 0.012;
        combi.rotation.z = Math.sin(t * 0.7 + index * 1.4) * 0.01;
      });
    }
    if (dt && group) group.position.y = 0;
    renderer.render(scene, camera);
  }

  let props = null;
  function setStage(stage) {
    if (props) scene.remove(props);
    props = new Group();
    if (stage >= 1) props.add(mesh(boxGeo(1.6, 0.08, 0.7), toon(0xf7fbff), 0, 0.9, -0.8));
    if (stage >= 2) props.add(mesh(boxGeo(0.4, 0.35, 0.3), toon(0xe07a3d), 1.1, 0.2, 0.2));
    if (stage >= 3) props.add(mesh(boxGeo(0.08, 0.7, 1.1), toon(0x2f6fed), -1.2, 0.4, 0));
    if (stage >= 4) props.add(mesh(boxGeo(0.22, 0.28, 0.16), toon(0x1c2430), 0.8, 0.2, -0.6));
    if (stage >= 5) props.add(mesh(sphGeo(0.08, 8, 6), new MeshBasicMaterial({ color: 0xffe08a }), -0.7, 0.85, -0.5));
    if (stage >= 6) props.add(mesh(boxGeo(2.2, 0.08, 1.6), toon(0xd7dde6), 0, 1.25, 0));
    scene.add(props);
  }

  return {
    ok: true,
    resize,
    setLook,
    setStage,
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
