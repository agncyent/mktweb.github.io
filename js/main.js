document.addEventListener("DOMContentLoaded", function() {
    const isSub = window.location.pathname.includes('/members/');
    const prefix = isSub ? '../' : '';

    // 1. LOAD KOMPONEN (NAVBAR & SIDEBAR)
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
            if(sidePlaceholder) sidePlaceholder.innerHTML = sideHtml;

            // ← Beritahu auth.js bahwa sidebar sudah siap di DOM
            document.dispatchEvent(new Event('sidebarLoaded'));

            startMKT4X();
        })
        .catch(err => {
            console.error("Gagal muat komponen:", err);
            startMKT4X();
        });

    function startMKT4X() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        // Toggle Sidebar
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

        // 2. KAMUS BAHASA
        const dict = {
            id: {
                menu_home:    "Beranda",
                menu_news:    "Berita",
                menu_sch:     "Jadwal",
                menu_member:  "Member",
                menu_release: "Rilis",
                menu_fanclub: "Fanclub",
                menu_login:   "Masuk",
                txt_member_title: "MEMBER",
                txt_gen:          "Member MKT4X Generasi ke-1",
                news_title:    "BERITA",
                news_sub:      "PEMBARUAN MKT4X",
                btn_more:      "LIHAT LAGI",
                sch_title:     "JADWAL",
                release_title: "RILIS",
                yt_label:      "YOUTUBE RESMI",
                member_title:  "MEMBER",
                btn_all_member:"Lihat Semua Member →",
                hero_badge:    "MKT4X SINGLE KE-1",
                hero_sub:      "Lagu tentang bintang dan mimpi",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                txt_member_title: "MEMBERS",
                txt_gen:          "MKT4X 1st Generation Members",
                news_title:    "News",
                news_sub:      "MKT4X UPDATE",
                btn_more:      "VIEW MORE",
                sch_title:     "Schedule",
                release_title: "Release",
                yt_label:      "OFFICIAL YOUTUBE",
                member_title:  "Member",
                btn_all_member:"See All Members →",
                hero_badge:    "MKT4X 1ST SINGLE",
                hero_sub:      "A song about stars and dreams",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                txt_member_title: "メンバー",
                txt_gen:          "MKT4X 第1期生メンバー",
                news_title:    "ニュース",
                news_sub:      "MKT4X 更新情報",
                btn_more:      "もっと見る",
                sch_title:     "スケジュール",
                release_title: "リリース",
                yt_label:      "公式YouTube",
                member_title:  "メンバー",
                btn_all_member:"全メンバーを見る →",
                hero_badge:    "MKT4X シングル第1弾",
                hero_sub:      "星と夢についての歌",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                txt_member_title: "AHLI",
                txt_gen:          "Ahli Generasi Pertama MKT4X",
                news_title:    "Berita",
                news_sub:      "KEMASKINI MKT4X",
                btn_more:      "LIHAT LAGI",
                sch_title:     "Jadual",
                release_title: "Siaran",
                yt_label:      "YOUTUBE RASMI",
                member_title:  "Ahli",
                btn_all_member:"Lihat Semua Ahli →",
                hero_badge:    "SINGLE PERTAMA MKT4X",
                hero_sub:      "Lagu tentang bintang dan mimpi",
            }
        };

        // 3. FUNGSI UPDATE TEKS
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
            langSelect.onchange = function() {
                applyLanguage(this.value);
            };
            const savedLang = localStorage.getItem('selectedLang') || 'id';
            langSelect.value = savedLang;
            applyLanguage(savedLang);
        } else {
            const savedLang = localStorage.getItem('selectedLang') || 'id';
            applyLanguage(savedLang);
        }

        // 4. SLIDER
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let cur = 0;
            setInterval(() => {
                slides[cur].style.display = 'none';
                cur = (cur + 1) % slides.length;
                slides[cur].style.display = 'block';
            }, 3000);
        }
    }
});
