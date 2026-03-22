// =====================
// profile.js
// =====================
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  // Isi data dari akun Google
  const photo = document.getElementById('pf-photo');
  const name  = document.getElementById('pf-name');
  const email = document.getElementById('pf-email');
  const idEl  = document.getElementById('pf-id');

  if (photo) photo.src = user.photoURL || 'assets/default-avatar.png';
  if (name)  name.innerText  = user.displayName || '-';
  if (email) email.innerText = user.email || '-';
  if (idEl) {
    const rawId = user.uid.replace(/\D/g,'').slice(-4) || '0000';
    idEl.innerText = '#F' + rawId;
  }

  // Ambil data dari Firestore
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const data = snap.data();

      // Set nama
      const nameInput = document.getElementById('pf-name-input');
      if (nameInput) nameInput.value = data.username || user.displayName || '';
      if (data.oshi) {
        const oshiRadio = document.querySelector(`input[name="oshi"][value="${data.oshi}"]`);
        if (oshiRadio) oshiRadio.checked = true;
      }

      // Set kota
      const cityInput = document.getElementById('pf-city');
      if (cityInput && data.city) cityInput.value = data.city;

      // Set tanggal lahir
      const birthInput = document.getElementById('pf-birth');
      if (birthInput && data.birthdate) birthInput.value = data.birthdate;
    }
  } catch(e) { console.error(e); }
});

// SIMPAN PROFIL
window.saveProfile = async function() {
  const user = auth.currentUser;
  if (!user) { alert('Silakan login terlebih dahulu!'); return; }

  const username  = document.getElementById('pf-name-input')?.value.trim() || '';
  const oshi      = document.querySelector('input[name="oshi"]:checked')?.value || '';
  const city      = document.getElementById('pf-city')?.value.trim() || '';
  const birthdate = document.getElementById('pf-birth')?.value || '';
  const btn       = document.getElementById('pf-save-btn');
  const msg       = document.getElementById('pf-msg');

  if (!oshi) {
    msg.className = 'profile-msg error';
    msg.innerText = '⚠️ Pilih oshi kamu dulu!';
    return;
  }

  btn.disabled = true;
  msg.className = 'profile-msg';
  msg.innerText = 'Menyimpan...';

  try {
    await setDoc(doc(db, 'users', user.uid), {
      username, oshi, city, birthdate
    }, { merge: true });

    msg.className = 'profile-msg success';
    msg.innerText = '✅ Profil berhasil disimpan!';

    setTimeout(() => {
      window.location.href = '../fanclub.html';
    }, 1200);

  } catch(e) {
    console.error(e);
    msg.className = 'profile-msg error';
    msg.innerText = '❌ Gagal menyimpan, coba lagi!';
    btn.disabled = false;
  }
};

