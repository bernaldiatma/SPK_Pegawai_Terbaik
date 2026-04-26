/**
 * AHP (Analytic Hierarchy Process) Calculation
 * Pure functions for eigenvalue, consistency ratio, and weight vector computation.
 */

// Random Index (RI) table for matrix size 1-15
const RI_TABLE = [0, 0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];

/**
 * Build pairwise comparison matrix from flat key-value pairs.
 * Keys format: "ci_cj" with value = importance of ci over cj
 * Positive value = ci more important; Negative value = cj more important (stored as 1/abs)
 */
export function buildMatrix(kriteriaIds, pairwiseValues) {
  const n = kriteriaIds.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(1));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const key = `${kriteriaIds[i]}_${kriteriaIds[j]}`;
      const val = pairwiseValues[key] || 1;

      if (val > 0) {
        matrix[i][j] = val;
        matrix[j][i] = 1 / val;
      } else {
        matrix[i][j] = 1 / Math.abs(val);
        matrix[j][i] = Math.abs(val);
      }
    }
  }

  return matrix;
}

/**
 * Calculate priority vector (weights) using geometric mean method.
 */
export function calculateWeights(matrix) {
  const n = matrix.length;
  const geoMeans = [];

  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      product *= matrix[i][j];
    }
    geoMeans.push(Math.pow(product, 1 / n));
  }

  const sum = geoMeans.reduce((a, b) => a + b, 0);
  return geoMeans.map(g => g / sum);
}

/**
 * Calculate Consistency Ratio (CR).
 * CR < 0.1 means consistent.
 */
export function calculateCR(matrix, weights) {
  const n = matrix.length;
  if (n <= 2) return { lambdaMax: n, ci: 0, ri: 0, cr: 0 };

  // Calculate λmax
  const weightedSum = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * weights[j];
    }
    weightedSum.push(sum);
  }

  const lambdaValues = weightedSum.map((ws, i) => ws / weights[i]);
  const lambdaMax = lambdaValues.reduce((a, b) => a + b, 0) / n;

  const ci = (lambdaMax - n) / (n - 1);
  const ri = RI_TABLE[n] || 1.59;
  const cr = ri === 0 ? 0 : ci / ri;

  return {
    lambdaMax: Math.round(lambdaMax * 10000) / 10000,
    ci: Math.round(ci * 10000) / 10000,
    ri,
    cr: Math.round(Math.abs(cr) * 10000) / 10000,
  };
}

/**
 * Full AHP calculation pipeline.
 * Returns weights and consistency info.
 */
export function calculateAHP(kriteriaIds, pairwiseValues) {
  const matrix = buildMatrix(kriteriaIds, pairwiseValues);
  const weights = calculateWeights(matrix);
  const consistency = calculateCR(matrix, weights);

  return {
    matrix,
    weights: weights.map(w => Math.round(w * 10000) / 10000),
    ...consistency,
    isConsistent: consistency.cr < 0.1,
  };
}

/**
 * Get all unique pairs from criteria IDs.
 */
export function getPairKeys(kriteriaIds) {
  const pairs = [];
  for (let i = 0; i < kriteriaIds.length; i++) {
    for (let j = i + 1; j < kriteriaIds.length; j++) {
      pairs.push({
        key: `${kriteriaIds[i]}_${kriteriaIds[j]}`,
        left: kriteriaIds[i],
        right: kriteriaIds[j],
      });
    }
  }
  return pairs;
}

/**
 * Interpret AHP scale value to human-readable text.
 */
export function interpretScale(value) {
  const absVal = Math.abs(value);
  const labels = {
    1: 'Sama Pentingnya',
    2: 'Mendekati Sedikit Lebih Penting',
    3: 'Sedikit Lebih Penting',
    4: 'Mendekati Lebih Penting',
    5: 'Lebih Penting',
    6: 'Mendekati Sangat Lebih Penting',
    7: 'Sangat Lebih Penting',
    8: 'Mendekati Mutlak Lebih Penting',
    9: 'Mutlak Lebih Penting',
  };
  return labels[absVal] || 'Sama Pentingnya';
}
