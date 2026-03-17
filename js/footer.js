// =====================================================
// FOOTER LOADER
// =====================================================

const footer = document.getElementById("footer-placeholder");

if (footer) {
  fetch("../components/footer.html") // sesuaikan path sesuai struktur folder
    .then(response => response.text())
    .then(data => {
      footer.innerHTML = data;
    })
    .catch(error => {
      console.error("Gagal load footer:", error);
    });
