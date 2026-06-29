export class Model {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api/artikel';
    }

    // Helper functions for offline localStorage fallback
    _getLocalArticles() {
        const localData = localStorage.getItem('local_articles');
        if (localData) {
            return JSON.parse(localData);
        }
        // Seed dummy articles if empty
        const defaultArticles = [
            {
                id: 101,
                judul: 'Pengenalan Pemrograman Web',
                konten: 'Pemrograman Web adalah proses pembuatan aplikasi berbasis web yang diakses menggunakan internet. Bagian Frontend berfokus pada tampilan pengguna menggunakan HTML, CSS, dan JavaScript, sementara Backend berfokus pada logika server dan database.',
                tanggal: new Date().toISOString(),
                gambar: ''
            },
            {
                id: 102,
                judul: 'Belajar Async Javascript',
                konten: 'Async JavaScript adalah teknik penulisan kode JavaScript di mana tugas dapat berjalan secara paralel tanpa menghalangi proses lain. Konsep utamanya meliputi Callback, Promises, dan Async/Await, yang sangat membantu dalam mengoptimalkan performa aplikasi.',
                tanggal: new Date().toISOString(),
                gambar: ''
            },
            {
                id: 103,
                judul: 'Membuat API dengan Express.js',
                konten: 'Express.js adalah framework web minimalis dan fleksibel untuk Node.js. Dengan Express, kita bisa dengan mudah membuat REST API yang aman, cepat, dan terorganisir untuk dikonsumsi oleh aplikasi Frontend.',
                tanggal: new Date().toISOString(),
                gambar: ''
            }
        ];
        this._saveLocalArticles(defaultArticles);
        return defaultArticles;
    }

    _saveLocalArticles(articles) {
        localStorage.setItem('local_articles', JSON.stringify(articles));
    }

    // ================= ARTICLE CRUD OPERATIONS =================

    async getAll(searchKeyword = '') {
        try {
            let url = this.apiUrl;
            if (searchKeyword) {
                url += `?search=${encodeURIComponent(searchKeyword)}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn('Backend offline, using localStorage fallback for getAll:', error);
            const local = this._getLocalArticles();
            if (searchKeyword) {
                const kw = searchKeyword.toLowerCase();
                return local.filter(a => 
                    (a.judul && a.judul.toLowerCase().includes(kw)) || 
                    (a.konten && a.konten.toLowerCase().includes(kw))
                );
            }
            return local;
        }
    }

    async getStats() {
        try {
            const response = await fetch(`${this.apiUrl}/stats`);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            if (result.status === 'success') {
                return result.data;
            }
            throw new Error(result.message || 'Failed to fetch stats');
        } catch (error) {
            console.warn('Backend offline, using localStorage fallback for getStats:', error);
            const local = this._getLocalArticles();
            return {
                total: local.length,
                terbaru: local.length > 0 ? local[0].judul : '-'
            };
        }
    }

    async save(judul, konten, gambar = '', id = null, lat = null, lon = null) {
        try {
            const bodyData = { judul, konten, gambar, lat, lon };
            if (id) bodyData.id = id;

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn('Backend offline, using localStorage fallback for save:', error);
            const local = this._getLocalArticles();
            if (id) {
                // Update existing article
                const index = local.findIndex(a => a.id === parseInt(id) || a.id === id);
                if (index !== -1) {
                    local[index] = { 
                        ...local[index], 
                        judul, 
                        konten, 
                        gambar, 
                        lat: lat || local[index].lat, 
                        lon: lon || local[index].lon, 
                        tanggal: new Date().toISOString() 
                    };
                }
            } else {
                // Insert new article
                const newId = local.length > 0 ? Math.max(...local.map(a => a.id)) + 1 : 1;
                local.unshift({ 
                    id: newId, 
                    judul, 
                    konten, 
                    gambar, 
                    lat, 
                    lon, 
                    tanggal: new Date().toISOString() 
                });
            }
            this._saveLocalArticles(local);
            return { status: 'success', message: 'Artikel berhasil disimpan (Offline Mode)' };
        }
    }

    async delete(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn('Backend offline, using localStorage fallback for delete:', error);
            const local = this._getLocalArticles();
            const filtered = local.filter(a => a.id !== parseInt(id) && a.id !== id);
            this._saveLocalArticles(filtered);
            return { status: 'success', message: 'Artikel berhasil dihapus (Offline Mode)' };
        }
    }

    // ================= LOGIN SESSION MANAGEMENT =================

    isLoggedIn() {
        return localStorage.getItem('login') === 'true';
    }

    login(username, password) {
        if (username === 'admin' && password === '123') {
            localStorage.setItem('login', 'true');
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('login');
    }

    // ================= CUSTOM PROFILE PICTURE STATE =================

    getProfilePicture() {
        return localStorage.getItem('profile_picture') || 'fotonabila/fotonabila.jpeg';
    }

    setProfilePicture(base64Data) {
        localStorage.setItem('profile_picture', base64Data);
    }

    resetProfilePicture() {
        localStorage.removeItem('profile_picture');
    }
}
