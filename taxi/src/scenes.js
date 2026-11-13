import { COLORS, COPY, LIVERIES, theme } from './theme.js';
import {
  DIRS,
  applyAction,
  createState,
  dateKey,
  generateDaily,
  grantExtraBay,
  interpret,
  isLose,
  isWin,
  loseReason,
  noteBump,
  prepare,
  shareText,
  shuffleRemaining,
  starsFor,
} from './engine.js';
import * as audio from './audio.js';
import * as storage from './storage.js';
import { H, W, announce, floatText, font, ms, panel, reduced, stickerButton, tween } from './ui.js';

const Phaser = globalThis.Phaser;

function queueArt(loader, manifest) {
  const base = 'assets/art/';
  const image = (key, rel) => {
    if (rel) loader.image(key, base + rel);
  };
  Object.entries(manifest.taxis).forEach(([colour, rel]) => image(`taxi-${colour}`, rel));
  image('tarp-plain', manifest.hiddenPlain);
  image('lock', manifest.locked);
  image('arrow', manifest.arrow);
  Object.entries(manifest.liveries).forEach(([name, rel]) => image(`livery-${name}`, rel));
  Object.entries(manifest.passengers).forEach(([colour, variants]) => {
    Object.entries(variants).forEach(([variant, rel]) => image(`passenger-${variant}-${colour}`, rel));
  });
  image('passenger-gaartjie', manifest.gaartjie);
  image('background', manifest.background);
  image('tile', manifest.tile);
  image('bay', manifest.bay);
  image('logo', manifest.logo);
  Object.entries(manifest.icons).forEach(([id, rel]) => image(`icon-${id}`, rel));
}

function buzz(length) {
  if (reduced) return;
  try {
    navigator.vibrate?.(length);
  } catch {
    /* some browsers block vibration */
  }
}

function prettyDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

async function shareResult(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'abort';
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    return 'copied';
  }
}

function paintBackground(scene) {
  const bg = scene.add.image(W / 2, H / 2, 'background').setDisplaySize(W, H).setDepth(0);
  return bg;
}

function glyphButton(scene, x, y, label, onClick) {
  return stickerButton(scene, x, y, 46, 46, label, onClick, {
    size: 22,
    fill: 0xfff6e4,
    radius: 16,
    depth: 12,
  });
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    this.load.json('artmanifest', 'assets/art/manifest.json');
    this.load.json('levels', 'data/levels.json');
  }

  create() {
    this.scene.start('load');
  }
}

export class LoadScene extends Phaser.Scene {
  constructor() {
    super('load');
  }

  preload() {
    const manifest = this.cache.json.get('artmanifest');
    const bar = this.add.graphics();
    const label = this.add.text(W / 2, 300, 'Loading the rank…', font(22)).setOrigin(0.5);
    this.load.on('progress', (value) => {
      bar.clear();
      bar.fillStyle(0x3b2416, 1);
      bar.fillRoundedRect(46, 348, 298, 22, 11);
      bar.fillStyle(0xe6a23c, 1);
      bar.fillRoundedRect(50, 352, 290 * value, 14, 7);
    });
    this.load.on('loaderror', (file) => {
      console.error('Missing asset', file.key, file.src);
    });
    queueArt(this.load, manifest);
    this._label = label;
  }

  create() {
    const flags = globalThis.TRR_FLAGS || {};
    if (flags.level >= 1 && flags.level <= 60) {
      this.scene.start('game', { mode: 'level', id: flags.level | 0 });
    } else if (flags.daily) this.scene.start('daily');
    else this.scene.start('title');
  }
}

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  create() {
    audio.unlock();
    paintBackground(this);
    announce('title', theme.title);
    const save = storage.load();
    const g = this.add.graphics().setDepth(2);
    panel(g, 28, 108, 334, 132);
    this.add.text(W / 2, 150, theme.title, font(34)).setOrigin(0.5).setDepth(3);
    this.add.text(W / 2, 198, theme.subtitle, font(16, { family: 'Nunito, sans-serif', wrap: 300 })).setOrigin(0.5).setDepth(3);
    this.add.image(W / 2, 292, 'logo').setDisplaySize(210, 112).setDepth(3);
    const next = Math.min(60, Math.max(1, save.unlocked));
    stickerButton(this, W / 2, 390, 250, 60, save.unlocked > 1 ? `Play ${next}` : COPY.play, () => {
      audio.tap();
      this.scene.start('game', { mode: 'level', id: next });
    }, { fill: 0xe6a23c, size: 28, depth: 4 });
    stickerButton(this, W / 2, 462, 250, 52, COPY.levels, () => {
      audio.tap();
      this.scene.start('map');
    }, { depth: 4 });
    stickerButton(this, W / 2, 526, 250, 52, COPY.daily, () => {
      audio.tap();
      this.scene.start('daily');
    }, { depth: 4 });
    stickerButton(this, W / 2, 590, 250, 52, COPY.shop, () => {
      audio.tap();
      this.scene.start('shop');
    }, { depth: 4 });
    this.add.text(W / 2, 652, theme.footnote, font(12, { family: 'Nunito, sans-serif', wrap: 320 })).setOrigin(0.5).setDepth(3);
    glyphButton(this, 350, 36, audio.isMuted() ? '✕' : '♪', () => this.toggleMute());
    glyphButton(this, 298, 36, storage.load().arrows ? '➤' : '·', () => {
      storage.setArrows(!storage.load().arrows);
      audio.tap();
      this.scene.restart();
    });
    this.add.image(36, 36, 'icon-coin').setDisplaySize(28, 28).setDepth(4);
    this.add.text(56, 36, String(save.coins), font(18)).setOrigin(0, 0.5).setDepth(4);
    this.input.on('pointerdown', () => audio.unlock());
  }

  toggleMute() {
    const on = audio.isMuted();
    audio.setMuted(!on);
    storage.setSound(on);
    audio.tap();
    this.scene.restart();
  }
}

export class MapScene extends Phaser.Scene {
  constructor() {
    super('map');
  }

  create() {
    paintBackground(this);
    announce('map', 'Level map');
    const save = storage.load();
    this.page = Math.floor((Math.min(60, save.unlocked) - 1) / 12);
    glyphButton(this, 32, 36, '‹', () => this.scene.start('title'));
    const titleChip = this.add.graphics().setDepth(3);
    titleChip.fillStyle(0xfff6e4, 0.95);
    titleChip.fillRoundedRect(118, 14, 154, 44, 16);
    titleChip.lineStyle(3, 0x3b2416, 1);
    titleChip.strokeRoundedRect(118, 14, 154, 44, 16);
    this.add.text(W / 2, 36, COPY.levels, font(26)).setOrigin(0.5).setDepth(4);
    this.add.image(300, 36, 'icon-coin').setDisplaySize(24, 24).setDepth(4);
    this.add.text(318, 36, String(save.coins), font(16)).setOrigin(0, 0.5).setDepth(4);
    this.drawPage();
    stickerButton(this, 90, 650, 120, 48, 'Prev', () => {
      if (this.page > 0) {
        this.page -= 1;
        this.drawPage();
      }
    }, { depth: 4 });
    stickerButton(this, 300, 650, 120, 48, 'Next', () => {
      if (this.page < 4) {
        this.page += 1;
        this.drawPage();
      }
    }, { depth: 4 });
  }

  drawPage() {
    for (const node of this.nodes || []) node.destroy();
    this.nodes = [];
    const save = storage.load();
    const label = this.add.text(W / 2, 78, `${this.page * 12 + 1}–${this.page * 12 + 12}`, font(14, { family: 'Nunito, sans-serif' })).setOrigin(0.5).setDepth(4);
    this.nodes.push(label);
    for (let i = 0; i < 12; i += 1) {
      const id = this.page * 12 + i + 1;
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 78 + col * 116;
      const y = 150 + row * 118;
      const open = id <= save.unlocked;
      const stars = storage.starsFor(save, id);
      const level = this.cache.json.get('levels').levels[id - 1];
      const mark = (level.twists || []).map((twist) => ({ hidden: '?', lock: 'B', gaartjie: 'G', spare: 'S' }[twist] || '')).join(' ');
      const btn = stickerButton(this, x, y, 104, 104, String(id), () => {
        if (!open) {
          floatText(this, x, y - 20, 'Locked');
          return;
        }
        audio.tap();
        this.scene.start('game', { mode: 'level', id });
      }, {
        fill: !open ? 0xe4d3ae : id === save.unlocked ? 0xe6a23c : 0xfff6e4,
        size: 28,
        depth: 4,
      });
      const starText = this.add.text(x, y + 28, '★★★'.slice(0, stars) + '☆☆☆'.slice(stars), font(12)).setOrigin(0.5).setDepth(5);
      const twistText = this.add.text(x, y - 34, mark, font(11, { family: 'Nunito, sans-serif' })).setOrigin(0.5).setDepth(5);
      this.nodes.push(btn.root, starText, twistText);
    }
  }
}

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('shop');
  }

  create() {
    paintBackground(this);
    announce('shop', 'Liveries');
    const save = storage.load();
    glyphButton(this, 32, 36, '‹', () => this.scene.start('title'));
    const titleChip = this.add.graphics().setDepth(3);
    titleChip.fillStyle(0xfff6e4, 0.95);
    titleChip.fillRoundedRect(108, 14, 174, 44, 16);
    titleChip.lineStyle(3, 0x3b2416, 1);
    titleChip.strokeRoundedRect(108, 14, 174, 44, 16);
    this.add.text(W / 2, 36, COPY.shop, font(26)).setOrigin(0.5).setDepth(4);
    this.add.image(300, 36, 'icon-coin').setDisplaySize(24, 24).setDepth(4);
    this.add.text(318, 36, String(save.coins), font(16)).setOrigin(0, 0.5).setDepth(4);
    const cardH = 74;
    const step = 80;
    LIVERIES.forEach((item, index) => {
      const y = 70 + index * step;
      const g = this.add.graphics().setDepth(2);
      panel(g, 16, y, 358, cardH);
      const previewScale = 62 / 358;
      const preview = this.add.image(64, y + cardH / 2, 'taxi-red').setOrigin(0.5).setScale(previewScale).setDepth(3);
      if (item.id !== 'plain') {
        this.add.image(64, y + cardH / 2, `livery-${item.id}`).setOrigin(0.5).setScale(previewScale).setDepth(4);
      }
      this.add.text(118, y + 24, item.name, font(16)).setOrigin(0, 0.5).setDepth(4);
      this.add.text(118, y + 46, item.blurb, font(12, { family: 'Nunito, sans-serif' })).setOrigin(0, 0.5).setDepth(4);
      preview.setDepth(3);
      const owned = save.owned.includes(item.id);
      const equipped = save.livery === item.id;
      const label = equipped ? COPY.equipped : owned ? COPY.equip : `${item.price}`;
      stickerButton(this, 318, y + cardH / 2, 80, 36, label, () => {
        audio.tap();
        if (equipped) return;
        if (owned) storage.equipLivery(item.id);
        else {
          const result = storage.buyLivery(item.id, item.price);
          if (!result.ok) {
            floatText(this, 314, y, 'Need coins');
            return;
          }
          audio.coin();
        }
        this.scene.restart();
      }, { fill: equipped ? 0xf6e7c1 : 0xe6a23c, size: 14, depth: 5 });
    });
  }
}

export class DailyScene extends Phaser.Scene {
  constructor() {
    super('daily');
  }

  create() {
    paintBackground(this);
    const today = dateKey(new Date());
    let level = null;
    try {
      level = generateDaily(new Date());
      prepare(level);
      this.game.registry.set('dailyLevel', level);
    } catch (err) {
      console.error(err);
    }
    announce('daily', `Rush Hour ${prettyDate(today)}`);
    const save = storage.load();
    glyphButton(this, 32, 36, '‹', () => this.scene.start('title'));
    this.add.text(W / 2, 108, theme.dailyName, font(36)).setOrigin(0.5).setDepth(4);
    const g = this.add.graphics().setDepth(2);
    panel(g, 28, 168, 334, 180);
    this.add.text(W / 2, 200, prettyDate(today), font(18)).setOrigin(0.5).setDepth(3);
    this.add.text(W / 2, 248, COPY.dailyLead, font(16, { family: 'Nunito, sans-serif', wrap: 290 })).setOrigin(0.5).setDepth(3);
    const streak = save.dailyDate === today || save.dailyStreak ? `Streak ${save.dailyStreak || 0}` : 'Streak 0';
    this.add.text(W / 2, 312, streak, font(18)).setOrigin(0.5).setDepth(3);
    const done = save.dailyDate === today;
    if (done) {
      const stars = '★★★'.slice(0, save.dailyStars) + '☆☆☆'.slice(save.dailyStars || 0);
      this.add.text(W / 2, 390, `${COPY.dailyDone}`, font(15, { family: 'Nunito, sans-serif', wrap: 300 })).setOrigin(0.5).setDepth(3);
      this.add.text(W / 2, 450, stars, font(22)).setOrigin(0.5).setDepth(3);
    }
    stickerButton(this, W / 2, done ? 520 : 430, 250, 64, done ? 'Play again' : COPY.play, () => {
      if (!level) return;
      audio.tap();
      this.scene.start('game', { mode: 'daily' });
    }, { fill: 0xe6a23c, size: 26, depth: 4 });
    if (done && level) {
      stickerButton(this, W / 2, 600, 250, 52, COPY.share, async () => {
        const text = shareText(level, {
          daily: true,
          stars: save.dailyStars || 1,
          moves: level.par,
          time: 0,
        }, prettyDate(today));
        const result = await shareResult(text);
        if (result === 'copied') floatText(this, W / 2, 560, COPY.copied);
      }, { depth: 4 });
    }
  }
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init(data) {
    this.launch = data && data.mode ? data : { mode: 'level', id: 1 };
  }

  create() {
    audio.unlock();
    this.input.on('pointerdown', () => audio.unlock());
    const flags = globalThis.TRR_FLAGS || {};
    if (this.launch.mode === 'daily') {
      this.level = this.game.registry.get('dailyLevel') || generateDaily(new Date());
      prepare(this.level);
      this.level.intro = this.level.intro || 'Rush Hour. One shared rank for today.';
    } else {
      const id = Math.min(60, Math.max(1, this.launch.id | 0));
      const raw = this.cache.json.get('levels').levels.find((level) => level.id === id);
      this.level = JSON.parse(JSON.stringify(raw));
      prepare(this.level);
      this.launch = { mode: 'level', id };
    }
    this.state = createState(this.level);
    this.hidden = this.level.taxis.map((taxi) => !!taxi.hidden);
    const saved = storage.load();
    this.livery = LIVERIES.some((item) => item.id === saved.livery) ? saved.livery : 'plain';
    this.showArrows = !!saved.arrows || (this.launch.mode !== 'daily' && this.level.id >= 1 && this.level.id <= 3);
    if (!this.textures.exists('dust')) {
      const puff = this.make.graphics({ add: false });
      puff.fillStyle(0xfff6e4, 0.95);
      puff.fillCircle(8, 8, 7);
      puff.generateTexture('dust', 16, 16);
      puff.destroy();
    }
    this.elapsed = 0;
    this.timing = false;
    this.shown = -1;
    this.busy = false;
    this.over = false;
    this.adOpen = false;
    this.paid = false;
    this.undoStack = [];
    this.owned = [];
    this.queueIcons = [];
    this.views = [];
    this.botAt = 0;
    this.botting = !!(flags.bot && this.level.guide);
    paintBackground(this);
    announce('game', this.level.name || `Level ${this.level.id}`);
    this.drawHud();
    this.buildWorld();
    if (flags.lose) this.time.delayedCall(350, () => this.showLose('full'));
    if (this.botting) this.time.delayedCall(450, () => this.botNext());
  }

  update(_time, delta) {
    if (!this.timing || this.over) return;
    this.elapsed += delta;
    const sec = Math.floor(this.elapsed / 1000);
    if (sec !== this.shown) {
      this.shown = sec;
      this.timeText.setText(`${sec}s`);
    }
  }

  drawHud() {
    glyphButton(this, 32, 32, '‹', () => {
      if (this.busy) return;
      this.scene.start(this.launch.mode === 'daily' ? 'daily' : 'map');
    });
    const titleBar = this.add.graphics().setDepth(10);
    titleBar.fillStyle(0xfff6e4, 0.94);
    titleBar.fillRoundedRect(78, 14, 214, 36, 16);
    titleBar.lineStyle(3, 0x3b2416, 1);
    titleBar.strokeRoundedRect(78, 14, 214, 36, 16);
    this.add.text(W / 2, 32, this.level.name || `Level ${this.level.id}`, font(16)).setOrigin(0.5).setDepth(11);
    const statBar = this.add.graphics().setDepth(10);
    statBar.fillStyle(0xfff6e4, 0.94);
    statBar.fillRoundedRect(12, 58, 366, 30, 14);
    statBar.lineStyle(3, 0x3b2416, 1);
    statBar.strokeRoundedRect(12, 58, 366, 30, 14);
    glyphButton(this, 308, 32, '↻', () => {
      if (this.busy) return;
      this.scene.restart(this.launch);
    });
    glyphButton(this, 356, 32, audio.isMuted() ? '✕' : '♪', () => {
      const on = audio.isMuted();
      audio.setMuted(!on);
      storage.setSound(on);
      this.scene.restart(this.launch);
    });
    this.moveText = this.add.text(24, 73, 'Moves 0', font(14)).setOrigin(0, 0.5).setDepth(11);
    this.timeText = this.add.text(130, 73, '0s', font(14)).setOrigin(0, 0.5).setDepth(11);
    this.parText = this.add.text(178, 73, `Par ${this.level.par}`, font(14, { family: 'Nunito, sans-serif' })).setOrigin(0, 0.5).setDepth(11);
    this.add.image(300, 73, 'icon-coin').setDisplaySize(20, 20).setDepth(11);
    this.coinText = this.add.text(314, 73, String(storage.load().coins), font(14)).setOrigin(0, 0.5).setDepth(11);
    if (this.level.intro) {
      const g = this.add.graphics().setDepth(11);
      panel(g, 16, 98, 358, 58);
      this.add.text(W / 2, 127, this.level.intro, font(14, { family: 'Nunito, sans-serif', wrap: 330 })).setOrigin(0.5).setDepth(12);
    }
  }

  metrics() {
    const bays = this.state.bayTaxi.length;
    const intro = this.level.intro ? 68 : 0;
    const queueTop = 96 + intro;
    const queueY = queueTop + 30;
    const bayY = queueTop + 68;
    const bayH = 78;
    const boardTop = bayY + bayH + 4;
    const boardBottom = H - 86;
    const boardW = W - 28;
    const cell = Math.floor(Math.min(boardW / this.level.cols, (boardBottom - boardTop) / (this.level.rows + 0.62)));
    const gridW = cell * this.level.cols;
    const gridH = cell * this.level.rows;
    const roof = Math.round(cell * 0.62);
    const gap = 6;
    const bayW = Math.floor((W - 20 - gap * (bays - 1)) / bays);
    const total = bays * bayW + (bays - 1) * gap;
    const x0 = (W - total) / 2 + bayW / 2;
    const bayXs = [];
    for (let i = 0; i < bays; i += 1) bayXs.push(x0 + i * (bayW + gap));
    return {
      bayY,
      bayW,
      bayH,
      bayXs,
      queueY,
      boardX: (W - gridW) / 2,
      boardY: boardTop + roof + Math.max(0, (boardBottom - boardTop - roof - gridH) / 2),
      cell,
      spriteScale: (cell * 0.9) / 220,
    };
  }

  track(obj) {
    this.owned.push(obj);
    return obj;
  }

  clearWorld() {
    for (const obj of this.owned) obj.destroy();
    this.owned = [];
    for (const item of this.queueIcons) {
      this.tweens.killTweensOf(item.img);
      item.img.destroy();
    }
    this.queueIcons = [];
    this.views = [];
  }

  buildWorld() {
    this.clearWorld();
    this.m = this.metrics();
    const { level } = this;
    for (let r = 0; r < level.rows; r += 1) {
      for (let c = 0; c < level.cols; c += 1) {
        const tile = this.add.image(
          this.m.boardX + (c + 0.5) * this.m.cell,
          this.m.boardY + (r + 0.5) * this.m.cell,
          'tile',
        ).setDisplaySize(this.m.cell - 2, this.m.cell - 2).setDepth(1);
        this.track(tile);
      }
    }
    this.dotGroups = [];
    for (let i = 0; i < this.state.bayTaxi.length; i += 1) {
      const bay = this.add.image(this.m.bayXs[i], this.m.bayY + this.m.bayH / 2, 'bay')
        .setDisplaySize(this.m.bayW * 0.92, this.m.bayH)
        .setDepth(4);
      this.track(bay);
      this.dotGroups.push([]);
    }
    const qg = this.add.graphics().setDepth(2);
    panel(qg, 14, this.m.queueY - 30, W - 28, 60);
    this.track(qg);
    this.queueLabel = this.track(this.add.text(W - 28, this.m.queueY, '', font(13)).setOrigin(1, 0.5).setDepth(6));
    const backToFront = level.taxis.slice().sort((a, b) => a.r - b.r || a.c - b.c);
    for (const taxi of backToFront) this.makeTaxi(taxi);
    this.stackTaxis();
    this.placeBays();
    this.layoutQueue();
    this.drawBoosters();
    this.refreshHud();
  }

  makeTaxi(taxi) {
    const hidden = this.hidden[taxi.id];
    const color = COLORS[taxi.color].id;
    const root = this.add.container(0, 0);
    const body = this.add.image(0, 0, hidden ? 'tarp-plain' : `taxi-${color}`).setOrigin(0.5);
    root.add(body);
    let livery = null;
    if (this.livery && this.livery !== 'plain') {
      livery = this.add.image(0, 0, `livery-${this.livery}`).setOrigin(0.5);
      livery.setVisible(!hidden);
      root.add(livery);
    }
    if (this.showArrows) {
      root.add(this.add.image(0, 0, 'arrow').setOrigin(0.5));
    }
    let lock = null;
    if (this.state.locks[taxi.id] > 0) {
      lock = this.add.image(0, 0, 'lock').setOrigin(0.5);
      root.add(lock);
    }
    let question = null;
    if (hidden) {
      question = this.add.image(0, 0, 'icon-question').setOrigin(0.5).setDisplaySize(78, 78);
      question.setAngle(-taxi.dir * 90);
      root.add(question);
    }
    root.setAngle(taxi.dir * 90);
    root.setDepth(80 + taxi.r * 20 + taxi.c);
    const center = this.cellCenter(taxi.c, taxi.r);
    const hit = this.add.zone(center.x, center.y, this.m.cell - 4, this.m.cell - 4)
      .setInteractive({ useHandCursor: true })
      .setDepth(90);
    hit.on('pointerdown', () => this.onTaxi(taxi.id));
    this.track(root);
    this.track(hit);
    this.views[taxi.id] = { root, body, livery, lock, question, hit };
  }

  cellCenter(c, r) {
    return {
      x: this.m.boardX + (c + 0.5) * this.m.cell,
      y: this.m.boardY + (r + 0.5) * this.m.cell,
    };
  }

  placeBays() {
    for (const taxi of this.level.taxis) {
      const view = this.views[taxi.id];
      if (!view) continue;
      if (this.state.exited[taxi.id]) {
        const bay = this.bayIndexOf(taxi.id);
        if (bay < 0) {
          view.root.setVisible(false);
          view.hit.disableInteractive();
          continue;
        }
        const pos = this.bayAnchor(bay);
        view.root.setPosition(pos.x, pos.y - 8);
        view.root.setAngle(taxi.dir * 90);
        view.root.setScale(this.bayFit(taxi.dir));
        view.root.setDepth(8);
        if (view.question) view.question.setAngle(-taxi.dir * 90);
        view.hit.disableInteractive();
        this.paintDots(bay);
      } else {
        const center = this.cellCenter(taxi.c, taxi.r);
        view.root.setPosition(center.x, center.y);
        view.root.setAngle(taxi.dir * 90);
        view.root.setScale(this.m.spriteScale);
        view.root.setDepth(80 + taxi.r * 20 + taxi.c);
        if (view.question) view.question.setAngle(-taxi.dir * 90);
        view.root.setVisible(true);
        view.hit.setPosition(center.x, center.y);
        view.hit.setInteractive({ useHandCursor: true });
      }
    }
    this.stackTaxis();
  }

  stackTaxis() {
    const order = this.level.taxis.slice().sort((a, b) => a.r - b.r || a.c - b.c);
    for (const taxi of order) {
      const view = this.views[taxi.id];
      if (view && view.root.visible) this.children.bringToTop(view.root);
    }
  }

  cellFoot(c, r) {
    return {
      x: this.m.boardX + (c + 0.5) * this.m.cell,
      y: this.m.boardY + (r + 1) * this.m.cell - 1,
    };
  }

  bayFit(dir) {
    const longWays = dir % 2 === 0;
    const visW = longWays ? 220 : 358;
    const visH = longWays ? 358 : 220;
    return Math.min((this.m.bayW * 0.78) / visW, (this.m.bayH * 0.82) / visH);
  }

  bayIndexOf(id) {
    for (let i = 0; i < this.state.bayTaxi.length; i += 1) {
      if (this.state.bayTaxi[i] === id) return i;
    }
    return -1;
  }

  bayAnchor(index) {
    return { x: this.m.bayXs[index], y: this.m.bayY + this.m.bayH - 10 };
  }

  paintDots(bay) {
    for (const dot of this.dotGroups[bay] || []) dot.destroy();
    this.dotGroups[bay] = [];
    const id = this.state.bayTaxi[bay];
    if (id < 0) return;
    const taxi = this.level.taxis[id];
    const filled = this.state.bayFilled[bay];
    const gap = Math.min(12, (this.m.bayW - 16) / taxi.seats);
    const start = this.m.bayXs[bay] - ((taxi.seats - 1) * gap) / 2;
    const y = this.m.bayY + this.m.bayH - 8;
    for (let i = 0; i < taxi.seats; i += 1) {
      const dot = this.add.circle(start + i * gap, y, 4.5, i < filled ? hexOf(taxi.color) : 0xfff6e4)
        .setStrokeStyle(2, 0x3b2416)
        .setDepth(6);
      this.track(dot);
      this.dotGroups[bay].push(dot);
    }
  }

  layoutQueue() {
    for (const item of this.queueIcons) {
      this.tweens.killTweensOf(item.img);
      item.img.destroy();
    }
    this.queueIcons = [];
    const open = [];
    for (let i = 0; i < this.state.queue.length; i += 1) {
      if (!this.state.boarded[i]) open.push(i);
    }
    if (this.queueLabel) this.queueLabel.setText('');
    const shown = open.slice(0, 6);
    shown.forEach((idx, n) => {
      const key = this.passengerKey(idx);
      const x = 42 + n * 48;
      if (n === 0) {
        const ring = this.add.circle(x, this.m.queueY + 2, 22, 0xe6a23c).setDepth(4);
        ring.setStrokeStyle(3, 0x3b2416);
        this.queueIcons.push({ idx: -1, img: ring });
      }
      const img = this.add.image(x, this.m.queueY + 6, key).setOrigin(0.5, 0.9).setScale((key === 'passenger-gaartjie' ? 58 : 48) / (key === 'passenger-gaartjie' ? 112 : 96)).setDepth(6);
      if (!reduced) {
        this.tweens.add({
          targets: img,
          y: img.y - 3,
          duration: 640 + (idx % 4) * 80,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: (n % 6) * 90,
        });
      }
      this.queueIcons.push({ idx, img });
    });
    if (open.length > shown.length) {
      const more = this.add.text(42 + shown.length * 48, this.m.queueY, `+${open.length - shown.length}`, font(14)).setOrigin(0, 0.5).setDepth(6);
      this.queueIcons.push({ idx: -2, img: more });
    }
  }

  drawBoosters() {
    if (this.boosterLayer) this.boosterLayer.forEach((node) => node.destroy());
    this.boosterLayer = [];
    const y = H - 40;
    this.bayBtn = stickerButton(this, 68, y, 112, 58, COPY.extraBay, () => this.askAd('bay'), {
      icon: 'icon-bay',
      size: 13,
      depth: 10,
      enabled: !this.state.extraUsed,
    });
    this.undoBtn = stickerButton(this, 195, y, 112, 58, COPY.undo, () => this.askAd('undo'), {
      icon: 'icon-undo',
      size: 13,
      depth: 10,
      enabled: this.undoStack.length > 0,
    });
    this.shuffleBtn = stickerButton(this, 322, y, 112, 58, COPY.shuffle, () => this.askAd('shuffle'), {
      icon: 'icon-shuffle',
      size: 13,
      depth: 10,
    });
    this.boosterLayer.push(this.bayBtn.root, this.undoBtn.root, this.shuffleBtn.root);
  }

  refreshHud() {
    this.moveText.setText(`Moves ${this.state.moves}`);
    this.coinText.setText(String(storage.load().coins));
    if (this.undoBtn) this.undoBtn.setEnabled(this.undoStack.length > 0 && !this.over);
    if (this.bayBtn) this.bayBtn.setEnabled(!this.state.extraUsed && !this.over);
  }

  pushUndo() {
    this.undoStack.push({
      locks: Array.from(this.state.locks),
      exited: Array.from(this.state.exited),
      bayTaxi: Array.from(this.state.bayTaxi),
      bayFilled: Array.from(this.state.bayFilled),
      boarded: Array.from(this.state.boarded),
      queue: this.state.queue.slice(),
      gaartjie: this.state.gaartjie,
      moves: this.state.moves,
      extraUsed: this.state.extraUsed,
      hidden: this.hidden.slice(),
      elapsed: this.elapsed,
    });
    if (this.undoStack.length > 40) this.undoStack.shift();
  }

  restore(snap) {
    this.state = {
      locks: Uint8Array.from(snap.locks),
      exited: Uint8Array.from(snap.exited),
      bayTaxi: Int16Array.from(snap.bayTaxi),
      bayFilled: Uint8Array.from(snap.bayFilled),
      boarded: Uint8Array.from(snap.boarded),
      queue: snap.queue.slice(),
      gaartjie: snap.gaartjie,
      moves: snap.moves,
      extraUsed: snap.extraUsed,
    };
    this.hidden = snap.hidden.slice();
    this.elapsed = snap.elapsed;
    this.shown = -1;
  }

  onTaxi(id) {
    if (this.busy || this.over || this.adOpen) return;
    const tap = interpret(this.state, this.level, id);
    if (tap.t === 'none') return;
    if (!this.timing) this.timing = true;
    if (tap.t === 'bump') {
      this.pushUndo();
      this.state = noteBump(this.state);
      this.reveal(id);
      this.finishBusy(this.animBump(id));
      return;
    }
    if (tap.t === 'nobay') {
      this.finishBusy(this.animFull().then(() => {
        if (isLose(this.state, this.level)) this.showLose('full');
      }));
      return;
    }
    this.pushUndo();
    const res = applyAction(this.state, this.level, { t: tap.t, id });
    if (!res) {
      this.undoStack.pop();
      return;
    }
    this.state = res.state;
    if (tap.t === 'exit') this.revealAround(id);
    if (tap.t === 'unlock') this.reveal(id);
    this.finishBusy(this.playEvents(res.events).then(() => this.afterAction()));
  }

  finishBusy(promise) {
    this.busy = true;
    this.refreshHud();
    promise.then(() => {
      this.busy = false;
      this.refreshHud();
      if (this.botting && !this.over && !this.adOpen) {
        this.time.delayedCall(ms(200), () => this.botNext());
      }
    }).catch((err) => {
      console.error(err);
      this.busy = false;
    });
  }

  afterAction() {
    if (isWin(this.state)) this.showWin();
    else if (isLose(this.state, this.level)) this.showLose(loseReason(this.state));
  }

  botNext() {
    if (this.over || this.busy) return;
    const action = this.level.guide[this.botAt];
    this.botAt += 1;
    if (!action) return;
    this.onTaxi(action.id);
  }

  passengerKey(idx) {
    if (idx === this.state.gaartjie) return 'passenger-gaartjie';
    const color = COLORS[this.state.queue[idx]].id;
    const variant = ['a', 'b', 'c'][idx % 3];
    return `passenger-${variant}-${color}`;
  }

  reveal(id) {
    if (!this.hidden[id]) return;
    this.hidden[id] = false;
    const view = this.views[id];
    if (!view) return;
    const color = COLORS[this.level.taxis[id].color].id;
    view.body.setTexture(`taxi-${color}`);
    if (view.livery) view.livery.setVisible(true);
    if (view.question) view.question.setVisible(false);
  }

  revealAround(id) {
    const taxi = this.level.taxis[id];
    for (const other of this.level.taxis) {
      if (Math.abs(other.c - taxi.c) + Math.abs(other.r - taxi.r) === 1) this.reveal(other.id);
    }
    this.reveal(id);
  }

  async animBump(id) {
    const view = this.views[id];
    const fromX = view.root.x;
    const fromY = view.root.y;
    const dir = DIRS[this.level.taxis[id].dir];
    audio.hoot();
    buzz(14);
    try {
      if (!reduced) this.cameras.main.shake(90, 0.0035);
    } catch {
      /* shake is optional juice */
    }
    floatText(this, fromX, fromY - this.m.cell * 0.4, COPY.hoot);
    const dist = this.m.cell * 0.2;
    await tween(this, view.root, { x: fromX + dir.x * dist, y: fromY + dir.y * dist, duration: 80 });
    await tween(this, view.root, { x: fromX, y: fromY, duration: 120 });
  }

  async animFull() {
    audio.hoot();
    floatText(this, W / 2, this.m.bayY, 'Bays full');
    await tween(this, { t: 0 }, { t: 1, duration: 180 });
  }

  async playEvents(events) {
    for (const event of events) {
      if (event.t === 'unlock') await this.animUnlock(event.id);
      else if (event.t === 'exit') await this.animExit(event);
      else if (event.t === 'board') await this.animBoard(event);
      else if (event.t === 'depart') await this.animDepart(event);
    }
  }

  async animUnlock(id) {
    const view = this.views[id];
    audio.brake();
    floatText(this, view.root.x, view.root.y - 30, COPY.brake);
    if (view.lock) {
      await tween(this, view.lock, { alpha: 0, duration: 140 });
      view.lock.setVisible(false);
    }
    const scale = view.root.scaleX;
    await tween(this, view.root, { scaleX: scale * 1.08, scaleY: scale * 0.9, duration: 80, yoyo: true });
  }

  pathPoints(taxi) {
    const points = [this.cellFoot(taxi.c, taxi.r)];
    const dir = DIRS[taxi.dir];
    let c = taxi.c + dir.x;
    let r = taxi.r + dir.y;
    while (c >= 0 && r >= 0 && c < this.level.cols && r < this.level.rows) {
      points.push(this.cellFoot(c, r));
      c += dir.x;
      r += dir.y;
    }
    const last = points[points.length - 1];
    points.push({ x: last.x + dir.x * this.m.cell, y: last.y + dir.y * this.m.cell });
    return points;
  }

  async animExit(event) {
    const view = this.views[event.id];
    view.hit.disableInteractive();
    view.root.setDepth(800);
    this.children.bringToTop(view.root);
    audio.vroom();
    await tween(this, view.body, { scaleX: 1.08, scaleY: 0.9, duration: 70, yoyo: true });
    const points = this.pathPoints(this.level.taxis[event.id]);
    await this.moveAlong(view.root, points, 180 + points.length * 55);
    const anchor = this.bayAnchor(event.bay);
    const fit = this.bayFit(this.level.taxis[event.id].dir);
    await tween(this, view.root, {
      x: anchor.x,
      y: anchor.y,
      scaleX: fit,
      scaleY: fit,
      duration: 170,
      ease: 'Quad.easeOut',
    });
    this.paintDots(event.bay);
  }

  moveAlong(root, points, duration) {
    const proxy = { t: 0 };
    let last = 0;
    return new Promise((resolve) => {
      this.tweens.add({
        targets: proxy,
        t: 1,
        duration: ms(duration),
        ease: 'Cubic.easeIn',
        onUpdate: () => {
          const pos = pointAlong(points, proxy.t);
          root.setPosition(pos.x, pos.y);
          const now = this.time.now;
          if (now - last > 46) {
            last = now;
            this.puff(pos.x, pos.y);
          }
        },
        onComplete: () => resolve(),
      });
    });
  }

  puff(x, y) {
    const dust = this.add.image(x, y + 8, 'dust').setDepth(7).setScale(0.35).setAlpha(0.8);
    this.tweens.add({
      targets: dust,
      y: y + 18,
      alpha: 0,
      scale: 0.8,
      duration: ms(260),
      onComplete: () => dust.destroy(),
    });
  }

  async animBoard(event) {
    audio.pop();
    const slot = this.queueIcons.find((item) => item.idx === event.pIndex);
    const from = slot ? { x: slot.img.x, y: slot.img.y } : { x: W - 40, y: this.m.queueY };
    const key = slot && slot.img.texture ? slot.img.texture.key : `passenger-${COLORS[this.state.queue[event.pIndex]].id}`;
    const flyer = this.add.image(from.x, from.y, key).setOrigin(0.5, 0.85).setScale(52 / 256).setDepth(12);
    if (slot) slot.img.setVisible(false);
    const anchor = this.bayAnchor(event.bay);
    await tween(this, flyer, { y: from.y - 26, duration: 70 });
    await tween(this, flyer, { x: anchor.x, y: anchor.y + 8, duration: 120, ease: 'Quad.easeIn' });
    flyer.destroy();
    this.paintDots(event.bay);
    this.layoutQueue();
  }

  async animDepart(event) {
    const view = this.views[event.taxiId];
    audio.pop();
    if (view) {
      await tween(this, view.root, { y: view.root.y - 80, alpha: 0, duration: 180 });
      view.root.setVisible(false);
    }
    for (const dot of this.dotGroups[event.bay] || []) dot.destroy();
    this.dotGroups[event.bay] = [];
  }

  askAd(kind) {
    if (this.busy || this.adOpen) return;
    if (kind === 'undo' && !this.undoStack.length) {
      floatText(this, W / 2, H - 90, 'Nothing to undo');
      return;
    }
    if (kind === 'bay' && this.state.extraUsed) return;
    if (kind === 'shuffle') {
      let waiting = 0;
      for (let i = 0; i < this.state.boarded.length; i += 1) if (!this.state.boarded[i]) waiting += 1;
      if (waiting < 2) {
        floatText(this, W / 2, H - 90, 'Queue is short');
        return;
      }
    }
    this.adOpen = true;
    announce('ad', COPY.adTitle);
    const nodes = [];
    const keep = (obj) => {
      nodes.push(obj);
      return obj;
    };
    keep(this.add.rectangle(W / 2, H / 2, W, H, 0x3b2416, 0.5).setDepth(30).setInteractive());
    const g = keep(this.add.graphics().setDepth(31));
    panel(g, 32, 200, 326, 280);
    keep(this.add.text(W / 2, 240, COPY.adTitle, font(26)).setOrigin(0.5).setDepth(32));
    const name = kind === 'bay' ? COPY.extraBay : kind === 'undo' ? COPY.undo : COPY.shuffle;
    keep(this.add.text(W / 2, 286, name, font(20)).setOrigin(0.5).setDepth(32));
    keep(this.add.text(W / 2, 330, COPY.adBody, font(15, { family: 'Nunito, sans-serif', wrap: 280 })).setOrigin(0.5).setDepth(32));
    const bar = keep(this.add.graphics().setDepth(32));
    const close = () => {
      this.adOpen = false;
      nodes.forEach((node) => node.destroy());
      if (!this.over) announce('game', this.level.name || 'Level');
    };
    const watch = stickerButton(this, W / 2, 400, 200, 52, COPY.watch, () => {
      audio.tap();
      const proxy = { p: 0 };
      this.tweens.add({
        targets: proxy,
        p: 1,
        duration: ms(1100),
        onUpdate: () => {
          bar.clear();
          bar.fillStyle(0x3b2416, 1);
          bar.fillRoundedRect(70, 360, 250, 16, 8);
          bar.fillStyle(0xe6a23c, 1);
          bar.fillRoundedRect(73, 363, 244 * proxy.p, 10, 5);
        },
        onComplete: () => {
          close();
          if (kind === 'bay') this.doExtraBay();
          else if (kind === 'undo') this.doUndo();
          else this.doShuffle();
        },
      });
    }, { fill: 0xe6a23c, depth: 33 });
    nodes.push(watch.root);
    const cancel = stickerButton(this, W / 2, 454, 160, 44, COPY.notNow, () => {
      audio.tap();
      close();
    }, { depth: 33 });
    nodes.push(cancel.root);
  }

  doUndo() {
    const snap = this.undoStack.pop();
    if (!snap) return;
    this.restore(snap);
    this.over = false;
    this.clearOverlay();
    this.buildWorld();
  }

  doExtraBay() {
    this.pushUndo();
    const res = grantExtraBay(this.state, this.level);
    if (!res) {
      this.undoStack.pop();
      return;
    }
    this.state = res.state;
    this.over = false;
    this.clearOverlay();
    this.buildWorld();
    if (isLose(this.state, this.level)) this.showLose(loseReason(this.state));
  }

  doShuffle() {
    this.pushUndo();
    let seed = (Date.now() ^ (this.state.moves * 997)) >>> 0;
    const rng = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const res = shuffleRemaining(this.state, this.level, rng);
    this.state = res.state;
    this.layoutQueue();
    this.finishBusy(this.playEvents(res.events.filter((event) => event.t === 'board' || event.t === 'depart')).then(() => this.afterAction()));
  }

  clearOverlay() {
    for (const node of this.overlay || []) node.destroy();
    this.overlay = [];
  }

  keepOverlay(obj) {
    this.overlay = this.overlay || [];
    this.overlay.push(obj);
    return obj;
  }

  showWin() {
    if (this.paid) return;
    this.paid = true;
    this.over = true;
    this.timing = false;
    const time = Math.max(0, Math.floor(this.elapsed / 1000));
    const stars = starsFor(this.state.moves, time, this.level);
    const daily = this.launch.mode === 'daily';
    const award = daily
      ? storage.awardDaily(this.level.daily || dateKey(new Date()), stars)
      : storage.awardLevel(this.level.id, stars);
    audio.win();
    audio.coin();
    buzz(20);
    announce('win', `Win ${stars} stars ${this.state.moves} moves`);
    this.clearOverlay();
    this.keepOverlay(this.add.rectangle(W / 2, H / 2, W, H, 0x3b2416, 0.45).setDepth(30).setInteractive());
    this.confetti();
    const g = this.keepOverlay(this.add.graphics().setDepth(31));
    panel(g, 24, daily ? 70 : 110, 342, daily ? 540 : 460);
    this.keepOverlay(this.add.text(W / 2, daily ? 110 : 156, daily ? COPY.winDaily : COPY.win, font(30)).setOrigin(0.5).setDepth(32));
    for (let i = 0; i < 3; i += 1) {
      const star = this.keepOverlay(this.add.image(W / 2 + (i - 1) * 64, daily ? 170 : 220, 'icon-star').setDepth(40));
      star.setDisplaySize(48, 48);
      const starScale = star.scaleX;
      star.setScale(0);
      if (i >= stars) star.setAlpha(0.28);
      this.tweens.add({
        targets: star,
        scale: starScale,
        duration: ms(280),
        delay: ms(120 * i),
        ease: 'Back.easeOut',
      });
    }
    this.keepOverlay(this.add.text(W / 2, daily ? 230 : 286, `${this.state.moves} moves · ${time}s · par ${this.level.par}`, font(16, { family: 'Nunito, sans-serif' })).setOrigin(0.5).setDepth(32));
    this.keepOverlay(this.add.text(W / 2, daily ? 262 : 322, `+${award.gain} coins`, font(20)).setOrigin(0.5).setDepth(32));
    this.coinText.setText(String(award.save.coins));
    for (let i = 0; i < 6; i += 1) {
      const coin = this.add.image(300, 73, 'icon-coin').setDisplaySize(18, 18).setDepth(40);
      this.tweens.add({
        targets: coin,
        x: 250 + (i % 3) * 22,
        y: 20 + (i % 2) * 10,
        alpha: 0,
        duration: ms(520),
        delay: ms(40 * i),
        onComplete: () => coin.destroy(),
      });
    }
    if (daily) {
      const text = shareText(this.level, { daily: true, stars, moves: this.state.moves, time }, prettyDate(this.level.daily || dateKey(new Date())));
      this.keepOverlay(this.add.text(W / 2, 360, text, font(13, { family: 'Nunito, sans-serif', wrap: 300 })).setOrigin(0.5, 0).setDepth(32));
      const shareBtn = stickerButton(this, W / 2, 500, 230, 48, COPY.share, async () => {
        const result = await shareResult(text);
        if (result === 'copied') floatText(this, W / 2, 470, COPY.copied);
      }, { fill: 0xe6a23c, depth: 33 });
      this.keepOverlay(shareBtn.root);
    }
    const y0 = daily ? 560 : 390;
    if (!daily && this.level.id < 60) {
      const next = stickerButton(this, W / 2, y0, 230, 52, COPY.next, () => {
        audio.tap();
        this.scene.start('game', { mode: 'level', id: this.level.id + 1 });
      }, { fill: 0xe6a23c, depth: 33 });
      this.keepOverlay(next.root);
    }
    const retry = stickerButton(this, W / 2, y0 + (daily || this.level.id >= 60 ? 0 : 62), 230, 48, COPY.retry, () => {
      audio.tap();
      this.scene.restart(this.launch);
    }, { depth: 33 });
    this.keepOverlay(retry.root);
    const map = stickerButton(this, W / 2, y0 + (daily || this.level.id >= 60 ? 58 : 118), 230, 48, daily ? 'Lobby' : COPY.map, () => {
      audio.tap();
      this.scene.start(daily ? 'daily' : 'map');
    }, { depth: 33 });
    this.keepOverlay(map.root);
  }

  showLose(reason) {
    if (this.over) return;
    this.over = true;
    this.timing = false;
    announce('lose', reason === 'full' ? COPY.loseFull : COPY.loseJam);
    this.clearOverlay();
    this.keepOverlay(this.add.rectangle(W / 2, H / 2, W, H, 0x3b2416, 0.45).setDepth(30).setInteractive());
    const g = this.keepOverlay(this.add.graphics().setDepth(31));
    panel(g, 28, 180, 334, 340);
    this.keepOverlay(this.add.text(W / 2, 230, reason === 'full' ? COPY.loseFull : COPY.loseJam, font(26)).setOrigin(0.5).setDepth(32));
    this.keepOverlay(this.add.text(W / 2, 286, COPY.loseHint, font(16, { family: 'Nunito, sans-serif', wrap: 280 })).setOrigin(0.5).setDepth(32));
    const retry = stickerButton(this, W / 2, 350, 230, 56, COPY.retry, () => {
      audio.tap();
      this.scene.restart(this.launch);
    }, { fill: 0xe6a23c, depth: 33 });
    this.keepOverlay(retry.root);
    if (reason === 'full' && !this.state.extraUsed) {
      const extra = stickerButton(this, W / 2, 418, 230, 48, COPY.extraBay, () => {
        this.over = false;
        this.clearOverlay();
        this.askAd('bay');
      }, { depth: 33 });
      this.keepOverlay(extra.root);
    }
    const map = stickerButton(this, W / 2, 480, 180, 44, COPY.map, () => {
      this.scene.start(this.launch.mode === 'daily' ? 'daily' : 'map');
    }, { depth: 33 });
    this.keepOverlay(map.root);
    this.refreshHud();
  }

  confetti() {
    const colors = [0xe23d3d, 0x2f6fed, 0xf2c14e, 0x3e9b4f, 0xf07a2a, 0xfff6e4, 0x7a4e9a];
    const count = reduced ? 10 : 28;
    for (let i = 0; i < count; i += 1) {
      const left = i % 2 === 0;
      const piece = this.add.rectangle(left ? 28 : W - 28, 200 + (i % 6) * 30, 8 + (i % 3) * 3, 12, colors[i % colors.length]).setDepth(34).setAngle(i * 20);
      this.tweens.add({
        targets: piece,
        x: left ? 16 + (i * 11) % 70 : W - 16 - (i * 11) % 70,
        y: 90 + (i * 37) % 480,
        angle: piece.angle + 160,
        alpha: 0,
        duration: ms(700 + (i % 5) * 60),
        ease: 'Quad.easeOut',
        onComplete: () => piece.destroy(),
      });
    }
  }
}

function hexOf(index) {
  const hex = COLORS[index].hex;
  return Number.parseInt(hex.slice(1), 16);
}

function pointAlong(points, t) {
  if (points.length === 1) return points[0];
  const span = points.length - 1;
  const scaled = Math.min(0.9999, Math.max(0, t)) * span;
  const index = Math.floor(scaled);
  const u = scaled - index;
  const a = points[index];
  const b = points[Math.min(points.length - 1, index + 1)];
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
}
