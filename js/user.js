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
              
