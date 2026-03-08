document.addEventListener("DOMContentLoaded", function() {
    const isSub = window.location.pathname.includes('/members/');
    const prefix = isSub ? '../' : '';

    // Ambil Navbar dulu
    fetch(prefix + 'components/navbar.html')
        .then(res => res.text())
        .then(navHtml => {
            document.getElementById('navbar-placeholder').innerHTML = navHtml;
            // Setelah navbar masuk, ambil Sidebar
            return fetch(prefix + 'components/sidebar.html');
        })
        .then(res => res.text())
        .then(sideHtml => {
            document.getElementById('sidebar-placeholder').innerHTML = sideHtml;
            // Jalankan semua fungsi
            startMKT4X();
        })
        .catch(err => console.error("Gagal memuat komponen:", err));

    function startMKT4X() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        // Toggle Sidebar
        menuBtn.onclick = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
        overlay.onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };

        // Language Switcher
        const dict = {
            id: { news: "BERITA TERBARU", bday: "ULANG TAHUN", list: ["Home", "Berita", "Jadwal", "Member", "Release", "Fanclub", "Masuk"] },
            en: { news: "LATEST NEWS", bday: "BIRTHDAY", list: ["Home", "News", "Schedule", "Member", "Release", "Fanclub", "Login"] },
            jp: { news: "最新ニュース", bday: "誕生日", list: ["ホーム", "ニュース", "スケジュール", "メンバー", "リリース", "ファンクラブ", "ログイン"] },
            my: { news: "BERITA TERKINI", bday: "HARI JADI", list: ["Utama", "Berita", "Jadual", "Ahli", "Rilis", "Kelab Peminat", "Log Masuk"] }
        };

        langSelect.onchange = function() {
            const l = this.value;
            if(document.getElementById('newsTitle')) document.getElementById('newsTitle').innerText = dict[l].news;
            if(document.getElementById('bdayTitle')) document.getElementById('bdayTitle').innerText = dict[l].bday;
            const spans = document.querySelectorAll('#menuList span');
            dict[l].list.forEach((t, i) => { if(spans[i]) spans[i].innerText = t; });
        };

        // Slider 8 Foto
        const slides = document.querySelectorAll('.slide');
        if(slides.length > 0) {
            let cur = 0;
            setInterval(() => {
                slides[cur].style.display = 'none';
                cur = (cur + 1) % slides.length;
                slides[cur].style.display = 'block';
            }, 3000);
        }
    }
});
