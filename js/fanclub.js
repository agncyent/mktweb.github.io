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
                // Fanclub
                fc_badge:        "✨ MKT4X OFFICIAL FANCLUB ✨",
                fc_title:        "MKT4X Official Fanclub",
                fc_sub:          "Bergabung dengan Komunitas Resmi",
                fc_join_now:     "Daftar Sekarang 💚",
                fc_about_title:  "Tentang Fanclub",
                fc_about_desc:   "MKT4X Official Fanclub adalah komunitas resmi untuk mendapatkan konten eksklusif dan berita terbaru dari MKT4X. Bergabunglah bersama ribuan fans di seluruh Indonesia!",
                fc_benefit_title:"Benefit Member",
                fc_b1_title:     "Foto Eksklusif",
                fc_b1_desc:      "Foto spesial hanya untuk member",
                fc_b2_title:     "Berita Terbaru",
                fc_b2_desc:      "Informasi terbaru lebih cepat",
                fc_b3_title:     "Akses Komunitas",
                fc_b3_desc:      "Bergabung dengan fans MKT4X",
                fc_b4_title:     "Event Spesial",
                fc_b4_desc:      "Event dan live eksklusif",
                fc_cta_title:    "Gabung Fanclub MKT4X",
                fc_cta_sub:      "⭐ Jadilah bagian dari keluarga besar fans MKT4X.",
                fc_join_fanclub: "Gabung Fanclub 💚",
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
                // Fanclub
                fc_badge:        "✨ MKT4X OFFICIAL FANCLUB ✨",
                fc_title:        "MKT4X Official Fanclub",
                fc_sub:          "Join the Official Community",
                fc_join_now:     "Join Now 💚",
                fc_about_title:  "About Fanclub",
                fc_about_desc:   "MKT4X Official Fanclub is the official community for exclusive content and the latest news from MKT4X. Join thousands of fans across Indonesia!",
                fc_benefit_title:"Member Benefits",
                fc_b1_title:     "Exclusive Photo",
                fc_b1_desc:      "Special photos for members only",
                fc_b2_title:     "Early News",
                fc_b2_desc:      "Get the latest info faster",
                fc_b3_title:     "Community Access",
                fc_b3_desc:      "Connect with MKT4X fans",
                fc_b4_title:     "Special Event",
                fc_b4_desc:      "Exclusive events and live sessions",
                fc_cta_title:    "Join MKT4X Fanclub",
                fc_cta_sub:      "⭐ Be part of the MKT4X fan family.",
                fc_join_fanclub: "Join Fanclub 💚",
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
                // Fanclub
                fc_badge:        "✨ MKT4X 公式ファンクラブ ✨",
                fc_title:        "MKT4X 公式ファンクラブ",
                fc_sub:          "公式コミュニティに参加しよう",
                fc_join_now:     "今すぐ参加 💚",
                fc_about_title:  "ファンクラブについて",
                fc_about_desc:   "MKT4X公式ファンクラブは、限定コンテンツや最新情報を得るための公式コミュニティです。",
                fc_benefit_title:"メンバー特典",
                fc_b1_title:     "限定写真",
                fc_b1_desc:      "メンバー限定の特別写真",
                fc_b2_title:     "最新ニュース",
                fc_b2_desc:      "いち早く最新情報をゲット",
                fc_b3_title:     "コミュニティ",
                fc_b3_desc:      "MKT4Xファンと繋がろう",
                fc_b4_title:     "特別イベント",
                fc_b4_desc:      "限定イベント・ライブ配信",
                fc_cta_title:    "MKT4Xファンクラブに参加",
                fc_cta_sub:      "⭐ MKT4Xファン大家族の一員になろう。",
                fc_join_fanclub: "ファンクラブに参加 💚",
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
                // Fanclub
                fc_badge:        "✨ KELAB PEMINAT RASMI MKT4X ✨",
                fc_title:        "Kelab Peminat Rasmi MKT4X",
                fc_sub:          "Sertai Komuniti Rasmi",
                fc_join_now:     "Sertai Sekarang 💚",
                fc_about_title:  "Tentang Kelab Peminat",
                fc_about_desc:   "Kelab Peminat Rasmi MKT4X adalah komuniti rasmi untuk mendapatkan kandungan eksklusif dan berita terkini dari MKT4X.",
                fc_benefit_title:"Faedah Ahli",
                fc_b1_title:     "Foto Eksklusif",
                fc_b1_desc:      "Foto istimewa untuk ahli sahaja",
                fc_b2_title:     "Berita Awal",
                fc_b2_desc:      "Maklumat terkini lebih cepat",
                fc_b3_title:     "Akses Komuniti",
                fc_b3_desc:      "Berhubung dengan peminat MKT4X",
                fc_b4_title:     "Acara Khas",
                fc_b4_desc:      "Acara dan siaran langsung eksklusif",
                fc_cta_title:    "Sertai Kelab Peminat MKT4X",
                fc_cta_sub:      "⭐ Jadilah sebahagian keluarga besar peminat MKT4X.",
                fc_join_fanclub: "Sertai Kelab Peminat 💚",
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
              
