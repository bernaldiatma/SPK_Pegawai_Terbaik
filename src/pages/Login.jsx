import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nip || !password) {
      toast.error('Masukkan NIP/Username dan Password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(nip, password);
      setLoading(false);
      if (result.success) {
        toast.success(`Selamat datang, ${result.user.nama}`);
        const routes = { admin: '/admin', pimpinan: '/pimpinan', pegawai: '/pegawai' };
        navigate(routes[result.user.role] || '/');
      } else {
        toast.error(result.message || 'Login gagal.');
      }
    }, 500);
  };

  const fillDemo = (role) => {
    setSelectedRole(role);
    if (role === 'admin') { setNip('admin'); setPassword('admin123'); }
    else if (role === 'pimpinan') { setNip('pimpinan'); setPassword('pimpinan123'); }
    else { setNip('198501012010011001'); setPassword('pegawai123'); }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-card">
          {/* Branding */}
          <div className="login-branding">
            <div className="login-logo">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <h1 className="login-brand-title">Executive Insight</h1>
            <p className="login-brand-sub">SPK Pegawai Terbaik</p>
          </div>

          {/* Glass Card */}
          <div className="login-glass">
            <h2>Selamat Datang Kembali</h2>
            <p className="login-subtitle">Masukkan kredensial Anda untuk mengakses sistem manajemen kinerja.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Role Selector */}
              <div>
                <label className="form-label">Pilih Peran Akses</label>
                <div className="role-selector">
                  {['admin', 'pimpinan', 'pegawai'].map(role => (
                    <button
                      key={role}
                      type="button"
                      className={`role-selector-btn ${selectedRole === role ? 'active' : ''}`}
                      onClick={() => fillDemo(role)}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* NIP Field */}
              <div>
                <label className="form-label" htmlFor="nip">NIP (Nomor Induk Pegawai)</label>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined input-icon-left">badge</span>
                  <input
                    id="nip"
                    type="text"
                    className="form-control has-icon-left"
                    placeholder="Contoh: 19850101XXXXXXXX"
                    value={nip}
                    onChange={e => setNip(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Kata Sandi</label>
                  <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '0.75rem', fontWeight: 500 }}>Lupa Sandi?</a>
                </div>
                <div className="input-with-icon">
                  <span className="material-symbols-outlined input-icon-left">lock</span>
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    className="form-control has-icon-left has-icon-right"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-icon-right-btn"
                    onClick={() => setShowPw(!showPw)}
                  >
                    <span className="material-symbols-outlined">
                      {showPw ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="login-remember">
                <label>
                  <input type="checkbox" defaultChecked /> Ingat saya di perangkat ini
                </label>
              </div>

              {/* Submit */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading
                  ? <span className="spinner" />
                  : <>Masuk <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span></>
                }
              </button>
            </form>

            <div className="login-footer">
              <p>
                Kesulitan mengakses akun?{' '}
                <a href="#" onClick={e => e.preventDefault()}>Hubungi Administrator</a>
              </p>
            </div>
          </div>

          {/* Security badges */}
          <div className="security-badges">
            <div className="security-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span>
              Secure SSL
            </div>
            <div className="security-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>encrypted</span>
              End-to-End Encryption
            </div>
          </div>
        </div>
      </main>

      <footer className="login-page-footer">
        <p>© 2024 Executive Insight Management System. Seluruh Hak Cipta Dilindungi.</p>
        <div className="login-page-footer-links">
          <a href="#" onClick={e => e.preventDefault()}>Kebijakan Privasi</a>
          <span className="dot">•</span>
          <a href="#" onClick={e => e.preventDefault()}>Syarat & Ketentuan</a>
          <span className="dot">•</span>
          <a href="#" onClick={e => e.preventDefault()}>Bantuan IT</a>
        </div>
      </footer>
    </div>
  );
}
