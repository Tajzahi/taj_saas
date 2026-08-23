import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, ChefHat, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { authClient } from "@lib/auth-client";

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  tenantSlug?: string | null;
  businessName?: string | null;
  storeTagline?: string | null;
  storeCity?: string | null;
  logoUrl?: string | null;
}

export default function LoginPage({
  onLogin,
  tenantSlug,
  businessName,
  storeTagline,
  storeCity,
  logoUrl,
}: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [startingCash, setStartingCash] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username / Email dan password wajib diisi.');
      return;
    }
    setIsLoading(true);

    try {
      // Parse starting cash gracefully (default to 0 if left blank)
      const cleanCash = startingCash ? startingCash.replace(/\./g, '').replace(/,/g, '.') : '0';
      const cashAmount = Math.max(0, Number(cleanCash) || 0);

      // Convert username to tenant-scoped synthetic email if not already an email
      let email = username.trim();
      if (!email.includes('@')) {
        const slug = tenantSlug ? tenantSlug.replace(/[^a-z0-9_-]/gi, '') : 'portal';
        email = `${email}@${slug}.taj.saas`;
      }

      // Better Auth Sign In
      let loginRes = await authClient.signIn.email({
        email,
        password,
      });

      // If synthetic email failed and didn't have @ in original input, try legacy @taj.saas fallback
      if (loginRes.error && !username.includes('@')) {
        const legacyEmail = `${username.trim()}@taj.saas`;
        const retryRes = await authClient.signIn.email({
          email: legacyEmail,
          password,
        });
        if (!retryRes.error) {
          loginRes = retryRes;
        }
      }

      if (loginRes.error) {
        throw new Error(loginRes.error.message || 'Email atau password kasir salah.');
      }

      // Open new shift in Neon Database (if no active shift exists)
      await useAdminStore.getState().openShift(cashAmount, username.trim());

      onLogin(username, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Gagal masuk. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #D94708 60%, #E05009 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-5 bg-white" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className="px-5 py-6 sm:px-8 sm:py-8 text-center"
            style={{ background: 'linear-gradient(135deg, #8E0E0E, #C83707)' }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ChefHat className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              {businessName || "Portal Operasional"}
            </h1>
            <p className="text-white/80 text-sm mt-1 font-medium">{storeTagline || "Portal Operasional Kasir & Dapur"}</p>
          </div>

          {/* Form */}
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <h2 className="text-gray-800 font-bold text-lg mb-6 text-center">Masuk ke Sistem</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username / Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: kasir_1 atau kasir@domain.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-gray-800 text-sm transition-colors"
                  style={{ '--tw-ring-color': '#C83707' } as React.CSSProperties}
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-gray-800 text-sm transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Uang Modal Awal Laci
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                  <input
                    type="text"
                    value={startingCash}
                    onChange={(e) => setStartingCash(e.target.value)}
                    placeholder="Contoh: 100.000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-gray-800 text-sm transition-colors font-bold"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  *Diisi jika membuka shift baru. Diabaikan jika shift sedang berjalan.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #9C1B0B, #D13E08)' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    MASUK SEKARANG
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-white/60 text-xs text-center mt-6">
          © {new Date().getFullYear()} {businessName || "TajDigital SaaS"} {storeCity ? `· ${storeCity}` : ""}
        </p>
      </div>
    </div>
  );
}
