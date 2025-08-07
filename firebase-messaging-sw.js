importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './assets/favicon/web-app-manifest-192x192.png',
        badge: './assets/favicon/favicon-96x96.png',
        data: {
            url: new URL('/MusicGallery', self.location.origin).href
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// abrir a URL correta ao clicar na notificação
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {

            for (const client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
            
        })
    );
});
