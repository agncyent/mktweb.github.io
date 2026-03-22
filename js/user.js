// =====================
// user.js - untuk halaman di subfolder user/
// =====================

document.addEventListener("DOMContentLoaded", function() {
    const prefix = '../';

    fetch(prefix + 'components/navbar.html')
        .then(res => res.text())
        .then(navHtml => {
            const navPlaceholder = document.getElementById('navbar-placeholder');
            if(navPlaceholder) navPlaceholder.innerHTML = navHtml;
            return fetch(prefix + 'components/sidebar.html');
        })
        .then(res => res.text())
        .then(sideHtml => {
            const sidePlaceholder = document.getElementById('sidebar-placeholder');
            if(sidePlaceholder) {
                sidePlaceholder.innerHTML = sideHtml;
                // Fix semua link di sidebar
                sidePlaceholder.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
                        a.setAttribute('href', '../' + href);
                    }
                });
            }
            document.dispatchEvent(new Event('sidebarLoaded'));
            startPage();
        })
        .catch(err => {
            console.error("Gagal muat komponen:", err);
            startPage();
        });

    function startPage() {
        const sidebar    = document.getElementById('sidebar');
        const overlay    = document.getElementById('overlay');
        const menuBtn    = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        if (menuBtn && sidebar && overlay) {
            menuBtn.onclick = () => {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            };
            overlay.onclick = () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            };
        }

        const dict = {
            id: {
                menu_home:    "Beranda",
                menu_news:    "Berita",
                menu_sch:     "Jadwal",
                menu_member:  "Member",
                menu_release: "Rilis",
                menu_fanclub: "Fanclub",
                menu_login:   "Masuk",
                pf_back:       "Kembali",
                pf_title:      "Profil Saya",
                pf_edit_title: "✏️ Edit Profil",
                pf_label_name: "👤 Nama",
                pf_label_oshi: "🎯 Oshi",
                pf_label_city: "📍 Kota",
                pf_label_birth:"🎂 Tanggal Lahir",
                pf_save:       "Simpan Perubahan",
                st_title:       "Pengaturan",
                st_account:     "Account Settings",
                st_email:       "Gmail",
                st_phone:       "No. Telepon",
                st_not_set:     "Belum diisi",
                st_edit:        "Edit",
                st_logout:      "Log Out",
                st_logout_sub:  "Keluar dari akun ini",
                st_switch:      "Ganti Akun",
                st_switch_sub:  "Login dengan akun Google lain",
                st_support_title:"Support",
                st_support:     "Hubungi Support",
                st_about:       "Tentang Website",
                st_about_sub:   "Versi & informasi MKT4X",
                st_privacy:     "Kebijakan Privasi",
                st_privacy_sub: "Cara kami melindungi data kamu",
                st_danger:      "Danger Zone",
                st_delete:      "Hapus Akun",
                st_delete_sub:  "Hapus semua data fanclub kamu",
                st_cancel:      "Batal",
                st_save:        "Simpan",
                st_close:       "Tutup",
                st_about_text:  "MKT4X Virtual+ adalah website resmi fanclub MKT4X. Platform ini dibuat untuk menghubungkan fans dengan konten eksklusif dan informasi terbaru dari MKT4X.",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                pf_back:       "Back",
                pf_title:      "My Profile",
                pf_edit_title: "✏️ Edit Profile",
                pf_label_name: "👤 Name",
                pf_label_oshi: "🎯 Oshi",
                pf_label_city: "📍 City",
                pf_label_birth:"🎂 Date of Birth",
                pf_save:       "Save Changes",
                st_title:       "Settings",
                st_account:     "Account Settings",
                st_email:       "Gmail",
                st_phone:       "Phone Number",
                st_not_set:     "Not set",
                st_edit:        "Edit",
                st_logout:      "Log Out",
                st_logout_sub:  "Sign out of this account",
                st_switch:      "Switch Account",
                st_switch_sub:  "Login with another Google account",
                st_support_title:"Support",
                st_support:     "Contact Support",
                st_about:       "About Website",
                st_about_sub:   "Version & MKT4X info",
                st_privacy:     "Privacy Policy",
                st_privacy_sub: "How we protect your data",
                st_danger:      "Danger Zone",
                st_delete:      "Delete Account",
                st_delete_sub:  "Delete all your fanclub data",
                st_cancel:      "Cancel",
                st_save:        "Save",
                st_close:       "Close",
                st_about_text:  "MKT4X Virtual+ is the official MKT4X fanclub website. This platform was created to connect fans with exclusive content and the latest news from MKT4X.",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                pf_back:       "戻る",
                pf_title:      "マイプロフィール",
                pf_edit_title: "✏️ プロフィール編集",
                pf_label_name: "👤 名前",
                pf_label_oshi: "🎯 推し",
                pf_label_city: "📍 都市",
                pf_label_birth:"🎂 生年月日",
                pf_save:       "変更を保存",
                st_title:       "設定",
                st_account:     "アカウント設定",
                st_email:       "Gmail",
                st_phone:       "電話番号",
                st_not_set:     "未設定",
                st_edit:        "編集",
                st_logout:      "ログアウト",
                st_logout_sub:  "このアカウントからサインアウト",
                st_switch:      "アカウント切替",
                st_switch_sub:  "別のGoogleアカウントでログイン",
                st_support_title:"サポート",
                st_support:     "サポートに連絡",
                st_about:       "ウェブサイトについて",
                st_about_sub:   "バージョン & MKT4X情報",
                st_privacy:     "プライバシーポリシー",
                st_privacy_sub: "データの保護方法",
                st_danger:      "危険ゾーン",
                st_delete:      "アカウント削除",
                st_delete_sub:  "ファンクラブデータをすべて削除",
                st_cancel:      "キャンセル",
                st_save:        "保存",
                st_close:       "閉じる",
                st_about_text:  "MKT4X Virtual+はMKT4X公式ファンクラブウェブサイトです。このプラットフォームはファンと独自コンテンツをつなぐために作られました。",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                pf_back:       "Kembali",
                pf_title:      "Profil Saya",
                pf_edit_title: "✏️ Edit Profil",
                pf_label_name: "👤 Nama",
                pf_label_oshi: "🎯 Oshi",
                pf_label_city: "📍 Bandar",
                pf_label_birth:"🎂 Tarikh Lahir",
                pf_save:       "Simpan Perubahan",
                st_title:       "Tetapan",
                st_account:     "Tetapan Akaun",
                st_email:       "Gmail",
                st_phone:       "No. Telefon",
                st_not_set:     "Belum diisi",
                st_edit:        "Edit",
                st_logout:      "Log Keluar",
                st_logout_sub:  "Keluar dari akaun ini",
                st_switch:      "Tukar Akaun",
                st_switch_sub:  "Log masuk dengan akaun Google lain",
                st_support_title:"Sokongan",
                st_support:     "Hubungi Sokongan",
                st_about:       "Tentang Laman Web",
                st_about_sub:   "Versi & maklumat MKT4X",
                st_privacy:     "Dasar Privasi",
                st_privacy_sub: "Cara kami melindungi data anda",
                st_danger:      "Zon Bahaya",
                st_delete:      "Padam Akaun",
                st_delete_sub:  "Padam semua data kelab peminat anda",
                st_cancel:      "Batal",
                st_save:        "Simpan",
                st_close:       "Tutup",
                st_about_text:  "MKT4X Virtual+ ialah laman web rasmi kelab peminat MKT4X. Platform ini dibina untuk menghubungkan peminat dengan kandungan eksklusif dan berita terkini dari MKT4X.",
            }
        };

        window.applyLanguage = function(lang) {
            localStorage.setItem('selectedLang', lang);
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (dict[lang] && dict[lang][key]) {
                    el.innerText = dict[lang][key];
                }
            });
        };

        if (langSelect) {
            langSelect.onchange = function() { applyLanguage(this.value); };
            const savedLang = localStorage.getItem('selectedLang') || 'id';
            langSelect.value = savedLang;
            applyLanguage(savedLang);
        } else {
            applyLanguage(localStorage.getItem('selectedLang') || 'id');
        }
    }
});
