import React, { useState, useEffect } from 'react';
import { getBackendBase, registerPushSubscription } from '../utils/push';

export default function Home({ isLoggedIn, onLogout, profilePic }) {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingText, setTypingText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const backendBase = getBackendBase();

  // Contact form state
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactEmployees, setContactEmployees] = useState('Pilih jumlah');
  const [contactSolutions, setContactSolutions] = useState('Pilih solusi');
  const [contactMessage, setContactMessage] = useState('');

  // Typing Effect
  useEffect(() => {
    const text = "Mahasiswi Informatika | Web Developer";
    let timer;
    const speed = isDeleting ? 40 : 100;

    const tick = () => {
      if (!isDeleting) {
        setTypingText(text.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
        
        if (charIndex + 1 === text.length) {
          timer = setTimeout(() => setIsDeleting(true), 2500);
        } else {
          timer = setTimeout(tick, speed);
        }
      } else {
        setTypingText(text.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
        
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          timer = setTimeout(tick, 800);
        } else {
          timer = setTimeout(tick, speed);
        }
      }
    };

    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting]);

  // Load articles
  useEffect(() => {
    loadArticles();
    
    // Register Push Subscription automatically
    setTimeout(() => {
      registerPushSubscription().then(sub => {
        if (sub) {
          console.log('Successfully subscribed to Web Push:', sub);
        }
      }).catch(err => {
        console.warn('Web Push subscription failed:', err);
      });
    }, 2000);
  }, []);

  const loadArticles = async (search = '') => {
    try {
      let url = `${backendBase}/api/artikel`;
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.warn('Offline fallback for Home articles:', err);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    loadArticles(e.target.value);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Terima kasih! Pesan Anda telah terkirim.\n\nDetail:\nEmail: ${contactEmail}\nPhone: ${contactPhone}\nPesan: ${contactMessage}`);
    // Clear form
    setContactEmail('');
    setContactPhone('');
    setContactCompany('');
    setContactEmployees('Pilih jumlah');
    setContactSolutions('Pilih solusi');
    setContactMessage('');
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    localStorage.removeItem('login');
    onLogout();
  };

  const handleProfilePicClick = () => {
    window.location.hash = '#/camera';
  };

  // Smooth scroll helper
  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = `#/${id}`;
    }
  };

  return (
    <>
      {/* Floating Background Glows */}
      <div className="bg-glow-container">
        <div className="bg-glow-blob bg-glow-maroon"></div>
        <div className="bg-glow-blob bg-glow-chocolate"></div>
        <div className="bg-glow-blob bg-glow-gold"></div>
      </div>

      {isLoggedIn && (
        <div className="admin-bar" style={{ background: 'var(--color-creamy-latte)', color: 'var(--color-text-dark)', padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(142,111,86,0.06)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
          <span>⚡ Mode Admin Aktif (Login Berhasil)</span>
          <a href="#/cms" className="glitter-shimmer" style={{ color: 'white', background: 'var(--color-maroon)', padding: '6px 14px', borderRadius: '20px', textDecoration: 'none', fontSize: '12px', fontWeight: 700, boxShadow: '0 4px 10px var(--color-maroon-glass)' }}>
            🛠️ Kembali ke CMS Dashboard
          </a>
        </div>
      )}

      <div className="navbar" id="spa-navbar">
        <a href="#/" onClick={scrollToSection('profil')} className="active">🏠 Beranda</a>
        <a href="#/profil" onClick={scrollToSection('profil')}>👤 Profil</a>
        <a href="#/about" onClick={scrollToSection('about')}>📖 About Me</a>
        <a href="#/goals" onClick={scrollToSection('goals')}>🎯 Goals</a>
        <a href="#/favorite" onClick={scrollToSection('favorite')}>💗 Favorite</a>
        <a href="#/artikel-section" onClick={scrollToSection('artikel-section')}>📝 Artikel</a>
        <a href="#/contact" onClick={scrollToSection('contact')}>☎️ Contact</a>
        {isLoggedIn ? (
          <>
            <a href="#/cms" style={{ background: 'var(--color-maroon)', color: 'white' }} className="glitter-shimmer">🛠️ Dashboard CMS</a>
            <a href="#" onClick={handleLogoutClick} style={{ background: 'var(--color-milk-chocolate)', color: 'white' }}>🚪 Logout</a>
          </>
        ) : (
          <a href="#/login" className="glitter-shimmer" style={{ background: 'linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark))', color: 'white', padding: '10px 16px', borderRadius: '24px' }}>🔐 Login</a>
        )}
      </div>

      <div className="container">
        {/* HEADER */}
        <div className="header" id="profil">
          <h1 id="judul" style={{ fontFamily: "'Poppins', sans-serif" }} className="sparkle-text">
            Nabila Safira Aulia Zaky
          </h1>
          <p id="typing2" style={{ fontFamily: "'Poppins', sans-serif", minHeight: '35px' }}>
            {typingText}
            <span style={{ borderRight: '3px solid var(--color-maroon)', marginLeft: '2px', animation: 'blink 0.8s infinite' }}></span>
          </p>

          <div className="profile" style={{ position: 'relative', display: 'inline-block' }} onClick={handleProfilePicClick}>
            <div className="profile-glitter-container">
              <img
                id="home-avatar"
                src={profilePic}
                alt="Foto Nabila"
                style={{ cursor: 'pointer', border: '6px solid white', boxShadow: '0 12px 25px rgba(0,0,0,0.1)', borderRadius: '50%', transition: 'transform 0.3s', display: 'block', width: '180px', height: '180px', objectFit: 'cover' }}
              />
            </div>
            <div className="avatar-overlay glitter-shimmer" style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'var(--color-maroon)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', cursor: 'pointer', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
              📷
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">
          {/* ABOUT */}
          <section id="about" className="animate-on-scroll" style={{ marginTop: '40px' }}>
            <h2>Tentang Saya</h2>
            <p>
              Halo semuanya 👋<br /><br />
              Perkenalkan saya <b>Nabila Safira Aulia Zaky</b>, 
              mahasiswa Program Studi Informatika, 
              Universitas Nahdlatul Ulama Al-Ghazali Cilacap.<br /><br />
              Saat ini saya berusia <span id="umur">20</span> tahun 
              dan tinggal di Cilacap, Jawa Tengah.<br /><br />
              Saya memiliki ketertarikan pada dunia teknologi, desain website, 
              dan pengembangan aplikasi modern 💻✨
            </p>
          </section>

          {/* GRID */}
          <div className="grid">
            {/* HOBI */}
            <div className="card animate-on-scroll">
              <h2>Hobi</h2>
              <ul>
                <li>Traveling ✈️</li>
                <li>Menyanyi 🎤</li>
                <li>Memasak 🍳</li>
                <li>Menonton Film 🎬</li>
              </ul>
            </div>

            {/* GOALS */}
            <div className="card animate-on-scroll" id="goals">
              <h2>Goals</h2>
              <ol>
                <li>Lulus tepat waktu</li>
                <li>Menjadi orang sukses</li>
                <li>Membahagiakan orang tua</li>
                <li>Punya bisnis sendiri</li>
              </ol>
            </div>
          </div>

          {/* FAVORITE */}
          <section id="favorite" className="animate-on-scroll" style={{ marginTop: '50px' }}>
            <h2>Favorite Things</h2>
            <table>
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Favorit</th>
                </tr>
              </thead>
              <tbody>
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
              </tbody>
            </table>
          </section>

          {/* ARTIKEL */}
          <section className="artikel-section animate-on-scroll" id="artikel-section" style={{ marginTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2>Artikel Saya</h2>
              <a href="#/camera" className="btn-rose-action glitter-shimmer" style={{ textDecoration: 'none', display: 'inline-block' }}>🎥 Story Camera</a>
            </div>
            
            <div style={{ margin: '15px 0' }}>
              <input 
                type="text" 
                placeholder="🔍 Cari artikel..." 
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'white' }}
              />
            </div>

            <div id="artikel-list">
              {articles.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Belum ada artikel yang diterbitkan.</p>
              ) : (
                articles.map((artikel) => {
                  const tgl = new Date(artikel.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  });
                  return (
                    <div key={artikel.id} className="card-blog animate-on-scroll">
                      {artikel.gambar && (
                        <div className="card-blog_img-container">
                          <img src={artikel.gambar} alt="Gambar Artikel" className="card-blog_img" />
                        </div>
                      )}
                      <div className="card-blog_content">
                        <span className="card-blog_date">📅 {tgl}</span>
                        <h3 className="card-blog_title">{artikel.judul}</h3>
                        <p className="card-blog_text">{artikel.konten}</p>
                        {artikel.lat && artikel.lon && (
                          <div className="card-blog_geo">
                            <a href={`https://www.google.com/maps?q=${artikel.lat},${artikel.lon}`} target="_blank" rel="noopener noreferrer" className="geo-link">
                              📍 Ditulis di koordinat: {parseFloat(artikel.lat).toFixed(4)}, {parseFloat(artikel.lon).toFixed(4)}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* CONTACT */}
          <section className="contact animate-on-scroll" id="contact" style={{ marginTop: '60px', marginBottom: '60px' }}>
            <h2>Contact Me</h2>
            <form id="formKontak" onSubmit={handleContactSubmit}>
              <label>Email</label>
              <input 
                type="email" 
                placeholder="contoh@gmail.com" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
                required 
              />

              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="+62 81234567890" 
                value={contactPhone} 
                onChange={(e) => setContactPhone(e.target.value)} 
                required 
              />

              <div className="form-row">
                <div>
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Nama perusahaan" 
                    value={contactCompany} 
                    onChange={(e) => setContactCompany(e.target.value)} 
                  />
                </div>
                <div>
                  <label>Number of Employees</label>
                  <select value={contactEmployees} onChange={(e) => setContactEmployees(e.target.value)}>
                    <option>Pilih jumlah</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-100</option>
                  </select>
                </div>
              </div>

              <label>Solutions</label>
              <select value={contactSolutions} onChange={(e) => setContactSolutions(e.target.value)}>
                <option>Pilih solusi</option>
                <option>Website</option>
                <option>Mobile App</option>
                <option>UI/UX Design</option>
              </select>

              <label>Pesan</label>
              <textarea 
                placeholder="Tulis pesan..." 
                value={contactMessage} 
                onChange={(e) => setContactMessage(e.target.value)} 
                required
              ></textarea>

              <button type="submit" className="glitter-shimmer">
                Kirim
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
