import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuToggle }) {
  const { user } = useAuth();
  const initial = (user?.nama || 'U').charAt(0);
  const roleLabel = (user?.role || 'USER').toUpperCase();

  return (
    <header className="topbar">
      {/* Left: hamburger only (search removed as non-functional) */}
      <div className="topbar-left">
        <button className="topbar-hamburger" onClick={onMenuToggle}>
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Right: user info + avatar */}
      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-user-info">
            <p className="topbar-user-name">{user?.nama || 'User'}</p>
            <p className="topbar-user-role">{roleLabel}</p>
          </div>
          <div className="topbar-avatar">{initial}</div>
        </div>
      </div>
    </header>
  );
}
