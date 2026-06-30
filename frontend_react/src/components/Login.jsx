import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      localStorage.setItem('login', 'true');
      onLoginSuccess();
      window.location.hash = '#/cms';
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="login-page">
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="login-card" style={{ border: '1px solid var(--color-border)', maxWidth: '380px' }}>
        <div className="login-icon">🔐</div>
        <h1>Login CMS</h1>
        <p style={{ marginBottom: '24px' }}>Masuk untuk mengelola artikel website pribadi</p>

        {error && (
          <div style={{ color: 'var(--color-maroon)', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ marginTop: 0, fontSize: '13px', color: 'var(--color-text-dark)' }}>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ background: 'var(--color-creamy-input)', border: '1px solid var(--color-border)', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ marginTop: 0, fontSize: '13px', color: 'var(--color-text-dark)' }}>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ background: 'var(--color-creamy-input)', border: '1px solid var(--color-border)', marginTop: '5px' }}
              required
            />
          </div>

          <button type="submit" className="btn-rose-control btn-full glitter-shimmer">
            Login
          </button>
        </form>

        <div className="demo-login" style={{ background: 'rgba(245, 239, 235, 0.5)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '12px', marginTop: '20px' }}>
          <span style={{ fontSize: '11px', transform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Demo Login</span>
          <h3 style={{ marginTop: '4px', fontSize: '13px', color: 'var(--color-maroon)' }}>
            Username : <b>admin</b><br />
            Password : <b>123</b>
          </h3>
        </div>

        <a href="#/" className="back-profile" style={{ marginTop: '20px', fontWeight: 600 }}>
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
