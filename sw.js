const VERSION = 'v5';
const CACHE = 'ellas-world-' + VERSION;
const FILES = ['./index.html', './game.html', './manifest.json'];
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const META_PREFIX = '/__sw_meta__/';

// Security note: importScripts() is intentionally not used; this SW stays self-contained.

function metaRequestFor(url) {
  return new Request(self.location.origin + META_PREFIX + encodeURIComponent(url));
}

async function responseSha256(response) {
  const buffer = await response.clone().arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function writeCacheWithMeta(cache, request, response) {
  if (!response || response.status !== 200) return;
  const hash = await responseSha256(response);
  const meta = {
    cachedAt: Date.now(),
    etag: response.headers.get('ETag') || null,
    lastModified: response.headers.get('Last-Modified') || null,
    hash
  };
  await cache.put(request, response.clone());
  await cache.put(
    metaRequestFor(request.url),
    new Response(JSON.stringify(meta), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    })
  );
}

async function readMeta(cache, request) {
  const metaResponse = await cache.match(metaRequestFor(request.url));
  if (!metaResponse) return null;
  try {
    const meta = await metaResponse.json();
    if (!meta || typeof meta !== 'object') return null;
    return meta;
  } catch (_err) {
    return null;
  }
}

async function verifyCachedIntegrity(cachedResponse, meta) {
  if (!cachedResponse || !meta?.hash) return false;
  const currentHash = await responseSha256(cachedResponse);
  return currentHash === meta.hash;
}

async function revalidateCached(cache, request, cachedResponse, meta) {
  const headers = new Headers();
  if (meta?.etag) headers.set('If-None-Match', meta.etag);
  if (meta?.lastModified) headers.set('If-Modified-Since', meta.lastModified);
  try {
    const networkResponse = await fetch(request, { headers, cache: 'no-store' });
    if (networkResponse.status === 304 && cachedResponse) {
      const refreshedMeta = { ...(meta || {}), cachedAt: Date.now() };
      await cache.put(
        metaRequestFor(request.url),
        new Response(JSON.stringify(refreshedMeta), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        })
      );
      return cachedResponse;
    }
    if (networkResponse.status === 200) {
      await writeCacheWithMeta(cache, request, networkResponse);
      return networkResponse;
    }
    return null;
  } catch (_err) {
    return null;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(FILES.map(async (path) => {
      try {
        const req = new Request(path, { cache: 'no-store' });
        const res = await fetch(req);
        if (res.status === 200) {
          await writeCacheWithMeta(cache, req, res);
        }
      } catch (_err) {
        // install continues even if one asset is unavailable
      }
    }));
  })());
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
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cachedResponse = await cache.match(event.request);
    const meta = await readMeta(cache, event.request);
    const now = Date.now();
    const ageMs = meta?.cachedAt ? now - Number(meta.cachedAt) : Number.POSITIVE_INFINITY;

    try {
      const networkResponse = await fetch(event.request, { cache: 'no-store' });
      if (networkResponse.status === 200) {
        await writeCacheWithMeta(cache, event.request, networkResponse);
      }
      return networkResponse;
    } catch (_err) {
      if (!cachedResponse || !meta) {
        return new Response('Offline and no valid cache', { status: 503, statusText: 'Service Unavailable' });
      }
      const integrityOk = await verifyCachedIntegrity(cachedResponse, meta);
      if (!integrityOk) {
        await cache.delete(event.request);
        await cache.delete(metaRequestFor(event.request.url));
        return new Response('Cached response integrity check failed', { status: 500, statusText: 'Integrity Error' });
      }
      if (ageMs <= MAX_CACHE_AGE_MS) {
        return cachedResponse;
      }
      const refreshed = await revalidateCached(cache, event.request, cachedResponse, meta);
      if (refreshed) return refreshed;
      return new Response('Cached response too old and revalidation failed', { status: 504, statusText: 'Gateway Timeout' });
    }
  })());
});
