import * as XLSX from 'xlsx';

/**
 * Export ranking results to Excel.
 */
export function exportExcel(hasil, kriteria, bobot) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Ranking
  const rankingData = hasil.map(h => ({
    'Peringkat': h.rank,
    'NIP': h.nip || '-',
    'Nama Pegawai': h.nama,
    'Jabatan': h.jabatan || '-',
    'D+': h.dPlus,
    'D-': h.dMinus,
    'Skor Akhir': h.skorAkhir,
  }));
  const ws1 = XLSX.utils.json_to_sheet(rankingData);
  ws1['!cols'] = [
    { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 20 },
    { wch: 10 }, { wch: 10 }, { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Peringkat');

  // Sheet 2: Bobot
  if (kriteria && bobot && bobot.length > 0) {
    const bobotData = kriteria.map((k, i) => ({
      'Kode': k.kode,
      'Kriteria': k.nama,
      'Tipe': k.tipe === 'benefit' ? 'Benefit' : 'Cost',
      'Bobot': bobot[i] || 0,
    }));
    const ws2 = XLSX.utils.json_to_sheet(bobotData);
    ws2['!cols'] = [{ wch: 8 }, { wch: 20 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Bobot Kriteria');
  }

  // Sheet 3: Detail per kriteria
  if (hasil.length > 0 && hasil[0].skorDetail) {
    const detailData = hasil.map(h => {
      const row = { 'Peringkat': h.rank, 'Nama': h.nama };
      kriteria.forEach(k => {
        const d = h.skorDetail[k.id];
        if (d) {
          row[`${k.nama} (Mentah)`] = d.mentah;
          row[`${k.nama} (Normal)`] = d.normalisasi;
          row[`${k.nama} (Bobot)`] = d.terbobot;
        }
      });
      row['Skor Akhir'] = h.skorAkhir;
      return row;
    });
    const ws3 = XLSX.utils.json_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Detail Skor');
  }

  XLSX.writeFile(wb, 'Laporan_Peringkat_Pegawai.xlsx');
}
