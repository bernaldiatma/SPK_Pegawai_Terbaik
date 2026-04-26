import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_USERS } from '../utils/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed users if not exists
    if (!localStorage.getItem('spk_users')) {
      localStorage.setItem('spk_users', JSON.stringify(DEFAULT_USERS));
    }
    // Check saved session
    const saved = localStorage.getItem('spk_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = (nip, password) => {
    const users = JSON.parse(localStorage.getItem('spk_users') || '[]');
    const found = users.find(u => u.nip === nip && u.password === password);
    if (!found) {
      return { success: false, message: 'NIP atau password salah.' };
    }
    // Find pegawaiId for pegawai role
    let pegawaiId = null;
    if (found.role === 'pegawai') {
      const pegawaiList = JSON.parse(localStorage.getItem('spk_pegawai') || '[]');
      const match = pegawaiList.find(p => p.nip === found.nip);
      pegawaiId = match?.id || null;
    }
    const session = { id: found.id, nip: found.nip, nama: found.nama, role: found.role, jabatan: found.jabatan, pegawaiId };
    setUser(session);
    localStorage.setItem('spk_session', JSON.stringify(session));
    return { success: true, user: session };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spk_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
