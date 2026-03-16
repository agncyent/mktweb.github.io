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
                // Dashboard
                fc_logout:       "Keluar",
                fc_label_oshi:   "Oshi",
                fc_label_city:   "Lokasi",
                fc_label_id:     "ID Fanclub",
                fc_stat_level:   "Fan Level",
                fc_stat_points:  "Poin",
                fc_stat_rank:    "Peringkat",
                fc_progress:     "Progres Fan Level",
                fc_menu_title:   "🗂️ Menu Fanclub",
                fc_menu_feed:    "MKT4X Feed",
                fc_menu_exclusive:"Konten Eksklusif",
                fc_menu_profile: "Profil Saya",
                fc_menu_event:   "Event",
                fc_menu_gallery: "Galeri",
                fc_menu_settings:"Pengaturan",
                fc_topfans_title:"🏆 Top Fans",
                fc_new:          "BARU",
                fc_see_all:      "Lihat Semua ›",
                fc_feed1_title:  "Foto Baru Ditambahkan",
                fc_feed1_desc:   "Foto eksklusif baru sudah di-upload!",
                fc_feed2_title:  "Pengumuman Event",
                fc_feed2_desc:   "Fan Meeting Online • 5 Mei 2026",
                fc_gallery_title:"Galeri Eksklusif",
                fc_letter_title: "💌 Surat dari Member",
                fc_letter_heading:"Halo Fans!",
                fc_letter_text:  "Terima kasih sudah mendukung MKT4X. Kami sedang menyiapkan lagu baru, tunggu ya!",
                fc_letter_like:  "120 fans menyukai pesan ini",
                fc_update_title: "📱 Latest Update",
                fc_exclusive_title:"🔒 Konten Eksklusif",
                fc_ex1:          "Photo Pack Mei",
                fc_ex2:          "Behind The Scene",
                fc_ex3:          "Video Message",
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
                // Dashboard
                fc_logout:       "Logout",
                fc_label_oshi:   "Oshi",
                fc_label_city:   "Location",
                fc_label_id:     "Fanclub ID",
                fc_stat_level:   "Fan Level",
                fc_stat_points:  "Points",
                fc_stat_rank:    "Rank",
                fc_progress:     "Fan Level Progress",
                fc_menu_title:   "🗂️ Fanclub Menu",
                fc_menu_feed:    "MKT4X Feed",
                fc_menu_exclusive:"Exclusive Content",
                fc_menu_profile: "My Profile",
                fc_menu_event:   "Event",
                fc_menu_gallery: "Gallery",
                fc_menu_settings:"Settings",
                fc_topfans_title:"🏆 Top Fans",
                fc_new:          "NEW",
                fc_see_all:      "See All ›",
                fc_feed1_title:  "New Photo Added",
                fc_feed1_desc:   "Exclusive photo just uploaded!",
                fc_feed2_title:  "Event Announcement",
                fc_feed2_desc:   "Fan Meeting Online • 5 May 2026",
                fc_gallery_title:"Exclusive Gallery",
                fc_letter_title: "💌 Letter from Member",
                fc_letter_heading:"Hello Fans!",
                fc_letter_text:  "Thank you for supporting MKT4X. We are preparing a new song, stay tuned!",
                fc_letter_like:  "120 fans liked this message",
                fc_update_title: "📱 Latest Update",
                fc_exclusive_title:"🔒 Exclusive Content",
                fc_ex1:          "Photo Pack May",
                fc_ex2:          "Behind The Scene",
                fc_ex3:          "Video Message",
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
                // Dashboard
                fc_logout:       "ログアウト",
                fc_label_oshi:   "推し",
                fc_label_city:   "場所",
                fc_label_id:     "ファンクラブID",
                fc_stat_level:   "ファンレベル",
                fc_stat_points:  "ポイント",
                fc_stat_rank:    "ランク",
                fc_progress:     "ファンレベル進捗",
                fc_menu_title:   "🗂️ ファンクラブメニュー",
                fc_menu_feed:    "MKT4Xフィード",
                fc_menu_exclusive:"限定コンテンツ",
                fc_menu_profile: "マイプロフィール",
                fc_menu_event:   "イベント",
                fc_menu_gallery: "ギャラリー",
                fc_menu_settings:"設定",
                fc_topfans_title:"🏆 トップファン",
                fc_new:          "新着",
                fc_see_all:      "すべて見る ›",
                fc_feed1_title:  "新しい写真が追加されました",
                fc_feed1_desc:   "限定写真がアップロードされました！",
                fc_feed2_title:  "イベント告知",
                fc_feed2_desc:   "オンラインファンミーティング • 2026年5月",
                fc_gallery_title:"限定ギャラリー",
                fc_letter_title: "💌 メンバーからの手紙",
                fc_letter_heading:"ファンの皆さん、こんにちは！",
                fc_letter_text:  "MKT4Xを応援してくれてありがとう。新しい曲を準備中なので、お楽しみに！",
                fc_letter_like:  "120人のファンがいいねしました",
                fc_update_title: "📱 最新情報",
                fc_exclusive_title:"🔒 限定コンテンツ",
                fc_ex1:          "フォトパック5月",
                fc_ex2:          "ビハインドザシーン",
                fc_ex3:          "ビデオメッセージ",
                fc_discord_title:"公式Discord",
                fc_discord_desc: "MKT4X公式Discordサーバーに参加しよう！",
                fc_discord_online:"120 オンライン",
                fc_discord_members:"1.4K メンバー",
                fc_discord_join: "サーバーに参加 ›",
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
                // Dashboard
                fc_logout:       "Log Keluar",
                fc_label_oshi:   "Oshi",
                fc_label_city:   "Lokasi",
                fc_label_id:     "ID Kelab Peminat",
                fc_stat_level:   "Tahap Peminat",
                fc_stat_points:  "Mata",
                fc_stat_rank:    "Kedudukan",
                fc_progress:     "Kemajuan Tahap Peminat",
                fc_menu_title:   "🗂️ Menu Kelab Peminat",
                fc_menu_feed:    "MKT4X Feed",
                fc_menu_exclusive:"Kandungan Eksklusif",
                fc_menu_profile: "Profil Saya",
                fc_menu_event:   "Acara",
                fc_menu_gallery: "Galeri",
                fc_menu_settings:"Tetapan",
                fc_topfans_title:"🏆 Peminat Teratas",
                fc_new:          "BARU",
                fc_see_all:      "Lihat Semua ›",
                fc_feed1_title:  "Foto Baru Ditambah",
                fc_feed1_desc:   "Foto eksklusif baru telah dimuat naik!",
                fc_feed2_title:  "Pengumuman Acara",
                fc_feed2_desc:   "Mesyuarat Peminat Dalam Talian • 5 Mei 2026",
                fc_gallery_title:"Galeri Eksklusif",
                fc_letter_title: "💌 Surat dari Ahli",
                fc_letter_heading:"Helo Peminat!",
                fc_letter_text:  "Terima kasih kerana menyokong MKT4X. Kami sedang menyediakan lagu baru, nantikan!",
                fc_letter_like:  "120 peminat menyukai mesej ini",
                fc_update_title: "📱 Kemaskini Terkini",
                fc_exclusive_title:"🔒 Kandungan Eksklusif",
                fc_ex1:          "Photo Pack Mei",
                fc_ex2:          "Behind The Scene",
                fc_ex3:          "Video Message",
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
