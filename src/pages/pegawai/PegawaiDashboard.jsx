import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function PegawaiDashboard() {
  const { user } = useAuth();
  const { kriteria, nilai, topsisResult, pegawai } = useData();
  const navigate = useNavigate();

  const myNilai = nilai[user?.pegawaiId] || {};
  const hasil = topsisResult || [];
  const myRank = hasil.find(r => r.pegawaiId === user?.pegawaiId);
  const totalPegawai = pegawai.length;

  const radarData = {
    labels: kriteria.map(k => k.nama),
    datasets: [{
      label: 'Nilai Anda',
      data: kriteria.map(k => myNilai[k.id] || 0),
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      borderColor: '#2563eb',
      borderWidth: 2,
      pointBackgroundColor: '#2563eb',
      pointRadius: 4,
    }]
  };

  const radarOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, font: { size: 10 } },
        pointLabels: { font: { size: 11, family: 'Inter' } },
        grid: { color: 'rgba(0,0,0,0.06)' },
      }
    }
  };

  const kpiCards = kriteria.slice(0, 4).map((k, i) => {
    const icons = ['workspace_premium', 'handshake', 'schedule', 'trending_up'];
    const colors = ['blue', 'green', 'yellow', 'purple'];
    return { ...k, value: myNilai[k.id] || 0, icon: icons[i] || 'star', color: colors[i] || 'blue' };
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner" style={{ marginBottom: 24 }}>
        <div className="welcome-banner-content">
          <h2>Selamat Datang, {user?.nama}!</h2>
          <p>
            {myRank
              ? `Anda menempati peringkat #${myRank.rank} dari ${totalPegawai} pegawai dengan skor ${myRank.skorAkhir.toFixed(4)}.`
              : 'Lihat performa dan perkembangan kinerja Anda di halaman ini.'}
          </p>
          <div className="welcome-banner-actions">
            <button className="btn-banner-primary" onClick={() => navigate('/pegawai/nilai')}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>analytics</span>
              Lihat Nilai Saya
            </button>
            <button className="btn-banner-secondary" onClick={() => navigate('/pegawai/peringkat')}>
              Peringkat Umum
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        {kpiCards.map(k => (
          <div key={k.id} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{k.nama}</span>
              <div className={`stat-card-icon ${k.color}`}>
                <span className="material-symbols-outlined">{k.icon}</span>
              </div>
            </div>
            <div className="stat-card-value">{k.value}</div>
            <div className="stat-card-sub">Skala 0-100</div>
            <div style={{ marginTop: 8 }}>
              <div className="progress-bar">
                <div className={`progress-fill ${k.color === 'green' ? 'green' : k.color === 'yellow' ? 'yellow' : k.color === 'purple' ? 'purple' : ''}`} style={{ width: `${k.value}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar + Ranking */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Radar Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Profil Kompetensi</h3>
          </div>
          <div className="chart-container" style={{ maxWidth: 350, margin: '0 auto' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Ranking Preview */}
        <div className="card">
          <div className="card-header">
            <h3>Peringkat Teratas</h3>
            <span className="card-action" onClick={() => navigate('/pegawai/peringkat')}>Lihat Semua →</span>
          </div>
          {hasil.length > 0 ? (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>Rank</th>
                    <th>Nama</th>
                    <th style={{ textAlign: 'right' }}>Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.slice(0, 5).map(r => (
                    <tr key={r.pegawaiId} style={r.pegawaiId === user?.pegawaiId ? { background: 'var(--accent-lighter)' } : {}}>
                      <td>
                        <div className={`rank-circle ${r.rank <= 3 ? ['gold','silver','bronze'][r.rank-1] : 'default'}`}>
                          {r.rank}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: r.pegawaiId === user?.pegawaiId ? 700 : 500 }}>
                          {r.nama} {r.pegawaiId === user?.pegawaiId && <span className="badge badge-info" style={{ marginLeft: 4 }}>Anda</span>}
                        </span>
                      </td>
                      <td className="num" style={{ fontWeight: 600 }}>{r.skorAkhir.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 32 }}>
              <span className="material-symbols-outlined">leaderboard</span>
              <p>Belum ada data peringkat.</p>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="card">
        <div className="card-header">
          <h3>Tentang Sistem SPK</h3>
        </div>
        <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Sistem Pendukung Keputusan (SPK) Pegawai Terbaik menggunakan metode <strong>AHP</strong> (Analytic Hierarchy Process) 
          untuk menentukan bobot kriteria dan <strong>TOPSIS</strong> (Technique for Order of Preference by Similarity to Ideal Solution) 
          untuk menghasilkan peringkat pegawai secara objektif dan transparan.
        </p>
      </div>
    </div>
  );
}
