"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah } from "@/utils/format";
import { getPromosAction, createPromoAction, togglePromoStatusAction, deletePromoAction } from "@/app/actions/promos";

export default function PromoManagementPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");

  const loadPromos = async () => {
    setLoading(true);
    const res = await getPromosAction();
    if (res.success && res.data) {
      setPromos(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSaving(true);
    const res = await createPromoAction({
      code,
      type,
      value,
      minOrder,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    setSaving(false);

    if (res.success && res.data) {
      setPromos(prev => [res.data, ...prev]);
      setShowAddModal(false);
      setCode("");
      setValue(10);
      setMinOrder(0);
      setExpiresAt("");
    } else {
      alert("Gagal membuat promo: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setPromos(prev => prev.map(p => p.id === id ? { ...p, isActive: nextStatus } : p));
    await togglePromoStatusAction(id, nextStatus);
  };

  const handleDelete = async (id: string, promoCode: string) => {
    if (!confirm(`Hapus kupon promo '${promoCode}'?`)) return;
    setPromos(prev => prev.filter(p => p.id !== id));
    await deletePromoAction(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Kupon & Diskon Promo
            </h1>
            <Badge variant="brand" size="sm">Tersinkronisasi ke Checkout</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola kode voucher diskon yang dapat diklaim oleh pelanggan di web dan digunakan saat checkout.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <span>+</span> Buat Kupon Promo Baru
          </Button>
        </div>
      </div>

      {/* Promos Table / Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Memuat daftar promo...</div>
      ) : promos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <span className="text-4xl block mb-2">🎁</span>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Belum Ada Kupon Promo</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Buat kupon pertama Anda untuk meningkatkan pesanan pelanggan.</p>
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            + Buat Promo Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map(p => (
            <div
              key={p.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border ${
                p.isActive ? "border-orange-200 dark:border-orange-900/40" : "border-slate-200 dark:border-slate-800 opacity-60"
              } p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono font-black text-base px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 rounded-xl">
                    {p.code}
                  </span>
                  <Badge variant={p.isActive ? "success" : "neutral"} size="sm">
                    {p.isActive ? "Aktif" : "Non-aktif"}
                  </Badge>
                </div>

                <div className="space-y-1.5 my-3">
                  <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {p.type === "percent" ? `Diskon ${p.value}%` : `Potongan ${formatRupiah(p.value)}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Min. Belanja: <strong>{Number(p.minOrder) > 0 ? formatRupiah(p.minOrder) : "Tanpa Minimum"}</strong>
                  </p>
                  {p.expiresAt && (
                    <p className="text-[11px] text-slate-400">
                      Berlaku s.d: {new Date(p.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggle(p.id, p.isActive)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                    p.isActive 
                      ? "text-slate-600 border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                      : "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100"
                  }`}
                >
                  {p.isActive ? "Non-aktifkan" : "Aktifkan"}
                </button>

                <button
                  onClick={() => handleDelete(p.id, p.code)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Promo Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleCreatePromo}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Buat Kupon Promo Baru</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Kode Kupon (Huruf Besar & Angka)"
                placeholder="misal: HEMAT20, GAJIAN50"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                required
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Tipe Potongan Diskon
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("percent")}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      type === "percent"
                        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Persentase (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("fixed")}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      type === "fixed"
                        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Nominal Rupiah (Rp)
                  </button>
                </div>
              </div>

              <Input
                label={type === "percent" ? "Besaran Diskon (%)" : "Besaran Diskon (Rp)"}
                type="number"
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                placeholder={type === "percent" ? "10" : "15000"}
                required
              />

              <Input
                label="Minimal Belanja (Rp) — Opsional"
                type="number"
                value={minOrder}
                onChange={e => setMinOrder(Number(e.target.value))}
                placeholder="0"
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Masa Berlaku Kupon (Opsional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={e => setExpiresAt(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                {saving ? "Menyimpan..." : "Buat Kupon"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
