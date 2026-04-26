import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const avatarColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#2563eb', '#0d9488', '#be185d', '#4338ca', '#0e7490', '#15803d'];

export default function PeringkatUmum() {
  const { user } = useAuth();
  const { topsisResult } = useData();
  const hasil = topsisResult || [];

  return (
    <div>
      <div className="page-header">
        <h1>Peringkat Umum Pegawai</h1>
        <p>Leaderboard berdasarkan hasil kalkulasi AHP-TOPSIS periode terbaru.</p>
      </div>

      {hasil.length > 0 ? (
        <>
          {/* Top 3 Podium */}
          <div className="podium">
            {hasil.slice(0, 3).map((r, i) => (
              <div key={r.pegawaiId} className={`podium-card ${['gold', 'silver', 'bronze'][i]}`}
                   style={r.pegawaiId === user?.pegawaiId ? { boxShadow: '0 0 0 2px var(--primary-blue)' } : {}}>
                <div className="podium-rank-circle">{i + 1}</div>
                <div className="podium-medal">{['🥇', '🥈', '🥉'][i]}</div>
                <div className="podium-name">
                  {r.nama} {r.pegawaiId === user?.pegawaiId && <span className="badge badge-info">Anda</span>}
                </div>
                <div className="podium-position">{r.jabatan}</div>
                <div className="podium-score">{r.skorAkhir.toFixed(4)}</div>
              </div>
            ))}
          </div>

          {/* Full Table */}
          <div className="table-container">
            <table className="table" style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>Rank</th>
                  <th style={{ width: '30%' }}>Nama Pegawai</th>
                  <th style={{ width: '25%' }}>Jabatan</th>
                  <th className="num" style={{ width: '20%' }}>Skor TOPSIS</th>
                  <th style={{ width: '17%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {hasil.map((r, i) => (
                  <tr key={r.pegawaiId}
                      style={r.pegawaiId === user?.pegawaiId ? { background: 'var(--accent-lighter)' } : {}}>
                    <td style={{ textAlign: 'center' }}>
                      <div className={`rank-circle ${r.rank <= 3 ? ['gold','silver','bronze'][r.rank-1] : 'default'}`} style={{ margin: '0 auto' }}>
                        {r.rank}
                      </div>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-user-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                          {r.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="table-user-name">
                            {r.nama} {r.pegawaiId === user?.pegawaiId && <span className="badge badge-info" style={{ marginLeft: 4 }}>Anda</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.jabatan}</td>
                    <td className="num" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{r.skorAkhir.toFixed(4)}</td>
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
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>leaderboard</span>
            <p>Belum ada data peringkat. Peringkat akan muncul setelah proses kalkulasi selesai.</p>
          </div>
        </div>
      )}
    </div>
  );
}
