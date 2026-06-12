"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { tenantData } from "@/data/mockData";

const defaultAuditLog = [
  { id: "al1", user: "Bambang Wijaya", action: "Menyetujui PO #2841", module: "Persetujuan", timestamp: "22 Des 2024, 10:15", ip: "192.168.1.101" },
  { id: "al2", user: "Andi (BSD)", action: "Update harga menu Martabak Spesial", module: "Menu", timestamp: "22 Des 2024, 09:42", ip: "192.168.2.15" },
  { id: "al3", user: "Sari (Kemang)", action: "Input waste log adonan 2.1kg", module: "Persediaan", timestamp: "22 Des 2024, 09:10", ip: "192.168.3.8" },
  { id: "al4", user: "Bambang Wijaya", action: "Login ke Owner Dashboard", module: "Auth", timestamp: "22 Des 2024, 08:45", ip: "192.168.1.101" },
  { id: "al5", user: "Admin", action: "Tambah cabang baru: Bogor", module: "Cabang", timestamp: "21 Des 2024, 17:30", ip: "10.0.0.5" },
  { id: "al6", user: "Budi (BSD)", action: "Cetak laporan shift sore", module: "Keuangan", timestamp: "21 Des 2024, 16:00", ip: "192.168.2.22" },
];

const defaultUsers = [
  { id: "u1", name: "Bambang Wijaya", email: "bambang@masbambang.id", role: "Owner", cabang: "Semua", status: "active" },
  { id: "u2", name: "Andi Pratama", email: "andi@masbambang.id", role: "Manajer Cabang", cabang: "BSD", status: "active" },
  { id: "u3", name: "Sari Dewi", email: "sari@masbambang.id", role: "Kasir", cabang: "Kemang", status: "active" },
  { id: "u4", name: "Budi Santoso", email: "budi@masbambang.id", role: "Kasir", cabang: "BSD", status: "active" },
  { id: "u5", name: "Hana Sari", email: "hana@masbambang.id", role: "Kasir", cabang: "Sudirman", status: "inactive" },
];

const brandColors = [
  "#f97316", "#ef4444", "#8b5cf6", "#3b82f6", "#22c55e", "#06b6d4", "#eab308", "#ec4899"
];

export default function Pengaturan({
  initialTenantData = null,
  initialAuditLog = [],
  initialUsers = [],
}: {
  initialTenantData?: any;
  initialAuditLog?: any[];
  initialUsers?: any[];
}) {
  const [activeTab, setActiveTab] = useState<"branding" | "users" | "payment" | "audit">("branding");
  
  const activeTenant = initialTenantData || tenantData;
  const auditLog = initialAuditLog.length > 0 ? initialAuditLog : defaultAuditLog;
  const users = initialUsers.length > 0 ? initialUsers : defaultUsers;

  const [primaryColor, setPrimaryColor] = useState(activeTenant.primaryColor || "#f97316");
  const [secondaryColor, setSecondaryColor] = useState(activeTenant.secondaryColor || "#ef4444");
  const [businessName, setBusinessName] = useState(activeTenant.brandName || activeTenant.name || "Taj SaaS");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pengaturan</h2>
          <p className="text-sm text-slate-500 mt-0.5">Konfigurasi tenant, pengguna, dan sistem</p>
        </div>
        <Button variant="primary" size="sm">Simpan Semua Perubahan</Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {([
          { key: "branding", label: "ðŸŽ¨ Branding" },
          { key: "users", label: "ðŸ‘¥ Pengguna" },
          { key: "payment", label: "ðŸ’³ Pajak & Pembayaran" },
          { key: "audit", label: "ðŸ“‹ Audit Log" },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Identitas Bisnis</h3>

            {/* Logo Upload */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Logo Bisnis</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-3xl shadow-md">
                  {activeTenant.branding?.logoUrl || activeTenant.logo || "🥞"}
                </div>
                <div className="flex-1">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Klik atau drag logo di sini</p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, SVG max 2MB</p>
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
              {/* Preview Header */}
              <div className="px-4 py-3 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">
                    {activeTenant.branding?.logoUrl || activeTenant.logo || "🥞"}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{businessName}</p>
                    <p className="text-xs opacity-80">Owner Dashboard</p>
                  </div>
                </div>
              </div>
              {/* Preview Content */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Dashboard aktif</span>
                </div>
                <div
                  className="w-full py-2 rounded-lg text-white text-center text-xs font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Tombol Aksi Utama
                </div>
                <div
                  className="mt-2 w-full py-2 rounded-lg text-center text-xs font-semibold border"
                  style={{ color: primaryColor, borderColor: primaryColor, backgroundColor: `${primaryColor}15` }}
                >
                  Tombol Sekunder
                </div>
                <div className="mt-3 p-2 rounded-lg border-l-4" style={{ borderLeftColor: secondaryColor, backgroundColor: `${secondaryColor}10` }}>
                  <p className="text-xs font-medium" style={{ color: secondaryColor }}>ðŸ’¡ AI Insight Preview</p>
                  <p className="text-xs text-slate-500 mt-0.5">Warna aksen untuk notifikasi & badge</p>
                </div>
              </div>
            </div>
            <Button variant="primary" className="w-full mt-4">Terapkan Branding</Button>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">{users.length} pengguna terdaftar</p>
            <Button variant="primary" size="sm" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }>Undang Pengguna</Button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama", "Email", "Role", "Cabang", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "Owner" ? "brand" : user.role === "Manajer Cabang" ? "info" : "neutral"} size="sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{user.cabang}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === "active" ? "success" : "neutral"}>
                        {user.status === "active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {user.role !== "Owner" && <Button variant="ghost" size="sm">Hapus</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Konfigurasi Pajak</h3>
            <Input label="PPN (%)" defaultValue="11" hint="Pajak Pertambahan Nilai sesuai regulasi Indonesia" />
            <Input label="Service Charge (%)" defaultValue="10" hint="Biaya layanan (opsional)" />
            <Input label="NPWP Bisnis" defaultValue="01.234.567.8-901.000" />
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tampilkan pajak di struk</p>
                <p className="text-xs text-slate-500">Rincian pajak akan muncul di setiap struk</p>
              </div>
              <div className="w-11 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Metode Pembayaran</h3>
            {[
              { name: "Cash", icon: "ðŸ’µ", enabled: true },
              { name: "QRIS / GoPay / OVO", icon: "ðŸ“±", enabled: true },
              { name: "Transfer Bank", icon: "ðŸ¦", enabled: true },
              { name: "Kartu Debit/Kredit", icon: "ðŸ’³", enabled: false },
              { name: "GrabFood Pay", icon: "ðŸš—", enabled: true },
              { name: "ShopeeFood Pay", icon: "ðŸ›’", enabled: true },
            ].map(pm => (
              <div key={pm.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>{pm.icon}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pm.name}</span>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${pm.enabled ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${pm.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">Log aktivitas sistem (30 hari terakhir)</p>
            <Button variant="outline" size="sm">Export Log</Button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Pengguna", "Aksi", "Modul", "Waktu", "IP Address"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-400 flex-shrink-0">
                            {log.user.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{log.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{log.action}</td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" size="sm">{log.module}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



