// =====================
// wiki.js - untuk halaman di subfolder wiki/
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
                // Wiki
                wk_hero_sub:      "Virtual Idol Group dari Indonesia",
                wk_info_title:    "📋 Informasi Umum",
                wk_label_name:    "Nama",
                wk_label_full:    "Nama Lengkap",
                wk_label_type:    "Jenis",
                wk_type:          "Virtual Idol Group",
                wk_label_origin:  "Asal Negara",
                wk_origin:        "🇮🇩 Indonesia",
                wk_label_debut:   "Tanggal Debut",
                wk_debut:         "26 September 2024",
                wk_label_members: "Jumlah Member",
                wk_label_genre:   "Genre",
                wk_genre:         "J-Pop, Virtual Pop",
                wk_label_label:   "Label",
                wk_about_title:   "💡 Tentang MKT4X",
                wk_about_p1:      "MKT4X adalah sebuah virtual idol group asal Indonesia yang terdiri dari 6 member. Berbeda dengan idol group konvensional, MKT4X merupakan grup yang sepenuhnya virtual — tidak ada orang nyata di balik karakter-karakter ini. Setiap member MKT4X adalah karakter digital yang diciptakan dengan kepribadian, latar belakang, dan identitas unik masing-masing.",
                wk_about_p2:      "MKT4X resmi debut pada tanggal 26 September 2024 dan sejak saat itu terus berkembang dengan merilis berbagai karya musik, konten digital, serta membangun komunitas penggemar yang aktif di Indonesia dan mancanegara.",
                wk_about_p3:      "Konsep \"Virtual\" yang diusung MKT4X mencerminkan visi grup ini untuk melampaui batas dunia nyata dan menghadirkan pengalaman idol yang inovatif dan modern melalui platform digital.",
                wk_members_title: "👥 Member",
                wk_disco_title:   "🎵 Diskografi",
                wk_single:        "Single",
                wk_social_title:  "📱 Media Sosial",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                // Wiki
                wk_hero_sub:      "Virtual Idol Group from Indonesia",
                wk_info_title:    "📋 General Information",
                wk_label_name:    "Name",
                wk_label_full:    "Full Name",
                wk_label_type:    "Type",
                wk_type:          "Virtual Idol Group",
                wk_label_origin:  "Country of Origin",
                wk_origin:        "🇮🇩 Indonesia",
                wk_label_debut:   "Debut Date",
                wk_debut:         "September 26, 2024",
                wk_label_members: "Number of Members",
                wk_label_genre:   "Genre",
                wk_genre:         "J-Pop, Virtual Pop",
                wk_label_label:   "Label",
                wk_about_title:   "💡 About MKT4X",
                wk_about_p1:      "MKT4X is a virtual idol group from Indonesia consisting of 6 members. Unlike conventional idol groups, MKT4X is a fully virtual group — there are no real people behind these characters. Each MKT4X member is a digital character created with their own unique personality, background, and identity.",
                wk_about_p2:      "MKT4X officially debuted on September 26, 2024, and has since continued to grow by releasing various musical works, digital content, and building an active fan community in Indonesia and abroad.",
                wk_about_p3:      "The \"Virtual\" concept carried by MKT4X reflects the group's vision to transcend the boundaries of the real world and deliver an innovative and modern idol experience through digital platforms.",
                wk_members_title: "👥 Members",
                wk_disco_title:   "🎵 Discography",
                wk_single:        "Single",
                wk_social_title:  "📱 Social Media",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                // Wiki
                wk_hero_sub:      "インドネシア発バーチャルアイドルグループ",
                wk_info_title:    "📋 基本情報",
                wk_label_name:    "名前",
                wk_label_full:    "正式名称",
                wk_label_type:    "種類",
                wk_type:          "バーチャルアイドルグループ",
                wk_label_origin:  "出身国",
                wk_origin:        "🇮🇩 インドネシア",
                wk_label_debut:   "デビュー日",
                wk_debut:         "2024年9月26日",
                wk_label_members: "メンバー数",
                wk_label_genre:   "ジャンル",
                wk_genre:         "J-Pop、バーチャルポップ",
                wk_label_label:   "レーベル",
                wk_about_title:   "💡 MKT4Xについて",
                wk_about_p1:      "MKT4Xはインドネシア出身の6人組バーチャルアイドルグループです。従来のアイドルグループとは異なり、MKT4Xは完全にバーチャルなグループであり、キャラクターの背後に実在の人物はいません。各MKT4Xメンバーは、独自の個性、背景、アイデンティティを持つデジタルキャラクターとして創られています。",
                wk_about_p2:      "MKT4Xは2024年9月26日に正式デビューし、それ以来、様々な音楽作品やデジタルコンテンツをリリースし、インドネシアおよび海外で活発なファンコミュニティを築き続けています。",
                wk_about_p3:      "MKT4Xが掲げる「Virtual」のコンセプトは、現実世界の境界を超え、デジタルプラットフォームを通じて革新的でモダンなアイドル体験を届けるというグループのビジョンを反映しています。",
                wk_members_title: "👥 メンバー",
                wk_disco_title:   "🎵 ディスコグラフィー",
                wk_single:        "シングル",
                wk_social_title:  "📱 ソーシャルメディア",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                // Wiki
                wk_hero_sub:      "Kumpulan Idol Maya dari Indonesia",
                wk_info_title:    "📋 Maklumat Umum",
                wk_label_name:    "Nama",
                wk_label_full:    "Nama Penuh",
                wk_label_type:    "Jenis",
                wk_type:          "Kumpulan Idol Maya",
                wk_label_origin:  "Negara Asal",
                wk_origin:        "🇮🇩 Indonesia",
                wk_label_debut:   "Tarikh Debut",
                wk_debut:         "26 September 2024",
                wk_label_members: "Bilangan Ahli",
                wk_label_genre:   "Genre",
                wk_genre:         "J-Pop, Virtual Pop",
                wk_label_label:   "Label",
                wk_about_title:   "💡 Tentang MKT4X",
                wk_about_p1:      "MKT4X adalah kumpulan idol maya dari Indonesia yang terdiri daripada 6 ahli. Berbeza dengan kumpulan idol konvensional, MKT4X adalah kumpulan yang sepenuhnya maya — tiada orang sebenar di sebalik watak-watak ini. Setiap ahli MKT4X adalah watak digital yang dicipta dengan personaliti, latar belakang, dan identiti unik masing-masing.",
                wk_about_p2:      "MKT4X rasmi debut pada 26 September 2024 dan sejak itu terus berkembang dengan mengeluarkan pelbagai karya muzik, kandungan digital, serta membina komuniti peminat yang aktif di Indonesia dan luar negara.",
                wk_about_p3:      "Konsep \"Virtual\" yang diusung MKT4X mencerminkan visi kumpulan ini untuk melampaui batas dunia nyata dan menghadirkan pengalaman idol yang inovatif dan moden melalui platform digital.",
                wk_members_title: "👥 Ahli",
                wk_disco_title:   "🎵 Diskografi",
                wk_single:        "Single",
                wk_social_title:  "📱 Media Sosial",
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
              
