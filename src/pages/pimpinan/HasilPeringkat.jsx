import { useState, Fragment } from 'react';
import { useData } from '../../context/DataContext';
import { exportPDF } from '../../utils/exportPDF';
import { exportExcel } from '../../utils/exportExcel';
import toast from 'react-hot-toast';

export default function HasilPeringkat() {
  const { topsisResult, kriteria, ahpResult, runTOPSIS } = useData();
  const [expandedRow, setExpandedRow] = useState(null);

  const hasil = topsisResult || [];
  const top3 = hasil.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];
  const maxScore = hasil.length > 0 ? Math.max(...hasil.map(r => r.skorAkhir)) : 0;
  const avgScore = hasil.length > 0 ? hasil.reduce((s, r) => s + r.skorAkhir, 0) / hasil.length : 0;
  const topName = hasil[0]?.nama || '—';

  const handleExportPDF = () => {
    try { exportPDF(hasil, kriteria, ahpResult?.weights); toast.success('PDF berhasil diunduh.'); }
    catch { toast.error('Gagal membuat PDF.'); }
  };
  const handleExportExcel = () => {
    try { exportExcel(hasil, kriteria, ahpResult?.weights); toast.success('Excel berhasil diunduh.'); }
    catch { toast.error('Gagal membuat Excel.'); }
  };
  const handleRecalculate = () => {
    const r = runTOPSIS();
    if (r) toast.success('Peringkat dihitung ulang.');
    else toast.error('Gagal. Pastikan bobot sudah diatur.');
  };

  if (hasil.length === 0) {
    return (
      <div>
        <div className="page-header"><h1>Hasil Peringkat Pegawai</h1></div>
        <div className="card">
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>military_tech</span>
            <p>Belum ada hasil peringkat. Atur bobot kriteria (AHP) terlebih dahulu, lalu hitung peringkat.</p>
          </div>
          {ahpResult?.isConsistent && (
            <div style={{ textAlign: 'center', paddingBottom: 24 }}>
              <button className="btn btn-primary" onClick={handleRecalculate}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calculate</span> Hitung Peringkat Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header-actions" style={{ marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Hasil Peringkat Pegawai Terbaik</h1>
          <p>Berdasarkan perhitungan metode AHP-TOPSIS.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handleRecalculate}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span> Hitung Ulang
          </button>
          <button className="btn btn-outline" onClick={handleExportPDF}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>picture_as_pdf</span> PDF
          </button>
          <button className="btn btn-outline" onClick={handleExportExcel}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>table_chart</span> Excel
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Dinilai</span>
            <div className="stat-card-icon blue"><span className="material-symbols-outlined">groups</span></div>
          </div>
          <div className="stat-card-value">{hasil.length}</div>
          <div className="stat-card-sub">Pegawai terevaluasi</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Skor Tertinggi</span>
            <div className="stat-card-icon green"><span className="material-symbols-outlined">emoji_events</span></div>
          </div>
          <div className="stat-card-value">{maxScore.toFixed(4)}</div>
          <div className="stat-card-sub">{topName}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Rata-rata</span>
            <div className="stat-card-icon yellow"><span className="material-symbols-outlined">analytics</span></div>
          </div>
          <div className="stat-card-value">{avgScore.toFixed(4)}</div>
          <div className="stat-card-sub">Skor rata-rata organisasi</div>
        </div>
      </div>

      {/* Podium */}
      <div className="podium">
        {top3.map((r, i) => (
          <div key={r.pegawaiId} className={`podium-card ${['gold', 'silver', 'bronze'][i]}`}>
            <div className={`podium-rank-circle`}>{i + 1}</div>
            <div className="podium-medal">{medals[i]}</div>
            <div className="podium-name">{r.nama}</div>
            <div className="podium-position">{r.jabatan}</div>
            <div className="podium-score">{r.skorAkhir.toFixed(4)}</div>
            <span className={`badge ${r.skorAkhir >= 0.7 ? 'badge-success' : 'badge-info'}`} style={{ marginTop: 8 }}>
              {r.skorAkhir >= 0.7 ? 'Sangat Baik' : 'Baik'}
            </span>
          </div>
        ))}
      </div>

      {/* Full Table */}
      <div className="table-container" style={{ marginBottom: 24 }}>
        <table className="table" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ width: '6%', textAlign: 'center' }}>Rank</th>
              <th style={{ width: '20%' }}>Nama Pegawai</th>
              <th style={{ width: '18%' }}>Jabatan</th>
              <th className="num" style={{ width: '12%' }}>D+</th>
              <th className="num" style={{ width: '12%' }}>D-</th>
              <th className="num" style={{ width: '14%' }}>Skor Akhir</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '6%', textAlign: 'center' }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map(r => (
              <Fragment key={r.pegawaiId}>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <div className={`rank-circle ${r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : 'default'}`} style={{ margin: '0 auto' }}>
                      {r.rank}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.nama}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.jabatan}</td>
                  <td className="num">{r.dPlus.toFixed(4)}</td>
                  <td className="num">{r.dMinus.toFixed(4)}</td>
                  <td className="num" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{r.skorAkhir.toFixed(4)}</td>
                  <td>
                    <span className={`badge ${r.skorAkhir >= 0.7 ? 'badge-success' : r.skorAkhir >= 0.5 ? 'badge-info' : 'badge-warning'}`}>
                      {r.skorAkhir >= 0.7 ? 'Sangat Baik' : r.skorAkhir >= 0.5 ? 'Baik' : 'Cukup'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setExpandedRow(expandedRow === r.pegawaiId ? null : r.pegawaiId)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{expandedRow === r.pegawaiId ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </td>
                </tr>
                {expandedRow === r.pegawaiId && (
                  <tr>
                    <td colSpan={8} style={{ background: 'var(--surface-dim)', padding: 20 }}>
                      <strong style={{ fontSize: '0.813rem' }}>Detail Skor per Kriteria:</strong>
                      <table className="table" style={{ marginTop: 8 }}>
                        <thead>
                          <tr>
                            <th>Kriteria</th>
                            <th className="num">Mentah</th>
                            <th className="num">Normalisasi</th>
                            <th className="num">Terbobot</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kriteria.map(k => {
                            const d = r.skorDetail?.[k.id];
                            return (
                              <tr key={k.id}>
                                <td>{k.nama} <span className={`badge badge-${k.tipe === 'benefit' ? 'benefit' : 'cost'}`}>{k.tipe}</span></td>
                                <td className="num">{d?.mentah ?? '—'}</td>
                                <td className="num">{d?.normalisasi?.toFixed(4) ?? '—'}</td>
                                <td className="num">{d?.terbobot?.toFixed(4) ?? '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="cta-dark">
        <h4>Siap untuk Laporan Akhir?</h4>
        <p>Unduh hasil peringkat dalam format PDF atau Excel untuk keperluan dokumentasi dan laporan resmi.</p>
        <button className="btn" onClick={handleExportPDF}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Unduh Laporan PDF
        </button>
      </div>
    </div>
  );
}
