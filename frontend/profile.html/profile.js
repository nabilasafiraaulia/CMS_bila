const API_URL = 'http://localhost:3000/api/artikel';

document.addEventListener("DOMContentLoaded", () => {
    tampilArtikelHalamanDepan();
});

// Fungsi mengambil data asli dari database MySQL untuk halaman depan utama
async function tampilArtikelHalamanDepan() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // MENYESUAIKAN: Menembak langsung ke id="artikel" sesuai HTML asli kamu
        const container = document.getElementById("artikel"); 
        
        if (!container) {
            console.error("Elemen id='artikel' tidak ditemukan di profile.html");
            return;
        }

        container.innerHTML = ""; 

        if (data.length === 0) {
            container.innerHTML = `<p class="article-empty-message">Belum ada artikel yang diterbitkan.</p>`;
            return;
        }

        // Looping data dari MySQL agar me-render card putih melengkung cantik
        data.forEach((artikel) => {
            const card = `
                <div class="card-artikel">
                    <h3>${artikel.judul}</h3>
                    <p>${artikel.konten}</p>
                    <small>📅 ${artikel.tanggal}</small>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Gagal memuat artikel di halaman depan:", error);
    }
}