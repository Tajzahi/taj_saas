"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { shiftData, cabangList } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const defaultEmployees = [
  { id: "e1", name: "Andi Pratama", role: "Kasir", cabang: "BSD", shift: "Pagi", salary: 3200000, hours: 8, status: "active" },
  { id: "e2", name: "Budi Santoso", role: "Produksi", cabang: "BSD", shift: "Pagi", salary: 2800000, hours: 8, status: "active" },
  { id: "e3", name: "Cici Rahayu", role: "Pelayan", cabang: "BSD", shift: "Pagi", salary: 2600000, hours: 8, status: "active" },
  { id: "e4", name: "Dedi Kurniawan", role: "Kasir", cabang: "BSD", shift: "Sore", salary: 3200000, hours: 8, status: "upcoming" },
  { id: "e5", name: "Hana Sari", role: "Kasir", cabang: "Sudirman", shift: "Pagi", salary: 3200000, hours: 8, status: "active" },
  { id: "e6", name: "Ivan Nugroho", role: "Produksi", cabang: "Sudirman", shift: "Pagi", salary: 2800000, hours: 8, status: "active" },
  { id: "e7", name: "Joko Widodo", role: "Kasir", cabang: "Kemang", shift: "Pagi", salary: 3200000, hours: 8, status: "active" },
  { id: "e8", name: "Lia Amelia", role: "Pelayan", cabang: "Kemang", shift: "Pagi", salary: 2600000, hours: 8, status: "active" },
  { id: "e9", name: "Mira Putri", role: "Kasir", cabang: "Depok", shift: "Pagi", salary: 3200000, hours: 8, status: "warning" },
];

function LaborTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatPercent(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function SDM({
  initialEmployees = [],
  initialShiftData = [],
  initialCabangList = [],
}: {
  initialEmployees?: any[];
  initialShiftData?: any[];
  initialCabangList?: any[];
}) {
  const [activeTab, setActiveTab] = useState<"shift" | "karyawan" | "biaya">("shift");

  const employees = initialEmployees.length > 0 ? initialEmployees : defaultEmployees;
  const shiftData = initialShiftData.length > 0 ? initialShiftData : [
    { id: "s1", cabang: "Cabang BSD", shift: "Pagi", staff: ["Andi", "Budi", "Cici"], kasir: "Andi", status: "active", sales: 12400000 },
    { id: "s2", cabang: "Cabang Sudirman", shift: "Pagi", staff: ["Hana", "Ivan"], kasir: "Hana", status: "active", sales: 9800000 },
    { id: "s3", cabang: "Cabang Kemang", shift: "Pagi", staff: ["Joko", "Lia"], kasir: "Joko", status: "active", sales: 8200000 },
  ];
  const cabangList = initialCabangList.length > 0 ? initialCabangList : [
    { id: "c1", name: "Cabang BSD", revenue: 58000000, laborCost: 15.2 },
    { id: "c2", name: "Cabang Sudirman", revenue: 45000000, laborCost: 16.8 },
    { id: "c3", name: "Cabang Kemang", revenue: 38200000, laborCost: 18.5 },
  ];

  const laborCostChart = cabangList.map(c => ({
    name: c.name.replace("Cabang ", ""),
    laborCost: c.laborCost,
    target: 18,
  }));

  const totalEmployees = employees.length;
  const activeShifts = shiftData.filter(s => s.status === "active").length;
  const vacantShifts = shiftData.filter(s => s.status === "vacant").length;
  const totalLaborCost = cabangList.reduce((s, c) => s + (c.revenue * c.laborCost / 100), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SDM & Shift</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manajemen karyawan, shift, dan biaya tenaga kerja</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Karyawan</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Karyawan", value: totalEmployees.toString(), icon: "ðŸ‘¥", trend: null },
          { label: "Shift Aktif", value: activeShifts.toString(), icon: "ðŸŸ¢", trend: null },
          { label: "Posisi Kosong", value: vacantShifts.toString(), icon: "ðŸ”´", trend: "alert" },
          { label: "Total Labor Cost", value: formatRupiah(totalLaborCost, true), icon: "ðŸ’µ", trend: null },
        ].map(card => (
          <div key={card.label} className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 ${card.trend === "alert" ? "border-red-200 dark:border-red-900/30" : "border-slate-200 dark:border-slate-800"}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
              {card.trend === "alert" && <Badge variant="danger" size="sm">Perlu Isi</Badge>}
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {([
          { key: "shift", label: "ðŸ• Jadwal Shift" },
          { key: "karyawan", label: "ðŸ‘¤ Daftar Karyawan" },
          { key: "biaya", label: "ðŸ’° Biaya Tenaga Kerja" },
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

      {activeTab === "shift" && (
        <div className="space-y-4">
          {/* Alert */}
          {vacantShifts > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">ðŸš¨</span>
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {vacantShifts} Shift Kosong Perlu Diisi
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                    Cabang Bekasi shift malam belum ada kasir yang ditugaskan.
                  </p>
                </div>
                <Button variant="danger" size="sm" className="ml-auto">Atur Sekarang</Button>
              </div>
            </div>
          )}

          {/* Shift Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {shiftData.map((shift) => (
              <div key={shift.id} className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 ${
                shift.status === "vacant" ? "border-red-200 dark:border-red-900/30" :
                shift.status === "warning" ? "border-amber-200 dark:border-amber-900/30" :
                "border-slate-200 dark:border-slate-800"
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{shift.cabang.replace("Cabang ", "")}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{shift.shift}</p>
                  </div>
                  <Badge
                    variant={
                      shift.status === "active" ? "success" :
                      shift.status === "upcoming" ? "info" :
                      shift.status === "warning" ? "warning" : "danger"
                    }
                  >
                    {shift.status === "active" ? "ðŸŸ¢ Aktif" :
                     shift.status === "upcoming" ? "ðŸ”µ Nanti" :
                     shift.status === "warning" ? "âš ï¸ Kurang" : "ðŸ”´ Kosong"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tim ({shift.staff.length} orang)</p>
                    {shift.staff.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {shift.staff.map((s: any, i: number) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${s === shift.kasir ? "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 font-semibold" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                            {s === shift.kasir ? "💼 " : ""}{s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 font-medium">Belum ada karyawan ditugaskan</p>
                    )}
                  </div>
                  {shift.sales > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500">Penjualan shift ini</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(shift.sales, true)}</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">Edit Shift</Button>
                  {shift.status === "vacant" && (
                    <Button variant="primary" size="sm" className="flex-1 text-xs">Tugaskan</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "karyawan" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Daftar Karyawan</h3>
            <Button variant="outline" size="sm">Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama", "Jabatan", "Cabang", "Shift", "Gaji/Bulan", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800 flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="neutral" size="sm">{emp.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{emp.cabang}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{emp.shift}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(emp.salary)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={emp.status === "active" ? "success" : emp.status === "warning" ? "warning" : "info"}>
                        {emp.status === "active" ? "Aktif" : emp.status === "warning" ? "Perlu Perhatian" : "Mendatang"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "biaya" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Labor Cost % per Cabang</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={laborCostChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 25]} />
                <Tooltip content={<LaborTooltip />} />
                <Bar dataKey="laborCost" name="Labor Cost" radius={[4, 4, 0, 0]} maxBarSize={36}
                  fill="#f97316"
                />
                <Bar dataKey="target" name="Target Max" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#e2e8f0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Detail Labor Cost per Cabang</h3>
            <div className="space-y-4">
              {cabangList.map((cabang) => {
                const laborCostAmt = cabang.revenue * cabang.laborCost / 100;
                const isHigh = cabang.laborCost > 20;
                return (
                  <div key={cabang.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cabang.name.replace("Cabang ", "")}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{formatRupiah(laborCostAmt, true)}</span>
                        <span className={`text-xs font-bold ${isHigh ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHigh ? "bg-red-400" : "bg-emerald-400"}`}
                        style={{ width: `${(cabang.laborCost / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



