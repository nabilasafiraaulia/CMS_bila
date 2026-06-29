# Panduan Git & Deployment - Website Profile Pribadi Nabila Safira

Berkas ini memuat langkah-langkah untuk mengunggah proyek ini ke **GitHub** dan melakukan **Deployment** sehingga dapat diakses secara publik dan diinstal sebagai PWA.

---

## Bagian 1: Push ke GitHub

Proyek Anda sudah diinisialisasi sebagai repositori Git lokal dan seluruh berkas penting telah di-commit. Ikuti langkah di bawah ini untuk menghubungkannya ke GitHub Anda:

1. **Buka GitHub**: Masuk ke akun GitHub Anda dan buat repositori baru dengan nama, misalnya, `CMS_bila`. Jangan centang opsi "Add a README file" karena kita sudah memiliki berkas lokal.
2. **Salin URL Repositori**: Salin tautan HTTPS repositori tersebut (misalnya: `https://github.com/username/CMS_bila.git`).
3. **Jalankan Perintah Git**: Buka terminal (PowerShell / Command Prompt) di direktori `c:\CMS_bila`, lalu jalankan perintah berikut:
   ```bash
   # Tambahkan remote origin GitHub Anda
   git remote add origin https://github.com/username/CMS_bila.git
   
   # Ganti branch utama ke main
   git branch -M main
   
   # Push berkas ke GitHub
   git push -u origin main
   ```
   *(Catatan: Ganti `username` dengan nama pengguna GitHub Anda)*

---

## Bagian 2: Deployment Frontend ke Vercel (Sangat Direkomendasikan)

Vercel adalah platform hosting gratis yang secara otomatis mendukung SPA (Single Page Application) dan PWA berbasis HTTPS (syarat wajib agar PWA dapat diinstal di HP/Desktop).

### Langkah Deployment ke Vercel:
1. Hubungkan akun GitHub Anda ke [Vercel](https://vercel.com).
2. Di Dashboard Vercel, klik **Add New** -> **Project**.
3. Pilih repositori `CMS_bila` yang baru saja Anda push ke GitHub, lalu klik **Import**.
4. Pada bagian **Configure Project**:
   - **Framework Preset**: Pilih `Other` atau `Vite` (biarkan default).
   - **Root Directory**: Klik **Edit** dan pilih folder `frontend/profile.html`. Ini sangat penting karena berkas frontend Anda berada di folder tersebut.
5. Klik tombol **Deploy**.
6. Selesai! Vercel akan memberikan tautan web publik (misal: `https://cms-bila.vercel.app`) yang siap dikumpulkan di tugas Anda. Halaman tersebut dapat langsung diinstal sebagai PWA karena sudah menggunakan HTTPS.

---

## Bagian 3: Deployment Frontend ke GitHub Pages (Alternatif)

Jika Anda ingin menggunakan **GitHub Pages**:
1. Buka Repositori `CMS_bila` Anda di GitHub.
2. Pergi ke menu **Settings** -> **Pages**.
3. Pada bagian **Build and deployment** -> **Source**, pilih **Deploy from a branch**.
4. Di bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
5. Karena berkas frontend Anda terletak di dalam folder `frontend/profile.html`, URL web Anda akan menjadi:
   `https://username.github.io/CMS_bila/frontend/profile.html/`
6. Tautan di atas sudah otomatis menggunakan HTTPS dan dapat langsung diinstal sebagai PWA di HP atau Chrome Anda!

---

## Bagian 4: Menjalankan Secara Lokal

Jika Anda ingin menjalankan server lokal kembali di masa mendatang:
- **Backend API**:
  ```bash
  cd c:\CMS_bila\backend
  npm install
  node index.js
  ```
- **Frontend & Static Preview**:
  ```bash
  cd c:\CMS_bila
  node server_preview.js
  ```
  Lalu buka [http://localhost:5000/](http://localhost:5000/) di browser Anda.
