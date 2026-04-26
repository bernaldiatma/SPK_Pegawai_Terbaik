import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export ranking results to PDF.
 */
export function exportPDF(hasil, kriteria, bobot) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN HASIL PENILAIAN PEGAWAI TERBAIK', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Metode: AHP - TOPSIS', doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });
  doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });

  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(14, 38, doc.internal.pageSize.getWidth() - 14, 38);

  // Bobot table
  if (kriteria && bobot && bobot.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bobot Kriteria (AHP)', 14, 46);

    doc.autoTable({
      startY: 50,
      head: [['Kode', 'Kriteria', 'Tipe', 'Bobot']],
      body: kriteria.map((k, i) => [
        k.kode,
        k.nama,
        k.tipe === 'benefit' ? 'Benefit' : 'Cost',
        bobot[i] ? bobot[i].toFixed(4) : '-',
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: 14, right: 14 },
    });
  }

  // Ranking table
  const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 50;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Hasil Peringkat Pegawai', 14, startY);

  doc.autoTable({
    startY: startY + 4,
    head: [['Peringkat', 'NIP', 'Nama Pegawai', 'Jabatan', 'D+', 'D-', 'Skor Akhir']],
    body: hasil.map(h => [
      h.rank,
      h.nip || '-',
      h.nama,
      h.jabatan || '-',
      h.dPlus.toFixed(4),
      h.dMinus.toFixed(4),
      h.skorAkhir.toFixed(4),
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 18 },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150);
  doc.text('Dokumen ini dihasilkan oleh Sistem SPK Pegawai Terbaik', doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });

  doc.save('Laporan_Peringkat_Pegawai.pdf');
}
