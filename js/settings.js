// settings.js - NON MODULE
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {

    // Support email
    const btnSupport = document.getElementById('btn-support');
    if (btnSupport) btnSupport.setAttribute('href', 'mai' + 'lto:support@fortyex.web.id');

    // Edit buttons
    const btnEditEmail = document.getElementById('btn-edit-email');
    const btnEditPhone = document.getElementById('btn-edit-phone');
    if (btnEditEmail) btnEditEmail.addEventListener('click', function() { openEditModal('email'); });
    if (btnEditPhone) btnEditPhone.addEventListener('click', function() { openEditModal('phone'); });

    // Modal buttons
    const btnCancel = document.getElementById('btn-modal-cancel');
    const btnSave   = document.getElementById('btn-modal-save');
    if (btnCancel) btnCancel.addEventListener('click', closeEditModal);
    if (btnSave)   btnSave.addEventListener('click', saveField);

    // Logout & switch
    const btnLogout = document.getElementById('btn-logout');
    const btnSwitch = document.getElementById('btn-switch');
    if (btnLogout) btnLogout.addEventListener('click', doLogout);
    if (btnSwitch) btnSwitch.addEventListener('click', switchAccount);

    // About & privacy
    const btnAbout   = document.getElementById('btn-about');
    const btnCloseAbout = document.getElementById('btn-close-about');
    const btnPrivacy = document.getElementById('btn-privacy');
    if (btnAbout)   btnAbout.addEventListener('click', showAbout);
    if (btnCloseAbout) btnCloseAbout.addEventListener('click', closeAbout);
    if (btnPrivacy) btnPrivacy.addEventListener('click', showPrivacy);

    // Delete
    const btnDelete = document.getElementById('btn-delete');
    if (btnDelete) btnDelete.addEventListener('click', function() {
      document.getElementById('delete-modal-1').style.display = 'flex';
    });
    const btnDel1No  = document.getElementById('btn-del1-no');
    const btnDel1Yes = document.getElementById('btn-del1-yes');
    const btnDel2No  = document.getElementById('btn-del2-no');
    const btnDel2Yes = document.getElementById('btn-del2-yes');
    const btnDel3Cancel  = document.getElementById('btn-del3-cancel');
    const btnDel3Confirm = document.getElementById('btn-del3-confirm');
    if (btnDel1No)  btnDel1No.addEventListener('click', closeDeleteModals);
    if (btnDel1Yes) btnDel1Yes.addEventListener('click', function() {
      document.getElementById('delete-modal-1').style.display = 'none';
      document.getElementById('delete-modal-2').style.display = 'flex';
    });
    if (btnDel2No)  btnDel2No.addEventListener('click', closeDeleteModals);
    if (btnDel2Yes) btnDel2Yes.addEventListener('click', function() {
      document.getElementById('delete-modal-2').style.display = 'none';
      document.getElementById('delete-confirm-cb').checked = false;
      document.getElementById('delete-modal-3').style.display = 'flex';
    });
    if (btnDel3Cancel)  btnDel3Cancel.addEventListener('click', closeDeleteModals);
    if (btnDel3Confirm) btnDel3Confirm.addEventListener('click', deleteFinal);

  }, 500);
});

function openEditModal(field) {
  window._editingField = field;
  var modal = document.getElementById('edit-modal');
  var title = document.getElementById('modal-title');
  var input = document.getElementById('modal-input');
  if (field === 'email') {
    title.innerText = 'Edit Gmail';
    input.type = 'email';
    input.placeholder = 'Masukkan email baru';
    input.value = document.getElementById('st-email-val')?.innerText || '';
  } else {
    title.innerText = 'Edit No. Telepon';
    input.type = 'tel';
    input.placeholder = 'Contoh: 08123456789';
    var phoneEl = document.getElementById('st-phone-val');
    input.value = (phoneEl && !phoneEl.getAttribute('data-key')) ? phoneEl.innerText : '';
  }
  modal.style.display = 'flex';
  setTimeout(function() { input.focus(); }, 100);
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
  window._editingField = null;
}

function saveField() {
  var field = window._editingField;
  var value = document.getElementById('modal-input').value.trim();
  if (!value || !field) return;
  var user = window._currentSettingsUser;
  if (!user) return;

  import('./firebase.js').then(function(fb) {
    var firestoreModule = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
    import(firestoreModule).then(function(fs) {
      var data = {};
      data[field === 'email' ? 'email' : 'phone'] = value;
      fs.setDoc(fs.doc(fb.db, 'users', user.uid), data, { merge: true }).then(function() {
        if (field === 'email') document.getElementById('st-email-val').innerText = value;
        else {
          var phoneEl = document.getElementById('st-phone-val');
          phoneEl.innerText = value;
          phoneEl.removeAttribute('data-key');
        }
        closeEditModal();
      });
    });
  });
}

function doLogout() {
  if (!confirm('Yakin mau keluar?')) return;
  import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js').then(function(fa) {
    import('./firebase.js').then(function(fb) {
      fa.signOut(fb.auth).then(function() { window.location.href = '../index.html'; });
    });
  });
}

function switchAccount() {
  if (!confirm('Keluar dan ganti akun Google?')) return;
  import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js').then(function(fa) {
    import('./firebase.js').then(function(fb) {
      fa.signOut(fb.auth).then(function() { window.location.href = '../login.html'; });
    });
  });
}

function showAbout() { document.getElementById('about-modal').style.display = 'flex'; }
function closeAbout() { document.getElementById('about-modal').style.display = 'none'; }
function showPrivacy() { alert('Kebijakan Privasi MKT4X:\n\nData kamu disimpan secara aman di Firebase dan tidak dibagikan ke pihak ketiga.'); }

function closeDeleteModals() {
  document.getElementById('delete-modal-1').style.display = 'none';
  document.getElementById('delete-modal-2').style.display = 'none';
  document.getElementById('delete-modal-3').style.display = 'none';
}

function deleteFinal() {
  var cb = document.getElementById('delete-confirm-cb');
  if (!cb.checked) {
    cb.parentElement.style.borderColor = '#e03333';
    setTimeout(function() { cb.parentElement.style.borderColor = '#ffcdd2'; }, 1000);
    return;
  }
  var btn = document.getElementById('btn-del3-confirm');
  btn.disabled = true;
  btn.innerText = 'Menghapus...';
  var user = window._currentSettingsUser;
  if (!user) return;

  Promise.all([
    import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'),
    import('./firebase.js')
  ]).then(function(modules) {
    var fa = modules[0], fs = modules[1], fb = modules[2];
    fs.deleteDoc(fs.doc(fb.db, 'users', user.uid)).then(function() {
      fa.signOut(fb.auth).then(function() {
        alert('Akun berhasil dihapus.');
        window.location.href = '../index.html';
      });
    });
  }).catch(function(e) {
    alert('Gagal: ' + e.message);
    btn.disabled = false;
    btn.innerText = 'Hapus Akun';
  });
}
