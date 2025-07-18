self.addEventListener("install", (event) => {
  console.log("✅ Service Worker instalado");
  event.waitUntil(
    caches.open("music-gallery-cache").then((cache) => {
      return cache.addAll([
        "./",
        "../index.html",
        "../videos.html",
        "../css/style.css",
        "../css/mediaquery.css",
        "../css/modalplayer.css",
        "../css/reset.css",
        "../css/scrollbar.css",
        "../css/videospage.css",
        "./script.js",
        "./fuse.min.js",
        "./playerfunctions.js",
        "./search.js",
        "./service-worker.js",
        "../json/data.json",
        "../site.webmanifest",
        "../assets/favicon/web-app-manifest-192x192.png",
        "../assets/favicon/web-app-manifest-512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});