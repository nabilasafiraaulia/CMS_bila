import { startCamera, stopCamera, listCameras, captureFrame, canvasToBlob, downloadBlob } from './camera-utils.js';
import { staggerEnter } from './animations.js';
import { CameraView } from './views.js';

// Global toast system that utilizes Web Animations API (WAAPI)
export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-new ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✨' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <div>${message}</div>
    `;
    container.appendChild(toast);

    import('./animations.js').then(anim => {
        anim.toastSlideIn(toast);
        setTimeout(() => {
            const outAnim = anim.toastSlideOut(toast);
            if (outAnim) {
                outAnim.onfinish = () => toast.remove();
            } else {
                toast.remove();
            }
        }, 3000);
    });
}

export class HomePresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init(container) {
        const state = {
            isLoggedIn: this.model.isLoggedIn(),
            profilePic: this.model.getProfilePicture()
        };

        this.view.render(container, state);
        this.view.bindEvents(this);

        try {
            const articles = await this.model.getAll();
            this.view.renderArticles(articles);
        } catch (error) {
            console.warn('Home list load failed:', error);
        }

        const animateElements = container.querySelectorAll('.animate-on-scroll, .card, table, .navbar a');
        if (animateElements.length > 0) {
            staggerEnter(animateElements, 40);
        }
    }

    submitContactForm(data) {
        if (!data.email || !data.pesan) {
            showToast('Email dan Pesan wajib diisi!', 'error');
            return;
        }
        showToast('Pesan berhasil terkirim!', 'success');
        const form = document.getElementById('formKontak');
        if (form) form.reset();
    }

    logout() {
        this.model.logout();
        showToast('Berhasil logout.', 'success');
        window.location.hash = '#/';
    }

    destroy() {
        if (this.view.destroy) this.view.destroy();
    }
}

export class LoginPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init(container) {
        if (this.model.isLoggedIn()) {
            window.location.hash = '#/cms';
            return;
        }
        this.view.render(container);
        this.view.bindEvents(this);
    }

    handleLogin(username, password) {
        if (!username || !password) {
            showToast('Username dan password tidak boleh kosong!', 'error');
            return;
        }
        const success = this.model.login(username, password);
        if (success) {
            showToast('Login berhasil!', 'success');
            window.location.hash = '#/cms';
        } else {
            showToast('Login gagal!', 'error');
        }
    }
}

export class CmsPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.searchTimeout = null;
        this.cameraPresenter = null;
    }

    async init(container) {
        if (!this.model.isLoggedIn()) {
            window.location.hash = '#/login';
            return;
        }

        this.view.render(container, {});
        this.view.bindEvents(this);

        const cameraModule = document.getElementById('camera-module');
        if (cameraModule) {
            this.cameraPresenter = new CameraPresenter(this.model, new CameraView());
            await this.cameraPresenter.initEmbedded(cameraModule);
        }

        await this.loadStats();
        await this.loadArticles();
        this._captureLocation();
    }

    async loadStats() {
        try {
            const stats = await this.model.getStats();
            this.view.updateStats(stats.total, stats.terbaru);
        } catch (error) {
            console.error('Failed to load stats:', error);
            this.view.updateStats(0, '-');
        }
    }

    // Perbaikan: Selalu gunakan silent error handling agar tidak mengganggu UX
    async loadArticles(search = '') {
        try {
            const articles = await this.model.getAll(search);
            this.view.renderRecentArticles(articles);
            this.view.renderHistoryTable(articles, this);
            await this.view.renderMap(articles);
        } catch (error) {
            console.warn('Silent failure on loadArticles:', error);
        }
    }

    handleSearch(keyword) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.loadArticles(keyword);
        }, 300);
    }

    async saveArticle(data) {
        if (!data.judul || !data.konten) {
            showToast('Judul dan isi artikel tidak boleh kosong!', 'error');
            return;
        }

        try {
            const result = await this.model.save(data.judul, data.konten, data.gambar || '', data.id, data.lat, data.lon);
            if (result.status === 'success') {
                showToast(result.message, 'success');
                this.view.resetForm();
                await this.loadStats();
                await this.loadArticles(); // Sekarang ini aman karena sudah silent di function loadArticles
            } else {
                showToast(result.message || 'Gagal menyimpan artikel', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan koneksi server.', 'error');
        }
    }

    async deleteArticle(id) {
        try {
            const result = await this.model.delete(id);
            if (result.status === 'success') {
                showToast(result.message, 'success');
                await this.loadStats();
                await this.loadArticles();
            } else {
                showToast(result.message || 'Gagal menghapus.', 'error');
            }
        } catch (error) {
            showToast('Error server.', 'error');
        }
    }

    handleSectionChange(section) {
        if (section === 'manajemen') this._captureLocation();
    }

    async _captureLocation() {
        const statusEl = document.getElementById("geo-status");
        if (!statusEl) return null;
        try {
            const { getCurrentCoords } = await import('./utils/geo.js');
            const coords = await getCurrentCoords();
            if (coords) {
                statusEl.innerText = `📍 Lokasi aktif`;
                statusEl.className = "geo-status geo-status--ok";
                statusEl.setAttribute("data-lat", coords.lat);
                statusEl.setAttribute("data-lon", coords.lng);
            } else {
                statusEl.innerText = "⚠️ Geolocation nonaktif.";
            }
        } catch (err) {
            console.warn('Geo failed:', err);
        }
    }

    destroy() {
        if (this.cameraPresenter) this.cameraPresenter.destroy();
        if (this.view.beforeLeave) this.view.beforeLeave();
    }

    logout() {
        this.model.logout();
        window.location.hash = '#/login';
    }
}

export class CameraPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.stream = null;
        this.activeFilter = 'none';
        this.selectedDeviceId = null;
        this.capturedCanvas = null;
        this.capturedBlob = null;
    }

    async initEmbedded(container) {
        this.view.renderEmbed(container);
        this.view.bindEvents(this);
        await this.initializeCamera();
    }

    async initializeCamera() {
        try {
            const devices = await listCameras();
            this.view.populateCameraDevices(devices);
            if (devices.length > 0) {
                this.selectedDeviceId = devices[0].deviceId;
                await this.startStream();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async startStream() {
        try {
            if (this.stream) stopCamera(this.stream);
            const videoEl = document.getElementById("camera-video");
            if (videoEl) this.stream = await startCamera(videoEl, 'user', this.selectedDeviceId);
        } catch (error) {
            console.error('Camera failed:', error);
        }
    }

    async capture(options) {
        const videoEl = document.getElementById("camera-video");
        try {
            this.capturedCanvas = captureFrame(videoEl, { filter: this.activeFilter });
            this.capturedBlob = await canvasToBlob(this.capturedCanvas);
            const dataUrl = this.capturedCanvas.toDataURL('image/jpeg', 0.85);
            document.getElementById("gambarData").value = dataUrl;
            this.view.showPreview(dataUrl);
            showToast("Foto diambil!", "success");
        } catch (e) {
            showToast("Gagal ambil foto.", "error");
        }
    }

    destroy() {
        if (this.stream) stopCamera(this.stream);
    }
}