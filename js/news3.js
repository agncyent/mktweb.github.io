// =====================
// news3.js - untuk halaman di subfolder news/
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
                b3_title: "Pengumuman Resmi",
                b3_date:  "18 Maret 2026",
                b3_p1:    "MKT4X secara resmi mengumumkan peluncuran akun media sosial Instagram sebagai bagian dari upaya memperluas jangkauan komunikasi dengan para penggemar. Kehadiran platform ini menjadi langkah penting dalam membangun koneksi yang lebih dekat dan interaktif.",
                b3_p2:    "Melalui akun Instagram resmi ini, MKT4X akan membagikan berbagai konten eksklusif, termasuk aktivitas terbaru, update grup, foto, serta berbagai momen spesial yang tidak dapat ditemukan di platform lainnya.",
                b3_p3:    "Kami mengundang seluruh penggemar untuk mengikuti akun Instagram resmi MKT4X dan menjadi bagian dari perjalanan serta perkembangan grup ke depannya. Dukungan dari para penggemar akan menjadi motivasi utama bagi MKT4X untuk terus berkembang.",
                b3_p4:    "Dengan hadirnya akun ini, MKT4X berharap dapat menciptakan interaksi yang lebih aktif, membangun komunitas yang lebih kuat, serta menghadirkan pengalaman yang lebih dekat bagi seluruh penggemar.",
                b3_sign:  "MKT4X Management",
            },
            en: {
                menu_home:    "Home",
                menu_news:    "News",
                menu_sch:     "Schedule",
                menu_member:  "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login:   "Login",
                b3_title: "Official Announcement",
                b3_date:  "March 18, 2026",
                b3_p1:    "MKT4X officially announces the launch of an official Instagram account as part of efforts to expand communication with fans. This platform marks an important step in building a closer and more interactive connection.",
                b3_p2:    "Through this official Instagram account, MKT4X will share various exclusive content, including the latest activities, group updates, photos, and special moments that cannot be found on other platforms.",
                b3_p3:    "We invite all fans to follow MKT4X's official Instagram account and become part of the group's journey and future developments. Fan support will be the main motivation for MKT4X to keep growing.",
                b3_p4:    "With this account, MKT4X hopes to create more active interactions, build a stronger community, and deliver a closer experience for all fans.",
                b3_sign:  "MKT4X Management",
            },
            jp: {
                menu_home:    "ホーム",
                menu_news:    "ニュース",
                menu_sch:     "スケジュール",
                menu_member:  "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login:   "ログイン",
                b3_title: "公式発表",
                b3_date:  "2026年3月18日",
                b3_p1:    "MKT4Xは、ファンとのコミュニケーションの範囲を広げる取り組みの一環として、公式Instagramアカウントの開設を正式に発表します。このプラットフォームの存在は、より近くインタラクティブなつながりを築くための重要な一歩です。",
                b3_p2:    "この公式Instagramアカウントを通じて、MKT4Xは最新の活動、グループの更新情報、写真、そして他のプラットフォームでは見られない特別な瞬間など、様々な限定コンテンツを共有します。",
                b3_p3:    "すべてのファンにMKT4Xの公式Instagramアカウントをフォローし、グループの旅と今後の発展の一部になっていただくよう招待します。ファンのサポートがMKT4Xが成長し続ける主な原動力となります。",
                b3_p4:    "このアカウントの開設により、MKT4Xはより活発な交流を生み出し、より強いコミュニティを築き、すべてのファンにより身近な体験を提供できることを願っています。",
                b3_sign:  "MKT4X Management",
            },
            my: {
                menu_home:    "Utama",
                menu_news:    "Berita",
                menu_sch:     "Jadual",
                menu_member:  "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login:   "Log Masuk",
                b3_title: "Pengumuman Rasmi",
                b3_date:  "18 Mac 2026",
                b3_p1:    "MKT4X secara rasmi mengumumkan pelancaran akaun media sosial Instagram sebagai sebahagian daripada usaha memperluas jangkauan komunikasi dengan peminat. Kehadiran platform ini menjadi langkah penting dalam membina hubungan yang lebih dekat dan interaktif.",
                b3_p2:    "Melalui akaun Instagram rasmi ini, MKT4X akan berkongsi pelbagai kandungan eksklusif, termasuk aktiviti terkini, kemas kini kumpulan, foto, serta pelbagai momen istimewa yang tidak dapat ditemui di platform lain.",
                b3_p3:    "Kami menjemput semua peminat untuk mengikuti akaun Instagram rasmi MKT4X dan menjadi sebahagian daripada perjalanan serta perkembangan kumpulan pada masa hadapan. Sokongan peminat akan menjadi motivasi utama bagi MKT4X untuk terus berkembang.",
                b3_p4:    "Dengan kehadiran akaun ini, MKT4X berharap dapat mewujudkan interaksi yang lebih aktif, membina komuniti yang lebih kukuh, serta menghadirkan pengalaman yang lebih dekat bagi semua peminat.",
                b3_sign:  "MKT4X Management",
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
          
