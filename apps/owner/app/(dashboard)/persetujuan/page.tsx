/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN PERSETUJUAN / APPROVALS (PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Halaman antarmuka Client UI untuk Otorisasi Persetujuan Owner terhadap pengajuan peka dari staf.
 * Memuat pengajuan PO, diskon, refund, dan transfer kas, serta menyediakan aksi Setujui / Tolak.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. FETCH DATA (Baris 55-78)     : Memanggil `getApprovalsAction` saat halaman dimuat.
 * 2. FILTER & CARDS (Baris 80-160) : Mengelompokkan statistik Pending/Approved/Rejected & filter cabang.
 * 3. HANDLER AKSI (Baris 100-140)  : Mengeksekusi `handleApprove`, `handleReject`, & `handleApproveAllPO`.
 * 4. PANEL DETAIL (Baris 250-320)  : Menampilkan rincian judul, pengaju, cabang, & catatan dinamis (`notes`).
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Backend Action: `apps/owner/app/actions/approvals.ts`
 * - State Store   : `apps/owner/store/ownerStore.ts` (`selectedBranchId`)
 * =========================================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/utils/format";
import { useOwnerStore } from "@/store/ownerStore";
import { getApprovalsAction, approveRequestAction, rejectRequestAction, approveAllPOAction, createApprovalAction } from "@/app/actions/approvals";
import toast from "react-hot-toast";

const typeConfig: Record<string, { label: string; icon: string; color: "info" | "warning" | "danger" | "neutral" }> = {
  purchase_order: { label: "Purchase Order", icon: "📦", color: "info" },
  discount: { label: "Diskon", icon: "🏷️", color: "warning" },
  refund: { label: "Refund", icon: "↩️", color: "danger" },
  transfer: { label: "Transfer", icon: "🔄", color: "neutral" },
};

const priorityConfig: Record<string, { label: string; variant: "danger" | "warning" | "info" | "neutral" }> = {
  critical: { label: "Kritis", variant: "danger" },
  high: { label: "Tinggi", variant: "warning" },
  medium: { label: "Sedang", variant: "info" },
  low: { label: "Rendah", variant: "neutral" },
};

const colorClasses: Record<string, string> = {
  amber: "text-amber-600 dark:text-amber-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  red: "text-red-600 dark:text-red-400",
  blue: "text-blue-600 dark:text-blue-400",
};

export default function Persetujuan() {
  const [filter, setFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranchId } = useOwnerStore();

  // State untuk Modal Form Buat Pengajuan Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newType, setNewType] = useState<"purchase_order" | "discount" | "refund" | "transfer">("purchase_order");
  const [newTitle, setNewTitle] = useState("");
  const [newRequestedBy, setNewRequestedBy] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPriority, setNewPriority] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    getApprovalsAction().then(res => {
      if (res.success && res.data) {
        const mapped = res.data.map(dbApp => {
          return {
            id: dbApp.id,
            type: dbApp.type,
            title: dbApp.title,
            requestedBy: dbApp.requestedBy,
            amount: Number(dbApp.amount),
            priority: dbApp.priority,
            status: dbApp.status,
            requestedAt: new Date(dbApp.requestedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            notes: dbApp.notes || "",
            branchId: dbApp.branchId || "",
            cabang: dbApp.branchId || "Semua Cabang",
          };
        });
        setApprovals(mapped);
      }
      setLoading(false);
    });
  }, []);

  let selectedBranchFilter = "all";
  if (selectedBranchId && selectedBranchId !== "all") {
    selectedBranchFilter = selectedBranchId;
  }

  const baseApprovalsList = approvals.filter(a => {
    if (selectedBranchFilter === "all") return true;
    return a.branchId === selectedBranchFilter;
  });

  const filtered = baseApprovalsList.filter(a => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending";
    if (filter === "approved") return a.status === "approved";
    if (filter === "rejected") return a.status === "rejected";
    return a.type === filter;
  });

  const selectedItem = baseApprovalsList.find(a => a.id === selectedApproval);
  const pendingCount = baseApprovalsList.filter(a => a.status === "pending").length;
  const approvedCount = baseApprovalsList.filter(a => a.status === "approved").length;
  const rejectedCount = baseApprovalsList.filter(a => a.status === "rejected").length;

  async function handleApprove(id: string) {
    setLoading(true);
    const res = await approveRequestAction(id);
    setLoading(false);
    if (res.success) {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "approved" } : a));
      setSelectedApproval(null);
      toast.success("Pengajuan berhasil disetujui.");
    } else {
      toast.error("Gagal menyetujui pengajuan: " + res.error);
    }
  }

  async function handleReject(id: string) {
    setLoading(true);
    const res = await rejectRequestAction(id);
    setLoading(false);
    if (res.success) {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "rejected" } : a));
      setSelectedApproval(null);
      toast.success("Pengajuan ditolak.");
    } else {
      toast.error("Gagal menolak pengajuan: " + res.error);
    }
  }

  async function handleApproveAllPO() {
    setLoading(true);
    const res = await approveAllPOAction();
    setLoading(false);
    if (res.success) {
      setApprovals(prev => prev.map(a => a.type === "purchase_order" && a.status === "pending" ? { ...a, status: "approved" } : a));
      toast.success(`Berhasil menyetujui ${res.count || 0} pengajuan Purchase Order.`);
    } else {
      toast.error("Gagal menyetujui massal: " + res.error);
    }
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newRequestedBy.trim() || !newAmount) {
      toast.error("Harap lengkapi judul, nama pengaju, dan nominal.");
      return;
    }

    setLoading(true);
    const res = await createApprovalAction({
      type: newType,
      title: newTitle.trim(),
      requestedBy: newRequestedBy.trim(),
      amount: Number(newAmount) || 0,
      priority: newPriority,
      notes: newNotes.trim(),
      branchId: selectedBranchId && selectedBranchId !== "all" ? selectedBranchId : undefined,
    });
    setLoading(false);

    if (res.success && res.data) {
      const created = res.data;
      setApprovals(prev => [
        {
          id: created.id,
          type: created.type,
          title: created.title,
          requestedBy: created.requestedBy,
          amount: Number(created.amount),
          priority: created.priority,
          status: created.status,
          requestedAt: new Date(created.requestedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          notes: created.notes || "",
          branchId: created.branchId || "",
          cabang: created.branchId || "Semua Cabang",
        },
        ...prev,
      ]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewRequestedBy("");
      setNewAmount("");
      setNewNotes("");
      toast.success("Pengajuan persetujuan baru berhasil dibuat!");
    } else {
      toast.error("Gagal membuat pengajuan: " + res.error);
    }
  }

  function getStatus(id: string, originalStatus: string) {
    return originalStatus;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persetujuan {selectedBranchId && selectedBranchId !== "all" && `- Cabang Terfilter`}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-red-600 font-semibold">{pendingCount} menunggu</span> persetujuan Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>+ Buat Pengajuan Baru</Button>
          <Button variant="outline" size="sm" onClick={handleApproveAllPO}>Setujui Semua PO</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Menunggu", value: pendingCount, icon: "⏳", color: "amber" },
          { label: "Disetujui", value: approvedCount, icon: "✅", color: "emerald" },
          { label: "Ditolak", value: rejectedCount, icon: "❌", color: "red" },
          { label: "Total Nilai Pending", value: formatRupiah(baseApprovalsList.filter(a => a.status === "pending").reduce((s, a) => s + a.amount, 0), true), icon: "💰", color: "blue" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className={`text-xl font-bold ${colorClasses[card.color] || "text-slate-800"}`}>{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Semua" },
          { key: "pending", label: `⏳ Pending (${pendingCount})` },
          { key: "purchase_order", label: "📦 Purchase Order" },
          { key: "discount", label: "🏷️ Diskon" },
          { key: "refund", label: "↩️ Refund" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-orange-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Approval List */}
        <div className={`space-y-2 ${selectedItem ? "lg:col-span-2" : "lg:col-span-3"}`}>
          {loading && (
            <div className="flex justify-center py-12">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-orange-200 dark:border-orange-950" />
                <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
              </div>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Semua persetujuan sudah diproses!</p>
              <p className="text-xs text-slate-400 mt-1">Tidak ada yang perlu ditindaklanjuti.</p>
            </div>
          )}
          {!loading && filtered.map((approval) => {
            const type = typeConfig[approval.type] || typeConfig.purchase_order;
            const priority = priorityConfig[approval.priority];
            const currentStatus = getStatus(approval.id, approval.status);
            const isSelected = selectedApproval === approval.id;

            return (
              <div
                key={approval.id}
                onClick={() => setSelectedApproval(isSelected ? null : approval.id)}
                className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-orange-300 dark:border-orange-700 ring-1 ring-orange-200 dark:ring-orange-900" :
                  "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-${type.color === "info" ? "blue" : type.color === "warning" ? "amber" : type.color === "danger" ? "red" : "slate"}-100 dark:bg-slate-800`}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{approval.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{approval.requestedBy} · {approval.cabang}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{approval.requestedAt}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatRupiah(approval.amount)}</p>
                        <Badge variant={priority.variant} size="sm">{priority.label}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {currentStatus === "pending" && (
                        <>
                          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); handleApprove(approval.id); }}>✅ Setujui</Button>
                          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleReject(approval.id); }}>❌ Tolak</Button>
                          <button className="text-xs text-orange-600 dark:text-orange-400 font-medium ml-auto hover:underline">Detail</button>
                        </>
                      )}
                      {currentStatus === "approved" && <Badge variant="success">✅ Disetujui</Badge>}
                      {currentStatus === "rejected" && <Badge variant="danger">❌ Ditolak</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Detail Persetujuan</h3>
              <button onClick={() => setSelectedApproval(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Judul</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedItem.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Diminta oleh</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.requestedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cabang</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.cabang}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tipe</p>
                  <Badge variant={typeConfig[selectedItem.type]?.color || "neutral"} size="sm" className="mt-0.5">
                    {typeConfig[selectedItem.type]?.label || selectedItem.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Prioritas</p>
                  <Badge variant={priorityConfig[selectedItem.priority]?.variant} size="sm" className="mt-0.5">
                    {priorityConfig[selectedItem.priority]?.label}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Nilai</p>
                  <p className="text-xl font-bold text-orange-600 mt-0.5">{formatRupiah(selectedItem.amount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Waktu Request</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.requestedAt}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Catatan</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedItem.notes || "Tidak ada catatan pengajuan."}
                </p>
              </div>
              {getStatus(selectedItem.id, selectedItem.status) === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" className="flex-1" onClick={() => handleApprove(selectedItem.id)}>✅ Setujui</Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleReject(selectedItem.id)}>❌ Tolak</Button>
                </div>
              )}
              {getStatus(selectedItem.id, selectedItem.status) === "approved" && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/30 text-center">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">✅ Sudah Disetujui</p>
                </div>
              )}
              {getStatus(selectedItem.id, selectedItem.status) === "rejected" && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/30 text-center">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">❌ Ditolak</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Form Buat Pengajuan Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">✨ Buat Pengajuan Persetujuan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipe Pengajuan</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                >
                  <option value="purchase_order">📦 Purchase Order (PO Bahan Baku)</option>
                  <option value="discount">🏷️ Diskon Khusus</option>
                  <option value="refund">↩️ Refund / Void Nota</option>
                  <option value="transfer">🔄 Transfer Kas Operasional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Pengajuan</label>
                <input
                  type="text"
                  placeholder="Contoh: PO Restock Daging Sapi 20kg"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Diminta Oleh</label>
                  <input
                    type="text"
                    placeholder="Nama Staf / Supervisor"
                    value={newRequestedBy}
                    onChange={(e) => setNewRequestedBy(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    placeholder="1500000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tingkat Prioritas</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                >
                  <option value="critical">🔴 Kritis (Darurat)</option>
                  <option value="high">🟠 Tinggi</option>
                  <option value="medium">🔵 Sedang</option>
                  <option value="low">⚪ Rendah</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan / Alasan</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan alasan pengajuan ini..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary" className="flex-1">Kirim Pengajuan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
