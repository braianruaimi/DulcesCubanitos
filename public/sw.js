const CACHE_NAME = 'cubanitos-dulces-v1';
const OFFLINE_ASSETS = [
  '/CubanitosDulces/',
  '/CubanitosDulces/manifest.json',
  '/CubanitosDulces/icons/icon-192.svg',
  '/CubanitosDulces/icons/icon-512.svg',
  '/CubanitosDulces/images/cubanito-neon-1.svg',
  '/CubanitosDulces/images/cubanito-neon-2.svg',
  '/CubanitosDulces/images/cubanito-neon-3.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));

          return response;
        })
        .catch(() => caches.match('/CubanitosDulces/'));
    }),
  );
});
