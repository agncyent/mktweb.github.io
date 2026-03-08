document.addEventListener("DOMContentLoaded", function() {
    
    // 1. FUNGSI PANGGIL NAVBAR & FOOTER (SATSET!)
    // Script ini otomatis deteksi apakah file ada di folder luar atau di dalam folder /members
    const isSubFolder = window.location.pathname.includes('/members/');
    const prefix = isSubFolder ? '../' : '';

    // Panggil Navbar
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        fetch(prefix + 'components/navbar.html')
            .then(res => res.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
            })
            .catch(err => console.error("Gagal ambil navbar:", err));
    }

    // Panggil Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch(prefix + 'components/footer.html')
            .then(res => res.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }

    // 2. FUNGSI HERO SLIDER (GESER OTOMATIS 8 FOTO)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;

        function nextSlide() {
            // Sembunyikan slide yang sekarang
            slides[currentSlide].style.display = 'none';
            // Pindah ke slide berikutnya (kalau sudah 8 balik ke 0)
            currentSlide = (currentSlide + 1) % slides.length;
            // Tampilkan slide baru
            slides[currentSlide].style.display = 'block';
        }

        // Jalankan setiap 3 detik (3000ms)
        setInterval(nextSlide, 3000);
    }
});

