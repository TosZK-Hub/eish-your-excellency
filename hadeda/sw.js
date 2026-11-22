const CACHE = "hadeda-flap-v5";
const FILES = [
  "./",
  "./index.html",
  "./css/game.css",
  "./js/game.js",
  "./js/art.js",
  "./js/audio.js",
  "./js/ads.js",
  "./js/pack-art.js",
  "./js/pack-sfx.js",
  "./js/pack-hettie.js",
  "./css/hettie-font.css",
  "./icons/icon-hettie.svg",
  "./icons/favicon-hettie.svg",
  "./privacy.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./font/nunito-latin.woff2",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./assets/sky_dawn.webp",
  "./assets/sky_day.webp",
  "./assets/sky_sunset.webp",
  "./assets/sky_night.webp",
  "./assets/houses.webp",
  "./assets/ground.webp",
  "./assets/body.webp",
  "./assets/wing_up.webp",
  "./assets/wing_mid.webp",
  "./assets/wing_down.webp",
  "./assets/koeksister.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
