// Adiciona todos de uma vez ----------------------------------------------

self.addEventListener("install", (event) => {
	console.log("✅ Service Worker instalado");
	event.waitUntil(
		caches.open("music-gallery-cache").then((cache) => {
			return cache.addAll([
				"../",
				"../index.html",
				"../videos.html",
				"../sobre.html",
				"../sugestoes.html",
				"../thankyou.html",
				"../css/style.css",
				"../css/mediaquery.css",
				"../css/modalplayer.css",
				"../css/reset.css",
				"../css/scrollbar.css",
				"../css/videospage.css",
				"../css/configstyle.css",
				"../css/lightmode.css",
				"../css/sobre.css",
				"../css/suggestions.css",
				"../css/toastify.css",
				"./script.js",
				"./fuse.min.js",
				"./playerfunctions.js",
				"./search.js",
				"./service-worker.js",
				"./sw-register.js",
				"./config.js",
				"./firebase-notifications.js",
				"./i18n.js",
				"./load-version.js",
				"./toastify.js",
				"./visitor-tracker.js",
				"../json/version.json",
				"../locales/pt.json",
				"../locales/en.json",
				"../locales/es.json",
				"../site.webmanifest",
				"../firebase-messaging-sw.js",
				"../assets/favicon/web-app-manifest-192x192.png",
				"../assets/favicon/web-app-manifest-512x512.png"
			]);
		})
	);
});

// Adiciona um por um ----------------------------------------------------

// self.addEventListener("install", (event) => {
//     console.log("✅ Service Worker instalado");
//     event.waitUntil(
// 		caches.open("music-gallery-cache").then(async (cache) => {
// 			const filesToCache = [
// 			"../",
// 			"../index.html",
// 			"../videos.html",
// 			"../sobre.html",
// 			"../sugestoes.html",
// 			"../thankyou.html",
// 			"../css/style.css",
// 			"../css/mediaquery.css",
// 			"../css/modalplayer.css",
// 			"../css/reset.css",
// 			"../css/scrollbar.css",
// 			"../css/videospage.css",
// 			"../css/configstyle.css",
// 			"../css/lightmode.css",
// 			"../css/sobre.css",
// 			"../css/suggestions.css",
// 			"../css/toastify.css",
// 			"./script.js",
// 			"./fuse.min.js",
// 			"./playerfunctions.js",
// 			"./search.js",
// 			"./service-worker.js",
// 			"./sw-register.js",
// 			"./config.js",
// 			"./firebase-notifications.js",
// 			"./i18n.js",
// 			"./load-version.js",
// 			"./toastify.js",
// 			"./visitor-tracker.js",
// 			"../json/version.json",
// 			"../locales/pt.json",
// 			"../locales/en.json",
// 			"../locales/es.json",
// 			"../site.webmanifest",
// 			"../firebase-messaging-sw.js",
// 			"../assets/favicon/web-app-manifest-192x192.png",
// 			"../assets/favicon/web-app-manifest-512x512.png"
// 			];

// 			for (const file of filesToCache) {
// 				try {
// 					await cache.add(file);
// 					console.log(`✅ Sucesso ao adicionar: ${file}`);
// 				} catch (error) {
// 					console.error(`❌ Erro ao adicionar: ${file}`, error);
// 				}
// 			}
//       })
//     );
// });

// -----------------------------------------------------------------------------

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});