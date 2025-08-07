import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getMessaging, getToken, deleteToken } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function notify() {
    // Tenta pegar token já salvo
    let token = localStorage.getItem('fcmToken');
    if (token) {
        console.log("Token carregado do localStorage:", token);
        const message = translations?.toasts?.notifications || "Notificações Ativadas!";
        showToast(message, 4000, "success");
        return token;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        const message = translations?.toasts?.noPermission || "Permissão negada!";
        showToast(message, 4000, "error");
        return;
    }

    try {

        await navigator.serviceWorker.register('/MusicGallery/firebase-messaging-sw.js');

        // Aguarda até que o service worker esteja ativo e pronto
        const swRegistration = await navigator.serviceWorker.ready;

        token = await getToken(messaging, {
            vapidKey: "BOqfZhGWsSKF5XOqLBZQG1GU6PJAYasFrdoggqYUnw8jERLk3zLqCdemOZcUTGh26K0oPuuY-Tubv4YvNuJ9uKg",
            serviceWorkerRegistration: swRegistration
        });

        if (token) {
            localStorage.setItem('fcmToken', token);
            console.log("Token salvo no localStorage:", token);

            updateNotificationIcon();

            const message = translations?.toasts?.notifications || "Notificações Ativadas!";
            showToast(message, 4000, "success");
        }
    } catch (err) {
        
        console.error("Erro ao registrar o Service Worker ou obter token:", err);
        const message = translations?.toasts?.noPermission || "Permissão negada!";
        showToast(message, 4000, "error");
    }

    return token;
}

export async function disableNotifications() {
    const token = localStorage.getItem('fcmToken');
    if (!token) {
        const message = translations?.toasts?.noNotifications || "Nenhuma notificação ativada.";
        showToast(message, 4000, "warning");
        return;
    }

    try {

        await navigator.serviceWorker.register('/MusicGallery/firebase-messaging-sw.js');
        const swRegistration = await navigator.serviceWorker.ready;

        await deleteToken(messaging, { serviceWorkerRegistration: swRegistration, token });

        console.log("Token deletado do Firebase:", token);
    } catch (error) {
        console.warn("Erro ao deletar token do Firebase:", error);
    }

    localStorage.removeItem('fcmToken');

    updateNotificationIcon();

    const message = translations?.toasts?.disablenotifications || "Notificações desativadas!";
    showToast(message, 4000, "success");
}

window.updateNotificationIcon = function updateNotificationIcon() {
    const bellIcon = document.getElementById('bellIcon');
    const token = localStorage.getItem('fcmToken');

    if (bellIcon) {
        if (token) {
            bellIcon.src = "./assets/icons/bell-on.svg";
        } else {
            bellIcon.src = "./assets/icons/bell-off.svg";
        }
    }
}
