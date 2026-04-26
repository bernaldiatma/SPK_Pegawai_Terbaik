import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

export default function InputNilai() {
  const { pegawai, kriteria, nilai, updateNilai } = useData();
  const [search, setSearch] = useState('');

  const filtered = pegawai.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nip.includes(search)
  );

  const handleChange = (pegawaiId, kriteriaId, value) => {
    const num = value === '' ? '' : Math.min(100, Math.max(0, parseInt(value) || 0));
    updateNilai(pegawaiId, kriteriaId, num);
  };

  const totalCells = pegawai.length * kriteria.length;
  const filledCells = Object.values(nilai).reduce((sum, obj) => sum + Object.values(obj).filter(v => v !== '' && v !== undefined).length, 0);
  const percent = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;

  const handleSave = () => {
    toast.success('Data nilai berhasil disimpan.');
  };

  return (
    <div>
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Input Nilai Pegawai</h1>
          <p>Masukkan skor penilaian pegawai untuk setiap kriteria (skala 0-100).</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span> Simpan Semua
        </button>
      </div>

      {/* Progress Banner */}
      <div className="banner banner-info" style={{ marginTop: 16 }}>
        <span className="material-symbols-outlined">info</span>
        <div style={{ flex: 1 }}>
          <strong>Progres Pengisian:</strong> {filledCells} dari {totalCells} data terisi ({percent}%)
        </div>
        <div className="progress-bar" style={{ width: 120 }}>
          <div className={`progress-fill ${percent === 100 ? 'green' : percent > 50 ? '' : 'yellow'}`} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Search */}
      <div className="toolbar" style={{ marginTop: 16 }}>
        <div className="toolbar-left">
          <div className="topbar-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Cari pegawai..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            {filtered.length} pegawai × {kriteria.length} kriteria
          </span>
        </div>
      </div>

      {/* Matrix */}
      <div className="table-container">
        <table className="table" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ minWidth: 50 }}>No</th>
              <th style={{ minWidth: 200 }}>Pegawai</th>
              {kriteria.map(k => (
                <th key={k.id} style={{ textAlign: 'center', minWidth: 90 }}>
                  {k.nama}
                  <br />
                  <span className={`badge badge-${k.tipe === 'benefit' ? 'benefit' : 'cost'}`} style={{ marginTop: 4 }}>{k.tipe}</span>
                </th>
              ))}
              <th style={{ textAlign: 'center', minWidth: 80 }}>Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => {
              const vals = kriteria.map(k => nilai[p.id]?.[k.id]);
              const filled = vals.filter(v => v !== undefined && v !== '');
              const avg = filled.length > 0 ? Math.round(filled.reduce((a, b) => a + b, 0) / filled.length) : '—';
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                  <td>
                    <div className="table-user-name">{p.nama}</div>
                    <div className="table-user-sub">{p.jabatan}</div>
                  </td>
                  {kriteria.map(k => {
                    const v = nilai[p.id]?.[k.id];
                    const isEmpty = v === undefined || v === '';
                    return (
                      <td key={k.id} style={{ textAlign: 'center' }}>
                        <input
                          type="number"
                          className={`nilai-input ${isEmpty ? '' : ''}`}
                          min={0}
                          max={100}
                          value={v ?? ''}
                          onChange={e => handleChange(p.id, k.id, e.target.value)}
                          placeholder="—"
                          style={isEmpty ? { borderColor: 'rgba(217,119,6,0.3)', background: '#fffbeb' } : {}}
                        />
                      </td>
                    );
                  })}
                  <td className="num" style={{ fontWeight: 700, textAlign: 'center' }}>{avg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>info</span>
          {' '}Data tersimpan otomatis ke penyimpanan lokal.
        </span>
        <button className="btn btn-primary" onClick={handleSave}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span> Simpan
        </button>
      </div>
    </div>
  );
}
