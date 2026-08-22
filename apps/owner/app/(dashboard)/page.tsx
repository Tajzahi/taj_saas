/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN DASHBOARD UTAMA OVERVIEW (`/`)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Halaman Cockpit Eksekutif Owner yang menampilkan statistik performa bisnis secara real-time.
 * Menyajikan 8 KPI Cards (Omzet, Gross Profit, Modal Bahan, Gaji, Waste, Orders, AOV, Cabang),
 * Grafik Tren Pendapatan, Omzet per Cabang, Tabel Top 10 Menu, dan Sales Heatmap Jam Ramai.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. FETCH DATA (Baris 280-310) : Polling data dari Server Actions (`getRevenueOverviewAction`, `getBranchesAction`, dll).
 * 2. KPI CARDS (Baris 370-470)  : Menampilkan 8 kartu ringkasan keuangan & operasional.
 * 3. GRAFIK (Baris 480-550)     : Recharts AreaChart (Tren Omzet vs Target) & BarChart (Omzet per Cabang).
 * 4. TABEL & HEATMAP (560-680)  : Tabel Top 10 Menu & Visualisasi Matriks Jam Ramai Shift.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/analytics.ts` & `branches.ts`
 * - State Store    : `apps/owner/store/ownerStore.ts` (`dateRange`, `selectedBranchId`)
 * =========================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";
import { CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRupiah, formatPercent, formatChange, formatNumber, getHeatmapColor } from "@/utils/format";
import { getRevenueOverviewAction, getHourlyHeatmapAction, getTopMenusAction } from "@/app/actions/analytics";
import { getBranchesAction } from "@/app/actions/branches";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { useOwnerStore } from "@/store/ownerStore";
import { PageHeader } from "@/components/ui/PageHeader";

type Period = "7d" | "30d" | "90d" | "ytd";

const CABANG_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

// Custom Tooltip
function RevenueTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {entry.name === "Omzet" || entry.name === "Revenue" || entry.name === "Target"
                ? formatRupiah(entry.value, true)
                : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function CabangTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// KPI Card
interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  isPositiveGood?: boolean;
  prefix?: string;
  suffix?: string;
}

function KpiCard({ label, value, change, icon, iconBg, isPositiveGood = true }: KpiCardProps) {
  const isPositive = change > 0;
  const isGood = isPositiveGood ? isPositive : !isPositive;
  const isNeutral = change === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
      <div className="flex items-center justify-end mb-2">
        {!isNeutral && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isGood ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" :
            "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
          }`}>
            <svg className={`w-3 h-3 ${isPositive ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {formatChange(Math.abs(change))}
          </div>
        )}
        {isNeutral && (
          <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">—</span>
        )}
      </div>
      <div>
        <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-1">{value}</p>
        <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate" title={label}>{label}</p>
      </div>
    </div>
  );
}

// AI Insight Card
interface AIInsight {
  type: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
  cabang: string;
  confidence: number;
  action: string;
}

function AIInsightCard({ insight }: { insight: AIInsight }) {
  type InsightType = "opportunity" | "warning" | "forecast" | "alert";
  const typeColors: Record<InsightType, string> = {
    opportunity: "border-l-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10",
    warning: "border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/10",
    forecast: "border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/10",
    alert: "border-l-red-400 bg-red-50/50 dark:bg-red-950/10",
  };

  const impactColors: Record<InsightType, string> = {
    opportunity: "text-emerald-700 dark:text-emerald-400",
    warning: "text-amber-700 dark:text-amber-400",
    forecast: "text-blue-700 dark:text-blue-400",
    alert: "text-red-700 dark:text-red-400",
  };
  const insightType = insight.type as InsightType;

  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 ${typeColors[insightType]} p-3 sm:p-4 flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-lg flex-shrink-0 mt-0.5">{insight.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">{insight.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${impactColors[insightType]}`}>{insight.impact}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">{insight.cabang}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: `${insight.confidence}%` }} />
            </div>
            <span className="text-xs text-slate-400">{insight.confidence}%</span>
          </div>
          <button className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline whitespace-nowrap">
            {insight.action} →
          </button>
        </div>
      </div>
    </div>
  );
}

// Heatmap Days & Hours
const HEATMAP_DAYS = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HEATMAP_HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Mapping short day from mockData to full Indonesian day name
const dayMapping: Record<string, string> = {
  "Min": "Ahad",
  "Sen": "Senin",
  "Sel": "Selasa",
  "Rab": "Rabu",
  "Kam": "Kamis",
  "Jum": "Jumat",
  "Sab": "Sabtu",
};

function SalesHeatmap({ heatmapData }: { heatmapData: { matrix?: Record<string, Record<string, number>>; operatingHours?: string[]; isShiftRecorded?: boolean } }) {
  const matrix = heatmapData?.matrix || {};
  const operatingHours = heatmapData?.operatingHours || ["16", "17", "18", "19", "20", "21", "22", "23", "00", "01"];

  const getOrderCount = (day: string, hourStr: string) => {
    if (!matrix || !matrix[day]) return 0;
    return matrix[day][hourStr] || 0;
  };

  const allValues: number[] = [];
  operatingHours.forEach(h => {
    HEATMAP_DAYS.forEach(d => {
      allValues.push(getOrderCount(d, h));
    });
  });
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Days headers on top */}
        <div className="flex items-center gap-1 mb-1 ml-16">
          {HEATMAP_DAYS.map(day => (
            <div key={day} className="flex-1 text-center text-xs text-slate-500 font-semibold py-1">{day}</div>
          ))}
        </div>
        {/* Rows: Operational Shift Hours Only */}
        {operatingHours.map(hour => (
          <div key={hour} className="flex items-center gap-1 mb-1">
            {/* Hours label on the left */}
            <div className="w-14 text-xs font-semibold text-slate-400 text-right pr-2 select-none">{hour}.00</div>
            {HEATMAP_DAYS.map(day => {
              const val = getOrderCount(day, hour);
              const colorClass = getHeatmapColor(val, maxVal);
              return (
                <div
                  key={day}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-semibold transition-all cursor-default ${colorClass}`}
                  title={`${day} pukul ${hour}.00 — ${val} order (Jam Toko Buka)`}
                >
                  {val > 0 ? val : "-"}
                </div>
              );
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 ml-16">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sepi</span>
            {["bg-orange-50", "bg-orange-100", "bg-orange-200", "bg-orange-400", "bg-orange-600"].map((c, i) => (
              <div key={i} className={`w-6 h-3 rounded ${c} border border-slate-200`} />
            ))}
            <span className="text-xs text-slate-400">Ramai</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium italic">
            * Menampilkan jam operasional buka-tutup shift kasir
          </span>
        </div>
      </div>
    </div>
  );
}

// MAIN COMPONENT
export default function ExecutiveCockpit() {
  const { dateRange, selectedBranchId, customStartDate, customEndDate } = useOwnerStore();
  const [liveData, setLiveData] = useState<any>(null);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [topMenusList, setTopMenusList] = useState<any[]>([]);
  const [heatmapMatrix, setHeatmapMatrix] = useState<any>({});
  
  // Map global store dates to existing mock data period types
  const periodMap: Record<string, Period> = {
    today: "7d",
    week: "7d",
    month: "30d",
    custom: "ytd"
  };
  const period = periodMap[dateRange] || "7d";

  useEffect(() => {
    const loadDashboardData = () => {
      if (document.visibilityState !== "visible") return;
      const targetBranch = selectedBranchId && selectedBranchId !== "all" ? selectedBranchId : undefined;
      const dRange = dateRange || undefined;
      const cStart = customStartDate || undefined;
      const cEnd = customEndDate || undefined;
      getRevenueOverviewAction(dRange, cStart, cEnd, targetBranch).then(res => {
        if (res.success) setLiveData(res.data);
      });
      getHourlyHeatmapAction(dRange, cStart, cEnd, targetBranch).then(res => {
        if (res.success && res.data) setHeatmapMatrix(res.data);
      });
      getBranchesAction().then(res => {
        if (res.success && res.data) {
          setBranchesList(res.data);
        }
      });
      getTopMenusAction(dRange, cStart, cEnd, targetBranch).then(res => {
        if (res.success && res.data) {
          setTopMenusList(res.data);
        }
      });
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    window.addEventListener("focus", loadDashboardData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadDashboardData);
    };
  }, [dateRange, customStartDate, customEndDate, selectedBranchId]);

  const revenueValue = liveData ? liveData.totalRevenue : 0;
  const ordersValue = liveData ? liveData.orderCount : 0;
  const aovValue = liveData ? liveData.aov : 0;
  const grossMarginValue = liveData ? liveData.grossProfitMargin : 0;
  const cogsValue = liveData ? (liveData.cogsPercentage || 0) : 0;
  const laborValue = liveData ? (liveData.laborPercentage || 0) : 0;
  const wasteValue = liveData ? (liveData.wastePercentage || 0) : 0;

  // Render chartData directly from live database trend or zero-state trend
  const chartData = liveData?.trend && liveData.trend.length > 0
    ? liveData.trend
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ date: d, revenue: 0 }));

  const activeBranchCount = branchesList.filter(b => b.status === "active").length;
  const totalBranchCount = branchesList.length;
  const branchChartData = branchesList.map(b => ({
    name: b.name,
    revenue: b.revenue || 0,
    target: b.revenue ? Math.round(b.revenue * 1.2) : 10000000,
  }));

  const getPeriodLabel = () => {
    switch (dateRange) {
      case "today":
        return "Hari ini";
      case "week":
        return "Minggu ini";
      case "month":
        return "Bulan ini";
      case "custom":
        if (customStartDate && customEndDate) {
          return `${customStartDate} - ${customEndDate}`;
        }
        return "Rentang Kustom";
      default:
        return "Bulan ini";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader 
        title="Dashboard Laporan" 
        subtitle="Ringkasan performa bisnis secara real-time"
        actions={
          <>
            <ExportDropdown 
              data={branchChartData}
              columns={["Cabang", "City", "Revenue", "Target", "Orders"]}
              filename="laporan_performa_cabang"
              title="Laporan Performa Cabang"
              pdfDataMapper={(item) => [item.name, item.city || "-", item.revenue, item.target || 0, item.orders || 0]}
            />
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <KpiCard
          label="Total Pendapatan"
          value={formatRupiah(revenueValue, true)}
          change={0}
          isPositiveGood={true}
          iconBg="bg-orange-100 dark:bg-orange-950/30"
          icon={
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Persentase Laba Kotor"
          value={formatPercent(grossMarginValue)}
          change={0}
          isPositiveGood={true}
          iconBg="bg-emerald-100 dark:bg-emerald-950/30"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <KpiCard
          label="Modal Bahan Baku"
          value={formatPercent(cogsValue)}
          change={0}
          isPositiveGood={false}
          iconBg="bg-amber-100 dark:bg-amber-950/30"
          icon={
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Gaji Pegawai"
          value={formatPercent(laborValue)}
          change={0}
          isPositiveGood={false}
          iconBg="bg-blue-100 dark:bg-blue-950/30"
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Bahan Terbuang"
          value={formatPercent(wasteValue)}
          change={0}
          isPositiveGood={false}
          iconBg="bg-red-100 dark:bg-red-950/30"
          icon={
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        />
        <KpiCard
          label="Total Pesanan"
          value={formatNumber(ordersValue)}
          change={0}
          isPositiveGood={true}
          iconBg="bg-purple-100 dark:bg-purple-950/30"
          icon={
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <KpiCard
          label="Rata-rata Belanja Pelanggan"
          value={formatRupiah(aovValue)}
          change={0}
          isPositiveGood={true}
          iconBg="bg-indigo-100 dark:bg-indigo-950/30"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <KpiCard
          label="Cabang Aktif"
          value={`${activeBranchCount}/${totalBranchCount}`}
          change={0}
          isPositiveGood={true}
          iconBg="bg-teal-100 dark:bg-teal-950/30"
          icon={
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Revenue Trend + Cabang Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren Pendapatan</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedBranchId ? `Cabang yang dipilih` : `Total semua cabang`}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={period === "7d" ? 0 : period === "30d" ? 4 : 11}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatRupiah(v, true)}
                width={60}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Area type="monotone" dataKey="revenue" name="Omzet" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#targetGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Cabang */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
          <CardHeader title="omzet per cabang" subtitle="Bulan ini" />
          {branchChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={branchChartData} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={52} />
                <Tooltip content={<CabangTooltip />} />
                <Bar dataKey="revenue" name="Omzet" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {branchChartData.map((_, index) => (
                    <Cell key={index} fill={CABANG_COLORS[index % CABANG_COLORS.length]} />
                  ))}
                </Bar>
                <Bar dataKey="target" name="Target" radius={[0, 4, 4, 0]} maxBarSize={18} fill="#e2e8f0" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs text-slate-400 font-medium">
              Belum ada data cabang terdaftar
            </div>
          )}
        </div>
      </div>

      {/* Top Menu + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Top Menu Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top 10 Menu</h3>
              <p className="text-xs text-slate-500 mt-0.5">Berdasarkan omzet & margin</p>
            </div>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-400 pb-2 pr-3">#</th>
                  <th className="text-left text-xs font-semibold text-slate-400 pb-2">Menu</th>
                  <th className="text-right text-xs font-semibold text-slate-400 pb-2">Omzet</th>
                  <th className="text-right text-xs font-semibold text-slate-400 pb-2">Margin</th>
                  <th className="text-center text-xs font-semibold text-slate-400 pb-2">Tipe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {topMenusList.length > 0 ? (
                  topMenusList.map((menu, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group animate-fade-in">
                      <td className="py-2.5 pr-3 text-xs font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</td>
                      <td className="py-2.5">
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{menu.name}</p>
                          <p className="text-xs text-slate-400">{menu.totalQty || 0} terjual</p>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatRupiah(menu.totalRevenue, true)}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="text-xs font-semibold text-emerald-600">
                          {formatPercent(menu.marginPercent || 70)}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <Badge variant="success">⭐ Star</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      Belum ada data penjualan menu saat ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Jam Ramai Penjualan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Jumlah order per jam & hari</p>
            </div>
            <Badge variant="info" size="sm">7 Hari Terakhir</Badge>
          </div>
          <SalesHeatmap heatmapData={heatmapMatrix} />
        </div>
      </div>

      {/* AI Insights + Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* AI Insights
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Insights</h3>
                <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Rekomendasi berbasis data real-time</p>
            </div>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
        */}

        {/* Critical Alerts + Branch Status */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Critical Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Peringatan Kritis</h3>
              <Badge variant="success" size="sm">0 Aktif</Badge>
            </div>
            <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ Sistem Berjalan Normal</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tidak ada peringatan kritis atau pengajuan tertunda saat ini.</p>
            </div>
          </div>

          {/* Branch Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Status Cabang</h3>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {branchesList.length > 0 ? (
                branchesList.map((cabang) => (
                  <div key={cabang.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cabang.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{cabang.name}</p>
                        <p className="text-xs text-slate-400">{cabang.city || "Pusat"}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatRupiah(cabang.revenue || 0, true)}</p>
                      <p className="text-xs text-slate-400">{cabang.orders || 0} order</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Belum ada cabang fisik terdaftar di database.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
