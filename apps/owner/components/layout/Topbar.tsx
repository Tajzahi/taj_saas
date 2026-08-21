/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: LAYOUT TOPBAR HEADER GLOBAL (OWNER APP)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini adalah Bilah Navigasi Atas (Topbar Header) untuk Aplikasi Owner.
 * Menyediakan Filter Cabang Global, Filter Rentang Tanggal, Lonceng Notifikasi Real-Time
 * (terhubung ke `schema.approvals`), Toggle Mode Gelap/Terang, dan Menu Profil Pengguna.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. FETCH DATA (Baris 120-150)  : Ambil cabang (`getBranchesAction`) & notifikasi (`getApprovalsAction`).
 * 2. SYNC FILTER (Baris 220-250) : Sinkronisasi `selectedBranchId` & `dateRange` ke `useOwnerStore`.
 * 3. NOTIF MODAL (Baris 490-540) : Menampilkan pengajuan pending real-time dari DB dengan link ke `/persetujuan`.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/branches.ts`, `apps/owner/app/actions/approvals.ts`
 * - State Store    : `apps/owner/store/ownerStore.ts` (`selectedBranchId`, `dateRange`)
 * =========================================================================================
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { useOwnerStore } from "@/store/ownerStore";
import { getBranchesAction } from "@/app/actions/branches";
import { getApprovalsAction } from "@/app/actions/approvals";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

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
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const fetchBranchesList = () => {
    getBranchesAction().then(res => {
      if (res.success && res.data) {
        setDbBranches(res.data);
      }
    });
  };

  const fetchNotificationsList = () => {
    getApprovalsAction().then(res => {
      if (res.success && res.data) {
        setDbNotifications(res.data);
        const pending = res.data.filter((item: any) => item.status === "pending");
        setUnreadCount(pending.length);
      }
    });
  };

  useEffect(() => {
    setMounted(true);
    fetchBranchesList();
    fetchNotificationsList();

    function handleBranchEvent() {
      fetchBranchesList();
      fetchNotificationsList();
    }

    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("branch-updated", handleBranchEvent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("branch-updated", handleBranchEvent);
    };
  }, [pathname]);

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

  const [tempStartDate, setTempStartDate] = useState(customStartDate || new Date().toISOString().split("T")[0]);
  const [tempEndDate, setTempEndDate] = useState(customEndDate || new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (customStartDate) setTempStartDate(customStartDate);
    if (customEndDate) setTempEndDate(customEndDate);
  }, [customStartDate, customEndDate]);

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
              onChange={(val) => {
                setDateRange(val as any);
                if (val === "custom") {
                  setShowDatePicker(true);
                  setShowNotif(false);
                  setShowProfile(false);
                }
              }}
              options={[
                { value: "today", label: "Hari ini" },
                { value: "week", label: "Minggu ini" },
                { value: "month", label: "Bulan ini" },
                { value: "custom", label: "Kustom" }
              ]}
            />
            
            {dateRange === "custom" && (
              <button
                onClick={() => { setShowDatePicker(true); setShowNotif(false); setShowProfile(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/30 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-100 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{customStartDate && customEndDate ? `${customStartDate} s/d ${customEndDate}` : "Atur Kalender"}</span>
              </button>
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
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full leading-none shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
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
              
              <div className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={onToggleDark}>
                <span>Mode Tampilan</span>
                <button
                  className={`w-9 h-5 rounded-full relative transition-colors ${isDark ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <button
                onClick={() => { setShowProfile(false); router.push("/pengaturan"); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Pengaturan Akun
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Keluar Akun
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
              {dbNotifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-semibold text-slate-500">Tidak ada notifikasi baru</p>
                  <p className="text-xs text-slate-400 mt-1">Semua sistem dan pengajuan berjalan lancar</p>
                </div>
              ) : (
                dbNotifications.slice(0, 5).map((n: any, i: number) => {
                  const isPending = n.status === "pending";
                  return (
                    <div
                      key={n.id || i}
                      onClick={() => {
                        setShowNotif(false);
                        router.push("/persetujuan");
                      }}
                      className={`flex items-start gap-3 p-3 rounded-xl mb-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        isPending ? "bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {n.type === "purchase_order" ? "📦" : n.type === "discount" ? "🏷️" : "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${isPending ? "font-bold text-slate-900 dark:text-slate-100" : "font-medium text-slate-600 dark:text-slate-400"} truncate`}>
                            {n.title}
                          </p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            n.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}>
                            {n.status === "pending" ? "Pending" : n.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          Pemohon: {n.requestedBy || "Kasir Admin"} · Prioritas: {n.priority || "Medium"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center flex-shrink-0 flex items-center gap-2">
              <button 
                onClick={() => {
                  setShowNotif(false);
                  router.push("/persetujuan");
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg py-2 shadow-sm transition-colors"
              >
                Ke Halaman Persetujuan →
              </button>
              <button 
                onClick={() => setShowNotif(false)}
                className="px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg py-2 shadow-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Modern Date Picker Modal Dialog */}
      {showDatePicker && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDatePicker(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md animate-slide-up p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-base font-bold shadow-xs">
                  📅
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Filter Kalender Kustom</h3>
                  <p className="text-xs text-slate-500">Pilih periode tanggal awal & akhir untuk data</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDatePicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-2">Preset Cepat</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const past7 = new Date();
                    past7.setDate(today.getDate() - 7);
                    setTempStartDate(past7.toISOString().split("T")[0]);
                    setTempEndDate(today.toISOString().split("T")[0]);
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-center"
                >
                  7 Hari Terakhir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const past30 = new Date();
                    past30.setDate(today.getDate() - 30);
                    setTempStartDate(past30.toISOString().split("T")[0]);
                    setTempEndDate(today.toISOString().split("T")[0]);
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-center"
                >
                  30 Hari Terakhir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    setTempStartDate(firstDay.toISOString().split("T")[0]);
                    setTempEndDate(today.toISOString().split("T")[0]);
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-center"
                >
                  Bulan Ini
                </button>
              </div>
            </div>

            {/* Native Date Picker Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mulai Tanggal
                </label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowDatePicker(false)}>Batal</Button>
              <Button 
                type="button" 
                variant="primary" 
                className="flex-1" 
                onClick={() => {
                  setCustomDateRange(tempStartDate, tempEndDate);
                  setShowDatePicker(false);
                  toast.success(`Periode ${tempStartDate} s/d ${tempEndDate} berhasil diterapkan!`);
                }}
              >
                Terapkan Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
