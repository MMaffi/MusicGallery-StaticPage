import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getCountFromServer, collection } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpt2hlv15tCsVEdpYdmndnQX21dbe0tnw",
    authDomain: "musicgallery-e8284.firebaseapp.com",
    projectId: "musicgallery-e8284",
    storageBucket: "musicgallery-e8284.appspot.com",
    messagingSenderId: "248700233047",
    appId: "1:248700233047:web:182f23fb5a4383761dca12"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Gera ou recupera ID único
function getOrCreateUserId() {
    let id = localStorage.getItem('visitorId');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('visitorId', id);
    }
    return id;
}

// Salva visita única no Firestore
export async function registerUniqueVisitor() {
    const visitorId = getOrCreateUserId();
    const docRef = doc(db, "visitors", visitorId);
    await setDoc(docRef, {
        visitedAt: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
}

export async function showVisitorCount(selector = "#visitorNumber") {
    const snapshot = await getCountFromServer(collection(db, "visitors"));
    const count = snapshot.data().count;

    const el = document.querySelector(selector);
    if (el) el.textContent = count;
}