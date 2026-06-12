"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { approvalsList } from "@/data/mockData";
import { formatRupiah } from "@/utils/format";

const typeConfig: Record<string, { label: string; icon: string; color: "info" | "warning" | "danger" | "neutral" }> = {
  purchase_order: { label: "Purchase Order", icon: "ðŸ“¦", color: "info" },
  discount: { label: "Diskon", icon: "ðŸ·ï¸", color: "warning" },
  refund: { label: "Refund", icon: "â†©ï¸", color: "danger" },
  transfer: { label: "Transfer", icon: "ðŸ”„", color: "neutral" },
};

const priorityConfig: Record<string, { label: string; variant: "danger" | "warning" | "info" | "neutral" }> = {
  critical: { label: "Kritis", variant: "danger" },
  high: { label: "Tinggi", variant: "warning" },
  medium: { label: "Sedang", variant: "info" },
  low: { label: "Rendah", variant: "neutral" },
};

export default function Persetujuan({
  initialApprovalsList = [],
}: {
  initialApprovalsList?: any[];
}) {
  const [filter, setFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [approvedList, setApprovedList] = useState<string[]>([]);
  const [rejectedList, setRejectedList] = useState<string[]>([]);

  const approvalsList = initialApprovalsList.length > 0 ? initialApprovalsList : [
    { id: "a1", title: "Pembelian Tepung & Mentega", type: "purchase_order", amount: 1540000, requestedBy: "Andi Pratama", cabang: "BSD", requestedAt: "2 jam lalu", priority: "high", status: "pending" },
    { id: "a2", title: "Diskon Promo Natal 15%", type: "discount", amount: 0, requestedBy: "Hana Sari", cabang: "Sudirman", requestedAt: "4 jam lalu", priority: "medium", status: "pending" },
    { id: "a3", title: "Refund Martabak Gosong", type: "refund", amount: 45000, requestedBy: "Joko Widodo", cabang: "Kemang", requestedAt: "5 jam lalu", priority: "low", status: "pending" },
  ];

  const filtered = approvalsList.filter(a => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending" && !approvedList.includes(a.id) && !rejectedList.includes(a.id);
    if (filter === "approved") return approvedList.includes(a.id);
    if (filter === "rejected") return rejectedList.includes(a.id);
    return a.type === filter;
  });

  const selectedItem = approvalsList.find(a => a.id === selectedApproval);
  const pendingCount = approvalsList.filter(a => a.status === "pending" && !approvedList.includes(a.id) && !rejectedList.includes(a.id)).length;

  function handleApprove(id: string) {
    setApprovedList(prev => [...prev, id]);
    setSelectedApproval(null);
  }

  function handleReject(id: string) {
    setRejectedList(prev => [...prev, id]);
    setSelectedApproval(null);
  }

  function getStatus(id: string, originalStatus: string) {
    if (approvedList.includes(id)) return "approved";
    if (rejectedList.includes(id)) return "rejected";
    return originalStatus;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persetujuan (Approvals)</h2>
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
          { label: "Menunggu", value: pendingCount, icon: "â³", color: "amber" },
          { label: "Disetujui", value: approvedList.length, icon: "âœ…", color: "emerald" },
          { label: "Ditolak", value: rejectedList.length, icon: "âŒ", color: "red" },
          { label: "Total Nilai", value: formatRupiah(approvalsList.filter(a => a.status === "pending").reduce((s, a) => s + a.amount, 0), true), icon: "ðŸ’°", color: "blue" },
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
          { key: "pending", label: `â³ Pending (${pendingCount})` },
          { key: "purchase_order", label: "ðŸ“¦ Purchase Order" },
          { key: "discount", label: "ðŸ·ï¸ Diskon" },
          { key: "refund", label: "â†©ï¸ Refund" },
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
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-4xl mb-3">âœ…</div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Semua approval sudah diproses!</p>
              <p className="text-xs text-slate-400 mt-1">Tidak ada yang perlu ditindaklanjuti.</p>
            </div>
          )}
          {filtered.map((approval) => {
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
                        <p className="text-xs text-slate-500 mt-0.5">{approval.requestedBy} Â· {approval.cabang}</p>
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
                          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); handleApprove(approval.id); }}>âœ… Setujui</Button>
                          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleReject(approval.id); }}>âŒ Tolak</Button>
                          <button className="text-xs text-orange-600 dark:text-orange-400 font-medium ml-auto hover:underline">Detail</button>
                        </>
                      )}
                      {currentStatus === "approved" && <Badge variant="success">âœ… Disetujui</Badge>}
                      {currentStatus === "rejected" && <Badge variant="danger">âŒ Ditolak</Badge>}
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Detail Approval</h3>
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
                  <Button variant="primary" className="flex-1" onClick={() => handleApprove(selectedItem.id)}>âœ… Setujui</Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleReject(selectedItem.id)}>âŒ Tolak</Button>
                </div>
              )}
              {getStatus(selectedItem.id, selectedItem.status) === "approved" && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/30 text-center">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">âœ… Sudah Disetujui</p>
                </div>
              )}
              {getStatus(selectedItem.id, selectedItem.status) === "rejected" && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/30 text-center">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">âŒ Ditolak</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



