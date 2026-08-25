"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getTenantSettingsAction, updateTenantBrandingAction, getAuditLogsAction } from "@/app/actions/settings";
import { getProfilesAction } from "@/app/actions/hr";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import Link from "next/link";

const roleLabels: Record<string, string> = {
  owner: "Owner / Pemilik",
  manager: "Manajer Cabang",
  kasir: "Kasir",
  dapur: "Staf Dapur",
  staff: "Staf Umum",
};

const brandColors = [
  "#f97316", "#ef4444", "#8b5cf6", "#3b82f6", "#22c55e", "#06b6d4", "#eab308", "#ec4899"
];

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState<"branding" | "delivery" | "payment" | "receipt" | "users" | "audit">("branding");
  const [primaryColor, setPrimaryColor] = useState("#f97316");
  const [secondaryColor, setSecondaryColor] = useState("#eab308");
  const [businessName, setBusinessName] = useState("");
  const [logo, setLogo] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [receiptHeader, setReceiptHeader] = useState("MARTABAK A6 NYUSS");
  const [receiptFooter, setReceiptFooter] = useState("-- Terima kasih & Selamat Menikmati! --");
  const [receiptPaperWidth, setReceiptPaperWidth] = useState("58mm");
  const [qrisImageUrl, setQrisImageUrl] = useState("/qris.png");
  const [bankInfo, setBankInfo] = useState("BCA 123-456-7890 a/n Martabak A6 Nyuss");
  const [heroBannerUrl, setHeroBannerUrl] = useState("");
  const [taxRate, setTaxRate] = useState<number>(10);
  const [serviceChargeRate, setServiceChargeRate] = useState<number>(0);
  const [enableQris, setEnableQris] = useState<boolean>(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState<boolean>(true);
  const [enableCash, setEnableCash] = useState<boolean>(true);
  const [maxDeliveryRadiusKm, setMaxDeliveryRadiusKm] = useState<number>(10);
  const [flatDeliveryFee, setFlatDeliveryFee] = useState<number>(8000);
  const [deliveryZones, setDeliveryZones] = useState<any[]>([
    { name: "Zona 1 (Dekat)", maxKm: 3, fee: 5000 },
    { name: "Zona 2 (Sedang)", maxKm: 6, fee: 8000 },
    { name: "Zona 3 (Jauh)", maxKm: 10, fee: 12000 },
  ]);
  const [settingsVersion, setSettingsVersion] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Live Database States
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbAuditLogs, setDbAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        setBusinessName(res.data.name || "");
        if (typeof (res.data as any).settingsVersion === "number") {
          setSettingsVersion((res.data as any).settingsVersion);
        }
        const branding: any = res.data.branding;
        if (branding) {
          if (branding.primaryColor) setPrimaryColor(branding.primaryColor);
          if (branding.secondaryColor) setSecondaryColor(branding.secondaryColor);
          if (branding.logoUrl) setLogoUrl(branding.logoUrl);
          if (branding.faviconUrl) setFaviconUrl(branding.faviconUrl);
          if (branding.logo) setLogo(branding.logo);
          if (branding.brandName) setBusinessName(branding.brandName);
          if (branding.receiptHeader) setReceiptHeader(branding.receiptHeader);
          if (branding.receiptFooter) setReceiptFooter(branding.receiptFooter);
          if (branding.receiptPaperWidth) setReceiptPaperWidth(String(branding.receiptPaperWidth));
          if (branding.qrisImageUrl) setQrisImageUrl(branding.qrisImageUrl);
          if (branding.bankInfo) setBankInfo(branding.bankInfo);
          if (branding.heroBannerUrl) setHeroBannerUrl(branding.heroBannerUrl);
          if (typeof branding.taxRate === "number") setTaxRate(branding.taxRate);
          else if (typeof branding.taxRateBps === "number") setTaxRate(branding.taxRateBps / 100);
          if (typeof branding.serviceChargeRate === "number") setServiceChargeRate(branding.serviceChargeRate);
          else if (typeof branding.serviceChargeRateBps === "number") setServiceChargeRate(branding.serviceChargeRateBps / 100);
          if (typeof branding.enableQris === "boolean") setEnableQris(branding.enableQris);
          if (typeof branding.enableBankTransfer === "boolean") setEnableBankTransfer(branding.enableBankTransfer);
          if (typeof branding.enableCash === "boolean") setEnableCash(branding.enableCash);
          if (typeof branding.maxDeliveryRadiusKm === "number") setMaxDeliveryRadiusKm(branding.maxDeliveryRadiusKm);
          if (typeof branding.flatDeliveryFee === "number") setFlatDeliveryFee(branding.flatDeliveryFee);
          if (branding.deliveryZones && Array.isArray(branding.deliveryZones)) setDeliveryZones(branding.deliveryZones);
        }
      }
      setLoading(false);
    });

    // Fetch Live Users/Profiles from Neon DB
    getProfilesAction().then(res => {
      if (res.success && res.data) {
        setDbUsers(res.data);
      }
    });

    // Fetch Live Audit Logs from Neon DB
    getAuditLogsAction().then(res => {
      if (res.success && res.data) {
        setDbAuditLogs(res.data);
      }
    });
  }, []);

  const handleQrisImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Ukuran file gambar QRIS terlalu besar (maksimal 3MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setQrisImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    const res = await updateTenantBrandingAction({
      logo,
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      brandName: businessName,
      receiptHeader,
      receiptFooter,
      receiptPaperWidth,
      qrisImageUrl,
      bankInfo,
      heroBannerUrl,
      taxRate: Number(taxRate),
      taxRateBps: Math.round(Number(taxRate) * 100),
      serviceChargeRate: Number(serviceChargeRate),
      serviceChargeRateBps: Math.round(Number(serviceChargeRate) * 100),
      enableQris,
      enableBankTransfer,
      enableCash,
      maxDeliveryRadiusKm: Number(maxDeliveryRadiusKm),
      flatDeliveryFee: Number(flatDeliveryFee),
      deliveryZones,
    }, settingsVersion);
    setLoading(false);
    if (res.success) {
      if (res.data && typeof (res.data as any).settingsVersion === "number") {
        setSettingsVersion((res.data as any).settingsVersion);
      }
      alert("Pengaturan berhasil disimpan ke Database!");
    } else {
      if (res.error && res.error.includes("pengguna lain")) {
        alert("Pengaturan telah diperbarui oleh pengguna lain. Halaman akan dimuat ulang.");
        window.location.reload();
      } else {
        alert("Gagal menyimpan pengaturan: " + res.error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pengaturan</h2>
          <p className="text-sm text-slate-500 mt-0.5">Konfigurasi tenant, pengguna, struk kasir, dan sistem</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {([
          { key: "branding", label: "🎨 Branding" },
          { key: "delivery", label: "🛵 Radius & Ongkir" },
          { key: "payment", label: "💳 Pajak & Pembayaran" },
          { key: "receipt", label: "🧾 Struk Kasir" },
          { key: "users", label: "👥 Pengguna" },
          { key: "audit", label: "📋 Audit Log" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.key
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Brand Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Identitas Bisnis</h3>

            {/* Logo Bisnis */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Logo Bisnis (Header & Footer)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-3xl shadow-md overflow-hidden text-white font-black flex-shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : logo ? (
                    <span>{logo}</span>
                  ) : (
                    <span>{businessName ? businessName.charAt(0).toUpperCase() : "🏪"}</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://... atau unggah gambar logo"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                    <label className="cursor-pointer inline-flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 px-3 py-2 rounded-xl hover:bg-orange-100 transition-colors whitespace-nowrap">
                      📁 Upload Logo
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert("Ukuran file logo maksimal 2MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") setLogoUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Atau gunakan Emoji/Inisial:</span>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="☕"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-12 text-center text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl("")}
                        className="text-[11px] text-red-500 hover:underline ml-auto"
                      >
                        Reset ke Inisial
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Favicon Browser Tab Upload */}
            <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/40 dark:bg-orange-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🔖</span> Favicon Kustom (Ikon Tab Browser)
                </label>
                <Badge variant="neutral" size="sm">Tab Browser</Badge>
              </div>

              {/* Tab Mockup Preview */}
              <div className="flex items-center gap-2 bg-slate-200/70 dark:bg-slate-800 p-2 rounded-lg max-w-xs">
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden text-[9px] text-white font-black flex-shrink-0">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="Favicon" className="w-full h-full object-cover" />
                  ) : logoUrl ? (
                    <img src={logoUrl} alt="Favicon" className="w-full h-full object-cover" />
                  ) : (
                    <span>{businessName ? businessName.charAt(0).toUpperCase() : "🏪"}</span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                  {businessName || "Nama Toko Anda"}
                </span>
                <span className="text-[10px] text-slate-400 ml-auto">✕</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... / link file favicon (.ico, .png, .svg)"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                />
                <label className="cursor-pointer inline-flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-800 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap">
                  📁 Upload Favicon
                  <input
                    type="file"
                    accept="image/png, image/x-icon, image/vnd.microsoft.icon, image/svg+xml, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 1024 * 1024) {
                          alert("Ukuran favicon maksimal 1MB.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") setFaviconUrl(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Rekomendasi: File <strong>.ico</strong> atau <strong>PNG</strong> 32x32 / 64x64 px.</span>
                {faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setFaviconUrl("")}
                    className="text-red-500 hover:underline font-bold"
                  >
                    Gunakan Otomatis
                  </button>
                )}
              </div>
            </div>

            {/* Business Name */}
            <Input
              label="Nama Bisnis"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            {/* Primary Color */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">Warna Utama (Primary)</label>
              <div className="flex items-center gap-2 flex-wrap">
                {brandColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${primaryColor === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs text-slate-500 font-mono">{primaryColor}</span>
                </div>
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">Warna Sekunder</label>
              <div className="flex items-center gap-2 flex-wrap">
                {brandColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSecondaryColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${secondaryColor === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs text-slate-500 font-mono">{secondaryColor}</span>
                </div>
              </div>
            </div>

            {/* 1-Click Gradient Presets */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-2">
                🎨 Pilihan Preset Gradasi Populer (1-Klik)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { name: "Sunset Ember", primary: "#8E0E0E", secondary: "#E05009", desc: "Hangat & Gurih" },
                  { name: "Royal Gold", primary: "#1A1A1A", secondary: "#D4AF37", desc: "Mewah & Eksklusif" },
                  { name: "Emerald Gourmet", primary: "#064E3B", secondary: "#10B981", desc: "Segar & Alami" },
                  { name: "Choco Caramel", primary: "#3E2723", secondary: "#D97706", desc: "Manis & Dessert" },
                  { name: "Midnight Blue", primary: "#0F172A", secondary: "#2563EB", desc: "Modern & Elegan" },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:scale-102 transition-all text-left group flex flex-col gap-1.5 shadow-sm"
                  >
                    <div
                      className="w-full h-7 rounded-lg shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)` }}
                    />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{preset.name}</p>
                      <p className="text-[9px] text-slate-400">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pratinjau Tema Gradasi Brand</h3>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              {/* Header Preview */}
              <div
                className="h-14 flex items-center px-5 justify-between text-white transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-black shadow-inner">
                    {logo}
                  </div>
                  <div>
                    <span className="text-xs font-black block leading-none">{businessName || "Nama Brand"}</span>
                    <span className="text-[9px] opacity-80">{receiptFooter || "Martabak & Terang Bulan Spesial"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    BUKA
                  </span>
                </div>
              </div>

              {/* Body CTA Preview */}
              <div className="p-6 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-xs p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-md space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Tombol Aksi Gradasi</p>
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white shadow-lg transition-transform hover:scale-102"
                    style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
                  >
                    Pesan Sekarang — Rp 35.000
                  </button>
                  <button
                    type="button"
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold transition-colors border"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    Lihat Rincian Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "delivery" && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Delivery Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🛵</span> Pengaturan Radius & Ongkos Kirim (Delivery)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kontrol jangkauan kilometer pengiriman dan tarif ongkir bertingkat yang dihitung otomatis oleh peta.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMaxDeliveryRadiusKm(10);
                  setFlatDeliveryFee(8000);
                  setDeliveryZones([
                    { name: "Zona 1 (Dekat)", maxKm: 3, fee: 5000 },
                    { name: "Zona 2 (Sedang)", maxKm: 6, fee: 8000 },
                    { name: "Zona 3 (Jauh)", maxKm: 10, fee: 12000 },
                  ]);
                  alert("Rekomendasi standar F&B delivery Surabaya (0-10 km) berhasil diterapkan!");
                }}
                className="flex items-center gap-1.5 text-xs text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100"
              >
                💡 Terapkan Rekomendasi Sesuai Alamat Gerai
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Radius Maksimal Pengiriman (Kilometer)"
                  type="number"
                  value={maxDeliveryRadiusKm}
                  onChange={e => setMaxDeliveryRadiusKm(Math.max(1, Number(e.target.value)))}
                  placeholder="10"
                />
                <p className="text-[10px] text-slate-400 mt-1">Pesanan di luar jarak ini akan diarahkan ke opsi Takeaway.</p>
              </div>
              <div>
                <Input
                  label="Ongkir Cadangan / Fallback (Rp)"
                  type="number"
                  value={flatDeliveryFee}
                  onChange={e => setFlatDeliveryFee(Math.max(0, Number(e.target.value)))}
                  placeholder="8000"
                />
                <p className="text-[10px] text-slate-400 mt-1">Digunakan otomatis jika GPS atau lokasi spesifik customer tidak terdeteksi.</p>
              </div>
            </div>
          </div>

          {/* Delivery Zones Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Zona Tarif Ongkos Kirim Bertingkat</h4>
                <p className="text-xs text-slate-500">Tarif otomatis berdasarkan jarak dari outlet ke rumah pelanggan</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeliveryZones(prev => [
                    ...prev,
                    { name: `Zona ${prev.length + 1}`, maxKm: (prev[prev.length - 1]?.maxKm || 5) + 3, fee: 15000 }
                  ]);
                }}
              >
                + Tambah Zona
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Nama Zona</th>
                    <th className="px-5 py-3">Batas Jarak Maks. (Km)</th>
                    <th className="px-5 py-3">Biaya Ongkir (Rp)</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {deliveryZones.map((zone, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={zone.name}
                          onChange={e => {
                            const val = e.target.value;
                            setDeliveryZones(prev => prev.map((z, i) => i === idx ? { ...z, name: val } : z));
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <span>s/d</span>
                          <input
                            type="number"
                            value={zone.maxKm}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setDeliveryZones(prev => prev.map((z, i) => i === idx ? { ...z, maxKm: val } : z));
                            }}
                            className="w-20 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                          />
                          <span>km</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <span>Rp</span>
                          <input
                            type="number"
                            value={zone.fee}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setDeliveryZones(prev => prev.map((z, i) => i === idx ? { ...z, fee: val } : z));
                            }}
                            className="w-28 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-orange-600"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {deliveryZones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setDeliveryZones(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-bold text-xs p-1"
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Akses Pengguna & Hak Akses</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar pengguna resmi terdaftar di database tenant Anda</p>
            </div>
            <Link href="/sdm">
              <Button variant="primary" size="sm">
                + Tambah / Kelola Karyawan (SDM)
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            {dbUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Belum ada data pengguna terdaftar di database.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Nama", "Email", "Hak Akses (Role)", "Penugasan Cabang", "Gaji Pokok", "Status", ""].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dbUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-850 dark:text-slate-150">{u.name || u.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="info" size="sm">{roleLabels[u.role] || u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {u.branchId === "pusat" || !u.branchId ? "Pusat / Kantor" : `Cabang ${u.branchId}`}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Rp {Number(u.salary || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success" size="sm">Aktif</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href="/sdm">
                          <Button variant="ghost" size="sm">Kelola di SDM</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Form Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Pajak & Metode Pembayaran</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="PB1 (Pajak Restoran %)"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  placeholder="10"
                />
                <Input
                  label="Service Charge (%)"
                  type="number"
                  value={serviceChargeRate}
                  onChange={(e) => setServiceChargeRate(Number(e.target.value))}
                  placeholder="0"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Pengaturan Barcode QRIS & Rekening Toko</h4>
                
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Gambar Barcode QRIS Toko (Scan Pembayaran Pembeli)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    {/* Live Preview Box */}
                    <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                      {qrisImageUrl ? (
                        <img src={qrisImageUrl} alt="QRIS Toko" className="w-full h-full object-contain p-1" />
                      ) : (
                        <div className="text-center p-2 text-slate-400">
                          <span className="text-2xl block">📱</span>
                          <span className="text-[10px]">Belum ada barcode</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Action & URL Input */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <div>
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Unggah File Gambar QRIS (PNG, JPG, WebP)
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                            onChange={handleQrisImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-350 mt-1.5">Format didukung: <strong>PNG</strong>, <strong>JPG</strong>, <strong>WebP</strong> (Maks. 5 MB)</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Atau URL Gambar Online:</label>
                        <input
                          type="text"
                          value={qrisImageUrl}
                          onChange={(e) => setQrisImageUrl(e.target.value)}
                          placeholder="https://.../barcode-qris.png"
                          className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Input
                  label="Info Bank / Nomor Rekening Transfer"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  placeholder="misal: BCA 123-456-7890 a/n Martabak A6 Nyuss"
                />

                <Input
                  label="URL Banner Promo Beranda Customer Web"
                  value={heroBannerUrl}
                  onChange={(e) => setHeroBannerUrl(e.target.value)}
                  placeholder="misal: /banner-promo.jpg atau https://.../banner.jpg"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Metode Pembayaran Diaktifkan</h4>
                <div className="space-y-3">
                  {[
                    { key: "qris", name: "QRIS Toko Dinamis", desc: "Integrasi QRIS barcode resmi toko", active: enableQris, toggle: () => setEnableQris(!enableQris) },
                    { key: "transfer", name: "Transfer Bank", desc: "Verifikasi manual transfer bank toko", active: enableBankTransfer, toggle: () => setEnableBankTransfer(!enableBankTransfer) },
                    { key: "cash", name: "Tunai (Cash)", desc: "Bayar langsung di kasir toko", active: enableCash, toggle: () => setEnableCash(!enableCash) },
                  ].map((pay) => (
                    <div key={pay.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-150">{pay.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{pay.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={pay.toggle}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                          pay.active
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300"
                        }`}
                      >
                        {pay.active ? "Aktif ✓" : "Non-aktif ✕"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column for QRIS & Payment */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pratinjau Standee QRIS Meja Toko</span>
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold px-2 py-0.5 rounded-full">Live Preview</span>
              </div>

              {/* Standee Mockup Box */}
              <div className="bg-gradient-to-b from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-6 shadow-xl border border-rose-500 max-w-sm mx-auto text-center space-y-4 relative overflow-hidden">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 inline-flex items-center gap-2 border border-white/20">
                  <span className="text-2xl">{logo}</span>
                  <span className="text-sm font-extrabold tracking-wide text-white uppercase">{businessName}</span>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-inner text-slate-900 space-y-2">
                  <div className="flex items-center justify-between border-b pb-1.5 text-[11px] font-bold text-slate-600">
                    <span>QRIS NASIONAL</span>
                    <span className="text-red-600 font-black">QRIS</span>
                  </div>
                  <div className="w-48 h-48 mx-auto bg-slate-50 rounded-lg p-2 flex items-center justify-center border border-slate-200">
                    {qrisImageUrl ? (
                      <img src={qrisImageUrl} alt="Barcode QRIS Toko" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center p-3 text-slate-400">
                        <span className="text-4xl block mb-1">📱</span>
                        <span className="text-xs font-semibold">Unggah QRIS di Kiri</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium pt-1">Scan QRIS menggunakan Mobile Banking atau E-Wallet (GoPay, OVO, ShopeePay, Dana)</p>
                </div>

                {bankInfo && (
                  <div className="bg-black/20 rounded-lg p-2 text-center text-xs font-medium text-rose-100 border border-white/10">
                    <p className="text-[10px] uppercase tracking-wider text-rose-200">Rekening Transfer Toko:</p>
                    <p className="font-bold text-white mt-0.5">{bankInfo}</p>
                  </div>
                )}
              </div>

              {/* Tax & Calculation Breakdown Preview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Simulasi Perhitungan Nota Transaksi Kasir:</p>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal Belanja:</span>
                  <span className="font-semibold">Rp 100.000</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>PB1 (Pajak {taxRate}%):</span>
                  <span className="font-semibold text-orange-600">Rp {(100000 * (taxRate / 100)).toLocaleString("id-ID")}</span>
                </div>
                {serviceChargeRate > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Service Charge ({serviceChargeRate}%):</span>
                    <span className="font-semibold text-orange-600">Rp {(100000 * (serviceChargeRate / 100)).toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 pt-2 text-sm">
                  <span>Total Bayar Pembeli:</span>
                  <span className="text-green-600 dark:text-green-400">
                    Rp {(100000 + 100000 * (taxRate / 100) + 100000 * (serviceChargeRate / 100)).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "receipt" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Form Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Kustomisasi Struk Belanja POS Kasir</h3>
              <p className="text-xs text-slate-500 mt-1">Atur teks header, pesan ucapan di footer, dan ukuran kertas cetak struk kasir.</p>
            </div>

            <div className="space-y-4">
              <Input
                label="Teks Header Struk (Nama Toko / Slogan)"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                placeholder="misal: MARTABAK A6 NYUSS - RASA LEZAT A6 BANGET"
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Pesan Footer Struk (Ucapan / Promo)
                </label>
                <textarea
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  rows={3}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-200"
                  placeholder="misal: Terima kasih! Simpan struk ini untuk promo 10% bulan depan."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ukuran Kertas Printer Thermal Kasir
                </label>
                <CustomSelect
                  value={receiptPaperWidth}
                  onChange={setReceiptPaperWidth}
                  options={[
                    { value: "58mm", label: "58mm (Printer Kasir Portable / Bluetooth Standard)" },
                    { value: "80mm", label: "80mm (Printer Kasir Thermal Desktop Besar)" }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Right Live Thermal Receipt Preview Column */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pratinjau Cetak Struk Kasir Thermal</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 font-semibold px-2 py-0.5 rounded-full">
                  Thermal {receiptPaperWidth}
                </span>
              </div>

              {/* Thermal Paper Mockup Card */}
              <div
                className={`mx-auto bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-5 shadow-2xl border border-slate-300 dark:border-slate-800 font-mono text-xs space-y-3 relative rounded-t-xl transition-all ${
                  receiptPaperWidth === "58mm" ? "max-w-[280px]" : "max-w-[360px]"
                }`}
              >
                {/* Header Section */}
                <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
                  <span className="text-3xl block">{logo}</span>
                  <p className="font-extrabold text-sm uppercase tracking-wide">{businessName}</p>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{receiptHeader}</p>
                  <p className="text-[9px] text-slate-500 pt-1">Cabang Utama · Telp: 0812-3456-7890</p>
                </div>

                {/* Meta Transaction Info */}
                <div className="text-[10px] space-y-0.5 text-slate-600 dark:text-slate-400 border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between">
                    <span>No. Nota:</span>
                    <span className="font-bold">#ORD-20260730-08</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span>30/07/2026 13:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>Budi (Kasir 1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jenis:</span>
                    <span>Dine-In (Meja 05)</span>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="space-y-1.5 border-b border-dashed border-slate-400 pb-3 text-[11px]">
                  <div className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>2x Martabak Manis Spesial</span>
                      <span>80.000</span>
                    </div>
                    <p className="text-[9px] text-slate-500 pl-2">+ Keju Kraft & Cokelat Toblerone</p>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>2x Es Teh Manis Jumbo</span>
                    <span>20.000</span>
                  </div>
                </div>

                {/* Totals & Tax Calculation */}
                <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-3">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span>100.000</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>PB1 ({taxRate}%):</span>
                    <span>{(100000 * (taxRate / 100)).toLocaleString("id-ID")}</span>
                  </div>
                  {serviceChargeRate > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Service ({serviceChargeRate}%):</span>
                      <span>{(100000 * (serviceChargeRate / 100)).toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-300 dark:border-slate-700">
                    <span>TOTAL:</span>
                    <span>
                      Rp {(100000 + 100000 * (taxRate / 100) + 100000 * (serviceChargeRate / 100)).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Bayar (QRIS):</span>
                    <span>
                      {(100000 + 100000 * (taxRate / 100) + 100000 * (serviceChargeRate / 100)).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Kembali:</span>
                    <span>0</span>
                  </div>
                </div>

                {/* Footer Message */}
                <div className="text-center pt-1 text-[10px] text-slate-600 dark:text-slate-400 font-semibold space-y-1">
                  <p className="whitespace-pre-wrap">{receiptFooter}</p>
                  <p className="text-[8px] text-slate-400 tracking-wider">*** POWERED BY TAJ POS ***</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Audit Log Aktivitas</h3>
              <p className="text-xs text-slate-500 mt-0.5">Catatan riwayat transaksi dan aktivitas sistem dari database</p>
            </div>
            <ExportDropdown 
              data={dbAuditLogs.map(l => ({
                Pengguna: l.userId || "Sistem / Kasir",
                Aktivitas: `${l.action} (${l.entityType})`,
                Waktu: new Date(l.createdAt).toLocaleString("id-ID")
              }))}
              columns={["Pengguna", "Aktivitas", "Waktu"]}
              filename="log_aktivitas"
              title="Log Aktivitas System"
              pdfDataMapper={(item) => [item.Pengguna, item.Aktivitas, item.Waktu]}
            />
          </div>
          <div className="overflow-x-auto">
            {dbAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Belum ada catatan aktivitas audit log di database.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Waktu", "Pengguna / Actor", "Tindakan", "Modul / Entity", "IP Address"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dbAuditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-850 dark:text-slate-150">
                        {log.userId || "Kasir / Admin"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-650 dark:text-slate-350">{log.action}</td>
                      <td className="px-4 py-3 text-xs">
                        <Badge variant="neutral" size="sm">{log.entityType}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-450">{log.ipAddress || "127.0.0.1"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
