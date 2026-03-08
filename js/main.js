document.addEventListener("DOMContentLoaded", function() {
    const isSub = window.location.pathname.includes('/members/');
    const prefix = isSub ? '../' : '';

    fetch(prefix + 'components/navbar.html')
        .then(res => res.text())
        .then(navHtml => {
            document.getElementById('navbar-placeholder').innerHTML = navHtml;
            return fetch(prefix + 'components/sidebar.html');
        })
        .then(res => res.text())
        .then(sideHtml => {
            document.getElementById('sidebar-placeholder').innerHTML = sideHtml;
            startMKT4X();
        })
        .catch(err => console.error("Gagal muat komponen:", err));

    function startMKT4X() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        // LOGIKA SIDEBAR
        menuBtn.onclick = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
        overlay.onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };

        // LOGIKA TRANSLATE (DIPERBAIKI)
        const dict = {
            id: { 
                news: "BERITA TERBARU", 
                bday: "ULANG TAHUN", 
                sch: "JADWAL", 
                list: ["Home", "Berita", "Jadwal", "Member", "Release", "Fanclub", "Masuk"] 
            },
            en: { 
                news: "LATEST NEWS", 
                bday: "BIRTHDAY", 
                sch: "SCHEDULE", 
                list: ["Home", "News", "Schedule", "Member", "Release", "Fanclub", "Login"] 
            },
            jp: { 
                news: "最新ニュース", 
                bday: "誕生日", 
                sch: "スケジュール", 
                list: ["ホーム", "ニュース", "スケジュール", "メンバー", "リリース", "ファンクラブ", "ログイン"] 
            },
            my: { 
                news: "BERITA TERKINI", 
                bday: "HARI JADI", 
                sch: "JADUAL", 
                list: ["Utama", "Berita", "Jadual", "Ahli", "Rilis", "Kelab Peminat", "Log Masuk"] 
            }
        };

        langSelect.onchange = function() {
            const l = this.value;
            
            // Update Judul di Index (Wajib ada ID schTitle di index.html)
            if(document.getElementById('newsTitle')) document.getElementById('newsTitle').innerText = dict[l].news;
            if(document.getElementById('bdayTitle')) document.getElementById('bdayTitle').innerText = dict[l].bday;
            if(document.getElementById('schTitle')) document.getElementById('schTitle').innerText = dict[l].sch;

            // Update Menu Sidebar
            const spans = document.querySelectorAll('#menuList span');
            dict[l].list.forEach((t, i) => { if(spans[i]) spans[i].innerText = t; });
        };

        // LOGIKA KALENDER & SLIDER TETAP SAMA SEPERTI SEBELUMNYA
        // ... (lanjutkan kode slider & renderCalendar lu) ...
    }
});
