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
  const [activeTab, setActiveTab] = useState<"branding" | "users" | "payment" | "receipt" | "audit">("branding");
  const [primaryColor, setPrimaryColor] = useState("#f97316");
  const [secondaryColor, setSecondaryColor] = useState("#eab308");
  const [businessName, setBusinessName] = useState("");
  const [logo, setLogo] = useState("");
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
  const [loading, setLoading] = useState(true);

  // Live Database States
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbAuditLogs, setDbAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        setBusinessName(res.data.name || "");
        const branding = res.data.branding;
        if (branding) {
          if (branding.primaryColor) setPrimaryColor(branding.primaryColor);
          if (branding.secondaryColor) setSecondaryColor(branding.secondaryColor);
          if (branding.logoUrl || branding.logo) setLogo(branding.logoUrl || branding.logo || "");
          if (branding.brandName) setBusinessName(branding.brandName);
          if (branding.receiptHeader) setReceiptHeader(branding.receiptHeader);
          if (branding.receiptFooter) setReceiptFooter(branding.receiptFooter);
          if (branding.receiptPaperWidth) setReceiptPaperWidth(String(branding.receiptPaperWidth));
          if (branding.qrisImageUrl) setQrisImageUrl(branding.qrisImageUrl);
          if (branding.bankInfo) setBankInfo(branding.bankInfo);
          if (branding.heroBannerUrl) setHeroBannerUrl(branding.heroBannerUrl);
          if (typeof branding.taxRate === "number") setTaxRate(branding.taxRate);
          if (typeof branding.serviceChargeRate === "number") setServiceChargeRate(branding.serviceChargeRate);
          if (typeof branding.enableQris === "boolean") setEnableQris(branding.enableQris);
          if (typeof branding.enableBankTransfer === "boolean") setEnableBankTransfer(branding.enableBankTransfer);
          if (typeof branding.enableCash === "boolean") setEnableCash(branding.enableCash);
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
      serviceChargeRate: Number(serviceChargeRate),
      enableQris,
      enableBankTransfer,
      enableCash,
    });
    setLoading(false);
    if (res.success) {
      alert("Pengaturan berhasil disimpan ke Database!");
    } else {
      alert("Gagal menyimpan pengaturan: " + res.error);
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
          { key: "users", label: "👥 Pengguna" },
          { key: "payment", label: "💳 Pajak & Pembayaran" },
          { key: "receipt", label: "🧾 Struk Kasir" },
          { key: "audit", label: "📋 Audit Log" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.key
                ? "bg-orange-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
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

            {/* Logo Upload */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Logo Bisnis (Emoji / Simbol)</label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="text"
                  maxLength={2}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-3xl shadow-md border-none text-center text-white focus:outline-none"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
                <div className="flex-1">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Masukkan Emoji atau Ikon Text</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Maksimal 2 karakter</p>
                  </div>
                </div>
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
          </div>

          {/* Brand Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Preview Branding</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="h-12 flex items-center px-4 border-b border-slate-200 dark:border-slate-700 justify-between bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {logo}
                  </div>
                  <span className="text-xs font-bold dark:text-slate-150">{businessName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-200" />
                  <div className="w-12 h-3 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-[200px] p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-750 text-center shadow-sm">
                  <p className="text-xs text-slate-500">Preview Button</p>
                  <button
                    className="mt-3 w-full py-2 px-4 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Button Utama
                  </button>
                  <button
                    className="mt-2 w-full py-2 px-4 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 border"
                    style={{ borderColor: secondaryColor, color: secondaryColor }}
                  >
                    Button Sekunder
                  </button>
                </div>
              </div>
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
