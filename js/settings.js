// =====================
// settings.js
// =====================
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;
let editingField = null;

// =====================
// BIND EVENTS
// =====================
document.addEventListener('DOMContentLoaded', function() {

  // Support email
  const btnSupport = document.getElementById('btn-support');
  if (btnSupport) btnSupport.href = 'mailto:' + 'support@fortyex.web.id';
  document.getElementById('btn-edit-email')?.addEventListener('click', () => editField('email'));
  document.getElementById('btn-edit-phone')?.addEventListener('click', () => editField('phone'));

  // Modal edit
  document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-save')?.addEventListener('click', saveField);

  // Logout & switch
  document.getElementById('btn-logout')?.addEventListener('click', doLogout);
  document.getElementById('btn-switch')?.addEventListener('click', switchAccount);

  // About & privacy
  document.getElementById('btn-about')?.addEventListener('click', showAbout);
  document.getElementById('btn-close-about')?.addEventListener('click', closeAbout);
  document.getElementById('btn-privacy')?.addEventListener('click', showPrivacy);

  // Delete
  document.getElementById('btn-delete')?.addEventListener('click', () => {
    document.getElementById('delete-modal-1').style.display = 'flex';
  });
  document.getElementById('btn-del1-no')?.addEventListener('click', closeDeleteModals);
  document.getElementById('btn-del1-yes')?.addEventListener('click', () => {
    document.getElementById('delete-modal-1').style.display = 'none';
    document.getElementById('delete-modal-2').style.display = 'flex';
  });
  document.getElementById('btn-del2-no')?.addEventListener('click', closeDeleteModals);
  document.getElementById('btn-del2-yes')?.addEventListener('click', () => {
    document.getElementById('delete-modal-2').style.display = 'none';
    document.getElementById('delete-confirm-cb').checked = false;
    document.getElementById('delete-modal-3').style.display = 'flex';
  });
  document.getElementById('btn-del3-cancel')?.addEventListener('click', closeDeleteModals);
  document.getElementById('btn-del3-confirm')?.addEventListener('click', deleteFinal);
});

// =====================
// AUTH
// =====================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '../login.html';
    return;
  }
  currentUser = user;

  const emailEl = document.getElementById('st-email-val');
  if (emailEl) emailEl.innerText = user.email || '-';

  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const data = snap.data();
      const phoneEl = document.getElementById('st-phone-val');
      if (phoneEl && data.phone) {
        phoneEl.innerText = data.phone;
        phoneEl.removeAttribute('data-key');
      }
      if (data.email && emailEl) emailEl.innerText = data.email;
    }
  } catch(e) { console.error(e); }
});

// =====================
// EDIT FIELD
// =====================
function editField(field) {
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
}

function closeModal() {
  document.getElementById('edit-modal').style.display = 'none';
  editingField = null;
}

async function saveField() {
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
}

// =====================
// LOGOUT & SWITCH
// =====================
function doLogout() {
  if (confirm('Yakin mau keluar?')) {
    signOut(auth).then(() => window.location.href = '../index.html');
  }
}

function switchAccount() {
  if (confirm('Keluar dan ganti akun Google?')) {
    signOut(auth).then(() => window.location.href = '../login.html');
  }
}

// =====================
// ABOUT & PRIVACY
// =====================
function showAbout() {
  document.getElementById('about-modal').style.display = 'flex';
}
function closeAbout() {
  document.getElementById('about-modal').style.display = 'none';
}
function showPrivacy() {
  alert('Kebijakan Privasi MKT4X:\n\nData kamu disimpan secara aman di Firebase dan tidak dibagikan ke pihak ketiga.');
}

// =====================
// DELETE - CLOSE ALL
// =====================
function closeDeleteModals() {
  document.getElementById('delete-modal-1').style.display = 'none';
  document.getElementById('delete-modal-2').style.display = 'none';
  document.getElementById('delete-modal-3').style.display = 'none';
}

async function deleteFinal() {
  const cb = document.getElementById('delete-confirm-cb');
  if (!cb.checked) {
    cb.parentElement.style.borderColor = '#e03333';
    setTimeout(() => cb.parentElement.style.borderColor = '#ffcdd2', 1000);
    return;
  }

  const btn = document.getElementById('btn-del3-confirm');
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
}
