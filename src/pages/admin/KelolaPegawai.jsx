import { useState } from 'react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const avatarColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#2563eb', '#0d9488', '#be185d', '#4338ca', '#0e7490', '#15803d'];

export default function KelolaPegawai() {
  const { pegawai, addPegawai, updatePegawai, deletePegawai } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ nip: '', nama: '', jabatan: '', unit: '' });

  const filtered = pegawai.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nip.toLowerCase().includes(search.toLowerCase()) ||
    p.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditData(null); setForm({ nip: '', nama: '', jabatan: '', unit: '' }); setShowModal(true); };
  const openEdit = (p) => { setEditData(p); setForm({ nip: p.nip, nama: p.nama, jabatan: p.jabatan, unit: p.unit || '' }); setShowModal(true); };

  const handleSave = () => {
    if (!form.nip || !form.nama || !form.jabatan) { toast.error('Lengkapi semua field wajib.'); return; }
    if (editData) {
      updatePegawai(editData.id, form);
      toast.success('Data pegawai diperbarui.');
    } else {
      addPegawai(form);
      toast.success('Pegawai baru ditambahkan.');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (showDelete) {
      deletePegawai(showDelete.id);
      toast.success(`${showDelete.nama} telah dihapus.`);
      setShowDelete(null);
    }
  };

  return (
    <div>
      <div className="page-header-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Kelola Data Pegawai</h1>
          <p>Kelola informasi dan data kepegawaian dalam sistem.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
          Tambah Pegawai
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', margin: '20px 0' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Pegawai</span>
            <div className="stat-card-icon blue"><span className="material-symbols-outlined">groups</span></div>
          </div>
          <div className="stat-card-value">{pegawai.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Aktif</span>
            <div className="stat-card-icon green"><span className="material-symbols-outlined">verified</span></div>
          </div>
          <div className="stat-card-value">{pegawai.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Unit Kerja</span>
            <div className="stat-card-icon purple"><span className="material-symbols-outlined">apartment</span></div>
          </div>
          <div className="stat-card-value">{new Set(pegawai.map(p => p.unit || p.jabatan)).size}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="topbar-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Cari pegawai..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_list</span> Filter
          </button>
          <button className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>NIP</th>
              <th style={{ width: '30%' }}>Nama Pegawai</th>
              <th style={{ width: '22%' }}>Jabatan</th>
              <th style={{ width: '18%' }}>Unit</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.nip}</td>
                <td>
                  <div className="table-user-cell">
                    <div className="table-user-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                      {p.nama.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div className="table-user-name">{p.nama}</div>
                      <div className="table-user-sub">NIP: {p.nip}</div>
                    </div>
                  </div>
                </td>
                <td>{p.jabatan}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{p.unit || 'Umum'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Edit">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowDelete(p)} title="Hapus" style={{ color: 'var(--error)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="empty-state" style={{ padding: 40 }}>Tidak ada data ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <h4 style={{ marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 6, color: 'var(--primary-blue)' }}>info</span>
            Informasi Terkini
          </h4>
          <div className="checklist-item done">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Data pegawai telah disinkronkan.</span>
          </div>
          <div className="checklist-item done">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Semua NIP terverifikasi.</span>
          </div>
        </div>
        <div className="integrity-card">
          <h4>
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 6 }}>help</span>
            Butuh Bantuan?
          </h4>
          <p style={{ fontSize: '0.813rem', color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>
            Hubungi admin sistem untuk panduan pengelolaan data pegawai.
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editData ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h3>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">NIP <span style={{ color: 'var(--error)' }}>*</span></label>
                <input className="form-control" value={form.nip} onChange={e => setForm({...form, nip: e.target.value})} placeholder="Masukkan NIP" />
              </div>
              <div className="form-group">
                <label className="form-label">Nama Lengkap <span style={{ color: 'var(--error)' }}>*</span></label>
                <input className="form-control" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="Masukkan nama" />
              </div>
              <div className="form-group">
                <label className="form-label">Jabatan <span style={{ color: 'var(--error)' }}>*</span></label>
                <input className="form-control" value={form.jabatan} onChange={e => setForm({...form, jabatan: e.target.value})} placeholder="Masukkan jabatan" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Kerja</label>
                <input className="form-control" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="Masukkan unit" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                {editData ? 'Simpan Perubahan' : 'Tambah Pegawai'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDelete && (
        <div className="modal-backdrop" onClick={() => setShowDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-body" style={{ paddingTop: 28, textAlign: 'center' }}>
              <div className="confirm-icon danger">
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>delete_forever</span>
              </div>
              <h3 style={{ marginBottom: 8 }}>Hapus Pegawai?</h3>
              <p style={{ fontSize: '0.813rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                Data <strong>{showDelete.nama}</strong> akan dihapus permanen beserta semua nilai terkait.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setShowDelete(null)}>Batal</button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
