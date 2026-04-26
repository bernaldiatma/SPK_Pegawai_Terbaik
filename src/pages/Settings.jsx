import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');

  // Profile form
  const [nama, setNama] = useState(user?.nama || '');
  const [email, setEmail] = useState(user?.email || `${user?.nip || 'user'}@instansi.go.id`);

  // Password form
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Notification prefs
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSistem, setNotifSistem] = useState(true);
  const [notifLaporan, setNotifLaporan] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profil berhasil diperbarui.');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!oldPw || !newPw || !confirmPw) {
      toast.error('Semua kolom harus diisi.');
      return;
    }
    if (newPw !== confirmPw) {
      toast.error('Kata sandi baru tidak cocok.');
      return;
    }
    if (newPw.length < 6) {
      toast.error('Kata sandi minimal 6 karakter.');
      return;
    }
    toast.success('Kata sandi berhasil diperbarui.');
    setOldPw('');
    setNewPw('');
    setConfirmPw('');
  };

  const tabs = [
    { id: 'profil', label: 'Profil', icon: 'person' },
    { id: 'keamanan', label: 'Keamanan', icon: 'lock' },
    { id: 'notifikasi', label: 'Notifikasi', icon: 'notifications' },
    { id: 'tentang', label: 'Tentang Sistem', icon: 'info' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <h1>Pengaturan</h1>
        <p>Kelola profil, keamanan, dan preferensi sistem Anda.</p>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profil' && (
        <div className="card">
          <div className="card-header">
            <h3>
              <span className="card-indicator" />
              Informasi Profil
            </h3>
          </div>

          {/* Profile avatar section */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '20px', background: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-lg)', marginBottom: '24px',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--tertiary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.5rem', fontWeight: 700,
              fontFamily: 'var(--font-headline)', flexShrink: 0,
            }}>
              {(user?.nama || 'U').charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.nama || 'User'}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {user?.role?.toUpperCase() || 'USER'}
              </div>
              <div style={{ fontSize: '0.813rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                NIP: {user?.nip || '—'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  className="form-control"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">NIP</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.nip || '—'}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={(user?.role || 'user').toUpperCase()}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'keamanan' && (
        <div className="card">
          <div className="card-header">
            <h3>
              <span className="card-indicator" />
              Ubah Kata Sandi
            </h3>
          </div>

          <form onSubmit={handleChangePassword}>
            <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Kata Sandi Lama</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Masukkan kata sandi lama"
                  value={oldPw}
                  onChange={e => setOldPw(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Kata Sandi Baru</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Minimal 6 karakter"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock_reset</span>
                Perbarui Kata Sandi
              </button>
            </div>
          </form>

          {/* Security info */}
          <div style={{
            marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9',
          }}>
            <h4 style={{ marginBottom: '16px', fontSize: '0.875rem' }}>Sesi Aktif</h4>
            <div style={{
              padding: '16px', background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--success)', fontSize: 20 }}>computer</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Perangkat ini</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Terakhir aktif: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <span className="badge badge-success">Aktif</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifikasi' && (
        <div className="card">
          <div className="card-header">
            <h3>
              <span className="card-indicator" />
              Preferensi Notifikasi
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
            {[
              { label: 'Notifikasi Email', desc: 'Terima pembaruan via email saat ada perubahan data.', checked: notifEmail, onChange: setNotifEmail },
              { label: 'Notifikasi Sistem', desc: 'Tampilkan notifikasi di dalam aplikasi.', checked: notifSistem, onChange: setNotifSistem },
              { label: 'Laporan Mingguan', desc: 'Kirim ringkasan laporan kinerja mingguan.', checked: notifLaporan, onChange: setNotifLaporan },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', background: 'var(--surface-container-low)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{item.desc}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => item.onChange(!item.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px' }}>
            <button className="btn-primary" onClick={() => toast.success('Preferensi disimpan.')}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
              Simpan Preferensi
            </button>
          </div>
        </div>
      )}

      {activeTab === 'tentang' && (
        <div className="card">
          <div className="card-header">
            <h3>
              <span className="card-indicator" />
              Tentang Sistem
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* App info */}
            <div style={{
              padding: '24px', background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-lg)', textAlign: 'center',
            }}>
              <div style={{
                width: '48px', height: '48px', margin: '0 auto 12px',
                background: 'var(--primary-container)', borderRadius: 'var(--radius-xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>insights</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--primary)', marginBottom: '4px' }}>
                Executive Insight
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Performance SPK Management System
              </p>
              <span className="badge badge-info" style={{ marginTop: '12px' }}>
                Versi 2.4.0-stable
              </span>
            </div>

            {/* Details table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {[
                { key: 'Metode SPK', val: 'AHP + TOPSIS' },
                { key: 'Database', val: 'Local Storage (Browser)' },
                { key: 'Framework', val: 'React 18 + Vite' },
                { key: 'Design System', val: 'Executive Insight (M3)' },
                { key: 'Lisensi', val: 'Internal Use Only' },
              ].map(item => (
                <div key={item.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid #f1f5f9',
                  fontSize: '0.875rem',
                }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>{item.key}</span>
                  <span style={{ fontWeight: 600 }}>{item.val}</span>
                </div>
              ))}
            </div>

            {/* Footer notice */}
            <div style={{
              padding: '16px', background: 'var(--primary-container)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.813rem', color: 'var(--on-primary-container)',
              display: 'flex', gap: '10px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
              <span>© 2024 Executive Insight Management System. Seluruh Hak Cipta Dilindungi.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
