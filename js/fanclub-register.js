// =====================
// fanclub-register.js
// =====================
import { db, auth } from "./firebase.js";
import {
    doc, getDoc, setDoc,
    collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let otpTimer;

// =====================
// IKAT SEMUA EVENT SETELAH DOM SIAP
// =====================
document.addEventListener('DOMContentLoaded', function () {

    // --- OSHI SELECTION ---
    document.querySelectorAll('.oshi-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.oshi-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // --- TOMBOL DAFTAR ---
    const btnRequest = document.getElementById('btnRequest');
    if (btnRequest) btnRequest.addEventListener('click', requestOTP);

    // --- TOMBOL VERIFIKASI ---
    const btnVerify = document.getElementById('btnVerify');
    if (btnVerify) btnVerify.addEventListener('click', verifyOTP);

    // --- BUKA LOGIN MODAL ---
    const btnOpenLogin = document.getElementById('btnOpenLogin');
    if (btnOpenLogin) btnOpenLogin.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
    });

    // --- TUTUP LOGIN MODAL ---
    const btnCloseLogin = document.getElementById('btnCloseLogin');
    if (btnCloseLogin) btnCloseLogin.addEventListener('click', closeLoginModal);

    // --- SUBMIT LOGIN ---
    const btnSubmitLogin = document.getElementById('btnSubmitLogin');
    if (btnSubmitLogin) btnSubmitLogin.addEventListener('click', submitLogin);

    // --- ENTER di input OTP ---
    const inputOTP = document.getElementById('inputOTP');
    if (inputOTP) inputOTP.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') verifyOTP();
    });

    // --- ENTER di login email ---
    const loginEmailInput = document.getElementById('loginEmailInput');
    if (loginEmailInput) loginEmailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') submitLogin();
    });

});

// =====================
// REQUEST OTP / DAFTAR
// =====================
function requestOTP() {
    const fields = ['username', 'fullname', 'birthdate', 'city', 'email'];
    const isFormValid = fields.every(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== '';
    });
    const isOshiSelected = document.querySelector('input[name="oshi"]:checked');

    if (!isFormValid || !isOshiSelected) {
        alert('Isi dulu semua form dan pilih oshi kamu!');
        return;
    }

    document.getElementById('btnRequest').style.display  = 'none';
    document.getElementById('otpSection').style.display  = 'block';

    const code = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('generatedOTP').innerText = code;

    let seconds = 60;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.innerText = `Sisa waktu: ${seconds} detik`;

    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
        seconds--;
        if (timerEl) timerEl.innerText = `Sisa waktu: ${seconds} detik`;
        if (seconds <= 0) {
            clearInterval(otpTimer);
            alert('Waktu habis! Silakan minta kode baru.');
            location.reload();
        }
    }, 1000);
}

// =====================
// VERIFY OTP
// =====================
function verifyOTP() {
    const input   = document.getElementById('inputOTP')?.value.trim();
    const correct = document.getElementById('generatedOTP')?.innerText.trim();

    if (input === correct) {
        clearInterval(otpTimer);
        alert('Selamat! Kamu sekarang Member PREMIUM MKT4X.');
        window.location.href = 'fanclub.html';
    } else {
        alert('Kode salah! Cek lagi pelan-pelan.');
    }
}

// =====================
// LOGIN MODAL
// =====================
function openLoginModal() {
    const modal = document.getElementById('loginModalBg');
    const input = document.getElementById('loginEmailInput');
    const err   = document.getElementById('loginError');
    if (modal) modal.classList.add('active');
    if (input) input.value = '';
    if (err)   err.style.display = 'none';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModalBg');
    if (modal) modal.classList.remove('active');
}

async function submitLogin() {
    const emailEl = document.getElementById('loginEmailInput');
    const errEl   = document.getElementById('loginError');
    if (!emailEl || !errEl) return;

    const email = emailEl.value.trim();
    errEl.style.display = 'none';

    if (!email) {
        errEl.innerText = 'Masukkan email kamu dulu!';
        errEl.style.display = 'block';
        return;
    }

    try {
        const q    = query(collection(db, 'users'), where('email', '==', email));
        const snap = await getDocs(q);

        if (snap.empty) {
            errEl.innerText = 'Email belum terdaftar. Silakan daftar dulu!';
            errEl.style.display = 'block';
        } else {
            closeLoginModal();
            window.location.href = 'login.html';
        }
    } catch (e) {
        console.error(e);
        errEl.innerText = 'Terjadi kesalahan. Coba lagi.';
        errEl.style.display = 'block';
    }
}

// =====================
// AUTH STATE
// =====================
onAuthStateChanged(auth, async (user) => {
    const authBtn          = document.getElementById('authBtn');
    const authText         = document.getElementById('authText');
    const profileContainer = document.getElementById('profileContainer');
    const profilePic       = document.getElementById('profilePic');
    const profileName      = document.getElementById('profileName');
    const verifiedBadge    = document.getElementById('verifiedBadge');

    if (user) {
        if (authText)  authText.innerText  = 'Keluar';
        if (authBtn)   authBtn.onclick = (e) => { e.preventDefault(); window.logout && window.logout(); };
        if (profilePic)  profilePic.src          = user.photoURL || 'assets/default-avatar.png';
        if (profileName) profileName.innerText    = user.displayName || user.email;
        if (verifiedBadge) verifiedBadge.style.display = 'block';
        if (profileContainer) profileContainer.style.display = 'block';

        try {
            const snap   = await getDoc(doc(db, 'users', user.uid));
            const statusEl = document.getElementById('user-status');
            if (snap.exists() && statusEl) {
                statusEl.innerHTML = snap.data().premium
                    ? "<span style='color:gold;font-weight:700;'>★ Premium Member</span>"
                    : "<span style='color:#7abf9a;'>Basic Fan</span>";
            }
        } catch (e) { console.error(e); }

    } else {
        if (authText)  authText.innerText  = 'Masuk';
        if (authBtn)   authBtn.removeAttribute('onclick');
        if (verifiedBadge)    verifiedBadge.style.display    = 'none';
        if (profileContainer) profileContainer.style.display = 'none';
    }
});
