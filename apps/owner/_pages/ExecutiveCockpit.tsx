"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";
import { CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  kpiSummary, revenueTrend7d, revenueTrend30d, revenueTrend90d,
  menuList, revenueByCabang, hourlyHeatmap, aiInsights, criticalAlerts, cabangList
} from "@/data/mockData";
import { formatRupiah, formatPercent, formatChange, formatNumber, getHeatmapColor } from "@/utils/format";

type Period = "7d" | "30d" | "90d" | "ytd";

const periodData: Record<Period, typeof revenueTrend7d> = {
  "7d": revenueTrend7d,
  "30d": revenueTrend30d,
  "90d": revenueTrend90d,
  "ytd": revenueTrend30d,
};

const CABANG_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

// ============================================================
// Custom Tooltip
// ============================================================
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
              {entry.name === "Revenue" || entry.name === "Target"
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

// ============================================================
// KPI Card
// ============================================================
interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  period: string;
  icon: React.ReactNode;
  iconBg: string;
  isPositiveGood?: boolean;
  prefix?: string;
  suffix?: string;
}

function KpiCard({ label, value, change, period, icon, iconBg, isPositiveGood = true }: KpiCardProps) {
  const isPositive = change > 0;
  const isGood = isPositiveGood ? isPositive : !isPositive;
  const isNeutral = change === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
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
          <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">â€”</span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{period}</p>
      </div>
    </div>
  );
}

// ============================================================
// AI Insight Card
// ============================================================
function AIInsightCard({ insight }: { insight: typeof aiInsights[0] }) {
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
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 ${typeColors[insightType]} p-4 flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-3">
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
          <span className="text-xs text-slate-400">Â·</span>
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
            {insight.action} â†’
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Heatmap Hours
// ============================================================
const HOURS = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];

function SalesHeatmap() {
  const allValues = hourlyHeatmap.flatMap(row =>
    HOURS.map(h => (row as any)[`h${h}`] as number)
  );
  const maxVal = Math.max(...allValues);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px]">
        {/* Hour headers */}
        <div className="flex items-center gap-1 mb-1 ml-10">
          {HOURS.map(h => (
            <div key={h} className="flex-1 text-center text-xs text-slate-400 font-medium">{h}</div>
          ))}
        </div>
        {/* Rows */}
        {hourlyHeatmap.map((row) => (
          <div key={row.day} className="flex items-center gap-1 mb-1">
            <div className="w-9 text-xs font-medium text-slate-500 text-right pr-2">{row.day}</div>
            {HOURS.map(h => {
              const val = (row as any)[`h${h}`] as number;
              const colorClass = getHeatmapColor(val, maxVal);
              return (
                <div
                  key={h}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all cursor-default ${colorClass}`}
                  title={`${row.day} pukul ${h}.00 â€” ${val} order`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-10">
          <span className="text-xs text-slate-400">Sepi</span>
          {["bg-orange-50", "bg-orange-100", "bg-orange-200", "bg-orange-400", "bg-orange-600"].map((c, i) => (
            <div key={i} className={`w-6 h-3 rounded ${c} border border-slate-200`} />
          ))}
          <span className="text-xs text-slate-400">Ramai</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ExecutiveCockpit() {
  const [period, setPeriod] = useState<Period>("7d");
  const chartData = periodData[period];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* â”€â”€ Header Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Selamat pagi, Pak Bambang ðŸ‘‹
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Senin, 23 Desember 2024 Â· Data diperbarui 2 menit lalu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            Des 2024
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Export
          </Button>
        </div>
      </div>

      {/* â”€â”€ KPI Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-9 gap-3">
        <div className="col-span-2 xl:col-span-2 sm:col-span-4">
          <KpiCard
            label={kpiSummary.totalRevenue.label}
            value={formatRupiah(kpiSummary.totalRevenue.value, true)}
            change={kpiSummary.totalRevenue.change}
            period={kpiSummary.totalRevenue.period}
            isPositiveGood={true}
            iconBg="bg-orange-100 dark:bg-orange-950/30"
            icon={
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.grossMargin.label}
            value={formatPercent(kpiSummary.grossMargin.value)}
            change={kpiSummary.grossMargin.change}
            period={kpiSummary.grossMargin.period}
            isPositiveGood={true}
            iconBg="bg-emerald-100 dark:bg-emerald-950/30"
            icon={
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.foodCost.label}
            value={formatPercent(kpiSummary.foodCost.value)}
            change={kpiSummary.foodCost.change}
            period={kpiSummary.foodCost.period}
            isPositiveGood={false}
            iconBg="bg-amber-100 dark:bg-amber-950/30"
            icon={
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.laborCost.label}
            value={formatPercent(kpiSummary.laborCost.value)}
            change={kpiSummary.laborCost.change}
            period={kpiSummary.laborCost.period}
            isPositiveGood={false}
            iconBg="bg-blue-100 dark:bg-blue-950/30"
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.wastePercent.label}
            value={formatPercent(kpiSummary.wastePercent.value)}
            change={kpiSummary.wastePercent.change}
            period={kpiSummary.wastePercent.period}
            isPositiveGood={false}
            iconBg="bg-red-100 dark:bg-red-950/30"
            icon={
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.totalOrders.label}
            value={formatNumber(kpiSummary.totalOrders.value)}
            change={kpiSummary.totalOrders.change}
            period={kpiSummary.totalOrders.period}
            isPositiveGood={true}
            iconBg="bg-purple-100 dark:bg-purple-950/30"
            icon={
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.aov.label}
            value={formatRupiah(kpiSummary.aov.value)}
            change={kpiSummary.aov.change}
            period={kpiSummary.aov.period}
            isPositiveGood={true}
            iconBg="bg-indigo-100 dark:bg-indigo-950/30"
            icon={
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.activeCabang.label}
            value={`${kpiSummary.activeCabang.value}/5`}
            change={kpiSummary.activeCabang.change}
            period={kpiSummary.activeCabang.period}
            isPositiveGood={true}
            iconBg="bg-teal-100 dark:bg-teal-950/30"
            icon={
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>
      </div>

      {/* â”€â”€ Revenue Trend + Cabang Performance â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren Pendapatan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Total semua cabang</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(["7d", "30d", "90d", "ytd"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {p === "ytd" ? "YTD" : p}
                </button>
              ))}
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
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#targetGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Cabang */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <CardHeader title="Revenue per Cabang" subtitle="Bulan ini" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByCabang} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={52} />
              <Tooltip content={<CabangTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {revenueByCabang.map((_, index) => (
                  <Cell key={index} fill={CABANG_COLORS[index % CABANG_COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Target" radius={[0, 4, 4, 0]} maxBarSize={18} fill="#e2e8f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* â”€â”€ Top Menu + Heatmap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Menu Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top 10 Menu</h3>
              <p className="text-xs text-slate-500 mt-0.5">Berdasarkan revenue & margin</p>
            </div>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-400 pb-2 pr-3">#</th>
                  <th className="text-left text-xs font-semibold text-slate-400 pb-2">Menu</th>
                  <th className="text-right text-xs font-semibold text-slate-400 pb-2">Revenue</th>
                  <th className="text-right text-xs font-semibold text-slate-400 pb-2">Margin</th>
                  <th className="text-center text-xs font-semibold text-slate-400 pb-2">Tipe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {menuList.map((menu, index) => (
                  <tr key={menu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-2.5 pr-3 text-xs font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</td>
                    <td className="py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{menu.name}</p>
                        <p className="text-xs text-slate-400">{menu.category} Â· {menu.soldToday} terjual</p>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatRupiah(menu.revenue, true)}</span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`text-xs font-semibold ${menu.margin >= 68 ? "text-emerald-600" : menu.margin >= 62 ? "text-amber-600" : "text-red-500"}`}>
                        {formatPercent(menu.margin)}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <Badge
                        variant={
                          menu.status === "star" ? "success" :
                          menu.status === "plow-horse" ? "info" :
                          menu.status === "puzzle" ? "warning" : "neutral"
                        }
                      >
                        {menu.status === "star" ? "â­ Star" :
                         menu.status === "plow-horse" ? "ðŸ´ Plough" :
                         menu.status === "puzzle" ? "ðŸ§© Puzzle" : "ðŸ• Dog"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Heatmap Penjualan per Jam</h3>
              <p className="text-xs text-slate-500 mt-0.5">Jumlah order per jam & hari</p>
            </div>
            <Badge variant="info" size="sm">7 Hari Terakhir</Badge>
          </div>
          <SalesHeatmap />
        </div>
      </div>

      {/* â”€â”€ AI Insights + Critical Alerts â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
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

        {/* Critical Alerts + Branch Status */}
        <div className="space-y-4">
          {/* Critical Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Alert Kritis</h3>
              <Badge variant="danger" size="sm">{criticalAlerts.filter(a => a.severity === "critical" || a.severity === "warning").length} aktif</Badge>
            </div>
            <div className="space-y-2.5">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.severity === "critical" ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30" :
                    alert.severity === "warning" ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30" :
                    "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    alert.severity === "critical" ? "bg-red-500" :
                    alert.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.cabang}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                  <button className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline whitespace-nowrap">
                    Tangani
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Status Cabang</h3>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {cabangList.map((cabang) => (
                <div key={cabang.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cabang.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{cabang.name.replace("Cabang ", "")}</p>
                      <p className="text-xs text-slate-400">{cabang.lastSync}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatRupiah(cabang.revenue, true)}</p>
                    <p className="text-xs text-slate-400">{cabang.orders} order</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



