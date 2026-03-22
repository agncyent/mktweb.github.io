// =====================
// news2.js - untuk halaman di subfolder news/
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
                b2_title: "Pengumuman Resmi",
                b2_date:  "18 Maret 2026",
                b2_p1:    "MKT4X secara resmi mengumumkan pembaruan logo sebagai bagian dari pengembangan identitas visual grup. Perubahan ini dilakukan untuk mencerminkan arah baru serta pertumbuhan MKT4X sebagai idol group digital yang terus berkembang.",
                b2_p2:    "Logo terbaru ini menghadirkan desain yang lebih modern dan segar, dengan tetap mempertahankan karakter khas yang telah melekat pada MKT4X sejak awal. Pembaruan ini juga menjadi simbol semangat baru dalam menghadirkan karya dan inovasi ke depannya.",
                b2_p3:    "Mulai hari ini, logo baru akan digunakan secara resmi di seluruh platform MKT4X, termasuk website, media sosial, serta berbagai konten dan aktivitas yang berkaitan dengan grup.",
                b2_p4:    "Melalui perubahan ini, MKT4X berharap dapat terus berkembang dan memberikan pengalaman yang lebih baik bagi para penggemar, serta memperkuat identitas sebagai grup yang kreatif dan inovatif.",
                b2_sign:  "MKT4X Management",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                b2_title: "Official Announcement",
                b2_date:  "March 18, 2026",
                b2_p1:    "MKT4X officially announces a logo update as part of the group's visual identity development. This change reflects a new direction and growth of MKT4X as a continuously evolving digital idol group.",
                b2_p2:    "The new logo presents a more modern and fresh design while retaining the distinctive character that has been associated with MKT4X from the beginning. This update also symbolizes a new spirit in delivering works and innovations going forward.",
                b2_p3:    "Starting today, the new logo will be officially used across all MKT4X platforms, including the website, social media, and various content and activities related to the group.",
                b2_p4:    "Through this change, MKT4X hopes to continue growing and providing a better experience for fans, while strengthening its identity as a creative and innovative group.",
                b2_sign:  "MKT4X Management",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                b2_title: "公式発表",
                b2_date:  "2026年3月18日",
                b2_p1:    "MKT4Xは、グループのビジュアルアイデンティティ開発の一環として、ロゴの更新を正式に発表します。この変更は、進化し続けるデジタルアイドルグループとしてのMKT4Xの新しい方向性と成長を反映しています。",
                b2_p2:    "新しいロゴは、MKT4Xが最初から持っていた独自のキャラクターを維持しながら、よりモダンで新鮮なデザインを採用しています。このアップデートは、今後の作品とイノベーションを提供する新たな活力の象徴でもあります。",
                b2_p3:    "本日より、新ロゴはウェブサイト、ソーシャルメディア、グループに関連するさまざまなコンテンツや活動を含む、MKT4Xの全プラットフォームで公式に使用されます。",
                b2_p4:    "この変更を通じて、MKT4Xはファンにとってより良い体験を提供し続けるとともに、クリエイティブで革新的なグループとしてのアイデンティティを強化することを願っています。",
                b2_sign:  "MKT4X Management",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                b2_title: "Pengumuman Rasmi",
                b2_date:  "18 Mac 2026",
                b2_p1:    "MKT4X secara rasmi mengumumkan kemas kini logo sebagai sebahagian daripada pembangunan identiti visual kumpulan. Perubahan ini dilakukan untuk mencerminkan hala tuju baharu serta pertumbuhan MKT4X sebagai kumpulan idol digital yang terus berkembang.",
                b2_p2:    "Logo terbaru ini menghadirkan reka bentuk yang lebih moden dan segar, sambil mengekalkan watak khas yang telah melekat pada MKT4X sejak awal. Kemas kini ini juga menjadi simbol semangat baharu dalam menghadirkan karya dan inovasi pada masa hadapan.",
                b2_p3:    "Mulai hari ini, logo baharu akan digunakan secara rasmi di semua platform MKT4X, termasuk laman web, media sosial, serta pelbagai kandungan dan aktiviti berkaitan kumpulan.",
                b2_p4:    "Melalui perubahan ini, MKT4X berharap dapat terus berkembang dan memberikan pengalaman yang lebih baik kepada peminat, serta memperkukuh identiti sebagai kumpulan yang kreatif dan inovatif.",
                b2_sign:  "MKT4X Management",
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

