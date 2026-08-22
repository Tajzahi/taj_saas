/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN LAPORAN KEUANGAN RESTORAN (PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Antarmuka Client UI untuk laporan finansial komprehensif (`/keuangan`).
 * Menyajikan laporan P&L (Profit & Loss / Laba Rugi), grafik Arus Kas (Cash Flow),
 * breakdown Omzet per Cabang, serta Rekonsiliasi Kasir POS (`schema.shifts`).
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. FETCH DATA (Baris 38-75)     : Mengambil data P&L, Arus Kas, & Shift Kasir via `getPnLAction`, `getCashflowAction`, `getShiftHistoryAction`.
 * 2. TABS & VIEWS (Baris 115-135) : Toggle antara Tab P&L, Arus Kas, dan Rekonsiliasi Shift Kasir.
 * 3. REKONSILIASI KASIR (265-335) : Menampilkan status shift kasir (Shift Aktif, OK/Pas, Selisih, Minus) & audit drift kasir.
 * 4. EXPORT & KAMUS (Baris 90-100) : Tombol Ekspor PDF/Excel & Panduan Kamus Keuangan UMKM Kuliner.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/finance.ts`
 * - State Store    : `apps/owner/store/ownerStore.ts` (`selectedBranchId`, `dateRange`)
 * =========================================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRupiah, formatPercent } from "@/utils/format";
import { getShiftHistoryAction, getPnLAction, getCashflowAction } from "@/app/actions/finance";
import { PageHeader } from "@/components/ui/PageHeader";
import { exportToExcel, exportToPDF } from "@/utils/export";
import { useOwnerStore } from "@/store/ownerStore";
function FinancialTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Keuangan() {
  const [activeTab, setActiveTab] = useState<"pnl" | "cashflow" | "rekonsiliasi">("pnl");
  const [selectedMonth, setSelectedMonth] = useState("Des");
  const [shifts, setShifts] = useState<any[]>([]);
  const [pnl, setPnl] = useState<any[]>([]);
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [pnlByBranch, setPnlByBranch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranchId, dateRange } = useOwnerStore();

  useEffect(() => {
    setLoading(true);
    // P&L dan Cashflow trend selalu ambil data "all" untuk menampilkan historis 6 bulan
    // Rekonsiliasi shift menggunakan filter dateRange dari global header
    const rangeParam = dateRange || undefined;
    const branchParam = selectedBranchId || undefined;

    Promise.all([
      getShiftHistoryAction(rangeParam, branchParam),
      getPnLAction("all", branchParam),     // always show full historical trend
      getCashflowAction("all", branchParam) // always show full historical cashflow
    ]).then(([shiftRes, pnlRes, cashflowRes]) => {

      if (shiftRes.success && shiftRes.data) {
        const mapped = shiftRes.data.map((dbShift: any) => {
          const actualCashVal = Number(dbShift.actualCash) || 0;
          const startingCashVal = Number(dbShift.startingCash) || 0;
          const driftVal = Number(dbShift.drift) || 0;
          const expectedCashVal = actualCashVal - driftVal;
          const isClosed = dbShift.status === "closed";
          let shiftStatus = "open";
          if (isClosed) {
            if (driftVal < 0) shiftStatus = "critical";
            else if (driftVal > 0) shiftStatus = "warning";
            else shiftStatus = "ok";
          } else {
            shiftStatus = "open";
          }

          return {
            id: dbShift.id,
            cabang: dbShift.branchName || "Cabang Utama",
            shift: isClosed ? "Operasional Selesai" : "Operasional Kasir (Aktif)",
            kasir: dbShift.kasirName || dbShift.operatorName || "Staf Kasir",
            expectedCash: expectedCashVal,
            actualCash: actualCashVal,
            diff: driftVal,
            status: shiftStatus,
          };
        });
        setShifts(mapped);
      }
      if (pnlRes.success) {
        setPnl(pnlRes.data || []);
        if (pnlRes.byBranch) {
          setPnlByBranch(pnlRes.byBranch);
        }
      }
      if (cashflowRes.success && cashflowRes.data) {
        setCashflow(cashflowRes.data);
      }
      setLoading(false);
    });
  }, [selectedBranchId, dateRange]);

  let branchName = "Semua Cabang";
  if (selectedBranchId && selectedBranchId !== "all") {
    branchName = "Cabang Terpilih";
  }

  const displayRecon = shifts;
  const adjustedPnL = pnl;
  const adjustedCashflow = cashflow;

  const defaultPnL = { month: "Bulan ini", revenue: 0, cogs: 0, grossProfit: 0, opex: 0, netProfit: 0 };
  const latestPnL = adjustedPnL && adjustedPnL.length > 0 ? adjustedPnL[adjustedPnL.length - 1] : defaultPnL;
  const grossMarginPct = latestPnL.revenue > 0 ? (latestPnL.grossProfit / latestPnL.revenue) * 100 : 0;
  const netMarginPct = latestPnL.revenue > 0 ? (latestPnL.netProfit / latestPnL.revenue) * 100 : 0;
  const cogsPct = latestPnL.revenue > 0 ? (latestPnL.cogs / latestPnL.revenue) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title="Keuangan"
        subtitle="P&L, Arus Kas, dan Rekonsiliasi Shift"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => exportToPDF(["Bulan", "Omzet", "HPP", "Gross Profit", "OpEx", "Net Profit"], adjustedPnL.map((d: any) => [d.month, d.revenue, d.cogs, d.grossProfit, d.opex, d.netProfit]), "laporan_pnl_keuangan", "Laporan P&L Bulanan")}>Export PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportToExcel(adjustedPnL, "laporan_pnl_keuangan")}>Export Excel</Button>
          </>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Omzet", value: formatRupiah(latestPnL.revenue, true), sub: branchName, color: "orange" },
          { label: "Gross Profit", value: formatRupiah(latestPnL.grossProfit, true), sub: `Margin ${formatPercent(grossMarginPct)}`, color: "emerald" },
          { label: "Net Profit", value: formatRupiah(latestPnL.netProfit, true), sub: `NPM ${formatPercent(netMarginPct)}`, color: latestPnL.netProfit < 0 ? "red" : "blue" },
          { label: "HPP", value: formatRupiah(latestPnL.cogs, true), sub: `${formatPercent(cogsPct)} dari omzet`, color: "red" },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Contextual Advisory Banner when Net Profit is negative */}
      {latestPnL.netProfit < 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-amber-900 dark:text-amber-200">
            <p className="font-bold">Perhatian Finansial: Net Profit Negatif ({formatRupiah(latestPnL.netProfit)})</p>
            <p className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
              Beban gaji/operasional tetap bulanan (<span className="font-semibold">{formatRupiah(latestPnL.opex)}</span>) saat ini melampaui laba kotor (<span className="font-semibold">{formatRupiah(latestPnL.grossProfit)}</span>). 
              Tingkatkan volume transaksi penjualan harian atau evaluasi alokasi shift tenaga kerja untuk mencapai titik impas (BEP).
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {([
          { key: "pnl", label: "📊 P&L" },
          { key: "cashflow", label: "💰 Arus Kas" },
          { key: "rekonsiliasi", label: "🧾 Rekonsiliasi" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "pnl" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* P&L Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren P&L (6 Bulan) {selectedBranchId && selectedBranchId !== 'all' && `- ${branchName}`}</h3>
              <Badge variant="info" size="sm">Periode Laporan</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={adjustedPnL} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
                <Tooltip content={<FinancialTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                <Bar dataKey="revenue" name="Omzet" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="grossProfit" name="Gross Profit" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="netProfit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Summary by Cabang */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Omzet per Cabang</h3>
            {pnlByBranch.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada data omzet cabang terdaftar
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {pnlByBranch.map(b => (
                  <div key={b.branchId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{b.branchName}</span>
                      <span className="text-orange-600 font-bold">{formatRupiah(b.revenue, true)}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, b.percentage))}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right font-mono">{b.percentage}% dari total omzet</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* P&L Detail Table */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Detail P&L Bulanan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Bulan", "Omzet", "HPP", "Gross Profit", "Gross Margin", "OpEx", "Net Profit", "NPM"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adjustedPnL.map((row: any) => (
                    <tr key={row.month} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${row.month === selectedMonth ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`} onClick={() => setSelectedMonth(row.month)}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.month} 2024</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{formatRupiah(row.revenue, true)}</td>
                      <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 whitespace-nowrap">{formatRupiah(row.cogs, true)}</td>
                      <td className="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">{formatRupiah(row.grossProfit, true)}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-bold text-emerald-600">{formatPercent((row.grossProfit / row.revenue) * 100)}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatRupiah(row.opex, true)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{formatRupiah(row.netProfit, true)}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="text-sm font-bold text-blue-600">{formatPercent((row.netProfit / row.revenue) * 100)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cashflow" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Arus Kas — 6 Bulan Terakhir {selectedBranchId && selectedBranchId !== 'all' && `- ${branchName}`}</h3>
            <Badge variant="success" size="sm">Net Positif</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={adjustedCashflow} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={64} />
              <Tooltip content={<FinancialTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="masuk" name="Arus Masuk" stroke="#22c55e" strokeWidth={2} fill="url(#inGrad)" dot={false} />
              <Area type="monotone" dataKey="keluar" name="Arus Keluar" stroke="#ef4444" strokeWidth={2} fill="url(#outGrad)" dot={false} />
              <Area type="monotone" dataKey="net" name="Net Cash" stroke="#3b82f6" strokeWidth={2.5} fill="none" dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "rekonsiliasi" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Rekonsiliasi", value: `${displayRecon.length} shift`, icon: "🧾", color: "blue" },
              { label: "OK / Shift Aktif", value: displayRecon.filter(r => r.status === "ok" || r.status === "open").length.toString(), icon: "✅", color: "emerald" },
              { label: "Perlu Perhatian", value: displayRecon.filter(r => r.status === "warning" || r.status === "critical").length.toString(), icon: "⚠️", color: "amber" },
            ].map(card => (
              <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <p className={`text-xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
                    <p className="text-xs text-slate-500">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rekonsiliasi Shift Hari Ini</h3>
              <span className="text-xs text-slate-500">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayRecon.map((rec) => (
                <div key={rec.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                  rec.status === "critical" ? "bg-red-50/50 dark:bg-red-950/10" :
                  rec.status === "warning" ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    rec.status === "ok" ? "bg-emerald-500" :
                    rec.status === "open" ? "bg-blue-500" :
                    rec.status === "warning" ? "bg-amber-500" : "bg-red-500"
                  }`} />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rec.cabang}</p>
                      <p className="text-xs text-slate-500">{rec.shift}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs text-slate-500">Kasir</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{rec.kasir}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Diharapkan</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(rec.expectedCash, true)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Aktual</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(rec.actualCash, true)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Selisih</p>
                      <p className={`text-sm font-bold ${rec.diff > 0 ? "text-amber-600" : rec.diff < 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {rec.diff === 0 ? "✅ Pas" : `${rec.diff > 0 ? "+" : ""}${formatRupiah(rec.diff, true)}`}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Badge variant={rec.status === "ok" ? "success" : rec.status === "open" ? "info" : rec.status === "warning" ? "warning" : "danger"}>
                        {rec.status === "ok" ? "OK / Pas" : rec.status === "open" ? "Shift Aktif" : rec.status === "warning" ? "Selisih (+)" : "Minus (-)"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UMKM Financial Terms Guide Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 mt-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
          💡 Kamus Keuangan UMKM
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Omzet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Total semua uang masuk hasil jualan kotor, sebelum dikurangi biaya apa pun.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">HPP (Harga Pokok Penjualan)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Modal mentah untuk membeli bahan baku & kemasan dari produk yang laku terjual.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Gross Profit (Laba Kotor)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Sisa uang dari Omzet setelah dikurangi modal bahan (Omzet - HPP).</p>
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Gross Margin (Persentase Laba Kotor)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Persentase kesehatan resep. Semakin tinggi persennya, semakin tebal untung dari modal bahan baku.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">OpEx (Biaya Operasional)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Biaya harian di luar bahan makanan, seperti sewa tempat, gaji karyawan, listrik, gas, air, dan kuota.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Net Profit (Laba Bersih)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Keuntungan bersih yang benar-benar bisa Anda kantongi setelah semua pengeluaran lunas dibayar.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400">NPM (Margin Laba Bersih)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Seberapa efisien bisnis Anda. Angka ini menunjukkan berapa persen uang yang tersisa menjadi hak milik bersih Anda dari setiap omzet masuk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
