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
            id: { 
                news: "BERITA TERBARU", bday: "ULANG TAHUN", sch: "JADWAL", 
                list: ["Home", "Berita", "Jadwal", "Member", "Release", "Fanclub", "Masuk"],
                days: ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"],
                placeholder: "Klik tanggal untuk melihat jadwal."
            },
            en: { 
                news: "LATEST NEWS", bday: "BIRTHDAY", sch: "SCHEDULE", 
                list: ["Home", "News", "Schedule", "Member", "Release", "Fanclub", "Login"],
                days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
                placeholder: "Click date to see schedule."
            },
            jp: { 
                news: "最新ニュース", bday: "誕生日", sch: "スケジュール", 
                list: ["ホーム", "ニュース", "スケジュール", "メンバー", "リリース", "ファンクラブ", "ログイン"],
                days: ["日", "月", "火", "水", "木", "金", "土"],
                placeholder: "日付をクリックして。"
            },
            my: { 
                news: "BERITA TERKINI", bday: "HARI JADI", sch: "JADUAL", 
                list: ["Utama", "Berita", "Jadual", "Ahli", "Rilis", "Kelab Peminat", "Log Masuk"],
                days: ["AHA", "ISN", "SEL", "RAB", "KHA", "JUM", "SAB"],
                placeholder: "Klik tarikh untuk jadual."
            }
        };

        // Data Event MKT4X
        const events = { 
            "2026-03-08": "🎂 Kiara Birthday - Private Message Special AI", 
            "2026-03-10": "💿 Release Single 'Akhirnya Bertemu'",
            "2026-03-15": "🟢 MKT4X 1st Stage: Pajama Drive" 
        };

        if (langSelect) {
            langSelect.onchange = function() {
                renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
                
                const l = this.value;
                if(document.getElementById('newsTitle')) document.getElementById('newsTitle').innerText = dict[l].news;
                if(document.getElementById('bdayTitle')) document.getElementById('bdayTitle').innerText = dict[l].bday;
                if(document.getElementById('schTitle')) document.getElementById('schTitle').innerText = dict[l].sch;
                if(document.getElementById('infoPlaceholder')) document.getElementById('infoPlaceholder').innerText = dict[l].placeholder;
                
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

        // --- LOGIKA KALENDER INTERAKTIF ---
        let currentCalDate = new Date(2026, 2); 
        
        // Fungsi showEvent (Biar bisa diklik kayak web lama)
        window.showEvent = function(dateStr) {
            const display = document.getElementById('eventDisplay');
            if (!display) return;
            const lang = langSelect ? langSelect.value : 'id';
            
            if (events[dateStr]) {
                display.innerHTML = `<div class="event-item"><span class="dot"></span> ${events[dateStr]}</div>`;
            } else {
                display.innerHTML = `<p id="infoPlaceholder" style="color:#888; font-size:0.8rem;">${dict[lang].placeholder}</p>`;
            }
        };

        function renderCalendar(year, month) {
            const container = document.getElementById('calendar-mini');
            if (!container) return;

            const lang = langSelect ? langSelect.value : 'id';
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            
            // Nama Bulan Sesuai Bahasa
            const monthNames = {
                id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                jp: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                my: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"]
            };

            let html = `
                <div class="calendar-header">
                    <button id="prevMonth">❮</button>
                    <h3>${monthNames[lang][month]} ${year}</h3>
                    <button id="nextMonth">❯</button>
                </div>
                <div class="days-grid">
                    ${dict[lang].days.map(d => `<span>${d}</span>`).join('')}
                </div>
                <div class="dates-grid">
            `;

            for (let i = 0; i < firstDay; i++) html += `<div></div>`;

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const hasEvent = events[dateStr] ? "has-event" : "";
                const isToday = new Date().toDateString() === new Date(year, month, d).toDateString() ? "today" : "";
                const isKiaraBday = (d === 8 && month === 2 && year === 2026) ? "active" : "";
                
                html += `<div class="date-cell ${hasEvent} ${isToday} ${isKiaraBday}" onclick="showEvent('${dateStr}')">${d}</div>`;
            }

            html += `</div></div>`;
            container.innerHTML = html;

            document.getElementById('prevMonth').onclick = () => {
                currentCalDate.setMonth(currentCalDate.getMonth() - 1);
                renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
            };
            document.getElementById('nextMonth').onclick = () => {
                if (currentCalDate.getFullYear() < 2030) {
                    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
                    renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
                }
            };
        }

        renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
    }
});
