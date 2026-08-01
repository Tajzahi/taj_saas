"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/utils/format";
import { getRevenueOverviewAction } from "@/app/actions/analytics";

// Sample AI insights — akan digantikan dengan real AI API di masa depan
interface AIInsightItem {
  id: string;
  type: "opportunity" | "warning" | "forecast" | "alert";
  icon: string;
  title: string;
  description: string;
  impact: string;
  cabang: string;
  confidence: number;
  action: string;
}

const aiInsights: AIInsightItem[] = [
  { id: "ai-1", type: "opportunity", icon: "🎯", title: "Peluang Upselling Menu Premium", description: "Berdasarkan pola order, 68% pelanggan yang memesan Martabak Keju Susu berpotensi upgrade ke paket premium jika ditawarkan saat checkout.", impact: "+Rp 2.1jt/minggu", cabang: "Semua Cabang", confidence: 87, action: "Aktifkan Upselling" },
  { id: "ai-2", type: "warning", icon: "⚠️", title: "Food Cost Meningkat 3.2%", description: "Food cost bulan ini 33.2% — di atas target 30%. Penyebab utama: kenaikan harga tepung (+12%) dan overporsi di jam malam.", impact: "-Rp 1.8jt margin", cabang: "Semua Cabang", confidence: 92, action: "Lihat Detail" },
  { id: "ai-3", type: "forecast", icon: "📈", title: "Prediksi Lonjakan Weekend", description: "Model ML memperkirakan kenaikan order 40-55% akhir pekan ini berdasarkan histori dan tren media sosial lokal.", impact: "+45% order", cabang: "Semua Cabang", confidence: 78, action: "Siapkan Stok" },
];

// Sample forecast — akan digantikan dengan prediksi ML real
const forecastData = [
  { date: "Hari ini", actual: null, forecast: null, upper: null, lower: null },
  { date: "Besok", actual: null, forecast: 8200000, upper: 9100000, lower: 7300000 },
  { date: "+2 Hari", actual: null, forecast: 9100000, upper: 10200000, lower: 8000000 },
  { date: "+3 Hari", actual: null, forecast: 11500000, upper: 12800000, lower: 10200000 },
  { date: "+4 Hari", actual: null, forecast: 10800000, upper: 12000000, lower: 9600000 },
  { date: "+5 Hari", actual: null, forecast: 9600000, upper: 10700000, lower: 8500000 },
  { date: "+6 Hari", actual: null, forecast: 13200000, upper: 14700000, lower: 11700000 },
];

const chatMessages = [
  { role: "ai", content: "Halo! Saya TajAI, asisten bisnis Anda. Ada yang bisa saya bantu analisis hari ini? 🤖" },
  { role: "user", content: "Kenapa food cost bisa meningkat bulan ini?" },
  { role: "ai", content: "Berdasarkan data 30 hari terakhir, food cost naik 3.2% dari target. Ada 3 faktor utama:\n\n1. 📊 Kenaikan harga bahan baku tepung +12% dari supplier\n2. ⚖️ Porsi tidak konsisten — rata-rata berat per porsi 8% di atas standar BOM\n3. 🛒 Pembelian mendadak 3x bulan ini dengan harga non-kontrak\n\nSaran: Negosiasi ulang kontrak supplier dan aktifkan reminder standar porsi untuk kasir." },
];

function ForecastTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          entry.value !== null && (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
            </div>
          )
        ))}
      </div>
    );
  }
  return null;
}

export default function AIInsights() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [costReduction, setCostReduction] = useState(0);
  const [volumeChange, setVolumeChange] = useState(0);

  const [baseRevenue, setBaseRevenue] = useState(0);
  const [baseCost, setBaseCost] = useState(0);

  useEffect(() => {
    getRevenueOverviewAction("30d").then(res => {
      if (res.success && res.data) {
        const rev = res.data.totalRevenue || 0;
        setBaseRevenue(rev);
        setBaseCost(Math.round(rev * 0.30)); // estimasi HPP 30%
      }
    });
  }, []);

  const baseProfit = baseRevenue - baseCost;
  const simRevenue = baseRevenue * (1 + priceIncrease / 100) * (1 + volumeChange / 100);
  const simCost = baseCost * (1 - costReduction / 100);
  const simProfit = simRevenue - simCost;
  const profitChange = baseProfit > 0 ? ((simProfit - baseProfit) / baseProfit) * 100 : 0;

  function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        role: "ai",
        content: `Analisis untuk "${userMsg.content}":\n\nBerdasarkan data historis 90 hari terakhir, saya menemukan beberapa pola menarik. Omzet tertinggi terjadi pada hari Sabtu-Minggu pukul 18:00-21:00. Menu Martabak Keju Susu memiliki margin tertinggi (67.3%) namun volume penjualan masih bisa ditingkatkan 25% dengan strategi bundling yang tepat.\n\nApakah Anda ingin melihat detail lebih lanjut? 📊`,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Insights & Forecasting</h2>
            <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              Powered by TajAI
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Prediksi demand, simulasi, dan chat AI</p>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">📊 Insight Terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {aiInsights.map((insight) => {
            const colors: Record<string, string> = {
              opportunity: "border-l-emerald-400",
              warning: "border-l-amber-400",
              forecast: "border-l-blue-400",
              alert: "border-l-red-400",
            };
            const bgColors: Record<string, string> = {
              opportunity: "bg-emerald-50/50 dark:bg-emerald-950/10",
              warning: "bg-amber-50/50 dark:bg-amber-950/10",
              forecast: "bg-blue-50/50 dark:bg-blue-950/10",
              alert: "bg-red-50/50 dark:bg-red-950/10",
            };
            return (
              <div key={insight.id} className={`rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 ${colors[insight.type]} ${bgColors[insight.type]} p-4`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl flex-shrink-0">{insight.icon}</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{insight.title}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400">{insight.impact}</p>
                    <p className="text-xs text-slate-400">{insight.cabang}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${insight.confidence}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{insight.confidence}%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">{insight.action} →</Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast Chart + What-If */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Forecast */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Prediksi Omzet 7 Hari ke Depan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Model ML berbasis data historis + faktor eksternal</p>
            </div>
            <Badge variant="brand" size="sm">🤖 AI Forecast</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={forecastData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
              <Tooltip content={<ForecastTooltip />} />
              <Area type="monotone" dataKey="upper" name="Batas Atas" stroke="none" fill="#eff6ff" fillOpacity={1} />
              <Area type="monotone" dataKey="lower" name="Batas Bawah" stroke="none" fill="white" fillOpacity={1} />
              <Area type="monotone" dataKey="forecast" name="Prediksi" stroke="#3b82f6" strokeWidth={2.5} fill="url(#forecastGrad)" strokeDasharray="5 3" dot={{ r: 4, fill: "#3b82f6" }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 bg-blue-400 bg-dashed" style={{ backgroundImage: "repeating-linear-gradient(to right, #60a5fa, #60a5fa 4px, transparent 4px, transparent 8px)" }} />
              <span>Prediksi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800" />
              <span>Interval Kepercayaan 80%</span>
            </div>
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🧪</span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Simulator What-If</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Naik Harga (%)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range" min={-20} max={30} step={1}
                  value={priceIncrease}
                  onChange={(e) => setPriceIncrease(Number(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-right">{priceIncrease > 0 ? "+" : ""}{priceIncrease}%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Kurangi Biaya (%)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range" min={0} max={20} step={1}
                  value={costReduction}
                  onChange={(e) => setCostReduction(Number(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-right">-{costReduction}%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Perubahan Volume (%)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range" min={-30} max={50} step={1}
                  value={volumeChange}
                  onChange={(e) => setVolumeChange(Number(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-right">{volumeChange > 0 ? "+" : ""}{volumeChange}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/30">
            <p className="text-xs text-slate-500 mb-3">Simulasi Profit (Des 2024)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Baseline</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{formatRupiah(baseProfit, true)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Simulasi</p>
                <p className={`text-base font-bold ${simProfit > baseProfit ? "text-emerald-600" : "text-red-600"}`}>
                  {formatRupiah(simProfit, true)}
                </p>
              </div>
            </div>
            <div className={`mt-3 p-2 rounded-lg ${profitChange >= 0 ? "bg-emerald-100 dark:bg-emerald-950/30" : "bg-red-100 dark:bg-red-950/30"}`}>
              <p className={`text-sm font-bold text-center ${profitChange >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {profitChange >= 0 ? "+" : ""}{profitChange.toFixed(1)}% perubahan profit
              </p>
            </div>
            <Button variant="primary" size="sm" className="w-full mt-3">Simpan Skenario</Button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
        <span className="text-3xl mb-3 block">🤖</span>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">TajAI Assistant Dinonaktifkan</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Fitur asisten interaktif TajAI dinonaktifkan sementara atas permintaan Owner.
        </p>
      </div>
    </div>
  );
}
