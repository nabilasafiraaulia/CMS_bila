const API_URL = 'http://localhost:3000/api/artikel';

// Jalankan fungsi ambil data otomatis saat halaman web dibuka
document.addEventListener("DOMContentLoaded", () => {
    tampilArtikel();
});

// 1. READ: Mengambil data dari MySQL lewat Node.js & menampilkan ke halaman web
async function tampilArtikel() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const listContainer = document.getElementById("listArtikel");
        listContainer.innerHTML = ""; 

        if (data.length === 0) {
            listContainer.innerHTML = `<p class="article-empty-message">Belum ada artikel di database.</p>`;
            return;
        }

        // Susun data dari database ke dalam tampilan dashboard pink kamu
        data.forEach((artikel) => {
            const item = `
                <div class="dashboard-article-card">
                    <h3>${artikel.judul}</h3>
                    <p>${artikel.konten}</p>
                    <small>📅 ${artikel.tanggal}</small>
                    <div class="dashboard-article-actions">
                        <button onclick="siapkanEdit(${artikel.id}, '${escapeHtml(artikel.judul)}', '${escapeHtml(artikel.konten)}')" class="btn-edit-secondary">Edit</button>
                        <button onclick="hapusArtikel(${artikel.id})" class="btn-delete-secondary">Hapus</button>
                    </div>
                </div>
            `;
            listContainer.innerHTML += item;
        });
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// 2. CREATE & UPDATE: Fungsi saat tombol "Simpan Artikel" diklik
async function simpanData() {
    const id = document.getElementById("artikelId").value;
    const judul = document.getElementById("judul").value;
    const konten = document.getElementById("isi").value; // Membaca id="isi" dari cms.html kamu

    if (!judul || !konten) {
        alert("Judul dan Isi artikel tidak boleh kosong!");
        return;
    }

    const bodyData = { judul, konten };
    if (id) bodyData.id = id; 

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        });

        const result = await response.json();
        
        if (result.status === "success") {
            showToast(result.message);
            resetForm();
            tampilArtikel(); // Data langsung muncul di web secara instan tanpa reload!
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (error) {
        console.error("Error saat menyimpan data:", error);
    }
}

// 3. DELETE: Menghapus Artikel dari Database
async function hapusArtikel(id) {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (result.status === "success") {
                showToast(result.message);
                tampilArtikel(); 
            } else {
                alert("Gagal menghapus: " + result.message);
            }
        } catch (error) {
            console.error("Error saat menghapus data:", error);
        }
    }
}

// Fungsi bantu memindahkan data ke form atas ketika tombol "Edit" diklik
function siapkanEdit(id, judul, konten) {
    document.getElementById("artikelId").value = id;
    document.getElementById("judul").value = judul;
    document.getElementById("isi").value = konten;
    
    document.getElementById("btnSimpan").innerText = "Perbarui Artikel";
}

// Mengembalikan form ke keadaan semula setelah simpan/edit selesai
function resetForm() {
    document.getElementById("artikelId").value = "";
    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";
    document.getElementById("btnSimpan").innerText = "Simpan Artikel";
}

// Fungsi memunculkan teks notifikasi di bagian <div id="toast"> bawaan kamu
function showToast(pesan) {
    const toast = document.getElementById("toast");
    toast.innerText = "✨ " + pesan;
    toast.style.color = "#3A302E";
    setTimeout(() => {
        toast.innerText = "";
    }, 3000);
}

// Mengamankan teks inputan agar tidak merusak HTML website
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}