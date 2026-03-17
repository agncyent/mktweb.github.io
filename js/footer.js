// =====================================================
// FOOTER LOADER
// =====================================================

const footer = document.getElementById("footer-placeholder");

if (footer) {
  // jika HTML ada di folder /pages/ → pakai ../components/
  // jika HTML di root → pakai components/
  let path = location.pathname.includes("/pages/") ? "../components/footer.html" : "components/footer.html";

  fetch(path)
    .then(res => res.text())
    .then(data => footer.innerHTML = data)
    .catch(err => console.error("Gagal load footer:", err));
}
