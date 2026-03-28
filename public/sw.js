const CACHE_NAME = 'cubanitos-dulces-v2';
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

const isHtmlRequest = (request) =>
  request.mode === 'navigate' ||
  (request.headers.get('accept') || '').includes('text/html');

const isStaticAsset = (url) =>
  url.pathname.startsWith('/CubanitosDulces/_next/') ||
  url.pathname.startsWith('/CubanitosDulces/images/') ||
  url.pathname.startsWith('/CubanitosDulces/icons/') ||
  url.pathname === '/CubanitosDulces/manifest.json';

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (response && response.status === 200) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }

  return response;
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request, { cache: 'no-store' });

    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return caches.match('/CubanitosDulces/');
  }
};

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (isHtmlRequest(event.request)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request));
  }
});
