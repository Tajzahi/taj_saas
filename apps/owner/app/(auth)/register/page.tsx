/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN PENDAFTARAN OWNER BARU (REGISTER PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Antarmuka pengguna (UI) Client Component untuk pendaftaran Bisnis/Toko Baru milik Pemilik (Owner).
 * Menerima masukan Nama Owner, Nama Toko, Email, & Password, lalu mengeksekusi Server Action `registerOwnerAction`
 * dan otomatis meng-autentikasi (instant sign-in) agar Owner langsung masuk ke Dashboard.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. INPUT (Baris 38-52)   : User mengisi formulir nama lengkap, nama bisnis, email, & password.
 * 2. ACTION (Baris 58-70)  : Memanggil Server Action `registerOwnerAction` untuk membuat Tenant & User di DB.
 * 3. AUTO SIGN-IN (Baris 72-85): Mengeksekusi `authClient.signIn.email` otomatis dengan penanganan retry.
 * 4. REDIRECT (Baris 87-92): Jika sukses, me-refresh halaman langsung ke Dashboard `/`.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Terhubung ke Server Action: `apps/owner/app/actions/authActions.ts` (`registerOwnerAction`)
 * - Terhubung ke Client Auth  : `apps/owner/lib/authClient.ts`
 * - Diproteksi oleh Middleware: `apps/owner/middleware.ts`
 * - Link ke Halaman Login    : `apps/owner/app/(auth)/login/page.tsx`
 * 
 * 🛠️ PETUNJUK PEMECAHAN MASALAH (TROUBLESHOOTING):
 * - Jika Tenant Gagal Dibuat       -> Periksa Baris 58-70 (`registerOwnerAction`).
 * - Jika Pendaftaran Sukses Tapi Tidak Masuk Dashboard -> Periksa Baris 72-85 (Instant Login Auto-retry).
 * =========================================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { registerOwnerAction } from "@/app/actions/authActions";

export default function RegisterPage() {
  const router = useRouter();
  
  // [BARIS 38-46]: STATE CLIENT UNTUK FORMULIR PENDAFTARAN TOKO
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  // [BARIS 48-96]: FUNGSI EKSEKUSI PENDAFTARAN & INSTANT SIGN-IN
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !businessName || !email || !password) {
      toast.error("Harap isi semua kolom pendaftaran.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    try {
      // TAHAP 1: Eksekusi Server Action Pembuatan Tenant Toko & User di DB
      const res = await registerOwnerAction({
        name,
        businessName,
        email,
        password,
      });

      if (!res.success) {
        toast.error(res.error || "Gagal mendaftarkan toko dan akun.");
        return;
      }

      // TAHAP 2: Instant Client-Side Login dengan Auto-Retry (Mencegah jeda propagasi index)
      let loginRes = await authClient.signIn.email({
        email,
        password,
      });

      if (loginRes.error) {
        // Jeda 600ms dan coba sekali lagi jika server index baru dibuat
        await new Promise((resolve) => setTimeout(resolve, 600));
        loginRes = await authClient.signIn.email({
          email,
          password,
        });
      }

      if (loginRes.error) {
        toast.error("Pendaftaran berhasil, silakan masuk dengan akun baru Anda.");
        window.location.href = "/login";
        return;
      }

      // TAHAP 3: Pengalihan Sukses Langsung ke Dashboard /
      toast.success(`Selamat datang! Toko ${res.tenant?.name || ""} berhasil terdaftar.`);
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  // [BARIS 98-190]: STRUKTUR TAMPILAN VISUAL UI PENDAFTARAN (TAILWIND FORM)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Daftar Bisnis Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Buat akun Pemilik Bisnis (Owner) & daftarkan tenant Anda
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap Owner</label>
              <input
                type="text"
                required
                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-sm"
                placeholder="misal: Bambang Wijaya"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Toko / Bisnis F&B</label>
              <input
                type="text"
                required
                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-sm"
                placeholder="misal: Martabak A6 Nyuss"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Utama (Login Owner)</label>
              <input
                type="email"
                required
                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-sm"
                placeholder="owner@bisnis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Akun</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="mt-1 appearance-none block w-full px-3.5 py-2.5 pr-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E0E0E] text-sm"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8E0E0E] disabled:opacity-50 transition-all shadow-md"
          >
            {loading ? "Mendaftarkan..." : "Daftarkan Bisnis Sekarang"}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">
              Sudah memiliki akun?{" "}
              <a href="/login" className="font-bold text-[#8E0E0E] hover:underline cursor-pointer">
                Masuk / Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
