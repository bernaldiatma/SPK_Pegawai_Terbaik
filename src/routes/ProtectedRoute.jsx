import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" style={{ borderColor: 'rgba(30,58,95,0.2)', borderTopColor: '#1E3A5F', width: 32, height: 32 }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const dashMap = { admin: '/admin', pimpinan: '/pimpinan', pegawai: '/pegawai' };
    return <Navigate to={dashMap[user.role] || '/login'} replace />;
  }

  return children;
}
