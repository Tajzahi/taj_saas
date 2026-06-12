"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { aiInsights, forecastData } from "@/data/mockData";
import { formatRupiah } from "@/utils/format";

const chatMessages = [
  { role: "ai", content: "Halo Pak Bambang! Saya TajAI, asisten bisnis Anda. Ada yang bisa saya bantu analisis hari ini? ðŸ¤–" },
  { role: "user", content: "Kenapa food cost Cabang Bekasi lebih tinggi dari cabang lain?" },
  { role: "ai", content: "Berdasarkan data 30 hari terakhir, food cost Cabang Bekasi 31.5% â€” lebih tinggi 3.7% dari rata-rata. Ada 3 faktor utama:\n\n1. ðŸ“Š Waste adonan martabak rata-rata 2.1 kg/hari (tertinggi di antara semua cabang)\n2. âš–ï¸ Porsi tidak konsisten â€” rata-rata berat per porsi 12% lebih besar dari standar BOM\n3. ðŸ›’ Pembelian bahan tidak terencana (3x dalam bulan ini)\n\nSaran: Lakukan audit porsi minggu ini dan aktifkan reminder produksi untuk kasir Bekasi." },
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

export default function AIInsights({
  initialAiInsights = [],
  initialForecastData = [],
}: {
  initialAiInsights?: any[];
  initialForecastData?: any[];
}) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [costReduction, setCostReduction] = useState(0);
  const [volumeChange, setVolumeChange] = useState(0);

  const activeInsights = initialAiInsights.length > 0 ? initialAiInsights : aiInsights;
  const forecastDataList = initialForecastData.length > 0 ? initialForecastData : forecastData;

  const baseRevenue = 185200000;
  const baseCost = 54834000;
  const baseProfit = baseRevenue - baseCost;
  const simRevenue = baseRevenue * (1 + priceIncrease / 100) * (1 + volumeChange / 100);
  const simCost = baseCost * (1 - costReduction / 100);
  const simProfit = simRevenue - simCost;
  const profitChange = ((simProfit - baseProfit) / baseProfit) * 100;

  function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        role: "ai",
        content: `Analisis untuk "${userMsg.content}":\n\nBerdasarkan data historis 90 hari terakhir, saya menemukan beberapa pola menarik. Revenue tertinggi terjadi pada hari Sabtu-Minggu pukul 18:00-21:00. Menu Martabak Keju Susu memiliki margin tertinggi (67.3%) namun volume penjualan masih bisa ditingkatkan 25% dengan strategi bundling yang tepat.\n\nApakah Anda ingin melihat detail lebih lanjut? ðŸ“Š`,
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
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">ðŸ“Š Insight Terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {activeInsights.map((insight) => {
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
                <Button variant="outline" size="sm" className="w-full mt-3">{insight.action} â†’</Button>
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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Prediksi Revenue 7 Hari ke Depan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Model ML berbasis data historis + faktor eksternal</p>
            </div>
            <Badge variant="brand" size="sm">ðŸ¤– AI Forecast</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={forecastDataList} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
            <span className="text-lg">ðŸ§ª</span>
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
          </div>

          <Button variant="primary" size="sm" className="w-full mt-3">Simpan Skenario</Button>
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-base shadow-sm flex-shrink-0">
            ðŸ¤–
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">TajAI Assistant</p>
            <p className="text-xs text-slate-500">Tanya apa saja tentang bisnis Anda dalam Bahasa Indonesia</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs text-white mr-2 flex-shrink-0 mt-0.5">
                  ðŸ¤–
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-orange-500 text-white rounded-tr-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs text-white">
                ðŸ¤–
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
          {[
            "Kenapa revenue turun?",
            "Menu apa yang harus dihapus?",
            "Prediksi Natal besok?",
            "Food cost Bekasi tinggi?",
          ].map(prompt => (
            <button
              key={prompt}
              onClick={() => setChatInput(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 whitespace-nowrap hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tanya TajAI tentang bisnis Anda..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Button variant="primary" size="md" onClick={handleSend} disabled={!chatInput.trim()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}



