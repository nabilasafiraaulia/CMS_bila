import { popIn } from './animations.js';

export class HomeView {
    constructor() {
        this.typingInterval = null;
    }

    render(container, state) {
        // Render Navbar
        const navbarHtml = `
            <a href="#/" class="active">🏠 Beranda</a>
            <a href="#/profil">👤 Profil</a>
            <a href="#/about">📖 About Me</a>
            <a href="#/goals">🎯 Goals</a>
            <a href="#/favorite">💗 Favorite</a>
            <a href="#/artikel-section">📝 Artikel</a>
            <a href="#/contact">☎️ Contact</a>
            ${state.isLoggedIn ? `
                <a href="#/cms" style="background: var(--color-maroon); color: white;" class="glitter-shimmer">🛠️ Dashboard CMS</a>
                <a href="#" id="nav-logout-btn" style="background: var(--color-milk-chocolate); color: white;">🚪 Logout</a>
            ` : `
                <a href="#/login" style="background: linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark)); color: white; padding: 10px 16px; border-radius: 24px;" class="glitter-shimmer">🔐 Login</a>
            `}
        `;

        // Render main content
        const contentHtml = `
            <!-- Floating Background Glows -->
            <div class="bg-glow-container">
                <div class="bg-glow-blob bg-glow-maroon"></div>
                <div class="bg-glow-blob bg-glow-chocolate"></div>
                <div class="bg-glow-blob bg-glow-gold"></div>
            </div>

            ${state.isLoggedIn ? `
                <div class="admin-bar" style="background: var(--color-creamy-latte); color: var(--color-text-dark); padding: 12px; text-align: center; font-size: 14px; font-weight: 600; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 10px rgba(142,111,86,0.06); border-radius: 24px; border: 1px solid var(--color-border);">
                    <span>⚡ Mode Admin Aktif (Login Berhasil)</span>
                    <a href="#/cms" style="color: white; background: var(--color-maroon); padding: 6px 14px; border-radius: 20px; text-decoration: none; font-size: 12px; transition: .2s; font-weight: 700; box-shadow: 0 4px 10px var(--color-maroon-glass);" class="glitter-shimmer">🛠️ Kembali ke CMS Dashboard</a>
                </div>
            ` : ''}

            <div class="navbar" id="spa-navbar">
                ${navbarHtml}
            </div>

            <div class="container">
                <!-- HEADER -->
                <div class="header" id="profil">
                    <h1 id="judul" style="font-family: 'Poppins', sans-serif;" class="sparkle-text">Nabila Safira Aulia Zaky</h1>
                    <p id="typing2" style="font-family: 'Poppins', sans-serif; min-height: 35px;"></p>

                    <div class="profile" style="position: relative; display: inline-block;">
                        <div class="profile-glitter-container">
                            <img
                                id="home-avatar"
                                src="${state.profilePic}"
                                alt="Foto Nabila"
                                style="view-transition-name: profile-avatar; cursor: pointer; border: 6px solid white; box-shadow: 0 12px 25px rgba(0,0,0,0.1); border-radius: 50%; transition: transform 0.3s; display: block;"
                            >
                        </div>
                        <div class="avatar-overlay" style="position: absolute; bottom: 12px; right: 12px; background: var(--color-maroon); width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; cursor: pointer; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" class="glitter-shimmer">
                            📷
                        </div>
                    </div>
                </div>

                <!-- CONTENT -->
                <div class="content">
                    <!-- ABOUT -->
                    <section id="about" class="animate-on-scroll" style="margin-top: 40px;">
                        <h2>Tentang Saya</h2>
                        <p>
                             Halo semuanya 👋<br><br>
                            Perkenalkan saya <b>Nabila Safira Aulia Zaky</b>, 
                            mahasiswa Program Studi Informatika, 
                            Universitas Nahdlatul Ulama Al-Ghazali Cilacap.<br><br>
                            Saat ini saya berusia <span id="umur">20</span> tahun 
                            dan tinggal di Cilacap, Jawa Tengah.<br><br>
                            Saya memiliki ketertarikan pada dunia teknologi, desain website, 
                            dan pengembangan aplikasi modern 💻✨
                        </p>
                    </section>

                    <!-- GRID -->
                    <div class="grid">
                        <!-- HOBI -->
                        <div class="card animate-on-scroll">
                            <h2>Hobi</h2>
                            <ul>
                                <li>Traveling ✈️</li>
                                <li>Menyanyi 🎤</li>
                                <li>Memasak 🍳</li>
                                <li>Menonton Film 🎬</li>
                            </ul>
                        </div>

                        <!-- GOALS -->
                        <div class="card animate-on-scroll" id="goals">
                            <h2>Goals</h2>
                            <ol>
                                <li>Lulus tepat waktu</li>
                                <li>Menjadi orang sukses</li>
                                <li>Membahagiakan orang tua</li>
                                <li>Punya bisnis sendiri</li>
                            </ol>
                        </div>
                    </div>

                    <!-- FAVORITE -->
                    <section id="favorite" class="animate-on-scroll" style="margin-top: 50px;">
                        <h2>Favorite Things</h2>
                        <table>
                            <tr>
                                <th>Kategori</th>
                                <th>Favorit</th>
                            </tr>
                            <tr>
                                <td>Makanan</td>
                                <td>Salad Sayur dan salad buah</td>
                            </tr>
                            <tr>
                                <td>Warna</td>
                                <td>Pink, Hitam, Ungu</td>
                            </tr>
                            <tr>
                                <td>Film</td>
                                <td>Drama Korea</td>
                            </tr>
                            <tr>
                                <td>Buku</td>
                                <td>Novel Romance</td>
                            </tr>
                        </table>
                    </section>

                    <!-- ARTIKEL -->
                    <section class="artikel-section animate-on-scroll" id="artikel-section" style="margin-top: 50px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                            <h2>Artikel Saya</h2>
                            <button id="btn-open-camera" class="btn-rose-action glitter-shimmer">🎥 Story Camera</button>
                        </div>
                        <div id="artikel-list">
                            <!-- Articles will render here -->
                        </div>
                    </section>

                    <!-- CONTACT -->
                    <section class="contact animate-on-scroll" id="contact" style="margin-top: 60px; margin-bottom: 60px;">
                        <h2>Contact Me</h2>
                        <form id="formKontak">
                            <label>Email</label>
                            <input type="email" id="email" placeholder="contoh@gmail.com">

                            <label>Phone Number</label>
                            <input type="text" id="phone" placeholder="+62 81234567890">

                            <div class="form-row">
                                <div>
                                    <label>Company Name</label>
                                    <input type="text" id="company" placeholder="Nama perusahaan">
                                </div>
                                <div>
                                    <label>Number of Employees</label>
                                    <select id="employees">
                                        <option>Pilih jumlah</option>
                                        <option>1-10</option>
                                        <option>11-50</option>
                                        <option>51-100</option>
                                    </select>
                                </div>
                            </div>

                            <label>Solutions</label>
                            <select id="solutions">
                                <option>Pilih solusi</option>
                                <option>Website</option>
                                <option>Mobile App</option>
                                <option>UI/UX Design</option>
                            </select>

                            <label>Pesan</label>
                            <textarea id="pesan" placeholder="Tulis pesan..."></textarea>

                            <button type="button" id="btn-kirim-pesan" class="glitter-shimmer">
                                Kirim
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        `;

        container.innerHTML = contentHtml;
        this.startTypingEffect();
    }

    startTypingEffect() {
        const text = "Mahasiswi Informatika | Web Developer";
        const el = document.getElementById("typing2");
        if (!el) return;

        let charIndex = 0;
        let isDeleting = false;
        
        clearInterval(this.typingInterval);

        const type = () => {
            if (!el) return;
            const cursor = `<span style="border-right: 3px solid var(--color-maroon); margin-left: 2px; animation: blink 0.8s infinite;"></span>`;
            if (isDeleting) {
                el.innerHTML = text.substring(0, charIndex - 1) + cursor;
                charIndex--;
            } else {
                el.innerHTML = text.substring(0, charIndex + 1) + cursor;
                charIndex++;
            }

            let speed = isDeleting ? 40 : 100;

            if (!isDeleting && charIndex === text.length) {
                speed = 2500; // Hold at the end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                speed = 800; // Pause before typing again
            }

            this.typingInterval = setTimeout(type, speed);
        };

        type();
    }

    destroy() {
        clearTimeout(this.typingInterval);
    }

    renderArticles(articles) {
        const container = document.getElementById("artikel-list");
        if (!container) return;

        container.innerHTML = "";

        if (articles.length === 0) {
            container.innerHTML = `<p style="text-align:center; color: var(--color-text-muted);">Belum ada artikel yang diterbitkan.</p>`;
            return;
        }

        articles.forEach((artikel) => {
            const card = document.createElement('div');
            card.className = 'card-artikel-item';
            card.style.cssText = `
                background: var(--color-creamy-latte); 
                padding: 24px; 
                margin-bottom: 24px; 
                border-radius: 20px; 
                box-shadow: 0 8px 20px rgba(142,111,86,0.06); 
                border: 1px solid var(--color-border);
                transition: transform 0.3s, box-shadow 0.3s;
            `;
            card.innerHTML = `
                <h3 style="color: var(--color-maroon); margin-top: 0; margin-bottom: 12px; font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700;">${artikel.judul}</h3>
                <p style="color: var(--color-text-dark); margin-bottom: 15px; font-size: 15px; line-height: 1.8;">${artikel.konten}</p>
                <small style="color: var(--color-text-muted); display: block; font-weight: 500;">📅 ${new Date(artikel.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</small>
            `;
            container.appendChild(card);
        });
    }

    bindEvents(presenter) {
        // Navigation to Camera Booth when Avatar is clicked
        const avatar = document.getElementById("home-avatar");
        const overlay = document.querySelector(".avatar-overlay");
        const handler = (e) => {
            popIn(avatar);
            setTimeout(() => {
                window.location.hash = "#/camera";
            }, 150);
        };
        if (avatar) avatar.addEventListener("click", handler);
        if (overlay) overlay.addEventListener("click", handler);

        const btnOpenCamera = document.getElementById("btn-open-camera");
        if (btnOpenCamera) {
            btnOpenCamera.addEventListener("click", () => {
                popIn(btnOpenCamera);
                setTimeout(() => {
                    window.location.hash = "#/cms";
                }, 120);
            });
        }

        // Form Submit
        const btnKirim = document.getElementById("btn-kirim-pesan");
        if (btnKirim) {
            btnKirim.addEventListener("click", () => {
                popIn(btnKirim);
                const email = document.getElementById("email").value;
                const phone = document.getElementById("phone").value;
                const pesan = document.getElementById("pesan").value;
                presenter.submitContactForm({ email, phone, pesan });
            });
        }

        // Logout
        const btnLogout = document.getElementById("nav-logout-btn");
        if (btnLogout) {
            btnLogout.addEventListener("click", (e) => {
                e.preventDefault();
                presenter.logout();
            });
        }
    }
}

export class LoginView {
    render(container) {
        const loginHtml = `
            <div class="login-page">
                <div class="glow glow1"></div>
                <div class="glow glow2"></div>
 
                <div class="login-card" style="border: 1px solid var(--color-border); max-width: 380px;">
                    <div class="login-icon">🔐</div>
                    <h1>Login CMS</h1>
                    <p style="margin-bottom: 24px;">Masuk untuk mengelola artikel website pribadi</p>
 
                    <div style="text-align: left; margin-bottom: 15px;">
                        <label style="margin-top: 0; font-size: 13px; color: var(--color-text-dark);">Username</label>
                        <input type="text" id="username" placeholder="Masukkan username" style="background: var(--color-creamy-input); border: 1px solid var(--color-border); margin-top: 5px;">
                    </div>
 
                    <div style="text-align: left; margin-bottom: 20px;">
                        <label style="margin-top: 0; font-size: 13px; color: var(--color-text-dark);">Password</label>
                        <input type="password" id="password" placeholder="Masukkan password" style="background: var(--color-creamy-input); border: 1px solid var(--color-border); margin-top: 5px;">
                    </div>
 
                    <button id="btn-login" class="btn-rose-control btn-full glitter-shimmer">
                        Login
                    </button>
 
                    <div class="demo-login" style="background: rgba(245, 239, 235, 0.5); border: 1px solid var(--color-border); border-radius: 14px; padding: 12px; margin-top: 20px;">
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted);">Demo Login</span>
                        <h3 style="margin-top: 4px; font-size: 13px; color: var(--color-maroon);">
                           Username : <b>admin</b><br>
                           Password : <b>123</b>
                        </h3>
                    </div>
 
                    <a href="#/" class="back-profile" style="margin-top: 20px; font-weight: 600;">
                        ← Kembali ke Beranda
                    </a>
                </div>
            </div>
        `;
        container.innerHTML = loginHtml;
    }
 
    bindEvents(presenter) {
        const btnLogin = document.getElementById("btn-login");
        if (btnLogin) {
            btnLogin.addEventListener("click", () => {
                popIn(btnLogin);
                const user = document.getElementById("username").value;
                const pass = document.getElementById("password").value;
                presenter.handleLogin(user, pass);
            });
        }
 
        // Support Enter key
        const inputs = [document.getElementById("username"), document.getElementById("password")];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        btnLogin.click();
                    }
                });
            }
        });
    }
}
 
export class CmsView {
    constructor() {
        this._map = null;
    }
 
    render(container, state) {
        const cmsHtml = `
            <div class="cms-shell">
                <aside class="sidebar">
                    <div>
                        <div class="brand brand-sparkle-container">
                            <h2 style="color: white;">CMS Dashboard</h2>
                            <p style="color: rgba(255,255,255,0.85); margin-top: 4px;">Nabila Safira</p>
                        </div>
 
                        <nav class="cms-menu">
                            <button type="button" class="menu-link active" data-section="overview">📊 Dashboard Overview</button>
                            <a href="#/" class="menu-link">👁️ Lihat Profil / Web</a>
                            <button type="button" class="menu-link" data-section="manajemen">📝 Manajemen Artikel</button>
                            <button type="button" class="menu-link" data-section="riwayat">🕒 Riwayat Artikel</button>
                        </nav>
                    </div>
 
                    <button class="logout-btn glitter-shimmer" id="btn-logout">Logout</button>
                </aside>
 
                <main class="cms-main">
                    <section class="cms-topbar">
                        <p class="eyebrow">Panel Kontrol</p>
                        <h1>Dashboard Konten</h1>
                        <p class="subtext">Kelola artikel, kamera web, dan riwayat publikasi dalam tampilan admin yang elegan.</p>
                    </section>
 
                    <section id="section-overview" class="cms-section cms-section--active">
                        <div class="overview-summary-grid">
                            <div class="summary-card">
                                <span>Status Akun</span>
                                <strong>Administrator</strong>
                            </div>
                            <div class="summary-card">
                                <span>Total Artikel</span>
                                <strong id="stat-total">-</strong>
                            </div>
                            <div class="summary-card">
                                <span>Artikel Terbaru</span>
                                <strong id="stat-latest">-</strong>
                            </div>
                        </div>

                        <div class="panel panel--map" style="margin-top: 24px; margin-bottom: 24px;">
                            <div class="panel-header">
                                <h2>Peta Sebaran Artikel</h2>
                                <span>Lokasi geografis penulisan artikel di peta interaktif.</span>
                            </div>
                            <div class="panel-body">
                                <div id="map" class="map-container"></div>
                            </div>
                        </div>

                        <div class="panel panel--list">
                            <div class="panel-header">
                                <h2>Ringkasan Konten</h2>
                                <span>Artikel terbaru yang telah dikelola dan ringkasan cepat.</span>
                            </div>
                            <div class="panel-body" id="recentArtikel"></div>
                        </div>
                    </section>

                    <section id="section-manajemen" class="cms-section">
                        <div class="content-grid">
                            <div class="panel">
                                <div class="panel-header">
                                    <h2 id="form-title">Buat Postingan Artikel Baru</h2>
                                    <span>Isi detail artikel dan simpan dengan mudah di sini.</span>
                                </div>
                                <div class="panel-body">
                                    <input type="hidden" id="artikelId">
                                    <div class="form-group">
                                        <label for="judul">Judul Artikel</label>
                                        <input class="input-field" type="text" id="judul" placeholder="Masukkan judul artikel">
                                    </div>
                                    <div class="form-group">
                                        <label for="isi">Isi Artikel</label>
                                        <textarea class="textarea-field" id="isi" placeholder="Tulis isi artikel..."></textarea>
                                    </div>

                                    <div class="camera-embed-card">
                                        <div class="panel-header camera-section-header">
                                            <h3>Ambil Gambar via Kamera Web</h3>
                                            <span>Gunakan webcam untuk menangkap gambar dan simpan bersama artikel.</span>
                                        </div>
                                        <div id="camera-module"></div>
                                        <input type="hidden" id="gambarData">
                                    </div>

                                    <!-- Geolocation Capture Status -->
                                    <p id="geo-status" class="geo-status"></p>

                                    <div class="form-actions">
                                        <button class="save-btn" id="btn-save">Simpan Artikel</button>
                                        <button id="btn-reset" class="btn-reset">Batal</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section id="section-riwayat" class="cms-section">
                        <div class="panel">
                            <div class="panel-header">
                                <h2>Daftar Riwayat Publikasi Artikel</h2>
                                <span>Tabel publikasi artikel dengan aksi edit dan hapus.</span>
                            </div>
                            <div class="panel-body">
                                <div class="search-bar">
                                    <input class="search-input" type="text" id="search-input" placeholder="🔍 Cari artikel berdasarkan judul atau isi...">
                                </div>
                                <div class="table-wrapper">
                                    <table class="history-table">
                                        <thead>
                                            <tr>
                                                <th>Judul</th>
                                                <th>Foto</th>
                                                <th>Preview</th>
                                                <th>Tanggal</th>
                                                <th>Lokasi</th>
                                                <th>Status</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody id="history-tbody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `;
        container.innerHTML = cmsHtml;
    }

    updateStats(total, latestTitle) {
        const totalEl = document.getElementById("stat-total");
        const latestEl = document.getElementById("stat-latest");
        if (totalEl) totalEl.innerText = total;
        if (latestEl) latestEl.innerText = latestTitle;
    }

    renderRecentArticles(articles) {
        const container = document.getElementById("recentArtikel");
        if (!container) return;

        container.innerHTML = "";

        if (articles.length === 0) {
            container.innerHTML = `<p class="empty">Belum ada artikel yang diterbitkan.</p>`;
            return;
        }

        articles.slice(0, 3).forEach((item) => {
            const card = document.createElement("div");
            card.className = "article-card";
            card.innerHTML = `
                <h3>${item.judul}</h3>
                <p>${item.konten.substring(0, 140)}${item.konten.length > 140 ? '...' : ''}</p>
                <small>📅 ${new Date(item.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</small>
                <div class="article-actions">
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="hapus-btn" data-id="${item.id}">Hapus</button>
                </div>
            `;
            container.appendChild(card);
        });

        this.bindArticleActions(articles);
    }

    renderHistoryTable(articles, presenter) {
        this.renderRiwayatArtikel(articles, presenter);
    }

    renderRiwayatArtikel(daftarArtikel, presenter) {
        const tabelBody = document.getElementById('history-tbody');
        if (!tabelBody) return;
        tabelBody.innerHTML = '';

        if (daftarArtikel.length === 0) {
            tabelBody.innerHTML = `<tr><td class="empty" colspan="7">Belum ada riwayat artikel.</td></tr>`;
            return;
        }

        // Set global action for onclick deletion if specified in user HTML template
        window.hapusArtikel = (id) => {
            if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
                if (presenter && typeof presenter.deleteArticle === 'function') {
                    presenter.deleteArticle(id);
                }
            }
        };

        daftarArtikel.forEach((artikel) => {
            const baris = document.createElement('tr');
            const latitude = artikel.lat || artikel.latitude;
            const longitude = artikel.lon || artikel.longitude;

            baris.innerHTML = `
                <td>${artikel.judul}</td>
                <td class="history-thumb-cell">${artikel.gambar ? `<img src="${artikel.gambar}" alt="Foto ${artikel.judul}" class="history-thumb">` : '<span class="no-image-label">Tanpa Foto</span>'}</td>
                <td>${artikel.konten.substring(0, 55)}${artikel.konten.length > 55 ? '...' : ''}</td>
                <td>${new Date(artikel.tanggal).toLocaleDateString('id-ID')}</td>
                <td>
                    ${latitude && longitude 
                        ? `
                            <div class="location-wrapper">
                                <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" class="geo-link" aria-label="Lihat lokasi">
                                    📍 ${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}
                                </a>
                                <button class="copy-coords" data-coords="${latitude},${longitude}" aria-label="Salin koordinat" title="Salin Koordinat">📋</button>
                            </div>
                          `
                        : '<span class="no-location">Tidak ada lokasi</span>'}
                </td>
                <td><span class="status-badge published">Published</span></td>
                <td>
                    <div class="table-actions">
                        <button class="edit-btn" data-id="${artikel.id}">Edit</button>
                        <button class="btn-hapus hapus-btn" onclick="hapusArtikel(${artikel.id})" aria-label="Hapus artikel">Hapus</button>
                    </div>
                </td>
            `;
            tabelBody.appendChild(baris);
        });

        this.bindArticleActions(daftarArtikel, presenter);

        // Bind copy-coords buttons
        const copyBtns = tabelBody.querySelectorAll('.copy-coords');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const coords = btn.getAttribute('data-coords');
                navigator.clipboard.writeText(coords).then(() => {
                    import('./presenters.js').then(m => m.showToast('Koordinat berhasil disalin!', 'success'));
                }).catch(() => {
                    import('./presenters.js').then(m => m.showToast('Gagal menyalin koordinat.', 'error'));
                });
            });
        });
    }

    bindArticleActions(articles, presenter) {
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const artikel = articles.find(a => a.id == id);
                if (artikel) {
                    this.prepareEdit(artikel);
                    this.activateSection('manajemen');
                }
            });
        });

        const deleteButtons = document.querySelectorAll(".hapus-btn");
        deleteButtons.forEach(btn => {
            // Only add event listener if it doesn't already have one, to avoid conflict with onclick
            if (!btn.getAttribute('data-has-listener')) {
                btn.setAttribute('data-has-listener', 'true');
                btn.addEventListener("click", (e) => {
                    // If onclick handled it, ignore
                    if (e.target.hasAttribute('onclick')) return;
                    const id = btn.getAttribute("data-id") || btn.getAttribute("onclick")?.match(/\d+/)?.[0];
                    if (id && confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
                        if (presenter && typeof presenter.deleteArticle === 'function') {
                            presenter.deleteArticle(id);
                        }
                    }
                });
            }
        });
    }

    activateSection(sectionId) {
        const sections = document.querySelectorAll('.cms-section');
        sections.forEach(section => {
            section.classList.toggle('cms-section--active', section.id === `section-${sectionId}`);
        });

        const menuLinks = document.querySelectorAll('.cms-menu .menu-link');
        menuLinks.forEach(link => {
            const target = link.getAttribute('data-section');
            if (target) {
                link.classList.toggle('active', target === sectionId);
            }
        });
    }

    prepareEdit(artikel) {
        document.getElementById("artikelId").value = artikel.id;
        document.getElementById("judul").value = artikel.judul;
        document.getElementById("isi").value = artikel.konten;
        document.getElementById("form-title").innerText = "✍️ Edit Artikel";
        document.getElementById("btn-save").innerText = "Perbarui Artikel";
        document.getElementById("gambarData").value = artikel.gambar || "";
        
        // Restore coordinates if editing
        const statusEl = document.getElementById("geo-status");
        if (statusEl) {
            if (artikel.lat && artikel.lon) {
                statusEl.innerText = `📍 Lokasi tersimpan: ${parseFloat(artikel.lat).toFixed(4)}, ${parseFloat(artikel.lon).toFixed(4)}`;
                statusEl.className = 'geo-status geo-status--ok';
                statusEl.setAttribute('data-lat', artikel.lat);
                statusEl.setAttribute('data-lon', artikel.lon);
            } else {
                statusEl.innerText = '⚠️ Artikel ini tidak memiliki lokasi geografis.';
                statusEl.className = 'geo-status geo-status--off';
                statusEl.removeAttribute('data-lat');
                statusEl.removeAttribute('data-lon');
            }
        }

        const preview = document.getElementById("camera-preview");
        if (preview) {
            if (artikel.gambar) {
                preview.src = artikel.gambar;
                preview.style.display = "block";
            } else {
                preview.src = "";
                preview.style.display = "none";
            }
        }

        const btnReset = document.getElementById("btn-reset");
        if (btnReset) btnReset.style.display = "inline-block";

        window.scrollTo({ top: document.getElementById("form-title").offsetTop - 40, behavior: 'smooth' });
    }

    resetForm() {
        document.getElementById("artikelId").value = "";
        document.getElementById("judul").value = "";
        document.getElementById("isi").value = "";
        document.getElementById("gambarData").value = "";
        document.getElementById("form-title").innerText = "✍️ Tambah Artikel";
        document.getElementById("btn-save").innerText = "Simpan Artikel";
        
        const statusEl = document.getElementById("geo-status");
        if (statusEl) {
            statusEl.innerText = '';
            statusEl.className = 'geo-status';
            statusEl.removeAttribute('data-lat');
            statusEl.removeAttribute('data-lon');
        }

        const preview = document.getElementById("camera-preview");
        if (preview) {
            preview.src = "";
            preview.style.display = "none";
        }

        const btnReset = document.getElementById("btn-reset");
        if (btnReset) btnReset.style.display = "none";
    }

    bindEvents(presenter) {
        const btnSave = document.getElementById("btn-save");
        if (btnSave) {
            btnSave.addEventListener("click", () => {
                popIn(btnSave);
                const id = document.getElementById("artikelId").value;
                const judul = document.getElementById("judul").value;
                const konten = document.getElementById("isi").value;
                const gambar = document.getElementById("gambarData")?.value || '';
                
                const statusEl = document.getElementById("geo-status");
                const lat = statusEl ? statusEl.getAttribute('data-lat') : null;
                const lon = statusEl ? statusEl.getAttribute('data-lon') : null;
                
                presenter.saveArticle({ id, judul, konten, gambar, lat, lon });
            });
        }

        const btnClearCamera = document.getElementById("btn-clear-camera");
        if (btnClearCamera) {
            btnClearCamera.addEventListener("click", () => {
                const gambarField = document.getElementById("gambarData");
                if (gambarField) gambarField.value = "";
                const preview = document.getElementById("camera-preview");
                if (preview) preview.style.display = "none";
                presenter.cameraPresenter?.resumeCamera?.();
            });
        }

        const btnReset = document.getElementById("btn-reset");
        if (btnReset) {
            btnReset.addEventListener("click", () => {
                this.resetForm();
            });
        }

        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                presenter.logout();
            });
        }

        const menuLinks = document.querySelectorAll('.cms-menu .menu-link[data-section]');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                const section = link.getAttribute('data-section');
                if (section) {
                    this.activateSection(section);
                    // If we navigate to overview section, re-render map to handle invalidateSize
                    if (section === 'overview' && this._map) {
                        setTimeout(() => this._map.invalidateSize(), 150);
                    }
                    if (presenter && typeof presenter.handleSectionChange === 'function') {
                        presenter.handleSectionChange(section);
                    }
                }
            });
        });

        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                presenter.handleSearch(e.target.value);
            });
        }
    }

    async renderMap(articles) {
        const mapEl = document.getElementById("map");
        if (!mapEl) return;

        if (this._map) {
            this._map.remove();
            this._map = null;
        }

        const { createMap, photoIcon } = await import('./utils/map.js');

        const validArticles = articles.filter(a => {
            const lat = parseFloat(a.lat || a.latitude);
            const lon = parseFloat(a.lon || a.longitude);
            return !isNaN(lat) && !isNaN(lon);
        });

        const defaultCenter = [-7.447, 109.236];
        this._map = await createMap(mapEl, { center: defaultCenter, zoom: 10 });

        if (validArticles.length === 0) {
            return;
        }

        const L = window.L;
        const markers = [];

        validArticles.forEach(item => {
            const lat = parseFloat(item.lat || item.latitude);
            const lon = parseFloat(item.lon || item.longitude);
            
            const marker = L.marker([lat, lon], { icon: photoIcon() }).addTo(this._map);
            
            const popupHtml = `
                <div class="map-popup">
                    <h4 class="map-popup_title" style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-weight: bold; color: var(--color-maroon);">${item.judul}</h4>
                    ${item.gambar ? `<img src="${item.gambar}" class="map-popup_img" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 6px; margin-top: 4px; display: block;">` : ''}
                    <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">${item.konten.substring(0, 75)}...</p>
                </div>
            `;
            marker.bindPopup(popupHtml);
            markers.push([lat, lon]);
        });

        if (markers.length > 0) {
            try {
                this._map.fitBounds(markers, { padding: [35, 35] });
            } catch (err) {
                console.warn('Gagal menyesuaikan batas peta:', err);
            }
        }

        setTimeout(() => {
            if (this._map) this._map.invalidateSize();
        }, 200);
    }

    beforeLeave() {
        if (this._map) {
            try {
                this._map.remove();
                console.log('[CmsView] Map removed successfully (beforeLeave)');
            } catch (err) {
                console.warn('[CmsView] Error removing map:', err);
            }
            this._map = null;
        }
    }
}

export class CameraView {
    render(container, state) {
        const cameraHtml = `
            <div class="login-page" style="min-height: 100vh; padding: 40px 20px;">
                <div class="glow glow1"></div>
                <div class="glow glow2"></div>

                <div class="login-card" style="max-width: 680px; width: 100%; padding: 30px; border-radius: 28px; border: 1px solid var(--color-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h1 style="font-size: 24px; text-align: left; margin: 0; color: var(--color-maroon);">📷 Story Camera</h1>
                        <a href="#/" class="back-profile" style="margin: 0; font-weight: 600;">← Kembali</a>
                    </div>
                    
                    <div class="camera-stream-box" style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); border: 4px solid white;">
                        <!-- Video stream (Shared element) -->
                        <video id="camera-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; view-transition-name: profile-avatar;"></video>
                        
                        <!-- Captured preview image -->
                        <img id="camera-preview" style="width: 100%; height: 100%; object-fit: cover; display: none;">

                        <!-- Active filters preview indicator -->
                        <div id="filter-indicator" style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.65); color: white; padding: 6px 12px; border-radius: 30px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: none;">
                            Filter: None
                        </div>
                    </div>

                    <!-- ERROR CONTAINER -->
                    <div id="camera-error" style="display: none; background: var(--color-creamy-input); border: 1px solid var(--color-border); color: var(--color-text-dark); padding: 15px; border-radius: 16px; margin-top: 15px; font-size: 14px; text-align: center;">
                        Gagal mengakses kamera. Pastikan browser diizinkan mengakses kamera perangkat Anda.
                    </div>

                    <!-- CAMERA CONTROLS -->
                    <div id="stream-controls" style="margin-top: 25px;">
                        <div class="form-row" style="margin-bottom: 20px; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <label style="text-align: left; font-size: 13px; color: var(--color-text-muted); margin-top: 0;">Pilih Perangkat Kamera</label>
                                <select id="camera-select" style="background: white; border: 1px solid var(--color-border); padding: 12px; font-size: 13px; border-radius: 12px; margin-top: 5px;">
                                    <option>Memuat kamera...</option>
                                </select>
                            </div>
                            <div>
                                <label style="text-align: left; font-size: 13px; color: var(--color-text-muted); margin-top: 0;">Pilihan Filter Piksel</label>
                                <div style="display: flex; gap: 8px; margin-top: 5px;">
                                    <button class="filter-btn active" data-filter="none">Normal</button>
                                    <button class="filter-btn" data-filter="grayscale">Grayscale</button>
                                    <button class="filter-btn" data-filter="sepia">Sepia</button>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: var(--color-creamy-bg); padding: 12px 18px; border-radius: 14px; border: 1px solid var(--color-border);">
                            <span style="font-size: 14px; font-weight: 600; color: var(--color-text-dark);">Tambahkan Watermark Waktu</span>
                            <label class="switch" style="margin: 0; position: relative; display: inline-block; width: 46px; height: 26px;">
                                <input type="checkbox" id="watermark-toggle" checked style="opacity: 0; width: 0; height: 0;">
                                <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 34px;"></span>
                            </label>
                        </div>

                        <div style="display: flex; gap: 15px;">
                            <button id="btn-capture" class="btn-rose-action glitter-shimmer">📷 Ambil Foto</button>
                        </div>
                    </div>

                    <!-- PREVIEW CONTROLS (Initially Hidden) -->
                    <div id="preview-controls" style="margin-top: 25px; display: none;">
                        <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                            <button id="btn-save-profile" class="btn-rose-control glitter-shimmer">👤 Jadikan Foto Profil</button>
                            <button id="btn-download" class="btn-rose-control-alt glitter-shimmer">📥 Unduh Foto PNG</button>
                        </div>
                        <button id="btn-retry" class="btn-secondary-action">🔄 Ambil Ulang Foto</button>
                    </div>

                </div>
            </div>
        `;
        container.innerHTML = cameraHtml;

        // Custom style for switch slider
        const style = document.createElement('style');
        style.textContent = `
            .switch input:checked + .slider { background-color: var(--color-maroon); }
            .switch input:focus + .slider { box-shadow: 0 0 1px var(--color-maroon); }
            .switch input:checked + .slider:before { transform: translateX(20px); }
            .slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px;
                background-color: white; transition: .3s; border-radius: 50%;
            }
            .filter-btn.active { background: var(--color-maroon) !important; color: white !important; font-weight: 600; }
        `;
        document.head.appendChild(style);
    }

    renderEmbed(container) {
        const cameraHtml = `
            <div class="camera-embed-card">
                <div class="panel-header">
                    <h3>Story Camera Langsung</h3>
                    <span>Gunakan kamera web untuk capture gambar dengan cepat.</span>
                </div>
                <div class="camera-stream-box">
                    <video id="camera-video" autoplay playsinline></video>
                    <img id="camera-preview" style="display:none;">
                    <div id="filter-indicator" class="camera-filter-indicator">Filter: None</div>
                </div>
                <div id="camera-error" class="camera-error-message">Gagal mengakses kamera. Pastikan browser diizinkan mengakses kamera perangkat Anda.</div>
                <div id="stream-controls" class="camera-controls-panel">
                    <div class="camera-form-row">
                        <div>
                            <label for="camera-select">Pilih Perangkat Kamera</label>
                            <select id="camera-select" class="input-field"></select>
                        </div>
                        <div>
                            <label>Filter</label>
                            <div class="camera-filter-group">
                                <button class="filter-btn active" data-filter="none">Normal</button>
                                <button class="filter-btn" data-filter="grayscale">Grayscale</button>
                                <button class="filter-btn" data-filter="sepia">Sepia</button>
                            </div>
                        </div>
                    </div>
                    <div class="camera-summary">
                        <span>Tambahkan watermark waktu</span>
                        <label class="switch">
                            <input type="checkbox" id="watermark-toggle" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="form-actions">
                        <button id="btn-capture" class="btn-rose-action glitter-shimmer">📷 Ambil Foto</button>
                    </div>
                </div>
                <div id="preview-controls" class="camera-preview-actions" style="display:none;">
                    <button id="btn-save-profile" class="btn-rose-control glitter-shimmer">👤 Jadikan Foto Profil</button>
                    <button id="btn-download" class="btn-rose-control-alt glitter-shimmer">📥 Unduh Foto PNG</button>
                    <button id="btn-retry" class="btn-secondary-action">🔄 Ambil Ulang Foto</button>
                </div>
            </div>
        `;
        container.innerHTML = cameraHtml;

        const style = document.createElement('style');
        style.textContent = `
            .camera-embed-card { background: #ffffff; border: 1px solid var(--color-border); border-radius: 24px; padding: 24px; box-shadow: 0 18px 45px rgba(142,111,86,0.05); }
            .camera-embed-card .panel-header { margin-bottom: 18px; }
            .camera-embed-card .panel-header h3 { margin:0; font-size:18px; color: var(--color-maroon); }
            .camera-embed-card .panel-header span { display:block; margin-top:8px; color: var(--color-text-muted); font-size:14px; }
            .camera-stream-box { position:relative; width:100%; aspect-ratio:16/9; background: var(--color-creamy-bg); border-radius:22px; overflow:hidden; border:1px solid var(--color-border); margin-bottom:18px; }
            .camera-stream-box video, .camera-stream-box img { width:100%; height:100%; object-fit:cover; }
            .camera-filter-indicator { position:absolute; top:16px; left:16px; background:rgba(255,255,255,0.95); color: var(--color-text-dark); padding:8px 12px; border-radius:999px; font-size:12px; font-weight:700; display:none; }
            .camera-error-message { display:none; background: var(--color-creamy-input); border: 1px solid var(--color-border); color: var(--color-text-dark); padding:14px; border-radius:16px; margin-bottom:18px; font-size:14px; }
            .camera-controls-panel { display:flex; flex-direction:column; gap:16px; }
            .camera-form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
            .camera-filter-group { display:flex; gap:10px; margin-top:8px; }
            .switch { position: relative; display: inline-block; width:46px; height:26px; }
            .switch input { opacity:0; width:0; height:0; }
            .slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:#ccc; transition:.3s; border-radius:34px; }
            .slider:before { position:absolute; content:""; height:18px; width:18px; left:4px; bottom:4px; background:white; transition:.3s; border-radius:50%; }
            .switch input:checked + .slider { background: var(--color-maroon); }
            .switch input:checked + .slider:before { transform:translateX(20px); }
            .filter-btn.active { background: var(--color-maroon); color:white; }
            .camera-preview-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:14px; }
        `;
        document.head.appendChild(style);
    }

    populateCameraDevices(devices) {
        const select = document.getElementById("camera-select");
        if (!select) return;

        select.innerHTML = "";
        if (devices.length === 0) {
            select.innerHTML = `<option value="">Kamera tidak terdeteksi</option>`;
            return;
        }

        devices.forEach((device, index) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.text = device.label || `Kamera ${index + 1}`;
            select.appendChild(option);
        });
    }

    showError(message) {
        const errPanel = document.getElementById("camera-error");
        if (errPanel) {
            errPanel.innerText = message || "Gagal mengakses kamera. Mohon berikan izin kamera.";
            errPanel.style.display = "block";
        }
    }

    hideError() {
        const errPanel = document.getElementById("camera-error");
        if (errPanel) errPanel.style.display = "none";
    }

    showPreview(imgDataUrl) {
        const video = document.getElementById("camera-video");
        const preview = document.getElementById("camera-preview");
        const streamCtrl = document.getElementById("stream-controls");
        const prevCtrl = document.getElementById("preview-controls");

        if (video) video.style.display = "none";
        if (preview) {
            preview.src = imgDataUrl;
            preview.style.display = "block";
        }
        if (streamCtrl) streamCtrl.style.display = "none";
        if (prevCtrl) prevCtrl.style.display = "block";
    }

    showStream() {
        const video = document.getElementById("camera-video");
        const preview = document.getElementById("camera-preview");
        const streamCtrl = document.getElementById("stream-controls");
        const prevCtrl = document.getElementById("preview-controls");

        if (preview) {
            preview.src = "";
            preview.style.display = "none";
        }
        if (video) video.style.display = "block";
        if (streamCtrl) streamCtrl.style.display = "block";
        if (prevCtrl) prevCtrl.style.display = "none";
    }

    bindEvents(presenter) {
        // Camera change
        const select = document.getElementById("camera-select");
        if (select) {
            select.addEventListener("change", (e) => {
                presenter.changeCamera(e.target.value);
            });
        }

        // Pixel Filter buttons
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.getAttribute("data-filter");
                
                // Show indicator
                const indicator = document.getElementById("filter-indicator");
                if (indicator) {
                    if (filter !== 'none') {
                        indicator.innerText = `Filter: ${filter}`;
                        indicator.style.display = 'block';
                    } else {
                        indicator.style.display = 'none';
                    }
                }
                
                presenter.setFilter(filter);
            });
        });

        // Capture button
        const btnCapture = document.getElementById("btn-capture");
        if (btnCapture) {
            btnCapture.addEventListener("click", () => {
                popIn(btnCapture);
                const watermarkChecked = document.getElementById("watermark-toggle").checked;
                presenter.capture({ watermark: watermarkChecked });
            });
        }

        // Retry button
        const btnRetry = document.getElementById("btn-retry");
        if (btnRetry) {
            btnRetry.addEventListener("click", () => {
                this.showStream();
                presenter.resumeCamera();
            });
        }

        // Download button
        const btnDownload = document.getElementById("btn-download");
        if (btnDownload) {
            btnDownload.addEventListener("click", () => {
                popIn(btnDownload);
                presenter.download();
            });
        }

        // Save profile picture button
        const btnSaveProfile = document.getElementById("btn-save-profile");
        if (btnSaveProfile) {
            btnSaveProfile.addEventListener("click", () => {
                popIn(btnSaveProfile);
                presenter.saveToProfile();
            });
        }
    }
}
