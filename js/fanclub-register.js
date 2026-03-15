// =====================
// EMERGENCY FIX - TARUH PALING ATAS
// =====================
// Fix 1: Define translatePage immediately
window.translatePage = window.translatePage || function() {
    console.log('Translate page called (early definition)');
    const langSelect = document.getElementById('langSelect');
    if (!langSelect) return;
    const l = langSelect.value || 'id';
    
    // Simple fallback translation
    const simpleDict = {
        id: { 
            sub: "Premium Fanclub", 
            lblUser: "Username", 
            lblName: "Nama Lengkap", 
            lblBirth: "Tanggal Lahir", 
            lblCity: "Kota", 
            lblOshi: "✨ Pilih Oshi-mu ✨", 
            btnDaftar: "Daftar", 
            otpTitle: "KODE VERIFIKASI ANDA:", 
            btnVerify: "Verifikasi & Upgrade",
            list: ["Home","Berita","Jadwal","Member","Setlist","Fanclub","Masuk"]
        },
        en: { 
            sub: "Premium Fanclub", 
            lblUser: "Username", 
            lblName: "Full Name", 
            lblBirth: "Date of Birth", 
            lblCity: "City", 
            lblOshi: "✨ Pick Your Oshi ✨", 
            btnDaftar: "Register", 
            otpTitle: "YOUR VERIFICATION CODE:", 
            btnVerify: "Verify & Upgrade",
            list: ["Home","News","Schedule","Member","Setlist","Fanclub","Login"]
        },
        jp: { 
            sub: "プレミアムファンクラブ", 
            lblUser: "ユーザー名", 
            lblName: "氏名", 
            lblBirth: "生年月日", 
            lblCity: "都市", 
            lblOshi: "推しを選んでください", 
            btnDaftar: "登録", 
            otpTitle: "認証コード", 
            btnVerify: "認証",
            list: ["Home","ニュース","スケジュール","メンバー","セットリスト","ファンクラブ","ログイン"]
        },
        my: { 
            sub: "Kelab Peminat Premium", 
            lblUser: "Nama Pengguna", 
            lblName: "Nama Penuh", 
            lblBirth: "Tarikh Lahir", 
            lblCity: "Bandar", 
            lblOshi: "Pilih Oshi Anda", 
            btnDaftar: "Daftar", 
            otpTitle: "KOD PENGESAHAN", 
            btnVerify: "Sahkan",
            list: ["Home","Berita","Jadual","Ahli","Senarai Lagu","Kelab Peminat","Masuk"]
        }
    };
    
    const texts = simpleDict[l] || simpleDict.id;
    
    // Safe update - check if elements exist
    const elements = {
        'subTitle': texts.sub,
        'lblUser': texts.lblUser,
        'lblName': texts.lblName,
        'lblBirth': texts.lblBirth,
        'lblCity': texts.lblCity,
        'lblOshi': texts.lblOshi,
        'btnRequest': texts.btnDaftar,
        'lblOtpTitle': texts.otpTitle,
        'btnVerify': texts.btnVerify
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    });

    // Update menu list
    const spans = document.querySelectorAll('#menuList span');
    if (spans.length) {
        texts.list.forEach((teks, i) => { 
            if (spans[i]) spans[i].innerText = teks; 
        });
    }
};

// Fix 2: Define logout function
window.logout = window.logout || function() {
    console.log('Logout called');
    // Try to use existing auth if available
    if (window.auth && window.signOut) {
        window.signOut(window.auth).then(() => {
            window.location.href = 'index.html';
        }).catch(console.error);
    } else {
        // Fallback - just redirect
        window.location.href = 'index.html';
    }
};

// Fix 3: Wrap all code in try-catch to prevent total failure
try {
    // Store original DOMContentLoaded
    const originalAddEventListener = document.addEventListener;
    
    // Wrap DOMContentLoaded to catch errors
    document.addEventListener = function(type, listener, options) {
        if (type === 'DOMContentLoaded') {
            const wrappedListener = function() {
                try {
                    listener.apply(this, arguments);
                } catch (e) {
                    console.error('Error in DOMContentLoaded:', e);
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
} catch (e) {
    console.error('Emergency fix setup error:', e);
}

// =====================
// KODE ASLI KAMU (TIDAK DIUBAH)
// =====================
import { db, auth } from "./firebase.js";
import {
    doc, getDoc, setDoc,
    collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let otpTimer;

// =====================
// IKAT SEMUA EVENT SETELAH DOM SIAP
// =====================
document.addEventListener('DOMContentLoaded', function () {

    console.log('DOM Content Loaded - Memasang event listeners...');

    // --- OSHI SELECTION ---
    const oshiItems = document.querySelectorAll('.oshi-item');
    console.log('Oshi items ditemukan:', oshiItems.length);
    
    oshiItems.forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.oshi-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            console.log('Oshi dipilih:', this.textContent.trim());
        });
    });

    // --- TOMBOL DAFTAR ---
    const btnRequest = document.getElementById('btnRequest');
    if (btnRequest) {
        btnRequest.addEventListener('click', requestOTP);
        console.log('Event listener DAFTAR dipasang');
    } else {
        console.warn('Tombol DAFTAR (btnRequest) tidak ditemukan!');
    }

    // --- TOMBOL VERIFIKASI ---
    const btnVerify = document.getElementById('btnVerify');
    if (btnVerify) {
        btnVerify.addEventListener('click', verifyOTP);
        console.log('Event listener VERIFIKASI dipasang');
    }

    // --- BUKA LOGIN MODAL ---
    const btnOpenLogin = document.getElementById('btnOpenLogin');
    if (btnOpenLogin) {
        btnOpenLogin.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
        console.log('Event listener LOGIN LINK dipasang');
    } else {
        console.warn('Link LOGIN (btnOpenLogin) tidak ditemukan!');
    }

    // --- TUTUP LOGIN MODAL ---
    const btnCloseLogin = document.getElementById('btnCloseLogin');
    if (btnCloseLogin) {
        btnCloseLogin.addEventListener('click', closeLoginModal);
        console.log('Event listener CLOSE MODAL dipasang');
    }

    // --- SUBMIT LOGIN ---
    const btnSubmitLogin = document.getElementById('btnSubmitLogin');
    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener('click', submitLogin);
        console.log('Event listener SUBMIT LOGIN dipasang');
    }

    // --- ENTER di input OTP ---
    const inputOTP = document.getElementById('inputOTP');
    if (inputOTP) {
        inputOTP.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') verifyOTP();
        });
        console.log('Event listener ENTER OTP dipasang');
    }

    // --- ENTER di login email ---
    const loginEmailInput = document.getElementById('loginEmailInput');
    if (loginEmailInput) {
        loginEmailInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') submitLogin();
        });
        console.log('Event listener ENTER LOGIN dipasang');
    }

    // --- TRANSLATE ---
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', window.translatePage);
        console.log('Event listener TRANSLATE dipasang');
    }

    // Apply bahasa tersimpan
    const savedLang = localStorage.getItem('selectedLang') || 'id';
    if (langSelect) { 
        langSelect.value = savedLang; 
        if (window.translatePage) {
            window.translatePage();
        }
    }

    console.log('Semua event listener selesai dipasang!');
});

// =====================
// TRANSLATE (ORIGINAL - OVERRIDE EMERGENCY FIX)
// =====================
const dict = {
    id: { sub: "Premium Fanclub", lblUser: "Username", lblName: "Nama Lengkap", lblBirth: "Tanggal Lahir", lblCity: "Kota", lblOshi: "✨ Pilih Oshi-mu ✨", btnDaftar: "Daftar", otpTitle: "KODE VERIFIKASI ANDA:", btnVerify: "Verifikasi & Upgrade", list: ["Home","Berita","Jadwal","Member","Setlist","Fanclub","Masuk"] },
    en: { sub: "Premium Fanclub", lblUser: "Username", lblName: "Full Name", lblBirth: "Date of Birth", lblCity: "City", lblOshi: "✨ Pick Your Oshi ✨", btnDaftar: "Register", otpTitle: "YOUR VERIFICATION CODE:", btnVerify: "Verify & Upgrade", list: ["Home","News","Schedule","Member","Setlist","Fanclub","Login"] },
    jp: { sub: "プレミアムファンクラブ", lblUser: "ユーザー名", lblName: "氏名", lblBirth: "生年月日", lblCity: "都市", lblOshi: "推しを選んでください", btnDaftar: "登録", otpTitle: "認証コード", btnVerify: "認証", list: ["Home","ニュース","スケジュール","メンバー","セットリスト","ファンクラブ","ログイン"] },
    my: { sub: "Kelab Peminat Premium", lblUser: "Nama Pengguna", lblName: "Nama Penuh", lblBirth: "Tarikh Lahir", lblCity: "Bandar", lblOshi: "Pilih Oshi Anda", btnDaftar: "Daftar", otpTitle: "KOD PENGESAHAN", btnVerify: "Sahkan", list: ["Home","Berita","Jadual","Ahli","Senarai Lagu","Kelab Peminat","Masuk"] }
};

// Override emergency fix dengan versi lengkap
window.translatePage = function () {
    console.log('Translate page called (full version)');
    const langSelect = document.getElementById('langSelect');
    if (!langSelect) return;
    const l = langSelect.value;
    localStorage.setItem('selectedLang', l);
    
    // Update elements
    const elements = {
        'subTitle': dict[l].sub,
        'lblUser': dict[l].lblUser,
        'lblName': dict[l].lblName,
        'lblBirth': dict[l].lblBirth,
        'lblCity': dict[l].lblCity,
        'lblOshi': dict[l].lblOshi,
        'btnRequest': dict[l].btnDaftar,
        'lblOtpTitle': dict[l].otpTitle,
        'btnVerify': dict[l].btnVerify
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    });
    
    const spans = document.querySelectorAll('#menuList span');
    dict[l].list.forEach((teks, i) => { if (spans[i]) spans[i].innerText = teks; });
};

// =====================
// REQUEST OTP / DAFTAR
// =====================
function requestOTP() {
    console.log('requestOTP dipanggil');
    
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

    document.getElementById('btnRequest').style.display = 'none';
    document.getElementById('otpSection').style.display = 'block';

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
            // Better than location.reload() - just reset form
            document.getElementById('btnRequest').style.display = 'block';
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('inputOTP').value = '';
        }
    }, 1000);
}

// =====================
// VERIFY OTP
// =====================
function verifyOTP() {
    console.log('verifyOTP dipanggil');
    
    const input = document.getElementById('inputOTP')?.value.trim();
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
    console.log('openLoginModal dipanggil');
    
    const modal = document.getElementById('loginModalBg');
    const input = document.getElementById('loginEmailInput');
    const err = document.getElementById('loginError');
    if (modal) modal.classList.add('active');
    if (input) input.value = '';
    if (err) err.style.display = 'none';
}

function closeLoginModal() {
    console.log('closeLoginModal dipanggil');
    
    const modal = document.getElementById('loginModalBg');
    if (modal) modal.classList.remove('active');
}

async function submitLogin() {
    console.log('submitLogin dipanggil');
    
    const emailEl = document.getElementById('loginEmailInput');
    const errEl = document.getElementById('loginError');
    if (!emailEl || !errEl) return;

    const email = emailEl.value.trim();
    errEl.style.display = 'none';

    if (!email) {
        errEl.innerText = 'Masukkan email kamu dulu!';
        errEl.style.display = 'block';
        return;
    }

    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snap = await getDocs(q);

        if (snap.empty) {
            errEl.innerText = 'Email belum terdaftar. Silakan daftar dulu!';
            errEl.style.display = 'block';
        } else {
            closeLoginModal();
            window.location.href = 'login.html';
        }
    } catch (e) {
        console.error('Login error:', e);
        errEl.innerText = 'Terjadi kesalahan. Coba lagi.';
        errEl.style.display = 'block';
    }
}

// =====================
// AUTH STATE
// =====================
onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
    
    const authBtn = document.getElementById('authBtn');
    const authText = document.getElementById('authText');
    const profileContainer = document.getElementById('profileContainer');
    const profilePic = document.getElementById('profilePic');
    const profileName = document.getElementById('profileName');
    const verifiedBadge = document.getElementById('verifiedBadge');

    if (user) {
        if (authText) authText.innerText = 'Keluar';
        if (authBtn) {
            authBtn.onclick = (e) => { 
                e.preventDefault(); 
                signOut(auth).then(() => {
                    window.location.href = 'index.html';
                }).catch(console.error);
            };
        }
        if (profilePic) profilePic.src = user.photoURL || 'assets/default-avatar.png';
        if (profileName) profileName.innerText = user.displayName || user.email;
        if (verifiedBadge) verifiedBadge.style.display = 'block';
        if (profileContainer) profileContainer.style.display = 'block';

        try {
            const snap = await getDoc(doc(db, 'users', user.uid));
            const statusEl = document.getElementById('user-status');
            if (snap.exists() && statusEl) {
                statusEl.innerHTML = snap.data().premium
                    ? "<span style='color:gold;font-weight:700;'>★ Premium Member</span>"
                    : "<span style='color:#7abf9a;'>Basic Fan</span>";
            }
        } catch (e) { console.error('Error fetching user status:', e); }

    } else {
        if (authText) authText.innerText = 'Masuk';
        if (authBtn) authBtn.onclick = null;
        if (verifiedBadge) verifiedBadge.style.display = 'none';
        if (profileContainer) profileContainer.style.display = 'none';
    }
});

console.log('File fanclub-register.js selesai diload');
