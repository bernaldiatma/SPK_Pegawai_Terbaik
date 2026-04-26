import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AVATAR_COLORS = ['#435b9f', '#625b77', '#506076', '#16a34a', '#d97706'];

export default function AdminDashboard() {
  const { pegawai, kriteria, nilai, ahpResult } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPegawai = pegawai.length;
  const totalKriteria = kriteria.length;

  // Last assessment info
  const hasAHP = ahpResult && ahpResult.cr !== undefined;
  const crValue = hasAHP ? ahpResult.cr.toFixed(3) : null;
  const crPercent = hasAHP ? Math.min(ahpResult.cr / 0.1 * 100, 100) : 0;

  // Recent activity - top 5 pegawai with scores
  const recentActivity = pegawai.slice(0, 5).map((p, i) => {
    const pNilai = nilai[p.id] || {};
    const avg = kriteria.length > 0
      ? Math.round(kriteria.reduce((sum, k) => sum + (pNilai[k.id] || 0), 0) / kriteria.length)
      : 0;
    return { ...p, avg, verified: avg >= 75 };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-banner-content">
          <h2>Selamat Datang Kembali, Admin {user?.nama?.split(' ')[0] || 'Administrator'}.</h2>
          <p>
            Sistem Pendukung Keputusan hari ini telah memproses {totalPegawai} pembaharuan data terbaru.
            Tinjau performa pegawai berdasarkan kriteria AHP yang telah ditetapkan.
          </p>
          <div className="welcome-banner-actions">
            <button className="btn-banner-primary" onClick={() => navigate('/admin/peringkat')}>
              Lihat Peringkat
            </button>
            <button className="btn-banner-secondary" onClick={() => navigate('/admin/ahp')}>
              Panduan Sistem
            </button>
          </div>
        </div>
        <div className="welcome-banner-graphic">
          <span className="material-symbols-outlined">analytics</span>
        </div>
      </section>

      {/* Stats Cards — 3 columns with border-l-4 */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Employees</span>
            <div className="stat-card-icon blue">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-card-value">{totalPegawai}</span>
            <span className="stat-card-sub">+3 bulan ini</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Criteria</span>
            <div className="stat-card-icon purple">
              <span className="material-symbols-outlined">rule</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-card-value">{totalKriteria}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Core Matrix</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Last Assessment</span>
            <div className="stat-card-icon" style={{ background: 'rgba(80,96,118,0.1)', color: 'var(--secondary)' }}>
              <span className="material-symbols-outlined">event_note</span>
            </div>
          </div>
          <div>
            <span className="stat-card-value" style={{ fontSize: '1.5rem' }}>
              {hasAHP ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Belum'}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 500, marginTop: '4px' }}>
              {hasAHP ? 'Period Finalized' : 'Periode Q1 - 2026'}
            </div>
          </div>
        </div>
      </section>

      {/* Activity + AHP — 2:1 grid */}
      <div className="grid-2-3">
        {/* Recent Activity */}
        <div className="card" style={{ padding: '16px 32px' }}>
          <div className="card-header" style={{ marginBottom: '32px' }}>
            <h3>
              <span className="card-indicator" />
              Aktivitas Penilaian Terkini
            </h3>
            <button className="card-action" onClick={() => navigate('/admin/nilai')}>
              Lihat Semua
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="table" style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Pegawai</th>
                  <th style={{ width: '25%' }}>Periode</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Skor</th>
                  <th style={{ width: '20%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((p, i) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-user-avatar" style={{
                          background: `${AVATAR_COLORS[i % AVATAR_COLORS.length]}15`,
                          color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          fontSize: '0.688rem', fontWeight: 700
                        }}>
                          {p.nama.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{p.nama}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="num">{(p.avg / 100).toFixed(3)}</td>
                    <td>
                      <span className={`badge ${p.verified ? 'badge-success' : 'badge-warning'}`}>
                        {p.verified ? 'Verified' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AHP Consistency + Priority */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div>
            <h3 style={{ marginBottom: '24px' }}>Konsistensi AHP</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* CR Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>
                  <span>Consistency Ratio</span>
                  <span style={{ color: 'var(--primary)' }}>{crValue || '—'}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${crPercent}%` }} />
                </div>
                <p style={{ fontSize: '0.625rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>
                  {hasAHP ? `Di bawah threshold 0.1 (${ahpResult.cr < 0.1 ? 'Valid' : 'Invalid'})` : 'Belum ada data pembobotan'}
                </p>
              </div>

              {/* Priority Tasks */}
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--primary)' }}>priority_high</span>
                  Prioritas Utama Hari Ini
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Finalisasi pembobotan kriteria Kedisiplinan', 'Export laporan bulanan pimpinan'].map((task, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '0.75rem', color: '#64748b', cursor: 'pointer'
                    }}>
                      <span style={{
                        width: '6px', height: '6px',
                        background: 'var(--primary)', borderRadius: '50%',
                        marginTop: '5px', flexShrink: 0
                      }} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom image area */}
          <div style={{
            marginTop: '32px', paddingTop: '24px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '128px',
              background: 'linear-gradient(to top, white, rgba(255,255,255,0.4), transparent), linear-gradient(135deg, var(--primary-container), var(--surface-container))',
              display: 'flex', alignItems: 'flex-end', padding: '16px'
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Data Insight Powered by AHP
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
