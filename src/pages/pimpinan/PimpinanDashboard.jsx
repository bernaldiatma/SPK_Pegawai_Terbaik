import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AVATAR_COLORS = ['#435b9f', '#625b77', '#506076', '#16a34a', '#d97706'];

export default function PimpinanDashboard() {
  const { user } = useAuth();
  const { pegawai, kriteria, ahpResult, topsisResult, runTOPSIS } = useData();
  const navigate = useNavigate();

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const hasil = topsisResult || [];
  const top5 = hasil.slice(0, 5);
  const avgScore = hasil.length > 0
    ? hasil.reduce((s, r) => s + r.skorAkhir, 0) / hasil.length
    : 0;
  const excellent = hasil.filter(r => r.skorAkhir >= 0.7).length;
  const good = hasil.filter(r => r.skorAkhir >= 0.5 && r.skorAkhir < 0.7).length;
  const fair = hasil.filter(r => r.skorAkhir >= 0.3 && r.skorAkhir < 0.5).length;
  const poor = hasil.filter(r => r.skorAkhir < 0.3).length;
  const total = hasil.length || 1;
  const needsAHP = !ahpResult || !ahpResult.isConsistent;
  const crValue = ahpResult ? ahpResult.cr : null;
  const crPercent = ahpResult ? Math.min(ahpResult.cr / 0.1 * 100, 100) : 0;

  const handleCalc = () => {
    runTOPSIS();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Welcome Banner ── */}
      <section className="welcome-banner">
        <div className="welcome-banner-content">
          <h2>Selamat Datang, {user?.nama || 'Pimpinan'}.</h2>
          <p>
            Tinjau kinerja {pegawai.length} pegawai berdasarkan {kriteria.length} kriteria AHP.
            {dateStr}.
          </p>
          <div className="welcome-banner-actions">
            <button className="btn-banner-primary" onClick={() => navigate('/pimpinan/peringkat')}>
              Lihat Peringkat
            </button>
            <button className="btn-banner-secondary" onClick={() => navigate('/pimpinan/ahp')}>
              Pembobotan AHP
            </button>
          </div>
        </div>
        <div className="welcome-banner-graphic">
          <span className="material-symbols-outlined">leaderboard</span>
        </div>
      </section>

      {/* ── AHP Warning Banner ── */}
      {needsAHP && (
        <div className="banner banner-warning">
          <span className="material-symbols-outlined">warning</span>
          <span style={{ flex: 1, fontSize: '0.875rem' }}>
            Pembobotan AHP belum konsisten. Atur ulang matriks perbandingan sebelum menghitung peringkat.
          </span>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem' }} onClick={() => navigate('/pimpinan/ahp')}>
            Atur Sekarang
          </button>
        </div>
      )}

      {/* ── Stats Grid — 3 cards ── */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Pegawai</span>
            <div className="stat-card-icon blue">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-card-value">{pegawai.length}</span>
            <span className="stat-card-sub">+4 bulan ini</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Kriteria</span>
            <div className="stat-card-icon purple">
              <span className="material-symbols-outlined">rule</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-card-value">{kriteria.length}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Core Matrix</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Rata-rata Skor</span>
            <div className="stat-card-icon gray">
              <span className="material-symbols-outlined">insights</span>
            </div>
          </div>
          <div>
            <span className="stat-card-value" style={{ fontSize: '1.75rem' }}>
              {avgScore > 0 ? avgScore.toFixed(3) : '—'}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 500, marginTop: '4px' }}>
              Periode terbaru
            </div>
          </div>
        </div>
      </section>

      {/* ── Activity Table + AHP Insights (2:1 grid) ── */}
      <div className="grid-2-3">
        {/* Left: Top Rankings Table */}
        <div className="card" style={{ padding: '16px 32px' }}>
          <div className="card-header" style={{ marginBottom: '32px' }}>
            <h3>
              <span className="card-indicator" />
              Peringkat Pegawai Terbaik
            </h3>
            <button className="card-action" onClick={() => navigate('/pimpinan/peringkat')}>
              Lihat Semua
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </button>
          </div>

          {top5.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>Rank</th>
                    <th>Pegawai</th>
                    <th style={{ textAlign: 'center' }}>Skor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {top5.map((r, i) => (
                    <tr key={r.pegawaiId}>
                      <td>
                        <div className={`rank-circle ${r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : ''}`}>
                          {r.rank}
                        </div>
                      </td>
                      <td>
                        <div className="table-user-cell">
                          <div className="table-user-avatar" style={{
                            background: `${AVATAR_COLORS[i % AVATAR_COLORS.length]}15`,
                            color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          }}>
                            {r.nama.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="table-user-name">{r.nama}</div>
                            <div className="table-user-sub">{r.jabatan}</div>
                          </div>
                        </div>
                      </td>
                      <td className="num">{r.skorAkhir.toFixed(4)}</td>
                      <td>
                        <span className={`badge ${r.skorAkhir >= 0.7 ? 'badge-success' : r.skorAkhir >= 0.5 ? 'badge-info' : 'badge-warning'}`}>
                          {r.skorAkhir >= 0.7 ? 'Sangat Baik' : r.skorAkhir >= 0.5 ? 'Baik' : 'Cukup'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span className="material-symbols-outlined">bar_chart</span>
              <p>Belum ada data peringkat. Jalankan pembobotan AHP dan perhitungan TOPSIS terlebih dahulu.</p>
            </div>
          )}
        </div>

        {/* Right: AHP Consistency + Statistics */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div>
            <h3 style={{ marginBottom: '24px' }}>Konsistensi AHP</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* CR Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.625rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8',
                }}>
                  <span>Consistency Ratio</span>
                  <span style={{ color: 'var(--primary)' }}>{crValue !== null ? crValue.toFixed(3) : '—'}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${crPercent}%` }} />
                </div>
                <p style={{ fontSize: '0.625rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>
                  {ahpResult
                    ? `Di bawah threshold 0.1 (${ahpResult.isConsistent ? 'Valid' : 'Invalid'})`
                    : 'Belum ada data pembobotan'}
                </p>
              </div>

              {/* Distribution Summary */}
              <div style={{
                padding: '16px', background: '#f8fafc', borderRadius: '8px',
                border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <p style={{
                  fontSize: '0.75rem', fontWeight: 700,
                  color: 'var(--on-surface-variant)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--primary)' }}>analytics</span>
                  Distribusi Skor Pegawai
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Sangat Baik (≥0.7)', count: excellent, color: 'var(--success)' },
                    { label: 'Baik (0.5-0.7)', count: good, color: 'var(--primary)' },
                    { label: 'Cukup (0.3-0.5)', count: fair, color: 'var(--warning)' },
                    { label: 'Kurang (<0.3)', count: poor, color: 'var(--error)' },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '0.75rem', color: '#64748b',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: item.color, flexShrink: 0,
                      }} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                        {hasil.length > 0 ? item.count : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>

          {/* Bottom insight */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{
              position: 'relative', borderRadius: '8px',
              overflow: 'hidden', height: '128px',
              background: 'linear-gradient(to top, white, rgba(255,255,255,0.4), transparent), linear-gradient(135deg, var(--primary-container), var(--surface-container))',
              display: 'flex', alignItems: 'flex-end', padding: '16px',
            }}>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                Data Insight Powered by AHP-TOPSIS
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
