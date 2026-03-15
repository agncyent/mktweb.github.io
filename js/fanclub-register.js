// =====================
// fanclub-register.js
// =====================
import { db, auth } from "./firebase.js";
import {
    doc, getDoc, setDoc,
    collection, query, where, getDocs, addDoc
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

    // --- TRANSLATE ---
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.addEventListener('change', window.translatePage);

    // Apply bahasa tersimpan
    const savedLang = localStorage.getItem('selectedLang') || 'id';
    if (langSelect) { langSelect.value = savedLang; window.translatePage && window.translatePage(); }

});

// =====================
// TRANSLATE
// =====================
const dict = {
    id: { sub: "Premium Fanclub", lblUser: "Username", lblName: "Nama Lengkap", lblBirth: "Tanggal Lahir", lblCity: "Kota", lblOshi: "✨ Pilih Oshi-mu ✨", btnDaftar: "Daftar", otpTitle: "KODE VERIFIKASI ANDA:", btnVerify: "Verifikasi & Upgrade", list: ["Home","Berita","Jadwal","Member","Setlist","Fanclub","Masuk"] },
    en: { sub: "Premium Fanclub", lblUser: "Username", lblName: "Full Name", lblBirth: "Date of Birth", lblCity: "City", lblOshi: "✨ Pick Your Oshi ✨", btnDaftar: "Register", otpTitle: "YOUR VERIFICATION CODE:", btnVerify: "Verify & Upgrade", list: ["Home","News","Schedule","Member","Setlist","Fanclub","Login"] },
    jp: { sub: "プレミアムファンクラブ", lblUser: "ユーザー名", lblName: "氏名", lblBirth: "生年月日", lblCity: "都市", lblOshi: "推しを選んでください", btnDaftar: "登録", otpTitle: "認証コード", btnVerify: "認証", list: ["Home","ニュース","スケジュール","メンバー","セットリスト","ファンクラブ","ログイン"] },
    my: { sub: "Kelab Peminat Premium", lblUser: "Nama Pengguna", lblName: "Nama Penuh", lblBirth: "Tarikh Lahir", lblCity: "Bandar", lblOshi: "Pilih Oshi Anda", btnDaftar: "Daftar", otpTitle: "KOD PENGESAHAN", btnVerify: "Sahkan", list: ["Home","Berita","Jadual","Ahli","Senarai Lagu","Kelab Peminat","Masuk"] }
};

window.translatePage = function () {
    const langSelect = document.getElementById('langSelect');
    if (!langSelect) return;
    const l = langSelect.value;
    localStorage.setItem('selectedLang', l);
    document.getElementById('subTitle').innerText    = dict[l].sub;
    document.getElementById('lblUser').innerText     = dict[l].lblUser;
    document.getElementById('lblName').innerText     = dict[l].lblName;
    document.getElementById('lblBirth').innerText    = dict[l].lblBirth;
    document.getElementById('lblCity').innerText     = dict[l].lblCity;
    document.getElementById('lblOshi').innerText     = dict[l].lblOshi;
    document.getElementById('btnRequest').innerText  = dict[l].btnDaftar;
    document.getElementById('lblOtpTitle').innerText = dict[l].otpTitle;
    document.getElementById('btnVerify').innerText   = dict[l].btnVerify;
    const spans = document.querySelectorAll('#menuList span');
    dict[l].list.forEach((teks, i) => { if (spans[i]) spans[i].innerText = teks; });
};

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
async function verifyOTP() {
    const input   = document.getElementById('inputOTP')?.value.trim();
    const correct = document.getElementById('generatedOTP')?.innerText.trim();

    if (input !== correct) {
        alert('Kode salah! Cek lagi pelan-pelan.');
        return;
    }

    clearInterval(otpTimer);

    // Ambil data form
    const username  = document.getElementById('username')?.value.trim();
    const fullname  = document.getElementById('fullname')?.value.trim();
    const birthdate = document.getElementById('birthdate')?.value.trim();
    const city      = document.getElementById('city')?.value.trim();
    const email     = document.getElementById('email')?.value.trim();
    const oshi      = document.querySelector('input[name="oshi"]:checked')?.value || '';

    try {
        // Simpan ke Firestore koleksi "fanclub_members"
        await addDoc(collection(db, 'fanclub_members'), {
            username,
            fullname,
            birthdate,
            city,
            email,
            oshi,
            premium:   true,
            joinedAt:  new Date().toISOString()
        });

        // Kalau user sudah login, update koleksi "users" juga
        const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
        const currentUser = getAuth().currentUser;
        if (currentUser) {
            await setDoc(doc(db, 'users', currentUser.uid), {
                username,
                fullname,
                birthdate,
                city,
                email,
                oshi,
                premium: true
            }, { merge: true });
        }

        alert('Selamat! Kamu sekarang Member PREMIUM MKT4X.');
        window.location.href = 'fanclub.html';

    } catch (e) {
        console.error('Gagal simpan data:', e);
        alert('Gagal menyimpan data. Coba lagi!');
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
