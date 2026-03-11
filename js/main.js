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

        const events = { 
            "2026-03-08": "🎂 Kiara Birthday - Private Message Special AI", 
            "2026-03-10": "💿 Release Single 'Akhirnya Bertemu'",
            "2026-03-15": "🟢 MKT4X 1st Stage: Pajama Drive" 
        };

        if (langSelect) {
            langSelect.onchange = function() {
                const l = this.value;
                if(document.getElementById('newsTitle')) document.getElementById('newsTitle').innerText = dict[l].news;
                if(document.getElementById('bdayTitle')) document.getElementById('bdayTitle').innerText = dict[l].bday;
                if(document.getElementById('schTitle')) document.getElementById('schTitle').innerText = dict[l].sch;
                if(document.getElementById('infoPlaceholder')) document.getElementById('infoPlaceholder').innerText = dict[l].placeholder;
                
                const spans = document.querySelectorAll('#menuList span');
                dict[l].list.forEach((t, i) => { if(spans[i]) spans[i].innerText = t; });

                renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
            };
        }

        // SLIDER
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let cur = 0;
            setInterval(() => {
                slides[cur].style.display = 'none';
                cur = (cur + 1) % slides.length;
                slides[cur].style.display = 'block';
            }, 3000);
        }

        // KALENDER
        let currentCalDate = new Date(2026, 2); 
        
        window.showEvent = function(dateStr) {
            const display = document.getElementById('eventDisplay');
            if (!display) return;
            const lang = langSelect ? langSelect.value : 'id';
            display.innerHTML = events[dateStr] ? 
                `<div class="event-item"><span class="dot"></span> ${events[dateStr]}</div>` : 
                `<p id="infoPlaceholder" style="color:#888; font-size:0.8rem;">${dict[lang].placeholder}</p>`;
        };

        function renderCalendar(year, month) {
            const container = document.getElementById('calendar-mini');
            const datesGrid = document.getElementById('datesGrid'); // Untuk schedule.html
            if (!container && !datesGrid) return;

            const lang = langSelect ? langSelect.value : 'id';
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            
            const monthNames = {
                id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                jp: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                my: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"]
            };

            // Update Header Bulan & Tahun
            if(document.getElementById('monthYear')) {
                document.getElementById('monthYear').innerText = `${monthNames[lang][month]} ${year}`;
            }

            // Update Label Hari (MIN, SEN, SEL...)
            const daysLabel = document.getElementById('daysLabel');
            if(daysLabel) {
                daysLabel.innerHTML = dict[lang].days.map(d => `<span>${d}</span>`).join('');
            }

            let html = "";
            for (let i = 0; i < firstDay; i++) html += `<div></div>`;

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const hasEvent = events[dateStr] ? "has-event" : "";
                const isToday = new Date().toDateString() === new Date(year, month, d).toDateString() ? "today" : "";
                const isKiaraBday = (d === 8 && month === 2 && year === 2026) ? "active" : "";
                
                html += `<div class="date-cell ${hasEvent} ${isToday} ${isKiaraBday}" onclick="showEvent('${dateStr}')">${d}</div>`;
            }

            // Masukkan ke Grid yang sesuai
            if(datesGrid) {
                datesGrid.innerHTML = html;
            } else if (container) {
                // Fallback untuk index.html jika strukturnya berbeda
                container.querySelector('.dates-grid').innerHTML = html;
            }

            // Button Navigasi
            const btnPrev = document.getElementById('prevMonth');
            const btnNext = document.getElementById('nextMonth');
            if(btnPrev) btnPrev.onclick = () => {
                currentCalDate.setMonth(currentCalDate.getMonth() - 1);
                renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
            };
            if(btnNext) btnNext.onclick = () => {
                currentCalDate.setMonth(currentCalDate.getMonth() + 1);
                renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
            };
        }

        renderCalendar(currentCalDate.getFullYear(), currentCalDate.getMonth());
    }
});
document.addEventListener("DOMContentLoaded", function() {
    // 1. Data Translasi Khusus Halaman Member
    const translations = {  
        'en': { 'member': 'MEMBER', 'gen': 'MKT4X 1st Generation Members' },  
        'id': { 'member': 'ANGGOTA', 'gen': 'Anggota Generasi ke-1 MKT4X' },  
        'my': { 'member': 'AHLI', 'gen': 'Ahli Generasi Pertama MKT4X' },  
        'jp': { 'member': 'メンバー', 'gen': 'MKT4X 第1期生メンバー' }  
    };  

    // 2. Ambil elemen select-nya
    const langSelect = document.getElementById('langSelect');

    // 3. Fungsi Perubahan Bahasa
    if (langSelect) {
        langSelect.onchange = function() {
            const lang = this.value;
            
            // Update teks Member
            const txtMember = document.getElementById('txt-member');
            const txtGen = document.getElementById('txt-gen');

            if (txtMember) txtMember.innerText = translations[lang].member;
            if (txtGen) txtGen.innerText = translations[lang].gen;
            
            // Opsional: Simpan pilihan bahasa ke LocalStorage supaya pas pindah page gak reset
            localStorage.setItem('selectedLang', lang);
        };

        // 4. Load bahasa yang tersimpan (biar sinkron antar page)
        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang) {
            langSelect.value = savedLang;
            langSelect.onchange(); // Trigger update teks saat pertama load
        }
    }
});
