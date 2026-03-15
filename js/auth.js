import { auth, db } from "./firebase.js";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"; // Versi stabil

import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* LOGIN GOOGLE */
window.loginGoogle = async function() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Simpan data ke Firestore (Hanya jika belum ada, atau update yang perlu saja)
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      // premium: false // HATI-HATI: Jangan di-reset ke false tiap login kalau dia udah beli premium
    }, { merge: true });

  } catch (error) {
    alert("Gagal Login: " + error.message);
  }
};

/* LOGOUT */
window.logout = function() {
  signOut(auth).then(() => {
    window.location.reload(); // Refresh biar tampilan balik ke Guest
  });
};

/* LOAD USER & CEK PREMIUM */
onAuthStateChanged(auth, async (user) => {
  const photo = document.getElementById("user-photo");
  const username = document.getElementById("username");
  const status = document.getElementById("user-status");

  if (user) {
    // Update UI Dasar dari Akun Google
    if (photo) photo.src = user.photoURL;
    if (username) username.innerText = user.displayName;

    // Ambil status Premium dari Firestore
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      
      if (snap.exists()) {
        const data = snap.data();
        if (status) {
          status.innerHTML = data.premium ? 
            "<span style='color: gold;'>★ Premium Member</span>" : 
            "Basic Fan";
        }
      }
    } catch (e) {
      console.error("Error fetching Firestore:", e);
    }
  } else {
    // Tampilan jika Logout
    if (username) username.innerText = "Guest";
    if (photo) photo.src = "default-avatar.png"; // Sediakan gambar default
    if (status) status.innerText = "";
  }
});
