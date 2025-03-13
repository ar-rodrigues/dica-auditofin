const CACHE_NAME = "dica-cache-v1";
const urlsToCache = [
  "/",
  "/login",
  "/manifest.json",
  "/images/android-chrome-512x512.png",
  "/images/android-chrome-192x192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
