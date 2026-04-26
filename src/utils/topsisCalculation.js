/**
 * TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)
 * Pure functions for normalization, weighting, ideal solutions, distances, and ranking.
 */

/**
 * Calculate TOPSIS ranking.
 *
 * @param {Array} pegawai - Array of { id, nama, ... }
 * @param {Array} kriteria - Array of { id, tipe: 'benefit'|'cost' }
 * @param {Object} nilai - { pegawaiId: { kriteriaId: score } }
 * @param {Array} weights - Array of weights (same order as kriteria)
 * @returns {Array} Ranked results
 */
export function calculateTOPSIS(pegawai, kriteria, nilai, weights) {
  if (!pegawai.length || !kriteria.length || !weights.length) {
    return [];
  }

  const kriteriaIds = kriteria.map(k => k.id);

  // Step 1: Build decision matrix
  const decisionMatrix = pegawai.map(p => {
    return kriteriaIds.map(kid => {
      const val = nilai[p.id]?.[kid];
      return typeof val === 'number' ? val : 0;
    });
  });

  // Step 2: Normalize matrix (vector normalization)
  const n = pegawai.length;
  const m = kriteria.length;
  const normalizedMatrix = Array.from({ length: n }, () => Array(m).fill(0));

  for (let j = 0; j < m; j++) {
    let sumSquare = 0;
    for (let i = 0; i < n; i++) {
      sumSquare += decisionMatrix[i][j] ** 2;
    }
    const denominator = Math.sqrt(sumSquare);
    for (let i = 0; i < n; i++) {
      normalizedMatrix[i][j] = denominator === 0 ? 0 : decisionMatrix[i][j] / denominator;
    }
  }

  // Step 3: Weighted normalized matrix
  const weightedMatrix = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      weightedMatrix[i][j] = normalizedMatrix[i][j] * weights[j];
    }
  }

  // Step 4: Ideal positive (A+) and ideal negative (A-) solutions
  const idealPositive = Array(m).fill(0);
  const idealNegative = Array(m).fill(0);

  for (let j = 0; j < m; j++) {
    const column = weightedMatrix.map(row => row[j]);
    if (kriteria[j].tipe === 'benefit') {
      idealPositive[j] = Math.max(...column);
      idealNegative[j] = Math.min(...column);
    } else {
      // cost: minimum is ideal positive, maximum is ideal negative
      idealPositive[j] = Math.min(...column);
      idealNegative[j] = Math.max(...column);
    }
  }

  // Step 5: Calculate distance to ideal positive (D+) and ideal negative (D-)
  const results = pegawai.map((p, i) => {
    let dPlus = 0;
    let dMinus = 0;

    for (let j = 0; j < m; j++) {
      dPlus += (weightedMatrix[i][j] - idealPositive[j]) ** 2;
      dMinus += (weightedMatrix[i][j] - idealNegative[j]) ** 2;
    }

    dPlus = Math.sqrt(dPlus);
    dMinus = Math.sqrt(dMinus);

    // Step 6: Calculate preference score (closeness to ideal)
    const skorAkhir = (dPlus + dMinus) === 0 ? 0 : dMinus / (dPlus + dMinus);

    // Build per-criteria detail
    const skorDetail = {};
    kriteriaIds.forEach((kid, j) => {
      skorDetail[kid] = {
        mentah: decisionMatrix[i][j],
        normalisasi: Math.round(normalizedMatrix[i][j] * 10000) / 10000,
        terbobot: Math.round(weightedMatrix[i][j] * 10000) / 10000,
      };
    });

    return {
      pegawaiId: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      nip: p.nip,
      dPlus: Math.round(dPlus * 10000) / 10000,
      dMinus: Math.round(dMinus * 10000) / 10000,
      skorAkhir: Math.round(skorAkhir * 10000) / 10000,
      skorDetail,
    };
  });

  // Step 7: Sort by preference score descending & assign rank
  results.sort((a, b) => b.skorAkhir - a.skorAkhir);
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
}
