import { setMuted } from './audio.js';
import { reset, load } from './storage.js';
import {
  BootScene,
  LoadScene,
  TitleScene,
  MapScene,
  GameScene,
  ShopScene,
  DailyScene,
} from './scenes.js';

const params = new URLSearchParams(location.search);
if (params.has('reset')) reset();

const levelNum = Number(params.get('level'));
globalThis.TRR_FLAGS = {
  level: Number.isFinite(levelNum) ? levelNum : 0,
  daily: params.has('daily'),
  bot: params.has('bot'),
  mute: params.has('mute'),
  lose: params.has('lose'),
};

const save = load();
setMuted(globalThis.TRR_FLAGS.mute || save.sound === false);

const Phaser = globalThis.Phaser;
const boot = document.getElementById('bootmsg');

if (!Phaser) {
  if (boot) boot.textContent = 'The game engine did not load.';
} else {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 390,
    height: 693,
    backgroundColor: '#E2C48A',
    banner: false,
    antialias: true,
    roundPixels: true,
    resolution: Math.min(globalThis.devicePixelRatio || 1, 2),
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 390,
      height: 693,
    },
    audio: { noAudio: true },
    fps: { target: 60 },
    input: { activePointers: 2 },
    scene: [BootScene, LoadScene, TitleScene, MapScene, GameScene, ShopScene, DailyScene],
  });
  globalThis.TRR = { game };
  if (boot) boot.remove();
}

if (!params.has('nosw') && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
}
