"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptEmployeeInvitationAction } from "@/app/actions/hr";
import toast from "react-hot-toast";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token undangan tidak ditemukan pada URL.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await acceptEmployeeInvitationAction(token, password);
      if (!res.success) {
        toast.error(res.error || "Gagal menerima undangan.");
        return;
      }

      setSuccess(true);
      toast.success("Akun berhasil dibuat! Silakan login.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <div className="mx-auto w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Aktivasi Akun Karyawan
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">
            Buat kata sandi baru untuk mengaktifkan akun Anda.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-emerald-700 font-medium">
              Akun Anda telah aktif. Mengalihkan ke halaman login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleAccept} className="space-y-4">
            {!token && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Tautan tidak memiliki parameter token yang valid.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                "Mengaktifkan..."
              ) : (
                <>
                  <span>Aktifkan Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
          Memuat formulir undangan...
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
