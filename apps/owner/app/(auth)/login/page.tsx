/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN LOGIN OWNER (LOGIN PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Antarmuka pengguna (UI) Client Component untuk autentikasi masuk Pemilik Toko (Owner).
 * Menerima masukan email & kata sandi, mengeksekusi sign-in ke auth client, dan me-redirect ke Dashboard.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. INPUT (Baris 38-52)   : User mengetik email & password pada form HTML.
 * 2. SUBMIT (Baris 54-70)  : Tombol "Sign in" memicu fungsi `handleLogin`.
 * 3. PROSES (Baris 58-67)  : Memanggil `authClient.signIn.email({ email, password })`.
 * 4. REDIRECT (Baris 69-72): Jika sukses, me-refresh halaman ke Dashboard utama `/`.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Menggunakan Client Auth  : `apps/owner/lib/authClient.ts`
 * - Diproteksi oleh Middleware: `apps/owner/middleware.ts`
 * - Link ke Pendaftaran     : `apps/owner/app/(auth)/register/page.tsx`
 * 
 * 🛠️ PETUNJUK PEMECAHAN MASALAH (TROUBLESHOOTING):
 * - Jika Klik Login Tidak Ada Respon -> Periksa Baris 58-67 (`authClient.signIn.email`).
 * - Jika Gagal Mengalihkan Halaman  -> Periksa Baris 69-72 (`router.push("/") + router.refresh()`).
 * =========================================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // [BARIS 38-42]: STATE CLIENT UNTUK FORMULIR LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // [BARIS 44-73]: FUNGSI EKSEKUSI LOGIN (HANDLE LOGIN)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggilan API Client ke Better Auth Server
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Gagal login. Periksa email dan password.");
        setLoading(false);
        return;
      }

      toast.success("Login berhasil!");
      // Me-refresh sesi dan me-redirect ke Dashboard /
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat login.");
      setLoading(false);
    }
  };

  // [BARIS 75-150]: STRUKTUR TAMPILAN VISUAL UI (TAILWIND FORM)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Owner Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your business
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#8E0E0E] focus:border-[#8E0E0E] focus:z-10 sm:text-sm"
                placeholder="owner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#8E0E0E] focus:border-[#8E0E0E] focus:z-10 sm:text-sm"
                  placeholder="••••••••"
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8E0E0E] hover:bg-[#9C1B0B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8E0E0E] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">
              Belum punya akun bisnis?{" "}
              <a href="/register" className="font-bold text-[#8E0E0E] hover:underline cursor-pointer">
                Daftar Bisnis Baru
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
