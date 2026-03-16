// =====================
// news1.js - untuk halaman di subfolder (news/, members/, dll)
// Sama persis dengan main.js tapi pakai prefix '../'
// =====================

document.addEventListener("DOMContentLoaded", function() {
    const prefix = '../';

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

            // Beritahu auth.js bahwa sidebar sudah siap di DOM
            document.dispatchEvent(new Event('sidebarLoaded'));

            startPage();
        })
        .catch(err => {
            console.error("Gagal muat komponen:", err);
            startPage();
        });

    function startPage() {
        const sidebar   = document.getElementById('sidebar');
        const overlay   = document.getElementById('overlay');
        const menuBtn   = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        // Toggle Sidebar - sama persis dengan main.js
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
                // Berita 1
                b1_title: "Logo Baru MKT4X Diperkenalkan",
                b1_p1:    "MKT4X secara resmi memperkenalkan logo terbaru sebagai bagian dari pembaruan identitas visual grup. Perubahan ini dilakukan untuk mencerminkan perkembangan MKT4X yang terus tumbuh dan bergerak menuju arah yang lebih besar di masa depan.",
                b1_p2:    "Logo baru ini menghadirkan desain yang lebih modern dan segar, namun tetap mempertahankan karakter khas yang menjadi identitas MKT4X sejak awal. Pembaruan ini juga menjadi simbol semangat baru bagi seluruh member dan para penggemar.",
                b1_p3:    "Mulai saat ini, logo terbaru MKT4X akan digunakan secara resmi di seluruh platform, termasuk website resmi, media sosial, serta berbagai konten dan aktivitas yang berkaitan dengan MKT4X.",
                b1_p4:    "MKT4X Management berharap dengan identitas visual yang baru ini, MKT4X dapat terus berkembang dan menghadirkan karya-karya yang lebih menarik bagi para fans di masa yang akan datang.",
                b1_sign:  "MKT4X Management",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                // Berita 1
                b1_title: "MKT4X Introduces New Logo",
                b1_p1:    "MKT4X has officially introduced its new logo as part of a visual identity update for the group. This change was made to reflect MKT4X's continuous growth and movement toward a bigger future.",
                b1_p2:    "The new logo features a more modern and fresh design, while still maintaining the distinctive character that has been MKT4X's identity from the beginning. This update also symbolizes a new spirit for all members and fans.",
                b1_p3:    "From now on, the latest MKT4X logo will be officially used across all platforms, including the official website, social media, and various content and activities related to MKT4X.",
                b1_p4:    "MKT4X Management hopes that with this new visual identity, MKT4X can continue to grow and deliver more exciting works for fans in the future.",
                b1_sign:  "MKT4X Management",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                // Berita 1
                b1_title: "MKT4Xが新ロゴを発表",
                b1_p1:    "MKT4Xはグループのビジュアルアイデンティティ更新の一環として、新しいロゴを正式に発表しました。",
                b1_p2:    "新ロゴはよりモダンで新鮮なデザインを採用しながら、MKT4Xが最初から持っていた独自のキャラクターを維持しています。",
                b1_p3:    "これより、最新のMKT4Xロゴは全プラットフォームで公式に使用されます。",
                b1_p4:    "MKT4X Managementは、この新しいビジュアルアイデンティティにより、MKT4Xが今後もファンにとって魅力的な作品を届け続けることを願っています。",
                b1_sign:  "MKT4X Management",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                // Berita 1
                b1_title: "Logo Baharu MKT4X Diperkenalkan",
                b1_p1:    "MKT4X secara rasmi memperkenalkan logo terbaru sebagai sebahagian daripada pembaruan identiti visual kumpulan.",
                b1_p2:    "Logo baharu ini menghadirkan reka bentuk yang lebih moden dan segar, namun tetap mengekalkan watak khas MKT4X.",
                b1_p3:    "Mulai sekarang, logo terbaru MKT4X akan digunakan secara rasmi di semua platform.",
                b1_p4:    "MKT4X Management berharap MKT4X dapat terus berkembang dan menghasilkan karya menarik untuk peminat.",
                b1_sign:  "MKT4X Management",
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
    }
});
