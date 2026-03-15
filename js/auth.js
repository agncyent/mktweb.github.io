// =====================
// auth.js
// =====================
import { auth, db } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// =====================
// CEK APAKAH HALAMAN INI BUTUH LOGIN
// Tambahkan <meta name="require-auth" content="true"> di halaman yang diproteksi
// =====================
const requireAuth = document.querySelector('meta[name="require-auth"]');

// =====================
// LOGIN GOOGLE
// =====================
window.loginGoogle = async function () {
  try {
    const provider = new GoogleAuthProvider();
    const result   = await signInWithPopup(auth, provider);
    const user     = result.user;

    // Simpan/update data user ke Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name:      user.displayName,
      email:     user.email,
      photo:     user.photoURL,
      lastLogin: new Date().toISOString()
      // premium: false  <-- jangan reset, pakai merge:true
    }, { merge: true });

    // Redirect ke fanclub setelah login
    const redirectTo = localStorage.getItem("redirectAfterLogin") || "fanclub.html";
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectTo;

  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      console.log("Login dibatalkan user.");
    } else {
      alert("Gagal Login: " + error.message);
    }
  }
};

// =====================
// LOGOUT
// =====================
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// =====================
// MONITOR STATUS LOGIN
// =====================
onAuthStateChanged(auth, async (user) => {
  const photo    = document.getElementById("user-photo");
  const username = document.getElementById("username");
  const status   = document.getElementById("user-status");
  const btnLogin = document.getElementById("btn-login");
  const btnLogout= document.getElementById("btn-logout");

  if (user) {
    // --- USER SUDAH LOGIN ---
    if (photo)     { photo.src = user.photoURL; photo.style.display = "block"; }
    if (username)  username.innerText = user.displayName || user.email;

    // Badge verified
    const verifiedBadge = document.getElementById('verifiedBadge');
    if (verifiedBadge) verifiedBadge.style.display = 'block';

    // Tampilkan profile container
    const profileContainer = document.getElementById('profileContainer');
    if (profileContainer) profileContainer.style.display = 'block';

    if (btnLogin)  btnLogin.style.display  = "none";
    if (btnLogout) btnLogout.style.display = "block";

    // Ganti icon & teks authBtn jadi Keluar
    const authBtn  = document.getElementById('authBtn');
    const authText = document.getElementById('authText');
    if (authText) authText.innerText = 'Keluar';
    if (authBtn)  {
      authBtn.onclick = (e) => { e.preventDefault(); window.logout(); };
      authBtn.querySelector('i').className = 'fas fa-sign-out-alt';
    }

    // Ambil status premium dari Firestore
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && status) {
        const data = snap.data();
        status.innerHTML = data.premium
          ? "<span style='color:gold;font-weight:700;'>★ Premium Member</span>"
          : "<span style='color:#7abf9a;'>Basic Fan</span>";
      }
    } catch (e) {
      console.error("Firestore error:", e);
    }

  } else {
    // --- USER BELUM LOGIN ---
    if (photo)     { photo.src = "assets/default-avatar.png"; }
    if (username)  username.innerText = "Guest";
    if (status)    status.innerText   = "";

    // Sembunyikan profile container
    const profileContainer = document.getElementById('profileContainer');
    if (profileContainer) profileContainer.style.display = 'none';

    // Badge verified disembunyikan
    const verifiedBadge = document.getElementById('verifiedBadge');
    if (verifiedBadge) verifiedBadge.style.display = 'none';

    if (btnLogin)  btnLogin.style.display  = "block";
    if (btnLogout) btnLogout.style.display = "none";

    // Kembalikan authBtn ke Masuk
    const authBtn  = document.getElementById('authBtn');
    const authText = document.getElementById('authText');
    if (authText) authText.innerText = 'Masuk';
    if (authBtn)  {
      authBtn.onclick = () => window.location.href = 'login.html';
      const icon = authBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-sign-in-alt';
    }

    // Kalau halaman ini butuh login, redirect ke login page
    if (requireAuth) {
      localStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "login.html";
    }
  }
});
