import { useData } from '../../context/DataContext';
import { exportPDF } from '../../utils/exportPDF';
import { exportExcel } from '../../utils/exportExcel';
import toast from 'react-hot-toast';

export default function Laporan() {
  const { topsisResult, kriteria, ahpResult, pegawai } = useData();
  const hasil = topsisResult || [];

  const handlePDF = () => {
    try { exportPDF(hasil, kriteria, ahpResult?.weights); toast.success('PDF berhasil diunduh.'); }
    catch { toast.error('Gagal membuat PDF.'); }
  };
  const handleExcel = () => {
    try { exportExcel(hasil, kriteria, ahpResult?.weights); toast.success('Excel berhasil diunduh.'); }
    catch { toast.error('Gagal membuat Excel.'); }
  };

  const avgScore = hasil.length > 0 ? (hasil.reduce((s, r) => s + r.skorAkhir, 0) / hasil.length).toFixed(4) : '—';
  const topScore = hasil.length > 0 ? hasil[0].skorAkhir.toFixed(4) : '—';

  return (
    <div>
      <div className="page-header">
        <h1>Laporan & Ekspor Data</h1>
        <p>Unduh hasil analisis peringkat pegawai dalam berbagai format dokumen.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Pegawai</span>
            <div className="stat-card-icon blue"><span className="material-symbols-outlined">groups</span></div>
          </div>
          <div className="stat-card-value">{pegawai.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Teranalisis</span>
            <div className="stat-card-icon green"><span className="material-symbols-outlined">fact_check</span></div>
          </div>
          <div className="stat-card-value">{hasil.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Skor Tertinggi</span>
            <div className="stat-card-icon yellow"><span className="material-symbols-outlined">emoji_events</span></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>{topScore}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Rata-Rata</span>
            <div className="stat-card-icon purple"><span className="material-symbols-outlined">analytics</span></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>{avgScore}</div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 36 }}>
          <div className="stat-card-icon red" style={{ width: 56, height: 56, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>picture_as_pdf</span>
          </div>
          <h3 style={{ marginBottom: 4 }}>Laporan PDF</h3>
          <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 300, lineHeight: 1.6 }}>
            Unduh tabel peringkat formal dengan kop surat resmi. Cocok untuk dokumentasi dan laporan pimpinan.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handlePDF} disabled={hasil.length === 0}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span> Unduh PDF
          </button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 36 }}>
          <div className="stat-card-icon green" style={{ width: 56, height: 56, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>table_chart</span>
          </div>
          <h3 style={{ marginBottom: 4 }}>Laporan Excel</h3>
          <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 300, lineHeight: 1.6 }}>
            Spreadsheet lengkap dengan 3 sheet: peringkat, bobot kriteria, dan detail skor per pegawai.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleExcel} disabled={hasil.length === 0}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span> Unduh Excel
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {hasil.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Preview Peringkat</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{hasil.length} pegawai</span>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table" style={{ tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>Rank</th>
                  <th style={{ width: '28%' }}>Nama</th>
                  <th style={{ width: '25%' }}>Jabatan</th>
                  <th className="num" style={{ width: '22%' }}>Skor Akhir</th>
                  <th style={{ width: '17%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {hasil.slice(0, 10).map(r => (
                  <tr key={r.pegawaiId}>
                    <td>
                      <div className={`rank-circle ${r.rank <= 3 ? ['gold','silver','bronze'][r.rank-1] : 'default'}`}>
                        {r.rank}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.nama}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.jabatan}</td>
                    <td className="num" style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.skorAkhir.toFixed(4)}</td>
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
        </div>
      )}

      {hasil.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>description</span>
            <p>Belum ada data untuk diekspor. Jalankan perhitungan peringkat terlebih dahulu.</p>
          </div>
        </div>
      )}
    </div>
  );
}
