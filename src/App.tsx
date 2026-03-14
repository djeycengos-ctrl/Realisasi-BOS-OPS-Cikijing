/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Download, 
  Upload,
  Printer,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Loader2,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Profil {
  nama: string;
  npsn: string;
  alamat: string;
  kepsek: string;
  nipKepsek: string;
  bendahara: string;
  nipBendahara: string;
  pass: string;
}

interface DataLaporan {
  id: number;
  tanggal: string;
  kegiatan: string;
  rekening: string;
  noBukti: string;
  uraian: string;
  terima: number;
  keluar: number;
  transaksi: string;
}

interface Summary {
  penerimaanTahap1: number;
  penerimaanTahap2: number;
  totalTerima: number;
  pengeluaranTahap1: number;
  pengeluaranTahap2: number;
  totalKeluar: number;
  saldoTahap1: number;
  saldoTahap2: number;
  honorGuru: number;
  sapras: number;
  buku: number;
  realisasi: {
    t1: {
      barang: { siplah: number; nonsiplah: number };
      mesin: { siplah: number; nonsiplah: number };
      aset: { siplah: number; nonsiplah: number };
    };
    t2: {
      barang: { siplah: number; nonsiplah: number };
      mesin: { siplah: number; nonsiplah: number };
      aset: { siplah: number; nonsiplah: number };
    };
  };
  pajak: {
    [month: number]: {
      [type: string]: { siplah: number; nonsiplah: number };
    };
  };
}

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: (pass: string) => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pass);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-black/5"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BOS OPS Cikijing</h1>
          <p className="text-gray-500 mt-2 italic font-serif">Sistem Laporan Realisasi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-x-0">
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password Akses</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Masukkan password..."
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Masuk ke Sistem <ChevronRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const SetorPajak = ({ summary }: { summary: Summary }) => {
  const p = summary.pajak;
  if (!p) return null;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const taxTypes = [
    { id: 'ppn', label: 'PPN' },
    { id: 'pph21', label: 'PPh 21' },
    { id: 'pph22', label: 'PPh 22' },
    { id: 'pph23', label: 'PPh 23' },
    { id: 'sspd', label: 'SSPD' }
  ];

  const getMonthTotal = (m: number) => {
    let total = 0;
    taxTypes.forEach(t => {
      total += p[m][t.id].siplah + p[m][t.id].nonsiplah;
    });
    return total;
  };

  const getTahapTotal = (start: number, end: number) => {
    let total = 0;
    for (let m = start; m <= end; m++) {
      total += getMonthTotal(m);
    }
    return total;
  };

  const getTaxTypeTotal = (type: string, start: number, end: number, subType: 'siplah' | 'nonsiplah') => {
    let total = 0;
    for (let m = start; m <= end; m++) {
      total += p[m][type][subType];
    }
    return total;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg">Tabel Setor Pajak</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Berdasarkan Jenis Pajak & Bulan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-800 font-bold uppercase">
                <th rowSpan={2} className="px-2 py-3 border border-emerald-100 text-left">Bulan</th>
                {taxTypes.map(t => (
                  <th key={t.id} colSpan={2} className="px-2 py-3 border border-emerald-100 text-center">{t.label}</th>
                ))}
                <th colSpan={2} className="px-2 py-3 border border-emerald-100 text-center">Sub Total Pajak</th>
                <th rowSpan={2} className="px-2 py-3 border border-emerald-100 text-right">Total</th>
              </tr>
              <tr className="bg-emerald-50/50 text-emerald-700 font-bold uppercase">
                {taxTypes.map(t => (
                  <React.Fragment key={t.id}>
                    <th className="px-1 py-2 border border-emerald-100 text-center">SiPLah</th>
                    <th className="px-1 py-2 border border-emerald-100 text-center">Non</th>
                  </React.Fragment>
                ))}
                <th className="px-1 py-2 border border-emerald-100 text-center">SiPLah</th>
                <th className="px-1 py-2 border border-emerald-100 text-center">Non</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {months.map((name, idx) => {
                const m = idx + 1;
                let monthSiplah = 0;
                let monthNon = 0;
                taxTypes.forEach(t => {
                  monthSiplah += p[m][t.id].siplah;
                  monthNon += p[m][t.id].nonsiplah;
                });
                return (
                  <tr key={m} className="hover:bg-gray-50">
                    <td className="px-2 py-2 border border-gray-100 font-bold">{name}</td>
                    {taxTypes.map(t => (
                      <React.Fragment key={t.id}>
                        <td className="px-1 py-2 border border-gray-100 text-right font-mono">{p[m][t.id].siplah > 0 ? p[m][t.id].siplah.toLocaleString('id-ID') : '-'}</td>
                        <td className="px-1 py-2 border border-gray-100 text-right font-mono">{p[m][t.id].nonsiplah > 0 ? p[m][t.id].nonsiplah.toLocaleString('id-ID') : '-'}</td>
                      </React.Fragment>
                    ))}
                    <td className="px-1 py-2 border border-gray-100 text-right font-mono font-bold">{monthSiplah > 0 ? monthSiplah.toLocaleString('id-ID') : '-'}</td>
                    <td className="px-1 py-2 border border-gray-100 text-right font-mono font-bold">{monthNon > 0 ? monthNon.toLocaleString('id-ID') : '-'}</td>
                    <td className="px-2 py-2 border border-gray-100 text-right font-mono font-bold bg-gray-50">{getMonthTotal(m) > 0 ? getMonthTotal(m).toLocaleString('id-ID') : '-'}</td>
                  </tr>
                );
              })}
              <tr className="bg-amber-50 font-bold">
                <td className="px-2 py-3 border border-amber-100">Jumlah Pajak Tahap 1</td>
                {taxTypes.map(t => (
                  <React.Fragment key={t.id}>
                    <td className="px-1 py-3 border border-amber-100 text-right font-mono">{getTaxTypeTotal(t.id, 1, 6, 'siplah').toLocaleString('id-ID')}</td>
                    <td className="px-1 py-3 border border-amber-100 text-right font-mono">{getTaxTypeTotal(t.id, 1, 6, 'nonsiplah').toLocaleString('id-ID')}</td>
                  </React.Fragment>
                ))}
                <td colSpan={2} className="px-1 py-3 border border-amber-100 text-right font-mono">Rp {getTahapTotal(1, 6).toLocaleString('id-ID')}</td>
                <td className="px-2 py-3 border border-amber-100 text-right font-mono">Rp {getTahapTotal(1, 6).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="bg-amber-50 font-bold">
                <td className="px-2 py-3 border border-amber-100">Jumlah Pajak Tahap 2</td>
                {taxTypes.map(t => (
                  <React.Fragment key={t.id}>
                    <td className="px-1 py-3 border border-amber-100 text-right font-mono">{getTaxTypeTotal(t.id, 7, 12, 'siplah').toLocaleString('id-ID')}</td>
                    <td className="px-1 py-3 border border-amber-100 text-right font-mono">{getTaxTypeTotal(t.id, 7, 12, 'nonsiplah').toLocaleString('id-ID')}</td>
                  </React.Fragment>
                ))}
                <td colSpan={2} className="px-1 py-3 border border-amber-100 text-right font-mono">Rp {getTahapTotal(7, 12).toLocaleString('id-ID')}</td>
                <td className="px-2 py-3 border border-amber-100 text-right font-mono">Rp {getTahapTotal(7, 12).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="bg-black text-white font-bold">
                <td className="px-2 py-4 border border-black uppercase tracking-widest">Total Pajak</td>
                {taxTypes.map(t => (
                  <React.Fragment key={t.id}>
                    <td className="px-1 py-4 border border-black text-right font-mono">{(getTaxTypeTotal(t.id, 1, 12, 'siplah')).toLocaleString('id-ID')}</td>
                    <td className="px-1 py-4 border border-black text-right font-mono">{(getTaxTypeTotal(t.id, 1, 12, 'nonsiplah')).toLocaleString('id-ID')}</td>
                  </React.Fragment>
                ))}
                <td colSpan={3} className="px-2 py-4 border border-black text-right font-mono text-base">Rp {(getTahapTotal(1, 12)).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg">Ringkasan Pajak</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold">
                <th rowSpan={2} className="px-4 py-3 border border-gray-200 text-left">Jenis Pajak</th>
                <th colSpan={3} className="px-4 py-3 border border-gray-200 text-center">Tahap 1</th>
                <th colSpan={3} className="px-4 py-3 border border-gray-200 text-center">Tahap 2</th>
                <th colSpan={3} className="px-4 py-3 border border-gray-200 text-center">Jumlah</th>
              </tr>
              <tr className="bg-gray-50/50 text-gray-500 font-bold">
                <th className="px-2 py-2 border border-gray-200 text-center">SiPLah</th>
                <th className="px-2 py-2 border border-gray-200 text-center">Non</th>
                <th className="px-2 py-2 border border-gray-200 text-center">Total</th>
                <th className="px-2 py-2 border border-gray-200 text-center">SiPLah</th>
                <th className="px-2 py-2 border border-gray-200 text-center">Non</th>
                <th className="px-2 py-2 border border-gray-200 text-center">Total</th>
                <th className="px-2 py-2 border border-gray-200 text-center">SiPLah</th>
                <th className="px-2 py-2 border border-gray-200 text-center">Non</th>
                <th className="px-2 py-2 border border-gray-200 text-center bg-gray-100">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {taxTypes.map(t => {
                const t1_s = getTaxTypeTotal(t.id, 1, 6, 'siplah');
                const t1_n = getTaxTypeTotal(t.id, 1, 6, 'nonsiplah');
                const t2_s = getTaxTypeTotal(t.id, 7, 12, 'siplah');
                const t2_n = getTaxTypeTotal(t.id, 7, 12, 'nonsiplah');
                return (
                  <tr key={t.id}>
                    <td className="px-4 py-3 border border-gray-100 font-bold">{t.label}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono">{t1_s.toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono">{t1_n.toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono font-bold">{(t1_s + t1_n).toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono">{t2_s.toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono">{t2_n.toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono font-bold">{(t2_s + t2_n).toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono">{(t1_s + t2_s).toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono">{(t1_n + t2_n).toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 border border-gray-100 text-right font-mono font-bold bg-gray-50">{(t1_s + t1_n + t2_s + t2_n).toLocaleString('id-ID')}</td>
                  </tr>
                );
              })}
              <tr className="bg-black text-white font-bold">
                <td className="px-4 py-4 border border-black uppercase tracking-widest text-xs">Total</td>
                <td colSpan={3} className="px-4 py-4 border border-black text-right font-mono">Rp {getTahapTotal(1, 6).toLocaleString('id-ID')}</td>
                <td colSpan={3} className="px-4 py-4 border border-black text-right font-mono">Rp {getTahapTotal(7, 12).toLocaleString('id-ID')}</td>
                <td colSpan={3} className="px-4 py-4 border border-black text-right font-mono text-base">Rp {getTahapTotal(1, 12).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RealisasiBelanja = ({ summary }: { summary: Summary }) => {
  const r = summary.realisasi;
  if (!r) return null;

  const rows = [
    { 
      label: 'Belanja Barang & Jasa', 
      code: '5.1.02', 
      t1_siplah: r.t1.barang.siplah, t1_non: r.t1.barang.nonsiplah,
      t2_siplah: r.t2.barang.siplah, t2_non: r.t2.barang.nonsiplah,
      color: 'bg-orange-50'
    },
    { 
      label: 'Belanja Peralatan & Mesin', 
      code: '5.2.02', 
      t1_siplah: r.t1.mesin.siplah, t1_non: r.t1.mesin.nonsiplah,
      t2_siplah: r.t2.mesin.siplah, t2_non: r.t2.mesin.nonsiplah,
      color: 'bg-blue-50'
    },
    { 
      label: 'Belanja Aset Tetap Lainnya', 
      code: '5.2.05', 
      t1_siplah: r.t1.aset.siplah, t1_non: r.t1.aset.nonsiplah,
      t2_siplah: r.t2.aset.siplah, t2_non: r.t2.aset.nonsiplah,
      color: 'bg-teal-50'
    }
  ];

  const subTotalSiplahT1 = rows.reduce((acc, row) => acc + row.t1_siplah, 0);
  const subTotalNonSiplahT1 = rows.reduce((acc, row) => acc + row.t1_non, 0);
  const subTotalSiplahT2 = rows.reduce((acc, row) => acc + row.t2_siplah, 0);
  const subTotalNonSiplahT2 = rows.reduce((acc, row) => acc + row.t2_non, 0);

  const totalT1 = subTotalSiplahT1 + subTotalNonSiplahT1;
  const totalT2 = subTotalSiplahT2 + subTotalNonSiplahT2;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg">Tabel Realisasi Belanja</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">Berdasarkan Kode Rekening & Tipe Transaksi</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-4 text-left border-b">Belanja</th>
                <th className="px-6 py-4 text-left border-b">Transaksi</th>
                <th className="px-6 py-4 text-right border-b">Tahap 1</th>
                <th className="px-6 py-4 text-right border-b">Tahap 2</th>
                <th className="px-6 py-4 text-right border-b">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr className={`${row.color}/30`}>
                    <td rowSpan={2} className="px-6 py-4 font-bold text-gray-900 border-r border-gray-100">
                      {row.label}
                      <div className="text-[10px] text-gray-400 font-normal">Kode: {row.code}</div>
                    </td>
                    <td className="px-6 py-2 text-gray-600 border-b border-gray-50">SiPLah</td>
                    <td className="px-6 py-2 text-right font-mono text-gray-600 border-b border-gray-50">Rp {row.t1_siplah.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-2 text-right font-mono text-gray-600 border-b border-gray-50">Rp {row.t2_siplah.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-2 text-right font-mono font-bold text-gray-900 border-b border-gray-50">Rp {(row.t1_siplah + row.t2_siplah).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr className={`${row.color}/10`}>
                    <td className="px-6 py-2 text-gray-600">Non-SiPLah</td>
                    <td className="px-6 py-2 text-right font-mono text-gray-600">Rp {row.t1_non.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-2 text-right font-mono text-gray-600">Rp {row.t2_non.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-2 text-right font-mono font-bold text-gray-900">Rp {(row.t1_non + row.t2_non).toLocaleString('id-ID')}</td>
                  </tr>
                </React.Fragment>
              ))}
              <tr className="bg-gray-50/50 font-bold">
                <td rowSpan={2} className="px-6 py-4 text-gray-900 border-r border-gray-100">Sub Total</td>
                <td className="px-6 py-2 text-gray-600 border-b border-gray-100">SiPLah</td>
                <td className="px-6 py-2 text-right font-mono border-b border-gray-100">Rp {subTotalSiplahT1.toLocaleString('id-ID')}</td>
                <td className="px-6 py-2 text-right font-mono border-b border-gray-100">Rp {subTotalSiplahT2.toLocaleString('id-ID')}</td>
                <td className="px-6 py-2 text-right font-mono border-b border-gray-100">Rp {(subTotalSiplahT1 + subTotalSiplahT2).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="bg-gray-50/50 font-bold">
                <td className="px-6 py-2 text-gray-600">Non-SiPLah</td>
                <td className="px-6 py-2 text-right font-mono">Rp {subTotalNonSiplahT1.toLocaleString('id-ID')}</td>
                <td className="px-6 py-2 text-right font-mono">Rp {subTotalNonSiplahT2.toLocaleString('id-ID')}</td>
                <td className="px-6 py-2 text-right font-mono">Rp {(subTotalNonSiplahT1 + subTotalNonSiplahT2).toLocaleString('id-ID')}</td>
              </tr>
              <tr className="bg-black text-white font-bold">
                <td colSpan={2} className="px-6 py-4 text-right uppercase tracking-widest text-xs">Total Realisasi</td>
                <td className="px-6 py-4 text-right font-mono">Rp {totalT1.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-right font-mono">Rp {totalT2.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-right font-mono text-lg">Rp {(totalT1 + totalT2).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full" />
            Ringkasan Tahap 1
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">SiPLah</span>
              <span className="font-bold">Rp {subTotalSiplahT1.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">Non-SiPLah</span>
              <span className="font-bold">Rp {subTotalNonSiplahT1.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full" />
            Ringkasan Tahap 2
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">SiPLah</span>
              <span className="font-bold">Rp {subTotalSiplahT2.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">Non-SiPLah</span>
              <span className="font-bold">Rp {subTotalNonSiplahT2.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StrategicAllocation = ({ summary }: { summary: Summary }) => {
  const totalTerima = summary.totalTerima || 1; // avoid division by zero

  const allocations = [
    {
      label: 'Pembayaran Honor Guru',
      code: '07.12',
      value: summary.honorGuru || 0,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Total pengeluaran untuk honorarium guru dan tenaga kependidikan.'
    },
    {
      label: 'Pemeliharaan Sarana & Prasarana',
      code: '05.08',
      value: summary.sapras || 0,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Total pengeluaran untuk pemeliharaan gedung dan fasilitas sekolah.'
    },
    {
      label: 'Pengadaan Buku & Koleksi Perpustakaan',
      code: '05.02',
      value: summary.buku || 0,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Total pengeluaran untuk buku teks, buku bacaan, dan perpustakaan.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allocations.map((item, idx) => {
          const percentage = (item.value / totalTerima) * 100;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 ${item.bgColor} ${item.textColor} rounded-xl`}>
                  <PieChart size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kode: {item.code}</span>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">{item.label}</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Alokasi Strategis</p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-mono font-bold text-gray-900">Rp {item.value.toLocaleString('id-ID')}</span>
                  <span className={`text-sm font-bold ${item.textColor}`}>{percentage.toFixed(1)}%</span>
                </div>
                
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-50">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="font-bold text-lg mb-6">Analisis Perbandingan Alokasi</h3>
        <div className="space-y-6">
          {allocations.map((item, idx) => {
            const percentage = (item.value / totalTerima) * 100;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{item.label}</span>
                  <span className="font-mono text-gray-500">Rp {item.value.toLocaleString('id-ID')} / {percentage.toFixed(2)}% dari Pendapatan</span>
                </div>
                <div className="w-full h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${item.color} opacity-80`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Catatan:</strong> Persentase dihitung berdasarkan total penerimaan (Dana BOS) yang diterima sekolah. 
            Alokasi ini membantu sekolah memantau kepatuhan terhadap standar pembiayaan dan prioritas penggunaan dana sesuai Juknis BOS.
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ summary, data }: { summary: Summary, data: DataLaporan[] }) => {
  // Defensive defaults
  const s = {
    penerimaanTahap1: summary?.penerimaanTahap1 || 0,
    penerimaanTahap2: summary?.penerimaanTahap2 || 0,
    totalTerima: summary?.totalTerima || 0,
    pengeluaranTahap1: summary?.pengeluaranTahap1 || 0,
    pengeluaranTahap2: summary?.pengeluaranTahap2 || 0,
    totalKeluar: summary?.totalKeluar || 0,
    saldoTahap1: summary?.saldoTahap1 || 0,
    saldoTahap2: summary?.saldoTahap2 || 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Penerimaan Card */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Penerimaan</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tahap I</span>
              <span className="font-mono font-bold">Rp {s.penerimaanTahap1.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tahap II</span>
              <span className="font-mono font-bold">Rp {s.penerimaanTahap2.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-xl font-mono font-bold text-emerald-600">Rp {s.totalTerima.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Pengeluaran Card */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Pengeluaran</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tahap I</span>
              <span className="font-mono font-bold">Rp {s.pengeluaranTahap1.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tahap II</span>
              <span className="font-mono font-bold">Rp {s.pengeluaranTahap2.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-xl font-mono font-bold text-rose-600">Rp {s.totalKeluar.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Saldo Card */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Saldo Per Tahap</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tahap I</span>
              <span className="font-mono font-bold">Rp {s.saldoTahap1.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tahap II</span>
              <span className="font-mono font-bold">Rp {s.saldoTahap2.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-xl font-mono font-bold text-blue-600">Rp {s.saldoTahap2.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">Transaksi Terbaru</h2>
          <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">No. Bukti</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Uraian</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{item.tanggal}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.noBukti}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.uraian}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${item.keluar > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {item.keluar > 0 ? `-Rp. ${(item.keluar || 0).toLocaleString('id-ID')}` : `+Rp. ${(item.terima || 0).toLocaleString('id-ID')}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DataManagement = ({ data, onRefresh }: { data: DataLaporan[], onRefresh: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [editingItem, setEditingItem] = useState<DataLaporan | null>(null);

  const filteredData = data.filter(item => 
    item.uraian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.noBukti.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = async () => {
    try {
      const lines = importText.trim().split('\n');
      const dataArray = lines.map(line => {
        const parts = line.split('\t');
        return [
          parts[0] || '', // tanggal
          parts[1] || '', // kegiatan
          parts[2] || '', // rekening
          parts[3] || '', // noBukti
          parts[4] || '', // uraian
          Number(parts[5]) || 0, // terima
          Number(parts[6]) || 0, // keluar
          '', // padding for index 7
          parts[8] || ''  // transaksi
        ];
      });

      const res = await fetch('/api/data/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataArray })
      });
      
      if (res.ok) {
        alert('Data berhasil diimpor!');
        setImportText('');
        setIsImporting(false);
        onRefresh();
      }
    } catch (err) {
      alert('Gagal impor data. Pastikan format tab-separated benar.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus data ini?')) {
      try {
        const res = await fetch(`/api/data/${id}`, { method: 'DELETE' });
        if (res.ok) {
          onRefresh();
        } else {
          const error = await res.json();
          alert('Gagal menghapus: ' + (error.message || 'Terjadi kesalahan server'));
        }
      } catch (err) {
        alert('Gagal menghapus: Koneksi bermasalah');
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/data/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      
      if (res.ok) {
        setEditingItem(null);
        onRefresh();
      }
    } catch (err) {
      alert('Gagal memperbarui data.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari uraian atau no. bukti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsImporting(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            <Upload size={16} /> Impor Data
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isImporting && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm overflow-hidden mb-6"
          >
            <h3 className="font-bold mb-4">Impor Data (Format dari Spreadsheet)</h3>
            <p className="text-xs text-gray-500 mb-4">Tempelkan baris data dari spreadsheet Anda ke sini (Tab Separated).</p>
            <textarea 
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs outline-none focus:border-black transition-all mb-4"
              placeholder="Tanggal	Kegiatan	Rekening	NoBukti	Uraian	Terima	Keluar	...	Transaksi"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsImporting(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleImport}
                className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                Proses Impor
              </button>
            </div>
          </motion.div>
        )}

        {editingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-black/5"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold">Edit Transaksi</h3>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="rotate-45" size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tanggal</label>
                    <input 
                      type="text" 
                      value={editingItem.tanggal}
                      onChange={(e) => setEditingItem({...editingItem, tanggal: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">No. Bukti</label>
                    <input 
                      type="text" 
                      value={editingItem.noBukti}
                      onChange={(e) => setEditingItem({...editingItem, noBukti: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Uraian</label>
                  <textarea 
                    value={editingItem.uraian}
                    onChange={(e) => setEditingItem({...editingItem, uraian: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Penerimaan (Rp)</label>
                    <input 
                      type="number" 
                      value={editingItem.terima}
                      onChange={(e) => setEditingItem({...editingItem, terima: Number(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pengeluaran (Rp)</label>
                    <input 
                      type="number" 
                      value={editingItem.keluar}
                      onChange={(e) => setEditingItem({...editingItem, keluar: Number(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tipe Transaksi</label>
                  <select 
                    value={editingItem.transaksi}
                    onChange={(e) => setEditingItem({...editingItem, transaksi: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                  >
                    <option value="">-- Pilih Tipe --</option>
                    <option value="SIPLah">SIPLah</option>
                    <option value="NonSIPLah">NonSIPLah</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-6 py-2 font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="bg-black text-white px-8 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">No. Bukti</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Uraian</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Terima</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Keluar</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Tipe</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{item.tanggal}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.noBukti}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.uraian}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 text-right font-mono">
                    {item.terima > 0 ? (item.terima || 0).toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-rose-600 text-right font-mono">
                    {item.keluar > 0 ? (item.keluar || 0).toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.transaksi === 'SIPLah' ? 'bg-blue-100 text-blue-700' : 
                      item.transaksi === 'NonSIPLah' ? 'bg-gray-100 text-gray-700' : 
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {item.transaksi || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-400 hover:text-black transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BKUPrint = () => {
  const [bkuNumbers, setBkuNumbers] = useState<string[]>([]);
  const [selectedNoBukti, setSelectedNoBukti] = useState('');
  const [bkuData, setBkuData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/bku/numbers')
      .then(res => res.json())
      .then(setBkuNumbers);
  }, []);

  const handleFetchData = async (noBukti: string) => {
    if (!noBukti) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bku/data/${noBukti}`);
      const json = await res.json();
      setBkuData(json);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (bkuData && bkuData.noBukti) {
      const originalTitle = document.title;
      document.title = bkuData.noBukti;
      window.print();
      document.title = originalTitle;
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm print:hidden">
        <h3 className="font-bold mb-4">Pilih Nomor Bukti untuk Dicetak</h3>
        <div className="flex gap-4">
          <select 
            value={selectedNoBukti}
            onChange={(e) => {
              setSelectedNoBukti(e.target.value);
              handleFetchData(e.target.value);
            }}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
          >
            <option value="">-- Pilih Nomor Bukti --</option>
            {bkuNumbers.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <button 
            onClick={handlePrint}
            disabled={!bkuData}
            className="bg-black text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Printer size={18} /> Cetak Bukti
          </button>
        </div>
      </div>

      {bkuData && (
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:w-[21.5cm] print:h-[33cm] mx-auto overflow-hidden w-[21.5cm] h-[33cm] mb-12">
          <div className="w-full h-full flex flex-col font-serif p-8 print:p-0">
            {/* Header - Nomor Bukti Awal Halaman */}
            <div className="flex justify-between items-end pb-2">
              <div>
                <h1 className="text-lg font-bold italic uppercase">Lampiran Bukti Pengeluaran BKU</h1>
                <div className="text-sm">{bkuData.profil.nama} ({bkuData.profil.npsn})</div>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  <span>Nomor Bukti :</span>
                  <span className="text-lg font-bold font-mono">{bkuData.noBukti}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>Tanggal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                  <span>{bkuData.tanggal}</span>
                </div>
              </div>
            </div>
            <div className="border-b-[3px] border-black mb-[2px]"></div>
            <div className="border-b border-black mb-2"></div>

            {/* Content - Area kosong besar di tengah */}
            <div className="flex-grow border border-black flex flex-col relative">
              {/* Empty area for transactions */}
              <div className="flex-grow"></div>

              {/* Signatures - Diletakkan di bawah dalam kotak */}
              <div className="grid grid-cols-2 gap-12 pb-8 pt-8">
                <div className="text-center space-y-24">
                  <div>
                    <p>Setuju dibayar,</p>
                    <p>Kepala Sekolah</p>
                  </div>
                  <div>
                    <p className="font-bold underline">{bkuData.profil.kepsek}</p>
                    <p>NIP. {bkuData.profil.nipKepsek}</p>
                  </div>
                </div>
                <div className="text-center space-y-24">
                  <div>
                    <p>Dibayar Tanggal : {bkuData.tanggal}</p>
                    <p>Bendahara</p>
                  </div>
                  <div>
                    <p className="font-bold underline">{bkuData.profil.bendahara}</p>
                    <p>NIP. {bkuData.profil.nipBendahara}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: 21.5cm 33cm portrait;
          margin-top: 1cm;
          margin-right: 1.5cm;
          margin-bottom: 1.5cm;
          margin-left: 1.5cm;
        }
        @media print {
          body { background: white !important; }
          aside, header, .print\\:hidden { display: none !important; }
          main { margin-left: 0 !important; padding: 0 !important; }
          .bg-white { border: none !important; box-shadow: none !important; }
          .print\\:w-\\[21.5cm\\] { width: 21.5cm !important; }
          .print\\:h-\\[33cm\\] { height: 33cm !important; }
        }
      `}} />
    </div>
  );
};

const ProfileSettings = ({ profil, onRefresh }: { profil: Profil, onRefresh: () => void }) => {
  const [formData, setFormData] = useState(profil);
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleReset = async () => {
    setResetLoading(true);
    setResetMessage(null);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        setResetMessage({ text: 'Berhasil! Semua data transaksi telah dikosongkan.', type: 'success' });
        setShowResetConfirm(false);
        onRefresh();
      } else {
        setResetMessage({ text: 'Gagal menghapus data.', type: 'error' });
      }
    } catch (err) {
      setResetMessage({ text: 'Terjadi kesalahan koneksi.', type: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Profil berhasil diperbarui!');
        onRefresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Profil Sekolah & Pengaturan</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nama Sekolah</label>
              <input 
                type="text" 
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">NPSN</label>
              <input 
                type="text" 
                value={formData.npsn}
                onChange={(e) => setFormData({...formData, npsn: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Alamat</label>
            <textarea 
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Kepala Sekolah</label>
              <input 
                type="text" 
                value={formData.kepsek}
                onChange={(e) => setFormData({...formData, kepsek: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">NIP Kepala Sekolah</label>
              <input 
                type="text" 
                value={formData.nipKepsek}
                onChange={(e) => setFormData({...formData, nipKepsek: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Bendahara</label>
              <input 
                type="text" 
                value={formData.bendahara}
                onChange={(e) => setFormData({...formData, bendahara: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">NIP Bendahara</label>
              <input 
                type="text" 
                value={formData.nipBendahara}
                onChange={(e) => setFormData({...formData, nipBendahara: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password Akses Sistem</label>
              <input 
                type="text" 
                value={formData.pass}
                onChange={(e) => setFormData({...formData, pass: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      {/* Reset Data Section */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-rose-50 bg-rose-50/30">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle size={20} />
            <h2 className="font-bold text-lg">Zona Bahaya</h2>
          </div>
          <p className="text-xs text-rose-500 mt-1">Tindakan di bawah ini tidak dapat dibatalkan.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Reset Semua Data Transaksi</h3>
            <p className="text-sm text-gray-500 mt-1">
              Menghapus seluruh catatan transaksi (Penerimaan & Pengeluaran) dari database. 
              Data profil sekolah akan tetap tersimpan.
            </p>
          </div>

          {resetMessage && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${resetMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {resetMessage.text}
              <button onClick={() => setResetMessage(null)} className="ml-auto text-xs underline">Tutup</button>
            </div>
          )}

          {!showResetConfirm ? (
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} /> Kosongkan Data Transaksi
            </button>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-3">
              <p className="text-sm font-bold text-rose-700">Apakah Anda yakin? Semua data transaksi akan dihapus selamanya.</p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleReset}
                  disabled={resetLoading}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {resetLoading ? <Loader2 className="animate-spin" size={16} /> : 'Ya, Hapus Sekarang'}
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<DataLaporan[]>([]);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [summary, setSummary] = useState<Summary>({ 
    penerimaanTahap1: 0, 
    penerimaanTahap2: 0, 
    totalTerima: 0, 
    pengeluaranTahap1: 0, 
    pengeluaranTahap2: 0, 
    totalKeluar: 0, 
    saldoTahap1: 0, 
    saldoTahap2: 0,
    honorGuru: 0,
    sapras: 0,
    buku: 0,
    realisasi: {
      t1: {
        barang: { siplah: 0, nonsiplah: 0 },
        mesin: { siplah: 0, nonsiplah: 0 },
        aset: { siplah: 0, nonsiplah: 0 }
      },
      t2: {
        barang: { siplah: 0, nonsiplah: 0 },
        mesin: { siplah: 0, nonsiplah: 0 },
        aset: { siplah: 0, nonsiplah: 0 }
      }
    },
    pajak: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dataRes, profilRes, summaryRes] = await Promise.all([
        fetch('/api/data'),
        fetch('/api/profil'),
        fetch('/api/summary')
      ]);
      
      const dataJson = dataRes.ok ? await dataRes.json() : [];
      const profilJson = profilRes.ok ? await profilRes.json() : null;
      const summaryJson = summaryRes.ok ? await summaryRes.json() : null;

      setData(dataJson);
      if (profilJson) setProfil(profilJson);
      if (summaryJson) setSummary(summaryJson);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = async (password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        alert('Password salah!');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center">
        <Loader2 className="animate-spin text-black" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">BOS OPS</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Cikijing</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText size={18} /> Data Laporan
          </button>
          <button 
            onClick={() => setActiveTab('strategis')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'strategis' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <PieChart size={18} /> Alokasi Strategis
          </button>
          <button 
            onClick={() => setActiveTab('realisasi')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'realisasi' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Wallet size={18} /> Realisasi Belanja
          </button>
          <button 
            onClick={() => setActiveTab('pajak')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'pajak' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <TrendingUp size={18} /> Setor Pajak
          </button>
          <button 
            onClick={() => setActiveTab('bku')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'bku' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Printer size={18} /> Cetak Bukti BKU
          </button>
          <button 
            onClick={() => setActiveTab('profil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profil' ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Settings size={18} /> Pengaturan
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
            <p className="text-gray-500 text-sm italic font-serif">{profil?.nama} • NPSN: {profil?.npsn}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-black transition-colors">
              <Printer size={20} />
            </button>
            <div className="h-10 w-[1px] bg-gray-200 mx-2" />
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Saldo Saat Ini</p>
              <p className="font-mono font-bold">Rp {(summary.saldoTahap2 || 0).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard summary={summary} data={data} />}
            {activeTab === 'data' && <DataManagement data={data} onRefresh={fetchData} />}
            {activeTab === 'strategis' && <StrategicAllocation summary={summary} />}
            {activeTab === 'realisasi' && <RealisasiBelanja summary={summary} />}
            {activeTab === 'pajak' && <SetorPajak summary={summary} />}
            {activeTab === 'bku' && <BKUPrint />}
            {activeTab === 'profil' && profil && <ProfileSettings profil={profil} onRefresh={fetchData} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
