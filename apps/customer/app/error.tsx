"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Masalah</h2>
      <p className="text-gray-600 text-sm mb-6">Maaf, terjadi kendala saat memuat halaman.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-[#8E0E0E] text-white rounded-xl font-bold text-sm hover:bg-[#9C1B0B] transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
