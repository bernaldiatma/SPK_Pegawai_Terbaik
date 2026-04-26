import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = {
  admin: [
    { to: '/admin', icon: 'dashboard', label: 'Beranda', end: true },
    { to: '/admin/pegawai', icon: 'badge', label: 'Kelola Pegawai' },
    { to: '/admin/kriteria', icon: 'tune', label: 'Kelola Kriteria' },
    { to: '/admin/nilai', icon: 'edit_note', label: 'Input Nilai' },
    { to: '/admin/ahp', icon: 'account_tree', label: 'Pembobotan AHP' },
    { to: '/admin/peringkat', icon: 'military_tech', label: 'Hasil Peringkat' },
    { to: '/admin/laporan', icon: 'description', label: 'Laporan' },
  ],
  pimpinan: [
    { to: '/pimpinan', icon: 'dashboard', label: 'Beranda', end: true },
    { to: '/pimpinan/ahp', icon: 'account_tree', label: 'Pembobotan AHP' },
    { to: '/pimpinan/peringkat', icon: 'military_tech', label: 'Hasil Peringkat' },
    { to: '/pimpinan/laporan', icon: 'description', label: 'Laporan' },
  ],
  pegawai: [
    { to: '/pegawai', icon: 'dashboard', label: 'Beranda', end: true },
    { to: '/pegawai/peringkat', icon: 'military_tech', label: 'Peringkat Umum' },
    { to: '/pegawai/nilai', icon: 'assessment', label: 'Nilai Saya' },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = MENU[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay — matches Stitch: fixed inset-0 bg-black/50 z-[45] */}
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar — matches Stitch: fixed left-0 top-0 h-screen w-64 bg-white */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand header — matches Stitch: p-6 flex items-center justify-between */}
        <div className="sidebar-brand">
          <div>
            <h1 className="sidebar-brand-title">Performance SPK</h1>
            <p className="sidebar-brand-sub">MANAGEMENT SYSTEM</p>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation — matches Stitch: flex-1 mt-4 px-2 space-y-1 overflow-y-auto */}
        <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer — Settings + Logout, both in sidebar-footer */}
        <div className="sidebar-footer">
          {/* Settings — matches Stitch: px-2 pt-2 border-t border-slate-50 */}
          <NavLink
            to={`/${user?.role || 'admin'}/pengaturan`}
            className={({ isActive }) =>
              `sidebar-link sidebar-link-settings ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Pengaturan</span>
          </NavLink>

          {/* Logout — matches Stitch: px-6 pb-6 pt-4, flex items-center gap-3 */}
          <button className="sidebar-logout" onClick={handleLogout}>
            <div className="sidebar-logout-icon">
              <span className="material-symbols-outlined">logout</span>
            </div>
            <span className="sidebar-logout-text">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
