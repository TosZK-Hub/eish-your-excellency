var C="ewg-v9",F=["./","index.html","style.css","game.js","icon.svg","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","art/beadband.svg","art/bg-braai.webp","art/bg-road.webp","art/lg.woff","art/pm.woff"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}))});
self.addEventListener("fetch",function(e){e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(C).then(function(x){x.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}))});
