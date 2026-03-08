document.addEventListener("DOMContentLoaded", function() {
    // 1. DETEKSI LOKASI FOLDER (Root atau /members)
    const isSub = window.location.pathname.includes('/members/');
    const prefix = isSub ? '../' : '';

    // 2. AMBIL NAVBAR DAN SIDEBAR (Berurutan)
    fetch(prefix + 'components/navbar.html')
        .then(res => res.text())
        .then(navData => {
            document.getElementById('navbar-placeholder').innerHTML = navData;
            return fetch(prefix + 'components/sidebar.html');
        })
        .then(res => res.text())
        .then(sideData => {
            document.getElementById('sidebar-placeholder').innerHTML = sideData;
            // Jalankan semua logika setelah elemen HTML berhasil ditempel
            initMKT4XLogic();
        })
        .catch(err => console.error("Gagal memuat komponen:", err));

    // 3. SEMUA LOGIKA UTAMA (Sidebar, Language, Slider)
    function initMKT4XLogic() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        // --- Logika Sidebar ---
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

        // --- Logika Language Switcher ---
        const dict = {
            id: { news: "BERITA TERBARU", bday: "ULANG TAHUN", list: ["Home", "Berita", "Jadwal", "Member", "Setlist", "Fanclub", "Masuk"] },
            en: { news: "LATEST NEWS", bday: "BIRTHDAY", list: ["Home", "News", "Schedule", "Member", "Setlist", "Fanclub", "Login"] },
            jp: { news: "最新ニュース", bday: "誕生日", list: ["ホーム", "ニュース", "スケジュール", "メンバー", "セットリスト", "ファンクラブ", "ログイン"] },
            my: { news: "BERITA TERKINI", bday: "HARI JADI", list: ["Utama", "Berita", "Jadual", "Ahli", "Senarai Lagu", "Kelab Peminat", "Log Masuk"] }
        };

        if (langSelect) {
            langSelect.addEventListener('change', function() {
                const l = this.value;
                // Update Judul di Index (Pastikan ID ini ada di index.html)
                const newsTitle = document.getElementById('newsTitle');
                const bdayTitle = document.getElementById('bdayTitle');
                if (newsTitle) newsTitle.innerText = dict[l].news;
                if (bdayTitle) bdayTitle.innerText = dict[l].bday;

                // Update Menu Sidebar
                const spans = document.querySelectorAll('#menuList span');
                dict[l].list.forEach((teks, i) => {
                    if (spans[i]) spans[i].innerText = teks;
                });
            });
        }

        // --- Logika Hero Slider (8 Foto) ---
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let current = 0;
            setInterval(() => {
                slides[current].style.display = 'none';
                current = (current + 1) % slides.length;
                slides[current].style.display = 'block';
            }, 3000);
        }
    }
});
