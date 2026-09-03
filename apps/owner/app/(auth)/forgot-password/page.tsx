"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, KeyRound, Mail, CheckCircle2, ShieldAlert, Lock, Eye, EyeOff } from "lucide-react";
import { resetOwnerPasswordDirectAction, requestPasswordResetAction } from "@/app/actions/authActions";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleDirectReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email wajib diisi.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetOwnerPasswordDirectAction({
        email,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setSubmitted(true);
        setSuccessMessage(res.message || "Password akun Owner berhasil di-reset!");
        toast.success("Password berhasil diperbarui!");
      } else {
        toast.error(res.error || "Gagal me-reset password.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan sistem saat me-reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-[#8E0E0E] flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Pemulihan Kata Sandi Owner
          </h2>
          <p className="mt-1.5 text-center text-xs text-gray-600 leading-relaxed">
            Masukkan email bisnis terdaftar Anda dan buat kata sandi baru untuk memulihkan akses login.
          </p>
        </div>

        {!submitted ? (
          <form className="mt-4 space-y-4" onSubmit={handleDirectReset}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Akun Bisnis Terdaftar
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@bisnis.com"
                  className="appearance-none block w-full pl-10 pr-3.5 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-xs font-medium"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi Baru (Minimal 8 Karakter)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter unik..."
                  className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-xs"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru..."
                  className="appearance-none block w-full pl-10 pr-3.5 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-xs"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8E0E0E] disabled:opacity-50 transition-all shadow-md cursor-pointer mt-2"
            >
              {loading ? "Memproses Pembaruan Password..." : "Simpan Kata Sandi Baru & Pulihkan Akun"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl border bg-green-50 border-green-200 text-green-900 text-left space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Pemulihan Berhasil
                </span>
              </div>
              <p className="text-xs leading-relaxed">{successMessage}</p>
            </div>

            <Link
              href="/login"
              className="w-full flex justify-center py-2.5 px-4 rounded-xl text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Login Sekarang dengan Password Baru →
            </Link>
          </div>
        )}

        <div className="border-t border-gray-100 pt-3 text-center">
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-gray-500">Memuat halaman...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
