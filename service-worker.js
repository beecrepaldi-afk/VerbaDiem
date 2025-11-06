// This is a basic service worker file.
// It allows the app to be installable (as a PWA) but doesn't implement any caching yet.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Caching logic for app shell can be added here in the future.
  // For example:
  // event.waitUntil(
  //   caches.open('v1').then((cache) => {
  //     return cache.addAll([
  //       '/',
  //       '/index.html',
  //       // etc.
  //     ]);
  //   })
  // );
});

self.addEventListener('fetch', (event) => {
  // For now, we are just fetching from the network (network-first strategy).
  // More advanced caching strategies (cache-first, stale-while-revalidate)
  // would be implemented here in a full PWA.
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    // This is a good place to clean up old caches.
});
