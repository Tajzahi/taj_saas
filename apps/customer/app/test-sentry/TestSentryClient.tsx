"use client";

import { useState } from "react";

export default function TestSentryClient() {
  const [serverResult, setServerResult] = useState<string | null>(null);
  const [serverLoading, setServerLoading] = useState(false);

  async function triggerServerError() {
    setServerLoading(true);
    setServerResult(null);
    try {
      const res = await fetch("/api/test-sentry-server");
      const data = await res.json();
      setServerResult(JSON.stringify(data));
    } catch (e) {
      setServerResult("✅ Server error berhasil dikirim ke Sentry!");
    } finally {
      setServerLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #e53e3e, #f97316)" }}>
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sentry Test</h1>
          <p className="text-slate-400 text-sm">Customer App — Port 3000</p>
        </div>

        <div className="space-y-4">
          {/* Client Error Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-1">Client-Side Error</h2>
            <p className="text-xs text-slate-500 mb-4">
              Trigger JavaScript error di browser → harus muncul di Sentry Issues
            </p>
            <button
              onClick={() => {
                throw new Error("Sentry Client-Side Test Error dari Aplikasi Customer!");
              }}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
            >
              🔴 Trigger Client Error
            </button>
          </div>

          {/* Server Error Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-1">Server-Side Error</h2>
            <p className="text-xs text-slate-500 mb-4">
              Trigger error di Next.js API Route → harus muncul di Sentry Issues
            </p>
            <button
              onClick={triggerServerError}
              disabled={serverLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              {serverLoading ? "Memuat..." : "🟣 Trigger Server Error"}
            </button>
            {serverResult && (
              <p className="mt-3 text-xs text-emerald-400 font-medium">{serverResult}</p>
            )}
          </div>

          {/* Status */}
          <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-emerald-400 mb-3">✅ Cara Verifikasi</h2>
            <ol className="space-y-2 text-xs text-slate-400">
              <li>1. Klik salah satu tombol di atas</li>
              <li>2. Buka <span className="text-white font-mono">sentry.io</span></li>
              <li>3. Masuk ke project <span className="text-white font-mono">taj-saas-customer</span></li>
              <li>4. Cek di menu <span className="text-white">Issues</span> — error harus muncul dalam ~1 menit</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
