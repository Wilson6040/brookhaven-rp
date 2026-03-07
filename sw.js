const VERSION = 'v4';
const CACHE = 'ellas-world-' + VERSION;
const FILES = ['./game.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key))); // delete ALL old caches
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
  })());
});

// Network first — always fetch fresh, fall back to cache only if offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(event.request);
      const cache = await caches.open(CACHE);
      cache.put(event.request, networkResponse.clone());
      return networkResponse;
    } catch (_err) {
      return caches.match(event.request);
    }
  })());
});
