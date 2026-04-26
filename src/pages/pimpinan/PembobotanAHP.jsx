import { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getPairKeys, interpretScale, buildMatrix, calculateAHP } from '../../utils/ahpCalculation';
import toast from 'react-hot-toast';

export default function PembobotanAHP() {
  const { kriteria, pairwise, updatePairwise, runAHP, ahpResult, runTOPSIS } = useData();
  const [localPairwise, setLocalPairwise] = useState({ ...pairwise });
  const [result, setResult] = useState(ahpResult);

  const kriteriaIds = useMemo(() => kriteria.map(k => k.id), [kriteria]);
  const pairs = useMemo(() => getPairKeys(kriteriaIds), [kriteriaIds]);
  const kriteriaMap = useMemo(() => Object.fromEntries(kriteria.map(k => [k.id, k])), [kriteria]);

  useEffect(() => {
    if (kriteriaIds.length < 2) return;
    const r = calculateAHP(kriteriaIds, localPairwise);
    setResult(r);
  }, [localPairwise, kriteriaIds]);

  const handleSliderChange = (key, rawValue) => {
    const val = parseInt(rawValue, 10);
    setLocalPairwise(prev => ({ ...prev, [key]: val }));
  };

  const sliderToAHP = (sv) => { if (sv === 0) return 1; return sv > 0 ? sv + 1 : sv - 1; };
  const ahpToSlider = (v) => { if (!v || v === 1) return 0; return v > 0 ? v - 1 : v + 1; };

  const handleSave = () => {
    Object.entries(localPairwise).forEach(([key, val]) => updatePairwise(key, val));
    const ahp = runAHP();
    if (ahp?.isConsistent) {
      const t = runTOPSIS();
      toast.success(`Bobot disimpan & peringkat dihitung! CR = ${ahp.cr}`);
    } else if (ahp) {
      toast.error(`Tidak konsisten (CR = ${ahp.cr}). Silakan revisi.`);
    }
  };

  const handleReset = () => {
    const resetPw = {};
    pairs.forEach(p => { resetPw[p.key] = 1; });
    setLocalPairwise(resetPw);
    toast.success('Semua perbandingan direset ke "Sama Penting".');
  };

  const matrix = useMemo(() => {
    if (kriteriaIds.length < 2) return [];
    return buildMatrix(kriteriaIds, localPairwise);
  }, [kriteriaIds, localPairwise]);

  if (kriteria.length < 2) {
    return (
      <div>
        <div className="page-header"><h1>Pembobotan AHP</h1></div>
        <div className="card">
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: 56 }}>account_tree</span>
            <p>Dibutuhkan minimal 2 kriteria. Saat ini hanya ada {kriteria.length} kriteria.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header-actions" style={{ marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Pembobotan Kriteria (AHP)</h1>
          <p>Bandingkan tingkat kepentingan antar kriteria menggunakan skala Saaty 1-9.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={handleReset}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>restart_alt</span> Reset
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={result && !result.isConsistent}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span> Simpan Bobot
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Pairwise Sliders */}
        <div>
          <h4 style={{ marginBottom: 12 }}>
            Perbandingan Berpasangan
            <span className="badge badge-neutral" style={{ marginLeft: 8 }}>{pairs.length} pasang</span>
          </h4>
          {pairs.map(pair => {
            const val = localPairwise[pair.key] || 1;
            const sliderVal = ahpToSlider(val);
            const leftName = kriteriaMap[pair.left]?.nama || pair.left;
            const rightName = kriteriaMap[pair.right]?.nama || pair.right;
            const absVal = Math.abs(val);
            const direction = val > 1 ? leftName : val < -1 ? rightName : 'Keduanya';
            const interp = interpretScale(val);

            return (
              <div className="ahp-pair-card" key={pair.key}>
                <div className="ahp-pair-header">
                  <span className="ahp-criteria-label">{leftName}</span>
                  <span className="ahp-scale-badge">
                    {absVal === 1 ? 'Sama Penting' : `${direction} — ${interp} (${absVal})`}
                  </span>
                  <span className="ahp-criteria-label" style={{ textAlign: 'right' }}>{rightName}</span>
                </div>
                <div className="ahp-slider-row">
                  <input
                    type="range" min={-8} max={8} step={1} value={sliderVal}
                    onChange={e => handleSliderChange(pair.key, sliderToAHP(parseInt(e.target.value, 10)))}
                  />
                </div>
                <div className="ahp-slider-hints">
                  <span>← {leftName}</span>
                  <span>{rightName} →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* CR Status */}
          {result && (
            <div className="card">
              <h4 style={{ marginBottom: 12 }}>Konsistensi (CR)</h4>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: result.isConsistent ? 'var(--success)' : 'var(--error)',
                }}>
                  {result.cr}
                </div>
                <span className={`badge ${result.isConsistent ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: 8 }}>
                  {result.isConsistent ? 'VALID (CR < 0.10)' : 'TIDAK VALID'}
                </span>
              </div>
              <div className={`cr-box ${result.isConsistent ? 'valid' : 'invalid'}`}>
                <span className="material-symbols-outlined">{result.isConsistent ? 'check_circle' : 'warning'}</span>
                <div>
                  <div className="cr-box-title">{result.isConsistent ? 'Pembobotan Konsisten' : 'Revisi Diperlukan'}</div>
                  <div className="cr-box-sub">
                    {result.isConsistent
                      ? 'Perbandingan Anda logis dan siap digunakan.'
                      : 'Perbaiki perbandingan yang saling bertentangan.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weights */}
          {result && (
            <div className="card">
              <h4 style={{ marginBottom: 16 }}>Estimasi Bobot</h4>
              {kriteria.map((k, i) => {
                const w = result.weights?.[i] || 0;
                return (
                  <div key={k.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.813rem', fontWeight: 500 }}>{k.nama}</span>
                      <span style={{ fontSize: '0.813rem', fontWeight: 700 }}>{(w * 100).toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${w * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Matrix Preview */}
          <div className="card">
            <h4 style={{ marginBottom: 12 }}>Matriks Perbandingan</h4>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    {kriteria.map(k => <th key={k.id} style={{ textAlign: 'center', fontSize: '0.625rem' }}>{k.nama.substring(0, 6)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {kriteria.map((k, i) => (
                    <tr key={k.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.688rem' }}>{k.nama.substring(0, 8)}</td>
                      {kriteria.map((k2, j) => (
                        <td key={k2.id} className="num" style={{ textAlign: 'center', fontSize: '0.75rem' }}>
                          {matrix[i] ? matrix[i][j]?.toFixed(2) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 8, alignItems: 'center' }}>
        {result && !result.isConsistent && (
          <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>error</span>
            {' '}Tidak dapat menyimpan — pembobotan harus konsisten.
          </span>
        )}
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={result && !result.isConsistent}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span> Simpan & Hitung Peringkat
        </button>
      </div>
    </div>
  );
}
