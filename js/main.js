document.addEventListener("DOMContentLoaded", function() {
    // 1. CEK PATH (Biar link gak patah di GitHub Pages atau folder members)
    const isSub = window.location.pathname.includes('/members/');
    const prefix = isSub ? '../' : '';

    // 2. LOAD KOMPONEN (NAVBAR & SIDEBAR)
    fetch(prefix + 'components/navbar.html')
        .then(res => res.text())
        .then(navHtml => {
            document.getElementById('navbar-placeholder').innerHTML = navHtml;
            return fetch(prefix + 'components/sidebar.html');
        })
        .then(res => res.text())
        .then(sideHtml => {
            document.getElementById('sidebar-placeholder').innerHTML = sideHtml;
            startMKT4X(); // Jalankan semua fungsi setelah HTML nempel
        })
        .catch(err => console.error("Gagal muat komponen:", err));

    function startMKT4X() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        // --- LOGIKA SIDEBAR (FIXED KANAN) ---
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

        // --- LOGIKA TRANSLATE 4 BAHASA (LENGKAP) ---
        const dict = {
            id: { news: "BERITA TERBARU", bday: "ULANG TAHUN", sch: "JADWAL", list: ["Home", "Berita", "Jadwal", "Member", "Release", "Fanclub", "Masuk"] },
            en: { news: "LATEST NEWS", bday: "BIRTHDAY", sch: "SCHEDULE", list: ["Home", "News", "Schedule", "Member", "Release", "Fanclub", "Login"] },
            jp: { news: "最新ニュース", bday: "誕生日", sch: "スケジュール", list: ["ホーム", "ニュース", "スケジュール", "メンバー", "リリース", "ファンクラブ", "ログイン"] },
            my: { news: "BERITA TERKINI", bday: "HARI JADI", sch: "JADUAL", list: ["Utama", "Berita", "Jadual", "Ahli", "Rilis", "Kelab Peminat", "Log Masuk"] }
        };

        if (langSelect) {
            langSelect.onchange = function() {
                const l = this.value;
                if(document.getElementById('newsTitle')) document.getElementById('newsTitle').innerText = dict[l].news;
                if(document.getElementById('bdayTitle')) document.getElementById('bdayTitle').innerText = dict[l].bday;
                if(document.getElementById('schTitle')) document.getElementById('schTitle').innerText = dict[l].sch;
                
                const spans = document.querySelectorAll('#menuList span');
                dict[l].list.forEach((t, i) => { if(spans[i]) spans[i].innerText = t; });
            };
        }

        // --- LOGIKA SLIDER 8 FOTO ---
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let cur = 0;
            setInterval(() => {
                slides[cur].style.display = 'none';
                cur = (cur + 1) % slides.length;
                slides[cur].style.display = 'block';
            }, 3000);
        }

        // --- LOGIKA KALENDER INTERAKTIF (MKT4X PROJECT) ---
        let currentCalDate = new Date(2026, 2); // Start Maret 2026
        
        function renderCalendar(year, month) {
            const container = document.getElementById('calendar-mini');
            if (!container) return;

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            let html = `
                <div class="calendar-header">
                    <button id="prevMonth">❮</button>
                    <h3>${monthNames[month]} ${year}</h3>
                    <button id="nextMonth">❯</button>
                </div>
                <div class="calendar-grid">
                    <div class="day-name">M</div><div class="day-name">S</div><div class="day-name">S</div>
                    <div class="day-name">R</div><div class="day-name">K</div><div class="day-name">J</div><div class="day-name">S</div>
            `;

            for (let i = 0; i < (firstDay === 0 ? 0 : firstDay); i++) html += `<div></div>`;

            for (let d = 1; d <= daysInMonth; d++) {
                // Tandai 8 Maret 2026 (Ulang Tahun Kiara MKT4X)
                let isSpecial = (d === 8 && month === 2 && year === 2026) ? 'active' : '';
                html += `<div class="${isSpecial}">${d}</div>`;
            }

            html += `</div>`;
            container.innerHTML = html;

            // Navigasi Bulan
            document.getElementById('prevMonth').onclick = () => {
                currentCalDate.setMonth(currentCalDate.getMonth() - 1);
                renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
            };
            document.getElementById('nextMonth').onclick = () => {
                // Batasi navigasi maksimal tahun 2030
                if (currentCalDate.getFullYear() < 2030 || (currentCalDate.getFullYear() === 2030 && currentCalDate.getMonth() < 11)) {
                    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
                    renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
                }
            };
        }

        // Render kalender pertama kali saat halaman dibuka
        renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
    }
});
