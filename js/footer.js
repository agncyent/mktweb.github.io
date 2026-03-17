// =====================================================
// FOOTER LOADER
// =====================================================

const footer = document.getElementById("footer-placeholder");

if (footer) {
  // path dinamis: root atau subfolder
  let path = location.pathname.includes("/pages/") ? "../components/footer.html" : "components/footer.html";

  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error("Gagal load footer");
      return res.text();
    })
    .then(data => footer.innerHTML = data)
    .catch(err => console.error(err));
}
