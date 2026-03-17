// ==============================
// FOOTER JS – AUTO LOAD UNTUK SEMUA HALAMAN
// ==============================

const footer = document.getElementById("footer-placeholder");

if (footer) {
  // Tentukan path footer.html otomatis
  // Jika halaman ada di subfolder seperti /pages/ → pakai ../components/
  // Jika halaman di root → pakai components/
  let path = location.pathname.split("/").length > 2 ? "../components/footer.html" : "components/footer.html";

  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error("Gagal load footer: " + path);
      return res.text();
    })
    .then(data => {
      footer.innerHTML = data;
    })
    .catch(err => console.error(err));
}
