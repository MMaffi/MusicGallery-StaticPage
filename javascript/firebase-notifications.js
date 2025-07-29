import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getMessaging, getToken, deleteToken } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpt2hlv15tCsVEdpYdmndnQX21dbe0tnw",
    authDomain: "musicgallery-e8284.firebaseapp.com",
    projectId: "musicgallery-e8284",
    storageBucket: "musicgallery-e8284.appspot.com",
    messagingSenderId: "248700233047",
    appId: "1:248700233047:web:182f23fb5a4383761dca12"
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

        const registration = await navigator.serviceWorker.register('/MusicGallery/firebase-messaging-sw.js');

        token = await getToken(messaging, {
            vapidKey: "BOqfZhGWsSKF5XOqLBZQG1GU6PJAYasFrdoggqYUnw8jERLk3zLqCdemOZcUTGh26K0oPuuY-Tubv4YvNuJ9uKg",
            serviceWorkerRegistration: registration
        });

        if (token) {
            localStorage.setItem('fcmToken', token);
            console.log("Token salvo no localStorage:", token);
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
        await deleteToken(messaging);
        console.log("Token deletado do Firebase:", token);
    } catch (error) {
        console.warn("Erro ao deletar token do Firebase:", error);
    }

    localStorage.removeItem('fcmToken');
    const message = translations?.toasts?.disablenotifications || "Notificações desativadas!";
    showToast(message, 4000, "success");
}