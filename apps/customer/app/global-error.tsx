"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Terjadi Kendala Sistem</h2>
          <p className="text-sm text-stone-600 mb-6">
            Maaf, aplikasi mengalami gangguan sementara. Silakan coba muat ulang halaman.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-sm"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
