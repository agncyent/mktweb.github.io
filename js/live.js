// =====================
// live.js - untuk halaman di subfolder live/
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
                lv_title:     "🎥 Riwayat Live",
                lv_sub:       "Rekap semua sesi live MKT4X",
                lv_member:    "Nama Member",
                lv_viewers:   "Penonton",
                lv_start:     "Mulai Live",
                lv_end:       "Selesai Live",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                lv_title:     "🎥 Live History",
                lv_sub:       "Recap of all MKT4X live sessions",
                lv_member:    "Member Name",
                lv_viewers:   "Viewers",
                lv_start:     "Live Start",
                lv_end:       "Live End",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                lv_title:     "🎥 ライブ履歴",
                lv_sub:       "MKT4Xのすべてのライブセッションの記録",
                lv_member:    "メンバー名",
                lv_viewers:   "視聴者数",
                lv_start:     "開始時間",
                lv_end:       "終了時間",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                lv_title:     "🎥 Sejarah Live",
                lv_sub:       "Rekap semua sesi live MKT4X",
                lv_member:    "Nama Ahli",
                lv_viewers:   "Penonton",
                lv_start:     "Mula Live",
                lv_end:       "Tamat Live",
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
              
