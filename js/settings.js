// =====================
// settings.js
// =====================
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;
let editingField = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../login.html';
    return;
  }
  currentUser = user;

  // Set email dari Google
  const emailEl = document.getElementById('st-email-val');
  if (emailEl) emailEl.innerText = user.email || '-';

  // Ambil data dari Firestore
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const data = snap.data();
      const phoneEl = document.getElementById('st-phone-val');
      if (phoneEl && data.phone) {
        phoneEl.innerText = data.phone;
        phoneEl.removeAttribute('data-key');
      }
      // Kalau ada email custom
      if (data.email && emailEl) emailEl.innerText = data.email;
    }
  } catch(e) { console.error(e); }
});

// EDIT FIELD
window.editField = function(field) {
  editingField = field;
  const modal = document.getElementById('edit-modal');
  const title = document.getElementById('modal-title');
  const input = document.getElementById('modal-input');

  if (field === 'email') {
    title.innerText = 'Edit Gmail';
    input.type = 'email';
    input.placeholder = 'Masukkan email baru';
    input.value = document.getElementById('st-email-val')?.innerText || '';
  } else if (field === 'phone') {
    title.innerText = 'Edit No. Telepon';
    input.type = 'tel';
    input.placeholder = 'Contoh: 08123456789';
    const phoneEl = document.getElementById('st-phone-val');
    input.value = (phoneEl && !phoneEl.getAttribute('data-key')) ? phoneEl.innerText : '';
  }

  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 100);
};

window.closeModal = function() {
  document.getElementById('edit-modal').style.display = 'none';
  editingField = null;
};

window.saveField = async function() {
  if (!currentUser || !editingField) return;
  const input = document.getElementById('modal-input');
  const value = input.value.trim();
  if (!value) return;

  try {
    if (editingField === 'email') {
      await setDoc(doc(db, 'users', currentUser.uid), { email: value }, { merge: true });
      document.getElementById('st-email-val').innerText = value;
    } else if (editingField === 'phone') {
      await setDoc(doc(db, 'users', currentUser.uid), { phone: value }, { merge: true });
      const phoneEl = document.getElementById('st-phone-val');
      phoneEl.innerText = value;
      phoneEl.removeAttribute('data-key');
    }
    closeModal();
  } catch(e) {
    alert('Gagal menyimpan, coba lagi!');
  }
};

// LOGOUT
window.doLogout = function() {
  if (confirm('Yakin mau keluar?')) {
    signOut(auth).then(() => {
      window.location.href = '../index.html';
    });
  }
};

// SWITCH ACCOUNT
window.switchAccount = function() {
  if (confirm('Keluar dan ganti akun Google?')) {
    signOut(auth).then(() => {
      window.location.href = '../login.html';
    });
  }
};

// ABOUT
window.showAbout = function() {
  document.getElementById('about-modal').style.display = 'flex';
};
window.closeAbout = function() {
  document.getElementById('about-modal').style.display = 'none';
};

// PRIVACY
window.showPrivacy = function() {
  alert('Kebijakan Privasi MKT4X:\n\nData kamu disimpan secara aman di Firebase dan tidak dibagikan ke pihak ketiga. Data yang disimpan meliputi: nama, email, oshi, kota, dan tanggal lahir.');
};

// DELETE ACCOUNT - 3 STEP
window.deleteAccount = function() {
  document.getElementById('delete-modal-1').style.display = 'flex';
};

window.deleteStep2 = function() {
  document.getElementById('delete-modal-1').style.display = 'none';
  document.getElementById('delete-modal-2').style.display = 'flex';
};

window.deleteStep3 = function() {
  document.getElementById('delete-modal-2').style.display = 'none';
  document.getElementById('delete-confirm-cb').checked = false;
  document.getElementById('delete-modal-3').style.display = 'flex';
};

window.closeDeleteModals = function() {
  document.getElementById('delete-modal-1').style.display = 'none';
  document.getElementById('delete-modal-2').style.display = 'none';
  document.getElementById('delete-modal-3').style.display = 'none';
};

window.deleteFinal = async function() {
  const cb = document.getElementById('delete-confirm-cb');
  if (!cb.checked) {
    cb.parentElement.style.border = '1.5px solid #e03333';
    cb.parentElement.style.animation = 'none';
    setTimeout(() => cb.parentElement.style.border = '1.5px solid #ffcdd2', 1000);
    return;
  }

  const btn = document.getElementById('delete-final-btn');
  btn.disabled = true;
  btn.innerText = 'Menghapus...';

  try {
    await deleteDoc(doc(db, 'users', currentUser.uid));
    await signOut(auth);
    alert('Akun berhasil dihapus.');
    window.location.href = '../index.html';
  } catch(e) {
    alert('Gagal menghapus akun: ' + e.message);
    btn.disabled = false;
    btn.innerText = 'Hapus Akun';
  }
};
