import { useState } from 'react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

export default function KelolaKriteria() {
  const { kriteria, addKriteria, updateKriteria, deleteKriteria } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ nama: '', tipe: 'benefit', deskripsi: '' });

  const openAdd = () => { setEditData(null); setForm({ nama: '', tipe: 'benefit', deskripsi: '' }); setShowModal(true); };
  const openEdit = (k) => { setEditData(k); setForm({ nama: k.nama, tipe: k.tipe, deskripsi: k.deskripsi || '' }); setShowModal(true); };

  const handleSave = () => {
    if (!form.nama) { toast.error('Nama kriteria wajib diisi.'); return; }
    if (editData) {
      updateKriteria(editData.id, form);
      toast.success('Kriteria diperbarui.');
    } else {
      addKriteria(form);
      toast.success('Kriteria baru ditambahkan.');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (showDelete) {
      deleteKriteria(showDelete.id);
      toast.success(`Kriteria "${showDelete.nama}" dihapus.`);
      setShowDelete(null);
    }
  };

  return (
    <div>
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Kelola Kriteria Penilaian</h1>
          <p>Tentukan parameter dan atribut kriteria yang digunakan dalam proses penilaian.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
          Tambah Kriteria
        </button>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', margin: '20px 0' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Kriteria</span>
            <div className="stat-card-icon purple"><span className="material-symbols-outlined">tune</span></div>
          </div>
          <div className="stat-card-value">{kriteria.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Benefit</span>
            <div className="stat-card-icon green"><span className="material-symbols-outlined">trending_up</span></div>
          </div>
          <div className="stat-card-value">{kriteria.filter(k => k.tipe === 'benefit').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Cost</span>
            <div className="stat-card-icon red"><span className="material-symbols-outlined">trending_down</span></div>
          </div>
          <div className="stat-card-value">{kriteria.filter(k => k.tipe === 'cost').length}</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ width: '6%' }}>No</th>
              <th style={{ width: '28%' }}>Nama Kriteria</th>
              <th style={{ width: '14%' }}>Tipe</th>
              <th style={{ width: '38%' }}>Deskripsi</th>
              <th style={{ width: '14%', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kriteria.map((k, i) => (
              <tr key={k.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8, color: k.tipe === 'benefit' ? 'var(--success)' : 'var(--error)' }}>
                    {k.tipe === 'benefit' ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  {k.nama}
                </td>
                <td><span className={`badge badge-${k.tipe === 'benefit' ? 'benefit' : 'cost'}`}>{k.tipe.toUpperCase()}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{k.deskripsi || '—'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(k)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowDelete(k)} style={{ color: 'var(--error)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editData ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}</h3>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Kriteria <span style={{ color: 'var(--error)' }}>*</span></label>
                <input className="form-control" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="Contoh: Kinerja" />
              </div>
              <div className="form-group">
                <label className="form-label">Tipe Atribut</label>
                <select className="form-control" value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})}>
                  <option value="benefit">Benefit (Semakin tinggi semakin baik)</option>
                  <option value="cost">Cost (Semakin rendah semakin baik)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <input className="form-control" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} placeholder="Opsional" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                {editData ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="modal-backdrop" onClick={() => setShowDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-body" style={{ paddingTop: 28, textAlign: 'center' }}>
              <div className="confirm-icon danger">
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>delete_forever</span>
              </div>
              <h3 style={{ marginBottom: 8 }}>Hapus Kriteria?</h3>
              <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                Kriteria <strong>"{showDelete.nama}"</strong> akan dihapus dan mempengaruhi semua perhitungan.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setShowDelete(null)}>Batal</button>
                <button className="btn btn-danger" onClick={handleDelete}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
