"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, KeyRound, Mail, CheckCircle2, ShieldCheck, Lock, Eye, EyeOff, ShieldAlert, Sparkles } from "lucide-react";
import { requestPasswordResetOtpAction, verifyOtpAndResetPasswordAction } from "@/app/actions/authActions";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();

  // Multi-step state: 1 = Request OTP, 2 = Verify OTP & Set New Password, 3 = Completed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // STEP 1: Request 6-digit Cryptographic OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Alamat email wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordResetOtpAction(email);
      if (res.success) {
        toast.success("Kode verifikasi OTP berhasil diterbitkan!");
        setStep(2);
        setResendCooldown(60); // 60s cooldown for resend
      } else {
        toast.error(res.error || "Gagal meminta kode OTP.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan sistem saat meminta kode OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Reset Password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim().replace(/[^0-9]/g, "");

    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error("Kode OTP harus terdiri dari 6 digit angka.");
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
      const res = await verifyOtpAndResetPasswordAction({
        email,
        otp: cleanOtp,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        toast.success("Password akun berhasil diperbarui!");
        setStep(3);
      } else {
        toast.error(res.error || "Kode OTP tidak valid atau salah.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan sistem saat verifikasi OTP.");
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
            {step === 1 && "Masukkan email bisnis terdaftar untuk menerima Kode OTP Verifikasi 6-Digit."}
            {step === 2 && "Masukkan Kode OTP 6-Digit dan buat kata sandi baru untuk akun Anda."}
            {step === 3 && "Kata sandi Anda telah berhasil diperbarui dengan aman."}
          </p>
        </div>

        {/* STEP INDICATOR */}
        {step !== 3 && (
          <div className="flex items-center justify-center gap-2 py-1">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
              step === 1 ? "bg-red-100 text-[#8E0E0E]" : "bg-green-100 text-green-700"
            }`}>
              <span>1. Minta OTP</span>
              {step === 2 && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
            <span className="text-gray-300">→</span>
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              step === 2 ? "bg-red-100 text-[#8E0E0E]" : "bg-gray-100 text-gray-400"
            }`}>
              2. Verifikasi & Sandi Baru
            </div>
          </div>
        )}

        {/* STEP 1: FORM REQUEST OTP */}
        {step === 1 && (
          <form className="mt-4 space-y-4" onSubmit={handleRequestOtp}>
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

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Proteksi Keamanan Berlapis</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Kode OTP rahasia 6-digit bertanda tangan kriptografi akan diterbitkan. Penggantian kata sandi wajib mengonfirmasi kepemilikan email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8E0E0E] disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
              {loading ? "Menerbitkan Kode OTP..." : "Kirim Kode Verifikasi OTP 6-Digit →"}
            </button>
          </form>
        )}

        {/* STEP 2: FORM VERIFY OTP & NEW PASSWORD */}
        {step === 2 && (
          <form className="mt-4 space-y-4" onSubmit={handleVerifyOtpAndReset}>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Email Verifikasi:</span>
                <span className="font-semibold text-gray-800">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#8E0E0E] hover:underline font-semibold cursor-pointer"
              >
                Ganti Email
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Kode OTP 6-Digit
                </label>
                <span className="text-[10px] text-gray-400">Berlaku 15 Menit</span>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Contoh: 849201"
                className="appearance-none block w-full text-center tracking-[0.4em] font-mono text-lg font-bold px-3 py-2 border-2 border-red-200 placeholder-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E]"
              />
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
                  placeholder="Ulangi kata sandi baru..."
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
              {loading ? "Memverifikasi OTP..." : "Verifikasi OTP & Perbarui Kata Sandi"}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleRequestOtp}
                className="text-xs text-gray-500 hover:text-[#8E0E0E] disabled:text-gray-300 disabled:cursor-not-allowed font-medium cursor-pointer"
              >
                {resendCooldown > 0
                  ? `Kirim ulang OTP dalam ${resendCooldown} detik`
                  : "Belum menerima OTP? Kirim Ulang"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-5 pt-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Kata Sandi Berhasil Diperbarui!</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Akun Anda telah diamankan dengan kata sandi baru. Seluruh sesi aktif di perangkat lain telah diputus otomatis demi keamanan.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full flex justify-center py-2.5 px-4 rounded-xl text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Login Sekarang dengan Kata Sandi Baru →
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-gray-500">Memuat sistem autentikasi...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
