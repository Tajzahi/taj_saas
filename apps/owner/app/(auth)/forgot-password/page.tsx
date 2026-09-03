"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, KeyRound, Mail, CheckCircle2, ShieldAlert } from "lucide-react";
import { requestPasswordResetAction } from "@/app/actions/authActions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await requestPasswordResetAction(email);
      if (res.success) {
        setSubmitted(true);
        setResponseMsg(res.message || "Permintaan pemulihan akun berhasil dikirim.");
        if (res.role) setUserRole(res.role);
        toast.success("Permintaan berhasil diproses.");
      } else {
        toast.error(res.error || "Gagal memproses permintaan reset password.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-[#8E0E0E] flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Pemulihan Kata Sandi
          </h2>
          <p className="mt-2 text-center text-xs text-gray-600">
            Masukkan alamat email akun bisnis Anda untuk memulihkan akses login.
          </p>
        </div>

        {!submitted ? (
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Terdaftar</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@bisnis.com"
                  className="appearance-none block w-full pl-10 pr-3.5 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-sm"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8E0E0E] disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
              {loading ? "Memproses Permintaan..." : "Kirim Instruksi Pemulihan"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-xl border text-left space-y-2 ${
              userRole === "owner"
                ? "bg-green-50 border-green-200 text-green-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}>
              <div className="flex items-center gap-2">
                {userRole === "owner" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {userRole === "owner" ? "Akun Pemilik (Owner)" : `Akun Staf (${userRole || "Karyawan"})`}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{responseMsg}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-700 underline text-center block pt-1"
            >
              Kirim ulang dengan email lain
            </button>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#8E0E0E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
