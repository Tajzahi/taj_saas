"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExportDropdown } from "@/components/ui/ExportDropdown";

import { formatRupiah, formatNumber } from "@/utils/format";
import { useOwnerStore } from "@/store/ownerStore";

const CHANNEL_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

const repeatCustomers = [
  { name: "Pelanggan Baru", value: 38, color: "#3b82f6" },
  { name: "Pelanggan Lama", value: 62, color: "#f97316" },
];

const topCustomers = [
  { rank: 1, name: "Budi Santoso", orders: 28, spend: 1260000, lastVisit: "Kemarin" },
  { rank: 2, name: "Ani Wijaya", orders: 24, spend: 1080000, lastVisit: "2 hari lalu" },
  { rank: 3, name: "Sari Pertiwi", orders: 21, spend: 945000, lastVisit: "Hari ini" },
  { rank: 4, name: "Eko Nugroho", orders: 19, spend: 855000, lastVisit: "3 hari lalu" },
  { rank: 5, name: "Dewi Rahayu", orders: 17, spend: 765000, lastVisit: "Kemarin" },
];

const weeklyTrend = [
  { day: "Sen", dineIn: 320000, online: 480000 },
  { day: "Sel", dineIn: 350000, online: 520000 },
  { day: "Rab", dineIn: 280000, online: 420000 },
  { day: "Kam", dineIn: 410000, online: 590000 },
  { day: "Jum", dineIn: 520000, online: 780000 },
  { day: "Sab", dineIn: 680000, online: 920000 },
  { day: "Min", dineIn: 620000, online: 850000 },
];

function SalesTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
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

function TimeTip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Pukul {label}</p>
        <p className="text-xs"><span className="text-slate-500">Order:</span> <span className="font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
}

function ChannelTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{d.channel}</p>
        <p className="text-xs text-slate-500">Share: <span className="font-semibold">{d.value}%</span></p>
        <p className="text-xs text-slate-500">Omzet: <span className="font-semibold">{formatRupiah(d.revenue, true)}</span></p>
      </div>
    );
  }
  return null;
}

import { useEffect } from "react";
import { getRevenueOverviewAction, getTopMenusAction, getSalesByTimeAnalyticsAction, getSalesChannelAnalyticsAction, getTopCustomersAction } from "@/app/actions/analytics";

export default function Penjualan() {
  const [period, setPeriod] = useState<"hari" | "minggu" | "bulan">("minggu");
  const { selectedBranchId } = useOwnerStore();
  const [liveOverview, setLiveOverview] = useState<any>(null);
  const [topMenusData, setTopMenusData] = useState<any[]>([]);
  const [salesByTimeData, setSalesByTimeData] = useState<any[]>([]);
  const [salesChannelData, setSalesChannelData] = useState<any[]>([]);
  const [dbTopCustomers, setDbTopCustomers] = useState<any[]>([]);

  useEffect(() => {
    const loadSalesData = () => {
      if (document.visibilityState !== "visible") return;
      getRevenueOverviewAction("7d").then(res => {
        if (res.success) setLiveOverview(res.data);
      });
      getTopMenusAction().then(res => {
        if (res.success) setTopMenusData(res.data || []);
      });
      getSalesByTimeAnalyticsAction().then(res => {
        if (res.success) setSalesByTimeData(res.data || []);
      });
      getSalesChannelAnalyticsAction().then(res => {
        if (res.success) setSalesChannelData(res.data || []);
      });
      getTopCustomersAction().then(res => {
        if (res.success) setDbTopCustomers(res.data || []);
      });
    };

    loadSalesData();
    const interval = setInterval(loadSalesData, 30000);
    window.addEventListener("focus", loadSalesData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadSalesData);
    };
  }, [period, selectedBranchId]);

  const totalRevenue = liveOverview ? liveOverview.totalRevenue : 0;
  const adjustedTotalOrder = liveOverview ? liveOverview.orderCount : 0;
  const adjustedAOV = liveOverview ? liveOverview.aov : 0;

  const adjustedSalesByChannel = salesChannelData;

  const adjustedWeeklyTrend = liveOverview?.trend && liveOverview.trend.length > 0
    ? liveOverview.trend.map((t: any) => ({
        day: t.date,
        dineIn: Math.round(t.revenue * 0.4),
        online: Math.round(t.revenue * 0.6),
      }))
    : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(day => ({ day, dineIn: 0, online: 0 }));

  const adjustedSalesByTime = salesByTimeData;

  const adjustedMenuList = topMenusData.length > 0
    ? topMenusData.map((m, idx) => ({ id: `top-${idx}`, name: m.name, revenue: m.totalRevenue, totalQty: m.totalQty }))
    : [];

  const adjustedTopCustomers = dbTopCustomers;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Penjualan & Analitik</h2>
          <p className="text-sm text-slate-500 mt-0.5">Analisis mendalam semua channel penjualan</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(["hari", "minggu", "bulan"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  period === p ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
                }`}
              >
                {p === "hari" ? "Hari Ini" : p === "minggu" ? "Minggu Ini" : "Bulan Ini"}
              </button>
            ))}
          </div>
          <ExportDropdown 
            data={adjustedTopCustomers}
            columns={["Rank", "Nama", "Total Order", "Total Spend", "Terakhir Visit"]}
            filename="top_pelanggan"
            title="Top Pelanggan"
            pdfDataMapper={(item) => [item.rank, item.name, item.orders, item.spend, item.lastVisit]}
          />
        </div>
      </div>

      {/* Summary KPIs */}
      {(() => {
        const hasData = totalRevenue > 0 || adjustedTotalOrder > 0;
        const kpiCards = [
          { label: "Total Omzet", value: formatRupiah(totalRevenue, true), icon: "💰", trend: hasData ? "+8.4%" : "0.0%" },
          { label: "Total Order", value: formatNumber(adjustedTotalOrder), icon: "🧾", trend: hasData ? "+12.3%" : "0.0%" },
          { label: "Repeat Rate", value: hasData ? "62%" : "0%", icon: "🔄", trend: hasData ? "+3.1%" : "0.0%" },
          { label: "Avg Order Value", value: formatRupiah(adjustedAOV), icon: "📊", trend: hasData ? "+3.2%" : "0.0%" },
        ];

        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpiCards.map(card => (
              <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{card.icon}</span>
                  {hasData ? (
                    <Badge variant="success" size="sm">{card.trend}</Badge>
                  ) : (
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">0.0%</span>
                  )}
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren Penjualan per Channel</h3>
            <Badge variant="info" size="sm">Minggu ini</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={adjustedWeeklyTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="onlineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
              <Tooltip content={<SalesTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="dineIn" name="Dine-in" stroke="#f97316" strokeWidth={2} fill="url(#dineGrad)" dot={false} />
              <Area type="monotone" dataKey="online" name="Online" stroke="#3b82f6" strokeWidth={2} fill="url(#onlineGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Breakdown Pie */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Breakdown Channel</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={adjustedSalesByChannel}
                dataKey="value"
                nameKey="channel"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={36}
              >
                {adjustedSalesByChannel.map((_, i) => (
                  <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChannelTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {adjustedSalesByChannel.map((c, i) => (
              <div key={c.channel} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[i] }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{c.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.value}%</span>
                  <span className="text-xs text-slate-400">{formatRupiah(c.revenue, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Order Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Volume Order per Jam</h3>
            <Badge variant="neutral" size="sm">Hari Ini</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={adjustedSalesByTime} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip content={<TimeTip />} />
              <Bar dataKey="orders" name="Order" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {adjustedSalesByTime.map((item, i) => (
                  <Cell key={i} fill={item.orders >= 600 ? "#f97316" : item.orders >= 400 ? "#fb923c" : "#fed7aa"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Menu Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top Menu berdasarkan Omzet</h3>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-3">
            {adjustedMenuList.slice(0, 6).map((menu, i) => {
              const maxRevenue = adjustedMenuList[0].revenue;
              const pct = (menu.revenue / maxRevenue) * 100;
              return (
                <div key={menu.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{menu.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2 flex-shrink-0">{formatRupiah(menu.revenue, true)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-7">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top Pelanggan & Repeat Rate</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Repeat rate bulan ini: <span className="font-semibold text-orange-600">62%</span> — ↑3.1% dari bulan lalu
            </p>
          </div>
          <div className="flex items-center gap-2">
            {repeatCustomers.map(c => (
              <div key={c.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-slate-500">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Rank", "Nama", "Total Order", "Total Spend", "Terakhir Visit", ""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adjustedTopCustomers.map((cust) => (
                <tr key={cust.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${cust.rank === 1 ? "bg-amber-400" : cust.rank === 2 ? "bg-slate-400" : cust.rank === 3 ? "bg-orange-400" : "bg-slate-300"}`}>
                      {cust.rank <= 3 ? ["🥇", "🥈", "🥉"][cust.rank - 1] : cust.rank}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800">
                        {cust.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cust.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cust.orders}x</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(cust.spend)}</td>
                  <td className="px-4 py-3"><Badge variant="neutral" size="sm">{cust.lastVisit}</Badge></td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-orange-600 dark:text-orange-400 font-medium hover:underline">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
