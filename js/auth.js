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
  doc, setDoc, getDoc, collection, query, where, getDocs
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

    // Kalau ada data pendaftaran fanclub di localStorage, simpan ke users
    const fcOshi     = localStorage.getItem('fc_oshi');
    const fcCity     = localStorage.getItem('fc_city');
    const fcUsername = localStorage.getItem('fc_username');
    if (fcOshi || fcCity) {
      await setDoc(doc(db, "users", user.uid), {
        oshi: fcOshi || '',
        city: fcCity || '',
        username: fcUsername || '',
        premium: true
      }, { merge: true });
      localStorage.removeItem('fc_oshi');
      localStorage.removeItem('fc_city');
      localStorage.removeItem('fc_username');
    }

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
async function updateSidebarUI(user, premiumData, userData) {
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

    // Update fanclub profile card
    if (userData) {
      const oshiName = document.getElementById('fc-oshi-name');
      const oshiVal  = document.getElementById('fc-oshi-val');
      const cityVal  = document.getElementById('fc-city-val');
      const fcIdVal  = document.getElementById('fc-id-val');
      if (fcIdVal) {
        const rawId = user.uid.replace(/\D/g,'').slice(-4) || Math.floor(1000+Math.random()*9000);
        fcIdVal.innerText = '#F' + rawId;
      }

      // Coba ambil dari users dulu
      if (userData.oshi) {
        if (oshiName) oshiName.innerText = userData.oshi;
        if (oshiVal)  oshiVal.innerText  = userData.oshi;
      }
      if (userData.city) {
        if (cityVal) cityVal.innerText = userData.city;
      }

      // Kalau belum ada di users, ambil dari fanclub_members
      if (!userData.oshi || !userData.city) {
        try {
          const q = query(collection(db, 'fanclub_members'), where('email', '==', user.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const fdata = snap.docs[0].data();
            if (oshiName) oshiName.innerText = fdata.oshi || '-';
            if (oshiVal)  oshiVal.innerText  = fdata.oshi || '-';
            if (cityVal)  cityVal.innerText  = fdata.city || '-';
            await setDoc(doc(db, 'users', user.uid), {
              oshi: fdata.oshi, city: fdata.city
            }, { merge: true });
          }
        } catch(e) { console.error('fanclub_members fetch:', e); }
      }
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
  let userData = null;

  if (user) {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        userData    = snap.data();
        premiumData = userData.premium || false;
      }
    } catch (e) { console.error(e); }
  }

  // Simpan state
  currentUserState = { user, premiumData, userData };

  // Update UI sekarang (kalau sidebar sudah ada)
  updateSidebarUI(user, premiumData, userData);
});

// =====================
// UPDATE UI SETELAH SIDEBAR SELESAI DILOAD
// main.js akan dispatch event 'sidebarLoaded' setelah sidebar masuk DOM
// =====================
document.addEventListener('sidebarLoaded', function () {
  if (currentUserState !== null) {
    updateSidebarUI(currentUserState.user, currentUserState.premiumData, currentUserState.userData);
  }
});
