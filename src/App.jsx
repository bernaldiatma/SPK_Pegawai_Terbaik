import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import KelolaPegawai from './pages/admin/KelolaPegawai';
import KelolaKriteria from './pages/admin/KelolaKriteria';
import InputNilai from './pages/admin/InputNilai';
import PimpinanDashboard from './pages/pimpinan/PimpinanDashboard';
import PembobotanAHP from './pages/pimpinan/PembobotanAHP';
import HasilPeringkat from './pages/pimpinan/HasilPeringkat';
import Laporan from './pages/pimpinan/Laporan';
import PegawaiDashboard from './pages/pegawai/PegawaiDashboard';
import PeringkatUmum from './pages/pegawai/PeringkatUmum';
import NilaiSaya from './pages/pegawai/NilaiSaya';

function RedirectToDashboard() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const routes = { admin: '/admin', pimpinan: '/pimpinan', pegawai: '/pegawai' };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RedirectToDashboard />} />

      {/* Admin Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pegawai" element={<KelolaPegawai />} />
        <Route path="/admin/kriteria" element={<KelolaKriteria />} />
        <Route path="/admin/nilai" element={<InputNilai />} />
        <Route path="/admin/ahp" element={<PembobotanAHP />} />
        <Route path="/admin/peringkat" element={<HasilPeringkat />} />
        <Route path="/admin/laporan" element={<Laporan />} />
        <Route path="/admin/pengaturan" element={<Settings />} />
      </Route>

      {/* Pimpinan Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['pimpinan']}>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route path="/pimpinan" element={<PimpinanDashboard />} />
        <Route path="/pimpinan/ahp" element={<PembobotanAHP />} />
        <Route path="/pimpinan/peringkat" element={<HasilPeringkat />} />
        <Route path="/pimpinan/laporan" element={<Laporan />} />
        <Route path="/pimpinan/pengaturan" element={<Settings />} />
      </Route>

      {/* Pegawai Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['pegawai']}>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route path="/pegawai" element={<PegawaiDashboard />} />
        <Route path="/pegawai/peringkat" element={<PeringkatUmum />} />
        <Route path="/pegawai/nilai" element={<NilaiSaya />} />
        <Route path="/pegawai/pengaturan" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
