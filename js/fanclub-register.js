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

// =====================
// TUNGGU DOM SIAP
// =====================
function init() {

    // =====================
    // TOGGLE SIDEBAR
    // =====================
    window.toggleMenu = function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    };

    // =====================
    // OSHI SELECTION — pakai event delegation biar aman
    // =====================
    document.addEventListener('click', function (e) {
        const oshiItem = e.target.closest('.oshi-item');
        if (!oshiItem) return;
        document.querySelectorAll('.oshi-item').forEach(i => i.classList.remove('selected'));
        oshiItem.classList.add('selected');
        const radio = oshiItem.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
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
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('subTitle', dict[l].sub);
        set('lblUser',  dict[l].lblUser);
        set('lblName',  dict[l].lblName);
        set('lblBirth', dict[l].lblBirth);
        set('lblCity',  dict[l].lblCity);
        set('lblOshi',  dict[l].lblOshi);
        set('btnRequest', dict[l].btnDaftar);
        set('lblOtpTitle', dict[l].otpTitle);
        set('btnVerify', dict[l].btnVerify);
        const spans = document.querySelectorAll('#menuList span');
        dict[l].list.forEach((teks, i) => { if (spans[i]) spans[i].innerText = teks; });
    };

    // =====================
    // OTP / DAFTAR
    // =====================
    let otpTimer;

    window.requestOTP = function () {
        const requiredFields = ["username", "fullname", "birthdate", "city", "email"];
        const isFormValid = requiredFields.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== "";
        });
        const isOshiSelected = document.querySelector('input[name="oshi"]:checked');

        if (!isFormValid || !isOshiSelected) {
            alert("Isi dulu semua formatnya dan pilih oshi kamu!");
            return;
        }

        const btnRequest  = document.getElementById('btnRequest');
        const otpSection  = document.getElementById('otpSection');
        const generatedOTP = document.getElementById('generatedOTP');
        const timerEl     = document.getElementById('timer');

        if (btnRequest)   btnRequest.style.display  = 'none';
        if (otpSection)   otpSection.style.display   = 'block';

        const code = Math.floor(100000 + Math.random() * 900000);
        if (generatedOTP) generatedOTP.innerText = code;

        let seconds = 60;
        if (timerEl) timerEl.innerText = `Sisa waktu: ${seconds} detik`;
        clearInterval(otpTimer);
        otpTimer = setInterval(() => {
            seconds--;
            if (timerEl) timerEl.innerText = `Sisa waktu: ${seconds} detik`;
            if (seconds <= 0) {
                clearInterval(otpTimer);
                alert("Waktu habis! Silakan minta kode baru.");
                location.reload();
            }
        }, 1000);
    };

    window.verifyOTP = function () {
        const inputEl  = document.getElementById('inputOTP');
        const otpEl    = document.getElementById('generatedOTP');
        if (!inputEl || !otpEl) return;

        const input   = inputEl.value.trim();
        const correct = otpEl.innerText.trim();

        if (input === correct) {
            clearInterval(otpTimer);
            alert("Selamat! Kamu sekarang Member PREMIUM MKT4X.");
            window.location.href = "fanclub.html";
        } else {
            alert("Kode salah! Cek lagi pelan-pelan.");
        }
    };

    // =====================
    // LOGIN MODAL
    // =====================
    window.openLoginModal = function () {
        const modal = document.getElementById('loginModalBg');
        const input = document.getElementById('loginEmailInput');
        const err   = document.getElementById('loginError');
        if (modal) modal.classList.add('active');
        if (input) input.value = '';
        if (err)   err.style.display = 'none';
    };

    window.closeLoginModal = function () {
        const modal = document.getElementById('loginModalBg');
        if (modal) modal.classList.remove('active');
    };

    window.submitLogin = async function () {
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
            const q    = query(collection(db, "users"), where("email", "==", email));
            const snap = await getDocs(q);

            if (snap.empty) {
                errEl.innerText = 'Email belum terdaftar. Silakan daftar dulu!';
                errEl.style.display = 'block';
            } else {
                window.closeLoginModal();
                window.location.href = "login.html";
            }
        } catch (e) {
            console.error(e);
            errEl.innerText = 'Terjadi kesalahan. Coba lagi.';
            errEl.style.display = 'block';
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
            if (authText) authText.innerText = 'Keluar';
            if (authBtn)  authBtn.onclick = (e) => { e.preventDefault(); window.logout(); };
            if (profilePic)  profilePic.src         = user.photoURL || 'assets/default-avatar.png';
            if (profileName) profileName.innerText   = user.displayName || user.email;
            if (verifiedBadge) verifiedBadge.style.display = 'block';
            if (profileContainer) profileContainer.style.display = 'block';

            // Ambil status premium
            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                const statusEl = document.getElementById('user-status');
                if (snap.exists() && statusEl) {
                    statusEl.innerHTML = snap.data().premium
                        ? "<span style='color:gold;font-weight:700;'>★ Premium Member</span>"
                        : "<span style='color:#7abf9a;'>Basic Fan</span>";
                }
            } catch (e) { console.error(e); }

        } else {
            if (authText) authText.innerText = 'Masuk';
            if (authBtn)  authBtn.removeAttribute('onclick');
            if (verifiedBadge) verifiedBadge.style.display = 'none';
            if (profileContainer) profileContainer.style.display = 'none';
        }
    });

} // end init()

// =====================
// JALANKAN SETELAH DOM SIAP
// =====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
