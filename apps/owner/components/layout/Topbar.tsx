"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { useOwnerStore } from "@/store/ownerStore";
import { getBranchesAction } from "@/app/actions/branches";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  cockpit: { title: "Dashboard Laporan", subtitle: "Ringkasan performa bisnis secara real-time" },
  cabang: { title: "Cabang", subtitle: "Kelola dan pantau semua cabang" },
  menu: { title: "Menu & Resep", subtitle: "Master menu, BOM, dan engineering" },
  persediaan: { title: "Persediaan", subtitle: "Manajemen stok dan waste log" },
  keuangan: { title: "Keuangan", subtitle: "P&L, arus kas, dan rekonsiliasi" },
  produksi: { title: "Produksi", subtitle: "Rencana harian dan laporan yield" },
  penjualan: { title: "Penjualan & Analitik", subtitle: "Analisis penjualan mendalam" },
  sdm: { title: "SDM & Karyawan", subtitle: "Manajemen karyawan dan jadwal" },
  persetujuan: { title: "Persetujuan", subtitle: "PO, diskon, refund menunggu persetujuan" },
  ai: { title: "AI Insights", subtitle: "Prediksi cerdas dan rekomendasi AI" },
  pengaturan: { title: "Pengaturan", subtitle: "Konfigurasi tenant dan sistem" },
};

interface TopbarProps {
  onToggleSidebar: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  sidebarCollapsed: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  maxItems?: number;
  compact?: boolean;
}

function CustomSelect({ value, onChange, options, placeholder, maxItems, compact }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const dropdownMaxHeight = maxItems ? `${maxItems * 32 + 12}px` : undefined;

  return (
    <div className={`relative ${compact ? "w-auto min-w-[125px]" : "w-full"}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:border-orange-500/70 dark:hover:border-orange-500/50 ${
          compact ? "px-3 py-1.5 text-xs font-semibold" : "px-3.5 py-3 text-sm font-medium"
        } ${
          isOpen ? "border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-500" : "border-slate-200 dark:border-slate-700"
        }`}
      >
        <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-orange-500/30 dark:border-orange-500/40 rounded-xl shadow-xl z-[110] overflow-y-auto animate-slide-up p-1.5 min-w-[140px]"
          style={dropdownMaxHeight ? { maxHeight: dropdownMaxHeight } : { maxHeight: "240px" }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                opt.value === value
                  ? "bg-orange-500 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onToggleSidebar, isDark, onToggleDark, sidebarCollapsed }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [dbBranches, setDbBranches] = useState<any[]>([]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    getBranchesAction().then(res => {
      if (res.success && res.data) {
        setDbBranches(res.data);
      }
    });
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showMobileFilter || showNotif) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileFilter, showNotif]);

  const { selectedBranchId, setSelectedBranchId, dateRange, setDateRange, customStartDate, customEndDate, setCustomDateRange } = useOwnerStore();

  const user = mounted ? session?.user : null;
  const userName = user?.name || user?.email || "Owner";
  const userEmail = user?.email || "owner@taj.saas";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Determine active title based on current segment
  let activePage = "cockpit";
  if (pathname !== "/") {
    const segment = pathname.split("/")[1];
    if (segment === "ai") {
      activePage = "ai";
    } else {
      activePage = segment || "cockpit";
    }
  }

  const pageInfo = pageTitles[activePage] || { title: "Dashboard", subtitle: "Overview" };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <>
      <header className={`fixed top-0 right-0 z-20 flex h-14 sm:h-16 items-center border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300 px-3 sm:px-4 gap-2 sm:gap-4
        ${sidebarCollapsed ? "lg:left-16" : "lg:left-64"} left-0`}>

      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">{pageInfo.title}</h1>
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">{pageInfo.subtitle}</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">

        {/* Global Filters */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Branch Filter */}
          <CustomSelect
            compact
            value={selectedBranchId || "all"}
            onChange={(val) => setSelectedBranchId(val === "all" ? null : val)}
            options={[
              { value: "all", label: "Semua Cabang" },
              ...dbBranches.map(c => ({ value: c.id, label: c.name }))
            ]}
          />

          {/* Date Filter */}
          <div className="flex items-center gap-1">
            <CustomSelect
              compact
              value={dateRange}
              onChange={(val) => setDateRange(val as any)}
              options={[
                { value: "today", label: "Hari ini" },
                { value: "week", label: "Minggu ini" },
                { value: "month", label: "Bulan ini" },
                { value: "custom", label: "Kustom" }
              ]}
            />
            
            {dateRange === "custom" && (
              <div ref={datePickerRef} className="relative">
                <button
                  onClick={() => { setShowDatePicker(!showDatePicker); setShowNotif(false); setShowProfile(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {customStartDate && customEndDate 
                    ? `${customStartDate} - ${customEndDate}`
                    : "Pilih Tanggal"}
                </button>

                {showDatePicker && (
                  <div className="absolute right-0 top-11 w-[300px] sm:w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-up p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Rentang Tanggal</h4>
                      <p className="text-xs text-slate-500">Tentukan periode data secara kustom</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mulai Tanggal</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 15 Juni 2026"
                          value={customStartDate || ""}
                          onChange={(e) => setCustomDateRange(e.target.value, customEndDate)}
                          className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sampai Tanggal</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 20 Juni 2026"
                          value={customEndDate || ""}
                          onChange={(e) => setCustomDateRange(customStartDate, e.target.value)}
                          className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-200 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => setShowDatePicker(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={() => setShowDatePicker(false)}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Button 
        <button
          onClick={() => router.push("/ai")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:from-orange-600 hover:to-amber-500 transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
          </svg>
          AI Chat
        </button>
        */}

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title="Filter Data"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); setShowDatePicker(false); }}
            className="relative p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-5 sm:h-5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
          </button>
          {/* Notification dropdown has been moved to a Modal */}
        </div>

        {/* User Avatar */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); setShowDatePicker(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-xs font-bold">
              {userInitials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{userName.split(" ")[0]} {userName.split(" ")[1]?.[0] || ""}.</p>
              <p className="text-xs text-slate-500">Owner</p>
            </div>
          </button>
          {showProfile && (
            <div className="absolute -right-2 sm:right-0 top-11 w-[260px] sm:w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
              
              <div className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={onToggleDark}>
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{isDark ? '🌙' : '☀️'}</span>
                  <span>Mode</span>
                </div>
                <button
                  className={`w-9 h-5 rounded-full relative transition-colors ${isDark ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button
                onClick={() => { setShowProfile(false); router.push("/pengaturan"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>⚙️</span>
                Pengaturan
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <span>🚪</span>
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
       {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMobileFilter(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md animate-slide-up p-6 overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Filter Data</h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-5">
              {/* Branch Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">Cabang</label>
                <CustomSelect
                  value={selectedBranchId || "all"}
                  onChange={(val) => setSelectedBranchId(val === "all" ? null : val)}
                  options={[
                    { value: "all", label: "Semua Cabang" },
                    ...dbBranches.map(c => ({ value: c.id, label: c.name }))
                  ]}
                  maxItems={4}
                />
              </div>
 
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">Rentang Waktu</label>
                <CustomSelect
                  value={dateRange}
                  onChange={(val) => setDateRange(val as any)}
                  options={[
                    { value: "today", label: "Hari ini" },
                    { value: "week", label: "Minggu ini" },
                    { value: "month", label: "Bulan ini" },
                    { value: "custom", label: "Kustom" }
                  ]}
                  maxItems={2}
                />
              </div>

              {/* Custom Date Picker (in Modal) */}
              {dateRange === "custom" && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Mulai Tanggal</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 15 Juni 2026"
                      value={customStartDate || ""}
                      onChange={(e) => setCustomDateRange(e.target.value, customEndDate)}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Sampai Tanggal</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 20 Juni 2026"
                      value={customEndDate || ""}
                      onChange={(e) => setCustomDateRange(customStartDate, e.target.value)}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setShowMobileFilter(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg py-2.5 shadow-sm transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotif && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setShowNotif(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm animate-slide-up flex flex-col border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Notifikasi</h3>
                <span className="text-xs text-orange-600 hover:text-orange-700 cursor-pointer font-medium transition-colors">Tandai semua dibaca</span>
              </div>
              <button onClick={() => setShowNotif(false)} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto flex-1 p-2">
              {[
                { icon: "🚨", title: "Stok Minyak Goreng Habis", desc: "Cabang Demak · 10 menit lalu", unread: true },
                { icon: "✅", title: "4 PO Menunggu Persetujuan", desc: "Head Office · 25 menit lalu", unread: true },
                { icon: "📊", title: "Laporan Harian Siap", desc: "Semua Cabang · 1 jam lalu", unread: false },
                { icon: "💬", title: "AI: Insight baru tersedia", desc: "Cabang Demak · 2 jam lalu", unread: false },
              ].map((n, i) => (
                <div key={i} className={`flex items-start gap-4 px-4 py-3.5 rounded-lg mb-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${n.unread ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}>
                  <span className="text-2xl flex-shrink-0 bg-white dark:bg-slate-800 w-10 h-10 flex items-center justify-center rounded-full shadow-sm border border-slate-100 dark:border-slate-700">{n.icon}</span>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-sm text-slate-900 dark:text-slate-100 ${n.unread ? "font-bold" : "font-medium"}`}>{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                  </div>
                  {n.unread && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm" />}
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center flex-shrink-0">
              <button 
                onClick={() => setShowNotif(false)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg py-2.5 shadow-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
