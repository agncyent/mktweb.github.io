// =====================
// news1.js - untuk halaman di subfolder news/
// =====================

document.addEventListener("DOMContentLoaded", function() {
    const prefix = '../';

    // LOAD NAVBAR & SIDEBAR
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
                b1_title: "Pengumuman Resmi",
                b1_date:  "18 Maret 2026",
                b1_p1:    "MKT4X Management secara resmi mengumumkan peluncuran website resmi MKT4X sebagai platform utama dalam menyampaikan berbagai informasi kepada para penggemar.",
                b1_p2:    "Website ini dirancang sebagai pusat informasi yang mencakup berita terbaru, aktivitas grup, serta berbagai pembaruan penting lainnya yang berkaitan dengan perkembangan MKT4X.",
                b1_p3:    "Dengan hadirnya platform ini, diharapkan seluruh penggemar dapat mengakses informasi secara lebih mudah, cepat, dan terstruktur.",
                b1_p4:    "Kami mengajak seluruh penggemar untuk terus mengikuti perkembangan terbaru melalui website resmi ini.",
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
                b1_title: "Official Announcement",
                b1_date:  "March 18, 2026",
                b1_p1:    "MKT4X Management officially announces the launch of the MKT4X official website as the main platform for delivering various information to fans.",
                b1_p2:    "This website is designed as an information hub covering the latest news, group activities, and other important updates related to MKT4X's development.",
                b1_p3:    "With this platform, we hope all fans can access information more easily, quickly, and in an organized manner.",
                b1_p4:    "We invite all fans to keep following the latest developments through this official website.",
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
                b1_title: "公式発表",
                b1_date:  "2026年3月18日",
                b1_p1:    "MKT4X Managementは、ファンへの情報発信の主要プラットフォームとして、MKT4X公式ウェブサイトの開設を正式に発表します。",
                b1_p2:    "このウェブサイトは、最新ニュース、グループ活動、MKT4Xの発展に関する重要な更新情報を網羅する情報ハブとして設計されています。",
                b1_p3:    "このプラットフォームにより、すべてのファンがより簡単、迅速、そして体系的に情報にアクセスできることを願っています。",
                b1_p4:    "この公式ウェブサイトを通じて、最新情報を引き続きご確認いただければ幸いです。",
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
                b1_title: "Pengumuman Rasmi",
                b1_date:  "18 Mac 2026",
                b1_p1:    "MKT4X Management secara rasmi mengumumkan pelancaran laman web rasmi MKT4X sebagai platform utama dalam menyampaikan pelbagai maklumat kepada peminat.",
                b1_p2:    "Laman web ini direka sebagai pusat maklumat yang merangkumi berita terkini, aktiviti kumpulan, serta pelbagai kemas kini penting berkaitan perkembangan MKT4X.",
                b1_p3:    "Dengan kehadiran platform ini, diharapkan semua peminat dapat mengakses maklumat dengan lebih mudah, cepat, dan tersusun.",
                b1_p4:    "Kami menjemput semua peminat untuk terus mengikuti perkembangan terkini melalui laman web rasmi ini.",
                b1_sign:  "MKT4X Management",
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
