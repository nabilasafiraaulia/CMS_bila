export class Model {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api/artikel';
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
            console.error('Error fetching articles:', error);
            throw error;
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
            console.error('Error fetching stats:', error);
            throw error;
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
            console.error('Error saving article:', error);
            throw error;
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
            console.error('Error deleting article:', error);
            throw error;
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
