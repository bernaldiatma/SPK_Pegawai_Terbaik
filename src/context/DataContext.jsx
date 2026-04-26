import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_PEGAWAI, DEFAULT_KRITERIA, DEFAULT_NILAI, DEFAULT_PAIRWISE, generateId
} from '../utils/seedData';
import { calculateAHP } from '../utils/ahpCalculation';
import { calculateTOPSIS } from '../utils/topsisCalculation';

const DataContext = createContext(null);

function loadOrDefault(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* ignore */ }
  }
  return defaultValue;
}

export function DataProvider({ children }) {
  const [pegawai, setPegawai] = useState(() => loadOrDefault('spk_pegawai', DEFAULT_PEGAWAI));
  const [kriteria, setKriteria] = useState(() => loadOrDefault('spk_kriteria', DEFAULT_KRITERIA));
  const [nilai, setNilai] = useState(() => loadOrDefault('spk_nilai', DEFAULT_NILAI));
  const [pairwise, setPairwise] = useState(() => loadOrDefault('spk_pairwise', DEFAULT_PAIRWISE));
  const [ahpResult, setAhpResult] = useState(() => loadOrDefault('spk_ahp_result', null));
  const [topsisResult, setTopsisResult] = useState(() => loadOrDefault('spk_topsis_result', null));

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('spk_pegawai', JSON.stringify(pegawai)); }, [pegawai]);
  useEffect(() => { localStorage.setItem('spk_kriteria', JSON.stringify(kriteria)); }, [kriteria]);
  useEffect(() => { localStorage.setItem('spk_nilai', JSON.stringify(nilai)); }, [nilai]);
  useEffect(() => { localStorage.setItem('spk_pairwise', JSON.stringify(pairwise)); }, [pairwise]);
  useEffect(() => { localStorage.setItem('spk_ahp_result', JSON.stringify(ahpResult)); }, [ahpResult]);
  useEffect(() => { localStorage.setItem('spk_topsis_result', JSON.stringify(topsisResult)); }, [topsisResult]);

  // --- PEGAWAI CRUD ---
  const addPegawai = useCallback((data) => {
    const exists = pegawai.find(p => p.nip === data.nip);
    if (exists) return { success: false, message: 'NIP sudah terdaftar.' };
    const newP = { id: generateId(), ...data };
    setPegawai(prev => [...prev, newP]);
    return { success: true, pegawai: newP };
  }, [pegawai]);

  const updatePegawai = useCallback((id, data) => {
    const duplicate = pegawai.find(p => p.nip === data.nip && p.id !== id);
    if (duplicate) return { success: false, message: 'NIP sudah digunakan pegawai lain.' };
    setPegawai(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    return { success: true };
  }, [pegawai]);

  const deletePegawai = useCallback((id) => {
    setPegawai(prev => prev.filter(p => p.id !== id));
    setNilai(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setTopsisResult(null);
    return { success: true };
  }, []);

  // --- KRITERIA CRUD ---
  const addKriteria = useCallback((data) => {
    const kodeNum = kriteria.length + 1;
    const newK = { id: generateId(), kode: `C${kodeNum}`, ...data };
    setKriteria(prev => [...prev, newK]);
    return { success: true, kriteria: newK };
  }, [kriteria]);

  const updateKriteria = useCallback((id, data) => {
    setKriteria(prev => prev.map(k => k.id === id ? { ...k, ...data } : k));
    return { success: true };
  }, []);

  const deleteKriteria = useCallback((id) => {
    setKriteria(prev => prev.filter(k => k.id !== id));
    // Cleanup nilai
    setNilai(prev => {
      const copy = {};
      Object.keys(prev).forEach(pid => {
        copy[pid] = { ...prev[pid] };
        delete copy[pid][id];
      });
      return copy;
    });
    // Cleanup pairwise
    setPairwise(prev => {
      const copy = {};
      Object.keys(prev).forEach(key => {
        if (!key.includes(id)) copy[key] = prev[key];
      });
      return copy;
    });
    setAhpResult(null);
    setTopsisResult(null);
    return { success: true };
  }, []);

  // --- NILAI ---
  const updateNilai = useCallback((pegawaiId, kriteriaId, value) => {
    setNilai(prev => ({
      ...prev,
      [pegawaiId]: {
        ...(prev[pegawaiId] || {}),
        [kriteriaId]: value,
      },
    }));
  }, []);

  const updateNilaiBulk = useCallback((newNilai) => {
    setNilai(newNilai);
  }, []);

  // --- AHP ---
  const updatePairwise = useCallback((key, value) => {
    setPairwise(prev => ({ ...prev, [key]: value }));
  }, []);

  const runAHP = useCallback(() => {
    const kriteriaIds = kriteria.map(k => k.id);
    const result = calculateAHP(kriteriaIds, pairwise);
    setAhpResult(result);
    return result;
  }, [kriteria, pairwise]);

  // --- TOPSIS ---
  const runTOPSIS = useCallback(() => {
    if (!ahpResult || !ahpResult.isConsistent) return null;
    const result = calculateTOPSIS(pegawai, kriteria, nilai, ahpResult.weights);
    setTopsisResult(result);
    return result;
  }, [pegawai, kriteria, nilai, ahpResult]);

  // --- Statistics ---
  const getInputStatus = useCallback(() => {
    const total = pegawai.length * kriteria.length;
    let filled = 0;
    pegawai.forEach(p => {
      kriteria.forEach(k => {
        if (nilai[p.id]?.[k.id] != null && nilai[p.id][k.id] !== '') filled++;
      });
    });
    return { total, filled, percentage: total === 0 ? 0 : Math.round((filled / total) * 100) };
  }, [pegawai, kriteria, nilai]);

  const getPegawaiStatus = useCallback((pegawaiId) => {
    let filled = 0;
    kriteria.forEach(k => {
      if (nilai[pegawaiId]?.[k.id] != null && nilai[pegawaiId][k.id] !== '') filled++;
    });
    return { filled, total: kriteria.length, isComplete: filled === kriteria.length };
  }, [kriteria, nilai]);

  return (
    <DataContext.Provider value={{
      pegawai, kriteria, nilai, pairwise, ahpResult, topsisResult,
      addPegawai, updatePegawai, deletePegawai,
      addKriteria, updateKriteria, deleteKriteria,
      updateNilai, updateNilaiBulk,
      updatePairwise, runAHP,
      runTOPSIS,
      getInputStatus, getPegawaiStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
