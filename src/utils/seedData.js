// Data awal (seed) untuk demo aplikasi SPK Pegawai Terbaik

export const DEFAULT_USERS = [
  { id: 'u1', nip: 'admin', nama: 'Administrator', password: 'admin123', role: 'admin', jabatan: 'Administrator Sistem' },
  { id: 'u2', nip: 'pimpinan', nama: 'Dr. Hendra Wijaya', password: 'pimpinan123', role: 'pimpinan', jabatan: 'Kepala Divisi' },
  { id: 'u3', nip: '198501012010011001', nama: 'Budi Santoso', password: 'pegawai123', role: 'pegawai', jabatan: 'Analis Kebijakan' },
  { id: 'u4', nip: '198703152011012002', nama: 'Siti Aminah', password: 'pegawai123', role: 'pegawai', jabatan: 'Staf Administrasi' },
  { id: 'u5', nip: '199001202012011003', nama: 'Andi Pratama', password: 'pegawai123', role: 'pegawai', jabatan: 'Operator Komputer' },
  { id: 'u6', nip: '198812052013011004', nama: 'Rina Wati', password: 'pegawai123', role: 'pegawai', jabatan: 'Sekretaris' },
  { id: 'u7', nip: '199205102014011005', nama: 'Dewi Lestari', password: 'pegawai123', role: 'pegawai', jabatan: 'Staf Keuangan' },
  { id: 'u8', nip: '198609252015011006', nama: 'Agus Hermawan', password: 'pegawai123', role: 'pegawai', jabatan: 'Pengawas Lapangan' },
  { id: 'u9', nip: '199107302016011007', nama: 'Nur Hidayah', password: 'pegawai123', role: 'pegawai', jabatan: 'Arsiparis' },
  { id: 'u10', nip: '198804112017011008', nama: 'Fajar Nugroho', password: 'pegawai123', role: 'pegawai', jabatan: 'Bendahara' },
  { id: 'u11', nip: '199312152018011009', nama: 'Lina Marlina', password: 'pegawai123', role: 'pegawai', jabatan: 'Perencana' },
  { id: 'u12', nip: '199008202019011010', nama: 'Yusuf Maulana', password: 'pegawai123', role: 'pegawai', jabatan: 'Pranata Komputer' },
  { id: 'u13', nip: '198710012020011011', nama: 'Sri Wahyuni', password: 'pegawai123', role: 'pegawai', jabatan: 'Pengelola Data' },
  { id: 'u14', nip: '199504052021011012', nama: 'Rizki Ramadhan', password: 'pegawai123', role: 'pegawai', jabatan: 'Staf Humas' },
];

export const DEFAULT_PEGAWAI = [
  { id: 'p1', nip: '198501012010011001', nama: 'Budi Santoso', jabatan: 'Analis Kebijakan', userId: 'u3' },
  { id: 'p2', nip: '198703152011012002', nama: 'Siti Aminah', jabatan: 'Staf Administrasi', userId: 'u4' },
  { id: 'p3', nip: '199001202012011003', nama: 'Andi Pratama', jabatan: 'Operator Komputer', userId: 'u5' },
  { id: 'p4', nip: '198812052013011004', nama: 'Rina Wati', jabatan: 'Sekretaris', userId: 'u6' },
  { id: 'p5', nip: '199205102014011005', nama: 'Dewi Lestari', jabatan: 'Staf Keuangan', userId: 'u7' },
  { id: 'p6', nip: '198609252015011006', nama: 'Agus Hermawan', jabatan: 'Pengawas Lapangan', userId: 'u8' },
  { id: 'p7', nip: '199107302016011007', nama: 'Nur Hidayah', jabatan: 'Arsiparis', userId: 'u9' },
  { id: 'p8', nip: '198804112017011008', nama: 'Fajar Nugroho', jabatan: 'Bendahara', userId: 'u10' },
  { id: 'p9', nip: '199312152018011009', nama: 'Lina Marlina', jabatan: 'Perencana', userId: 'u11' },
  { id: 'p10', nip: '199008202019011010', nama: 'Yusuf Maulana', jabatan: 'Pranata Komputer', userId: 'u12' },
  { id: 'p11', nip: '198710012020011011', nama: 'Sri Wahyuni', jabatan: 'Pengelola Data', userId: 'u13' },
  { id: 'p12', nip: '199504052021011012', nama: 'Rizki Ramadhan', jabatan: 'Staf Humas', userId: 'u14' },
];

export const DEFAULT_KRITERIA = [
  { id: 'c1', kode: 'C1', nama: 'Kinerja', tipe: 'benefit' },
  { id: 'c2', kode: 'C2', nama: 'Disiplin', tipe: 'benefit' },
  { id: 'c3', kode: 'C3', nama: 'Loyalitas', tipe: 'benefit' },
  { id: 'c4', kode: 'C4', nama: 'Kerjasama Tim', tipe: 'benefit' },
  { id: 'c5', kode: 'C5', nama: 'Absensi Izin', tipe: 'cost' },
];

// Nilai awal untuk demo (skor 1-100)
export const DEFAULT_NILAI = {
  p1: { c1: 85, c2: 90, c3: 78, c4: 88, c5: 12 },
  p2: { c1: 78, c2: 85, c3: 82, c4: 75, c5: 18 },
  p3: { c1: 70, c2: 72, c3: 68, c4: 80, c5: 25 },
  p4: { c1: 92, c2: 88, c3: 85, c4: 90, c5: 8 },
  p5: { c1: 65, c2: 78, c3: 70, c4: 72, c5: 30 },
  p6: { c1: 88, c2: 82, c3: 90, c4: 85, c5: 15 },
  p7: { c1: 75, c2: 80, c3: 76, c4: 78, c5: 20 },
  p8: { c1: 82, c2: 75, c3: 80, c4: 82, c5: 22 },
  p9: { c1: 90, c2: 92, c3: 88, c4: 86, c5: 10 },
  p10: { c1: 72, c2: 70, c3: 74, c4: 76, c5: 28 },
  p11: { c1: 80, c2: 84, c3: 82, c4: 80, c5: 16 },
  p12: { c1: 68, c2: 74, c3: 72, c4: 70, c5: 32 },
};

// Default pairwise comparisons (Pimpinan)
// Skala AHP: 1-9 (positif = baris lebih penting, negatif = kolom lebih penting)
export const DEFAULT_PAIRWISE = {
  'c1_c2': 3,
  'c1_c3': 5,
  'c1_c4': 2,
  'c1_c5': 4,
  'c2_c3': 2,
  'c2_c4': 1,
  'c2_c5': 3,
  'c3_c4': -2,
  'c3_c5': 2,
  'c4_c5': 3,
};

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
