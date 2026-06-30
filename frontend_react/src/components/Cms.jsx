import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import Camera from './Camera';
import { getBackendBase } from '../utils/push';

export default function Cms({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, terbaru: '-' });
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formLat, setFormLat] = useState('');
  const [formLon, setFormLon] = useState('');
  const [geoStatus, setGeoStatus] = useState('');

  // Push notifications form states
  const [pushTitle, setPushTitle] = useState('');
  const [pushMessage, setPushMessage] = useState('');
  const [pushStatus, setPushStatus] = useState('');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const backendBase = getBackendBase();

  useEffect(() => {
    loadStats();
    loadArticles();
  }, []);

  useEffect(() => {
    // Recapture geolocation when opening form
    if (activeTab === 'manajemen') {
      captureLocation();
    }
  }, [activeTab]);

  // Leaflet Map integration
  useEffect(() => {
    if (activeTab === 'overview' && mapRef.current && articles.length > 0) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const defaultCenter = [-7.447, 109.236];
      const map = L.map(mapRef.current).setView(defaultCenter, 10);
      mapInstanceRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const validArticles = articles.filter(a => {
        const lat = parseFloat(a.lat || a.latitude);
        const lon = parseFloat(a.lon || a.longitude);
        return !isNaN(lat) && !isNaN(lon);
      });

      const markers = [];
      const photoIcon = L.divIcon({
        html: `<div class="custom-map-marker">📍</div>`,
        className: 'custom-map-marker-wrapper',
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -36]
      });

      validArticles.forEach(item => {
        const lat = parseFloat(item.lat || item.latitude);
        const lon = parseFloat(item.lon || item.longitude);
        const marker = L.marker([lat, lon], { icon: photoIcon }).addTo(map);

        const popupHtml = `
          <div class="map-popup">
            <h4 style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-weight: bold; color: var(--color-maroon);">${item.judul}</h4>
            ${item.gambar ? `<img src="${item.gambar}" style="width: 100%; max-height: 100px; object-fit: cover; border-radius: 6px; margin-top: 4px; display: block;">` : ''}
            <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--color-text-muted); line-height: 1.4;">${item.konten.substring(0, 75)}...</p>
          </div>
        `;
        marker.bindPopup(popupHtml);
        markers.push([lat, lon]);
      });

      if (markers.length > 0) {
        try {
          map.fitBounds(markers, { padding: [35, 35] });
        } catch (err) {
          console.warn('Gagal memposisikan peta:', err);
        }
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, articles]);

  const loadStats = async () => {
    try {
      const response = await fetch(`${backendBase}/api/artikel/stats`);
      if (!response.ok) throw new Error('Stats API fail');
      const res = await response.json();
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Stats fetch offline fallback:', err);
      const localData = localStorage.getItem('local_articles');
      const local = localData ? JSON.parse(localData) : [];
      setStats({
        total: local.length,
        terbaru: local.length > 0 ? local[0].judul : '-'
      });
    }
  };

  const loadArticles = async (search = '') => {
    try {
      let url = `${backendBase}/api/artikel`;
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Articles API fail');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.warn('Articles fetch offline fallback:', err);
      const localData = localStorage.getItem('local_articles');
      const local = localData ? JSON.parse(localData) : [];
      if (search) {
        const kw = search.toLowerCase();
        const filtered = local.filter(a => 
          (a.judul && a.judul.toLowerCase().includes(kw)) ||
          (a.konten && a.konten.toLowerCase().includes(kw))
        );
        setArticles(filtered);
      } else {
        setArticles(local);
      }
    }
  };

  const captureLocation = () => {
    setGeoStatus('Mendeteksi lokasi...');
    if (!navigator.geolocation) {
      setGeoStatus('⚠️ Geolocation tidak didukung.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude);
        setFormLon(pos.coords.longitude);
        setGeoStatus('📍 Lokasi aktif');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoStatus('⚠️ Geolocation nonaktif.');
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('Judul dan isi artikel tidak boleh kosong!');
      return;
    }

    setIsSaving(true);
    const bodyData = {
      judul: formTitle,
      konten: formContent,
      gambar: formImage || '',
      lat: formLat ? String(formLat) : null,
      lon: formLon ? String(formLon) : null
    };
    if (formId) bodyData.id = formId;

    try {
      const response = await fetch(`${backendBase}/api/artikel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (!response.ok) throw new Error('API save failed');
      const res = await response.json();
      alert(res.message);
      resetForm();
      loadStats();
      loadArticles();
      setActiveTab('overview');
    } catch (err) {
      console.warn('Offline fallback for save article:', err);
      // Save locally
      const localData = localStorage.getItem('local_articles');
      let local = localData ? JSON.parse(localData) : [];
      if (formId) {
        const idx = local.findIndex(a => a.id === parseInt(formId) || a.id === formId);
        if (idx !== -1) {
          local[idx] = {
            ...local[idx],
            judul: formTitle,
            konten: formContent,
            gambar: formImage || local[idx].gambar,
            lat: formLat || local[idx].lat,
            lon: formLon || local[idx].lon,
            tanggal: new Date().toISOString()
          };
        }
      } else {
        const newId = local.length > 0 ? Math.max(...local.map(a => a.id)) + 1 : 1;
        local.unshift({
          id: newId,
          judul: formTitle,
          konten: formContent,
          gambar: formImage,
          lat: formLat,
          lon: formLon,
          tanggal: new Date().toISOString()
        });
      }
      localStorage.setItem('local_articles', JSON.stringify(local));
      alert('Artikel disimpan secara lokal (Offline Mode)');
      resetForm();
      loadStats();
      loadArticles();
      setActiveTab('overview');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditArticle = (item) => {
    setFormId(item.id);
    setFormTitle(item.judul);
    setFormContent(item.konten);
    setFormImage(item.gambar || '');
    setFormLat(item.lat || item.latitude || '');
    setFormLon(item.lon || item.longitude || '');
    setGeoStatus(item.lat || item.latitude ? '📍 Lokasi aktif' : '⚠️ Geolocation nonaktif.');
    setActiveTab('manajemen');
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const response = await fetch(`${backendBase}/api/artikel/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('API delete failed');
      const res = await response.json();
      alert(res.message);
      loadStats();
      loadArticles();
    } catch (err) {
      console.warn('Offline fallback for delete article:', err);
      const localData = localStorage.getItem('local_articles');
      let local = localData ? JSON.parse(localData) : [];
      local = local.filter(a => a.id !== parseInt(id) && a.id !== id);
      localStorage.setItem('local_articles', JSON.stringify(local));
      alert('Artikel dihapus secara lokal (Offline Mode)');
      loadStats();
      loadArticles();
    }
  };

  const handleSendPushNotification = async (e) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) {
      alert('Judul dan pesan notifikasi wajib diisi!');
      return;
    }
    setPushStatus('Mengirim...');
    try {
      const response = await fetch(`${backendBase}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: pushTitle, message: pushMessage })
      });
      const res = await response.json();
      if (response.ok) {
        setPushStatus(`✅ ${res.message}`);
        setPushTitle('');
        setPushMessage('');
      } else {
        setPushStatus(`❌ Gagal: ${res.message}`);
      }
    } catch (err) {
      setPushStatus('❌ Gagal menghubungi server backend.');
    }
  };

  const resetForm = () => {
    setFormId('');
    setFormTitle('');
    setFormContent('');
    setFormImage('');
    setFormLat('');
    setFormLon('');
    setGeoStatus('');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    loadArticles(e.target.value);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('login');
    onLogout();
    window.location.hash = '#/login';
  };

  return (
    <div className="cms-shell">
      <aside className="sidebar">
        <div>
          <div className="brand brand-sparkle-container">
            <h2 style={{ color: 'white' }}>CMS Dashboard</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>Nabila Safira</p>
          </div>

          <nav className="cms-menu">
            <button 
              type="button" 
              className={`menu-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Dashboard Overview
            </button>
            <a href="#/" className="menu-link">👁️ Lihat Profil / Web</a>
            <button 
              type="button" 
              className={`menu-link ${activeTab === 'manajemen' ? 'active' : ''}`}
              onClick={() => setActiveTab('manajemen')}
            >
              📝 Manajemen Artikel
            </button>
            <button 
              type="button" 
              className={`menu-link ${activeTab === 'riwayat' ? 'active' : ''}`}
              onClick={() => setActiveTab('riwayat')}
            >
              🕒 Riwayat Artikel
            </button>
            <button 
              type="button" 
              className={`menu-link ${activeTab === 'push-notif' ? 'active' : ''}`}
              onClick={() => setActiveTab('push-notif')}
            >
              🔔 Kirim Push Notifikasi
            </button>
          </nav>
        </div>

        <button className="logout-btn glitter-shimmer" onClick={handleLogoutClick}>Logout</button>
      </aside>

      <main className="cms-main">
        <section className="cms-topbar">
          <p className="eyebrow">Panel Kontrol</p>
          <h1>Dashboard Konten</h1>
          <p className="subtext">Kelola artikel, kamera web, dan riwayat publikasi dalam tampilan admin yang elegan.</p>
        </section>

        {activeTab === 'overview' && (
          <section id="section-overview" className="cms-section cms-section--active">
            <div className="overview-summary-grid">
              <div className="summary-card">
                <span>Status Akun</span>
                <strong>Administrator</strong>
              </div>
              <div className="summary-card">
                <span>Total Artikel</span>
                <strong>{stats.total}</strong>
              </div>
              <div className="summary-card">
                <span>Artikel Terbaru</span>
                <strong>{stats.terbaru}</strong>
              </div>
            </div>

            <div className="panel panel--map" style={{ marginTop: '24px', marginBottom: '24px' }}>
              <div className="panel-header">
                <h2>Peta Sebaran Artikel</h2>
                <span>Lokasi geografis penulisan artikel di peta interaktif.</span>
              </div>
              <div className="panel-body">
                <div ref={mapRef} id="map" className="map-container" style={{ minHeight: '300px', background: '#e5e3df', borderRadius: '12px' }}></div>
              </div>
            </div>

            <div className="panel panel--list">
              <div className="panel-header">
                <h2>Ringkasan Konten</h2>
                <span>Artikel terbaru yang telah dikelola dan ringkasan cepat.</span>
              </div>
              <div className="panel-body">
                {articles.length === 0 ? (
                  <p className="empty">Belum ada artikel yang diterbitkan.</p>
                ) : (
                  articles.slice(0, 3).map((item) => (
                    <div key={item.id} className="article-card" style={{ marginBottom: '15px', padding: '15px', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                      <h3>{item.judul}</h3>
                      <p>{item.konten.substring(0, 140)}{item.konten.length > 140 ? '...' : ''}</p>
                      <small style={{ color: 'var(--color-text-muted)', display: 'block', margin: '8px 0' }}>
                        📅 {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </small>
                      <div className="article-actions" style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" className="edit-btn" onClick={() => handleEditArticle(item)}>Edit</button>
                        <button type="button" className="hapus-btn" onClick={() => handleDeleteArticle(item.id)}>Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'manajemen' && (
          <section id="section-manajemen" className="cms-section cms-section--active">
            <div className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <h2>{formId ? 'Edit Artikel' : 'Buat Postingan Artikel Baru'}</h2>
                  <span>Isi detail artikel dan simpan dengan mudah di sini.</span>
                </div>
                <div className="panel-body">
                  <form onSubmit={handleSaveArticle}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label htmlFor="judul" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Judul Artikel</label>
                      <input 
                        className="input-field" 
                        type="text" 
                        id="judul" 
                        placeholder="Masukkan judul artikel"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label htmlFor="isi" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Isi Artikel</label>
                      <textarea 
                        className="textarea-field" 
                        id="isi" 
                        placeholder="Tulis isi artikel..."
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        required
                        style={{ width: '100%', minHeight: '150px', padding: '10px', borderRadius: '8px' }}
                      ></textarea>
                    </div>

                    <div className="camera-embed-card" style={{ marginBottom: '15px', border: '1px solid var(--color-border)', padding: '15px', borderRadius: '12px' }}>
                      <div className="panel-header camera-section-header" style={{ marginBottom: '10px' }}>
                        <h3>Ambil Gambar via Kamera Web</h3>
                        <span>Gunakan webcam untuk menangkap gambar dan simpan bersama artikel.</span>
                      </div>
                      
                      <Camera embedMode={true} onCaptureEmbed={(url) => setFormImage(url)} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-creamy-bg)', padding: '10px 15px', borderRadius: '10px', border: '1px solid var(--color-border)', marginBottom: '15px' }}>
                      <span className="geo-status geo-status--ok" style={{ fontSize: '13px', fontWeight: 'bold' }}>{geoStatus}</span>
                      <button type="button" className="btn-rose-control-alt" onClick={captureLocation} style={{ fontSize: '12px', padding: '6px 12px' }}>🔄 Dapatkan GPS</button>
                    </div>

                    {formLat && formLon && (
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '15px' }}>
                        Koordinat: {formLat}, {formLon}
                      </p>
                    )}

                    <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="save-btn" disabled={isSaving}>
                        {isSaving ? 'Menyimpan...' : 'Simpan Artikel'}
                      </button>
                      <button type="button" className="btn-reset" onClick={() => { resetForm(); setActiveTab('overview'); }}>Batal</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'riwayat' && (
          <section id="section-riwayat" className="cms-section cms-section--active">
            <div className="panel">
              <div className="panel-header">
                <h2>Daftar Riwayat Publikasi Artikel</h2>
                <span>Tabel publikasi artikel dengan aksi edit dan hapus.</span>
              </div>
              <div className="panel-body">
                <div className="search-bar" style={{ marginBottom: '15px' }}>
                  <input 
                    className="search-input" 
                    type="text" 
                    placeholder="🔍 Cari artikel berdasarkan judul atau isi..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                  <table className="history-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-creamy-latte)', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Judul</th>
                        <th style={{ padding: '12px' }}>Foto</th>
                        <th style={{ padding: '12px' }}>Preview</th>
                        <th style={{ padding: '12px' }}>Tanggal</th>
                        <th style={{ padding: '12px' }}>Lokasi</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.length === 0 ? (
                        <tr>
                          <td className="empty" colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Belum ada riwayat artikel.</td>
                        </tr>
                      ) : (
                        articles.map((item) => {
                          const lat = item.lat || item.latitude;
                          const lon = item.lon || item.longitude;
                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.judul}</td>
                              <td style={{ padding: '12px' }} className="history-thumb-cell">
                                {item.gambar ? (
                                  <img src={item.gambar} alt="Thumbnail" className="history-thumb" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                ) : (
                                  <span className="no-image-label" style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Tanpa Foto</span>
                                )}
                              </td>
                              <td style={{ padding: '12px' }}>{item.konten.substring(0, 55)}{item.konten.length > 55 ? '...' : ''}</td>
                              <td style={{ padding: '12px' }}>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                              <td style={{ padding: '12px' }}>
                                {lat && lon ? (
                                  <a href={`https://www.google.com/maps?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--color-maroon)', fontSize: '12px' }}>
                                    📍 Map ({parseFloat(lat).toFixed(3)}, {parseFloat(lon).toFixed(3)})
                                  </a>
                                ) : (
                                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Tidak ada</span>
                                )}
                              </td>
                              <td style={{ padding: '12px' }}>
                                <span className="status-badge status-badge--active" style={{ fontSize: '11px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold' }}>Dipublikasi</span>
                              </td>
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button type="button" className="btn-table-edit" onClick={() => handleEditArticle(item)} style={{ background: 'var(--color-creamy-latte)', color: 'var(--color-text-dark)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                                  <button type="button" className="btn-table-delete" onClick={() => handleDeleteArticle(item.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Hapus</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'push-notif' && (
          <section id="section-push" className="cms-section cms-section--active">
            <div className="panel">
              <div className="panel-header">
                <h2>Kirim Push Notification ke Semua Subscriber</h2>
                <span>Memicu push notification langsung ke browser subscriber menggunakan Service Worker.</span>
              </div>
              <div className="panel-body">
                <form onSubmit={handleSendPushNotification} style={{ maxWidth: '500px' }}>
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="push-title" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Judul Notifikasi</label>
                    <input 
                      type="text" 
                      id="push-title" 
                      className="input-field" 
                      placeholder="Masukkan judul notifikasi"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="push-msg" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Pesan / Isi Notifikasi</label>
                    <textarea 
                      id="push-msg" 
                      className="textarea-field" 
                      placeholder="Masukkan pesan detail notifikasi..."
                      value={pushMessage}
                      onChange={(e) => setPushMessage(e.target.value)}
                      required
                      style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px' }}
                    ></textarea>
                  </div>
                  
                  {pushStatus && (
                    <div style={{ padding: '10px 15px', borderRadius: '8px', background: 'var(--color-creamy-bg)', border: '1px solid var(--color-border)', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>
                      {pushStatus}
                    </div>
                  )}

                  <button type="submit" className="save-btn glitter-shimmer">
                    🔔 Kirim Notifikasi Sekarang
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
