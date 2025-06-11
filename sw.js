const CACHE_NAME = 'blucharter-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index_en.html',
  '/privacy-policy.html',
  '/privacy-policy-en.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/images/barca1.jpg',
  '/images/barca2.jpg'
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
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
}); 