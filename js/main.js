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
            
            // Setelah komponen masuk ke DOM, baru jalankan logic web
            startMKT4X(); 
        })
        .catch(err => console.error("Gagal muat komponen:", err));

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

        // 2. KAMUS BAHASA (Dictionary)
        const dict = {
            id: { 
                // Menu Sidebar
                menu_home: "Beranda",
                menu_news: "Berita",
                menu_sch: "Jadwal",
                menu_member: "Member",
                menu_release: "Rilis",
                menu_fanclub: "Fanclub",
                menu_login: "Masuk",
                // Halaman Member
                txt_member_title: "MEMBER",
                txt_gen: "Member MKT4X Generasi ke-1",
                // Home/Lainnya
                news_title: "BERITA TERBARU",
                bday_title: "ULANG TAHUN",
                sch_title: "JADWAL"
            },
            en: { 
                menu_home: "Home",
                menu_news: "News",
                menu_sch: "Schedule",
                menu_member: "Member",
                menu_release: "Release",
                menu_fanclub: "Fanclub",
                menu_login: "Login",
                txt_member_title: "MEMBERS",
                txt_gen: "MKT4X 1st Generation Members",
                news_title: "LATEST NEWS",
                bday_title: "BIRTHDAY",
                sch_title: "SCHEDULE"
            },
            jp: { 
                menu_home: "ホーム",
                menu_news: "ニュース",
                menu_sch: "スケジュール",
                menu_member: "メンバー",
                menu_release: "リリース",
                menu_fanclub: "ファンクラブ",
                menu_login: "ログイン",
                txt_member_title: "メンバー",
                txt_gen: "MKT4X 第1期生メンバー",
                news_title: "最新ニュース",
                bday_title: "誕生日",
                sch_title: "スケジュール"
            },
            my: { 
                menu_home: "Utama",
                menu_news: "Berita",
                menu_sch: "Jadual",
                menu_member: "Ahli",
                menu_release: "Rilis",
                menu_fanclub: "Kelab Peminat",
                menu_login: "Log Masuk",
                txt_member_title: "AHLI",
                txt_gen: "Ahli Generasi Pertama MKT4X",
                news_title: "BERITA TERKINI",
                bday_title: "HARI JADI",
                sch_title: "JADUAL"
            }
        };

        // 3. FUNGSI UPDATE TEKS
        window.applyLanguage = function(lang) {
            localStorage.setItem('selectedLang', lang);

            // Cari semua elemen yang punya atribut data-key
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (dict[lang] && dict[lang][key]) {
                    el.innerText = dict[lang][key];
                }
            });
        };

        // Inisialisasi Pilihan Bahasa
        if (langSelect) {
            langSelect.onchange = function() {
                applyLanguage(this.value);
            };

            // Set ke bahasa yang tersimpan atau default ke 'id'
            const savedLang = localStorage.getItem('selectedLang') || 'id';
            langSelect.value = savedLang;
            applyLanguage(savedLang);
        }

        // 4. SLIDER (Auto-check jika elemen ada)
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
