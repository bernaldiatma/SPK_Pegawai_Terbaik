import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function NilaiSaya() {
  const { user } = useAuth();
  const { kriteria, nilai, pegawai, topsisResult } = useData();

  const myNilai = nilai[user?.pegawaiId] || {};
  const myResult = topsisResult?.find(r => r.pegawaiId === user?.pegawaiId);

  // Calculate averages per criteria
  const avgPerKriteria = {};
  kriteria.forEach(k => {
    let sum = 0, count = 0;
    pegawai.forEach(p => {
      if (nilai[p.id]?.[k.id]) { sum += nilai[p.id][k.id]; count++; }
    });
    avgPerKriteria[k.id] = count > 0 ? Math.round(sum / count) : 0;
  });

  const radarData = {
    labels: kriteria.map(k => k.nama),
    datasets: [
      {
        label: 'Nilai Anda',
        data: kriteria.map(k => myNilai[k.id] || 0),
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb',
      },
      {
        label: 'Rata-rata',
        data: kriteria.map(k => avgPerKriteria[k.id] || 0),
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#94a3b8',
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 11, family: 'Inter' } } }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, font: { size: 10 }, backdropColor: 'transparent' },
        pointLabels: { font: { size: 11, family: 'Inter' } },
        grid: { color: 'rgba(0,0,0,0.06)' },
      }
    }
  };

  const myAvg = kriteria.length > 0
    ? Math.round(kriteria.reduce((sum, k) => sum + (myNilai[k.id] || 0), 0) / kriteria.length)
    : 0;

  return (
    <div>
      <div className="page-header">
        <h1>Nilai Saya</h1>
        <p>Detail skor penilaian dan perbandingan dengan rata-rata organisasi.</p>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Rata-rata Skor</span>
            <div className="stat-card-icon blue"><span className="material-symbols-outlined">analytics</span></div>
          </div>
          <div className="stat-card-value">{myAvg}</div>
          <div className="stat-card-sub">Dari {kriteria.length} kriteria</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Peringkat</span>
            <div className="stat-card-icon yellow"><span className="material-symbols-outlined">military_tech</span></div>
          </div>
          <div className="stat-card-value">{myResult ? `#${myResult.rank}` : '—'}</div>
          <div className="stat-card-sub">Dari {pegawai.length} pegawai</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Skor TOPSIS</span>
            <div className="stat-card-icon green"><span className="material-symbols-outlined">insights</span></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>{myResult ? myResult.skorAkhir.toFixed(4) : '—'}</div>
          <div className="stat-card-sub">Preferensi relatif</div>
        </div>
      </div>

      {/* Radar + Detail */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>Profil Kompetensi</h3>
          </div>
          <div className="chart-container" style={{ maxWidth: 360, margin: '0 auto' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Perbandingan per Kriteria</h3>
          </div>
          {kriteria.map(k => {
            const myVal = myNilai[k.id] || 0;
            const avgVal = avgPerKriteria[k.id] || 0;
            const diff = myVal - avgVal;
            return (
              <div key={k.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>{k.nama}</span>
                  <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{myVal}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>vs {avgVal}</span>
                    {diff !== 0 && (
                      <span style={{ fontWeight: 600, color: diff > 0 ? 'var(--success)' : 'var(--error)' }}>
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, height: 8 }}>
                  <div style={{ flex: 1, background: 'var(--surface-dim)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${myVal}%`,
                      height: '100%',
                      background: 'var(--primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 400ms ease',
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, height: 4, marginTop: 2 }}>
                  <div style={{ flex: 1, background: 'var(--surface-dim)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${avgVal}%`,
                      height: '100%',
                      background: '#cbd5e1',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 400ms ease',
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: 16, fontSize: '0.688rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--primary)' }} /> Nilai Anda
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#cbd5e1' }} /> Rata-rata
            </span>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card">
        <div className="card-header">
          <h3>Detail Skor</h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table" style={{ tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Kriteria</th>
                <th style={{ width: '15%' }}>Tipe</th>
                <th className="num" style={{ width: '20%' }}>Nilai Anda</th>
                <th className="num" style={{ width: '20%' }}>Rata-rata</th>
                <th className="num" style={{ width: '15%' }}>Selisih</th>
              </tr>
            </thead>
            <tbody>
              {kriteria.map(k => {
                const myVal = myNilai[k.id] || 0;
                const avgVal = avgPerKriteria[k.id] || 0;
                const diff = myVal - avgVal;
                return (
                  <tr key={k.id}>
                    <td style={{ fontWeight: 600 }}>{k.nama}</td>
                    <td><span className={`badge badge-${k.tipe === 'benefit' ? 'benefit' : 'cost'}`}>{k.tipe}</span></td>
                    <td className="num" style={{ fontWeight: 700, color: 'var(--primary)' }}>{myVal}</td>
                    <td className="num">{avgVal}</td>
                    <td className="num" style={{ fontWeight: 600, color: diff > 0 ? 'var(--success)' : diff < 0 ? 'var(--error)' : 'var(--text-secondary)' }}>
                      {diff > 0 ? '+' : ''}{diff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
