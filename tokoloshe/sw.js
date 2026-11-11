/* Service worker for My Tokoloshe.
   Scope is the folder this file lives in (/tokoloshe/ when the repo is served from root). */
const CACHE = 'my-tokoloshe-v3';
const ASSETS = [
  './',
  './index.html',
  './css/game.css',
  './js/audio.js',
  './js/state.js',
  './js/icons.js',
  './js/draw.js',
  './js/games.js',
  './js/main.js',
  './manifest.webmanifest',
  './icon.svg',
  './sw.js',
  './assets/happy.webp',
  './assets/hungry.webp',
  './assets/sleepy.webp',
  './assets/dirty.webp',
  './assets/yum.webp',
  './assets/bg-kitchen.webp',
  './assets/bg-bath.webp',
  './assets/bg-stoep.webp',
  './assets/fonts/nunito-700.woff2',
  './assets/fonts/nunito-800.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res && res.ok) await cache.put(url, res);
      } catch (err) {
        /* keep install alive even if one asset fails */
      }
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
  if (!url.pathname.includes('/tokoloshe/')) return;

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
