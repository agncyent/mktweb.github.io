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
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const requireAuth = document.querySelector('meta[name="require-auth"]');

// Simpan state user biar bisa dipakai setelah sidebar load
let currentUserState = null;

// =====================
// LOGIN GOOGLE
// =====================
window.loginGoogle = async function () {
  try {
    const provider = new GoogleAuthProvider();
    const result   = await signInWithPopup(auth, provider);
    const user     = result.user;

    await setDoc(doc(db, "users", user.uid), {
      name:      user.displayName,
      email:     user.email,
      photo:     user.photoURL,
      lastLogin: new Date().toISOString()
    }, { merge: true });

    const redirectTo = localStorage.getItem("redirectAfterLogin") || "fanclub.html";
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectTo;

  } catch (error) {
    if (error.code !== "auth/popup-closed-by-user") {
      alert("Gagal Login: " + error.message);
    }
  }
};

// =====================
// EDIT PROFILE
// =====================
window.editProfile = function () {
    const nameEl = document.getElementById('profileName');
    if (!nameEl) return;
    const newName = prompt("Masukkan nama baru:", nameEl.innerText);
    if (newName) {
        nameEl.innerText = newName;
        alert("Nama berhasil diperbarui!");
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
// UPDATE UI SIDEBAR
// =====================
function updateSidebarUI(user, premiumData) {
  const profileContainer = document.getElementById('profileContainer');
  const profilePic       = document.getElementById('profilePic');
  const profileName      = document.getElementById('profileName');
  const verifiedBadge    = document.getElementById('verifiedBadge');
  const userStatus       = document.getElementById('user-status');
  const authBtn          = document.getElementById('authBtn');
  const authText         = document.getElementById('authText');

  // Fanclub page elements
  const accessDenied   = document.getElementById('access-denied');
  const fanclubContent = document.getElementById('fanclub-content');
  const userPhoto      = document.getElementById('user-photo');
  const username       = document.getElementById('username');
  const btnLogout      = document.getElementById('btn-logout');

  if (user) {
    // Sidebar profile
    if (profileContainer) profileContainer.style.display = 'block';
    if (profilePic)    profilePic.src        = user.photoURL || 'assets/default-avatar.png';
    if (profileName)   profileName.innerText = user.displayName || user.email;
    if (verifiedBadge) verifiedBadge.style.display = 'block';
    if (authText)      authText.innerText = 'Keluar';
    if (authBtn) {
      authBtn.onclick = (e) => { e.preventDefault(); window.logout(); };
      const icon = authBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-sign-out-alt';
    }
    if (userStatus && premiumData !== null) {
      userStatus.innerHTML = premiumData
        ? "<span style='color:gold;font-weight:700;'>★ Premium Member</span>"
        : "<span style='color:#7abf9a;'>Basic Fan</span>";
    }

    // Fanclub page
    if (accessDenied)   accessDenied.style.display   = 'none';
    if (fanclubContent) fanclubContent.style.display  = 'block';
    if (userPhoto)    { userPhoto.src = user.photoURL || 'assets/default-avatar.png'; }
    if (username)       username.innerText = user.displayName || user.email;
    if (btnLogout)      btnLogout.style.display = 'block';

  } else {
    // Sidebar profile
    if (profileContainer) profileContainer.style.display = 'none';
    if (verifiedBadge)    verifiedBadge.style.display    = 'none';
    if (authText)         authText.innerText = 'Masuk';
    if (authBtn) {
      authBtn.removeAttribute('onclick');
      const icon = authBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-sign-in-alt';
    }

    // Fanclub page
    if (accessDenied)   accessDenied.style.display   = 'block';
    if (fanclubContent) fanclubContent.style.display  = 'none';
    if (btnLogout)      btnLogout.style.display = 'none';

    if (requireAuth) {
      localStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "login.html";
    }
  }
}

// =====================
// MONITOR STATUS LOGIN
// =====================
onAuthStateChanged(auth, async (user) => {
  let premiumData = null;

  if (user) {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) premiumData = snap.data().premium || false;
    } catch (e) { console.error(e); }
  }

  // Simpan state
  currentUserState = { user, premiumData };

  // Update UI sekarang (kalau sidebar sudah ada)
  updateSidebarUI(user, premiumData);
});

// =====================
// UPDATE UI SETELAH SIDEBAR SELESAI DILOAD
// main.js akan dispatch event 'sidebarLoaded' setelah sidebar masuk DOM
// =====================
document.addEventListener('sidebarLoaded', function () {
  if (currentUserState !== null) {
    updateSidebarUI(currentUserState.user, currentUserState.premiumData);
  }
});
