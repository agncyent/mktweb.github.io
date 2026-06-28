// privacy.js - untuk halaman di subfolder wiki/

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
        .catch(err => { startPage(); });

    function startPage() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const langSelect = document.getElementById('langSelect');

        if (menuBtn && sidebar && overlay) {
            menuBtn.onclick = () => { sidebar.classList.add('active'); overlay.classList.add('active'); };
            overlay.onclick = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };
        }

        const dict = {
            id: {
                menu_home:"Beranda", menu_news:"Berita", menu_sch:"Jadwal", menu_member:"Member", menu_release:"Rilis", menu_fanclub:"Fanclub", menu_login:"Masuk",
                pp_title: "Kebijakan Privasi",
                pp_updated: "Terakhir diperbarui: 27 Juni 2026",
                pp_intro: "Selamat datang di Website Resmi MKT4X. Kami menghargai privasi pengunjung dan berkomitmen untuk melindungi informasi yang diberikan saat menggunakan website ini.",
                pp_s1_title: "Informasi yang Kami Kumpulkan",
                pp_s1_desc: "Saat Anda menggunakan fitur tertentu di website, termasuk bergabung ke Fanclub MKT4X, kami dapat mengumpulkan informasi berikut:",
                pp_s1_l1: "Alamat email",
                pp_s1_l2: "Nama tampilan atau nama pengguna (jika diisi)",
                pp_s1_l3: "Data yang dikirim melalui formulir",
                pp_s1_l4: "Informasi dasar penggunaan website (seperti statistik kunjungan)",
                pp_s2_title: "Tujuan Penggunaan Informasi",
                pp_s2_desc: "Informasi yang dikumpulkan digunakan untuk:",
                pp_s2_l1: "Mengelola pendaftaran dan keanggotaan Fanclub MKT4X",
                pp_s2_l2: "Mengirim pembaruan, berita, dan pengumuman resmi MKT4X",
                pp_s2_l3: "Memberikan pengalaman penggunaan website yang lebih baik",
                pp_s2_l4: "Menanggapi pertanyaan atau permintaan pengguna",
                pp_s3_title: "Perlindungan Data",
                pp_s3_desc: "Kami berupaya menjaga keamanan informasi pengguna dan mencegah akses yang tidak sah. Namun, tidak ada sistem digital yang dapat menjamin keamanan sepenuhnya.",
                pp_s4_title: "Pembagian Informasi",
                pp_s4_desc: "MKT4X tidak menjual atau memperdagangkan informasi pribadi pengguna kepada pihak lain. Data hanya digunakan untuk kebutuhan operasional website dan pengelolaan layanan Fanclub.",
                pp_s5_title: "Cookies dan Teknologi Serupa",
                pp_s5_desc: "Website ini dapat menggunakan cookies atau teknologi serupa untuk membantu meningkatkan pengalaman pengguna dan memahami aktivitas pengunjung.",
                pp_s6_title: "Hak Pengguna",
                pp_s6_desc: "Pengguna berhak untuk:",
                pp_s6_l1: "Memperbarui informasi yang telah diberikan",
                pp_s6_l2: "Meminta penghapusan data Fanclub",
                pp_s6_l3: "Berhenti menerima pembaruan kapan saja",
                pp_s7_title: "Tautan Eksternal",
                pp_s7_desc: "Website dapat menyediakan tautan menuju platform atau layanan lain. Kebijakan privasi pada layanan tersebut berlaku secara terpisah.",
                pp_s8_title: "Perubahan Kebijakan",
                pp_s8_desc: "Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan ditampilkan pada halaman ini.",
                pp_s9_title: "Kontak",
                pp_s9_desc: "Jika memiliki pertanyaan mengenai privasi atau Fanclub MKT4X, silakan hubungi:",
                pp_thanks: "Terima kasih telah mendukung MKT4X.",
            },
            en: {
                menu_home:"Home", menu_news:"News", menu_sch:"Schedule", menu_member:"Member", menu_release:"Release", menu_fanclub:"Fanclub", menu_login:"Login",
                pp_title: "Privacy Policy",
                pp_updated: "Last updated: June 27, 2026",
                pp_intro: "Welcome to the Official MKT4X Website. We value the privacy of our visitors and are committed to protecting the information provided when using this website.",
                pp_s1_title: "Information We Collect",
                pp_s1_desc: "When you use certain features on the website, including joining the MKT4X Fanclub, we may collect the following information:",
                pp_s1_l1: "Email address",
                pp_s1_l2: "Display name or username (if filled in)",
                pp_s1_l3: "Data submitted through forms",
                pp_s1_l4: "Basic website usage information (such as visit statistics)",
                pp_s2_title: "Purpose of Information Use",
                pp_s2_desc: "The collected information is used to:",
                pp_s2_l1: "Manage MKT4X Fanclub registration and membership",
                pp_s2_l2: "Send updates, news, and official MKT4X announcements",
                pp_s2_l3: "Provide a better website experience",
                pp_s2_l4: "Respond to user questions or requests",
                pp_s3_title: "Data Protection",
                pp_s3_desc: "We strive to maintain the security of user information and prevent unauthorized access. However, no digital system can guarantee complete security.",
                pp_s4_title: "Information Sharing",
                pp_s4_desc: "MKT4X does not sell or trade users' personal information to other parties. Data is only used for website operational needs and Fanclub service management.",
                pp_s5_title: "Cookies and Similar Technologies",
                pp_s5_desc: "This website may use cookies or similar technologies to help improve user experience and understand visitor activity.",
                pp_s6_title: "User Rights",
                pp_s6_desc: "Users have the right to:",
                pp_s6_l1: "Update information that has been provided",
                pp_s6_l2: "Request deletion of Fanclub data",
                pp_s6_l3: "Stop receiving updates at any time",
                pp_s7_title: "External Links",
                pp_s7_desc: "The website may provide links to other platforms or services. The privacy policy of those services applies separately.",
                pp_s8_title: "Policy Changes",
                pp_s8_desc: "This Privacy Policy may be updated at any time. Changes will be displayed on this page.",
                pp_s9_title: "Contact",
                pp_s9_desc: "If you have questions about privacy or MKT4X Fanclub, please contact:",
                pp_thanks: "Thank you for supporting MKT4X.",
            },
            jp: {
                menu_home:"ホーム", menu_news:"ニュース", menu_sch:"スケジュール", menu_member:"メンバー", menu_release:"リリース", menu_fanclub:"ファンクラブ", menu_login:"ログイン",
                pp_title: "プライバシーポリシー",
                pp_updated: "最終更新日：2026年6月27日",
                pp_intro: "MKT4X公式ウェブサイトへようこそ。私たちは訪問者のプライバシーを尊重し、このウェブサイトを使用する際に提供された情報を保護することを約束します。",
                pp_s1_title: "収集する情報",
                pp_s1_desc: "MKT4Xファンクラブへの参加を含む、ウェブサイトの特定の機能を使用する際に、以下の情報を収集する場合があります：",
                pp_s1_l1: "メールアドレス",
                pp_s1_l2: "表示名またはユーザー名（入力した場合）",
                pp_s1_l3: "フォームから送信されたデータ",
                pp_s1_l4: "基本的なウェブサイト使用情報（訪問統計など）",
                pp_s2_title: "情報の使用目的",
                pp_s2_desc: "収集した情報は以下の目的で使用されます：",
                pp_s2_l1: "MKT4Xファンクラブの登録と会員管理",
                pp_s2_l2: "MKT4Xの更新情報、ニュース、公式発表の送信",
                pp_s2_l3: "より良いウェブサイト体験の提供",
                pp_s2_l4: "ユーザーの質問やリクエストへの対応",
                pp_s3_title: "データ保護",
                pp_s3_desc: "私たちはユーザー情報のセキュリティを維持し、不正アクセスを防ぐよう努めています。ただし、いかなるデジタルシステムも完全なセキュリティを保証することはできません。",
                pp_s4_title: "情報の共有",
                pp_s4_desc: "MKT4Xはユーザーの個人情報を他者に販売または取引しません。データはウェブサイトの運営ニーズとファンクラブサービスの管理にのみ使用されます。",
                pp_s5_title: "Cookieと類似技術",
                pp_s5_desc: "このウェブサイトはCookieや類似技術を使用して、ユーザー体験の向上と訪問者のアクティビティの把握に役立てる場合があります。",
                pp_s6_title: "ユーザーの権利",
                pp_s6_desc: "ユーザーは以下の権利を有します：",
                pp_s6_l1: "提供した情報の更新",
                pp_s6_l2: "ファンクラブデータの削除要求",
                pp_s6_l3: "いつでも更新の受信停止",
                pp_s7_title: "外部リンク",
                pp_s7_desc: "ウェブサイトは他のプラットフォームやサービスへのリンクを提供する場合があります。それらのサービスのプライバシーポリシーは別途適用されます。",
                pp_s8_title: "ポリシーの変更",
                pp_s8_desc: "このプライバシーポリシーはいつでも更新される場合があります。変更はこのページに表示されます。",
                pp_s9_title: "お問い合わせ",
                pp_s9_desc: "プライバシーまたはMKT4Xファンクラブについてご質問がある場合は、以下までお問い合わせください：",
                pp_thanks: "MKT4Xを応援してくださりありがとうございます。",
            },
            my: {
                menu_home:"Utama", menu_news:"Berita", menu_sch:"Jadual", menu_member:"Ahli", menu_release:"Rilis", menu_fanclub:"Kelab Peminat", menu_login:"Log Masuk",
                pp_title: "Dasar Privasi",
                pp_updated: "Terakhir dikemas kini: 27 Jun 2026",
                pp_intro: "Selamat datang ke Laman Web Rasmi MKT4X. Kami menghargai privasi pelawat dan berkomitmen untuk melindungi maklumat yang diberikan semasa menggunakan laman web ini.",
                pp_s1_title: "Maklumat yang Kami Kumpulkan",
                pp_s1_desc: "Apabila anda menggunakan ciri tertentu di laman web, termasuk menyertai Kelab Peminat MKT4X, kami mungkin mengumpulkan maklumat berikut:",
                pp_s1_l1: "Alamat emel",
                pp_s1_l2: "Nama paparan atau nama pengguna (jika diisi)",
                pp_s1_l3: "Data yang dihantar melalui borang",
                pp_s1_l4: "Maklumat penggunaan laman web asas (seperti statistik lawatan)",
                pp_s2_title: "Tujuan Penggunaan Maklumat",
                pp_s2_desc: "Maklumat yang dikumpulkan digunakan untuk:",
                pp_s2_l1: "Mengurus pendaftaran dan keahlian Kelab Peminat MKT4X",
                pp_s2_l2: "Menghantar kemas kini, berita, dan pengumuman rasmi MKT4X",
                pp_s2_l3: "Memberikan pengalaman penggunaan laman web yang lebih baik",
                pp_s2_l4: "Menjawab soalan atau permintaan pengguna",
                pp_s3_title: "Perlindungan Data",
                pp_s3_desc: "Kami berusaha menjaga keselamatan maklumat pengguna dan mencegah akses yang tidak dibenarkan. Walau bagaimanapun, tiada sistem digital yang dapat menjamin keselamatan sepenuhnya.",
                pp_s4_title: "Perkongsian Maklumat",
                pp_s4_desc: "MKT4X tidak menjual atau memperdagangkan maklumat peribadi pengguna kepada pihak lain. Data hanya digunakan untuk keperluan operasional laman web dan pengurusan perkhidmatan Kelab Peminat.",
                pp_s5_title: "Kuki dan Teknologi Serupa",
                pp_s5_desc: "Laman web ini mungkin menggunakan kuki atau teknologi serupa untuk membantu meningkatkan pengalaman pengguna dan memahami aktiviti pelawat.",
                pp_s6_title: "Hak Pengguna",
                pp_s6_desc: "Pengguna berhak untuk:",
                pp_s6_l1: "Mengemas kini maklumat yang telah diberikan",
                pp_s6_l2: "Meminta penghapusan data Kelab Peminat",
                pp_s6_l3: "Berhenti menerima kemas kini pada bila-bila masa",
                pp_s7_title: "Pautan Luaran",
                pp_s7_desc: "Laman web mungkin menyediakan pautan ke platform atau perkhidmatan lain. Dasar privasi perkhidmatan tersebut terpakai secara berasingan.",
                pp_s8_title: "Perubahan Dasar",
                pp_s8_desc: "Dasar Privasi ini boleh dikemas kini pada bila-bila masa. Perubahan akan dipaparkan di halaman ini.",
                pp_s9_title: "Hubungi Kami",
                pp_s9_desc: "Jika mempunyai soalan mengenai privasi atau Kelab Peminat MKT4X, sila hubungi:",
                pp_thanks: "Terima kasih kerana menyokong MKT4X.",
            }
        };

        window.applyLanguage = function(lang) {
            localStorage.setItem('selectedLang', lang);
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (dict[lang] && dict[lang][key]) el.innerText = dict[lang][key];
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
              
