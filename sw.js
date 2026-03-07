const VERSION = 'v1';
const CACHE = 'ellas-world-' + VERSION;
const FILES = ['./game.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('ellas-world-') && key !== CACHE)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isGamePage = url.origin === self.location.origin && (url.pathname.endsWith('/game.html') || url.pathname === '/game.html');

  if (isGamePage) {
    event.respondWith((async () => {
      const cached = await caches.match('./game.html');
      return cached || fetch(req);
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(req);
      return networkResponse;
    } catch (_err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return caches.match('./game.html');
    }
  })());
});
