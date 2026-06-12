"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { productionPlan } from "@/data/mockData";
import { formatPercent } from "@/utils/format";

const statusConfig = {
  "on-track": { label: "On Track", variant: "success" as const, icon: "✅" },
  "behind": { label: "Terlambat", variant: "danger" as const, icon: "🔴" },
  "ahead": { label: "Lebih", variant: "info" as const, icon: "🔵" },
};

function ProdTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{entry.value} {entry.name === "Yield" ? "%" : "pcs"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Produksi({
  initialProductionPlan = [],
}: {
  initialProductionPlan?: any[];
}) {
  const [date] = useState("22 Desember 2024");
  const [selectedCabang, setSelectedCabang] = useState("Semua");

  const plan = initialProductionPlan.length > 0 ? initialProductionPlan : productionPlan;

  const yieldChart = plan.map(p => ({
    name: p.menu.length > 18 ? p.menu.slice(0, 18) + "…" : p.menu,
    target: p.targetQty,
    produced: p.producedQty,
    yield: p.yield,
  }));

  const onTrack = plan.filter(p => p.status === "on-track").length;
  const behind = plan.filter(p => p.status === "behind").length;
  const ahead = plan.filter(p => p.status === "ahead").length;
  const avgYield = plan.length > 0 ? plan.reduce((s, p) => s + p.yield, 0) / plan.length : 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Produksi</h2>
          <p className="text-sm text-slate-500 mt-0.5">Rencana harian & laporan yield â€” {date}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCabang}
            onChange={(e) => setSelectedCabang(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {["Semua", "BSD", "Sudirman", "Kemang", "Depok", "Bekasi"].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
            </svg>
          }>AI Generate Plan</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "On Track", value: onTrack.toString(), icon: "âœ…", desc: "item sesuai target" },
          { label: "Terlambat", value: behind.toString(), icon: "ðŸ”´", desc: "item di bawah target" },
          { label: "Lebih Produksi", value: ahead.toString(), icon: "ðŸ”µ", desc: "item di atas target" },
          { label: "Rata-rata Yield", value: `${formatPercent(avgYield)}`, icon: "ðŸ“Š", desc: "dari semua item" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{card.label}</p>
            <p className="text-xs text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">ðŸ¤–</span>
          <div>
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">AI Menyarankan Peningkatan Produksi</p>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Berdasarkan prediksi demand akhir pekan (Natal) dan stok bahan baku saat ini, AI merekomendasikan peningkatan produksi Gorengan Mix sebesar +30 pcs dan Martabak Keju Susu +15 pcs untuk Sabtu-Minggu ini.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="primary" size="sm">Terapkan Saran AI</Button>
              <Button variant="ghost" size="sm">Abaikan</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rencana Produksi Harian</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="primary" size="sm">+ Tambah Item</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Menu", "Target (AI)", "Diproduksi", "Yield %", "Variance", "Status", ""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {plan.map((item) => {
                const cfg = statusConfig[item.status as keyof typeof statusConfig];
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.menu}</p>
                      {item.aiSuggested !== item.targetQty && (
                        <p className="text-xs text-orange-500 mt-0.5">ðŸ¤– AI: {item.aiSuggested} pcs</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.targetQty} pcs</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.producedQty} pcs</span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.yield >= 100 ? "bg-blue-400" : item.yield >= 90 ? "bg-emerald-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(item.yield, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${item.yield >= 100 ? "text-blue-600" : item.yield >= 90 ? "text-emerald-600" : "text-red-500"}`}>
                        {formatPercent(item.yield)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${item.variance > 0 ? "text-blue-600" : item.variance < -10 ? "text-red-600" : "text-emerald-600"}`}>
                        {item.variance > 0 ? "+" : ""}{formatPercent(item.variance)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.variant}>{cfg.icon} {cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yield Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Target vs Produksi Aktual</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={yieldChart} margin={{ top: 0, right: 4, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip content={<ProdTooltip />} />
            <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="produced" name="Produksi" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {yieldChart.map((item, i) => (
                <Cell
                  key={i}
                  fill={item.produced >= item.target ? "#22c55e" : item.produced >= item.target * 0.9 ? "#f97316" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



