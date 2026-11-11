/* Offline cache for Big 5. Scope is this folder. */
const CACHE = 'big5-lodge-v1';
const ASSETS = [
  './',
  './index.html',
  './css/game.css',
  './js/audio.js',
  './js/state.js',
  './js/icons.js',
  './js/rig.js',
  './js/world.js',
  './js/games.js',
  './js/main.js',
  './manifest.webmanifest',
  './icon.svg',
  './sw.js',
  './assets/fonts/fredoka-600.woff2',
  './assets/fonts/fredoka-700.woff2',
  './assets/fonts/nunito-700.woff2',
  './assets/fonts/nunito-800.woff2',
  './assets/ui/btn-gold.png',
  './assets/ui/btn-gold-round.png',
  './assets/ui/btn-gold-square.png',
  './assets/ui/btn-teal.png',
  './assets/ui/btn-clay.png',
  './assets/ui/btn-sand.png',
  './assets/ui/input.png',
  './assets/icons/coin.png',
  './assets/icons/star.png',
  './assets/icons/audio-on.png',
  './assets/icons/audio-off.png',
  './assets/fx/star.png',
  './assets/fx/circle.png',
  './assets/fx/spark.png',
  './assets/fx/twirl.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res && res.ok) await cache.put(url, res);
      } catch (err) { /* one missing file should not block install */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.includes('/big5/')) return;
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const home = await caches.match('./index.html');
        if (home) return home;
      }
      throw err;
    }
  })());
});
