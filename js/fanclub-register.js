// =====================
// fanclub-register.js
// =====================
import { db, auth } from "./firebase.js";
import {
    doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// =====================
// TOGGLE SIDEBAR
// =====================
window.toggleMenu = function () {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
};

// =====================
// OSHI SELECTION
// =====================
document.querySelectorAll('.oshi-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.oshi-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        this.querySelector('input').checked = true;
    });
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
    const l = document.getElementById('langSelect').value;
    document.getElementById('subTitle').innerText = dict[l].sub;
    document.getElementById('lblUser').innerText = dict[l].lblUser;
    document.getElementById('lblName').innerText = dict[l].lblName;
    document.getElementById('lblBirth').innerText = dict[l].lblBirth;
    document.getElementById('lblCity').innerText = dict[l].lblCity;
    document.getElementById('lblOshi').innerText = dict[l].lblOshi;
    document.getElementById('btnRequest').innerText = dict[l].btnDaftar;
    document.getElementById('lblOtpTitle').innerText = dict[l].otpTitle;
    document.getElementById('btnVerify').innerText = dict[l].btnVerify;
    const spans = document.querySelectorAll('#menuList span');
    dict[l].list.forEach((teks, i) => { if (spans[i]) spans[i].innerText = teks; });
};

// =====================
// OTP / DAFTAR
// =====================
let otpTimer;

window.requestOTP = function () {
    const requiredFields = ["username", "fullname", "birthdate", "city", "email"];
    const isFormValid = requiredFields.every(id => document.getElementById(id).value.trim() !== "");
    const isOshiSelected = document.querySelector('input[name="oshi"]:checked');

    if (!isFormValid || !isOshiSelected) {
        alert("Isi dulu semua formatnya, jangan ada yang kosong!");
        return;
    }

    document.getElementById('btnRequest').style.display = 'none';
    document.getElementById('otpSection').style.display = 'block';

    const code = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('generatedOTP').innerText = code;

    let seconds = 60;
    document.getElementById('timer').innerText = `Sisa waktu: ${seconds} detik`;
    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
        seconds--;
        document.getElementById('timer').innerText = `Sisa waktu: ${seconds} detik`;
        if (seconds <= 0) {
            clearInterval(otpTimer);
            alert("Waktu habis! Silakan minta kode baru.");
            location.reload();
        }
    }, 1000);
};

window.verifyOTP = function () {
    const input = document.getElementById('inputOTP').value;
    const correct = document.getElementById('generatedOTP').innerText;

    if (input === correct) {
        clearInterval(otpTimer);
        alert("Selamat! Kamu sekarang Member PREMIUM MKT4X.");
        window.location.href = "fanclub.html";
    } else {
        alert("Kode salah! Cek lagi pelan-pelan.");
    }
};

// =====================
// EDIT PROFILE (SIDEBAR)
// =====================
window.editProfile = function () {
    const newName = prompt("Masukkan nama baru:", document.getElementById('profileName').innerText);
    if (newName) {
        document.getElementById('profileName').innerText = newName;
        alert("Nama berhasil diperbarui!");
    }
};

// =====================
// LOGIN MODAL - CEK FIRESTORE
// =====================
window.openLoginModal = function () {
    document.getElementById('loginModalBg').classList.add('active');
    document.getElementById('loginEmailInput').value = '';
    document.getElementById('loginError').style.display = 'none';
};

window.closeLoginModal = function () {
    document.getElementById('loginModalBg').classList.remove('active');
};

window.submitLogin = async function () {
    const email = document.getElementById('loginEmailInput').value.trim();
    const errEl = document.getElementById('loginError');
    errEl.style.display = 'none';

    if (!email) {
        errEl.innerText = 'Masukkan email kamu dulu!';
        errEl.style.display = 'block';
        return;
    }

    // Cek apakah email terdaftar di Firestore (koleksi "users")
    try {
        const usersRef = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const { collection, query, where, getDocs } = usersRef;

        const q = query(collection(db, "users"), where("email", "==", email));
        const snap = await getDocs(q);

        if (snap.empty) {
            // Email tidak terdaftar
            errEl.innerText = 'Email belum terdaftar. Silakan daftar dulu!';
            errEl.style.display = 'block';
        } else {
            // Email terdaftar, arahkan ke login Google
            closeLoginModal();
            window.location.href = "login.html";
        }
    } catch (e) {
        console.error(e);
        errEl.innerText = 'Terjadi kesalahan. Coba lagi.';
        errEl.style.display = 'block';
    }
};

// =====================
// AUTH STATE (sidebar profile)
// =====================
onAuthStateChanged(auth, async (user) => {
    const authBtn  = document.getElementById('authBtn');
    const authText = document.getElementById('authText');
    const profileContainer = document.getElementById('profileContainer');

    if (user) {
        if (authText) authText.innerText = 'Keluar';
        if (authBtn)  authBtn.onclick = () => window.logout();
        if (document.getElementById('profilePic'))  document.getElementById('profilePic').src = user.photoURL || 'assets/default-avatar.png';
        if (document.getElementById('profileName')) document.getElementById('profileName').innerText = user.displayName || user.email;
        // Tambah badge verified di bawah nama
        const existingBadge = document.getElementById('verifiedBadge');
        if (!existingBadge && document.getElementById('profileName')) {
            const badge = document.createElement('div');
            badge.id = 'verifiedBadge';
            badge.innerHTML = '✅ <span style="font-size:0.75rem;font-weight:700;color:#2E7D32;">Verified</span>';
            badge.style.cssText = 'margin-top:4px;font-size:0.75rem;';
            document.getElementById('profileName').insertAdjacentElement('afterend', badge);
        }
        if (profileContainer) profileContainer.style.display = 'block';
    } else {
        if (authText) authText.innerText = 'Masuk';
        if (authBtn)  authBtn.onclick = () => window.location.href = 'login.html';
        if (profileContainer) profileContainer.style.display = 'none';
    }
});

