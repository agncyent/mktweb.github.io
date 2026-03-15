// =====================
// firebase.js
// =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAyVMw8qzDKUgWyLdAPzXS6h2T9lBanMHI",
  authDomain: "mkt4x-a90e6.firebaseapp.com",
  projectId: "mkt4x-a90e6",
  storageBucket: "mkt4x-a90e6.firebasestorage.app",
  messagingSenderId: "290992499262",
  appId: "1:290992499262:web:d6c9908c82075b50993f6f",
  measurementId: "G-75M09B9HDE"
};

// Inisialisasi Firebase (cegah double init)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  // Sudah diinisialisasi sebelumnya
  import { getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db   = getFirestore(app);
