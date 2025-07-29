importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDpt2hlv15tCsVEdpYdmndnQX21dbe0tnw",
    authDomain: "musicgallery-e8284.firebaseapp.com",
    projectId: "musicgallery-e8284",
    storageBucket: "musicgallery-e8284.appspot.com",
    messagingSenderId: "248700233047",
    appId: "1:248700233047:web:182f23fb5a4383761dca12"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './assets/favicon/web-app-manifest-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});