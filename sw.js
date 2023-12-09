const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/src/assets/apple-touch-icon.png',
  '/src/assets/android-chrome-192x192.png',
  '/src/assets/android-chrome-512x512.png',
  '/src/assets/favicon.ico',
  '/src/assets/favicon-32x32.png',
  '/src/main.tsx',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
