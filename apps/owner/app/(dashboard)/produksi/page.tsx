/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN PRODUKSI & DAPUR (KITCHEN & PRODUCTION UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Mengelola Rencana Masak Dapur Harian, Monitoring Yield Rate % & Variance,
 * Eksekusi Potong Stok Bahan Baku Otomatis (BOM Deduction) ke Halaman Persediaan.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. INPUT TARGET & HASIL MASAK: Form modal untuk menentukan target porsi dan hasil aktual masak.
 * 2. MONITORING STATUS YIELD: Auto-badge (On Track 🟢, Terlambat 🔴, Lebih Produksi 🔵).
 * 3. EKSEKUSI POTONG STOK (BOM): Tombol aksi untuk memotong stok persediaan bahan baku real-time.
 * 4. ISOLASI CABANG & TANGGAL: Filter presisi per cabang (`selectedBranchId`) & tanggal produksi.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/production.ts`
 * - Database Schema: `packages/db/schema.ts` (`productionPlans`, `recipes`, `inventory`)
 * =========================================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { formatPercent } from "@/utils/format";
import { useOwnerStore } from "@/store/ownerStore";
import { 
  getProductionPlanAction, 
  createProductionPlanItemAction,
  updateProductionPlanItemAction,
  deleteProductionPlanItemAction,
  executeProductionDeductionAction
} from "@/app/actions/production";

const statusConfig = {
  "on-track": { label: "On Track", variant: "success" as const, icon: "✅" },
  "behind": { label: "Terlambat", variant: "danger" as const, icon: "🔴" },
  "ahead": { label: "Lebih", variant: "info" as const, icon: "🔵" },
  "completed": { label: "Selesai", variant: "brand" as const, icon: "✨" },
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

export default function Produksi() {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deductingId, setDeductingId] = useState<string | null>(null);
  const { selectedBranchId } = useOwnerStore();

  // Add Item Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMenuName, setAddMenuName] = useState("");
  const [addTargetQty, setAddTargetQty] = useState(30);
  const [addProducedQty, setAddProducedQty] = useState(0);
  const [addNotes, setAddNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Item Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editTargetQty, setEditTargetQty] = useState(0);
  const [editProducedQty, setEditProducedQty] = useState(0);
  const [editNotes, setEditNotes] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const activeBranch = selectedBranchId || undefined;
    const res = await getProductionPlanAction(activeBranch, date);
    if (res.success && res.data) {
      setPlans(res.data);
    } else {
      setPlans([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedBranchId, date]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMenuName.trim() || addTargetQty <= 0) return;
    setSubmitting(true);

    const activeBranch = selectedBranchId && selectedBranchId !== "all" ? selectedBranchId : undefined;
    const res = await createProductionPlanItemAction({
      menuName: addMenuName,
      targetQty: addTargetQty,
      producedQty: addProducedQty,
      branchId: activeBranch,
      date,
      notes: addNotes,
    });

    setSubmitting(false);
    if (res.success) {
      setShowAddModal(false);
      setAddMenuName("");
      setAddTargetQty(30);
      setAddProducedQty(0);
      setAddNotes("");
      fetchData();
    } else {
      alert("Gagal menambahkan item rencana produksi: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setEditTargetQty(item.targetQty);
    setEditProducedQty(item.producedQty);
    setEditNotes(item.notes || "");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || editTargetQty <= 0) return;
    setSubmitting(true);

    const res = await updateProductionPlanItemAction(editingItem.id, {
      targetQty: editTargetQty,
      producedQty: editProducedQty,
      notes: editNotes,
    });

    setSubmitting(false);
    if (res.success) {
      setShowEditModal(false);
      setEditingItem(null);
      fetchData();
    } else {
      alert("Gagal mengupdate rencana produksi: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleDeleteItem = async (id: string, menuName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus rencana produksi untuk "${menuName}"?`)) return;
    const res = await deleteProductionPlanItemAction(id);
    if (res.success) {
      fetchData();
    } else {
      alert("Gagal menghapus rencana produksi: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleDeductStock = async (item: any) => {
    if (item.producedQty <= 0) {
      alert("Jumlah aktual diproduksi masih 0 pcs. Silakan edit dan masukkan jumlah produksi terlebih dahulu.");
      return;
    }

    if (!confirm(`Eksekusi pengurangan stok persediaan (BOM) untuk ${item.producedQty} pcs "${item.menu}"?`)) return;

    setDeductingId(item.id);
    const res = await executeProductionDeductionAction(item.id);
    setDeductingId(null);

    if (res.success && res.data) {
      const { deductedItems } = res.data;
      if (deductedItems.length > 0) {
        const itemDetails = deductedItems.map((d: any) => `• ${d.name}: -${d.deductQty} ${d.unit} (Sisa: ${d.newStock} ${d.unit})`).join("\n");
        alert(`✅ Berhasil memotong stok persediaan untuk "${item.menu}" (${item.producedQty} pcs):\n\n${itemDetails}`);
      } else {
        alert(`✅ Produksi dicatat! Tidak ada bahan baku yang cocok di inventaris.`);
      }
      fetchData();
    } else {
      alert("Gagal memotong stok: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const filteredPlan = plans;
  const yieldChart = plans.map(p => ({ 
    name: p.menu.length > 12 ? p.menu.substring(0, 12) + "..." : p.menu, 
    target: p.targetQty, 
    produced: p.producedQty, 
    yield: p.yield 
  }));

  const onTrack = filteredPlan.filter(p => p.status === "on-track" || p.status === "completed").length;
  const behind = filteredPlan.filter(p => p.status === "behind").length;
  const ahead = filteredPlan.filter(p => p.status === "ahead").length;
  const avgYield = filteredPlan.length > 0
    ? filteredPlan.reduce((sum, p) => sum + p.yield, 0) / filteredPlan.length
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Produksi & Dapur (Kitchen Management)</h2>
          <p className="text-sm text-slate-500 mt-0.5">Rencana harian, laporan yield porsi, dan pemotongan stok otomatis (BOM)</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
          />
          <ExportDropdown 
            data={filteredPlan}
            columns={["Menu", "Cabang", "Target", "Aktual", "Yield", "Status"]}
            filename={`rencana_produksi_${date}`}
            title={`Rencana Produksi (${date})`}
            pdfDataMapper={(item) => [item.menu, item.cabang, item.targetQty, item.producedQty, `${item.yield}%`, item.status]}
          />
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowAddModal(true)}
          >
            + Tambah Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "On Track", value: onTrack.toString(), icon: "✅", desc: "item sesuai target" },
          { label: "Terlambat / Kurang", value: behind.toString(), icon: "🔴", desc: "item di bawah target" },
          { label: "Lebih Produksi", value: ahead.toString(), icon: "🔵", desc: "item di atas target" },
          { label: "Rata-rata Yield", value: `${formatPercent(avgYield)}`, icon: "📊", desc: "efisiensi produksi" },
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

      {loading && (
        <div className="flex justify-center py-12">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-orange-200 dark:border-orange-950" />
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        </div>
      )}

      {/* Production Table */}
      {!loading && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rencana & Realisasi Produksi Dapur</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pantau target harian vs aktual masak porsi di dapur</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Menu Masakan", "Cabang", "Target", "Aktual", "Yield %", "Saran AI", "Status", "Aksi"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPlan.length > 0 ? (
                  filteredPlan.map((item) => {
                    const cfg = statusConfig[item.status as keyof typeof statusConfig] || statusConfig["on-track"];
                    const isDeducting = deductingId === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.menu}</p>
                          {item.notes && <p className="text-[11px] text-slate-400 mt-0.5">Catatan: {item.notes}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {item.cabang}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.targetQty} pcs</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{item.producedQty} pcs</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-sm font-bold ${item.yield >= 85 && item.yield <= 102 ? "text-emerald-600" : item.yield < 85 ? "text-red-500" : "text-blue-500"}`}>
                            {formatPercent(item.yield)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                            ✨ {item.aiSuggested} pcs
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={cfg.variant}>{cfg.icon} {cfg.label}</Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenEdit(item)}
                            >
                              Ubah
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm"
                              disabled={isDeducting || item.producedQty <= 0}
                              onClick={() => handleDeductStock(item)}
                              title="Potong stok bahan baku persediaan berdasarkan resep BOM"
                            >
                              {isDeducting ? "Memotong..." : "⚡ Potong Stok"}
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id, item.menu)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Hapus Rencana Produksi"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-xs text-slate-400">
                      Belum ada rencana produksi dapur untuk tanggal ini. Klik <strong>+ Tambah Item</strong> di atas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Yield Chart */}
      {!loading && filteredPlan.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Target vs Realisasi Produksi Aktual</h3>
              <p className="text-xs text-slate-500 mt-0.5">Grafik perbandingan kuantitas target harian vs hasil aktual dapur</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yieldChart} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} angle={-10} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip content={<ProdTooltip />} />
              <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="produced" name="Produksi" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {yieldChart.map((item, i) => (
                  <Cell
                    key={i}
                    fill={item.produced >= item.target ? "#22c55e" : item.produced >= item.target * 0.85 ? "#f97316" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Modal Tambah Item Produksi */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Rencana Produksi Dapur</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Menu Masakan</label>
                <Input 
                  placeholder="Contoh: Martabak Spesial Daging" 
                  value={addMenuName} 
                  onChange={e => setAddMenuName(e.target.value)} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Produksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={1}
                    value={addTargetQty} 
                    onChange={e => setAddTargetQty(Number(e.target.value))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aktual Diproduksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={0}
                    value={addProducedQty} 
                    onChange={e => setAddProducedQty(Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Tambahan (Opsional)</label>
                <Input 
                  placeholder="Contoh: Batch Pagi persiapan jam 10:00" 
                  value={addNotes} 
                  onChange={e => setAddNotes(e.target.value)} 
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan Rencana"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Item Produksi */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 animate-fade-in" onClick={() => setShowEditModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Ubah Rencana Produksi</h3>
                <p className="text-xs text-orange-600 font-semibold mt-0.5">{editingItem.menu}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Produksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={1}
                    value={editTargetQty} 
                    onChange={e => setEditTargetQty(Number(e.target.value))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aktual Diproduksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={0}
                    value={editProducedQty} 
                    onChange={e => setEditProducedQty(Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Tambahan (Opsional)</label>
                <Input 
                  placeholder="Catatan batch produksi" 
                  value={editNotes} 
                  onChange={e => setEditNotes(e.target.value)} 
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Update Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
