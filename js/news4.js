// =====================
// news4.js - untuk halaman di subfolder news/
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
                b4_title: "Pengumuman Resmi",
                b4_date:  "28 Juli 2026",
                b4_p1:    "MKT4X dengan bangga mengumumkan perilisan single ke-5 kami yang berjudul \"Buah Nusantara\". Single ini hadir sebagai karya terbaru yang membawa warna cerah, semangat, dan nuansa yang terinspirasi dari kekayaan alam serta keberagaman Indonesia.",
                b4_p2:    "Melalui lagu ini, MKT4X ingin menghadirkan energi positif dan suasana yang menyenangkan melalui konsep virtual idol yang unik. \"Buah Nusantara\" menjadi perjalanan musik yang memadukan keceriaan, kebersamaan, dan rasa bangga terhadap berbagai keindahan yang ada di Nusantara.",
                b4_p3:    "Setiap bagian dari single ini dirancang untuk memberikan pengalaman baru bagi para pendengar, mulai dari konsep visual, karakter, hingga nuansa musik yang segar dan penuh warna. Kami berharap lagu ini dapat menemani hari-hari kalian dan menjadi karya yang dapat dinikmati oleh semua kalangan.",
                b4_p4:    "Terima kasih atas seluruh dukungan yang terus diberikan kepada MKT4X. Nantikan perilisan resmi single ke-5 \"Buah Nusantara\" dan mari sambut era baru perjalanan MKT4X bersama.",
                b4_sign:  "MKT4X Management",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                b4_title: "Official Announcement",
                b4_date:  "July 28, 2026",
                b4_p1:    "MKT4X proudly announces the release of our 5th single titled \"Buah Nusantara\". This single arrives as our latest work, bringing bright colors, enthusiasm, and a nuance inspired by the natural richness and diversity of Indonesia.",
                b4_p2:    "Through this song, MKT4X wants to bring positive energy and a fun atmosphere through a unique virtual idol concept. \"Buah Nusantara\" becomes a musical journey that combines joy, togetherness, and pride in the various beauties of the archipelago.",
                b4_p3:    "Every part of this single is designed to provide a new experience for listeners, from the visual concept, characters, to a fresh and colorful musical nuance. We hope this song can accompany your days and become a work that can be enjoyed by everyone.",
                b4_p4:    "Thank you for all the continuous support given to MKT4X. Stay tuned for the official release of the 5th single \"Buah Nusantara\" and let's welcome a new era of MKT4X's journey together.",
                b4_sign:  "MKT4X Management",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                b4_title: "公式発表",
                b4_date:  "2026年7月28日",
                b4_p1:    "MKT4Xは「Buah Nusantara」というタイトルの5枚目のシングルのリリースを誇りを持って発表します。このシングルは、インドネシアの豊かな自然と多様性にインスパイアされた明るい色彩、熱意、雰囲気をもたらす最新作として登場します。",
                b4_p2:    "この曲を通じて、MKT4Xはユニークなバーチャルアイドルのコンセプトを通じてポジティブなエネルギーと楽しい雰囲気を届けたいと思っています。「Buah Nusantara」は、喜び、絆、そして群島の様々な美しさへの誇りを融合させた音楽の旅となります。",
                b4_p3:    "このシングルのすべての部分は、ビジュアルコンセプト、キャラクター、そして新鮮で色彩豊かな音楽的雰囲気まで、リスナーに新しい体験を提供するように設計されています。この曲が皆さんの日々に寄り添い、すべての人に楽しんでいただける作品になることを願っています。",
                b4_p4:    "MKT4Xへの継続的なご支援に感謝します。5枚目のシングル「Buah Nusantara」の正式リリースをお楽しみに。一緒にMKT4Xの新時代を迎えましょう。",
                b4_sign:  "MKT4X Management",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                b4_title: "Pengumuman Rasmi",
                b4_date:  "28 Julai 2026",
                b4_p1:    "MKT4X dengan bangga mengumumkan perilisan single ke-5 kami yang bertajuk \"Buah Nusantara\". Single ini hadir sebagai karya terbaru yang membawa warna cerah, semangat, dan nuansa yang terinspirasi daripada kekayaan alam serta kepelbagaian Indonesia.",
                b4_p2:    "Melalui lagu ini, MKT4X ingin menghadirkan tenaga positif dan suasana yang menyeronokkan melalui konsep virtual idol yang unik. \"Buah Nusantara\" menjadi perjalanan muzik yang memadukan keceriaan, kebersamaan, dan rasa bangga terhadap pelbagai keindahan yang ada di Nusantara.",
                b4_p3:    "Setiap bahagian single ini direka untuk memberikan pengalaman baharu kepada pendengar, bermula daripada konsep visual, watak, hingga nuansa muzik yang segar dan penuh warna. Kami berharap lagu ini dapat menemani hari-hari kalian dan menjadi karya yang dapat dinikmati oleh semua golongan.",
                b4_p4:    "Terima kasih atas seluruh sokongan yang terus diberikan kepada MKT4X. Nantikan perilisan rasmi single ke-5 \"Buah Nusantara\" dan mari sambut era baharu perjalanan MKT4X bersama.",
                b4_sign:  "MKT4X Management",
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
                  
