"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/utils/format";
import { useOwnerStore } from "@/store/ownerStore";
import { getApprovalsAction, approveRequestAction, rejectRequestAction } from "@/app/actions/approvals";

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

export default function Persetujuan() {
  const [filter, setFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranchId } = useOwnerStore();

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
    } else {
      alert("Gagal menyetujui pengajuan: " + res.error);
    }
  }

  async function handleReject(id: string) {
    setLoading(true);
    const res = await rejectRequestAction(id);
    setLoading(false);
    if (res.success) {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "rejected" } : a));
      setSelectedApproval(null);
    } else {
      alert("Gagal menolak pengajuan: " + res.error);
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
          <Button variant="outline" size="sm">History</Button>
          <Button variant="primary" size="sm">Setujui Semua PO</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Menunggu", value: pendingCount, icon: "⏳", color: "amber" },
          { label: "Disetujui", value: approvedCount, icon: "✅", color: "emerald" },
          { label: "Ditolak", value: rejectedCount, icon: "❌", color: "red" },
          { label: "Total Nilai", value: formatRupiah(baseApprovalsList.filter(a => a.status === "pending").reduce((s, a) => s + a.amount, 0), true), icon: "💰", color: "blue" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className={`text-xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
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
                  Permintaan ini diajukan karena stok menipis dan diperlukan untuk operasional harian. Mohon segera ditindaklanjuti.
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
    </div>
  );
}
