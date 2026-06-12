"use client";

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { pnlData, cabangList } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const defaultReconData = [
  { id: "r1", cabang: "BSD", shift: "Pagi", kasir: "Andi", expectedCash: 12400000, actualCash: 12380000, diff: -20000, status: "ok" },
  { id: "r2", cabang: "Sudirman", shift: "Pagi", kasir: "Hana", expectedCash: 9800000, actualCash: 9800000, diff: 0, status: "ok" },
  { id: "r3", cabang: "Kemang", shift: "Pagi", kasir: "Joko", expectedCash: 8200000, actualCash: 8350000, diff: 150000, status: "warning" },
  { id: "r4", cabang: "Depok", shift: "Pagi", kasir: "Mira", expectedCash: 6100000, actualCash: 5900000, diff: -200000, status: "critical" },
  { id: "r5", cabang: "Bekasi", shift: "Pagi", kasir: "-", expectedCash: 0, actualCash: 0, diff: 0, status: "vacant" },
];

const defaultCashflowData = [
  { month: "Jul", masuk: 162000000, keluar: 93960000, net: 68040000 },
  { month: "Agu", masuk: 175000000, keluar: 98875000, net: 76125000 },
  { month: "Sep", masuk: 168000000, keluar: 95928000, net: 72072000 },
  { month: "Okt", masuk: 182000000, keluar: 102816000, net: 79184000 },
  { month: "Nov", masuk: 195000000, keluar: 109395000, net: 85605000 },
  { month: "Des", masuk: 185200000, keluar: 103834000, net: 81366000 },
];

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

export default function Keuangan({
  initialPnLData = [],
  initialCabangList = [],
  initialReconData = [],
  initialCashflowData = [],
}: {
  initialPnLData?: any[];
  initialCabangList?: any[];
  initialReconData?: any[];
  initialCashflowData?: any[];
}) {
  const [activeTab, setActiveTab] = useState<"pnl" | "cashflow" | "rekonsiliasi">("pnl");
  const [selectedMonth, setSelectedMonth] = useState("Des");

  const pnlData = initialPnLData.length > 0 ? initialPnLData : [
    { month: "Jul", revenue: 162000000, cogs: 51840000, grossProfit: 110160000, opex: 42120000, netProfit: 68040000 },
    { month: "Agu", revenue: 175000000, cogs: 56000000, grossProfit: 119000000, opex: 42875000, netProfit: 76125000 },
    { month: "Sep", revenue: 168000000, cogs: 53760000, grossProfit: 114240000, opex: 42168000, netProfit: 72072000 },
    { month: "Okt", revenue: 182000000, cogs: 58240000, grossProfit: 123760000, opex: 44576000, netProfit: 79184000 },
    { month: "Nov", revenue: 195000000, cogs: 62400000, grossProfit: 132600000, opex: 46995000, netProfit: 85605000 },
    { month: "Des", revenue: 185200000, cogs: 59264000, grossProfit: 125936000, opex: 44570000, netProfit: 81366000 },
  ];

  const cabangList = initialCabangList.length > 0 ? initialCabangList : [
    { id: "c1", name: "Cabang BSD", revenue: 58000000 },
    { id: "c2", name: "Cabang Sudirman", revenue: 45000000 },
    { id: "c3", name: "Cabang Kemang", revenue: 38200000 },
    { id: "c4", name: "Cabang Depok", revenue: 26000000 },
    { id: "c5", name: "Cabang Bekasi", revenue: 18000000 },
  ];

  const reconData = initialReconData.length > 0 ? initialReconData : defaultReconData;
  const cashflowData = initialCashflowData.length > 0 ? initialCashflowData : defaultCashflowData;

  const latestPnL = pnlData[pnlData.length - 1];
  const grossMarginPct = latestPnL ? (latestPnL.grossProfit / latestPnL.revenue) * 100 : 0;
  const netMarginPct = latestPnL ? (latestPnL.netProfit / latestPnL.revenue) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Keuangan</h2>
          <p className="text-sm text-slate-500 mt-0.5">P&L, Arus Kas, dan Rekonsiliasi Shift</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export PDF</Button>
          <Button variant="outline" size="sm">Export Excel</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue (Des)", value: formatRupiah(latestPnL.revenue, true), sub: "Semua cabang", color: "orange" },
          { label: "Gross Profit (Des)", value: formatRupiah(latestPnL.grossProfit, true), sub: `Margin ${formatPercent(grossMarginPct)}`, color: "emerald" },
          { label: "Net Profit (Des)", value: formatRupiah(latestPnL.netProfit, true), sub: `NPM ${formatPercent(netMarginPct)}`, color: "blue" },
          { label: "COGS (Des)", value: formatRupiah(latestPnL.cogs, true), sub: `${formatPercent((latestPnL.cogs / latestPnL.revenue) * 100)} dari revenue`, color: "red" },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {([
          { key: "pnl", label: "ðŸ“Š P&L" },
          { key: "cashflow", label: "ðŸ’° Arus Kas" },
          { key: "rekonsiliasi", label: "ðŸ§¾ Rekonsiliasi" },
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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren P&L (6 Bulan)</h3>
              <Badge variant="info" size="sm">Julâ€“Des 2024</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={pnlData} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
                <Tooltip content={<FinancialTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="grossProfit" name="Gross Profit" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="netProfit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Summary by Cabang */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Revenue per Cabang</h3>
            <div className="space-y-3">
              {cabangList.map((cabang) => {
                const share = (cabang.revenue / cabangList.reduce((s, c) => s + c.revenue, 0)) * 100;
                return (
                  <div key={cabang.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{cabang.name.replace("Cabang ", "")}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2">{formatRupiah(cabang.revenue, true)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${share}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{formatPercent(share)} dari total</p>
                  </div>
                );
              })}
            </div>
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
                    {["Bulan", "Revenue", "COGS", "Gross Profit", "Gross Margin", "OpEx", "Net Profit", "NPM"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pnlData.map((row) => (
                    <tr key={row.month} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${row.month === selectedMonth ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`} onClick={() => setSelectedMonth(row.month)}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{row.month} 2024</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200">{formatRupiah(row.revenue, true)}</td>
                      <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">{formatRupiah(row.cogs, true)}</td>
                      <td className="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{formatRupiah(row.grossProfit, true)}</td>
                      <td className="px-4 py-3"><span className="text-sm font-bold text-emerald-600">{formatPercent((row.grossProfit / row.revenue) * 100)}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(row.opex, true)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">{formatRupiah(row.netProfit, true)}</td>
                      <td className="px-4 py-3"><span className="text-sm font-bold text-blue-600">{formatPercent((row.netProfit / row.revenue) * 100)}</span></td>
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
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Arus Kas â€” 6 Bulan Terakhir</h3>
            <Badge variant="success" size="sm">Net Positif</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashflowData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
              { label: "Total Rekonsiliasi", value: `${reconData.filter(r => r.status !== "vacant").length} shift`, icon: "ðŸ§¾", color: "blue" },
              { label: "OK / Selisih Minor", value: reconData.filter(r => r.status === "ok").length.toString(), icon: "âœ…", color: "emerald" },
              { label: "Perlu Perhatian", value: reconData.filter(r => r.status === "warning" || r.status === "critical").length.toString(), icon: "âš ï¸", color: "amber" },
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
              <span className="text-xs text-slate-500">22 Desember 2024</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reconData.map((rec) => (
                <div key={rec.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                  rec.status === "critical" ? "bg-red-50/50 dark:bg-red-950/10" :
                  rec.status === "warning" ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    rec.status === "ok" ? "bg-emerald-500" :
                    rec.status === "warning" ? "bg-amber-500" :
                    rec.status === "critical" ? "bg-red-500" : "bg-slate-300"
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
                        {rec.diff === 0 ? "âœ… Pas" : `${rec.diff > 0 ? "+" : ""}${formatRupiah(rec.diff, true)}`}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Badge variant={rec.status === "ok" ? "success" : rec.status === "warning" ? "warning" : rec.status === "critical" ? "danger" : "neutral"}>
                        {rec.status === "ok" ? "OK" : rec.status === "warning" ? "Selisih" : rec.status === "critical" ? "Kritis" : "Tutup"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



